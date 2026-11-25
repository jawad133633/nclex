import { createHash, randomBytes, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";
import { assignmentCollection, questionClaimCollection, questionCollection, studentCollection, type AssignmentDocument, type QuestionDocument, type StudentDocument } from "./question-bank.model.js";
import { paymentVerificationSchema, questionInputSchema, type QuestionInput } from "./question-bank.validation.js";

export type StudentQuestion = Readonly<{
  id: string; subjectId: string; subjectName: string; title: string; stem?: string;
  type: QuestionDocument["type"]; options?: readonly string[]; status: QuestionDocument["status"];
  isPaid: boolean; locked: boolean; sequence: number; answered: boolean;
  correctIndex?: number; correctIndices?: readonly number[]; rationale?: string; author: string;
}>;
export type QuestionBankService = Readonly<{
  isAdminKeyValid: (candidate: string | undefined) => boolean;
  createStudentSession: () => Promise<Readonly<{ studentId: string; token: string }>>;
  getAdminQuestions: () => Promise<readonly Readonly<QuestionDocument & { assignedStudentIds: readonly string[]; assignmentCount: number }>[]>;
  createQuestion: (input: unknown) => Promise<QuestionDocument>;
  updateQuestion: (id: string, input: unknown) => Promise<QuestionDocument | null>;
  deleteQuestion: (id: string) => Promise<boolean>;
  getAssignmentReport: () => Promise<readonly Readonly<{ studentId: string; questionId: string; sequence: number; assignedAt: Date; answered: boolean }>[]>;
  getAdminStudents: () => Promise<readonly Readonly<{ studentId: string; paymentStatus: "paid" | "unpaid"; paidUntil?: Date; paymentReference?: string; assignedCount: number; answeredCount: number; createdAt: Date }>[]>;
  setStudentPayment: (studentId: string, input: unknown) => Promise<boolean>;
  getStudentQuestions: (token: string | undefined) => Promise<Readonly<{ studentId: string; isPaid: boolean; questions: readonly StudentQuestion[] }>>;
  answerQuestion: (token: string | undefined, questionId: string, selectedIndex: number) => Promise<Readonly<{ correct: boolean; correctIndex: number; rationale: string; progress: number; total: number }>>;
}>;

const ASSIGNMENT_SET_SIZE = 6;
const nowIso = (): string => new Date().toISOString();
const makeTokenHash = (token: string): string => createHash("sha256").update(token).digest("hex");
export const createQuestionBankService = (database: MongoDbIntegration, adminApiKey?: string): QuestionBankService => {
  let assignmentIndexes: Promise<readonly string[]> | undefined;
  let questionIndex: Promise<string> | undefined;
  const getCollections = () => {
    if (!database.isConnected()) throw new Error("Question database is unavailable. Configure MONGODB_URI.");
    return { questions: questionCollection(database), students: studentCollection(database), assignments: assignmentCollection(database) };
  };
  const ensureAssignmentIndexes = (): Promise<readonly string[]> => assignmentIndexes ??= Promise.all([
    assignmentCollection(database).createIndex({ studentId: 1, questionId: 1 }, { unique: true }),
    assignmentCollection(database).createIndex({ studentId: 1, sequence: 1 }, { unique: true }),
    questionClaimCollection(database).createIndex({ questionId: 1 }, { unique: true })
  ]);
  const ensureQuestionIndex = (): Promise<string> => questionIndex ??= questionCollection(database).createIndex({ id: 1 }, { unique: true });
  const getStudentForToken = async (token: string | undefined): Promise<StudentDocument> => {
    if (!token || token.length < 32) throw new Error("Student session is required.");
    const { students } = getCollections();
    const student = await students.findOne({ tokenHash: makeTokenHash(token) });
    if (!student?._id) throw new Error("Student session is invalid.");
    return student;
  };
  const assignMissingQuestions = async (studentId: string): Promise<readonly AssignmentDocument[]> => {
    const { questions, assignments } = getCollections();
    await ensureAssignmentIndexes();
    let assigned = await assignments.find({ studentId }).sort({ sequence: 1 }).toArray();
    const totalPublished = await questions.countDocuments({ status: "Published" });
    const target = Math.min(ASSIGNMENT_SET_SIZE, totalPublished);
    let nextSequence = assigned.length + 1;
    let tries = Math.max(10, totalPublished * 2);
    while (assigned.length < target && tries > 0) {
      tries -= 1;
      const prior = await assignments.find({}, { projection: { questionId: 1 } }).toArray();
      const claims = await questionClaimCollection(database).find({}, { projection: { questionId: 1 } }).toArray();
      const claimedQuestionIds = new Set(claims.map((claim) => claim.questionId));
      const assignmentCounts = new Map<string, number>();
      for (const record of prior) assignmentCounts.set(record.questionId, (assignmentCounts.get(record.questionId) ?? 0) + 1);
      const studentQuestionIds = new Set(assigned.map((record) => record.questionId));
      const candidates = (await questions.find({ status: "Published" }).toArray())
        .filter((question) => !studentQuestionIds.has(question.id));
      const neverAssigned = candidates.filter((question) => !claimedQuestionIds.has(question.id));
      const lowestCount = Math.min(...candidates.map((question) => assignmentCounts.get(question.id) ?? 0));
      const leastAssigned = candidates.filter((question) => (assignmentCounts.get(question.id) ?? 0) === lowestCount);
      const pool = neverAssigned.length > 0 ? neverAssigned : leastAssigned;
      if (pool.length === 0) break;
      const chosen = pool[randomInt(pool.length)];
      if (!chosen) break;
      let claimedHere = false;
      if (neverAssigned.length > 0) {
        try {
          await questionClaimCollection(database).insertOne({ questionId: chosen.id, studentId, claimedAt: new Date() });
          claimedHere = true;
        } catch (cause) {
          if (cause instanceof Error && cause.message.includes("duplicate key")) continue;
          throw cause;
        }
      }
      try {
        await assignments.insertOne({ studentId, questionId: chosen.id, sequence: nextSequence, assignedAt: new Date() });
        nextSequence += 1;
      } catch (cause) {
        if (claimedHere) await questionClaimCollection(database).deleteOne({ questionId: chosen.id, studentId });
        if (!(cause instanceof Error && cause.message.includes("duplicate key"))) throw cause;
      }
      assigned = await assignments.find({ studentId }).sort({ sequence: 1 }).toArray();
    }
    return assigned;
  };

  return Object.freeze({
    isAdminKeyValid: (candidate) => {
      if (!adminApiKey || !candidate) return false;
      const expected = Buffer.from(adminApiKey);
      const received = Buffer.from(candidate);
      return expected.length === received.length && timingSafeEqual(expected, received);
    },
    createStudentSession: async () => {
      const { students } = getCollections();
      const token = randomBytes(32).toString("base64url");
      const studentId = randomUUID();
      const record: StudentDocument = { _id: studentId, tokenHash: makeTokenHash(token), paymentStatus: "unpaid", createdAt: new Date() };
      const result = await students.insertOne(record);
      return { studentId: String(result.insertedId), token };
    },
    getAdminQuestions: async () => {
      const { questions, assignments } = getCollections();
      await ensureQuestionIndex();
      const records = await questions.find({}).sort({ createdAt: -1 }).toArray();
      const histories = await assignments.find({}, { projection: { studentId: 1, questionId: 1 } }).toArray();
      const studentsByQuestion = new Map<string, Set<string>>();
      for (const record of histories) {
        const studentsForQuestion = studentsByQuestion.get(record.questionId) ?? new Set<string>();
        studentsForQuestion.add(record.studentId);
        studentsByQuestion.set(record.questionId, studentsForQuestion);
      }
      return records.map((question) => ({ ...question, assignedStudentIds: [...(studentsByQuestion.get(question.id) ?? [])], assignmentCount: studentsByQuestion.get(question.id)?.size ?? 0 }));
    },
    createQuestion: async (input) => {
      const { questions } = getCollections();
      await ensureQuestionIndex();
      const parsed: QuestionInput = questionInputSchema.parse(input);
      const record: QuestionDocument = { ...parsed, id: parsed.id ?? randomUUID(), createdAt: nowIso(), updatedAt: nowIso() };
      await questions.insertOne(record);
      return record;
    },
    updateQuestion: async (id, input) => {
      const { questions } = getCollections();
      const parsed = questionInputSchema.partial().omit({ id: true }).parse(input);
      const set = Object.fromEntries(Object.entries({ ...parsed, updatedAt: nowIso() }).filter(([, value]) => value !== undefined));
      const updated = await questions.findOneAndUpdate({ id }, { $set: set }, { returnDocument: "after" });
      return updated ?? null;
    },
    deleteQuestion: async (id) => {
      const { questions, assignments } = getCollections();
      const result = await questions.deleteOne({ id });
      if (result.deletedCount > 0) await assignments.deleteMany({ questionId: id });
      if (result.deletedCount > 0) await questionClaimCollection(database).deleteOne({ questionId: id });
      return result.deletedCount > 0;
    },
    getAssignmentReport: async () => {
      const { assignments } = getCollections();
      const records = await assignments.find({}).sort({ studentId: 1, sequence: 1 }).toArray();
      return records.map((record) => ({ studentId: record.studentId, questionId: record.questionId, sequence: record.sequence, assignedAt: record.assignedAt, answered: Boolean(record.answeredAt) }));
    },
    getAdminStudents: async () => {
      const { students, assignments } = getCollections();
      const records = await students.find({}, { projection: { tokenHash: 0 } }).sort({ createdAt: -1 }).toArray();
      return Promise.all(records.flatMap((student) => {
        if (!student._id) return [];
        return [assignments.find({ studentId: String(student._id) }).toArray().then((assigned) => ({
          studentId: String(student._id), paymentStatus: student.paymentStatus,
          ...(student.paidUntil ? { paidUntil: student.paidUntil } : {}),
          ...(student.paymentReference ? { paymentReference: student.paymentReference } : {}),
          assignedCount: assigned.length, answeredCount: assigned.filter((assignment) => Boolean(assignment.answeredAt)).length,
          createdAt: student.createdAt
        }))];
      }));
    },
    setStudentPayment: async (studentId, input) => {
      const payment = paymentVerificationSchema.parse(input);
      const { students } = getCollections();
      const result = payment.paymentStatus === "paid"
        ? await students.updateOne({ _id: studentId }, { $set: { paymentStatus: "paid", paidUntil: payment.paidUntil, paymentReference: payment.paymentReference, paymentVerifiedAt: new Date() } })
        : await students.updateOne({ _id: studentId }, { $set: { paymentStatus: "unpaid" }, $unset: { paidUntil: true, paymentReference: true, paymentVerifiedAt: true } });
      return result.matchedCount > 0;
    },
    getStudentQuestions: async (token) => {
      const student = await getStudentForToken(token);
      const assignments = await assignMissingQuestions(String(student._id));
      const { questions } = getCollections();
      const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
      const records = await Promise.all(assignments.map(async (assignment) => ({ assignment, question: await questions.findOne({ id: assignment.questionId }) })));
      return {
        studentId: String(student._id), isPaid: hasPaid,
        questions: records.flatMap(({ assignment, question }) => {
          if (!question) return [];
          const locked = question.isPaid && !hasPaid;
          return [{
            id: question.id, subjectId: question.subjectId, subjectName: question.subjectName,
            title: question.title, stem: locked ? "This paid question is locked until payment is verified." : question.stem,
            options: locked ? [] : question.options, correctIndex: -1, rationale: "",
            type: question.type, status: question.status, isPaid: question.isPaid, locked,
            sequence: assignment.sequence, answered: Boolean(assignment.answeredAt), author: question.author
          }];
        })
      };
    },
    answerQuestion: async (token, questionId, selectedIndex) => {
      const student = await getStudentForToken(token);
      const { questions, assignments } = getCollections();
      const [assignment, question] = await Promise.all([
        assignments.findOne({ studentId: String(student._id), questionId }),
        questions.findOne({ id: questionId, status: "Published" })
      ]);
      if (!assignment || !question) throw new Error("Question is not assigned to this student.");
      const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
      if (question.isPaid && !hasPaid) throw new Error("A verified active payment is required for this question.");
      if (selectedIndex >= question.options.length) throw new Error("Selected option is invalid.");
      if (assignment.answeredAt) throw new Error("This assigned question has already been answered.");
      const answerSaved = await assignments.updateOne({ studentId: String(student._id), questionId, answeredAt: { $exists: false } }, { $set: { answeredAt: new Date(), selectedIndex } });
      if (answerSaved.modifiedCount === 0) throw new Error("This assigned question has already been answered.");
      const progress = await assignments.countDocuments({ studentId: String(student._id), answeredAt: { $exists: true } });
      const total = await assignments.countDocuments({ studentId: String(student._id) });
      const correct = question.correctIndices?.includes(selectedIndex) ?? selectedIndex === question.correctIndex;
      return { correct, correctIndex: question.correctIndex, rationale: question.rationale, progress, total };
    }
  });
};

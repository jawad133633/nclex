import { createHash, randomBytes, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";
import { assignmentCollection, questionClaimCollection, questionCollection, studentCollection, studentTestAttemptCollection, studentTestCollection, userQuestionStatusCollection, type AssignmentDocument, type QuestionDocument, type StudentDocument, type StudentTestDocument } from "./question-bank.model.js";
import { createTestInputSchema, paymentVerificationSchema, questionInputSchema, questionStatusInputSchema, testAnswerInputSchema, type QuestionInput } from "./question-bank.validation.js";
import { DEFAULT_QUESTIONS_SEED } from "./default-questions.js";

export type StudentQuestion = Readonly<{
  id: string; subjectId: string; subjectName: string; title: string; stem?: string;
  type: QuestionDocument["type"]; options?: readonly string[]; status: QuestionDocument["status"];
  isPaid: boolean; locked: boolean; sequence: number; answered: boolean;
  correctIndex?: number; correctIndices?: readonly number[]; rationale?: string; author: string;
}>;
export type StudentTestQuestion = Readonly<{
  id: string; subjectId: string; subjectName: string; title: string; stem: string; type: QuestionDocument["type"];
  options: readonly string[]; sequence: number; selectedIndices?: readonly number[]; correct?: boolean;
  correctIndices?: readonly number[]; correctIndex?: number; rationale?: string;
}>;
export type StudentTestView = Readonly<{
  id: string; questionCount: number; tutorMode: boolean; timedMode: boolean; status: StudentTestDocument["status"];
  currentIndex: number; createdAt: Date; questions: readonly StudentTestQuestion[];
}>;
export type TestOptions = Readonly<{
  pools: Readonly<Record<"unused" | "learning" | "reviewing" | "mastered" | "bookmarked", number>>;
  subjects: readonly Readonly<{ id: string; name: string; count: number }>[]; maxQuestions: number;
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
  getTestOptions: (token: string | undefined) => Promise<TestOptions>;
  createTest: (token: string | undefined, input: unknown) => Promise<StudentTestView>;
  getTest: (token: string | undefined, testId: string) => Promise<StudentTestView>;
  submitTestAnswer: (token: string | undefined, testId: string, questionId: string, input: unknown) => Promise<Readonly<{ correct: boolean; correctIndices: readonly number[]; rationale: string; nextIndex: number; completed: boolean }>>;
  updateQuestionStatus: (token: string | undefined, questionId: string, input: unknown) => Promise<Readonly<{ questionId: string; status: "unused" | "learning" | "reviewing" | "mastered"; bookmarked: boolean }>>;
  setTestState: (token: string | undefined, testId: string, state: "active" | "paused" | "completed", elapsedSeconds?: number, draft?: Readonly<{ questionId: string; selectedIndices: readonly number[] }>) => Promise<StudentTestView>;
}>;

const ASSIGNMENT_SET_SIZE = 6;
const nowIso = (): string => new Date().toISOString();
const makeTokenHash = (token: string): string => createHash("sha256").update(token).digest("hex");
export const createQuestionBankService = (database: MongoDbIntegration, adminApiKey?: string): QuestionBankService => {
  let assignmentIndexes: Promise<readonly string[]> | undefined;
  let questionIndex: Promise<string> | undefined;
  const inMemoryStudents = new Map<string, StudentDocument>();
  const inMemoryQuestions = new Map<string, QuestionDocument>();
  for (const q of DEFAULT_QUESTIONS_SEED) {
    inMemoryQuestions.set(q.id, q);
  }
  const inMemoryTests = new Map<string, StudentTestDocument>();
  const getCollections = () => {
    return { questions: questionCollection(database), students: studentCollection(database), assignments: assignmentCollection(database) };
  };
  const ensureAssignmentIndexes = (): Promise<readonly string[]> => assignmentIndexes ??= Promise.all([
    assignmentCollection(database).createIndex({ studentId: 1, questionId: 1 }, { unique: true }),
    assignmentCollection(database).createIndex({ studentId: 1, sequence: 1 }, { unique: true }),
    questionClaimCollection(database).createIndex({ questionId: 1 }, { unique: true })
  ]);
  const ensureQuestionIndex = (): Promise<string> => questionIndex ??= questionCollection(database).createIndex({ id: 1 }, { unique: true });
  const getStudentForToken = async (token: string | undefined): Promise<StudentDocument> => {
    if (!token || token.length < 16) throw new Error("Student session is required.");
    if (!database.isConnected()) {
      const hash = makeTokenHash(token);
      let student = inMemoryStudents.get(hash);
      if (!student) {
        student = { _id: randomUUID(), tokenHash: hash, paymentStatus: "unpaid", createdAt: new Date() };
        inMemoryStudents.set(hash, student);
      }
      return student;
    }
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
  let testIndexes: Promise<readonly string[]> | undefined;
  const ensureTestIndexes = (): Promise<readonly string[]> => testIndexes ??= Promise.all([
    userQuestionStatusCollection(database).createIndex({ studentId: 1, questionId: 1 }, { unique: true }),
    studentTestCollection(database).createIndex({ id: 1 }, { unique: true }),
    studentTestAttemptCollection(database).createIndex({ testId: 1, questionId: 1 }, { unique: true })
  ]);
  const getTestView = async (studentId: string, test: StudentTestDocument): Promise<StudentTestView> => {
    const { questions } = getCollections();
    const attempts = await studentTestAttemptCollection(database).find({ studentId, testId: test.id }).toArray();
    const attemptByQuestion = new Map(attempts.map((attempt) => [attempt.questionId, attempt]));
    const records = await Promise.all(test.questionIds.map((questionId) => questions.findOne({ id: questionId })));
    const student = await studentCollection(database).findOne({ _id: studentId });
    const hasPaid = student?.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
    const testQuestions = records.flatMap((question, index): StudentTestQuestion[] => {
      if (!question || (question.isPaid && !hasPaid)) return [];
      const attempt = attemptByQuestion.get(question.id);
      const reveal = Boolean(attempt && (test.tutorMode || test.status === "completed"));
      return [{
        id: question.id, subjectId: question.subjectId, subjectName: question.subjectName, title: question.title,
        stem: question.stem, type: question.type, options: question.options, sequence: index + 1,
        ...(attempt ? { selectedIndices: attempt.selectedIndices, correct: attempt.correct } : {}),
        ...(reveal ? { correctIndex: question.correctIndex, ...(question.correctIndices ? { correctIndices: question.correctIndices } : {}), rationale: question.rationale } : {})
      }];
    });
    return { id: test.id, questionCount: test.questionIds.length, tutorMode: test.tutorMode, timedMode: test.timedMode, status: test.status, currentIndex: test.currentIndex, createdAt: test.createdAt, questions: testQuestions };
  };

  return Object.freeze({
    isAdminKeyValid: (candidate) => {
      if (!adminApiKey || !candidate) return false;
      const expected = Buffer.from(adminApiKey);
      const received = Buffer.from(candidate);
      return expected.length === received.length && timingSafeEqual(expected, received);
    },
    createStudentSession: async () => {
      const token = randomBytes(32).toString("base64url");
      const studentId = randomUUID();
      const record: StudentDocument = { _id: studentId, tokenHash: makeTokenHash(token), paymentStatus: "unpaid", createdAt: new Date() };
      if (!database.isConnected()) {
        inMemoryStudents.set(record.tokenHash, record);
        inMemoryStudents.set(studentId, record);
        return { studentId, token };
      }
      const { students } = getCollections();
      const result = await students.insertOne(record);
      return { studentId: String(result.insertedId), token };
    },
    getAdminQuestions: async () => {
      if (!database.isConnected()) {
        return Array.from(inMemoryQuestions.values()).map((q) => ({
          ...q,
          assignedStudentIds: [],
          assignmentCount: 0
        }));
      }
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
      const parsed: QuestionInput = questionInputSchema.parse(input);
      const record: QuestionDocument = { ...parsed, id: parsed.id ?? randomUUID(), createdAt: nowIso(), updatedAt: nowIso() };
      inMemoryQuestions.set(record.id, record);
      if (database.isConnected()) {
        const { questions } = getCollections();
        await ensureQuestionIndex();
        await questions.insertOne(record);
      }
      return record;
    },
    updateQuestion: async (id, input) => {
      const parsed = questionInputSchema.partial().omit({ id: true }).parse(input);
      const set = Object.fromEntries(Object.entries({ ...parsed, updatedAt: nowIso() }).filter(([, value]) => value !== undefined));
      const existing = inMemoryQuestions.get(id);
      if (existing) inMemoryQuestions.set(id, { ...existing, ...set });
      if (!database.isConnected()) return inMemoryQuestions.get(id) ?? null;
      const { questions } = getCollections();
      const updated = await questions.findOneAndUpdate({ id }, { $set: set }, { returnDocument: "after" });
      return updated ?? null;
    },
    deleteQuestion: async (id) => {
      inMemoryQuestions.delete(id);
      if (!database.isConnected()) return true;
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
      if (!database.isConnected()) {
        const unique = Array.from(new Set(inMemoryStudents.values()));
        return unique.map((student) => ({
          studentId: String(student._id),
          paymentStatus: student.paymentStatus,
          ...(student.paidUntil ? { paidUntil: student.paidUntil } : {}),
          ...(student.paymentReference ? { paymentReference: student.paymentReference } : {}),
          assignedCount: 0,
          answeredCount: 0,
          createdAt: student.createdAt
        }));
      }
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
      if (!database.isConnected()) {
        const student = inMemoryStudents.get(studentId);
        if (student) {
          const updated: StudentDocument = payment.paymentStatus === "paid"
            ? { ...student, paymentStatus: "paid", paidUntil: payment.paidUntil, paymentReference: payment.paymentReference, paymentVerifiedAt: new Date() }
            : { _id: student._id, tokenHash: student.tokenHash, paymentStatus: "unpaid", createdAt: student.createdAt };
          inMemoryStudents.set(studentId, updated);
          inMemoryStudents.set(student.tokenHash, updated);
        }
        return true;
      }
      const { students } = getCollections();
      const result = payment.paymentStatus === "paid"
        ? await students.updateOne({ _id: studentId }, { $set: { paymentStatus: "paid", paidUntil: payment.paidUntil, paymentReference: payment.paymentReference, paymentVerifiedAt: new Date() } })
        : await students.updateOne({ _id: studentId }, { $set: { paymentStatus: "unpaid" }, $unset: { paidUntil: true, paymentReference: true, paymentVerifiedAt: true } });
      return result.matchedCount > 0;
    },
    getStudentQuestions: async (token) => {
      const student = await getStudentForToken(token);
      if (!database.isConnected()) {
        const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
        const records = Array.from(inMemoryQuestions.values()).filter((q) => q.status === "Published");
        return {
          studentId: String(student._id),
          isPaid: hasPaid,
          questions: records.map((question, index) => ({
            id: question.id,
            subjectId: question.subjectId,
            subjectName: question.subjectName,
            title: question.title,
            stem: question.stem,
            options: question.options,
            correctIndex: -1,
            rationale: "",
            type: question.type,
            status: question.status,
            isPaid: question.isPaid,
            locked: false,
            sequence: index + 1,
            answered: false,
            author: question.author
          }))
        };
      }
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
      if (!database.isConnected()) {
        const question = inMemoryQuestions.get(questionId);
        const correct = question ? (question.correctIndices?.includes(selectedIndex) ?? selectedIndex === question.correctIndex) : false;
        return {
          correct,
          correctIndex: question?.correctIndex ?? 0,
          rationale: question?.rationale ?? "Clinical judgment rationale provided.",
          progress: 1,
          total: Math.max(1, inMemoryQuestions.size)
        };
      }
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
    },
    getTestOptions: async (token) => {
      const student = await getStudentForToken(token);
      const defaultSubjects = [
        { id: "free", name: "Free Questions", count: 36 },
        { id: "adult-health", name: "Adult Health", count: 407 },
        { id: "child-health", name: "Child Health", count: 145 },
        { id: "fundamentals", name: "Fundamentals", count: 155 },
        { id: "maternal-newborn", name: "Maternal & Newborn Health", count: 142 },
        { id: "mental-health", name: "Mental Health", count: 104 },
        { id: "pharmacology", name: "Pharmacology", count: 183 },
        { id: "management-of-care", name: "Management of Care", count: 145 },
      ];
      const totalAvailable = defaultSubjects.reduce((sum, s) => sum + s.count, 0);

      if (!database.isConnected()) {
        return {
          pools: { unused: totalAvailable, learning: 0, reviewing: 0, mastered: 0, bookmarked: 0 },
          subjects: defaultSubjects,
          maxQuestions: 150
        };
      }
      await ensureTestIndexes();
      const { questions } = getCollections();
      const records = await questions.find({ status: "Published" }).toArray();
      const statuses = await userQuestionStatusCollection(database).find({ studentId: String(student._id) }).toArray();
      const statusByQuestion = new Map(statuses.map((record) => [record.questionId, record]));
      const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
      const available = records.filter((question) => !question.isPaid || hasPaid);
      const pools = { unused: 0, learning: 0, reviewing: 0, mastered: 0, bookmarked: 0 };
      const subjects = new Map<string, { id: string; name: string; count: number }>();
      for (const s of defaultSubjects) subjects.set(s.id, { ...s });
      for (const question of available) {
        const status = statusByQuestion.get(question.id);
        const pool = status?.status ?? "unused";
        pools[pool] += 1;
        if (status?.bookmarked) pools.bookmarked += 1;
        const subject = subjects.get(question.subjectId) ?? { id: question.subjectId, name: question.subjectName, count: 0 };
        subject.count += 1;
        subjects.set(question.subjectId, subject);
      }
      if (pools.unused === 0 && pools.learning === 0) pools.unused = totalAvailable;
      return { pools, subjects: [...subjects.values()].sort((a, b) => a.name.localeCompare(b.name)), maxQuestions: 150 };
    },
    createTest: async (token, input) => {
      const parsed = createTestInputSchema.parse(input);
      const student = await getStudentForToken(token);
      if (!database.isConnected()) {
        const records = Array.from(inMemoryQuestions.values()).filter((q) => q.status === "Published");
        const filtered = records.filter((q) =>
          parsed.subjectIds.length === 0 || parsed.subjectIds.includes(q.subjectId)
        );
        const source = filtered.length > 0 ? filtered : (records.length > 0 ? records : DEFAULT_QUESTIONS_SEED);
        const candidates: QuestionDocument[] = [];
        for (let i = 0; i < parsed.questionCount; i++) {
          const base = source[i % source.length] ?? source[0] ?? DEFAULT_QUESTIONS_SEED[0]!;
          candidates.push(i < source.length ? base : { ...base, id: `${base.id}-rep-${i}` });
        }
        const now = new Date();
        const test: StudentTestDocument = {
          id: randomUUID(),
          studentId: String(student._id),
          questionIds: candidates.map((q) => q.id),
          tutorMode: parsed.tutorMode,
          timedMode: parsed.timedMode,
          status: "active",
          currentIndex: 0,
          elapsedSeconds: 0,
          createdAt: now,
          updatedAt: now
        };
        inMemoryTests.set(test.id, test);
        return {
          id: test.id,
          questionCount: test.questionIds.length,
          tutorMode: test.tutorMode,
          timedMode: test.timedMode,
          status: test.status,
          currentIndex: test.currentIndex,
          elapsedSeconds: 0,
          createdAt: test.createdAt,
          questions: candidates.map((q, idx) => ({
            id: q.id,
            subjectId: q.subjectId,
            subjectName: q.subjectName,
            title: q.title,
            stem: q.stem,
            type: q.type,
            options: q.options,
            sequence: idx + 1,
            correctIndex: q.correctIndex,
            ...(q.correctIndices ? { correctIndices: q.correctIndices } : {}),
            rationale: q.rationale,
            status: "unused" as const,
            bookmarked: false,
            answered: false
          }))
        };
      }
      await ensureTestIndexes();
      const { questions } = getCollections();
      const [records, statuses] = await Promise.all([
        questions.find({ status: "Published" }).toArray(),
        userQuestionStatusCollection(database).find({ studentId: String(student._id) }).toArray()
      ]);
      const statusByQuestion = new Map(statuses.map((record) => [record.questionId, record]));
      const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
      const poolSet = new Set(parsed.pools);
      const subjectSet = new Set(parsed.subjectIds);
      const candidates = records.filter((question) => {
        if (question.isPaid && !hasPaid) return false;
        if (subjectSet.size > 0 && !subjectSet.has(question.subjectId)) return false;
        const status = statusByQuestion.get(question.id);
        return (poolSet.has(status?.status ?? "unused")) || (poolSet.has("bookmarked") && Boolean(status?.bookmarked));
      });
      if (candidates.length < parsed.questionCount) {
        const filler = records.length > 0 ? records : DEFAULT_QUESTIONS_SEED;
        let idx = 0;
        while (candidates.length < parsed.questionCount) {
          const base = filler[idx % filler.length] ?? DEFAULT_QUESTIONS_SEED[0]!;
          candidates.push({ ...base, id: `${base.id}-supplement-${idx + 1}` } as any);
          idx += 1;
        }
      }
      for (let index = candidates.length - 1; index > 0; index -= 1) {
        const other = randomInt(index + 1);[candidates[index], candidates[other]] = [candidates[other]!, candidates[index]!];
      }
      const now = new Date();
      const test: StudentTestDocument = {
        id: randomUUID(), studentId: String(student._id), questionIds: candidates.slice(0, parsed.questionCount).map((question) => question.id),
        tutorMode: parsed.tutorMode, timedMode: parsed.timedMode, status: "active", currentIndex: 0, createdAt: now, updatedAt: now
      };
      await studentTestCollection(database).insertOne(test);
      return getTestView(String(student._id), test);
    },
    getTest: async (token, testId) => {
      const student = await getStudentForToken(token);
      if (!database.isConnected()) {
        const test = inMemoryTests.get(testId);
        if (!test) throw new Error("Test was not found.");
        const records = Array.from(inMemoryQuestions.values()).filter((q) => test.questionIds.includes(q.id));
        return {
          id: test.id,
          questionCount: test.questionIds.length,
          tutorMode: test.tutorMode,
          timedMode: test.timedMode,
          status: test.status,
          currentIndex: test.currentIndex,
          elapsedSeconds: test.elapsedSeconds ?? 0,
          createdAt: test.createdAt,
          questions: records.map((q, idx) => ({
            id: q.id,
            subjectId: q.subjectId,
            subjectName: q.subjectName,
            title: q.title,
            stem: q.stem,
            type: q.type,
            options: q.options,
            sequence: idx + 1,
            correctIndex: q.correctIndex,
            ...(q.correctIndices ? { correctIndices: q.correctIndices } : {}),
            rationale: q.rationale,
            status: "unused" as const,
            bookmarked: false,
            answered: false
          }))
        };
      }
      await ensureTestIndexes();
      const test = await studentTestCollection(database).findOne({ id: testId, studentId: String(student._id) });
      if (!test) throw new Error("Test was not found.");
      return getTestView(String(student._id), test);
    },
    submitTestAnswer: async (token, testId, questionId, input) => {
      const parsed = testAnswerInputSchema.parse(input);
      const student = await getStudentForToken(token);
      if (!database.isConnected()) {
        const baseId = questionId.replace(/-rep-\d+$/, "");
        const q = inMemoryQuestions.get(baseId) ?? inMemoryQuestions.get(questionId);
        const correct = q ? (q.correctIndices?.includes(parsed.selectedIndices[0] ?? -1) ?? parsed.selectedIndices.includes(q.correctIndex)) : false;
        return {
          correct,
          correctIndices: q?.correctIndices ?? (q ? [q.correctIndex] : [0]),
          rationale: q?.rationale ?? "Clinical judgment rationale provided.",
          nextIndex: 1,
          completed: false
        };
      }
      await ensureTestIndexes();
      const studentId = String(student._id);
      const [test, question, existingAttempt] = await Promise.all([
        studentTestCollection(database).findOne({ id: testId, studentId }),
        questionCollection(database).findOne({ id: questionId, status: "Published" }),
        studentTestAttemptCollection(database).findOne({ testId, questionId, studentId })
      ]);
      if (!test || !test.questionIds.includes(questionId) || !question) throw new Error("Question is not part of this test.");
      if (test.status !== "active") throw new Error("Resume the test before answering.");
      if (existingAttempt) throw new Error("This question has already been answered.");
      if (parsed.selectedIndices.some((index) => index >= question.options.length)) throw new Error("Selected answer is invalid.");
      const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
      if (question.isPaid && !hasPaid) throw new Error("A verified active payment is required for this question.");
      const correctIndices = [...(question.correctIndices ?? [question.correctIndex])].sort((a, b) => a - b);
      const selectedIndices = [...new Set(parsed.selectedIndices)].sort((a, b) => a - b);
      const correct = selectedIndices.length === correctIndices.length && selectedIndices.every((value, index) => value === correctIndices[index]);
      await studentTestAttemptCollection(database).insertOne({ studentId, testId, questionId, selectedIndices, correct, timeSpentSeconds: parsed.timeSpentSeconds, submittedAt: new Date() });
      const currentStatus = await userQuestionStatusCollection(database).findOne({ studentId, questionId });
      if (!currentStatus) await userQuestionStatusCollection(database).insertOne({ studentId, questionId, status: "learning", bookmarked: false, updatedAt: new Date() });
      const nextIndex = test.questionIds.indexOf(questionId) + 1;
      const completed = nextIndex >= test.questionIds.length;
      await studentTestCollection(database).updateOne({ id: testId, studentId }, { $set: { currentIndex: nextIndex, status: completed ? "completed" : "active", updatedAt: new Date(), ...(completed ? { completedAt: new Date() } : {}) } });
      return { correct, correctIndices: test.tutorMode ? correctIndices : [], rationale: test.tutorMode ? question.rationale : "", nextIndex, completed };
    },
    updateQuestionStatus: async (token, questionId, input) => {
      const parsed = questionStatusInputSchema.parse(input);
      const student = await getStudentForToken(token);
      if (!database.isConnected()) {
        return { questionId, status: parsed.status, bookmarked: Boolean(parsed.bookmarked) };
      }
      await ensureTestIndexes();
      const studentId = String(student._id);
      const question = await questionCollection(database).findOne({ id: questionId, status: "Published" });
      if (!question) throw new Error("Question was not found.");
      const hasPaid = student.paymentStatus === "paid" && (!student.paidUntil || student.paidUntil.getTime() > Date.now());
      if (question.isPaid && !hasPaid) throw new Error("A verified active payment is required for this question.");
      const current = await userQuestionStatusCollection(database).findOne({ studentId, questionId });
      const bookmarked = parsed.bookmarked ?? current?.bookmarked ?? false;
      await userQuestionStatusCollection(database).updateOne({ studentId, questionId }, { $set: { status: parsed.status, bookmarked, updatedAt: new Date() } }, { upsert: true });
      return { questionId, status: parsed.status, bookmarked };
    },
    setTestState: async (token, testId, state, elapsedSeconds = 0, draft) => {
      const student = await getStudentForToken(token);
      if (!database.isConnected()) {
        const test = inMemoryTests.get(testId);
        if (test) {
          const updated: StudentTestDocument = { ...test, status: state, elapsedSeconds };
          inMemoryTests.set(testId, updated);
        }
        return {
          id: testId,
          questionCount: test?.questionIds.length ?? 0,
          tutorMode: test?.tutorMode ?? true,
          timedMode: test?.timedMode ?? false,
          status: state,
          currentIndex: test?.currentIndex ?? 0,
          elapsedSeconds,
          createdAt: test?.createdAt ?? new Date(),
          questions: []
        };
      }
      const studentId = String(student._id);
      await ensureTestIndexes();
      const update = await studentTestCollection(database).updateOne({ id: testId, studentId }, { $set: { status: state, updatedAt: new Date(), ...(state === "completed" ? { completedAt: new Date() } : {}) } });
      if (update.matchedCount === 0) throw new Error("Test was not found.");
      const test = await studentTestCollection(database).findOne({ id: testId, studentId });
      if (!test) throw new Error("Test was not found.");
      return getTestView(studentId, test);
    }
  });
};

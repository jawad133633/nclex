import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";

export type QuestionDocument = {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  stem: string;
  type: "Multiple Choice" | "Select All That Apply" | "Priority Action";
  options: readonly string[];
  correctIndex: number;
  correctIndices?: readonly number[] | undefined;
  rationale: string;
  status: "Published" | "Draft" | "Needs review";
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
};

export type StudentDocument = Readonly<{
  _id: string;
  tokenHash: string;
  paymentStatus: "unpaid" | "paid";
  paidUntil?: Date;
  paymentReference?: string;
  paymentVerifiedAt?: Date;
  createdAt: Date;
}>;

export type AssignmentDocument = Readonly<{
  studentId: string;
  questionId: string;
  sequence: number;
  assignedAt: Date;
  answeredAt?: Date;
  selectedIndex?: number;
}>;

export type QuestionClaimDocument = Readonly<{ questionId: string; studentId: string; claimedAt: Date }>;

export const questionCollection = (database: MongoDbIntegration) => database.getCollection<QuestionDocument & Record<string, unknown>>("standalone_questions");
export const studentCollection = (database: MongoDbIntegration) => database.getCollection<StudentDocument & Record<string, unknown>>("question_students");
export const assignmentCollection = (database: MongoDbIntegration) => database.getCollection<AssignmentDocument & Record<string, unknown>>("question_assignments");
export const questionClaimCollection = (database: MongoDbIntegration) => database.getCollection<QuestionClaimDocument & Record<string, unknown>>("question_assignment_claims");

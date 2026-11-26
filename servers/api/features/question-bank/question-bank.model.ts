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

export type UserQuestionStatusDocument = Readonly<{
  studentId: string; questionId: string; status: "unused" | "learning" | "reviewing" | "mastered";
  bookmarked: boolean; updatedAt: Date;
}>;
export type StudentTestDocument = Readonly<{
  id: string; studentId: string; questionIds: readonly string[]; tutorMode: boolean; timedMode: boolean;
  status: "active" | "paused" | "completed"; currentIndex: number; createdAt: Date; updatedAt: Date;
  elapsedSeconds?: number;
  draftAnswers?: Readonly<Record<string, readonly number[]>>;
  completedAt?: Date;
}>;
export type StudentTestAttemptDocument = Readonly<{
  studentId: string; testId: string; questionId: string; selectedIndices: readonly number[];
  correct: boolean; timeSpentSeconds: number; submittedAt: Date;
}>;

export type QuestionClaimDocument = Readonly<{ questionId: string; studentId: string; claimedAt: Date }>;

export const questionCollection = (database: MongoDbIntegration) => database.getCollection<QuestionDocument & Record<string, unknown>>("standalone_questions");
export const studentCollection = (database: MongoDbIntegration) => database.getCollection<StudentDocument & Record<string, unknown>>("question_students");
export const assignmentCollection = (database: MongoDbIntegration) => database.getCollection<AssignmentDocument & Record<string, unknown>>("question_assignments");
export const questionClaimCollection = (database: MongoDbIntegration) => database.getCollection<QuestionClaimDocument & Record<string, unknown>>("question_assignment_claims");
export const userQuestionStatusCollection = (database: MongoDbIntegration) => database.getCollection<UserQuestionStatusDocument & Record<string, unknown>>("user_question_status");
export const studentTestCollection = (database: MongoDbIntegration) => database.getCollection<StudentTestDocument & Record<string, unknown>>("student_tests");
export const studentTestAttemptCollection = (database: MongoDbIntegration) => database.getCollection<StudentTestAttemptDocument & Record<string, unknown>>("student_test_attempts");

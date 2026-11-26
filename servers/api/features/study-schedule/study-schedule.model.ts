import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";

export type ScheduleDayOff = "Sunday" | "Saturday" | "Friday" | "Monday" | "None (7 days/week)";
export type ScheduleTaskAction = "create-test" | "daily-question" | "study-guide" | "study-group" | "video" | "case-study" | "standalone" | "review";
export type ScheduleTask = Readonly<{
  id: string; date: string; title: string; description: string; durationMinutes: number;
  category: "normal" | "teal" | "green"; action: ScheduleTaskAction;
  subjectId?: string | undefined; completed: boolean;
}>;
export type StudentStudySchedule = Readonly<{
  startDate: string; examDate: string | null; daysOff: ScheduleDayOff;
  dailyStudyHours: number; tasks: readonly ScheduleTask[]; updatedAt: string;
}>;
export type StudentScheduleRecord = Readonly<{ _id: string; tokenHash: string; studySchedule?: StudentStudySchedule }>;
export const scheduleStudentCollection = (database: MongoDbIntegration) =>
  database.getCollection<StudentScheduleRecord & Record<string, unknown>>("question_students");

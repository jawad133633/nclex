import { z } from "zod";

const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a YYYY-MM-DD date.").refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Enter a valid calendar date.");
const taskSchema = z.object({
  id: z.string().min(1).max(120), date: dateKeySchema, title: z.string().min(1).max(180), description: z.string().max(1000),
  durationMinutes: z.number().int().min(1).max(1440), category: z.enum(["normal", "teal", "green"]),
  action: z.enum(["create-test", "daily-question", "study-guide", "study-group", "video", "case-study", "standalone", "review"]),
  subjectId: z.string().max(120).optional(), completed: z.boolean()
});
export const scheduleSettingsSchema = z.object({
  startDate: dateKeySchema,
  examDate: dateKeySchema.nullable(),
  daysOff: z.enum(["Sunday", "Saturday", "Friday", "Monday", "None (7 days/week)"]),
  dailyStudyHours: z.number().min(0.5).max(12)
});
export const scheduleAssignmentPatchSchema = z.object({
  date: dateKeySchema.optional(), completed: z.boolean().optional()
}).refine((value) => value.date !== undefined || value.completed !== undefined);
export const fullScheduleSchema = scheduleSettingsSchema.extend({ tasks: z.array(taskSchema).max(500), updatedAt: z.string().datetime() });

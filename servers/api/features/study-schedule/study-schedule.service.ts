import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";
import { scheduleStudentCollection, type ScheduleDayOff, type ScheduleTask, type StudentStudySchedule } from "./study-schedule.model.js";
import { fullScheduleSchema, scheduleAssignmentPatchSchema, scheduleSettingsSchema } from "./study-schedule.validation.js";

const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");
const dateKey = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const addDays = (key: string, count: number): string => { const date = new Date(`${key}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + count); return date.toISOString().slice(0, 10); };
const weekday = (key: string): string => new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
const taskTemplates: readonly Omit<ScheduleTask, "id" | "date" | "completed">[] = [
  { title: "Create a custom practice test", description: "Build a question set around your current study goals.", durationMinutes: 30, category: "normal", action: "create-test" },
  { title: "Practice the question of the day", description: "Answer a daily practice question and review the rationale.", durationMinutes: 15, category: "normal", action: "daily-question" },
  { title: "Read an NCLEX study guide", description: "Review a focused strategy or subject guide.", durationMinutes: 30, category: "green", action: "study-guide" },
  { title: "Join a study group session", description: "Discuss a difficult topic with fellow learners.", durationMinutes: 30, category: "teal", action: "study-group" },
  { title: "Watch an NCLEX overview lesson", description: "Watch a lesson and note the key takeaways.", durationMinutes: 60, category: "teal", action: "video" },
  { title: "Complete an Adult Health case study", description: "Apply clinical judgment to a case study.", durationMinutes: 30, category: "normal", action: "case-study", subjectId: "adult-health" },
  { title: "Practice Adult Health questions", description: "Work through a focused standalone question set.", durationMinutes: 45, category: "normal", action: "standalone", subjectId: "adult-health" },
  { title: "Review tagged questions", description: "Revisit questions you marked for more practice.", durationMinutes: 30, category: "green", action: "review" }
];
const getStudyDates = (start: string, end: string, daysOff: ScheduleDayOff): string[] => {
  const dates: string[] = [];
  for (let current = start, guard = 0; current <= end && guard < 3660; current = addDays(current, 1), guard += 1) dates.push(current);
  const active = dates.filter((date) => daysOff === "None (7 days/week)" || weekday(date) !== daysOff);
  return active.length ? active : dates;
};
const distributeByHours = (tasks: readonly ScheduleTask[], dates: readonly string[], dailyHours: number): readonly ScheduleTask[] => {
  const loads = dates.map(() => 0);
  return tasks.map((task) => {
    let index = loads.findIndex((minutes) => minutes + task.durationMinutes <= dailyHours * 60);
    if (index < 0) index = loads.indexOf(Math.min(...loads));
    loads[index] = (loads[index] ?? 0) + task.durationMinutes;
    return { ...task, date: dates[index] ?? task.date };
  });
};
const createTasks = (settings: Readonly<{ startDate: string; examDate: string | null; daysOff: ScheduleDayOff; dailyStudyHours: number }>): readonly ScheduleTask[] => {
  const dates = getStudyDates(settings.startDate, settings.examDate ?? addDays(settings.startDate, 29), settings.daysOff);
  const tasks = Array.from({ length: 128 }, (_, index) => {
    const template = taskTemplates[index % taskTemplates.length];
    return {
      id: randomUUID(), date: settings.startDate,
      title: template?.title ?? "Review NCLEX study material", description: template?.description ?? "Practice and review today's goals.",
      durationMinutes: template?.durationMinutes ?? 30, category: template?.category ?? "normal", action: template?.action ?? "review",
      ...(template?.subjectId !== undefined ? { subjectId: template.subjectId } : {}), completed: false
    };
  });
  return distributeByHours(tasks, dates, settings.dailyStudyHours);
};

export const createStudyScheduleService = (database: MongoDbIntegration) => {
  const collection = () => scheduleStudentCollection(database);
  const memoryStudents = new Map<string, { _id: string; studySchedule?: StudentStudySchedule }>();

  const getStudent = async (token: string | undefined) => {
    const validToken = token && token.length >= 8 ? token : "default-student-offline-token";
    if (!database.isConnected()) {
      const id = hashToken(validToken).slice(0, 24);
      let student = memoryStudents.get(id);
      if (!student) {
        student = { _id: id };
        memoryStudents.set(id, student);
      }
      return student;
    }
    try {
      const student = await collection().findOne({ tokenHash: hashToken(validToken) });
      if (student?._id) return student;
    } catch {
      // fallback
    }
    const id = hashToken(validToken).slice(0, 24);
    return { _id: id };
  };
  const save = async (id: string, schedule: StudentStudySchedule): Promise<StudentStudySchedule> => {
    const student = memoryStudents.get(id) ?? { _id: id };
    student.studySchedule = schedule;
    memoryStudents.set(id, student);
    if (!database.isConnected()) {
      return schedule;
    }
    try {
      await collection().updateOne({ _id: id }, { $set: { studySchedule: schedule } });
    } catch {
      // ignore collection write issues
    }
    return schedule;
  };
  const rebalance = (schedule: StudentStudySchedule, settings: z.infer<typeof scheduleSettingsSchema>): StudentStudySchedule => {
    const incomplete = schedule.tasks.filter((task) => !task.completed);
    const completed = schedule.tasks.filter((task) => task.completed);
    const days = getStudyDates(settings.startDate, settings.examDate ?? addDays(settings.startDate, 29), settings.daysOff);
    const moved = distributeByHours(incomplete, days, settings.dailyStudyHours);
    return { ...settings, tasks: [...completed, ...moved].sort((a, b) => a.date.localeCompare(b.date)), updatedAt: new Date().toISOString() };
  };
  return Object.freeze({
    isAdminKeyValid: (candidate: string | undefined, adminApiKey: string | undefined): boolean => {
      if (!candidate || !adminApiKey) return false;
      const expected = Buffer.from(adminApiKey); const received = Buffer.from(candidate);
      return expected.length === received.length && timingSafeEqual(expected, received);
    },
    getSchedule: async (token: string | undefined): Promise<StudentStudySchedule> => {
      const student = await getStudent(token);
      if (student.studySchedule) return student.studySchedule;
      const today = dateKey(new Date());
      const settings = scheduleSettingsSchema.parse({ startDate: today, examDate: addDays(today, 29), daysOff: "Sunday", dailyStudyHours: 2 });
      return save(String(student._id), { ...settings, tasks: createTasks(settings), updatedAt: new Date().toISOString() });
    },
    updateSettings: async (token: string | undefined, input: unknown): Promise<StudentStudySchedule> => {
      const settings = scheduleSettingsSchema.parse(input);
      if (settings.examDate && settings.examDate <= settings.startDate) throw new Error("Exam date must be after start date.");
      const student = await getStudent(token);
      const schedule = student.studySchedule ? rebalance(student.studySchedule, settings) : { ...settings, tasks: createTasks(settings), updatedAt: new Date().toISOString() };
      return save(String(student._id), schedule);
    },
    replaceSchedule: async (token: string | undefined, input: unknown): Promise<StudentStudySchedule> => {
      const schedule = fullScheduleSchema.parse(input);
      const student = await getStudent(token);
      return save(String(student._id), schedule);
    },
    updateAssignment: async (token: string | undefined, id: string, input: unknown): Promise<StudentStudySchedule> => {
      const patch = scheduleAssignmentPatchSchema.parse(input); const student = await getStudent(token);
      if (!student.studySchedule) throw new Error("Study schedule is not initialized.");
      let found = false;
      const tasks = student.studySchedule.tasks.map((task) => {
        if (task.id !== id) return task;
        found = true;
        return { ...task, ...(patch.date ? { date: patch.date } : {}), ...(patch.completed !== undefined ? { completed: patch.completed } : {}) };
      });
      if (!found) throw new Error("Schedule assignment was not found.");
      return save(String(student._id), { ...student.studySchedule, tasks, updatedAt: new Date().toISOString() });
    },
    deleteAssignment: async (token: string | undefined, id: string): Promise<StudentStudySchedule> => {
      const student = await getStudent(token);
      if (!student.studySchedule) throw new Error("Study schedule is not initialized.");
      const tasks = student.studySchedule.tasks.filter((task) => task.id !== id);
      if (tasks.length === student.studySchedule.tasks.length) throw new Error("Schedule assignment was not found.");
      return save(String(student._id), { ...student.studySchedule, tasks, updatedAt: new Date().toISOString() });
    },
    rebalanceSchedule: async (token: string | undefined, input: unknown): Promise<StudentStudySchedule> => {
      const student = await getStudent(token);
      if (!student.studySchedule) throw new Error("Study schedule is not initialized.");
      const settings = scheduleSettingsSchema.parse(input ?? student.studySchedule);
      return save(String(student._id), rebalance(student.studySchedule, settings));
    },
    getAdminAssignments: async (): Promise<readonly Readonly<{ studentId: string; schedule: StudentStudySchedule | null }>[]> => {
      if (!database.isConnected()) {
        return Array.from(memoryStudents.values()).map((student) => ({ studentId: String(student._id), schedule: student.studySchedule ?? null }));
      }
      const students = await collection().find({ studySchedule: { $exists: true } }, { projection: { tokenHash: 0 } }).toArray();
      return students.map((student) => ({ studentId: String(student._id), schedule: student.studySchedule ?? null }));
    }
  });
};

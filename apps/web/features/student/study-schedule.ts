export type ScheduleDayOff = "Sunday" | "Saturday" | "Friday" | "Monday" | "None (7 days/week)";
export type ScheduleTaskCategory = "normal" | "teal" | "green";
export type ScheduleTaskAction = "create-test" | "daily-question" | "study-guide" | "study-group" | "video" | "case-study" | "standalone" | "review";
export type StudyScheduleView = "month" | "week" | "day";

export type StudyScheduleTask = Readonly<{
  id: string;
  date: string;
  title: string;
  description?: string;
  durationMinutes: number;
  category: ScheduleTaskCategory;
  action: ScheduleTaskAction;
  subjectId?: string;
  completed: boolean;
}>;

export type StudySchedule = Readonly<{
  startDate: string;
  examDate: string | null;
  daysOff: ScheduleDayOff;
  dailyStudyHours?: number;
  tasks: readonly StudyScheduleTask[];
  updatedAt: string;
}>;

export type ScheduleSettings = Readonly<{
  startDate: string;
  examDate: string | null;
  daysOff: ScheduleDayOff;
  dailyStudyHours: number;
}>;

const DEFAULT_TASK_COUNT = 128;
const OPEN_ENDED_DAYS = 29;

type TaskTemplate = Omit<StudyScheduleTask, "id" | "date" | "completed"> & Readonly<{ title: string }>;

const TASK_TEMPLATES: readonly TaskTemplate[] = [
  { title: "Create Your First Test", durationMinutes: 15, category: "normal", action: "create-test" },
  { title: "Get the NCLEX Question of the Day", durationMinutes: 15, category: "normal", action: "daily-question" },
  { title: "Read Dr. Emily's NCLEX Study Guide", durationMinutes: 15, category: "normal", action: "study-guide" },
  { title: "Join the NCLEX Study Group", durationMinutes: 15, category: "normal", action: "study-group" },
  { title: "Optional: Next Gen NCLEX Overview", durationMinutes: 60, category: "teal", action: "video" },
  { title: "Case Study: Adult Health", durationMinutes: 30, category: "normal", action: "case-study", subjectId: "adult-health" },
  { title: "Case Study: Child Health", durationMinutes: 30, category: "normal", action: "case-study", subjectId: "child-health" },
  { title: "Case Study: Mental Health", durationMinutes: 30, category: "normal", action: "case-study", subjectId: "mental-health" },
  { title: "75 Adult Health Standalone Questions", durationMinutes: 75, category: "normal", action: "standalone", subjectId: "adult-health" },
  { title: "20 Child Health and 10 Pharmacology Questions", durationMinutes: 60, category: "normal", action: "standalone", subjectId: "child-health" },
  { title: "30 Mental Health Standalone Questions", durationMinutes: 75, category: "normal", action: "standalone", subjectId: "mental-health" },
  { title: "Case Study: Adult Health", durationMinutes: 30, category: "normal", action: "case-study", subjectId: "adult-health" },
  { title: "Case Study: Child Health", durationMinutes: 30, category: "normal", action: "case-study", subjectId: "child-health" },
  { title: "20 Fundamentals Standalone Questions", durationMinutes: 90, category: "normal", action: "standalone", subjectId: "fundamentals" },
  { title: "20 Learning and Reviewing Tagged Questions", durationMinutes: 60, category: "normal", action: "review" },
  { title: "Review Crash Course Videos and Cheat Sheets", durationMinutes: 60, category: "green", action: "video" }
];

const parseDateKey = (dateKey: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
};

export const toDateKey = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const addDaysToDateKey = (dateKey: string, amount: number): string => {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

export const getScheduleEndDate = (schedule: Pick<StudySchedule, "startDate" | "examDate">): string =>
  schedule.examDate ?? addDaysToDateKey(schedule.startDate, OPEN_ENDED_DAYS);

export const getScheduleDateRange = (startDate: string, endDate: string): readonly string[] => {
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  if (!start || !end || end < start) return [];
  const dates: string[] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    dates.push(cursor.toISOString().slice(0, 10));
  }
  return dates;
};

export const getWeekStartDate = (dateKey: string): string => {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  return addDaysToDateKey(dateKey, -date.getUTCDay());
};

export const getScheduleWeekNumber = (scheduleStartDate: string, cursorDate: string): number => {
  const firstWeek = parseDateKey(getWeekStartDate(scheduleStartDate));
  const currentWeek = parseDateKey(getWeekStartDate(cursorDate));
  if (!firstWeek || !currentWeek || currentWeek < firstWeek) return 1;
  return Math.floor((currentWeek.getTime() - firstWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
};

const dayOffForDate = (dateKey: string, daysOff: ScheduleDayOff): boolean => {
  if (daysOff === "None (7 days/week)") return false;
  const dayOfWeek = parseDateKey(dateKey)?.getUTCDay();
  const names: readonly string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names[dayOfWeek ?? -1] === daysOff;
};

const getStudyDates = (startDate: string, endDate: string, daysOff: ScheduleDayOff): readonly string[] => {
  const range = getScheduleDateRange(startDate, endDate);
  const studyDates = range.filter((date) => !dayOffForDate(date, daysOff));
  return studyDates.length > 0 ? studyDates : range;
};

const distributeTasks = (tasks: readonly StudyScheduleTask[], dates: readonly string[]): readonly StudyScheduleTask[] => {
  if (tasks.length === 0 || dates.length === 0) return tasks;
  return tasks.map((task, index) => {
    const dateIndex = Math.min(dates.length - 1, Math.floor(index * dates.length / tasks.length));
    return { ...task, date: dates[dateIndex] ?? task.date };
  });
};

const makeTasks = (startDate: string, count: number): readonly StudyScheduleTask[] =>
  Array.from({ length: count }, (_, index) => {
    const template = TASK_TEMPLATES[index % TASK_TEMPLATES.length];
    const repetition = Math.floor(index / TASK_TEMPLATES.length) + 1;
    return {
      id: `schedule-assignment-${index + 1}`,
      date: startDate,
      title: template?.title ?? "Review NCLEX study material",
      durationMinutes: template?.durationMinutes ?? 30,
      category: template?.category ?? "normal",
      action: template?.action ?? "review",
      ...(template?.subjectId ? { subjectId: template.subjectId } : {}),
      completed: false,
      ...(template?.action === "case-study" ? { title: `${template.title} #${repetition}` } : {})
    };
  });

const makeSchedule = (settings: ScheduleSettings, tasks: readonly StudyScheduleTask[]): StudySchedule => ({
  startDate: settings.startDate,
  examDate: settings.examDate,
  daysOff: settings.daysOff,
  tasks,
  updatedAt: new Date().toISOString()
});

export const createStudySchedule = (settings: ScheduleSettings, taskCount = DEFAULT_TASK_COUNT): StudySchedule => {
  const endDate = settings.examDate ?? addDaysToDateKey(settings.startDate, OPEN_ENDED_DAYS);
  const dates = getStudyDates(settings.startDate, endDate, settings.daysOff);
  return makeSchedule(settings, distributeTasks(makeTasks(settings.startDate, taskCount), dates));
};

export const createDefaultStudySchedule = (today = toDateKey()): StudySchedule =>
  createStudySchedule({ startDate: today, examDate: addDaysToDateKey(today, OPEN_ENDED_DAYS), daysOff: "Sunday", dailyStudyHours: 2 });

export const rebalanceStudySchedule = (schedule: StudySchedule, settings: ScheduleSettings): StudySchedule => {
  const endDate = settings.examDate ?? addDaysToDateKey(settings.startDate, OPEN_ENDED_DAYS);
  const studyDates = getStudyDates(settings.startDate, endDate, settings.daysOff);
  const completed = schedule.tasks.filter((task) => task.completed);
  const incomplete = schedule.tasks.filter((task) => !task.completed);
  const redistributed = distributeTasks(incomplete, studyDates);
  return makeSchedule(settings, [...completed, ...redistributed].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)));
};

export const getScheduleSummary = (schedule: StudySchedule): Readonly<{ completed: number; total: number; studyDays: number; averageHoursPerDay: number }> => {
  const completed = schedule.tasks.filter((task) => task.completed).length;
  const remaining = schedule.tasks.filter((task) => !task.completed);
  const endDate = getScheduleEndDate(schedule);
  const today = toDateKey();
  const start = schedule.startDate > today ? schedule.startDate : today;
  const studyDays = Math.max(1, getStudyDates(start, endDate < start ? start : endDate, schedule.daysOff).length);
  const totalMinutes = remaining.reduce((sum, task) => sum + task.durationMinutes, 0);
  const averageHoursPerDay = Math.round((totalMinutes / studyDays / 30) * 2) / 2;
  return { completed, total: schedule.tasks.length, studyDays, averageHoursPerDay };
};


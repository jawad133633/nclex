import { createApiConfiguration, readWebEnvironment } from "@/config";
import { getStudentSession } from "./question-bank-api";
import {
  type StudySchedule,
  type StudyScheduleTask,
  createDefaultStudySchedule,
  rebalanceStudySchedule
} from "@/features/student/study-schedule";

const apiBaseUrl = createApiConfiguration(readWebEnvironment()).baseUrl;
const LOCAL_STORAGE_KEY = "nclex_student_study_schedule_v2";

const getLocalSchedule = (): StudySchedule => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudySchedule;
        if (parsed && Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to default
    }
  }
  const defaultSchedule = createDefaultStudySchedule();
  saveLocalSchedule(defaultSchedule);
  return defaultSchedule;
};

const saveLocalSchedule = (schedule: StudySchedule): StudySchedule => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schedule));
    } catch {
      // ignore local write errors
    }
  }
  return schedule;
};

const responseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? `Study Schedule API failed (${response.status}).`);
  }
  return (await response.json()) as T;
};

const authHeaders = async (): Promise<HeadersInit> => {
  try {
    const { token } = await getStudentSession();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return { Authorization: "Bearer local-offline-token" };
  }
};

export const loadStudentStudySchedule = async (): Promise<StudySchedule> => {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${apiBaseUrl}/student/study-schedule`, { headers, cache: "no-store" });
    if (!res.ok) {
      console.warn(`Remote study schedule API returned ${res.status}, using local storage.`);
      return getLocalSchedule();
    }
    const data = await responseJson<StudySchedule>(res);
    saveLocalSchedule(data);
    return data;
  } catch (err) {
    console.warn("Study schedule using local storage:", err);
    return getLocalSchedule();
  }
};

export const replaceStudentStudySchedule = async (schedule: StudySchedule): Promise<StudySchedule> => {
  saveLocalSchedule(schedule);
  try {
    const headers = await authHeaders();
    const res = await fetch(`${apiBaseUrl}/student/study-schedule`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(schedule)
    });
    if (!res.ok) return schedule;
    return await responseJson<StudySchedule>(res);
  } catch {
    return schedule;
  }
};

export const saveStudentScheduleSettings = async (
  settings: Readonly<{ startDate: string; examDate: string | null; daysOff: StudySchedule["daysOff"]; dailyStudyHours: number }>
): Promise<StudySchedule> => {
  const current = getLocalSchedule();
  const updated: StudySchedule = {
    ...current,
    startDate: settings.startDate,
    examDate: settings.examDate,
    daysOff: settings.daysOff,
    dailyStudyHours: settings.dailyStudyHours,
    updatedAt: new Date().toISOString()
  };
  saveLocalSchedule(updated);

  try {
    const headers = await authHeaders();
    const res = await fetch(`${apiBaseUrl}/student/study-schedule/settings`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (!res.ok) return updated;
    const remote = await responseJson<StudySchedule>(res);
    saveLocalSchedule(remote);
    return remote;
  } catch {
    return updated;
  }
};

export const updateStudentScheduleAssignment = async (
  id: string,
  patch: Readonly<{ date?: string; completed?: boolean }>
): Promise<StudySchedule> => {
  const current = getLocalSchedule();
  const tasks = current.tasks.map((task) => {
    if (task.id !== id) return task;
    return {
      ...task,
      ...(patch.date !== undefined ? { date: patch.date } : {}),
      ...(patch.completed !== undefined ? { completed: patch.completed } : {})
    };
  });
  const updated: StudySchedule = { ...current, tasks, updatedAt: new Date().toISOString() };
  saveLocalSchedule(updated);

  try {
    const headers = await authHeaders();
    const res = await fetch(`${apiBaseUrl}/student/study-schedule/assignments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    if (!res.ok) return updated;
    const remote = await responseJson<StudySchedule>(res);
    saveLocalSchedule(remote);
    return remote;
  } catch {
    return updated;
  }
};

export const deleteStudentScheduleAssignment = async (id: string): Promise<StudySchedule> => {
  const current = getLocalSchedule();
  const tasks = current.tasks.filter((task) => task.id !== id);
  const updated: StudySchedule = { ...current, tasks, updatedAt: new Date().toISOString() };
  saveLocalSchedule(updated);

  try {
    const headers = await authHeaders();
    const res = await fetch(`${apiBaseUrl}/student/study-schedule/assignments/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers
    });
    if (!res.ok) return updated;
    const remote = await responseJson<StudySchedule>(res);
    saveLocalSchedule(remote);
    return remote;
  } catch {
    return updated;
  }
};

export const rebalanceStudentStudySchedule = async (
  settings: Readonly<{ startDate: string; examDate: string | null; daysOff: StudySchedule["daysOff"]; dailyStudyHours: number }>
): Promise<StudySchedule> => {
  const current = getLocalSchedule();
  const rebalanced = rebalanceStudySchedule(current, {
    startDate: settings.startDate,
    examDate: settings.examDate,
    daysOff: settings.daysOff,
    dailyStudyHours: settings.dailyStudyHours
  });
  saveLocalSchedule(rebalanced);

  try {
    const headers = await authHeaders();
    const res = await fetch(`${apiBaseUrl}/student/study-schedule/rebalance`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (!res.ok) return rebalanced;
    const remote = await responseJson<StudySchedule>(res);
    saveLocalSchedule(remote);
    return remote;
  } catch {
    return rebalanced;
  }
};

export const loadAdminStudyScheduleAssignments = async (): Promise<
  readonly Readonly<{ studentId: string; schedule: StudySchedule | null }>[]
> => {
  const key = typeof window === "undefined" ? "" : sessionStorage.getItem("nclex_admin_api_key_v1") ?? "";
  try {
    const res = await fetch(`${apiBaseUrl}/admin/study-schedule/assignments`, {
      headers: { "x-admin-api-key": key },
      cache: "no-store"
    });
    if (!res.ok) throw new Error("API not ok");
    return await responseJson(res);
  } catch {
    return [{ studentId: "student-local", schedule: getLocalSchedule() }];
  }
};

export type { StudyScheduleTask };

import type { StoredStandaloneQuestion } from "./standalone-store";
import { createApiConfiguration, readWebEnvironment } from "@/config";

const apiBaseUrl = createApiConfiguration(readWebEnvironment()).baseUrl;
const STUDENT_TOKEN_KEY = "nclex_question_student_token_v1";
const STUDENT_ID_KEY = "nclex_question_student_id_v1";
const ADMIN_KEY_STORAGE = "nclex_admin_api_key_v1";

const responseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(payload.message ?? `Question API failed (${response.status}).`);
  }
  return await response.json() as T;
};

export const getAdminApiKey = (): string => typeof window === "undefined" ? "" : sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
export const saveAdminApiKey = (key: string): void => {
  if (typeof window !== "undefined") sessionStorage.setItem(ADMIN_KEY_STORAGE, key.trim());
};

export const getStudentSession = async (): Promise<Readonly<{ studentId: string; token: string }>> => {
  if (typeof window === "undefined") throw new Error("Student session is available in the browser only.");
  const token = localStorage.getItem(STUDENT_TOKEN_KEY);
  const studentId = localStorage.getItem(STUDENT_ID_KEY);
  if (token && studentId) return { token, studentId };
  const created = await responseJson<Readonly<{ studentId: string; token: string }>>(await fetch(`${apiBaseUrl}/student-sessions`, { method: "POST" }));
  localStorage.setItem(STUDENT_TOKEN_KEY, created.token);
  localStorage.setItem(STUDENT_ID_KEY, created.studentId);
  return created;
};

export const loadAssignedQuestions = async (token: string): Promise<Readonly<{ studentId: string; isPaid: boolean; questions: readonly StoredStandaloneQuestion[] }>> =>
  responseJson(await fetch(`${apiBaseUrl}/student/questions`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }));

export const answerAssignedQuestion = async (token: string, questionId: string, selectedIndex: number): Promise<Readonly<{ correct: boolean; correctIndex: number; rationale: string; progress: number; total: number }>> =>
  responseJson(await fetch(`${apiBaseUrl}/student/questions/${encodeURIComponent(questionId)}/answer`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ selectedIndex })
  }));

export const listAdminQuestions = async (key: string): Promise<StoredStandaloneQuestion[]> =>
  responseJson(await fetch(`${apiBaseUrl}/admin/questions`, { headers: { "x-admin-api-key": key }, cache: "no-store" }));

export const saveAdminQuestion = async (key: string, question: StoredStandaloneQuestion): Promise<StoredStandaloneQuestion> =>
  responseJson(await fetch(`${apiBaseUrl}/admin/questions`, {
    method: "POST", headers: { "x-admin-api-key": key, "Content-Type": "application/json" }, body: JSON.stringify(question)
  }));

export const updateAdminQuestion = async (key: string, id: string, changes: Partial<StoredStandaloneQuestion>): Promise<StoredStandaloneQuestion> =>
  responseJson(await fetch(`${apiBaseUrl}/admin/questions/${encodeURIComponent(id)}`, {
    method: "PATCH", headers: { "x-admin-api-key": key, "Content-Type": "application/json" }, body: JSON.stringify(changes)
  }));

export const deleteAdminQuestion = async (key: string, id: string): Promise<void> => {
  await responseJson(await fetch(`${apiBaseUrl}/admin/questions/${encodeURIComponent(id)}`, { method: "DELETE", headers: { "x-admin-api-key": key } }));
};

export const loadAssignmentReport = async (key: string): Promise<readonly Readonly<{ studentId: string; questionId: string; sequence: number; assignedAt: string; answered: boolean }>[]> =>
  responseJson(await fetch(`${apiBaseUrl}/admin/assignments`, { headers: { "x-admin-api-key": key }, cache: "no-store" }));

export type AdminStudentAccess = Readonly<{ studentId: string; paymentStatus: "paid" | "unpaid"; paidUntil?: string; paymentReference?: string; assignedCount: number; answeredCount: number; createdAt: string }>;
export const loadAdminStudents = async (key: string): Promise<readonly AdminStudentAccess[]> =>
  responseJson(await fetch(`${apiBaseUrl}/admin/students`, { headers: { "x-admin-api-key": key }, cache: "no-store" }));
export const setAdminStudentPayment = async (key: string, studentId: string, payment: Readonly<{ paymentStatus: "paid" | "unpaid"; paidUntil?: string; paymentReference?: string }>): Promise<void> => {
  await responseJson(await fetch(`${apiBaseUrl}/admin/students/${encodeURIComponent(studentId)}/payment`, {
    method: "PATCH", headers: { "x-admin-api-key": key, "Content-Type": "application/json" }, body: JSON.stringify(payment)
  }));
};

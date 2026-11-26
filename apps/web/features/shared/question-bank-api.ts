import {
  type StoredStandaloneQuestion,
  getStoredStandaloneQuestions,
  STANDALONE_SUBJECTS
} from "./standalone-store";
import { createApiConfiguration, readWebEnvironment } from "@/config";

const apiBaseUrl = createApiConfiguration(readWebEnvironment()).baseUrl;
const STUDENT_TOKEN_KEY = "nclex_question_student_token_v1";
const STUDENT_ID_KEY = "nclex_question_student_id_v1";
const ADMIN_KEY_STORAGE = "nclex_admin_api_key_v1";

const responseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? `Question API failed (${response.status}).`);
  }
  return (await response.json()) as T;
};

export type StudentTestQuestion = Readonly<{
  id: string;
  subjectId: StoredStandaloneQuestion["subjectId"];
  subjectName: string;
  title: string;
  stem: string;
  type: StoredStandaloneQuestion["type"];
  options: readonly string[];
  sequence: number;
  selectedIndices?: readonly number[];
  correct?: boolean;
  correctIndex?: number;
  correctIndices?: readonly number[];
  rationale?: string;
  status: "unused" | "learning" | "reviewing" | "mastered";
  bookmarked: boolean;
  answered: boolean;
}>;

export type StudentTest = Readonly<{
  id: string;
  questionCount: number;
  tutorMode: boolean;
  timedMode: boolean;
  status: "active" | "paused" | "completed";
  currentIndex: number;
  elapsedSeconds: number;
  createdAt: string;
  questions: readonly StudentTestQuestion[];
}>;

export type StudentTestOptions = Readonly<{
  pools: Readonly<Record<"unused" | "learning" | "reviewing" | "mastered" | "bookmarked", number>>;
  subjects: readonly Readonly<{ id: string; name: string; count: number }>[];
  maxQuestions: number;
}>;

export const getAdminApiKey = (): string =>
  typeof window === "undefined" ? "" : sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
export const saveAdminApiKey = (key: string): void => {
  if (typeof window !== "undefined") sessionStorage.setItem(ADMIN_KEY_STORAGE, key.trim());
};

export const getStudentSession = async (): Promise<Readonly<{ studentId: string; token: string }>> => {
  if (typeof window === "undefined") throw new Error("Student session is available in the browser only.");
  const token = localStorage.getItem(STUDENT_TOKEN_KEY);
  const studentId = localStorage.getItem(STUDENT_ID_KEY);
  if (token && studentId) return { token, studentId };
  try {
    const res = await fetch(`${apiBaseUrl}/student-sessions`, { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const created = await responseJson<Readonly<{ studentId: string; token: string }>>(res);
    localStorage.setItem(STUDENT_TOKEN_KEY, created.token);
    localStorage.setItem(STUDENT_ID_KEY, created.studentId);
    return created;
  } catch (err) {
    console.warn("Could not create remote student session, falling back to local session:", err);
    const local = {
      studentId: `student_local_${Date.now()}`,
      token: `token_local_${Math.random().toString(36).slice(2)}_${Date.now()}`
    };
    localStorage.setItem(STUDENT_TOKEN_KEY, local.token);
    localStorage.setItem(STUDENT_ID_KEY, local.studentId);
    return local;
  }
};

const getLocalQuestionStatuses = (): Record<string, { status: "unused" | "learning" | "reviewing" | "mastered"; bookmarked?: boolean }> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("nclex_question_user_statuses_v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocalQuestionStatus = (
  questionId: string,
  status: "unused" | "learning" | "reviewing" | "mastered",
  bookmarked?: boolean
) => {
  if (typeof window === "undefined") return;
  try {
    const map = getLocalQuestionStatuses();
    const existing = map[questionId] || { status: "unused", bookmarked: false };
    const isBookmarked = bookmarked !== undefined ? bookmarked : (existing.bookmarked ?? false);
    map[questionId] = {
      status,
      bookmarked: isBookmarked
    };
    localStorage.setItem("nclex_question_user_statuses_v1", JSON.stringify(map));
  } catch {
    // ignore
  }
};

export const getLocalTestOptions = (): StudentTestOptions => {
  const questions = getStoredStandaloneQuestions().filter((q) => q.status === "Published");
  const statuses = getLocalQuestionStatuses();
  const pools = { unused: 0, learning: 0, reviewing: 0, mastered: 0, bookmarked: 0 };
  const subjectsMap = new Map<string, { id: string; name: string; count: number }>();

  for (const s of STANDALONE_SUBJECTS) {
    subjectsMap.set(s.id, { id: s.id, name: s.name, count: 0 });
  }

  for (const q of questions) {
    const st = statuses[q.id];
    const pool = st?.status ?? "unused";
    pools[pool] = (pools[pool] ?? 0) + 1;
    if (st?.bookmarked) pools.bookmarked += 1;

    const sub = subjectsMap.get(q.subjectId);
    if (sub) {
      sub.count += 1;
    } else {
      subjectsMap.set(q.subjectId, { id: q.subjectId, name: q.subjectName, count: 1 });
    }
  }

  for (const s of STANDALONE_SUBJECTS) {
    const sub = subjectsMap.get(s.id);
    if (sub) {
      sub.count = Math.max(sub.count, s.baseTotal);
    }
  }

  const subjects = [...subjectsMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  const totalCount = subjects.reduce((sum, s) => sum + s.count, 0);
  if (pools.unused === 0 && pools.learning === 0) {
    pools.unused = totalCount;
  }

  return {
    pools,
    subjects,
    maxQuestions: 150
  };
};

export const createLocalStudentTest = (
  input: Readonly<{ pools: readonly string[]; subjectIds: readonly string[]; questionCount: number; tutorMode: boolean; timedMode: boolean }>
): StudentTest => {
  const all = getStoredStandaloneQuestions().filter((q) => q.status === "Published");
  const statuses = getLocalQuestionStatuses();
  const poolSet = new Set(input.pools);
  const subjectSet = new Set(input.subjectIds);

  let candidates = all.filter((q) => {
    if (subjectSet.size > 0 && !subjectSet.has(q.subjectId)) return false;
    const st = statuses[q.id];
    const pool = st?.status ?? "unused";
    return poolSet.has(pool) || (poolSet.has("bookmarked") && Boolean(st?.bookmarked));
  });

  if (candidates.length === 0) {
    candidates = all;
  }

  const targetCount = Math.max(1, Math.min(150, input.questionCount || 50));
  const pickedList: StoredStandaloneQuestion[] = [];
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);

  while (pickedList.length < targetCount && shuffled.length > 0) {
    for (const q of shuffled) {
      if (pickedList.length >= targetCount) break;
      pickedList.push(q);
    }
  }

  const testId = `test_local_${Date.now()}`;
  const now = new Date().toISOString();

  const questions: StudentTestQuestion[] = pickedList.map((q, idx) => {
    const st = statuses[q.id];
    return {
      id: `${q.id}_idx${idx + 1}`,
      subjectId: q.subjectId,
      subjectName: q.subjectName,
      title: q.title,
      stem: q.stem,
      type: q.type,
      options: [...q.options],
      sequence: idx + 1,
      correctIndex: q.correctIndex,
      ...(q.correctIndices ? { correctIndices: q.correctIndices } : {}),
      rationale: q.rationale,
      status: st?.status ?? "unused",
      bookmarked: Boolean(st?.bookmarked),
      answered: false
    };
  });

  const test: StudentTest = {
    id: testId,
    questionCount: questions.length,
    tutorMode: input.tutorMode,
    timedMode: input.timedMode,
    status: "active",
    currentIndex: 0,
    elapsedSeconds: 0,
    createdAt: now,
    questions
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`nclex_student_test_${testId}`, JSON.stringify(test));
  }
  return test;
};

export const loadAssignedQuestions = async (
  token: string
): Promise<Readonly<{ studentId: string; isPaid: boolean; questions: readonly StoredStandaloneQuestion[] }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/questions`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await responseJson(res);
  } catch {
    return {
      studentId: "student-local",
      isPaid: true,
      questions: getStoredStandaloneQuestions()
    };
  }
};

export const answerAssignedQuestion = async (
  token: string,
  questionId: string,
  selectedIndex: number
): Promise<Readonly<{ correct: boolean; correctIndex: number; rationale: string; progress: number; total: number }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/questions/${encodeURIComponent(questionId)}/answer`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIndex })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await responseJson(res);
  } catch {
    const questions = getStoredStandaloneQuestions();
    const q = questions.find((item) => item.id === questionId) || questions[0];
    const correct = q ? q.correctIndex === selectedIndex : false;
    return {
      correct,
      correctIndex: q?.correctIndex ?? 0,
      rationale: q?.rationale ?? "Clinical judgment rationale provided.",
      progress: 1,
      total: questions.length
    };
  }
};

export const loadStudentTestOptions = async (token: string): Promise<StudentTestOptions> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/test-options`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (res.ok) {
      const data = await responseJson<StudentTestOptions>(res);
      if (data && data.subjects && data.subjects.length > 0 && data.maxQuestions > 5 && data.pools.unused > 0) {
        return {
          ...data,
          maxQuestions: 150
        };
      }
    }
  } catch (err) {
    console.warn("Using local test options fallback:", err);
  }
  return getLocalTestOptions();
};

export const createStudentTest = async (
  token: string,
  input: Readonly<{ pools: readonly string[]; subjectIds: readonly string[]; questionCount: number; tutorMode: boolean; timedMode: boolean }>
): Promise<StudentTest> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/tests`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    if (res.ok) {
      const test = await responseJson<StudentTest>(res);
      if (test && test.questions && test.questions.length >= input.questionCount) {
        return test;
      }
    }
  } catch (err) {
    console.warn("Using local student test creation fallback:", err);
  }
  return createLocalStudentTest(input);
};

export const loadStudentTest = async (token: string, testId: string): Promise<StudentTest> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/tests/${encodeURIComponent(testId)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await responseJson<StudentTest>(res);
  } catch (err) {
    console.warn("Using local student test loading fallback:", err);
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(`nclex_student_test_${testId}`);
      if (raw) return JSON.parse(raw) as StudentTest;
    }
    return {
      id: testId,
      questionCount: 0,
      tutorMode: true,
      timedMode: false,
      status: "completed",
      currentIndex: 0,
      elapsedSeconds: 0,
      createdAt: new Date().toISOString(),
      questions: []
    };
  }
};

export const answerStudentTestQuestion = async (
  token: string,
  testId: string,
  questionId: string,
  selectedIndices: readonly number[],
  timeSpentSeconds: number
): Promise<Readonly<{ correct: boolean; correctIndices: readonly number[]; rationale: string; nextIndex: number; completed: boolean }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/tests/${encodeURIComponent(testId)}/questions/${encodeURIComponent(questionId)}/answer`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIndices, timeSpentSeconds })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await responseJson(res);
  } catch (err) {
    console.warn("Using local student test answer fallback:", err);
    let correct = false;
    let correctIndices: readonly number[] = [];
    let rationale = "";
    let nextIndex = 0;
    let completed = false;

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(`nclex_student_test_${testId}`);
      if (raw) {
        const test = JSON.parse(raw) as StudentTest;
        const qIndex = test.questions.findIndex((q) => q.id === questionId);
        const q = test.questions[qIndex];
        if (q) {
          correct = q.correctIndices
            ? q.correctIndices.length === selectedIndices.length && q.correctIndices.every((idx) => selectedIndices.includes(idx))
            : (q.correctIndex !== undefined && selectedIndices.includes(q.correctIndex));
          correctIndices = q.correctIndices ?? (q.correctIndex !== undefined ? [q.correctIndex] : [0]);
          rationale = q.rationale ?? "";
          nextIndex = qIndex + 1;
          completed = nextIndex >= test.questions.length;

          const updatedQuestions = test.questions.map((item, idx) =>
            idx === qIndex ? { ...item, selectedIndices, correct, answered: true } : item
          );
          const updatedTest: StudentTest = {
            ...test,
            currentIndex: nextIndex,
            elapsedSeconds: timeSpentSeconds,
            status: completed ? "completed" : "active",
            questions: updatedQuestions
          };
          localStorage.setItem(`nclex_student_test_${testId}`, JSON.stringify(updatedTest));
        }
      }
    }
    return { correct, correctIndices, rationale, nextIndex, completed };
  }
};

export const updateStudentQuestionStatus = async (
  token: string,
  questionId: string,
  input: Readonly<{ status: "unused" | "learning" | "reviewing" | "mastered"; bookmarked?: boolean }>
): Promise<void> => {
  saveLocalQuestionStatus(questionId, input.status, input.bookmarked);
  try {
    await fetch(`${apiBaseUrl}/student/questions/${encodeURIComponent(questionId)}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
  } catch {
    // ignore
  }
};

export const updateStudentTestState = async (
  token: string,
  testId: string,
  status: "active" | "paused" | "completed",
  elapsedSeconds = 0,
  draft?: Readonly<{ currentQuestionId?: string; draftSelectedIndices?: readonly number[] }>
): Promise<StudentTest> => {
  try {
    const res = await fetch(`${apiBaseUrl}/student/tests/${encodeURIComponent(testId)}/state`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status, elapsedSeconds, ...draft })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await responseJson<StudentTest>(res);
  } catch {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(`nclex_student_test_${testId}`);
      if (raw) {
        const test = JSON.parse(raw) as StudentTest;
        const updated: StudentTest = { ...test, status, elapsedSeconds };
        localStorage.setItem(`nclex_student_test_${testId}`, JSON.stringify(updated));
        return updated;
      }
    }
    return {
      id: testId,
      questionCount: 0,
      tutorMode: true,
      timedMode: false,
      status,
      currentIndex: 0,
      elapsedSeconds,
      createdAt: new Date().toISOString(),
      questions: []
    };
  }
};

export const listAdminQuestions = async (key: string): Promise<StoredStandaloneQuestion[]> => {
  try {
    const res = await fetch(`${apiBaseUrl}/admin/questions`, { headers: { "x-admin-api-key": key }, cache: "no-store" });
    if (!res.ok) throw new Error("API not ok");
    return await responseJson<StoredStandaloneQuestion[]>(res);
  } catch {
    return getStoredStandaloneQuestions();
  }
};

export const saveAdminQuestion = async (key: string, question: StoredStandaloneQuestion): Promise<StoredStandaloneQuestion> => {
  try {
    const res = await fetch(`${apiBaseUrl}/admin/questions`, {
      method: "POST",
      headers: { "x-admin-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(question)
    });
    if (!res.ok) throw new Error("API not ok");
    return await responseJson<StoredStandaloneQuestion>(res);
  } catch {
    return question;
  }
};

export const updateAdminQuestion = async (key: string, id: string, changes: Partial<StoredStandaloneQuestion>): Promise<StoredStandaloneQuestion> => {
  try {
    const res = await fetch(`${apiBaseUrl}/admin/questions/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "x-admin-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });
    if (!res.ok) throw new Error("API not ok");
    return await responseJson<StoredStandaloneQuestion>(res);
  } catch {
    const questions = getStoredStandaloneQuestions();
    const existing = questions.find((q) => q.id === id);
    return { ...(existing ?? (changes as StoredStandaloneQuestion)), ...changes };
  }
};

export const deleteAdminQuestion = async (key: string, id: string): Promise<void> => {
  try {
    await fetch(`${apiBaseUrl}/admin/questions/${encodeURIComponent(id)}`, { method: "DELETE", headers: { "x-admin-api-key": key } });
  } catch {
    // ignore
  }
};

export const loadAssignmentReport = async (
  key: string
): Promise<readonly Readonly<{ studentId: string; questionId: string; sequence: number; assignedAt: string; answered: boolean }>[]> => {
  try {
    const res = await fetch(`${apiBaseUrl}/admin/assignments`, { headers: { "x-admin-api-key": key }, cache: "no-store" });
    if (!res.ok) throw new Error("API not ok");
    return await responseJson(res);
  } catch {
    return [];
  }
};

export type AdminStudentAccess = Readonly<{
  studentId: string;
  paymentStatus: "paid" | "unpaid";
  paidUntil?: string;
  paymentReference?: string;
  assignedCount: number;
  answeredCount: number;
  createdAt: string;
}>;

export const loadAdminStudents = async (key: string): Promise<readonly AdminStudentAccess[]> => {
  try {
    const res = await fetch(`${apiBaseUrl}/admin/students`, { headers: { "x-admin-api-key": key }, cache: "no-store" });
    if (!res.ok) throw new Error("API not ok");
    return await responseJson(res);
  } catch {
    return [];
  }
};

export const setAdminStudentPayment = async (
  key: string,
  studentId: string,
  payment: Readonly<{ paymentStatus: "paid" | "unpaid"; paidUntil?: string; paymentReference?: string }>
): Promise<void> => {
  try {
    await fetch(`${apiBaseUrl}/admin/students/${encodeURIComponent(studentId)}/payment`, {
      method: "PATCH",
      headers: { "x-admin-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(payment)
    });
  } catch {
    // ignore
  }
};

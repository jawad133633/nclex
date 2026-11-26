import type { StoredStandaloneQuestion } from "@/features/shared/standalone-store";

export type ClientNeedsCategory =
  | "Management of Care"
  | "Safety and Infection Control"
  | "Health Promotion and Maintenance"
  | "Psychosocial Integrity"
  | "Basic Care and Comfort"
  | "Pharmacological and Parenteral Therapies"
  | "Reduction of Risk Potential"
  | "Physiological Adaptation";

export interface CatQuestionAttempt {
  questionId: string;
  itemNumber: number;
  difficulty: number; // b parameter (-2.5 to +2.5)
  isCorrect: boolean;
  selectedOption: number;
  thetaAfter: number;
  semAfter: number;
  timeSpentSeconds: number;
  clientNeeds: ClientNeedsCategory;
}

export interface CatExamSession {
  examId: string;
  examNumber: 1 | 2 | 3 | 4;
  status: "in-progress" | "completed";
  startTime: string;
  endTime?: string;
  currentTheta: number; // starts at 0.0
  currentSem: number;
  totalAnswered: number;
  minQuestions: number; // 85
  maxQuestions: number; // 150
  passingStandard: number; // 0.0 logits
  passStatus?: "PASS" | "FAIL";
  passProbability: number; // 0 to 100%
  stopReason?: "95% Confidence Interval (Pass)" | "95% Confidence Interval (Fail)" | "Maximum Length Rule (150 Items)" | "Manual End Exam";
  history: CatQuestionAttempt[];
  thetaTrajectory: { item: number; theta: number; lower95: number; upper95: number }[];
}

export interface CatCategoryPerformance {
  category: ClientNeedsCategory;
  total: number;
  correct: number;
  accuracy: number;
  status: "Above Passing Standard" | "Near Passing Standard" | "Below Passing Standard";
}

export interface CatExamSummary {
  examId: string;
  examNumber: number;
  passStatus: "PASS" | "FAIL";
  passProbability: number;
  totalQuestions: number;
  finalTheta: number;
  finalSem: number;
  stopReason: string;
  accuracyPercent: number;
  categoryBreakdown: CatCategoryPerformance[];
  trajectory: { item: number; theta: number; lower95: number; upper95: number }[];
  completedAt: string;
}

const CLIENT_NEEDS_LIST: ClientNeedsCategory[] = [
  "Management of Care",
  "Safety and Infection Control",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Basic Care and Comfort",
  "Pharmacological and Parenteral Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation"
];

// Map question subject to NCLEX Client Needs category
export const mapSubjectToClientNeeds = (subjectId: string, index: number): ClientNeedsCategory => {
  switch (subjectId) {
    case "management-of-care":
      return "Management of Care";
    case "fundamentals":
      return index % 2 === 0 ? "Safety and Infection Control" : "Basic Care and Comfort";
    case "pharmacology":
      return "Pharmacological and Parenteral Therapies";
    case "mental-health":
      return "Psychosocial Integrity";
    case "maternal-newborn":
    case "child-health":
      return "Health Promotion and Maintenance";
    case "adult-health":
      return index % 2 === 0 ? "Physiological Adaptation" : "Reduction of Risk Potential";
    default:
      return CLIENT_NEEDS_LIST[index % CLIENT_NEEDS_LIST.length]!;
  }
};

// Rasch 1-PL probability of correct response: P(theta, b) = 1 / (1 + e^-(theta - b))
export const calculateProbability = (theta: number, difficulty: number): number => {
  const exponent = -(theta - difficulty);
  return 1 / (1 + Math.exp(exponent));
};

// Update theta using Newton-Raphson approximation step
export const updateAbilityTheta = (
  currentTheta: number,
  history: ReadonlyArray<Pick<CatQuestionAttempt, "difficulty" | "isCorrect">>
): { theta: number; sem: number } => {
  if (history.length === 0) return { theta: 0.0, sem: 1.0 };

  let numerator = 0;
  let denominator = 0;

  for (const attempt of history) {
    const p = calculateProbability(currentTheta, attempt.difficulty);
    const u = attempt.isCorrect ? 1 : 0;
    numerator += (u - p);
    denominator += p * (1 - p);
  }

  // Bounded step update to prevent divergent oscillations
  const step = denominator > 0 ? Math.max(-0.6, Math.min(0.6, numerator / (denominator + 0.15))) : 0;
  const newTheta = Math.max(-3.0, Math.min(3.0, currentTheta + step));
  const sem = Math.max(0.18, 1 / Math.sqrt(denominator + 0.1));

  return { theta: parseFloat(newTheta.toFixed(3)), sem: parseFloat(sem.toFixed(3)) };
};

// Compute passing probability percentage (0 - 100%)
export const calculatePassProbability = (theta: number): number => {
  // Logistic function centered at 0.0 logits with steepness factor 1.8
  const prob = 1 / (1 + Math.exp(-1.8 * theta));
  return Math.round(Math.max(1, Math.min(99, prob * 100)));
};

// Initialize fresh CAT Exam session
export const createCatExamSession = (examNumber: 1 | 2 | 3 | 4): CatExamSession => {
  return {
    examId: `cat-exam-${examNumber}-${Date.now()}`,
    examNumber,
    status: "in-progress",
    startTime: new Date().toISOString(),
    currentTheta: 0.0,
    currentSem: 0.85,
    totalAnswered: 0,
    minQuestions: 85,
    maxQuestions: 150,
    passingStandard: 0.0,
    passProbability: 50,
    history: [],
    thetaTrajectory: [{ item: 0, theta: 0.0, lower95: -1.66, upper95: 1.66 }]
  };
};

// Check stopping criteria according to official NCSBN Next Gen rules
export const checkCatStoppingRule = (
  session: CatExamSession
): { shouldStop: boolean; status?: "PASS" | "FAIL"; reason?: CatExamSession["stopReason"] } => {
  const count = session.totalAnswered;
  if (count < session.minQuestions) {
    return { shouldStop: false };
  }

  const lower95 = session.currentTheta - 1.96 * session.currentSem;
  const upper95 = session.currentTheta + 1.96 * session.currentSem;

  // 1. 95% Confidence Interval Rule
  if (lower95 > session.passingStandard) {
    return {
      shouldStop: true,
      status: "PASS",
      reason: "95% Confidence Interval (Pass)"
    };
  }

  if (upper95 < session.passingStandard) {
    return {
      shouldStop: true,
      status: "FAIL",
      reason: "95% Confidence Interval (Fail)"
    };
  }

  // 2. Maximum Length Rule (150 Items)
  if (count >= session.maxQuestions) {
    const isPass = session.currentTheta >= session.passingStandard;
    return {
      shouldStop: true,
      status: isPass ? "PASS" : "FAIL",
      reason: "Maximum Length Rule (150 Items)"
    };
  }

  return { shouldStop: false };
};

// Select next best question matching current ability theta
export const selectNextCatQuestion = (
  availableQuestions: StoredStandaloneQuestion[],
  usedIds: Set<string>,
  targetTheta: number,
  itemIndex: number
): { question: StoredStandaloneQuestion; difficulty: number } => {
  const unused = availableQuestions.filter((q) => !usedIds.has(q.id));
  const pool = unused.length > 0 ? unused : availableQuestions;

  // Target item difficulty roughly alternates around current theta
  // Difficulty levels: Easy (-1.2 to -0.3), Medium (-0.2 to +0.4), Hard (+0.5 to +1.8)
  const sorted = [...pool].sort((a, b) => {
    const diffA = getAssignedDifficulty(a, itemIndex);
    const diffB = getAssignedDifficulty(b, itemIndex);
    return Math.abs(diffA - targetTheta) - Math.abs(diffB - targetTheta);
  });

  const selected = sorted[0] ?? pool[0]!;
  const difficulty = getAssignedDifficulty(selected, itemIndex);
  return { question: selected, difficulty };
};

// Deterministic difficulty assignment based on question id and characteristics
export const getAssignedDifficulty = (question: StoredStandaloneQuestion, index: number): number => {
  if (question.type === "Select All That Apply") return 0.6 + ((index % 5) * 0.15);
  if (question.type === "Priority Action") return 0.2 + ((index % 5) * 0.15);
  if (question.subjectId === "pharmacology") return 0.3 + ((index % 4) * 0.2);
  if (question.subjectId === "management-of-care") return 0.1 + ((index % 4) * 0.2);
  if (question.subjectId === "free") return -0.4 + ((index % 3) * 0.3);
  return -0.2 + ((index % 7) * 0.25);
};

// Record an answered question in the CAT session and update ability
export const recordCatAttempt = (
  session: CatExamSession,
  question: StoredStandaloneQuestion,
  selectedOption: number,
  isCorrect: boolean,
  timeSpentSeconds: number
): { updatedSession: CatExamSession; stoppingDecision: ReturnType<typeof checkCatStoppingRule> } => {
  const itemNumber = session.totalAnswered + 1;
  const difficulty = getAssignedDifficulty(question, itemNumber);
  const clientNeeds = mapSubjectToClientNeeds(question.subjectId, itemNumber);

  const newHistoryEntry: CatQuestionAttempt = {
    questionId: question.id,
    itemNumber,
    difficulty,
    isCorrect,
    selectedOption,
    thetaAfter: session.currentTheta,
    semAfter: session.currentSem,
    timeSpentSeconds,
    clientNeeds
  };

  const newHistory = [...session.history, newHistoryEntry];
  const { theta, sem } = updateAbilityTheta(session.currentTheta, newHistory);
  newHistoryEntry.thetaAfter = theta;
  newHistoryEntry.semAfter = sem;

  const lower95 = parseFloat((theta - 1.96 * sem).toFixed(3));
  const upper95 = parseFloat((theta + 1.96 * sem).toFixed(3));

  const updatedSession: CatExamSession = {
    ...session,
    totalAnswered: itemNumber,
    currentTheta: theta,
    currentSem: sem,
    passProbability: calculatePassProbability(theta),
    history: newHistory,
    thetaTrajectory: [
      ...session.thetaTrajectory,
      { item: itemNumber, theta, lower95, upper95 }
    ]
  };

  const stoppingDecision = checkCatStoppingRule(updatedSession);
  if (stoppingDecision.shouldStop) {
    updatedSession.status = "completed";
    updatedSession.endTime = new Date().toISOString();
    if (stoppingDecision.status) {
      updatedSession.passStatus = stoppingDecision.status;
    }
    if (stoppingDecision.reason) {
      updatedSession.stopReason = stoppingDecision.reason;
    }
  }

  return { updatedSession, stoppingDecision };
};

// Generate comprehensive CAT Exam Summary for display and persistence
export const generateCatExamSummary = (session: CatExamSession): CatExamSummary => {
  const total = session.history.length;
  const correct = session.history.filter((h) => h.isCorrect).length;
  const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const categoryMap = new Map<ClientNeedsCategory, { total: number; correct: number }>();
  for (const cat of CLIENT_NEEDS_LIST) {
    categoryMap.set(cat, { total: 0, correct: 0 });
  }

  for (const attempt of session.history) {
    const entry = categoryMap.get(attempt.clientNeeds) ?? { total: 0, correct: 0 };
    entry.total += 1;
    if (attempt.isCorrect) entry.correct += 1;
    categoryMap.set(attempt.clientNeeds, entry);
  }

  const categoryBreakdown: CatCategoryPerformance[] = CLIENT_NEEDS_LIST.map((category) => {
    const data = categoryMap.get(category) ?? { total: 0, correct: 0 };
    const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 70;
    const status: CatCategoryPerformance["status"] =
      acc >= 75
        ? "Above Passing Standard"
        : acc >= 60
          ? "Near Passing Standard"
          : "Below Passing Standard";

    return {
      category,
      total: data.total,
      correct: data.correct,
      accuracy: acc,
      status
    };
  });

  return {
    examId: session.examId,
    examNumber: session.examNumber,
    passStatus: session.passStatus ?? (session.currentTheta >= 0.0 ? "PASS" : "FAIL"),
    passProbability: session.passProbability,
    totalQuestions: total,
    finalTheta: session.currentTheta,
    finalSem: session.currentSem,
    stopReason: session.stopReason ?? "Exam Completed",
    accuracyPercent,
    categoryBreakdown,
    trajectory: session.thetaTrajectory,
    completedAt: session.endTime ?? new Date().toISOString()
  };
};

const CAT_STORAGE_KEY = "nclex_cat_attempts_history_v1";

export const getSavedCatExamSummaries = (): CatExamSummary[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCatExamSummary = (summary: CatExamSummary): void => {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedCatExamSummaries();
    const updated = [summary, ...existing.filter((s) => s.examId !== summary.examId)];
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save CAT exam summary:", err);
  }
};

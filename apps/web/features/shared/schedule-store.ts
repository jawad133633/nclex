export interface ScheduleTask {
  id: string;
  title: string;
  duration: string;
  type: "normal" | "teal" | "green" | "purple";
  category: "standalone" | "case-study" | "video" | "cheat-sheet" | "cat-exam" | "guide";
  linkTab?: string;
  subjectId?: string;
}

export interface ScheduleDay {
  dayName: string; // "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  dateNum: number;
  fullDateStr: string; // "2026-12-04"
  displayDate: string; // "Fri 4"
  isToday: boolean;
  isDayOff: boolean;
  totalDuration: string;
  tasks: ScheduleTask[];
}

export interface ScheduleWeek {
  weekNumber: number;
  label: string; // "Week 1 of 4"
  monthTitle: string; // "December 2026"
  days: ScheduleDay[];
}

export interface StoredScheduleData {
  hasActiveSchedule: boolean;
  startDate: string;
  examDate: string;
  noExamDateYet: boolean;
  selectedDaysOff: string[];
  checkedTasks: Record<string, boolean>;
  activeWeekIndex: number;
}

const STORAGE_KEY = "nclex_study_schedule_v2";
export const SCHEDULE_UPDATED_EVENT = "study-schedule-updated";

export const DEFAULT_SCHEDULE_DATA: StoredScheduleData = {
  hasActiveSchedule: true,
  startDate: "2026-11-29",
  examDate: "2026-12-24",
  noExamDateYet: false,
  selectedDaysOff: ["Sun"],
  checkedTasks: {
    "fri-1": true,
    "fri-2": true
  },
  activeWeekIndex: 1
};

export const STUDY_SCHEDULE_FAQS = [
  {
    q: "Why should I use the study schedule creator?",
    a: "The study schedule creator automatically designs an adaptive study plan tailored to your target exam date and daily commitments. It ensures you complete all essential case studies, standalone question banks, cheat sheets, and CAT exams without feeling overwhelmed, and dynamically rebalances if life gets busy."
  },
  {
    q: "I already started the PDF schedule. How can I switch to the study schedule creator?",
    a: "You can easily transition by selecting your current progress in the schedule creator or checking off the topics and question sets you've already completed. The schedule creator will balance the remaining material across your available study days."
  },
  {
    q: "Is this the same as the PDF study schedule?",
    a: "Yes! It covers the exact same proven Next Gen NCLEX curriculum, but with interactive tracking, one-click resource navigation, progress analytics, and smart automated rebalancing so you never have to recalculate your timeline manually."
  },
  {
    q: "What if I fall behind or need to change something?",
    a: "No worries! Simply click the 'Rebalance' button at the top of your schedule. Our smart algorithm will automatically redistribute any overdue assignments across your remaining study days without burning you out."
  }
];

export function generateScheduleWeeks(data: StoredScheduleData): ScheduleWeek[] {
  const weeks: ScheduleWeek[] = [];
  const start = new Date(data.startDate || "2026-11-29");
  
  // Total 4 core comprehensive weeks
  const weekConfigs = [
    {
      weekNumber: 1,
      monthTitle: "December 2026",
      daysData: [
        { dayName: "Sun", dateNum: 29, isDayOff: true, tasks: [] },
        { dayName: "Mon", dateNum: 30, isDayOff: true, tasks: [] },
        { dayName: "Tue", dateNum: 1, isDayOff: true, tasks: [] },
        { dayName: "Wed", dateNum: 2, isDayOff: true, tasks: [] },
        { dayName: "Thu", dateNum: 3, isDayOff: true, tasks: [] },
        {
          dayName: "Fri",
          dateNum: 4,
          isDayOff: false,
          totalDuration: "5h 15m",
          tasks: [
            { id: "fri-1", title: "Create Your First Test", duration: "15m", type: "normal", category: "standalone", linkTab: "standalone" },
            { id: "fri-2", title: "Get the NCLEX Question of the Day", duration: "15m", type: "normal", category: "guide", linkTab: "home" },
            { id: "fri-3", title: 'Read "Dr. Emily\'s NCLEX Study Guide"', duration: "15m", type: "normal", category: "guide", linkTab: "home" },
            { id: "fri-4", title: "Join the NCLEX Study Group (Facebook)", duration: "15m", type: "normal", category: "guide", linkTab: "faqs" },
            { id: "fri-5", title: "[Optional] Next Gen NCLEX Overview", duration: "1h", type: "teal", category: "video", linkTab: "strategy-course" },
            { id: "fri-6", title: "Case Study: Adult Health #1", duration: "30m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "fri-7", title: "Case Study: Child Health #1", duration: "30m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "fri-8", title: "Case Study: Mental Health #1", duration: "30m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "fri-9", title: "75 Adult Health Standalone Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "adult-health" },
            { id: "fri-10", title: "20 Child Health, 10 Pharmacology Standalone Questions", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "child-health" }
          ]
        },
        {
          dayName: "Sat",
          dateNum: 5,
          isDayOff: false,
          totalDuration: "5h 15m",
          tasks: [
            { id: "sat-1", title: "30 Mental Health Standalone Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "mental-health" },
            { id: "sat-2", title: "Case Study: Adult Health #2", duration: "30m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "sat-3", title: "Case Study: Child Health #2", duration: "30m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "sat-4", title: "Case Study: Adult Health #3", duration: "30m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "sat-5", title: "20 Fundamentals Standalone Questions", duration: "1h 30m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "fundamentals" },
            { id: "sat-6", title: "20 Learning and Reviewing Tagged Questions", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone" },
            { id: "sat-7", title: "Review Crash Course Videos and Cheat Sheets", duration: "1h", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        }
      ]
    },
    {
      weekNumber: 2,
      monthTitle: "December 2026",
      daysData: [
        { dayName: "Sun", dateNum: 6, isDayOff: true, tasks: [] },
        {
          dayName: "Mon",
          dateNum: 7,
          isDayOff: false,
          totalDuration: "4h 30m",
          tasks: [
            { id: "w2-mon-1", title: "Pharmacology: Cardiac & Antihypertensives Review", duration: "1h", type: "teal", category: "video", linkTab: "crash-course" },
            { id: "w2-mon-2", title: "50 Pharmacology Standalone Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "pharmacology" },
            { id: "w2-mon-3", title: "Case Study: Pharmacology Medication Safety", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w2-mon-4", title: "High-Yield Pharmacology Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        },
        {
          dayName: "Tue",
          dateNum: 8,
          isDayOff: false,
          totalDuration: "4h 00m",
          tasks: [
            { id: "w2-tue-1", title: "Case Study: Maternal Complications & Labor", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w2-tue-2", title: "40 Maternal & Newborn Standalone Questions", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "maternal-newborn" },
            { id: "w2-tue-3", title: "Obstetric Emergencies Video", duration: "45m", type: "teal", category: "video", linkTab: "crash-course" },
            { id: "w2-tue-4", title: "Review Normal Newborn Lab Values Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        },
        {
          dayName: "Wed",
          dateNum: 9,
          isDayOff: false,
          totalDuration: "4h 15m",
          tasks: [
            { id: "w2-wed-1", title: "Pediatric Growth & Developmental Milestones Video", duration: "1h", type: "teal", category: "video", linkTab: "crash-course" },
            { id: "w2-wed-2", title: "Case Study: Pediatric Respiratory Illness", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w2-wed-3", title: "35 Child Health Standalone Questions", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "child-health" },
            { id: "w2-wed-4", title: "Pediatric Immunization Schedules Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        },
        {
          dayName: "Thu",
          dateNum: 10,
          isDayOff: false,
          totalDuration: "4h 30m",
          tasks: [
            { id: "w2-thu-1", title: "Neurological & Stroke Management Case Study", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w2-thu-2", title: "45 Adult Health Neurologic Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "adult-health" },
            { id: "w2-thu-3", title: "Cranial Nerves & Stroke Assessment Video", duration: "45m", type: "teal", category: "video", linkTab: "crash-course" },
            { id: "w2-thu-4", title: "Review Mastered vs Learning Questions", duration: "45m", type: "purple", category: "standalone", linkTab: "standalone" }
          ]
        },
        {
          dayName: "Fri",
          dateNum: 11,
          isDayOff: false,
          totalDuration: "5h 00m",
          tasks: [
            { id: "w2-fri-1", title: "Case Study: Endocrine Crises (DKA & HHS)", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w2-fri-2", title: "50 Adult Health Endocrine & GI Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "adult-health" },
            { id: "w2-fri-3", title: "Insulin & Antidiabetic Agents Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" },
            { id: "w2-fri-4", title: "Strategy Session: Eliminating Distractors", duration: "45m", type: "teal", category: "video", linkTab: "strategy-course" }
          ]
        },
        {
          dayName: "Sat",
          dateNum: 12,
          isDayOff: false,
          totalDuration: "4h 30m",
          tasks: [
            { id: "w2-sat-1", title: "Mid-Term Spaced Repetition Review (50 questions)", duration: "1h 30m", type: "purple", category: "standalone", linkTab: "standalone" },
            { id: "w2-sat-2", title: "Case Study: Renal Failure & Electrolyte Imbalance", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w2-sat-3", title: "Electrolytes & ABGs Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        }
      ]
    },
    {
      weekNumber: 3,
      monthTitle: "December 2026",
      daysData: [
        { dayName: "Sun", dateNum: 13, isDayOff: true, tasks: [] },
        {
          dayName: "Mon",
          dateNum: 14,
          isDayOff: false,
          totalDuration: "4h 45m",
          tasks: [
            { id: "w3-mon-1", title: "Management of Care: Prioritization & Delegation", duration: "1h", type: "teal", category: "video", linkTab: "strategy-course" },
            { id: "w3-mon-2", title: "45 Management of Care Standalone Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "management-of-care" },
            { id: "w3-mon-3", title: "Case Study: Multi-Patient Delegation & Triage", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" }
          ]
        },
        {
          dayName: "Tue",
          dateNum: 15,
          isDayOff: false,
          totalDuration: "4h 30m",
          tasks: [
            { id: "w3-tue-1", title: "Infection Control & PPE Precautions Review", duration: "45m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" },
            { id: "w3-tue-2", title: "40 Fundamentals & Safety Questions", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "fundamentals" },
            { id: "w3-tue-3", title: "Case Study: Sepsis & Shock Protocol", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" }
          ]
        },
        {
          dayName: "Wed",
          dateNum: 16,
          isDayOff: false,
          totalDuration: "4h 00m",
          tasks: [
            { id: "w3-wed-1", title: "Mental Health: Therapeutic Communication Review", duration: "45m", type: "teal", category: "video", linkTab: "crash-course" },
            { id: "w3-wed-2", title: "35 Mental Health Standalone Questions", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "mental-health" },
            { id: "w3-wed-3", title: "Psychiatric Medications Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        },
        {
          dayName: "Thu",
          dateNum: 17,
          isDayOff: false,
          totalDuration: "5h 00m",
          tasks: [
            { id: "w3-thu-1", title: "Full 85-Question Practice Exam (Timed Simulation)", duration: "2h 30m", type: "purple", category: "cat-exam", linkTab: "cat-exams" },
            { id: "w3-thu-2", title: "In-depth Remediation of Missed Questions", duration: "1h 30m", type: "normal", category: "standalone", linkTab: "standalone" }
          ]
        },
        {
          dayName: "Fri",
          dateNum: 18,
          isDayOff: false,
          totalDuration: "4h 15m",
          tasks: [
            { id: "w3-fri-1", title: "Case Study: Emergency Department Trauma Triage", duration: "45m", type: "normal", category: "case-study", linkTab: "case-studies" },
            { id: "w3-fri-2", title: "40 Pharmacology Anti-Infectives & Oncology", duration: "1h", type: "normal", category: "standalone", linkTab: "standalone", subjectId: "pharmacology" },
            { id: "w3-fri-3", title: "Emergency Drugs & Antidotes Cheat Sheet", duration: "30m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" }
          ]
        },
        {
          dayName: "Sat",
          dateNum: 19,
          isDayOff: false,
          totalDuration: "3h 45m",
          tasks: [
            { id: "w3-sat-1", title: "Targeted Weak Area Question Block (35 questions)", duration: "1h", type: "purple", category: "standalone", linkTab: "standalone" },
            { id: "w3-sat-2", title: "Clinical Judgment Measurement Model Deep-Dive", duration: "45m", type: "teal", category: "video", linkTab: "strategy-course" }
          ]
        }
      ]
    },
    {
      weekNumber: 4,
      monthTitle: "December 2026",
      daysData: [
        { dayName: "Sun", dateNum: 20, isDayOff: true, tasks: [] },
        {
          dayName: "Mon",
          dateNum: 21,
          isDayOff: false,
          totalDuration: "4h 00m",
          tasks: [
            { id: "w4-mon-1", title: "CAT Readiness Exam #1 (Official Next Gen Simulator)", duration: "2h 15m", type: "purple", category: "cat-exam", linkTab: "cat-exams" },
            { id: "w4-mon-2", title: "Remediate Rationales and Core Concepts", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone" }
          ]
        },
        {
          dayName: "Tue",
          dateNum: 22,
          isDayOff: false,
          totalDuration: "3h 30m",
          tasks: [
            { id: "w4-tue-1", title: "High-Yield Lab Values Final Review", duration: "45m", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" },
            { id: "w4-tue-2", title: "50 Mixed Comprehensive Questions", duration: "1h 15m", type: "normal", category: "standalone", linkTab: "standalone" },
            { id: "w4-tue-3", title: "Test-Taking Anxiety & Pacing Strategy", duration: "30m", type: "teal", category: "video", linkTab: "strategy-course" }
          ]
        },
        {
          dayName: "Wed",
          dateNum: 23,
          isDayOff: false,
          totalDuration: "2h 30m",
          tasks: [
            { id: "w4-wed-1", title: "Light Review: Top 50 Must-Know NCLEX Facts", duration: "1h", type: "green", category: "cheat-sheet", linkTab: "cheat-sheets" },
            { id: "w4-wed-2", title: "Relaxation & Mental Readiness for Exam Day", duration: "30m", type: "normal", category: "guide", linkTab: "home" }
          ]
        },
        {
          dayName: "Thu",
          dateNum: 24,
          isDayOff: false,
          totalDuration: "🎯 Exam Day",
          tasks: [
            { id: "w4-thu-1", title: "🎯 OFFICIAL NCLEX-RN EXAM DAY!", duration: "Good luck!", type: "purple", category: "cat-exam", linkTab: "cat-exams" }
          ]
        },
        { dayName: "Fri", dateNum: 25, isDayOff: true, tasks: [] },
        { dayName: "Sat", dateNum: 26, isDayOff: true, tasks: [] }
      ]
    }
  ];

  for (const cfg of weekConfigs) {
    const days: ScheduleDay[] = cfg.daysData.map((d) => ({
      dayName: d.dayName,
      dateNum: d.dateNum,
      fullDateStr: `2026-12-${String(d.dateNum).padStart(2, "0")}`,
      displayDate: `${d.dayName} ${d.dateNum}`,
      isToday: d.dayName === "Fri" && d.dateNum === 4,
      isDayOff: data.selectedDaysOff.includes(d.dayName) || d.isDayOff,
      totalDuration: d.totalDuration || "",
      tasks: (data.selectedDaysOff.includes(d.dayName) || d.isDayOff) ? [] : (d.tasks as ScheduleTask[])
    }));

    weeks.push({
      weekNumber: cfg.weekNumber,
      label: `Week ${cfg.weekNumber} of ${weekConfigs.length}`,
      monthTitle: cfg.monthTitle,
      days
    });
  }

  return weeks;
}

export function countTotalScheduleTasks(weeks: ScheduleWeek[]): number {
  let count = 0;
  for (const w of weeks) {
    for (const d of w.days) {
      count += d.tasks.length;
    }
  }
  return count;
}

export function getStoredSchedule(): StoredScheduleData {
  if (typeof window === "undefined") return DEFAULT_SCHEDULE_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE_DATA));
      return DEFAULT_SCHEDULE_DATA;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SCHEDULE_DATA, ...parsed };
  } catch (err) {
    console.error("Failed to load schedule from storage:", err);
    return DEFAULT_SCHEDULE_DATA;
  }
}

export function saveStoredSchedule(data: StoredScheduleData): StoredScheduleData {
  if (typeof window === "undefined") return data;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    notifyScheduleSubscribers(data);
    return data;
  } catch (err) {
    console.error("Failed to save schedule to storage:", err);
    return data;
  }
}

export function toggleScheduleTaskCompleted(taskId: string): StoredScheduleData {
  const current = getStoredSchedule();
  const nextChecked = { ...current.checkedTasks, [taskId]: !current.checkedTasks[taskId] };
  const updated: StoredScheduleData = { ...current, checkedTasks: nextChecked };
  return saveStoredSchedule(updated);
}

export function rebalanceScheduleTasks(): StoredScheduleData {
  const current = getStoredSchedule();
  return saveStoredSchedule(current);
}

export function resetStoredSchedule(): StoredScheduleData {
  return saveStoredSchedule({
    ...DEFAULT_SCHEDULE_DATA,
    checkedTasks: {},
    hasActiveSchedule: false
  });
}

function notifyScheduleSubscribers(data: StoredScheduleData): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCHEDULE_UPDATED_EVENT, { detail: data }));
}

export function subscribeToSchedule(callback: (data: StoredScheduleData) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<StoredScheduleData>;
    callback(custom.detail ?? getStoredSchedule());
  };
  window.addEventListener(SCHEDULE_UPDATED_EVENT, handler);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) callback(getStoredSchedule());
  });
  return () => {
    window.removeEventListener(SCHEDULE_UPDATED_EVENT, handler);
  };
}

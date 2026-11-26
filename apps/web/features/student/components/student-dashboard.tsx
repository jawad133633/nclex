"use client";

import { useState, useEffect, useRef, type ReactElement } from "react";
import Link from "next/link";
import {
  Activity, AlertCircle, ArrowLeft, ArrowRight, ArrowUp, Baby, BarChart3, BicepsFlexed, Bookmark, BookOpen, BookOpenCheck, Brain,
  Calculator, Calendar, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleHelp, Clock,
  FileCheck2, FileClock, FilePlus2, FileQuestion, FileText, Flame,
  FolderHeart, GraduationCap, Heart, HeartPulse, HelpCircle, History,
  ExternalLink,
  Lock, Menu, MessageSquare, Milk, Minus, Moon, Pill, Play, Plus, Rocket, RotateCcw, Search, Settings, Settings2,
  Home,
  Shield, ShieldCheck, SlidersHorizontal, Sparkles, Star, Stethoscope, Sun, Target, Trophy,
  Users, UsersRound, Video, X, Zap
} from "lucide-react";
import {
  type StoredStandaloneQuestion,
  getStoredStandaloneQuestions,
  subscribeToStandaloneQuestions,
  STANDALONE_SUBJECTS,
  DEFAULT_STANDALONE_QUESTIONS
} from "@/features/shared/standalone-store";
import {
  DEFAULT_MEMBERSHIP,
  type StudentMembership
} from "@/features/shared/membership-store";
import {
  answerAssignedQuestion,
  answerStudentTestQuestion,
  createLocalStudentTest,
  createStudentTest,
  getLocalTestOptions,
  getStudentSession,
  loadAssignedQuestions,
  loadStudentTest,
  loadStudentTestOptions,
  updateStudentQuestionStatus,
  updateStudentTestState,
  type StudentTestOptions,
  type StudentTestQuestion
} from "@/features/shared/question-bank-api";
import { StudentAccountView } from "./student-account-view";
import { deleteStudentScheduleAssignment, loadStudentStudySchedule, rebalanceStudentStudySchedule, replaceStudentStudySchedule, saveStudentScheduleSettings, updateStudentScheduleAssignment } from "@/features/shared/study-schedule-api";
import {
  type CatExamSession,
  type CatExamSummary,
  createCatExamSession,
  selectNextCatQuestion,
  recordCatAttempt,
  generateCatExamSummary,
  saveCatExamSummary,
  getSavedCatExamSummaries
} from "@/features/student/cat-engine";
import {
  addDaysToDateKey,
  createDefaultStudySchedule,
  createStudySchedule,
  getScheduleDateRange,
  getScheduleEndDate,
  getScheduleSummary,
  getScheduleWeekNumber,
  getWeekStartDate,
  rebalanceStudySchedule,
  toDateKey,
  type ScheduleDayOff,
  type StudySchedule,
  type StudyScheduleTask,
  type StudyScheduleView
} from "@/features/student/study-schedule";
import { getCurrentAuthUser, logoutUser, type AuthUser } from "@/features/auth";

interface ExpertInfo {
  name: string;
  initials: string;
  bg: string;
  image?: string;
}

interface SubjectItem {
  id: string;
  name: string;
  icon: typeof Heart;
  iconBg: string;
  iconColor: string;
  questionsTotal: number;
  questionsUsed: number;
  lessonsTotal: number;
  lessonsCompleted: number;
  experts: string;
  expert1: ExpertInfo;
  expert2: ExpertInfo;
}

const subjectsList: SubjectItem[] = [
  {
    id: "adult-health",
    name: "Adult Health",
    icon: Heart,
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
    questionsTotal: 569,
    questionsUsed: 0,
    lessonsTotal: 94,
    lessonsCompleted: 0,
    experts: "Dr. Emily & Dr. Amber",
    expert1: { name: "Dr. Emily", initials: "DE", bg: "#0D9488", image: "/images/avatar-caroline.jpg" },
    expert2: { name: "Dr. Amber", initials: "DA", bg: "#F59E0B", image: "/images/avatar-alex.jpg" }
  },
  {
    id: "child-health",
    name: "Child Health",
    icon: Baby,
    iconBg: "#FCE7F3",
    iconColor: "#EC4899",
    questionsTotal: 199,
    questionsUsed: 0,
    lessonsTotal: 46,
    lessonsCompleted: 0,
    experts: "Nurse Crysta & Nurse Miriam",
    expert1: { name: "Nurse Crysta", initials: "NC", bg: "#EC4899", image: "/images/avatar-caroline.jpg" },
    expert2: { name: "Nurse Miriam", initials: "NM", bg: "#0284C7", image: "/images/avatar-alex.jpg" }
  },
  {
    id: "fundamentals",
    name: "Fundamentals",
    icon: BicepsFlexed,
    iconBg: "#FFE4E6",
    iconColor: "#F43F5E",
    questionsTotal: 155,
    questionsUsed: 0,
    lessonsTotal: 26,
    lessonsCompleted: 0,
    experts: "Dr. Emily & Nurse Crysta",
    expert1: { name: "Dr. Emily", initials: "DE", bg: "#0D9488", image: "/images/avatar-caroline.jpg" },
    expert2: { name: "Nurse Crysta", initials: "NC", bg: "#EC4899", image: "/images/avatar-alex.jpg" }
  },
  {
    id: "maternal-newborn",
    name: "Maternal & Newborn Health",
    icon: Milk,
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
    questionsTotal: 213,
    questionsUsed: 0,
    lessonsTotal: 36,
    lessonsCompleted: 0,
    experts: "Nurse Miriam & Nurse Crysta",
    expert1: { name: "Nurse Miriam", initials: "NM", bg: "#0284C7", image: "/images/avatar-alex.jpg" },
    expert2: { name: "Nurse Crysta", initials: "NC", bg: "#EC4899", image: "/images/avatar-caroline.jpg" }
  },
  {
    id: "mental-health",
    name: "Mental Health",
    icon: Brain,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    questionsTotal: 116,
    questionsUsed: 0,
    lessonsTotal: 24,
    lessonsCompleted: 0,
    experts: "Dr. Cortney & Dr. Emily",
    expert1: { name: "Dr. Cortney", initials: "DC", bg: "#8B5CF6", image: "/images/avatar-caroline.jpg" },
    expert2: { name: "Dr. Emily", initials: "DE", bg: "#0D9488", image: "/images/avatar-alex.jpg" }
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    icon: Pill,
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
    questionsTotal: 183,
    questionsUsed: 0,
    lessonsTotal: 46,
    lessonsCompleted: 0,
    experts: "Dr. Cortney & Dr. Emily",
    expert1: { name: "Dr. Cortney", initials: "DC", bg: "#8B5CF6", image: "/images/avatar-caroline.jpg" },
    expert2: { name: "Dr. Emily", initials: "DE", bg: "#0D9488", image: "/images/avatar-alex.jpg" }
  },
  {
    id: "management-of-care",
    name: "Management of Care",
    icon: Plus,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    questionsTotal: 145,
    questionsUsed: 0,
    lessonsTotal: 12,
    lessonsCompleted: 0,
    experts: "Dr. Amber & Dr. Emily",
    expert1: { name: "Dr. Amber", initials: "DA", bg: "#F59E0B", image: "/images/avatar-alex.jpg" },
    expert2: { name: "Dr. Emily", initials: "DE", bg: "#0D9488", image: "/images/avatar-caroline.jpg" }
  }
];

const questionTypes = [
  {
    name: "Case Studies",
    subtitle: "0 of 300 questions used",
    icon: Plus,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626"
  },
  {
    name: "Standalone Questions",
    subtitle: "0 of 1280 questions used",
    icon: Stethoscope,
    iconBg: "#E0F2FE",
    iconColor: "#0284C7"
  },
  {
    name: "CAT Readiness Exams",
    subtitle: "0 of 600 questions used",
    icon: Target,
    iconBg: "#FCE7F3",
    iconColor: "#E11D48"
  }
];

const resourceItems = [
  {
    name: "Crash Course Videos",
    subtitle: "0 of 284 lessons completed",
    icon: Play,
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
    hasProgress: true
  },
  {
    name: "Cheat Sheets",
    subtitle: "High-yield Cheat Sheets for the NCLEX®",
    icon: FileText,
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
    hasProgress: false
  },
  {
    name: "Next Gen Strategy Course",
    subtitle: "Learn everything you need to know about the Next Gen NCLEX®",
    icon: Play,
    iconBg: "#FCE7F3",
    iconColor: "#E11D48",
    hasProgress: false
  }
];

const faqsList = [
  {
    question: "What is NCLEXLab?",
    answer:
      "NCLEXLab is a modern, high-yield preparation platform built specifically for the Next Generation NCLEX-RN® exam. It provides over 3,500+ case studies, standalone questions, interactive video walkthroughs, and personalized CAT readiness simulations to ensure you pass on your first attempt."
  },
  {
    question: "I'm already using another NCLEX® question bank. How is NCLEXLab different?",
    answer:
      "Unlike traditional static question banks, NCLEXLab combines clinical case studies with Next-Gen scoring rubrics, video rationales from verified nursing educators, and an AI study path that dynamically adapts to your personal strengths and weak areas."
  },
  {
    question: "Who made NCLEXLab?",
    answer:
      "NCLEXLab was designed and authored by a dedicated team of Master's-prepared nurse educators, clinical nurse specialists, and exam strategists, including Dr. Emily, Dr. Amber, Dr. Cortney, Nurse Crysta, and Nurse Miriam."
  },
  {
    question: "Does NCLEXLab have a pass guarantee?",
    answer:
      "Yes! With our comprehensive study plan and 99.6% first-time pass rate, students who complete their assigned study modules and achieve high readiness on CAT exams qualify for our 100% money-back pass guarantee."
  },
  {
    question: "Can I use NCLEXLab for the NCLEX-PN®?",
    answer:
      "While this current track is calibrated specifically for the NCLEX-RN® test plan, many core clinical judgment principles, pharmacology basics, and foundational nursing concepts apply across both examinations. An official dedicated NCLEX-PN® curriculum is launching later this year."
  },
  {
    question: "Is NCLEXLab updated for the 2026 NCLEX® test plan changes?",
    answer:
      "Yes! NCLEXLab is 100% updated to align with the latest 2026 NCSBN NCLEX® test plan updates. Our clinical educators review and refine our questions, case studies, and clinical judgment scoring models continuously so you are preparing with the most accurate, up-to-date material."
  },
  {
    question: "Does NCLEXLab have a study guide or study schedule?",
    answer:
      "Yes! We provide customizable 1-month, 2-month, and 3-month study schedules built directly into your dashboard. You can set your target exam date, choose your preferred days off, and get an automated day-by-day checklist that paces your case studies, videos, and question practice."
  },
  {
    question: "Where can I read student reviews for NCLEXLab?",
    answer:
      "You can read verified student reviews, success stories, and pass reports on our Trustpilot page, our official website testimonials section, and across our active Reddit and Facebook student community groups where thousands of nurses share their test day experiences."
  },
  {
    question: "Do you offer a payment plan?",
    answer:
      "Yes, we partner with flexible checkout providers (such as Klarna and Afterpay) at checkout, allowing you to split your membership into interest-free installment payments over time."
  },
  {
    question: "How can I contact you?",
    answer:
      "You can reach our dedicated student support team 24/7 by clicking the chat bubble in the bottom right corner of your screen, or by emailing us directly at team@nclexlab.com. We typically respond within minutes!"
  },
  {
    question: "What do the learning, reviewing, and mastered tags do?",
    answer:
      "These tags power our spaced repetition system: 'Learning' marks questions you are actively working to understand; 'Reviewing' schedules them for reinforcement after a short interval; and 'Mastered' indicates topics you have demonstrated high accuracy and confidence in."
  },
  {
    question: "Can I purchase now, but activate my account later?",
    answer:
      "Yes! When you purchase any membership, your subscription does not start until you click 'Activate Membership' on your account page or start your first practice test. You can purchase during a sale and activate whenever you are ready to study."
  },
  {
    question: "Can I pause my membership?",
    answer:
      "Yes, we offer complimentary membership pauses if life happens, your clinical rotation intensifies, or your exam date gets rescheduled. You can pause your subscription anytime directly from your Account Settings."
  },
  {
    question: "Can I adjust the video playback speed?",
    answer:
      "Yes! All crash course videos, question walkthroughs, and case study breakdowns feature a built-in playback speed controller (0.75x, 1x, 1.25x, 1.5x, 1.75x, and 2x) along with keyboard shortcuts and closed captions."
  },
  {
    question: "Do you have sponsorships for influencers?",
    answer:
      "Yes! We love collaborating with nursing students, nurse educators, and creators who inspire the community. If you have a nursing blog, YouTube channel, TikTok, or Instagram, contact us at partnerships@nclexlab.com to learn about our creator program."
  },
  {
    question: "I'm an educator. How do I purchase institutional access?",
    answer:
      "We offer dedicated institutional licensing and educator dashboards for nursing schools, cohort faculty, and hospital residency programs. Please visit our Institutional page or email schools@nclexlab.com for bulk pricing and demo access."
  },
  {
    question: "Can I extend my membership?",
    answer:
      "Yes! If you need more time to prepare, you can easily extend your access at an exclusive discounted renewal rate right from your dashboard before or after your subscription expires."
  }
];

const sidebarMenu = [
  { id: "home", label: "Home", icon: BookOpenCheck },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "standalone", label: "Standalone Questions", icon: FileQuestion },
  { id: "case-studies", label: "Case Studies", icon: FileCheck2 },
  { id: "crash-course", label: "Crash Course Videos", icon: Video },
  { id: "cheat-sheets", label: "NCLEX Cheat Sheets", icon: FileText },
  { id: "cat-exams", label: "CAT Readiness Exams", icon: Target },
  { id: "schedule", label: "Study Schedule", icon: CalendarDays },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "previous-tests", label: "Previous Tests", icon: FileClock },
  { id: "strategy-course", label: "Next Gen Strategy Course", icon: Play },
  { id: "faqs", label: "FAQs", icon: HelpCircle }
];

interface StandaloneSystemItem {
  id: number;
  name: string;
  questionsUsed: number;
  questionsTotal: number;
}

const adultHealthStandaloneSystems: StandaloneSystemItem[] = [
  { id: 1, name: "Cardiovascular", questionsUsed: 0, questionsTotal: 77 },
  { id: 2, name: "Endocrine", questionsUsed: 0, questionsTotal: 34 },
  { id: 3, name: "Gastrointestinal", questionsUsed: 0, questionsTotal: 41 },
  { id: 4, name: "Hematologic", questionsUsed: 0, questionsTotal: 18 },
  { id: 5, name: "Immune / Infectious Disease", questionsUsed: 0, questionsTotal: 13 },
  { id: 6, name: "Integumentary", questionsUsed: 0, questionsTotal: 16 },
  { id: 7, name: "Multisystem", questionsUsed: 0, questionsTotal: 9 },
  { id: 8, name: "Musculoskeletal", questionsUsed: 0, questionsTotal: 31 },
  { id: 9, name: "Neurologic", questionsUsed: 0, questionsTotal: 40 },
  { id: 10, name: "Reproductive", questionsUsed: 0, questionsTotal: 15 },
  { id: 11, name: "Respiratory", questionsUsed: 0, questionsTotal: 61 },
  { id: 12, name: "Urinary and Renal", questionsUsed: 0, questionsTotal: 37 },
  { id: 13, name: "Visual and Auditory", questionsUsed: 0, questionsTotal: 15 }
];

const childHealthStandaloneSystems: StandaloneSystemItem[] = [
  { id: 1, name: "Cardiovascular", questionsUsed: 0, questionsTotal: 11 },
  { id: 2, name: "Endocrine", questionsUsed: 0, questionsTotal: 7 },
  { id: 3, name: "Gastrointestinal", questionsUsed: 0, questionsTotal: 17 },
  { id: 4, name: "Growth and Development", questionsUsed: 0, questionsTotal: 29 },
  { id: 5, name: "Hematologic", questionsUsed: 0, questionsTotal: 10 },
  { id: 6, name: "Immune / Infectious Disease", questionsUsed: 0, questionsTotal: 15 },
  { id: 7, name: "Integumentary", questionsUsed: 0, questionsTotal: 7 },
  { id: 8, name: "Musculoskeletal", questionsUsed: 0, questionsTotal: 10 },
  { id: 9, name: "Neurologic", questionsUsed: 0, questionsTotal: 11 },
  { id: 10, name: "Reproductive", questionsUsed: 0, questionsTotal: 3 },
  { id: 11, name: "Respiratory", questionsUsed: 0, questionsTotal: 12 },
  { id: 12, name: "Urinary and Renal", questionsUsed: 0, questionsTotal: 7 },
  { id: 13, name: "Visual and Auditory", questionsUsed: 0, questionsTotal: 6 }
];

const fundamentalsStandaloneSystems: StandaloneSystemItem[] = [
  { id: 1, name: "Fluid, Electrolytes, and Acid-Base Balance", questionsUsed: 0, questionsTotal: 28 },
  { id: 2, name: "Safety and Infection Control", questionsUsed: 0, questionsTotal: 39 },
  { id: 3, name: "Basic Care and Comfort", questionsUsed: 0, questionsTotal: 45 },
  { id: 4, name: "Nutrition and Elimination", questionsUsed: 0, questionsTotal: 43 }
];

const maternalNewbornStandaloneSystems: StandaloneSystemItem[] = [
  { id: 1, name: "Antepartum", questionsUsed: 0, questionsTotal: 37 },
  { id: 2, name: "Labor & Delivery", questionsUsed: 0, questionsTotal: 43 },
  { id: 3, name: "Newborn", questionsUsed: 0, questionsTotal: 32 },
  { id: 4, name: "Postpartum", questionsUsed: 0, questionsTotal: 29 }
];

const mentalHealthStandaloneSystems: StandaloneSystemItem[] = [
  { id: 1, name: "Cognitive and Developmental Disorders", questionsUsed: 0, questionsTotal: 21 },
  { id: 2, name: "Mood and Personality Disorders", questionsUsed: 0, questionsTotal: 15 },
  { id: 3, name: "Anxiety Disorders, Trauma, and Addiction", questionsUsed: 0, questionsTotal: 27 },
  { id: 4, name: "Foundations and Therapeutic Communication", questionsUsed: 0, questionsTotal: 41 }
];

const managementOfCareStandaloneSystems: StandaloneSystemItem[] = [
  { id: 1, name: "Assignment and Delegation", questionsUsed: 0, questionsTotal: 36 },
  { id: 2, name: "Prioritization", questionsUsed: 0, questionsTotal: 59 },
  { id: 3, name: "Management Concepts", questionsUsed: 0, questionsTotal: 50 }
];

const standaloneSystemsBySubject: Record<string, StandaloneSystemItem[]> = {
  "adult-health": adultHealthStandaloneSystems,
  "child-health": childHealthStandaloneSystems,
  "fundamentals": fundamentalsStandaloneSystems,
  "maternal-newborn": maternalNewbornStandaloneSystems,
  "mental-health": mentalHealthStandaloneSystems,
  "management-of-care": managementOfCareStandaloneSystems
};

const subjectCaseStudiesConfig: Record<string, { total: number; unlocked: number }> = {
  "adult-health": { total: 20, unlocked: 3 },
  "child-health": { total: 9, unlocked: 2 },
  "fundamentals": { total: 8, unlocked: 2 },
  "maternal-newborn": { total: 12, unlocked: 2 },
  "mental-health": { total: 2, unlocked: 1 },
  "pharmacology": { total: 12, unlocked: 2 },
  "management-of-care": { total: 6, unlocked: 2 }
};

interface AllCaseStudyItem {
  id: number;
  subjectName: string;
  subjectNumber: number;
  title: string;
  questionsTotal: number;
  questionsUsed: number;
  isUnlocked: boolean;
}

const allCaseStudiesList: AllCaseStudyItem[] = [
  // 1. Unlocked first (matches reference design order)
  { id: 1, subjectName: "Adult Health", subjectNumber: 1, title: "Case Study: Adult Health #1", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 2, subjectName: "Adult Health", subjectNumber: 2, title: "Case Study: Adult Health #2", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 3, subjectName: "Adult Health", subjectNumber: 3, title: "Case Study: Adult Health #3", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 21, subjectName: "Child Health", subjectNumber: 1, title: "Case Study: Child Health #1", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 22, subjectName: "Child Health", subjectNumber: 2, title: "Case Study: Child Health #2", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 37, subjectName: "Maternal & Newborn Health", subjectNumber: 1, title: "Case Study: Maternal & Newborn Health #1", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 38, subjectName: "Maternal & Newborn Health", subjectNumber: 2, title: "Case Study: Maternal & Newborn Health #2", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },
  { id: 49, subjectName: "Mental Health", subjectNumber: 1, title: "Case Study: Mental Health #1", questionsTotal: 6, questionsUsed: 0, isUnlocked: true },

  // 2. Locked Adult Health (#4 to #20)
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    subjectName: "Adult Health",
    subjectNumber: i + 4,
    title: `Case Study: Adult Health #${i + 4}`,
    questionsTotal: 6,
    questionsUsed: 0,
    isUnlocked: false
  })),

  // 3. Locked Child Health (#3 to #16)
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 23,
    subjectName: "Child Health",
    subjectNumber: i + 3,
    title: `Case Study: Child Health #${i + 3}`,
    questionsTotal: 6,
    questionsUsed: 0,
    isUnlocked: false
  })),

  // 4. Locked Maternal & Newborn Health (#3 to #12)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 39,
    subjectName: "Maternal & Newborn Health",
    subjectNumber: i + 3,
    title: `Case Study: Maternal & Newborn Health #${i + 3}`,
    questionsTotal: 6,
    questionsUsed: 0,
    isUnlocked: false
  })),

  // 5. Locked Mental Health (#2)
  { id: 50, subjectName: "Mental Health", subjectNumber: 2, title: "Case Study: Mental Health #2", questionsTotal: 6, questionsUsed: 0, isUnlocked: false }
];

interface StandaloneSubjectCardItem {
  id: string;
  name: string;
  icon: typeof Heart;
  iconBg: string;
  iconColor: string;
  questionsTotal: number;
  questionsUsed: number;
}

const standaloneSubjectsCatalog: StandaloneSubjectCardItem[] = [
  {
    id: "adult-health",
    name: "Adult Health",
    icon: Heart,
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
    questionsTotal: 407,
    questionsUsed: 0
  },
  {
    id: "child-health",
    name: "Child Health",
    icon: Baby,
    iconBg: "#FCE7F3",
    iconColor: "#EC4899",
    questionsTotal: 145,
    questionsUsed: 0
  },
  {
    id: "fundamentals",
    name: "Fundamentals",
    icon: BicepsFlexed,
    iconBg: "#FFE4E6",
    iconColor: "#F43F5E",
    questionsTotal: 155,
    questionsUsed: 0
  },
  {
    id: "maternal-newborn",
    name: "Maternal & Newborn Health",
    icon: Milk,
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
    questionsTotal: 142,
    questionsUsed: 0
  },
  {
    id: "mental-health",
    name: "Mental Health",
    icon: Brain,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    questionsTotal: 104,
    questionsUsed: 0
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    icon: Pill,
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
    questionsTotal: 183,
    questionsUsed: 0
  },
  {
    id: "management-of-care",
    name: "Management of Care",
    icon: Plus,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    questionsTotal: 145,
    questionsUsed: 0
  }
];

interface CrashCourseTopic {
  id: number;
  title: string;
  videoDuration: string;
  questionsTotal: number;
  isUnlocked: boolean;
}

const adultHealthCrashTopics: CrashCourseTopic[] = [
  { id: 1, title: "Acute & Concerning Skin Conditions", videoDuration: "10:06", questionsTotal: 7, isUnlocked: true },
  { id: 2, title: "Acute Kidney Injury & Chronic Kidney Disease", videoDuration: "11:37", questionsTotal: 8, isUnlocked: true },
  { id: 3, title: "Anemia & Leukemia", videoDuration: "11:58", questionsTotal: 9, isUnlocked: true },
  { id: 4, title: "Appendicitis, Diverticulitis, & Bowel Obstruction", videoDuration: "10:29", questionsTotal: 9, isUnlocked: false },
  { id: 5, title: "Arthritis & Osteoporosis", videoDuration: "11:39", questionsTotal: 10, isUnlocked: false },
  { id: 6, title: "BPH & Prostate Cancer", videoDuration: "10:43", questionsTotal: 7, isUnlocked: false },
  { id: 7, title: "Brain Injuries & Increased ICP", videoDuration: "12:51", questionsTotal: 9, isUnlocked: false },
  { id: 8, title: "Burns & Inhalation Injury", videoDuration: "10:30", questionsTotal: 10, isUnlocked: false },
  { id: 9, title: "Cancer", videoDuration: "13:57", questionsTotal: 10, isUnlocked: false },
  { id: 10, title: "Cholecystitis & Pancreatitis", videoDuration: "9:37", questionsTotal: 10, isUnlocked: false },
  { id: 11, title: "Chronic Obstructive Pulmonary Disease (COPD)", videoDuration: "11:59", questionsTotal: 8, isUnlocked: false },
  { id: 12, title: "Coronary Artery Disease & Myocardial Infarction Part 1", videoDuration: "9:45", questionsTotal: 7, isUnlocked: false },
  { id: 13, title: "Coronary Artery Disease & Myocardial Infarction Part 2", videoDuration: "11:25", questionsTotal: 10, isUnlocked: false },
  { id: 14, title: "Cranial Nerves, Bell Palsy, & Trigeminal Neuralgia", videoDuration: "7:48", questionsTotal: 5, isUnlocked: false },
  { id: 15, title: "Cushing & Addison Disease", videoDuration: "11:34", questionsTotal: 9, isUnlocked: false },
  { id: 16, title: "Deep Vein Thrombosis & Pulmonary Embolism", videoDuration: "12:02", questionsTotal: 9, isUnlocked: true },
  { id: 17, title: "Diabetes Mellitus Part 1", videoDuration: "13:37", questionsTotal: 8, isUnlocked: false },
  { id: 18, title: "Diabetes Mellitus Part 2", videoDuration: "11:41", questionsTotal: 8, isUnlocked: false },
  { id: 19, title: "Endocarditis, Pericarditis, & Cardiac Tamponade", videoDuration: "10:30", questionsTotal: 10, isUnlocked: false },
  { id: 20, title: "Eye Conditions", videoDuration: "10:56", questionsTotal: 9, isUnlocked: false },
  { id: 21, title: "Fractures", videoDuration: "11:32", questionsTotal: 8, isUnlocked: false },
  { id: 22, title: "Gastroesophageal Reflux Disease (GERD) & Peptic Ulcer Disease (PUD)", videoDuration: "10:15", questionsTotal: 8, isUnlocked: false },
  { id: 23, title: "Glomerulonephritis & Nephrotic Syndrome", videoDuration: "9:50", questionsTotal: 7, isUnlocked: false },
  { id: 24, title: "Heart Failure & Pulmonary Edema", videoDuration: "12:40", questionsTotal: 9, isUnlocked: false },
  { id: 25, title: "Hepatitis & Cirrhosis", videoDuration: "11:20", questionsTotal: 8, isUnlocked: false },
  { id: 26, title: "Hypertension & Hypertensive Crisis", videoDuration: "10:12", questionsTotal: 7, isUnlocked: false },
  { id: 27, title: "Inflammatory Bowel Disease (Crohn & Ulcerative Colitis)", videoDuration: "11:05", questionsTotal: 9, isUnlocked: false },
  { id: 28, title: "Ischemic & Hemorrhagic Stroke", videoDuration: "13:10", questionsTotal: 10, isUnlocked: false },
  { id: 29, title: "Menopause & Female Reproductive Disorders", videoDuration: "9:25", questionsTotal: 6, isUnlocked: false },
  { id: 30, title: "Meningitis & Encephalitis", videoDuration: "10:45", questionsTotal: 8, isUnlocked: false },
  { id: 31, title: "Multiple Sclerosis, ALS, & Myasthenia Gravis", videoDuration: "12:15", questionsTotal: 9, isUnlocked: false },
  { id: 32, title: "Parkinson Disease & Alzheimer Disease", videoDuration: "11:50", questionsTotal: 8, isUnlocked: false },
  { id: 33, title: "Pneumonia & Tuberculosis", videoDuration: "12:35", questionsTotal: 9, isUnlocked: false },
  { id: 34, title: "Pneumothorax, Hemothorax, & Chest Tubes", videoDuration: "11:15", questionsTotal: 8, isUnlocked: false },
  { id: 35, title: "Renal Calculi (Kidney Stones)", videoDuration: "8:55", questionsTotal: 6, isUnlocked: false },
  { id: 36, title: "Seizure Disorders & Status Epilepticus", videoDuration: "10:40", questionsTotal: 8, isUnlocked: false },
  { id: 37, title: "Shock (Hypovolemic, Cardiogenic, Septic, Anaphylactic)", videoDuration: "14:10", questionsTotal: 10, isUnlocked: false },
  { id: 38, title: "Spinal Cord Injury & Autonomic Dysreflexia", videoDuration: "12:05", questionsTotal: 9, isUnlocked: false },
  { id: 39, title: "Systemic Lupus Erythematosus & Scleroderma", videoDuration: "10:35", questionsTotal: 8, isUnlocked: false },
  { id: 40, title: "Thyroid Disorders (Hyperthyroidism & Hypothyroidism)", videoDuration: "11:45", questionsTotal: 9, isUnlocked: false },
  { id: 41, title: "Urinary Tract Infections & Pyelonephritis", videoDuration: "9:15", questionsTotal: 7, isUnlocked: false },
  { id: 42, title: "Valvular Heart Disease", videoDuration: "9:55", questionsTotal: 7, isUnlocked: false },
  { id: 43, title: "Venous vs Arterial Peripheral Vascular Disease", videoDuration: "10:20", questionsTotal: 8, isUnlocked: false },
  { id: 44, title: "Ventilator Management & ARDS", videoDuration: "13:25", questionsTotal: 10, isUnlocked: false },
  { id: 45, title: "Visual Disorders (Cataracts, Glaucoma, Macular Degeneration)", videoDuration: "11:10", questionsTotal: 8, isUnlocked: false },
  { id: 46, title: "Wound Care & Pressure Injuries", videoDuration: "10:05", questionsTotal: 7, isUnlocked: false },
  { id: 47, title: "Acid-Base Imbalances & Arterial Blood Gases (ABGs)", videoDuration: "12:50", questionsTotal: 9, isUnlocked: false }
];

const childHealthCrashTopics: CrashCourseTopic[] = [
  { id: 1, title: "Asthma", videoDuration: "9:52", questionsTotal: 8, isUnlocked: true },
  { id: 2, title: "Bites, Stings, & Irritants", videoDuration: "10:38", questionsTotal: 7, isUnlocked: false },
  { id: 3, title: "Childhood Musculoskeletal Conditions", videoDuration: "10:01", questionsTotal: 8, isUnlocked: false },
  { id: 4, title: "Cleft Palate, Tracheoesophageal Fistula, & Reflux", videoDuration: "11:30", questionsTotal: 7, isUnlocked: false },
  { id: 5, title: "Common Skin Conditions", videoDuration: "10:01", questionsTotal: 8, isUnlocked: false },
  { id: 6, title: "Congenital Heart Defects", videoDuration: "11:23", questionsTotal: 10, isUnlocked: true },
  { id: 7, title: "Cystic Fibrosis", videoDuration: "12:00", questionsTotal: 6, isUnlocked: true },
  { id: 8, title: "Croup, Epiglottitis, & Tonsillitis", videoDuration: "10:54", questionsTotal: 8, isUnlocked: false },
  { id: 9, title: "Developmental Theories Part 1", videoDuration: "14:38", questionsTotal: 8, isUnlocked: false },
  { id: 10, title: "Developmental Theories Part 2", videoDuration: "13:40", questionsTotal: 4, isUnlocked: false },
  { id: 11, title: "Glomerulonephritis, Nephrotic Syndrome, & Nephroblastoma", videoDuration: "12:04", questionsTotal: 7, isUnlocked: false },
  { id: 12, title: "Growth & Development", videoDuration: "10:24", questionsTotal: 9, isUnlocked: true },
  { id: 13, title: "Hemophilia", videoDuration: "8:13", questionsTotal: 6, isUnlocked: false },
  { id: 14, title: "Infant & Child Safety", videoDuration: "10:39", questionsTotal: 9, isUnlocked: false },
  { id: 15, title: "Infectious Diseases of Childhood", videoDuration: "9:35", questionsTotal: 9, isUnlocked: true },
  { id: 16, title: "Meningitis", videoDuration: "9:40", questionsTotal: 9, isUnlocked: false },
  { id: 17, title: "Neural Tube Defects & Hydrocephalus", videoDuration: "10:31", questionsTotal: 6, isUnlocked: false },
  { id: 18, title: "Obstructive & Inflammatory GI Conditions of Childhood", videoDuration: "9:47", questionsTotal: 10, isUnlocked: false },
  { id: 19, title: "Omphalocele & Gastroschisis", videoDuration: "8:28", questionsTotal: 5, isUnlocked: false },
  { id: 20, title: "Otitis Media, Conjunctivitis, & Strabismus", videoDuration: "10:04", questionsTotal: 7, isUnlocked: false },
  { id: 21, title: "Rheumatic Fever & Kawasaki Disease", videoDuration: "11:36", questionsTotal: 7, isUnlocked: false },
  { id: 22, title: "RSV & Bronchiolitis", videoDuration: "9:15", questionsTotal: 5, isUnlocked: false },
  { id: 23, title: "Sickle Cell Disease", videoDuration: "10:29", questionsTotal: 8, isUnlocked: false }
];

const fundamentalsCrashTopics: CrashCourseTopic[] = [
  { id: 1, title: "Acid-Base Imbalances Part 1", videoDuration: "12:06", questionsTotal: 8, isUnlocked: true },
  { id: 2, title: "Acid-Base Imbalances Part 2", videoDuration: "12:29", questionsTotal: 7, isUnlocked: false },
  { id: 3, title: "Bowel Elimination", videoDuration: "10:56", questionsTotal: 9, isUnlocked: true },
  { id: 4, title: "Hearing Loss & Vertigo", videoDuration: "10:46", questionsTotal: 8, isUnlocked: false },
  { id: 5, title: "Infection Control", videoDuration: "11:32", questionsTotal: 8, isUnlocked: false },
  { id: 6, title: "Intracranial Regulation", videoDuration: "12:57", questionsTotal: 8, isUnlocked: false },
  { id: 7, title: "Mobility & Positioning", videoDuration: "12:06", questionsTotal: 7, isUnlocked: false },
  { id: 8, title: "Nutrition", videoDuration: "13:01", questionsTotal: 10, isUnlocked: false },
  { id: 9, title: "Oxygenation", videoDuration: "13:49", questionsTotal: 10, isUnlocked: false },
  { id: 10, title: "Perioperative Care", videoDuration: "10:30", questionsTotal: 10, isUnlocked: false },
  { id: 11, title: "Safety", videoDuration: "9:35", questionsTotal: 10, isUnlocked: true },
  { id: 12, title: "Urinary Elimination", videoDuration: "12:02", questionsTotal: 10, isUnlocked: false },
  { id: 13, title: "Wounds & Hygiene", videoDuration: "10:25", questionsTotal: 10, isUnlocked: false }
];

const maternalNewbornCrashTopics: CrashCourseTopic[] = [
  { id: 1, title: "Abortion, Cervical Insufficiency, & Intrauterine Fetal Demise", videoDuration: "8:53", questionsTotal: 10, isUnlocked: true },
  { id: 2, title: "Antepartum Assessment & Discomforts of Pregnancy", videoDuration: "12:48", questionsTotal: 10, isUnlocked: false },
  { id: 3, title: "Chorioamnionitis & Neonatal Sepsis", videoDuration: "8:50", questionsTotal: 10, isUnlocked: false },
  { id: 4, title: "Ectopic & Molar Pregnancy", videoDuration: "8:48", questionsTotal: 10, isUnlocked: false },
  { id: 5, title: "Preeclampsia & Hypertensive Disorders of Pregnancy", videoDuration: "11:42", questionsTotal: 10, isUnlocked: true },
  { id: 6, title: "Preterm Labor & Delivery", videoDuration: "10:15", questionsTotal: 10, isUnlocked: false },
  { id: 7, title: "Gestational Diabetes Mellitus", videoDuration: "9:45", questionsTotal: 10, isUnlocked: false },
  { id: 8, title: "Labor Stages, Mechanics, & Pain Management", videoDuration: "11:30", questionsTotal: 10, isUnlocked: false },
  { id: 9, title: "Fetal Heart Rate Monitoring & Interventions", videoDuration: "12:15", questionsTotal: 10, isUnlocked: true },
  { id: 10, title: "Obstetric Emergencies (Prolapsed Cord & Placenta Previa)", videoDuration: "11:50", questionsTotal: 10, isUnlocked: false },
  { id: 11, title: "Postpartum Hemorrhage & Uterine Atony", videoDuration: "10:40", questionsTotal: 10, isUnlocked: false },
  { id: 12, title: "Postpartum Assessment, Involutions, & Care", videoDuration: "9:30", questionsTotal: 10, isUnlocked: false },
  { id: 13, title: "Normal Newborn Assessment & Reflexes", videoDuration: "11:10", questionsTotal: 10, isUnlocked: false },
  { id: 14, title: "Newborn Resuscitation, APGAR, & Thermoregulation", videoDuration: "10:05", questionsTotal: 10, isUnlocked: false },
  { id: 15, title: "Hyperbilirubinemia & Neonatal Jaundice", videoDuration: "9:15", questionsTotal: 10, isUnlocked: false },
  { id: 16, title: "Neonatal Abstinence Syndrome & Teratogens", videoDuration: "8:55", questionsTotal: 10, isUnlocked: false },
  { id: 17, title: "Congenital Anomalies & Birth Trauma", videoDuration: "9:40", questionsTotal: 10, isUnlocked: false },
  { id: 18, title: "Infant Feeding: Breastfeeding & Formula", videoDuration: "9:39", questionsTotal: 10, isUnlocked: false }
];

const mentalHealthCrashTopics: CrashCourseTopic[] = [
  { id: 1, title: "Addiction & Substance Use Disorders", videoDuration: "13:24", questionsTotal: 9, isUnlocked: true },
  { id: 2, title: "ADHD & Autism", videoDuration: "9:19", questionsTotal: 9, isUnlocked: true },
  { id: 3, title: "Aggression, Abuse, & Assault", videoDuration: "12:04", questionsTotal: 10, isUnlocked: false },
  { id: 4, title: "Anxiety & OCD", videoDuration: "10:10", questionsTotal: 9, isUnlocked: true },
  { id: 5, title: "Bipolar Disorders", videoDuration: "10:20", questionsTotal: 6, isUnlocked: false },
  { id: 6, title: "Dementia & Delirium", videoDuration: "11:41", questionsTotal: 7, isUnlocked: false },
  { id: 7, title: "Depression & Suicide", videoDuration: "9:54", questionsTotal: 8, isUnlocked: true },
  { id: 8, title: "Eating Disorders", videoDuration: "11:42", questionsTotal: 6, isUnlocked: false },
  { id: 9, title: "Personality Disorders", videoDuration: "11:59", questionsTotal: 7, isUnlocked: false },
  { id: 10, title: "Schizophrenia", videoDuration: "12:03", questionsTotal: 10, isUnlocked: true },
  { id: 11, title: "Therapeutic Communication", videoDuration: "10:37", questionsTotal: 6, isUnlocked: false },
  { id: 12, title: "Trauma, Stress, & Coping", videoDuration: "11:56", questionsTotal: 6, isUnlocked: false }
];

const pharmacologyCrashTopics: CrashCourseTopic[] = [
  { id: 1, title: "Acid-Controlling Medications", videoDuration: "10:38", questionsTotal: 9, isUnlocked: true },
  { id: 2, title: "Analgesics", videoDuration: "11:37", questionsTotal: 8, isUnlocked: false },
  { id: 3, title: "Antibiotic Medications", videoDuration: "12:46", questionsTotal: 9, isUnlocked: false },
  { id: 4, title: "Anticoagulants & Antiplatelets", videoDuration: "15:28", questionsTotal: 9, isUnlocked: false },
  { id: 5, title: "Antidepressants", videoDuration: "10:05", questionsTotal: 9, isUnlocked: true },
  { id: 6, title: "Antidysrhythmics", videoDuration: "11:33", questionsTotal: 7, isUnlocked: false },
  { id: 7, title: "Antiepileptic Drugs", videoDuration: "12:22", questionsTotal: 7, isUnlocked: false },
  { id: 8, title: "Antihypertensives", videoDuration: "11:26", questionsTotal: 10, isUnlocked: false },
  { id: 9, title: "Antipsychotics", videoDuration: "10:34", questionsTotal: 6, isUnlocked: false },
  { id: 10, title: "Anxiolytics & Sedative Hypnotics", videoDuration: "9:44", questionsTotal: 5, isUnlocked: false },
  { id: 11, title: "Asthma & COPD Medications", videoDuration: "9:23", questionsTotal: 8, isUnlocked: false },
  { id: 12, title: "Chemotherapy & Hematologic Medications", videoDuration: "13:26", questionsTotal: 8, isUnlocked: false },
  { id: 13, title: "Cold, Flu, & Allergy Medications", videoDuration: "10:51", questionsTotal: 6, isUnlocked: false },
  { id: 14, title: "Corticosteroids", videoDuration: "11:00", questionsTotal: 6, isUnlocked: false },
  { id: 15, title: "Diabetes Drugs", videoDuration: "13:24", questionsTotal: 7, isUnlocked: false },
  { id: 16, title: "Diuretics", videoDuration: "9:40", questionsTotal: 7, isUnlocked: false },
  { id: 17, title: "GI Medications", videoDuration: "12:17", questionsTotal: 10, isUnlocked: true },
  { id: 18, title: "Integumentary Medications", videoDuration: "8:49", questionsTotal: 6, isUnlocked: false },
  { id: 19, title: "Male & Female Reproductive Medications", videoDuration: "7:53", questionsTotal: 7, isUnlocked: false },
  { id: 20, title: "Medication Administration Part 1", videoDuration: "12:24", questionsTotal: 8, isUnlocked: false },
  { id: 21, title: "Medication Administration Part 2", videoDuration: "11:45", questionsTotal: 8, isUnlocked: false },
  { id: 22, title: "Ophthalmic & Otic Medications", videoDuration: "8:15", questionsTotal: 6, isUnlocked: false },
  { id: 23, title: "Thyroid & Endocrine Medications", videoDuration: "10:12", questionsTotal: 7, isUnlocked: false }
];

interface CrashLessonItem {
  id: string;
  type: "video" | "bites";
  title: string;
  duration?: string;
  questionsTotal?: number;
  isUnlocked: boolean;
}

const managementOfCareCrashLessons: CrashLessonItem[] = [
  { id: "moc-c1", type: "video", title: "Delegation & Assignment Part 1", duration: "14:21", isUnlocked: true },
  { id: "moc-c2", type: "video", title: "Delegation & Assignment Part 2", duration: "13:07", isUnlocked: true },
  { id: "moc-c3", type: "bites", title: "Delegation & Assignment", questionsTotal: 5, isUnlocked: false },
  { id: "moc-c4", type: "video", title: "Ethics", duration: "12:01", isUnlocked: false },
  { id: "moc-c5", type: "bites", title: "Ethics", questionsTotal: 7, isUnlocked: false },
  { id: "moc-c6", type: "video", title: "Legal", duration: "10:39", isUnlocked: true },
  { id: "moc-c7", type: "bites", title: "Legal", questionsTotal: 10, isUnlocked: true },
  { id: "moc-c8", type: "video", title: "Management Principles", duration: "11:07", isUnlocked: true },
  { id: "moc-c9", type: "bites", title: "Management Principles", questionsTotal: 8, isUnlocked: true },
  { id: "moc-c10", type: "video", title: "Prioritization Part 1: Prioritization Toolkit", duration: "14:06", isUnlocked: false },
  { id: "moc-c11", type: "video", title: "Prioritization Part 2: Practice Questions", duration: "11:15", isUnlocked: false },
  { id: "moc-c12", type: "bites", title: "Prioritization", questionsTotal: 9, isUnlocked: false }
];

const fundamentalsCrashLessons: CrashLessonItem[] = [
  { id: "fun-c1", type: "video", title: "Vital Signs & Patient Assessment", duration: "10:15", isUnlocked: true },
  { id: "fun-c2", type: "bites", title: "Vital Signs", questionsTotal: 5, isUnlocked: true },
  { id: "fun-c3", type: "video", title: "Fluid & Electrolyte Imbalances", duration: "12:40", isUnlocked: true },
  { id: "fun-c4", type: "bites", title: "Fluid & Electrolytes", questionsTotal: 8, isUnlocked: true },
  { id: "fun-c5", type: "video", title: "Acid-Base Disorders & ABG Interpretation", duration: "11:20", isUnlocked: false },
  { id: "fun-c6", type: "bites", title: "Acid-Base", questionsTotal: 6, isUnlocked: false },
  { id: "fun-c7", type: "video", title: "Medication Administration Principles", duration: "10:30", isUnlocked: false },
  { id: "fun-c8", type: "bites", title: "Medication Administration", questionsTotal: 6, isUnlocked: false },
  { id: "fun-c9", type: "video", title: "Safety, Fall Prevention, & Restraints", duration: "9:50", isUnlocked: false },
  { id: "fun-c10", type: "bites", title: "Safety & Restraints", questionsTotal: 5, isUnlocked: false },
  { id: "fun-c11", type: "video", title: "Infection Control & Precautions", duration: "12:05", isUnlocked: false },
  { id: "fun-c12", type: "bites", title: "Infection Control", questionsTotal: 7, isUnlocked: false }
];

const maternalNewbornCrashLessons: CrashLessonItem[] = [
  { id: "mat-c1", type: "video", title: "Signs of Pregnancy & Due Date Calculation", duration: "9:45", isUnlocked: true },
  { id: "mat-c2", type: "bites", title: "Pregnancy Basics", questionsTotal: 5, isUnlocked: true },
  { id: "mat-c3", type: "video", title: "Fetal Heart Rate Monitoring & VEAL CHOP", duration: "13:10", isUnlocked: true },
  { id: "mat-c4", type: "bites", title: "FHR Decelerations & Monitoring", questionsTotal: 7, isUnlocked: true },
  { id: "mat-c5", type: "video", title: "Stages of Labor & Interventions", duration: "11:30", isUnlocked: false },
  { id: "mat-c6", type: "bites", title: "Labor Stages", questionsTotal: 6, isUnlocked: false },
  { id: "mat-c7", type: "video", title: "Preeclampsia, Eclampsia, & Magnesium Sulfate", duration: "12:15", isUnlocked: false },
  { id: "mat-c8", type: "bites", title: "Hypertensive Disorders", questionsTotal: 8, isUnlocked: false },
  { id: "mat-c9", type: "video", title: "Postpartum Hemorrhage & Uterine Atony", duration: "10:50", isUnlocked: false },
  { id: "mat-c10", type: "bites", title: "Postpartum Complications", questionsTotal: 6, isUnlocked: false },
  { id: "mat-c11", type: "video", title: "Newborn Assessment & APGAR Scoring", duration: "11:40", isUnlocked: false },
  { id: "mat-c12", type: "bites", title: "Newborn Assessment", questionsTotal: 7, isUnlocked: false }
];

const mentalHealthCrashLessons: CrashLessonItem[] = [
  { id: "mh-c1", type: "video", title: "Therapeutic Communication Principles", duration: "11:10", isUnlocked: true },
  { id: "mh-c2", type: "bites", title: "Therapeutic Communication", questionsTotal: 6, isUnlocked: true },
  { id: "mh-c3", type: "video", title: "Depression & Suicide Risk Assessment", duration: "12:25", isUnlocked: true },
  { id: "mh-c4", type: "bites", title: "Depression & Suicide Assessment", questionsTotal: 8, isUnlocked: true },
  { id: "mh-c5", type: "video", title: "Bipolar Disorder, Mania, & Lithium", duration: "10:50", isUnlocked: false },
  { id: "mh-c6", type: "bites", title: "Bipolar Disorder", questionsTotal: 6, isUnlocked: false },
  { id: "mh-c7", type: "video", title: "Schizophrenia, Hallucinations, & Delusions", duration: "13:00", isUnlocked: false },
  { id: "mh-c8", type: "bites", title: "Psychotic Disorders", questionsTotal: 7, isUnlocked: false },
  { id: "mh-c9", type: "video", title: "Anxiety Disorders & Panic Attacks", duration: "9:40", isUnlocked: false },
  { id: "mh-c10", type: "bites", title: "Anxiety Disorders", questionsTotal: 5, isUnlocked: false },
  { id: "mh-c11", type: "video", title: "Alcohol Withdrawal & CIWA Protocol", duration: "11:35", isUnlocked: false },
  { id: "mh-c12", type: "bites", title: "Substance Use & Withdrawal", questionsTotal: 7, isUnlocked: false }
];

const pharmacologyCrashLessons: CrashLessonItem[] = [
  { id: "ph-c1", type: "video", title: "Cardiac Meds: Beta Blockers, ACEi, ARBs & Digoxin", duration: "14:15", isUnlocked: true },
  { id: "ph-c2", type: "video", title: "Antibiotics: Penicillins, Cephalosporins & Vancomycin", duration: "13:20", isUnlocked: true },
  { id: "ph-c3", type: "bites", title: "Antimicrobial Therapy", questionsTotal: 8, isUnlocked: true },
  { id: "ph-c4", type: "video", title: "Insulin Formulations, Peaks, & Hypoglycemia", duration: "12:45", isUnlocked: false },
  { id: "ph-c5", type: "bites", title: "Endocrine Pharmacology", questionsTotal: 7, isUnlocked: false },
  { id: "ph-c6", type: "video", title: "Psych Meds: SSRIs, SNRIs & Antipsychotics", duration: "13:50", isUnlocked: false },
  { id: "ph-c7", type: "bites", title: "Psychiatric Meds", questionsTotal: 8, isUnlocked: false },
  { id: "ph-c8", type: "video", title: "Anticoagulants: Heparin, Warfarin & DOACs", duration: "12:10", isUnlocked: false },
  { id: "ph-c9", type: "bites", title: "Anticoagulation", questionsTotal: 7, isUnlocked: false },
  { id: "ph-c10", type: "video", title: "Respiratory Drugs: Bronchodilators & Steroids", duration: "10:30", isUnlocked: false },
  { id: "ph-c11", type: "bites", title: "Respiratory Pharmacology", questionsTotal: 6, isUnlocked: false },
  { id: "ph-c12", type: "video", title: "Analgesics: Opioids, NSAIDs, & Naloxone", duration: "11:05", isUnlocked: false }
];

interface CrashHubSubjectItem {
  id: string;
  num: number;
  name: string;
  completedLessons: number;
  totalLessons: number;
  runtime: string;
}

const crashCourseHubSubjects: CrashHubSubjectItem[] = [
  { id: "adult-health", num: 1, name: "Adult Health", completedLessons: 0, totalLessons: 94, runtime: "8h 45m" },
  { id: "child-health", num: 2, name: "Child Health", completedLessons: 0, totalLessons: 46, runtime: "4h 05m" },
  { id: "fundamentals", num: 3, name: "Fundamentals", completedLessons: 0, totalLessons: 26, runtime: "2h 32m" },
  { id: "maternal-newborn", num: 4, name: "Maternal & Newborn Health", completedLessons: 0, totalLessons: 26, runtime: "2h 05m" },
  { id: "mental-health", num: 5, name: "Mental Health", completedLessons: 0, totalLessons: 24, runtime: "2h 15m" },
  { id: "pharmacology", num: 6, name: "Pharmacology", completedLessons: 0, totalLessons: 46, runtime: "4h 20m" },
  { id: "management-of-care", num: 7, name: "Management of Care", completedLessons: 0, totalLessons: 12, runtime: "1h 26m" }
];

const crashStatsConfig: Record<string, { lessonsTotal: number; runtime: string }> = {
  "adult-health": { lessonsTotal: 94, runtime: "8h 45m" },
  "child-health": { lessonsTotal: 46, runtime: "4h 05m" },
  "fundamentals": { lessonsTotal: 26, runtime: "2h 32m" },
  "maternal-newborn": { lessonsTotal: 26, runtime: "2h 05m" },
  "mental-health": { lessonsTotal: 24, runtime: "2h 15m" },
  "pharmacology": { lessonsTotal: 46, runtime: "4h 20m" },
  "management-of-care": { lessonsTotal: 12, runtime: "1h 26m" }
};

const cheatSheetCategories = [
  "All Adult Health",
  "Cardiovascular",
  "Critical Care",
  "Endocrine",
  "Gastrointestinal",
  "Hematologic",
  "Immune/Infectious Disease",
  "Integumentary",
  "Musculoskeletal",
  "Neurologic",
  "Reproductive",
  "Respiratory",
  "Urinary & Renal",
  "Visual & Auditory"
];

const childHealthCheatSheetCategories = [
  "All Child Health",
  "Cardiovascular",
  "Gastrointestinal",
  "Growth & Development",
  "Hematologic",
  "Immune/Infectious Disease",
  "Integumentary",
  "Musculoskeletal",
  "Neurologic",
  "Respiratory",
  "Urinary & Renal",
  "Visual & Auditory"
];

const fundamentalsCheatSheetCategories = [
  "All Fundamentals",
  "Basic Care & Comfort",
  "Fluid, Electrolytes, and Acid-Base Balance",
  "Gastrointestinal",
  "Multisystem",
  "Safety & Infection Control",
  "Urinary & Renal"
];

const maternalNewbornCheatSheetCategories = [
  "All Maternal & Newborn Health",
  "Antepartum",
  "Labor & Delivery",
  "Newborn",
  "Postpartum",
  "Reproductive"
];

const mentalHealthCheatSheetCategories = [
  "All Mental Health",
  "Anxiety Disorders, Trauma, and Addiction",
  "Cognitive & Developmental Disorders",
  "Foundations & Therapeutic Communication",
  "Mood & Personality Disorders"
];

const pharmacologyCheatSheetCategories = [
  "All Pharmacology",
  "Cardiovascular",
  "Endocrine",
  "Gastrointestinal",
  "Hematologic / Oncologic",
  "Immune",
  "Integumentary",
  "Medication Administration",
  "Musculoskeletal",
  "Neurologic",
  "Psychiatric",
  "Reproductive",
  "Respiratory"
];

const managementOfCareCheatSheetCategories = [
  "All Management of Care",
  "Assignment & Delegation",
  "Management Concepts"
];

interface CheatSheetItem {
  id: number;
  title: string;
  subtitle: string;
  system: string;
  isUnlocked: boolean;
}

const adultHealthCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "DVT & PE", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: true },
  { id: 2, title: "Diabetes", subtitle: "Adult Health", system: "Endocrine", isUnlocked: true },
  { id: 3, title: "Acute & Concerning Skin Conditions", subtitle: "Adult Health", system: "Integumentary", isUnlocked: false },
  { id: 4, title: "Acute Kidney Injury & Chronic Kidney Disease", subtitle: "Adult Health", system: "Urinary & Renal", isUnlocked: false },
  { id: 5, title: "Anemia & Leukemia", subtitle: "Adult Health", system: "Hematologic", isUnlocked: false },
  { id: 6, title: "Appendicitis, Diverticulitis, & Bowel Obstruction", subtitle: "Adult Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 7, title: "Arthritis & Osteoporosis", subtitle: "Adult Health", system: "Musculoskeletal", isUnlocked: false },
  { id: 8, title: "Coronary Artery Disease & Myocardial Infarction", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: false },
  { id: 9, title: "BPH & Prostate Cancer", subtitle: "Adult Health", system: "Reproductive", isUnlocked: false },
  { id: 10, title: "Brain Injuries & Increased ICP", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 11, title: "Burns & Inhalation Injury", subtitle: "Adult Health", system: "Integumentary", isUnlocked: false },
  { id: 12, title: "Cancer", subtitle: "Adult Health", system: "Immune/Infectious Disease", isUnlocked: false },
  { id: 13, title: "Cholecystitis & Pancreatitis", subtitle: "Adult Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 14, title: "Chronic Obstructive Pulmonary Disease (COPD)", subtitle: "Adult Health", system: "Respiratory", isUnlocked: false },
  { id: 15, title: "Cranial Nerves, Bell Palsy, & Trigeminal Neuralgia", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 16, title: "Cushing & Addison Disease", subtitle: "Adult Health", system: "Endocrine", isUnlocked: false },
  { id: 17, title: "ECG Interpretation, Dysrhythmias, & Pacemakers", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: false },
  { id: 18, title: "Endocarditis, Pericarditis, & Cardiac Tamponade", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: false },
  { id: 19, title: "Eye Conditions", subtitle: "Adult Health", system: "Visual & Auditory", isUnlocked: false },
  { id: 20, title: "Fractures", subtitle: "Adult Health", system: "Musculoskeletal", isUnlocked: false },
  { id: 21, title: "GERD, Peptic Ulcer Disease, & GI Bleeding", subtitle: "Adult Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 22, title: "HIV & AIDS", subtitle: "Adult Health", system: "Immune/Infectious Disease", isUnlocked: false },
  { id: 23, title: "Hearing Loss & Vertigo", subtitle: "Adult Health", system: "Visual & Auditory", isUnlocked: false },
  { id: 24, title: "Heart Failure", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: false },
  { id: 25, title: "Hemodynamics & Vasoactive Medications", subtitle: "Adult Health", system: "Critical Care", isUnlocked: false },
  { id: 26, title: "Hepatitis, Cirrhosis, & Esophageal Varices", subtitle: "Adult Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 27, title: "Hypertension", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: false },
  { id: 28, title: "Infectious Disease & Isolation Precautions", subtitle: "Adult Health", system: "Immune/Infectious Disease", isUnlocked: false },
  { id: 29, title: "Meningitis, Encephalitis, & Lumbar Puncture", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 30, title: "Multiple Sclerosis, ALS, & Myasthenia Gravis", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 31, title: "Parkinson & Alzheimer Disease", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 32, title: "Pneumonia & Tuberculosis", subtitle: "Adult Health", system: "Respiratory", isUnlocked: false },
  { id: 33, title: "Pneumothorax, Hemothorax, & Chest Tubes", subtitle: "Adult Health", system: "Respiratory", isUnlocked: false },
  { id: 34, title: "Renal Calculi & Dialysis", subtitle: "Adult Health", system: "Urinary & Renal", isUnlocked: false },
  { id: 35, title: "Seizure Disorders & Status Epilepticus", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 36, title: "Shock & Sepsis", subtitle: "Adult Health", system: "Critical Care", isUnlocked: false },
  { id: 37, title: "Spinal Cord Injury & Autonomic Dysreflexia", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 38, title: "Stroke (Ischemic vs Hemorrhagic)", subtitle: "Adult Health", system: "Neurologic", isUnlocked: false },
  { id: 39, title: "Systemic Lupus Erythematosus (SLE)", subtitle: "Adult Health", system: "Immune/Infectious Disease", isUnlocked: false },
  { id: 40, title: "Thyroid Disorders & Thyroid Storm", subtitle: "Adult Health", system: "Endocrine", isUnlocked: false },
  { id: 41, title: "Ventilator Management & ABGs", subtitle: "Adult Health", system: "Critical Care", isUnlocked: false }
];

const childHealthCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "Growth & Development", subtitle: "Child Health", system: "Growth & Development", isUnlocked: true },
  { id: 2, title: "Asthma", subtitle: "Child Health", system: "Respiratory", isUnlocked: true },
  { id: 3, title: "Bites, Stings, & Irritants", subtitle: "Child Health", system: "Integumentary", isUnlocked: false },
  { id: 4, title: "Childhood Musculoskeletal Conditions", subtitle: "Child Health", system: "Musculoskeletal", isUnlocked: false },
  { id: 5, title: "Cleft Palate, Tracheoesophageal Fistula, & Reflux", subtitle: "Child Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 6, title: "Common Skin Conditions", subtitle: "Child Health", system: "Integumentary", isUnlocked: false },
  { id: 7, title: "Congenital Heart Defects", subtitle: "Child Health", system: "Cardiovascular", isUnlocked: false },
  { id: 8, title: "Croup, Epiglottitis, & Tonsillitis", subtitle: "Child Health", system: "Respiratory", isUnlocked: false },
  { id: 9, title: "Cystic Fibrosis", subtitle: "Child Health", system: "Respiratory", isUnlocked: false },
  { id: 10, title: "Developmental Theories & Play", subtitle: "Child Health", system: "Growth & Development", isUnlocked: false },
  { id: 11, title: "Glomerulonephritis, Nephrotic Syndrome, & Nephroblastoma", subtitle: "Child Health", system: "Urinary & Renal", isUnlocked: false },
  { id: 12, title: "Hemophilia", subtitle: "Child Health", system: "Hematologic", isUnlocked: false },
  { id: 13, title: "Infant & Child Safety", subtitle: "Child Health", system: "Growth & Development", isUnlocked: false },
  { id: 14, title: "Infectious Diseases of Childhood", subtitle: "Child Health", system: "Immune/Infectious Disease", isUnlocked: false },
  { id: 15, title: "Meningitis", subtitle: "Child Health", system: "Neurologic", isUnlocked: false },
  { id: 16, title: "Neural Tube Defects & Hydrocephalus", subtitle: "Child Health", system: "Neurologic", isUnlocked: false },
  { id: 17, title: "Omphalocele & Gastroschisis", subtitle: "Child Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 18, title: "Otitis Media, Conjunctivitis, & Strabismus", subtitle: "Child Health", system: "Visual & Auditory", isUnlocked: false },
  { id: 19, title: "Pyloric Stenosis, Intussusception, & Hirschsprung Disease", subtitle: "Child Health", system: "Gastrointestinal", isUnlocked: false },
  { id: 20, title: "RSV & Bronchiolitis", subtitle: "Child Health", system: "Respiratory", isUnlocked: false },
  { id: 21, title: "Rheumatic Fever & Kawasaki Disease", subtitle: "Child Health", system: "Cardiovascular", isUnlocked: false },
  { id: 22, title: "Sickle Cell Disease", subtitle: "Child Health", system: "Hematologic", isUnlocked: false }
];

const fundamentalsCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "Infection Control", subtitle: "Fundamentals", system: "Safety & Infection Control", isUnlocked: true },
  { id: 2, title: "Acid-Base Imbalances", subtitle: "Fundamentals", system: "Fluid, Electrolytes, and Acid-Base Balance", isUnlocked: false },
  { id: 3, title: "Bowel Elimination", subtitle: "Fundamentals", system: "Gastrointestinal", isUnlocked: false },
  { id: 4, title: "Fluid & Electrolyte Imbalances", subtitle: "Fundamentals", system: "Fluid, Electrolytes, and Acid-Base Balance", isUnlocked: false },
  { id: 5, title: "IV Therapy & Transfusions", subtitle: "Fundamentals", system: "Fluid, Electrolytes, and Acid-Base Balance", isUnlocked: false },
  { id: 6, title: "Intracranial Regulation", subtitle: "Fundamentals", system: "Multisystem", isUnlocked: false },
  { id: 7, title: "Mobility & Positioning", subtitle: "Fundamentals", system: "Basic Care & Comfort", isUnlocked: false },
  { id: 8, title: "Nutrition", subtitle: "Fundamentals", system: "Basic Care & Comfort", isUnlocked: false },
  { id: 9, title: "Oxygenation", subtitle: "Fundamentals", system: "Multisystem", isUnlocked: false },
  { id: 10, title: "Perfusion", subtitle: "Fundamentals", system: "Multisystem", isUnlocked: false },
  { id: 11, title: "Perioperative Care", subtitle: "Fundamentals", system: "Multisystem", isUnlocked: false },
  { id: 12, title: "Safety", subtitle: "Fundamentals", system: "Safety & Infection Control", isUnlocked: false },
  { id: 13, title: "Urinary Elimination", subtitle: "Fundamentals", system: "Urinary & Renal", isUnlocked: false },
  { id: 14, title: "Wounds, Hygiene, & Comfort", subtitle: "Fundamentals", system: "Basic Care & Comfort", isUnlocked: false }
];

const maternalNewbornCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "Preeclampsia", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: true },
  { id: 2, title: "Preterm Labor & Delivery", subtitle: "Maternal & Newborn Health", system: "Labor & Delivery", isUnlocked: true },
  { id: 3, title: "Antepartum Assessment & Discomforts of Pregnancy", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: false },
  { id: 4, title: "Chorioamnionitis & Neonatal Sepsis", subtitle: "Maternal & Newborn Health", system: "Labor & Delivery", isUnlocked: false },
  { id: 5, title: "Ectopic & Molar Pregnancy", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: false },
  { id: 6, title: "Fetal Monitoring", subtitle: "Maternal & Newborn Health", system: "Labor & Delivery", isUnlocked: false },
  { id: 7, title: "Gestational Diabetes", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: false },
  { id: 8, title: "Hyperbilirubinemia & Hemolytic Disease of the Newborn", subtitle: "Maternal & Newborn Health", system: "Newborn", isUnlocked: false },
  { id: 9, title: "Labor Emergencies", subtitle: "Maternal & Newborn Health", system: "Labor & Delivery", isUnlocked: false },
  { id: 10, title: "Neonatal Abstinence Syndrome & Fetal Alcohol Syndrome", subtitle: "Maternal & Newborn Health", system: "Newborn", isUnlocked: false },
  { id: 11, title: "Newborn Care", subtitle: "Maternal & Newborn Health", system: "Newborn", isUnlocked: false },
  { id: 12, title: "Newborn Respiratory Complications", subtitle: "Maternal & Newborn Health", system: "Newborn", isUnlocked: false },
  { id: 13, title: "OB Medications", subtitle: "Maternal & Newborn Health", system: "Reproductive", isUnlocked: false },
  { id: 14, title: "Placenta Previa & Placental Abruption", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: false },
  { id: 15, title: "Postpartum Care", subtitle: "Maternal & Newborn Health", system: "Postpartum", isUnlocked: false },
  { id: 16, title: "Postpartum Hemorrhage (PPH)", subtitle: "Maternal & Newborn Health", system: "Postpartum", isUnlocked: false },
  { id: 17, title: "Process of Labor & OB Procedures", subtitle: "Maternal & Newborn Health", system: "Labor & Delivery", isUnlocked: false },
  { id: 18, title: "Spontaneous Abortion, Incompetent Cervix, & Intrauterine Fetal Demise", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: false },
  { id: 19, title: "TORCH Infections", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: false }
];

const mentalHealthCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "Depression & Suicide", subtitle: "Mental Health", system: "Mood & Personality Disorders", isUnlocked: true },
  { id: 2, title: "Therapeutic Communication", subtitle: "Mental Health", system: "Foundations & Therapeutic Communication", isUnlocked: true },
  { id: 3, title: "ADHD & Autism", subtitle: "Mental Health", system: "Cognitive & Developmental Disorders", isUnlocked: false },
  { id: 4, title: "Addiction & Substance Use Disorders", subtitle: "Mental Health", system: "Anxiety Disorders, Trauma, and Addiction", isUnlocked: false },
  { id: 5, title: "Aggression, Abuse, & Assault", subtitle: "Mental Health", system: "Foundations & Therapeutic Communication", isUnlocked: false },
  { id: 6, title: "Anxiety & OCD", subtitle: "Mental Health", system: "Anxiety Disorders, Trauma, and Addiction", isUnlocked: false },
  { id: 7, title: "Bipolar Disorders", subtitle: "Mental Health", system: "Mood & Personality Disorders", isUnlocked: false },
  { id: 8, title: "Dementia & Delirium", subtitle: "Mental Health", system: "Cognitive & Developmental Disorders", isUnlocked: false },
  { id: 9, title: "Eating Disorders", subtitle: "Mental Health", system: "Anxiety Disorders, Trauma, and Addiction", isUnlocked: false },
  { id: 10, title: "Personality Disorders", subtitle: "Mental Health", system: "Mood & Personality Disorders", isUnlocked: false },
  { id: 11, title: "Schizophrenia", subtitle: "Mental Health", system: "Cognitive & Developmental Disorders", isUnlocked: false },
  { id: 12, title: "Trauma, Stress, & Coping", subtitle: "Mental Health", system: "Anxiety Disorders, Trauma, and Addiction", isUnlocked: false }
];

const pharmacologyCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "Analgesics", subtitle: "Pharmacology", system: "Neurologic", isUnlocked: true },
  { id: 2, title: "Acid-Controlling Medications", subtitle: "Pharmacology", system: "Gastrointestinal", isUnlocked: false },
  { id: 3, title: "Antibiotics", subtitle: "Pharmacology", system: "Immune", isUnlocked: false },
  { id: 4, title: "Anticoagulants & Antiplatelets", subtitle: "Pharmacology", system: "Cardiovascular", isUnlocked: false },
  { id: 5, title: "Antidepressants", subtitle: "Pharmacology", system: "Psychiatric", isUnlocked: false },
  { id: 6, title: "Antidysrhythmics", subtitle: "Pharmacology", system: "Cardiovascular", isUnlocked: false },
  { id: 7, title: "Antiepileptic Medications", subtitle: "Pharmacology", system: "Neurologic", isUnlocked: false },
  { id: 8, title: "Antihypertensives", subtitle: "Pharmacology", system: "Cardiovascular", isUnlocked: false },
  { id: 9, title: "Antipsychotics", subtitle: "Pharmacology", system: "Psychiatric", isUnlocked: false },
  { id: 10, title: "Anxiolytics and Sedative-Hypnotics", subtitle: "Pharmacology", system: "Psychiatric", isUnlocked: false },
  { id: 11, title: "Asthma & COPD Medications", subtitle: "Pharmacology", system: "Respiratory", isUnlocked: false },
  { id: 12, title: "Chemotherapy & Hematologic Medications", subtitle: "Pharmacology", system: "Hematologic / Oncologic", isUnlocked: false },
  { id: 13, title: "Cold, Flu, & Allergy Medications", subtitle: "Pharmacology", system: "Respiratory", isUnlocked: false },
  { id: 14, title: "Corticosteroids", subtitle: "Pharmacology", system: "Endocrine", isUnlocked: false },
  { id: 15, title: "Diabetes Medications", subtitle: "Pharmacology", system: "Endocrine", isUnlocked: false },
  { id: 16, title: "Diuretics", subtitle: "Pharmacology", system: "Cardiovascular", isUnlocked: false },
  { id: 17, title: "Dosage Calculation", subtitle: "Pharmacology", system: "Medication Administration", isUnlocked: false },
  { id: 18, title: "GI Medications", subtitle: "Pharmacology", system: "Gastrointestinal", isUnlocked: false },
  { id: 19, title: "Integumentary Medications", subtitle: "Pharmacology", system: "Integumentary", isUnlocked: false },
  { id: 20, title: "Male & Female Reproductive Medications", subtitle: "Pharmacology", system: "Reproductive", isUnlocked: false },
  { id: 21, title: "Medication Administration", subtitle: "Pharmacology", system: "Medication Administration", isUnlocked: false },
  { id: 22, title: "Musculoskeletal Medications", subtitle: "Pharmacology", system: "Musculoskeletal", isUnlocked: false }
];

const managementOfCareCheatSheets: CheatSheetItem[] = [
  { id: 1, title: "Prioritization", subtitle: "Management of Care", system: "Assignment & Delegation", isUnlocked: true },
  { id: 2, title: "Delegation & Assignment", subtitle: "Management of Care", system: "Assignment & Delegation", isUnlocked: false },
  { id: 3, title: "Ethics", subtitle: "Management of Care", system: "Management Concepts", isUnlocked: false },
  { id: 4, title: "Legal", subtitle: "Management of Care", system: "Management Concepts", isUnlocked: false },
  { id: 5, title: "Management Principles", subtitle: "Management of Care", system: "Management Concepts", isUnlocked: false }
];

const cheatHubSubjects = [
  { id: "all", name: "All", icon: Sparkles },
  { id: "adult-health", name: "Adult Health", icon: Heart },
  { id: "child-health", name: "Child Health", icon: Baby },
  { id: "fundamentals", name: "Fundamentals", icon: BicepsFlexed },
  { id: "management-of-care", name: "Management Of Care", icon: Plus },
  { id: "maternal-newborn", name: "Maternal & Newborn Health", icon: Milk },
  { id: "mental-health", name: "Mental Health", icon: Brain },
  { id: "pharmacology", name: "Pharmacology", icon: Pill }
];

const allHubCheatSystems = [
  "All Systems",
  "Cardiovascular",
  "Endocrine",
  "Gastrointestinal",
  "Immune/Infectious Disease",
  "Musculoskeletal",
  "Neurologic",
  "Respiratory",
  "Urinary & Renal"
];

const allHubCheatSheetsCombined: CheatSheetItem[] = [
  { id: 101, title: "DVT & PE", subtitle: "Adult Health", system: "Cardiovascular", isUnlocked: true },
  { id: 102, title: "Diabetes", subtitle: "Adult Health", system: "Endocrine", isUnlocked: true },
  { id: 103, title: "Asthma", subtitle: "Child Health", system: "Respiratory", isUnlocked: true },
  { id: 104, title: "Growth & Development", subtitle: "Child Health", system: "Growth & Development", isUnlocked: true },
  { id: 105, title: "Infection Control", subtitle: "Fundamentals", system: "Safety & Infection Control", isUnlocked: true },
  { id: 106, title: "Prioritization", subtitle: "Management of Care", system: "Assignment & Delegation", isUnlocked: true },
  { id: 107, title: "Preeclampsia", subtitle: "Maternal & Newborn Health", system: "Antepartum", isUnlocked: true },
  { id: 108, title: "Preterm Labor & Delivery", subtitle: "Maternal & Newborn Health", system: "Labor & Delivery", isUnlocked: true },
  { id: 109, title: "Depression & Suicide", subtitle: "Mental Health", system: "Mood & Personality Disorders", isUnlocked: true },
  { id: 110, title: "Therapeutic Communication", subtitle: "Mental Health", system: "Foundations & Therapeutic Communication", isUnlocked: true },
  { id: 111, title: "Analgesics", subtitle: "Pharmacology", system: "Neurologic", isUnlocked: true },
  ...adultHealthCheatSheets.filter((c) => !c.isUnlocked),
  ...childHealthCheatSheets.filter((c) => !c.isUnlocked),
  ...fundamentalsCheatSheets.filter((c) => !c.isUnlocked),
  ...maternalNewbornCheatSheets.filter((c) => !c.isUnlocked),
  ...mentalHealthCheatSheets.filter((c) => !c.isUnlocked),
  ...pharmacologyCheatSheets.filter((c) => !c.isUnlocked),
  ...managementOfCareCheatSheets.filter((c) => !c.isUnlocked)
];

interface StrategyCourseModule {
  id: string;
  num: number;
  title: string;
  totalLessons: number;
  completedLessons: number;
  runtime: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    isUnlocked: boolean;
  }[];
}

const strategyCourseModules: StrategyCourseModule[] = [
  {
    id: "basics",
    num: 1,
    title: "Next Gen NCLEX: The Basics",
    totalLessons: 3,
    completedLessons: 0,
    runtime: "34m",
    lessons: [
      { id: "strat-1", title: "What is the Next Gen NCLEX?", duration: "11:20", isUnlocked: true },
      { id: "strat-2", title: "Clinical Judgment Measurement Model (CJMM)", duration: "12:15", isUnlocked: true },
      { id: "strat-3", title: "Scoring Rules & Partial Credit", duration: "10:25", isUnlocked: true }
    ]
  },
  {
    id: "approach",
    num: 2,
    title: "How to Approach a Case",
    totalLessons: 4,
    completedLessons: 0,
    runtime: "35m",
    lessons: [
      { id: "strat-4", title: "Recognizing & Analyzing Cues", duration: "8:45", isUnlocked: true },
      { id: "strat-5", title: "Prioritizing Hypotheses & Solutions", duration: "9:30", isUnlocked: true },
      { id: "strat-6", title: "Taking Action & Evaluating Outcomes", duration: "8:15", isUnlocked: true },
      { id: "strat-7", title: "Pacing & Time Management on Cases", duration: "8:30", isUnlocked: true }
    ]
  },
  {
    id: "walkthrough",
    num: 3,
    title: "Full Case and Question Walkthrough",
    totalLessons: 2,
    completedLessons: 0,
    runtime: "45m",
    lessons: [
      { id: "strat-8", title: "Complete 6-Question Case Study Live Walkthrough", duration: "24:10", isUnlocked: true },
      { id: "strat-9", title: "High-Yield Strategies, Traps, & Post-Exam Review", duration: "20:50", isUnlocked: true }
    ]
  }
];

interface PerformanceSubject {
  id: string;
  name: string;
  score: number;
  avgScore: string;
  used: number;
  total: number;
  icon: typeof Heart | typeof BicepsFlexed | any;
  iconColor: string;
  time: string;
  avgTime: string;
  systems: {
    name: string;
    score: number;
    avgScore: string;
    used: number;
    total: number;
  }[];
}

const performanceSubjects: PerformanceSubject[] = [
  {
    id: "adult-health",
    name: "Adult Health",
    score: 0,
    avgScore: "61%",
    used: 0,
    total: 563,
    icon: HeartPulse,
    iconColor: "#ef4444",
    time: "—",
    avgTime: "1m 10s",
    systems: [
      { name: "Cardiovascular", score: 0, avgScore: "66%", used: 0, total: 103 },
      { name: "Endocrine", score: 0, avgScore: "65%", used: 0, total: 58 },
      { name: "Gastrointestinal", score: 0, avgScore: "64%", used: 0, total: 53 },
      { name: "Hematologic", score: 0, avgScore: "57%", used: 0, total: 18 },
      { name: "Immune / Infectious Disease", score: 0, avgScore: "66%", used: 0, total: 13 },
      { name: "Integumentary", score: 0, avgScore: "65%", used: 0, total: 16 },
      { name: "Multisystem", score: 0, avgScore: "62%", used: 0, total: 27 },
      { name: "Musculoskeletal", score: 0, avgScore: "62%", used: 0, total: 37 },
      { name: "Neurologic", score: 0, avgScore: "61%", used: 0, total: 45 },
      { name: "Reproductive", score: 0, avgScore: "47%", used: 0, total: 15 },
      { name: "Respiratory", score: 0, avgScore: "61%", used: 0, total: 91 },
      { name: "Urinary and Renal", score: 0, avgScore: "58%", used: 0, total: 60 },
      { name: "Visual and Auditory", score: 0, avgScore: "58%", used: 0, total: 21 }
    ]
  },
  {
    id: "child-health",
    name: "Child Health",
    score: 0,
    avgScore: "56%",
    used: 0,
    total: 199,
    icon: Baby,
    iconColor: "#EC4899",
    time: "—",
    avgTime: "1m 8s",
    systems: [
      { name: "Cardiovascular", score: 0, avgScore: "54%", used: 0, total: 17 },
      { name: "Endocrine", score: 0, avgScore: "59%", used: 0, total: 13 },
      { name: "Gastrointestinal", score: 0, avgScore: "60%", used: 0, total: 29 },
      { name: "Growth and Development", score: 0, avgScore: "65%", used: 0, total: 29 },
      { name: "Hematologic", score: 0, avgScore: "62%", used: 0, total: 16 },
      { name: "Immune / Infectious Disease", score: 0, avgScore: "61%", used: 0, total: 15 },
      { name: "Integumentary", score: 0, avgScore: "55%", used: 0, total: 7 },
      { name: "Musculoskeletal", score: 0, avgScore: "48%", used: 0, total: 10 },
      { name: "Neurologic", score: 0, avgScore: "56%", used: 0, total: 11 },
      { name: "Reproductive", score: 0, avgScore: "32%", used: 0, total: 3 },
      { name: "Respiratory", score: 0, avgScore: "66%", used: 0, total: 30 },
      { name: "Urinary and Renal", score: 0, avgScore: "54%", used: 0, total: 7 },
      { name: "Visual and Auditory", score: 0, avgScore: "49%", used: 0, total: 6 }
    ]
  },
  {
    id: "fundamentals",
    name: "Fundamentals",
    score: 0,
    avgScore: "58%",
    used: 0,
    total: 155,
    icon: BicepsFlexed,
    iconColor: "#F43F5E",
    time: "—",
    avgTime: "1m 15s",
    systems: [
      { name: "Basic Care and Comfort", score: 0, avgScore: "59%", used: 0, total: 45 },
      { name: "Fluid, Electrolytes, and Acid-Base Balance", score: 0, avgScore: "59%", used: 0, total: 28 },
      { name: "Nutrition and Elimination", score: 0, avgScore: "59%", used: 0, total: 43 },
      { name: "Safety and Infection Control", score: 0, avgScore: "54%", used: 0, total: 39 }
    ]
  },
  {
    id: "maternal-newborn",
    name: "Maternal & Newborn Health",
    score: 0,
    avgScore: "55%",
    used: 0,
    total: 213,
    icon: Milk,
    iconColor: "#0284C7",
    time: "—",
    avgTime: "1m 22s",
    systems: [
      { name: "Antepartum", score: 0, avgScore: "59%", used: 0, total: 61 },
      { name: "Labor & Delivery", score: 0, avgScore: "52%", used: 0, total: 61 },
      { name: "Newborn", score: 0, avgScore: "51%", used: 0, total: 38 },
      { name: "Postpartum", score: 0, avgScore: "58%", used: 0, total: 53 }
    ]
  },
  {
    id: "mental-health",
    name: "Mental Health",
    score: 0,
    avgScore: "60%",
    used: 0,
    total: 122,
    icon: Brain,
    iconColor: "#D97706",
    time: "—",
    avgTime: "1m 16s",
    systems: [
      { name: "Anxiety Disorders, Trauma, and Addiction", score: 0, avgScore: "56%", used: 0, total: 27 },
      { name: "Cognitive and Developmental Disorders", score: 0, avgScore: "56%", used: 0, total: 27 },
      { name: "Foundations and Therapeutic Communication", score: 0, avgScore: "68%", used: 0, total: 41 },
      { name: "Mood and Personality Disorders", score: 0, avgScore: "60%", used: 0, total: 27 }
    ]
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    score: 0,
    avgScore: "55%",
    used: 0,
    total: 183,
    icon: Pill,
    iconColor: "#DB2777",
    time: "—",
    avgTime: "1m 2s",
    systems: [
      { name: "Cardiovascular", score: 0, avgScore: "57%", used: 0, total: 20 },
      { name: "Endocrine", score: 0, avgScore: "59%", used: 0, total: 16 },
      { name: "Gastrointestinal", score: 0, avgScore: "59%", used: 0, total: 11 },
      { name: "Hematologic / Oncologic", score: 0, avgScore: "52%", used: 0, total: 5 },
      { name: "Immune", score: 0, avgScore: "54%", used: 0, total: 13 },
      { name: "Integumentary", score: 0, avgScore: "58%", used: 0, total: 3 },
      { name: "Medication Administration", score: 0, avgScore: "62%", used: 0, total: 34 },
      { name: "Musculoskeletal", score: 0, avgScore: "56%", used: 0, total: 6 },
      { name: "Neurologic", score: 0, avgScore: "58%", used: 0, total: 17 },
      { name: "Psychiatric", score: 0, avgScore: "48%", used: 0, total: 23 },
      { name: "Reproductive", score: 0, avgScore: "42%", used: 0, total: 13 },
      { name: "Respiratory", score: 0, avgScore: "50%", used: 0, total: 13 },
      { name: "Urinary and Renal", score: 0, avgScore: "53%", used: 0, total: 6 },
      { name: "Visual and Auditory", score: 0, avgScore: "55%", used: 0, total: 3 }
    ]
  },
  {
    id: "management-of-care",
    name: "Management of Care",
    score: 0,
    avgScore: "63%",
    used: 0,
    total: 145,
    icon: Plus,
    iconColor: "#ef4444",
    time: "—",
    avgTime: "1m 13s",
    systems: [
      { name: "Assignment and Delegation", score: 0, avgScore: "70%", used: 0, total: 36 },
      { name: "Management Concepts", score: 0, avgScore: "63%", used: 0, total: 50 },
      { name: "Prioritization", score: 0, avgScore: "56%", used: 0, total: 59 }
    ]
  }
];

const performanceFaqs = [
  {
    question: "How is my score calculated?",
    answer: "Your score is calculated as the percentage of correct questions out of the total questions you have attempted. Partial credit from Next-Gen NCLEX scoring rules (such as +/- scoring for Select All That Apply) is incorporated into your total points."
  },
  {
    question: "Can I reset my score for each subject?",
    answer: "Yes, you can reset your performance statistics per subject or across all subjects by clicking the Reset button at the top of the Performance page."
  },
  {
    question: "Can I reset or untag my used questions?",
    answer: "Yes! Resetting your performance resets question attempts, moving used questions back into your 'Unused' question pool so you can retake them fresh."
  },
  {
    question: "Are Case Studies and Readiness Exam included in my performance?",
    answer: "Yes, performance tracks every attempt across standalone questions, Next Gen case studies, and CAT readiness exams to give you a complete picture of your NCLEX readiness."
  }
];

const catFaqs = [
  {
    question: "What are the NCLEXLab CAT Readiness Exams?",
    answer: "NCLEXLab CAT (Computerized Adaptive Testing) Readiness Exams are full-length simulated exams engineered using the same adaptive scoring algorithm, question distributions, and Next Generation NCLEX question types as the official NCSBN exam."
  },
  {
    question: "How does computerized adaptive testing work?",
    answer: "Computerized Adaptive Testing adjusts question difficulty based on your performance. After each response, the algorithm re-estimates your passing ability and selects an optimal question tailored to measure whether you are above the passing standard."
  },
  {
    question: "Why did my exam shut off at 85 questions?",
    answer: "Just like the real Next Gen NCLEX, the exam shuts off as soon as the algorithm reaches 95% statistical certainty that your ability level is definitively above (passing) or below (failing) the passing standard. 85 is the minimum question count."
  },
  {
    question: "What does my Chance of Passing result mean?",
    answer: "Your Chance of Passing (e.g. Very High, High, Borderline, or Low) reflects your probability of passing the actual NCLEX on your first attempt based on performance data benchmarked against thousands of successful test takers."
  },
  {
    question: "Are CAT exams harder or easier than the real NCLEX?",
    answer: "Our CAT exams are calibrated to closely mirror the exact difficulty and cognitive rigor of the actual Next Gen NCLEX, ensuring there are no surprises on test day."
  },
  {
    question: "When should I take my first CAT Readiness exam?",
    answer: "We recommend taking your first CAT Readiness Exam after completing approximately 30-40% of the Qbank to establish your baseline, followed by remaining exams in the final 2-3 weeks before your exam date."
  },
  {
    question: "Can I pause, go back, or change an answer?",
    answer: "To accurately simulate official exam rules, once an answer is submitted on an adaptive exam, you cannot return to change it. However, you can pause during scheduled breaks if needed."
  },
  {
    question: "Are these unique questions?",
    answer: "Yes! The questions in the CAT Readiness Exams are separate from the standalone Qbank questions to ensure an authentic, unprimed diagnostic test."
  },
  {
    question: "Can I retake or reset a CAT exam?",
    answer: "Yes, once completed, you can review the in-depth rationales for every question and reset the exam to retake it whenever you wish."
  }
];

interface StudentDashboardProps {
  initialTab?: string;
}

const StudentDashboard = ({ initialTab = "home" }: StudentDashboardProps = {}): ReactElement => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [targetExamDate, setTargetExamDate] = useState<string>("2026-06-15");
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(15);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Create Test Modal state matching exact reference screenshot
  const [isTutorMode, setIsTutorMode] = useState<boolean>(true);
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [questionPools, setQuestionPools] = useState<Record<string, boolean>>({
    unused: true,
    learning: false,
    reviewing: false,
    mastered: false,
    bookmarked: false
  });
  const [isSubjectsExpanded, setIsSubjectsExpanded] = useState<boolean>(true);
  const [isFreeQuestionsDropdownOpen, setIsFreeQuestionsDropdownOpen] = useState<boolean>(true);
  const [testQuestionCount, setTestQuestionCount] = useState<number>(6);
  const [testCreationNotice, setTestCreationNotice] = useState<string | null>(null);
  const [testOptions, setTestOptions] = useState<StudentTestOptions>(() => getLocalTestOptions());
  const [isLoadingTestOptions, setIsLoadingTestOptions] = useState<boolean>(false);
  const [isCreatingTest, setIsCreatingTest] = useState<boolean>(false);
  const [selectedTestSubjectIds, setSelectedTestSubjectIds] = useState<string[]>(["free"]);

  const [openPerfFaqIndex, setOpenPerfFaqIndex] = useState<number | null>(null);
  const [openCatFaqIndex, setOpenCatFaqIndex] = useState<number | null>(null);

  // Standalone Questions synced with Admin Dashboard in real-time
  const [standaloneQuestions, setStandaloneQuestions] = useState<StoredStandaloneQuestion[]>([]);
  const [studentSessionToken, setStudentSessionToken] = useState("");
  const [activeStudentTestId, setActiveStudentTestId] = useState<string | null>(null);
  const [questionApiError, setQuestionApiError] = useState<string | null>(null);
  const [questionProgress, setQuestionProgress] = useState<Readonly<{ answered: number; total: number }> | null>(null);
  const [practicingQuestion, setPracticingQuestion] = useState<StoredStandaloneQuestion | null>(null);
  const [practicingSelectedOption, setPracticingSelectedOption] = useState<number | null>(null);
  const [practicingIsSubmitted, setPracticingIsSubmitted] = useState<boolean>(false);

  interface SavedTestAttempt {
    id: string;
    name: string;
    type: "custom" | "cat" | "case-study";
    pool: string;
    date: string;
    scorePercent: number;
    avgScorePercent: number;
    totalQuestions: number;
    answeredCount: number;
    passStatus?: "PASS" | "FAIL";
    passProbability?: number;
  }

  // Standalone Exam Engine State
  const [activeTestExamType, setActiveTestExamType] = useState<"case-study" | "standalone" | "cat">("case-study");
  const [activeStandaloneQuestionsList, setActiveStandaloneQuestionsList] = useState<StoredStandaloneQuestion[]>([]);
  const [standaloneAnswers, setStandaloneAnswers] = useState<
    Record<number, { selectedOption: number | null; selectedIndices?: number[]; isSubmitted: boolean; correct?: boolean }>
  >({});
  const [catSession, setCatSession] = useState<CatExamSession | null>(null);
  const [catExamSummary, setCatExamSummary] = useState<CatExamSummary | null>(null);
  const [savedCatSummaries, setSavedCatSummaries] = useState<CatExamSummary[]>(() => {
    return typeof window !== "undefined" ? getSavedCatExamSummaries() : [];
  });
  const [savedPreviousTests, setSavedPreviousTests] = useState<SavedTestAttempt[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("nclex_test_history_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const saveCustomTestAttempt = (attempt: SavedTestAttempt) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("nclex_test_history_v1");
      const existing: SavedTestAttempt[] = raw ? JSON.parse(raw) : [];
      const updated = [attempt, ...existing.filter((a) => a.id !== attempt.id)];
      localStorage.setItem("nclex_test_history_v1", JSON.stringify(updated));
      setSavedPreviousTests(updated);
    } catch (err) {
      console.warn("Could not save test attempt:", err);
    }
  };

  const startCatExam = (examNum: 1 | 2 | 3 | 4) => {
    const session = createCatExamSession(examNum);
    const pool = standaloneQuestions.length > 0 ? standaloneQuestions : DEFAULT_STANDALONE_QUESTIONS;
    const firstItem = selectNextCatQuestion(pool, new Set(), 0.0, 0);
    setCatSession(session);
    setCatExamSummary(null);
    setActiveTestExamType("cat");
    setActiveStandaloneQuestionsList([firstItem.question]);
    setTestQuestionIndex(0);
    setTestTimerSeconds(0);
    setIsTimerPaused(false);
    setStandaloneAnswers({});
    setIsResultsScreenActive(false);
    setIsTestActive(true);
  };

  const toggleQuestionTag = async (tag: "learning" | "reviewing" | "mastered") => {
    const currentQ = activeStandaloneQuestionsList[testQuestionIndex] ?? standaloneQuestions[testQuestionIndex];
    if (!currentQ) return;
    const existing = questionTags[testQuestionIndex];
    const newTag = existing === tag ? null : tag;
    setQuestionTags((prev) => ({ ...prev, [testQuestionIndex]: newTag }));
    if (studentSessionToken && currentQ.id) {
      try {
        await updateStudentQuestionStatus(studentSessionToken, currentQ.id, {
          status: newTag ?? "unused",
          bookmarked: Boolean(markedQuestions[testQuestionIndex])
        });
      } catch (err) {
        console.warn("Could not sync question status:", err);
      }
    }
  };

  const toggleBookmark = async () => {
    const currentQ = activeStandaloneQuestionsList[testQuestionIndex] ?? standaloneQuestions[testQuestionIndex];
    if (!currentQ) return;
    const isMarked = !markedQuestions[testQuestionIndex];
    setMarkedQuestions((prev) => ({ ...prev, [testQuestionIndex]: isMarked }));
    if (studentSessionToken && currentQ.id) {
      try {
        await updateStudentQuestionStatus(studentSessionToken, currentQ.id, {
          status: questionTags[testQuestionIndex] ?? "unused",
          bookmarked: isMarked
        });
      } catch (err) {
        console.warn("Could not sync bookmark:", err);
      }
    }
  };

  // Student Membership State (Free vs Paid)
  const [membership, setMembership] = useState<StudentMembership>(DEFAULT_MEMBERSHIP);

  // Pay & Unlock Modal state for Paid Questions
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallTargetQuestion, setPaywallTargetQuestion] = useState<StoredStandaloneQuestion | null>(null);
  const [paywallPlanId, setPaywallPlanId] = useState<"1-month" | "3-month">("3-month");
  const [paywallCardName, setPaywallCardName] = useState("Sarah Jenkins");
  const [paywallCardNumber, setPaywallCardNumber] = useState("4242 •••• •••• 4242");
  const [paywallCardExpiry, setPaywallCardExpiry] = useState("12/28");
  const [paywallCardCvc, setPaywallCardCvc] = useState("382");
  const [paywallPromo, setPaywallPromo] = useState("");
  const [paywallDiscountApplied, setPaywallDiscountApplied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paywallSuccessNotice, setPaywallSuccessNotice] = useState<string | null>(null);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);

  const getTestSubjectCount = (subjectId: string): number => {
    const fromApi = testOptions?.subjects.find((subject) => subject.id === subjectId)?.count;
    if (fromApi !== undefined && fromApi > 0) return fromApi;
    const localCount = standaloneQuestions.filter((q) => q.subjectId === subjectId).length;
    if (localCount > 0) return localCount;
    const base = STANDALONE_SUBJECTS.find((s) => s.id === subjectId)?.baseTotal;
    return base ?? 25;
  };
  const toggleTestSubject = (subjectId: string): void => {
    setSelectedTestSubjectIds((current) => current.includes(subjectId) ? current.filter((id) => id !== subjectId) : [...current, subjectId]);
  };
  const selectAllTestSubjects = (): void => {
    const allIds = STANDALONE_SUBJECTS.map((s) => s.id);
    const allSelected = allIds.every((id) => selectedTestSubjectIds.includes(id));
    setSelectedTestSubjectIds(allSelected ? [] : allIds);
  };

  const createConfiguredTest = async (): Promise<void> => {
    const pools = Object.entries(questionPools).filter(([, selected]) => selected).map(([pool]) => pool);
    const activePools = pools.length > 0 ? pools : ["unused", "learning", "reviewing"];
    const activeSubjectIds = selectedTestSubjectIds.length > 0 ? selectedTestSubjectIds : STANDALONE_SUBJECTS.map((s) => s.id);
    const countToCreate = Math.max(1, Math.min(150, testQuestionCount || 50));

    setIsCreatingTest(true);
    setTestCreationNotice(null);
    try {
      const session = studentSessionToken ? { token: studentSessionToken } : await getStudentSession();
      setStudentSessionToken(session.token);
      const test = await createStudentTest(session.token, {
        pools: activePools,
        subjectIds: activeSubjectIds,
        questionCount: countToCreate,
        tutorMode: isTutorMode,
        timedMode: isTimedMode
      });
      const selectedQuestions: StoredStandaloneQuestion[] = test.questions.map((question) => ({
        id: question.id, subjectId: question.subjectId, subjectName: question.subjectName, title: question.title, stem: question.stem,
        type: question.type, options: [...question.options], correctIndex: question.correctIndex ?? -1,
        ...(question.correctIndices ? { correctIndices: [...question.correctIndices] } : {}), rationale: question.rationale ?? "",
        status: "Published", createdAt: test.createdAt, updatedAt: test.createdAt, author: "NCLEXLab Content Team", isPaid: false, locked: false
      }));
      setActiveStudentTestId(test.id);
      localStorage.setItem("nclex_active_student_test_v1", test.id);
      setTestCreationNotice(null);
      setQuestionApiError(null);
      setStandaloneAnswers({});
      setIsCreateTestOpen(false);
      startStandaloneExam(selectedQuestions, 0, test.id);
    } catch (cause) {
      console.warn("Server test creation failed, launching local test:", cause);
      const localTest = createLocalStudentTest({
        pools: activePools,
        subjectIds: activeSubjectIds,
        questionCount: countToCreate,
        tutorMode: isTutorMode,
        timedMode: isTimedMode
      });
      const localSelectedQuestions: StoredStandaloneQuestion[] = localTest.questions.map((question: StudentTestQuestion) => ({
        id: question.id, subjectId: question.subjectId, subjectName: question.subjectName, title: question.title, stem: question.stem,
        type: question.type, options: [...question.options], correctIndex: question.correctIndex ?? -1,
        ...(question.correctIndices ? { correctIndices: [...question.correctIndices] } : {}), rationale: question.rationale ?? "",
        status: "Published", createdAt: localTest.createdAt, updatedAt: localTest.createdAt, author: "NCLEXLab Content Team", isPaid: false, locked: false, answered: question.answered,
        poolStatus: question.status, bookmarked: question.bookmarked
      }));
      setActiveStudentTestId(localTest.id);
      localStorage.setItem("nclex_active_student_test_v1", localTest.id);
      setTestCreationNotice(null);
      setQuestionApiError(null);
      setStandaloneAnswers({});
      setIsCreateTestOpen(false);
      startStandaloneExam(localSelectedQuestions, 0, localTest.id);
    } finally { setIsCreatingTest(false); }
  };

  const startStandaloneExam = (questions?: StoredStandaloneQuestion[], startIndex: number = 0, testId?: string) => {
    const list = questions && questions.length > 0
      ? questions
      : (standaloneQuestions.length > 0 ? standaloneQuestions : getStoredStandaloneQuestions());
    if (list.length === 0) {
      setQuestionApiError("No questions are currently available. Please try again.");
      return;
    }
    const targetQ = list[startIndex];
    if (targetQ?.locked && !membership.isPaid) {
      setPaywallTargetQuestion(targetQ);
      setIsPaywallOpen(true);
      return;
    }

    setActiveStandaloneQuestionsList(list);
    setActiveTestExamType("standalone");
    setTestQuestionIndex(startIndex);
    setTestTimerSeconds(0);
    setIsTimerPaused(false);
    setIsResultsScreenActive(false);
    if (testId) setActiveStudentTestId(testId);
    setIsTestActive(true);
    setQuestionApiError(null);
  };

  useEffect(() => {
    let active = true;

    // Immediately seed with stored standalone questions if not populated
    const initialPool = getStoredStandaloneQuestions();
    if (standaloneQuestions.length === 0) {
      setStandaloneQuestions(initialPool);
      if (!isTestActive) {
        setActiveStandaloneQuestionsList(initialPool);
      }
      setQuestionProgress({
        answered: initialPool.filter((q) => q.answered).length,
        total: initialPool.length
      });
    }

    // Subscribe to real-time updates from admin dashboard
    const unsubscribe = subscribeToStandaloneQuestions((updatedList) => {
      if (!active) return;
      setStandaloneQuestions(updatedList);
      if (!isTestActive) {
        setActiveStandaloneQuestionsList(updatedList);
      }
      setQuestionProgress({
        answered: updatedList.filter((q) => q.answered).length,
        total: updatedList.length
      });
    });

    const refreshAssignedQuestions = async (): Promise<void> => {
      try {
        const session = await getStudentSession();
        if (active) setStudentSessionToken(session.token);
        const result = await loadAssignedQuestions(session.token);
        if (!active) return;
        setStandaloneQuestions([...result.questions]);
        setActiveStandaloneQuestionsList((current) => isTestActive ? current : [...result.questions]);
        setMembership({ ...DEFAULT_MEMBERSHIP, isPaid: result.isPaid, planId: result.isPaid ? "3-month" : "free", planName: result.isPaid ? "Verified Membership" : "Free Trial Tier" });
        setQuestionProgress({ answered: result.questions.filter((question) => question.answered).length, total: result.questions.length });
        setQuestionApiError(null);
      } catch {
        if (!active) return;
        const stored = getStoredStandaloneQuestions();
        setStandaloneQuestions(stored);
        if (!isTestActive) {
          setActiveStandaloneQuestionsList(stored);
        }
        setQuestionProgress({
          answered: stored.filter((q) => q.answered).length,
          total: stored.length
        });
        setQuestionApiError(null);
      }
    };
    void refreshAssignedQuestions();
    const refreshTimer = window.setInterval(() => { void refreshAssignedQuestions(); }, 15_000);
    return () => {
      active = false;
      unsubscribe();
      window.clearInterval(refreshTimer);
    };
  }, [isTestActive]);

  useEffect(() => {
    setCurrentUser(getCurrentAuthUser());
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<AuthUser | null>;
      setCurrentUser(custom.detail);
    };
    window.addEventListener("nclex_auth_state_changed", handleAuthChange);
    return () => window.removeEventListener("nclex_auth_state_changed", handleAuthChange);
  }, []);

  useEffect(() => {
    if (!isCreateTestOpen) return;
    let active = true;
    setIsLoadingTestOptions(true);
    setTestCreationNotice(null);
    void (async () => {
      try {
        const session = studentSessionToken ? { token: studentSessionToken } : await getStudentSession();
        const options = await loadStudentTestOptions(session.token);
        if (!active) return;
        setStudentSessionToken(session.token);
        setTestOptions(options);
        const allSubjectIds = STANDALONE_SUBJECTS.map((s) => s.id);
        setSelectedTestSubjectIds((current) => current.length > 0 ? current : allSubjectIds);
        setTestQuestionCount((current) => (current && current > 1 ? current : 50));
        setTestCreationNotice(null);
      } catch {
        if (active) {
          const fallbackOptions = getLocalTestOptions();
          setTestOptions(fallbackOptions);
          setSelectedTestSubjectIds(STANDALONE_SUBJECTS.map((s) => s.id));
          setTestQuestionCount(50);
          setTestCreationNotice(null);
        }
      } finally { if (active) setIsLoadingTestOptions(false); }
    })();
    return () => { active = false; };
  }, [isCreateTestOpen, studentSessionToken]);

  const submitStandaloneAnswer = async (): Promise<void> => {
    const selectedOption = standaloneAnswers[testQuestionIndex]?.selectedOption;
    const currentQuestion = activeStandaloneQuestionsList[testQuestionIndex] ?? standaloneQuestions[testQuestionIndex];
    const currentQuestionId = currentQuestion?.id;
    if (selectedOption === null || selectedOption === undefined) { alert("Please select an answer choice before submitting."); return; }

    let correct = false;
    let correctIndex = currentQuestion?.correctIndex ?? 0;
    let rationale = currentQuestion?.rationale ?? "Comprehensive rationale provided for Next Gen NCLEX mastery.";

    if (studentSessionToken && currentQuestionId) {
      try {
        const result = await answerAssignedQuestion(studentSessionToken, currentQuestionId, selectedOption);
        correct = result.correct;
        correctIndex = result.correctIndex;
        rationale = result.rationale;
        setQuestionProgress({ answered: result.progress, total: result.total });
      } catch {
        correct = selectedOption === correctIndex;
      }
    } else {
      correct = selectedOption === correctIndex;
    }

    setStandaloneAnswers((current) => ({ ...current, [testQuestionIndex]: { selectedOption, isSubmitted: true, correct } }));
    setStandaloneQuestions((current) => current.map((question) => question.id === currentQuestionId ? { ...question, answered: true, correctIndex, rationale } : question));
    setActiveStandaloneQuestionsList((current) => current.map((question) => question.id === currentQuestionId ? { ...question, answered: true, correctIndex, rationale } : question));
    setQuestionApiError(null);

    if (activeTestExamType === "cat" && catSession && currentQuestion) {
      const isCorrect = selectedOption === correctIndex;
      const { updatedSession, stoppingDecision } = recordCatAttempt(
        catSession,
        currentQuestion,
        selectedOption,
        isCorrect,
        testTimerSeconds
      );
      setCatSession(updatedSession);
      if (stoppingDecision.shouldStop) {
        const summary = generateCatExamSummary(updatedSession);
        saveCatExamSummary(summary);
        setCatExamSummary(summary);
        setSavedCatSummaries(getSavedCatExamSummaries());
        saveCustomTestAttempt({
          id: updatedSession.examId,
          name: `CAT Readiness Exam ${updatedSession.examNumber}`,
          type: "cat",
          pool: "Adaptive (85-150)",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          scorePercent: summary.accuracyPercent,
          avgScorePercent: 68,
          totalQuestions: summary.totalQuestions,
          answeredCount: summary.totalQuestions,
          ...(summary.passStatus ? { passStatus: summary.passStatus } : {}),
          passProbability: summary.passProbability
        });
        setIsResultsScreenActive(true);
      } else {
        const pool = standaloneQuestions.length > 0 ? standaloneQuestions : DEFAULT_STANDALONE_QUESTIONS;
        const usedIds = new Set(updatedSession.history.map((h) => h.questionId));
        const nextQ = selectNextCatQuestion(pool, usedIds, updatedSession.currentTheta, updatedSession.totalAnswered);
        setActiveStandaloneQuestionsList((current) => [...current, nextQ.question]);
      }
    }
  };
  const [expandedPerfSubjects, setExpandedPerfSubjects] = useState<Record<string, boolean>>({
    "adult-health": true,
    "child-health": true
  });
  const [isAllPerfExpanded, setIsAllPerfExpanded] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("adult-health");
  const [subjectSubTab, setSubjectSubTab] = useState<string>("case-studies");
  const [crashFilterQuery, setCrashFilterQuery] = useState<string>("");
  const [completedCrashLessons, setCompletedCrashLessons] = useState<Record<string, boolean>>({});
  const [isCrashLessonsCollapsed, setIsCrashLessonsCollapsed] = useState<boolean>(false);
  const [expandedCrashHubSubjects, setExpandedCrashHubSubjects] = useState<Record<string, boolean>>({});
  const [cheatFilterQuery, setCheatFilterQuery] = useState<string>("");
  const [selectedCheatSystem, setSelectedCheatSystem] = useState<string>("All Adult Health");
  const [selectedCheatHubSubject, setSelectedCheatHubSubject] = useState<string>("all");
  const [selectedCheatHubSystem, setSelectedCheatHubSystem] = useState<string>("All Systems");
  const [cheatHubSearchQuery, setCheatHubSearchQuery] = useState<string>("");
  const [expandedStrategyModules, setExpandedStrategyModules] = useState<Record<string, boolean>>({});
  const [strategyFilterQuery, setStrategyFilterQuery] = useState<string>("");
  const [isSidebarSubjectsOpen, setIsSidebarSubjectsOpen] = useState<boolean>(true);

  const [studySchedule, setStudySchedule] = useState<StudySchedule | null>(null);
  const [isStudyScheduleLoaded, setIsStudyScheduleLoaded] = useState<boolean>(false);
  const [scheduleLoadError, setScheduleLoadError] = useState<string | null>(null);
  const [scheduleView, setScheduleView] = useState<StudyScheduleView>("month");
  const [scheduleFilter, setScheduleFilter] = useState<"all" | "questions" | "resources">("all");
  const [selectedScheduleTask, setSelectedScheduleTask] = useState<StudyScheduleTask | null>(null);
  const [scheduleCursorDate, setScheduleCursorDate] = useState<string>(() => toDateKey());
  const [scheduleUndoSnapshot, setScheduleUndoSnapshot] = useState<StudySchedule | null>(null);
  const [scheduleToastMessage, setScheduleToastMessage] = useState<string | null>(null);
  const [scheduleDialogMode, setScheduleDialogMode] = useState<"create" | "rebalance" | "settings">("create");
  const [scheduleFormError, setScheduleFormError] = useState<string | null>(null);

  // Active Next Gen NCLEX Test Engine State (matching media_1795076768226_00845f68.png)
  const [testQuestionIndex, setTestQuestionIndex] = useState<number>(0);
  const [testTimerSeconds, setTestTimerSeconds] = useState<number>(40);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [calcInput, setCalcInput] = useState<string>("0");
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});
  const [isTestSettingsOpen, setIsTestSettingsOpen] = useState<boolean>(false);
  const [activeEhrTab, setActiveEhrTab] = useState<"history" | "vitals">("history");

  // Next Generation 6-Item Case Study & Results Screen State (Matches media_1795155376198_59b5ec7b.jpg)
  const [isResultsScreenActive, setIsResultsScreenActive] = useState<boolean>(false);
  const [isNavigateOpen, setIsNavigateOpen] = useState<boolean>(false);
  const [caseEhrTab, setCaseEhrTab] = useState<"nurses-notes" | "vitals" | "labs">("nurses-notes");

  // Sync EHR tab when on Item 5 or Item 6 (Matches user screenshots)
  useEffect(() => {
    if (testQuestionIndex === 4) {
      setCaseEhrTab("vitals");
    } else if (testQuestionIndex === 5) {
      setCaseEhrTab("nurses-notes");
    }

    if (typeof document !== "undefined") {
      const ehrPane = document.querySelector(".sd-test-ehr-pane");
      const questionPane = document.querySelector(".sd-test-question-pane");
      if (ehrPane) ehrPane.scrollTop = 0;
      if (questionPane) questionPane.scrollTop = 0;
    }
  }, [testQuestionIndex]);

  // Question tagging in footer (Learning, Reviewing, Mastered)
  const [questionTags, setQuestionTags] = useState<Record<number, "learning" | "reviewing" | "mastered" | null>>({});

  // Item 1: Interactive Highlight Tokens (1 to 8)
  const [caseItem1SelectedTokens, setCaseItem1SelectedTokens] = useState<number[]>([]);
  const [isCaseItem1Submitted, setIsCaseItem1Submitted] = useState<boolean>(false);

  // Item 2: Multi-Disease Process Matrix (Matches media_1795158757361_5b374c70.jpg)
  const [caseItem2Matrix, setCaseItem2Matrix] = useState<Record<string, boolean>>({});
  const [isCaseItem2Submitted, setIsCaseItem2Submitted] = useState<boolean>(false);

  // Item 3: Cloze Fill-in
  const [caseItem3Slot1, setCaseItem3Slot1] = useState<string | null>(null);
  const [caseItem3Slot2, setCaseItem3Slot2] = useState<string | null>(null);
  const [isCaseItem3Submitted, setIsCaseItem3Submitted] = useState<boolean>(false);

  // Item 4: Matrix (Indicated / Contraindicated) - Matches media_1795159525756_7ee107d6.jpg
  const [caseItem4Selections, setCaseItem4Selections] = useState<Record<number, "indicated" | "contraindicated">>({});
  const [isCaseItem4Submitted, setIsCaseItem4Submitted] = useState<boolean>(false);

  // Item 5: Single Choice (Radio)
  const [caseItem5Selected, setCaseItem5Selected] = useState<number | null>(null);
  const [isCaseItem5Submitted, setIsCaseItem5Submitted] = useState<boolean>(false);

  // Item 6: Drag-and-Drop Findings That Require Follow-Up (Matches media_1795160538727_d45d766a.jpg)
  const [caseItem6FollowUp, setCaseItem6FollowUp] = useState<string[]>([]);
  const [isCaseItem6Submitted, setIsCaseItem6Submitted] = useState<boolean>(false);

  // Ask nclex.com AI in Explanation (Matching media_1795429613081_bcc041a1.png exactly)
  interface AiChatMessage {
    id: string;
    role: "user" | "assistant";
    text: string;
  }

  const [aiChatMessages, setAiChatMessages] = useState<AiChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      text: "Hi! I'm nclex.com AI. What would you like help with on this intussusception question?"
    }
  ]);
  const [caseAiQuery, setCaseAiQuery] = useState<string>("");
  const [isCaseAiLoading, setIsCaseAiLoading] = useState<boolean>(false);

  const getClinicalAiResponse = (rawQuery: string): string => {
    const q = rawQuery.toLowerCase().trim();

    if (q === "hi" || q === "hello" || q === "hey" || q.startsWith("hi ") || q.startsWith("hello ")) {
      return "Hi! I'm nclex.com AI. What would you like help with on this intussusception question?";
    }

    if (q.includes("intussusception") || q.includes("patho") || q.includes("cause") || q.includes("what is")) {
      return "Intussusception is the telescoping or invagination of one portion of the intestine into an adjacent distal segment (most commonly the ileum into the cecum through the ileocecal valve). This obstructs intestinal flow, compresses mesenteric vessels, and leads to bowel edema, venous stasis, ischemia, and necrosis if untreated.";
    }

    if (q.includes("currant") || q.includes("jelly") || q.includes("blood") || q.includes("mucus") || q.includes("stool")) {
      return 'Classic "currant jelly" stools consist of blood and mucus from the ischemic, sloughing intestinal mucosa due to severe venous stasis within the invaginated bowel. It is a hallmark sign of acute intussusception.';
    }

    if (q.includes("mass") || q.includes("sausage") || q.includes("ruq") || q.includes("palpat")) {
      return 'A sausage-shaped, firm abdominal mass palpated in the right upper quadrant (RUQ), accompanied by an empty right lower quadrant (Dance sign), is pathognomonic for ileocecal intussusception as the cecum is drawn upward.';
    }

    if (q.includes("pain") || q.includes("curl") || q.includes("cry") || q.includes("episode") || q.includes("symptom")) {
      return 'The hallmark presentation of intussusception is sudden, episodic colicky abdominal pain. The infant screams, pulls their knees up to their abdomen during spasms, and appears comfortable or exhausted between attacks as peristaltic waves come and go.';
    }

    if (q.includes("enema") || q.includes("air") || q.includes("reduc") || q.includes("treatment")) {
      return "The initial treatment of choice is pneumatic (air) or hydrostatic (contrast/saline) enema reduction under ultrasound or fluoroscopic guidance. Air enema has a success rate of 80–90% and lower perforation rates than barium. If reduction fails or perforation occurs, urgent laparotomy is required.";
    }

    if (q.includes("perforat") || q.includes("rupture") || q.includes("complication") || q.includes("periton") || q.includes("rigid")) {
      return "Bowel perforation is the most lethal complication of intussusception, caused by prolonged ischemia and transmural necrosis. Key clinical signs include severe board-like abdominal rigidity, continuous intense pain, fever/warmth, abdominal distension (increased girth), and tachycardia. Free air under the diaphragm confirms perforation and demands immediate emergency surgical repair.";
    }

    if (q.includes("loperamide") || q.includes("contraindicat") || q.includes("antidiarrheal")) {
      return "Loperamide and other antimotility agents are strictly contraindicated in mechanical bowel obstruction or infectious enteritis. Slowing intestinal motility traps fluid, increases intraluminal pressure, worsens bowel wall ischemia, and can precipitate toxic megacolon or bowel perforation.";
    }

    if (q.includes("wbc") || q.includes("lab") || q.includes("count") || q.includes("hematocrit")) {
      return "The marked leukocytosis (WBC 20,000/mm³) indicates acute systemic inflammation, stress response, or developing bowel necrosis and peritonitis. Elevated hematocrit (hemoconcentration) typically reflects intravascular fluid volume depletion from vomiting, third spacing, and reduced oral intake.";
    }

    if (q.includes("fluid") || q.includes("bolus") || q.includes("iv") || q.includes("priority")) {
      return "Initial management requires placing the infant on strict NPO status, inserting an NG tube for gastric decompression, establishing IV access, and rapidly administering an isotonic fluid bolus (20 mL/kg of Normal Saline or Ringer's Lactate) to restore intravascular volume and renal perfusion prior to any reduction procedure.";
    }

    if (q.includes("post-op") || q.includes("surgery") || q.includes("wound") || q.includes("warmth") || q.includes("fever")) {
      return "Postoperatively following bowel resection or perforation repair, the nurse must monitor closely for signs of peritonitis or wound dehiscence between postoperative days 3 to 5. Key findings requiring urgent physician notification include abdominal girth expansion, wound erythema/warmth, fever, and abdominal guarding or rigidity.";
    }

    if (q.includes("digoxin") || q.includes("potassium") || q.includes("hypokalemia") || q.includes("halo")) {
      return "Digoxin binds to myocardial Na+/K+-ATPase. Hypokalemia (<3.5 mEq/L) sensitizes the heart to digoxin, precipitating lethal toxicity even at standard dosages. Early toxic symptoms include anorexia, nausea, and yellow-green visual halos. The nurse must assess the apical heart rate for 1 full minute prior to administration and hold for HR < 60 bpm.";
    }

    if (q.includes("pe") || q.includes("pulmonary embolism") || q.includes("dvt") || q.includes("heparin")) {
      return "In suspected acute pulmonary embolism, sudden pleuritic pain, dyspnea, and hypoxia require immediate Airway-Breathing-Circulation action: elevate head of bed to optimize gas exchange and apply high-flow oxygen immediately. For heparin, monitor aPTT (therapeutic range: 1.5 - 2.5x control) and watch for Heparin-Induced Thrombocytopenia (platelet drop > 50%).";
    }

    if (q.includes("dka") || q.includes("ketoacidosis") || q.includes("glucose") || q.includes("acidosis")) {
      return "In Diabetic Ketoacidosis (DKA), profound osmotic diuresis leads to severe hypovolemia. Priority 1 is fluid resuscitation with isotonic normal saline (0.9% NaCl). Regular insulin IV is administered once fluid therapy has begun. Potassium must be closely tracked, as insulin drives K+ into cells, risking acute hypokalemia and fatal cardiac dysrhythmias.";
    }

    if (q.includes("lithium") || q.includes("bipolar") || q.includes("mania")) {
      return "Lithium carbonate has a very narrow therapeutic index (0.6 - 1.2 mEq/L). Coarse hand tremors, severe diarrhea, vomiting, and ataxia indicate acute toxicity. Adequate fluid intake (2-3 L/day) and consistent sodium consumption are critical because hyponatremia prompts the kidneys to reabsorb lithium, precipitating severe toxicity.";
    }

    if (q.includes("delegat") || q.includes("uap") || q.includes("lpn") || q.includes("priority")) {
      return "NCLEX Delegation Golden Rule (EAT): The registered nurse NEVER delegates Evaluation, Assessment, or Teaching to unlicensed personnel or practical nurses. Stable clients with standard, predictable tasks (hygiene, vital signs on stable clients, measurement of catheter drainage) can be safely delegated to UAPs.";
    }

    const currentQ = activeStandaloneQuestionsList[testQuestionIndex] ?? standaloneQuestions[testQuestionIndex];
    if (currentQ) {
      return `For "${currentQ.title}", NCLEX Clinical Judgment focuses on identifying key cues in the stem: ${currentQ.stem.slice(0, 140)}... The correct clinical approach is Option ${String.fromCharCode(65 + currentQ.correctIndex)}, because: ${currentQ.rationale}`;
    }

    return "In Next Gen NCLEX, questions measure your ability to Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes. Ask me about any symptom, priority action, pathophysiological rationale, or pharmacology Pearl!";
  };

  const handleSendAiMessage = (queryToSend?: string) => {
    const raw = queryToSend || caseAiQuery;
    if (!raw.trim()) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: raw.trim()
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    setCaseAiQuery("");
    setIsCaseAiLoading(true);

    setTimeout(() => {
      const responseText = getClinicalAiResponse(raw);
      const assistantMsg: AiChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: responseText
      };
      setAiChatMessages((prev) => [...prev, assistantMsg]);
      setIsCaseAiLoading(false);
    }, 450);
  };

  const handleResetAiChat = () => {
    setAiChatMessages([
      {
        id: `initial-${Date.now()}`,
        role: "assistant",
        text: "Hi! I'm nclex.com AI. What would you like help with on this intussusception question?"
      }
    ]);
    setCaseAiQuery("");
    setIsCaseAiLoading(false);
  };

  const renderAiChatCard = (topicTitle?: string) => {
    return (
      <div style={{ marginTop: "24px" }}>
        {/* Top Metadata Row: View Sources on left, Subject / System / Topic on right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "1px solid #f1f5f9"
          }}
        >
          <div>
            <a
              href="#sources"
              onClick={(e) => {
                e.preventDefault();
                alert("Sources: NCSBN Clinical Judgment Measurement Model (CJMM), Nelson Textbook of Pediatrics (21st Ed), Saunders Comprehensive Review for the NCLEX-RN® Examination.");
              }}
              style={{
                color: "#0284c7",
                fontSize: "13px",
                textDecoration: "underline",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              View Sources
            </a>
          </div>

          <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>Child Health</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Subject</div>
            </div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>Gastrointestinal</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>System</div>
            </div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>
                {topicTitle || "Pyloric Stenosis, Intussusception, & Hirschsprung Disease"}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Topic</div>
            </div>
          </div>
        </div>

        {/* AI Chat Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
              <MessageSquare size={18} color="#334155" />
              <span>Ask nclex.com AI</span>
            </div>

            <button
              type="button"
              onClick={handleResetAiChat}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#334155",
                cursor: "pointer"
              }}
            >
              New conversation
            </button>
          </div>

          {/* Messages Thread */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
            {aiChatMessages.map((msg) => {
              const isUser = msg.role === "user";
              if (isUser) {
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <div
                      style={{
                        background: "#ede9fe",
                        color: "#5b21b6",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        padding: "7px 16px",
                        borderRadius: "20px",
                        maxWidth: "80%"
                      }}
                    >
                      {msg.text}
                    </div>
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "#0284c7",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "12px",
                        fontWeight: 800,
                        flexShrink: 0
                      }}
                    >
                      R
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "#0f172a",
                      color: "#ffffff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: "2px"
                    }}
                  >
                    <Star size={12} fill="#ffffff" color="#ffffff" />
                  </div>
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "10px 16px",
                      fontSize: "13.5px",
                      color: "#1e293b",
                      lineHeight: "1.55",
                      maxWidth: "85%"
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isCaseAiLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "#0f172a",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "12px",
                    flexShrink: 0
                  }}
                >
                  <Star size={12} fill="#ffffff" color="#ffffff" />
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "10px 16px",
                    fontSize: "13px",
                    color: "#64748b"
                  }}
                >
                  nclex.com AI is formulating clinical rationale...
                </div>
              </div>
            )}
          </div>

          {/* Modern Input Container */}
          <div
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "10px 14px",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "relative"
            }}
          >
            <input
              type="text"
              value={caseAiQuery}
              onChange={(e) => setCaseAiQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendAiMessage();
                }
              }}
              placeholder="Ask nclex.com AI a question..."
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#1e293b",
                width: "100%",
                background: "transparent",
                paddingRight: "36px"
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => handleSendAiMessage()}
                disabled={!caseAiQuery.trim() || isCaseAiLoading}
                aria-label="Send query"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: caseAiQuery.trim() ? "#475569" : "#cbd5e1",
                  color: "#ffffff",
                  border: "none",
                  display: "grid",
                  placeItems: "center",
                  cursor: caseAiQuery.trim() ? "pointer" : "default",
                  transition: "background 0.15s ease"
                }}
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const calculateCaseResults = () => {
    // Item 1 (+/- Scoring): Tokens 1, 2, 3, 5, 6 correct (+1); Tokens 4, 7, 8 incorrect (-1)
    const item1CorrectTokens = [1, 2, 3, 5, 6];
    const item1DistractorTokens = [4, 7, 8];
    const item1Positives = caseItem1SelectedTokens.filter((id) => item1CorrectTokens.includes(id)).length;
    const item1Negatives = caseItem1SelectedTokens.filter((id) => item1DistractorTokens.includes(id)).length;
    const item1Score = Math.max(0, item1Positives - item1Negatives);

    // Item 2 (Matrix 6 rows x 3 columns): 9 correct associations
    const item2CorrectKeys = [
      "1-intussusception",
      "2-appendicitis",
      "2-intussusception",
      "3-intussusception",
      "4-intussusception",
      "5-appendicitis",
      "5-intussusception",
      "6-intussusception",
      "6-pyloric_stenosis"
    ];
    const item2Score = item2CorrectKeys.filter((k) => caseItem2Matrix[k]).length;

    // Item 3 (Cloze Dropdowns): bowel perforation & ischemia (Matches media_1795159310477_9b627d60.jpg)
    const item3Score =
      caseItem3Slot1 === "bowel perforation" && caseItem3Slot2 === "ischemia" ? 1 : 0;

    // Item 4 (Matrix 6 rows: Indicated vs Contraindicated) - Matches media_1795159525756_7ee107d6.jpg
    const item4Key: Record<number, "indicated" | "contraindicated"> = {
      1: "indicated",
      2: "contraindicated",
      3: "contraindicated",
      4: "indicated",
      5: "indicated",
      6: "indicated"
    };
    let item4Score = 0;
    Object.entries(item4Key).forEach(([row, ans]) => {
      if (caseItem4Selections[Number(row)] === ans) item4Score++;
    });

    // Item 5 (Single Priority Order): Option 1 (Isotonic IV fluid bolus)
    const item5Score = caseItem5Selected === 1 ? 1 : 0;

    // Item 6 (Drag & Drop Follow-Up Findings): Matches media_1795160538727_d45d766a.jpg
    const item6CorrectFollowUps = [
      'Mother states the client feels "warmer than usual."',
      "Shiny and taut erythematous skin at the surgical incision.",
      "Abdominal girth has increased 2 cm since the last measurement."
    ];
    const item6IncorrectFollowUps = [
      "Bowel movement is brown and soft.",
      "Client is sucking his thumb and drooling onto his gown.",
      "Client cries when his mother leaves the room."
    ];
    const item6Positives = caseItem6FollowUp.filter((f) => item6CorrectFollowUps.includes(f)).length;
    const item6Negatives = caseItem6FollowUp.filter((f) => item6IncorrectFollowUps.includes(f)).length;
    const item6Score = Math.max(0, item6Positives - item6Negatives);

    const totalScore = item1Score + item2Score + item3Score + item4Score + item5Score + item6Score;
    const maxScore = 5 + 9 + 1 + 6 + 1 + 3; // 25
    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      totalScore,
      maxScore,
      percentage,
      item1Score,
      item2Score,
      item3Score,
      item4Score,
      item5Score,
      item6Score,
      isPassing: percentage >= 75
    };
  };

  // Question 1 Bowtie State
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [isQ1Submitted, setIsQ1Submitted] = useState<boolean>(false);

  // Questions 2-7 interactive states
  const [q2SelectedAnswers, setQ2SelectedAnswers] = useState<string[]>([]);
  const [isQ2Submitted, setIsQ2Submitted] = useState<boolean>(false);
  const [q3Selections, setQ3Selections] = useState<Record<string, string>>({});
  const [isQ3Submitted, setIsQ3Submitted] = useState<boolean>(false);
  const [q4SelectedOption, setQ4SelectedOption] = useState<string>("");
  const [isQ4Submitted, setIsQ4Submitted] = useState<boolean>(false);
  const [q5SelectedAnswers, setQ5SelectedAnswers] = useState<string[]>([]);
  const [isQ5Submitted, setIsQ5Submitted] = useState<boolean>(false);
  const [q6HighlightedWords, setQ6HighlightedWords] = useState<string[]>([]);
  const [isQ6Submitted, setIsQ6Submitted] = useState<boolean>(false);
  const [q7SelectedOption, setQ7SelectedOption] = useState<string>("");
  const [isQ7Submitted, setIsQ7Submitted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTestActive && !isTimerPaused) {
      interval = setInterval(() => {
        setTestTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, isTimerPaused]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("test") === "active" || params.get("test") === "true") {
        setIsTestActive(true);
      }
    }
  }, []);

  const formatTestTimer = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleCalcInput = (val: string) => {
    if (val === "C") {
      setCalcInput("0");
    } else if (val === "=") {
      try {
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, "");
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcInput(String(res));
      } catch {
        setCalcInput("Error");
      }
    } else {
      if (calcInput === "0" || calcInput === "Error") {
        setCalcInput(val);
      } else {
        setCalcInput((prev) => prev + val);
      }
    }
  };

  // Study Schedule settings and rebalance form
  const [scheduleStartDate, setScheduleStartDate] = useState<string>(() => toDateKey());
  const [scheduleExamDate, setScheduleExamDate] = useState<string>(() => addDaysToDateKey(toDateKey(), 29));
  const [noExamDateYet, setNoExamDateYet] = useState<boolean>(false);
  const [selectedDaysOff, setSelectedDaysOff] = useState<ScheduleDayOff>("Sunday");
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(2);
  const [isDaysOffDropdownOpen, setIsDaysOffDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    void loadStudentStudySchedule().then((initialSchedule) => {
      if (cancelled) return;
      setStudySchedule(initialSchedule);
      setScheduleStartDate(initialSchedule.startDate);
      setScheduleExamDate(initialSchedule.examDate ?? "");
      setNoExamDateYet(initialSchedule.examDate === null);
      setSelectedDaysOff(initialSchedule.daysOff);
      setDailyStudyHours(initialSchedule.dailyStudyHours ?? 2);
      setScheduleCursorDate(toDateKey());
      setScheduleLoadError(null);
    }).catch(() => {
      if (!cancelled) {
        const fallback = createDefaultStudySchedule();
        setStudySchedule(fallback);
        setScheduleStartDate(fallback.startDate);
        setScheduleExamDate(fallback.examDate ?? "");
        setNoExamDateYet(fallback.examDate === null);
        setSelectedDaysOff(fallback.daysOff);
        setDailyStudyHours(fallback.dailyStudyHours ?? 2);
        setScheduleCursorDate(toDateKey());
        setScheduleLoadError(null);
      }
    }).finally(() => { if (!cancelled) setIsStudyScheduleLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!scheduleToastMessage) return;
    const timeout = window.setTimeout(() => setScheduleToastMessage(null), 8000);
    return () => window.clearTimeout(timeout);
  }, [scheduleToastMessage]);

  const openScheduleDialog = (mode: "create" | "rebalance" | "settings"): void => {
    const today = toDateKey();
    setScheduleDialogMode(mode);
    setScheduleFormError(null);
    setIsDaysOffDropdownOpen(false);
    if (mode === "create" || !studySchedule) {
      setScheduleStartDate(today);
      setScheduleExamDate(addDaysToDateKey(today, 29));
      setNoExamDateYet(false);
      setSelectedDaysOff("Sunday");
      setDailyStudyHours(2);
    } else {
      setScheduleStartDate(today > studySchedule.startDate ? today : studySchedule.startDate);
      setScheduleExamDate(studySchedule.examDate && studySchedule.examDate > today
        ? studySchedule.examDate
        : addDaysToDateKey(today, 29));
      setNoExamDateYet(studySchedule.examDate === null);
      setSelectedDaysOff(studySchedule.daysOff);
      setDailyStudyHours(studySchedule.dailyStudyHours ?? 2);
    }
    setIsScheduleModalOpen(true);
  };

  const applyScheduleSettings = async (): Promise<void> => {
    const today = toDateKey();
    if (!scheduleStartDate) { setScheduleFormError("Choose a start date."); return; }
    if (scheduleStartDate < today) { setScheduleFormError("The schedule cannot start in the past."); return; }
    if (!noExamDateYet && !scheduleExamDate) { setScheduleFormError("Choose an exam date or select the no exam date option."); return; }
    if (!noExamDateYet && scheduleExamDate <= scheduleStartDate) {
      setScheduleFormError("The exam date must be after the schedule start date.");
      return;
    }

    const settings = {
      startDate: scheduleStartDate,
      examDate: noExamDateYet ? null : scheduleExamDate,
      daysOff: selectedDaysOff,
      dailyStudyHours
    } as const;
    const previousSchedule = studySchedule;
    try {
      const nextSchedule = scheduleDialogMode === "rebalance"
        ? await rebalanceStudentStudySchedule(settings)
        : await saveStudentScheduleSettings(settings);
      const summary = getScheduleSummary(nextSchedule);
      setScheduleUndoSnapshot(previousSchedule);
      setStudySchedule(nextSchedule);
      setScheduleCursorDate(settings.startDate);
      setScheduleView("month");
      setScheduleFormError(null);
      setScheduleLoadError(null);
      setIsScheduleModalOpen(false);
      setScheduleToastMessage(summary.averageHoursPerDay > 0
        ? `Schedule updated. Plan for about ${summary.averageHoursPerDay} hours of study each day.`
        : "Schedule dates updated. All assignments are already complete.");
    } catch (cause) {
      setScheduleFormError(cause instanceof Error ? cause.message : "Could not save schedule settings.");
    }
  };

  const undoScheduleChange = async (): Promise<void> => {
    if (!scheduleUndoSnapshot) return;
    try {
      const restored = await replaceStudentStudySchedule(scheduleUndoSnapshot);
      setStudySchedule(restored);
      setScheduleStartDate(restored.startDate);
      setScheduleExamDate(restored.examDate ?? "");
      setNoExamDateYet(restored.examDate === null);
      setSelectedDaysOff(restored.daysOff);
      setDailyStudyHours(restored.dailyStudyHours ?? 2);
      setScheduleCursorDate(toDateKey());
      setScheduleUndoSnapshot(null);
      setScheduleToastMessage(null);
    } catch (cause) { setScheduleToastMessage(cause instanceof Error ? cause.message : "Could not restore schedule."); }
  };

  const toggleScheduleTask = async (taskId: string): Promise<void> => {
    if (!studySchedule) return;
    const task = studySchedule.tasks.find((item) => item.id === taskId);
    if (!task) return;
    try {
      const next = await updateStudentScheduleAssignment(taskId, { completed: !task.completed });
      setStudySchedule(next);
      setScheduleUndoSnapshot(null);
      setScheduleToastMessage(null);
    } catch (cause) { setScheduleToastMessage(cause instanceof Error ? cause.message : "Could not update assignment."); }
  };

  const removeScheduleTask = async (taskId: string): Promise<void> => {
    if (!studySchedule) return;
    const task = studySchedule.tasks.find((item) => item.id === taskId);
    try {
      setScheduleUndoSnapshot(studySchedule);
      setStudySchedule(await deleteStudentScheduleAssignment(taskId));
      setScheduleToastMessage(`Assignment removed${task ? `: ${task.title}` : ""}.`);
    } catch (cause) { setScheduleUndoSnapshot(null); setScheduleToastMessage(cause instanceof Error ? cause.message : "Could not remove assignment."); }
  };

  const moveScheduleTask = async (taskId: string, date: string): Promise<void> => {
    try {
      const next = await updateStudentScheduleAssignment(taskId, { date });
      setStudySchedule(next);
      setSelectedScheduleTask(next.tasks.find((task) => task.id === taskId) ?? null);
    } catch (cause) { setScheduleToastMessage(cause instanceof Error ? cause.message : "Could not move assignment."); }
  };

  const moveScheduleCursor = (direction: -1 | 1): void => {
    if (scheduleView === "month") {
      setScheduleCursorDate((current) => {
        const date = new Date(`${current}T00:00:00`);
        date.setMonth(date.getMonth() + direction);
        return toDateKey(date);
      });
      return;
    }
    setScheduleCursorDate((current) => addDaysToDateKey(current, (scheduleView === "day" ? 1 : 7) * direction));
  };

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "Select a date";
    const date = new Date(dateStr + "T00:00:00");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const suffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    return `${month} ${day}${suffix(day)}, ${year}`;
  };

  const calculateScheduleWeeks = (startStr: string, endStr: string): number => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr + "T00:00:00").getTime();
    const end = new Date(endStr + "T00:00:00").getTime();
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    return Math.max(1, Math.round(diffDays / 7));
  };

  const toggleAllPerfSubjects = (): void => {
    const nextState = !isAllPerfExpanded;
    setIsAllPerfExpanded(nextState);
    const updated: Record<string, boolean> = {};
    performanceSubjects.forEach((sub) => {
      updated[sub.id] = nextState;
    });
    setExpandedPerfSubjects(updated);
  };

  const togglePerfSubject = (id: string): void => {
    setExpandedPerfSubjects((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Auto-open modal if ?create-test or ?upgrade in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("create-test") || params.get("modal") === "create-test") {
        setIsCreateTestOpen(true);
      }
      if (params.has("upgrade") || params.get("modal") === "upgrade") {
        setIsUpgradeModalOpen(true);
      }
      if (params.get("tab") === "performance" || params.has("performance")) {
        setActiveTab("performance");
      }
      if (
        params.get("tab") === "cat-exams" ||
        params.has("cat-exams") ||
        params.has("cat")
      ) {
        setActiveTab("cat-exams");
      }
      if (
        params.get("tab") === "previous-tests" ||
        params.has("previous-tests") ||
        params.has("previous")
      ) {
        setActiveTab("previous-tests");
      }
      if (
        params.has("schedule") ||
        params.get("modal") === "schedule" ||
        params.get("modal") === "study-schedule"
      ) {
        setIsScheduleModalOpen(true);
      }
      // Dynamic Subject detection (e.g. child-health, adult-health, etc.)
      const matchedSubject = subjectsList.find(
        (s) =>
          params.get("tab") === s.id ||
          params.has(s.id) ||
          params.get("subject") === s.id ||
          (s.id === "maternal-newborn" &&
            (params.has("maternal") ||
              params.has("maternal-and-newborn-health") ||
              params.has("maternal-newborn-health") ||
              params.get("subject") === "maternal-and-newborn-health" ||
              params.get("tab") === "maternal-and-newborn-health"))
      );

      if (matchedSubject) {
        setActiveTab("subject");
        setSelectedSubjectId(matchedSubject.id);
        if (params.get("subtab") === "standalone" || params.has("standalone")) {
          setSubjectSubTab("standalone");
        } else if (params.get("subtab") === "crash-course" || params.has("crash-course")) {
          setSubjectSubTab("crash-course");
        } else if (params.get("subtab") === "cheat-sheets" || params.has("cheat-sheets")) {
          setSubjectSubTab("cheat-sheets");
        } else if (
          params.get("subtab") === "performance" ||
          params.has("subject-performance") ||
          params.has("adult-performance")
        ) {
          setSubjectSubTab("performance");
        } else {
          setSubjectSubTab(
            matchedSubject.id === "fundamentals" || matchedSubject.id === "management-of-care"
              ? "standalone"
              : "case-studies"
          );
        }
      } else if (params.get("tab") === "subject") {
        setActiveTab("subject");
        setSelectedSubjectId("adult-health");
        if (params.get("subtab") === "standalone" || params.has("standalone")) {
          setSubjectSubTab("standalone");
        } else if (params.get("subtab") === "crash-course" || params.has("crash-course")) {
          setSubjectSubTab("crash-course");
        } else if (params.get("subtab") === "cheat-sheets" || params.has("cheat-sheets")) {
          setSubjectSubTab("cheat-sheets");
        } else if (
          params.get("subtab") === "performance" ||
          params.has("subject-performance") ||
          params.has("adult-performance")
        ) {
          setSubjectSubTab("performance");
        } else {
          setSubjectSubTab("case-studies");
        }
      } else if (params.get("tab") === "case-studies" || params.has("case-studies")) {
        setActiveTab("case-studies");
      } else if (params.get("tab") === "standalone" || params.has("standalone")) {
        setActiveTab("standalone");
      } else if (params.get("tab") === "crash-course" || params.has("crash-course") || params.get("tab") === "crash-courses") {
        setActiveTab("crash-course");
      } else if (params.get("tab") === "cheat-sheets" || params.has("cheat-sheets")) {
        setActiveTab("cheat-sheets");
      } else if (params.get("tab") === "strategy-course" || params.has("strategy-course")) {
        setActiveTab("strategy-course");
      } else if (params.get("tab") === "faqs" || params.has("faqs")) {
        setActiveTab("faqs");
      } else if (
        params.get("tab") === "subject-performance" ||
        params.has("subject-performance") ||
        params.has("adult-performance")
      ) {
        setActiveTab("subject");
        setSelectedSubjectId("adult-health");
        setSubjectSubTab("performance");
      }
    }
  }, []);

  // Global Ctrl + F shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSubjects = subjectsList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.experts.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCrashTopics =
    selectedSubjectId === "pharmacology"
      ? pharmacologyCrashTopics
      : selectedSubjectId === "mental-health"
        ? mentalHealthCrashTopics
        : selectedSubjectId === "maternal-newborn"
          ? maternalNewbornCrashTopics
          : selectedSubjectId === "fundamentals"
            ? fundamentalsCrashTopics
            : selectedSubjectId === "child-health"
              ? childHealthCrashTopics
              : adultHealthCrashTopics;

  const filteredCrashTopics = currentCrashTopics.filter((t) =>
    t.title.toLowerCase().includes(crashFilterQuery.toLowerCase())
  );

  const filteredMocCrashLessons = managementOfCareCrashLessons.filter((l) =>
    l.title.toLowerCase().includes(crashFilterQuery.toLowerCase())
  );

  const currentCheatCategories =
    selectedSubjectId === "management-of-care"
      ? managementOfCareCheatSheetCategories
      : selectedSubjectId === "pharmacology"
        ? pharmacologyCheatSheetCategories
        : selectedSubjectId === "mental-health"
          ? mentalHealthCheatSheetCategories
          : selectedSubjectId === "maternal-newborn"
            ? maternalNewbornCheatSheetCategories
            : selectedSubjectId === "fundamentals"
              ? fundamentalsCheatSheetCategories
              : selectedSubjectId === "child-health"
                ? childHealthCheatSheetCategories
                : cheatSheetCategories;

  const currentCheatSheets =
    selectedSubjectId === "management-of-care"
      ? managementOfCareCheatSheets
      : selectedSubjectId === "pharmacology"
        ? pharmacologyCheatSheets
        : selectedSubjectId === "mental-health"
          ? mentalHealthCheatSheets
          : selectedSubjectId === "maternal-newborn"
            ? maternalNewbornCheatSheets
            : selectedSubjectId === "fundamentals"
              ? fundamentalsCheatSheets
              : selectedSubjectId === "child-health"
                ? childHealthCheatSheets
                : adultHealthCheatSheets;

  const allCheatCategoryLabel =
    selectedSubjectId === "management-of-care"
      ? "All Management of Care"
      : selectedSubjectId === "pharmacology"
        ? "All Pharmacology"
        : selectedSubjectId === "mental-health"
          ? "All Mental Health"
          : selectedSubjectId === "maternal-newborn"
            ? "All Maternal & Newborn Health"
            : selectedSubjectId === "fundamentals"
              ? "All Fundamentals"
              : selectedSubjectId === "child-health"
                ? "All Child Health"
                : "All Adult Health";

  const effectiveCheatSystem =
    selectedCheatSystem.startsWith("All") || !currentCheatCategories.includes(selectedCheatSystem)
      ? allCheatCategoryLabel
      : selectedCheatSystem;

  const filteredCheatSheets = currentCheatSheets.filter((c) => {
    const matchesQuery = c.title.toLowerCase().includes(cheatFilterQuery.toLowerCase());
    const matchesCategory =
      effectiveCheatSystem === allCheatCategoryLabel || c.system === effectiveCheatSystem;
    return matchesQuery && matchesCategory;
  });

    const renderScheduleAssignmentModal = () => {
    if (!selectedScheduleTask) return null;
    const task = selectedScheduleTask;
    const actionLabel = task.action.replaceAll("-", " ");
    const subjectName = task.subjectId
      ? task.subjectId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Clinical Practice";

    return (
      <div
        className="sd-modal-overlay"
        onClick={() => setSelectedScheduleTask(null)}
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}
      >
        <div
          className="sd-modal sd-assignment-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "520px",
            width: "100%",
            borderRadius: "16px",
            padding: "24px 28px",
            background: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            border: "1px solid #e2e8f0"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  background: task.category === "green" ? "#dcfce7" : task.category === "teal" ? "#ccfbf1" : "#ede9fe",
                  color: task.category === "green" ? "#166534" : task.category === "teal" ? "#115e59" : "#4338ca"
                }}
              >
                {actionLabel}
              </span>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} /> {formatScheduleDuration(task.durationMinutes)}
              </span>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CalendarDays size={13} /> {task.date}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedScheduleTask(null)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                padding: "4px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e1b4b", margin: "0 0 10px 0", lineHeight: 1.3 }}>
            {task.title}
          </h2>

          {/* Subject Badge */}
          <div style={{ marginBottom: "14px" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Subject: </span>
            <span style={{ fontSize: "13px", color: "#4f46e5", fontWeight: 700 }}>{subjectName}</span>
          </div>

          {/* Description */}
          <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 20px 0", lineHeight: 1.55 }}>
            {task.description ||
              `Complete your scheduled NCLEX practice for ${subjectName}. Practicing questions on schedule strengthens clinical judgment and retention for test day.`}
          </p>

          {/* Status Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: task.completed ? "#f0fdf4" : "#f8fafc",
              borderRadius: "10px",
              marginBottom: "24px",
              border: task.completed ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
            }}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: task.completed ? "#166534" : "#334155" }}>
                {task.completed ? "✓ Assignment Completed" : "Assignment Pending"}
              </div>
              <div style={{ fontSize: "12px", color: task.completed ? "#15803d" : "#64748b" }}>
                {task.completed ? "Recorded in your study streak" : "Not yet marked complete"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                void toggleScheduleTask(task.id);
                setSelectedScheduleTask((prev) => prev ? { ...prev, completed: !prev.completed } : null);
              }}
              style={{
                border: "none",
                background: task.completed ? "#dcfce7" : "#e0e7ff",
                color: task.completed ? "#15803d" : "#4338ca",
                padding: "7px 14px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
            </button>
          </div>

          {/* Footer Actions */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setSelectedScheduleTask(null)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                const targetTask = selectedScheduleTask;
                setSelectedScheduleTask(null);
                openScheduleTask(targetTask);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)"
              }}
            >
              <Play size={16} fill="#ffffff" />
              {task.action === "daily-question" || task.action === "standalone"
                ? "Start Assignment Question"
                : task.action === "create-test"
                ? "Create Custom Test"
                : task.action === "case-study"
                ? "Open Case Study"
                : "Open Assignment"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUpgradeModal = () => {
    if (!isUpgradeModalOpen) return null;
    return (
      <div
        className="sd-modal-overlay"
        onClick={() => setIsUpgradeModalOpen(false)}
      >
        <div
          className="sd-upgrade-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
        >
          {/* Left Column: Testimonial Cards on Purple */}
          <div className="sd-upg-left-col">
            {/* Review Card 1: Alex Mendez, RN */}
            <div className="sd-upg-review-card">
              <div className="sd-upg-stars" aria-label="5 stars rating">
                {"★★★★★"}
              </div>
              <p className="sd-upg-quote">
                &ldquo;I am a repeat test taker, and I would not have passed my NCLEX this time around if it weren&apos;t for NCLEXLab. It looked almost identical to the actual exam.&rdquo;
              </p>
              <div className="sd-upg-author">
                <div className="sd-upg-avatar-wrap">
                  <img
                    src="/images/avatar-alex.jpg"
                    alt="Alex Mendez, RN"
                    className="sd-upg-avatar-img"
                  />
                </div>
                <div className="sd-upg-author-info">
                  <strong className="sd-upg-author-name">Alex Mendez, RN</strong>
                  <span className="sd-upg-author-tag">Passed - Next Gen NCLEX®</span>
                </div>
              </div>
            </div>

            {/* Review Card 2: Caroline Jetel, RN */}
            <div className="sd-upg-review-card">
              <div className="sd-upg-stars" aria-label="5 stars rating">
                {"★★★★★"}
              </div>
              <p className="sd-upg-quote">
                &ldquo;When I found NCLEXLab I felt like I had found heaven. It is so well organized and simplified and even has study schedules available which I found to be one of my favorite parts of the entire site!&rdquo;
              </p>
              <div className="sd-upg-author">
                <div className="sd-upg-avatar-wrap">
                  <img
                    src="/images/avatar-caroline.jpg"
                    alt="Caroline Jetel, RN"
                    className="sd-upg-avatar-img"
                  />
                </div>
                <div className="sd-upg-author-info">
                  <strong className="sd-upg-author-name">Caroline Jetel, RN</strong>
                  <span className="sd-upg-author-tag">Passed - Next Gen NCLEX®</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Benefits & Actions on White */}
          <div className="sd-upg-right-col">
            <button
              type="button"
              className="sd-upg-close-btn"
              onClick={() => setIsUpgradeModalOpen(false)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <h2 id="upgrade-modal-title" className="sd-upg-title">
              Pass the NCLEX®. Guaranteed.
            </h2>
            <p className="sd-upg-subtitle">
              Trusted by 200,000+ students preparing for the NCLEX®.
            </p>

            {/* 2-Column Features Grid */}
            <div className="sd-upg-features-grid">
              {/* Column 1 */}
              <div className="sd-upg-features-col">
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>2800 NCLEX® Questions</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>4 CAT Readiness Exams</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>Crash Course Videos</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>Pass Targets Tracker</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>Mobile App Access</span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="sd-upg-features-col">
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>50 NCLEX® Cases</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>140+ Cheat Sheets</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>Study Schedule Creator</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>Ask NCLEX AI</span>
                </div>
                <div className="sd-upg-feature-item">
                  <span className="sd-upg-check-icon">
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                  <span>Pass Guarantee</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sd-upg-actions">
              <button
                type="button"
                className="sd-upg-btn-primary"
                onClick={() => {
                  setIsUpgradeModalOpen(false);
                  setIsPaywallOpen(true);
                }}
              >
                <Shield size={16} />
                <span>Pay &amp; Upgrade Membership</span>
              </button>

              <button
                type="button"
                className="sd-upg-btn-secondary"
                onClick={() => setIsUpgradeModalOpen(false)}
              >
                I&apos;m Not Ready Yet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaywallModal = () => {
    if (!isPaywallOpen) return null;

    const basePrice = paywallPlanId === "3-month" ? 149 : 99;
    const finalPrice = paywallDiscountApplied ? Math.round(basePrice * 0.8) : basePrice;

    const handleExecutePayment = (e: React.FormEvent) => {
      e.preventDefault();
      setQuestionApiError("Payment is not processed in this project yet. Paid questions stay locked until a payment provider confirms the transaction on the server.");
      setIsPaywallOpen(false);
    };

    return (
      <div
        className="sd-modal-overlay"
        onClick={() => !isProcessingPayment && setIsPaywallOpen(false)}
        style={{ zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div
          className="sd-modal-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "600px",
            width: "95%",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(18, 19, 36, 0.4)",
            overflow: "hidden",
            padding: 0
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
              color: "#ffffff",
              padding: "24px 28px",
              position: "relative"
            }}
          >
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={() => setIsPaywallOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                color: "#ffffff",
                cursor: "pointer",
                display: "grid",
                placeItems: "center"
              }}
            >
              <X size={16} />
            </button>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(251, 191, 36, 0.2)", color: "#fef08a", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>
              <Lock size={12} />
              <span>PREMIUM NCLEX QUESTION BANK</span>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "2px 0 6px", color: "#ffffff" }}>
              Unlock This Paid Question
            </h2>
            <p style={{ fontSize: "13px", color: "#c7d2fe", margin: 0, lineHeight: 1.4 }}>
              Specialty questions require an active student membership. Pay once to unlock all 3,500+ Next Gen questions, video explanations &amp; NCLEX AI tutor.
            </p>
          </div>

          <div style={{ padding: "24px 28px", maxHeight: "80vh", overflowY: "auto" }}>
            {/* Target Question Preview Card */}
            {paywallTargetQuestion && (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  marginBottom: "20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", background: "#eef2ff", padding: "2px 8px", borderRadius: "6px" }}>
                    {paywallTargetQuestion.subjectName}
                  </span>
                  <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Lock size={12} /> Paid Question
                  </span>
                </div>
                <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                  {paywallTargetQuestion.title}
                </strong>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0", lineHeight: 1.4 }}>
                  {paywallTargetQuestion.stem.slice(0, 110)}...
                </p>
              </div>
            )}

            {/* Plan Options Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#334155", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Select Your Access Pass
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* 3-Month Plan */}
                <div
                  onClick={() => setPaywallPlanId("3-month")}
                  style={{
                    border: paywallPlanId === "3-month" ? "2px solid #6366f1" : "1px solid #cbd5e1",
                    background: paywallPlanId === "3-month" ? "#f5f3ff" : "#ffffff",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    position: "relative"
                  }}
                >
                  <span style={{ position: "absolute", top: -9, right: 10, background: "#f59e0b", color: "#ffffff", fontSize: "9px", fontWeight: 800, padding: "2px 6px", borderRadius: "6px" }}>
                    POPULAR
                  </span>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#1e1b4b" }}>3-Month Pass</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#4f46e5", margin: "4px 0" }}>
                    ${paywallDiscountApplied ? Math.round(149 * 0.8) : 149} <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>USD</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#059669", fontWeight: 700 }}>✓ 100% Pass Guarantee</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>All 3,500+ questions &amp; 4 CATs</div>
                </div>

                {/* 1-Month Plan */}
                <div
                  onClick={() => setPaywallPlanId("1-month")}
                  style={{
                    border: paywallPlanId === "1-month" ? "2px solid #6366f1" : "1px solid #cbd5e1",
                    background: paywallPlanId === "1-month" ? "#f5f3ff" : "#ffffff",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#1e1b4b" }}>1-Month Pass</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#4f46e5", margin: "4px 0" }}>
                    ${paywallDiscountApplied ? Math.round(99 * 0.8) : 99} <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>USD</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>Standard Membership</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>All specialty questions &amp; cases</div>
                </div>
              </div>
            </div>

            {/* Promo Code Strip */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Discount code (try NCLEXBF26)"
                value={paywallPromo}
                onChange={(e) => setPaywallPromo(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  textTransform: "uppercase"
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (
                    paywallPromo.trim().toLowerCase() === "nclexbf26" ||
                    paywallPromo.trim().toLowerCase() === "nclex" ||
                    paywallPromo.trim().toLowerCase() === "nclex10"
                  ) {
                    setPaywallDiscountApplied(true);
                  } else {
                    alert("Invalid code. Use 'NCLEXBF26' for 20% discount!");
                  }
                }}
                style={{
                  background: "#e2e8f0",
                  color: "#0f172a",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {paywallDiscountApplied ? "Applied ✓" : "Apply"}
              </button>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleExecutePayment}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={paywallCardName}
                  onChange={(e) => setPaywallCardName(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Card Number
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    value={paywallCardNumber}
                    onChange={(e) => setPaywallCardNumber(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                  <span style={{ position: "absolute", right: 10, top: 9, fontSize: "11px", fontWeight: 700, color: "#6366f1" }}>
                    VISA / MC
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={paywallCardExpiry}
                    onChange={(e) => setPaywallCardExpiry(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    value={paywallCardCvc}
                    onChange={(e) => setPaywallCardCvc(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 800,
                  cursor: isProcessingPayment ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
                }}
              >
                {isProcessingPayment ? (
                  <>
                    <RotateCcw size={16} className="sd-spin-icon" />
                    <span>Processing Payment with Bank...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pay ${finalPrice} USD &amp; Unlock All Questions</span>
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: "14px", textAlign: "center", fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <ShieldCheck size={14} color="#059669" />
              <span>Encrypted 256-Bit SSL Checkout · Instant Activation</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const scheduleSummary = studySchedule ? getScheduleSummary(studySchedule) : null;
  const scheduleEndDate = studySchedule ? getScheduleEndDate(studySchedule) : "";
  const visibleScheduleDates = studySchedule
    ? scheduleView === "day"
      ? [scheduleCursorDate]
      : scheduleView === "week"
        ? getScheduleDateRange(getWeekStartDate(scheduleCursorDate), addDaysToDateKey(getWeekStartDate(scheduleCursorDate), 6))
        : getScheduleDateRange(getWeekStartDate(`${scheduleCursorDate.slice(0, 7)}-01`), addDaysToDateKey(getWeekStartDate(`${scheduleCursorDate.slice(0, 7)}-01`), 41))
    : [];
  const formatScheduleDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}` : `${remainingMinutes}m`;
  };
  const formatScheduleDay = (dateKey: string): string =>
    new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
  const tasksOnScheduleDate = (dateKey: string): readonly StudyScheduleTask[] =>
    studySchedule?.tasks.filter((task) => task.date === dateKey && (
      scheduleFilter === "all" || (scheduleFilter === "questions"
        ? task.action === "create-test" || task.action === "daily-question" || task.action === "case-study" || task.action === "standalone" || task.action === "review"
        : task.action === "study-guide" || task.action === "video" || task.action === "study-group")
    )) ?? [];
  const scheduleMinutesOnDate = (dateKey: string): number =>
    tasksOnScheduleDate(dateKey).reduce((minutes, task) => minutes + (task.completed ? 0 : task.durationMinutes), 0);
  const isScheduleDayOff = (dateKey: string): boolean => {
    if (!studySchedule || studySchedule.daysOff === "None (7 days/week)") return false;
    return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }) === studySchedule.daysOff;
  };
  const isWithinSchedule = (dateKey: string): boolean => Boolean(studySchedule && dateKey >= studySchedule.startDate && dateKey <= scheduleEndDate);
  const scheduleCountdown = studySchedule?.examDate
    ? Math.max(0, Math.ceil(((Date.parse(`${studySchedule.examDate}T00:00:00Z`) - Date.parse(`${toDateKey()}T00:00:00Z`)) / 86_400_000)))
    : null;
  const scheduleMonthLabel = new Date(`${scheduleCursorDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const openScheduleTask = (task: StudyScheduleTask): void => {
    switch (task.action) {
      case "create-test":
        setActiveTab("home");
        setIsCreateTestOpen(true);
        break;
      case "daily-question": {
        const pool = standaloneQuestions.length > 0 ? standaloneQuestions : getStoredStandaloneQuestions();
        if (pool.length > 0) {
          const charCodeSum = task.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
          const qIndex = Math.abs(charCodeSum) % pool.length;
          startStandaloneExam(pool, qIndex);
        } else {
          setActiveTab("home");
          setIsCreateTestOpen(true);
        }
        break;
      }
      case "standalone": {
        const pool = standaloneQuestions.length > 0 ? standaloneQuestions : getStoredStandaloneQuestions();
        const subjectQuestions = task.subjectId
          ? pool.filter((q) => q.subjectId === task.subjectId)
          : pool;
        const targetList = subjectQuestions.length > 0 ? subjectQuestions : pool;
        if (targetList.length > 0) {
          startStandaloneExam(targetList, 0);
        } else {
          setSelectedSubjectId(task.subjectId ?? "adult-health");
          setSubjectSubTab("standalone");
          setActiveTab("subject");
        }
        break;
      }
      case "case-study": {
        setSelectedSubjectId(task.subjectId ?? "adult-health");
        setSubjectSubTab("case-studies");
        setActiveTab("subject");
        break;
      }
      case "review": {
        const pool = standaloneQuestions.length > 0 ? standaloneQuestions : getStoredStandaloneQuestions();
        const reviewPool = pool.filter((q) => q.answered || q.bookmarked || q.poolStatus === "learning" || q.poolStatus === "reviewing");
        if (reviewPool.length > 0) {
          startStandaloneExam(reviewPool, 0);
        } else {
          setActiveTab("previous-tests");
        }
        break;
      }
      case "study-guide":
        setActiveTab("strategy-course");
        break;
      case "video":
        setActiveTab("crash-course");
        break;
      case "study-group":
        window.open("https://www.facebook.com/Yoursellhub", "_blank", "noopener,noreferrer");
        break;
    }
  };

  const schedulePreview = (() => {
    const settings = {
      startDate: scheduleStartDate,
      examDate: noExamDateYet ? null : scheduleExamDate,
      daysOff: selectedDaysOff,
      dailyStudyHours
    } as const;
    try {
      return scheduleDialogMode === "create" || !studySchedule
        ? createStudySchedule(settings)
        : rebalanceStudySchedule(studySchedule, settings);
    } catch {
      return null;
    }
  })();
  const schedulePreviewSummary = schedulePreview ? getScheduleSummary(schedulePreview) : null;

  if (isTestActive) {
    const caseResults = calculateCaseResults();
    const standaloneQuestionsToUse =
      activeStandaloneQuestionsList.length > 0
        ? activeStandaloneQuestionsList
        : standaloneQuestions.length > 0
          ? standaloneQuestions
          : [];
    const currentStandaloneQuestion =
      standaloneQuestionsToUse[testQuestionIndex] || standaloneQuestionsToUse[0] || {
        id: "sq-fallback",
        subjectId: "free",
        subjectName: "Free Questions",
        title: "Clinical Practice Question",
        stem: "No questions currently loaded. Please author a question in the Admin Dashboard.",
        type: "Multiple Choice" as const,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        rationale: "Default question rationale.",
        status: "Published" as const,
        createdAt: "Today",
        updatedAt: "Today",
        author: "Content Admin Team"
      };
    const currentStandaloneAnswer =
      standaloneAnswers[testQuestionIndex] || { selectedOption: null, isSubmitted: false };

    return (
      <div className="sd-test-screen" role="region" aria-label="NCLEX-RN Test Interface">
        {/* Top Blue Header Bar (Matches media_1795082670408_4d175c34.jpg to media_1795082793266_06b56935.jpg) */}
        <header className="sd-test-header">
          {/* Left Header: Title & Calculator */}
          <div className="sd-test-header-left">
            <span className="sd-test-exam-title">
              {activeTestExamType === "standalone"
                ? `NCLEX-RN Standalone Test (${isTutorMode ? "Tutored" : "Untutored"}, ${isTimedMode ? "Timed" : "Untimed"})`
                : `NCLEX-RN Test (${isTutorMode ? "Tutored" : "Untutored"}, ${isTimedMode ? "Timed" : "Untimed"})`}
            </span>
            <button
              type="button"
              className="sd-test-calc-btn"
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              title="Toggle on-screen calculator"
            >
              <Calculator size={13} />
              <span>Calculator</span>
            </button>
          </div>

          {/* Center Brand */}
          <div className="sd-test-header-center">
            nclex.com <span>| NCLEX</span>
          </div>

          {/* Right Header: Timer, Question Count, Settings, Mark */}
          <div className="sd-test-header-right">
            <div className="sd-test-timer-badge" title="Elapsed Time">
              <Clock size={14} />
              <span>{formatTestTimer(testTimerSeconds)}</span>
            </div>

            <div className="sd-test-qcount-badge">
              <FileText size={14} />
              <span>
                {isResultsScreenActive
                  ? "Exam Completed"
                  : activeTestExamType === "standalone"
                    ? `Question ${testQuestionIndex + 1} of ${standaloneQuestionsToUse.length}`
                    : `Question ${testQuestionIndex + 1} of 6`}
              </span>
            </div>

            <button
              type="button"
              className="sd-test-header-action-btn"
              onClick={() => setIsTestSettingsOpen(!isTestSettingsOpen)}
              title="Exam Settings"
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>

            <button
              type="button"
              className={`sd-test-header-action-btn ${markedQuestions[testQuestionIndex] ? "sd-test-mark-active" : ""}`}
              onClick={() =>
                setMarkedQuestions((prev) => ({
                  ...prev,
                  [testQuestionIndex]: !prev[testQuestionIndex]
                }))
              }
              title="Mark this question to review later"
            >
              <Bookmark size={14} fill={markedQuestions[testQuestionIndex] ? "currentColor" : "none"} />
              <span>Mark for Review</span>
            </button>
          </div>
        </header>

        {testCreationNotice && (
          <div role="status" style={{ margin: "12px 18px 0", padding: "10px 12px", borderRadius: "8px", background: "#fff7ed", color: "#9a3412", fontSize: "13px" }}>
            {testCreationNotice}
          </div>
        )}

        {/* Settings Dropdown Popover */}
        {isTestSettingsOpen && (
          <div
            style={{
              position: "absolute",
              top: "58px",
              right: "60px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              zIndex: 10001,
              minWidth: "180px",
              color: "#1e293b",
              fontSize: "13px"
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px" }}>
              Exam Options
            </div>
            <button
              type="button"
              style={{ width: "100%", textAlign: "left", padding: "6px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}
              onClick={() => setIsTimerPaused(!isTimerPaused)}
            >
              {isTimerPaused ? "▶ Resume Timer" : "⏸ Pause Timer"}
            </button>
            <button
              type="button"
              style={{ width: "100%", textAlign: "left", padding: "6px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: "4px", color: "#0284c7" }}
              onClick={() => {
                setIsResultsScreenActive(true);
                setIsTestSettingsOpen(false);
              }}
            >
              Submit &amp; View Results
            </button>
            <button
              type="button"
              style={{ width: "100%", textAlign: "left", padding: "6px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: "4px", color: "#dc2626", marginTop: "4px" }}
              onClick={() => {
                if (confirm("Are you sure you want to end this test session and return to the dashboard?")) {
                  setIsTestActive(false);
                  setIsTestSettingsOpen(false);
                }
              }}
            >
              Exit to Dashboard
            </button>
          </div>
        )}

        {/* On-Screen Calculator Floating Modal */}
        {isCalculatorOpen && (
          <div className="sd-calc-popup" role="dialog" aria-label="On-screen Calculator">
            <div className="sd-calc-header">
              <span>NCLEX-RN Calculator</span>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px" }}
                aria-label="Close calculator"
              >
                <X size={14} />
              </button>
            </div>
            <div className="sd-calc-display">{calcInput}</div>
            <div className="sd-calc-grid">
              {["C", "(", ")", "/"].map((btn) => (
                <button key={btn} type="button" className="sd-calc-btn sd-calc-btn-op" onClick={() => handleCalcInput(btn)}>
                  {btn}
                </button>
              ))}
              {["7", "8", "9", "*"].map((btn) => (
                <button key={btn} type="button" className={`sd-calc-btn ${["*"].includes(btn) ? "sd-calc-btn-op" : ""}`} onClick={() => handleCalcInput(btn)}>
                  {btn}
                </button>
              ))}
              {["4", "5", "6", "-"].map((btn) => (
                <button key={btn} type="button" className={`sd-calc-btn ${["-"].includes(btn) ? "sd-calc-btn-op" : ""}`} onClick={() => handleCalcInput(btn)}>
                  {btn}
                </button>
              ))}
              {["1", "2", "3", "+"].map((btn) => (
                <button key={btn} type="button" className={`sd-calc-btn ${["+"].includes(btn) ? "sd-calc-btn-op" : ""}`} onClick={() => handleCalcInput(btn)}>
                  {btn}
                </button>
              ))}
              {["0", ".", "="].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  className={`sd-calc-btn ${btn === "=" ? "sd-calc-btn-eq" : ""}`}
                  style={btn === "0" ? { gridColumn: "span 2" } : {}}
                  onClick={() => handleCalcInput(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 1: FINAL EXAM RESULTS SCREEN ("end m submit kr ky result bi show hona cheyey")
            ===================================================================== */}
        {isResultsScreenActive ? (
          activeTestExamType === "cat" ? (
            <div className="sd-exam-results-screen">
              <div className="sd-results-container" style={{ maxWidth: "880px" }}>
                {(() => {
                  const summary = catExamSummary ?? (catSession ? generateCatExamSummary(catSession) : null);
                  if (!summary) return <div>No exam summary available.</div>;
                  const isPass = summary.passStatus === "PASS";

                  return (
                    <>
                      {/* Hero Banner */}
                      <div className="sd-results-hero" style={{
                        background: isPass
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
                      }}>
                        <div className="sd-results-hero-left">
                          <div className="sd-results-trophy-circle" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                            <Target size={30} color="#ffffff" />
                          </div>
                          <div>
                            <h2 className="sd-results-hero-title" style={{ color: "#ffffff" }}>
                              {isPass
                                ? `Passed! CAT Readiness Exam ${summary.examNumber}`
                                : `Did Not Pass — CAT Readiness Exam ${summary.examNumber}`}
                            </h2>
                            <p className="sd-results-hero-subtitle" style={{ color: "rgba(255,255,255,0.88)" }}>
                              {summary.stopReason} · Real NCLEX Computerized Adaptive Testing
                            </p>
                          </div>
                        </div>
                        <div className="sd-results-pass-badge" style={{
                          backgroundColor: "#ffffff",
                          color: isPass ? "#065f46" : "#991b1b"
                        }}>
                          {summary.passProbability}% Likelihood of Passing
                        </div>
                      </div>

                      {/* Stats 4-Card Grid */}
                      <div className="sd-results-stats-grid">
                        <div className="sd-results-stat-box">
                          <div className={`sd-results-stat-val ${isPass ? "green" : ""}`}>
                            {summary.accuracyPercent}%
                          </div>
                          <div className="sd-results-stat-label">
                            Accuracy ({summary.totalQuestions} Questions)
                          </div>
                        </div>
                        <div className="sd-results-stat-box">
                          <div className="sd-results-stat-val">
                            {summary.finalTheta > 0 ? `+${summary.finalTheta}` : `${summary.finalTheta}`}
                          </div>
                          <div className="sd-results-stat-label">Ability (θ Logits)</div>
                        </div>
                        <div className="sd-results-stat-box">
                          <div className="sd-results-stat-val">±{summary.finalSem}</div>
                          <div className="sd-results-stat-label">Standard Error (SEM)</div>
                        </div>
                        <div className="sd-results-stat-box">
                          <div className="sd-results-stat-val green">
                            {summary.passProbability}%
                          </div>
                          <div className="sd-results-stat-label">NCLEX Pass Probability</div>
                        </div>
                      </div>

                      {/* Client Needs Category Mastery Breakdown */}
                      <div style={{ marginTop: "24px", backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0", padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "14px" }}>
                          Performance by NCLEX Client Needs Area
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {summary.categoryBreakdown.map((cat) => (
                            <div key={cat.category} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                                  <span>{cat.category}</span>
                                  <span>{cat.accuracy}% ({cat.correct}/{cat.total || 1})</span>
                                </div>
                                <div style={{ width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                                  <div style={{
                                    width: `${cat.accuracy}%`,
                                    height: "100%",
                                    backgroundColor: cat.accuracy >= 75 ? "#10b981" : cat.accuracy >= 60 ? "#f59e0b" : "#ef4444",
                                    borderRadius: "999px"
                                  }} />
                                </div>
                              </div>
                              <span style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: "4px",
                                backgroundColor: cat.status === "Above Passing Standard" ? "#dcfce7" : cat.status === "Near Passing Standard" ? "#fef3c7" : "#fee2e2",
                                color: cat.status === "Above Passing Standard" ? "#166534" : cat.status === "Near Passing Standard" ? "#92400e" : "#991b1b",
                                whiteSpace: "nowrap"
                              }}>
                                {cat.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="sd-results-actions" style={{ marginTop: "28px" }}>
                        <button
                          type="button"
                          className="sd-results-btn-primary"
                          onClick={() => {
                            setTestQuestionIndex(0);
                            setIsResultsScreenActive(false);
                          }}
                        >
                          Review All Adaptive Questions
                        </button>
                        <button
                          type="button"
                          className="sd-results-btn-secondary"
                          onClick={() => {
                            setIsTestActive(false);
                            setIsResultsScreenActive(false);
                            setActiveTab("cat-exams");
                          }}
                        >
                          Return to CAT Exams
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : activeTestExamType === "standalone" ? (
            <div className="sd-exam-results-screen">
              <div className="sd-results-container">
                {(() => {
                  const totalQ = standaloneQuestionsToUse.length;
                  const correctQ = standaloneQuestionsToUse.reduce((acc, q, idx) => {
                    const ans = standaloneAnswers[idx];
                    return acc + (ans?.isSubmitted && ans.selectedOption === q.correctIndex ? 1 : 0);
                  }, 0);
                  const pct = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
                  const passing = pct >= 70;

                  return (
                    <>
                      {/* Hero Banner */}
                      <div className="sd-results-hero">
                        <div className="sd-results-hero-left">
                          <div className="sd-results-trophy-circle">
                            <Trophy size={30} />
                          </div>
                          <div>
                            <h2 className="sd-results-hero-title">
                              {passing ? "Congratulations! Standalone Exam Completed" : "Standalone Exam Completed"}
                            </h2>
                            <p className="sd-results-hero-subtitle">
                              NCLEX-RN Next Gen Standalone Questions · Real-Time Question Bank
                            </p>
                          </div>
                        </div>
                        <div className="sd-results-pass-badge">
                          {passing ? "Likely to Pass (High)" : "Review Needed"}
                        </div>
                      </div>

                      {/* Stats 4-Card Grid */}
                      <div className="sd-results-stats-grid">
                        <div className="sd-results-stat-box">
                          <div className={`sd-results-stat-val ${passing ? "green" : ""}`}>
                            {pct}%
                          </div>
                          <div className="sd-results-stat-label">
                            Score ({correctQ} / {totalQ} Items)
                          </div>
                        </div>
                        <div className="sd-results-stat-box">
                          <div className="sd-results-stat-val green">
                            {passing ? "High Readiness" : "Moderate"}
                          </div>
                          <div className="sd-results-stat-label">Pass Probability</div>
                        </div>
                        <div className="sd-results-stat-box">
                          <div className="sd-results-stat-val">
                            {formatTestTimer(testTimerSeconds)}
                          </div>
                          <div className="sd-results-stat-label">Time Spent</div>
                        </div>
                        <div className="sd-results-stat-box">
                          <div className="sd-results-stat-val green">Level 3</div>
                          <div className="sd-results-stat-label">Difficulty</div>
                        </div>
                      </div>

                      {/* Question Breakdown Table */}
                      <div className="sd-results-table-card" style={{ marginTop: "24px" }}>
                        <h3 className="sd-results-table-title">Question Breakdown &amp; Performance</h3>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                              <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                                <th style={{ padding: "10px 12px" }}>Item #</th>
                                <th style={{ padding: "10px 12px" }}>Question Title</th>
                                <th style={{ padding: "10px 12px" }}>Subject</th>
                                <th style={{ padding: "10px 12px" }}>Your Answer</th>
                                <th style={{ padding: "10px 12px" }}>Status</th>
                                <th style={{ padding: "10px 12px", textAlign: "right" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {standaloneQuestionsToUse.map((q, idx) => {
                                const ans = standaloneAnswers[idx];
                                const answered = ans && ans.isSubmitted;
                                const isCorrect = answered && ans.selectedOption === q.correctIndex;

                                return (
                                  <tr key={q.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>
                                      Question {idx + 1}
                                    </td>
                                    <td style={{ padding: "10px 12px", color: "#1e293b", maxWidth: "260px" }}>
                                      {q.title}
                                    </td>
                                    <td style={{ padding: "10px 12px", color: "#64748b" }}>
                                      {q.subjectName}
                                    </td>
                                    <td style={{ padding: "10px 12px", color: "#1e293b" }}>
                                      {answered && ans.selectedOption !== null
                                        ? `Option ${String.fromCharCode(65 + ans.selectedOption)}`
                                        : "Unanswered"}
                                    </td>
                                    <td style={{ padding: "10px 12px" }}>
                                      {isCorrect ? (
                                        <span style={{ color: "#10b981", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                          <Check size={14} /> Correct (+1)
                                        </span>
                                      ) : answered ? (
                                        <span style={{ color: "#ef4444", fontWeight: 700 }}>
                                          ✕ Incorrect (0)
                                        </span>
                                      ) : (
                                        <span style={{ color: "#94a3b8" }}>Skipped</span>
                                      )}
                                    </td>
                                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTestQuestionIndex(idx);
                                          setIsResultsScreenActive(false);
                                        }}
                                        style={{
                                          backgroundColor: "#f0fdf4",
                                          color: "#166534",
                                          border: "1px solid #bbf7d0",
                                          borderRadius: "6px",
                                          padding: "5px 12px",
                                          fontSize: "12px",
                                          fontWeight: 600,
                                          cursor: "pointer"
                                        }}
                                      >
                                        Review Question
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="sd-results-actions" style={{ marginTop: "24px" }}>
                        <button
                          type="button"
                          className="sd-results-btn-primary"
                          onClick={() => {
                            setTestQuestionIndex(0);
                            setIsResultsScreenActive(false);
                          }}
                        >
                          Review All Questions
                        </button>
                        <button
                          type="button"
                          className="sd-results-btn-secondary"
                          onClick={() => {
                            setIsTestActive(false);
                            setIsResultsScreenActive(false);
                          }}
                        >
                          Return to Dashboard
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="sd-exam-results-screen">
              <div className="sd-results-container">
                {/* Hero Banner */}
                <div className="sd-results-hero">
                  <div className="sd-results-hero-left">
                    <div className="sd-results-trophy-circle">
                      <Trophy size={30} />
                    </div>
                    <div>
                      <h2 className="sd-results-hero-title">
                        {caseResults.isPassing ? "Congratulations! Exam Completed" : "Exam Completed"}
                      </h2>
                      <p className="sd-results-hero-subtitle">
                        NCLEX-RN Next Gen Case Study · Child Health &amp; Gastrointestinal (Intussusception)
                      </p>
                    </div>
                  </div>
                  <div className="sd-results-pass-badge">
                    {caseResults.isPassing ? "Likely to Pass (Very High)" : "Review Needed"}
                  </div>
                </div>

                {/* Stats 4-Card Grid */}
                <div className="sd-results-stats-grid">
                  <div className="sd-results-stat-box">
                    <div className={`sd-results-stat-val ${caseResults.isPassing ? "green" : ""}`}>
                      {caseResults.percentage}%
                    </div>
                    <div className="sd-results-stat-label">
                      Score ({caseResults.totalScore} / {caseResults.maxScore} Pts)
                    </div>
                  </div>

                  <div className="sd-results-stat-box">
                    <div className="sd-results-stat-val green">
                      {caseResults.isPassing ? "Very High" : "Moderate"}
                    </div>
                    <div className="sd-results-stat-label">Pass Probability</div>
                  </div>

                  <div className="sd-results-stat-box">
                    <div className="sd-results-stat-val">
                      {formatTestTimer(testTimerSeconds)}
                    </div>
                    <div className="sd-results-stat-label">Time Spent</div>
                  </div>

                  <div className="sd-results-stat-box">
                    <div className="sd-results-stat-val green">Level 3</div>
                    <div className="sd-results-stat-label">Clinical Judgment</div>
                  </div>
                </div>

                {/* Performance Breakdown Table */}
                <div className="sd-results-breakdown-card">
                  <h3 className="sd-results-sec-heading">Performance by Question Item</h3>
                  <table className="sd-results-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Clinical Judgment Step</th>
                        <th>Points</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Item 1</td>
                        <td>Recognize Cues: Immediate Follow-up Clinical Findings</td>
                        <td>{caseResults.item1Score} / 5 pts</td>
                        <td>
                          <span className={`sd-results-pill ${caseResults.item1Score >= 4 ? "correct" : "partial"}`}>
                            {caseResults.item1Score === 5 ? "All Correct" : `${caseResults.item1Score} / 5 Correct`}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Item 2</td>
                        <td>Analyze Cues: Hallmark Features of Intussusception</td>
                        <td>{caseResults.item2Score} / 4 pts</td>
                        <td>
                          <span className={`sd-results-pill ${caseResults.item2Score >= 3 ? "correct" : "partial"}`}>
                            {caseResults.item2Score === 4 ? "All Correct" : `${caseResults.item2Score} / 4 Correct`}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Item 3</td>
                        <td>Prioritize Hypotheses: Pathophysiological Mechanism</td>
                        <td>{caseResults.item3Score} / 1 pt</td>
                        <td>
                          <span className={`sd-results-pill ${caseResults.item3Score === 1 ? "correct" : "partial"}`}>
                            {caseResults.item3Score === 1 ? "Correct" : "Incorrect"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Item 4</td>
                        <td>Generate Solutions: Anticipated Nursing Interventions</td>
                        <td>{caseResults.item4Score} / 6 pts</td>
                        <td>
                          <span className={`sd-results-pill ${caseResults.item4Score >= 5 ? "correct" : "partial"}`}>
                            {caseResults.item4Score === 6 ? "All Correct" : `${caseResults.item4Score} / 6 Correct`}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Item 5</td>
                        <td>Take Action: Priority Provider Order (Fluid Resuscitation)</td>
                        <td>{caseResults.item5Score} / 1 pt</td>
                        <td>
                          <span className={`sd-results-pill ${caseResults.item5Score === 1 ? "correct" : "partial"}`}>
                            {caseResults.item5Score === 1 ? "Correct" : "Incorrect"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Item 6</td>
                        <td>Evaluate Outcomes: Post-Reduction Patient Response</td>
                        <td>{caseResults.item6Score} / 5 pts</td>
                        <td>
                          <span className={`sd-results-pill ${caseResults.item6Score >= 4 ? "correct" : "partial"}`}>
                            {caseResults.item6Score === 5 ? "All Correct" : `${caseResults.item6Score} / 5 Correct`}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="sd-results-actions-row">
                  <button
                    type="button"
                    className="sd-results-btn-primary"
                    onClick={() => {
                      setIsResultsScreenActive(false);
                      setTestQuestionIndex(0);
                    }}
                  >
                    Review Questions &amp; Rationales
                  </button>

                  <button
                    type="button"
                    className="sd-results-btn-secondary"
                    onClick={() => {
                      setCaseItem1SelectedTokens([]);
                      setIsCaseItem1Submitted(false);
                      setCaseItem2Matrix({});
                      setIsCaseItem2Submitted(false);
                      setCaseItem3Slot1(null);
                      setCaseItem3Slot2(null);
                      setIsCaseItem3Submitted(false);
                      setCaseItem4Selections({});
                      setIsCaseItem4Submitted(false);
                      setCaseItem5Selected(null);
                      setIsCaseItem5Submitted(false);
                      setCaseItem6FollowUp([]);
                      setIsCaseItem6Submitted(false);
                      setTestTimerSeconds(0);
                      setTestQuestionIndex(0);
                      setIsResultsScreenActive(false);
                    }}
                  >
                    Retake Case Study
                  </button>

                  <button
                    type="button"
                    className="sd-results-btn-secondary"
                    onClick={() => {
                      setIsTestActive(false);
                      setIsResultsScreenActive(false);
                    }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )) : (activeTestExamType === "standalone" || activeTestExamType === "cat") ? (
            <div className="sd-test-body">
              {/* Left Column: Clinical Context & Vignette */}
              <section className="sd-test-ehr-pane" aria-label="Clinical Vignette">
                <div className="sd-case-intro-banner">
                  {activeTestExamType === "cat"
                    ? `Next Generation NCLEX® · CAT Adaptive Readiness Exam ${catSession?.examNumber ?? 1}`
                    : "Next Generation NCLEX® · Standalone Clinical Question"}
                </div>

                <div className="sd-case-item-meta">
                  <div className="sd-case-item-number">
                    {activeTestExamType === "cat"
                      ? `Item ${testQuestionIndex + 1} (Ability θ: ${catSession?.currentTheta !== undefined && catSession.currentTheta > 0 ? `+${catSession.currentTheta}` : `${catSession?.currentTheta ?? 0}`})`
                      : `Question ${testQuestionIndex + 1} of ${standaloneQuestionsToUse.length}`}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "6px" }}>
                    <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>
                      {currentStandaloneQuestion.subjectName}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "11.5px" }}>{currentStandaloneQuestion.type}</span>
                    <span style={{ color: "#94a3b8", fontSize: "11.5px" }}>•</span>
                    <span style={{ color: "#64748b", fontSize: "11.5px" }}>By {currentStandaloneQuestion.author}</span>
                  </div>
                </div>

                <div className="sd-test-ehr-card" style={{ marginTop: "14px" }}>
                  <h4 className="sd-ehr-dept-title" style={{ color: "#007399", marginBottom: "10px", fontSize: "15px" }}>
                    {currentStandaloneQuestion.title}
                  </h4>
                  <div style={{ fontSize: "13.5px", lineHeight: "1.75", color: "#1e293b", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {currentStandaloneQuestion.stem}
                  </div>

                  <div style={{ marginTop: "16px", padding: "14px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534", fontWeight: 700, fontSize: "12px", marginBottom: "4px" }}>
                      <CheckCircle2 size={15} />
                      <span>Clinical Judgment Measurement Framework</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#15803d", lineHeight: "1.5" }}>
                      Synthesize client cues, recognize potential emergencies, and determine the priority nursing action or diagnosis.
                    </p>
                  </div>
                </div>
              </section>

              {/* Right Column: Question Choices, Submit, Detailed Rationale & AI */}
              <main className="sd-test-question-pane" aria-label="Question & Choices">
                <div className="sd-test-question-header">
                  <div className="sd-test-q-meta">
                    <span className="sd-test-q-number">Question {testQuestionIndex + 1}</span>
                    <span className="sd-test-q-type">{currentStandaloneQuestion.type}</span>
                  </div>
                  <h3 className="sd-test-q-prompt">
                    Select the best response for the clinical scenario described:
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                  {currentStandaloneQuestion.options.map((opt, optIdx) => {
                    const isSelected = currentStandaloneAnswer.selectedOption === optIdx;
                    const isCorrect = optIdx === currentStandaloneQuestion.correctIndex;
                    let border = "1px solid #cbd5e1";
                    let bg = "#ffffff";
                    let color = "#1e293b";

                    if (currentStandaloneAnswer.isSubmitted) {
                      if (isCorrect) {
                        border = "2px solid #10b981";
                        bg = "#ecfdf5";
                        color = "#065f46";
                      } else if (isSelected && !isCorrect) {
                        border = "2px solid #ef4444";
                        bg = "#fef2f2";
                        color = "#991b1b";
                      }
                    } else if (isSelected) {
                      border = "2px solid #007399";
                      bg = "#f0f9ff";
                      color = "#0369a1";
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => {
                          if (!currentStandaloneAnswer.isSubmitted) {
                            setStandaloneAnswers((prev) => ({
                              ...prev,
                              [testQuestionIndex]: {
                                selectedOption: optIdx,
                                isSubmitted: false
                              }
                            }));
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 16px",
                          borderRadius: "8px",
                          border,
                          backgroundColor: bg,
                          cursor: currentStandaloneAnswer.isSubmitted ? "default" : "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <input
                          type="radio"
                          name={`standalone-opt-${testQuestionIndex}`}
                          checked={isSelected}
                          onChange={() => {
                            if (!currentStandaloneAnswer.isSubmitted) {
                              setStandaloneAnswers((prev) => ({
                                ...prev,
                                [testQuestionIndex]: {
                                  selectedOption: optIdx,
                                  isSubmitted: false
                                }
                              }));
                            }
                          }}
                          disabled={currentStandaloneAnswer.isSubmitted}
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        <span
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: isSelected ? "#007399" : "#f1f5f9",
                            color: isSelected ? "#ffffff" : "#475569",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "12px",
                            flexShrink: 0
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span style={{ fontSize: "14px", color, fontWeight: isSelected || (currentStandaloneAnswer.isSubmitted && isCorrect) ? 600 : 400, flex: 1, lineHeight: "1.45" }}>
                          {opt}
                        </span>
                        {currentStandaloneAnswer.isSubmitted && isCorrect && (
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={16} /> Correct
                          </span>
                        )}
                        {currentStandaloneAnswer.isSubmitted && isSelected && !isCorrect && (
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={16} /> Incorrect
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Inline Submit Button */}
                {!currentStandaloneAnswer.isSubmitted && (
                  <div style={{ marginTop: "20px", marginBottom: "16px" }}>
                    <button
                      type="button"
                      className="sd-test-submit-btn"
                      disabled={currentStandaloneAnswer.selectedOption === null}
                      onClick={() => void submitStandaloneAnswer()}
                    >
                      Submit Answer
                    </button>
                  </div>
                )}

                {/* Post-submission Detailed Clinical Rationale & Feedback */}
                {currentStandaloneAnswer.isSubmitted && (
                  <div className="sd-expl-box">
                    <div className="sd-expl-metrics-grid">
                      <div className="sd-expl-metric-item">
                        <span className="sd-expl-metric-label">Credit</span>
                        <span className="sd-expl-metric-value highlight">
                          {currentStandaloneAnswer.selectedOption === currentStandaloneQuestion.correctIndex ? "1 / 1" : "0 / 1"}
                        </span>
                      </div>
                      <div className="sd-expl-metric-item">
                        <span className="sd-expl-metric-label">Scoring Rule</span>
                        <span className="sd-expl-metric-value">0/1 Standard</span>
                      </div>
                      <div className="sd-expl-metric-item">
                        <span className="sd-expl-metric-label">Status</span>
                        <span className="sd-expl-metric-value" style={{ color: currentStandaloneAnswer.selectedOption === currentStandaloneQuestion.correctIndex ? "#10b981" : "#ef4444" }}>
                          {currentStandaloneAnswer.selectedOption === currentStandaloneQuestion.correctIndex ? "Correct Answer" : "Incorrect Answer"}
                        </span>
                      </div>
                      <div className="sd-expl-metric-item">
                        <span className="sd-expl-metric-label">Time Spent</span>
                        <span className="sd-expl-metric-value">
                          {formatTestTimer(testTimerSeconds)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="sd-expl-title-row">
                        <FileText size={16} color="#007399" />
                        <span>Clinical Explanation &amp; Rationale</span>
                      </div>
                    </div>

                    <div className="sd-expl-content">
                      <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#1e293b" }}>
                        {currentStandaloneQuestion.rationale}
                      </p>

                      <div className="sd-expl-key-takeaway" style={{ marginTop: "14px" }}>
                        <strong>Key Takeaway:</strong> {currentStandaloneQuestion.title} — Correct Answer: Option {String.fromCharCode(65 + currentStandaloneQuestion.correctIndex)}.
                      </div>

                      {/* Interactive Ask nclex.com AI */}
                      {renderAiChatCard(currentStandaloneQuestion.title)}
                    </div>
                  </div>
                )}
              </main>
            </div>
          ) : (
          /* =====================================================================
              VIEW 2: ACTIVE 6-ITEM CASE STUDY (Matches media_1795082670408_4d175c34.jpg to media_1795082793266_06b56935.jpg)
              ===================================================================== */
          <div className="sd-test-body">
            {/* Left Pane: Electronic Health Record (EHR) */}
            <section className="sd-test-ehr-pane" aria-label="Electronic Health Record">
              <div className="sd-case-intro-banner">
                The following scenario applies to the next 6 items.
              </div>

              <div className="sd-case-item-meta">
                <div className="sd-case-item-number">Item {testQuestionIndex + 1} of 6</div>
                <div className="sd-case-item-desc">
                  The nurse is caring for a 6-month-old male client.
                </div>
              </div>

              <div className="sd-test-ehr-tabs">
                <button
                  type="button"
                  className={`sd-test-ehr-tab ${caseEhrTab === "nurses-notes" ? "active" : ""}`}
                  onClick={() => setCaseEhrTab("nurses-notes")}
                >
                  Nurses&apos; Notes
                </button>
                <button
                  type="button"
                  className={`sd-test-ehr-tab ${caseEhrTab === "vitals" ? "active" : ""}`}
                  onClick={() => setCaseEhrTab("vitals")}
                >
                  Vital Signs
                </button>
                <button
                  type="button"
                  className={`sd-test-ehr-tab ${caseEhrTab === "labs" ? "active" : ""}`}
                  onClick={() => setCaseEhrTab("labs")}
                >
                  Laboratory Results
                </button>
              </div>

              <div className="sd-test-ehr-card">
                {caseEhrTab === "nurses-notes" && (
                  <div style={{ fontSize: "13px", lineHeight: "1.7", color: "#1e293b" }}>
                    <span className="sd-tag-day1">Day 1</span>
                    <h4 className="sd-ehr-dept-title">Emergency Department</h4>
                    <p style={{ margin: "0 0 10px" }}>
                      <span className="sd-ehr-timestamp">1330:</span> Client was brought to the emergency department by his mother. The mother states the client is a 6-month-old male and that they identify as &ldquo;Hispanic or Latino.&rdquo; The child has had liquid diarrhea for the past day, and his last diaper change contained a small amount of{" "}
                      <mark className="sd-ehr-highlight-sample">blood and mucus</mark>. The mother reports that several times over the past hour, while the child was playing with his toys, he would{" "}
                      <mark className="sd-ehr-highlight-sample">&ldquo;stop, curl up, and cry, then return to playing.&rdquo;</mark> Mom states the client also had{" "}
                      <mark className="sd-ehr-highlight-sample">&ldquo;green, mucousy vomit&rdquo;</mark> on the way to the hospital. His mother notes that she{" "}
                      <mark className="sd-ehr-highlight-sample">changed formula 3 weeks ago</mark>. The client has refused feeds since yesterday. The mother reports the client has a history of hip dysplasia and a ventricular septal defect diagnosed at 1 month of age, but she states the septal defect has since resolved on its own. Upon physical examination, the posterior fontanelle is firm, flat, and closed, and the anterior fontanelle is soft, flat, and open. S1 and S2 heart sounds auscultated; no murmurs detected. Abdominal auscultation reveals hyperactive bowel sounds. A{" "}
                      <mark className="sd-ehr-highlight-sample">4 cm elongated mass palpated in right upper quadrant (RUQ)</mark>. The child{" "}
                      <mark className="sd-ehr-highlight-sample">screamed and guarded his abdomen throughout the abdominal examination</mark>. The skin assessment reveals{" "}
                      <mark className="sd-ehr-highlight-sample">dry, erythematous patches behind the knees</mark> and an{" "}
                      <mark className="sd-ehr-highlight-sample">irregularly shaped blue mark on the sacrum</mark>. All other skin is pink and appropriate for ethnicity.
                    </p>

                    <p style={{ margin: "0 0 10px" }}>
                      <span className="sd-ehr-timestamp">1415:</span> Ultrasonography results confirmed the presence of intussusception. Hydrostatic enema for reduction planned for 1500.
                    </p>

                    <p style={{ margin: "0 0 14px" }}>
                      <span className="sd-ehr-timestamp">1430:</span> Called to the bedside by the client&apos;s mother. The client is tense, guarding his abdomen, diaphoretic, and crying. The client&apos;s mother reports emesis x 1 and states that the client has become increasingly irritable in the last 10 minutes. Upon physical examination of the client&apos;s abdomen, it has become more distended and firm.
                    </p>

                    <h4 className="sd-ehr-dept-title" style={{ marginTop: "16px" }}>Pediatric Intensive Care Unit</h4>
                    <p style={{ margin: "0 0 10px" }}>
                      <span className="sd-ehr-timestamp">1500:</span> Client is postoperative on day 3 following an intussusception and bowel perforation repair. Upon entering the room, the client is lying in his crib, sucking on his thumb and drooling onto his gown. Client&apos;s breath sounds are clear and equal. S1 and S2 heart sounds auscultated. The child is guarding his abdomen during the abdominal assessment. Abdomen is rigid. Shiny, taut, and erythematous skin present at the surgical incision site, and the abdominal girth has increased by 2 cm from the last measurement. Auscultation reveals normoactive bowel sounds. Client voided and stooled in his diaper; the bowel movement is brown and soft. Mom states the client drank his entire bottle of formula an hour ago but feels &ldquo;warmer than usual&rdquo; and then leaves the room to take a phone call. The client cries immediately after his mother leaves the room.
                    </p>
                  </div>
                )}

                {caseEhrTab === "vitals" && (
                  <div style={{ marginTop: "8px" }}>
                    <table className="sd-vitals-ehr-table">
                      <thead>
                        <tr>
                          <th style={{ width: "35%" }}></th>
                          <th style={{ width: "65%" }}>Day 1: 1330</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="sd-vitals-param">T</td>
                          <td>
                            <div>99.1 F</div>
                            <div style={{ color: "#334155" }}>(37.2 C) axillary</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="sd-vitals-param">P</td>
                          <td>151</td>
                        </tr>
                        <tr>
                          <td className="sd-vitals-param">RR</td>
                          <td>41</td>
                        </tr>
                        <tr>
                          <td className="sd-vitals-param">BP</td>
                          <td>101/52</td>
                        </tr>
                        <tr>
                          <td className="sd-vitals-param">Pulse oximetry reading</td>
                          <td>98% on room air</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {caseEhrTab === "labs" && (
                  <div style={{ marginTop: "8px" }}>
                    <table className="sd-labs-ehr-table">
                      <thead>
                        <tr>
                          <th style={{ width: "62%" }}>Laboratory Test and Reference Range</th>
                          <th style={{ width: "38%" }}>Day 1: 1330</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={2} className="sd-labs-section-header">
                            Hematology
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="sd-labs-test-title">White blood cell count</div>
                            <div className="sd-labs-ref-sub">Child ≤2 years: 6,200-17,000/mm³</div>
                            <div className="sd-labs-ref-sub">(6.2-17.0 x 10⁹/L)</div>
                          </td>
                          <td>
                            <div>20,000/mm³</div>
                            <div style={{ color: "#475569" }}>(20.0 x 10⁹/L)</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="sd-labs-test-title">Hematocrit</div>
                            <div className="sd-labs-ref-sub">6 months - 1 year: 29%-43%</div>
                            <div className="sd-labs-ref-sub">(0.29-0.43)</div>
                          </td>
                          <td>
                            <div>31%</div>
                            <div style={{ color: "#475569" }}>(0.31)</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="sd-labs-test-title">Hemoglobin</div>
                            <div className="sd-labs-ref-sub">6 months - 1 year: 9.5-14 g/dL</div>
                            <div className="sd-labs-ref-sub">(95 g/L-140 g/L)</div>
                          </td>
                          <td>
                            <div>10 g/dL</div>
                            <div style={{ color: "#475569" }}>(100 g/L)</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Right Pane: Question & Interactivity */}
            <main className="sd-test-question-pane" aria-label="NCLEX Exam Question">
              {/* ============================================================
                  ITEM 1 OF 6: Interactive Highlight Question
                  Matches media_1795155376198_59b5ec7b.jpg exactly!
                  ============================================================ */}
              {testQuestionIndex === 0 && (
                <div>
                  <div className="sd-test-instruction">
                    <span className="sd-test-arrow-icon">▶</span>
                    <span>
                      Click to highlight the findings below that require <strong>immediate</strong> follow-up.
                    </span>
                  </div>

                  <div style={{ margin: "14px 0 16px" }}>
                    <span className="sd-tag-day1">Day 1</span>
                    <h4 className="sd-ehr-dept-title" style={{ margin: "4px 0 12px" }}>
                      Emergency Department
                    </h4>

                    {/* Interactive Click-to-Highlight Paragraph */}
                    <div
                      style={{
                        fontSize: "13.5px",
                        lineHeight: "1.9",
                        color: "#1e293b",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "16px 18px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                      }}
                    >
                      <span className="sd-ehr-timestamp">1330:</span> Client was brought to the emergency department by his mother. The mother states the client is a 6-month-old male and that they identify as &ldquo;Hispanic or Latino.&rdquo; The child has had liquid diarrhea for the past day, and his last diaper change contained a small amount of{" "}
                      {/* Token 1: blood and mucus (Correct) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(1) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(1)
                              ? "correct"
                              : "missed"
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(1) ? prev.filter((x) => x !== 1) : [...prev, 1]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && <span className="sd-token-badge chk">✓</span>}
                        blood and mucus
                      </span>
                      . The mother reports that several times over the past hour, while the child was playing with his toys he would{" "}
                      {/* Token 2: "stop, curl up, and cry, then return to playing." (Correct) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(2) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(2)
                              ? "correct"
                              : "missed"
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(2) ? prev.filter((x) => x !== 2) : [...prev, 2]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && <span className="sd-token-badge chk">✓</span>}
                        &ldquo;stop, curl up, and cry, then return to playing.&rdquo;
                      </span>{" "}
                      Mom states the client also had{" "}
                      {/* Token 3: "green, mucousy vomit" (Correct) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(3) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(3)
                              ? "correct"
                              : "missed"
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(3) ? prev.filter((x) => x !== 3) : [...prev, 3]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && <span className="sd-token-badge chk">✓</span>}
                        &ldquo;green, mucousy vomit&rdquo;
                      </span>{" "}
                      on the way to the hospital. His mother notes that she{" "}
                      {/* Token 4: changed formula 3 weeks ago (Distractor) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(4) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(4)
                              ? "incorrect"
                              : ""
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(4) ? prev.filter((x) => x !== 4) : [...prev, 4]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && caseItem1SelectedTokens.includes(4) && (
                          <span className="sd-token-badge cross">✗</span>
                        )}
                        changed formula 3 weeks ago
                      </span>
                      . The client has refused feeds since yesterday. The mother reports the client has a history of hip dysplasia and a ventricular septal defect diagnosed at 1 month of age, but she states the septal defect has since resolved on its own. Upon physical examination, the posterior fontanelle is firm, flat, and closed, and the anterior fontanelle is soft, flat, and open. S1 and S2 heart sounds auscultated; no murmurs detected. Abdominal auscultation reveals hyperactive bowel sounds. A{" "}
                      {/* Token 5: 4 cm elongated mass palpated in right upper quadrant (RUQ) (Correct) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(5) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(5)
                              ? "correct"
                              : "missed"
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(5) ? prev.filter((x) => x !== 5) : [...prev, 5]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && <span className="sd-token-badge chk">✓</span>}
                        4 cm elongated mass palpated in right upper quadrant (RUQ)
                      </span>
                      . The child{" "}
                      {/* Token 6: screamed and guarded his abdomen throughout the abdominal examination (Correct) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(6) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(6)
                              ? "correct"
                              : "missed"
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(6) ? prev.filter((x) => x !== 6) : [...prev, 6]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && <span className="sd-token-badge chk">✓</span>}
                        screamed and guarded his abdomen throughout the abdominal examination
                      </span>
                      . The skin assessment reveals{" "}
                      {/* Token 7: dry, erythematous patches behind the knees (Distractor) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(7) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(7)
                              ? "incorrect"
                              : ""
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(7) ? prev.filter((x) => x !== 7) : [...prev, 7]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && caseItem1SelectedTokens.includes(7) && (
                          <span className="sd-token-badge cross">✗</span>
                        )}
                        dry, erythematous patches behind the knees
                      </span>{" "}
                      and an{" "}
                      {/* Token 8: irregularly shaped blue mark on the sacrum (Distractor) */}
                      <span
                        className={`sd-highlight-token ${caseItem1SelectedTokens.includes(8) ? "selected" : ""
                          } ${isCaseItem1Submitted
                            ? caseItem1SelectedTokens.includes(8)
                              ? "incorrect"
                              : ""
                            : ""
                          } ${isCaseItem1Submitted ? "locked" : ""}`}
                        onClick={() => {
                          if (isCaseItem1Submitted) return;
                          setCaseItem1SelectedTokens((prev) =>
                            prev.includes(8) ? prev.filter((x) => x !== 8) : [...prev, 8]
                          );
                        }}
                      >
                        {isCaseItem1Submitted && caseItem1SelectedTokens.includes(8) && (
                          <span className="sd-token-badge cross">✗</span>
                        )}
                        irregularly shaped blue mark on the sacrum
                      </span>
                      . All other skin is pink and appropriate for ethnicity.
                    </div>
                  </div>

                  {!isCaseItem1Submitted && (
                    <div style={{ marginTop: "18px", marginBottom: "16px" }}>
                      <button
                        type="button"
                        className="sd-test-submit-btn"
                        onClick={() => setIsCaseItem1Submitted(true)}
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}

                  {/* SUBMITTED FEEDBACK & EXPLANATION (Matches media_1795155376198_59b5ec7b.jpg) */}
                  {isCaseItem1Submitted && (
                    <div className="sd-expl-box">
                      {/* Score Metrics 4-Col Grid */}
                      <div className="sd-expl-metrics-grid">
                        <div className="sd-expl-metric-item">
                          <span className="sd-expl-metric-label">Credit</span>
                          <span className="sd-expl-metric-value highlight">
                            {caseResults.item1Score} / 5
                          </span>
                        </div>
                        <div className="sd-expl-metric-item">
                          <span className="sd-expl-metric-label">Avg Points Scored</span>
                          <span className="sd-expl-metric-value">2.73 / 5</span>
                        </div>
                        <div className="sd-expl-metric-item">
                          <span className="sd-expl-metric-label">Scoring Rule</span>
                          <span className="sd-expl-metric-value">+/- Scoring</span>
                        </div>
                        <div className="sd-expl-metric-item">
                          <span className="sd-expl-metric-label">Time Spent</span>
                          <span className="sd-expl-metric-value">
                            {formatTestTimer(testTimerSeconds)}
                          </span>
                        </div>
                      </div>

                      {/* Explanation Heading */}
                      <div>
                        <div className="sd-expl-title-row">
                          <FileText size={16} color="#007399" />
                          <span>Explanation</span>
                        </div>
                      </div>

                      {/* Detailed Clinical Rationales */}
                      <div className="sd-expl-content">
                        <p>
                          <strong>Blood and mucus</strong> in stool indicate potential gastrointestinal tract damage (the hallmark &ldquo;currant jelly&rdquo; stool of mucosal ischemia).
                        </p>
                        <p>
                          Colicky abdominal pain is a sharp, spasm-like pain that intensifies during intestinal muscle contraction (i.e., peristalsis) and is relieved by intestinal muscle relaxation. Intestinal obstruction interferes with peristalsis and causes severe colic. Parents often describe colicky pain as occurring when the infant <strong>&ldquo;stops, curls up, and cries, then returns to playing.&rdquo; Screaming and guarding the abdomen</strong> also confirm severe abdominal pain.
                        </p>
                        <p>
                          Green bile is secreted into the duodenum. Therefore, <strong>green, mucousy vomit</strong> indicates that gastric contents passed into the small intestine before retrograde emesis, indicating distal intestinal obstruction requiring emergency management.
                        </p>
                        <p>
                          A <strong>4 cm elongated mass palpated in right upper quadrant (RUQ)</strong> represents the classic sausage-shaped intussusceptum mass characteristic of ileocolic intussusception.
                        </p>

                        <div style={{ marginTop: "4px" }}>
                          <h5 style={{ margin: "0 0 6px", fontSize: "13.5px", fontWeight: 700, color: "#991b1b" }}>
                            Incorrect Findings:
                          </h5>
                          <p style={{ color: "#64748b", margin: "0 0 4px" }}>
                            <strong>Changed formula 3 weeks ago:</strong> Dietary changes can cause mild gas or transient stools; however, diet alone is unlikely to cause acute surgical emergencies like bilious vomiting or abdominal mass.
                          </p>
                          <p style={{ color: "#64748b", margin: "0 0 4px" }}>
                            <strong>Dry, erythematous patches behind knees:</strong> Classic presentation of infantile atopic dermatitis (eczema), which is non-urgent.
                          </p>
                          <p style={{ color: "#64748b", margin: "0" }}>
                            <strong>Irregularly shaped blue mark on sacrum:</strong> Congenital dermal melanocytosis (Mongolian spot), a benign, common hyperpigmentation variation in infants of darker skin ethnicities.
                          </p>
                        </div>

                        {/* Key Takeaway */}
                        <div className="sd-expl-key-takeaway">
                          <strong>Key Takeaway:</strong> Green (bilious) vomit, bloody mucus stool, a sausage-shaped abdominal mass, and episodic colicky pain indicate acute pediatric intussusception requiring emergent imaging and intervention.
                        </div>

                        {/* Interactive Ask nclex.com AI Chat (Matching media_1795429613081_bcc041a1.png) */}
                        {renderAiChatCard("Pyloric Stenosis, Intussusception, & Hirschsprung Disease")}

                        {/* Linked Resources */}
                        <div className="sd-expl-linked-row">
                          <div
                            className="sd-expl-linked-item"
                            onClick={() => setIsUpgradeModalOpen(true)}
                            title="Click to upgrade membership for full video crash courses"
                          >
                            <div className="sd-expl-linked-left">
                              <div className="sd-expl-linked-thumb">
                                <img src="/images/landing-hero-nurse.jpg" alt="Video thumbnail" />
                              </div>
                              <div>
                                <div className="sd-expl-linked-title">
                                  Linked Crash Course Video: Obstructive &amp; Inflammatory GI Conditions
                                </div>
                                <div className="sd-expl-linked-sub">Child Health · 18 min lecture</div>
                              </div>
                            </div>
                            <ExternalLink size={15} color="#64748b" />
                          </div>

                          <div
                            className="sd-expl-linked-item"
                            onClick={() => setActiveTab("cheatsheets")}
                          >
                            <div className="sd-expl-linked-left">
                              <div className="sd-expl-linked-thumb">
                                <img src="/images/landing-hero-nurse.jpg" alt="Cheat sheet thumb" />
                              </div>
                              <div>
                                <div className="sd-expl-linked-title">
                                  Linked Cheat Sheet: Pyloric Stenosis, Intussusception, &amp; Hirschsprung Disease
                                </div>
                                <div className="sd-expl-linked-sub">Child Health · High-Yield Summary</div>
                              </div>
                            </div>
                            <ExternalLink size={15} color="#64748b" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ITEM 2 OF 6: Multi-Disease Process Matrix (Matches media_1795158757361_5b374c70.jpg) */}
              {testQuestionIndex === 1 && (
                <div>
                  <div className="sd-test-instruction">
                    <span className="sd-test-arrow-icon">▶</span>
                    <span>
                      For each client finding below, click to specify if the finding is consistent with the disease process of <strong>appendicitis</strong>, <strong>intussusception</strong>, or <strong>hypertrophic pyloric stenosis</strong>. Each finding may support more than 1 disease process.
                    </span>
                  </div>

                  <table className="sd-case-matrix-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", width: "40%" }}>Assessment Findings</th>
                        <th style={{ textAlign: "center", width: "20%" }}>Appendicitis</th>
                        <th style={{ textAlign: "center", width: "20%" }}>Intussusception</th>
                        <th style={{ textAlign: "center", width: "20%" }}>Hypertrophic Pyloric Stenosis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: 1,
                          finding: "Diarrhea",
                          correct: { appendicitis: false, intussusception: true, pyloric_stenosis: false }
                        },
                        {
                          id: 2,
                          finding: "Abdominal pain",
                          correct: { appendicitis: true, intussusception: true, pyloric_stenosis: false }
                        },
                        {
                          id: 3,
                          finding: "Green, mucousy vomit",
                          correct: { appendicitis: false, intussusception: true, pyloric_stenosis: false }
                        },
                        {
                          id: 4,
                          finding: "Stool with blood and mucus",
                          correct: { appendicitis: false, intussusception: true, pyloric_stenosis: false }
                        },
                        {
                          id: 5,
                          finding: "Increased white blood cell count",
                          correct: { appendicitis: true, intussusception: true, pyloric_stenosis: false }
                        },
                        {
                          id: 6,
                          finding: "Right upper quadrant abdominal mass",
                          correct: { appendicitis: false, intussusception: true, pyloric_stenosis: true }
                        }
                      ].map((row) => (
                        <tr key={row.id}>
                          <td style={{ fontWeight: 500 }}>{row.finding}</td>
                          {(["appendicitis", "intussusception", "pyloric_stenosis"] as const).map((col) => {
                            const key = `${row.id}-${col}`;
                            const isChecked = !!caseItem2Matrix[key];
                            const isCorrect = row.correct[col];

                            return (
                              <td key={col} style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isCaseItem2Submitted) return;
                                    setCaseItem2Matrix((prev) => ({
                                      ...prev,
                                      [key]: !prev[key]
                                    }));
                                  }}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    cursor: isCaseItem2Submitted ? "default" : "pointer",
                                    accentColor: isCaseItem2Submitted
                                      ? isCorrect
                                        ? "#10b981"
                                        : "#ef4444"
                                      : "#0284c7"
                                  }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 16px" }}>
                    Note: Each column must have at least 1 response option selected.
                  </div>

                  <button
                    type="button"
                    className="sd-test-submit-btn"
                    onClick={() => setIsCaseItem2Submitted(true)}
                  >
                    <u>S</u>ubmit
                  </button>

                  {isCaseItem2Submitted && (
                    <div className="sd-test-rationale-box">
                      <div className="sd-test-score-banner">
                        <span className="sd-test-score-title">Clinical Rationale: Pediatric Gastrointestinal Differentials</span>
                      </div>
                      <p style={{ fontSize: "13.5px", lineHeight: "1.65", color: "#334155" }}>
                        <strong>Intussusception:</strong> Consistent with all 6 findings: sudden onset diarrhea (as the lower colon evacuates contents), severe episodic colicky abdominal pain (infant drawing knees to chest), bilious (&ldquo;green, mucousy&rdquo;) vomiting due to mechanical bowel obstruction distal to the ampulla of Vater, currant-jelly stool containing blood and mucus from mucosal ischemia, elevated WBC count (20,000/mm³) from tissue ischemia, and an elongated sausage-shaped mass in the right upper quadrant.
                        <br /><br />
                        <strong>Appendicitis:</strong> Characterized by progressive abdominal pain (periumbilical migrating to right lower quadrant) and leukocytosis (elevated WBC count) secondary to bacterial inflammation. Vomiting is generally non-bilious initially and does not feature currant-jelly stools or an RUQ mass.
                        <br /><br />
                        <strong>Hypertrophic Pyloric Stenosis:</strong> Characterized by a palpable olive-shaped firm mass in the right upper quadrant / right epigastrium and projectile <em>non-bilious</em> vomiting. Stools are typically decreased/constipated, not bloody or diarrheal, and WBC is normal.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ITEM 3 OF 6: Priority Complication Cloze Dropdowns (Matches media_1795159310477_9b627d60.jpg) */}
              {testQuestionIndex === 2 && (
                <div>
                  <div className="sd-test-instruction">
                    <span className="sd-test-arrow-icon">▶</span>
                    <span>
                      Complete the following sentence by choosing from the lists of options.
                    </span>
                  </div>

                  <div style={{ fontSize: "14px", lineHeight: "2.4", color: "#1e293b", margin: "22px 0 26px" }}>
                    The nurse should be most concerned about{" "}
                    <select
                      value={caseItem3Slot1 ?? ""}
                      onChange={(e) => {
                        if (!isCaseItem3Submitted) setCaseItem3Slot1(e.target.value || null);
                      }}
                      disabled={isCaseItem3Submitted}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "4px",
                        border: `1px solid ${isCaseItem3Submitted
                          ? caseItem3Slot1 === "bowel perforation"
                            ? "#10b981"
                            : "#ef4444"
                          : "#94a3b8"
                          }`,
                        background: isCaseItem3Submitted
                          ? caseItem3Slot1 === "bowel perforation"
                            ? "#ecfdf5"
                            : "#fef2f2"
                          : "#ffffff",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#0f172a",
                        cursor: isCaseItem3Submitted ? "default" : "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="">Select option...</option>
                      <option value="bowel perforation">bowel perforation</option>
                      <option value="malnutrition">malnutrition</option>
                      <option value="aspiration pneumonia">aspiration pneumonia</option>
                      <option value="metabolic alkalosis">metabolic alkalosis</option>
                    </select>{" "}
                    due to{" "}
                    <select
                      value={caseItem3Slot2 ?? ""}
                      onChange={(e) => {
                        if (!isCaseItem3Submitted) setCaseItem3Slot2(e.target.value || null);
                      }}
                      disabled={isCaseItem3Submitted}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "4px",
                        border: `1px solid ${isCaseItem3Submitted
                          ? caseItem3Slot2 === "ischemia"
                            ? "#10b981"
                            : "#ef4444"
                          : "#94a3b8"
                          }`,
                        background: isCaseItem3Submitted
                          ? caseItem3Slot2 === "ischemia"
                            ? "#ecfdf5"
                            : "#fef2f2"
                          : "#ffffff",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#0f172a",
                        cursor: isCaseItem3Submitted ? "default" : "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="">Select option...</option>
                      <option value="ischemia">ischemia</option>
                      <option value="electrolyte imbalance">electrolyte imbalance</option>
                      <option value="dehydration">dehydration</option>
                      <option value="gastric hyperacidity">gastric hyperacidity</option>
                    </select>
                    .
                  </div>

                  <button
                    type="button"
                    className="sd-test-submit-btn"
                    onClick={() => setIsCaseItem3Submitted(true)}
                  >
                    <u>S</u>ubmit
                  </button>

                  {isCaseItem3Submitted && (
                    <div className="sd-test-rationale-box">
                      <div className="sd-test-score-banner">
                        <span className="sd-test-score-title">Clinical Rationale: Priority Complication of Intussusception</span>
                        <span className={`sd-test-score-pill ${caseItem3Slot1 === "bowel perforation" && caseItem3Slot2 === "ischemia" ? "correct" : "partial"}`}>
                          Score: {caseItem3Slot1 === "bowel perforation" && caseItem3Slot2 === "ischemia" ? "1 / 1 Point" : "0 / 1 Point"}
                        </span>
                      </div>
                      <p style={{ fontSize: "13.5px", lineHeight: "1.65", color: "#334155" }}>
                        <strong>Correct Answer:</strong> The nurse should be most concerned about <strong>bowel perforation</strong> due to <strong>ischemia</strong>.
                        <br /><br />
                        As one segment of the intestine telescopes into another, the mesentery is pulled along with it and compressed. This venous compression leads to venous engorgement, edema, bleeding (causing bloody &ldquo;currant jelly&rdquo; stools), and eventually arterial obstruction. Prolonged arterial occlusion causes transmural bowel <strong>ischemia</strong>, which progresses rapidly to full-thickness bowel wall necrosis, gangrene, and life-threatening <strong>bowel perforation</strong> leading to peritonitis and septic shock.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ITEM 4 OF 6: Indicated vs Contraindicated Matrix (Matches media_1795159525756_7ee107d6.jpg) */}
              {testQuestionIndex === 3 && (
                <div>
                  <div className="sd-test-instruction">
                    <span className="sd-test-arrow-icon">▶</span>
                    <span>
                      For each potential intervention, click to specify whether the potential intervention is <strong>indicated</strong> or <strong>contraindicated</strong> for the care of the client.
                    </span>
                  </div>

                  <table className="sd-case-matrix-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Potential Interventions</th>
                        <th style={{ textAlign: "center", width: "140px" }}>Indicated</th>
                        <th style={{ textAlign: "center", width: "160px" }}>Contraindicated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, text: "1. Maintain NPO status.", ans: "indicated" },
                        { id: 2, text: "2. Administer loperamide.", ans: "contraindicated" },
                        { id: 3, text: "3. Prepare for a barium swallow.", ans: "contraindicated" },
                        { id: 4, text: "4. Prepare for abdominal ultrasound.", ans: "indicated" },
                        { id: 5, text: "5. Collect blood for a basic metabolic panel.", ans: "indicated" },
                        { id: 6, text: "6. Prepare for reduction of telescoped bowel.", ans: "indicated" }
                      ].map((row) => (
                        <tr key={row.id}>
                          <td style={{ fontWeight: 500 }}>{row.text}</td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="radio"
                              name={`m4-${row.id}`}
                              checked={caseItem4Selections[row.id] === "indicated"}
                              onChange={() => {
                                if (isCaseItem4Submitted) return;
                                setCaseItem4Selections((prev) => ({ ...prev, [row.id]: "indicated" }));
                              }}
                              style={{
                                width: "18px",
                                height: "18px",
                                cursor: isCaseItem4Submitted ? "default" : "pointer",
                                accentColor: isCaseItem4Submitted
                                  ? row.ans === "indicated"
                                    ? "#10b981"
                                    : "#ef4444"
                                  : "#0284c7"
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="radio"
                              name={`m4-${row.id}`}
                              checked={caseItem4Selections[row.id] === "contraindicated"}
                              onChange={() => {
                                if (isCaseItem4Submitted) return;
                                setCaseItem4Selections((prev) => ({ ...prev, [row.id]: "contraindicated" }));
                              }}
                              style={{
                                width: "18px",
                                height: "18px",
                                cursor: isCaseItem4Submitted ? "default" : "pointer",
                                accentColor: isCaseItem4Submitted
                                  ? row.ans === "contraindicated"
                                    ? "#10b981"
                                    : "#ef4444"
                                  : "#0284c7"
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 16px" }}>
                    Note: Each row must have 1 response option selected.
                  </div>

                  <button
                    type="button"
                    className="sd-test-submit-btn"
                    onClick={() => setIsCaseItem4Submitted(true)}
                  >
                    <u>S</u>ubmit
                  </button>

                  {isCaseItem4Submitted && (
                    <div className="sd-test-rationale-box">
                      <div className="sd-test-score-banner">
                        <span className="sd-test-score-title">Clinical Rationale: Indicated vs. Contraindicated Interventions</span>
                      </div>
                      <p style={{ fontSize: "13.5px", lineHeight: "1.65", color: "#334155" }}>
                        <strong>Indicated Interventions:</strong>
                        <br />
                        • <em>Maintain NPO status:</em> The client has an active mechanical bowel obstruction and will require procedural sedation for pneumatic reduction or urgent surgical intervention.
                        <br />
                        • <em>Prepare for abdominal ultrasound:</em> Abdominal ultrasound is the primary, noninvasive, highly sensitive diagnostic tool that displays the classic &ldquo;target&rdquo; or &ldquo;doughnut&rdquo; sign.
                        <br />
                        • <em>Collect blood for BMP:</em> Important to evaluate hydration, serum electrolytes (potassium, sodium), and renal function due to persistent emesis and fluid shifting.
                        <br />
                        • <em>Prepare for reduction of telescoped bowel:</em> Pneumatic (air) or hydrostatic contrast enema reduction is the first-line definitive non-surgical treatment for stable intussusception.
                        <br /><br />
                        <strong>Contraindicated Interventions:</strong>
                        <br />
                        • <em>Administer loperamide:</em> Antidiarrheal agents slow gastrointestinal motility and are strictly contraindicated in mechanical intestinal obstruction, ischemia, or risk of toxic megacolon/perforation.
                        <br />
                        • <em>Prepare for a barium swallow:</em> Barium swallow is an upper GI procedure that introduces barium into an obstructed lumen, risking aspiration and worsening distension; an enema (lower GI) is used instead.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ITEM 5 OF 6: Taking Action (Priority Single Choice) */}
              {testQuestionIndex === 4 && (
                <div>
                  <div style={{ fontSize: "13.5px", color: "#475569", marginBottom: "10px" }}>
                    The nurse has reviewed the Laboratory Results and Physician Orders.
                  </div>

                  <div className="sd-test-instruction">
                    <span className="sd-test-arrow-icon">▶</span>
                    <span>
                      The nurse is preparing to care for the infant prior to the air enema reduction procedure. Which of the following provider orders should the nurse implement <strong>first</strong>?
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "18px 0 24px", maxWidth: "760px" }}>
                    {[
                      { id: 1, text: "Initiate intravenous (IV) access and administer an isotonic fluid bolus (20 mL/kg normal saline).", correct: true },
                      { id: 2, text: "Obtain written parental consent for surgery.", correct: false },
                      { id: 3, text: "Administer prescribed IV ampicillin and gentamicin.", correct: false },
                      { id: 4, text: "Collect a clean-catch urine specimen.", correct: false }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "13px 18px",
                          borderRadius: "6px",
                          border: `1.5px solid ${isCaseItem5Submitted
                            ? opt.correct
                              ? "#10b981"
                              : caseItem5Selected === opt.id
                                ? "#ef4444"
                                : "#cbd5e1"
                            : caseItem5Selected === opt.id
                              ? "#0284c7"
                              : "#cbd5e1"
                            }`,
                          background:
                            isCaseItem5Submitted
                              ? opt.correct
                                ? "#ecfdf5"
                                : caseItem5Selected === opt.id
                                  ? "#fef2f2"
                                  : "#ffffff"
                              : caseItem5Selected === opt.id
                                ? "#f0f9ff"
                                : "#ffffff",
                          cursor: "pointer",
                          fontSize: "13.5px",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <input
                          type="radio"
                          name="q5-choice"
                          checked={caseItem5Selected === opt.id}
                          onChange={() => {
                            if (!isCaseItem5Submitted) setCaseItem5Selected(opt.id);
                          }}
                          style={{
                            width: "16px",
                            height: "16px",
                            accentColor: "#0284c7",
                            cursor: "pointer"
                          }}
                        />
                        <span style={{ color: "#1e293b" }}>{opt.id}. {opt.text}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="sd-test-submit-btn"
                    onClick={() => setIsCaseItem5Submitted(true)}
                  >
                    <u>S</u>ubmit
                  </button>

                  {isCaseItem5Submitted && (
                    <div className="sd-test-rationale-box">
                      <div className="sd-test-score-banner">
                        <span className="sd-test-score-title">Clinical Rationale: Priority Resuscitation Before Reduction</span>
                        <span className={`sd-test-score-pill ${caseItem5Selected === 1 ? "correct" : "partial"}`}>
                          Score: {caseItem5Selected === 1 ? "1 / 1 Point" : "0 / 1 Point"}
                        </span>
                      </div>
                      <p style={{ fontSize: "13.5px", lineHeight: "1.65", color: "#334155" }}>
                        <strong>Correct Answer: Initiate IV access and administer isotonic fluid bolus (20 mL/kg normal saline).</strong> The infant shows signs of intravascular depletion (tachycardia HR 154 bpm, tachypnea RR 36, delayed capillary refill). Air enema reduction carries a risk of bowel perforation and hemodynamic instability; therefore, establishing vascular access and restoring circulatory volume (airway/breathing/circulation priority) must be completed before any procedural interventions.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ITEM 6 OF 6: Drag & Drop Follow-Up Findings (Matches media_1795160538727_d45d766a.jpg) */}
              {testQuestionIndex === 5 && (
                <div>
                  <div style={{ fontSize: "13.5px", color: "#475569", marginBottom: "8px", lineHeight: "1.5" }}>
                    The client underwent immediate surgery for intussusception and bowel perforation repair. The nurse reviews the Nurses&apos; Notes from Day 4 at 1500.
                  </div>

                  <div className="sd-test-instruction">
                    <span className="sd-test-arrow-icon">▶</span>
                    <span>
                      Drag the findings that require follow-up to the box on the right.
                    </span>
                  </div>

                  {(() => {
                    const allFindings = [
                      "Bowel movement is brown and soft.",
                      'Mother states the client feels "warmer than usual."',
                      "Shiny and taut erythematous skin at the surgical incision.",
                      "Abdominal girth has increased 2 cm since the last measurement.",
                      "Client is sucking his thumb and drooling onto his gown.",
                      "Client cries when his mother leaves the room."
                    ];

                    const correctFollowUps = [
                      'Mother states the client feels "warmer than usual."',
                      "Shiny and taut erythematous skin at the surgical incision.",
                      "Abdominal girth has increased 2 cm since the last measurement."
                    ];

                    const availableFindings = allFindings.filter((f) => !caseItem6FollowUp.includes(f));

                    return (
                      <div>
                        <div className="sd-drag-box-container">
                          {/* Left Column: Findings */}
                          <div className="sd-drag-box-col">
                            <div className="sd-drag-box-header">Findings</div>
                            <div className="sd-drag-box-body">
                              {availableFindings.map((finding) => (
                                <div
                                  key={finding}
                                  className="sd-drag-item"
                                  onClick={() => {
                                    if (isCaseItem6Submitted) return;
                                    setCaseItem6FollowUp((prev) => [...prev, finding]);
                                  }}
                                  title="Click to move to 'Findings That Require Follow-up'"
                                >
                                  {finding}
                                </div>
                              ))}
                              {availableFindings.length === 0 && (
                                <div className="sd-drag-placeholder">All findings placed in the right box.</div>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Findings That Require Follow-up */}
                          <div className="sd-drag-box-col">
                            <div className="sd-drag-box-header">Findings That Require Follow-up</div>
                            <div className="sd-drag-box-body">
                              {caseItem6FollowUp.map((finding) => {
                                const isCorrect = correctFollowUps.includes(finding);
                                return (
                                  <div
                                    key={finding}
                                    className={`sd-drag-item ${isCaseItem6Submitted ? (isCorrect ? "correct" : "incorrect") : ""
                                      }`}
                                    onClick={() => {
                                      if (isCaseItem6Submitted) return;
                                      setCaseItem6FollowUp((prev) => prev.filter((f) => f !== finding));
                                    }}
                                    title="Click to move back to 'Findings'"
                                  >
                                    {isCaseItem6Submitted && (
                                      <span style={{ fontWeight: 700, marginRight: "6px" }}>
                                        {isCorrect ? "✓" : "✗"}
                                      </span>
                                    )}
                                    {finding}
                                  </div>
                                );
                              })}
                              {caseItem6FollowUp.length === 0 && (
                                <div className="sd-drag-placeholder">
                                  Drag or click findings from the left to place them here.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px" }}>
                          <button
                            type="button"
                            className="sd-test-submit-btn"
                            onClick={() => setIsCaseItem6Submitted(true)}
                          >
                            <u>S</u>ubmit
                          </button>

                          <button
                            type="button"
                            className="sd-results-btn-primary"
                            onClick={() => setIsResultsScreenActive(true)}
                          >
                            View Exam Results ▶
                          </button>
                        </div>

                        {isCaseItem6Submitted && (
                          <div className="sd-expl-box">
                            {/* Score Metrics 4-Col Grid */}
                            <div className="sd-expl-metrics-grid">
                              <div className="sd-expl-metric-item">
                                <span className="sd-expl-metric-label">Credit</span>
                                <span className="sd-expl-metric-value highlight">
                                  {caseResults.item6Score} / 3
                                </span>
                              </div>
                              <div className="sd-expl-metric-item">
                                <span className="sd-expl-metric-label">Avg Points Scored</span>
                                <span className="sd-expl-metric-value">1.85 / 3</span>
                              </div>
                              <div className="sd-expl-metric-item">
                                <span className="sd-expl-metric-label">Scoring Rule</span>
                                <span className="sd-expl-metric-value">+/- Scoring</span>
                              </div>
                              <div className="sd-expl-metric-item">
                                <span className="sd-expl-metric-label">Time Spent</span>
                                <span className="sd-expl-metric-value">
                                  {formatTestTimer(testTimerSeconds)}
                                </span>
                              </div>
                            </div>

                            {/* Explanation Heading (No Video) */}
                            <div>
                              <div className="sd-expl-title-row">
                                <FileText size={16} color="#007399" />
                                <span>Explanation</span>
                              </div>
                            </div>

                            {/* Detailed Clinical Rationales (Matches media_1795161123378_ecb33dce.jpg) */}
                            <div className="sd-expl-content">
                              <p>
                                Postoperative client following bowel perforation repair. The nurse should assess for signs of infection, typically 3 to 5 days after surgery. Infections such as surgical site infection or peritonitis (which can occur after intestinal perforation/repair, due to bacterial peritonitis) and wound dehiscence. Observation reveals redness and swelling of the infected tissue (e.g., peritonitis or surgical wound), increasing abdominal girth (e.g., 2 cm from last measurement) caused by internal fluid accumulation, and warm skin (e.g., warmer than usual). Client is also rigid and erythematous skin.
                              </p>
                              <p>
                                The mother&apos;s statement that the client feels &ldquo;warmer than usual&rdquo; should prompt the nurse to assess for fever, which can indicate infection.
                              </p>

                              <div style={{ marginTop: "8px" }}>
                                <h5 style={{ margin: "0 0 6px", fontSize: "13.5px", fontWeight: 700, color: "#991b1b" }}>
                                  Incorrect:
                                </h5>
                                <p style={{ color: "#64748b", margin: "0 0 6px" }}>
                                  <strong>Bowel movement is brown and soft:</strong> Soft, brown stool indicates normal return of bowel motility following bowel resection and anastomosis, a normal finding post-op.
                                </p>
                                <p style={{ color: "#64748b", margin: "0 0 6px" }}>
                                  <strong>Client cries when mother leaves room:</strong> This demonstrates separation anxiety, a common developmental behavior in infants around 6 months of age.
                                </p>
                                <p style={{ color: "#64748b", margin: "0" }}>
                                  <strong>Client sucking thumb and drooling onto gown:</strong> The client sucking on his thumb and drooling onto his gown without signs of respiratory distress (e.g., tachypnea, stridor) indicates self-soothing and emergence of dentition/teething, which is common at 6 months. Although it is important to address teething pain, the potential infection takes priority.
                                </p>
                              </div>

                              {/* Key Takeaway */}
                              <div className="sd-expl-key-takeaway">
                                <strong>Key Takeaway:</strong> After bowel perforation repair, monitor for signs of peritonitis (e.g., increased abdominal girth, abdominal rigidity) and wound infection (e.g., warmth, erythema).
                              </div>

                              {/* Interactive Ask nclex.com AI Chat (Matching media_1795429613081_bcc041a1.png) */}
                              {renderAiChatCard("Postoperative Bowel Perforation & Infection Management")}

                              {/* Linked Resources */}
                              <div className="sd-expl-linked-row">
                                <div
                                  className="sd-expl-linked-item"
                                  onClick={() => setIsUpgradeModalOpen(true)}
                                  title="Click to upgrade membership for full video crash courses"
                                >
                                  <div className="sd-expl-linked-left">
                                    <div className="sd-expl-linked-thumb">
                                      <img src="/images/landing-hero-nurse.jpg" alt="Video thumbnail" />
                                    </div>
                                    <div>
                                      <div className="sd-expl-linked-title">
                                        Linked Crash Course Video: Obstructive &amp; Inflammatory GI Conditions of Childhood
                                      </div>
                                      <div className="sd-expl-linked-sub">Child Health · 10:24 High-Yield Lecture</div>
                                    </div>
                                  </div>
                                  <ExternalLink size={15} color="#64748b" />
                                </div>

                                <div
                                  className="sd-expl-linked-item"
                                  onClick={() => setActiveTab("cheatsheets")}
                                >
                                  <div className="sd-expl-linked-left">
                                    <div className="sd-expl-linked-thumb">
                                      <img src="/images/landing-hero-nurse.jpg" alt="Cheat sheet thumb" />
                                    </div>
                                    <div>
                                      <div className="sd-expl-linked-title">
                                        Linked Cheat Sheet: Pyloric Stenosis, Intussusception, &amp; Hirschsprung Disease
                                      </div>
                                      <div className="sd-expl-linked-sub">Child Health · High-Yield Summary</div>
                                    </div>
                                  </div>
                                  <ExternalLink size={15} color="#64748b" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </main>
          </div>
        )}

        {/* Bottom Navigation Bar (Matches official NCLEX blue toolbar) */}
        <footer className="sd-test-footer">
          <div className="sd-test-footer-left">
            <button
              type="button"
              className="sd-test-footer-action-link"
              onClick={() => {
                if (confirm("End this test session and view your overall score report?")) {
                  setIsResultsScreenActive(true);
                }
              }}
              title="End exam session"
            >
              <span>➔] End</span>
            </button>

            <button
              type="button"
              className="sd-test-footer-action-link"
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              title={isTimerPaused ? "Resume test timer" : "Pause test timer"}
            >
              <span>{isTimerPaused ? "▶ Resume" : "⏸ Pause"}</span>
            </button>
          </div>

          {/* Question Tagging & Bookmarking Toolbar */}
          <div className="sd-test-footer-center" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              className={`sd-test-tag-pill ${markedQuestions[testQuestionIndex] ? "active bookmark" : ""}`}
              onClick={() => void toggleBookmark()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: markedQuestions[testQuestionIndex] ? "#f59e0b" : "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              title="Bookmark this question"
            >
              <span>⭐</span>
              <span>{markedQuestions[testQuestionIndex] ? "Bookmarked" : "Bookmark"}</span>
            </button>

            <button
              type="button"
              className={`sd-test-tag-pill ${questionTags[testQuestionIndex] === "learning" ? "active learning" : ""}`}
              onClick={() => void toggleQuestionTag("learning")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: questionTags[testQuestionIndex] === "learning" ? "#3b82f6" : "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              title="Tag as Learning"
            >
              <span>📘</span>
              <span>Learning</span>
            </button>

            <button
              type="button"
              className={`sd-test-tag-pill ${questionTags[testQuestionIndex] === "reviewing" ? "active reviewing" : ""}`}
              onClick={() => void toggleQuestionTag("reviewing")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: questionTags[testQuestionIndex] === "reviewing" ? "#8b5cf6" : "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              title="Tag as Reviewing"
            >
              <span>🔄</span>
              <span>Reviewing</span>
            </button>

            <button
              type="button"
              className={`sd-test-tag-pill ${questionTags[testQuestionIndex] === "mastered" ? "active mastered" : ""}`}
              onClick={() => void toggleQuestionTag("mastered")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: questionTags[testQuestionIndex] === "mastered" ? "#10b981" : "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              title="Tag as Mastered"
            >
              <span>✅</span>
              <span>Mastered</span>
            </button>
          </div>

          <div className="sd-test-footer-right" style={{ position: "relative" }}>
            <button
              type="button"
              className="sd-test-nav-btn"
              onClick={() => {
                if (isResultsScreenActive) {
                  setIsResultsScreenActive(false);
                } else if (testQuestionIndex > 0) {
                  setIsResultsScreenActive(false);
                  setTestQuestionIndex((prev) => prev - 1);
                } else {
                  // At Question 1, Previous returns directly to the dashboard
                  setIsTestActive(false);
                  setIsResultsScreenActive(false);
                }
              }}
              title={testQuestionIndex === 0 ? "Back to Dashboard" : "Go to previous question"}
            >
              <span>← Previous</span>
            </button>

            <button
              type="button"
              className="sd-test-nav-btn"
              onClick={() => setIsNavigateOpen(!isNavigateOpen)}
              title="Jump to any question"
            >
              <span>🧭 Navigate</span>
            </button>

            {/* Navigate Popover */}
            {isNavigateOpen && (
              <div className="sd-case-nav-popover">
                <div className="sd-case-nav-popover-title">
                  {activeTestExamType === "standalone" || activeTestExamType === "cat"
                    ? `Questions (1 - ${standaloneQuestionsToUse.length})`
                    : "Questions (1 - 6)"}
                </div>
                <div className="sd-case-nav-grid">
                  {activeTestExamType === "standalone" || activeTestExamType === "cat"
                    ? standaloneQuestionsToUse.map((_, idx) => {
                      const isAnswered = standaloneAnswers[idx]?.isSubmitted;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`sd-case-nav-item-btn ${testQuestionIndex === idx && !isResultsScreenActive ? "active" : ""} ${isAnswered ? "answered" : ""
                            }`}
                          onClick={() => {
                            setTestQuestionIndex(idx);
                            setIsResultsScreenActive(false);
                            setIsNavigateOpen(false);
                          }}
                        >
                          Q{idx + 1}
                        </button>
                      );
                    })
                    : [0, 1, 2, 3, 4, 5].map((idx) => {
                      const isAnswered =
                        (idx === 0 && isCaseItem1Submitted) ||
                        (idx === 1 && isCaseItem2Submitted) ||
                        (idx === 2 && isCaseItem3Submitted) ||
                        (idx === 3 && isCaseItem4Submitted) ||
                        (idx === 4 && isCaseItem5Submitted) ||
                        (idx === 5 && isCaseItem6Submitted);

                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`sd-case-nav-item-btn ${testQuestionIndex === idx && !isResultsScreenActive ? "active" : ""} ${isAnswered ? "answered" : ""
                            }`}
                          onClick={() => {
                            setTestQuestionIndex(idx);
                            setIsResultsScreenActive(false);
                            setIsNavigateOpen(false);
                          }}
                        >
                          Item {idx + 1}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Submit or Next Button in Bottom Bar */}
            {(activeTestExamType === "standalone" || activeTestExamType === "cat") ? (
              !currentStandaloneAnswer.isSubmitted ? (
                <button
                  type="button"
                  className="sd-test-nav-btn"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.22)", fontWeight: 700 }}
                  onClick={() => void submitStandaloneAnswer()}
                  title="Submit your answer for this question"
                >
                  <span>Submit ➔</span>
                </button>
              ) : (activeTestExamType === "cat" && catExamSummary) || (activeTestExamType === "standalone" && testQuestionIndex === standaloneQuestionsToUse.length - 1) ? (
                <button
                  type="button"
                  className="sd-test-nav-btn"
                  onClick={() => {
                    if (activeTestExamType === "standalone") {
                      const totalQ = standaloneQuestionsToUse.length;
                      const correctQ = standaloneQuestionsToUse.reduce((acc, q, idx) => {
                        const ans = standaloneAnswers[idx];
                        return acc + (ans?.isSubmitted && ans.selectedOption === q.correctIndex ? 1 : 0);
                      }, 0);
                      const pct = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
                      saveCustomTestAttempt({
                        id: `test-custom-${Date.now()}`,
                        name: `Custom Practice Test (${totalQ} Questions)`,
                        type: "custom",
                        pool: "Practice Qbank",
                        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                        scorePercent: pct,
                        avgScorePercent: 68,
                        totalQuestions: totalQ,
                        answeredCount: totalQ,
                        passStatus: pct >= 65 ? "PASS" : "FAIL"
                      });
                    }
                    setIsResultsScreenActive(true);
                  }}
                  title="Finish exam and view comprehensive results"
                >
                  <span>View Results ▶</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="sd-test-nav-btn"
                  onClick={() => {
                    setIsResultsScreenActive(false);
                    setTestQuestionIndex((prev) => Math.min(standaloneQuestionsToUse.length - 1, prev + 1));
                  }}
                  title="Go to next question"
                >
                  <span>Next →</span>
                </button>
              )
            ) : !((testQuestionIndex === 0 && isCaseItem1Submitted) ||
              (testQuestionIndex === 1 && isCaseItem2Submitted) ||
              (testQuestionIndex === 2 && isCaseItem3Submitted) ||
              (testQuestionIndex === 3 && isCaseItem4Submitted) ||
              (testQuestionIndex === 4 && isCaseItem5Submitted) ||
              (testQuestionIndex === 5 && isCaseItem6Submitted)) ? (
              <button
                type="button"
                className="sd-test-nav-btn"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.22)", fontWeight: 700 }}
                onClick={() => {
                  if (testQuestionIndex === 0) setIsCaseItem1Submitted(true);
                  else if (testQuestionIndex === 1) setIsCaseItem2Submitted(true);
                  else if (testQuestionIndex === 2) setIsCaseItem3Submitted(true);
                  else if (testQuestionIndex === 3) setIsCaseItem4Submitted(true);
                  else if (testQuestionIndex === 4) setIsCaseItem5Submitted(true);
                  else if (testQuestionIndex === 5) setIsCaseItem6Submitted(true);
                }}
                title="Submit your answer for this question"
              >
                <span>Submit ➔</span>
              </button>
            ) : testQuestionIndex === 5 ? (
              <button
                type="button"
                className="sd-test-nav-btn"
                onClick={() => setIsResultsScreenActive(true)}
                title="Finish exam and view comprehensive results"
              >
                <span>View Results ▶</span>
              </button>
            ) : (
              <button
                type="button"
                className="sd-test-nav-btn"
                onClick={() => {
                  setIsResultsScreenActive(false);
                  setTestQuestionIndex((prev) => Math.min(5, prev + 1));
                }}
                title="Go to next question"
              >
                <span>Next →</span>
              </button>
            )}
          </div>
        </footer>

        {renderUpgradeModal()}
        {renderPaywallModal()}
      </div>
    );
  }

  return (
    <div className="sd-layout">
      {/* Sidebar Navigation */}
      <aside className={`sd-sidebar ${mobileSidebarOpen ? "sd-sidebar-mobile-open" : ""}`}>
        {/* Brand Header */}
        <div className="sd-sidebar-header">
          <Link href="/" className="sd-brand" aria-label="NCLEXLab home">
            <span className="sd-brand-icon">
              <GraduationCap size={20} />
            </span>
            <span className="sd-brand-text">
              NCLEX<span>Lab</span>
            </span>
          </Link>
          <button
            type="button"
            className="sd-sidebar-close"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Create Test Primary Button */}
        <div className="sd-sidebar-action-wrap">
          <button
            type="button"
            className="sd-sidebar-create-test-btn"
            onClick={() => setIsCreateTestOpen(true)}
          >
            <span className="sd-create-test-plus-box">
              <Plus size={14} strokeWidth={3} />
            </span>
            <span>Create Test</span>
          </button>
        </div>

        {/* Primary Navigation List */}
        <nav className="sd-nav" aria-label="Student primary navigation">
          {/* Home */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("home");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "home" ? "sd-nav-item-active" : ""}`}
          >
            <Home size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Home</span>
          </button>

          {/* Section: STUDY */}
          <div className="sd-nav-group-label">STUDY</div>

          {/* Subjects Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsSidebarSubjectsOpen((prev) => !prev)}
            className={`sd-nav-item ${activeTab === "subject" ? "sd-nav-item-active" : ""}`}
          >
            <GraduationCap size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Subjects</span>
            <ChevronDown
              size={14}
              className={`sd-nav-chevron ${isSidebarSubjectsOpen ? "sd-nav-chevron-rotated" : ""}`}
            />
          </button>

          {/* Indented Dropdown Subjects List */}
          {isSidebarSubjectsOpen && (
            <div className="sd-nav-sub-list">
              {[
                { id: "adult-health", name: "Adult Health" },
                { id: "child-health", name: "Child Health" },
                { id: "fundamentals", name: "Fundamentals" },
                { id: "maternal-newborn", name: "Maternal & Newborn Health" },
                { id: "mental-health", name: "Mental Health" },
                { id: "pharmacology", name: "Pharmacology" },
                { id: "management-of-care", name: "Management of Care" }
              ].map((sub) => {
                const isCurrent = activeTab === "subject" && selectedSubjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                      setSubjectSubTab("case-studies");
                      setActiveTab("subject");
                      setMobileSidebarOpen(false);
                    }}
                    className={`sd-nav-sub-item ${isCurrent ? "sd-nav-sub-item-active" : ""}`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Case Studies */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("case-studies");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "case-studies" ? "sd-nav-item-active" : ""}`}
          >
            <FolderHeart size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Case Studies</span>
          </button>

          {/* Standalone Questions */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("standalone");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "standalone" ? "sd-nav-item-active" : ""}`}
          >
            <Stethoscope size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Standalone Questions</span>
          </button>

          {/* CAT Readiness Exams */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("cat-exams");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "cat-exams" ? "sd-nav-item-active" : ""}`}
          >
            <Target size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">CAT Readiness Exams</span>
          </button>

          {/* Crash Course Videos */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("crash-course");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "crash-course" ? "sd-nav-item-active" : ""}`}
          >
            <Play size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Crash Course Videos</span>
          </button>

          {/* Cheat Sheets */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("cheat-sheets");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "cheat-sheets" ? "sd-nav-item-active" : ""}`}
          >
            <FileText size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Cheat Sheets</span>
          </button>

          {/* Next Gen Strategy Course */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("strategy-course");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "strategy-course" ? "sd-nav-item-active" : ""}`}
          >
            <Sparkles size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Strategy Course</span>
          </button>

          {/* Section: REVIEW */}
          <div className="sd-nav-group-label">REVIEW</div>

          {/* Previous Tests */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("previous-tests");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "previous-tests" ? "sd-nav-item-active" : ""}`}
          >
            <FileClock size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">Previous Tests</span>
          </button>

          {/* FAQs */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("faqs");
              setMobileSidebarOpen(false);
            }}
            className={`sd-nav-item ${activeTab === "faqs" ? "sd-nav-item-active" : ""}`}
          >
            <HelpCircle size={17} className="sd-nav-icon" />
            <span className="sd-nav-label">FAQs</span>
          </button>
        </nav>

        <div className="sd-sidebar-footer" style={{ position: "relative" }}>
          <div
            className="sd-user-badge"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            <div className="sd-user-avatar">
              {((currentUser?.username || currentUser?.email || "R")[0] ?? "R").toUpperCase()}
            </div>
            <div className="sd-user-info">
              <strong>{currentUser?.username || "Rose Student"}</strong>
              <small>{currentUser?.email || "NCLEX-RN® Prep"}</small>
            </div>
            <button
              type="button"
              className="sd-settings-btn"
              aria-label="Settings"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
            >
              <Settings2 size={16} />
            </button>
          </div>

          {isUserMenuOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "78px",
                left: "12px",
                right: "12px",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                border: "1px solid #e2e8f0",
                padding: "10px",
                zIndex: 999
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", marginBottom: "6px" }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                  {currentUser?.username || "Guest Student"}
                </p>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b", wordBreak: "break-all" }}>
                  {currentUser?.email || "Not logged in"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setActiveTab("account");
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px"
                }}
              >
                <Settings size={14} />
                <span>Account &amp; Profile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  window.location.href = "/auth?mode=login";
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Log Out
              </button>
            </div>
          )}

          <Link href="/" className="sd-back-home">
            <ArrowLeft size={14} /> Back to website
          </Link>
        </div>
      </aside>

      {/* Main Purple Content Area */}
      <main className="sd-main">
        {/* Top App Bar */}
        <header className="sd-topbar">
          <div className="sd-topbar-left">
            <button
              type="button"
              className="sd-mobile-hamburger"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <button
              type="button"
              className="sd-circle-btn"
              onClick={() => window.history.back()}
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          <div className="sd-search-capsule">
            <Search size={15} className="sd-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sd-search-input"
            />
            <span className="sd-shortcut-pill">ctrl + F</span>
          </div>

          <div className="sd-topbar-right">
            <div className="sd-pill-badge sd-streak-pill" title="Current study streak">
              <Flame size={15} className="sd-flame-icon" />
              <span>1</span>
            </div>
            {membership.isPaid ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#fff",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
                  cursor: "default"
                }}
                title="Active Paid Membership - All Questions Unlocked"
              >
                <Sparkles size={13} fill="#fff" />
                <span>⭐ Pro Member</span>
              </div>
            ) : (
              <button
                type="button"
                className="sd-pill-badge sd-upgrade-pill"
                onClick={() => setIsPaywallOpen(true)}
              >
                <Shield size={14} />
                <span>Upgrade</span>
              </button>
            )}
            <div
              className="sd-profile-circle"
              title="User profile & account"
              onClick={() => setActiveTab("account")}
              style={{ cursor: "pointer" }}
            >
              {((currentUser?.username || currentUser?.email || "R")[0] ?? "R").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        {activeTab === "account" ? (
          <StudentAccountView
            onBackToHome={() => setActiveTab("home")}
            onLogout={() => {
              logoutUser();
              window.location.href = "/auth?mode=login";
            }}
          />
        ) : activeTab === "performance" ? (
          /* ================================================================
             PERFORMANCE VIEW (Matches exact reference design)
             ================================================================ */
          <div className="sd-content sd-perf-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Performance</span>
                </nav>
                <h1 className="sd-perf-title">Performance</h1>
                <p className="sd-perf-subtitle">
                  Performance tracks every question attempt for case studies, standalone questions, and readiness exams.
                </p>
              </div>

              <div className="sd-perf-header-right">
                <button
                  type="button"
                  className="sd-btn-reset-perf"
                  onClick={() => setIsResetModalOpen(true)}
                  aria-label="Reset performance statistics"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 2. Pass Targets Section */}
            <section className="sd-section" aria-labelledby="pass-targets-heading">
              <h2 id="pass-targets-heading" className="sd-section-title">
                Pass Targets
              </h2>

              {(() => {
                let totalAnswered = 0;
                let totalCorrect = 0;
                for (const t of savedPreviousTests) {
                  totalAnswered += t.answeredCount;
                  totalCorrect += Math.round((t.scorePercent / 100) * t.answeredCount);
                }
                for (const c of savedCatSummaries) {
                  totalAnswered += c.totalQuestions;
                  totalCorrect += Math.round((c.accuracyPercent / 100) * c.totalQuestions);
                }
                const scorePercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
                const totalQBank = 1580;
                const usagePercent = Math.min(100, Math.round((totalAnswered / totalQBank) * 100));
                const cat1 = savedCatSummaries.find((s) => s.examNumber === 1);
                const cat2 = savedCatSummaries.find((s) => s.examNumber === 2);
                const cat3 = savedCatSummaries.find((s) => s.examNumber === 3);
                const cat4 = savedCatSummaries.find((s) => s.examNumber === 4);
                const hasPassedCat = savedCatSummaries.some((s) => s.passStatus === "PASS");
                const targetsMet = (scorePercent >= 62 ? 1 : 0) + (usagePercent >= 85 ? 1 : 0) + (hasPassedCat ? 1 : 0);
                const scoreDashoffset = 220 - (220 * scorePercent / 100);
                const usageDashoffset = 220 - (220 * usagePercent / 100);

                return (
                  <>
                    {/* Student Advice / Success Banner */}
                    <div className="sd-perf-advice-banner">
                      <div className="sd-advice-avatar">
                        <img
                          src="/images/landing-hero-nurse.jpg"
                          alt="NCLEX Expert"
                          className="sd-advice-avatar-img"
                        />
                      </div>
                      <div className="sd-advice-text">
                        <span>
                          <strong>99% of NCLEXLab students who meet all targets pass the NCLEX.</strong> You&apos;ve met {targetsMet} of 3 targets... {targetsMet === 3 ? "You are fully exam ready!" : targetsMet === 2 ? "Almost there!" : "Keep practicing!"}
                        </span>
                      </div>
                    </div>

                    {/* 3 Metric Cards Grid */}
                    <div className="sd-perf-cards-grid">
                      {/* Card 1: Your Score */}
                      <div className="sd-perf-metric-card">
                        <h3 className="sd-perf-card-title">Your Score</h3>
                        <div className="sd-perf-gauge-area">
                          <svg className="sd-perf-gauge-svg" viewBox="0 0 180 100">
                            <path
                              d="M 20 90 A 70 70 0 0 1 160 90"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="12"
                              strokeLinecap="round"
                            />
                            <path
                              d="M 20 90 A 70 70 0 0 1 160 90"
                              fill="none"
                              stroke="#584de4"
                              strokeWidth="12"
                              strokeLinecap="round"
                              strokeDasharray="220"
                              strokeDashoffset={scoreDashoffset}
                            />
                          </svg>
                          <div className="sd-perf-gauge-content">
                            <strong className="sd-perf-gauge-percent">{scorePercent}%</strong>
                            <span className="sd-perf-gauge-label">Correct</span>
                          </div>
                        </div>

                        <div className="sd-perf-target-badge">
                          <Target size={14} className="sd-perf-target-icon" />
                          <span>Target: 62%</span>
                        </div>

                        <div className="sd-perf-card-footer">
                          <span>Correct / Total Pts</span>
                          <strong>{totalCorrect} / {totalAnswered}</strong>
                        </div>
                      </div>

                      {/* Card 2: Qbank Usage */}
                      <div className="sd-perf-metric-card">
                        <h3 className="sd-perf-card-title">Qbank Usage</h3>
                        <div className="sd-perf-gauge-area">
                          <svg className="sd-perf-gauge-svg" viewBox="0 0 180 100">
                            <path
                              d="M 20 90 A 70 70 0 0 1 160 90"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="12"
                              strokeLinecap="round"
                            />
                            <path
                              d="M 20 90 A 70 70 0 0 1 160 90"
                              fill="none"
                              stroke="#584de4"
                              strokeWidth="12"
                              strokeLinecap="round"
                              strokeDasharray="220"
                              strokeDashoffset={usageDashoffset}
                            />
                          </svg>
                          <div className="sd-perf-gauge-content">
                            <strong className="sd-perf-gauge-percent">{usagePercent}%</strong>
                            <span className="sd-perf-gauge-label">Used</span>
                          </div>
                        </div>

                        <div className="sd-perf-target-badge">
                          <Target size={14} className="sd-perf-target-icon" />
                          <span>Target: 85%</span>
                        </div>

                        <div className="sd-perf-card-footer sd-perf-footer-list">
                          <div className="sd-perf-stat-line">
                            <span>Used Questions</span>
                            <strong>{totalAnswered}</strong>
                          </div>
                          <div className="sd-perf-stat-line">
                            <span>Unused Questions</span>
                            <strong>{Math.max(0, totalQBank - totalAnswered)}</strong>
                          </div>
                          <div className="sd-perf-stat-line">
                            <span>Total Questions</span>
                            <strong>{totalQBank}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Readiness Exam Results */}
                      <div className="sd-perf-metric-card">
                        <h3 className="sd-perf-card-title">Readiness Exam Results</h3>
                        <div className="sd-perf-exam-list">
                          <div className="sd-perf-exam-row">
                            <span className="sd-perf-exam-name">Exam 1</span>
                            <span className={`sd-perf-exam-status ${cat1?.passStatus === "PASS" ? "green" : ""}`}>
                              {cat1 ? `${cat1.passStatus} (${cat1.passProbability}%)` : "Not Attempted"}
                            </span>
                          </div>
                          <div className="sd-perf-exam-row">
                            <span className="sd-perf-exam-name">Exam 2</span>
                            <span className={`sd-perf-exam-status ${cat2?.passStatus === "PASS" ? "green" : ""}`}>
                              {cat2 ? `${cat2.passStatus} (${cat2.passProbability}%)` : "Not Attempted"}
                            </span>
                          </div>
                          <div className="sd-perf-exam-row">
                            <span className="sd-perf-exam-name">Exam 3</span>
                            <span className={`sd-perf-exam-status ${cat3?.passStatus === "PASS" ? "green" : ""}`}>
                              {cat3 ? `${cat3.passStatus} (${cat3.passProbability}%)` : "Not Attempted"}
                            </span>
                          </div>
                          <div className="sd-perf-exam-row">
                            <span className="sd-perf-exam-name">Exam 4</span>
                            <span className={`sd-perf-exam-status ${cat4?.passStatus === "PASS" ? "green" : ""}`}>
                              {cat4 ? `${cat4.passStatus} (${cat4.passProbability}%)` : "Not Attempted"}
                            </span>
                          </div>
                        </div>

                        <div className={`sd-perf-target-badge ${savedCatSummaries.length === 4 ? "" : "sd-perf-target-badge-red"}`}>
                          <Target size={14} className="sd-perf-target-icon" />
                          <span>Target: Attempt All 4 ({savedCatSummaries.length}/4)</span>
                        </div>

                        <div className="sd-perf-card-footer">
                          <span>Readiness Status</span>
                          <strong>{hasPassedCat ? "Likely to Pass" : "In Progress"}</strong>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </section>

            {/* 3. Subject Performance Section */}
            <section className="sd-section" aria-labelledby="subj-perf-heading">
              <div className="sd-section-header-row">
                <div>
                  <h2 id="subj-perf-heading" className="sd-section-title">
                    Subject Performance
                  </h2>
                  <p className="sd-section-subtitle">
                    Increase your score in each subject by focusing on systems marked with a red 🔥 - that&apos;s where you can improve the most!
                  </p>
                </div>
                <button
                  type="button"
                  className="sd-expand-all-text-btn"
                  onClick={toggleAllPerfSubjects}
                >
                  {isAllPerfExpanded ? "− Collapse All" : "+ Expand All"}
                </button>
              </div>

              <div className="sd-perf-table-card">
                <div className="sd-perf-table-header">
                  <span className="sd-th-subject">Subject</span>
                  <span className="sd-th-score">Score</span>
                  <span className="sd-th-avg">Avg. Score</span>
                  <span className="sd-th-used">Questions Used</span>
                  <span className="sd-th-action"></span>
                </div>

                <div className="sd-perf-table-body">
                  {performanceSubjects.map((sub) => {
                    const isExpanded = !!expandedPerfSubjects[sub.id];
                    const IconComp = sub.icon;
                    return (
                      <div key={sub.id} className="sd-perf-row-group">
                        <div className="sd-perf-row">
                          <div className="sd-td-subject">
                            <button
                              type="button"
                              className="sd-row-expand-btn"
                              onClick={() => togglePerfSubject(sub.id)}
                              aria-label={`Toggle ${sub.name}`}
                            >
                              {isExpanded ? <Minus size={13} /> : <Plus size={13} />}
                            </button>
                            <span className="sd-perf-icon-badge" style={{ color: sub.iconColor }}>
                              <IconComp size={15} />
                            </span>
                            <span className="sd-perf-subj-title">{sub.name}</span>
                          </div>

                          <div className="sd-td-score">
                            <span className="sd-perf-metric-val">{sub.score}%</span>
                            <div className="sd-perf-bar-track">
                              <div className="sd-perf-bar-fill" style={{ width: `${sub.score}%` }} />
                            </div>
                          </div>

                          <div className="sd-td-avg">
                            <span className="sd-perf-metric-val">{sub.avgScore}</span>
                          </div>

                          <div className="sd-td-used">
                            <span className="sd-perf-metric-val">{sub.used} / {sub.total}</span>
                            <div className="sd-perf-bar-track">
                              <div
                                className="sd-perf-bar-fill"
                                style={{ width: `${(sub.used / sub.total) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="sd-td-action">
                            <button
                              type="button"
                              className="sd-perf-circle-action"
                              onClick={() => setIsCreateTestOpen(true)}
                              title={`Start ${sub.name} test`}
                              aria-label={`Start ${sub.name} test`}
                            >
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Subcategory / Systems Rows */}
                        {isExpanded && (
                          <div className="sd-perf-systems-list">
                            {sub.systems.map((sys, idx) => (
                              <div key={idx} className="sd-perf-sub-row">
                                <div className="sd-td-subject sd-td-sub-indent">
                                  <span>{sys.name}</span>
                                </div>
                                <div className="sd-td-score">
                                  <span className="sd-perf-metric-val">{sys.score}%</span>
                                  <div className="sd-perf-bar-track">
                                    <div className="sd-perf-bar-fill" style={{ width: `${sys.score}%` }} />
                                  </div>
                                </div>
                                <div className="sd-td-avg">
                                  <span className="sd-perf-metric-val">{sys.avgScore}</span>
                                </div>
                                <div className="sd-td-used">
                                  <span className="sd-perf-metric-val">{sys.used} / {sys.total}</span>
                                  <div className="sd-perf-bar-track">
                                    <div
                                      className="sd-perf-bar-fill"
                                      style={{ width: `${(sys.used / sys.total) * 100}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="sd-td-action">
                                  <button
                                    type="button"
                                    className="sd-perf-circle-action sd-perf-action-sm"
                                    onClick={() => setIsCreateTestOpen(true)}
                                    aria-label={`Test ${sys.name}`}
                                  >
                                    <ArrowRight size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. Time Management Section */}
            <section className="sd-section" aria-labelledby="time-mgmt-heading">
              <div>
                <h2 id="time-mgmt-heading" className="sd-section-title">
                  Time Management
                </h2>
                <p className="sd-section-subtitle">
                  Green means you&apos;re faster than average! Red shows where you can improve your pace.
                </p>
              </div>

              <div className="sd-perf-table-card">
                <div className="sd-perf-time-header">
                  <span className="sd-time-th-subject">Subject</span>
                  <span className="sd-time-th-val">
                    Time Per Question <ChevronDown size={13} className="sd-sort-chevron" />
                  </span>
                  <span className="sd-time-th-avg">Avg. Time</span>
                </div>

                <div className="sd-perf-table-body">
                  {performanceSubjects.map((sub) => {
                    const IconComp = sub.icon;
                    return (
                      <div key={sub.id} className="sd-perf-time-row">
                        <div className="sd-time-td-subject">
                          <span className="sd-perf-icon-badge" style={{ color: sub.iconColor }}>
                            <IconComp size={15} />
                          </span>
                          <span className="sd-perf-subj-title">{sub.name}</span>
                        </div>
                        <div className="sd-time-td-val">
                          <span className="sd-time-dash">{sub.time}</span>
                        </div>
                        <div className="sd-time-td-avg">
                          <span>{sub.avgTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 5. FAQs Section */}
            <section className="sd-section" aria-labelledby="perf-faqs-heading">
              <h2 id="perf-faqs-heading" className="sd-section-title">
                FAQs
              </h2>
              <div className="sd-faqs-list">
                {performanceFaqs.map((faq, index) => {
                  const isOpen = openPerfFaqIndex === index;
                  return (
                    <div key={index} className="sd-faq-item">
                      <button
                        type="button"
                        className="sd-faq-question-btn"
                        onClick={() => setOpenPerfFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className="sd-faq-toggle-icon">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="sd-faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : activeTab === "cat-exams" ? (
          /* ================================================================
             CAT READINESS EXAMS VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-cat-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Next Gen Readiness Exams</span>
                </nav>
                <h1 className="sd-perf-title">CAT Readiness Exams</h1>
                <p className="sd-perf-subtitle">
                  These readiness exams simulate the look, feel, and content of the real Next Gen NCLEX. Use them to gauge your readiness to pass the NCLEX!
                </p>
              </div>
            </div>

            {/* 2. 4 CAT Exam Cards */}
            <section className="sd-cat-exams-list" aria-label="CAT Readiness Exams List">
              {[1, 2, 3, 4].map((num) => {
                const pastSummary = savedCatSummaries.find((s) => s.examNumber === num);
                const isLocked = num > 1 && !membership.isPaid;

                return (
                  <div key={num} className="sd-cat-exam-card">
                    <div className="sd-cat-exam-info">
                      <span className="sd-cat-exam-num">{num}</span>
                      <div>
                        <strong className="sd-cat-exam-title">CAT Readiness Exam {num}</strong>
                        {pastSummary ? (
                          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "3px" }}>
                            <span style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: "4px",
                              backgroundColor: pastSummary.passStatus === "PASS" ? "#dcfce7" : "#fee2e2",
                              color: pastSummary.passStatus === "PASS" ? "#166534" : "#991b1b"
                            }}>
                              {pastSummary.passStatus} · {pastSummary.passProbability}% Likelihood
                            </span>
                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                              {pastSummary.totalQuestions} Questions · {new Date(pastSummary.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            85 - 150 Adaptive Items · Rasch IRT Model
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {pastSummary && (
                        <button
                          type="button"
                          className="sd-btn-create-test-pill"
                          style={{ padding: "6px 12px", fontSize: "12px", backgroundColor: "#f1f0fb", color: "#4f46e5", border: "1px solid #c7d2fe" }}
                          onClick={() => {
                            setCatExamSummary(pastSummary);
                            setActiveTestExamType("cat");
                            setIsResultsScreenActive(true);
                            setIsTestActive(true);
                          }}
                        >
                          View Report
                        </button>
                      )}

                      {isLocked ? (
                        <button
                          type="button"
                          className="sd-btn-upgrade-cat"
                          onClick={() => setIsUpgradeModalOpen(true)}
                        >
                          <Shield size={14} />
                          <span>Upgrade</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="sd-btn-start-cat"
                          onClick={() => startCatExam(num as 1 | 2 | 3 | 4)}
                        >
                          {pastSummary ? "Retake Exam" : "Start Exam"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* 3. FAQs Section */}
            <section className="sd-section" aria-labelledby="cat-faqs-heading">
              <h2 id="cat-faqs-heading" className="sd-section-title">
                FAQs
              </h2>
              <div className="sd-faqs-list">
                {catFaqs.map((faq, index) => {
                  const isOpen = openCatFaqIndex === index;
                  return (
                    <div key={index} className="sd-faq-item">
                      <button
                        type="button"
                        className="sd-faq-question-btn"
                        onClick={() => setOpenCatFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className="sd-faq-toggle-icon">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="sd-faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : activeTab === "previous-tests" ? (
          /* ================================================================
             PREVIOUS TESTS VIEW (Matches exact reference design)
             ================================================================ */
          <div className="sd-content sd-prev-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Previous Tests</span>
                </nav>
                <h1 className="sd-perf-title">Previous Tests</h1>
              </div>
            </div>

            {/* Notification Banner */}
            <div className="sd-prev-notification-banner">
              <span>
                Your CAT Readiness Exam attempts can be reviewed on the{" "}
                <button
                  type="button"
                  className="sd-prev-banner-link"
                  onClick={() => setActiveTab("cat-exams")}
                >
                  CAT Readiness Exams page.
                </button>
              </span>
            </div>

            {/* Table Container with Headers & Empty State */}
            <div className="sd-prev-table-card">
              <div className="sd-prev-table-header">
                <span className="sd-prev-th sd-prev-th-num">#</span>
                <span className="sd-prev-th sd-prev-th-name">Test Name</span>
                <span className="sd-prev-th sd-prev-th-pool">Question Pool</span>
                <span className="sd-prev-th sd-prev-th-date">Date Taken</span>
                <span className="sd-prev-th sd-prev-th-score">Score</span>
                <span className="sd-prev-th sd-prev-th-avg">Avg. Score</span>
                <span className="sd-prev-th sd-prev-th-questions">Questions</span>
                <span className="sd-prev-th" style={{ textAlign: "right" }}>Action</span>
              </div>

              {savedPreviousTests.length > 0 ? (
                <div className="sd-prev-table-body">
                  {savedPreviousTests.map((t, idx) => (
                    <div key={t.id} className="sd-prev-table-row" style={{
                      display: "grid",
                      gridTemplateColumns: "36px 2fr 1.2fr 1fr 1fr 1fr 1fr 80px",
                      padding: "12px 16px",
                      alignItems: "center",
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: "13px"
                    }}>
                      <span style={{ fontWeight: 600, color: "#64748b" }}>{idx + 1}</span>
                      <strong style={{ color: "#1e293b" }}>{t.name}</strong>
                      <span style={{ color: "#64748b" }}>{t.pool}</span>
                      <span style={{ color: "#64748b" }}>{t.date}</span>
                      <span style={{
                        fontWeight: 700,
                        color: t.scorePercent >= 65 ? "#16a34a" : "#dc2626"
                      }}>
                        {t.scorePercent}%
                      </span>
                      <span style={{ color: "#64748b" }}>{t.avgScorePercent}%</span>
                      <span style={{ color: "#334155", fontWeight: 600 }}>{t.answeredCount} / {t.totalQuestions}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (t.type === "cat") {
                            const summary = savedCatSummaries.find((s) => s.examId === t.id);
                            if (summary) {
                              setCatExamSummary(summary);
                              setActiveTestExamType("cat");
                              setIsResultsScreenActive(true);
                              setIsTestActive(true);
                            } else {
                              setActiveTab("cat-exams");
                            }
                          } else {
                            setActiveTab("home");
                            setIsCreateTestOpen(true);
                          }
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          backgroundColor: "#f1f0fb",
                          color: "#4f46e5",
                          border: "1px solid #c7d2fe",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="sd-prev-empty-state">
                  <div className="sd-prev-empty-art" aria-hidden="true">
                    <svg width="86" height="58" viewBox="0 0 86 58" fill="none">
                      <rect x="1" y="1" width="84" height="56" rx="8" fill="#F8FAFC" stroke="#C7D2FE" strokeWidth="2" />
                      <path d="M1 12H85" stroke="#C7D2FE" strokeWidth="1.5" />
                      <circle cx="9" cy="6.5" r="2" fill="#818CF8" />
                      <circle cx="16" cy="6.5" r="2" fill="#A5B4FC" />
                      <rect x="10" y="20" width="30" height="4" rx="2" fill="#C7D2FE" />
                      <rect x="46" y="20" width="28" height="4" rx="2" fill="#E0E7FF" />
                      <rect x="10" y="32" width="30" height="4" rx="2" fill="#C7D2FE" />
                      <rect x="46" y="32" width="28" height="4" rx="2" fill="#E0E7FF" />
                      <rect x="10" y="44" width="30" height="4" rx="2" fill="#C7D2FE" />
                      <rect x="46" y="44" width="28" height="4" rx="2" fill="#E0E7FF" />
                    </svg>
                  </div>
                  <p className="sd-prev-empty-text">
                    Tests you end or pause will appear here for you to review. Try creating a test.
                  </p>
                  <button
                    type="button"
                    className="sd-btn-create-test-pill"
                    onClick={() => setIsCreateTestOpen(true)}
                  >
                    <Plus size={16} />
                    <span>Create Test</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "case-studies" ? (
          /* ================================================================
             ALL CASE STUDIES VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Next Gen Cases</span>
                </nav>
                <h1 className="sd-perf-title">Case Studies</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12.5px", marginTop: "4px", lineHeight: "1.5" }}>
                  The case studies below are based on the real Next Gen NCLEX. Practice with these so you&apos;re ready for the real exam.
                </p>

                {/* Content Experts Strip */}
                <div className="sd-subj-expert-strip" style={{ marginTop: "12px" }}>
                  <div className="sd-avatars-pair">
                    <div
                      className="sd-pair-avatar"
                      style={{ backgroundColor: "#0D9488" }}
                      title="Dr. Emily Wilson, DNP"
                    >
                      <img
                        src="/images/avatar-caroline.jpg"
                        alt="Dr. Emily Wilson"
                        className="sd-pair-avatar-img"
                      />
                    </div>
                    <div
                      className="sd-pair-avatar sd-pair-avatar-overlap"
                      style={{ backgroundColor: "#8B5CF6" }}
                      title="Dr. Cortney Chignoli-Scott, DNP"
                    >
                      <img
                        src="/images/avatar-alex.jpg"
                        alt="Dr. Cortney Chignoli-Scott"
                        className="sd-pair-avatar-img"
                      />
                    </div>
                    <div
                      className="sd-pair-avatar sd-pair-avatar-overlap"
                      style={{ backgroundColor: "#F59E0B" }}
                      title="Cigi de Vries, MSN"
                    >
                      <img
                        src="/images/nursing-student.jpg"
                        alt="Cigi de Vries"
                        className="sd-pair-avatar-img"
                      />
                    </div>
                  </div>
                  <div className="sd-subj-expert-details">
                    <small className="sd-subj-expert-label">CONTENT EXPERTS</small>
                    <strong className="sd-subj-expert-names">
                      Dr. Emily Wilson, DNP, Dr. Cortney Chignoli-Scott, DNP, &amp; Cigi de Vries, MSN
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Case Studies Stack */}
            <section className="sd-case-studies-stack" aria-label="Next Gen Case Studies List" style={{ marginTop: "16px" }}>
              {allCaseStudiesList.map((study) => (
                <div key={study.id} className="sd-case-study-card">
                  <div className="sd-case-study-left">
                    <div className="sd-case-study-title-row">
                      <span className="sd-case-study-num">{study.id}</span>
                      <strong className="sd-case-study-title">{study.title}</strong>
                    </div>
                    <div className="sd-case-study-progress-row">
                      <span className="sd-case-study-stat">
                        {study.questionsUsed} of {study.questionsTotal} questions used
                      </span>
                      <div className="sd-case-study-track">
                        <div
                          className="sd-case-study-fill"
                          style={{
                            width: `${study.questionsTotal > 0 ? (study.questionsUsed / study.questionsTotal) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sd-case-study-right">
                    {study.isUnlocked ? (
                      <button
                        type="button"
                        className="sd-btn-start-case"
                        onClick={() => {
                          alert(`Starting Next-Gen Case Study: ${study.title}! Launching clinical simulation...`);
                        }}
                      >
                        Start
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="sd-btn-upgrade-case"
                        onClick={() => setIsUpgradeModalOpen(true)}
                      >
                        <Shield size={13} />
                        <span>Upgrade</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        ) : activeTab === "standalone" ? (
          /* ================================================================
             ALL STANDALONE QUESTIONS VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Next Gen Standalone</span>
                </nav>
                <h1 className="sd-perf-title">Standalone Questions</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12.5px", marginTop: "4px", lineHeight: "1.5" }}>
                  Your questions are assigned to your account and do not repeat. Progress saves to your student session.
                </p>
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#e0e7ff", fontWeight: 700 }}>
                  {questionProgress ? `${questionProgress.answered} of ${questionProgress.total} assigned questions completed` : "Loading your assigned questions…"}
                </div>
                {questionApiError && <div role="alert" style={{ marginTop: "10px", padding: "10px 12px", borderRadius: "8px", background: "#fff7ed", color: "#9a3412", fontSize: "12px" }}>{questionApiError}</div>}

                {/* Content Experts Strip */}
                <div className="sd-subj-expert-strip" style={{ marginTop: "12px" }}>
                  <div className="sd-avatars-pair">
                    <div
                      className="sd-pair-avatar"
                      style={{ backgroundColor: "#0D9488" }}
                      title="Dr. Emily Wilson, DNP"
                    >
                      <img
                        src="/images/avatar-alex.jpg"
                        alt="Dr. Emily Wilson"
                        className="sd-pair-avatar-img"
                      />
                    </div>
                  </div>
                  <div className="sd-subj-expert-details">
                    <small className="sd-subj-expert-label">CONTENT EXPERTS</small>
                    <strong className="sd-subj-expert-names">Dr. Emily Wilson, DNP</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Standalone Cards Stack */}
            <section className="sd-case-studies-stack" aria-label="Standalone Questions List" style={{ marginTop: "16px" }}>
              {/* Free Questions Card */}
              {(() => {
                const freeCustomCount = standaloneQuestions.filter((q) => !(q.isPaid ?? q.subjectId !== "free")).length;
                const totalFree = freeCustomCount;
                const completedFree = standaloneQuestions.filter((q) => !(q.isPaid ?? q.subjectId !== "free") && q.answered).length;
                return (
                  <div className="sd-standalone-subject-card" style={{ marginBottom: "12px" }}>
                    <div className="sd-standalone-subject-left" style={{ paddingLeft: "8px" }}>
                      <div className="sd-standalone-subject-info">
                        <strong className="sd-case-study-title" style={{ fontSize: "15px" }}>Free Questions</strong>
                        <div className="sd-case-study-progress-row" style={{ marginLeft: 0 }}>
                          <span className="sd-case-study-stat">{completedFree} of {totalFree} assigned questions completed</span>
                          <div className="sd-case-study-track">
                            <div className="sd-case-study-fill" style={{ width: `${totalFree ? completedFree / totalFree * 100 : 0}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sd-case-study-right">
                      <button
                        type="button"
                        className="sd-btn-create-test-free"
                        onClick={() => startStandaloneExam(standaloneQuestions.filter((q) => !(q.isPaid ?? q.subjectId !== "free") && !q.locked && !q.answered))}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#6366f1",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "20px",
                          padding: "8px 18px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        <Plus size={14} />
                        <span>Create Test</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Subject Cards */}
              {standaloneSubjectsCatalog.map((sub) => {
                const IconComp = sub.icon;
                const customSubjectCount = standaloneQuestions.filter((q) => q.subjectId === sub.id).length;
                const totalQuestions = sub.questionsTotal + customSubjectCount;
                return (
                  <div
                    key={sub.id}
                    className="sd-standalone-subject-card"
                    style={{ marginBottom: "12px", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                      setSubjectSubTab("standalone");
                      setActiveTab("subject");
                    }}
                  >
                    <div className="sd-standalone-subject-left">
                      <div
                        className="sd-sub-icon-badge"
                        style={{
                          backgroundColor: sub.iconBg,
                          color: sub.iconColor,
                          width: "38px",
                          height: "38px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        <IconComp size={20} />
                      </div>
                      <div className="sd-standalone-subject-info">
                        <strong className="sd-case-study-title">{sub.name}</strong>
                        <div className="sd-case-study-progress-row" style={{ marginLeft: 0 }}>
                          <span className="sd-case-study-stat">0 of {totalQuestions} questions used</span>
                          <div className="sd-case-study-track">
                            <div className="sd-case-study-fill" style={{ width: "0%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sd-case-study-right">
                      <button
                        type="button"
                        className="sd-btn-upgrade-case"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsUpgradeModalOpen(true);
                        }}
                      >
                        <Shield size={13} />
                        <span>Upgrade</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* 3. Live Dynamic Admin & Faculty Authored Questions Pool */}
            <section style={{ marginTop: "24px", marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "14px"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                      Faculty &amp; Admin Standalone Questions ({standaloneQuestions.length})
                    </h2>
                    <span
                      style={{
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px"
                      }}
                    >
                      ● Live Sync
                    </span>
                  </div>
                  <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "12px", marginTop: "3px", margin: 0 }}>
                    Questions created in the Admin Dashboard instantly populate here for student practice.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  {!membership.isPaid ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const freeOnly = standaloneQuestions.filter((q) => !(q.isPaid ?? q.subjectId !== "free") && !q.answered);
                          if (freeOnly.length > 0) {
                            startStandaloneExam(freeOnly, 0);
                          } else {
                            setIsPaywallOpen(true);
                          }
                        }}
                        style={{
                          fontSize: "12px",
                          color: "#ffffff",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#10b981",
                          padding: "7px 14px",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)"
                        }}
                      >
                        <Zap size={13} fill="#ffffff" />
                        <span>Start Free Mode ({standaloneQuestions.filter((q) => !(q.isPaid ?? q.subjectId !== "free") && !q.answered).length} Free Questions)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaywallTargetQuestion(null);
                          setIsPaywallOpen(true);
                        }}
                        style={{
                          fontSize: "12px",
                          color: "#ffffff",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          padding: "7px 16px",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(99, 102, 241, 0.4)"
                        }}
                      >
                        <Lock size={13} />
                        <span>Unlock All Paid Questions ($99 / $149)</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#fbbf24",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "rgba(251, 191, 36, 0.15)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(251, 191, 36, 0.3)"
                        }}
                      >
                        <Sparkles size={14} fill="#fbbf24" />
                        <span>All {standaloneQuestions.length} Questions Unlocked (Pro Member)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => startStandaloneExam(standaloneQuestions)}
                        style={{
                          fontSize: "12px",
                          color: "#ffffff",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#10b981",
                          padding: "7px 14px",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)"
                        }}
                      >
                        <Zap size={13} fill="#ffffff" />
                        <span>Start Test Mode (All Questions)</span>
                      </button>
                    </>
                  )}

                  <Link
                    href="/admin#standalone"
                    target="_blank"
                    style={{
                      fontSize: "12px",
                      color: "#c7d2fe",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      padding: "6px 12px",
                      borderRadius: "6px"
                    }}
                  >
                    Manage in Admin Workspace <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {standaloneQuestions.map((q, qIndex) => {
                  const isPaidQuestion = q.isPaid ?? q.subjectId !== "free";
                  const isLocked = Boolean(q.locked);

                  return (
                    <div
                      key={q.id}
                      style={{
                        backgroundColor: isLocked ? "#faf9fe" : "#ffffff",
                        borderRadius: "10px",
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                        border: isLocked ? "1.5px solid #d4ccfc" : "1px solid rgba(255,255,255,0.2)"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span
                            style={{
                              backgroundColor: isPaidQuestion ? "#ede9fe" : "#dbeafe",
                              color: isPaidQuestion ? "#7c3aed" : "#1e40af",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700
                            }}
                          >
                            {q.subjectName}
                          </span>
                          {isLocked ? (
                            <span
                              style={{
                                backgroundColor: "#fef3c7",
                                color: "#b45309",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 800,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Lock size={11} /> Paid Question (Requires Membership)
                            </span>
                          ) : isPaidQuestion ? (
                            <span
                              style={{
                                backgroundColor: "#fef9c3",
                                color: "#854d0e",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 800,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Sparkles size={11} fill="#854d0e" /> Pro Unlocked
                            </span>
                          ) : (
                            <span
                              style={{
                                backgroundColor: "#e6f8f1",
                                color: "#065f46",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: 700
                              }}
                            >
                              ✓ Free Access
                            </span>
                          )}
                          <span style={{ color: "#9ca3af", fontSize: "11px" }}>•</span>
                          <span style={{ color: "#6b7280", fontSize: "11px" }}>{q.type}</span>
                          <span style={{ color: "#9ca3af", fontSize: "11px" }}>•</span>
                          <span style={{ color: "#4b5563", fontSize: "11px" }}>By {q.author}</span>
                        </div>
                        <strong style={{ fontSize: "14.5px", color: "#111827", display: "block", marginBottom: "4px" }}>
                          {q.title}
                        </strong>
                        <span style={{ display: "inline-block", marginBottom: "6px", fontSize: "11px", color: q.answered ? "#047857" : "#64748b", fontWeight: 700 }}>{q.answered ? "Completed" : `Question ${q.sequence ?? qIndex + 1} of ${questionProgress?.total ?? standaloneQuestions.length}`}</span>
                        <p
                          style={{
                            fontSize: "12.5px",
                            color: "#4b5563",
                            margin: 0,
                            lineHeight: "1.4",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {q.stem}
                        </p>
                      </div>

                      <div style={{ flexShrink: 0, display: "flex", gap: "8px", alignItems: "center" }}>
                        {isLocked ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPaywallTargetQuestion(q);
                              setIsPaywallOpen(true);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "9px 18px",
                              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 800,
                              cursor: "pointer",
                              boxShadow: "0 3px 12px rgba(99, 102, 241, 0.45)",
                              whiteSpace: "nowrap"
                            }}
                          >
                            <Lock size={13} />
                            <span>Pay &amp; Unlock ($99 / $149)</span>
                          </button>
                        ) : q.answered ? (
                          <span style={{ padding: "8px 12px", borderRadius: "20px", background: "#dcfce7", color: "#166534", fontSize: "12px", fontWeight: 800 }}>Completed</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                startStandaloneExam(standaloneQuestions, qIndex);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                backgroundColor: "#f1f5f9",
                                color: "#334155",
                                border: "1px solid #cbd5e1",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                              }}
                            >
                              <Play size={12} fill="#334155" />
                              <span>Quick Practice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                startStandaloneExam(standaloneQuestions, qIndex);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                backgroundColor: "#007399",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 3px 10px rgba(0, 115, 153, 0.35)",
                                whiteSpace: "nowrap"
                              }}
                            >
                              <span>Exam Mode ➔</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : activeTab === "crash-course" ? (
          /* ================================================================
             ALL CRASH COURSE VIDEOS VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Crash Courses</span>
                </nav>
                <h1 className="sd-perf-title">Crash Course Videos</h1>
                <p className="sd-perf-subtitle">
                  Review the most tested NCLEX concepts with our videos and bite-sized quizzes! More lessons will be added weekly!
                </p>
              </div>
            </div>

            {/* 2. Filter search bar */}
            <div className="sd-crash-filter-bar" style={{ marginBottom: "20px" }}>
              <SlidersHorizontal size={15} className="sd-crash-filter-icon" />
              <input
                type="text"
                className="sd-crash-filter-input"
                placeholder="Start typing to filter the lessons"
                value={crashFilterQuery}
                onChange={(e) => setCrashFilterQuery(e.target.value)}
              />
              {crashFilterQuery && (
                <button
                  type="button"
                  onClick={() => setCrashFilterQuery("")}
                  style={{
                    background: "none",
                    border: 0,
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0 4px"
                  }}
                  aria-label="Clear lesson filter"
                >
                  ×
                </button>
              )}
            </div>

            {/* 3. The 7 Crash Course Subject Cards */}
            <section className="sd-crash-hub-list" aria-label="Crash Course Videos List">
              {crashCourseHubSubjects
                .filter((sub) =>
                  crashFilterQuery
                    ? sub.name.toLowerCase().includes(crashFilterQuery.toLowerCase()) ||
                    crashFilterQuery.toLowerCase().includes("lesson") ||
                    crashFilterQuery.toLowerCase().includes("crash")
                    : true
                )
                .map((sub) => {
                  const isExpanded = !!expandedCrashHubSubjects[sub.id];

                  // Helper to get lessons for expanded view
                  const lessonsForSubject =
                    sub.id === "management-of-care"
                      ? filteredMocCrashLessons
                      : sub.id === "child-health"
                        ? childHealthCrashTopics.map((t) => ({
                          id: `ch-${t.id}`,
                          type: "video" as const,
                          title: t.title,
                          duration: t.videoDuration,
                          questionsTotal: t.questionsTotal,
                          isUnlocked: t.isUnlocked
                        }))
                        : sub.id === "fundamentals"
                          ? fundamentalsCrashLessons
                          : sub.id === "maternal-newborn"
                            ? maternalNewbornCrashLessons
                            : sub.id === "mental-health"
                              ? mentalHealthCrashLessons
                              : sub.id === "pharmacology"
                                ? pharmacologyCrashLessons
                                : adultHealthCrashTopics.map((t) => ({
                                  id: `ah-${t.id}`,
                                  type: "video" as const,
                                  title: t.title,
                                  duration: t.videoDuration,
                                  questionsTotal: t.questionsTotal,
                                  isUnlocked: t.isUnlocked
                                }));

                  return (
                    <div key={sub.id} className="sd-crash-hub-card">
                      <div className="sd-crash-hub-main">
                        <div className="sd-crash-hub-info">
                          <div className="sd-crash-hub-title-row">
                            <span className="sd-crash-hub-num">{sub.num}</span>
                            <strong className="sd-crash-hub-title">{sub.name}</strong>
                          </div>
                          <div className="sd-crash-hub-meta-row">
                            <span className="sd-crash-hub-meta-text">
                              {sub.completedLessons} of {sub.totalLessons} lessons completed &bull; {sub.runtime} runtime
                            </span>
                            <div className="sd-crash-hub-track">
                              <div
                                className="sd-crash-hub-fill"
                                style={{
                                  width: `${(sub.completedLessons / sub.totalLessons) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="sd-btn-start-crash"
                          onClick={() => {
                            setSelectedSubjectId(sub.id);
                            setSubjectSubTab("crash-course");
                            setActiveTab("subject");
                          }}
                        >
                          Start
                        </button>
                      </div>

                      {/* Expanded Lessons List if clicked */}
                      {isExpanded && (
                        <div className="sd-crash-hub-expanded-lessons">
                          <div className="sd-crash-lessons-list">
                            {lessonsForSubject.map((lesson) => {
                              const isLessonCompleted = !!completedCrashLessons[lesson.id];
                              return (
                                <div
                                  key={lesson.id}
                                  className="sd-crash-lesson-row"
                                  onClick={() => {
                                    if (lesson.isUnlocked) {
                                      alert(`Playing "${lesson.title}" video lecture...`);
                                    } else {
                                      setIsUpgradeModalOpen(true);
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="sd-crash-row-left">
                                    <button
                                      type="button"
                                      className={`sd-crash-check-circle ${isLessonCompleted ? "sd-crash-check-circle-done" : ""
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCompletedCrashLessons((prev) => ({
                                          ...prev,
                                          [lesson.id]: !prev[lesson.id]
                                        }));
                                      }}
                                      aria-label={`Mark ${lesson.title} completed`}
                                    >
                                      {isLessonCompleted && <Check size={10} strokeWidth={3} />}
                                    </button>

                                    <span
                                      className={`sd-crash-badge ${lesson.type === "video"
                                        ? "sd-crash-badge-video"
                                        : "sd-crash-badge-bites"
                                        }`}
                                    >
                                      {lesson.type === "video" ? "Video" : "Bites"}
                                    </span>

                                    <span className="sd-crash-lesson-title">{lesson.title}</span>
                                  </div>

                                  <div className="sd-crash-row-right">
                                    {lesson.type === "video" ? (
                                      <span className="sd-crash-stat-text">{lesson.duration}</span>
                                    ) : (
                                      <span className="sd-crash-stat-text">
                                        0/{lesson.questionsTotal || 5}
                                      </span>
                                    )}

                                    <div className="sd-crash-action-icon">
                                      {lesson.isUnlocked ? (
                                        <ChevronRight size={14} className="sd-crash-chevron" />
                                      ) : (
                                        <Shield size={14} className="sd-crash-lock" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Bottom Toggle Link */}
                      <button
                        type="button"
                        className="sd-crash-hub-toggle"
                        onClick={() =>
                          setExpandedCrashHubSubjects((prev) => ({
                            ...prev,
                            [sub.id]: !prev[sub.id]
                          }))
                        }
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={13} />
                            <span>Hide lessons</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={13} />
                            <span>Show all {sub.totalLessons} lessons</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </section>
          </div>
        ) : activeTab === "cheat-sheets" ? (
          /* ================================================================
             ALL NCLEX CHEAT SHEETS VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Cheat Sheets</span>
                </nav>
                <h1 className="sd-perf-title">NCLEX Cheat Sheets</h1>
                <p className="sd-perf-subtitle">
                  Everything you need to pass the NCLEX®, and nothing you don&apos;t. NCLEXLab&apos;s Cheat Sheets condense everything you need to know about a topic into a single, digestible resource.
                </p>
              </div>
            </div>

            {/* 2. Two-Column Layout (Sidebar + Main Content) */}
            <div className="sd-cheats-hub-grid">
              {/* Left Column: Subjects Menu */}
              <aside className="sd-cheats-sidebar" aria-label="Cheat Sheet Subjects">
                {cheatHubSubjects.map((sub) => {
                  const Icon = sub.icon;
                  const isActive = selectedCheatHubSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`sd-cheats-sub-btn ${isActive ? "sd-cheats-sub-btn-active" : ""}`}
                      onClick={() => {
                        setSelectedCheatHubSubject(sub.id);
                        setSelectedCheatHubSystem(
                          sub.id === "all"
                            ? "All Systems"
                            : sub.id === "management-of-care"
                              ? "All Management of Care"
                              : `All ${sub.name}`
                        );
                      }}
                    >
                      <Icon
                        size={15}
                        className={`sd-cheats-sub-icon ${sub.id === "all" ? "sd-cheats-sub-icon-star" : ""
                          }`}
                      />
                      <span>{sub.name}</span>
                    </button>
                  );
                })}
              </aside>

              {/* Right Column: Search + Horizontal Pills + Cards Stack */}
              <main className="sd-cheats-main-pane">
                {/* Search Bar */}
                <div className="sd-cheats-search-bar">
                  <Search size={15} className="sd-cheats-search-icon" />
                  <input
                    type="text"
                    className="sd-cheats-search-input"
                    placeholder="Filter cheat sheets"
                    value={cheatHubSearchQuery}
                    onChange={(e) => setCheatHubSearchQuery(e.target.value)}
                  />
                  {cheatHubSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCheatHubSearchQuery("")}
                      style={{
                        background: "none",
                        border: 0,
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "0 4px"
                      }}
                      aria-label="Clear filter"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Horizontal Category / System Filter Pills */}
                <div className="sd-cheat-tags-wrap" style={{ marginTop: 0 }}>
                  {(selectedCheatHubSubject === "all"
                    ? allHubCheatSystems
                    : selectedCheatHubSubject === "management-of-care"
                      ? managementOfCareCheatSheetCategories
                      : selectedCheatHubSubject === "child-health"
                        ? childHealthCheatSheetCategories
                        : selectedCheatHubSubject === "fundamentals"
                          ? fundamentalsCheatSheetCategories
                          : selectedCheatHubSubject === "maternal-newborn"
                            ? maternalNewbornCheatSheetCategories
                            : selectedCheatHubSubject === "mental-health"
                              ? mentalHealthCheatSheetCategories
                              : selectedCheatHubSubject === "pharmacology"
                                ? pharmacologyCheatSheetCategories
                                : cheatSheetCategories
                  ).map((cat) => {
                    const isSystemActive = selectedCheatHubSystem === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`sd-cheat-tag-btn ${isSystemActive ? "sd-cheat-tag-btn-active" : ""}`}
                        onClick={() => setSelectedCheatHubSystem(cat)}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Cards List */}
                <section className="sd-cheat-cards-stack" aria-label="Cheat sheets collection">
                  {(selectedCheatHubSubject === "all"
                    ? allHubCheatSheetsCombined
                    : selectedCheatHubSubject === "management-of-care"
                      ? managementOfCareCheatSheets
                      : selectedCheatHubSubject === "child-health"
                        ? childHealthCheatSheets
                        : selectedCheatHubSubject === "fundamentals"
                          ? fundamentalsCheatSheets
                          : selectedCheatHubSubject === "maternal-newborn"
                            ? maternalNewbornCheatSheets
                            : selectedCheatHubSubject === "mental-health"
                              ? mentalHealthCheatSheets
                              : selectedCheatHubSubject === "pharmacology"
                                ? pharmacologyCheatSheets
                                : adultHealthCheatSheets
                  )
                    .filter((item) => {
                      // System filter
                      if (
                        selectedCheatHubSystem &&
                        !selectedCheatHubSystem.startsWith("All") &&
                        item.system !== selectedCheatHubSystem &&
                        !item.system.toLowerCase().includes(selectedCheatHubSystem.toLowerCase())
                      ) {
                        return false;
                      }
                      // Query filter
                      if (cheatHubSearchQuery.trim()) {
                        const q = cheatHubSearchQuery.toLowerCase();
                        return (
                          item.title.toLowerCase().includes(q) ||
                          item.subtitle.toLowerCase().includes(q) ||
                          item.system.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((item) => (
                      <div
                        key={`${item.subtitle}-${item.id}`}
                        className="sd-cheat-card"
                        onClick={() => {
                          if (item.isUnlocked) {
                            alert(`Downloading "${item.title}" NCLEX Cheat Sheet PDF...`);
                          } else {
                            setIsUpgradeModalOpen(true);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="sd-cheat-left">
                          <div
                            style={{
                              color: "#ef4444",
                              fontWeight: 800,
                              fontSize: "16px",
                              lineHeight: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px"
                            }}
                          >
                            +
                          </div>
                          <div className="sd-cheat-titles">
                            <strong className="sd-cheat-title">{item.title}</strong>
                            <span className="sd-cheat-sub">{item.subtitle}</span>
                          </div>
                        </div>

                        <div className="sd-cheat-right">
                          {item.isUnlocked ? (
                            <button
                              type="button"
                              className="sd-btn-download-cheat"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Downloading "${item.title}" NCLEX Cheat Sheet PDF...`);
                              }}
                            >
                              Download
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="sd-btn-upgrade-cat"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsUpgradeModalOpen(true);
                              }}
                            >
                              <Shield size={13} />
                              <span>Upgrade</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </section>
              </main>
            </div>
          </div>
        ) : activeTab === "strategy-course" ? (
          /* ================================================================
             NEXT GEN STRATEGY COURSE VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">Next Gen Strategy Course</span>
                </nav>
                <h1 className="sd-perf-title">Next Gen Strategy Course</h1>
                <p className="sd-perf-subtitle">
                  Learn everything you need to know about the Next Gen NCLEX. At the end, we&apos;ll walk through a full Next Gen case together.
                </p>

                {/* Content Expert Strip */}
                <div className="sd-subj-expert-strip" style={{ marginTop: "12px" }}>
                  <div className="sd-avatars-pair">
                    <img
                      src="/images/avatar-caroline.jpg"
                      alt="Dr. Emily Wilson"
                      className="sd-expert-avatar-img"
                    />
                  </div>
                  <div className="sd-expert-text-group">
                    <span className="sd-expert-label">CONTENT EXPERTS</span>
                    <span className="sd-expert-names">Dr. Emily Wilson, DNP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Filter Bar */}
            <div className="sd-crash-filter-bar" style={{ marginBottom: "20px" }}>
              <SlidersHorizontal size={15} className="sd-crash-filter-icon" />
              <input
                type="text"
                className="sd-crash-filter-input"
                placeholder="Start typing to filter the lessons"
                value={strategyFilterQuery}
                onChange={(e) => setStrategyFilterQuery(e.target.value)}
              />
              {strategyFilterQuery && (
                <button
                  type="button"
                  onClick={() => setStrategyFilterQuery("")}
                  style={{
                    background: "none",
                    border: 0,
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0 4px"
                  }}
                  aria-label="Clear filter"
                >
                  ×
                </button>
              )}
            </div>

            {/* 3. 3 Course Module Cards */}
            <section className="sd-crash-hub-list" aria-label="Strategy Course Modules">
              {strategyCourseModules
                .filter((mod) =>
                  strategyFilterQuery
                    ? mod.title.toLowerCase().includes(strategyFilterQuery.toLowerCase()) ||
                    mod.lessons.some((l) =>
                      l.title.toLowerCase().includes(strategyFilterQuery.toLowerCase())
                    )
                    : true
                )
                .map((mod) => {
                  const isExpanded = !!expandedStrategyModules[mod.id];
                  return (
                    <div key={mod.id} className="sd-crash-hub-card">
                      <div className="sd-crash-hub-main">
                        <div className="sd-crash-hub-info">
                          <div className="sd-crash-hub-title-row">
                            <span className="sd-crash-hub-num">{mod.num}</span>
                            <strong className="sd-crash-hub-title">{mod.title}</strong>
                          </div>
                          <div className="sd-crash-hub-meta-row">
                            <span className="sd-crash-hub-meta-text">
                              {mod.completedLessons} of {mod.totalLessons} lessons completed &bull; {mod.runtime} runtime
                            </span>
                            <div className="sd-crash-hub-track">
                              <div
                                className="sd-crash-hub-fill"
                                style={{
                                  width: `${(mod.completedLessons / mod.totalLessons) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="sd-btn-start-crash"
                          onClick={() => {
                            alert(`Starting ${mod.title}! Playing lecture 1...`);
                          }}
                        >
                          Start
                        </button>
                      </div>

                      {/* Expanded Lessons List if clicked */}
                      {isExpanded && (
                        <div className="sd-crash-hub-expanded-lessons">
                          <div className="sd-crash-lessons-list">
                            {mod.lessons.map((lesson) => {
                              const isCompleted = !!completedCrashLessons[lesson.id];
                              return (
                                <div
                                  key={lesson.id}
                                  className="sd-crash-lesson-row"
                                  onClick={() => {
                                    alert(`Playing "${lesson.title}" strategy video...`);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="sd-crash-row-left">
                                    <button
                                      type="button"
                                      className={`sd-crash-check-circle ${isCompleted ? "sd-crash-check-circle-done" : ""
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCompletedCrashLessons((prev) => ({
                                          ...prev,
                                          [lesson.id]: !prev[lesson.id]
                                        }));
                                      }}
                                      aria-label={`Mark ${lesson.title} completed`}
                                    >
                                      {isCompleted && <Check size={10} strokeWidth={3} />}
                                    </button>

                                    <span className="sd-crash-badge sd-crash-badge-video">
                                      Video
                                    </span>

                                    <span className="sd-crash-lesson-title">{lesson.title}</span>
                                  </div>

                                  <div className="sd-crash-row-right">
                                    <span className="sd-crash-stat-text">{lesson.duration}</span>
                                    <div className="sd-crash-action-icon">
                                      <ChevronRight size={14} className="sd-crash-chevron" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Bottom Toggle Link */}
                      <button
                        type="button"
                        className="sd-crash-hub-toggle"
                        onClick={() =>
                          setExpandedStrategyModules((prev) => ({
                            ...prev,
                            [mod.id]: !prev[mod.id]
                          }))
                        }
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={13} />
                            <span>Hide lessons</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={13} />
                            <span>Show all {mod.totalLessons} lessons</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </section>
          </div>
        ) : activeTab === "faqs" ? (
          /* ================================================================
             FAQS VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">FAQs</span>
                </nav>
                <h1 className="sd-perf-title">FAQs</h1>
              </div>
            </div>

            <section className="sd-section" aria-labelledby="faqs-main-heading" style={{ marginTop: "16px" }}>
              <div className="sd-faqs-list">
                {faqsList.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={faq.question} className="sd-faq-item">
                      <button
                        type="button"
                        className="sd-faq-question-btn"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className="sd-faq-toggle-icon">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="sd-faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : activeTab === "subject" || activeTab === "adult-health" ? (
          /* ================================================================
             SUBJECT DETAIL VIEW (Exact match to reference design)
             ================================================================ */
          <div className="sd-content sd-subj-page">
            {/* 1. Header & Breadcrumb */}
            <div className="sd-perf-header-row">
              <div className="sd-perf-header-left">
                <nav className="sd-perf-breadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="sd-breadcrumb-link"
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <span className="sd-breadcrumb-sep">›</span>
                  <span className="sd-breadcrumb-current">
                    {selectedSubjectId === "maternal-newborn"
                      ? "Maternal And Newborn Health"
                      : selectedSubjectId === "management-of-care"
                        ? "Management Of Care"
                        : subjectsList.find((s) => s.id === selectedSubjectId)?.name || "Adult Health"}
                  </span>
                </nav>
                <h1 className="sd-perf-title">
                  {subjectsList.find((s) => s.id === selectedSubjectId)?.name || "Adult Health"}
                </h1>

                {/* Content Experts Strip */}
                <div className="sd-subj-expert-strip">
                  <div className="sd-avatars-pair">
                    {(() => {
                      const curSub = subjectsList.find((s) => s.id === selectedSubjectId);
                      return (
                        <>
                          <div
                            className="sd-pair-avatar"
                            style={{
                              backgroundColor: curSub?.expert1.bg || "#0D9488"
                            }}
                            title={curSub?.expert1.name}
                          >
                            {curSub?.expert1.image ? (
                              <img
                                src={curSub.expert1.image}
                                alt={curSub.expert1.name}
                                className="sd-pair-avatar-img"
                              />
                            ) : (
                              curSub?.expert1.initials || "DE"
                            )}
                          </div>
                          <div
                            className="sd-pair-avatar sd-pair-avatar-overlap"
                            style={{
                              backgroundColor: curSub?.expert2.bg || "#F59E0B"
                            }}
                            title={curSub?.expert2.name}
                          >
                            {curSub?.expert2.image ? (
                              <img
                                src={curSub.expert2.image}
                                alt={curSub.expert2.name}
                                className="sd-pair-avatar-img"
                              />
                            ) : (
                              curSub?.expert2.initials || "DA"
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="sd-subj-expert-details">
                    <small className="sd-subj-expert-label">CONTENT EXPERTS</small>
                    <strong className="sd-subj-expert-names">
                      {subjectsList.find((s) => s.id === selectedSubjectId)?.experts || "Dr. Emily & Dr. Amber"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Sub-Navigation Tabs */}
            <div className="sd-subj-tabs-nav" role="tablist">
              {(selectedSubjectId === "fundamentals" || selectedSubjectId === "management-of-care"
                ? [
                  { id: "standalone", label: "Standalone Questions" },
                  { id: "crash-course", label: "Crash Course Videos" },
                  { id: "cheat-sheets", label: "Cheat Sheets" },
                  { id: "performance", label: "Performance" }
                ]
                : selectedSubjectId === "pharmacology" && subjectSubTab !== "case-studies"
                  ? [
                    { id: "standalone", label: "Standalone Questions" },
                    { id: "cheat-sheets", label: "Cheat Sheets" },
                    { id: "crash-course", label: "Crash Course Videos" },
                    { id: "performance", label: "Performance" }
                  ]
                  : [
                    { id: "case-studies", label: "Case Studies" },
                    { id: "standalone", label: "Standalone Questions" },
                    { id: "crash-course", label: "Crash Course Videos" },
                    { id: "cheat-sheets", label: "Cheat Sheets" },
                    { id: "performance", label: "Performance" }
                  ]
              ).map((tab) => {
                const isActive = subjectSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`sd-subj-tab-link ${isActive ? "sd-subj-tab-active" : ""}`}
                    onClick={() => setSubjectSubTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 3. Conditional Content Based on Sub-Navigation Tab */}
            {subjectSubTab === "standalone" ? (
              /* ================================================================
                 STANDALONE QUESTIONS VIEW (Exact Match to Reference Design)
                 ================================================================ */
              <>
                {/* Info Banner */}
                <div className="sd-subj-info-banner">
                  <span>
                    The standalone questions below are based on the real Next Gen NCLEX. Practice with these so you&apos;re ready for the real exam.
                  </span>
                </div>

                {/* Section: By Subject */}
                <section className="sd-section" aria-labelledby="by-subject-heading" style={{ marginTop: "4px" }}>
                  <h2 id="by-subject-heading" className="sd-subj-section-heading">
                    By Subject
                  </h2>
                  <div className="sd-standalone-subject-card">
                    <div className="sd-standalone-subject-left">
                      <div
                        className="sd-sub-icon-badge"
                        style={{
                          backgroundColor:
                            subjectsList.find((s) => s.id === selectedSubjectId)?.iconBg || "#FEE2E2",
                          color:
                            subjectsList.find((s) => s.id === selectedSubjectId)?.iconColor || "#EF4444",
                          width: "38px",
                          height: "38px"
                        }}
                      >
                        {(() => {
                          const IconComp =
                            subjectsList.find((s) => s.id === selectedSubjectId)?.icon || HeartPulse;
                          return <IconComp size={20} />;
                        })()}
                      </div>
                      <div className="sd-standalone-subject-info">
                        <strong className="sd-case-study-title">
                          {subjectsList.find((s) => s.id === selectedSubjectId)?.name || "Adult Health"}
                        </strong>
                        <div className="sd-case-study-progress-row" style={{ marginLeft: 0 }}>
                          <span className="sd-case-study-stat">
                            0 of{" "}
                            {(
                              standaloneSystemsBySubject[selectedSubjectId] ||
                              adultHealthStandaloneSystems
                            ).reduce((sum, s) => sum + s.questionsTotal, 0)}{" "}
                            questions used
                          </span>
                          <div className="sd-case-study-track">
                            <div className="sd-case-study-fill" style={{ width: "0%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sd-case-study-right">
                      <button
                        type="button"
                        className="sd-btn-upgrade-case"
                        onClick={() => setIsUpgradeModalOpen(true)}
                      >
                        <Shield size={13} />
                        <span>Upgrade</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* Section: By System */}
                <section className="sd-section" aria-labelledby="by-system-heading" style={{ marginTop: "12px" }}>
                  <h2 id="by-system-heading" className="sd-subj-section-heading">
                    By System
                  </h2>
                  <div className="sd-case-studies-stack" style={{ marginTop: "10px" }}>
                    {(
                      standaloneSystemsBySubject[selectedSubjectId] ||
                      adultHealthStandaloneSystems
                    ).map((sys) => (
                      <div key={sys.id} className="sd-case-study-card">
                        <div className="sd-case-study-left">
                          <div className="sd-case-study-title-row">
                            <span className="sd-case-study-num">{sys.id}</span>
                            <strong className="sd-case-study-title">
                              {sys.name}
                            </strong>
                          </div>
                          <div className="sd-case-study-progress-row">
                            <span className="sd-case-study-stat">
                              {sys.questionsUsed} of {sys.questionsTotal} questions used
                            </span>
                            <div className="sd-case-study-track">
                              <div
                                className="sd-case-study-fill"
                                style={{
                                  width:
                                    sys.questionsTotal > 0
                                      ? `${(sys.questionsUsed / sys.questionsTotal) * 100}%`
                                      : "0%"
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sd-case-study-right">
                          <button
                            type="button"
                            className="sd-btn-upgrade-case"
                            onClick={() => setIsUpgradeModalOpen(true)}
                          >
                            <Shield size={13} />
                            <span>Upgrade</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : subjectSubTab === "crash-course" ? (
              /* ================================================================
                 CRASH COURSE VIDEOS VIEW (Exact Match to Reference Design)
                 ================================================================ */
              <>
                {/* Filter search bar */}
                <div className="sd-crash-filter-bar">
                  <SlidersHorizontal size={15} className="sd-crash-filter-icon" />
                  <input
                    type="text"
                    className="sd-crash-filter-input"
                    placeholder="Start typing to filter the lessons"
                    value={crashFilterQuery}
                    onChange={(e) => setCrashFilterQuery(e.target.value)}
                  />
                  {crashFilterQuery && (
                    <button
                      type="button"
                      onClick={() => setCrashFilterQuery("")}
                      style={{
                        background: "none",
                        border: 0,
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "0 4px"
                      }}
                      aria-label="Clear lesson filter"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Main Card with Lessons Accordion */}
                <div className="sd-crash-card" style={{ marginTop: "12px" }}>
                  {/* Card Header */}
                  <div className="sd-crash-card-header">
                    <div className="sd-crash-header-top">
                      <div className="sd-crash-header-title-wrap">
                        <span className="sd-crash-header-num">1</span>
                        <strong className="sd-crash-header-title">
                          {subjectsList.find((s) => s.id === selectedSubjectId)?.name || "Adult Health"}
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="sd-btn-start-crash"
                        onClick={() => {
                          const firstTopic =
                            selectedSubjectId === "management-of-care"
                              ? filteredMocCrashLessons[0]?.title || "Lesson 1"
                              : filteredCrashTopics[0]?.title || "Lesson 1";
                          alert(`Starting ${firstTopic}! Playing video lecture...`);
                        }}
                      >
                        Start
                      </button>
                    </div>

                    <div className="sd-crash-stats-line">
                      0 of{" "}
                      {crashStatsConfig[selectedSubjectId]?.lessonsTotal ||
                        currentCrashTopics.length * 2}{" "}
                      lessons completed &bull;{" "}
                      {crashStatsConfig[selectedSubjectId]?.runtime || "4h 05m"} runtime
                    </div>

                    <div className="sd-crash-progress-track">
                      <div className="sd-crash-progress-fill" style={{ width: "0%" }} />
                    </div>
                  </div>

                  {/* Lessons List Rows */}
                  {!isCrashLessonsCollapsed && (
                    <div className="sd-crash-lessons-list">
                      {selectedSubjectId === "management-of-care" ? (
                        filteredMocCrashLessons.length === 0 ? (
                          <div style={{ padding: "30px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
                            No lessons match &ldquo;{crashFilterQuery}&rdquo;. Try another search term.
                          </div>
                        ) : (
                          filteredMocCrashLessons.map((lesson) => {
                            const isDone = !!completedCrashLessons[lesson.id];
                            return (
                              <div
                                key={lesson.id}
                                className="sd-crash-lesson-row"
                                onClick={() => {
                                  if (lesson.isUnlocked) {
                                    if (lesson.type === "video") {
                                      alert(`Playing Video Lecture: ${lesson.title} (${lesson.duration})`);
                                    } else {
                                      alert(`Starting Practice Quiz: ${lesson.title} (${lesson.questionsTotal} questions)`);
                                    }
                                  } else {
                                    setIsUpgradeModalOpen(true);
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="sd-crash-row-left">
                                  <button
                                    type="button"
                                    className={`sd-crash-check-circle ${isDone ? "sd-crash-check-circle-done" : ""
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCompletedCrashLessons((prev) => ({
                                        ...prev,
                                        [lesson.id]: !prev[lesson.id]
                                      }));
                                    }}
                                    aria-label={`Mark ${lesson.title} as completed`}
                                  >
                                    {isDone && <Check size={11} />}
                                  </button>
                                  {lesson.type === "bites" && (
                                    <FileText size={12} style={{ color: "#94a3b8", flexShrink: 0 }} />
                                  )}
                                  <span
                                    className={`sd-crash-badge ${lesson.type === "video" ? "sd-badge-video" : "sd-badge-quiz"
                                      }`}
                                  >
                                    {lesson.type === "video" ? "Video" : "Bites"}
                                  </span>
                                  <span className="sd-crash-lesson-title">{lesson.title}</span>
                                </div>

                                <div className="sd-crash-row-right">
                                  {lesson.type === "video" ? (
                                    <span className="sd-crash-stat-text">{lesson.duration}</span>
                                  ) : (
                                    <>
                                      <span className="sd-crash-stat-text">0 / {lesson.questionsTotal}</span>
                                      {!lesson.isUnlocked && (
                                        <div
                                          className="sd-crash-bites-track"
                                          style={{
                                            width: "36px",
                                            height: "4px",
                                            backgroundColor: "#e2e8f0",
                                            borderRadius: "2px",
                                            margin: "0 6px"
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: "0%",
                                              height: "100%",
                                              backgroundColor: "#3b82f6",
                                              borderRadius: "2px"
                                            }}
                                          />
                                        </div>
                                      )}
                                    </>
                                  )}
                                  <div className="sd-crash-action-icon">
                                    {lesson.isUnlocked ? (
                                      <ChevronRight size={15} className="sd-crash-chevron" />
                                    ) : (
                                      <Shield size={13} className="sd-crash-lock" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )
                      ) : filteredCrashTopics.length === 0 ? (
                        <div style={{ padding: "30px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
                          No lessons match &ldquo;{crashFilterQuery}&rdquo;. Try another search term.
                        </div>
                      ) : (
                        filteredCrashTopics.map((topic) => {
                          const isVideoDone = !!completedCrashLessons[`video-${topic.id}`];
                          const isQuizDone = !!completedCrashLessons[`quiz-${topic.id}`];

                          return (
                            <div key={topic.id} style={{ display: "contents" }}>
                              {/* Row 1: Video Lesson */}
                              <div
                                className="sd-crash-lesson-row"
                                onClick={() => {
                                  if (topic.isUnlocked) {
                                    alert(`Playing Video Lecture: ${topic.title} (${topic.videoDuration})`);
                                  } else {
                                    setIsUpgradeModalOpen(true);
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="sd-crash-row-left">
                                  <button
                                    type="button"
                                    className={`sd-crash-check-circle ${isVideoDone ? "sd-crash-check-circle-done" : ""
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCompletedCrashLessons((prev) => ({
                                        ...prev,
                                        [`video-${topic.id}`]: !prev[`video-${topic.id}`]
                                      }));
                                    }}
                                    aria-label={`Mark video ${topic.title} as completed`}
                                  >
                                    {isVideoDone && <Check size={11} />}
                                  </button>
                                  <span className="sd-crash-badge sd-badge-video">Video</span>
                                  <span className="sd-crash-lesson-title">{topic.title}</span>
                                </div>

                                <div className="sd-crash-row-right">
                                  <span className="sd-crash-stat-text">{topic.videoDuration}</span>
                                  <div className="sd-crash-action-icon">
                                    {topic.isUnlocked ? (
                                      <ChevronRight size={15} className="sd-crash-chevron" />
                                    ) : (
                                      <Shield size={13} className="sd-crash-lock" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Row 2: Practice Quiz / Bites */}
                              <div
                                className="sd-crash-lesson-row"
                                onClick={() => {
                                  if (topic.isUnlocked) {
                                    alert(
                                      `Starting Practice Quiz: ${topic.title} (${topic.questionsTotal} questions)`
                                    );
                                  } else {
                                    setIsUpgradeModalOpen(true);
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="sd-crash-row-left">
                                  <button
                                    type="button"
                                    className={`sd-crash-check-circle ${isQuizDone ? "sd-crash-check-circle-done" : ""
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCompletedCrashLessons((prev) => ({
                                        ...prev,
                                        [`quiz-${topic.id}`]: !prev[`quiz-${topic.id}`]
                                      }));
                                    }}
                                    aria-label={`Mark quiz ${topic.title} as completed`}
                                  >
                                    {isQuizDone && <Check size={11} />}
                                  </button>
                                  <FileText size={12} style={{ color: "#94a3b8", flexShrink: 0 }} />
                                  <span className="sd-crash-badge sd-badge-quiz">Bites</span>
                                  <span className="sd-crash-lesson-title">{topic.title}</span>
                                </div>

                                <div className="sd-crash-row-right">
                                  <span className="sd-crash-stat-text">0 / {topic.questionsTotal}</span>
                                  <div className="sd-crash-action-icon">
                                    {topic.isUnlocked ? (
                                      <ChevronRight size={15} className="sd-crash-chevron" />
                                    ) : (
                                      <Shield size={13} className="sd-crash-lock" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Collapsible toggle footer matching reference */}
                  <button
                    type="button"
                    className="sd-crash-toggle-footer"
                    onClick={() => setIsCrashLessonsCollapsed(!isCrashLessonsCollapsed)}
                  >
                    {isCrashLessonsCollapsed ? (
                      <>
                        <ChevronDown size={16} />
                        <span>Show lessons</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp size={16} />
                        <span>Hide lessons</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : subjectSubTab === "cheat-sheets" ? (
              /* ================================================================
                 CHEAT SHEETS VIEW (Exact Match to Reference Design)
                 ================================================================ */
              <>
                {/* 1. Info Banner */}
                <div className="sd-subj-info-banner">
                  <span>
                    Everything you need to pass the NCLEX®, and nothing you don&apos;t. NCLEXLab&apos;s Cheat Sheets condense everything you need to know about a topic into a single, digestible resource.
                  </span>
                </div>

                {/* 2. Filter Search Bar */}
                <div className="sd-crash-filter-bar" style={{ marginTop: "12px" }}>
                  <Search size={15} className="sd-crash-filter-icon" />
                  <input
                    type="text"
                    className="sd-crash-filter-input"
                    placeholder="Filter cheat sheets"
                    value={cheatFilterQuery}
                    onChange={(e) => setCheatFilterQuery(e.target.value)}
                  />
                  {cheatFilterQuery && (
                    <button
                      type="button"
                      onClick={() => setCheatFilterQuery("")}
                      style={{
                        background: "none",
                        border: 0,
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "0 4px"
                      }}
                      aria-label="Clear cheat sheet filter"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* 3. Category Filter Tags */}
                <div className="sd-cheat-tags-wrap">
                  {currentCheatCategories.map((cat) => {
                    const isSelected = effectiveCheatSystem === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`sd-cheat-tag-btn ${isSelected ? "sd-cheat-tag-btn-active" : ""}`}
                        onClick={() => setSelectedCheatSystem(cat)}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* 4. Cheat Sheets Cards Stack */}
                <div className="sd-cheat-cards-stack">
                  {filteredCheatSheets.length === 0 ? (
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        padding: "32px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "14px"
                      }}
                    >
                      No cheat sheets found matching &ldquo;{cheatFilterQuery}&rdquo;.
                    </div>
                  ) : (
                    filteredCheatSheets.map((item) => (
                      <div key={item.id} className="sd-cheat-card">
                        <div className="sd-cheat-left">
                          <div
                            className="sd-cheat-icon-badge"
                            style={{
                              backgroundColor:
                                selectedSubjectId === "management-of-care"
                                  ? "#FEE2E2"
                                  : selectedSubjectId === "pharmacology"
                                    ? "#FCE7F3"
                                    : selectedSubjectId === "mental-health"
                                      ? "#FEF3C7"
                                      : selectedSubjectId === "maternal-newborn"
                                        ? "#E0F2FE"
                                        : selectedSubjectId === "fundamentals"
                                          ? "#FFE4E6"
                                          : selectedSubjectId === "child-health"
                                            ? "#FCE7F3"
                                            : "#FEE2E2",
                              color:
                                selectedSubjectId === "management-of-care"
                                  ? "#DC2626"
                                  : selectedSubjectId === "pharmacology"
                                    ? "#DB2777"
                                    : selectedSubjectId === "mental-health"
                                      ? "#D97706"
                                      : selectedSubjectId === "maternal-newborn"
                                        ? "#0284C7"
                                        : selectedSubjectId === "fundamentals"
                                          ? "#F43F5E"
                                          : selectedSubjectId === "child-health"
                                            ? "#EC4899"
                                            : "#EF4444"
                            }}
                          >
                            {selectedSubjectId === "management-of-care" ? (
                              <Plus size={16} />
                            ) : selectedSubjectId === "pharmacology" ? (
                              <Pill size={16} />
                            ) : selectedSubjectId === "mental-health" ? (
                              <Brain size={16} />
                            ) : selectedSubjectId === "maternal-newborn" ? (
                              <Milk size={16} />
                            ) : selectedSubjectId === "fundamentals" ? (
                              <BicepsFlexed size={16} />
                            ) : selectedSubjectId === "child-health" ? (
                              <Baby size={16} />
                            ) : (
                              <FileText size={16} />
                            )}
                          </div>
                          <div className="sd-cheat-titles">
                            <strong className="sd-cheat-title">{item.title}</strong>
                            <span className="sd-cheat-sub">{item.subtitle}</span>
                          </div>
                        </div>

                        <div className="sd-case-study-right">
                          {item.isUnlocked ? (
                            <button
                              type="button"
                              className="sd-btn-download-cheat"
                              onClick={() => {
                                alert(`Downloading high-yield NCLEX Cheat Sheet: ${item.title} (PDF)...`);
                              }}
                            >
                              Download
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="sd-btn-upgrade-case"
                              onClick={() => setIsUpgradeModalOpen(true)}
                            >
                              <Shield size={13} />
                              <span>Upgrade</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : subjectSubTab === "performance" ? (
              /* ================================================================
                 ADULT HEALTH PERFORMANCE VIEW (Exact Match to Reference Design)
                 ================================================================ */
              <>
                {/* 1. Info Banner */}
                <div className="sd-subj-info-banner">
                  <span>
                    Performance tracks every question attempt for case studies, standalone questions, and readiness exams.
                  </span>
                </div>

                {/* 2. Subject Performance Section */}
                <section className="sd-section" aria-labelledby="subj-perf-heading" style={{ marginTop: "4px" }}>
                  <div className="sd-perf-section-header">
                    <div>
                      <h2 id="subj-perf-heading" className="sd-section-title">
                        Subject Performance
                      </h2>
                      <p className="sd-perf-subtitle">
                        Topics marked with a red <span style={{ color: "#ef4444", fontWeight: 700 }}>&#9888;</span> should receive additional attention.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="sd-btn-expand-all"
                      onClick={() => {
                        setExpandedPerfSubjects((prev) => ({
                          ...prev,
                          [selectedSubjectId]: prev[selectedSubjectId] === false ? true : false
                        }));
                      }}
                    >
                      {expandedPerfSubjects[selectedSubjectId] !== false ? "— Collapse All" : "+ Expand All"}
                    </button>
                  </div>

                  <div className="sd-perf-table-wrap" style={{ marginTop: "12px" }}>
                    <div className="sd-perf-table-header">
                      <span className="sd-th-subject">Subject</span>
                      <span className="sd-th-score">Score</span>
                      <span className="sd-th-avg">Avg. Score</span>
                      <span className="sd-th-used">Questions Used</span>
                      <span className="sd-th-action" aria-label="Action" />
                    </div>

                    {(() => {
                      const subj =
                        performanceSubjects.find((s) => s.id === selectedSubjectId) ??
                        performanceSubjects.find((s) => s.id === "adult-health") ??
                        performanceSubjects[0];
                      if (!subj) return null;
                      const isExpanded = expandedPerfSubjects[subj.id] !== false;
                      const Icon = subj.icon;

                      return (
                        <div key={subj.id} className="sd-perf-subject-block">
                          <div
                            className="sd-perf-row"
                            onClick={() => togglePerfSubject(subj.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="sd-td-subject">
                              <button
                                type="button"
                                className="sd-row-expand-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePerfSubject(subj.id);
                                }}
                                aria-label={isExpanded ? `Collapse ${subj.name}` : `Expand ${subj.name}`}
                                style={{ marginRight: "6px" }}
                              >
                                {isExpanded ? <Minus size={13} /> : <Plus size={13} />}
                              </button>
                              <Icon
                                size={16}
                                style={{ color: subj.iconColor }}
                                className="sd-perf-sub-icon"
                              />
                              <strong className="sd-perf-sub-name">{subj.name}</strong>
                            </div>

                            <div className="sd-td-score">
                              <span className="sd-perf-metric-val">{subj.score}%</span>
                              <div className="sd-perf-bar-track">
                                <div className="sd-perf-bar-fill" style={{ width: `${subj.score}%` }} />
                              </div>
                            </div>

                            <div className="sd-td-avg">
                              <span className="sd-perf-val-muted">{subj.avgScore}</span>
                            </div>

                            <div className="sd-td-used">
                              <span className="sd-perf-metric-val">
                                {subj.used} / {subj.total}
                              </span>
                              <div className="sd-perf-bar-track">
                                <div
                                  className="sd-perf-bar-fill"
                                  style={{
                                    width: subj.total > 0 ? `${(subj.used / subj.total) * 100}%` : "0%"
                                  }}
                                />
                              </div>
                            </div>

                            <div className="sd-td-action">
                              <button
                                type="button"
                                className="sd-perf-circle-action"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCreateTestOpen(true);
                                }}
                                title={`Start ${subj.name} test`}
                                aria-label={`Start ${subj.name} test`}
                              >
                                <Bookmark size={13} />
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="sd-perf-systems-list">
                              {subj.systems.map((sys) => (
                                <div key={sys.name} className="sd-perf-sub-row">
                                  <div className="sd-td-subject sd-td-sub-indent">
                                    <span>{sys.name}</span>
                                    <span
                                      className="sd-warning-flag"
                                      title="Should receive additional attention"
                                    >
                                      &#9888;
                                    </span>
                                  </div>

                                  <div className="sd-td-score">
                                    <span className="sd-perf-metric-val">{sys.score}%</span>
                                    <div className="sd-perf-bar-track">
                                      <div
                                        className="sd-perf-bar-fill"
                                        style={{ width: `${sys.score}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div className="sd-td-avg">
                                    <span className="sd-perf-val-muted">{sys.avgScore}</span>
                                  </div>

                                  <div className="sd-td-used">
                                    <span className="sd-perf-metric-val">
                                      {sys.used} / {sys.total}
                                    </span>
                                    <div className="sd-perf-bar-track">
                                      <div
                                        className="sd-perf-bar-fill"
                                        style={{
                                          width: sys.total > 0 ? `${(sys.used / sys.total) * 100}%` : "0%"
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="sd-td-action">
                                    <button
                                      type="button"
                                      className="sd-perf-circle-action sd-perf-action-sm"
                                      onClick={() => setIsCreateTestOpen(true)}
                                      title={`Create test for ${sys.name}`}
                                      aria-label={`Practice ${sys.name}`}
                                    >
                                      <Bookmark size={11} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </section>

                {/* 3. Time Management Section */}
                <section className="sd-section" aria-labelledby="subj-perf-time-heading" style={{ marginTop: "14px" }}>
                  <div className="sd-perf-section-header">
                    <div>
                      <h2 id="subj-perf-time-heading" className="sd-section-title">
                        Time Management
                      </h2>
                      <p className="sd-perf-subtitle">
                        Green means you&apos;re faster than average! Red shows where you can improve your pace.
                      </p>
                    </div>
                  </div>

                  <div className="sd-perf-table-wrap" style={{ marginTop: "12px" }}>
                    <div className="sd-perf-time-header">
                      <span>Subject</span>
                      <span>Time Per Question</span>
                      <span>Avg. Time</span>
                    </div>
                    {(() => {
                      const curSubj =
                        performanceSubjects.find((s) => s.id === selectedSubjectId) ??
                        performanceSubjects.find((s) => s.id === "adult-health") ??
                        performanceSubjects[0];
                      const IconComp = curSubj?.icon || HeartPulse;
                      return (
                        <div className="sd-perf-time-row">
                          <div className="sd-time-td-subject">
                            <IconComp
                              size={16}
                              style={{ color: curSubj?.iconColor || "#ef4444" }}
                              className="sd-perf-sub-icon"
                            />
                            <strong className="sd-perf-sub-name">{curSubj?.name || "Adult Health"}</strong>
                          </div>
                          <div className="sd-time-dash">{curSubj?.time || "—"}</div>
                          <div className="sd-time-td-avg">{curSubj?.avgTime || "1m 10s"}</div>
                        </div>
                      );
                    })()}
                  </div>
                </section>

                {/* 4. FAQs Section */}
                <section className="sd-section" aria-labelledby="subj-perf-faqs-heading" style={{ marginTop: "14px" }}>
                  <h2 id="subj-perf-faqs-heading" className="sd-section-title">
                    FAQs
                  </h2>
                  <div className="sd-faqs-list">
                    {performanceFaqs.map((faq, index) => {
                      const isOpen = openPerfFaqIndex === index;
                      return (
                        <div key={index} className="sd-faq-item">
                          <button
                            type="button"
                            className="sd-faq-question-btn"
                            onClick={() => setOpenPerfFaqIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                          >
                            <span>{faq.question}</span>
                            <span className="sd-faq-toggle-icon">
                              {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="sd-faq-answer">
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            ) : (
              /* ================================================================
                 CASE STUDIES VIEW (Default)
                 ================================================================ */
              <>
                {/* 3. Info Banner */}
                <div className="sd-subj-info-banner">
                  <span>
                    The case studies below are based on the real Next Gen NCLEX. Practice with these so you&apos;re ready for the real exam.
                  </span>
                </div>

                {/* 4. Case Studies Cards Stack */}
                <section className="sd-case-studies-stack" aria-label="Case Studies List">
                  {(() => {
                    const cfg = subjectCaseStudiesConfig[selectedSubjectId] || { total: 9, unlocked: 2 };
                    const currentName =
                      subjectsList.find((s) => s.id === selectedSubjectId)?.name || "Adult Health";
                    return Array.from({ length: cfg.total }, (_, i) => {
                      const num = i + 1;
                      const isUnlocked = num <= cfg.unlocked;
                      return (
                        <div key={num} className="sd-case-study-card">
                          <div className="sd-case-study-left">
                            <div className="sd-case-study-title-row">
                              <span className="sd-case-study-num">{num}</span>
                              <strong className="sd-case-study-title">
                                Case Study: {currentName} #{num}
                              </strong>
                            </div>
                            <div className="sd-case-study-progress-row">
                              <span className="sd-case-study-stat">0 of 6 questions used</span>
                              <div className="sd-case-study-track">
                                <div className="sd-case-study-fill" style={{ width: "0%" }} />
                              </div>
                            </div>
                          </div>

                          <div className="sd-case-study-right">
                            {isUnlocked ? (
                              <button
                                type="button"
                                className="sd-btn-start-case"
                                onClick={() => {
                                  alert(
                                    `Starting Case Study: ${currentName} #${num}! 6 Next Gen questions with detailed rationales.`
                                  );
                                }}
                              >
                                Start
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="sd-btn-upgrade-case"
                                onClick={() => setIsUpgradeModalOpen(true)}
                              >
                                <Shield size={13} />
                                <span>Upgrade</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </section>
              </>
            )}
          </div>
        ) : (
          /* ================================================================
             HOME TAB VIEW
             ================================================================ */
          <div className="sd-content">
            {/* User Greeting */}
            <div className="sd-greeting-row">
              <div className="sd-greeting-avatar">R</div>
              <h1 className="sd-greeting-title">Good afternoon!</h1>
            </div>

            {/* 6 Quick Action Cards (3x2 Grid) */}
            <section className="sd-action-grid" aria-label="Quick study actions">
              {/* Card 1: Create Test */}
              <button
                type="button"
                className="sd-action-card"
                onClick={() => setIsCreateTestOpen(true)}
              >
                <div className="sd-action-left">
                  <div className="sd-action-icon sd-icon-purple">
                    <FilePlus2 size={18} />
                  </div>
                  <div className="sd-action-text">
                    <strong>Create Test</strong>
                    <span>Study up to 85 questions at a time</span>
                  </div>
                </div>
                <ChevronRight size={17} className="sd-action-chevron" />
              </button>

              {/* Card 2: Daily Warmup */}
              <button
                type="button"
                className="sd-action-card"
                onClick={() => setIsUpgradeModalOpen(true)}
              >
                <div className="sd-action-left">
                  <div className="sd-action-icon sd-icon-shield">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="sd-action-text">
                    <strong>Daily Warmup</strong>
                    <span className="sd-sub-unlock">Upgrade to unlock</span>
                  </div>
                </div>
                <ChevronRight size={17} className="sd-action-chevron" />
              </button>

              {/* Card 3: Performance */}
              <button
                type="button"
                className="sd-action-card"
                onClick={() => setActiveTab("performance")}
              >
                <div className="sd-action-left">
                  <div className="sd-action-icon sd-icon-chart">
                    <BarChart3 size={18} />
                  </div>
                  <div className="sd-action-text">
                    <strong>Performance</strong>
                    <span>See if you&apos;re ready to pass</span>
                  </div>
                </div>
                <ChevronRight size={17} className="sd-action-chevron" />
              </button>

              {/* Card 4: CAT Readiness Exams */}
              <button
                type="button"
                className="sd-action-card"
                onClick={() => setActiveTab("cat-exams")}
              >
                <div className="sd-action-left">
                  <div className="sd-action-icon sd-icon-target">
                    <Target size={18} />
                  </div>
                  <div className="sd-action-text">
                    <strong>CAT Readiness Exams</strong>
                    <span>Gauge exam readiness</span>
                  </div>
                </div>
                <ChevronRight size={17} className="sd-action-chevron" />
              </button>

              {/* Card 5: Previous Tests */}
              <button
                type="button"
                className="sd-action-card"
                onClick={() => setActiveTab("previous-tests")}
              >
                <div className="sd-action-left">
                  <div className="sd-action-icon sd-icon-history">
                    <History size={18} />
                  </div>
                  <div className="sd-action-text">
                    <strong>Previous Tests</strong>
                    <span>Review past test attempts</span>
                  </div>
                </div>
                <ChevronRight size={17} className="sd-action-chevron" />
              </button>

              {/* Card 6: Study Group */}
              <a
                href="https://www.facebook.com/Yoursellhub"
                target="_blank"
                rel="noreferrer"
                className="sd-action-card"
                title="Join our NCLEX Facebook Study Group"
              >
                <div className="sd-action-left">
                  <div className="sd-action-icon sd-icon-group">
                    <UsersRound size={18} />
                  </div>
                  <div className="sd-action-text">
                    <strong>Study Group</strong>
                    <span>Join 250k+ fellow students</span>
                  </div>
                </div>
                <ChevronRight size={17} className="sd-action-chevron" />
              </a>
            </section>

            {/* Section: Your Study Schedule */}
            <section className="sd-section" aria-labelledby="schedule-heading">
              <h2 id="schedule-heading" className="sd-section-title">
                Your Study Schedule
              </h2>

              {!isStudyScheduleLoaded ? (
                <div className="sd-cal-widget-card sd-cal-loading" role="status">Loading your personalized schedule…</div>
              ) : scheduleLoadError && !scheduleLoadError.toLowerCase().includes("mongodb") && !scheduleLoadError.toLowerCase().includes("database is unavailable") ? (
                <div className="sd-cal-widget-card sd-cal-error" role="alert">
                  <p>{scheduleLoadError}</p>
                  <button type="button" className="sd-cal-select-btn" onClick={() => {
                    setIsStudyScheduleLoaded(false);
                    void loadStudentStudySchedule().then((schedule) => { setStudySchedule(schedule); setScheduleLoadError(null); }).catch(() => {
                      const fallback = createDefaultStudySchedule();
                      setStudySchedule(fallback);
                      setScheduleLoadError(null);
                    }).finally(() => setIsStudyScheduleLoaded(true));
                  }}>Retry</button>
                </div>
              ) : studySchedule && scheduleSummary ? (
                <div className="sd-cal-widget-card">
                  <div className="sd-cal-header-row">
                    <div className="sd-cal-title-col">
                      <h3 className="sd-cal-month-title">{scheduleMonthLabel}</h3>
                      <div className="sd-cal-progress-track" role="progressbar" aria-label="Study schedule progress" aria-valuemin={0} aria-valuemax={scheduleSummary.total} aria-valuenow={scheduleSummary.completed}>
                        <span style={{ width: (scheduleSummary.total > 0 ? scheduleSummary.completed / scheduleSummary.total * 100 : 0) + "%" }} />
                      </div>
                      <span className="sd-cal-completed-sub">
                        {scheduleSummary.completed} of {scheduleSummary.total} assignments completed
                      </span>
                    </div>

                    <div className="sd-cal-controls-col">
                      <div className="sd-cal-btn-group">
                        <div className="sd-cal-nav-pills">
                          <button type="button" className="sd-cal-nav-btn" onClick={() => moveScheduleCursor(-1)} aria-label="Previous schedule period">
                            <ChevronLeft size={14} />
                          </button>
                          <button type="button" className="sd-cal-nav-btn" onClick={() => setScheduleCursorDate(toDateKey())}>
                            Today
                          </button>
                          <button type="button" className="sd-cal-nav-btn" onClick={() => moveScheduleCursor(1)} aria-label="Next schedule period">
                            <ChevronRight size={14} />
                          </button>
                        </div>

                        <select
                          className="sd-cal-select-btn sd-cal-view-select"
                          aria-label="Schedule view"
                          value={scheduleView}
                          onChange={(event) => setScheduleView(event.target.value as StudyScheduleView)}
                        >
                          <option value="month">Month</option>
                          <option value="week">Week</option>
                          <option value="day">Day</option>
                        </select>

                        <select className="sd-cal-select-btn" aria-label="Filter schedule assignments" value={scheduleFilter} onChange={(event) => setScheduleFilter(event.target.value as "all" | "questions" | "resources")}>
                          <option value="all">Full Schedule</option>
                          <option value="questions">Question Assignments</option>
                          <option value="resources">Videos &amp; Resources</option>
                        </select>

                        <button type="button" className="sd-cal-select-btn" onClick={() => openScheduleDialog("rebalance")} title="Rebalance incomplete assignments">
                          <RotateCcw size={12} />
                          <span>Rebalance</span>
                        </button>

                        <button type="button" className="sd-cal-select-btn sd-cal-settings-button" onClick={() => openScheduleDialog("settings")} aria-label="Schedule settings" title="Schedule settings">
                          <Settings size={13} />
                        </button>
                      </div>

                      <span className="sd-cal-countdown-text">
                        {scheduleCountdown === null
                          ? "Self-paced schedule"
                          : scheduleCountdown + " days until exam · " + formatDisplayDate(studySchedule.examDate ?? "")}
                      </span>
                    </div>
                  </div>

                  <div className="sd-cal-week-wrapper">
                    {scheduleView === "week" && (
                      <div className="sd-cal-week-track">
                        Week {getScheduleWeekNumber(studySchedule.startDate, scheduleCursorDate)} of {Math.max(1, getScheduleWeekNumber(studySchedule.startDate, scheduleEndDate))}
                      </div>
                    )}

                    <div className={"sd-cal-grid " + (scheduleView === "day" ? "sd-cal-day-grid" : "") + (scheduleView === "month" ? " sd-cal-month-grid" : "")}>
                      {visibleScheduleDates.map((dateKey) => {
                        const tasks = tasksOnScheduleDate(dateKey);
                        const dailyMinutes = scheduleMinutesOnDate(dateKey);
                        const outsidePlan = !isWithinSchedule(dateKey);
                        const dayOff = isScheduleDayOff(dateKey) && tasks.length === 0;
                        const isToday = dateKey === toDateKey();
                        return (
                          <div
                            key={dateKey}
                            className={[
                              "sd-cal-day-col",
                              outsidePlan ? "sd-cal-day-outside" : "",
                              isToday ? "sd-cal-day-today" : "",
                              dayOff ? "sd-cal-day-rest" : ""
                            ].filter(Boolean).join(" ")}
                          >
                            <div className="sd-cal-day-header">
                              <span>{formatScheduleDay(dateKey)}</span>
                              {isToday && <span className="sd-cal-today-badge">Today</span>}
                              <span className="sd-cal-day-hours">
                                {dailyMinutes > 0 ? formatScheduleDuration(dailyMinutes) : dayOff ? "Day off" : ""}
                              </span>
                            </div>

                            {dayOff ? (
                              <div className="sd-cal-off-body">
                                <Sun size={18} aria-hidden="true" />
                                <span>Day Off</span>
                              </div>
                            ) : (
                              <div className="sd-cal-day-body">
                                {tasks.map((task) => (
                                  <article key={task.id} className={[
                                    "sd-cal-task-card",
                                    `sd-cal-task-${task.action}`,
                                    task.category === "teal" ? "task-teal" : "",
                                    task.category === "green" ? "task-green" : "",
                                    task.completed ? "sd-cal-task-done" : "",
                                    !task.completed && task.date < toDateKey() ? "sd-cal-task-overdue" : ""
                                  ].filter(Boolean).join(" ")}>
                                    <div className="sd-cal-task-header">
                                      <input
                                        type="checkbox"
                                        className="sd-cal-task-checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleScheduleTask(task.id)}
                                        aria-label={(task.completed ? "Mark incomplete: " : "Complete: ") + task.title}
                                      />
                                      <button
                                        type="button"
                                        className="sd-cal-task-open"
                                        onClick={() => setSelectedScheduleTask(task)}
                                        title={`Open assignment: ${task.title}`}
                                      >
                                        <span className="sd-cal-task-type">{task.action.replaceAll("-", " ")}</span>{task.title}
                                      </button>
                                      <button type="button" className="sd-cal-task-remove" onClick={() => removeScheduleTask(task.id)} aria-label={"Remove " + task.title} title="Remove assignment">
                                        <X size={12} />
                                      </button>
                                    </div>
                                    <div className="sd-cal-task-meta">
                                      <span>{formatScheduleDuration(task.durationMinutes)}</span>
                                      <button
                                        type="button"
                                        className="sd-cal-task-quick-start"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openScheduleTask(task);
                                        }}
                                        title="Open and start this assignment question directly"
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#4f46e5",
                                          cursor: "pointer",
                                          fontSize: "11px",
                                          fontWeight: 700,
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "3px",
                                          padding: "2px 6px",
                                          borderRadius: "4px"
                                        }}
                                      >
                                        <Play size={10} fill="currentColor" /> Start
                                      </button>
                                    </div>
                                  </article>
                                ))}
                                {tasks.length === 0 && !outsidePlan && <span className="sd-cal-empty-day">No assignments scheduled</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sd-cal-footer">
                    <span className="sd-cal-footer-summary">
                      {scheduleSummary.averageHoursPerDay > 0
                        ? "About " + scheduleSummary.averageHoursPerDay + " study hours per day"
                        : "All assignments are complete"}
                    </span>
                    <button type="button" className="sd-cal-view-all-link" onClick={() => { setScheduleFilter("all"); setScheduleView("month"); }}>
                      View full schedule
                    </button>
                  </div>

                  {scheduleToastMessage && (
                    <div className="sd-schedule-toast" role="status">
                      <span>{scheduleToastMessage}</span>
                      {scheduleUndoSnapshot && <button type="button" onClick={undoScheduleChange}>Undo</button>}
                      <button type="button" className="sd-schedule-toast-close" onClick={() => { setScheduleToastMessage(null); setScheduleUndoSnapshot(null); }} aria-label="Dismiss schedule message">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="sd-schedule-card">
                  <div className="sd-schedule-graphic">
                    <div className="sd-cal-art">
                      <CalendarDays size={42} className="sd-cal-icon" />
                      <Clock size={18} className="sd-cal-badge-clock" />
                      <Check size={14} className="sd-cal-badge-check" />
                    </div>
                  </div>
                  <h3 className="sd-schedule-headline">Create Your Personalized NCLEX® Study Schedule</h3>
                  <p>Set your exam date, choose a weekly day off, and we’ll spread your assignments across the remaining study days.</p>
                  <button type="button" className="sd-btn-schedule" onClick={() => openScheduleDialog("create")}>
                    <Calendar size={17} />
                    <span>Create Study Schedule</span>
                  </button>
                </div>
              )}
            </section>

            {/* Section: Study by Subject */}
            <section className="sd-section" aria-labelledby="subjects-heading">
              <h2 id="subjects-heading" className="sd-section-title">
                Study by Subject
              </h2>
              <div className="sd-subjects-list">
                {filteredSubjects.map((sub) => {
                  const IconComponent = sub.icon;
                  return (
                    <div
                      key={sub.id}
                      className="sd-subject-row"
                      onClick={() => {
                        setSelectedSubjectId(sub.id);
                        setSubjectSubTab(
                          sub.id === "fundamentals" || sub.id === "management-of-care"
                            ? "standalone"
                            : "case-studies"
                        );
                        setActiveTab("subject");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Left: Icon & Subject Title */}
                      <div className="sd-sub-info">
                        <div
                          className="sd-sub-icon-badge"
                          style={{ backgroundColor: sub.iconBg, color: sub.iconColor }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div className="sd-sub-titles">
                          <strong className="sd-sub-name">{sub.name}</strong>
                          <span className="sd-sub-stat">
                            {sub.questionsUsed} of {sub.questionsTotal} questions used
                          </span>
                        </div>
                      </div>

                      {/* Center: Progress Bar & Lessons */}
                      <div className="sd-sub-progress-col">
                        <div className="sd-prog-bar">
                          <div
                            className="sd-prog-fill"
                            style={{
                              width: `${(sub.questionsUsed / sub.questionsTotal) * 100}%`
                            }}
                          />
                        </div>
                        <span className="sd-prog-stat">
                          {sub.lessonsCompleted} of {sub.lessonsTotal} lessons completed
                        </span>
                      </div>

                      {/* Right: Content Experts & Chevron */}
                      <div className="sd-sub-experts-col">
                        <div className="sd-avatars-pair">
                          <span
                            className="sd-pair-avatar"
                            style={{ backgroundColor: sub.expert1.bg }}
                            title={sub.expert1.name}
                          >
                            {sub.expert1.image ? (
                              <img
                                src={sub.expert1.image}
                                alt={sub.expert1.name}
                                className="sd-pair-avatar-img"
                              />
                            ) : (
                              sub.expert1.initials
                            )}
                          </span>
                          <span
                            className="sd-pair-avatar sd-pair-avatar-overlap"
                            style={{ backgroundColor: sub.expert2.bg }}
                            title={sub.expert2.name}
                          >
                            {sub.expert2.image ? (
                              <img
                                src={sub.expert2.image}
                                alt={sub.expert2.name}
                                className="sd-pair-avatar-img"
                              />
                            ) : (
                              sub.expert2.initials
                            )}
                          </span>
                        </div>
                        <div className="sd-experts-text">
                          <small>CONTENT EXPERTS</small>
                          <strong>{sub.experts}</strong>
                        </div>
                        <ChevronRight size={17} className="sd-sub-chevron" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section: Study by Question Type */}
            <section className="sd-section" aria-labelledby="qtypes-heading">
              <h2 id="qtypes-heading" className="sd-section-title">
                Study by Question Type
              </h2>
              <div className="sd-card-stack">
                {questionTypes.map((q) => {
                  const Icon = q.icon;
                  return (
                    <div
                      key={q.name}
                      className="sd-stack-row"
                      onClick={() => {
                        if (q.name.includes("Case Studies")) {
                          setActiveTab("case-studies");
                        } else if (q.name.includes("CAT")) {
                          setActiveTab("cat-exams");
                        } else {
                          setActiveTab("standalone");
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="sd-stack-left">
                        <div
                          className="sd-sub-icon-badge"
                          style={{ backgroundColor: q.iconBg, color: q.iconColor }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="sd-sub-titles">
                          <strong className="sd-sub-name">{q.name}</strong>
                          <span className="sd-sub-stat">{q.subtitle}</span>
                        </div>
                      </div>

                      <div className="sd-stack-right">
                        <div className="sd-prog-bar sd-prog-bar-wide">
                          <div className="sd-prog-fill" style={{ width: "0%" }} />
                        </div>
                        <ChevronRight size={17} className="sd-stack-chevron" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section: Resources */}
            <section className="sd-section" aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="sd-section-title">
                Resources
              </h2>
              <div className="sd-card-stack">
                {resourceItems.map((res) => {
                  const Icon = res.icon;
                  return (
                    <div
                      key={res.name}
                      className="sd-stack-row"
                      onClick={() => {
                        if (res.name.includes("Crash Course")) {
                          setActiveTab("crash-course");
                        } else if (res.name.includes("Cheat Sheets")) {
                          setActiveTab("cheat-sheets");
                        } else if (res.name.includes("Strategy Course")) {
                          setActiveTab("strategy-course");
                        } else {
                          setIsUpgradeModalOpen(true);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="sd-stack-left">
                        <div
                          className="sd-sub-icon-badge"
                          style={{ backgroundColor: res.iconBg, color: res.iconColor }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="sd-sub-titles">
                          <strong className="sd-sub-name">{res.name}</strong>
                          <span className="sd-sub-stat">{res.subtitle}</span>
                        </div>
                      </div>

                      <div className="sd-stack-right">
                        {res.hasProgress && (
                          <div className="sd-prog-bar sd-prog-bar-wide">
                            <div className="sd-prog-fill" style={{ width: "0%" }} />
                          </div>
                        )}
                        <ChevronRight size={17} className="sd-stack-chevron" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section: FAQs */}
            <section className="sd-section sd-faqs-section" aria-labelledby="faqs-heading">
              <h2 id="faqs-heading" className="sd-section-title">
                FAQs
              </h2>
              <div className="sd-faqs-list">
                {faqsList.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={faq.question} className="sd-faq-item">
                      <button
                        type="button"
                        className="sd-faq-question-btn"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className="sd-faq-toggle-icon">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="sd-faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Modal: Create Test (matching exact reference screenshot) */}
      {isCreateTestOpen && (
        <div className="sd-modal-overlay" onClick={() => setIsCreateTestOpen(false)}>
          <div
            className="sd-modal-card sd-create-test-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-test-title"
          >
            {/* Modal Top Header with Centered Title */}
            <div className="sd-test-modal-header">
              <h2 id="modal-test-title" className="sd-test-modal-title">Create Test</h2>
              <button
                type="button"
                className="sd-test-modal-close"
                onClick={() => setIsCreateTestOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="sd-test-modal-body">
              {/* 1. Test Settings */}
              <div className="sd-test-section">
                <div className="sd-test-sec-title">
                  <span>Test Settings</span>
                  <HelpCircle size={14} className="sd-info-icon" />
                </div>
                <div className="sd-toggles-row">
                  <div
                    className="sd-switch-item"
                    onClick={() => setIsTutorMode(!isTutorMode)}
                  >
                    <div className={`sd-toggle-pill ${isTutorMode ? "sd-toggle-pill-on" : ""}`}>
                      <div className="sd-toggle-thumb" />
                    </div>
                    <span className="sd-toggle-label">Tutor</span>
                  </div>

                  <div
                    className="sd-switch-item"
                    onClick={() => setIsTimedMode(!isTimedMode)}
                  >
                    <div className={`sd-toggle-pill ${isTimedMode ? "sd-toggle-pill-on" : ""}`}>
                      <div className="sd-toggle-thumb" />
                    </div>
                    <span className="sd-toggle-label">Timed</span>
                  </div>
                </div>
              </div>

              {/* 2. Question Pools */}
              <div className="sd-test-section">
                <div className="sd-test-sec-title">
                  <span>Question Pools</span>
                  <HelpCircle size={14} className="sd-info-icon" />
                </div>
                <div className="sd-pools-row">
                  {[
                    { id: "unused", label: "Unused", count: testOptions?.pools.unused ?? 0 },
                    { id: "learning", label: "Learning", count: testOptions?.pools.learning ?? 0 },
                    { id: "reviewing", label: "Reviewing", count: testOptions?.pools.reviewing ?? 0 },
                    { id: "mastered", label: "Mastered", count: testOptions?.pools.mastered ?? 0 },
                    { id: "bookmarked", label: "Bookmarked", count: testOptions?.pools.bookmarked ?? 0 }
                  ].map((pool) => {
                    const isChecked = questionPools[pool.id] ?? false;
                    return (
                      <label key={pool.id} className="sd-pool-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setQuestionPools((prev) => ({
                              ...prev,
                              [pool.id]: !prev[pool.id]
                            }))
                          }
                          className="sd-pool-input"
                        />
                        <span className="sd-pool-label-text">{pool.label}</span>
                        <span className="sd-pool-count-badge">{pool.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Subjects */}
              <div className="sd-test-section">
                <div className="sd-subjects-top-bar">
                  <label className="sd-subjects-select-all">
                    <input
                      type="checkbox"
                      checked={Boolean(testOptions?.subjects.length) && testOptions?.subjects.every((subject) => selectedTestSubjectIds.includes(subject.id))}
                      onChange={selectAllTestSubjects}
                    />
                    <span>Subjects</span>
                  </label>
                  <button
                    type="button"
                    className="sd-expand-all-btn"
                    onClick={() => setIsSubjectsExpanded(!isSubjectsExpanded)}
                  >
                    {isSubjectsExpanded ? "− Collapse All" : "+ Expand All"}
                  </button>
                </div>

                {/* Upgrade Callout Banner */}
                <div className="sd-upgrade-banner">
                  <div className="sd-upgrade-left">
                    <span className="sd-upgrade-star-shield">
                      <ShieldCheck size={16} />
                    </span>
                    <span>Upgrade to unlock all questions.</span>
                  </div>
                  <button
                    type="button"
                    className="sd-upgrade-pricing-link"
                    onClick={() => {
                      setIsCreateTestOpen(false);
                      setIsUpgradeModalOpen(true);
                    }}
                  >
                    View Pricing
                  </button>
                </div>

                {/* 2-Column Subjects List */}
                <div className="sd-test-subjects-grid">
                  {/* Left Column */}
                  <div className="sd-test-subj-col">
                    {/* Free Questions (Parent) */}
                    <div className="sd-subj-item-wrap">
                      <div className="sd-subj-item-row">
                        <label className="sd-subj-check-label">
                          <input
                            type="checkbox"
                            checked={selectedTestSubjectIds.includes("free")}
                            onChange={() => toggleTestSubject("free")}
                          />
                          <span>Free Questions</span>
                        </label>
                        <div className="sd-subj-item-meta">
                          <span className="sd-subj-badge">{getTestSubjectCount("free")}</span>
                          <button
                            type="button"
                            className="sd-subj-chevron-btn"
                            onClick={() =>
                              setIsFreeQuestionsDropdownOpen(!isFreeQuestionsDropdownOpen)
                            }
                            aria-label="Toggle nested questions"
                          >
                            <ChevronDown
                              size={14}
                              className={`sd-chevron-rotatable ${isFreeQuestionsDropdownOpen ? "sd-chevron-rotated" : ""
                                }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Nested Free Questions Sub-item */}
                      {isFreeQuestionsDropdownOpen && (
                        <div className="sd-subj-nested-row">
                          <label className="sd-subj-check-label sd-nested-label">
                            <input
                              type="checkbox"
                              checked={selectedTestSubjectIds.includes("free")}
                              onChange={() => toggleTestSubject("free")}
                            />
                            <span>Free Questions</span>
                          </label>
                          <span className="sd-subj-badge">{getTestSubjectCount("free")}</span>
                        </div>
                      )}
                    </div>

                    {/* Case Studies */}
                    <div className="sd-subj-item-row sd-subj-item-locked">
                      <div className="sd-subj-locked-label">
                        <Shield size={14} className="sd-shield-icon" />
                        <span>Case Studies</span>
                      </div>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">0</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </div>

                    {/* Adult Health */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("adult-health")} disabled={getTestSubjectCount("adult-health") === 0} onChange={() => toggleTestSubject("adult-health")} /><span>Adult Health</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("adult-health")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>

                    {/* Child Health */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("child-health")} disabled={getTestSubjectCount("child-health") === 0} onChange={() => toggleTestSubject("child-health")} /><span>Child Health</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("child-health")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>

                    {/* Fundamentals */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("fundamentals")} disabled={getTestSubjectCount("fundamentals") === 0} onChange={() => toggleTestSubject("fundamentals")} /><span>Fundamentals</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("fundamentals")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>
                  </div>

                  {/* Right Column */}
                  <div className="sd-test-subj-col">
                    {/* Maternal & Newborn Health */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("maternal-newborn")} disabled={getTestSubjectCount("maternal-newborn") === 0} onChange={() => toggleTestSubject("maternal-newborn")} /><span>Maternal &amp; Newborn Health</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("maternal-newborn")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>

                    {/* Mental Health */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("mental-health")} disabled={getTestSubjectCount("mental-health") === 0} onChange={() => toggleTestSubject("mental-health")} /><span>Mental Health</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("mental-health")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>

                    {/* Pharmacology */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("pharmacology")} disabled={getTestSubjectCount("pharmacology") === 0} onChange={() => toggleTestSubject("pharmacology")} /><span>Pharmacology</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("pharmacology")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>

                    {/* Management of Care */}
                    <label className="sd-subj-item-row">
                      <span className="sd-subj-check-label"><input type="checkbox" checked={selectedTestSubjectIds.includes("management-of-care")} disabled={getTestSubjectCount("management-of-care") === 0} onChange={() => toggleTestSubject("management-of-care")} /><span>Management of Care</span></span>
                      <div className="sd-subj-item-meta">
                        <span className="sd-subj-badge">{getTestSubjectCount("management-of-care")}</span>
                        <ChevronRight size={14} className="sd-chevron-grey" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. Number of Questions */}
              <div className="sd-test-section">
                <div className="sd-test-sec-title">
                  <span>Number of Questions</span>
                </div>
                <p className="sd-test-sec-desc">
                  You can have a maximum of 150 questions per test.
                </p>

                <div className="sd-questions-input-row">
                  <div className="sd-stepper-box">
                    <input
                      type="number"
                      min={1}
                      max={150}
                      value={testQuestionCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setTestQuestionCount(Math.max(1, Math.min(150, val)));
                      }}
                      className="sd-stepper-val"
                      style={{ width: "48px", border: "none", background: "transparent", fontWeight: 700, fontSize: "15px", textAlign: "center", outline: "none" }}
                    />
                    <div className="sd-stepper-arrows">
                      <button
                        type="button"
                        onClick={() =>
                          setTestQuestionCount((prev) => Math.min(150, prev + 1))
                        }
                        aria-label="Increase question count"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTestQuestionCount((prev) => Math.max(1, prev - 1))
                        }
                        aria-label="Decrease question count"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={Math.min(150, Math.max(1, testQuestionCount))}
                    onChange={(e) => setTestQuestionCount(Number(e.target.value))}
                    className="sd-test-slider"
                  />
                </div>

                {/* Quick Presets for Custom Test Size */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#71717a" }}>Quick select:</span>
                  {[10, 25, 50, 75, 85, 100, 150].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setTestQuestionCount(count)}
                      style={{
                        padding: "3px 9px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: testQuestionCount === count ? 700 : 500,
                        backgroundColor: testQuestionCount === count ? "#6557e8" : "#f1f0fb",
                        color: testQuestionCount === count ? "#ffffff" : "#4b448a",
                        border: testQuestionCount === count ? "1px solid #6557e8" : "1px solid #e2e0f4",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {count === 85 ? "85 (NCLEX CAT)" : count === 150 ? "150 (Max)" : `${count}`}
                    </button>
                  ))}
                </div>

                <div className="sd-time-estimate-text">
                  This test should take about {Math.floor(testQuestionCount * 1.5 / 60) > 0 ? `${Math.floor(testQuestionCount * 1.5 / 60)}hr ${Math.round(testQuestionCount * 1.5 % 60)}min` : `${Math.round(testQuestionCount * 1.5)}min`} to complete.
                </div>
                {testCreationNotice && !testCreationNotice.toLowerCase().includes("mongodb") && (
                  <p role="status" style={{ margin: "8px 0 0", color: "#9a3412", fontSize: "12px" }}>
                    {testCreationNotice}
                  </p>
                )}
              </div>

              {/* 5. Create Test Button */}
              <button
                type="button"
                className="sd-btn-start-test"
                disabled={isLoadingTestOptions || isCreatingTest}
                onClick={(e) => {
                  e.stopPropagation();
                  void createConfiguredTest();
                }}
              >
                {isCreatingTest ? <><RotateCcw size={15} className="sd-spin-icon" /> Creating Test...</> : "Start Test"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Assignment */}
      {renderScheduleAssignmentModal()}

      {/* Modal: Upgrade Membership */}
      {renderUpgradeModal()}

      {/* Modal: Paywall / Pro Upgrade */}
      {renderPaywallModal()}
    </div>
  );
};

export { StudentDashboard };

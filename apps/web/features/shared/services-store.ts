export interface ServiceAccessItem {
  id: string;
  name: string;
  category:
    | "Question Banks"
    | "Clinical Case Studies"
    | "Exam Simulations"
    | "Video & Lectures"
    | "Study Aids & Notes"
    | "AI & Tutoring"
    | "Assurance & Guarantees";
  isPaid: boolean;
  pricingTier: "Free Access" | "1-Month Pass" | "3-Month Pass" | "All Paid Plans";
  description: string;
  includedFeatures: string[];
  studentAccessSummary: string;
  updatedAt: string;
}

export const DEFAULT_SERVICES_CATALOG: ServiceAccessItem[] = [
  {
    id: "svc-free-standalone",
    name: "Free Standalone Questions",
    category: "Question Banks",
    isPaid: false,
    pricingTier: "Free Access",
    description: "Core diagnostic sampler of 36+ standalone Next Gen NCLEX questions across all major clinical subjects.",
    includedFeatures: ["36 free questions", "Instant rationales", "Subject categorization", "Basic scoring"],
    studentAccessSummary: "Available immediately to all registered students without payment.",
    updatedAt: "Today"
  },
  {
    id: "svc-free-case-study",
    name: "Sample Pediatric Case Study",
    category: "Clinical Case Studies",
    isPaid: false,
    pricingTier: "Free Access",
    description: "Full 6-item unfolding clinical judgment case study on pediatric intussusception with interactive EHR chart tabs.",
    includedFeatures: ["6 unfolding items", "EHR nurse notes, vitals & labs", "Clinical matrix scoring", "nclex.com AI demo"],
    studentAccessSummary: "Available to all free tier students as an NGN experience trial.",
    updatedAt: "Today"
  },
  {
    id: "svc-free-cat-exam",
    name: "Diagnostic CAT Readiness Exam #1",
    category: "Exam Simulations",
    isPaid: false,
    pricingTier: "Free Access",
    description: "Introductory 85-question computer adaptive test simulation to establish baseline clinical readiness.",
    includedFeatures: ["Adaptive test engine", "Timed or untimed mode", "Score breakdown", "Answer rationales"],
    studentAccessSummary: "1 diagnostic practice exam included free for all accounts.",
    updatedAt: "Today"
  },
  {
    id: "svc-study-planner",
    name: "Study Schedule Planner & Community",
    category: "Study Aids & Notes",
    isPaid: false,
    pricingTier: "Free Access",
    description: "Personalized study milestones calendar, NCLEX test-day countdown, and Facebook study group community link.",
    includedFeatures: ["Study milestone tracker", "Test countdown", "Facebook study group access", "FAQ & guide library"],
    studentAccessSummary: "Free access to planning tools and student community.",
    updatedAt: "Today"
  },
  {
    id: "svc-qbank-full",
    name: "Complete 3,500+ NGN Question Bank",
    category: "Question Banks",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "Full unrestricted access to 3,500+ questions covering Adult Health, Child Health, Fundamentals, Maternal-Newborn, Mental Health, and Pharmacology.",
    includedFeatures: ["3,500+ practice questions", "All 8 specialty subjects", "Custom test generator", "Tutor & timed modes", "Performance analytics"],
    studentAccessSummary: "Requires active paid membership (1-month or 3-month plan).",
    updatedAt: "Today"
  },
  {
    id: "svc-case-studies-full",
    name: "50+ Clinical Specialty Case Studies Library",
    category: "Clinical Case Studies",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "Library of 50+ authentic unfolding clinical scenarios spanning Med-Surg, Critical Care, Pediatrics, Obstetrics, and Psychiatric Nursing.",
    includedFeatures: ["50+ unfolding case studies", "Interactive EHR tabs", "All 6 NCJMM cognitive steps", "Highlight, drop-down & drag-and-drop"],
    studentAccessSummary: "Requires active paid membership.",
    updatedAt: "Today"
  },
  {
    id: "svc-cat-exams-suite",
    name: "Full CAT Readiness Exam Suite (Exams 2-6)",
    category: "Exam Simulations",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "5 additional official-standard Computer Adaptive Tests with predictive pass probability percentage based on NCSBN test plans.",
    includedFeatures: ["5 full CAT exams", "Predictive pass probability %", "Subject weak-point diagnostic", "Detailed benchmark review"],
    studentAccessSummary: "Requires active paid membership.",
    updatedAt: "Today"
  },
  {
    id: "svc-video-crash-course",
    name: "12-Hour High-Yield Crash Course Video Lectures",
    category: "Video & Lectures",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "Concise, high-retention video lectures delivered by top nurse educators explaining highest-tested NCLEX pathologies and algorithms.",
    includedFeatures: ["12+ hours video lessons", "Audio & video streaming", "Bookmark & speed controls", "Linked question practice"],
    studentAccessSummary: "Requires active paid membership.",
    updatedAt: "Today"
  },
  {
    id: "svc-cheat-sheets",
    name: "45+ Downloadable Pharmacology & Clinical Cheat Sheets",
    category: "Study Aids & Notes",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "Printable high-resolution clinical reference sheets, drug class suffixes, therapeutic ranges, lab values, and antidote guides.",
    includedFeatures: ["45+ full-color PDFs", "Pharmacology fast tables", "Lab reference ranges", "Mobile & tablet friendly"],
    studentAccessSummary: "Requires active paid membership.",
    updatedAt: "Today"
  },
  {
    id: "svc-strategy-masterclass",
    name: "NCSBN Clinical Judgment Strategy Masterclass",
    category: "AI & Tutoring",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "Deep-dive course on decoding test questions, avoiding distractor traps, and mastering NGN clinical decision making.",
    includedFeatures: ["Priority framework guides", "Elimination strategies", "Select-all-that-apply methods", "Test-anxiety reduction"],
    studentAccessSummary: "Requires active paid membership.",
    updatedAt: "Today"
  },
  {
    id: "svc-ai-clinical-tutor",
    name: "24/7 Unlimited nclex.com AI Clinical Tutor",
    category: "AI & Tutoring",
    isPaid: true,
    pricingTier: "All Paid Plans",
    description: "Instant on-demand AI clinical tutor powered by nclex.com knowledge base for questions, deep clinical explanations, and patient scenario reasoning.",
    includedFeatures: ["Unlimited AI questions", "Interactive bedside dialogues", "Pharmacology mechanism breakdowns", "Instant concept clarifications"],
    studentAccessSummary: "Free accounts get 3 sample queries; paid members get unlimited 24/7 access.",
    updatedAt: "Today"
  },
  {
    id: "svc-pass-guarantee",
    name: "100% NCLEX Pass Guarantee & Retake Assurance",
    category: "Assurance & Guarantees",
    isPaid: true,
    pricingTier: "3-Month Pass",
    description: "Guaranteed first-time pass or receive a 100% full money-back refund plus free 6-month access extension.",
    includedFeatures: ["100% money-back guarantee", "Free membership renewal if unsuccessful", "Dedicated study advisor review"],
    studentAccessSummary: "Included automatically with 3-Month and 6-Month plans.",
    updatedAt: "Today"
  }
];

const SERVICES_STORAGE_KEY = "nclex_services_catalog_v1";
export const SERVICES_UPDATED_EVENT = "nclex-services-updated";
const BROADCAST_SERVICES_CHANNEL = "nclex_services_sync_channel";

function getServicesChannel(): BroadcastChannel | null {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      return new BroadcastChannel(BROADCAST_SERVICES_CHANNEL);
    } catch {
      return null;
    }
  }
  return null;
}

function notifyServicesSubscribers(services: ServiceAccessItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent(SERVICES_UPDATED_EVENT, { detail: services })
    );
  } catch {
    // ignore
  }

  const channel = getServicesChannel();
  if (channel) {
    try {
      channel.postMessage({ type: SERVICES_UPDATED_EVENT, payload: services });
      channel.close();
    } catch {
      // ignore
    }
  }
}

export function getStoredServices(): ServiceAccessItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_SERVICES_CATALOG;
  }
  try {
    const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES_CATALOG));
      return DEFAULT_SERVICES_CATALOG;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: Partial<ServiceAccessItem>) => {
        const defaultItem = DEFAULT_SERVICES_CATALOG.find((d) => d.id === item.id);
        return {
          id: item.id || defaultItem?.id || `svc-${Math.random()}`,
          name: item.name || defaultItem?.name || "Service",
          category: item.category || defaultItem?.category || "Question Banks",
          isPaid: typeof item.isPaid === "boolean" ? item.isPaid : (defaultItem?.isPaid ?? true),
          pricingTier: item.pricingTier || defaultItem?.pricingTier || "All Paid Plans",
          description: item.description || defaultItem?.description || "",
          includedFeatures: Array.isArray(item.includedFeatures)
            ? item.includedFeatures
            : (defaultItem?.includedFeatures || []),
          studentAccessSummary: item.studentAccessSummary || defaultItem?.studentAccessSummary || "",
          updatedAt: item.updatedAt || defaultItem?.updatedAt || "Today"
        } as ServiceAccessItem;
      });
    }
    return DEFAULT_SERVICES_CATALOG;
  } catch {
    return DEFAULT_SERVICES_CATALOG;
  }
}

export function saveStoredServices(services: ServiceAccessItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    notifyServicesSubscribers(services);
  } catch (err) {
    console.error("Failed to save services to localStorage", err);
  }
}

export function toggleServicePaidStatus(serviceId: string): ServiceAccessItem[] {
  const current = getStoredServices();
  const updated = current.map((svc) => {
    if (svc.id === serviceId) {
      const nextIsPaid = !svc.isPaid;
      return {
        ...svc,
        isPaid: nextIsPaid,
        pricingTier: nextIsPaid ? "All Paid Plans" : "Free Access",
        studentAccessSummary: nextIsPaid
          ? "Requires active paid membership (1-month or 3-month plan)."
          : "Available immediately to all registered students without payment.",
        updatedAt: "Just now"
      } as ServiceAccessItem;
    }
    return svc;
  });
  saveStoredServices(updated);
  return updated;
}

export function resetServicesToDefault(): ServiceAccessItem[] {
  if (typeof window === "undefined") return DEFAULT_SERVICES_CATALOG;
  try {
    window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES_CATALOG));
    notifyServicesSubscribers(DEFAULT_SERVICES_CATALOG);
  } catch {
    // ignore
  }
  return DEFAULT_SERVICES_CATALOG;
}

export function subscribeToServices(
  callback: (services: ServiceAccessItem[]) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent<ServiceAccessItem[]>).detail;
    if (detail && Array.isArray(detail)) {
      callback(detail);
    } else {
      callback(getStoredServices());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === SERVICES_STORAGE_KEY) {
      callback(getStoredServices());
    }
  };

  window.addEventListener(SERVICES_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(BROADCAST_SERVICES_CHANNEL);
      channel.onmessage = (event) => {
        if (event?.data?.type === SERVICES_UPDATED_EVENT && Array.isArray(event.data.payload)) {
          callback(event.data.payload);
        } else {
          callback(getStoredServices());
        }
      };
    }
  } catch {
    // ignore
  }

  return () => {
    window.removeEventListener(SERVICES_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (channel) {
      try {
        channel.close();
      } catch {
        // ignore
      }
    }
  };
}

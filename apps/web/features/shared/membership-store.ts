export interface StudentMembership {
  isPaid: boolean;
  planId: "free" | "1-month" | "3-month" | "6-month";
  planName: string;
  amountPaid: number;
  purchasedAt?: string;
  expiresAt?: string;
}

const MEMBERSHIP_STORAGE_KEY = "nclex_student_membership_v1";
export const MEMBERSHIP_UPDATED_EVENT = "nclex-membership-updated";
const BROADCAST_MEMBERSHIP_CHANNEL = "nclex_membership_sync_channel";

export const DEFAULT_MEMBERSHIP: StudentMembership = {
  isPaid: false,
  planId: "free",
  planName: "Free Trial Tier",
  amountPaid: 0
};

function getMembershipChannel(): BroadcastChannel | null {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      return new BroadcastChannel(BROADCAST_MEMBERSHIP_CHANNEL);
    } catch {
      return null;
    }
  }
  return null;
}

function notifyMembershipSubscribers(membership: StudentMembership) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent(MEMBERSHIP_UPDATED_EVENT, { detail: membership })
    );
  } catch {
    // ignore
  }

  const channel = getMembershipChannel();
  if (channel) {
    try {
      channel.postMessage({ type: MEMBERSHIP_UPDATED_EVENT, payload: membership });
      channel.close();
    } catch {
      // ignore
    }
  }
}

export function getStudentMembership(): StudentMembership {
  if (typeof window === "undefined") {
    return DEFAULT_MEMBERSHIP;
  }
  try {
    const raw = window.localStorage.getItem(MEMBERSHIP_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(DEFAULT_MEMBERSHIP));
      return DEFAULT_MEMBERSHIP;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.isPaid === "boolean") {
      return parsed as StudentMembership;
    }
    return DEFAULT_MEMBERSHIP;
  } catch {
    return DEFAULT_MEMBERSHIP;
  }
}

export function saveStudentMembership(membership: StudentMembership): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(membership));
    notifyMembershipSubscribers(membership);
  } catch (err) {
    console.error("Failed to save membership", err);
  }
}

export function purchaseMembership(
  planId: "1-month" | "3-month" | "6-month",
  amount: number
): StudentMembership {
  const planNames: Record<string, string> = {
    "1-month": "1-Month Membership Pass",
    "3-month": "3-Month Pro Membership (Most Popular)",
    "6-month": "6-Month Extended Membership"
  };

  const now = new Date();
  const expires = new Date();
  if (planId === "1-month") expires.setMonth(expires.getMonth() + 1);
  else if (planId === "3-month") expires.setMonth(expires.getMonth() + 3);
  else expires.setMonth(expires.getMonth() + 6);

  const updated: StudentMembership = {
    isPaid: true,
    planId,
    planName: planNames[planId] || "Paid Membership",
    amountPaid: amount,
    purchasedAt: now.toISOString().slice(0, 10),
    expiresAt: expires.toISOString().slice(0, 10)
  };

  saveStudentMembership(updated);
  return updated;
}

export function resetStudentMembership(): StudentMembership {
  saveStudentMembership(DEFAULT_MEMBERSHIP);
  return DEFAULT_MEMBERSHIP;
}

export function subscribeToMembership(
  callback: (membership: StudentMembership) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent<StudentMembership>).detail;
    if (detail) {
      callback(detail);
    } else {
      callback(getStudentMembership());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === MEMBERSHIP_STORAGE_KEY) {
      callback(getStudentMembership());
    }
  };

  window.addEventListener(MEMBERSHIP_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(BROADCAST_MEMBERSHIP_CHANNEL);
      channel.onmessage = (event) => {
        if (event?.data?.type === MEMBERSHIP_UPDATED_EVENT && event.data.payload) {
          callback(event.data.payload);
        } else {
          callback(getStudentMembership());
        }
      };
    }
  } catch {
    // ignore
  }

  return () => {
    window.removeEventListener(MEMBERSHIP_UPDATED_EVENT, handleCustomEvent);
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

"use client";

import { useState, useEffect, useId, type ReactElement } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  DollarSign,
  FileCheck2,
  FileQuestion,
  FileText,
  Filter,
  HeartPulse,
  Home,
  Layers3,
  Lock,
  LockKeyhole,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Unlock,
  UsersRound,
  X
} from "lucide-react";
import {
  DEFAULT_STANDALONE_QUESTIONS,
  STANDALONE_SUBJECTS,
  deleteStoredStandaloneQuestion,
  getStoredStandaloneQuestions,
  saveStoredStandaloneQuestion,
  subscribeToStandaloneQuestions,
  type StoredStandaloneQuestion
} from "@/features/shared/standalone-store";
import {
  DEFAULT_SERVICES_CATALOG,
  getStoredServices,
  resetServicesToDefault,
  subscribeToServices,
  toggleServicePaidStatus,
  type ServiceAccessItem
} from "@/features/shared/services-store";
import {
  DEFAULT_MEMBERSHIP,
  getStudentMembership,
  purchaseMembership,
  resetStudentMembership,
  subscribeToMembership,
  type StudentMembership
} from "@/features/shared/membership-store";
import { deleteAdminQuestion, getAdminApiKey, listAdminQuestions, loadAdminStudents, loadAssignmentReport, saveAdminApiKey, saveAdminQuestion, setAdminStudentPayment, updateAdminQuestion, type AdminStudentAccess } from "@/features/shared/question-bank-api";

type AdminTab =
  | "overview"
  | "standalone"
  | "services-access"
  | "question-bank"
  | "case-studies"
  | "study-resources"
  | "student-accounts";

const navItems: { id: AdminTab; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "standalone", label: "Standalone questions", icon: FileQuestion },
  { id: "services-access", label: "Paid vs Free Services", icon: CreditCard },
  { id: "question-bank", label: "Question bank", icon: BookOpen },
  { id: "case-studies", label: "Case studies", icon: FileCheck2 },
  { id: "study-resources", label: "Study resources", icon: Layers3 },
  { id: "student-accounts", label: "Student accounts", icon: UsersRound }
];

export const AdminDashboard = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [questions, setQuestions] = useState<StoredStandaloneQuestion[]>(DEFAULT_STANDALONE_QUESTIONS);
  const [services, setServices] = useState<ServiceAccessItem[]>(DEFAULT_SERVICES_CATALOG);
  const [studentMembership, setStudentMembership] = useState<StudentMembership>(DEFAULT_MEMBERSHIP);
  const [isClient, setIsClient] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Standalone filter & modal state
  const [standaloneSubjectFilter, setStandaloneSubjectFilter] = useState<string>("all");
  const [standaloneSearch, setStandaloneSearch] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating question
  const [newTitle, setNewTitle] = useState("");
  const [newSubjectId, setNewSubjectId] = useState<StoredStandaloneQuestion["subjectId"]>("free");
  const [newType, setNewType] = useState<StoredStandaloneQuestion["type"]>("Multiple Choice");
  const [newStem, setNewStem] = useState("");
  const [opt0, setOpt0] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [newRationale, setNewRationale] = useState("");
  const [newStatus, setNewStatus] = useState<StoredStandaloneQuestion["status"]>("Published");
  const [newIsPaid, setNewIsPaid] = useState(false);
  const [adminApiKey, setAdminApiKey] = useState("");
  const [assignmentReport, setAssignmentReport] = useState<readonly Readonly<{ studentId: string; questionId: string; sequence: number; assignedAt: string; answered: boolean }>[]>([]);
  const [keyDraft, setKeyDraft] = useState("");
  const [adminStudents, setAdminStudents] = useState<readonly AdminStudentAccess[]>([]);
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, Readonly<{ paymentReference: string; paidUntil: string }>>>({});

  // Services filter state
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceAccessFilter, setServiceAccessFilter] = useState<"all" | "paid" | "free">("all");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>("all");

  const newQuestionFormId = useId();

  // Load and subscribe to real-time updates for questions & services
  useEffect(() => {
    setIsClient(true);
    setQuestions(getStoredStandaloneQuestions());
    setServices(getStoredServices());
    setStudentMembership(getStudentMembership());

    const unsubscribeQuestions = subscribeToStandaloneQuestions((updated) => {
      setQuestions(updated);
    });

    const unsubscribeServices = subscribeToServices((updated) => {
      setServices(updated);
    });

    const unsubscribeMembership = subscribeToMembership((m) => {
      setStudentMembership(m);
    });

    return () => {
      unsubscribeQuestions();
      unsubscribeServices();
      unsubscribeMembership();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const connectQuestionApi = async (key: string): Promise<void> => {
    const normalizedKey = key.trim();
    if (!normalizedKey) { showToast("Enter the admin API key configured on the server."); return; }
    try {
      let remoteQuestions = await listAdminQuestions(normalizedKey);
      if (remoteQuestions.length === 0) {
        for (const question of DEFAULT_STANDALONE_QUESTIONS) {
          await saveAdminQuestion(normalizedKey, { ...question, isPaid: question.isPaid ?? question.subjectId !== "free" });
        }
        remoteQuestions = await listAdminQuestions(normalizedKey);
      }
      const assignments = await loadAssignmentReport(normalizedKey);
      const students = await loadAdminStudents(normalizedKey);
      saveAdminApiKey(normalizedKey);
      setAdminApiKey(normalizedKey);
      setQuestions(remoteQuestions);
      setAssignmentReport(assignments);
      setAdminStudents(students);
      setKeyDraft(normalizedKey);
      showToast("Questions are connected to MongoDB. Student assignments are up to date.");
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : "Could not connect to the question API.");
    }
  };

  useEffect(() => {
    const key = getAdminApiKey();
    if (key) void connectQuestionApi(key);
  }, []);

  // Handlers for Standalone Questions
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStem.trim() || !opt0.trim() || !opt1.trim()) {
      showToast("⚠️ Please fill in the question title, clinical stem, and at least 2 options.");
      return;
    }

    const subjectObj = STANDALONE_SUBJECTS.find((s) => s.id === newSubjectId);
    const subjectName = subjectObj ? subjectObj.name : "Free Questions";

    const newQuestion: StoredStandaloneQuestion = {
      id: `sq-${Date.now()}`,
      subjectId: newSubjectId,
      subjectName,
      title: newTitle.trim(),
      stem: newStem.trim(),
      type: newType,
      options: [opt0.trim(), opt1.trim(), opt2.trim() || "N/A", opt3.trim() || "N/A"],
      correctIndex,
      rationale: newRationale.trim() || "Standard clinical rationale provided by Content Admin.",
      status: newStatus,
      isPaid: newIsPaid,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: "Today",
      author: "Admin Editor"
    };

    let saved = newQuestion;
    if (adminApiKey) {
      try {
        saved = await saveAdminQuestion(adminApiKey, newQuestion);
      } catch (err) {
        console.warn("Could not save to remote API, saving locally:", err);
      }
    }
    saveStoredStandaloneQuestion(saved);
    setQuestions((current) => [saved, ...current.filter((question) => question.id !== saved.id)]);
    setIsCreateModalOpen(false);

    // Reset form
    setNewTitle("");
    setNewStem("");
    setOpt0("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setCorrectIndex(0);
    setNewRationale("");
    setNewStatus("Published");
    setNewIsPaid(false);

    showToast(`✅ Question created successfully and synced live to Student Dashboard!`);
  };

  const handleDeleteQuestion = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      if (adminApiKey) {
        try {
          await deleteAdminQuestion(adminApiKey, id);
        } catch (err) {
          console.warn("Could not delete from remote API:", err);
        }
      }
      deleteStoredStandaloneQuestion(id);
      setQuestions(getStoredStandaloneQuestions());
      showToast(`🗑️ Question removed from student and admin catalog.`);
    }
  };

  const handleToggleQuestionStatus = async (q: StoredStandaloneQuestion) => {
    const nextStatus = q.status === "Published" ? "Draft" : "Published";
    let updated: StoredStandaloneQuestion = {
      ...q,
      status: nextStatus,
      updatedAt: "Today"
    };
    if (adminApiKey) {
      try {
        const remoteUpdated = await updateAdminQuestion(adminApiKey, q.id, updated);
        updated = remoteUpdated;
      } catch (err) {
        console.warn("Could not update remote status:", err);
      }
    }
    saveStoredStandaloneQuestion(updated);
    setQuestions((current) => current.map((question) => question.id === q.id ? updated : question));
    showToast(`Question status updated to ${nextStatus}.`);
  };

  const handleToggleQuestionPayment = async (question: StoredStandaloneQuestion) => {
    const nextIsPaid = !(question.isPaid ?? question.subjectId !== "free");
    let updated: StoredStandaloneQuestion = {
      ...question,
      isPaid: nextIsPaid,
      updatedAt: "Today"
    };
    if (adminApiKey) {
      try {
        const remoteUpdated = await updateAdminQuestion(adminApiKey, question.id, { isPaid: nextIsPaid });
        updated = remoteUpdated;
      } catch (err) {
        console.warn("Could not update remote payment status:", err);
      }
    }
    saveStoredStandaloneQuestion(updated);
    setQuestions((current) => current.map((entry) => entry.id === question.id ? updated : entry));
    showToast(`Question is now ${updated.isPaid ? "Paid" : "Unpaid"}.`);
  };

  const handleVerifyPayment = async (studentId: string): Promise<void> => {
    const payment = paymentDrafts[studentId];
    if (!adminApiKey || !payment?.paymentReference.trim() || !payment.paidUntil) { showToast("Enter a verified transaction reference and expiry date first."); return; }
    try {
      await setAdminStudentPayment(adminApiKey, studentId, { paymentStatus: "paid", paymentReference: payment.paymentReference.trim(), paidUntil: new Date(`${payment.paidUntil}T23:59:59.999Z`).toISOString() });
      setAdminStudents(await loadAdminStudents(adminApiKey));
      showToast("Payment verification saved. The student API now unlocks their assigned paid questions.");
    } catch (cause) { showToast(cause instanceof Error ? cause.message : "Payment status could not be saved."); }
  };

  const handleRevokeStudentPayment = async (studentId: string): Promise<void> => {
    if (!adminApiKey) return;
    try {
      await setAdminStudentPayment(adminApiKey, studentId, { paymentStatus: "unpaid" });
      setAdminStudents(await loadAdminStudents(adminApiKey));
      showToast("Paid access was removed. Paid question content is locked on the next student refresh.");
    } catch (cause) { showToast(cause instanceof Error ? cause.message : "Payment status could not be updated."); }
  };

  // Handlers for Services Access
  const handleToggleService = (serviceId: string, serviceName: string, currentlyPaid: boolean) => {
    const updated = toggleServicePaidStatus(serviceId);
    setServices(updated);
    const newStatus = currentlyPaid ? "FREE (Unpaid for all students)" : "PAID ONLY (Requires subscription)";
    showToast(`🔔 "${serviceName}" is now ${newStatus}!`);
  };

  const handleResetServices = () => {
    if (confirm("Reset all services to default pricing tiers? (4 Free, 8 Paid)")) {
      const reset = resetServicesToDefault();
      setServices(reset);
      showToast("🔄 Services catalog reset to default pricing tiers.");
    }
  };

  // Filtered lists
  const filteredQuestions = questions.filter((q) => {
    const matchesSubject = standaloneSubjectFilter === "all" || q.subjectId === standaloneSubjectFilter;
    const matchesSearch =
      standaloneSearch === "" ||
      q.title.toLowerCase().includes(standaloneSearch.toLowerCase()) ||
      q.stem.toLowerCase().includes(standaloneSearch.toLowerCase()) ||
      q.subjectName.toLowerCase().includes(standaloneSearch.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const filteredServices = services.filter((s) => {
    const matchesAccess =
      serviceAccessFilter === "all" ||
      (serviceAccessFilter === "paid" && s.isPaid) ||
      (serviceAccessFilter === "free" && !s.isPaid);

    const matchesCategory =
      serviceCategoryFilter === "all" || s.category === serviceCategoryFilter;

    const matchesSearch =
      serviceSearch === "" ||
      (s.name || "").toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (s.pricingTier || "").toLowerCase().includes(serviceSearch.toLowerCase());

    return matchesAccess && matchesCategory && matchesSearch;
  });

  const paidServicesCount = services.filter((s) => s.isPaid).length;
  const freeServicesCount = services.filter((s) => !s.isPaid).length;

  return (
    <main className="portal-page admin-portal">
      {/* Toast notification banner */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor: "#221c4b",
            color: "#ffffff",
            padding: "14px 22px",
            borderRadius: "12px",
            boxShadow: "0 14px 36px rgba(0,0,0,0.35)",
            border: "1px solid #7c6df2",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <Sparkles size={16} color="#ffd166" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              marginLeft: "10px"
            }}
          >
            ✕
          </button>
        </aside>
      )}

      {/* Admin Sidebar Navigation */}
      <aside aria-label="Admin workspace navigation" className="portal-sidebar admin-sidebar">
        <Link aria-label="NCLEXLab admin home" className="portal-brand" href="/">
          <span className="portal-brand-mark"><HeartPulse size={20} /></span>
          <span>NCLEX<span>Lab</span></span>
        </Link>
        <div className="workspace-label">ADMIN WORKSPACE</div>
        <nav className="portal-menu" aria-label="Admin navigation">
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? "page" : undefined}
                className={`portal-menu-link${isActive ? " is-active" : ""}`}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? "#292a3c" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  color: isActive ? "#ffffff" : "#c7c8d6",
                  marginBottom: "4px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon aria-hidden="true" size={17} />
                  <span className="portal-menu-label" style={{ fontWeight: isActive ? 700 : 500 }}>
                    {label}
                  </span>
                </div>
                {id === "standalone" && (
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "2px 7px",
                      borderRadius: "12px",
                      background: "#6557e8",
                      color: "#fff",
                      fontWeight: 700
                    }}
                  >
                    {isClient ? questions.length : 5}
                  </span>
                )}
                {id === "services-access" && (
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "2px 7px",
                      borderRadius: "12px",
                      background: "#2a9d8f",
                      color: "#fff",
                      fontWeight: 700
                    }}
                  >
                    {isClient ? `${paidServicesCount}P · ${freeServicesCount}F` : "Paid/Free"}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-spacer" style={{ flex: 1 }} />
        <Link
          className="portal-menu-link"
          href="/student"
          target="_blank"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px" }}
        >
          <Sparkles size={16} color="#796af1" />
          <span className="portal-menu-label" style={{ color: "#a5a2e8", fontWeight: 600 }}>
            Open Student Portal ↗
          </span>
        </Link>
        <div className="sidebar-profile">
          <div className="profile-avatar admin-avatar">AD</div>
          <div>
            <strong>Content admin</strong>
            <small>Executive control</small>
          </div>
          <Settings2 aria-hidden="true" className="profile-settings" size={16} />
        </div>
        <Link className="sidebar-home-link" href="/">← Back to NCLEXLab</Link>
      </aside>

      {/* Admin Workspace Content */}
      <section className="portal-main">
        {/* Topbar */}
        <header className="portal-topbar">
          <div className="breadcrumb">
            Admin workspace <ChevronRight size={14} /> <strong>{navItems.find((n) => n.id === activeTab)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <span className="preview-badge admin-preview-badge">
              <span /> Dynamic Sync Active
            </span>
            <Link
              href="/student"
              target="_blank"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#6557e8",
                backgroundColor: "#eeebff",
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none"
              }}
            >
              Preview as Student ↗
            </Link>
            <div className="topbar-avatar admin-avatar">AD</div>
          </div>
        </header>

        <div className="portal-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="preview-notice admin-notice">
                <ShieldCheck size={16} color="#6557e8" />
                <span>
                  <strong>Dynamic Administrator Portal Active.</strong> Content changes to standalone questions and service access rules take effect immediately in real time across all student sessions.
                </span>
              </div>

              <section className="welcome-row admin-welcome" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <div className="welcome-eyebrow admin-eyebrow"><ShieldCheck size={14} /> CONTENT & PRICING OPERATIONS</div>
                  <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0" }}>Good morning, Admin</h1>
                  <p style={{ color: "#666885", margin: 0 }}>Review learning content, add questions for students, and configure Paid vs Free services access.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("standalone");
                      setIsCreateModalOpen(true);
                    }}
                    className="portal-button portal-button-admin"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#6557e8",
                      color: "#fff",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={16} /> Add Standalone Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("services-access")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#2a9d8f",
                      color: "#fff",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <CreditCard size={16} /> Paid vs Free Services
                  </button>
                </div>
              </section>

              {/* Overview Metrics Cards */}
              <section aria-label="Content overview" className="overview-grid admin-overview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                <article
                  className="overview-card overview-card-admin"
                  style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #e9e8f1", cursor: "pointer" }}
                  onClick={() => setActiveTab("standalone")}
                >
                  <div className="overview-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6c6e86", fontWeight: 600 }}>Standalone Questions</span>
                    <span className="soft-icon" style={{ background: "#eeebff", padding: "6px", borderRadius: "8px", color: "#6557e8" }}><FileQuestion size={18} /></span>
                  </div>
                  <div className="overview-value" style={{ fontSize: "28px", fontWeight: 800, color: "#191a2e" }}>
                    {questions.length} <small style={{ fontSize: "11px", color: "#6557e8", fontWeight: 600 }}>active questions</small>
                  </div>
                  <div className="overview-foot" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6557e8", fontWeight: 700 }}>
                    <span>Manage & Add Questions</span>
                    <ArrowRight size={14} />
                  </div>
                </article>

                <article
                  className="overview-card"
                  style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #e9e8f1", cursor: "pointer" }}
                  onClick={() => setActiveTab("services-access")}
                >
                  <div className="overview-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6c6e86", fontWeight: 600 }}>Services Access Gate</span>
                    <span className="soft-icon" style={{ background: "#e6f8f5", padding: "6px", borderRadius: "8px", color: "#2a9d8f" }}><CreditCard size={18} /></span>
                  </div>
                  <div className="overview-value" style={{ fontSize: "28px", fontWeight: 800, color: "#2a9d8f" }}>
                    {paidServicesCount} <small style={{ fontSize: "11px", color: "#555" }}>Paid · {freeServicesCount} Free</small>
                  </div>
                  <div className="overview-foot" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#2a9d8f", fontWeight: 700 }}>
                    <span>Toggle Paid/Free Status</span>
                    <ArrowRight size={14} />
                  </div>
                </article>

                <article
                  className="overview-card"
                  style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #e9e8f1", cursor: "pointer" }}
                  onClick={() => setActiveTab("question-bank")}
                >
                  <div className="overview-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6c6e86", fontWeight: 600 }}>Question Bank Inventory</span>
                    <span className="soft-icon" style={{ background: "#f0edff", padding: "6px", borderRadius: "8px", color: "#6557e8" }}><BookOpen size={18} /></span>
                  </div>
                  <div className="overview-value" style={{ fontSize: "28px", fontWeight: 800, color: "#191a2e" }}>
                    3,500+ <small style={{ fontSize: "11px", color: "#888" }}>across 8 subjects</small>
                  </div>
                  <div className="overview-foot" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6557e8", fontWeight: 700 }}>
                    <span>Review Category Banks</span>
                    <ArrowRight size={14} />
                  </div>
                </article>

                <article
                  className="overview-card"
                  style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #e9e8f1", cursor: "pointer" }}
                  onClick={() => setActiveTab("student-accounts")}
                >
                  <div className="overview-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#6c6e86", fontWeight: 600 }}>Student Subscriptions</span>
                    <span className="soft-icon" style={{ background: "#fff2e8", padding: "6px", borderRadius: "8px", color: "#e76f51" }}><UsersRound size={18} /></span>
                  </div>
                  <div className="overview-value" style={{ fontSize: "28px", fontWeight: 800, color: "#191a2e" }}>
                    1,420 <small style={{ fontSize: "11px", color: "#888" }}>active users</small>
                  </div>
                  <div className="overview-foot" style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#e76f51", fontWeight: 700 }}>
                    <span>890 Paid / 530 Free</span>
                    <ArrowRight size={14} />
                  </div>
                </article>
              </section>

              {/* Paid vs Free Services Snapshot on Overview */}
              <section style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#2a9d8f", letterSpacing: "1px" }}>SERVICES ACCESS CONTROL</span>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#191a2e", margin: "4px 0" }}>Platform Services: Paid vs Free Access Status</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("services-access")}
                    style={{
                      background: "#e6f8f5",
                      border: "1px solid #b7ede5",
                      color: "#2a9d8f",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    Manage All 12 Services <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Free Services List */}
                  <div style={{ background: "#f8fbf9", border: "1px solid #d4ece1", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <span style={{ padding: "4px 8px", background: "#2a9d8f", color: "#fff", borderRadius: "6px", fontSize: "11px", fontWeight: 800 }}>
                        FREE / UNPAID ({freeServicesCount})
                      </span>
                      <span style={{ fontSize: "12px", color: "#555" }}>Available to every registered student</span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                      {services.filter((s) => !s.isPaid).map((s) => (
                        <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", padding: "6px 10px", background: "#fff", borderRadius: "6px", border: "1px solid #e1efe7" }}>
                          <span style={{ fontWeight: 600, color: "#264653" }}>✓ {s.name}</span>
                          <span style={{ fontSize: "10px", color: "#666", background: "#eef7f2", padding: "2px 6px", borderRadius: "4px" }}>{s.category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Paid Services List */}
                  <div style={{ background: "#faf9fe", border: "1px solid #e6dffa", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <span style={{ padding: "4px 8px", background: "#6557e8", color: "#fff", borderRadius: "6px", fontSize: "11px", fontWeight: 800 }}>
                        PAID ONLY ({paidServicesCount})
                      </span>
                      <span style={{ fontSize: "12px", color: "#555" }}>Requires active paid membership</span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                      {services.filter((s) => s.isPaid).slice(0, 4).map((s) => (
                        <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", padding: "6px 10px", background: "#fff", borderRadius: "6px", border: "1px solid #ede8fb" }}>
                          <span style={{ fontWeight: 600, color: "#4338ca" }}>🔒 {s.name}</span>
                          <span style={{ fontSize: "10px", color: "#6557e8", background: "#f0edff", padding: "2px 6px", borderRadius: "4px" }}>{s.pricingTier}</span>
                        </li>
                      ))}
                      {paidServicesCount > 4 && (
                        <li style={{ textAlign: "center", fontSize: "11px", color: "#6557e8", fontWeight: 600, padding: "4px" }}>
                          + {paidServicesCount - 4} more premium services (CAT exams, video lectures, cheat sheets, AI tutor)...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Standalone questions quick preview */}
              <section className="content-panel admin-queue-panel" style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "16px", padding: "24px" }}>
                <div className="panel-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <span className="panel-kicker" style={{ fontSize: "11px", color: "#6557e8", fontWeight: 800 }}>STANDALONE QUESTION INVENTORY</span>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "4px 0" }}>Recently Created Standalone Questions</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("standalone")}
                    className="inline-link"
                    style={{ background: "none", border: "none", color: "#6557e8", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    View All {questions.length} Questions <ArrowRight size={15} />
                  </button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-content-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f0edf8" }}>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "11px", color: "#777" }}>Title & Vignette</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "11px", color: "#777" }}>Subject</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "11px", color: "#777" }}>Type</th>
                        <th style={{ padding: "10px", textAlign: "left", fontSize: "11px", color: "#777" }}>Status</th>
                        <th style={{ padding: "10px", textAlign: "right", fontSize: "11px", color: "#777" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.slice(0, 5).map((q) => (
                        <tr key={q.id} style={{ borderBottom: "1px solid #f1f0f7" }}>
                          <td style={{ padding: "12px 10px" }}>
                            <div style={{ fontWeight: 700, color: "#191a2e", fontSize: "13px" }}>{q.title}</div>
                            <div style={{ fontSize: "11px", color: "#777", maxWidth: "420px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {q.stem}
                            </div>
                          </td>
                          <td style={{ padding: "12px 10px", fontSize: "12px", color: "#555" }}>{q.subjectName}</td>
                          <td style={{ padding: "12px 10px", fontSize: "11px", color: "#6557e8", fontWeight: 600 }}>{q.type}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: 700,
                                background: q.status === "Published" ? "#e6f8f1" : "#fef3e2",
                                color: q.status === "Published" ? "#2a9d8f" : "#e76f51"
                              }}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 10px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleToggleQuestionStatus(q)}
                              style={{
                                background: "#f0edff",
                                border: "1px solid #ddd6fe",
                                color: "#6557e8",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                                marginRight: "6px"
                              }}
                            >
                              {q.status === "Published" ? "Make Draft" : "Publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q.id, q.title)}
                              style={{
                                background: "#fff0f0",
                                border: "1px solid #ffd4d4",
                                color: "#e63946",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                cursor: "pointer"
                              }}
                              aria-label={`Delete question ${q.title}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: STANDALONE QUESTIONS (Dynamic Question Authoring Studio) */}
          {activeTab === "standalone" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <div className="welcome-eyebrow admin-eyebrow"><FileQuestion size={14} /> DYNAMIC QUESTION AUTHORING</div>
                  <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0", color: "#191a2e" }}>Next Gen Standalone Questions</h1>
                  <p style={{ color: "#666885", margin: 0 }}>
                    Create and publish standalone questions. Any question added here is synchronized in real-time to the student dashboard test engine!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#6557e8",
                    color: "#fff",
                    padding: "12px 22px",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(101, 87, 232, 0.4)"
                  }}
                >
                  <Plus size={18} /> Create New Question
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px", borderRadius: "10px", background: "#fff", border: "1px solid #e9e8f1", marginBottom: "16px" }}>
                <label htmlFor="admin-question-api-key" style={{ fontSize: "12px", fontWeight: 700, color: "#444", whiteSpace: "nowrap" }}>Secure API key</label>
                <input id="admin-question-api-key" type="password" autoComplete="current-password" placeholder="Configured in API server environment" value={keyDraft} onChange={(event) => setKeyDraft(event.target.value)} style={{ flex: 1, minWidth: 0, padding: "9px 12px", borderRadius: "8px", border: "1px solid #dedce9", fontSize: "13px" }} />
                <button type="button" onClick={() => void connectQuestionApi(keyDraft)} style={{ padding: "9px 14px", borderRadius: "8px", border: "none", background: "#1e293b", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Connect MongoDB</button>
                <span style={{ fontSize: "11px", color: adminApiKey ? "#15803d" : "#64748b" }}>{adminApiKey ? "MongoDB Connected" : "Local & Live Sync Active"}</span>
              </div>

              {/* Filters toolbar */}
              <div style={{ display: "flex", gap: "12px", background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e9e8f1", marginBottom: "20px", alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#888" }} />
                  <input
                    type="text"
                    placeholder="Search standalone questions by title or clinical stem..."
                    value={standaloneSearch}
                    onChange={(e) => setStandaloneSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "8px",
                      border: "1px solid #dedce9",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Filter size={16} color="#666" />
                  <select
                    value={standaloneSubjectFilter}
                    onChange={(e) => setStandaloneSubjectFilter(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #dedce9",
                      fontSize: "13px",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <option value="all">All Subjects ({questions.length})</option>
                    {STANDALONE_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions List Table */}
              <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8f8fc", borderBottom: "2px solid #edeaf4" }}>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Question & Clinical Vignette</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Subject</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Type</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Access</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Status</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Assigned</th>
                      <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "#555" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", color: "#888" }}>
                          No standalone questions found matching your filter. Click <strong>"Create New Question"</strong> above to add one!
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => (
                        <tr key={q.id} style={{ borderBottom: "1px solid #f1f0f7" }}>
                          <td style={{ padding: "16px" }}>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "#191a2e", marginBottom: "4px" }}>
                              {q.title}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5, maxWidth: "600px" }}>
                              {q.stem}
                            </div>
                            <div style={{ marginTop: "8px", fontSize: "11px", color: "#2a9d8f", fontWeight: 600 }}>
                              ✓ Correct Option: {q.options[q.correctIndex]}
                            </div>
                          </td>
                          <td style={{ padding: "16px", fontSize: "12px", color: "#444" }}>
                            <span style={{ background: "#f0edff", padding: "4px 8px", borderRadius: "6px", color: "#6557e8", fontWeight: 600 }}>
                              {q.subjectName}
                            </span>
                          </td>
                          <td style={{ padding: "16px", fontSize: "12px", color: "#555" }}>{q.type}</td>
                          <td style={{ padding: "16px" }}><span style={{ background: (q.isPaid ?? q.subjectId !== "free") ? "#fff7ed" : "#ecfdf5", color: (q.isPaid ?? q.subjectId !== "free") ? "#c2410c" : "#047857", padding: "4px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: 800 }}>{(q.isPaid ?? q.subjectId !== "free") ? "Paid" : "Unpaid"}</span></td>
                          <td style={{ padding: "16px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background: q.status === "Published" ? "#e6f8f1" : "#fef3e2",
                                color: q.status === "Published" ? "#2a9d8f" : "#e76f51"
                              }}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td style={{ padding: "16px", fontSize: "12px", color: "#555", maxWidth: "180px" }} title={(q.assignedStudentIds ?? []).join(", ")}>{q.assignmentCount ?? q.assignedStudentIds?.length ?? 0} student(s){(q.assignedStudentIds?.length ?? 0) > 0 && <div style={{ marginTop: "4px", fontSize: "10px", color: "#777", overflow: "hidden", textOverflow: "ellipsis" }}>{q.assignedStudentIds?.join(", ")}</div>}</td>
                          <td style={{ padding: "16px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                              <button type="button" onClick={() => void handleToggleQuestionPayment(q)} style={{ background: "#fff", border: "1px solid #dedce9", color: "#444", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>{(q.isPaid ?? q.subjectId !== "free") ? "Mark Unpaid" : "Mark Paid"}</button>
                              <button
                                type="button"
                                onClick={() => handleToggleQuestionStatus(q)}
                                style={{
                                  background: "#f0edff",
                                  border: "1px solid #ddd6fe",
                                  color: "#6557e8",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer"
                                }}
                              >
                                {q.status === "Published" ? "Make Draft" : "Publish"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(q.id, q.title)}
                                style={{
                                  background: "#fff0f0",
                                  border: "1px solid #ffd4d4",
                                  color: "#e63946",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  cursor: "pointer"
                                }}
                                aria-label={`Delete question ${q.title}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* CREATE QUESTION MODAL */}
              {isCreateModalOpen && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(18, 19, 36, 0.7)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      width: "100%",
                      maxWidth: "760px",
                      maxHeight: "90vh",
                      overflowY: "auto",
                      borderRadius: "16px",
                      boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
                      padding: "28px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#6557e8" }}>NEW QUESTION BUILDER</span>
                        <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "2px 0", color: "#191a2e" }}>Create Next Gen Standalone Question</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        style={{ background: "#f2f2f7", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "grid", placeItems: "center" }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form id={newQuestionFormId} onSubmit={handleSaveQuestion}>
                      {/* Title & Subject */}
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "14px", marginBottom: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "6px" }}>
                            Question Title / Concept *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Acute Intussusception Hallmark Signs"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d0db", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "6px" }}>
                            Subject Category *
                          </label>
                          <select
                            value={newSubjectId}
                            onChange={(e) => setNewSubjectId(e.target.value as any)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d0db", fontSize: "13px", background: "#fff" }}
                          >
                            {STANDALONE_SUBJECTS.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", marginBottom: "16px", border: "1px solid #dedce9", borderRadius: "8px", background: newIsPaid ? "#fff7ed" : "#ecfdf5", cursor: "pointer" }}>
                        <input type="checkbox" checked={newIsPaid} onChange={(event) => setNewIsPaid(event.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#6557e8" }} />
                        <span style={{ fontSize: "13px", fontWeight: 700, color: newIsPaid ? "#c2410c" : "#047857" }}>{newIsPaid ? "Paid question — verified membership required" : "Unpaid question — available to every student"}</span>
                      </label>

                      {/* Clinical Vignette (Stem) */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "6px" }}>
                          Clinical Stem / Patient Scenario *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="A 6-month-old infant is admitted with episodic, severe colicky abdominal pain..."
                          value={newStem}
                          onChange={(e) => setNewStem(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d0db", fontSize: "13px", fontFamily: "inherit" }}
                        />
                      </div>

                      {/* Options */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "8px" }}>
                          Answer Choices (Select radio button for the correct answer) *
                        </label>
                        {[
                          { val: opt0, set: setOpt0, idx: 0, label: "Option A" },
                          { val: opt1, set: setOpt1, idx: 1, label: "Option B" },
                          { val: opt2, set: setOpt2, idx: 2, label: "Option C" },
                          { val: opt3, set: setOpt3, idx: 3, label: "Option D" }
                        ].map((item) => (
                          <div key={item.idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <input
                              type="radio"
                              name="correctOption"
                              checked={correctIndex === item.idx}
                              onChange={() => setCorrectIndex(item.idx)}
                              style={{ width: "18px", height: "18px", accentColor: "#2a9d8f", cursor: "pointer" }}
                            />
                            <span style={{ fontSize: "12px", fontWeight: 700, minWidth: "65px", color: correctIndex === item.idx ? "#2a9d8f" : "#666" }}>
                              {item.label} {correctIndex === item.idx ? "(Correct)" : ""}
                            </span>
                            <input
                              type="text"
                              required={item.idx < 2}
                              placeholder={`Enter text for ${item.label}...`}
                              value={item.val}
                              onChange={(e) => item.set(e.target.value)}
                              style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d0db", fontSize: "13px" }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Clinical Rationale */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "6px" }}>
                          Clinical Judgment Rationale & Explanation
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Explain why the correct answer is indicated and why other choices are distractors..."
                          value={newRationale}
                          onChange={(e) => setNewRationale(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d0db", fontSize: "13px", fontFamily: "inherit" }}
                        />
                      </div>

                      {/* Modal Footer */}
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                        <button
                          type="button"
                          onClick={() => setIsCreateModalOpen(false)}
                          style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #d1d0db", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{
                            padding: "10px 22px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#6557e8",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 700,
                            boxShadow: "0 4px 12px rgba(101, 87, 232, 0.4)"
                          }}
                        >
                          Save & Publish Live
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAID VS FREE SERVICES CONTROL CENTER */}
          {activeTab === "services-access" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <div className="welcome-eyebrow admin-eyebrow" style={{ color: "#2a9d8f" }}>
                    <CreditCard size={14} /> SERVICES ACCESS & PRICING GATEWAY
                  </div>
                  <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0", color: "#191a2e" }}>
                    Paid vs Free Services Manager
                  </h1>
                  <p style={{ color: "#666885", margin: 0 }}>
                    Determine and configure which services, question banks, case studies, and exam tools are <strong>Free (Unpaid)</strong> versus <strong>Paid (Require Subscription)</strong>.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={handleResetServices}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#fff",
                      border: "1px solid #dcdbe8",
                      color: "#555",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <RefreshCw size={14} /> Reset Defaults
                  </button>
                  <Link
                    href={"/upgrade" as any}
                    target="_blank"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "linear-gradient(135deg, #796af1, #5b4bd5)",
                      color: "#fff",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(101, 87, 232, 0.35)"
                    }}
                  >
                    View Student Upgrade Page ↗
                  </Link>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "18px" }}>
                  <div style={{ fontSize: "12px", color: "#777", fontWeight: 600 }}>Total Catalog Services</div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#191a2e", marginTop: "4px" }}>
                    {services.length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6557e8", marginTop: "4px" }}>Active platform offerings</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #d4ece1", borderRadius: "14px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#2a9d8f", fontWeight: 700 }}>Free / Unpaid Services</span>
                    <Unlock size={16} color="#2a9d8f" />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#2a9d8f", marginTop: "4px" }}>
                    {freeServicesCount}
                  </div>
                  <div style={{ fontSize: "11px", color: "#2a9d8f", marginTop: "4px" }}>No credit card required</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e6dffa", borderRadius: "14px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#6557e8", fontWeight: 700 }}>Paid Services</span>
                    <Lock size={16} color="#6557e8" />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#6557e8", marginTop: "4px" }}>
                    {paidServicesCount}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6557e8", marginTop: "4px" }}>Requires active membership</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "18px" }}>
                  <div style={{ fontSize: "12px", color: "#777", fontWeight: 600 }}>Paid Lock Ratio</div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#e76f51", marginTop: "4px" }}>
                    {Math.round((paidServicesCount / services.length) * 100)}%
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>Monetized content density</div>
                </div>
              </div>

              {/* Visual Side-by-Side Comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                {/* What Free Students Get */}
                <div style={{ background: "linear-gradient(145deg, #f2faf6, #ffffff)", border: "1px solid #cce8dc", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#2a9d8f", color: "#fff", display: "grid", placeItems: "center" }}>
                      <Unlock size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1b4332", margin: 0 }}>Free / Unpaid Tier (All Students)</h3>
                      <p style={{ fontSize: "11px", color: "#40916c", margin: 0 }}>Default access available immediately after sign-up</p>
                    </div>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {services.filter((s) => !s.isPaid).map((s) => (
                      <li key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", padding: "8px 12px", background: "#fff", borderRadius: "8px", border: "1px solid #d8ede3" }}>
                        <span style={{ fontWeight: 600, color: "#2d6a4f" }}>✓ {s.name}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleService(s.id, s.name, false)}
                          style={{
                            background: "#f0edff",
                            border: "1px solid #d4ccfc",
                            color: "#6557e8",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Make Paid →
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What Paid Students Unlock */}
                <div style={{ background: "linear-gradient(145deg, #f7f5ff, #ffffff)", border: "1px solid #ded6fc", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#6557e8", color: "#fff", display: "grid", placeItems: "center" }}>
                      <Lock size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#2b1c67", margin: 0 }}>Paid Membership Tier (Pro & Pass)</h3>
                      <p style={{ fontSize: "11px", color: "#6557e8", margin: 0 }}>Unlocked when student purchases a 1-Month or 3-Month Plan</p>
                    </div>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
                    {services.filter((s) => s.isPaid).map((s) => (
                      <li key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", padding: "8px 12px", background: "#fff", borderRadius: "8px", border: "1px solid #e7dffd" }}>
                        <div>
                          <span style={{ fontWeight: 600, color: "#4338ca" }}>🔒 {s.name}</span>
                          <span style={{ marginLeft: "8px", fontSize: "10px", color: "#777", background: "#f2f0fc", padding: "2px 6px", borderRadius: "4px" }}>{s.pricingTier}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleService(s.id, s.name, true)}
                          style={{
                            background: "#e8f8f3",
                            border: "1px solid #b7ede5",
                            color: "#2a9d8f",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Make Free →
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Filter and Search Toolbar */}
              <div style={{ display: "flex", gap: "12px", background: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e9e8f1", marginBottom: "20px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#888" }} />
                  <input
                    type="text"
                    placeholder="Search services by title, tier, or features..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "8px",
                      border: "1px solid #dedce9",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setServiceAccessFilter("all")}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: serviceAccessFilter === "all" ? "1px solid #6557e8" : "1px solid #dedce9",
                      background: serviceAccessFilter === "all" ? "#eeebff" : "#fff",
                      color: serviceAccessFilter === "all" ? "#6557e8" : "#555",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    All Services ({services.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceAccessFilter("paid")}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: serviceAccessFilter === "paid" ? "1px solid #6557e8" : "1px solid #dedce9",
                      background: serviceAccessFilter === "paid" ? "#6557e8" : "#fff",
                      color: serviceAccessFilter === "paid" ? "#fff" : "#555",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    🔒 Paid Only ({paidServicesCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceAccessFilter("free")}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: serviceAccessFilter === "free" ? "1px solid #2a9d8f" : "1px solid #dedce9",
                      background: serviceAccessFilter === "free" ? "#2a9d8f" : "#fff",
                      color: serviceAccessFilter === "free" ? "#fff" : "#555",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    ✓ Free Only ({freeServicesCount})
                  </button>
                </div>

                <select
                  value={serviceCategoryFilter}
                  onChange={(e) => setServiceCategoryFilter(e.target.value)}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #dedce9",
                    fontSize: "12px",
                    background: "#fff",
                    cursor: "pointer"
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Question Banks">Question Banks</option>
                  <option value="Clinical Case Studies">Clinical Case Studies</option>
                  <option value="Exam Simulations">Exam Simulations</option>
                  <option value="Video & Lectures">Video & Lectures</option>
                  <option value="Study Aids & Notes">Study Aids & Notes</option>
                  <option value="AI & Tutoring">AI & Tutoring</option>
                  <option value="Assurance & Guarantees">Assurance & Guarantees</option>
                </select>
              </div>

              {/* Detailed Services Master Table */}
              <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8f8fc", borderBottom: "2px solid #edeaf4" }}>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Service Name & Details</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Access Gate</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Pricing Tier</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#555" }}>Category</th>
                      <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "#555" }}>Quick Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((svc) => (
                      <tr key={svc.id} style={{ borderBottom: "1px solid #f1f0f7" }}>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            {svc.isPaid ? <Lock size={15} color="#6557e8" /> : <Unlock size={15} color="#2a9d8f" />}
                            <span style={{ fontWeight: 700, fontSize: "14px", color: "#191a2e" }}>
                              {svc.name}
                            </span>
                          </div>
                          <p style={{ margin: "2px 0 6px", fontSize: "12px", color: "#666", maxWidth: "480px", lineHeight: 1.4 }}>
                            {svc.description}
                          </p>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {(svc.includedFeatures || []).map((f) => (
                              <span key={f} style={{ fontSize: "10px", background: "#f1f0f7", color: "#555", padding: "2px 7px", borderRadius: "4px" }}>
                                • {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "11px",
                              fontWeight: 800,
                              background: svc.isPaid ? "#f0edff" : "#e6f8f1",
                              color: svc.isPaid ? "#6557e8" : "#2a9d8f",
                              border: svc.isPaid ? "1px solid #d4ccfc" : "1px solid #b7ede5"
                            }}
                          >
                            {svc.isPaid ? <Lock size={12} /> : <Check size={12} />}
                            {svc.isPaid ? "PAID ONLY" : "FREE ACCESS"}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "12px", color: "#444" }}>
                          <span style={{ fontWeight: 600 }}>{svc.pricingTier}</span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "12px", color: "#666" }}>
                          {svc.category}
                        </td>
                        <td style={{ padding: "16px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleToggleService(svc.id, svc.name, svc.isPaid)}
                            style={{
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border: svc.isPaid ? "1px solid #b7ede5" : "1px solid #d4ccfc",
                              background: svc.isPaid ? "#e8f8f3" : "#f0edff",
                              color: svc.isPaid ? "#2a9d8f" : "#6557e8",
                              fontWeight: 700,
                              fontSize: "12px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            {svc.isPaid ? (
                              <>
                                <Unlock size={14} /> Make Free
                              </>
                            ) : (
                              <>
                                <Lock size={14} /> Make Paid
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: QUESTION BANK */}
          {activeTab === "question-bank" && (
            <div>
              <div className="welcome-eyebrow admin-eyebrow"><BookOpen size={14} /> SYSTEM QUESTION INVENTORY</div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0", color: "#191a2e" }}>Question Bank Library</h1>
              <p style={{ color: "#666885", marginBottom: "24px" }}>
                Browse full question banks organized across all 8 NCLEX-RN® clinical subjects.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {STANDALONE_SUBJECTS.map((s) => (
                  <div key={s.id} style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191a2e", margin: 0 }}>{s.name}</h3>
                      <span style={{ background: "#f0edff", color: "#6557e8", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700 }}>
                        {s.baseTotal} questions
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#777", marginTop: "8px", marginBottom: "12px" }}>
                      Covers clinical decision making, client assessment, pharmacology interactions, and priority interventions.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStandaloneSubjectFilter(s.id);
                        setActiveTab("standalone");
                      }}
                      style={{
                        background: "#fff",
                        border: "1px solid #dedce9",
                        color: "#6557e8",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Manage Subject Questions →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CASE STUDIES */}
          {activeTab === "case-studies" && (
            <div>
              <div className="welcome-eyebrow admin-eyebrow"><FileCheck2 size={14} /> NGN CLINICAL JUDGMENT SCENARIOS</div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0", color: "#191a2e" }}>Unfolding Clinical Case Studies</h1>
              <p style={{ color: "#666885", marginBottom: "24px" }}>
                Interactive Next Gen case studies measuring the 6 cognitive steps of the NCSBN Clinical Judgment Measurement Model.
              </p>
              <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f0f7", paddingBottom: "16px", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191a2e", margin: 0 }}>Case Study #1: Pediatric Intussusception (6 Items)</h3>
                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>Client: 6-month-old male presenting with intermittent crying, currant jelly stools, and sausage-shaped RUQ mass.</p>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", background: "#e6f8f1", color: "#2a9d8f", fontWeight: 700, fontSize: "11px" }}>
                    Free Sample Trial
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f0f7", paddingBottom: "16px", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191a2e", margin: 0 }}>Case Study #2: Severe Diabetic Ketoacidosis & Sepsis (6 Items)</h3>
                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>Client: 28-year-old female presenting with Kussmaul respirations, glucose 580 mg/dL, and elevated ketones.</p>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", background: "#f0edff", color: "#6557e8", fontWeight: 700, fontSize: "11px" }}>
                    🔒 Paid Membership
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191a2e", margin: 0 }}>Case Study #3: Postpartum Hemorrhage & Uterine Atony (6 Items)</h3>
                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>Client: 32-year-old G2P2 experiencing boggy fundus and excessive lochia rubra following precipitous delivery.</p>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", background: "#f0edff", color: "#6557e8", fontWeight: 700, fontSize: "11px" }}>
                    🔒 Paid Membership
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STUDY RESOURCES */}
          {activeTab === "study-resources" && (
            <div>
              <div className="welcome-eyebrow admin-eyebrow"><Layers3 size={14} /> MULTIMEDIA LEARNING ASSETS</div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0", color: "#191a2e" }}>Study Resources & Crash Courses</h1>
              <p style={{ color: "#666885", marginBottom: "24px" }}>
                Manage high-yield video lectures, pharmacology cheat sheets, and diagnostic study planners.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191a2e" }}>12-Hour Crash Course Video Lectures</h3>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    High-yield video modules with slide breakdowns for every core nursing system. Currently set to: <strong style={{ color: "#6557e8" }}>Paid Membership Only</strong>.
                  </p>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#191a2e" }}>45+ Downloadable Cheat Sheets</h3>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    Printable high-resolution clinical reference sheets, drug classes, and lab ranges. Currently set to: <strong style={{ color: "#6557e8" }}>Paid Membership Only</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STUDENT ACCOUNTS */}
          {activeTab === "student-accounts" && (
            <div>
              <div className="welcome-eyebrow admin-eyebrow"><UsersRound size={14} /> USER MANAGEMENT</div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0", color: "#191a2e" }}>Student Accounts & Access Tiers</h1>
              <p style={{ color: "#666885", marginBottom: "20px" }}>
                Database-backed student sessions, assigned question progress, and server-verified payment access.
              </p>

              <section style={{ background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", padding: "18px", marginBottom: "20px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
                  <label htmlFor="accounts-admin-key" style={{ fontSize: "12px", fontWeight: 700 }}>Admin API key</label>
                  <input id="accounts-admin-key" type="password" autoComplete="current-password" value={keyDraft} onChange={(event) => setKeyDraft(event.target.value)} placeholder="Configured on the API server" style={{ flex: 1, minWidth: "220px", padding: "9px 12px", borderRadius: "8px", border: "1px solid #dedce9", fontSize: "13px" }} />
                  <button type="button" onClick={() => void connectQuestionApi(keyDraft)} style={{ padding: "9px 14px", borderRadius: "8px", border: "none", background: "#1e293b", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Load student records</button>
                </div>
                {!adminApiKey ? <p style={{ color: "#92400e", fontSize: "13px" }}>Connect with the server admin key to view student assignments and payment records.</p> : adminStudents.length === 0 ? <p style={{ color: "#64748b", fontSize: "13px" }}>No student sessions yet. Student dashboards create a private server session on first visit.</p> : <div style={{ display: "grid", gap: "12px" }}>
                  {adminStudents.map((student) => {
                    const draft = paymentDrafts[student.studentId] ?? { paymentReference: "", paidUntil: "" };
                    return <article key={student.studentId} style={{ display: "grid", gap: "10px", padding: "14px", border: "1px solid #e9e8f1", borderRadius: "10px", background: "#fbfbfe" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                        <div><strong style={{ fontSize: "13px" }}>Student {student.studentId.slice(-8)}</strong><div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>Session ID: {student.studentId} · Joined {new Date(student.createdAt).toLocaleDateString()}</div></div>
                        <span style={{ padding: "4px 9px", borderRadius: "999px", fontSize: "11px", fontWeight: 800, background: student.paymentStatus === "paid" ? "#dcfce7" : "#f1f5f9", color: student.paymentStatus === "paid" ? "#166534" : "#475569" }}>{student.paymentStatus === "paid" ? `Paid through ${student.paidUntil ? new Date(student.paidUntil).toLocaleDateString() : "active"}` : "Unpaid"}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#475569" }}>Assigned: {student.assignedCount} · Completed: {student.answeredCount} · Payment reference: {student.paymentReference ?? "—"}</div>
                      {student.paymentStatus === "unpaid" && <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        <input aria-label={`Verified payment reference for ${student.studentId}`} value={draft.paymentReference} onChange={(event) => setPaymentDrafts((current) => ({ ...current, [student.studentId]: { ...draft, paymentReference: event.target.value } }))} placeholder="Verified payment transaction reference" style={{ flex: 2, minWidth: "220px", padding: "8px 10px", borderRadius: "7px", border: "1px solid #dedce9", fontSize: "12px" }} />
                        <input aria-label={`Paid access expiry for ${student.studentId}`} type="date" min={new Date().toISOString().slice(0, 10)} value={draft.paidUntil} onChange={(event) => setPaymentDrafts((current) => ({ ...current, [student.studentId]: { ...draft, paidUntil: event.target.value } }))} style={{ padding: "8px 10px", borderRadius: "7px", border: "1px solid #dedce9", fontSize: "12px" }} />
                        <button type="button" onClick={() => void handleVerifyPayment(student.studentId)} style={{ padding: "8px 12px", borderRadius: "7px", border: "none", background: "#15803d", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Confirm verified payment</button>
                      </div>}
                      {student.paymentStatus === "paid" && <button type="button" onClick={() => void handleRevokeStudentPayment(student.studentId)} style={{ justifySelf: "start", padding: "7px 10px", borderRadius: "7px", border: "1px solid #fecaca", background: "#fff", color: "#b91c1c", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Revoke paid access</button>}
                    </article>;
                  })}
                </div>}
                <p style={{ margin: "14px 0 0", color: "#64748b", fontSize: "11px" }}>Confirm payment only after checking it with your payment provider. This protected admin action writes the entitlement in MongoDB; students cannot unlock paid questions from the browser.</p>
              </section>

              {/* Legacy demo membership is hidden; access now uses persisted verification below. */}
              <div
                style={{
                  background: studentMembership.isPaid ? "linear-gradient(145deg, #fef9c3, #fff)" : "linear-gradient(145deg, #f0edff, #fff)",
                  border: studentMembership.isPaid ? "1.5px solid #f59e0b" : "1.5px solid #c7d2fe",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  marginBottom: "24px",
                  display: "none",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: studentMembership.isPaid ? "#b45309" : "#4338ca", textTransform: "uppercase" }}>
                      CURRENT BROWSER STUDENT SESSION
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 800,
                        backgroundColor: studentMembership.isPaid ? "#f59e0b" : "#e0e7ff",
                        color: studentMembership.isPaid ? "#fff" : "#4338ca"
                      }}
                    >
                      {studentMembership.isPaid ? `⭐ ${studentMembership.planName} ($${studentMembership.amountPaid} Paid)` : "Free Trial Tier (Unpaid)"}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>
                    {studentMembership.isPaid
                      ? "All Paid Questions & Case Studies are Unlocked for the Student"
                      : "Paid Questions are currently Locked behind the Paywall"}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>
                    You can simulate the student paying or reset back to the free trial tier right here to test both experiences live.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  {!studentMembership.isPaid ? (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = purchaseMembership("3-month", 149);
                        setStudentMembership(updated);
                        showToast("⭐ Student account upgraded to Paid ($149 Pro Membership)!");
                      }}
                      style={{
                        background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                        color: "#fff",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Sparkles size={15} /> Simulate Student Payment (Upgrade)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = resetStudentMembership();
                        setStudentMembership(updated);
                        showToast("🔄 Student account reset to Free Trial Tier (Paid questions locked)!");
                      }}
                      style={{
                        background: "#fff",
                        color: "#dc2626",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "1px solid #fecaca",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <RefreshCw size={15} /> Reset to Free Tier (Relock Questions)
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "none", background: "#fff", border: "1px solid #e9e8f1", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8f8fc", borderBottom: "2px solid #edeaf4" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#555" }}>Student</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#555" }}>Email</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#555" }}>Access Tier</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#555" }}>Questions Completed</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", color: "#555" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f1f0f7" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#191a2e" }}>Sarah Jenkins</td>
                      <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>sarah.j@example.com</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#f0edff", color: "#6557e8", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                          3-Month Pass (Paid)
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px" }}>842 / 3,500</td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: "#2a9d8f", fontWeight: 700, fontSize: "11px" }}>Active</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f1f0f7" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#191a2e" }}>Michael Torres</td>
                      <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>m.torres@example.com</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#e6f8f1", color: "#2a9d8f", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                          Free Trial Tier (Unpaid)
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px" }}>36 / 36</td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: "#e76f51", fontWeight: 700, fontSize: "11px" }}>Upgrade Pending</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f1f0f7" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#191a2e" }}>Priya Patel</td>
                      <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>priya.p@example.com</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#f0edff", color: "#6557e8", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                          1-Month Pass (Paid)
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px" }}>415 / 3,500</td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: "#2a9d8f", fontWeight: 700, fontSize: "11px" }}>Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

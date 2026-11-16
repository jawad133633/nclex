import type { ReactElement } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, FileCheck2, FileText,
  HeartPulse, Home, Layers3, LockKeyhole, Search, Settings2, ShieldCheck, UsersRound
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "#overview", icon: Home },
  { label: "Question bank", href: "#question-bank", icon: BookOpen },
  { label: "Case studies", href: "#learning-content", icon: FileCheck2 },
  { label: "Study resources", href: "#learning-content", icon: Layers3 },
  { label: "Student accounts", href: "#student-accounts", icon: UsersRound }
] as const;

const contentRows = [
  { title: "Medication safety review", type: "Question set", subject: "Pharmacology", status: "Draft", updated: "Today" },
  { title: "Foundations of client care", type: "Study guide", subject: "Fundamentals", status: "Needs review", updated: "Yesterday" },
  { title: "Clinical judgment scenario", type: "Case study", subject: "Adult Health", status: "Published", updated: "Nov 14" },
  { title: "Therapeutic communication", type: "Question set", subject: "Mental Health", status: "Published", updated: "Nov 12" }
] as const;

const AdminDashboard = (): ReactElement => (
  <main className="portal-page admin-portal">
    <aside aria-label="Admin workspace navigation" className="portal-sidebar admin-sidebar">
      <Link aria-label="NCLEXLab admin home" className="portal-brand" href="/">
        <span className="portal-brand-mark"><HeartPulse size={20} /></span><span>NCLEX<span>Lab</span></span>
      </Link>
      <div className="workspace-label">ADMIN WORKSPACE</div>
      <nav className="portal-menu" aria-label="Admin navigation">
        {navItems.map(({ href, icon: Icon, label }, index) => (
          <a aria-current={index === 0 ? "page" : undefined} className={`portal-menu-link${index === 0 ? " is-active" : ""}`} href={href} key={label}>
            <Icon aria-hidden="true" size={17} /><span className="portal-menu-label">{label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <a className="portal-menu-link" href="#help"><CircleHelp size={17} /><span className="portal-menu-label">Admin guide</span></a>
      <div className="sidebar-profile"><div className="profile-avatar admin-avatar">AD</div><div><strong>Content admin</strong><small>Example account</small></div><Settings2 aria-hidden="true" className="profile-settings" size={16} /></div>
      <Link className="sidebar-home-link" href="/">← Back to NCLEXLab</Link>
    </aside>

    <section className="portal-main" id="overview">
      <header className="portal-topbar">
        <div className="breadcrumb">Admin workspace <ChevronRight size={14} /> <strong>Overview</strong></div>
        <div className="topbar-actions"><span className="preview-badge admin-preview-badge"><span /> Visual preview</span><span aria-hidden="true" className="icon-button"><Search size={18} /></span><div className="topbar-avatar admin-avatar">AD</div></div>
      </header>

      <div className="portal-content">
        <div className="preview-notice admin-notice"><LockKeyhole size={16} /><span>Admin interface preview only. Authentication, permissions, and content changes are not connected.</span></div>
        <section className="welcome-row admin-welcome">
          <div><div className="welcome-eyebrow admin-eyebrow"><ShieldCheck size={14} /> CONTENT OPERATIONS</div><h1>Good morning, Admin</h1><p>Review learning content and keep the student library organized.</p></div>
          <a className="portal-button portal-button-admin" href="#question-bank"><FileText size={17} /> Explore content queue</a>
        </section>

        <section aria-label="Content overview" className="overview-grid admin-overview-grid">
          <article className="overview-card overview-card-admin"><div className="overview-card-top"><span>Content items</span><span className="soft-icon"><Layers3 size={17} /></span></div><div className="overview-value">128 <small>illustrative library total</small></div><div className="overview-foot"><span className="quiet-foot">Example data only</span><span className="round-arrow"><ArrowRight size={15} /></span></div></article>
          <article className="overview-card"><div className="overview-card-top"><span>Awaiting review</span><span className="soft-icon soft-icon-peach"><FileCheck2 size={17} /></span></div><div className="overview-value">08 <small>sample review items</small></div><div className="overview-foot"><span className="admin-attention"><Activity size={14} /> Review queue</span><span className="round-arrow"><ArrowRight size={15} /></span></div></article>
          <article className="overview-card"><div className="overview-card-top"><span>Published resources</span><span className="soft-icon soft-icon-blue"><Check size={17} /></span></div><div className="overview-value">94 <small>illustrative published count</small></div><div className="overview-foot"><span className="quiet-foot">Example data only</span><span className="round-arrow"><ArrowRight size={15} /></span></div></article>
        </section>

        <section className="content-panel admin-queue-panel" id="question-bank">
          <div className="panel-heading"><div><span className="panel-kicker">CONTENT REVIEW</span><h2>Recently updated learning content</h2></div><a className="inline-link" href="#learning-content">View content library <ArrowRight size={15} /></a></div>
          <div className="admin-table-wrap">
            <table className="admin-content-table">
              <thead><tr><th scope="col">Content</th><th scope="col">Type</th><th scope="col">Subject</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col"><span className="visually-hidden">Action</span></th></tr></thead>
              <tbody>{contentRows.map((row) => <tr key={row.title}><th scope="row"><span className="table-item-icon"><FileText size={16} /></span>{row.title}</th><td>{row.type}</td><td>{row.subject}</td><td><span className={`status-pill status-${row.status.toLowerCase().replaceAll(" ", "-")}`}><i />{row.status}</span></td><td>{row.updated}</td><td><a aria-label={`Open preview for ${row.title}`} className="row-open-link" href="#learning-content"><ChevronRight size={17} /></a></td></tr>)}</tbody>
            </table>
          </div>
          <div className="admin-table-foot"><span>Showing example items to demonstrate the content workflow</span><a href="#learning-content">Go to learning content <ArrowRight size={14} /></a></div>
        </section>

        <div className="admin-lower-grid" id="learning-content">
          <section className="content-panel admin-content-types"><div className="panel-heading"><div><span className="panel-kicker">LEARNING LIBRARY</span><h2>Manage by content type</h2></div></div>
            <a className="admin-type-row" href="#question-bank"><span className="type-icon type-question"><BookOpen size={18} /></span><span><strong>Questions &amp; rationales</strong><small>Review item wording and answer explanations</small></span><ChevronRight size={16} /></a>
            <a className="admin-type-row" href="#question-bank"><span className="type-icon type-case"><FileCheck2 size={18} /></span><span><strong>Case studies</strong><small>Organize scenarios by subject</small></span><ChevronRight size={16} /></a>
            <a className="admin-type-row" href="#question-bank"><span className="type-icon type-resource"><Layers3 size={18} /></span><span><strong>Videos &amp; cheat sheets</strong><small>Keep review resources easy to find</small></span><ChevronRight size={16} /></a>
          </section>
          <section className="content-panel admin-guidance" id="student-accounts"><div className="guidance-icon"><ShieldCheck size={20} /></div><span className="panel-kicker">A TRUSTWORTHY LIBRARY</span><h2>Clear review before content reaches students.</h2><p>Draft, review, publish, and update learning materials through a traceable workflow. Student access should always respect content status and account permissions.</p><div className="guidance-note"><LockKeyhole size={15} /><span>Role permissions belong on the server, not just in the interface.</span></div></section>
        </div>
        <div className="portal-footer" id="help"><span>NCLEXLab · Admin workspace preview</span><a href="/">Visit public site <ArrowRight size={13} /></a></div>
      </div>
    </section>
  </main>
);

export { AdminDashboard };

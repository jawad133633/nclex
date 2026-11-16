import type { ReactElement } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, BookOpen, BookOpenCheck, CalendarDays,
  ChevronRight, CircleHelp, ClipboardCheck, FileText, FlaskConical, HeartPulse, Home,
  Play, Search, Settings2, ShieldCheck, Sparkles, Stethoscope, Sun, Target, UsersRound
} from "lucide-react";

const subjects = [
  { name: "Fundamentals", detail: "Build your nursing foundation", icon: BookOpen, progress: 68, color: "lavender" },
  { name: "Pharmacology", detail: "Review medications and safety", icon: FlaskConical, progress: 42, color: "rose" },
  { name: "Adult Health", detail: "Connect concepts to care", icon: HeartPulse, progress: 57, color: "blue" },
  { name: "Mental Health", detail: "Practice therapeutic judgment", icon: UsersRound, progress: 31, color: "peach" }
] as const;

const menu = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Subjects", href: "#subjects", icon: BookOpen },
  { label: "Practice questions", href: "#practice", icon: ClipboardCheck },
  { label: "Case studies", href: "#resources", icon: FileText },
  { label: "Study schedule", href: "#schedule", icon: CalendarDays },
  { label: "Performance", href: "#performance", icon: Activity }
] as const;

const StudentDashboard = (): ReactElement => (
  <main className="portal-page student-portal">
    <aside aria-label="Student workspace navigation" className="portal-sidebar">
      <Link aria-label="NCLEXLab student home" className="portal-brand" href="/">
        <span className="portal-brand-mark"><HeartPulse size={20} /></span><span>NCLEX<span>Lab</span></span>
      </Link>
      <div className="workspace-label">STUDENT WORKSPACE</div>
      <nav className="portal-menu" aria-label="Student navigation">
        {menu.map(({ href, icon: Icon, label }, index) => (
          <a aria-current={index === 0 ? "page" : undefined} className={`portal-menu-link${index === 0 ? " is-active" : ""}`} href={href} key={label}>
            <Icon aria-hidden="true" size={17} /><span className="portal-menu-label">{label}</span>
            {label === "Subjects" ? <ChevronRight className="menu-chevron" size={14} /> : null}
          </a>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <a className="portal-menu-link" href="#help"><CircleHelp size={17} /><span>Help center</span></a>
      <div className="sidebar-profile">
        <div className="profile-avatar">JS</div>
        <div><strong>Jordan Student</strong><small>NCLEX-RN prep</small></div>
        <Settings2 aria-hidden="true" className="profile-settings" size={16} />
      </div>
      <Link className="sidebar-home-link" href="/">← Back to NCLEXLab</Link>
    </aside>

    <section className="portal-main" id="home">
      <header className="portal-topbar">
        <div className="breadcrumb">Student workspace <ChevronRight size={14} /> <strong>Home</strong></div>
        <div className="topbar-actions"><span className="preview-badge"><span /> Preview · sample data</span><button aria-label="Search student workspace" className="icon-button" type="button"><Search size={18} /></button><div className="topbar-avatar">JS</div></div>
      </header>

      <div className="portal-content">
        <div className="preview-notice"><ShieldCheck size={16} /><span>This is a visual product preview. Your account, study data, and progress are not connected yet.</span></div>
        <section className="welcome-row">
          <div><div className="welcome-eyebrow"><Sparkles size={14} /> YOUR STUDY SPACE</div><h1>Good morning, Jordan <Sun aria-label="sunny" className="sun-glyph" size={26} /></h1><p>A little progress today is still progress. Choose a place to begin.</p></div>
          <a className="portal-button portal-button-primary" href="#practice"><ClipboardCheck size={17} /> Start a practice set</a>
        </section>

        <section aria-label="Study overview" className="overview-grid" id="performance">
          <article className="overview-card overview-card-purple"><div className="overview-card-top"><span>Study rhythm</span><span className="soft-icon"><Activity size={17} /></span></div><div className="overview-value">4 <small>sessions this week</small></div><div className="overview-foot"><span className="positive"><ArrowUpRight size={14} /> Building steadily</span><span className="mini-bars" aria-label="Illustrative weekly study activity"><i /><i /><i /><i /><i /><i /><i /></span></div></article>
          <article className="overview-card"><div className="overview-card-top"><span>Practice reviewed</span><span className="soft-icon soft-icon-blue"><BookOpenCheck size={17} /></span></div><div className="overview-value">36 <small>sample questions</small></div><div className="overview-foot"><span className="quiet-foot">Example dashboard data</span><span className="round-arrow"><ArrowUpRight size={15} /></span></div></article>
          <article className="overview-card"><div className="overview-card-top"><span>Study plan</span><span className="soft-icon soft-icon-peach"><Target size={17} /></span></div><div className="overview-value">On track <small>illustrative status</small></div><div className="overview-foot"><span className="quiet-foot">Adjust your plan anytime</span><span className="round-arrow"><ArrowUpRight size={15} /></span></div></article>
        </section>

        <div className="dashboard-columns">
          <div className="dashboard-primary-column">
            <section className="content-panel schedule-panel" id="schedule">
              <div className="panel-heading"><div><span className="panel-kicker">A PLAN THAT CAN FLEX</span><h2>Your study schedule</h2></div><a className="inline-link" href="#schedule-details">View schedule <ArrowRight size={15} /></a></div>
              <div className="schedule-empty">
                <div className="calendar-illustration"><CalendarDays size={27} /></div>
                <h3>Your next step can start here</h3>
                <p>Create a study rhythm that fits your exam date and the time you have.</p>
                <a className="portal-button portal-button-primary" href="#schedule-details">Explore schedule planning <ArrowRight size={15} /></a>
              </div>
              <div className="week-preview"><div><strong>This week</strong><span>Sample plan preview</span></div><div className="week-days">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span className={index < 4 ? "day-complete" : ""} key={`${day}-${index}`}>{day}<i /></span>)}</div></div>
            </section>

            <section className="subjects-section" id="subjects">
              <div className="panel-heading"><div><span className="panel-kicker">FIND YOUR FOCUS</span><h2>Study by subject</h2></div><a className="inline-link" href="#subject-list">Browse subjects <ArrowRight size={15} /></a></div>
              <div className="subject-grid" id="subject-list">
                {subjects.map(({ color, detail, icon: Icon, name, progress }) => <a className="subject-card" href="#subject-list" key={name}>
                  <div className={`subject-icon subject-${color}`}><Icon size={19} /></div><div className="subject-card-title"><h3>{name}</h3><span><ArrowUpRight size={14} /></span></div><p>{detail}</p><div className="subject-progress-label"><span>Sample progress</span><span>{progress}%</span></div><div aria-label={`Illustrative progress ${progress}%`} className="progress-track"><i style={{ width: `${progress}%` }} /></div>
                </a>)}
              </div>
              <div className="more-subjects">Also in your study library: Child Health, Maternal &amp; Newborn Health, and Management of Care.</div>
            </section>
          </div>

          <aside className="dashboard-side-column">
            <section className="content-panel next-step-panel" id="practice">
              <div className="side-panel-title"><span className="side-title-icon"><ClipboardCheck size={18} /></span><div><span className="panel-kicker">PICK UP WHERE YOU LEFT OFF</span><h2>A focused practice set</h2></div></div>
              <div className="next-step-card"><div className="topic-chip">FUNDAMENTALS</div><h3>Practice with a clear head</h3><p>Choose a question set, take your time, and review the explanations as you go.</p><a className="portal-button portal-button-dark" href="#practice-note">Explore practice options <ArrowRight size={15} /></a></div>
              <div className="practice-note" id="practice-note"><span><BookOpen size={16} /></span><p><strong>Learn as you go</strong><br />Answer review belongs alongside practice.</p></div>
            </section>

            <section className="content-panel resource-panel" id="resources">
              <div className="panel-heading"><div><span className="panel-kicker">QUICK REVIEW</span><h2>Study resources</h2></div><span className="resource-count">3 ways</span></div>
              <a className="resource-link" href="#resources"><span className="resource-icon resource-video"><Play size={15} /></span><span><strong>Crash course videos</strong><small>Review a concept in a few minutes</small></span><ChevronRight size={16} /></a>
              <a className="resource-link" href="#resources"><span className="resource-icon resource-sheets"><FileText size={15} /></span><span><strong>NCLEX cheat sheets</strong><small>Revisit key ideas visually</small></span><ChevronRight size={16} /></a>
              <a className="resource-link" href="#resources"><span className="resource-icon resource-cases"><Stethoscope size={15} /></span><span><strong>Case studies</strong><small>Work through a clinical scenario</small></span><ChevronRight size={16} /></a>
            </section>

            <div className="encouragement-card"><span className="encouragement-spark"><Sparkles size={18} /></span><p>Every thoughtful review gives you something to build on.</p><span className="encouragement-caption">Keep your pace. Keep learning.</span></div>
          </aside>
        </div>
        <div className="portal-footer" id="help"><span>NCLEXLab · Student workspace preview</span><a href="/">Visit public site <ArrowRight size={13} /></a></div>
      </div>
    </section>
  </main>
);

export { StudentDashboard };

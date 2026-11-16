import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BookOpenCheck, CalendarDays, ChartNoAxesColumnIncreasing, Check,
  ChevronDown, CirclePlay, ClipboardCheck, GraduationCap, HeartPulse, Menu, ShieldCheck, Sparkles
} from "lucide-react";

const quickTools = [
  { icon: CirclePlay, label: "Video lessons" },
  { icon: ClipboardCheck, label: "Question practice" },
  { icon: BookOpenCheck, label: "Topic review" },
  { icon: ChartNoAxesColumnIncreasing, label: "Study progress" }
] as const;

const studySteps = [
  { number: "01", title: "Pick a place to start", text: "Choose a subject or continue from your study plan." },
  { number: "02", title: "Practice one step at a time", text: "Work through questions and give yourself room to think." },
  { number: "03", title: "Review what you learned", text: "Use explanations and resources to guide your next session." }
] as const;

const LandingPage = (): ReactElement => (
  <main className="lp-page">
    <section className="lp-hero-wrap" id="home">
      <header className="lp-header">
        <Link aria-label="NCLEXLab home" className="lp-logo" href="/">
          <span aria-hidden="true" className="lp-logo-icon"><GraduationCap size={27} /><HeartPulse size={14} /></span>
          <span className="lp-logo-wordmark">NCLEX<span>Lab</span><small>Study · Practice · Grow</small></span>
        </Link>
        <nav aria-label="Main navigation" className="lp-nav-links">
          <a className="lp-nav-active" href="#home"><HeartPulse size={15} /> Home</a>
          <a href="#features">Features <ChevronDown size={14} /></a>
          <a href="#resources">Resources <ChevronDown size={14} /></a>
          <a href="#student-stories">Why NCLEXLab</a>
          <a href="#get-started">Get started</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="lp-header-actions">
          <Link className="lp-login" href="/student"><span className="lp-user-dot">J</span> Student preview</Link>
          <Link className="lp-button lp-button-glow lp-header-cta" href="/student">Start studying <ArrowRight size={17} /></Link>
        </div>
        <details className="lp-mobile-menu">
          <summary aria-label="Open navigation"><Menu size={22} /></summary>
          <nav aria-label="Mobile navigation">
            <a href="#features">Features</a><a href="#resources">Resources</a><a href="#student-stories">Why NCLEXLab</a><a href="#faq">FAQ</a><Link href="/student">Student preview</Link>
          </nav>
        </details>
      </header>

      <div className="lp-hero-grid">
        <div className="lp-hero-copy">
          <div className="lp-update-pill"><Sparkles size={15} /> A clearer way to prepare for the NCLEX-RN</div>
          <h1>Prepare for the <span>NCLEX-RN.</span><br /><em>One step at a time.</em></h1>
          <p className="lp-hero-lede">Practice nursing questions, understand the reasoning, and build a study routine that fits your life.</p>
          <div className="lp-hero-buttons">
            <Link className="lp-button lp-button-glow" href="/student"><GraduationCap size={18} /> Explore the student workspace <ArrowRight size={17} /></Link>
            <a className="lp-button lp-button-outline" href="#how-it-works"><CirclePlay size={19} /> See how it works</a>
          </div>
          <div className="lp-quick-tools">
            {quickTools.map(({ icon: Icon, label }) => <div className="lp-quick-tool" key={label}><span><Icon size={19} /></span><small>{label}</small></div>)}
          </div>
        </div>

        <div className="lp-hero-visual" aria-label="A preview of NCLEXLab learning tools">
          <div aria-hidden="true" className="lp-hero-glow lp-hero-glow-one" />
          <div aria-hidden="true" className="lp-hero-glow lp-hero-glow-two" />
          <div className="lp-hero-nurse-frame"><Image alt="Nursing student preparing for the NCLEX with a study book" className="lp-hero-nurse" fill priority sizes="(max-width: 760px) 78vw, 36vw" src="/images/nursing-student.jpg" /></div>
          <div className="lp-career-note"><span>Your next chapter</span><strong>starts here.</strong><i /></div>
          <div className="lp-hero-video-card">
            <Image alt="NCLEXLab video lesson preview" fill sizes="(max-width: 760px) 65vw, 24vw" src="/images/video-learning-preview.jpeg" />
            <span className="lp-video-play"><CirclePlay size={44} fill="currentColor" /></span>
          </div>
          <div className="lp-hero-phone" aria-label="Sample mobile study session preview">
            <div className="lp-phone-speaker" />
            <div className="lp-phone-brand"><span><HeartPulse size={13} /></span> NCLEXLab</div>
            <div className="lp-phone-progress"><i /></div>
            <small>STUDY SESSION</small>
            <strong>What would you like to work on?</strong>
            <div className="lp-phone-choice"><BookOpenCheck size={13} /> Practice questions <ArrowRight size={12} /></div>
            <div className="lp-phone-choice"><CalendarDays size={13} /> Study plan <ArrowRight size={12} /></div>
            <div className="lp-phone-choice"><ChartNoAxesColumnIncreasing size={13} /> Review progress <ArrowRight size={12} /></div>
          </div>
          <div className="lp-floating-note"><span><Check size={15} /></span><strong>Learn at your pace</strong></div>
        </div>
      </div>
      <div className="lp-hero-bottom-line" />
    </section>

    <section aria-label="NCLEXLab learning tools" className="lp-trust-strip">
      <div><span><ClipboardCheck size={20} /></span><p><strong>Practice questions</strong><small>Build a steady question habit</small></p></div>
      <i />
      <div><span><BookOpenCheck size={20} /></span><p><strong>Clear explanations</strong><small>Learn the reasoning behind answers</small></p></div>
      <i />
      <div><span><CalendarDays size={20} /></span><p><strong>Flexible study planning</strong><small>Make room for real life</small></p></div>
    </section>

    <section aria-labelledby="lp-practice-title" className="lp-section lp-practice-section" id="features">
      <div className="lp-section-copy">
        <span className="lp-section-kicker">PRACTICE WITH PURPOSE</span>
        <h2 id="lp-practice-title">Questions are a start.<br /><span>Understanding is the goal.</span></h2>
        <p>Use practice to build your thinking, then review explanations that help connect the answer to the concept.</p>
        <ul className="lp-check-list"><li><Check size={16} /> Practice in focused study sessions</li><li><Check size={16} /> Review why an answer makes sense</li><li><Check size={16} /> Return to topics when you need another look</li></ul>
        <Link className="lp-text-link" href="/student">Explore student practice <ArrowRight size={17} /></Link>
      </div>
      <div className="lp-question-preview">
        <div className="lp-question-top"><span><ClipboardCheck size={16} /> PRACTICE PREVIEW</span><small>Example learning flow</small></div>
        <div className="lp-question-progress"><i /></div>
        <div className="lp-question-body"><span className="lp-question-tag">CLINICAL JUDGMENT</span><h3>Pause, think through the situation, and choose your next step.</h3><p>This preview shows how a practice session can present a question and follow it with a clear review.</p></div>
        <div className="lp-answer-row"><span>A</span><i /> Select an answer to continue</div>
        <div className="lp-answer-row"><span>B</span><i /> Review the full scenario</div>
        <div className="lp-answer-row"><span>C</span><i /> Compare your reasoning</div>
        <div className="lp-rationale-preview"><span><Sparkles size={16} /></span><div><strong>Review the reasoning</strong><small>Learn from the explanation after each practice session.</small></div></div>
      </div>
    </section>

    <section className="lp-video-band" id="resources">
      <div className="lp-video-asset"><Image alt="Preview of a short nursing lesson with visual teaching aids" fill sizes="(max-width: 760px) 90vw, 48vw" src="/images/video-learning-preview.jpeg" /><span><CirclePlay size={48} fill="currentColor" /></span></div>
      <div className="lp-video-copy"><span className="lp-section-kicker">SHORT LESSONS, USEFUL REVIEW</span><h2>Make complex topics <em>easier to revisit.</em></h2><p>Use focused video lessons and visual study resources to refresh key concepts in your own study rhythm.</p><ul className="lp-dark-checks"><li><Check size={16} /> Topic-focused video learning</li><li><Check size={16} /> Study aids for quick review</li><li><Check size={16} /> Resources alongside your practice</li></ul><Link className="lp-button lp-button-glow" href="/student">Explore learning resources <ArrowRight size={16} /></Link></div>
    </section>

    <section aria-labelledby="lp-case-title" className="lp-section lp-case-section" id="how-it-works">
      <div className="lp-case-copy"><span className="lp-section-kicker">THINK THROUGH THE SCENARIO</span><h2 id="lp-case-title">Build your nursing judgment, <span>one case at a time.</span></h2><p>Clinical case practice gives you a place to slow down, review the details, and connect information as you learn.</p><Link className="lp-button lp-button-dark" href="/student">See the student experience <ArrowRight size={16} /></Link><div className="lp-case-points"><span><Check size={15} /> Work through a scenario</span><span><Check size={15} /> Review the key information</span><span><Check size={15} /> Learn from the feedback</span></div></div>
      <div className="lp-case-asset"><Image alt="Illustrative case-study learning interface for nursing students" fill sizes="(max-width: 760px) 92vw, 56vw" src="/images/case-study-preview.jpeg" /></div>
    </section>

    <section className="lp-resource-section">
      <div className="lp-resource-asset"><Image alt="Visual study resources for nursing topics" fill sizes="(max-width: 760px) 90vw, 48vw" src="/images/cheat-sheet-preview.jpeg" /></div>
      <div className="lp-resource-copy"><span className="lp-section-kicker">REVIEW THE WAY THAT WORKS FOR YOU</span><h2>Keep helpful study resources <span>close at hand.</span></h2><p>Revisit topics with concise visual aids, focused lessons, and a study plan that helps you find your next step.</p><Link className="lp-text-link" href="/student">Browse the learning workspace <ArrowRight size={17} /></Link><div className="lp-resource-chips"><span>Cheat sheets</span><span>Video lessons</span><span>Study schedule</span></div></div>
    </section>

    <section aria-labelledby="lp-plan-title" className="lp-plan-section">
      <div className="lp-plan-copy"><span className="lp-section-kicker">A PLAN THAT CAN FLEX</span><h2 id="lp-plan-title">Make a study plan <span>that fits your life.</span></h2><p>Turn a big exam goal into a sequence of manageable study sessions. Adjust your plan when your week changes.</p><Link className="lp-button lp-button-glow" href="/student">Explore study planning <ArrowRight size={16} /></Link></div>
      <div className="lp-plan-asset"><Image alt="Personalized study schedule and progress preview" fill sizes="(max-width: 760px) 92vw, 57vw" src="/images/study-plan-preview.jpeg" /></div>
    </section>

    <section aria-labelledby="lp-how-title" className="lp-how-section" id="student-stories">
      <div className="lp-centered-heading"><span className="lp-section-kicker">A SIMPLE STUDY RHYTHM</span><h2 id="lp-how-title">A clearer path from <span>today to test day.</span></h2><p>Keep the pieces of preparation together and focus on the next useful step.</p></div>
      <div className="lp-step-grid">{studySteps.map(({ number, text, title }) => <article className="lp-step-card" key={number}><span>{number}</span><i /><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section aria-labelledby="lp-faq-title" className="lp-faq-section" id="faq">
      <div className="lp-centered-heading"><span className="lp-section-kicker">GOOD TO KNOW</span><h2 id="lp-faq-title">Frequently asked <span>questions.</span></h2><p>Quick answers about the NCLEXLab study experience.</p></div>
      <div className="lp-faq-grid">
        <details><summary>What is NCLEXLab?</summary><p>NCLEXLab is being built as a study space for NCLEX-RN preparation, with practice, explanations, study resources, and planning tools.</p></details>
        <details><summary>Can I choose what to study?</summary><p>The student workspace is designed to help learners move between subjects, practice, and review resources.</p></details>
        <details><summary>Can I use a study schedule?</summary><p>A flexible schedule experience is part of the product plan. The current site preview does not save personal schedules yet.</p></details>
        <details><summary>Does NCLEXLab guarantee an exam result?</summary><p>No. A study resource cannot guarantee an exam result. NCLEXLab is intended to support preparation and learning.</p></details>
        <details><summary>Are the student pages ready to use?</summary><p>The student page currently shows a visual preview. Accounts, personal study history, and content are not connected yet.</p></details>
        <details><summary>How do I see the student workspace?</summary><p>Open the student preview to explore the current dashboard design.</p></details>
      </div>
    </section>

    <section aria-label="Start exploring NCLEXLab" className="lp-final-cta" id="get-started">
      <div className="lp-final-mark"><GraduationCap size={44} /><HeartPulse size={25} /></div>
      <div><span className="lp-section-kicker">YOUR NEXT STUDY SESSION STARTS HERE</span><h2>Build your preparation <em>one question at a time.</em></h2></div>
      <Link className="lp-button lp-button-pink" href="/student">Explore NCLEXLab <ArrowRight size={17} /></Link>
    </section>

    <footer className="lp-footer">
      <div className="lp-footer-brand"><Link aria-label="NCLEXLab home" className="lp-logo" href="/"><span aria-hidden="true" className="lp-logo-icon"><GraduationCap size={26} /><HeartPulse size={14} /></span><span className="lp-logo-wordmark">NCLEX<span>Lab</span><small>Study · Practice · Grow</small></span></Link><p>A focused space for your NCLEX-RN preparation journey.</p></div>
      <div className="lp-footer-column"><strong>Explore</strong><a href="#features">Features</a><a href="#resources">Study resources</a><a href="#how-it-works">How it works</a></div>
      <div className="lp-footer-column"><strong>Study</strong><a href="#features">Question practice</a><a href="#resources">Video lessons</a><a href="#faq">Study planning</a></div>
      <div className="lp-footer-column"><strong>NCLEXLab</strong><a href="#student-stories">Our approach</a><a href="#faq">FAQ</a><Link href="/student">Student preview</Link></div>
      <div className="lp-footer-bottom"><span>© 2026 NCLEXLab</span><span>Study · Practice · Grow</span></div>
    </footer>
  </main>
);

export { LandingPage };

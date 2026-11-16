import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, ClipboardCheck, HeartPulse, ListChecks, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: ClipboardCheck,
    title: "Practice with purpose",
    description: "Build a steady question habit and make room to think through each choice."
  },
  {
    icon: BookOpenCheck,
    title: "Understand the why",
    description: "Use clear explanations to turn practice into learning you can carry forward."
  },
  {
    icon: ListChecks,
    title: "Know what comes next",
    description: "Bring questions, review, and a flexible study plan into one focused space."
  }
] as const;

const steps = [
  { number: "01", title: "Choose a place to begin", text: "Start with a subject, a question set, or the next item in your study plan." },
  { number: "02", title: "Practice your thinking", text: "Work through nursing scenarios one step at a time." },
  { number: "03", title: "Review and keep moving", text: "Learn from explanations and return to the topics you want to strengthen." }
] as const;

const LandingPage = (): ReactElement => (
  <main className="marketing-page">
    <header className="marketing-nav">
      <Link aria-label="NCLEXLab home" className="brand-lockup" href="/">
        <span aria-hidden="true" className="brand-mark"><HeartPulse size={21} strokeWidth={2.4} /></span>
        <span>NCLEX<span className="brand-accent">Lab</span></span>
      </Link>
      <nav aria-label="Main navigation" className="marketing-links">
        <a href="#approach">Our approach</a>
        <a href="#tools">Study tools</a>
        <a href="#questions">FAQs</a>
      </nav>
      <div className="marketing-nav-actions">
        <Link className="text-link" href="/student">Student preview</Link>
        <Link className="button button-small button-primary" href="/student">Explore NCLEXLab <ArrowRight size={16} /></Link>
      </div>
    </header>

    <section aria-labelledby="hero-title" className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15} /> A calmer way to prepare</div>
        <h1 id="hero-title">Your NCLEX journey, <span>one confident step at a time.</span></h1>
        <p className="hero-lede">Practice nursing questions, understand the reasoning, and shape a study plan that works for your life.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/student">Explore the student workspace <ArrowRight size={17} /></Link>
          <a className="button button-quiet" href="#approach">See how it works</a>
        </div>
        <div className="hero-note"><span className="note-dot" /> Practice, review, and plan in one focused space.</div>
      </div>
      <div className="hero-art">
        <div className="hero-image-frame">
          <Image alt="Nursing student reviewing a textbook while preparing for the NCLEX" className="hero-photo" fill priority sizes="(max-width: 800px) 90vw, 42vw" src="/images/nursing-student.jpg" />
        </div>
        <div className="hero-float-card">
          <span className="float-icon"><BookOpenCheck size={18} /></span>
          <span><strong>Learn as you practice</strong><small>Make each question count</small></span>
        </div>
        <div aria-hidden="true" className="hero-orbit orbit-one" />
        <div aria-hidden="true" className="hero-orbit orbit-two" />
      </div>
      <div aria-hidden="true" className="hero-bottom-wash" />
    </section>

    <section aria-label="NCLEXLab study approach" className="promise-strip">
      <span>Made for the way nursing students study</span>
      <i />
      <span>Clear practice</span><i />
      <span>Useful explanations</span><i />
      <span>A plan that can flex</span>
    </section>

    <section aria-labelledby="approach-title" className="section section-approach" id="approach">
      <div className="section-heading">
        <span className="section-kicker">A steady path forward</span>
        <h2 id="approach-title">Good preparation is more than getting through questions.</h2>
        <p>It is knowing what you are practicing, learning from your answers, and finding a next step that feels manageable.</p>
      </div>
      <div className="benefit-grid" id="tools">
        {benefits.map(({ description, icon: Icon, title }, index) => (
          <article className="benefit-card" key={title}>
            <div className={`benefit-icon benefit-icon-${index + 1}`}><Icon aria-hidden="true" size={22} /></div>
            <span className="card-index">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>

    <section aria-labelledby="workspace-title" className="workspace-section">
      <div className="workspace-copy">
        <span className="section-kicker">One focused workspace</span>
        <h2 id="workspace-title">Spend less time wondering what to do next.</h2>
        <p>Move naturally between your study plan, subjects, practice questions, and review. Keep your attention on learning—not juggling tabs.</p>
        <ul className="check-list">
          <li><span><ListChecks size={17} /></span> A clear next step for each study session</li>
          <li><span><BookOpenCheck size={17} /></span> Practice and explanations close together</li>
          <li><span><HeartPulse size={17} /></span> A familiar rhythm across your subjects</li>
        </ul>
        <Link className="inline-link" href="/student">Take a look inside <ArrowRight size={17} /></Link>
      </div>
      <div className="workspace-preview-card">
        <div className="preview-window-bar"><span /><span /><span /><small>NCLEXLab · Student workspace preview</small></div>
        <Image alt="Preview of the NCLEXLab student dashboard with study schedule and subject areas" className="workspace-preview-image" height={1000} src="/images/student-dashboard-preview.png" width={1500} />
      </div>
    </section>

    <section aria-labelledby="steps-title" className="section steps-section">
      <div className="section-heading section-heading-center">
        <span className="section-kicker">A simple study rhythm</span>
        <h2 id="steps-title">Start where you are. Keep building.</h2>
      </div>
      <div className="steps-grid">
        {steps.map(({ number, text, title }) => (
          <article className="step-card" key={number}>
            <span className="step-number">{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>

    <section aria-labelledby="questions-title" className="section faq-section" id="questions">
      <div>
        <span className="section-kicker">A little more clarity</span>
        <h2 id="questions-title">Common questions</h2>
        <p>Clear answers to help you decide how NCLEXLab fits into your study routine.</p>
      </div>
      <div className="faq-list">
        <details><summary>What can I do with NCLEXLab?</summary><p>NCLEXLab is designed to bring practice questions, learning resources, study planning, and progress review into one place. Features shown in this preview are still being built.</p></details>
        <details><summary>Can I make a study plan around my schedule?</summary><p>The study experience is being planned to support flexible study routines. The schedule builder is not connected in this preview.</p></details>
        <details><summary>Does using NCLEXLab guarantee that I will pass?</summary><p>No study resource can guarantee an exam result. NCLEXLab is intended to support preparation with practice and review.</p></details>
      </div>
    </section>

    <section aria-label="Explore the NCLEXLab preview" className="faq-band">
      <div>
        <span className="section-kicker">A little more clarity</span>
        <h2>Preparing can feel like a lot. Your next step does not have to.</h2>
        <p>Explore the student workspace preview to see how NCLEXLab brings the pieces of study together.</p>
      </div>
      <Link className="button button-light" href="/student">Explore the preview <ArrowRight size={17} /></Link>
    </section>

    <footer className="marketing-footer">
      <Link aria-label="NCLEXLab home" className="brand-lockup" href="/">
        <span aria-hidden="true" className="brand-mark"><HeartPulse size={19} strokeWidth={2.4} /></span>
        <span>NCLEX<span className="brand-accent">Lab</span></span>
      </Link>
      <p>Support for the work you are putting in.</p>
      <span className="footer-caption">NCLEXLab · Learning experience preview</span>
    </footer>
  </main>
);

export { LandingPage };

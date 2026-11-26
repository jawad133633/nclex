"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BookOpenCheck, CalendarDays, ChartNoAxesColumnIncreasing, Check,
  CheckSquare, ChevronDown, CirclePlay, ClipboardCheck, Cpu, FileText,
  GraduationCap, HeartPulse, Home, Menu, Rocket, ShieldCheck, Sparkles,
  Star, Stethoscope, TrendingUp, Trophy, User, Users, Zap
} from "lucide-react";
import { AuthCard, type AuthMode } from "@/features/auth";

const quickTools = [
  { icon: CirclePlay, label: "Video Walkthroughs" },
  { icon: FileText, label: "Cheat Sheets" },
  { icon: CheckSquare, label: "CAT Readiness Exams" },
  { icon: TrendingUp, label: "Detailed Analytics" }
] as const;

const studySteps = [
  { number: "01", title: "Pick a place to start", text: "Choose a subject or continue from your study plan." },
  { number: "02", title: "Practice one step at a time", text: "Work through questions and give yourself room to think." },
  { number: "03", title: "Review what you learned", text: "Use explanations and resources to guide your next session." }
] as const;

const LandingPage = (): ReactElement => {
  const [authModalMode, setAuthModalMode] = useState<AuthMode | null>(null);

  return (
    <main className="lp-page">
      <section className="lp-hero-wrap" id="home">
        <header className="lp-header">
          <Link aria-label="NCLEXLab home" className="lp-logo" href="/">
            <span aria-hidden="true" className="lp-logo-icon">
              <GraduationCap size={44} />
              <Stethoscope size={31} />
            </span>
            <span className="lp-logo-wordmark">
              NCLEX<span>Lab</span>
              <small>Study · Practice · Pass</small>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="lp-nav-links">
            <a className="lp-nav-active" href="#home"><Home size={15} fill="currentColor" /> Home</a>
            <a href="#features">Features <ChevronDown size={14} /></a>
            <a href="#resources">Resources <ChevronDown size={14} /></a>
            <a href="#student-stories">Reviews</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-header-actions">
            <button
              type="button"
              className="lp-login-pill"
              onClick={() => setAuthModalMode("login")}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <span className="lp-login-user-icon"><User size={14} /></span>
              <span>Log In</span>
            </button>
            <button
              type="button"
              className="lp-button lp-button-glow lp-header-cta"
              onClick={() => setAuthModalMode("signup")}
              style={{ cursor: "pointer" }}
            >
              Start Studying Free <ArrowRight size={17} />
            </button>
          </div>
          <details className="lp-mobile-menu">
            <summary aria-label="Open navigation"><Menu size={22} /></summary>
            <nav aria-label="Mobile navigation">
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#resources">Resources</a>
              <a href="#student-stories">Reviews</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <button
                type="button"
                onClick={() => setAuthModalMode("login")}
                style={{ textAlign: "left", background: "none", border: "none", padding: "8px 0", color: "#ffffff", fontSize: "15px", cursor: "pointer" }}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthModalMode("signup")}
                style={{ textAlign: "left", background: "none", border: "none", padding: "8px 0", color: "#fbbf24", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
              >
                Start Studying Free
              </button>
            </nav>
          </details>
        </header>

        <div className="lp-hero-grid">
        <div className="lp-hero-copy">
          <div className="lp-update-pill">
            <Zap size={14} fill="#FBBF24" color="#FBBF24" />
            <span>Updated for the 2026 NCLEX-RN® Test Plan</span>
          </div>

          <h1 className="lp-hero-title">
            Pass the <span className="lp-highlight-gold">NCLEX-RN<sup>®</sup>.</span>
            <span className="lp-brush-underline-wrap" aria-hidden="true">
              <svg
                className="lp-hero-brush-svg"
                viewBox="0 0 320 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 14C58 4 172 3 316 9C260 15 142 17 4 14Z"
                  fill="#FFBF32"
                />
              </svg>
            </span>
            <br />
            Guaranteed.
          </h1>

          <p className="lp-hero-lede">
            Get the most representative NCLEX® questions with video walkthroughs,
            cheat sheets, CAT readiness exams, and more — all in one powerful platform.
          </p>

          <div className="lp-hero-buttons">
            <button
              type="button"
              className="lp-button lp-button-glow lp-btn-start"
              onClick={() => setAuthModalMode("signup")}
              style={{ cursor: "pointer", border: "none" }}
            >
              <Rocket size={18} /> Start Studying for Free <ArrowRight size={17} />
            </button>
            <a className="lp-button lp-button-outline" href="#how-it-works">
              <CirclePlay size={18} fill="currentColor" /> See How It Works
            </a>
          </div>

          <div className="lp-quick-tools">
            {quickTools.map(({ icon: Icon, label }) => (
              <div className="lp-quick-tool" key={label}>
                <span className="lp-quick-tool-icon">
                  <Icon size={20} />
                </span>
                <small>{label}</small>
              </div>
            ))}
          </div>

          {/* Floating WHY NURSES CHOOSE US stats card */}
          <div className="lp-hero-stats-card">
            <div className="lp-why-badge">
              <Star size={12} fill="#FBBF24" color="#FBBF24" />
              <span>WHY NURSES CHOOSE US</span>
            </div>

            <div className="lp-stats-inner">
              <div className="lp-gauge-box">
                <div className="lp-gauge-circle-wrap">
                  <svg className="lp-gauge-svg" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00F2FE" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gaugeGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="263.89"
                      strokeDashoffset="1.2"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="lp-gauge-center">
                    <strong className="lp-gauge-value">99.6%</strong>
                    <span className="lp-gauge-label">PASS RATE</span>
                  </div>
                </div>
                <small className="lp-gauge-subtext">on the first attempt</small>
              </div>

              <div className="lp-stats-content">
                <div className="lp-stats-top-row">
                  <div className="lp-stat-questions">
                    <div className="lp-questions-val">3,500+</div>
                    <div className="lp-questions-desc">
                      Next-Gen (NGN) <small>Questions</small>
                    </div>
                    <span className="lp-ngn-aligned-pill">Next-Gen NCLEX Aligned</span>
                  </div>

                  <div className="lp-ai-path-box">
                    <div className="lp-ai-chip-icon">
                      <Cpu size={22} />
                    </div>
                    <div className="lp-ai-path-text">
                      <strong>Personalized</strong>
                      <span>AI Study Path</span>
                    </div>
                  </div>
                </div>

                <Link className="lp-practice-test-btn" href="/student">
                  <span className="lp-practice-btn-title">
                    Take a Free Practice Test <ArrowRight size={16} />
                  </span>
                  <span className="lp-practice-btn-sub">
                    Get instant performance feedback • No credit card required
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-hero-visual" aria-label="A preview of NCLEXLab learning tools">
          <div aria-hidden="true" className="lp-hero-glow lp-hero-glow-one" />
          <div aria-hidden="true" className="lp-hero-glow lp-hero-glow-two" />
          <div className="lp-hero-art-container">
            <Image
              alt="Nursing student preparing for the NCLEX with study guide, video walkthrough, and mobile exam practice"
              className="lp-hero-art-img"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
              src="/images/hero-visual-art-clean.png"
            />
          </div>
        </div>
      </div>

      <div className="lp-hero-floor-curve" aria-hidden="true">
        <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none">
          <path
            d="M0 80 C 360 140, 720 40, 1440 90 L 1440 180 L 0 180 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>

    <section aria-label="NCLEXLab key guarantees" className="lp-trust-strip">
      <div className="lp-trust-col">
        <span className="lp-trust-icon lp-trust-icon-blue">
          <ShieldCheck size={22} />
        </span>
        <p>
          <strong>100% Exam-Focused</strong>
          <small>Content</small>
        </p>
      </div>
      <div className="lp-trust-divider" aria-hidden="true" />
      <div className="lp-trust-col">
        <span className="lp-trust-icon lp-trust-icon-purple">
          <Users size={22} />
        </span>
        <p>
          <strong>Trusted by Thousands</strong>
          <small>of Nursing Students</small>
        </p>
      </div>
      <div className="lp-trust-divider" aria-hidden="true" />
      <div className="lp-trust-col">
        <span className="lp-trust-icon lp-trust-icon-gold">
          <Trophy size={22} />
        </span>
        <p>
          <strong>Boost Your Confidence</strong>
          <small>&amp; Pass Faster</small>
        </p>
      </div>
    </section>

    <div className="sr-only" aria-hidden="true">
      The application foundation is running{" "}
      <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.example.test"}/health`}>
        health status
      </a>
    </div>

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
      <div className="lp-footer-brand"><Link aria-label="NCLEXLab home" className="lp-logo" href="/"><span aria-hidden="true" className="lp-logo-icon"><GraduationCap size={44} /><Stethoscope size={31} /></span><span className="lp-logo-wordmark">NCLEX<span>Lab</span><small>Study · Practice · Pass</small></span></Link><p>A focused space for your NCLEX-RN preparation journey.</p></div>
      <div className="lp-footer-column"><strong>Explore</strong><a href="#features">Features</a><a href="#resources">Study resources</a><a href="#how-it-works">How it works</a></div>
      <div className="lp-footer-column"><strong>Study</strong><a href="#features">Question practice</a><a href="#resources">Video lessons</a><a href="#faq">Study planning</a></div>
      <div className="lp-footer-column"><strong>NCLEXLab</strong><a href="#student-stories">Our approach</a><a href="#faq">FAQ</a><Link href="/student">Student preview</Link></div>
      <div className="lp-footer-bottom"><span>© 2026 NCLEXLab</span><span>Study · Practice · Grow</span></div>
    </footer>

    {authModalMode && (
      <div className="auth-modal-backdrop" onClick={() => setAuthModalMode(null)}>
        <div onClick={(e) => e.stopPropagation()}>
          <AuthCard
            initialMode={authModalMode}
            isModal
            onClose={() => setAuthModalMode(null)}
            onSuccess={() => setAuthModalMode(null)}
          />
        </div>
      </div>
    )}
  </main>
);
};

export { LandingPage };

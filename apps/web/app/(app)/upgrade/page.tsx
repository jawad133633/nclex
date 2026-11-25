"use client";

import React, { useState } from "react";
import Link from "next/link";
import { purchaseMembership } from "@/features/shared/membership-store";
import {
  Shield,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Award,
  BookOpen,
  Sparkles,
  Play,
  FileText,
  Clock,
  HelpCircle,
  Lock,
  ArrowLeft,
  X
} from "lucide-react";

interface PlanTier {
  id: string;
  name: string;
  duration: string;
  price: number;
  monthlyEquivalent: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

const plans: PlanTier[] = [
  {
    id: "1-month",
    name: "1-Month Membership",
    duration: "1 Month Access",
    price: 99,
    monthlyEquivalent: "Billed once as $99",
    features: [
      "2,800+ NCLEX-RN® Practice Questions",
      "50 Next Gen Case Studies (CJMM)",
      "1 Adaptive CAT Readiness Exam",
      "Detailed Visual Rationales & Explanations",
      "Mobile App & Tablet Access",
      "Ask NCLEX AI Clinical Tutor (Standard)",
      "Continuous Question Bank Updates"
    ]
  },
  {
    id: "3-month",
    name: "3-Month Membership",
    duration: "3 Months Access",
    price: 149,
    monthlyEquivalent: "Just $49/mo · Billed once as $149",
    badge: "MOST POPULAR",
    isPopular: true,
    features: [
      "Everything in 1-Month Plan, PLUS:",
      "4 Full-Length Adaptive CAT Readiness Exams",
      "Complete Crash Course Video Library (all subjects)",
      "140+ Downloadable High-Yield Cheat Sheets",
      "100% Pass Guarantee (Pass or full refund)",
      "Personalized Custom Study Schedule Generator",
      "Ask NCLEX AI 24/7 Unlimited Clinical Tutor",
      "Detailed Performance Analytics & Score Predictor"
    ]
  },
  {
    id: "6-month",
    name: "6-Month Membership",
    duration: "6 Months Access",
    price: 199,
    monthlyEquivalent: "Just $33/mo · Billed once as $199",
    badge: "BEST VALUE",
    features: [
      "Everything in 3-Month Plan, PLUS:",
      "180 Days Extended Access for Maximum Flexibility",
      "One-Click Question Bank & CAT Exam Reset",
      "Priority Clinical Nurse Educator Support",
      "100% Pass Guarantee (Pass or full refund)",
      "Pharmacology & Med-Surg Video Deep Dives",
      "Early Access to Brand New NCLEX Case Studies"
    ]
  }
];

const videoTestimonials = [
  {
    name: "Sarah Jenkins, BSN, RN",
    school: "Emory University",
    score: "Passed in 85 Questions",
    avatar: "/images/avatar-caroline.jpg",
    quote:
      "nclex.com looked identical to the actual Pearson VUE exam screen. When I sat for my test, my anxiety completely vanished because I had already solved all the case studies here!",
    tag: "First-Time Pass"
  },
  {
    name: "Alex Mendez, RN",
    school: "UT Health Science Center",
    score: "Passed Next Gen NCLEX®",
    avatar: "/images/avatar-alex.jpg",
    quote:
      "I am a repeat test taker who failed with another prep course. nclex.com's crash course videos and cheat sheets connected the dots for me. Best investment of my nursing career.",
    tag: "Repeat Test Taker"
  },
  {
    name: "Marcus Thorne, RN",
    school: "Chamberlain University",
    score: "Passed in 85 Questions",
    avatar: "/images/landing-hero-nurse.jpg",
    quote:
      "The CAT exams predicted my readiness perfectly. I took 4 CATs on nclex.com, got 'Very High' likelihood of passing, and the real exam shut off at question 85!",
    tag: "CAT Simulator"
  },
  {
    name: "Elena Rostova, MSN, RN",
    school: "Johns Hopkins",
    score: "Passed First Attempt",
    avatar: "/images/avatar-caroline.jpg",
    quote:
      "The pediatric intussusception and cardiac case studies on nclex.com were virtually identical to the clinical scenarios I encountered on test day. Highly recommended!",
    tag: "Next Gen Cases"
  }
];

const comparisonFeatures = [
  { name: "2,800+ Next-Gen NGN Questions", nclex: true, uworld: true, archer: true, kaplan: false },
  { name: "Exact Pearson VUE UI Replica", nclex: true, uworld: true, archer: false, kaplan: false },
  { name: "Full Video Crash Course Lectures", nclex: true, uworld: false, archer: true, kaplan: true },
  { name: "140+ High-Yield Illustrated Cheat Sheets", nclex: true, uworld: false, archer: false, kaplan: false },
  { name: "Adaptive CAT Readiness Exams with Predictor", nclex: true, uworld: true, archer: true, kaplan: true },
  { name: "24/7 AI Clinical Tutor Rationale Assistant", nclex: true, uworld: false, archer: false, kaplan: false },
  { name: "100% Money-Back Pass Guarantee", nclex: true, uworld: false, archer: false, kaplan: false },
  { name: "Starting Price", nclex: "$99", uworld: "$139", archer: "$119", kaplan: "$249" }
];

const faqs = [
  {
    q: "How does the 100% Pass Guarantee work?",
    a: "If you purchase the 3-Month or 6-Month Membership, complete 100% of the question bank and achieve a 'High' or 'Very High' on at least one CAT Readiness Exam, and do not pass your NCLEX®, we will issue a full 100% refund of your purchase. No hassle."
  },
  {
    q: "Can I access the official NCLEX Upgrade page?",
    a: "Yes! You can visit https://nclex.com/upgrade anytime using the official link provided at the top and bottom of this page."
  },
  {
    q: "When does my membership access start?",
    a: "Your membership begins immediately upon checkout. You'll gain instant unlock to all 2,800+ questions, 50 case studies, video crash courses, cheat sheets, and CAT exams."
  },
  {
    q: "Is nclex.com completely updated for the Next Generation NCLEX (NGN)?",
    a: "Yes! 100% of our clinical scenarios, case studies, matrix questions, cloze drop-downs, drag-and-drops, and highlight items reflect the latest NCSBN Clinical Judgment Measurement Model (CJMM)."
  },
  {
    q: "Can I use nclex.com on my phone, iPad, or tablet?",
    a: "Yes, nclex.com is 100% responsive and accessible on any smartphone, tablet, laptop, or desktop browser with seamless real-time sync across your devices."
  }
];

export default function UpgradePage(): React.ReactElement {
  const [selectedPlan, setSelectedPlan] = useState<string>("3-month");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<PlanTier | null>(null);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);

  const activePlan: PlanTier = plans.find((p) => p.id === selectedPlan) || plans[1]!;

  const handleApplyPromo = () => {
    if (
      promoCode.trim().toLowerCase() === "nclexbf26" ||
      promoCode.trim().toLowerCase() === "nclex" ||
      promoCode.trim().toLowerCase() === "nclex10"
    ) {
      setPromoApplied(true);
    } else {
      alert("Invalid promo code. Try 'NCLEXBF26' for 20% off!");
    }
  };

  const handleCompleteOrder = () => {
    setIsSuccess(true);
    const planToBuy = checkoutModalPlan || activePlan;
    const finalAmount = promoApplied ? Math.round(planToBuy.price * 0.8) : planToBuy.price;
    purchaseMembership(planToBuy.id as any, finalAmount);
    setTimeout(() => {
      setIsSuccess(false);
      setCheckoutModalPlan(null);
      alert("Payment Successful! $ " + finalAmount + " paid. Welcome to nclex.com Full Membership.");
      window.location.href = "/student";
    }, 1800);
  };

  return (
    <div style={{ background: "#f8fafc", color: "#0f172a", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* 1. Top Sale Announcement Bar (Matches media_1795426386949_f17cb253.jpg exactly!) */}
      {isBannerVisible && (
        <div
          style={{
            background: "#f43f5e",
            color: "#ffffff",
            padding: "8px 24px",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/images/avatar-caroline.jpg"
              alt="Educator"
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid #ffffff"
              }}
            />
            <span>
              Black Friday – <strong>20% OFF EVERYTHING</strong> – use code <strong>NCLEXBF26</strong> at checkout!
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsBannerVisible(false)}
            aria-label="Dismiss banner"
            style={{
              position: "absolute",
              right: 18,
              background: "transparent",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: 4,
              display: "grid",
              placeItems: "center"
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar (Exact replica of media_1795426386949_f17cb253.jpg) */}
      <header
        style={{
          background: "#0e1320",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "16px 36px"
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {/* Logo Brand: Icon + nclex.com | NCLEX® */}
          <Link
            href="/student"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none"
            }}
          >
            {/* Circle star icon matching media_1795426386949_f17cb253.jpg */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "2px solid #ffffff",
                display: "grid",
                placeItems: "center",
                color: "#ffffff"
              }}
            >
              <Star size={13} fill="#ffffff" color="#ffffff" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", letterSpacing: "-0.02em" }}>
                nclex.com
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 18, fontWeight: 300 }}>|</span>
              <span style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", letterSpacing: "-0.01em" }}>
                NCLEX®
              </span>
            </div>
          </Link>

          {/* Right Navigation Links & Start Studying Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 14.5, fontWeight: 500 }}>
              <Link href="/student" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                Educators
              </Link>

              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#cbd5e1", cursor: "pointer" }}>
                <span>Resources</span>
                <ChevronDown size={14} />
              </div>

              <Link href="/student" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                Reviews
              </Link>

              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                Pricing
              </span>

              <Link href="/student" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                Log In
              </Link>
            </nav>

            {/* Start Studying Pill Button */}
            <button
              type="button"
              onClick={() => setCheckoutModalPlan(activePlan ?? null)}
              style={{
                background: "#6366f1",
                color: "#ffffff",
                border: "none",
                borderRadius: 9999,
                padding: "10px 24px",
                fontSize: 14.5,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
                transition: "background 0.2s ease"
              }}
            >
              Start Studying
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Header Section (Exact replica of media_1795426386949_f17cb253.jpg) */}
      <section
        style={{
          background: "linear-gradient(100deg, #0e1320 0%, #12192d 55%, #18223f 100%)",
          color: "#ffffff",
          padding: "60px 36px 80px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 40,
            alignItems: "center"
          }}
        >
          {/* Left Text Column */}
          <div>
            <h1
              style={{
                fontSize: "clamp(38px, 5.5vw, 64px)",
                fontWeight: 900,
                lineHeight: 1.08,
                margin: "0 0 20px",
                letterSpacing: "-0.035em",
                color: "#ffffff"
              }}
            >
              Pass the NCLEX®.
              <br />
              Guaranteed.
            </h1>

            <p
              style={{
                fontSize: "clamp(16px, 2vw, 19px)",
                color: "#cbd5e1",
                margin: "0 0 28px",
                maxWidth: 580,
                lineHeight: 1.55,
                fontWeight: 400
              }}
            >
              Trusted by 200,000+ students preparing for the NCLEX®. Guaranteed.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "8px 20px",
                borderRadius: 9999
              }}
            >
              <div style={{ display: "flex", color: "#facc15", fontSize: 16 }}>
                {"★★★★★"}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#ffffff" }}>4.9 / 5</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>from 1,840+ verified nursing graduates</span>
            </div>
          </div>

          {/* Right Graduate Image Column (Matching graduate holding gold balloons) */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div
              style={{
                position: "relative",
                width: 380,
                height: 380,
                borderRadius: "50%",
                padding: 10,
                background: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <img
                src="/images/landing-hero-nurse.jpg"
                alt="NCLEX Graduate"
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                  border: "4px solid rgba(255, 255, 255, 0.15)"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing Cards Section (Clean White Cards matching media_1795425515670_46909393.png) */}
      <section style={{ maxWidth: 1180, margin: "-40px auto 40px", padding: "0 20px", position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 26,
            alignItems: "stretch"
          }}
        >
          {plans.map((plan) => {
            const isFeatured = plan.isPopular;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  background: "#ffffff",
                  border: isFeatured ? "2px solid #6366f1" : "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: isFeatured
                    ? "0 20px 40px -10px rgba(99, 102, 241, 0.25), 0 0 0 1px #6366f1"
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.06)",
                  cursor: "pointer",
                  transform: isFeatured ? "scale(1.02)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: isFeatured
                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                        : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "5px 14px",
                      borderRadius: 20,
                      boxShadow: "0 4px 12px rgba(217, 119, 6, 0.4)"
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: "#0f172a" }}>{plan.name}</h3>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{plan.duration}</div>
                </div>

                <div style={{ marginBottom: 24, paddingBottom: 22, borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
                      ${plan.price}
                    </span>
                    <span style={{ fontSize: 14, color: "#64748b" }}>USD</span>
                  </div>
                  <div style={{ fontSize: 13, color: isFeatured ? "#6366f1" : "#64748b", marginTop: 4, fontWeight: 600 }}>
                    {plan.monthlyEquivalent}
                  </div>
                </div>

                {/* Features List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, marginBottom: 30 }}>
                  {plan.features.map((feat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, lineHeight: 1.45 }}>
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9999,
                          background: isFeatured ? "#6366f1" : "#e2e8f0",
                          color: isFeatured ? "#fff" : "#475569",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          marginTop: 1
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span style={{ color: feat.startsWith("Everything") ? "#6366f1" : "#334155", fontWeight: feat.startsWith("Everything") ? 700 : 400 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCheckoutModalPlan(plan);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: 12,
                    border: "none",
                    background: isFeatured
                      ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                      : "#0f172a",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: isFeatured ? "0 4px 18px rgba(99, 102, 241, 0.4)" : "none",
                    transition: "transform 0.15s ease"
                  }}
                >
                  <span>Select {plan.duration}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Official nclex.com notice */}
        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            padding: "16px 24px",
            background: "#ffffff",
            border: "1px dashed #cbd5e1",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >
          <span style={{ fontSize: 14, color: "#475569" }}>
            Want to complete checkout directly on nclex.com?
          </span>
          <a
            href="https://nclex.com/upgrade"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4f46e5",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "underline",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}
          >
            Go to https://nclex.com/upgrade
            <ExternalLink size={13} />
          </a>
        </div>
      </section>

      {/* 5. Video Testimonials Carousel (Real Nursing Students) */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "30px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 10px", color: "#0f172a" }}>Real Students. Real Passes.</h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>Join over 200,000 nursing students who passed their NCLEX with nclex.com.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {videoTestimonials.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ color: "#facc15", fontSize: 13 }}>{"★★★★★"}</div>
                  <span
                    style={{
                      background: "#eef2ff",
                      color: "#4f46e5",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6
                    }}
                  >
                    {t.tag}
                  </span>
                </div>
                <p style={{ color: "#334155", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 18px", fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid #6366f1" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: "#4f46e5", fontWeight: 600 }}>{t.score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Feature Deep Dive: Why Students Choosing nclex.com Pass */}
      <section style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "70px 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ color: "#6366f1", fontSize: 12.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              COMPREHENSIVE CURRICULUM
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: "8px 0 12px", color: "#0f172a" }}>
              Why Do Students Choosing nclex.com Pass?
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 620, margin: "0 auto" }}>
              Everything built strictly according to the NCSBN Clinical Judgment Model and the Pearson VUE software layout.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eef2ff", color: "#6366f1", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <BookOpen size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>50 Next Gen Case Studies</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                Master all 6 cognitive steps: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take actions, and evaluate outcomes.
              </p>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fdf2f8", color: "#ec4899", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <Play size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>Crash Course Video Lectures</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                High-yield bite-sized videos dissecting obstructive pediatric GI, adult telemetry, cardiac pharmacology, fluid/electrolytes, and maternal health.
              </p>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", color: "#16a34a", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>4 Adaptive CAT Readiness Exams</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                Replicates the exact CAT algorithm of the NCLEX®. Shuts off dynamically between 85 and 150 questions with verified pass-likelihood score prediction.
              </p>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fefce8", color: "#ca8a04", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>140+ Visual Cheat Sheets</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                High-resolution diagrams, lab value ranges, diagnostic flowcharts, and pharmacology memory aids you can download or review on the go.
              </p>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#faf5ff", color: "#9333ea", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>Ask NCLEX AI Clinical Tutor</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                Get instant, customized clinical explanations directly under any question or rationale 24 hours a day, 7 days a week.
              </p>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", color: "#2563eb", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>Personalized Study Schedules</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                Generate customized 4-week, 6-week, or 12-week study calendars tailored to your specific test date and available study hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison Table (nclex.com vs Competitors) */}
      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "70px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 10px", color: "#0f172a" }}>How Does nclex.com Compare?</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>See why more nursing students are switching to nclex.com.</p>
        </div>

        <div style={{ overflowX: "auto", background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "#f8fafc" }}>
                <th style={{ padding: "16px 20px", color: "#475569", fontSize: 13, textTransform: "uppercase" }}>Feature</th>
                <th style={{ padding: "16px 20px", color: "#4f46e5", fontSize: 14, fontWeight: 800, background: "#eef2ff" }}>nclex.com</th>
                <th style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>UWorld</th>
                <th style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>Archer</th>
                <th style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>Kaplan</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, color: "#334155" }}>{row.name}</td>
                  <td style={{ padding: "14px 20px", color: "#16a34a", fontWeight: 700, background: "#f8faff" }}>
                    {typeof row.nclex === "boolean" ? (row.nclex ? "✓ Included" : "—") : row.nclex}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#64748b" }}>
                    {typeof row.uworld === "boolean" ? (row.uworld ? "✓" : "—") : row.uworld}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#64748b" }}>
                    {typeof row.archer === "boolean" ? (row.archer ? "✓" : "—") : row.archer}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#64748b" }}>
                    {typeof row.kaplan === "boolean" ? (row.kaplan ? "✓" : "—") : row.kaplan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. 100% Pass Guarantee Shield Banner */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 70px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
            border: "2px solid #4f46e5",
            borderRadius: 24,
            padding: "40px 32px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)"
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
              color: "#1e1b4b",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(234, 179, 8, 0.4)"
            }}
          >
            <Shield size={36} strokeWidth={2.5} />
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px", color: "#fff" }}>
              Our 100% Pass Guarantee
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: 14.5, lineHeight: 1.5, margin: 0 }}>
              We stand behind our materials 100%. If you complete the question bank and CAT readiness exams on a 3-month or 6-month membership and do not pass your NCLEX®, we will issue a full 100% refund.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutModalPlan(plans[1] ?? null)}
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(99, 102, 241, 0.4)"
            }}
          >
            Upgrade with Guarantee
          </button>
        </div>
      </section>

      {/* 9. FAQ Accordion */}
      <section style={{ maxWidth: 840, margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 10px", color: "#0f172a" }}>Frequently Asked Questions</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>Have questions before upgrading? Here are the answers.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "18px 22px",
                    background: "transparent",
                    border: "none",
                    color: "#0f172a",
                    textAlign: "left",
                    fontSize: 15.5,
                    fontWeight: 700,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#4f46e5" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>
                {isOpen && (
                  <div style={{ padding: "0 22px 20px", color: "#475569", fontSize: 14.5, lineHeight: 1.6, borderTop: "1px solid #f8fafc" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Bottom Dark Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "40px 24px",
          background: "#0e1320",
          color: "#ffffff",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>nclex.com</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
            <span style={{ fontWeight: 800, fontSize: 17, color: "#ffffff" }}>NCLEX®</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>· Trusted by 200,000+ Future Nurses</span>
          </div>

          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#94a3b8", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/student" style={{ color: "#94a3b8", textDecoration: "none" }}>Student Dashboard</Link>
            <a href="https://nclex.com/upgrade" target="_blank" rel="noopener noreferrer" style={{ color: "#818cf8", textDecoration: "none" }}>
              Official NCLEX Upgrade Page
            </a>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact Support</span>
          </div>

          <div style={{ fontSize: 12, color: "#64748b" }}>
            NCLEX® and NCLEX-RN® are registered trademarks of the National Council of State Boards of Nursing, Inc. (NCSBN®), which is not affiliated with this website.
          </div>
        </div>
      </footer>

      {/* 11. Checkout Modal Simulator */}
      {checkoutModalPlan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: 20
          }}
          onClick={() => setCheckoutModalPlan(null)}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              maxWidth: 520,
              width: "100%",
              padding: 32,
              color: "#0f172a",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setCheckoutModalPlan(null)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                color: "#475569",
                cursor: "pointer"
              }}
            >
              <X size={16} />
            </button>

            {isSuccess ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#22c55e",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 16px"
                  }}
                >
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px", color: "#0f172a" }}>Payment Successful!</h3>
                <p style={{ color: "#64748b", fontSize: 14 }}>
                  Upgrading your account to {checkoutModalPlan.name}...
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Shield size={20} color="#4f46e5" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase" }}>
                    Secure 256-Bit SSL Checkout
                  </span>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", color: "#0f172a" }}>Complete Your Membership</h2>
                <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 24px" }}>
                  Unlock all questions, video lessons, and 100% Pass Guarantee immediately.
                </p>

                {/* Selected Plan Summary Box */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "16px 20px",
                    marginBottom: 20
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: 16, color: "#0f172a" }}>{checkoutModalPlan.name}</strong>
                      <div style={{ fontSize: 12.5, color: "#64748b" }}>{checkoutModalPlan.duration}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                        ${promoApplied ? Math.round(checkoutModalPlan.price * 0.8) : checkoutModalPlan.price}
                      </span>
                      {promoApplied && (
                        <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>20% DISCOUNT APPLIED</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. NCLEXBF26)"
                    style={{
                      flex: 1,
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: 10,
                      padding: "10px 14px",
                      color: "#0f172a",
                      fontSize: 13
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    style={{
                      background: "#eef2ff",
                      border: "1px solid #c7d2fe",
                      color: "#4f46e5",
                      borderRadius: 10,
                      padding: "10px 16px",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    Apply
                  </button>
                </div>

                {/* Mock Card Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    readOnly
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      padding: "12px 14px",
                      color: "#334155",
                      fontSize: 13.5
                    }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input
                      type="text"
                      defaultValue="12 / 28"
                      readOnly
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "12px 14px",
                        color: "#334155",
                        fontSize: 13.5
                      }}
                    />
                    <input
                      type="text"
                      defaultValue="•••"
                      readOnly
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "12px 14px",
                        color: "#334155",
                        fontSize: 13.5
                      }}
                    />
                  </div>
                </div>

                {/* Purchase Buttons */}
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 20px",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 18px rgba(99, 102, 241, 0.4)",
                    marginBottom: 12
                  }}
                >
                  <Lock size={15} />
                  <span>
                    Pay ${promoApplied ? Math.round(checkoutModalPlan.price * 0.8) : checkoutModalPlan.price} USD & Unlock
                  </span>
                </button>

                <a
                  href="https://nclex.com/upgrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "block",
                    color: "#4f46e5",
                    fontSize: 12.5,
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  Or checkout directly on nclex.com
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

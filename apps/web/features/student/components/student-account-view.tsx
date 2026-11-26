"use client";

import React, { useState, useEffect, useRef, type ReactElement } from "react";
import {
  User,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Upload,
  LogOut,
  Sparkles,
  Loader2
} from "lucide-react";
import { getCurrentAuthUser, setCurrentAuthUser, logoutUser, type AuthUser } from "@/features/auth";
import { purchaseMembership } from "@/features/shared/membership-store";

interface StudentAccountViewProps {
  onBackToHome?: () => void;
  onLogout?: () => void;
}

export const StudentAccountView = ({
  onBackToHome,
  onLogout
}: StudentAccountViewProps): ReactElement => {
  const [activeAccountTab, setActiveAccountTab] = useState<"profile" | "redeem">("profile");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSuccessNotice, setProfileSuccessNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change Password Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Institutional Code States
  const [institutionStudentName, setInstitutionStudentName] = useState("");
  const [institutionalCode, setInstitutionalCode] = useState("");
  const [codeSuccessNotice, setCodeSuccessNotice] = useState<string | null>(null);
  const [codeErrorNotice, setCodeErrorNotice] = useState<string | null>(null);
  const [isRedeemingCode, setIsRedeemingCode] = useState(false);
  const [redemptionHistory, setRedemptionHistory] = useState<
    Array<{ id: string; institution: string; code: string; date: string; status: string }>
  >([]);

  useEffect(() => {
    const user = getCurrentAuthUser();
    if (user) {
      setCurrentUser(user);
      setContactEmail(user.email);
      setUsername(user.username);
      setFullName(user.username.replace(/[._-]/g, " "));
    } else {
      setContactEmail("aliraza7776202@gmail.com");
      setUsername("aliraza7776202@gmail.com");
      setFullName("Ali Raza");
    }

    // Load saved avatar
    try {
      const savedAvatar = localStorage.getItem("nclex_user_avatar_v1");
      if (savedAvatar) setAvatarUrl(savedAvatar);
    } catch {}

    // Load redemption history
    try {
      const rawHistory = localStorage.getItem("nclex_institutional_history_v1");
      if (rawHistory) setRedemptionHistory(JSON.parse(rawHistory));
    } catch {}
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setAvatarUrl(url);
        try {
          localStorage.setItem("nclex_user_avatar_v1", url);
        } catch {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated: AuthUser = {
        ...currentUser,
        username: username.trim() || currentUser.username,
        email: contactEmail.trim() || currentUser.email
      };
      setCurrentAuthUser(updated);
      setCurrentUser(updated);
    }
    setProfileSuccessNotice("Personal details updated successfully!");
    setTimeout(() => setProfileSuccessNotice(null), 3000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSubmittingPassword(true);
    setTimeout(() => {
      setIsSubmittingPassword(false);
      setPasswordSuccess("Your password has been changed successfully.");
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess(null);
        setPasswordError(null);
      }, 1200);
    }, 600);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeErrorNotice(null);
    setCodeSuccessNotice(null);

    const code = institutionalCode.trim().toUpperCase();
    if (!institutionStudentName.trim()) {
      setCodeErrorNotice("Please enter your full name as it appears on your institution's records.");
      return;
    }
    if (!code) {
      setCodeErrorNotice("Please enter the institutional code provided by your program.");
      return;
    }

    setIsRedeemingCode(true);
    setTimeout(() => {
      setIsRedeemingCode(false);
      // Grant Pro access via membership store
      purchaseMembership("6-month", 199);

      const institutionName =
        code.startsWith("EMORY")
          ? "Emory University School of Nursing"
          : code.startsWith("HOPKINS")
          ? "Johns Hopkins School of Nursing"
          : "National Nursing Academy";

      const newRecord = {
        id: `inst_${Date.now()}`,
        institution: institutionName,
        code,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Active (6-Month Institutional Membership)"
      };

      const updated = [newRecord, ...redemptionHistory];
      setRedemptionHistory(updated);
      try {
        localStorage.setItem("nclex_institutional_history_v1", JSON.stringify(updated));
      } catch {}

      setCodeSuccessNotice(`Congratulations! ${code} redeemed successfully. Your membership is now active!`);
      setInstitutionalCode("");
      setInstitutionStudentName("");
    }, 800);
  };

  const handleLogoutClick = () => {
    logoutUser();
    if (onLogout) onLogout();
    else window.location.href = "/auth?mode=login";
  };

  // Day name for dynamic greeting matching the video: "Happy Thursday, aliraza7776202@gmail.com!"
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const displayEmailOrUser = currentUser?.email || contactEmail || "student@nclexlab.com";
  const userInitial = (fullName.trim() || displayEmailOrUser)[0]?.toUpperCase() || "A";

  const isPasswordFormValid =
    oldPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "20px 24px 60px 24px",
        color: "#ffffff",
        boxSizing: "border-box"
      }}
    >
      {/* Navigation Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13.5px",
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "16px"
        }}
      >
        <button
          type="button"
          onClick={onBackToHome}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            padding: 0,
            fontSize: "inherit"
          }}
        >
          Home
        </button>
        <span>&gt;</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>Account</span>
      </div>

      {/* Dynamic Header Greeting (Matches video: Happy Thursday, ...) */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 800,
          margin: "0 0 8px 0",
          letterSpacing: "-0.5px",
          wordBreak: "break-word"
        }}
      >
        Happy {dayName}, {displayEmailOrUser}!
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.8)",
          margin: "0 0 28px 0",
          lineHeight: 1.5,
          maxWidth: "760px"
        }}
      >
        Thanks for being part of the nclexlab.com family. Edit your profile, manage your
        memberships, view payment history, and more on this page.
      </p>

      {/* Tabs Navigation (Profile | Redeem Institutional Code) */}
      <div
        style={{
          display: "flex",
          gap: "28px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "28px"
        }}
      >
        <button
          type="button"
          onClick={() => setActiveAccountTab("profile")}
          style={{
            background: "none",
            border: "none",
            color: activeAccountTab === "profile" ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            fontSize: "15px",
            fontWeight: 700,
            padding: "0 0 12px 0",
            cursor: "pointer",
            position: "relative"
          }}
        >
          Profile
          {activeAccountTab === "profile" && (
            <span
              style={{
                position: "absolute",
                bottom: "-1px",
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#ffffff",
                borderRadius: "3px"
              }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveAccountTab("redeem")}
          style={{
            background: "none",
            border: "none",
            color: activeAccountTab === "redeem" ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            fontSize: "15px",
            fontWeight: 700,
            padding: "0 0 12px 0",
            cursor: "pointer",
            position: "relative"
          }}
        >
          Redeem Institutional Code
          {activeAccountTab === "redeem" && (
            <span
              style={{
                position: "absolute",
                bottom: "-1px",
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#ffffff",
                borderRadius: "3px"
              }}
            />
          )}
        </button>
      </div>

      {/* TAB 1: PROFILE (Exact match with Video Frame 1 & 2) */}
      {activeAccountTab === "profile" && (
        <div>
          {/* Main White Card: Personal Details */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              color: "#1e293b",
              padding: "32px 36px",
              marginBottom: "32px"
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "0 0 24px 0",
                color: "#1e293b"
              }}
            >
              Personal Details
            </h2>

            {profileSuccessNotice && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  color: "#059669",
                  fontSize: "13.5px",
                  marginBottom: "20px"
                }}
              >
                <CheckCircle2 size={16} />
                <span>{profileSuccessNotice}</span>
              </div>
            )}

            {/* Avatar & Upload Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden"
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  userInitial
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Upload a profile picture
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Name Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: "6px"
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="What should we call you?"
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Contact Email Field */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748b" }}>Contact Email</label>
                  <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>Verified</span>
                </div>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Username Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: "6px"
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Change Password Link */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Change Password
                </button>
              </div>

              {/* Save Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Under Card: Log Out Button (Matches video frame 1s, 2s) */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={handleLogoutClick}
              style={{
                width: "220px",
                height: "44px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                border: "1.5px solid rgba(255, 255, 255, 0.4)",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: REDEEM INSTITUTIONAL CODE (Exact match with Video Frame 4 & 5) */}
      {activeAccountTab === "redeem" && (
        <div>
          {/* Top Info Alert Box */}
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "24px",
              fontSize: "13.5px",
              lineHeight: 1.6,
              color: "#e2e8f0"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#60a5fa", marginTop: "2px" }}>•</span>
              <div>
                If your institution purchased memberships for your class, enter the code they
                gave you below to activate your upgraded membership.{" "}
                <strong>This section is not for redeeming promo codes.</strong> Promo codes can be
                used during checkout. If you need help, click the blue button at the bottom-right
                of your screen to send us a message. We&apos;ll respond ASAP.
              </div>
            </div>
          </div>

          {/* Card 1: Enter Your Institutional Code */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              color: "#1e293b",
              padding: "32px 36px",
              marginBottom: "28px"
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "0 0 20px 0",
                color: "#1e293b"
              }}
            >
              Enter Your Institutional Code
            </h2>

            {codeSuccessNotice && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  color: "#059669",
                  fontSize: "13.5px",
                  marginBottom: "20px"
                }}
              >
                <CheckCircle2 size={16} />
                <span>{codeSuccessNotice}</span>
              </div>
            )}

            {codeErrorNotice && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  color: "#dc2626",
                  fontSize: "13.5px",
                  marginBottom: "20px"
                }}
              >
                <AlertCircle size={16} />
                <span>{codeErrorNotice}</span>
              </div>
            )}

            <form onSubmit={handleRedeemCode} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Full Name Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: "6px"
                  }}
                >
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={institutionStudentName}
                  onChange={(e) => setInstitutionStudentName(e.target.value)}
                  placeholder="Enter your full name as it appears on your institution's records"
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Institutional Code Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: "6px"
                  }}
                >
                  Institutional Code
                </label>
                <input
                  type="text"
                  value={institutionalCode}
                  onChange={(e) => setInstitutionalCode(e.target.value)}
                  placeholder="Enter code provided by your institution"
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Pill Redeem Button */}
              <div>
                <button
                  type="submit"
                  disabled={isRedeemingCode || !institutionalCode.trim()}
                  style={{
                    padding: "11px 28px",
                    borderRadius: "9999px",
                    backgroundColor: institutionalCode.trim() ? "#4f46e5" : "#cbd5e1",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "14.5px",
                    fontWeight: 700,
                    cursor: institutionalCode.trim() && !isRedeemingCode ? "pointer" : "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isRedeemingCode ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Redeeming Code...
                    </>
                  ) : (
                    "Redeem Code"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Redemption History */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              color: "#1e293b",
              padding: "32px 36px"
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "0 0 16px 0",
                color: "#1e293b"
              }}
            >
              Redemption History
            </h2>

            {redemptionHistory.length === 0 ? (
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#64748b",
                  margin: 0
                }}
              >
                If you redeem an institutional code, it will appear here. Don&apos;t have an
                institutional code? Meet with your advisor or program director and ask them to
                email us at <strong style={{ color: "#4f46e5" }}>team@nclexlab.com</strong>.
                We&apos;d love to offer our resource to your institution!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {redemptionHistory.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "14px 18px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>
                        {item.institution}
                      </strong>
                      <small style={{ color: "#64748b" }}>
                        Code: {item.code} · Redeemed on {item.date}
                      </small>
                    </div>
                    <span
                      style={{
                        padding: "4px 12px",
                        backgroundColor: "#ecfdf5",
                        color: "#059669",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 700
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CHANGE YOUR PASSWORD (Exact match with Video Frame 3) */}
      {isChangePasswordOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px"
          }}
          onClick={() => setIsChangePasswordOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 20px 45px rgba(0,0,0,0.3)",
              color: "#1e293b",
              padding: "36px 36px 32px 36px",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "4px"
              }}
              aria-label="Close"
            >
              ✕
            </button>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#1e293b",
                textAlign: "center",
                margin: "0 0 24px 0"
              }}
            >
              Change your password
            </h2>

            {passwordError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#dc2626",
                  fontSize: "13px",
                  marginBottom: "18px"
                }}
              >
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: "8px",
                  color: "#059669",
                  fontSize: "13px",
                  marginBottom: "18px"
                }}
              >
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Old Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: "6px"
                  }}
                >
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14.5px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* New Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748b" }}>New Password</label>
                  <span style={{ fontSize: "11.5px", color: newPassword.length >= 8 ? "#10b981" : "#94a3b8" }}>
                    8+ characters
                  </span>
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14.5px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: "6px"
                  }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "#eef2f6",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14.5px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={!isPasswordFormValid || isSubmittingPassword}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "9999px",
                  backgroundColor: isPasswordFormValid ? "#4f46e5" : "#cbd5e1",
                  color: isPasswordFormValid ? "#ffffff" : "#94a3b8",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: isPasswordFormValid && !isSubmittingPassword ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                  transition: "background-color 0.2s ease"
                }}
              >
                {isSubmittingPassword ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Changing Password...
                  </>
                ) : (
                  "Change My Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

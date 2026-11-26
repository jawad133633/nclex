"use client";

import React, { useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Star, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  loginUser,
  registerUser,
  sendPasswordResetCode,
  resetPasswordWithCode
} from "../auth-store";

export type AuthMode = "login" | "signup" | "forgot";

interface AuthCardProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AuthCard = ({
  initialMode = "login",
  onSuccess,
  onClose,
  isModal = false
}: AuthCardProps): ReactElement => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Reset password states
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!emailOrUsername.trim() || !password) return;

    try {
      setIsLoading(true);
      await loginUser(emailOrUsername, password);
      setSuccessMsg("Welcome back! Redirecting...");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else router.push("/student");
      }, 600);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password || !agreeTerms) return;

    try {
      setIsLoading(true);
      await registerUser(email, password);
      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else router.push("/student");
      }, 600);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!resetEmail.trim()) return;

    try {
      setIsLoading(true);
      const res = await sendPasswordResetCode(resetEmail);
      setGeneratedCode(res.code);
      setResetStep("verify");
      setSuccessMsg(`A 6-digit code has been sent to ${resetEmail}.`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!verificationCode.trim() || !newPassword) return;

    try {
      setIsLoading(true);
      await resetPasswordWithCode(resetEmail, verificationCode, newPassword);
      setSuccessMsg("Password reset successfully! Please log in with your new password.");
      setTimeout(() => {
        setMode("login");
        setEmailOrUsername(resetEmail);
        setPassword("");
        setResetStep("request");
        setGeneratedCode(null);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginValid = emailOrUsername.trim().length > 0 && password.length > 0;
  const isSignupValid = email.trim().length > 0 && password.length >= 8 && agreeTerms;
  const isRequestCodeValid = resetEmail.trim().length > 0;
  const isVerifyValid = verificationCode.trim().length >= 4 && newPassword.length >= 8;

  return (
    <div className="auth-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Brand Header */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            color: "#ffffff",
            textDecoration: "none"
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid #ffffff",
              display: "grid",
              placeItems: "center"
            }}
          >
            <Star size={20} fill="#ffffff" color="#ffffff" />
          </div>
          <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            nclexlab<span style={{ opacity: 0.9 }}>.com</span>
          </span>
        </a>
      </div>

      {/* Main White Card matching exact video frame */}
      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.25)",
          padding: "40px 38px 32px 38px",
          position: "relative"
        }}
      >
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
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
        )}

        {/* Status Alerts */}
        {errorMsg && (
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
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
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
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: LOG IN (Exact match with frame 1s, 8s) */}
        {mode === "login" && (
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#1e293b",
                textAlign: "center",
                margin: "0 0 24px 0"
              }}
            >
              Log in
            </h1>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Email / Username field */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748b" }}>Email / username</label>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>(Case Sensitive)</span>
                </div>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder=""
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

              {/* Password field */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748b" }}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode("forgot");
                      if (emailOrUsername.includes("@")) setResetEmail(emailOrUsername);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#4f46e5",
                      cursor: "pointer"
                    }}
                  >
                    Forgot Password
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 40px 0 14px",
                      backgroundColor: "#eef2f6",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14.5px",
                      color: "#1e293b",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "grid",
                      placeItems: "center"
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Switch to Create Account */}
              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode("signup");
                    setEmail(emailOrUsername.includes("@") ? emailOrUsername : "");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#4f46e5",
                    cursor: "pointer"
                  }}
                >
                  Create an account
                </button>
              </div>

              {/* Pill Log In button */}
              <button
                type="submit"
                disabled={!isLoginValid || isLoading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "9999px",
                  backgroundColor: isLoginValid ? "#4f46e5" : "#cbd5e1",
                  color: isLoginValid ? "#ffffff" : "#94a3b8",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: isLoginValid && !isLoading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "12px",
                  transition: "background-color 0.2s ease"
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
        )}

        {/* MODE 2: START STUDYING FOR FREE / SIGN UP (Exact match with frame 3s, 5s) */}
        {mode === "signup" && (
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#1e293b",
                textAlign: "center",
                margin: "0 0 24px 0"
              }}
            >
              Start studying for free
            </h1>

            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Email field */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  placeholder=""
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

              {/* Password field with 8+ characters right label */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748b" }}>Password</label>
                  <span style={{ fontSize: "11.5px", color: password.length >= 8 ? "#10b981" : "#94a3b8" }}>
                    8+ characters
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 40px 0 14px",
                      backgroundColor: "#eef2f6",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14.5px",
                      color: "#1e293b",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "grid",
                      placeItems: "center"
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  fontSize: "13px",
                  color: "#475569",
                  cursor: "pointer",
                  marginTop: "2px"
                }}
              >
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "2px",
                    accentColor: "#4f46e5",
                    cursor: "pointer"
                  }}
                />
                <span>
                  I agree to the{" "}
                  <span style={{ color: "#4f46e5", textDecoration: "underline" }}>Terms of Use</span> &{" "}
                  <span style={{ color: "#4f46e5", textDecoration: "underline" }}>Privacy Policy</span>.
                </span>
              </label>

              {/* Pill Create My Free Account button */}
              <button
                type="submit"
                disabled={!isSignupValid || isLoading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "9999px",
                  backgroundColor: isSignupValid ? "#4f46e5" : "#cbd5e1",
                  color: isSignupValid ? "#ffffff" : "#94a3b8",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: isSignupValid && !isLoading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                  transition: "background-color 0.2s ease"
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Creating account...
                  </>
                ) : (
                  "Create My Free Account"
                )}
              </button>

              {/* Switch back to Log In */}
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode("login");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#4f46e5",
                    cursor: "pointer"
                  }}
                >
                  I already have an account
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODE 3: FORGOT PASSWORD (Exact match with frame 10s) */}
        {mode === "forgot" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <h1
                style={{
                  fontSize: "23px",
                  fontWeight: 800,
                  color: "#1e293b",
                  margin: "0 0 6px 0"
                }}
              >
                Want to reset your password?
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                {resetStep === "request"
                  ? "We'll send a code to your account email."
                  : `Enter the verification code sent to ${resetEmail}.`}
              </p>
            </div>

            {/* Generated Code Simulation Callout */}
            {generatedCode && resetStep === "verify" && (
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px dashed #3b82f6",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "#1e40af",
                  textAlign: "center"
                }}
              >
                Verification code: <strong>{generatedCode}</strong> (or test code 123456)
              </div>
            )}

            {resetStep === "request" ? (
              <form onSubmit={handleRequestCode} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748b" }}>Original Email</label>
                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>(Case Sensitive)</span>
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder=""
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

                {/* Pill Send Me A Code button */}
                <button
                  type="submit"
                  disabled={!isRequestCodeValid || isLoading}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "9999px",
                    backgroundColor: isRequestCodeValid ? "#4f46e5" : "#cbd5e1",
                    color: isRequestCodeValid ? "#ffffff" : "#94a3b8",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: isRequestCodeValid && !isLoading ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "8px",
                    transition: "background-color 0.2s ease"
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending Code...
                    </>
                  ) : (
                    "Send Me A Code"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    autoFocus
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      backgroundColor: "#eef2f6",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "18px",
                      letterSpacing: "4px",
                      fontWeight: 700,
                      textAlign: "center",
                      color: "#1e293b",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

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

                {/* Pill Reset Password button */}
                <button
                  type="submit"
                  disabled={!isVerifyValid || isLoading}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "9999px",
                    backgroundColor: isVerifyValid ? "#4f46e5" : "#cbd5e1",
                    color: isVerifyValid ? "#ffffff" : "#94a3b8",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: isVerifyValid && !isLoading ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "6px"
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Go back to login */}
            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode("login");
                  setResetStep("request");
                  setGeneratedCode(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#4f46e5",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <ArrowLeft size={14} /> Go back to login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

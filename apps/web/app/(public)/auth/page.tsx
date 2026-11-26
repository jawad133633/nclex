"use client";

import React, { Suspense, type ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard, type AuthMode } from "@/features/auth";

const AuthContent = (): ReactElement => {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as AuthMode | null;
  const initialMode: AuthMode =
    modeParam === "signup" || modeParam === "forgot" ? modeParam : "login";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#4338ca",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        boxSizing: "border-box"
      }}
    >
      <AuthCard initialMode={initialMode} />
    </div>
  );
};

export default function AuthPage(): ReactElement {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#4338ca",
            display: "grid",
            placeItems: "center",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600
          }}
        >
          Loading...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

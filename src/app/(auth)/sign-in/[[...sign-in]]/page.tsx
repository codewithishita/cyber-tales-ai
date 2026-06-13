// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf9" }}>
      <div>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
            Welcome back
          </div>
          <div style={{ color: "#78716c", fontSize: "14px" }}>Sign in to continue your cyber journey</div>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#111110",
              colorBackground: "#ffffff",
              borderRadius: "10px",
              fontFamily: "'Geist', sans-serif",
            },
          }}
          afterSignInUrl="/dashboard"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}

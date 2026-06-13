import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf9" }}>
      <div>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
            Start your journey
          </div>
          <div style={{ color: "#78716c", fontSize: "14px" }}>Create your account and begin your first adventure</div>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
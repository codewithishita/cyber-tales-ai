import type { Metadata } from "next";
import LandingClient from "@/components/LandingClient";

export const metadata: Metadata = {
  title: "Cyber Tales AI — Cybersecurity Learning Platform",
  description: "AI-powered cybersecurity learning platform for children.",
};

export default function Home() {
  return <LandingClient />;
}
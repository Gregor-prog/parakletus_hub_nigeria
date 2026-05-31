import type { Metadata } from "next";
import "./gsi.css";

export const metadata: Metadata = {
  title: "GSI Buildathon — Port Harcourt, August 22, 2026",
  description:
    "The GSI Buildathon is how we're hiring the founding team of the Global South Index — the academic indexing platform built for African and Global South researchers.",
  icons: { icon: "/favicon.png" },
};

export default function GsiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

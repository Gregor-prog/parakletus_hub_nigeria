import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Console · Parakletus", template: "%s · Parakletus Console" },
  description: "Parakletus Hub Nigeria internal admin console.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/favicon.png" },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}

import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../styles.css";

const bricolage = Bricolage_Grotesque({
  variable: "--f-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--f-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--f-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--f-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Parakletus Hub Nigeria — A New Horizon for the Global South",
  description: "Parakletus Hub Nigeria builds e-learning and academic publishing infrastructure for K-12 schools and Nigerian youth — advancing SDG 4 through ParaLearn and Parakletus Publishing.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


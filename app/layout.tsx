import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/i18n/LangProvider";

const display = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pink Hydrogen Hub — Kola NPP CSR Initiative",
  description:
    "Surplus off-peak reactor electricity, converted to pink hydrogen and returned to the community. A feasibility experience for HackAtom Krasnoyarsk.",
  keywords: [
    "pink hydrogen",
    "nuclear",
    "Kola NPP",
    "Rosatom",
    "electrolysis",
    "VVER",
    "CSR",
    "HackAtom",
  ],
  openGraph: {
    title: "Pink Hydrogen Hub",
    description:
      "Off-peak nuclear electricity → pink hydrogen → community. 1MW feasibility, scaling to 10MW.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="grain antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}

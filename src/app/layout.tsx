import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BiteKaro — Mood-Based Food, Circular Economy",
  description:
    "Order food by mood, earn Karo Points, bring your own tiffin for discounts, and unlock Recipe Royalties. Food ordering for a sustainable future.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col" style={{ background: "#F6ECD9", fontFamily: "var(--font-inter)" }}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="text-center py-6 text-sm" style={{ color: "#8E9CA3", borderTop: "1px solid #CBD4D9" }}>
            <span style={{ fontFamily: "var(--font-bricolage)", fontWeight: 600, color: "#C8472E" }}>BiteKaro</span>
            {" · "}Mood-based food, circular economy
            {" · "}Commission 12% vs industry 30%
          </footer>
        </Providers>
      </body>
    </html>
  );
}

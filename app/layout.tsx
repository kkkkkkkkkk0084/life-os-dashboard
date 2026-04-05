import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Life OS",
  description: "Your life, quantified.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${ebGaramond.variable} font-[family-name:var(--font-inter)]`}
      >
        <Nav />
        <main className="pt-[88px]">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "LIFE OS",
  description: "Keito Ohashi — Status Board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistMono.variable} bg-[#0d0f14] text-white`}>
        <div className="max-w-6xl mx-auto p-4">
          <div className="border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-green-400 font-mono text-xl font-bold tracking-widest">LIFE OS</h1>
                <p className="text-gray-500 font-mono text-xs">KEITO OHASHI — STATUS BOARD</p>
              </div>
            </div>
            <Nav />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { OperationalStatusBar } from "@/components/advanced-intel-components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PHISHNET Sentinel",
  description: "Enterprise AI-native cybersecurity command center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-slate-950 text-slate-100 overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50"></div>
        </div>

        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-slate-950/20 scroll-smooth">
            {children}
          </main>
          <OperationalStatusBar />
        </div>
      </body>
    </html>
  );
}

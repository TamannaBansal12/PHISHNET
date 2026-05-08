"use client";

import React, { useState } from "react";
import DashboardHome from "@/components/dashboard-tabs/DashboardHome";
import LiveAnalytics from "@/components/dashboard-tabs/LiveAnalytics";
import { LayoutDashboard, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [tab, setTab] = useState<"command" | "analytics">("command");

  return (
    <main className="min-h-screen bg-[#050816] text-white ml-[260px]">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95 backdrop-blur-xl px-8 py-4">
        <div className="flex gap-3">
          <button
            onClick={() => setTab("command")}
            className={`rounded-2xl px-5 py-3 flex items-center gap-2 text-sm ${
              tab === "command"
                ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30"
                : "bg-white/5 text-slate-400 border border-white/10"
            }`}
          >
            <LayoutDashboard size={18} />
            Command Center
          </button>

          <button
            onClick={() => setTab("analytics")}
            className={`rounded-2xl px-5 py-3 flex items-center gap-2 text-sm ${
              tab === "analytics"
                ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30"
                : "bg-white/5 text-slate-400 border border-white/10"
            }`}
          >
            <BarChart3 size={18} />
            Live Analytics
          </button>
        </div>
      </div>

      {tab === "command" ? <DashboardHome /> : <LiveAnalytics />}
    </main>
  );
}

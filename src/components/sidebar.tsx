"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Mail, 
  Search, 
  Mic, 
  Video, 
  Share2, 
  BookOpen, 
  ShieldCheck, 
  Database,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LastProcessedScanPanel, ScanHistoryPanel } from "./intel-panels";
import { useScanStore } from "@/store/scanStore";

const navItems = [
  { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { name: "Threat Intelligence", id: "intelligence", icon: ShieldAlert },
  { name: "Email Security", id: "email", icon: Mail },
  { name: "OCR Intelligence", id: "ocr", icon: Search },
  { name: "Audio Deepfake", id: "audio", icon: Mic },
  { name: "Video Deepfake", id: "video", icon: Video },
  { name: "Runtime Graph", id: "runtime_graph", icon: Share2 },
  { name: "SOC Playbooks", id: "soc_playbooks", icon: BookOpen },
  { name: "Adaptive Defense", id: "adaptive_defense", icon: ShieldCheck },
  { name: "Audit Center", id: "audit_center", icon: Database },
];

export function Sidebar() {
  const router = useRouter();
  const { activePage, setActivePage } = useScanStore();

  const handleNav = (id: string) => {
    setActivePage(id);
    if (window.location.pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-slate-900">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
          <Fingerprint className="text-slate-950 h-5 w-5" />
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-100">PHISHNET</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[inset_0_0_12px_rgba(14,165,233,0.1)]" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-all duration-300",
                isActive ? "text-sky-400 scale-110" : "text-slate-600 group-hover:text-slate-400"
              )} />
              {item.name}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-5 bg-sky-500 rounded-r-full"
                />
              )}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-6 border-t border-slate-900 bg-slate-950/50">
        <LastProcessedScanPanel />
        <ScanHistoryPanel />
      </div>
      
      <div className="p-4 border-t border-slate-900">
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/50 shadow-inner group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:animate-ping" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Infrastructure</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight font-medium">Node: <span className="text-slate-400">US-EAST-01</span></p>
          <p className="text-[10px] text-slate-500 leading-tight font-medium mt-1">Core: <span className="text-sky-400">LLaMA-3.1 Active</span></p>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useScanStore } from "@/store/scanStore";
import { 
  Eye, 
  Terminal, 
  Shield, 
  ShieldAlert, 
  ChevronDown, 
  Settings, 
  Bell,
  Search,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const { viewMode, setViewMode, securityMode, setSecurityMode } = useScanStore();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence Database..." 
            className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 w-full max-w-[160px] md:max-w-[256px] focus:outline-none focus:border-sky-500/50 focus:max-w-[200px] md:focus:max-w-[320px] transition-all"
          />
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-1 md:gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          <button 
            onClick={() => setSecurityMode('blue')}
            className={cn(
              "px-2 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 transition-all",
              securityMode === 'blue' ? "bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(14,165,233,0.4)]" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Shield className="h-3 w-3 shrink-0" /> <span className="hidden md:inline">Blue Team</span><span className="md:hidden">Blue</span>
          </button>
          <button 
            onClick={() => setSecurityMode('red')}
            className={cn(
              "px-2 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 transition-all",
              securityMode === 'red' ? "bg-rose-500 text-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <ShieldAlert className="h-3 w-3 shrink-0" /> <span className="hidden md:inline">Red Team</span><span className="md:hidden">Red</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          <button 
            onClick={() => setViewMode('analyst')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
              viewMode === 'analyst' ? "bg-slate-700 text-slate-100" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Terminal className="h-3 w-3" /> Analyst View
          </button>
          <button 
            onClick={() => setViewMode('executive')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
              viewMode === 'executive' ? "bg-slate-700 text-slate-100" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Eye className="h-3 w-3" /> Executive View
          </button>
        </div>

        <div className="hidden lg:block h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2 text-slate-500 hover:text-sky-400 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
          </button>
          <button className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-800 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-200 uppercase tracking-tighter">Admin User</p>
              <p className="text-[8px] font-bold text-sky-500 uppercase tracking-widest">Global Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-sky-500/50 transition-all shrink-0">
              <User className="h-4 w-4" />
            </div>
            <ChevronDown className="h-4 w-4 text-slate-600 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
}

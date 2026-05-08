"use client";

import { useScanStore, ScanHistoryItem } from "@/store/scanStore";
import { 
  History, 
  Brain, 
  Trash2, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Mail, 
  Mic, 
  Video, 
  Search,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { sanitizeText } from "@/lib/text-utils";

const modalityIcons: Record<string, any> = {
  email: Mail,
  audio: Mic,
  video: Video,
  ocr: Search,
};

export function LastProcessedScanPanel() {
  const { lastProcessedScan, restoreFromHistory, setActivePage } = useScanStore();

  if (!lastProcessedScan) return null;

  const Icon = modalityIcons[lastProcessedScan.modality] || Brain;
  const isHigh = lastProcessedScan.risk_score >= 75;
  const color = isHigh ? "text-rose-500" : lastProcessedScan.risk_score >= 45 ? "text-amber-500" : "text-emerald-500";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-sky-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Memory</span>
        </div>
        <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-slate-800 text-slate-500">Last Scan</Badge>
      </div>

      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-xl bg-slate-950 border border-slate-800", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black text-slate-200 uppercase tracking-tighter truncate">{sanitizeText(lastProcessedScan.modality)} Analysis</span>
            <span className={cn("text-xs font-black", color)}>{lastProcessedScan.risk_score}</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mb-2 truncate">{sanitizeText(lastProcessedScan.prediction)}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-600 flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3" /> {new Date(lastProcessedScan.timestamp).toLocaleTimeString()}
            </span>
            <button 
              onClick={() => {
                setActivePage(lastProcessedScan.modality);
                if (window.location.pathname !== '/dashboard') {
                  window.location.href = '/dashboard';
                }
              }}
              className="text-[9px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1 hover:text-sky-300 transition-colors"
            >
              Revisit <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ScanHistoryPanel() {
  const { scanHistory, clearAll, restoreFromHistory } = useScanStore();

  if (scanHistory.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-purple-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence History</span>
        </div>
        <button 
          onClick={clearAll}
          className="text-[9px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
        >
          <Trash2 className="h-3 w-3" /> Clear All
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {scanHistory.slice(0, 5).map((item) => {
            const Icon = modalityIcons[item.modality] || Brain;
            const isHigh = item.risk_score >= 75;
            const color = isHigh ? "text-rose-500" : item.risk_score >= 45 ? "text-amber-500" : "text-emerald-500";
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group relative p-3 bg-slate-900/40 border border-slate-800/50 rounded-xl hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => restoreFromHistory(item)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-1.5 rounded-lg bg-slate-950 border border-slate-900", color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter truncate">{sanitizeText(item.modality)}</span>
                      <span className={cn("text-[10px] font-mono font-bold", color)}>{item.risk_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-600 truncate font-mono">{sanitizeText(item.prediction)}</span>
                      <span className="text-[8px] text-slate-700 font-mono">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

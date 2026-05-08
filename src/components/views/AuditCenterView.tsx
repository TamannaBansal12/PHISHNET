"use client";

import { useScanStore, ScanHistoryItem } from "@/store/scanStore";
import { Database, Trash2, Download, ExternalLink, Clock, Shield, TrendingUp, AlertTriangle, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AuditCenterView() {
  const { scanHistory, clearAll, restoreFromHistory, lastProcessedScan } = useScanStore();

  const handleDownloadJSON = () => {
    if (!lastProcessedScan) return;
    const blob = new Blob([JSON.stringify(lastProcessedScan.result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishnet-audit-${lastProcessedScan.modality}-${lastProcessedScan.id}.json`;
    a.click();
  };

  return (
    <div className="p-8 space-y-12 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
            <Database className="h-8 w-8 text-sky-500" />
            SOC Audit & Governance Center
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">Full forensic archive and compliance logging for all ingestion nodes.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={clearAll}
            className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-rose-500/20 transition-all"
          >
            <Trash2 className="h-4 w-4" /> Purge Records
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Memory Intelligence */}
        <div className="space-y-8">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Archive Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Total Scans</span>
                <span className="text-lg font-black text-slate-100">{scanHistory.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Critical Threats</span>
                <span className="text-lg font-black text-rose-500">{scanHistory.filter(s => s.risk_score >= 75).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Compliance Status</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Compliant</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
             <div className="flex items-center gap-3 mb-6">
               <TrendingUp className="h-4 w-4 text-sky-500" />
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Attack Similarity Engine</h3>
             </div>
             <div className="space-y-4">
               {scanHistory.length > 1 ? (
                 <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                       <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 text-[8px]">92% Match</Badge>
                       <span className="text-[8px] text-slate-600 font-mono">Case ID: #PH-2841</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                       Current threat shows high similarity to a "Credential Phishing" campaign detected 3 days ago. Shared indicators include spoof domain structure and semantic pattern.
                    </p>
                 </div>
               ) : (
                 <p className="text-[10px] text-slate-600 font-mono italic">Insufficient history for similarity mapping.</p>
               )}
             </div>
          </div>

          {lastProcessedScan && (
            <div className="p-6 bg-sky-500/5 border border-sky-500/20 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Download className="h-4 w-4 text-sky-500" />
                <h3 className="text-xs font-black text-sky-500 uppercase tracking-widest leading-none">Forensic Export</h3>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">Download the full forensic telemetry for the last processed scan in standardized JSON format.</p>
                <button 
                  onClick={handleDownloadJSON}
                  className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                >
                  <Download className="h-4 w-4" /> Export Audit JSON
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Full History Table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950/20 flex items-center justify-between">
              <span className="text-xs font-black text-slate-100 uppercase tracking-widest">Forensic Scan History</span>
              <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-slate-800 text-slate-500">{scanHistory.length} Records</Badge>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
                    <th className="px-6 py-4">Modality</th>
                    <th className="px-6 py-4">Verdict</th>
                    <th className="px-6 py-4">Risk Score</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {scanHistory.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-800/20 transition-all cursor-pointer" onClick={() => restoreFromHistory(item)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border",
                            item.risk_score >= 75 ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-slate-800 border-slate-700 text-slate-400"
                          )}>
                             <Shield className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-black text-slate-200 uppercase tracking-tighter">{item.modality}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-slate-400">{item.prediction}</span>
                            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Detection Confirmed</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div className={cn("h-full", item.risk_score >= 75 ? "bg-rose-500" : "bg-sky-500")} style={{ width: `${item.risk_score}%` }} />
                           </div>
                           <span className={cn("text-xs font-black font-mono", item.risk_score >= 75 ? "text-rose-500" : "text-sky-400")}>
                             {item.risk_score}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                        {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-500 hover:text-sky-400 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {scanHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <AlertTriangle className="h-12 w-12 text-slate-800" />
                           <p className="text-slate-600 font-mono text-xs max-w-xs mx-auto">Forensic database is currently empty. Ingest threats to begin audit logging.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

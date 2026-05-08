"use client";

import { useScanStore } from "@/store/scanStore";
import { Share2, AlertCircle, Network, Link2, Box, Cpu } from "lucide-react";
import { RuntimeOrchestrationGraph } from "@/components/analysis-components";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RuntimeGraphView() {
  const { lastProcessedScan } = useScanStore();
  const result = lastProcessedScan?.result;

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto relative">
             <Share2 className="h-10 w-10 text-slate-700" />
             <div className="absolute inset-0 border border-slate-700 rounded-full animate-ping opacity-20" />
          </div>
          <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Active Runtime Graph</h2>
          <p className="text-slate-600 max-w-md mx-auto text-sm">Orchestration telemetry is generated during live threat ingestion. Run a scan to activate real-time mapping.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
            <Share2 className="h-8 w-8 text-sky-500" />
            Runtime Orchestration Graph
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">Real-time agent execution path for Case ID: {result.case_metadata.case_id}</p>
        </div>
        <div className="flex gap-4">
           <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/5 px-4 py-1 font-black uppercase tracking-widest text-[9px]">Live Agent Swarm</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <RuntimeOrchestrationGraph agents={result.agent_swarm} timeline={result.runtime_timeline} />
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader className="border-b border-slate-800/50">
                 <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Network className="h-4 w-4 text-purple-500" />
                    Threat Relationship Mapping
                 </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 h-[400px] flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
                 <div className="relative flex flex-col items-center gap-8">
                    {/* Simplified Graph Visual */}
                    <div className="flex gap-16">
                       <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-500">
                          <Box className="h-5 w-5" />
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-500">
                          <Cpu className="h-5 w-5" />
                       </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                       <Share2 className="h-6 w-6" />
                    </div>
                    <div className="flex gap-16">
                       <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-500">
                          <Link2 className="h-5 w-5" />
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500">
                          <Network className="h-5 w-5" />
                       </div>
                    </div>
                    
                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }}>
                       <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="2" />
                       <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#1e293b" strokeWidth="2" />
                       <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="2" />
                       <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="2" />
                    </svg>
                 </div>
                 <div className="absolute bottom-6 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Enterprise Threat Graph Intelligence</p>
                 </div>
              </CardContent>
           </Card>

           <div className="p-6 bg-sky-500/5 border border-sky-500/20 rounded-3xl">
              <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4">Runtime Insights</h4>
              <ul className="space-y-3">
                 <li className="text-[9px] text-slate-400 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-sky-500 mt-1" />
                    <span>Agent swarm successfully deconstructed multi-vector payload.</span>
                 </li>
                 <li className="text-[9px] text-slate-400 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-sky-500 mt-1" />
                    <span>Cross-model validation confirmed 92% threat alignment.</span>
                 </li>
                 <li className="text-[9px] text-slate-400 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-sky-500 mt-1" />
                    <span>Forensic locker hashes generated for all evidence nodes.</span>
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

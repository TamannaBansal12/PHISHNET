"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  ShieldAlert, 
  Activity, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Globe, 
  History, 
  BrainCircuit, 
  Mail, 
  Mic, 
  Video, 
  Search 
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SecurityPostureScore, LiveThreatFeed, SOCOperationsMetrics } from "@/components/advanced-intel-components";

export function DashboardView() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/5 uppercase tracking-widest text-[9px] font-black">Global Threat Intelligence</Badge>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-100 leading-tight">Enterprise Command Center</h1>
          <p className="text-slate-400 font-medium max-w-2xl leading-7 tracking-wide">Real-time orchestration across 4 analysis vectors with integrated <span className="text-sky-400">local LLaMA-3.1</span> reasoning nodes.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-5 py-3 bg-slate-900/40 border border-slate-800/50 rounded-2xl flex items-center gap-4 shadow-inner">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
               <ShieldAlert className="h-5 w-5" />
             </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Operational Integrity</p>
                <p className="text-xs font-black text-slate-200 uppercase tracking-widest">Neutralization Pipeline</p>
              </div>
          </div>
        </div>
      </div>

      <SOCOperationsMetrics />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl h-auto min-h-[400px]">
              <CardHeader className="border-b border-slate-800/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="h-4 w-4 text-sky-500" />
                    Global Threat Detection Heatmap
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">Geospatial distribution of detected adversarial deepfakes and phishing campaigns.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-slate-700 text-slate-500">Live Telemetry</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                <div className="relative w-full h-full flex items-center justify-center">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500/5 via-transparent to-transparent" />
                   <div className="flex flex-col items-center gap-4 text-slate-700">
                     <Globe className="h-32 w-32 opacity-10 animate-[spin_20s_linear_infinite]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Geospatial Intelligence Engine Active</span>
                   </div>
                   {/* Simulated Map Markers */}
                   <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiveThreatFeed />
            <SecurityPostureScore />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-sm font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <History className="h-4 w-4 text-purple-500" />
                Case Investigation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {[
                  { modality: "Email", status: "Critical", score: 92, time: "2m", vector: "Credential Phish" },
                  { modality: "Audio", status: "Safe", score: 12, time: "15m", vector: "Voice Clone" },
                  { modality: "Video", status: "Review", score: 56, time: "1h", vector: "Deepfake Gen" },
                  { modality: "OCR", status: "Critical", score: 88, time: "2h", vector: "Hidden Text" },
                  { modality: "Email", status: "Safe", score: 8, time: "4h", vector: "BEC Attempt" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                        item.status === 'Critical' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
                        item.status === 'Review' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : 
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      )}>
                        {item.modality === 'Email' ? <Mail className="h-5 w-5" /> : item.modality === 'Audio' ? <Mic className="h-5 w-5" /> : item.modality === 'Video' ? <Video className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-200 uppercase tracking-tighter">{item.modality} Analysis</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.vector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", 
                          item.status === 'Critical' ? 'text-rose-500' : item.status === 'Review' ? 'text-amber-500' : 'text-emerald-500'
                        )}>{item.status}</span>
                        <div className={cn("w-1.5 h-1.5 rounded-full", 
                          item.status === 'Critical' ? 'bg-rose-500' : item.status === 'Review' ? 'bg-amber-500' : 'bg-emerald-500'
                        )} />
                      </div>
                      <p className="text-[10px] text-slate-600 font-mono">Sc: {item.score} | {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all">Export Forensic Report</button>
            </CardContent>
          </Card>
          
          <Card className="bg-indigo-500/5 border-indigo-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="h-5 w-5 text-indigo-400" />
                <span className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">Model Reasoning Engine</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Inference Nodes</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold">12/12</span>
                </div>
                <Progress value={100} className="h-1 bg-slate-900" />
                <p className="text-[10px] text-slate-500 leading-tight">Local LLaMA-3.1 analyst node is operational with heavy reasoning enabled for critical vectors.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

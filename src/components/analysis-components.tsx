"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  Zap, 
  Activity, 
  Info, 
  FileText, 
  ShieldAlert, 
  BookOpen, 
  Fingerprint, 
  Search, 
  ShieldCheck, 
  Share2, 
  Network, 
  Crosshair, 
  Target, 
  Shield, 
  Clock, 
  TrendingUp, 
  Download, 
  Copy, 
  Database, 
  Server,
  Terminal,
  BrainCircuit,
  Workflow,
  GanttChart,
  History,
  Lock,
  UserCheck,
  Flame,
  Globe,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ThreatAnalysisResponse, 
  CategorizedEvidence, 
  TimelineEvent, 
  AgentCall, 
  LlamaSummary, 
  RiskContribution,
  GANDefenseLayer,
  PreventionPlaybook,
  ModelRouting
} from "@/store/scanStore";
import { cn } from "@/lib/utils";
import { 
  safeArray, 
  safeString, 
  renderStructuredAIText, 
  FlipCard, 
  SparkBar, 
  ProcessingTimeline,
  LiveThreatFeed,
  AnalystWorkflowCard,
  AgentConsensusBoard,
  RiskExplainabilityPanel,
  ConfidenceHeatmap,
  IncidentLifecycleStepper,
  RedTeamInsightCard,
  RAGEvidencePanel,
  AdaptiveMemoryPanel,
  RoutingDecisionExplanation,
  ProactiveCopilotChips
} from "./advanced-intel-components";
import { sanitizeText } from "@/lib/text-utils";
import { useScanStore } from "@/store/scanStore";

// ---------------------------------------------------------
// 1. SOC Incident Overview (Hero)
// ---------------------------------------------------------
export function SOCOverviewHero({ result }: { result: ThreatAnalysisResponse }) {
  if (!result) return null;
  const isHigh = result.risk_score >= 75;
  const isMed = result.risk_score >= 45 && result.risk_score < 75;
  const color = isHigh ? "text-rose-500" : isMed ? "text-amber-500" : "text-emerald-500";
  const glow = isHigh ? "shadow-[0_0_50px_rgba(244,63,94,0.2)]" : 
               isMed ? "shadow-[0_0_50px_rgba(245,158,11,0.15)]" : 
               "shadow-[0_0_50px_rgba(16,185,129,0.15)]";

  return (
    <Card className={cn(
      "relative overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-3xl mb-8 group transition-all",
      glow
    )}>
      <div className={cn(
        "absolute inset-0 opacity-10 bg-gradient-to-br transition-all duration-1000",
        isHigh ? "from-rose-500 via-transparent to-transparent" : 
        isMed ? "from-amber-500 via-transparent to-transparent" : 
        "from-emerald-500 via-transparent to-transparent"
      )} />
      
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <Badge className={cn(
                  "px-4 py-1 text-xs font-black uppercase tracking-widest border-none",
                  isHigh ? "bg-rose-500 text-slate-950" : 
                  isMed ? "bg-amber-500 text-slate-950" : 
                  "bg-emerald-500 text-slate-950"
                )}>
                  {isHigh ? "Critical Incident" : isMed ? "Moderate Risk" : "Clean Signal"}
                </Badge>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button 
                    onClick={() => useScanStore.getState().setSecurityMode('blue')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      useScanStore.getState().securityMode === 'blue' ? "bg-sky-500 text-slate-950 shadow-lg" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Blue Team
                  </button>
                  <button 
                    onClick={() => useScanStore.getState().setSecurityMode('red')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      useScanStore.getState().securityMode === 'red' ? "bg-rose-500 text-slate-950 shadow-lg" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Red Team
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-800" />
                
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase tracking-tighter">
                  <Database className="h-3 w-3" />
                  ID: {sanitizeText(result.case_metadata?.case_id) || 'CAS-PENDING'}
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] uppercase tracking-tighter">
                  <Clock className="h-3 w-3" />
                  {sanitizeText(result.case_metadata?.timestamp) || 'T-0'}
                </div>

                <button 
                  onClick={() => window.print()}
                  className="ml-auto no-print px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Print Case Study
                </button>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-slate-100 leading-none tracking-tight mb-4">
                {sanitizeText(result.ai_analyst_briefing?.what_happened) || 'System Orchestration Underway'}
              </h1>
              
              <p className="text-lg text-slate-400 max-w-4xl leading-relaxed tracking-wide font-medium italic">
                "{sanitizeText(result.ai_analyst_briefing?.why_it_matters) || 'Analyzing semantic signals and behavioral heuristics.'}"
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-800/50">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Attack Vector</span>
                <span className="text-slate-200 font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-sky-400" />
                  {sanitizeText(result.case_metadata?.modality) || 'Generic'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Business Impact</span>
                <span className="text-slate-200 font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-rose-400" />
                  {sanitizeText(result.ai_analyst_briefing?.who_is_targeted) || 'General Population'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Detection Stage</span>
                <span className="text-slate-200 font-semibold">Active Monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="flex lg:flex-col justify-center items-center gap-8 lg:w-72 lg:pl-12 lg:border-l lg:border-slate-800/50">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="6" />
                <motion.circle 
                  cx="50" cy="50" r="42" fill="none" stroke="currentColor" 
                  className={color} strokeWidth="6" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${((result.risk_score || 0) / 100) * 264} 264` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-5xl font-black mb-0 tracking-tighter", color)}>{result.risk_score || 0}</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Posture</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Confidence</span>
                <span className="text-lg font-black text-sky-400">{( (result.detection?.confidence || 0) * 100).toFixed(0)}%</span>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">SLA Priority</span>
                <span className={cn("text-lg font-black", isHigh ? "text-rose-500" : "text-emerald-500")}>
                  {isHigh ? "P0" : "P2"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------
// 2. AI Analyst Summary Card
// ---------------------------------------------------------
export function AIAnalystSummaryCard({ summary }: { summary?: LlamaSummary }) {
  if (!summary) return (
    <Card className="bg-slate-900/20 border-slate-800/50 animate-pulse mb-8">
      <CardContent className="h-48 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <BrainCircuit className="h-8 w-8 animate-spin" />
          <span className="text-sm font-mono uppercase tracking-widest">LLaMA analyst is reviewing evidence...</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-slate-950 border-indigo-500/20 mb-8 relative overflow-hidden group soc-card-lift soc-glow-border">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <BrainCircuit className="h-32 w-32 text-indigo-500" />
      </div>
      
      <CardHeader className="pb-2 border-b border-indigo-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-indigo-300 flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-black">
            <BrainCircuit className="h-5 w-5" />
            AI Analyst Summary Briefing
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-[9px] text-indigo-400 border-indigo-400/20 bg-indigo-500/5 uppercase font-black tracking-widest px-2 py-0">
              {summary.model === 'llama3.1' ? 'Local LLaMA Reasoning' : 'AI Intelligence Layer'}
            </Badge>
            {summary.fallback_used && (
              <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-500/20 bg-amber-500/5 uppercase font-black tracking-widest px-2 py-0">
                Fallback Reasoning Active
              </Badge>
            )}
            <button className="text-slate-500 hover:text-indigo-400 transition-colors" title="Copy Operational Summary">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 max-w-none">
        {renderStructuredAIText(summary.summary)}
        
        <div className="mt-8 pt-6 border-t border-indigo-500/10">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-4">Proactive Analyst Insights</span>
          <ProactiveCopilotChips onSelect={(prompt) => {
              const chatInput = document.getElementById('ai-copilot-input') as HTMLTextAreaElement;
              const chatForm = document.getElementById('ai-copilot-form') as HTMLFormElement;
              if (chatInput && chatForm) {
                chatInput.value = prompt;
                const event = new Event('input', { bubbles: true });
                chatInput.dispatchEvent(event);
                // Optionally auto-submit
                // chatForm.dispatchEvent(new Event('submit', { bubbles: true }));
              }
          }} />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------
// 3. Runtime Orchestration Graph
// ---------------------------------------------------------
export function RuntimeOrchestrationGraph({ agents, timeline }: { agents: AgentCall[], timeline: TimelineEvent[] }) {
  const safeAgents = safeArray(agents);
  const safeTimeline = safeArray(timeline);

  return (
    <Card className="bg-slate-900/40 border-slate-800 mb-8 overflow-hidden soc-card-lift soc-glow-border">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black">
            <Workflow className="h-4 w-4 text-purple-500" />
            Runtime Orchestration Graph
          </CardTitle>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Escalated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Skipped</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-12 overflow-x-auto">
          <div className="flex items-center min-w-max gap-4 px-4">
            {safeAgents.map((agent, idx) => (
              <div key={idx} className="flex items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "relative flex flex-col items-center w-48 p-4 rounded-xl border transition-all group soc-card-lift soc-glow-border",
                    agent.status === "completed" ? "bg-emerald-500/5 border-emerald-500/30" :
                    agent.status === "escalated" ? "bg-rose-500/5 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]" :
                    "bg-slate-900/50 border-slate-800 opacity-40 grayscale"
                  )}
                >
                  <div className={cn(
                    "absolute -top-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                    agent.status === "completed" ? "bg-emerald-500 text-slate-950" :
                    agent.status === "escalated" ? "bg-rose-500 text-slate-950 animate-pulse" :
                    "bg-slate-800 text-slate-400"
                  )}>
                    {agent.status}
                  </div>
                  
                  <span className="text-xs font-black text-slate-200 mb-3 text-center">{agent.name}</span>
                  
                  <div className="space-y-1.5 w-full">
                    <SparkBar label="Execution" value={Math.min((agent.execution_time_ms / 500) * 100, 100)} color="bg-purple-500" />
                    <SparkBar label="Confidence" value={agent.confidence * 100} color="bg-sky-500" />
                  <div className="pt-2 border-t border-slate-800/50 mt-2">
                    <span className="text-[8px] text-slate-500 font-bold uppercase block mb-1">Runtime Reasoning</span>
                    <p className="text-[9px] text-slate-400 leading-tight italic truncate">{sanitizeText(agent.runtime_reason)}</p>
                  </div>
                  </div>
                </motion.div>
                
                {idx < safeAgents.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-12 h-0.5 relative",
                      safeAgents[idx+1].status !== "skipped" ? "bg-slate-800" : "bg-slate-800"
                    )}>
                      {safeAgents[idx+1].status !== "skipped" && (
                        <>
                          <div className="absolute inset-0 bg-emerald-500/20" />
                          <motion.div 
                            className="absolute inset-y-0 w-2 bg-sky-400 blur-[1px] shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />
                        </>
                      )}
                    </div>
                    <ChevronRight className={cn(
                      "h-3 w-3 -mt-[7px] ml-10",
                      safeAgents[idx+1].status !== "skipped" ? "text-emerald-500" : "text-slate-800"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-950/50 border-t border-slate-800 p-4 flex items-center gap-6 overflow-x-auto px-8">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">Runtime Events</span>
          <div className="flex items-center gap-8 min-w-max">
            {safeTimeline.map((event, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                <span className="text-[10px] font-bold text-slate-300">{sanitizeText(event.event)}</span>
                <span className="text-[9px] font-mono text-slate-500">{(event.timestamp.split('T')[1]?.substring(0, 5)) || "T-0"}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------
// 4. Evidence Analysis Workspace
// ---------------------------------------------------------
export function EvidenceAnalysisWorkspace({ categories, riskContribution }: { categories: CategorizedEvidence, riskContribution: RiskContribution }) {
  const [activeCategory, setActiveCategory] = useState<keyof CategorizedEvidence>("url_evidence");
  
  const categoryMeta = {
    url_evidence: { label: "URL & Links", icon: Globe, color: "text-rose-400", bg: "bg-rose-500/10" },
    header_evidence: { label: "Header & Routing", icon: Server, color: "text-amber-400", bg: "bg-amber-500/10" },
    social_engineering_evidence: { label: "Social Engineering", icon: Flame, color: "text-purple-400", bg: "bg-purple-500/10" },
    brand_spoof_evidence: { label: "Brand Integrity", icon: Fingerprint, color: "text-orange-400", bg: "bg-orange-500/10" },
    attachment_evidence: { label: "Payload Analysis", icon: Database, color: "text-slate-400", bg: "bg-slate-500/10" },
    model_evidence: { label: "Heuristic Signals", icon: Activity, color: "text-sky-400", bg: "bg-sky-500/10" },
  };

  const safeCategories = categories || {
    url_evidence: [],
    header_evidence: [],
    social_engineering_evidence: [],
    brand_spoof_evidence: [],
    attachment_evidence: [],
    model_evidence: []
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800 mb-8 min-h-[500px] overflow-hidden soc-card-lift soc-glow-border">
      <CardHeader className="border-b border-slate-800/50 pb-4 bg-slate-950/20">
        <CardTitle className="text-slate-200 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black">
          <Search className="h-4 w-4 text-sky-500" />
          Evidence Investigation Workspace
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_260px] divide-y lg:divide-y-0 lg:divide-x divide-slate-800/50 items-start">
          {/* 1. Left: Categories */}
          <div className="p-5 space-y-2 bg-slate-900/10">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 px-2">Investigation Scope</span>
            {(Object.keys(categoryMeta) as Array<keyof CategorizedEvidence>).map((cat) => {
              const meta = categoryMeta[cat];
              const isActive = activeCategory === cat;
              const count = safeArray(safeCategories[cat]).length;
              
              return (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[10px] font-bold transition-all border",
                    isActive ? "bg-slate-800 border-slate-700 text-slate-100 shadow-lg" : "text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-800/30"
                  )}
                >
                  <meta.icon className={cn("h-3.5 w-3.5", isActive ? meta.color : "opacity-30")} />
                  <span className="truncate">{meta.label}</span>
                  {count > 0 && (
                    <Badge variant="outline" className={cn("ml-auto border-none h-4 px-1.5 text-[8px]", isActive ? meta.bg + " " + meta.color : "bg-slate-900 text-slate-700")}>
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* 2. Middle: Evidence Feed */}
          <div className="p-6 min-w-0 bg-slate-950/20">
            <ProcessingTimeline />
            
            <div className="flex items-center justify-between mb-6 border-b border-slate-800/50 pb-4">
              <h3 className="text-sm font-black text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                {categoryMeta[activeCategory]?.label || "Evidence Feed"}
                <span className="text-slate-700 mx-1">/</span>
                <span className="text-slate-500 text-[10px] font-mono tracking-tighter normal-case">Forensic Trace</span>
              </h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {safeArray(safeCategories[activeCategory]).length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-900/50 rounded-2xl bg-slate-900/5">
                    <ShieldCheck className="h-8 w-8 mb-3 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center">No anomalies detected in category</p>
                  </div>
                ) : (
                  safeArray(safeCategories[activeCategory]).map((ev, i) => {
                    const Icon = categoryMeta[activeCategory]?.icon || Info;
                    return (
                      <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-4 hover:border-slate-700 transition-all group">
                        <div className={cn("p-2 rounded-lg mt-0.5 shrink-0", categoryMeta[activeCategory]?.bg)}>
                          <Icon className={cn("h-3.5 w-3.5", categoryMeta[activeCategory]?.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 opacity-50">Extracted Artifact</span>
                          <p className="text-xs text-slate-300 font-mono break-words leading-relaxed">{sanitizeText(ev)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* 3. Right: Risk Metrics */}
          <div className="p-6 space-y-8 bg-slate-900/20">
            <div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-5">Risk Contribution</span>
              <RiskContributionBoard risk={riskContribution} hideTitle />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 5. GAN Adaptive Defense Lab
export function GANAdaptiveDefense({ gan }: { gan: GANDefenseLayer }) {
  if (!gan) return null;

  const Front = (
    <Card className="bg-slate-900/40 border-slate-800 overflow-hidden relative soc-card-lift soc-glow-border h-auto">
      <CardHeader className="border-b border-slate-800/50 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            Adaptive Defense Lab (GAN)
          </CardTitle>
          <Badge variant="outline" className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px] font-black uppercase tracking-widest">
            Neural Hardening Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-10 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-12 mb-8">
          <div className="flex items-center justify-between w-full relative max-w-2xl px-12">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800 -translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
                <Database className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sample</span>
            </div>

            <div className="flex-1 relative h-0.5">
               <motion.div 
                 animate={{ left: ["0%", "100%"] }} 
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 -translate-y-1/2 w-4 h-[1px] bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
               />
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Cpu className="h-7 w-7 text-indigo-400 animate-pulse" />
              </div>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest text-center">Generator</span>
            </div>

            <div className="flex-1 relative h-0.5">
               <motion.div 
                 animate={{ left: ["0%", "100%"] }} 
                 transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                 className="absolute top-1/2 -translate-y-1/2 w-4 h-[1px] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
               />
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest text-center">Discriminator</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-slate-800/50">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Variants</span>
            <span className="text-xs text-slate-200 font-bold">{gan.generated_variants || 0}</span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Queue</span>
            <span className="text-xs text-slate-200 font-bold">{gan.retraining_queue_status}</span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Sandbox</span>
            <span className="text-xs text-slate-200 font-bold">{gan.safety_sandbox_status}</span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Efficiency</span>
            <span className="text-xs text-slate-200 font-bold">94%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Back = (
    <Card className="bg-slate-950 border-indigo-500/30 h-auto overflow-hidden">
      <CardHeader className="border-b border-indigo-500/20 bg-indigo-500/5 pb-4">
        <CardTitle className="text-indigo-300 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black">
          <BrainCircuit className="h-4 w-4" />
          Neural Parameters & Hardening
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <SparkBar label="Training Epochs" value={82} color="bg-indigo-500" />
          <SparkBar label="Retraining Accuracy" value={98} color="bg-emerald-500" />
          <SparkBar label="Adversarial Resistance" value={91} color="bg-rose-500" />
        </div>
        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Generator Reasoning</span>
             <p className="text-xs text-slate-400 italic leading-relaxed">"{sanitizeText(gan.generator_action)}"</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Discriminator Delta</span>
             <p className="text-xs text-slate-400 italic leading-relaxed">"{sanitizeText(gan.discriminator_update)}"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return <FlipCard front={Front} back={Back} />;
}

// ---------------------------------------------------------
// Support Components
// ---------------------------------------------------------

export function RiskContributionBoard({ risk, hideTitle = false }: { risk: RiskContribution, hideTitle?: boolean }) {
  if (!risk) return null;
  return (
    <div className="space-y-6">
      {!hideTitle && (
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Risk Mathematical Fusion</span>
      )}
      <div className="space-y-5">
        <SparkBar label="Base ML Detection" value={risk.base_ml_score || 0} color="bg-sky-500" />
        <SparkBar label="URL / Domain Penalty" value={risk.url_penalty || 0} color="bg-rose-500" />
        <SparkBar label="Header / Metadata" value={risk.header_penalty || 0} color="bg-amber-500" />
        <SparkBar label="Brand Spoofing" value={(risk.brand_spoof_penalty || 0)} color="bg-orange-500" />
        <SparkBar label="Social Engineering" value={(risk.social_engineering_penalty || 0)} color="bg-purple-500" />
      </div>
      <div className="pt-6 border-t border-slate-800/50">
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Fused Risk Score</span>
            <span className={cn("text-2xl font-black tracking-tighter", (risk.final_score || 0) > 70 ? "text-rose-500" : "text-emerald-500")}>
              {risk.final_score || 0}
            </span>
          </div>
          <Badge className={cn("px-3 py-1 text-[10px] font-black uppercase border-none", (risk.final_score || 0) > 70 ? "bg-rose-500 text-slate-950" : "bg-emerald-500 text-slate-950")}>
            {(risk.final_score || 0) > 70 ? "Critical" : "Standard"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function AnalystRightPanel({ result }: { result: ThreatAnalysisResponse }) {
  if (!result) return null;
  const isHigh = result.risk_score >= 75;
  const isMed = result.risk_score >= 45 && result.risk_score < 75;
  const color = isHigh ? "text-rose-500" : isMed ? "text-amber-500" : "text-emerald-500";
  const safeAgents = safeArray(result.agent_swarm);
  const safeMitre = safeArray(result.mitre_attack);
  const modality = result.case_metadata?.modality?.toLowerCase() || 'email';

  return (
    <div className="w-80 h-[calc(100vh-4rem)] sticky top-0 bg-slate-950/50 backdrop-blur-md border-l border-slate-900 p-6 space-y-8 flex flex-col shrink-0 overflow-y-auto z-40 soc-glow-border">
      <div className="space-y-6">
        <AnalystWorkflowCard modality={modality} />
        <LiveThreatFeed />
      </div>

      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Operational Profile</span>
        <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl mb-6">
           <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <UserCheck className="h-4 w-4" />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest leading-none">Senior SOC Analyst</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Tier 3 Responder</p>
           </div>
        </div>

        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-6">Threat Severity</span>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <span className={cn("text-6xl font-black mb-1", color)}>{result.risk_score || 0}</span>
            <span className={cn("text-[10px] font-black uppercase tracking-widest", color)}>{result.risk_level || 'Unknown'} LEVEL</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 justify-center">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isHigh ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")} />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{sanitizeText(result.case_metadata?.report_status) || 'Active'}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-4">MITRE Mapping</span>
        <div className="space-y-2">
          {safeMitre.slice(0, 3).map((tech, i) => (
            <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-sky-400 block mb-0.5">{sanitizeText(tech.technique_id)}</span>
                <span className="text-[10px] font-bold text-slate-200 line-clamp-1">{sanitizeText(tech.technique_name)}</span>
              </div>
              <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-slate-700 text-slate-500 shrink-0 ml-2">
                {safeString(tech.tactic).split(' ')[0]}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-4">Active Agent Swarm</span>
        <div className="flex flex-wrap gap-1.5">
          {safeAgents.slice(0, 6).map((agent, i) => (
            <Badge key={i} className={cn(
              "text-[8px] uppercase tracking-tighter border-none px-2 py-0.5 whitespace-nowrap",
              agent.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
              agent.status === "escalated" ? "bg-rose-500/10 text-rose-400" :
              "bg-slate-900 text-slate-600"
            )}>
              {sanitizeText(agent.name)}
            </Badge>
          ))}
          {safeAgents.length > 6 && (
            <Badge className="text-[8px] uppercase tracking-tighter border-none px-2 py-0.5 bg-slate-900 text-slate-600">
              +{safeAgents.length - 6} More
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Response Components
// ---------------------------------------------------------

export function ExpandedPlaybook({ playbook }: { playbook: PreventionPlaybook }) {
  if (!playbook) return null;
  return (
    <Card className="bg-slate-900/40 border-slate-800 mb-8 overflow-hidden soc-card-lift soc-glow-border">
      <CardHeader className="border-b border-slate-800/50 pb-4">
        <CardTitle className="text-slate-200 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          SOC Response & Mitigation Playbook
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 bg-rose-500 rounded-full shrink-0" />
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Immediate Containment</span>
                <p className="text-sm text-slate-200 font-bold">{sanitizeText(playbook.immediate_action)}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-sky-500 rounded-full shrink-0" />
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Technical Controls</span>
                <p className="text-sm text-slate-300">{sanitizeText(playbook.technical_control)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 bg-amber-500 rounded-full shrink-0" />
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Escalation Path</span>
                <p className="text-sm text-slate-300">{sanitizeText(playbook.escalation_team)}</p>
              </div>
            </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Compliance & Audit Note</span>
                <p className="text-xs text-slate-400 italic font-serif leading-relaxed">
                  "{sanitizeText(playbook.compliance_note)}"
                </p>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GreenModelEconomy({ routing }: { routing: ModelRouting }) {
  if (!routing) return null;

  return (
    <div className="relative z-0 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 h-auto overflow-visible soc-card-lift soc-glow-border">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-emerald-400 leading-none">
              Model Economy Intelligence
            </h3>
            <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed font-medium">
              Routing decision logic and efficiency analysis
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase tracking-widest px-2 py-0.5 whitespace-nowrap">
            {routing.compute_efficiency || 'Standard'}
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800/60" />

      {/* Routing Justification */}
      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
          Routing Justification
        </span>
        <p className="text-[11px] text-slate-300 leading-relaxed font-medium pl-3">
          {sanitizeText(routing.routing_reason) || 'Standard automated routing based on evidence severity.'}
        </p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Compute Savings</span>
          <span className="text-[11px] text-emerald-400 font-bold font-mono">
            +{routing.compute_efficiency || '32%'}
          </span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Carbon Impact</span>
          <span className="text-[11px] text-slate-400 font-bold font-mono">
            {routing.carbon_impact || '0.04g CO₂e'}
          </span>
        </div>
      </div>

      {/* Sustainability bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
          <span>CO₂ Reduction Efficiency</span>
          <span className="text-emerald-400 font-mono">85%</span>
        </div>
        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

    </div>
  );
}

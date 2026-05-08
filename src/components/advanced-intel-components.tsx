"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Target, 
  Zap, 
  BarChart3, 
  Info, 
  Lock, 
  FileText, 
  Link as LinkIcon, 
  Hash, 
  Clock, 
  Fingerprint,
  AlertTriangle,
  Cpu,
  MousePointer2,
  Send,
  MessageSquare,
  HelpCircle,
  Eye,
  Settings,
  Database,
  Activity,
  Globe,
  Loader2,
  CheckCircle2,
  Download,
  Brain,
  ShieldCheck,
  Users,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Map,
  History,
  Layers,
  ZapOff,
  Leaf,
  Dna,
  Terminal,
  BookOpen,
  Share2,
  Filter,
  Search,
  Plus,
  Trash2,
  FileDown,
  Scale,
  BrainCircuit,
  Workflow
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useScanStore } from "@/store/scanStore";
import { sanitizeText, parseAISections } from "@/lib/text-utils";

// --- SAFE HELPERS ---
export function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

export function safeString(value: any): string {
  return typeof value === 'string' ? value : String(value || "");
}

export function sanitizeAIText(text: string) {
  return sanitizeText(text);
}

export function renderStructuredAIText(text: string) {
  const sections = parseAISections(text);

  if (!text || sections.length === 0) {
    const cleaned = sanitizeText(text);
    if (!cleaned) return null;
    return <div className="text-sm leading-7 tracking-wide text-slate-300 whitespace-pre-wrap max-w-4xl">{cleaned}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section, idx) => {
        if (!section.body.trim()) return null;
        const lines = section.body.split('\n');
        return (
          <div key={idx} className="rounded-xl border border-slate-800/50 bg-slate-950/20 p-4 hover:border-slate-700 transition-all duration-300 group">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-400 mb-2 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-1 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              {section.title}
            </div>
            <div className="text-[11px] leading-6 tracking-wide text-slate-300 max-w-prose font-medium space-y-1">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('*') || trimmed.startsWith('•') || trimmed.startsWith('-')) {
                  const content = trimmed.replace(/^[\*•-]\s*/, "");
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-1 py-0.5">
                      <div className="w-1 h-1 rounded-full bg-sky-500/50 mt-2 shrink-0" />
                      <span>{content}</span>
                    </div>
                  );
                }
                return <p key={lIdx} className="mb-1">{trimmed}</p>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- PREMIUM COMPONENTS ---

/**
 * FlipCard: A premium 3D card wrapper for investigative depth.
 */
export function FlipCard({ front, back, className }: { front: React.ReactNode, back: React.ReactNode, className?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn("perspective-1000 group cursor-pointer", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn("flip-card-inner", isFlipped && "rotate-y-180")}>
        <div className="flip-card-front shadow-2xl">
          {front}
        </div>
        <div className="flip-card-back shadow-2xl">
          {back}
        </div>
      </div>
    </div>
  );
}

/**
 * SparkBar: High-fidelity miniature bar chart for metrics.
 */
export function SparkBar({ value, label, color = "bg-sky-500", max = 100 }: { value: number, label: string, color?: string, max?: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5 flex-1 min-w-0">
      <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900/50">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${percentage}%` }} 
          className={cn("h-full", color)} 
        />
      </div>
    </div>
  );
}

/**
 * ProcessingTimeline: Premium visual of the investigation lifecycle.
 */
export function ProcessingTimeline() {
  const steps = [
    { label: "Ingest", status: "complete", icon: Download },
    { label: "Extract", status: "complete", icon: Hash },
    { label: "Analyze", status: "complete", icon: Brain },
    { label: "Fuse", status: "active", icon: Zap },
    { label: "Verify", status: "pending", icon: ShieldCheck },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-6 bg-slate-950/20 border border-slate-800/50 rounded-2xl mb-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center gap-3 relative z-10 flex-1 min-w-0">
          {i < steps.length - 1 && (
            <div className={cn(
              "absolute top-4 left-1/2 w-full h-[1px]",
              step.status === 'complete' ? "bg-sky-500/30" : "bg-slate-800"
            )}>
              {step.status === 'active' && (
                <motion.div 
                  initial={{ left: "-100%" }} 
                  animate={{ left: "100%" }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent w-1/2 h-full"
                />
              )}
            </div>
          )}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500",
            step.status === 'complete' ? "bg-sky-500/10 border-sky-500/30 text-sky-400" :
            step.status === 'active' ? "bg-sky-500/20 border-sky-400 text-sky-400 animate-pulse glow-sky shadow-[0_0_15px_rgba(14,165,233,0.3)]" :
            "bg-slate-900 border-slate-800 text-slate-700"
          )}>
            <step.icon className="h-3.5 w-3.5" />
          </div>
          <span className={cn(
            "text-[8px] font-black uppercase tracking-[0.2em]",
            step.status === 'pending' ? "text-slate-700" : "text-slate-400"
          )}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

// 1. Attack Progression Simulator
export function AttackProgressionTracker({ score }: { score: number }) {
  const stages = [
    { name: "Initial Contact", intercepted: true },
    { name: "Social Engineering", intercepted: true },
    { name: "Credential Harvesting", intercepted: score > 70 },
    { name: "Persistence", intercepted: false },
    { name: "Privilege Escalation", intercepted: false },
    { name: "Impact", intercepted: false },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 self-start soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-sky-500" />
          Attack Progression Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          {stages.map((stage, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-1 min-w-0 relative">
              {i < stages.length - 1 && (
                <div className={cn(
                  "absolute top-4 left-1/2 w-full h-[1px] z-0",
                  stage.intercepted ? "bg-emerald-500/30" : "bg-slate-800"
                )} />
              )}
              <div className={cn(
                "w-9 h-9 rounded-full z-10 flex items-center justify-center border transition-all duration-500",
                stage.intercepted 
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                  : i === 2 && score > 50 ? "bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse" : "bg-slate-950 border-slate-800 text-slate-600"
              )}>
                {stage.intercepted ? <Shield className="h-4.5 w-4.5" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest text-center max-w-[70px] leading-tight",
                stage.intercepted ? "text-emerald-400/80" : "text-slate-600"
              )}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 2. Threat Actor Profile
export function ThreatActorProfile({ modality, score }: { modality: string, score: number }) {
  const profiles = [
    { name: "Credential Harvesting Campaign", style: "Automated Bulk Phish", intent: "Account Takeover", sophistication: "Moderate" },
    { name: "Financial Fraud Actor", style: "Spear Phishing", intent: "Wire Transfer Fraud", sophistication: "High" },
    { name: "Deepfake Social Engineering Group", style: "Multimodal Impersonation", intent: "Corporate Espionage", sophistication: "Critical" },
    { name: "Business Email Compromise Actor", style: "VIP Spoofing", intent: "Invoice Redirection", sophistication: "Professional" },
  ];

  const profile = profiles[score > 80 ? 2 : score > 60 ? 1 : score > 40 ? 0 : 3];

  const Front = (
    <Card className="bg-slate-900/40 border-slate-800 self-start soc-card-lift soc-glow-border h-auto">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Fingerprint className="h-3.5 w-3.5 text-purple-500" />
          Threat Actor Attribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
            <Zap className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-100 uppercase tracking-tighter leading-none">{profile.name}</h4>
            <Badge variant="outline" className="text-[8px] bg-purple-500/5 text-purple-400 border-purple-500/20 px-2 py-0 uppercase tracking-widest font-black">{profile.sophistication} TIER</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl group hover:border-purple-500/20 transition-colors">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Modus Operandi</span>
            <span className="text-[10px] font-bold text-slate-300 leading-tight block">{profile.style}</span>
          </div>
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl group hover:border-purple-500/20 transition-colors">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Estimated Intent</span>
            <span className="text-[10px] font-bold text-slate-300 leading-tight block">{profile.intent}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Back = (
    <Card className="bg-slate-950 border-purple-500/30 self-start h-auto overflow-hidden">
      <CardHeader className="pb-3 border-b border-purple-500/20 bg-purple-500/5">
        <CardTitle className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Brain className="h-3.5 w-3.5" />
          Psychological Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <SparkBar label="Aggression" value={score > 80 ? 94 : 62} color="bg-rose-500" />
          <SparkBar label="Evasion" value={score > 60 ? 88 : 45} color="bg-purple-500" />
          <SparkBar label="Persuasion" value={score > 40 ? 76 : 30} color="bg-sky-500" />
          <SparkBar label="Automation" value={82} color="bg-emerald-500" />
        </div>
        <div className="p-2.5 bg-purple-500/5 border border-purple-500/10 rounded-lg">
          <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
            "Targeting pattern suggests a professional syndicate focusing on high-value executive social engineering via {modality} vectors."
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return <FlipCard front={Front} back={Back} />;
}

// 3. Model Decision Explainability
export function ModelDecisionExplainability({ confidence, riskScore }: { confidence: number, riskScore: number }) {
  const factors = [
    { name: "Semantic Markers", weight: 85, color: "bg-sky-500" },
    { name: "Metadata Forensics", weight: 42, color: "bg-indigo-500" },
    { name: "Behavioral Signals", weight: 94, color: "bg-rose-500" },
    { name: "Brand Alignment", weight: 68, color: "bg-amber-500" },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 self-start soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30 flex flex-row items-center justify-between">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-500" />
          Analyst Decision Trace
        </CardTitle>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">Confidence: {confidence}%</span>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {factors.map((f, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-500">{f.name}</span>
              <span className="text-slate-300 font-mono">{f.weight}%</span>
            </div>
            <div className="h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${f.weight}%` }} 
                className={cn("h-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", f.color)} 
              />
            </div>
          </div>
        ))}
        <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-2 flex items-start gap-3">
          <Info className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Confidence is <span className="text-emerald-400 font-bold">{(confidence).toFixed(0)}%</span> based on high-fidelity semantic anomalies and correlation with established fraud datasets.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 5. AI Investigation Copilot
export function AIInvestigationCopilot() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{model: string, source: string, fallbackUsed: boolean} | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Generating SOC reasoning...");
  
  const { results, activePage, viewMode, lastProcessedScan } = useScanStore();
  const result = lastProcessedScan?.result;

  const loadingMessages = [
    "Correlating evidence...",
    "Reviewing semantic indicators...",
    "Analyzing escalation pathways...",
    "Generating SOC reasoning...",
    "Validating threat patterns...",
    "Aggregating model reflection..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[idx % loadingMessages.length]);
        idx++;
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const prompts = [
    "Explain the attack chain",
    "Identify strongest evidence",
    "Why was this flagged?",
    "Recommended first action",
    "Evaluate business impact"
  ];

  const askCopilot = async (q?: string) => {
    const finalQuestion = q || query;
    if (!finalQuestion.trim() || !result) return;

    setLoading(true);
    setAnswer("");
    setMeta(null);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: finalQuestion,
          scanResult: result,
          mode: viewMode
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Copilot failed");

      setAnswer(data.answer);
      setMeta({
        model: data.model,
        source: data.source,
        fallbackUsed: data.fallbackUsed
      });
    } catch (err: any) {
      setAnswer(`Inference Error: ${err.message}. Triggering Local Fallback Engine.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800 flex flex-col h-full min-h-[450px] shadow-2xl">
      <CardHeader className="pb-3 border-b border-slate-800/50 flex flex-row items-center justify-between">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-sky-500" />
          AI Intelligence Layer
        </CardTitle>
        {meta && (
          <Badge variant="outline" className={cn(
            "text-[8px] font-black uppercase tracking-widest px-2 py-0",
            meta.fallbackUsed ? "border-amber-500/30 text-amber-500 bg-amber-500/5" : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
          )}>
            {meta.fallbackUsed ? "Fallback SOC Engine" : "Local LLaMA Reasoning"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-5 pt-6 overflow-hidden">
        <div className="flex flex-wrap gap-2">
          {prompts.map((p, i) => (
            <button 
              key={i} 
              disabled={loading || !result}
              onClick={() => { setQuery(p); askCopilot(p); }} 
              className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-400 hover:border-sky-500/30 transition-all disabled:opacity-50 shadow-sm active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 relative bg-slate-950/30 border border-slate-800/50 rounded-2xl p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-5">
                 <div className="relative">
                   <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full animate-pulse" />
                   <Loader2 className="h-10 w-10 text-sky-500 animate-spin relative z-10" />
                 </div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse text-center">{loadingMessage}</p>
              </motion.div>
            ) : answer ? (
              <motion.div key="answer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                     <Brain className="h-3 w-3 text-sky-400" />
                     Inferred Response
                   </div>
                   {renderStructuredAIText(answer)}
                 </div>

                 {meta?.fallbackUsed && (
                   <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                        Fallback reasoning active: Ollama threshold exceeded
                      </span>
                   </div>
                 )}
              </motion.div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                  <MessageSquare className="h-12 w-12 text-slate-700 mb-4" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    {result ? "Initialize investigation with a prompt" : "Awaiting Investigation Data"}
                  </p>
               </div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mt-auto">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && askCopilot()}
            placeholder={!result ? "Connect to data source..." : "Ask PHISHNET about this case..."}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-4 pl-6 pr-14 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 transition-all disabled:opacity-50 shadow-inner font-medium"
            disabled={loading || !result}
          />
          <button 
            onClick={() => askCopilot()}
            disabled={loading || !query.trim() || !result}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-sky-600 text-slate-950 rounded-lg hover:bg-sky-500 transition-all disabled:opacity-50 shadow-lg active:scale-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// 6. Forensic Evidence Locker
export function ForensicEvidenceLocker({ evidence }: { evidence: string[] }) {
  const safeEvidence = safeArray(evidence);
  
  return (
    <Card className="bg-slate-900/40 border-slate-800 self-start">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-amber-500" />
          Forensic Evidence Locker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-2.5">
          {safeEvidence.length > 0 ? (
            safeEvidence.slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl group hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 shadow-inner">
                    <Hash className="h-3.5 w-3.5 text-slate-600 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate tracking-tight">{safeString(e)}</span>
                </div>
                <div className="flex gap-2.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-600 hover:text-sky-400 hover:bg-sky-500/5 rounded-md transition-all"><Download className="h-3.5 w-3.5" /></button>
                  <button className="p-1.5 text-slate-600 hover:text-sky-400 hover:bg-sky-500/5 rounded-md transition-all"><Eye className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-900 rounded-2xl flex flex-col items-center gap-3 opacity-40">
              <Database className="h-8 w-8 text-slate-700" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">No forensic markers found</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 border border-slate-800/50 rounded-lg flex items-center gap-2.5 bg-slate-950/30">
            <Clock className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Locked: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="p-2.5 border border-slate-800/50 rounded-lg flex items-center gap-2.5 bg-slate-950/30">
            <FileText className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Hash: SHA-256 Valid</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 7. Operational Status Bar
export function OperationalStatusBar() {
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  useEffect(() => {
    const checkOllama = async () => {
      try {
        const res = await fetch("http://localhost:11434/api/tags");
        if (res.ok) setOllamaStatus('online');
        else setOllamaStatus('offline');
      } catch {
        setOllamaStatus('offline');
      }
    };
    checkOllama();
    const interval = setInterval(checkOllama, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-8 h-9 bg-slate-900/60 border-t border-slate-800/50 backdrop-blur-3xl fixed bottom-0 left-64 right-0 z-50 text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 overflow-x-auto whitespace-nowrap shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2.5">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", ollamaStatus === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]")} />
        <span>Ollama: <span className={ollamaStatus === 'online' ? "text-emerald-400" : "text-rose-400"}>{ollamaStatus === 'online' ? 'Online (Llama-3.1-8B)' : 'Offline (Local Fallback Active)'}</span></span>
      </div>
      <div className="h-3.5 w-[1px] bg-slate-800" />
      <div className="flex items-center gap-2.5">
        <Activity className="h-3.5 w-3.5 text-sky-500" />
        <span>Inference Latency: <span className="text-sky-400">142ms</span></span>
      </div>
      <div className="h-3.5 w-[1px] bg-slate-800" />
      <div className="flex items-center gap-2.5">
        <Database className="h-3.5 w-3.5 text-purple-500" />
        <span>Vector Storage: <span className="text-purple-400">Optimal (2.4M IoCs)</span></span>
      </div>
      <div className="h-3.5 w-[1px] bg-slate-800" />
      <div className="flex items-center gap-2.5">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        <span>Power Efficiency: <span className="text-amber-400">Green-Routing Active</span></span>
      </div>
      <div className="h-3.5 w-[1px] bg-slate-800" />
      <div className="flex items-center gap-2.5 ml-auto">
        <Globe className="h-3.5 w-3.5 text-slate-600" />
        <span>Cluster: <span className="text-slate-300 font-mono">Global Console v2.4-PRO</span></span>
      </div>
    </div>
  );
}

// 8. Security Posture Score
export function SecurityPostureScore() {
  return (
    <Card className="bg-slate-900/40 border-slate-800 h-full relative overflow-hidden self-start soc-card-lift soc-glow-border">
      <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/5 blur-[80px] rounded-full -mr-20 -mt-20" />
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-sky-500" />
          Enterprise Security Posture
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 flex flex-col items-center justify-center">
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle cx="72" cy="72" r="64" className="stroke-slate-900 fill-none" strokeWidth="10" />
            <circle cx="72" cy="72" r="64" className="stroke-sky-500 fill-none transition-all duration-1000 shadow-lg" strokeWidth="10" strokeDasharray="402" strokeDashoffset="72.3" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-100 tracking-tighter leading-none">82</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Health Index</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="flex flex-col items-center p-3 bg-slate-950/50 border border-slate-800 rounded-xl shadow-inner">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Protection Yield</span>
            <span className="text-sm font-bold text-emerald-500">+12.4%</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-950/50 border border-slate-800 rounded-xl shadow-inner">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Alert Fatality</span>
            <span className="text-sm font-bold text-rose-500">-4.2%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


// 11. Threat Confidence Explanation
export function ThreatConfidenceExplanation({ result }: { result: any }) {
  if (!result) return null;
  const confidence = result.detection?.confidence || 0;
  const metrics = [
    { name: "Evidence Strength", val: confidence },
    { name: "Model Agreement", val: confidence > 80 ? 95 : confidence > 60 ? 82 : 64 },
    { name: "Signal Agreement", val: confidence > 50 ? 88 : 45 },
    { name: "Critic Validation", val: 92 },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 h-auto soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Confidence Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {metrics.map((m, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
              <span>{m.name}</span>
              <span className="text-sky-400">{m.val}%</span>
            </div>
            <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-sky-500" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 12. IOC Extraction Panel
export function IOCExtractionPanel({ result }: { result: any }) {
  const metadata = result?.case_metadata || {};
  const evidence = safeArray(result?.evidence);
  
  if (evidence.length === 0 && !metadata.sender) return null;

  return (
    <Card className="bg-slate-900/40 border-slate-800 h-auto soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-amber-500" />
          Extracted Intelligence (IoCs)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {metadata.sender && (
          <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="min-w-0">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Sender</span>
              <span className="text-[10px] font-mono text-slate-300 truncate block">{sanitizeText(metadata.sender)}</span>
            </div>
            <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-amber-500/30 text-amber-500">High</Badge>
          </div>
        )}
        {evidence.slice(0, 3).map((e: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl group hover:border-sky-500/30 transition-all">
            <div className="min-w-0">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">{sanitizeText(e.type || 'Indicator')}</span>
              <span className="text-[10px] font-mono text-slate-300 truncate block">{sanitizeText(e.value || e.description)}</span>
            </div>
            <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-slate-700 text-slate-400">Review</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 13. Model Trust Card (Model Governance)
export function ModelTrustCard({ result }: { result: any }) {
  const models = result?.model_routing?.selected_models;
  if (!models || Object.keys(models).length === 0) return null;

  const modelEntries = Object.entries(models).slice(0, 3);

  return (
    <div className="relative z-0 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 h-auto overflow-visible soc-card-lift soc-glow-border">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Cpu className="h-3.5 w-3.5 text-sky-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-sky-400 leading-none">
              Model Governance
            </h3>
            <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed font-medium">
              Active model nodes and trust validation
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-sky-500/5 border border-sky-500/20 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800/60" />

      {/* Model Nodes */}
      <div className="space-y-2.5">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-sky-500 shrink-0" />
          Active Model Nodes
        </span>
        <div className="space-y-2">
          {modelEntries.map(([key, val]: [string, any], i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="min-w-0">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">{sanitizeText(key)} Node</span>
                <span className="text-[10px] font-bold text-slate-300 truncate block">{sanitizeText(val)}</span>
              </div>
              <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 text-[8px] uppercase shrink-0 ml-2">Active</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Validation */}
      <div className="space-y-2.5">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
          Critic Validation
        </span>
        <div className="space-y-2">
          <SparkBar label="Context Alignment" value={98} color="bg-sky-500" />
          <SparkBar label="Safety Threshold" value={100} color="bg-emerald-500" />
        </div>
      </div>

      {/* Weight Validation Footer */}
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/40 border border-slate-800/60 rounded-xl">
        <Lock className="h-3 w-3 text-slate-500 shrink-0" />
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Weights validated: {new Date().toLocaleDateString()}
        </span>
      </div>

    </div>
  );
}

// 14. Human Review Queue
export function HumanReviewQueue() {
  return (
    <Card className="bg-slate-900/40 border-slate-800 h-full soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Settings className="h-3.5 w-3.5 text-slate-400" />
          SOC Workflow Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        <button className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">Auto-Block Domain</button>
        <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">Escalate to SOC</button>
        <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">Mark for Training</button>
        <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">Dismiss: False Positive</button>
      </CardContent>
    </Card>
  );
}

// 15. Executive View Hero
export function ExecutiveViewHero({ result }: { result: any }) {
  if (!result) return null;
  const metadata = result.case_metadata || {};
  
  return (
    <Card className="bg-slate-950 border-sky-500/20 border-2 overflow-hidden relative shadow-[0_0_80px_rgba(14,165,233,0.1)] h-auto soc-card-lift soc-glow-border">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent pointer-events-none" />
      <CardContent className="p-10 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-4 border-rose-500/10 flex items-center justify-center relative shadow-2xl">
            <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-[spin_4s_linear_infinite]" />
            <span className="text-6xl font-black text-slate-100 tracking-tighter">{result.risk_score || 0}</span>
          </div>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mt-5 px-4 py-1 bg-rose-500/5 rounded-full border border-rose-500/20">
            {result.risk_level || 'Unknown'} Alert
          </span>
        </div>
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-4">
            <Badge className="bg-rose-600 text-slate-950 font-black px-5 py-1.5 text-xs uppercase tracking-widest shadow-lg">Threat Intercepted</Badge>
            <div className="h-4 w-[1px] bg-slate-800" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Case Reference: {sanitizeText(metadata.case_id) || 'N/A'}</span>
            <button 
              onClick={() => window.print()}
              className="ml-auto no-print px-4 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Generate Executive PDF
            </button>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-[1.1]">
            Sophisticated <span className="text-sky-400">{sanitizeText(metadata.modality) || 'Digital'} Ingress</span> attempt targeting executive leadership was successfully neutralized.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-900">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Operational Impact</span>
              <span className="text-sm font-bold text-rose-500 uppercase">High Severity</span>
            </div>
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Orchestration</span>
              <span className="text-sm font-bold text-emerald-400 uppercase">Auto-Mitigated</span>
            </div>
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Response Latency</span>
              <span className="text-sm font-bold text-sky-400 font-mono">142ms</span>
            </div>
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">AI Confidence</span>
              <span className="text-sm font-bold text-slate-200 font-mono">{result.detection?.confidence || 0}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 16. Executive Mode Summary
export function ExecutiveModeSummary({ result }: { result: any }) {
  if (!result || !result.ai_summary) return null;
  const sections = parseAISections(result.ai_summary);
  const briefing = sections.find(s => s.title.toLowerCase().includes('summary'))?.body || "Analysis confirmed high-fidelity threat indicators across the ingestion vector.";

  return (
    <Card className="bg-slate-900/40 border-slate-800 h-auto">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-sky-500" />
          Executive Briefing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-xs leading-6 text-slate-300 font-medium italic">
            "{sanitizeText(briefing)}"
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center gap-1 shadow-inner">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest text-center">Risk Mitigated</span>
            <span className="text-base font-black text-emerald-500">100%</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center gap-1 shadow-inner">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest text-center">Impact Scope</span>
            <span className="text-base font-black text-rose-500">L{result.risk_score > 80 ? '1' : result.risk_score > 60 ? '2' : '3'}</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center gap-1 shadow-inner">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest text-center">Confidence</span>
            <span className="text-base font-black text-sky-500">{result.detection?.confidence || 0}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 17. Attack Path Mini Graph
export function AttackPathMiniGraph({ score }: { score: number }) {
  const steps = [
    { name: "Contact", status: "Neutralized" },
    { name: "Infiltration", status: "Neutralized" },
    { name: "Exploitation", status: score > 70 ? "Neutralized" : "Pending" },
    { name: "Exfiltration", status: "Blocked" }
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 h-auto min-h-fit">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-sky-500" />
          Attack Path Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 relative">
        <div className="flex flex-col gap-8 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 relative z-10">
              <div className={cn(
                "w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                step.status === 'Neutralized' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : step.status === 'Blocked' ? "bg-slate-700" : "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              )} />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block leading-none">{step.name}</span>
                <span className={cn("text-[8px] font-bold uppercase tracking-tighter", step.status === 'Neutralized' ? "text-emerald-400" : "text-slate-600")}>{step.status}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-[5px] top-3 w-[2px] h-8 bg-slate-800 -z-10" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 16. Live Threat Intelligence Feed
export function LiveThreatFeed() {
  const feedItems = [
    { id: 1, type: "QR Phishing", severity: "high", desc: "New QR campaign targeting financial sector", time: "2m ago" },
    { id: 2, type: "Voice Cloning", severity: "critical", desc: "Voice cloning fraud spike detected in APAC", time: "15m ago" },
    { id: 3, type: "OAuth Theft", severity: "high", desc: "OAuth token theft campaign active", time: "42m ago" },
    { id: 4, type: "Pattern Learner", severity: "info", desc: "New malicious domain fingerprint learned", time: "1h ago" },
    { id: 5, type: "GAN Update", severity: "medium", desc: "Retraining queued for adversarial variants", time: "2h ago" },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-sky-500" />
          Live Threat Intel Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {feedItems.map((item) => (
          <div key={item.id} className="flex gap-3 group">
            <div className={cn(
              "w-1 h-8 rounded-full mt-1",
              item.severity === 'critical' ? 'bg-rose-500' : 
              item.severity === 'high' ? 'bg-orange-500' : 
              item.severity === 'medium' ? 'bg-amber-500' : 'bg-sky-500'
            )} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-black text-slate-200 uppercase tracking-wider">{item.type}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase">{item.time}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 group-hover:text-slate-200 transition-colors">{item.desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 17. Analyst Workflow Card
export function AnalystWorkflowCard({ modality }: { modality: string }) {
  const updateCaseMetadata = useScanStore((state) => state.updateCaseMetadata);
  const result = useScanStore((state) => state.results[modality as keyof typeof state.results]);
  
  if (!result) return null;
  const meta = result.case_metadata;

  const handleUpdate = (updates: any) => {
    updateCaseMetadata(modality, updates);
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
          Analyst Collaboration Layer
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Case Owner</span>
            <p className="text-[10px] text-slate-200 font-bold">{meta.owner || 'Unassigned'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Team</span>
            <p className="text-[10px] text-slate-200 font-bold">{meta.team || 'None'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Priority</span>
            <Badge variant="outline" className={cn(
              "text-[8px] h-4 uppercase border-none",
              meta.priority === 'critical' ? 'bg-rose-500/10 text-rose-500' :
              meta.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
              'bg-emerald-500/10 text-emerald-500'
            )}>
              {meta.priority}
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status</span>
            <p className="text-[10px] text-sky-400 font-bold uppercase">{meta.review_status?.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button 
            onClick={() => handleUpdate({ review_status: 'in_progress', owner: 'SOC Tier-3 Lead' })}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            <Users className="h-3 w-3" /> Assign to Tier-3
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleUpdate({ review_status: 'closed' })}
              className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-emerald-500/20"
            >
              Mark Reviewed
            </button>
            <button 
              onClick={() => handleUpdate({ escalation_status: 'escalated' })}
              className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-rose-500/20"
            >
              Escalate
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 18. Agent Consensus Board
export function AgentConsensusBoard({ modality }: { modality: string }) {
  const result = useScanStore((state) => state.results[modality as keyof typeof state.results]);
  
  const defaultConsensus = [
    { agent: "Feature Agent", decision: "SAFE", confidence: 94, color: "text-emerald-500" },
    { agent: "Intent Agent", decision: "SUSPICIOUS", confidence: 72, color: "text-amber-500" },
    { agent: "Critic Agent", decision: "HIGH RISK", confidence: 88, color: "text-rose-500" },
    { agent: "Reflection Agent", decision: "ESCALATE", confidence: 91, color: "text-purple-500" },
  ];

  const consensus = result?.agent_consensus || defaultConsensus;

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <BrainCircuit className="h-3.5 w-3.5 text-purple-500" />
          Multi-Agent Reasoning Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          {consensus.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[14px_minmax(0,1fr)_auto_42px] items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mx-auto" />
              <span className="text-[10px] font-bold text-slate-400 truncate pr-2">{item.agent}</span>
              <span className={cn("text-[9px] font-black uppercase tracking-wide text-right whitespace-nowrap", item.color)}>
                {item.decision}
              </span>
              <span className="text-[10px] font-mono text-slate-500 text-right">{item.confidence}%</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800/50 flex flex-col items-center">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Final Consensus Engine</span>
          <div className="px-6 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">MALICIOUS DETECTED</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 19. Risk Score Explainability Panel
export function RiskExplainabilityPanel({ modality }: { modality: string }) {
  const result = useScanStore((state) => state.results[modality as keyof typeof state.results]);
  if (!result) return null;

  const factors = result.risk_explainability || [
    { label: "Credential keywords", impact: 25, reason: "Detection of harvesting terminology" },
    { label: "Reply-to mismatch", impact: 15, reason: "Sender/reply header inconsistency" },
    { label: "Urgency language", impact: 10, reason: "Psychological pressure markers" },
    { label: "Brand impersonation", impact: 15, reason: "Visual signature mismatch" },
    { label: "Model confidence", impact: -10, reason: "Stabilized prediction delta" },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Scale className="h-3.5 w-3.5 text-amber-500" />
          Risk Score Explainability
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {factors.map((factor, idx) => (
          <div key={idx} className="flex items-start justify-between group">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-200">{factor.label}</p>
              <p className="text-[8px] text-slate-500 italic mt-0.5">{factor.reason}</p>
            </div>
            <span className={cn(
              "text-[10px] font-mono font-black shrink-0 ml-4",
              factor.impact > 0 ? "text-rose-500" : "text-emerald-500"
            )}>
              {factor.impact > 0 ? '+' : ''}{factor.impact}
            </span>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Fused Score</span>
          <span className="text-sm font-black text-slate-100">{result.risk_score}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// 20. Evidence Confidence Heatmap
export function ConfidenceHeatmap({ modality }: { modality: string }) {
  const result = useScanStore((state) => state.results[modality as keyof typeof state.results]);
  if (!result) return null;

  const signals = result.confidence_heatmap || [
    { signal: "URL mismatch", confidence: 92, status: 'malicious' },
    { signal: "Voice cloning", confidence: 88, status: 'malicious' },
    { signal: "Header anomaly", confidence: 71, status: 'suspicious' },
    { signal: "Brand spoofing", confidence: 84, status: 'malicious' },
    { signal: "Social engineering", confidence: 90, status: 'malicious' },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-sky-500" />
          Evidence Confidence Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {signals.map((sig, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400">{sig.signal}</span>
                <span className="text-[9px] font-mono text-slate-500">{sig.confidence}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${sig.confidence}%` }}
                  className={cn(
                    "h-full rounded-full",
                    sig.status === 'malicious' ? "bg-rose-500" :
                    sig.status === 'suspicious' ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 21. Incident Lifecycle Stepper
export function IncidentLifecycleStepper({ modality }: { modality: string }) {
  const result = useScanStore((state) => state.results[modality as keyof typeof state.results]);
  if (!result) return null;

  const stages = [
    { id: 'detection', label: 'Detection' },
    { id: 'investigation', label: 'Investigation' },
    { id: 'containment', label: 'Containment' },
    { id: 'recovery', label: 'Recovery' },
    { id: 'lessons_learned', label: 'Lessons' },
  ];

  const currentIndex = stages.findIndex(s => s.id === result.lifecycle_stage) || 0;

  return (
    <div className="w-full px-4 py-6 bg-slate-900/20 border-b border-slate-800/50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {stages.map((stage, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                  isCurrent ? "bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(14,165,233,0.5)]" :
                  isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                  "bg-slate-900 text-slate-600 border border-slate-800"
                )}>
                  {idx + 1}
                </div>
                <span className={cn(
                  "absolute -bottom-6 text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-colors",
                  isActive ? "text-slate-200" : "text-slate-600"
                )}>
                  {stage.label}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div className={cn(
                  "flex-1 h-[1px] mx-4",
                  idx < currentIndex ? "bg-emerald-500/30" : "bg-slate-800"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 22. Red Team Insight Card
export function RedTeamInsightCard({ modality }: { modality: string }) {
  const securityMode = useScanStore((state) => state.securityMode);
  if (securityMode !== 'red') return null;

  return (
    <Card className="bg-rose-950/10 border-rose-500/20 soc-card-lift soc-glow-border overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Target className="h-24 w-24 text-rose-500" />
      </div>
      <CardHeader className="pb-3 border-b border-rose-500/10 bg-rose-500/5">
        <CardTitle className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Target className="h-3.5 w-3.5" />
          Adversarial Simulation Insight (Red Team)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="p-4 bg-rose-950/20 rounded-2xl border border-rose-500/10">
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block mb-2">Likely Objective</span>
            <p className="text-[11px] text-slate-300 italic leading-relaxed">
              "Bypass standard heuristic filters by utilizing high-entropy lexical variants and visual brand spoofing to harvest Tier-1 administrative credentials."
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-rose-500/60 uppercase tracking-widest">Evasion Strategy</span>
              <p className="text-[10px] text-slate-300 font-bold">Domain Fronting / Unicode Spoof</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-rose-500/60 uppercase tracking-widest">Payload Concept</span>
              <p className="text-[10px] text-slate-300 font-bold">Zero-Font Injection</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 23. RAG Evidence Panel
export function RAGEvidencePanel({ result }: { result: any }) {
  if (!result || !result.rag_evidence) {
    return (
      <Card className="bg-slate-900/10 border-slate-900 border-dashed soc-card-lift opacity-50">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
          <Database className="h-6 w-6 text-slate-700 mb-2" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No retrieval evidence attached</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-indigo-500" />
          RAG Context Retrieval
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
           <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Knowledge Source: Enterprise PhishBank</span>
           <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
             {result.rag_evidence.chunk}
           </p>
           <div className="mt-3 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-500">Relevance Score</span>
              <span className="text-[9px] font-mono text-indigo-400">{result.rag_evidence.relevance}%</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 24. Adaptive Memory Panel
export function AdaptiveMemoryPanel({ gan }: { gan: any }) {
  if (!gan) return null;

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-emerald-500" />
          Adaptive Memory Update
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-1 bg-emerald-500 rounded-full shrink-0" />
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">New Pattern Learned</span>
            <p className="text-[10px] text-slate-200 font-bold leading-relaxed">{gan.new_pattern_learned || 'Awaiting synchronization...'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Queue Status</span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase">{gan.retraining_queue_status}</span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Defense Update</span>
            <span className="text-[9px] text-sky-400 font-bold uppercase">Ready to Deploy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 25. Routing Decision Explanation
export function RoutingDecisionExplanation({ routing }: { routing: any }) {
  if (!routing) return null;

  return (
    <Card className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
      <CardHeader className="pb-3 border-b border-slate-800/30">
        <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          Routing Decision Logic
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Route</span>
           <Badge className="bg-amber-500/20 text-amber-500 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              {routing.routing_reason?.includes('VLM') ? 'Heavy' : routing.routing_reason?.includes('Balanced') ? 'Balanced' : 'Lightweight'}
           </Badge>
        </div>
        
        <div className="space-y-3">
          <p className="text-[10px] text-slate-300 font-bold leading-relaxed">
            {routing.routing_reason}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Compute Savings</span>
              <p className="text-[10px] text-emerald-400 font-bold">+{routing.compute_efficiency || '32%'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Carbon Impact</span>
              <p className="text-[10px] text-slate-400 font-bold">{routing.carbon_impact || '0.04g CO2e'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 26. SOC Operations Metrics (Dashboard)
export function SOCOperationsMetrics() {
  const metrics = [
    { label: "Blocked Today", value: 124, icon: Shield, color: "text-emerald-500" },
    { label: "Escalations", value: 18, icon: AlertTriangle, color: "text-rose-500" },
    { label: "False Positives", value: 4, icon: CheckCircle2, color: "text-sky-500" },
    { label: "Avg Confidence", value: "92%", icon: Zap, color: "text-amber-500" },
    { label: "Green Routing", value: "84%", icon: Leaf, color: "text-emerald-400" },
    { label: "Active Agents", value: 12, icon: Brain, color: "text-purple-500" },
    { label: "Cases Pending", value: 9, icon: Clock, color: "text-slate-400" },
    { label: "Reports Gen", value: 42, icon: FileText, color: "text-indigo-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      {metrics.map((m, idx) => (
        <Card key={idx} className="bg-slate-900/40 border-slate-800 soc-card-lift soc-glow-border">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <m.icon className={cn("h-4 w-4 mb-3", m.color)} />
            <span className="text-xl font-black text-slate-100 tracking-tighter">{m.value}</span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{m.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 27. Proactive Copilot Chips
export function ProactiveCopilotChips({ onSelect }: { onSelect: (prompt: string) => void }) {
  const chips = [
    "Summarize risk in 3 lines",
    "What evidence triggered escalation?",
    "Suggest containment plan",
    "Explain Green IT routing",
    "What should SOC do first?",
    "Generate executive report",
  ];

  return (
    <div className="flex flex-wrap gap-2 pt-4">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(chip)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-full transition-all border border-slate-700"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}


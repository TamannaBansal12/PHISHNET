"use client";

import { useState } from "react";
import { Mail, Shield, UploadCloud, AlertCircle, RefreshCw, Terminal, Trash2, BrainCircuit, Activity } from "lucide-react";
import { useScanStore } from "@/store/scanStore";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  SOCOverviewHero, 
  RuntimeOrchestrationGraph, 
  EvidenceAnalysisWorkspace, 
  AIAnalystSummaryCard, 
  ExpandedPlaybook, 
  GreenModelEconomy, 
  GANAdaptiveDefense,
  AnalystRightPanel
} from "@/components/analysis-components";
import { 
  AttackProgressionTracker, 
  ThreatActorProfile, 
  ModelDecisionExplainability, 
  AIInvestigationCopilot, 
  ForensicEvidenceLocker,
  ExecutiveViewHero,
  ExecutiveModeSummary,
  AttackPathMiniGraph,
  ThreatConfidenceExplanation,
  IOCExtractionPanel,
  ModelTrustCard,
  HumanReviewQueue,
  IncidentLifecycleStepper,
  RedTeamInsightCard,
  RiskExplainabilityPanel,
  ConfidenceHeatmap,
  AgentConsensusBoard,
  RAGEvidencePanel,
  RoutingDecisionExplanation,
  AdaptiveMemoryPanel
} from "@/components/advanced-intel-components";

export function EmailView() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { 
    isScanning, 
    results, 
    error, 
    setScanning, 
    setResult, 
    setError, 
    clearModality,
    viewMode,
    securityMode
  } = useScanStore();

  const result = results.email;
  const hasResult = !!result;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleScan = async () => {
    if (!content && !file) return;
    
    setScanning(true);
    try {
      const payload = {
        content: content || "Sample content from uploaded file.",
        is_eml_file: file !== null
      };

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze email");
      }

      const data = await response.json();
      setResult('email', data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-full min-w-0">
      <div className="flex-1 min-w-0 p-8 space-y-12 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
              <Mail className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
                Email Threat Intelligence
              </h1>
              <p className="text-slate-400 font-mono text-sm">Enterprise-grade multimodal analysis for phishing, BEC, and impersonation.</p>
            </div>
          </div>
          
          {hasResult && (
            <div className="flex gap-3">
               <button 
                 onClick={() => clearModality('email')} 
                 className="px-6 py-2.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border border-rose-500/20 transition-all active:scale-95"
               >
                 <Trash2 className="h-3.5 w-3.5" /> Reset Investigation
               </button>
            </div>
          )}
        </div>

        {!hasResult ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-12">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl relative">
              <div className="absolute top-0 right-0 p-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Awaiting Threat Ingestion</span>
                 </div>
              </div>
              <div className="p-8 border-b border-slate-800/50 bg-slate-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-sky-500" />
                  <span className="text-xs font-black text-slate-100 uppercase tracking-[0.2em]">Malicious Payload Ingestion</span>
                </div>
              </div>
              
              <div className="p-10 space-y-8">
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-300 font-mono text-sm focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 outline-none resize-none transition-all placeholder:text-slate-700"
                    placeholder="Paste email headers, raw text, or suspicious URLs here..."
                    disabled={file !== null}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/50"></div></div>
                  <div className="relative flex justify-center"><span className="bg-slate-900 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">OR</span></div>
                </div>

                <div 
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${dragActive ? "border-sky-500 bg-sky-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-950/30"}`}
                >
                  <UploadCloud className={`h-12 w-12 mx-auto mb-4 ${dragActive ? "text-sky-400" : "text-slate-600"}`} />
                  <p className="text-slate-300 font-bold mb-1">Drag and drop security artifacts</p>
                  <p className="text-slate-500 text-xs mb-6 font-mono">Supports .EML, .MSG, .TXT up to 25MB</p>
                  <input type="file" id="file-upload" className="hidden" accept=".eml,.msg,.txt" onChange={(e) => { if (e.target.files) setFile(e.target.files[0]); }} />
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700">
                    {file ? file.name : "Select File"}
                  </label>
                </div>

                <button 
                  onClick={handleScan}
                  disabled={isScanning || (!content && !file)}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-5 rounded-2xl transition-all shadow-[0_20px_50px_rgba(14,165,233,0.25)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-sm active:scale-[0.99]"
                >
                  {isScanning ? (
                    <><RefreshCw className="h-5 w-5 animate-spin" /> Orchestrating Intelligence...</>
                  ) : (
                    <><Shield className="h-5 w-5" /> Execute Full Forensic Scan</>
                  )}
                </button>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4 text-rose-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={viewMode}
              initial={{ opacity: 0, x: 5 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* 1. Executive Threat Overview */}
              <section className="space-y-8">
                {viewMode === 'executive' ? (
                  <div className="space-y-6">
                    <ExecutiveViewHero result={result} />
                    <ExecutiveModeSummary result={result} />
                  </div>
                ) : (
                  <SOCOverviewHero result={result} />
                )}
                <IncidentLifecycleStepper modality="email" />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                 <div className="lg:col-span-8 space-y-8">
                    {/* 2. AI Analyst Summary */}
                    <AIAnalystSummaryCard summary={result.ai_summary} />
                    
                    {/* 3. Adversarial / Explanatory Layer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <RedTeamInsightCard modality="email" />
                       <RiskExplainabilityPanel modality="email" />
                    </div>

                    {/* 4. Evidence Intelligence */}
                    <div className="space-y-6">
                      <EvidenceAnalysisWorkspace categories={result.evidence_categories} riskContribution={result.risk_contribution} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <IOCExtractionPanel result={result} />
                        <ThreatConfidenceExplanation result={result} />
                        <ConfidenceHeatmap modality="email" />
                      </div>
                    </div>

                    {/* 5. Runtime Agent Flow */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-black text-slate-100 uppercase tracking-[0.2em]">Agent Orchestration Trace</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                         <div className="lg:col-span-2">
                            <RuntimeOrchestrationGraph agents={result.agent_swarm} timeline={result.runtime_timeline} />
                         </div>
                         <AgentConsensusBoard modality="email" />
                      </div>
                    </div>

                    {/* 5. SOC Response Playbook */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-black text-slate-100 uppercase tracking-[0.2em]">Mitigation Strategy</span>
                      </div>
                      <ExpandedPlaybook playbook={result.prevention_playbook} />
                    </div>

                  {/* === LOWER SECTION — 3 SEPARATE ROWS === */}
                  <section className="space-y-6 pb-4">

                    {/* Row 1: Model Economy Intelligence | Model Governance */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      <GreenModelEconomy routing={result.model_routing} />
                      <ModelTrustCard result={result} />
                    </div>

                    {/* Row 2: Adaptive Memory Update | Orchestration Note */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      <AdaptiveMemoryPanel gan={result.gan_defense_layer} />
                      <RoutingDecisionExplanation routing={result.model_routing} />
                    </div>

                    {/* Row 3: GAN Adaptive Defense Lab — full width */}
                    <div className="w-full">
                      <GANAdaptiveDefense gan={result.gan_defense_layer} />
                    </div>

                  </section>
               </div>

                 <div className="lg:col-span-4 space-y-6 sticky top-8">
                    <AIInvestigationCopilot />
                    <RAGEvidencePanel result={result} />
                    <HumanReviewQueue />
                    <AttackPathMiniGraph score={result.risk_score} />
                    
                    <Card className="bg-slate-900/20 border-slate-800 soc-card-lift soc-glow-border">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <BrainCircuit className="h-5 w-5 text-indigo-400" />
                          <span className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">Orchestration Note</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          {result.risk_score > 70 
                            ? "Escalated to multi-agent swarm due to high-fidelity adversarial markers and complex payload structures."
                            : "Standard heuristic verification sufficient for detected signal signature."}
                        </p>
                      </CardContent>
                    </Card>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
      {hasResult && <AnalystRightPanel result={result} />}
    </div>
  );
}

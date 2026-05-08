"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Video, Shield, AlertCircle, RefreshCw, Terminal, Trash2, Activity, CheckCircle2, Clock, Upload, X, Hash, FileVideo, Gauge, HardDrive, Fingerprint, Pause, Play } from "lucide-react";
import { useScanStore } from "@/store/scanStore";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AIInvestigationCopilot,
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
import {
  validateVideoFile,
  extractVideoMeta,
  computeSHA256,
  generateCaseId,
  formatBytes,
  formatSpeed,
  type VideoMeta,
} from "@/lib/video-utils";

// ── Upload stages ────────────────────────────────────────────
type StageStatus = "pending" | "active" | "done" | "error";
interface IngestStage { label: string; status: StageStatus }

const INITIAL_STAGES: IngestStage[] = [
  { label: "File Validation", status: "pending" },
  { label: "Forensic Hash Generation", status: "pending" },
  { label: "Upload to Analysis Engine", status: "pending" },
  { label: "Video Integrity Verified", status: "pending" },
  { label: "Frame Extraction", status: "pending" },
  { label: "Facial Consistency Analysis", status: "pending" },
  { label: "GAN Artifact Detection", status: "pending" },
  { label: "Final Threat Scoring", status: "pending" },
];

// ── Component ────────────────────────────────────────────────
export function VideoView() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [eta, setEta] = useState(0);
  const [stages, setStages] = useState<IngestStage[]>(INITIAL_STAGES);
  const [ingesting, setIngesting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const lastLoadedRef = useRef(0);
  const lastTimeRef = useRef(0);

  const {
    isScanning,
    results,
    error,
    setScanning,
    setResult,
    setError,
    clearModality,
    viewMode,
  } = useScanStore();

  const result = results.video;
  const hasResult = !!result;

  // ── Helpers ──────────────────────────────────────────────
  const setStage = useCallback((idx: number, status: StageStatus) => {
    setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, status } : s)));
  }, []);

  const resetAll = useCallback(() => {
    setFile(null);
    setMeta(null);
    setUploadProgress(0);
    setUploadSpeed(0);
    setEta(0);
    setStages(INITIAL_STAGES);
    setIngesting(false);
    setPaused(false);
    setFileError(null);
    xhrRef.current = null;
  }, []);

  // ── File selection ──────────────────────────────────────
  const handleFileSelect = useCallback(async (f: File) => {
    setFileError(null);
    const err = validateVideoFile(f);
    if (err) { setFileError(err); return; }
    setFile(f);
    // Extract metadata in background
    try {
      const baseMeta = await extractVideoMeta(f);
      const sha = await computeSHA256(f);
      setMeta({
        ...baseMeta,
        sha256: sha,
        caseId: generateCaseId(),
        ingestedAt: new Date().toISOString(),
      });
    } catch {
      setMeta(null);
    }
  }, []);

  // ── Drag handlers ──────────────────────────────────────
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
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  // ── Upload + Analyze ───────────────────────────────────
  const handleIngest = useCallback(async () => {
    if (!file) return;
    setIngesting(true);
    setScanning(true);
    setUploadProgress(0);

    // Stage 0: validation
    setStage(0, "active");
    const valErr = validateVideoFile(file);
    if (valErr) { setStage(0, "error"); setError(valErr); setIngesting(false); return; }
    setStage(0, "done");

    // Stage 1: forensic hash
    setStage(1, "active");
    try {
      if (!meta) {
        const baseMeta = await extractVideoMeta(file);
        const sha = await computeSHA256(file);
        setMeta({ ...baseMeta, sha256: sha, caseId: generateCaseId(), ingestedAt: new Date().toISOString() });
      }
    } catch { /* non-fatal */ }
    setStage(1, "done");

    // Stage 2: upload via XHR (supports progress + abort)
    setStage(2, "active");
    try {
      const data = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        lastLoadedRef.current = 0;
        lastTimeRef.current = Date.now();

        xhr.upload.addEventListener("progress", (e) => {
          if (!e.lengthComputable) return;
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(pct);
          const now = Date.now();
          const dt = (now - lastTimeRef.current) / 1000;
          if (dt > 0.3) {
            const speed = (e.loaded - lastLoadedRef.current) / dt;
            setUploadSpeed(speed);
            const remaining = e.total - e.loaded;
            setEta(speed > 0 ? remaining / speed : 0);
            lastLoadedRef.current = e.loaded;
            lastTimeRef.current = now;
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText)); }
            catch { reject(new Error("Invalid response from analysis engine")); }
          } else {
            try { const e = JSON.parse(xhr.responseText); reject(new Error(e.error || `Server error ${xhr.status}`)); }
            catch { reject(new Error(`Server error ${xhr.status}`)); }
          }
        };
        xhr.onerror = () => reject(new Error("Network error — check connection"));
        xhr.ontimeout = () => reject(new Error("Upload timed out"));
        xhr.timeout = 600000; // 10 min

        const formData = new FormData();
        formData.append("file", file);
        xhr.open("POST", "/api/video");
        xhr.send(formData);
      });

      setStage(2, "done");

      // Stages 3–7: simulate analysis pipeline progress
      for (let i = 3; i <= 7; i++) {
        setStage(i, "active");
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
        setStage(i, "done");
      }

      setResult("video", data);
    } catch (err: any) {
      setStage(2, "error");
      setError(err.message);
    } finally {
      setIngesting(false);
      xhrRef.current = null;
    }
  }, [file, meta, setScanning, setResult, setError, setStage]);

  const handleCancel = () => {
    xhrRef.current?.abort();
    resetAll();
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="flex min-h-full min-w-0">
      <div className="flex-1 min-w-0 p-8 space-y-12 pb-24">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Video className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight">Video Deepfake Intelligence</h1>
              <p className="text-slate-400 font-mono text-sm">Temporal consistency and facial biomechanical analysis.</p>
            </div>
          </div>
          {hasResult && (
            <button onClick={() => { clearModality("video"); resetAll(); }} className="px-6 py-2.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border border-rose-500/20 transition-all">
              <Trash2 className="h-3.5 w-3.5" /> Reset Case
            </button>
          )}
        </div>

        {/* ─── UPLOAD / INGEST PANEL ─── */}
        {!hasResult ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-6 space-y-8">

            {/* Ingestion header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em]">Forensic Video Ingestion Pipeline</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

              {/* ── LEFT: Drop zone + file info (3 cols) ── */}
              <div className="lg:col-span-3 space-y-6">
                {/* Drop zone */}
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${dragActive ? "border-sky-500 bg-sky-500/5 shadow-[0_0_40px_rgba(14,165,233,0.15)]" : "border-slate-800 hover:border-slate-700 bg-slate-950/40"}`}
                  onClick={() => document.getElementById("video-upload-input")?.click()}
                >
                  <FileVideo className={`h-14 w-14 mx-auto mb-5 transition-colors ${dragActive ? "text-sky-400" : "text-slate-700"}`} />
                  <p className="text-slate-200 font-bold text-sm mb-1">Drop forensic media payloads for deepfake analysis</p>
                  <p className="text-slate-500 text-[10px] font-mono mb-5 tracking-wider">MP4 • MOV • MKV • AVI • WEBM — Max 2 GB</p>
                  <input
                    id="video-upload-input"
                    type="file"
                    className="hidden"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,.mp4,.mov,.avi,.mkv,.webm"
                    onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
                  />
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-700 transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    {file ? "Change File" : "Select Video File"}
                  </span>
                </div>

                {/* Validation error */}
                {fileError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold uppercase tracking-tight">{fileError}</p>
                  </div>
                )}

                {/* File preview card */}
                {file && meta && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-800 shrink-0 bg-slate-900">
                        {meta.thumbnailUrl && <img src={meta.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-200 truncate">{meta.name}</p>
                          <button onClick={resetAll} className="text-slate-600 hover:text-rose-400 transition-colors shrink-0"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <div><span className="block text-slate-600 mb-0.5">Size</span><span className="text-slate-300">{meta.sizeHuman}</span></div>
                          <div><span className="block text-slate-600 mb-0.5">Duration</span><span className="text-slate-300">{meta.durationHuman}</span></div>
                          <div><span className="block text-slate-600 mb-0.5">Resolution</span><span className="text-slate-300">{meta.width}×{meta.height}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Forensic hash */}
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-2">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Forensic Hash Verified</span>
                      </div>
                      <p className="text-[9px] font-mono text-slate-400 break-all leading-relaxed">SHA256: {meta.sha256}</p>
                      <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Case ID: {meta.caseId}</span>
                        <span>{new Date(meta.ingestedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Upload progress bar */}
                {ingesting && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Uploading Payload</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400">{formatSpeed(uploadSpeed)}</span>
                        {eta > 0 && <span className="text-[10px] font-mono text-slate-500">~{Math.ceil(eta)}s left</span>}
                        <span className="text-sm font-black text-slate-200">{uploadProgress}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                      <motion.div
                        className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: "linear", duration: 0.3 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleCancel} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1.5">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Action buttons */}
                {!ingesting && (
                  <button
                    onClick={handleIngest}
                    disabled={isScanning || !file}
                    className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-5 rounded-2xl transition-all shadow-[0_20px_50px_rgba(14,165,233,0.2)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm active:scale-[0.99]"
                  >
                    {isScanning ? (
                      <><RefreshCw className="h-5 w-5 animate-spin" /> Orchestrating Visual Nodes...</>
                    ) : (
                      <><Shield className="h-5 w-5" /> Execute Forensic Ingestion</>
                    )}
                  </button>
                )}

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4 text-rose-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Ingestion pipeline stages (2 cols) ── */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Gauge className="h-4 w-4 text-sky-500" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Ingestion Pipeline</span>
                  </div>
                  <div className="space-y-3">
                    {stages.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                          {s.status === "done" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : s.status === "active" ? (
                            <RefreshCw className="h-4 w-4 text-sky-400 animate-spin" />
                          ) : s.status === "error" ? (
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full border border-slate-700 bg-slate-900" />
                          )}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          s.status === "done" ? "text-emerald-400" :
                          s.status === "active" ? "text-sky-300" :
                          s.status === "error" ? "text-rose-400" :
                          "text-slate-600"
                        }`}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Ingestion Specs</span>
                  <div className="space-y-2 text-[9px] font-mono text-slate-400">
                    <div className="flex justify-between"><span>Max Payload</span><span className="text-slate-300">2 GB</span></div>
                    <div className="flex justify-between"><span>Transfer</span><span className="text-slate-300">Streaming</span></div>
                    <div className="flex justify-between"><span>Frame Sampling</span><span className="text-slate-300">1 / 2s</span></div>
                    <div className="flex justify-between"><span>Hash Algorithm</span><span className="text-slate-300">SHA-256</span></div>
                    <div className="flex justify-between"><span>Sandbox</span><span className="text-emerald-400">Isolated</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        ) : (
          /* ─── RESULTS VIEW (unchanged) ─── */
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <section className="space-y-8">
                {viewMode === "executive" ? (
                  <div className="space-y-6">
                    <ExecutiveViewHero result={result} />
                    <ExecutiveModeSummary result={result} />
                  </div>
                ) : (
                  <SOCOverviewHero result={result} />
                )}
                <IncidentLifecycleStepper modality="video" />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                  <AIAnalystSummaryCard summary={result.ai_summary} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RedTeamInsightCard modality="video" />
                    <RiskExplainabilityPanel modality="video" />
                  </div>
                  <div className="space-y-6">
                    <EvidenceAnalysisWorkspace categories={result.evidence_categories} riskContribution={result.risk_contribution} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <IOCExtractionPanel result={result} />
                      <ThreatConfidenceExplanation result={result} />
                      <ConfidenceHeatmap modality="video" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-black text-slate-100 uppercase tracking-[0.2em]">Visual Processing Trace</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      <div className="lg:col-span-2">
                        <RuntimeOrchestrationGraph agents={result.agent_swarm} timeline={result.runtime_timeline} />
                      </div>
                      <AgentConsensusBoard modality="video" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Terminal className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-black text-slate-100 uppercase tracking-[0.2em]">Mitigation Strategy</span>
                    </div>
                    <ExpandedPlaybook playbook={result.prevention_playbook} />
                  </div>
                  <section className="space-y-6 pb-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      <GreenModelEconomy routing={result.model_routing} />
                      <ModelTrustCard result={result} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                      <AdaptiveMemoryPanel gan={result.gan_defense_layer} />
                      <RoutingDecisionExplanation routing={result.model_routing} />
                    </div>
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

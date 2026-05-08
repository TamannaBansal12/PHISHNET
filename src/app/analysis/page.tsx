"use client";

import React from "react";
import {
  Activity,
  Brain,
  Cpu,
  Eye,
  FileText,
  Leaf,
  Mic,
  ShieldCheck,
  Video,
  Zap,
} from "lucide-react";

const pipeline = [
  { name: "Input Capture", desc: "Email, audio, video, OCR or watermark evidence", icon: FileText },
  { name: "Preprocessing", desc: "Cleaning, feature extraction, frame/audio/text parsing", icon: Cpu },
  { name: "Model Routing", desc: "Lightweight, balanced or heavy model selected dynamically", icon: Brain },
  { name: "Threat Detection", desc: "Phishing, spoofing, deepfake and manipulation checks", icon: Eye },
  { name: "Agentic Reflection", desc: "LLM explains why the content is risky or safe", icon: ShieldCheck },
  { name: "GreenIT Score", desc: "Energy, latency and carbon-aware model decision", icon: Leaf },
];

const modelRows = [
  ["Email", "TF-IDF + Logistic Regression", "DistilBERT / TinyBERT", "RoBERTa / DeBERTa + LLM"],
  ["Audio", "MFCC + Random Forest", "CNN / BiLSTM", "Whisper / wav2vec2 + Reflection"],
  ["Video", "MobileNetV2 Frames", "EfficientNet / Xception", "ViT / TimeSformer / VLM"],
  ["OCR", "Tesseract + Rules", "EasyOCR + Layout", "LLaVA / VLM Reasoning"],
  ["Watermarking", "Hash Check", "Metadata + Pattern Analysis", "Robust Watermark Verification"],
];

const metrics = [
  { label: "Detection Coverage", value: "94%", sub: "Across multimodal inputs" },
  { label: "Compute Saved", value: "38%", sub: "Via GreenIT routing" },
  { label: "Avg Latency", value: "1.8s", sub: "Balanced route estimate" },
  { label: "Explainability", value: "High", sub: "Agent reflection enabled" },
];

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">
      <section className="mb-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-purple-500/10 p-8 shadow-2xl">
        <p className="text-cyan-300 text-sm uppercase tracking-[0.3em] mb-3">
          PHISHNET Intelligence Layer
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Visual Analytics, Diagrams & GreenIT Dashboard
        </h1>
        <p className="text-slate-300 max-w-4xl text-lg">
          A premium system-level dashboard showing multimodal threat detection,
          model-routing intelligence, agentic reflection and sustainability-aware
          compute decisions.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-slate-400 text-sm">{m.label}</p>
            <h2 className="text-3xl font-bold mt-2">{m.value}</h2>
            <p className="text-slate-400 text-sm mt-2">{m.sub}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <Activity className="text-cyan-300" /> End-to-End Detection Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {pipeline.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.name} className="relative rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-xl">
                <div className="h-12 w-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4">
                  <Icon className="text-cyan-300" />
                </div>
                <p className="text-xs text-cyan-300 mb-1">STEP {index + 1}</p>
                <h3 className="font-semibold text-lg">{step.name}</h3>
                <p className="text-slate-400 text-sm mt-2">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-yellow-300" /> Risk Score Distribution
          </h2>

          <div className="space-y-5">
            {[
              ["Email Threats", 82],
              ["Audio Deepfake Signals", 64],
              ["Video Manipulation", 73],
              ["OCR Brand Spoofing", 58],
              ["Watermark Integrity", 91],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Leaf className="text-green-300" /> GreenIT Routing Logic
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {[
              ["Low Risk", "Lightweight Model", "Fastest route with lowest compute cost"],
              ["Medium Risk", "Balanced Model", "Higher accuracy with moderate compute"],
              ["High Risk", "Heavy Model + Agent", "Deep analysis using VLM/LLM reflection"],
            ].map(([risk, model, desc]) => (
              <div key={risk} className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold">{risk}</h3>
                  <span className="text-green-300 text-sm">{model}</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6">Model Routing Matrix</h2>

        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="text-left text-cyan-300 border-b border-white/10">
              <th className="p-4">Modality</th>
              <th className="p-4">Lightweight</th>
              <th className="p-4">Balanced</th>
              <th className="p-4">Heavy / Premium</th>
            </tr>
          </thead>
          <tbody>
            {modelRows.map((row) => (
              <tr key={row[0]} className="border-b border-white/10 hover:bg-white/5">
                {row.map((cell) => (
                  <td key={cell} className="p-4 text-slate-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Email Intelligence", icon: FileText, desc: "Header checks, URL analysis, NLP phishing detection and LLM justification." },
          { title: "Audio Intelligence", icon: Mic, desc: "MFCC features, voice anomaly detection, spoofing signals and transcript risk analysis." },
          { title: "Video Intelligence", icon: Video, desc: "Frame-level inspection, deepfake patterns, facial manipulation and VLM reasoning." },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-3xl border border-purple-400/20 bg-purple-500/5 p-6">
              <Icon className="text-purple-300 mb-4" size={36} />
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="text-slate-400 mt-3">{card.desc}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}

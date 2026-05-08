"use client";

import { ShieldAlert, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IntelligenceView() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
          <ShieldAlert className="h-8 w-8 text-sky-500" />
          Global Threat Intelligence
        </h1>
        <p className="text-slate-400 mt-2 font-mono text-sm">Real-time adversarial actor mapping and emerging deepfake campaign tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Emerging Actor: "VOICE-CLONE-APT"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">Critical</Badge>
              <span className="text-[10px] text-slate-500 font-mono">Last Seen: 12m ago</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">Highly sophisticated actor utilizing ElevenLabs-style clones for executive impersonation in BEC attacks.</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Vector Trend: OCR Evasion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Increasing</Badge>
              <span className="text-[10px] text-slate-500 font-mono">+42% this week</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">Attackers are using zero-width characters and SVG obfuscation to bypass legacy OCR filters.</p>
          </CardContent>
        </Card>

        <Card className="bg-sky-500/5 border-sky-500/20">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-sky-400">Neutralization Success</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Optimal</Badge>
              <span className="text-[10px] text-slate-500 font-mono">99.2% accuracy</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">PHISHNET GAN Lab has successfully mapped 1.2k new variants to existing behavioral embeddings.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

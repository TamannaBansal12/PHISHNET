"use client";

import { useScanStore } from "@/store/scanStore";
import { ShieldCheck, Zap } from "lucide-react";
import { GANAdaptiveDefense, GreenModelEconomy } from "@/components/analysis-components";
import { motion } from "framer-motion";

export function AdaptiveDefenseView() {
  const { lastProcessedScan } = useScanStore();
  const result = lastProcessedScan?.result;

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <ShieldCheck className="h-16 w-16 text-slate-800 mx-auto" />
          <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Defense Laboratory Offline</h2>
          <p className="text-slate-600 max-w-md mx-auto text-sm">Adversarial retraining requires a threat sample. Ingest a payload to activate the GAN Adaptive Defense Lab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
          <ShieldCheck className="h-8 w-8 text-sky-500" />
          GAN Adaptive Defense Laboratory
        </h1>
        <p className="text-slate-400 mt-2 font-mono text-sm">Neural hardening and adversarial variant generation for Case ID: {result.case_metadata.case_id}</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <GANAdaptiveDefense gan={result.gan_defense_layer} />
        <GreenModelEconomy routing={result.model_routing} />
      </motion.div>
    </div>
  );
}

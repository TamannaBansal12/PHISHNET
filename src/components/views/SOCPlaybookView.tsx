"use client";

import { useScanStore } from "@/store/scanStore";
import { BookOpen, ShieldAlert } from "lucide-react";
import { ExpandedPlaybook } from "@/components/analysis-components";
import { motion } from "framer-motion";

export function SOCPlaybookView() {
  const { lastProcessedScan } = useScanStore();
  const result = lastProcessedScan?.result;

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <BookOpen className="h-16 w-16 text-slate-800 mx-auto" />
          <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Active Playbook</h2>
          <p className="text-slate-600 max-w-md mx-auto text-sm">Playbooks are dynamically generated based on detected threat vectors. Run a scan to see recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
          <BookOpen className="h-8 w-8 text-sky-500" />
          Active SOC Response Playbook
        </h1>
        <p className="text-slate-400 mt-2 font-mono text-sm">Automated containment and mitigation strategy for Case ID: {result.case_metadata.case_id}</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ExpandedPlaybook playbook={result.prevention_playbook} />
      </motion.div>
    </div>
  );
}

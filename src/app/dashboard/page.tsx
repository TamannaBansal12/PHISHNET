"use client";

import { useScanStore } from "@/store/scanStore";
import { DashboardView } from "@/components/views/DashboardView";
import { EmailView } from "@/components/views/EmailView";
import { AudioView } from "@/components/views/AudioView";
import { VideoView } from "@/components/views/VideoView";
import { OCRView } from "@/components/views/OCRView";
import { RuntimeGraphView } from "@/components/views/RuntimeGraphView";
import { SOCPlaybookView } from "@/components/views/SOCPlaybookView";
import { AdaptiveDefenseView } from "@/components/views/AdaptiveDefenseView";
import { AuditCenterView } from "@/components/views/AuditCenterView";
import { IntelligenceView } from "@/components/views/IntelligenceView";
import { motion, AnimatePresence } from "framer-motion";

export default function MainDashboard() {
  const activePage = useScanStore((state) => state.activePage);

  const renderView = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardView />;
      case 'intelligence': return <IntelligenceView />;
      case 'email': return <EmailView />;
      case 'audio': return <AudioView />;
      case 'video': return <VideoView />;
      case 'ocr': return <OCRView />;
      case 'runtime_graph': return <RuntimeGraphView />;
      case 'soc_playbooks': return <SOCPlaybookView />;
      case 'adaptive_defense': return <AdaptiveDefenseView />;
      case 'audit_center': return <AuditCenterView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="h-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-auto"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

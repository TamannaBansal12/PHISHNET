"use client";

import { motion } from "framer-motion";
import { Mail, Mic, Video, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScanStore } from "@/store/scanStore";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: <Mail className="h-6 w-6 text-blue-400" />,
    title: "Email Intelligence",
    description: "Detect credential phishing, BEC, and malicious payloads using advanced NLP and header forensics.",
    id: "email",
  },
  {
    icon: <Mic className="h-6 w-6 text-purple-400" />,
    title: "Audio Forensics",
    description: "Identify synthetic voices, deepfake audio, and voice cloning in real-time.",
    id: "audio",
  },
  {
    icon: <Video className="h-6 w-6 text-emerald-400" />,
    title: "Video Analysis",
    description: "Frame-by-frame deepfake detection, temporal consistency, and spatial artifact analysis.",
    id: "video",
  },
  {
    icon: <ImageIcon className="h-6 w-6 text-amber-400" />,
    title: "OCR & Watermarking",
    description: "Extract hidden text from screenshots and detect invisible provenance watermarks.",
    id: "ocr",
  },
];

export default function LandingPage() {
  const { setActivePage } = useScanStore();
  const router = useRouter();

  const handleLaunch = (id: string = 'dashboard') => {
    setActivePage(id);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-300">
          <span className="flex h-2 w-2 rounded-full bg-sky-500 mr-2 animate-pulse"></span>
          PHISHNET v2.0 Enterprise
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-slate-400">
          Multimodal Threat Intelligence
        </h1>

        <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Defend against the next generation of AI-generated attacks with our
          Green-Aware multi-model VLM orchestration platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            size="lg" 
            onClick={() => handleLaunch('dashboard')}
            className="h-14 px-8 text-lg font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-full transition-all shadow-[0_0_40px_rgba(14,165,233,0.4)] hover:shadow-[0_0_60px_rgba(14,165,233,0.6)] cursor-pointer"
          >
            Launch Console <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => handleLaunch('email')}
            className="h-14 px-8 text-lg font-bold border-slate-700 hover:bg-slate-800 text-slate-300 rounded-full cursor-pointer"
          >
            Try Scan Center
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 max-w-7xl mx-auto"
      >
        {features.map((feature, idx) => (
          <div key={idx} onClick={() => handleLaunch(feature.id)} className="cursor-pointer">
            <div className="group relative p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all hover:bg-slate-800/50 overflow-hidden text-left h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/0 via-slate-800/0 to-slate-800/20 group-hover:to-sky-900/20 transition-all"></div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

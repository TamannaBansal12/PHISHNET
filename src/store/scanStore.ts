import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Detection {
  prediction: string;
  confidence: number;
  risk_score: number;
}

export interface ModelRouting {
  selected_models: Record<string, string>;
  routing_reason: string;
  carbon_impact: string;
  compute_efficiency: string;
}

export interface KillChainStage {
  stage_name: string;
  active: boolean;
  description: string;
}

export interface MitreTechnique {
  tactic: string;
  technique_id: string;
  technique_name: string;
  severity: string;
}

export interface AgentCall {
  name: string;
  status: string; // completed, escalated, skipped
  call_count: number;
  input_type: string;
  output_summary: string;
  confidence: number;
  execution_time_ms: number;
  runtime_reason: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  status: string; // pending, complete, error
}

export interface RiskContribution {
  base_ml_score: number;
  url_penalty: number;
  header_penalty: number;
  brand_spoof_penalty: number;
  social_engineering_penalty: number;
  critic_adjustment: number;
  final_score: number;
}

export interface AiAnalystBriefing {
  what_happened: string;
  why_it_matters: string;
  who_is_targeted: string;
  supporting_evidence: string;
  immediate_actions: string;
  next_steps: string;
}

export interface LlamaSummary {
  model: string;
  source: string;
  summary: string;
  fallback_used: boolean;
  error?: string;
}

export interface PreventionPlaybook {
  immediate_action: string;
  user_awareness: string;
  technical_control: string;
  forensic_preservation: string;
  escalation_team: string;
  long_term_prevention: string;
  compliance_note: string;
}

export interface GANDefenseLayer {
  status: string;
  generated_variants: number;
  generator_action: string;
  discriminator_update: string;
  new_pattern_learned: string;
  retraining_queue_status: string;
  safety_sandbox_status: string;
}

export interface CaseMetadata {
  case_id: string;
  timestamp: string;
  modality: string;
  input_type: string;
  report_status: string;
  analyst_status: string;
  owner?: string;
  team?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  escalation_status?: 'none' | 'pending' | 'escalated';
  review_status?: 'open' | 'in_progress' | 'closed';
  analyst_notes?: string;
}

export interface CategorizedEvidence {
  url_evidence: string[];
  header_evidence: string[];
  social_engineering_evidence: string[];
  brand_spoof_evidence: string[];
  attachment_evidence: string[];
  model_evidence: string[];
}

export interface RiskFactor {
  label: string;
  impact: number;
  reason: string;
}

export interface ConfidenceSignal {
  signal: string;
  confidence: number;
  status: 'malicious' | 'suspicious' | 'benign';
}

export interface AgentDecision {
  agent: string;
  decision: string;
  confidence: number;
  color: string;
}

export interface ThreatAnalysisResponse {
  project: string;
  status: string;
  risk_score: number;
  risk_level: string;
  detection: Detection;
  
  case_metadata: CaseMetadata;
  ai_analyst_briefing: AiAnalystBriefing;
  ai_summary?: LlamaSummary;
  kill_chain: KillChainStage[];
  mitre_attack: MitreTechnique[];
  agent_swarm: AgentCall[];
  runtime_timeline: TimelineEvent[];
  evidence_categories: CategorizedEvidence;
  risk_contribution: RiskContribution;
  prevention_playbook: PreventionPlaybook;
  model_routing: ModelRouting;
  gan_defense_layer: GANDefenseLayer;
  
  // New Operational Fields
  agent_consensus?: AgentDecision[];
  risk_explainability?: RiskFactor[];
  confidence_heatmap?: ConfidenceSignal[];
  lifecycle_stage?: 'detection' | 'investigation' | 'containment' | 'recovery' | 'lessons_learned';
  
  evidence: string[];
  agent_flow: string[];
}

export interface ScanHistoryItem {
  id: string;
  modality: string;
  timestamp: string;
  prediction: string;
  risk_score: number;
  risk_level: string;
  result: ThreatAnalysisResponse;
}

interface ScanState {
  // Status
  isScanning: boolean;
  error: string | null;

  // Modality-specific results
  results: {
    email: ThreatAnalysisResponse | null;
    ocr: ThreatAnalysisResponse | null;
    audio: ThreatAnalysisResponse | null;
    video: ThreatAnalysisResponse | null;
  };

  // Memory & History
  lastProcessedScan: ScanHistoryItem | null;
  scanHistory: ScanHistoryItem[];

  // Navigation & UI States
  activePage: string;
  viewMode: 'analyst' | 'executive';
  securityMode: 'blue' | 'red';

  // Actions
  setScanning: (status: boolean) => void;
  setResult: (modality: string, result: ThreatAnalysisResponse) => void;
  updateCaseMetadata: (modality: string, metadata: Partial<CaseMetadata>) => void;
  setError: (error: string) => void;
  clearModality: (modality: string) => void;
  clearAll: () => void;
  restoreFromHistory: (item: ScanHistoryItem) => void;
  setActivePage: (page: string) => void;
  setViewMode: (mode: 'analyst' | 'executive') => void;
  setSecurityMode: (mode: 'blue' | 'red') => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      isScanning: false,
      error: null,
      results: {
        email: null,
        ocr: null,
        audio: null,
        video: null,
      },
      lastProcessedScan: null,
      scanHistory: [],
      activePage: 'dashboard',
      viewMode: 'analyst',
      securityMode: 'blue',

      setScanning: (status) => set({ isScanning: status, error: null }),
      
      setResult: (modality, result) => set((state) => {
        // Enhance result with operational defaults if missing
        const enhancedResult = { ...result };
        if (!enhancedResult.case_metadata.case_id) {
          enhancedResult.case_metadata.case_id = `CAS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        }
        
        // Initialize operational fields if missing
        enhancedResult.case_metadata.owner = enhancedResult.case_metadata.owner || "SOC Tier-2 Analyst";
        enhancedResult.case_metadata.team = enhancedResult.case_metadata.team || "Email Security / Fraud Response";
        enhancedResult.case_metadata.priority = enhancedResult.case_metadata.priority || (enhancedResult.risk_score > 75 ? 'critical' : enhancedResult.risk_score > 50 ? 'high' : 'medium');
        enhancedResult.case_metadata.escalation_status = enhancedResult.case_metadata.escalation_status || 'pending';
        enhancedResult.case_metadata.review_status = enhancedResult.case_metadata.review_status || 'open';
        enhancedResult.lifecycle_stage = enhancedResult.lifecycle_stage || (enhancedResult.risk_score > 40 ? 'investigation' : 'detection');

        const historyItem: ScanHistoryItem = {
          id: Math.random().toString(36).substring(7),
          modality,
          timestamp: new Date().toISOString(),
          prediction: enhancedResult.detection.prediction,
          risk_score: enhancedResult.risk_score,
          risk_level: enhancedResult.risk_level,
          result: enhancedResult
        };

        return {
          isScanning: false,
          error: null,
          results: {
            ...state.results,
            [modality]: enhancedResult
          },
          lastProcessedScan: historyItem,
          scanHistory: [historyItem, ...state.scanHistory].slice(0, 50),
          activePage: modality === 'email' ? 'email' : modality === 'audio' ? 'audio' : modality === 'video' ? 'video' : modality === 'ocr' ? 'ocr' : state.activePage
        };
      }),

      updateCaseMetadata: (modality, metadata) => set((state) => {
        const currentResult = state.results[modality as keyof typeof state.results];
        if (!currentResult) return state;

        const updatedResult = {
          ...currentResult,
          case_metadata: {
            ...currentResult.case_metadata,
            ...metadata
          }
        };

        return {
          results: {
            ...state.results,
            [modality]: updatedResult
          }
        };
      }),

      setError: (error) => set({ isScanning: false, error }),

      clearModality: (modality) => set((state) => ({
        results: {
          ...state.results,
          [modality]: null
        }
      })),

      clearAll: () => set({
        results: {
          email: null,
          ocr: null,
          audio: null,
          video: null,
        },
        lastProcessedScan: null,
        scanHistory: []
      }),

      restoreFromHistory: (item) => set((state) => ({
        results: {
          ...state.results,
          [item.modality]: item.result
        },
        lastProcessedScan: item,
        activePage: item.modality
      })),

      setActivePage: (page) => set({ activePage: page }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSecurityMode: (mode) => set({ securityMode: mode })
    }),
    {
      name: 'phishnet-scan-storage',
    }
  )
);

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class EmailAnalyzeRequest(BaseModel):
    content: str = Field(..., description="Raw email content or text")
    is_eml_file: bool = Field(False, description="Whether the content represents a raw .eml file structure")

class Detection(BaseModel):
    prediction: str
    confidence: float
    risk_score: int

class ModelRouting(BaseModel):
    selected_models: dict
    routing_reason: str
    carbon_impact: str
    compute_efficiency: str

# 1. Kill Chain
class KillChainStage(BaseModel):
    stage_name: str
    active: bool
    description: str

# 2. MITRE ATT&CK
class MitreTechnique(BaseModel):
    tactic: str
    technique_id: str
    technique_name: str
    severity: str

# 3. Agent Swarm Board
class AgentCall(BaseModel):
    name: str
    status: str # completed, escalated, skipped
    call_count: int
    input_type: str
    output_summary: str
    confidence: float
    execution_time_ms: int
    runtime_reason: str

# 4. Runtime Timeline
class TimelineEvent(BaseModel):
    timestamp: str
    event: str
    status: str # pending, complete, error

# 5. Risk Contribution Breakdown
class RiskContribution(BaseModel):
    base_ml_score: int
    url_penalty: int
    header_penalty: int
    brand_spoof_penalty: int
    social_engineering_penalty: int
    critic_adjustment: int
    final_score: int

# 6. AI Analyst Briefing
class AiAnalystBriefing(BaseModel):
    what_happened: str
    why_it_matters: str
    who_is_targeted: str
    supporting_evidence: str
    immediate_actions: str
    next_steps: str

class LlamaSummary(BaseModel):
    model: str
    source: str
    summary: str
    fallback_used: bool
    error: Optional[str] = None

# 7. Expanded Prevention Playbook
class PreventionPlaybook(BaseModel):
    immediate_action: str
    user_awareness: str
    technical_control: str
    forensic_preservation: str
    escalation_team: str
    long_term_prevention: str
    compliance_note: str

# 8. GAN Adaptive Defense Visual
class GANDefenseLayer(BaseModel):
    status: str
    generated_variants: int
    generator_action: str
    discriminator_update: str
    new_pattern_learned: str
    retraining_queue_status: str
    safety_sandbox_status: str

# 9. Case Metadata Card
class CaseMetadata(BaseModel):
    case_id: str
    timestamp: str
    modality: str
    input_type: str
    report_status: str
    analyst_status: str

# 10. Evidence Heatmap Categories
class CategorizedEvidence(BaseModel):
    url_evidence: List[str] = []
    header_evidence: List[str] = []
    social_engineering_evidence: List[str] = []
    brand_spoof_evidence: List[str] = []
    attachment_evidence: List[str] = []
    model_evidence: List[str] = []

class EmailAnalyzeResponse(BaseModel):
    project: str = "PHISHNET"
    status: str
    risk_score: int
    risk_level: str
    detection: Detection
    
    # Core Enterprise SOC Sections
    case_metadata: CaseMetadata
    ai_analyst_briefing: AiAnalystBriefing
    ai_summary: Optional[LlamaSummary] = None
    kill_chain: List[KillChainStage]
    mitre_attack: List[MitreTechnique]
    agent_swarm: List[AgentCall]
    runtime_timeline: List[TimelineEvent]
    evidence_categories: CategorizedEvidence
    risk_contribution: RiskContribution
    prevention_playbook: PreventionPlaybook
    model_routing: ModelRouting
    gan_defense_layer: GANDefenseLayer
    
    # Legacy fields kept for backward compatibility during transition
    evidence: List[str] = []
    agent_flow: List[str] = []

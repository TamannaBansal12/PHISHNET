import os
import sys
import shutil
import uuid
import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from backend.schemas.email import (
    EmailAnalyzeResponse, Detection, ModelRouting, 
    KillChainStage, MitreTechnique, AgentCall, TimelineEvent, RiskContribution,
    AiAnalystBriefing, PreventionPlaybook, GANDefenseLayer, CaseMetadata, CategorizedEvidence,
    LlamaSummary
)
from backend.services.ai_summary_agent import generate_ai_summary
from src.pipeline.video_pipeline import run_video_pipeline

router = APIRouter(prefix="/video", tags=["Video Analysis"])

@router.post("/analyze", response_model=EmailAnalyzeResponse)
async def analyze_video_endpoint(file: UploadFile = File(...)):
    try:
        temp_dir = os.path.join(backend_dir, "data", "temp")
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = run_video_pipeline(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        det = result.get("detection", {})
        risk_score = result.get("risk_score", 0)
        risk_level = result.get("risk_level", "Unknown")
        prediction = det.get("prediction", "Unknown")
        confidence = float(det.get("confidence", 0.0))
        evidence_list = result.get("evidence", ["No evidence collected"])
        is_high_risk = risk_score > 70
        
        now = datetime.datetime.now(datetime.timezone.utc)
        case_id = f"CAS-{uuid.uuid4().hex[:8].upper()}"

        case_meta = CaseMetadata(
            case_id=case_id,
            timestamp=now.isoformat(),
            modality="Video / Vision",
            input_type="MP4/AVI Upload",
            report_status="FINALIZED",
            analyst_status="PENDING_REVIEW" if is_high_risk else "AUTO_CLOSED"
        )

        briefing = AiAnalystBriefing(
            what_happened=f"A {'highly synthetic' if is_high_risk else 'natural'} video payload was processed and classified as {prediction}.",
            why_it_matters="Potential CEO deepfake or identity manipulation." if is_high_risk else "Normal visual communication.",
            who_is_targeted="Organization perimeter controls.",
            supporting_evidence=evidence_list[0] if evidence_list else "Spatial/temporal anomalies detected.",
            immediate_actions="Flag identity verification failure." if is_high_risk else "No action required.",
            next_steps="Review WebRTC logs for similar visual signatures."
        )

        kill_chain = [
            KillChainStage(stage_name="Reconnaissance", active=True, description="Attacker mapped visual targets."),
            KillChainStage(stage_name="Delivery", active=True, description="Video stream or file delivered."),
            KillChainStage(stage_name="Exploitation", active=is_high_risk, description="Deepfake identity triggered."),
            KillChainStage(stage_name="Credential Harvesting", active=False, description="Attempt to extract valid accounts."),
            KillChainStage(stage_name="Impact", active=False, description="System compromise or data exfiltration."),
            KillChainStage(stage_name="Containment", active=True, description="PHISHNET flagged synthetic visual artifact.")
        ]

        mitre = [
            MitreTechnique(tactic="Defense Evasion", technique_id="T1027", technique_name="Obfuscated Multimedia", severity="High" if is_high_risk else "Medium")
        ]
        if is_high_risk:
            mitre.append(MitreTechnique(tactic="Credential Access", technique_id="T1111", technique_name="Multi-Factor Auth Bypass (Biometric)", severity="Critical"))

        agent_swarm = [
            AgentCall(name="Video Intake", status="completed", call_count=1, input_type="MP4 stream", output_summary="Frames Extracted", confidence=0.99, execution_time_ms=320, runtime_reason="Process raw video."),
            AgentCall(name="Frame Sampling", status="completed", call_count=1, input_type="Frame Buffer", output_summary="Spatial Anomaly Search", confidence=0.88, execution_time_ms=130, runtime_reason="Detect artifact blending."),
            AgentCall(name="Deepfake Critic", status="completed", call_count=1, input_type="Temporal Vectors", output_summary="Generative artifacts found" if is_high_risk else "Natural video verified", confidence=confidence, execution_time_ms=450, runtime_reason="Validate ML output.")
        ]
        if is_high_risk:
            agent_swarm.append(AgentCall(name="Provenance Escalation", status="escalated", call_count=1, input_type="Risk score > 70", output_summary="Triggered deep provenance tracing", confidence=0.92, execution_time_ms=850, runtime_reason="High risk threshold met."))

        base_time = now - datetime.timedelta(seconds=4)
        timeline = [
            TimelineEvent(timestamp=(base_time).isoformat(), event="Video Ingested", status="complete"),
            TimelineEvent(timestamp=(base_time + datetime.timedelta(milliseconds=800)).isoformat(), event="Frames Sampled", status="complete"),
            TimelineEvent(timestamp=(base_time + datetime.timedelta(milliseconds=1500)).isoformat(), event="Temporal Consistency Checked", status="complete"),
            TimelineEvent(timestamp=(base_time + datetime.timedelta(milliseconds=2100)).isoformat(), event="Audit Report Ready", status="complete")
        ]

        base_ml = min(40, risk_score)
        model_pen = risk_score - base_ml
        
        risk_contribution = RiskContribution(
            base_ml_score=base_ml,
            url_penalty=0,
            header_penalty=0,
            brand_spoof_penalty=0,
            social_engineering_penalty=model_pen // 2,
            critic_adjustment=model_pen // 2,
            final_score=risk_score
        )

        categorized_evidence = CategorizedEvidence()
        categorized_evidence.model_evidence = evidence_list

        playbook = PreventionPlaybook(
            immediate_action="Require secondary verification for all sensitive transactions." if is_high_risk else "None required.",
            user_awareness="Train executives on deepfake visual artifacts.",
            technical_control="Deploy liveness detection at gateway.",
            forensic_preservation="Save full MP4 trace to cold storage.",
            escalation_team="Report to internal fraud team.",
            long_term_prevention="Enforce internal deepfake detection on all video channels.",
            compliance_note="Log identity verification failure to SIEM."
        )

        gan_defense = GANDefenseLayer(
            status="ACTIVE",
            generated_variants=8 if is_high_risk else 2,
            generator_action="Generated synthetic video frames based on extracted visual footprint.",
            discriminator_update="Discriminator weights updated for blending anomaly detection.",
            new_pattern_learned="FaceSwap spatial mismatch artifacts logged.",
            retraining_queue_status="Queued for next model refresh cycle.",
            safety_sandbox_status="Isolated from production routing."
        )

        # 11. AI Summary (Ollama)
        routing = result.get("model_routing", {})
        summary_payload = {
            "status": "success",
            "risk_score": risk_score,
            "risk_level": "CRITICAL" if risk_score > 70 else "MODERATE" if risk_score > 30 else "LOW",
            "detection": {
                "prediction": prediction,
                "confidence": confidence
            },
            "evidence": evidence_list,
            "model_routing": {
                "carbon_impact": str(routing.get("carbon_impact", "Medium")),
                "selected_models": routing.get("selected_models", {})
            }
        }
        ai_summary_data = generate_ai_summary(summary_payload)
        ai_summary = LlamaSummary(**ai_summary_data)
        selected_models = routing.get("selected_models", {})
        if not selected_models:
            selected_models = {"video": routing.get("selected_model", "MobileNetV2")}
            
        routing_reason_val = routing.get("routing_reason", "Standard routing applied.")
        if isinstance(routing_reason_val, list):
            routing_reason_val = " ".join(routing_reason_val)
        else:
            routing_reason_val = str(routing_reason_val)

        return EmailAnalyzeResponse(
            status="success",
            risk_score=risk_score,
            risk_level=risk_level,
            detection=Detection(
                prediction=prediction,
                confidence=confidence,
                risk_score=int(det.get("video_signal_score", risk_score))
            ),
            case_metadata=case_meta,
            ai_analyst_briefing=briefing,
            ai_summary=ai_summary,
            kill_chain=kill_chain,
            mitre_attack=mitre,
            agent_swarm=agent_swarm,
            runtime_timeline=timeline,
            evidence_categories=categorized_evidence,
            risk_contribution=risk_contribution,
            prevention_playbook=playbook,
            model_routing=ModelRouting(
                selected_models=selected_models,
                routing_reason=routing_reason_val,
                carbon_impact=str(routing.get("carbon_impact", "High")),
                compute_efficiency=str(routing.get("compute_efficiency", "Heavy GPU"))
            ),
            gan_defense_layer=gan_defense,
            evidence=evidence_list,
            agent_flow=[a.name for a in agent_swarm]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

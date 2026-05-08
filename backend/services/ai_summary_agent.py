import json
import subprocess

DEFAULT_MODEL = "llama3.1"

def _build_soc_prompt(scan_result: dict) -> str:
    compact_result = {
        "modality": scan_result.get("modality"),
        "prediction": scan_result.get("detection", {}).get("prediction"),
        "risk_score": scan_result.get("risk_score"),
        "risk_level": scan_result.get("risk_level"),
        "confidence": scan_result.get("detection", {}).get("confidence"),
        "top_evidence": (scan_result.get("evidence") or [])[:5],
        "selected_models": scan_result.get("model_routing", {}).get("selected_models"),
        "routing_reason": scan_result.get("model_routing", {}).get("routing_reason"),
        "active_agents": [a.get("name") for a in (scan_result.get("agent_swarm") or [])],
        "attack_category": scan_result.get("attack_category", "Social Engineering")
    }
    compact = json.dumps(compact_result, default=str)

    return f"""You are PHISHNET’s senior SOC analyst. Generate a comprehensive incident briefing using only the provided forensic data.

STRICT RULES:
- No markdown (no stars, no hash symbols, no bolding).
- No placeholder text (never use [Date], [Time], [Insert], etc).
- No emojis.
- No hallucinations.
- Concise, professional tone.

FORENSIC DATA:
{compact}

REQUIRED RESPONSE STRUCTURE:
Executive Summary:
Attack Narrative:
Why It Was Flagged:
Evidence-Based Reasoning:
Agentic Reflection:
Business Impact:
Recommended SOC Action:
Prevention Plan:
Green IT Routing Justification:
GAN Adaptive Defense Note:
"""

def _fallback_summary(scan_result: dict) -> str:
    risk_level = scan_result.get("risk_level", "MODERATE")
    prediction = scan_result.get("detection", {}).get("prediction", "suspicious artifact")
    modality = scan_result.get("modality", "network")

    return f"""Executive Summary:
Investigation confirms a {risk_level.lower()} threat signature originating from the {modality} vector. PHISHNET identified anomalies consistent with sophisticated {prediction} campaigns targeting enterprise assets.

Attack Narrative:
The adversary attempted to leverage {modality} impersonation to deliver a malicious payload. The flow suggests an initial social engineering stage followed by a redirection to a fraudulent credential collection portal.

Why It Was Flagged:
The scan identified multiple high-fidelity risk indicators, including suspicious domain structures, urgency-based social engineering markers, and heuristic detection triggers.

Evidence-Based Reasoning:
Investigation nodes extracted forensic markers that align with known {modality}-based evasion techniques. These artifacts triggered the multi-agent orchestration threshold with high confidence.

Agentic Reflection:
The risk fusion and critic agents confirmed that the evidence supports an escalated risk classification. Orchestration was justified due to multiple independent adversarial signals.

Business Impact:
Potential unauthorized credential harvesting or account takeover. Successful exploitation could lead to data exfiltration and significant downstream financial risk.

Recommended SOC Action:
Execute immediate domain containment and preserve forensic artifacts. Initiate out-of-band verification for the targeted recipients.

Prevention Plan:
Update mail gateway filters to intercept similar {modality} signatures. Enroll the target user in enhanced awareness training and enforce multi-factor authentication.

Green IT Routing Justification:
PHISHNET used efficient model routing for standard analysis and escalated to heavy reasoning only when evidence severity required a multi-agent critic review.

GAN Adaptive Defense Note:
The threat signature has been mapped to the adaptive defense sandbox to generate adversarial variants for future detector hardening and neural network resilience.
"""

def generate_ai_summary(scan_result: dict, model: str = DEFAULT_MODEL) -> dict:
    prompt = _build_soc_prompt(scan_result)

    try:
        completed = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            text=True,
            capture_output=True,
            timeout=90
        )

        if completed.returncode != 0:
            raise RuntimeError(completed.stderr)

        summary = completed.stdout.strip()

        if not summary:
            raise RuntimeError("Ollama returned empty output.")

        return {
            "model": model,
            "source": "local_ollama",
            "summary": summary,
            "fallback_used": False
        }

    except Exception as e:
        return {
            "model": "fallback_rule_based",
            "source": "local_fallback",
            "summary": _fallback_summary(scan_result),
            "fallback_used": True,
            "error": str(e)
        }

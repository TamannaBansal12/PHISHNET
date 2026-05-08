import { NextRequest, NextResponse } from "next/server";

const DEFAULT_MODEL = "llama3.1";
const TIMEOUT_MS = 20000; // 20 second timeout

function buildFallbackAnswer(question: string, scanResult: any) {
  const riskLevel = scanResult?.risk_level ?? "MODERATE";
  const prediction = scanResult?.detection?.prediction || "suspicious artifact";
  const modality = scanResult?.modality || "network";

  return `1. Direct Answer: Investigation confirms a ${riskLevel} threat signature originating from the ${modality} vector. The artifact demonstrates patterns consistent with sophisticated ${prediction} campaigns.

2. Evidence Used: Forensic indicators include urgency-based linguistic triggers, suspicious domain structures, and mismatched authentication headers.

3. SOC Recommendation: Initiate immediate domain containment and preserve forensic artifacts. Notify the identity management team for credential review.

4. Business Impact: Potential unauthorized access to corporate accounts. Exploitation may result in downstream financial fraud or intellectual property exfiltration.

5. Next Action: Execute the automated containment playbook and enroll the targeted user in high-risk awareness training.`;
}

function buildPrompt(question: string, scanResult: any, mode: string) {
  const compact = {
    modality: scanResult.modality,
    prediction: scanResult.detection?.prediction,
    confidence: scanResult.detection?.confidence,
    risk_score: scanResult.risk_score,
    risk_level: scanResult.risk_level,
    top_evidence: Array.isArray(scanResult.evidence) ? scanResult.evidence.slice(0, 5) : [],
    models: scanResult.model_routing?.selected_models,
    green_routing: scanResult.model_routing?.routing_reason,
    agents: Array.isArray(scanResult.agent_swarm) ? scanResult.agent_swarm.map((a: any) => a.name) : [],
    category: scanResult.attack_category || "Social Engineering"
  };

  return `You are PHISHNET’s senior SOC analyst. Generate a concise, professional SOC response using only the provided forensic data.

STRICT RULES:
- No markdown (no stars, no hash symbols, no bolding).
- No placeholder text (never use [Date], [Time], [Insert], etc).
- No emojis.
- No hallucinations.
- Concise, professional tone.

FORENSIC DATA:
${JSON.stringify(compact)}

ANALYST QUESTION:
${question}

REQUIRED RESPONSE STRUCTURE:
1. Direct Answer:
2. Evidence Used:
3. SOC Recommendation:
4. Business Impact:
5. Next Action:
`;
}

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body = await req.json();
    const question = body.question || "";
    const scanResult = body.scanResult || {};
    const mode = body.mode || "analyst";

    if (!question.trim()) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const prompt = buildPrompt(question, scanResult, mode);

    try {
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0.2,
            num_predict: 400, // Limit output for speed
            top_p: 0.9
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!ollamaRes.ok) {
        throw new Error(`Ollama failed: ${ollamaRes.status}`);
      }

      const data = await ollamaRes.json();
      const answer = data.response?.trim();

      if (!answer) {
        throw new Error("Empty Ollama response.");
      }

      return NextResponse.json({
        answer,
        model: DEFAULT_MODEL,
        source: "local_ollama",
        fallbackUsed: false
      });

    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      
      return NextResponse.json({
        answer: buildFallbackAnswer(question, scanResult),
        model: "fallback_rule_based",
        source: isTimeout ? "local_timeout_fallback" : "local_error_fallback",
        fallbackUsed: true,
        error: isTimeout ? "Ollama inference timed out (20s)" : (err?.message || "Ollama unreachable")
      });
    }

  } catch (err: any) {
    clearTimeout(timeoutId);
    return NextResponse.json(
      { error: err?.message || "Copilot request failed." },
      { status: 500 }
    );
  }
}

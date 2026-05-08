import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type Report = {
  modality?: string;
  type?: string;
  risk_score?: number;
  riskScore?: number;
  confidence?: number;
  verdict?: string;
  model_used?: string;
  modelUsed?: string;
  route?: string;
  green_score?: number;
  energy_estimate?: number;
  carbon_estimate?: number;
  created_at?: string;
  timestamp?: string;
};

function readJsonReports(): Report[] {
  const reportsDir = path.join(process.cwd(), "backend", "reports");

  if (!fs.existsSync(reportsDir)) return [];

  const files = fs
    .readdirSync(reportsDir)
    .filter((file) => file.endsWith(".json"));

  const reports: Report[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(reportsDir, file), "utf-8");
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        reports.push(...parsed);
      } else {
        reports.push(parsed);
      }
    } catch {
      continue;
    }
  }

  return reports;
}

function getModality(report: Report) {
  return String(report.modality || report.type || "unknown").toLowerCase();
}

function getRisk(report: Report) {
  return Number(report.risk_score ?? report.riskScore ?? 0);
}

function getConfidence(report: Report) {
  return Number(report.confidence ?? 0);
}

function getModelTier(report: Report) {
  const value = String(
    report.model_used || report.modelUsed || report.route || ""
  ).toLowerCase();

  if (value.includes("heavy") || value.includes("llm") || value.includes("vlm") || value.includes("whisper") || value.includes("roberta")) {
    return "Heavy";
  }

  if (value.includes("balanced") || value.includes("distil") || value.includes("efficient") || value.includes("cnn")) {
    return "Balanced";
  }

  return "Lightweight";
}

function countBy(items: string[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export async function GET() {
  const reports = readJsonReports();

  const modalities = ["email", "audio", "video", "ocr", "watermark"];

  const totalScans = reports.length;

  const highRiskCases = reports.filter((r) => {
    const risk = getRisk(r);
    const verdict = String(r.verdict || "").toLowerCase();
    return risk >= 70 || verdict.includes("high") || verdict.includes("phishing") || verdict.includes("fake");
  }).length;

  const modelTiers = reports.map(getModelTier);
  const tierCounts = countBy(modelTiers);

  const modelEscalations = (tierCounts["Heavy"] || 0) + (tierCounts["Balanced"] || 0);

  const avgGreenSaving =
    totalScans === 0
      ? 0
      : Math.round(
          reports.reduce((sum, r) => {
            const tier = getModelTier(r);
            if (tier === "Lightweight") return sum + 45;
            if (tier === "Balanced") return sum + 25;
            return sum + 8;
          }, 0) / totalScans
        );

  const detectionSplit = modalities.map((m) => ({
    name: m.toUpperCase(),
    value: reports.filter((r) => getModality(r).includes(m)).length,
  }));

  const confidenceRadar = modalities.map((m) => {
    const filtered = reports.filter((r) => getModality(r).includes(m));
    const avg =
      filtered.length === 0
        ? 0
        : Math.round(filtered.reduce((s, r) => s + getConfidence(r), 0) / filtered.length);

    return {
      subject: m.toUpperCase(),
      score: avg,
    };
  });

  const riskTrend = modalities.map((m) => {
    const filtered = reports.filter((r) => getModality(r).includes(m));
    const avg =
      filtered.length === 0
        ? 0
        : Math.round(filtered.reduce((s, r) => s + getRisk(r), 0) / filtered.length);

    return {
      modality: m.toUpperCase(),
      risk: avg,
      scans: filtered.length,
    };
  });

  const modelUsage = ["Lightweight", "Balanced", "Heavy"].map((tier) => ({
    name: tier,
    value: tierCounts[tier] || 0,
  }));

  const greenIT = ["Lightweight", "Balanced", "Heavy"].map((tier) => {
    const count = tierCounts[tier] || 0;

    return {
      model: tier,
      scans: count,
      energy:
        tier === "Lightweight" ? count * 1.2 : tier === "Balanced" ? count * 2.8 : count * 5.7,
      latency:
        tier === "Lightweight" ? count * 0.8 : tier === "Balanced" ? count * 1.9 : count * 4.4,
      carbon:
        tier === "Lightweight" ? count * 0.4 : tier === "Balanced" ? count * 1.1 : count * 2.8,
    };
  });

  const pipelineLoad = [
    { stage: "Ingest", value: totalScans },
    { stage: "Preprocess", value: totalScans },
    { stage: "Detect", value: totalScans },
    { stage: "Reflect", value: modelEscalations },
    { stage: "Report", value: totalScans },
  ];

  return NextResponse.json({
    connected: true,
    source: "backend/reports/*.json",
    summary: {
      totalScans,
      highRiskCases,
      modelEscalations,
      computeSaved: avgGreenSaving,
    },
    riskTrend,
    greenIT,
    detectionSplit,
    modelUsage,
    confidenceRadar,
    pipelineLoad,
  });
}

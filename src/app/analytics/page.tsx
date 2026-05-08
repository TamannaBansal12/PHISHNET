"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { RefreshCw } from "lucide-react";

const COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"];

function Card({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
      <h2 className="text-xl font-bold mb-5">{title}</h2>
      <div className="h-[320px] w-full min-w-0">{children}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  async function loadData() {
    const res = await fetch("/api/analytics", { cache: "no-store" });
    setData(await res.json());
  }

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!data) {
    return <main className="min-h-screen bg-[#050816] text-white p-10 ml-[260px]">Loading analytics...</main>;
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-8 ml-[260px]">
      <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-purple-500/10 p-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-cyan-300 tracking-[0.3em] text-sm mb-3">PHISHNET LIVE ANALYTICS</p>
            <h1 className="text-5xl font-bold">Dynamic Graphs & GreenIT Intelligence</h1>
            <p className="text-slate-300 mt-3">Connected to real scan reports from backend/reports.</p>
          </div>
          <button onClick={loadData} className="px-5 py-3 rounded-2xl border border-cyan-400/30 text-cyan-200">
            <RefreshCw className="inline mr-2" size={18} /> Refresh
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-slate-400">Total Scans</p>
          <h2 className="text-4xl font-bold">{data.summary.totalScans}</h2>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-slate-400">High Risk</p>
          <h2 className="text-4xl font-bold">{data.summary.highRiskCases}</h2>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-slate-400">Escalations</p>
          <h2 className="text-4xl font-bold">{data.summary.modelEscalations}</h2>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-slate-400">Compute Saved</p>
          <h2 className="text-4xl font-bold">{data.summary.computeSaved}%</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Risk by Modality">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="modality" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="risk" fill="#22d3ee" />
              <Bar dataKey="scans" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="GreenIT Model Cost">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.greenIT}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="model" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="energy" fill="#22d3ee" />
              <Bar dataKey="latency" fill="#a78bfa" />
              <Bar dataKey="carbon" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Threat Distribution">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data.detectionSplit} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.detectionSplit.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Confidence Radar">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data.confidenceRadar}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" />
              <PolarRadiusAxis stroke="#94a3b8" />
              <Radar dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.35} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </main>
  );
}

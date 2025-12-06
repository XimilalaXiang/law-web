import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { researchSummary } from '../data/research';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: 'rgba(255,255,255,0.8)', font: { family: 'Inter', size: 12 } },
    },
    tooltip: {
      enabled: true,
      displayColors: false,
      backgroundColor: 'rgba(0,0,0,0.85)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255,199,0,0.4)',
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(255,255,255,0.7)' },
      grid: { color: 'rgba(255,255,255,0.05)' },
    },
    y: {
      ticks: { color: 'rgba(255,255,255,0.7)', callback: (v: any) => `${v}%` },
      grid: { color: 'rgba(255,255,255,0.05)' },
      beginAtZero: true,
      max: 100,
    },
  },
};

export const ResearchInsights: React.FC = () => {
  const { sampleSize, keyMetrics, channelOverall, channelEncountered, riskSignals, gradeEncountered, recommendations, generatedAt, source } =
    researchSummary;

  const barData = {
    labels: riskSignals.map((d) => d.label),
    datasets: [
      {
        label: '可疑信号认同度',
        data: riskSignals.map((d) => d.value),
        backgroundColor: 'rgba(255,199,0,0.35)',
        borderColor: 'rgba(255,199,0,0.9)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: channelOverall.map((d) => d.label),
    datasets: [
      {
        label: '主要信息渠道（整体样本）',
        data: channelOverall.map((d) => d.value),
        backgroundColor: [
          'rgba(255,199,0,0.8)',
          'rgba(239,68,68,0.75)',
          'rgba(59,130,246,0.75)',
          'rgba(16,185,129,0.7)',
          'rgba(167,139,250,0.7)',
        ],
        borderColor: 'rgba(0,0,0,0.6)',
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: channelEncountered.map((d) => d.label),
    datasets: [
      {
        label: '曾遭遇疑似诈骗人群的渠道占比',
        data: channelEncountered.map((d) => d.value),
        borderColor: 'rgba(255,199,0,0.9)',
        backgroundColor: 'rgba(255,199,0,0.15)',
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#FFC700',
        fill: true,
      },
      {
        label: '整体样本渠道占比',
        data: channelOverall.map((d) => d.value),
        borderColor: 'rgba(239,68,68,0.8)',
        backgroundColor: 'rgba(239,68,68,0.12)',
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(239,68,68,1)',
        fill: true,
      },
    ],
  };

  const gradeBarData = {
    labels: gradeEncountered.map((d) => d.label),
    datasets: [
      {
        label: '遭遇组年级占比（%）',
        data: gradeEncountered.map((d) => d.value),
        backgroundColor: 'rgba(59,130,246,0.45)',
        borderColor: 'rgba(59,130,246,0.9)',
        borderWidth: 1.2,
        borderRadius: 6,
      },
    ],
  };

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="glow-orb glow-orb-3" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="pill">调研洞察</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mt-6">
            {sampleSize} 份问卷 · 大学生求职反诈关键发现
          </h2>
          <p className="font-mono text-sm text-white/60 mt-3">
            数据来源：{source} ｜ 生成时间：{generatedAt} ｜ 样本量：{sampleSize}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2 mb-10">
          {keyMetrics.map((m) => (
            <div key={m.label} className="glass-card chart-card">
              <p className="text-xs uppercase tracking-[0.08em] text-white/50 font-mono">{m.label}</p>
              <p className="text-3xl font-display mt-3 text-white">
                <span className="gradient-text">{m.value}</span>
                <span className="text-lg text-white/60 ml-1">%</span>
              </p>
            </div>
          ))}
        </div>

        <div className="chart-grid">
          <div className="glass-card chart-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display text-white">可疑信号认同度</h3>
              <span className="pill">风险信号</span>
            </div>
            <div className="h-64">
              <Bar data={barData} options={baseOptions} />
            </div>
          </div>

          <div className="glass-card chart-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display text-white">主要信息渠道占比</h3>
              <span className="pill">整体样本</span>
            </div>
            <div className="h-64">
              <Doughnut
                data={doughnutData}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    legend: { display: true, position: 'bottom', labels: { color: 'rgba(255,255,255,0.8)' } },
                  },
                  cutout: '55%',
                }}
              />
            </div>
          </div>

          <div className="glass-card chart-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display text-white">渠道与风险对比</h3>
              <span className="pill">遭遇组 vs 全体</span>
            </div>
            <div className="h-64">
              <Line
                data={lineData}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    legend: { display: true, position: 'bottom', labels: { color: 'rgba(255,255,255,0.8)' } },
                  },
                }}
              />
            </div>
          </div>

          <div className="glass-card chart-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display text-white">年级分布（遭遇组）</h3>
              <span className="pill">近似分布</span>
            </div>
            <div className="h-64">
              <Bar
                data={gradeBarData}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card mt-10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="pill">行动建议</span>
            <p className="text-sm text-white/60 font-mono">基于调研总结的四点落地建议</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recommendations.map((rec) => (
              <div key={rec} className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(255,199,0,0.6)]" />
                <p className="text-white/80 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchInsights;


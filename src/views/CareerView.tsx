import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  DollarSign,
  Award,
  Layers,
  Sparkles,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  SALARY_BENCHMARKS,
  INDIA_TECH_LANDSCAPE,
  CSHARP_ENGINEER_EDGE
} from '../data/careerData';

export const CareerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'salaries' | 'india-hubs' | 'architect-edge'>('salaries');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 12
          </span>
          <span className="text-xs text-slate-400">Industry & Market Realities</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Career Compass: Job Market Realities & The C# Architect Edge
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          An honest, transparent analysis of the compensation landscape in India (LPA) and globally (USD), key hiring hubs (GCCs & Unicorns), and why experienced C# engineers hold an unfair competitive moat.
        </p>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {[
            { id: 'salaries', label: 'Compensation Benchmarks (India & Global)', icon: DollarSign },
            { id: 'india-hubs', label: 'Indian Tech Hubs & GCC Landscape', icon: MapPin },
            { id: 'architect-edge', label: 'The C# Developer’s Unfair Edge', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Salary Benchmarks */}
      {activeTab === 'salaries' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Market Compensation Tiers (2025–2026)</h2>
            <p className="text-xs text-slate-400">
              Verified salary bands across Tier-1 GCCs, FinTech leaders, and high-growth AI startups in India and remote global firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SALARY_BENCHMARKS.map((bench, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                      {bench.experienceYears}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        bench.marketDemand === 'Critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {bench.marketDemand} Demand
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{bench.role}</h3>

                  <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">India Compensation:</span>
                      <span className="text-base font-black text-amber-400 font-mono">
                        {bench.indiaSalaryLPA}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-2">
                      <span className="text-xs text-slate-400">Global Remote (USD):</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {bench.globalSalaryUSD}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Must-Have Skill Arsenal:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {bench.coreSkills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Indian Tech Hubs */}
      {activeTab === 'india-hubs' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">Indian Tech Ecosystem Landscape</h2>
            <p className="text-xs text-slate-400">
              Where the highest-leverage Python engineering roles are created across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INDIA_TECH_LANDSCAPE.map((hub, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{hub.hub}</h3>
                    <span className="text-xs text-slate-400">{hub.type}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300">
                  <strong className="text-amber-400">Prominent Employers: </strong>
                  {hub.companies}
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {hub.hiringTrends}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: The C# Architect Edge */}
      {activeTab === 'architect-edge' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              {CSHARP_ENGINEER_EDGE.title}
            </h2>
            <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
              Why self-taught scripting developers struggle with production scale, while seasoned C# developers can command top-tier compensation by marrying systems discipline with Python velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CSHARP_ENGINEER_EDGE.strengths.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 space-y-3">
            <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Critical Interview Guidelines for C# Senior Engineers
            </h3>
            <ul className="space-y-2 text-xs text-slate-200">
              {CSHARP_ENGINEER_EDGE.interviewAdvice.map((advice, aIdx) => (
                <li key={aIdx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

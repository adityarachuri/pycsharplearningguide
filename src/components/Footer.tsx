import React from 'react';
import { ShieldCheck, ExternalLink, Cpu, Terminal, Database, Lock, Monitor } from 'lucide-react';
import { NavSectionId } from '../types';
import { SiteLogo } from './SiteLogo';

interface FooterProps {
  onNavigate: (sectionId: NavSectionId) => void;
  onOpenSyncDrawer: () => void;
  onOpenSandbox: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSyncDrawer,
  onOpenSandbox
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-800/90 bg-slate-950 text-slate-400">
      {/* Top Banner Grid */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Branding & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <SiteLogo size="md" showText={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              The premier interactive technical guide and Rosetta Stone for senior .NET and C# software engineers mastering CPython internals, dynamic execution, GIL mechanics, and modern high-throughput Python 3.14 systems.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                HSTS & CSP Hardened
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                <Database className="h-3.5 w-3.5" />
                Cloud DB Ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                <Lock className="h-3.5 w-3.5" />
                RFC 9116 Verified
              </span>
            </div>
          </div>

          {/* Col 3: Architectural Deep Dives */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              Runtime Core
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('architecture')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  CPython vs .NET CLR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dsa-python')}
                  className="hover:text-amber-400 transition-colors text-left text-amber-300 font-medium"
                >
                  Data Structures & Algorithms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deep-dives')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  PEP 659 Adaptive Tier-1
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('libraries-batteries')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Batteries Included
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aiml-context')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  AI/ML PyTorch & NumPy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Toolchain & Workstation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              Workstation & Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('web-app-project')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1"
                >
                  <span className="text-amber-400 font-bold font-mono">NEW</span>
                  <span>Project: Web App (FastAPI)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aiml-project')}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1"
                >
                  <span className="text-purple-400 font-bold font-mono">NEW</span>
                  <span>Project: AI/ML (Local RAG)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('workstation-setup')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  uv & Rust-Powered Tooling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('comparison-matrix')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  C# vs Python Rosetta Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSandbox}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Live CPython Sandbox
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSyncDrawer}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Database & Sync Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('transition')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  90-Day Transition Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Verification */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              Security & RFCs
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/.well-known/security.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-400 transition-colors"
                >
                  <span>RFC 9116 security.txt</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-400 transition-colors"
                >
                  <span>Robots Index Protocol</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('researchers')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Academic Citations & PEPs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Standard Legal & Technical Disclaimer Box */}
        <div className="mt-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6 text-xs leading-relaxed space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Standard Legal & Educational Disclaimer
            </h4>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            <strong>Independent Technical Reference:</strong> This site is an independent, non-commercial educational and architectural reference resource created for software engineers, architects, and researchers navigating runtime differences between Microsoft .NET (C#) and the Python ecosystem. It is not sponsored, endorsed, or affiliated with the Python Software Foundation or Microsoft Corporation.
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            <strong>Trademark Notices:</strong> Python® and the Python logo are registered trademarks of the Python Software Foundation (PSF). C#, .NET, ASP.NET, Roslyn, CLR, and Visual Studio are trademarks or registered trademarks of Microsoft Corporation in the United States and other countries. All other product names, logos, and brands cited herein are property of their respective owners.
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            <strong>Warranty & Code Performance:</strong> All benchmark metrics, opcode disassembly snippets, architectural diagrams, and code artifacts are provided &ldquo;as is&rdquo; for analytical and instructive purposes without warranty of any kind, express or implied. Real-world execution performance, memory overhead, and concurrency throughput vary based on operating system kernel parameters, hardware cache topologies, CPU vector instruction extensions (AVX-512/NEON), and compiler optimization flags.
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            <strong>Educational Use Only:</strong> Content is provided for learning purposes and reflects the author team&rsquo;s best understanding at time of writing. Python and .NET evolve continuously &mdash; always cross-check version-specific behavior, security guidance, and library APIs against official documentation before relying on them in production systems.
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            <strong>Not Professional Advice:</strong> Chapters illustrating regulated-industry engineering patterns (for example FinTech payment/fraud-scoring architecture or HealthTech FHIR/HIPAA data handling) are architectural teaching examples only. They are not legal, compliance, financial, medical, or security-certification advice, and do not represent an audited or certified implementation of any regulation (HIPAA, PCI DSS, SOX, or otherwise). Building a real regulated system requires qualified legal, compliance, and security professionals.
          </p>
        </div>

        {/* Optimal Viewing Environment Advisory */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6 text-[11px] leading-relaxed">
          <Monitor className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-400">
            <strong className="text-slate-200">Optimal Viewing Environment:</strong> This platform&rsquo;s interactive visualizers, side-by-side architectural comparisons, and dense technical diagrams are designed and best experienced on a laptop or desktop display at a minimum resolution of 1366&times;768 or higher. The interface remains fully functional on tablet and mobile devices, but some visualizations are more effectively explored on a larger viewport.
          </p>
        </div>

        {/* Copyright & Versioning Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {currentYear} <strong>PyCSharp</strong> (Polyglot Systems &amp; Technical Rosetta Stone).</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-[11px] text-amber-400">v2.5.0-prod</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PWA Offline Capable
            </span>
            <span>OWASP Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

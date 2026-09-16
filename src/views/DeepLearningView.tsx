import { useState, type ReactElement } from 'react';
import {
  BrainCircuit,
  Network,
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Zap,
  FlaskConical,
  ServerCog
} from 'lucide-react';
import {
  DEEP_LEARNING_VERDICT,
  NEURAL_NETWORK_CONCEPTS,
  ARCHITECTURE_FAMILIES,
  CAREER_TRACK_COMPARISON,
  CAREER_SPECTRUM_NOTE,
  RESEARCH_PRACTICES,
  ENGINEERING_PRACTICES
} from '../data/deepLearningData';
import { DualCodeView } from '../components/CodeBlock';

type Tab = 'foundations' | 'architectures' | 'spectrum' | 'practice';

export function DeepLearningView(): ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('foundations');
  const [selectedConceptId, setSelectedConceptId] = useState<string>(NEURAL_NETWORK_CONCEPTS[0].id);
  const [practiceView, setPracticeView] = useState<'research' | 'engineering'>('research');

  const activeConcept =
    NEURAL_NETWORK_CONCEPTS.find(c => c.id === selectedConceptId) || NEURAL_NETWORK_CONCEPTS[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Hero */}
      <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
            Chapter 23
          </span>
          <span className="text-xs text-slate-400">Deep Learning &amp; The Two Career Tracks</span>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Deep Learning with Python: From ML Engineer to ML Researcher
        </h1>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-300 max-w-3xl">
          {DEEP_LEARNING_VERDICT}
        </p>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {(
            [
              { id: 'foundations', label: 'Neural Network Foundations', icon: BrainCircuit },
              { id: 'architectures', label: 'Architecture Families', icon: Network },
              { id: 'spectrum', label: 'Engineer vs. Researcher', icon: Users },
              { id: 'practice', label: 'How Each Track Actually Works', icon: Wrench }
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* Tab 1: Neural Network Foundations */}
      {activeTab === 'foundations' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {NEURAL_NETWORK_CONCEPTS.map(concept => (
              <button
                key={concept.id}
                onClick={() => setSelectedConceptId(concept.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedConceptId === concept.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className="font-mono text-[11px] opacity-75">0{concept.number}.</span>
                <span>{concept.title.split(':')[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 font-mono">
                  Concept #{activeConcept.number}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{activeConcept.tagline}</span>
              </div>
              <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">{activeConcept.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Why It Matters
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {activeConcept.whyItMatters}
                </p>
                <p className="text-xs text-slate-400 pt-1">
                  <strong className="text-slate-200">Python Approach: </strong>
                  {activeConcept.pythonApproach}
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  C# / .NET Equivalence
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-mono">
                  {activeConcept.csharpEquivalent}
                </p>
                <p className="text-xs text-slate-300 pt-1">
                  <strong className="text-purple-200">C# Approach: </strong>
                  {activeConcept.csharpApproach}
                </p>
              </div>
            </div>

            <DualCodeView
              csharpCode={activeConcept.csharpCode}
              pythonCode={activeConcept.pythonCode}
              csharpTitle="TorchSharp (.NET)"
              pythonTitle="PyTorch"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4" />
                  Under the Hood
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeConcept.underTheHood}
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4" />
                  Common Pitfalls
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  {activeConcept.pitfalls.map((pitfall, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                Best Practices
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeConcept.bestPractices.map((bp, bpIdx) => (
                  <div
                    key={bpIdx}
                    className="flex items-start gap-2 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Architecture Families */}
      {activeTab === 'architectures' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">The Three Foundational Architecture Families</h2>
            <p className="text-xs text-slate-400">
              Every mainstream deep learning model in production or research traces back to one of these three ideas (or a combination of them).
            </p>
          </div>

          <div className="space-y-4">
            {ARCHITECTURE_FAMILIES.map(arch => (
              <div
                key={arch.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <h3 className="text-base font-bold text-white">{arch.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">{arch.oneLineDefinition}</p>
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-200">Designed for: </strong>
                  {arch.designedFor}
                </p>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{arch.keyIdea}</p>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    C# Developer Angle:
                  </span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{arch.csharpAngle}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Limitations / What Came Next:
                  </span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{arch.limitationsOrSuccessor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Engineer vs. Researcher spectrum */}
      {activeTab === 'spectrum' && (
        <div className="space-y-6">
          <div className="border-l-2 border-amber-500/40 pl-4">
            <h2 className="text-lg font-bold text-white">ML Engineer vs. ML Researcher</h2>
            <p className="text-xs text-slate-400">
              Both build and train models. The difference is what each role is actually optimizing for.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-300 leading-relaxed">{CAREER_SPECTRUM_NOTE}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="p-4 font-bold text-white whitespace-nowrap border-b border-slate-800">
                    Dimension
                  </th>
                  <th className="p-4 font-bold text-amber-400 border-b border-slate-800">
                    ML Engineer
                  </th>
                  <th className="p-4 font-bold text-purple-300 border-b border-slate-800">
                    ML Researcher
                  </th>
                </tr>
              </thead>
              <tbody>
                {CAREER_TRACK_COMPARISON.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'}
                  >
                    <td className="p-4 font-semibold text-slate-200 whitespace-nowrap align-top border-b border-slate-800/60">
                      {row.dimension}
                    </td>
                    <td className="p-4 text-slate-300 leading-relaxed align-top border-b border-slate-800/60">
                      {row.mlEngineer}
                    </td>
                    <td className="p-4 text-slate-300 leading-relaxed align-top border-b border-slate-800/60">
                      {row.mlResearcher}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Practice & Tools */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setPracticeView('research')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                practiceView === 'research'
                  ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <FlaskConical className="h-4 w-4" />
              How Researchers Work
            </button>
            <button
              onClick={() => setPracticeView('engineering')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                practiceView === 'engineering'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ServerCog className="h-4 w-4" />
              How Engineers Work
            </button>
          </div>

          <div className="space-y-4">
            {(practiceView === 'research' ? RESEARCH_PRACTICES : ENGINEERING_PRACTICES).map(item => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 space-y-2 ${
                  practiceView === 'research'
                    ? 'border-purple-500/20 bg-purple-500/5'
                    : 'border-amber-500/20 bg-amber-500/5'
                }`}
              >
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

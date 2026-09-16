import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Plus,
  BarChart3,
  Layers,
  TrendingUp,
  RotateCcw,
  Check
} from 'lucide-react';
import {
  getInitialStudyLogs,
  saveStudyHoursToStorage,
  generateHeatmapGrid,
  computeStudyMetrics,
  CURRICULUM_DOMAINS,
  WeekHeatmapDay
} from '../data/studyHoursData';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

const LOG_NOTIFICATION_RESET_MS = 3500;
const RESET_NOTIFICATION_MS = 3000;

interface ProgressDashboardProps {
  completedChapters: string[];
  onToggleChapter?: (chapterId: string) => void;
  totalChapters?: number;
  allSections?: { id: string; name: string }[];
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  completedChapters = ['fundamentals'],
  onToggleChapter,
  totalChapters = 13,
  allSections = []
}) => {
  // Study hours state
  const [studyLogs, setStudyLogs] = useState<Record<string, number>>(() =>
    getInitialStudyLogs()
  );
  const [hoveredDay, setHoveredDay] = useState<WeekHeatmapDay | null>(null);
  const [logNotification, setLogNotification] = useState<string | null>(null);
  const [timeframeView, setTimeframeView] = useState<'daily' | 'weekly'>('daily');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  useEscapeToClose(isLogModalOpen, () => setIsLogModalOpen(false));
  const [manualHours, setManualHours] = useState('1.5');
  const [manualDate, setManualDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );

  // Compute metrics
  const completedCount = completedChapters.length;
  const remainingCount = Math.max(0, totalChapters - completedCount);
  const completionPercentage = Math.round((completedCount / totalChapters) * 100);

  const studyMetrics = useMemo(() => computeStudyMetrics(studyLogs), [studyLogs]);
  const heatmapWeeks = useMemo(() => generateHeatmapGrid(studyLogs), [studyLogs]);

  // Data for Recharts Completed vs Remaining Donut Chart
  const pieData = useMemo(() => [
    { name: 'Completed Chapters', value: completedCount, color: '#10b981' },
    { name: 'Remaining Content', value: remainingCount, color: '#334155' }
  ], [completedCount, remainingCount]);

  // Data for Recharts Curriculum Domain Stacked Bar Chart
  const domainData = useMemo(() => {
    return CURRICULUM_DOMAINS.map(d => {
      const completedInDomain = d.chapterIds.filter(id =>
        completedChapters.includes(id)
      ).length;
      const remainingInDomain = d.totalChapters - completedInDomain;
      return {
        name: d.shortDomain,
        fullName: d.domain,
        Completed: completedInDomain,
        Remaining: remainingInDomain,
        total: d.totalChapters
      };
    });
  }, [completedChapters]);

  // Data for Recharts Daily / Weekly Study Hours Chart
  const trendData = useMemo(() => {
    const today = new Date();
    if (timeframeView === 'daily') {
      // Past 14 days
      const days = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'numeric',
          day: 'numeric'
        });
        days.push({
          label: dayLabel,
          date: dateStr,
          hours: studyLogs[dateStr] || 0,
          target: 2.0
        });
      }
      return days;
    } else {
      // Past 8 weeks
      return heatmapWeeks.slice(-8).map(w => ({
        label: w.weekLabel,
        hours: w.totalWeekHours,
        target: 14.0
      }));
    }
  }, [timeframeView, studyLogs, heatmapWeeks]);

  // Handler to log hours for today or selected date
  const handleAddHours = (hoursToAdd: number, targetDate?: string) => {
    const dateKey = targetDate || new Date().toISOString().split('T')[0];
    const current = studyLogs[dateKey] || 0;
    const updated = Math.round((current + hoursToAdd) * 10) / 10;

    const newLogs = { ...studyLogs, [dateKey]: updated };
    setStudyLogs(newLogs);
    saveStudyHoursToStorage(newLogs);

    setLogNotification(`Logged +${hoursToAdd}h for ${dateKey} (Total: ${updated}h)`);
    setTimeout(() => setLogNotification(null), LOG_NOTIFICATION_RESET_MS);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualHours);
    if (!isNaN(val) && val > 0 && manualDate) {
      handleAddHours(val, manualDate);
      setIsLogModalOpen(false);
    }
  };

  const handleResetLogs = () => {
    if (window.confirm('Reset study logs to initial simulation dataset?')) {
      localStorage.removeItem('python_csharp_study_hours');
      const reset = getInitialStudyLogs();
      setStudyLogs(reset);
      setLogNotification('Study logs reset to default trajectory');
      setTimeout(() => setLogNotification(null), RESET_NOTIFICATION_MS);
    }
  };

  return (
    <div id="progress-dashboard-section" className="space-y-8 animate-fadeIn">
      {/* Dashboard Top Action Strip & Quick Log Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold text-slate-300">
            Rapid Effort Logging (Today):
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="quick-log-30m-btn"
            onClick={() => handleAddHours(0.5)}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 hover:text-amber-400 transition-colors"
            title="Add 30 minutes study time for today"
          >
            <Plus className="h-3 w-3" />
            0.5h
          </button>
          <button
            id="quick-log-1h-btn"
            onClick={() => handleAddHours(1.0)}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 hover:text-amber-400 transition-colors"
            title="Add 1 hour study time for today"
          >
            <Plus className="h-3 w-3" />
            1.0h
          </button>
          <button
            id="quick-log-2h-btn"
            onClick={() => handleAddHours(2.0)}
            className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
            title="Add 2 hours study time for today"
          >
            <Plus className="h-3 w-3" />
            2.0h
          </button>
          <button
            id="open-log-modal-btn"
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10"
          >
            <Clock className="h-3.5 w-3.5" />
            Custom Session
          </button>
        </div>
      </div>

      {/* Floating notification for logged hours */}
      {logNotification && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{logNotification}</span>
        </div>
      )}

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Completion */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Syllabus Completion</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white font-mono">
              {completionPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({completedCount}/{totalChapters})
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-2 border border-slate-800">
            <div
              className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Total Hours */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Study Hours Logged</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
              {studyMetrics.totalHours}
            </span>
            <span className="text-xs text-slate-400">total hrs</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Across <strong className="text-slate-200">{studyMetrics.activeDays}</strong> active study days
          </p>
        </div>

        {/* Metric 3: Habit Streak */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Study Streak</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-rose-400 font-mono">
              {studyMetrics.currentStreak}
            </span>
            <span className="text-xs text-slate-400">days streak</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Consistent neural plasticity cadence
          </p>
        </div>

        {/* Metric 4: Daily Average */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Velocity</span>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-purple-400 font-mono">
              {studyMetrics.avgPerActiveDay}
            </span>
            <span className="text-xs text-slate-400">hrs / active day</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Target: 2.0h/day for senior architects
          </p>
        </div>
      </div>

      {/* RECHARTS ROW 1: Completed vs Remaining Content & Domain Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Completed vs Remaining Chapters */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                Completed Chapters vs. Remaining Content
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                {completionPercentage}% Complete
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Distribution of mastered chapters across the 13 core modules.
            </p>
          </div>

          {/* Recharts Pie Chart */}
          <div className="my-4 h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="#0f172a"
                  strokeWidth={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const pct = Math.round(((data.value as number) / totalChapters) * 100);
                      return (
                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-xl">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: data.payload.color }}
                            />
                            {data.name}
                          </div>
                          <div className="mt-1 text-sm font-mono font-extrabold text-amber-400">
                            {data.value} of {totalChapters} Chapters ({pct}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white font-mono">
                {completedCount}<span className="text-slate-500 text-lg">/{totalChapters}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Chapters Done
              </span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-500 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">Completed: </span>
                <span className="font-mono text-emerald-400 font-bold">{completedCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-slate-700 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">Remaining: </span>
                <span className="font-mono text-slate-400 font-bold">{remainingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked Bar Chart: Domain Mastery Breakdown */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-400" />
                Curriculum Progression by Architectural Domain
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                4 Core Engineering Pillars
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Stacked view comparing finished modules against remaining workload per specialty area.
            </p>
          </div>

          {/* Recharts Stacked Bar Chart */}
          <div className="my-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domainData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 'dataMax']}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-xl space-y-1">
                          <div className="text-xs font-bold text-white">{data.fullName}</div>
                          <div className="text-xs text-emerald-400 font-mono">
                            ✓ Completed: {data.Completed} / {data.total}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            ⏳ Remaining: {data.Remaining} / {data.total}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconType="circle"
                />
                <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Remaining" stackId="a" fill="#334155" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tip: Mark chapters complete in the syllabus below to dynamically advance domain bars.</span>
          </div>
        </div>
      </div>

      {/* HEATMAP OF STUDY HOURS LOGGED */}
      <div id="study-hours-heatmap-container" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Study Hours Heatmap Matrix (63-Day Rolling Window)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visual log of daily effort and transition consistency. Hover or tap any cell for timestamps and duration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Heatmap Legend */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span>Less</span>
              <div className="h-3 w-3 rounded-xs bg-slate-950 border border-slate-800" title="0 hours" />
              <div className="h-3 w-3 rounded-xs bg-amber-950/70 border border-amber-800/40" title="0.1 - 1.0 hr" />
              <div className="h-3 w-3 rounded-xs bg-amber-700/80" title="1.1 - 2.0 hrs" />
              <div className="h-3 w-3 rounded-xs bg-amber-500" title="2.1 - 3.5 hrs" />
              <div className="h-3 w-3 rounded-xs bg-amber-400 shadow-xs shadow-amber-400/50" title="3.5+ hrs" />
              <span>More</span>
            </div>

            <button
              onClick={handleResetLogs}
              title="Reset to default seeded study records"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Heatmap Grid Visualizer */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-160 space-y-2">
            {/* Month & Week column headers */}
            <div className="grid grid-cols-10 text-[10px] font-mono text-slate-400 pl-8">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="text-center font-semibold">
                  {week.weekLabel}
                </div>
              ))}
            </div>

            {/* Matrix rows: Days of the week (Mon to Sun) */}
            <div className="space-y-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, dIdx) => (
                <div key={dayName} className="flex items-center gap-2">
                  <span className="w-6 text-[10px] font-mono text-slate-400">
                    {dayName}
                  </span>
                  <div className="grid grid-cols-10 gap-1.5 flex-1">
                    {heatmapWeeks.map((week, wIdx) => {
                      const day = week.days[dIdx];
                      if (!day) return <div key={wIdx} className="h-6 rounded-md bg-transparent" />;

                      // Color based on level
                      let bgClass = 'bg-slate-950 border border-slate-800/80 text-slate-700';
                      if (day.level === 1) bgClass = 'bg-amber-950/70 border border-amber-800/50 text-amber-300';
                      if (day.level === 2) bgClass = 'bg-amber-700 text-slate-950 font-bold';
                      if (day.level === 3) bgClass = 'bg-amber-500 text-slate-950 font-black';
                      if (day.level === 4) bgClass = 'bg-amber-400 text-slate-950 font-black shadow-sm shadow-amber-400/40 ring-1 ring-amber-300/60';

                      if (day.isFuture) {
                        bgClass = 'bg-slate-950/30 border border-slate-900 opacity-30 cursor-not-allowed';
                      }

                      return (
                        <div
                          key={wIdx}
                          onMouseEnter={() => setHoveredDay(day)}
                          onClick={() => {
                            if (!day.isFuture) {
                              handleAddHours(1.0, day.date);
                            }
                          }}
                          className={`group relative h-8 rounded-md flex items-center justify-center text-[10px] font-mono transition-all cursor-pointer hover:scale-105 select-none ${bgClass} ${
                            day.isToday ? 'ring-2 ring-emerald-400' : ''
                          }`}
                        >
                          {day.hours > 0 ? `${day.hours}h` : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Tooltip Bar for Hovered Day */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
          {hoveredDay ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-amber-400 font-bold">
                {hoveredDay.dayName}, {hoveredDay.date}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-200">
                {hoveredDay.hours > 0 ? (
                  <strong>{hoveredDay.hours} hours logged</strong>
                ) : (
                  <span className="text-slate-500">No hours logged</span>
                )}
              </span>
              {hoveredDay.isToday && (
                <span className="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                  TODAY
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 italic">
              Hover over any square in the matrix to view the day's study tally or click to add +1 hour.
            </span>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Weekly Target: <strong>14.0 hrs</strong></span>
            <span>•</span>
            <span className="text-emerald-400">Streak: <strong>{studyMetrics.currentStreak} Days</strong></span>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID ROW 3: Velocity Trends & Syllabus Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Widget: Study Velocity Trends (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">
                    Study Velocity Trends (Recharts Telemetry)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Output against target ({timeframeView === 'daily' ? '2.0h / day' : '14.0h / week'}).
                </p>
              </div>

              <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1 self-start sm:self-auto">
                <button
                  id="view-daily-trend-btn"
                  onClick={() => setTimeframeView('daily')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    timeframeView === 'daily'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daily (14d)
                </button>
                <button
                  id="view-weekly-trend-btn"
                  onClick={() => setTimeframeView('weekly')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    timeframeView === 'weekly'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Weekly (8w)
                </button>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-72 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    unit="h"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-xl">
                            <div className="text-xs font-semibold text-slate-400">{data.label}</div>
                            <div className="mt-1 text-base font-mono font-extrabold text-amber-400">
                              {data.hours} hours logged
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Target: {data.target}h ({data.hours >= data.target ? '✓ Target Met' : 'Below Target'})
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={timeframeView === 'daily' ? 2.0 : 14.0}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: timeframeView === 'daily' ? 'Target: 2h/d' : 'Target: 14h/w',
                      fill: '#f59e0b',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    name="Study Hours"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  >
                    {trendData.map((entry, index) => (
                      <Cell
                        key={`bar-cell-${index}`}
                        fill={entry.hours >= entry.target ? '#10b981' : '#f59e0b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Widget: Interactive Syllabus Verification (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Syllabus Verification
                </h3>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                {completedCount}/{totalChapters} Done
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              Toggle modules to live-update the Recharts telemetry widgets.
            </p>

            {/* Scrollable module checklist */}
            <div className="max-h-71.25 overflow-y-auto pr-1 space-y-2">
              {(allSections.length > 0
                ? allSections
                : [
                    { id: 'fundamentals', name: '1. Fundamentals & Creator' },
                    { id: 'architecture', name: '2. Architecture Deep Dive' },
                    { id: 'deep-dives', name: '3. Core Deep Dives (10)' },
                    { id: 'libraries-batteries', name: '4. Libraries & Batteries' },
                    { id: 'comparison-matrix', name: '5. C# vs Python Matrix' },
                    { id: 'advanced-concepts', name: '6. Production Lectures' },
                    { id: 'use-cases', name: '7. Real-World Case Studies' },
                    { id: 'glossary', name: '8. Terminology Glossary' },
                    { id: 'aiml-context', name: '9. AI/ML Engineering Stack' },
                    { id: 'transition', name: '10. C# to Python Roadmap' },
                    { id: 'researchers', name: '11. Citations & Researchers' },
                    { id: 'future', name: '12. Future of Python' },
                    { id: 'career-compass', name: '13. Career Compass' },
                    { id: 'conclusion', name: '14. Synthesis & Certification' }
                  ]
              ).map(section => {
                const isCompleted = completedChapters.includes(section.id);
                return (
                  <button
                    key={section.id}
                    id={`toggle-chap-${section.id}`}
                    onClick={() => onToggleChapter?.(section.id)}
                    className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                      isCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800/80 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-medium truncate pr-2">{section.name}</span>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors shrink-0 ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isCompleted && <Check className="h-3 w-3 stroke-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Study Log Modal */}
      {isLogModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsLogModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Log Study Session"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Log Study Session</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="study-log-date" className="block text-xs font-semibold text-slate-300 mb-1">
                  Session Date
                </label>
                <input
                  id="study-log-date"
                  type="date"
                  value={manualDate}
                  onChange={e => setManualDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="study-log-hours" className="block text-xs font-semibold text-slate-300 mb-1">
                  Hours Spent (e.g. 1.5, 2.0, 3.5)
                </label>
                <input
                  id="study-log-hours"
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="12"
                  value={manualHours}
                  onChange={e => setManualHours(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  Save Study Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Study Hours and Progress Data Engine for C# -> Python Transition

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  hours: number;
  chapterId?: string;
  notes?: string;
}

export interface WeekHeatmapDay {
  date: string;
  dayName: string;
  dayIndex: number; // 0 = Mon, 6 = Sun
  hours: number;
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
  isFuture: boolean;
}

export interface WeekHeatmapColumn {
  weekLabel: string;
  weekIndex: number;
  days: WeekHeatmapDay[];
  totalWeekHours: number;
}

// Generate seeded historical study logs for the past 60 days if none exist in localStorage
export function getInitialStudyLogs(): Record<string, number> {
  const STORAGE_KEY = 'python_csharp_study_hours';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading study hours from localStorage:', e);
  }

  // Generate realistic seeded study hours for the past 60 days
  const seeded: Record<string, number> = {};
  const today = new Date();
  
  // Deterministic realistic pattern for an active C# architect transition
  // Typically 1.5 - 3.5 hrs on weekdays/weekends, some rest days
  const patterns = [
    2.5, 1.5, 3.0, 0.0, 2.0, 4.0, 2.5,
    1.0, 2.0, 2.5, 3.0, 0.0, 3.5, 2.0,
    0.0, 2.5, 3.0, 1.5, 2.0, 4.5, 1.5,
    2.0, 0.0, 2.5, 3.0, 2.0, 1.5, 3.0,
    2.5, 3.0, 0.0, 2.0, 2.5, 4.0, 1.0,
    0.0, 1.5, 2.5, 3.0, 2.0, 3.5, 2.5,
    2.0, 2.5, 0.0, 3.0, 2.0, 4.0, 1.5,
    2.5, 1.0, 3.0, 2.5, 0.0, 3.5, 2.0,
    2.0, 3.0, 2.5, 1.5
  ];

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const hours = patterns[59 - i] ?? (i % 7 === 0 ? 0 : 2.0);
    if (hours > 0) {
      seeded[dateStr] = hours;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch (e) {
    console.warn('Error saving seeded study hours to localStorage:', e);
  }

  return seeded;
}

export function saveStudyHoursToStorage(data: Record<string, number>): void {
  try {
    localStorage.setItem('python_csharp_study_hours', JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving study hours to localStorage:', e);
  }
}

// Helper to determine intensity level 0 to 4
export function getHourIntensityLevel(hours: number): 0 | 1 | 2 | 3 | 4 {
  if (!hours || hours <= 0) return 0;
  if (hours <= 1.0) return 1;
  if (hours <= 2.0) return 2;
  if (hours <= 3.5) return 3;
  return 4;
}

// Generate a grid of 9 weeks ending with the current week
export function generateHeatmapGrid(studyLogs: Record<string, number>): WeekHeatmapColumn[] {
  const weeks: WeekHeatmapColumn[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Align to current week's Sunday or Monday
  // Day of week: 0 = Sun, 1 = Mon, ... 6 = Sat
  const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon
  const daysFromMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Most recent Monday
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - daysFromMonday);
  currentMonday.setHours(0, 0, 0, 0);

  const NUM_WEEKS = 9;
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let w = NUM_WEEKS - 1; w >= 0; w--) {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(currentMonday.getDate() - w * 7);

    const days: WeekHeatmapDay[] = [];
    let totalWeekHours = 0;

    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + d);
      const dateStr = dayDate.toISOString().split('T')[0];
      const hours = studyLogs[dateStr] || 0;
      totalWeekHours += hours;

      const isToday = dateStr === todayStr;
      const isFuture = dayDate > today;

      days.push({
        date: dateStr,
        dayName: dayLabels[d],
        dayIndex: d,
        hours: isFuture ? 0 : hours,
        level: isFuture ? 0 : getHourIntensityLevel(hours),
        isToday,
        isFuture
      });
    }

    const monthLabel = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const dateNum = weekStart.getDate();
    const weekLabel = `${monthLabel} ${dateNum}`;

    weeks.push({
      weekLabel,
      weekIndex: NUM_WEEKS - 1 - w,
      days,
      totalWeekHours: Math.round(totalWeekHours * 10) / 10
    });
  }

  return weeks;
}

// Compute study metrics
export function computeStudyMetrics(studyLogs: Record<string, number>) {
  const dates = Object.keys(studyLogs).sort();
  let totalHours = 0;
  let activeDays = 0;

  dates.forEach(d => {
    const h = studyLogs[d] || 0;
    if (h > 0) {
      totalHours += h;
      activeDays += 1;
    }
  });

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  const checkDate = new Date(today);

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    const h = studyLogs[dStr] || 0;
    if (h > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today has 0 hours yet, check if yesterday had hours before breaking streak
      if (checkDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yStr = checkDate.toISOString().split('T')[0];
        if ((studyLogs[yStr] || 0) > 0) {
          continue;
        }
      }
      break;
    }
  }

  const avgPerActiveDay = activeDays > 0 ? (totalHours / activeDays).toFixed(1) : '0.0';

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    activeDays,
    currentStreak,
    avgPerActiveDay
  };
}

// Curriculum Chapters with Domain Grouping for Recharts Breakdown
export interface CurriculumDomainGroup {
  domain: string;
  shortDomain: string;
  totalChapters: number;
  chapterIds: string[];
}

export const CURRICULUM_DOMAINS: CurriculumDomainGroup[] = [
  {
    domain: 'Core Systems & Fundamentals',
    shortDomain: 'Foundations',
    totalChapters: 3,
    chapterIds: ['fundamentals', 'architecture', 'comparison-matrix']
  },
  {
    domain: 'Pythonic Mechanics & Deep Dives',
    shortDomain: 'Language Core',
    totalChapters: 2,
    chapterIds: ['deep-dives', 'glossary']
  },
  {
    domain: 'Enterprise Production & Architecture',
    shortDomain: 'Production',
    totalChapters: 3,
    chapterIds: ['advanced-concepts', 'use-cases', 'transition']
  },
  {
    domain: 'Frontier AI/ML, Future & Career',
    shortDomain: 'Frontier & Career',
    totalChapters: 5,
    chapterIds: ['aiml-context', 'researchers', 'future', 'career-compass', 'conclusion']
  }
];

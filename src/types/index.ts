type PageId =
  | 'overview'
  | 'home'
  | 'infographics'
  | 'challenges'
  | 'pedagogy-language'
  | 'pedagogy-art'
  | 'fundamentals'
  | 'architecture'
  | 'deep-dives'
  | 'libraries-batteries'
  | 'dsa-python'
  | 'workstation-setup'
  | 'comparison-matrix'
  | 'advanced-concepts'
  | 'web-app-project'
  | 'aiml-project'
  | 'fintech-domain'
  | 'fintech-project'
  | 'healthtech-domain'
  | 'healthtech-project'
  | 'stdlib-deep-dive'
  | 'web-frameworks'
  | 'testing-deployment'
  | 'python-internals'
  | 'use-cases'
  | 'glossary'
  | 'aiml-fundamentals'
  | 'aiml-context'
  | 'deep-learning'
  | 'transition'
  | 'researchers'
  | 'future'
  | 'career-compass'
  | 'conclusion';

export type NavSectionId = PageId;

export interface ComparisonItem {
  id: string;
  concept: string;
  category: 'syntax' | 'paradigm' | 'collections' | 'async' | 'memory' | 'typing';
  csharpCode: string;
  pythonCode: string;
  mentalShift: string;
  csharpPhilosophy: string;
  pythonPhilosophy: string;
  keyTakeaway: string;
}

export interface DeepDiveFeature {
  id: string;
  number: number;
  title: string;
  tagline: string;
  csharpEquivalent: string;
  whyItMatters: string;
  csharpApproach: string;
  pythonApproach: string;
  csharpCode: string;
  pythonCode: string;
  underTheHood: string;
  pitfalls: string[];
  bestPractices: string[];
}

export interface AdvancedConceptLecture {
  id: string;
  title: string;
  subtitle: string;
  industryRelevance: string;
  csharpCounterpart: string;
  modules: {
    heading: string;
    body: string;
    codeExample?: {
      language: 'python' | 'csharp' | 'both';
      python?: string;
      csharp?: string;
      caption?: string;
    };
    callout?: {
      type: 'tip' | 'warning' | 'insight';
      text: string;
    };
  }[];
}

export interface UseCaseStudy {
  id: string;
  companyOrDomain: string;
  title: string;
  scale: string;
  problemStatement: string;
  pythonSolution: string;
  architectureWorkflow: {
    step: number;
    title: string;
    description: string;
    tech: string;
  }[];
  csharpComparison: string;
  performanceMetrics: {
    label: string;
    value: string;
  }[];
  keyTakeaway: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'runtime' | 'idiom' | 'syntax' | 'typing' | 'concurrency' | 'tooling';
  pronunciation?: string;
  definition: string;
  csharpAnalogy: string;
  exampleSnippet?: string;
  officialRef?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venueOrSource: string;
  doiOrUrl?: string;
  category: 'language' | 'scientific' | 'performance' | 'typing' | 'ai';
  abstract: string;
  impactOnPython: string;
  relevanceForEngineers: string;
}

export interface AuthorizedFeedItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedDate: string;
  sha256Verification: string;
  category: 'pep' | 'security' | 'release' | 'governance';
  summary: string;
  impactLevel: 'Critical' | 'High' | 'Informational';
  status: 'synced' | 'pending';
}

export interface DailyChallenge {
  id: string;
  dayNumber: number;
  title: string;
  prompt: string;
  csharpCode: string;
  starterPython: string;
  solutionPython: string;
  explanation: string;
}

export type AppTheme = 'slate' | 'idle' | 'reading';

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ChallengeCategory =
  | 'fundamentals'
  | 'dsa'
  | 'oop'
  | 'error-handling'
  | 'files-modules'
  | 'testing'
  | 'apis'
  | 'real-world'
  | 'performance'
  | 'debugging'
  | 'refactoring'
  | 'concurrency';

export interface ChallengeTestCase {
  id: string;
  /** Shown to the learner up-front (not a hidden test) when isExample is true. */
  isExample?: boolean;
  description: string;
  /** A Python expression/statement that must not raise — e.g. "assert solve([1,2,3]) == 6". */
  assertionCode: string;
}

export interface ChallengeExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  tags: string[];
  learningObjective: string;
  problemStatement: string;
  inputDescription: string;
  outputDescription: string;
  constraints: string[];
  examples: ChallengeExample[];
  starterCode: string;
  /** Revealed one at a time, on request, before a submission. */
  hints: string[];
  testCases: ChallengeTestCase[];
  /** Shown only after the learner passes, or gives up and requests it. */
  referenceSolution: string;
  explanation: string;
  complexityAnalysis: string;
  relatedConcepts: string[];
  nextChallengeId?: string;
}

export interface ChallengeAttemptRecord {
  challengeId: string;
  attempts: number;
  completed: boolean;
  bestPassedCount: number;
  totalTestCount: number;
  hintsUsed: number;
  lastAttemptedAt: string;
  completedAt?: string;
}

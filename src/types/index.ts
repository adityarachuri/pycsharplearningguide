type PageId =
  | 'overview'
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
  | 'use-cases'
  | 'glossary'
  | 'aiml-context'
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

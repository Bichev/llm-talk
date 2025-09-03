export interface SessionAnalyticsData {
  sessionId: string;
  tokenMetrics: TokenMetrics;
  communicationEvolution: CommunicationEvolution;
  participantAnalysis: ParticipantAnalysis[];
  realTimeMetrics: RealTimeMetrics;
}

export interface TokenMetrics {
  totalTokens: number;
  averagePerMessage: number;
  efficiencyTrend: EfficiencyDataPoint[];
  providerComparison: ProviderComparisonData[];
  costAnalysis: CostAnalysis;
}

export interface EfficiencyDataPoint {
  iteration: number;
  tokensUsed: number;
  cumulativeEfficiency: number;
  participantId: string;
  timestamp: Date;
}

export interface ProviderComparisonData {
  provider: string;
  participantName: string;
  totalTokens: number;
  efficiency: number;
  averageResponseTime: number;
  messageCount: number;
  costEstimate: number;
}

export interface CostAnalysis {
  totalCostEstimate: number;
  costByProvider: Array<{
    provider: string;
    cost: number;
    percentage: number;
  }>;
  costTrend: Array<{
    iteration: number;
    cumulativeCost: number;
  }>;
}

export interface CommunicationEvolution {
  symbolsIntroduced: SymbolIntroduction[];
  patternChanges: PatternChange[];
  languageComplexity: LanguageComplexityData[];
  innovationMoments: InnovationMoment[];
}

export interface SymbolIntroduction {
  symbol: string;
  firstAppearance: number;
  frequency: number;
  context: string;
  participantId: string;
  adoptionRate: number;
}

export interface PatternChange {
  iteration: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  affectedParticipants: string[];
  confidenceScore: number;
}

export interface LanguageComplexityData {
  iteration: number;
  complexityScore: number;
  readabilityScore: number;
  vocabularyDiversity: number;
  sentenceLength: number;
}

export interface InnovationMoment {
  iteration: number;
  participantId: string;
  type: InnovationType;
  description: string;
  impactScore: number;
  adoptedByOthers: boolean;
}

export interface ParticipantAnalysis {
  participantId: string;
  name: string;
  provider: string;
  adaptationRate: number;
  innovationScore: number;
  collaborationEffectiveness: number;
  communicationStyle: string[];
  performanceMetrics: ParticipantPerformanceMetrics;
}

export interface ParticipantPerformanceMetrics {
  averageTokensPerMessage: number;
  responseTimeConsistency: number;
  efficiencyImprovement: number;
  errorRate: number;
  creativityScore: number;
  clarityScore: number;
}

export interface RealTimeMetrics {
  currentIteration: number;
  messagesPerMinute: number;
  activeParticipants: number;
  systemLoad: number;
  errorCount: number;
  lastUpdated: Date;
}

export type InnovationType = 
  | 'abbreviation'
  | 'symbol_system'
  | 'syntax_change'
  | 'concept_compression'
  | 'meta_communication'
  | 'efficiency_hack';

// Chart data types for visualization
export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface EfficiencyChartData {
  datasets: Array<{
    label: string;
    data: ChartDataPoint[];
    color: string;
    participantId: string;
  }>;
  xAxisLabel: string;
  yAxisLabel: string;
}

export interface TokenUsageChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

export interface CommunicationPatternData {
  nodes: Array<{
    id: string;
    label: string;
    size: number;
    color: string;
    type: 'participant' | 'pattern' | 'symbol';
  }>;
  edges: Array<{
    source: string;
    target: string;
    weight: number;
    type: 'introduces' | 'adopts' | 'modifies';
  }>;
}

// Analytics configuration
export interface AnalyticsConfig {
  updateInterval: number; // milliseconds
  retentionPeriod: number; // days
  enableRealTime: boolean;
  enablePatternDetection: boolean;
  complexityAnalysisDepth: 'basic' | 'advanced' | 'comprehensive';
  exportFormats: ('json' | 'csv' | 'xlsx')[];
}

// Snapshot types for periodic analytics storage
export interface AnalyticsSnapshot {
  id: string;
  sessionId: string;
  iteration: number;
  timestamp: Date;
  metrics: Partial<SessionAnalyticsData>;
  trends: TrendAnalysis;
  patterns: PatternAnalysis;
}

export interface TrendAnalysis {
  efficiencyTrend: 'improving' | 'declining' | 'stable';
  communicationComplexity: 'increasing' | 'decreasing' | 'stable';
  innovationRate: 'accelerating' | 'decelerating' | 'constant';
  collaborationQuality: 'improving' | 'declining' | 'stable';
}

export interface PatternAnalysis {
  detectedPatterns: string[];
  emergingTrends: string[];
  anomalies: string[];
  predictions: string[];
}

// Export types
export interface AnalyticsExport {
  sessionId: string;
  exportedAt: Date;
  format: 'json' | 'csv' | 'xlsx';
  data: SessionAnalyticsData;
  summary: AnalyticsExportSummary;
}

export interface AnalyticsExportSummary {
  totalMessages: number;
  totalTokens: number;
  sessionDuration: number;
  participantCount: number;
  efficiencyImprovement: number;
  keyInsights: string[];
  recommendationsForFutureExperiments: string[];
}

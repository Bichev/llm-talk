import type { LLMParticipant } from './llm';

export interface SessionConfig {
  topic: string;
  scenario: ConversationScenario;
  participants: LLMParticipant[];
  maxIterations: number;
  customPrompt?: string;
}

export interface SessionState {
  id: string;
  status: SessionStatus;
  config: SessionConfig;
  messages: ConversationMessage[];
  analytics: SessionAnalytics;
  currentIteration: number;
  participants: LLMParticipant[];
  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  participantId: string;
  timestamp: Date;
  iteration: number;
  speaker: string;
  originalPrompt?: string;
  evolvedMessage: string;
  translation?: string;
  tokenCount: TokenCount;
  processingTime?: number;
  evolutionMarkers?: EvolutionMarker[];
  efficiencyScore?: number;
}

export interface TokenCount {
  input: number;
  output: number;
  total: number;
}

export interface SessionAnalytics {
  totalTokens: number;
  averageTokensPerMessage: number;
  tokenEfficiencyTrend: number[];
  participantStats: ParticipantStats[];
  evolutionMarkers: EvolutionMarker[];
  efficiencyImprovement: number;
  communicationPatterns: CommunicationPattern[];
}

export interface ParticipantStats {
  participantId: string;
  name: string;
  provider: string;
  messageCount: number;
  totalTokens: number;
  averageTokens: number;
  averageResponseTime: number;
  efficiencyTrend: number[];
  innovationScore: number;
}

export interface EvolutionMarker {
  iteration: number;
  type: EvolutionMarkerType;
  description: string;
  participantId?: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface CommunicationPattern {
  type: string;
  description: string;
  frequency: number;
  firstAppearance: number;
  participants: string[];
}

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'stopped' | 'error';

export type ConversationScenario = 'protocol-evolution' | 'semantic-compression' | 'symbol-invention' | 'meta-communication';

export type EvolutionMarkerType = 
  | 'symbol_introduction'
  | 'pattern_change'
  | 'efficiency_improvement'
  | 'efficiency_decline'
  | 'communication_breakthrough'
  | 'error_correction'
  | 'adaptation'
  | 'protocol_innovation'
  | 'compression_achievement'
  | 'meta_evolution';

// API Request/Response types
export interface StartSessionRequest {
  topic: string;
  scenario: ConversationScenario;
  participants: LLMParticipant[];
  maxIterations: number;
  customPrompt?: string;
}

export interface StartSessionResponse {
  sessionId: string;
  status: SessionStatus;
  config: SessionConfig;
  participants: LLMParticipant[];
  estimatedCost: number;
}

export interface SendMessageRequest {
  sessionId: string;
  currentSpeaker?: string;
  contextLimit?: number;
}

export interface SendMessageResponse {
  message: ConversationMessage;
  sessionStatus: {
    currentIteration: number;
    totalIterations: number;
    isComplete: boolean;
    totalTokens: number;
  };
  nextSpeaker?: string;
}

export interface SessionStatusResponse {
  session: {
    id: string;
    status: SessionStatus;
    config: SessionConfig;
    currentIteration: number;
    totalMessages: number;
    startedAt: string;
    lastActivity: string;
  };
  analytics: SessionAnalytics;
  recentMessages: ConversationMessage[];
}

export interface StopSessionRequest {
  sessionId: string;
  reason?: 'manual' | 'completed' | 'error' | 'timeout';
}

export interface StopSessionResponse {
  sessionId: string;
  summary: SessionSummary;
  exportUrl?: string;
}

export interface SessionSummary {
  totalIterations: number;
  duration: number;
  totalTokens: number;
  efficiencyImprovement: number;
  evolutionHighlights: string[];
  participantPerformance: Array<{
    name: string;
    efficiency: number;
    innovations: string[];
  }>;
}

// Database types (matching Supabase schema)
export interface DatabaseSession {
  id: string;
  created_at: string;
  updated_at: string;
  status: SessionStatus;
  config: Record<string, any>;
  topic: string;
  scenario: ConversationScenario;
  max_iterations: number;
  current_iteration: number;
  total_messages: number;
  started_at: string;
  completed_at?: string;
  total_tokens: number;
  efficiency_score?: number;
  user_ip?: string;
  user_agent?: string;
}

export interface DatabaseParticipant {
  id: string;
  session_id: string;
  name: string;
  provider: string;
  model: string;
  temperature: number;
  config?: Record<string, any>;
  total_messages: number;
  total_tokens: number;
  average_response_time?: number;
  efficiency_trend?: number[];
  created_at: string;
}

export interface DatabaseMessage {
  id: string;
  session_id: string;
  participant_id: string;
  iteration: number;
  original_prompt?: string;
  evolved_message: string;
  translation?: string;
  token_count: Record<string, any>;
  processing_time?: number;
  timestamp: string;
  evolution_markers?: string[];
  efficiency_score?: number;
}

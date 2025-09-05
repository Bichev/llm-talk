export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          status: 'running' | 'completed' | 'stopped' | 'error'
          config: Json
          topic: string
          scenario: 'protocol-evolution' | 'semantic-compression' | 'symbol-invention' | 'meta-communication' | 'iterative-optimization'
          max_iterations: number
          current_iteration: number
          total_messages: number
          started_at: string
          completed_at: string | null
          total_tokens: number
          efficiency_score: number | null
          avg_response_time: number | null
          user_ip: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          status?: 'running' | 'completed' | 'stopped' | 'error'
          config: Json
          topic: string
          scenario: 'protocol-evolution' | 'semantic-compression' | 'symbol-invention' | 'meta-communication' | 'iterative-optimization'
          max_iterations: number
          current_iteration?: number
          total_messages?: number
          started_at?: string
          completed_at?: string | null
          total_tokens?: number
          efficiency_score?: number | null
          avg_response_time?: number | null
          user_ip?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          status?: 'running' | 'completed' | 'stopped' | 'error'
          config?: Json
          topic?: string
          scenario?: 'protocol-evolution' | 'semantic-compression' | 'symbol-invention' | 'meta-communication'
          max_iterations?: number
          current_iteration?: number
          total_messages?: number
          started_at?: string
          completed_at?: string | null
          total_tokens?: number
          efficiency_score?: number | null
          avg_response_time?: number | null
          user_ip?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          id: string
          session_id: string
          name: string
          provider: 'openai' | 'claude' | 'gemini' | 'perplexity'
          model: string
          temperature: number
          config: Json | null
          total_messages: number
          total_tokens: number
          average_response_time: number | null
          efficiency_trend: number[] | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          name: string
          provider: 'openai' | 'claude' | 'gemini' | 'perplexity'
          model: string
          temperature: number
          config?: Json | null
          total_messages?: number
          total_tokens?: number
          average_response_time?: number | null
          efficiency_trend?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          name?: string
          provider?: 'openai' | 'claude' | 'gemini' | 'perplexity'
          model?: string
          temperature?: number
          config?: Json | null
          total_messages?: number
          total_tokens?: number
          average_response_time?: number | null
          efficiency_trend?: number[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          session_id: string
          participant_id: string
          iteration: number
          original_prompt: string | null
          evolved_message: string
          translation: string | null
          token_count: Json
          processing_time: number | null
          timestamp: string
          evolution_markers: string[] | null
          efficiency_score: number | null
        }
        Insert: {
          id?: string
          session_id: string
          participant_id: string
          iteration: number
          original_prompt?: string | null
          evolved_message: string
          translation?: string | null
          token_count: Json
          processing_time?: number | null
          timestamp?: string
          evolution_markers?: string[] | null
          efficiency_score?: number | null
        }
        Update: {
          id?: string
          session_id?: string
          participant_id?: string
          iteration?: number
          original_prompt?: string | null
          evolved_message?: string
          translation?: string | null
          token_count?: Json
          processing_time?: number | null
          timestamp?: string
          evolution_markers?: string[] | null
          efficiency_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_participant_id_fkey"
            columns: ["participant_id"]
            referencedRelation: "participants"
            referencedColumns: ["id"]
          }
        ]
      }
      analytics_snapshots: {
        Row: {
          id: string
          session_id: string
          iteration: number
          metrics: Json
          trends: Json
          patterns: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          iteration: number
          metrics?: Json
          trends?: Json
          patterns?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          iteration?: number
          metrics?: Json
          trends?: Json
          patterns?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_snapshots_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_message_with_stats: {
        Args: {
          p_session_id: string
          p_participant_id: string
          p_iteration: number
          p_original_prompt?: string
          p_evolved_message: string
          p_translation?: string
          p_token_count: Json
          p_processing_time?: number
          p_evolution_markers?: string[]
        }
        Returns: string
      }
      complete_session: {
        Args: {
          p_session_id: string
          p_status?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for better type inference
export type SessionStatus = Database['public']['Tables']['sessions']['Row']['status'];
export type ConversationScenario = Database['public']['Tables']['sessions']['Row']['scenario'];
export type LLMProvider = Database['public']['Tables']['participants']['Row']['provider'];

// Utility types for working with database operations
export type DatabaseSession = Database['public']['Tables']['sessions']['Row'];
export type DatabaseParticipant = Database['public']['Tables']['participants']['Row'];
export type DatabaseMessage = Database['public']['Tables']['messages']['Row'];
export type DatabaseAnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Row'];

export type InsertSession = Database['public']['Tables']['sessions']['Insert'];
export type InsertParticipant = Database['public']['Tables']['participants']['Insert'];
export type InsertMessage = Database['public']['Tables']['messages']['Insert'];
export type InsertAnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Insert'];

export type UpdateSession = Database['public']['Tables']['sessions']['Update'];
export type UpdateParticipant = Database['public']['Tables']['participants']['Update'];
export type UpdateMessage = Database['public']['Tables']['messages']['Update'];
export type UpdateAnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Update'];

// Function return types
export type AddMessageWithStatsResult = Database['public']['Functions']['add_message_with_stats']['Returns'];
export type CompleteSessionResult = Database['public']['Functions']['complete_session']['Returns'];

// Token count structure (for JSON fields)
export interface TokenCountData {
  input: number;
  output: number;
  total: number;
}

// Session config structure (for JSON fields)
export interface SessionConfigData {
  participants: Array<{
    name: string;
    provider: LLMProvider;
    model: string;
    temperature: number;
    config?: Record<string, any>;
  }>;
  customPrompt?: string;
  estimatedCost?: number;
  [key: string]: any;
}

// Analytics data structures (for JSON fields)
export interface AnalyticsMetricsData {
  totalTokens: number;
  averageTokensPerMessage: number;
  efficiencyTrend: number[];
  participantStats: Array<{
    participantId: string;
    messageCount: number;
    totalTokens: number;
    averageTokens: number;
    efficiency: number;
  }>;
  [key: string]: any;
}

export interface AnalyticsTrendsData {
  efficiencyImprovement: number;
  communicationComplexity: number;
  innovationRate: number;
  collaborationQuality: number;
  [key: string]: any;
}

export interface AnalyticsPatternsData {
  symbolsIntroduced: Array<{
    symbol: string;
    firstAppearance: number;
    frequency: number;
    participantId: string;
  }>;
  patternChanges: Array<{
    iteration: number;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
  [key: string]: any;
}

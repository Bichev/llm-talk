import { supabase, supabaseAdmin, handleSupabaseError } from '@/lib/supabase';
import type {
  DatabaseSession,
  DatabaseParticipant,
  DatabaseMessage,
  DatabaseAnalyticsSnapshot,
  InsertSession,
  InsertParticipant,
  InsertAnalyticsSnapshot,
  UpdateSession,
  UpdateParticipant,
  TokenCountData,
  AnalyticsMetricsData
} from '@/types/database';

// Session Operations
export async function createSession(
  sessionConfig: InsertSession
): Promise<DatabaseSession> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert(sessionConfig)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'createSession');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'createSession');
  }
}

export async function getSession(sessionId: string): Promise<DatabaseSession | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      handleSupabaseError(error, 'getSession');
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

export async function updateSession(
  sessionId: string,
  updates: UpdateSession
): Promise<DatabaseSession> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'updateSession');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'updateSession');
  }
}

export async function completeSession(
  sessionId: string,
  status: 'completed' | 'stopped' | 'error' = 'completed'
): Promise<any> {
  try {
    // Use the stored function for atomic completion
    const { data, error } = await supabase.rpc('complete_session', {
      p_session_id: sessionId,
      p_status: status
    });

    if (error) {
      handleSupabaseError(error, 'completeSession');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'completeSession');
  }
}

// Participant Operations
export async function createParticipants(
  participants: InsertParticipant[]
): Promise<DatabaseParticipant[]> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .insert(participants)
      .select();

    if (error) {
      handleSupabaseError(error, 'createParticipants');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'createParticipants');
  }
}

export async function getParticipants(sessionId: string): Promise<DatabaseParticipant[]> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at');

    if (error) {
      handleSupabaseError(error, 'getParticipants');
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
}

export async function updateParticipant(
  participantId: string,
  updates: UpdateParticipant
): Promise<DatabaseParticipant> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .update(updates)
      .eq('id', participantId)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'updateParticipant');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'updateParticipant');
  }
}

// Message Operations
export async function addMessage(
  sessionId: string,
  participantId: string,
  iteration: number,
  evolvedMessage: string,
  tokenCount: TokenCountData,
  originalPrompt?: string,
  translation?: string,
  processingTime?: number,
  evolutionMarkers?: string[]
): Promise<string> {
  try {
    // Use the stored function for atomic message addition with stats update
    const { data, error } = await supabase.rpc('add_message_with_stats', {
      p_session_id: sessionId,
      p_participant_id: participantId,
      p_iteration: iteration,
      p_original_prompt: originalPrompt || undefined,
      p_evolved_message: evolvedMessage,
      p_translation: translation || undefined,
      p_token_count: tokenCount as any,
      p_processing_time: processingTime || undefined,
      p_evolution_markers: evolutionMarkers || []
    });

    if (error) {
      handleSupabaseError(error, 'addMessage');
    }

    return data; // Returns the message ID
  } catch (error) {
    handleSupabaseError(error, 'addMessage');
  }
}

export async function getMessages(
  sessionId: string,
  limit?: number
): Promise<DatabaseMessage[]> {
  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        participants!inner(name, provider, model)
      `)
      .eq('session_id', sessionId)
      .order('iteration', { ascending: true })
      .order('timestamp', { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      handleSupabaseError(error, 'getMessages');
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function getRecentMessages(
  sessionId: string,
  count: number = 10
): Promise<DatabaseMessage[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        participants!inner(name, provider, model)
      `)
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
      .limit(count);

    if (error) {
      handleSupabaseError(error, 'getRecentMessages');
    }

    return (data || []).reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    return [];
  }
}

// Analytics Operations
export async function createAnalyticsSnapshot(
  snapshot: InsertAnalyticsSnapshot
): Promise<DatabaseAnalyticsSnapshot> {
  try {
    const { data, error } = await supabase
      .from('analytics_snapshots')
      .insert(snapshot)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'createAnalyticsSnapshot');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'createAnalyticsSnapshot');
  }
}

export async function getAnalyticsSnapshots(
  sessionId: string
): Promise<DatabaseAnalyticsSnapshot[]> {
  try {
    const { data, error } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('iteration');

    if (error) {
      handleSupabaseError(error, 'getAnalyticsSnapshots');
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching analytics snapshots:', error);
    return [];
  }
}

// Complex Queries and Aggregations
export async function getSessionWithDetails(
  sessionId: string
): Promise<{
  session: DatabaseSession | null;
  participants: DatabaseParticipant[];
  messages: DatabaseMessage[];
  analytics: DatabaseAnalyticsSnapshot[];
}> {
  try {
    const [session, participants, messages, analytics] = await Promise.all([
      getSession(sessionId),
      getParticipants(sessionId),
      getMessages(sessionId),
      getAnalyticsSnapshots(sessionId)
    ]);

    return {
      session,
      participants,
      messages,
      analytics
    };
  } catch (error) {
    console.error('Error fetching session with details:', error);
    return {
      session: null,
      participants: [],
      messages: [],
      analytics: []
    };
  }
}

export async function getSessionAnalytics(
  sessionId: string
): Promise<AnalyticsMetricsData | null> {
  try {
    // Get session with participants and messages for analytics calculation
    const { session, participants, messages } = await getSessionWithDetails(sessionId);
    
    if (!session || participants.length === 0) {
      return null;
    }

    // Calculate analytics
    const totalTokens = messages.reduce((sum, msg) => {
      const tokenCount = msg.token_count as unknown as TokenCountData;
      return sum + (tokenCount.total || 0);
    }, 0);

    const averageTokensPerMessage = messages.length > 0 ? totalTokens / messages.length : 0;

    const participantStats = participants.map(participant => {
      const participantMessages = messages.filter(msg => msg.participant_id === participant.id);
      const participantTokens = participantMessages.reduce((sum, msg) => {
        const tokenCount = msg.token_count as unknown as TokenCountData;
        return sum + (tokenCount.total || 0);
      }, 0);

      return {
        participantId: participant.id,
        messageCount: participantMessages.length,
        totalTokens: participantTokens,
        averageTokens: participantMessages.length > 0 ? participantTokens / participantMessages.length : 0,
        efficiency: calculateEfficiencyScore(participantMessages)
      };
    });

    const efficiencyTrend = calculateEfficiencyTrend(messages);

    return {
      totalTokens,
      averageTokensPerMessage,
      efficiencyTrend,
      participantStats
    };
  } catch (error) {
    console.error('Error calculating session analytics:', error);
    return null;
  }
}

// Utility functions
function calculateEfficiencyScore(messages: DatabaseMessage[]): number {
  if (messages.length < 2) return 0;

  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];
  
  const firstTokens = (firstMessage.token_count as unknown as TokenCountData).total || 0;
  const lastTokens = (lastMessage.token_count as unknown as TokenCountData).total || 0;

  if (firstTokens === 0) return 0;

  return ((firstTokens - lastTokens) / firstTokens) * 100;
}

function calculateEfficiencyTrend(messages: DatabaseMessage[]): number[] {
  if (messages.length === 0) return [];

  const trend: number[] = [];
  let cumulativeTokens = 0;
  let messageCount = 0;

  for (const message of messages) {
    const tokenCount = (message.token_count as unknown as TokenCountData).total || 0;
    cumulativeTokens += tokenCount;
    messageCount++;
    
    const averageTokens = cumulativeTokens / messageCount;
    trend.push(averageTokens);
  }

  return trend;
}

// Cleanup operations (for maintenance)
export async function deleteOldSessions(daysOld: number = 30): Promise<number> {
  if (!supabaseAdmin) {
    throw new Error('Admin client required for cleanup operations');
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('status', 'completed')
      .lt('completed_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      handleSupabaseError(error, 'deleteOldSessions');
    }

    return data?.length || 0;
  } catch (error) {
    handleSupabaseError(error, 'deleteOldSessions');
  }
}

// Health check
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  totalSessions: number;
  activeSessions: number;
  totalMessages: number;
}> {
  try {
    const [sessionsResult, activeSessionsResult, messagesResult] = await Promise.all([
      supabase.from('sessions').select('id', { count: 'exact', head: true }),
      supabase.from('sessions').select('id', { count: 'exact', head: true }).eq('status', 'running'),
      supabase.from('messages').select('id', { count: 'exact', head: true })
    ]);

    return {
      connected: true,
      totalSessions: sessionsResult.count || 0,
      activeSessions: activeSessionsResult.count || 0,
      totalMessages: messagesResult.count || 0
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      connected: false,
      totalSessions: 0,
      activeSessions: 0,
      totalMessages: 0
    };
  }
}

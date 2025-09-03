import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Client for browser/public operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We don't need user sessions for this app
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Limit real-time events for performance
    },
  },
});

// Admin client for server-side operations (only available on server)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Type-safe database operations
export type Tables = Database['public']['Tables'];
export type SessionRow = Tables['sessions']['Row'];
export type SessionInsert = Tables['sessions']['Insert'];
export type SessionUpdate = Tables['sessions']['Update'];

export type ParticipantRow = Tables['participants']['Row'];
export type ParticipantInsert = Tables['participants']['Insert'];
export type ParticipantUpdate = Tables['participants']['Update'];

export type MessageRow = Tables['messages']['Row'];
export type MessageInsert = Tables['messages']['Insert'];
export type MessageUpdate = Tables['messages']['Update'];

export type AnalyticsSnapshotRow = Tables['analytics_snapshots']['Row'];
export type AnalyticsSnapshotInsert = Tables['analytics_snapshots']['Insert'];
export type AnalyticsSnapshotUpdate = Tables['analytics_snapshots']['Update'];

// Utility function to handle Supabase errors
export function handleSupabaseError(error: any, context: string): never {
  console.error(`Supabase error in ${context}:`, error);
  
  if (error?.code === 'PGRST116') {
    throw new Error(`No data found for ${context}`);
  }
  
  if (error?.code === '23505') {
    throw new Error(`Duplicate entry in ${context}`);
  }
  
  if (error?.code === '23503') {
    throw new Error(`Referenced record not found in ${context}`);
  }
  
  throw new Error(`Database error in ${context}: ${error?.message || 'Unknown error'}`);
}

// Connection testing utility
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sessions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

// Real-time subscription helpers
export function subscribeToSession(
  sessionId: string,
  onUpdate: (payload: any) => void
) {
  return supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `id=eq.${sessionId}`,
      },
      onUpdate
    )
    .subscribe();
}

export function subscribeToMessages(
  sessionId: string,
  onInsert: (payload: any) => void
) {
  return supabase
    .channel(`messages:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${sessionId}`,
      },
      onInsert
    )
    .subscribe();
}

export function subscribeToParticipants(
  sessionId: string,
  onUpdate: (payload: any) => void
) {
  return supabase
    .channel(`participants:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `session_id=eq.${sessionId}`,
      },
      onUpdate
    )
    .subscribe();
}

// Batch operations helper
export async function executeInTransaction<T>(
  operations: Array<() => Promise<T>>
): Promise<T[]> {
  // Note: Supabase doesn't support transactions directly from the client
  // This is a simple sequential execution with error handling
  const results: T[] = [];
  
  try {
    for (const operation of operations) {
      const result = await operation();
      results.push(result);
    }
    return results;
  } catch (error) {
    // In a real transaction, we would rollback here
    // For now, we just throw the error
    throw error;
  }
}

// Environment validation
export function validateSupabaseConfig(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missing.join(', ')}`
    );
  }
  
  // Validate URL format
  try {
    new URL(supabaseUrl!);
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not a valid URL');
  }
}

// Initialize validation
if (typeof window !== 'undefined') {
  // Only validate in browser environment
  try {
    validateSupabaseConfig();
  } catch (error) {
    console.error('Supabase configuration error:', error);
  }
}

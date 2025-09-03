import { supabase } from '@/lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Real-time subscription manager for LLM-Talk
 * Handles Supabase real-time subscriptions with proper cleanup and error handling
 */

export interface RealtimeSubscriptionOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export interface MessageSubscriptionCallbacks {
  onInsert?: (message: any) => void;
  onUpdate?: (message: any) => void;
  onDelete?: (message: any) => void;
}

export interface SessionSubscriptionCallbacks {
  onUpdate?: (session: any) => void;
}

export interface ParticipantSubscriptionCallbacks {
  onUpdate?: (participant: any) => void;
}

/**
 * Manages real-time subscriptions for a session
 */
export class RealtimeSubscriptionManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private isConnected = false;
  private options: RealtimeSubscriptionOptions;

  constructor(options: RealtimeSubscriptionOptions = {}) {
    this.options = options;
    this.setupConnectionHandlers();
  }

  /**
   * Subscribe to messages for a specific session
   */
  subscribeToMessages(
    sessionId: string, 
    callbacks: MessageSubscriptionCallbacks
  ): () => void {
    const channelName = `messages:${sessionId}`;
    
    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to messages for session ${sessionId}`);
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Message inserted:', payload);
          callbacks.onInsert?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Message updated:', payload);
          callbacks.onUpdate?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Message deleted:', payload);
          callbacks.onDelete?.(payload.old);
        }
      );

    this.channels.set(channelName, channel);
    this.subscribeChannel(channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to session updates
   */
  subscribeToSession(
    sessionId: string,
    callbacks: SessionSubscriptionCallbacks
  ): () => void {
    const channelName = `session:${sessionId}`;
    
    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to session ${sessionId}`);
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Session updated:', payload);
          callbacks.onUpdate?.(payload.new);
        }
      );

    this.channels.set(channelName, channel);
    this.subscribeChannel(channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to participant updates
   */
  subscribeToParticipants(
    sessionId: string,
    callbacks: ParticipantSubscriptionCallbacks
  ): () => void {
    const channelName = `participants:${sessionId}`;
    
    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to participants for session ${sessionId}`);
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participants',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Participant updated:', payload);
          callbacks.onUpdate?.(payload.new);
        }
      );

    this.channels.set(channelName, channel);
    this.subscribeChannel(channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to analytics snapshots
   */
  subscribeToAnalytics(
    sessionId: string,
    onUpdate: (analytics: any) => void
  ): () => void {
    const channelName = `analytics:${sessionId}`;
    
    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to analytics for session ${sessionId}`);
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_snapshots',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Analytics snapshot created:', payload);
          onUpdate(payload.new);
        }
      );

    this.channels.set(channelName, channel);
    this.subscribeChannel(channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to all session-related changes
   */
  subscribeToSessionAll(
    sessionId: string,
    callbacks: {
      onMessageInsert?: (message: any) => void;
      onSessionUpdate?: (session: any) => void;
      onParticipantUpdate?: (participant: any) => void;
      onAnalyticsUpdate?: (analytics: any) => void;
    }
  ): () => void {
    const unsubscribeFunctions: (() => void)[] = [];

    // Subscribe to messages
    if (callbacks.onMessageInsert) {
      const unsubMessages = this.subscribeToMessages(sessionId, {
        onInsert: callbacks.onMessageInsert
      });
      unsubscribeFunctions.push(unsubMessages);
    }

    // Subscribe to session updates
    if (callbacks.onSessionUpdate) {
      const unsubSession = this.subscribeToSession(sessionId, {
        onUpdate: callbacks.onSessionUpdate
      });
      unsubscribeFunctions.push(unsubSession);
    }

    // Subscribe to participant updates
    if (callbacks.onParticipantUpdate) {
      const unsubParticipants = this.subscribeToParticipants(sessionId, {
        onUpdate: callbacks.onParticipantUpdate
      });
      unsubscribeFunctions.push(unsubParticipants);
    }

    // Subscribe to analytics updates
    if (callbacks.onAnalyticsUpdate) {
      const unsubAnalytics = this.subscribeToAnalytics(sessionId, callbacks.onAnalyticsUpdate);
      unsubscribeFunctions.push(unsubAnalytics);
    }

    // Return combined unsubscribe function
    return () => {
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    for (const [channelName, channel] of this.channels) {
      supabase.removeChannel(channel);
      console.log(`Unsubscribed from ${channelName}`);
    }
    this.channels.clear();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get active channel count
   */
  getActiveChannelCount(): number {
    return this.channels.size;
  }

  /**
   * Get active channel names
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * Private helper methods
   */

  private setupConnectionHandlers(): void {
    // Monitor Supabase connection status
    // Note: Supabase doesn't expose connection events directly,
    // so we'll implement basic monitoring
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Network online - reconnecting subscriptions');
        this.handleReconnection();
      });

      window.addEventListener('offline', () => {
        console.log('Network offline - pausing subscriptions');
        this.handleDisconnection();
      });
    }
  }

  private async subscribeChannel(channel: RealtimeChannel): Promise<void> {
    try {
      const response = await channel.subscribe((status) => {
        console.log(`Channel subscription status: ${status}`);
        
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.options.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          this.isConnected = false;
          this.options.onError?.(new Error('Channel subscription error'));
        } else if (status === 'TIMED_OUT') {
          this.isConnected = false;
          this.options.onError?.(new Error('Channel subscription timed out'));
        } else if (status === 'CLOSED') {
          this.isConnected = false;
          this.options.onDisconnect?.();
        }
      });

      // Note: Supabase subscription response handling
      // The response type is not consistently documented
      console.log('Channel subscription response:', response);
    } catch (error) {
      console.error('Channel subscription error:', error);
      this.options.onError?.(error);
    }
  }

  private handleReconnection(): void {
    // Attempt to reestablish subscriptions after connection loss
    this.isConnected = true;
    this.options.onConnect?.();
  }

  private handleDisconnection(): void {
    this.isConnected = false;
    this.options.onDisconnect?.();
  }
}

/**
 * Global subscription manager instance
 */
let globalSubscriptionManager: RealtimeSubscriptionManager | null = null;

/**
 * Get or create global subscription manager
 */
export function getSubscriptionManager(options?: RealtimeSubscriptionOptions): RealtimeSubscriptionManager {
  if (!globalSubscriptionManager) {
    globalSubscriptionManager = new RealtimeSubscriptionManager(options);
  }
  return globalSubscriptionManager;
}

/**
 * Cleanup global subscription manager
 */
export function cleanupSubscriptionManager(): void {
  if (globalSubscriptionManager) {
    globalSubscriptionManager.unsubscribeAll();
    globalSubscriptionManager = null;
  }
}

/**
 * Hook-like utility for React components (though this is not a hook)
 */
export function createSessionSubscriptions(
  sessionId: string,
  callbacks: {
    onMessageInsert?: (message: any) => void;
    onSessionUpdate?: (session: any) => void;
    onParticipantUpdate?: (participant: any) => void;
    onAnalyticsUpdate?: (analytics: any) => void;
  }
): () => void {
  const manager = getSubscriptionManager();
  return manager.subscribeToSessionAll(sessionId, callbacks);
}

'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { SessionManager } from '@/lib/session-manager';
import { subscribeToSession, subscribeToMessages } from '@/lib/supabase';
import type { 
  SessionState, 
  SessionStatus, 
  StartSessionRequest, 
  SendMessageRequest,
  ConversationMessage 
} from '@/types/session';

// Context Types
export interface SessionContextValue {
  // State
  session: SessionState | null;
  status: SessionStatus;
  isProcessing: boolean;
  error: string | null;
  
  // Actions
  startSession: (request: StartSessionRequest) => Promise<void>;
  sendMessage: (request?: Partial<SendMessageRequest>) => Promise<void>;
  stopSession: (reason?: 'manual' | 'completed' | 'error' | 'timeout') => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
  
  // Utilities
  canSendMessage: boolean;
  nextSpeaker: string | null;
  progressPercentage: number;
}

// Action Types
type SessionAction = 
  | { type: 'SET_SESSION'; payload: SessionState | null }
  | { type: 'SET_STATUS'; payload: SessionStatus }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: ConversationMessage }
  | { type: 'UPDATE_SESSION'; payload: Partial<SessionState> }
  | { type: 'CLEAR_ERROR' };

// Reducer State
interface SessionReducerState {
  session: SessionState | null;
  status: SessionStatus;
  isProcessing: boolean;
  error: string | null;
}

// Initial State
const initialState: SessionReducerState = {
  session: null,
  status: 'idle',
  isProcessing: false,
  error: null
};

// Reducer
function sessionReducer(state: SessionReducerState, action: SessionAction): SessionReducerState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
        status: action.payload?.status || 'idle'
      };
      
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
        session: state.session ? { ...state.session, status: action.payload } : null
      };
      
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isProcessing: false
      };
      
    case 'ADD_MESSAGE':
      if (!state.session) return state;
      
      return {
        ...state,
        session: {
          ...state.session,
          messages: [...state.session.messages, action.payload],
          currentIteration: action.payload.iteration,
          updatedAt: new Date(),
          analytics: {
            ...state.session.analytics,
            totalTokens: state.session.analytics.totalTokens + action.payload.tokenCount.total,
            averageTokensPerMessage: 
              (state.session.analytics.totalTokens + action.payload.tokenCount.total) / 
              (state.session.messages.length + 1)
          }
        }
      };
      
    case 'UPDATE_SESSION':
      if (!state.session) return state;
      
      return {
        ...state,
        session: {
          ...state.session,
          ...action.payload
        }
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
}

// Create Context
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

// Provider Component
interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const sessionManagerRef = useRef<SessionManager | null>(null);
  const subscriptionsRef = useRef<any[]>([]);

  // Initialize session manager
  useEffect(() => {
    sessionManagerRef.current = new SessionManager();
  }, []);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach(subscription => {
        subscription?.unsubscribe?.();
      });
    };
  }, []);

  // Setup real-time subscriptions when session starts
  const setupRealtimeSubscriptions = useCallback((sessionId: string) => {
    // Clean up existing subscriptions
    subscriptionsRef.current.forEach(sub => sub?.unsubscribe?.());
    subscriptionsRef.current = [];

    // Subscribe to session updates
    const sessionSub = subscribeToSession(sessionId, (payload) => {
      console.log('Session update received:', payload);
      if (payload.eventType === 'UPDATE') {
        dispatch({
          type: 'UPDATE_SESSION',
          payload: { status: payload.new.status }
        });
      }
    });

    // Subscribe to new messages
    const messagesSub = subscribeToMessages(sessionId, (payload) => {
      console.log('New message received:', payload);
      if (payload.eventType === 'INSERT' && payload.new) {
        const message: ConversationMessage = {
          id: payload.new.id,
          sessionId: payload.new.session_id,
          participantId: payload.new.participant_id,
          timestamp: new Date(payload.new.timestamp),
          iteration: payload.new.iteration,
          speaker: 'Unknown', // Will be resolved from participant data
          originalPrompt: payload.new.original_prompt,
          evolvedMessage: payload.new.evolved_message,
          translation: payload.new.translation,
          tokenCount: payload.new.token_count as any,
          processingTime: payload.new.processing_time,
          evolutionMarkers: payload.new.evolution_markers,
          efficiencyScore: payload.new.efficiency_score
        };

        dispatch({ type: 'ADD_MESSAGE', payload: message });
      }
    });

    subscriptionsRef.current = [sessionSub, messagesSub];
  }, []);

  // Actions
  const startSession = useCallback(async (request: StartSessionRequest) => {
    if (!sessionManagerRef.current) {
      throw new Error('Session manager not initialized');
    }

    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const session = await sessionManagerRef.current.startSession(request);
      dispatch({ type: 'SET_SESSION', payload: session });
      
      // Setup real-time subscriptions
      setupRealtimeSubscriptions(session.id);
      
      console.log('Session started successfully:', session.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start session';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Failed to start session:', error);
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [setupRealtimeSubscriptions]);

  const sendMessage = useCallback(async (request: Partial<SendMessageRequest> = {}) => {
    if (!sessionManagerRef.current || !state.session) {
      throw new Error('No active session');
    }

    if (state.isProcessing) {
      console.warn('Already processing a message');
      return;
    }

    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const messageRequest: SendMessageRequest = {
        sessionId: state.session.id,
        ...request
      };

      const message = await sessionManagerRef.current.sendMessage(messageRequest);
      
      // Message will be added via real-time subscription, but we can add it immediately for better UX
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      
      console.log('Message sent successfully:', message.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Failed to send message:', error);
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [state.session, state.isProcessing]);

  const stopSession = useCallback(async (reason: 'manual' | 'completed' | 'error' | 'timeout' = 'manual') => {
    if (!sessionManagerRef.current) {
      throw new Error('Session manager not initialized');
    }

    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      await sessionManagerRef.current.stopSession(reason);
      dispatch({ type: 'SET_STATUS', payload: reason === 'manual' ? 'stopped' : 'completed' });
      
      // Clean up subscriptions
      subscriptionsRef.current.forEach(sub => sub?.unsubscribe?.());
      subscriptionsRef.current = [];
      
      console.log('Session stopped:', reason);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop session';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Failed to stop session:', error);
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    if (!sessionManagerRef.current) {
      throw new Error('Session manager not initialized');
    }

    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const session = await sessionManagerRef.current.loadSession(sessionId);
      dispatch({ type: 'SET_SESSION', payload: session });
      
      // Setup real-time subscriptions for loaded session
      if (session.status === 'running') {
        setupRealtimeSubscriptions(session.id);
      }
      
      console.log('Session loaded successfully:', sessionId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load session';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Failed to load session:', error);
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [setupRealtimeSubscriptions]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Computed values
  const canSendMessage = state.session?.status === 'running' && 
                        !state.isProcessing &&
                        (state.session?.currentIteration || 0) < (state.session?.config.maxIterations || 0);

  const nextSpeaker = state.session && canSendMessage
    ? state.session.participants[(state.session.currentIteration) % state.session.participants.length]?.name || null
    : null;

  const progressPercentage = state.session
    ? Math.round((state.session.currentIteration / state.session.config.maxIterations) * 100)
    : 0;

  const contextValue: SessionContextValue = {
    // State
    session: state.session,
    status: state.status,
    isProcessing: state.isProcessing,
    error: state.error,
    
    // Actions
    startSession,
    sendMessage,
    stopSession,
    loadSession,
    clearError,
    
    // Utilities
    canSendMessage,
    nextSpeaker,
    progressPercentage
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session context
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Hook for session state only (optimized for components that only need state)
export function useSessionState() {
  const { session, status, isProcessing, error } = useSession();
  return { session, status, isProcessing, error };
}

// Hook for session actions only (optimized for components that only need actions)
export function useSessionActions() {
  const { startSession, sendMessage, stopSession, loadSession, clearError } = useSession();
  return { startSession, sendMessage, stopSession, loadSession, clearError };
}

// Hook for session utilities (optimized for components that need computed values)
export function useSessionUtils() {
  const { canSendMessage, nextSpeaker, progressPercentage } = useSession();
  return { canSendMessage, nextSpeaker, progressPercentage };
}

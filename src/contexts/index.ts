// Context exports for easy importing
export { SessionProvider, useSession, useSessionState, useSessionActions, useSessionUtils } from './SessionContext';

// Hook exports
export { useAnalytics } from '@/hooks/useAnalytics';
export { useSessionConfig } from '@/hooks/useSessionConfig';

// Re-export types for convenience
export type { SessionContextValue } from './SessionContext';

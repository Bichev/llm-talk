# LLM-Talk: Code Guidelines

## TypeScript Standards

### Type Safety
- **Strict TypeScript**: Use strict mode in tsconfig.json
- **No `any` types**: Always use proper typing, create interfaces when needed
- **Explicit return types**: Functions should have explicit return types
- **Type imports**: Use `import type` for type-only imports

```typescript
// ✅ Good
import type { LLMProvider } from '@/types/llm';
import { sessionManager } from '@/lib/session-manager';

async function processMessage(message: string, provider: LLMProvider): Promise<ProcessedMessage> {
  // implementation
}

// ❌ Bad  
import { LLMProvider } from '@/types/llm';
async function processMessage(message: any, provider: any) {
  // implementation
}
```

### Interface Design
```typescript
// Use descriptive interfaces
interface SessionConfig {
  topic: string;
  scenario: ConversationScenario;
  participants: LLMParticipant[];
  maxIterations: number;
  temperature: number;
}

// Extend base interfaces when appropriate
interface OpenAIProvider extends BaseLLMProvider {
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o';
  organization?: string;
}
```

## React Component Standards

### Component Structure
```typescript
// Component organization
interface ComponentProps {
  // Props interface first
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  const { contextValue } = useContext(Context);
  
  // 2. Derived values
  const computedValue = useMemo(() => {}, [dependencies]);
  
  // 3. Event handlers
  const handleClick = useCallback(() => {}, [dependencies]);
  
  // 4. Effects
  useEffect(() => {}, [dependencies]);
  
  // 5. Early returns
  if (loading) return <div>Loading...</div>;
  
  // 6. Render
  return (
    <div className="component-root">
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions
- **Components**: PascalCase (`ConversationView`, `AnalyticsPanel`)
- **Files**: kebab-case for pages (`conversation-view.tsx`)
- **Functions**: camelCase (`processMessage`, `handleSubmit`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_ITERATIONS`, `DEFAULT_TEMPERATURE`)
- **Types/Interfaces**: PascalCase (`SessionState`, `LLMProvider`)

### Hook Usage
```typescript
// Custom hooks for reusable logic
function useSessionManager() {
  const [session, setSession] = useState<SessionState | null>(null);
  
  const startSession = useCallback(async (config: SessionConfig) => {
    // implementation
  }, []);
  
  return { session, startSession };
}

// Use hooks consistently
function Component() {
  const { session, startSession } = useSessionManager();
  const { analytics } = useAnalytics(session?.id);
  
  // Component logic
}
```

## API Route Standards

### Route Structure
```typescript
// /api/session/start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { SessionConfig } from '@/types/session';

export async function POST(request: NextRequest) {
  try {
    // 1. Input validation
    const body = await request.json();
    const config = validateSessionConfig(body);
    
    // 2. Business logic
    const session = await createSession(config);
    
    // 3. Response
    return NextResponse.json({
      success: true,
      data: session
    });
  } catch (error) {
    // 4. Error handling
    console.error('Session start error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start session' },
      { status: 500 }
    );
  }
}
```

### Error Handling
```typescript
// Consistent error response format
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Error handling utility
function createErrorResponse(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}
```

## LLM Provider Integration

### Base Provider Interface
```typescript
interface BaseLLMProvider {
  name: string;
  model: string;
  temperature: number;
  
  sendMessage(prompt: string): Promise<LLMResponse>;
  countTokens(text: string): number;
  validateConfig(): boolean;
}

// Consistent implementation pattern
class OpenAIProvider implements BaseLLMProvider {
  constructor(private config: OpenAIConfig) {}
  
  async sendMessage(prompt: string): Promise<LLMResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.config.temperature
      });
      
      return this.formatResponse(response);
    } catch (error) {
      throw new LLMProviderError('OpenAI request failed', error);
    }
  }
}
```

### Provider Error Handling
```typescript
class LLMProviderError extends Error {
  constructor(
    message: string, 
    public originalError: any,
    public provider: string
  ) {
    super(message);
    this.name = 'LLMProviderError';
  }
}

// Consistent error handling across providers
async function safeProviderCall<T>(
  provider: BaseLLMProvider,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new LLMProviderError(
      `${provider.name} operation failed`,
      error,
      provider.name
    );
  }
}
```

## Styling Guidelines

### Tailwind CSS Usage
```typescript
// Use semantic class groupings
<div className={cn(
  // Layout
  "flex items-center justify-between p-4",
  // Appearance  
  "bg-white border border-gray-200 rounded-lg shadow-sm",
  // State
  "hover:shadow-md transition-shadow",
  // Responsive
  "md:p-6 lg:p-8"
)}>

// Use component variants
const buttonVariants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700"
};
```

### CSS Custom Properties
```css
/* globals.css - Define semantic colors */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  --space-session-config: 1.5rem;
  --space-message-gap: 1rem;
}
```

## State Management Patterns

### Context Usage
```typescript
// Session context
interface SessionContextValue {
  session: SessionState | null;
  startSession: (config: SessionConfig) => Promise<void>;
  stopSession: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(null);
  
  const contextValue = useMemo(() => ({
    session,
    startSession,
    stopSession,
    sendMessage
  }), [session]);
  
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
```

### State Updates
```typescript
// Immutable state updates
const updateSession = useCallback((update: Partial<SessionState>) => {
  setSession(prev => prev ? { ...prev, ...update } : null);
}, []);

// Message additions
const addMessage = useCallback((message: ConversationMessage) => {
  setSession(prev => prev ? {
    ...prev,
    messages: [...prev.messages, message],
    currentIteration: prev.currentIteration + 1
  } : null);
}, []);
```

## Testing Standards

### Component Testing
```typescript
// Component test structure
describe('ConversationView', () => {
  const mockSession = createMockSession();
  
  beforeEach(() => {
    render(
      <SessionProvider value={mockSession}>
        <ConversationView />
      </SessionProvider>
    );
  });
  
  it('displays messages correctly', () => {
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
  
  it('handles new messages', async () => {
    // Test implementation
  });
});
```

### API Route Testing
```typescript
// API route test
describe('/api/session/start', () => {
  it('creates session with valid config', async () => {
    const response = await POST(
      new Request('/api/session/start', {
        method: 'POST',
        body: JSON.stringify(validConfig)
      })
    );
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

## Performance Guidelines

### Optimization Patterns
```typescript
// Memoization for expensive computations
const tokenAnalytics = useMemo(() => {
  return analyzeTokenUsage(session?.messages ?? []);
}, [session?.messages]);

// Callback optimization
const handleMessageSend = useCallback(async (message: string) => {
  await sendMessage(message);
}, [sendMessage]);

// Component memoization
const MessageCard = memo(function MessageCard({ message }: MessageCardProps) {
  return <div>{message.content}</div>;
});
```

### Bundle Optimization
```typescript
// Dynamic imports for heavy components
const AnalyticsPanel = dynamic(() => import('./AnalyticsPanel'), {
  loading: () => <div>Loading analytics...</div>
});

// Code splitting by route
const ConversationPage = dynamic(() => import('./ConversationPage'));
```

## Documentation Standards

### Function Documentation
```typescript
/**
 * Processes an LLM response and extracts evolved communication
 * 
 * @param response - Raw LLM response
 * @param previousMessages - Context from previous messages  
 * @param config - Session configuration
 * @returns Processed message with evolved communication and translation
 * 
 * @example
 * ```typescript
 * const processed = await processLLMResponse(
 *   response,
 *   messages,
 *   { temperature: 0.7, maxTokens: 1000 }
 * );
 * ```
 */
async function processLLMResponse(
  response: LLMResponse,
  previousMessages: ConversationMessage[],
  config: SessionConfig
): Promise<ProcessedMessage> {
  // implementation
}
```

### Component Documentation
```typescript
/**
 * Displays real-time conversation between LLMs with efficiency analysis
 * 
 * Features:
 * - Live message updates
 * - Token counting per message
 * - Translation display
 * - Auto-scroll to latest messages
 */
interface ConversationViewProps {
  /** Current session state */
  session: SessionState;
  /** Whether to show analytics inline */
  showAnalytics?: boolean;
}

export function ConversationView(props: ConversationViewProps) {
  // implementation
}
```

## Commit and PR Guidelines

### Commit Messages
```
feat: add real-time conversation display
fix: resolve token counting accuracy for Claude API  
docs: update architecture documentation
refactor: extract LLM provider base class
test: add session management unit tests
style: apply consistent Tailwind spacing
```

### PR Guidelines
- **Small, focused changes**: One feature or fix per PR
- **Clear descriptions**: Explain what and why
- **Screenshots**: For UI changes
- **Testing**: Include test coverage for new features
- **Documentation**: Update docs for significant changes
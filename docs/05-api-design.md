# LLM-Talk: API Design Document

## API Architecture

### Base Response Format
All API endpoints return consistent response structure:

```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

// Success response
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// Error response  
{
  "success": false,
  "error": "Invalid session configuration",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456"
}
```

## Session Management Endpoints

### POST /api/session/start
**Purpose**: Initialize a new conversation session

**Request Body**:
```typescript
interface StartSessionRequest {
  topic: string;
  scenario: 'cooperative' | 'debate' | 'creative' | 'problem-solving';
  participants: Array<{
    provider: 'openai' | 'claude' | 'gemini' | 'perplexity';
    model: string;
    temperature: number;
    name: string;
  }>;
  maxIterations: number;
  customPrompt?: string;
}
```

**Response**:
```typescript
interface StartSessionResponse {
  sessionId: string;
  status: 'initialized';
  config: SessionConfig;
  participants: LLMParticipant[];
  estimatedCost: number;
}
```

**Example**:
```bash
curl -X POST /api/session/start \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Evolution of AI and impact on humanity",
    "scenario": "debate", 
    "participants": [
      {
        "provider": "openai",
        "model": "gpt-4",
        "temperature": 0.7,
        "name": "AI_Optimist"
      },
      {
        "provider": "claude",
        "model": "claude-3-sonnet",
        "temperature": 0.8,
        "name": "AI_Skeptic"
      }
    ],
    "maxIterations": 20
  }'
```

### POST /api/session/message
**Purpose**: Process next message in conversation

**Request Body**:
```typescript
interface SendMessageRequest {
  sessionId: string;
  currentSpeaker?: string; // Auto-determined if not provided
  contextLimit?: number;   // Max tokens for context
}
```

**Response**:
```typescript
interface SendMessageResponse {
  message: {
    id: string;
    speaker: string;
    timestamp: string;
    originalPrompt: string;
    evolvedMessage: string;
    translation?: string;
    tokenCount: {
      input: number;
      output: number;
      total: number;
    };
    processingTimeMs: number;
  };
  sessionStatus: {
    currentIteration: number;
    totalIterations: number;
    isComplete: boolean;
    totalTokens: number;
  };
  nextSpeaker?: string;
}
```

### GET /api/session/status/{sessionId}
**Purpose**: Get current session state and analytics

**Response**:
```typescript
interface SessionStatusResponse {
  session: {
    id: string;
    status: 'running' | 'paused' | 'completed' | 'error';
    config: SessionConfig;
    currentIteration: number;
    totalMessages: number;
    startedAt: string;
    lastActivity: string;
  };
  analytics: {
    totalTokens: number;
    averageTokensPerMessage: number;
    tokenEfficiencyTrend: number[];
    participantStats: Array<{
      name: string;
      messageCount: number;
      totalTokens: number;
      averageTokens: number;
    }>;
    evolutionMarkers: Array<{
      iteration: number;
      type: 'symbol_introduction' | 'pattern_change' | 'efficiency_improvement';
      description: string;
    }>;
  };
  recentMessages: ConversationMessage[];
}
```

### POST /api/session/stop
**Purpose**: Stop session and generate summary

**Request Body**:
```typescript
interface StopSessionRequest {
  sessionId: string;
  reason?: 'manual' | 'completed' | 'error' | 'timeout';
}
```

**Response**:
```typescript
interface StopSessionResponse {
  sessionId: string;
  summary: {
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
  };
  exportUrl?: string;
}
```

## LLM Provider Endpoints

### POST /api/providers/openai
**Purpose**: Proxy requests to OpenAI API with standardized response

**Request Body**:
```typescript
interface ProviderRequest {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  context?: ConversationMessage[];
  systemPrompt?: string;
}
```

**Response**:
```typescript
interface ProviderResponse {
  content: string;
  tokenCount: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  finishReason: string;
  processingTime: number;
  metadata: {
    provider: 'openai';
    requestId: string;
    model: string;
    usage: any;
  };
}
```

### POST /api/providers/claude
**Purpose**: Proxy requests to Anthropic Claude API

**Similar structure to OpenAI with provider-specific metadata**

### POST /api/providers/gemini
**Purpose**: Proxy requests to Google Gemini API

**Similar structure with Gemini-specific response formatting**

### POST /api/providers/perplexity  
**Purpose**: Proxy requests to Perplexity API

**Similar structure with Perplexity-specific features**

## Analytics Endpoints

### GET /api/analytics/session/{sessionId}
**Purpose**: Get detailed session analytics

**Response**:
```typescript
interface SessionAnalytics {
  tokenMetrics: {
    totalTokens: number;
    averagePerMessage: number;
    efficiencyTrend: Array<{
      iteration: number;
      tokensUsed: number;
      cumulativeEfficiency: number;
    }>;
    providerComparison: Array<{
      provider: string;
      totalTokens: number;
      efficiency: number;
      averageResponseTime: number;
    }>;
  };
  communicationEvolution: {
    symbolsIntroduced: Array<{
      symbol: string;
      firstAppearance: number;
      frequency: number;
      context: string;
    }>;
    patternChanges: Array<{
      iteration: number;
      description: string;
      impact: 'positive' | 'negative' | 'neutral';
    }>;
    languageComplexity: Array<{
      iteration: number;
      complexityScore: number;
      readabilityScore: number;
    }>;
  };
  participantAnalysis: Array<{
    name: string;
    adaptationRate: number;
    innovationScore: number;
    collaborationEffectiveness: number;
    communicationStyle: string[];
  }>;
}
```

### GET /api/analytics/export/{sessionId}
**Purpose**: Export session data for research

**Query Parameters**:
- `format`: 'json' | 'csv' | 'xlsx'
- `includeRaw`: boolean

**Response**: File download or structured data

## Real-time Updates

### GET /api/session/stream/{sessionId}
**Purpose**: Server-Sent Events for real-time updates

**Event Types**:
```typescript
// New message event
{
  type: 'message',
  data: ConversationMessage
}

// Status update event  
{
  type: 'status',
  data: {
    currentIteration: number,
    status: SessionStatus
  }
}

// Analytics update event
{
  type: 'analytics', 
  data: PartialAnalytics
}

// Error event
{
  type: 'error',
  data: {
    message: string,
    code: string
  }
}

// Session complete event
{
  type: 'complete',
  data: SessionSummary
}
```

## Error Handling

### Error Codes
```typescript
enum APIErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}
```

### Error Response Format
```typescript
interface APIError {
  success: false;
  error: string;
  code: APIErrorCode;
  details?: any;
  retryable: boolean;
  timestamp: string;
}
```

### Provider-Specific Error Handling
```typescript
// Standardized provider error mapping
const providerErrorMap = {
  openai: {
    'insufficient_quota': 'RATE_LIMIT_EXCEEDED',
    'model_not_found': 'INVALID_REQUEST',
    'context_length_exceeded': 'TOKEN_LIMIT_EXCEEDED'
  },
  claude: {
    'rate_limit_error': 'RATE_LIMIT_EXCEEDED',
    'invalid_request_error': 'INVALID_REQUEST'  
  }
  // ... other providers
};
```

## Rate Limiting

### Rate Limits by Endpoint
- `/api/session/start`: 10 per minute per IP
- `/api/session/message`: 60 per minute per session
- `/api/providers/*`: Provider-specific limits
- `/api/analytics/*`: 100 per minute per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1642234567
X-RateLimit-Window: 60
```

## Authentication & Security

### API Key Validation
```typescript
// Validate provider API keys on session start
interface ProviderValidation {
  provider: string;
  valid: boolean;
  error?: string;
  quotaRemaining?: number;
}
```

### Input Sanitization
- All user inputs sanitized before processing
- XSS protection for custom topics
- SQL injection prevention (though using in-memory storage)
- Rate limiting by IP and session

### CORS Configuration
```typescript
// Next.js API route CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## Testing Strategy

### API Testing
```typescript
// Example API test
describe('POST /api/session/start', () => {
  it('should create session with valid config', async () => {
    const response = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validConfig)
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.sessionId).toBeDefined();
  });
  
  it('should handle invalid provider configuration', async () => {
    const response = await fetch('/api/session/start', {
      method: 'POST', 
      body: JSON.stringify(invalidConfig)
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Invalid provider configuration');
  });
});
```

### Load Testing Considerations
- Session concurrency limits
- Provider API rate limits
- Memory usage with long conversations
- WebSocket connection limits for real-time features
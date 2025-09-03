# LLM-Talk: Architecture Document

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React useState/useContext for session state
- **Real-time Updates**: Server-Sent Events (SSE) or polling
- **HTTP Client**: Built-in fetch API
- **Charts**: Recharts for analytics visualization

### Backend
- **Runtime**: Next.js API Routes (Edge Runtime where possible)
- **LLM Integrations**: Direct HTTP calls to provider APIs
- **Session Storage**: In-memory (Redis for production scaling)
- **Environment**: Vercel Functions

### External APIs
- **OpenAI**: GPT models via OpenAI API
- **Anthropic**: Claude models via Anthropic API  
- **Google**: Gemini via Google AI API
- **Perplexity**: Via Perplexity API

## Project Structure

```
llm-talk/
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── README.md                    # Project overview
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── docs/                       # Documentation
│   ├── 01-concept-specification.md
│   ├── 02-prd.md
│   ├── 03-architecture.md
│   └── ...
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── api/                # API Routes
│   │       ├── session/
│   │       │   ├── start/route.ts      # Start conversation session
│   │       │   ├── message/route.ts    # Send message to LLMs
│   │       │   ├── status/route.ts     # Get session status
│   │       │   └── stop/route.ts       # Stop session
│   │       └── providers/
│   │           ├── openai/route.ts     # OpenAI integration
│   │           ├── claude/route.ts     # Claude integration
│   │           ├── gemini/route.ts     # Gemini integration
│   │           └── perplexity/route.ts # Perplexity integration
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Card.tsx
│   │   ├── ConfigPanel.tsx     # Session configuration
│   │   ├── ConversationView.tsx # Live chat display
│   │   ├── AnalyticsPanel.tsx  # Metrics and charts
│   │   ├── MessageCard.tsx     # Individual message display
│   │   └── SessionControls.tsx # Start/stop controls
│   ├── lib/                    # Utility functions
│   │   ├── llm-providers/      # LLM provider integrations
│   │   │   ├── base.ts         # Base provider interface
│   │   │   ├── openai.ts       # OpenAI implementation
│   │   │   ├── claude.ts       # Claude implementation
│   │   │   ├── gemini.ts       # Gemini implementation
│   │   │   └── perplexity.ts   # Perplexity implementation
│   │   ├── session-manager.ts  # Session state management
│   │   ├── token-counter.ts    # Token counting utilities
│   │   ├── prompts.ts          # LLM prompt templates
│   │   └── utils.ts            # General utilities
│   ├── types/                  # TypeScript type definitions
│   │   ├── session.ts          # Session-related types
│   │   ├── llm.ts              # LLM provider types
│   │   └── analytics.ts        # Analytics types
│   └── constants/              # Application constants
│       ├── topics.ts           # Predefined conversation topics
│       ├── scenarios.ts        # Conversation scenarios
│       └── providers.ts        # LLM provider configurations
```

## Data Flow Architecture

### Session Lifecycle
```
1. User Configuration → 2. Session Start → 3. Message Loop → 4. Session End
   ↓                      ↓                ↓               ↓
   - Topic selection      - Initialize     - LLM calls     - Analytics
   - LLM selection        - Session state  - Response      - Session summary
   - Parameters           - First prompt   - Token count   - Cleanup
```

### Message Flow
```
Frontend → API Route → LLM Provider → Response Processing → Frontend Update
    ↓                                         ↓
    Session State                     Token Counting + Analytics
```

### Real-time Updates
```
Frontend Poll/SSE ← Session State ← Message Processing ← LLM Responses
```

## API Design

### Session Management
- `POST /api/session/start` - Initialize conversation session
- `POST /api/session/message` - Send message and get LLM responses  
- `GET /api/session/status` - Get current session status
- `POST /api/session/stop` - End conversation session

### Provider Integration
- `POST /api/providers/openai` - OpenAI API proxy
- `POST /api/providers/claude` - Claude API proxy
- `POST /api/providers/gemini` - Gemini API proxy
- `POST /api/providers/perplexity` - Perplexity API proxy

## State Management

### Session State Structure
```typescript
interface SessionState {
  id: string;
  status: 'idle' | 'running' | 'stopped' | 'error';
  config: SessionConfig;
  messages: ConversationMessage[];
  analytics: SessionAnalytics;
  currentIteration: number;
  participants: LLMParticipant[];
}

interface ConversationMessage {
  id: string;
  timestamp: Date;
  speaker: string;
  originalMessage: string;
  evolvedMessage?: string;
  translation?: string;
  tokenCount: {
    input: number;
    output: number;
  };
}
```

### Frontend State Management
- React Context for session state
- useState for component-level state
- Custom hooks for LLM provider management

## Security Considerations

### API Key Security
- All API keys stored in environment variables
- No client-side exposure of keys
- API routes act as secure proxies
- Rate limiting on API routes

### Input Validation
- Sanitize all user inputs
- Validate LLM responses before processing
- Prevent injection attacks in custom topics

### Error Handling
- Graceful API failure handling
- User-friendly error messages
- Automatic retry with exponential backoff
- Circuit breaker pattern for failing providers

## Performance Optimization

### API Route Optimization
- Edge Runtime where possible
- Response streaming for long conversations
- Efficient token counting
- Connection pooling for LLM APIs

### Frontend Optimization
- Component memoization
- Virtual scrolling for long conversations
- Debounced user inputs
- Optimistic UI updates

### Caching Strategy
- Session state caching
- LLM response caching (where appropriate)
- Static asset optimization

## Deployment Architecture

### Vercel Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    // ... other API keys
  },
};
```

### Environment Variables
```bash
# Required for production
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
PERPLEXITY_API_KEY=

# Optional configuration
MAX_SESSION_DURATION=3600000  # 1 hour in ms
MAX_ITERATIONS=100
DEFAULT_TEMPERATURE=0.7
```

### Production Considerations
- Environment variable validation
- API rate limit monitoring
- Error tracking (Sentry integration)
- Performance monitoring
- Automatic scaling via Vercel

## Monitoring & Analytics

### Application Metrics
- Session success/failure rates
- Average session duration
- Token usage per provider
- API response times
- Error rates by provider

### User Analytics
- Session configuration preferences
- Topic popularity
- Feature usage patterns
- Performance bottlenecks
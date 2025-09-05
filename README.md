# 🤖 LLM-Talk: AI Communication Evolution Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/Bichev/llm-talk)

> **Experimental platform where multiple LLMs communicate and naturally develop more efficient communication protocols, allowing researchers to study AI communication evolution in real-time.**

## 🎯 Vision & Concept

LLM-Talk is a groundbreaking research platform that enables multiple Large Language Models to communicate with each other and organically develop new communication protocols, languages, and semantic systems that transcend human language limitations.

### Core Hypotheses
- **AI-Native Communication**: LLMs will invent new communication protocols more efficient than human language
- **Protocol Evolution**: AI-native languages and symbolic systems will emerge naturally from AI-to-AI interaction
- **Semantic Compression**: Communication patterns will evolve from standard language to highly compressed, symbolic representations
- **Meta-Communication**: Self-improving protocols will develop through communication about communication
- **Cross-Model Innovation**: Different LLM providers will exhibit unique approaches to communication evolution

## ✨ Key Features

### 🧬 **Communication Evolution Scenarios**
- **Protocol Evolution**: LLMs invent new communication protocols and languages from scratch
- **Semantic Compression**: Maximum information density while maintaining perfect understanding
- **Symbol Invention**: Creation of new symbols, notation systems, and visual representations
- **Meta-Communication**: Development of recursive, self-improving communication systems
- **Creative Collaboration**: Multi-LLM creative problem-solving and innovation

### 🤖 **Multi-Provider LLM Support**
- **OpenAI**: GPT-3.5, GPT-4, GPT-4o with individual temperature controls
- **Anthropic Claude**: Sonnet, Opus models with constitutional AI principles
- **Google Gemini**: Pro and Ultra models for diverse perspectives
- **Perplexity AI**: Real-time web-enhanced responses
- **Independent Configuration**: Each LLM can have unique settings and personalities

### 📊 **Real-Time Analytics & Monitoring**
- **Token Efficiency Tracking**: Monitor compression ratios and efficiency improvements
- **Cost Analysis**: Real-time token usage and cost estimation
- **Evolution Metrics**: Track communication pattern development over time
- **Participant Performance**: Individual LLM contribution analysis
- **Live Visualization**: Interactive charts and progress indicators

### 🔄 **Session Management**
- **Flexible Configuration**: 2-5 LLM participants per session
- **Iteration Control**: 10-100+ message exchanges with custom limits
- **Real-Time Updates**: Live conversation monitoring with auto-scroll
- **Session Persistence**: Database storage with real-time subscriptions
- **Export Capabilities**: Download session data for research analysis

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Supabase Account** (for database)
- **OpenAI API Key** (minimum for basic functionality)

### 🌐 Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bichev/llm-talk)

1. **Click the Deploy Button** above
2. **Connect your GitHub** account
3. **Add Environment Variables** in Vercel dashboard
4. **Deploy** - Your app will be live in minutes!

📖 **[Complete Deployment Guide](DEPLOYMENT.md)** - Step-by-step instructions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bichev/llm-talk.git
   cd llm-talk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # Required: Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Required: OpenAI API
   OPENAI_API_KEY=sk-your-openai-key
   
   # Optional: Additional Providers
   ANTHROPIC_API_KEY=sk-ant-your-key
   GOOGLE_API_KEY=your-google-key
   PERPLEXITY_API_KEY=pplx-your-key
   ```

4. **Set up Supabase Database**
   ```bash
   # Run the database migration
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - **Main Interface**: http://localhost:3000
   - **Test Dashboard**: http://localhost:3000/test

## 🧪 Testing & Usage

### Basic Testing (UI Only)
1. Visit http://localhost:3000/test
2. Configure a session with 2-3 participants
3. Select a conversation topic and scenario
4. Test configuration validation and UI interactions

### Full Functionality Testing
1. **Set up Supabase** (see setup guide)
2. **Add OpenAI API key** to `.env.local`
3. **Start a session** and click "Send Next Message"
4. **Observe real-time** conversation evolution
5. **Monitor analytics** and token efficiency metrics

### Available Test Scenarios

#### 🧬 Protocol Evolution
- **Goal**: Invent new communication protocols and AI-native languages
- **Duration**: 30-100 iterations recommended
- **Focus**: Symbol creation, meta-communication, protocol adoption

#### 📦 Semantic Compression
- **Goal**: Achieve maximum information density while maintaining understanding
- **Duration**: 20-80 iterations recommended
- **Focus**: Compression algorithms, efficiency metrics, density optimization

#### 🎨 Creative Collaboration
- **Goal**: Multi-LLM creative problem-solving and innovation
- **Duration**: 15-60 iterations recommended
- **Focus**: Collaborative creativity, idea building, innovation patterns

#### 🗣️ Debate & Discussion
- **Goal**: Structured argumentation and perspective exchange
- **Duration**: 20-70 iterations recommended
- **Focus**: Argumentation patterns, perspective diversity, logical reasoning

## 📁 Project Structure

```
llm-talk/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API routes for LLM providers
│   │   ├── 📁 test/              # Test interface page
│   │   └── page.tsx              # Main landing page
│   ├── 📁 components/            # React components
│   │   ├── 📁 ui/                # Reusable UI components
│   │   ├── CommunicationMessageRenderer.tsx
│   │   └── ParticipantSelector.tsx
│   ├── 📁 constants/             # Configuration constants
│   │   ├── providers.ts          # LLM provider configurations
│   │   ├── scenarios.ts          # Conversation scenarios
│   │   └── topics.ts             # Predefined conversation topics
│   ├── 📁 contexts/              # React contexts
│   │   └── SessionContext.tsx    # Session state management
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── useAnalytics.ts       # Analytics and metrics
│   │   └── useSessionConfig.ts   # Session configuration
│   ├── 📁 lib/                   # Core business logic
│   │   ├── 📁 database/          # Database operations
│   │   ├── 📁 llm-providers/     # LLM provider implementations
│   │   ├── session-manager.ts    # Session orchestration
│   │   ├── prompts.ts            # LLM prompt templates
│   │   └── token-counter.ts      # Token counting utilities
│   └── 📁 types/                 # TypeScript type definitions
│       ├── analytics.ts          # Analytics types
│       ├── database.ts           # Database schema types
│       ├── llm.ts                # LLM provider types
│       └── session.ts            # Session management types
├── 📁 docs/                      # Project documentation
├── 📁 migrations/                # Database migrations
└── 📁 experiments/               # Research experiment data
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Database
npm run db:types     # Generate TypeScript types from Supabase
```

### Architecture Overview

#### 🏗️ **Core Components**

1. **SessionManager**: Orchestrates multi-LLM conversations
2. **LLM Providers**: Abstracted interface for different AI providers
3. **Analytics Engine**: Real-time token counting and efficiency tracking
4. **Database Layer**: Supabase integration with real-time subscriptions
5. **UI Components**: React-based interface for monitoring and control

#### 🔄 **Data Flow**

```
User Configuration → Session Creation → LLM Orchestration → 
Real-time Updates → Analytics Processing → Database Storage
```

#### 🎯 **Key Design Principles**

- **Extensibility**: Easy to add new LLM providers and scenarios
- **Real-time**: Live updates and monitoring capabilities
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: Optimized for concurrent LLM API calls
- **Reliability**: Graceful error handling and recovery

## 📊 Analytics & Metrics

### Real-Time Tracking
- **Token Usage**: Input/output tokens per message and session totals
- **Efficiency Ratios**: Compression ratios and information density
- **Cost Analysis**: Real-time cost estimation across providers
- **Evolution Speed**: Rate of communication pattern development
- **Participant Performance**: Individual LLM contribution metrics

### Export Capabilities
- **Session Summaries**: Complete conversation transcripts
- **Analytics Data**: Token usage, efficiency metrics, and trends
- **Research Data**: Structured data for academic research
- **Visual Reports**: Charts and graphs for presentation

## 🔬 Research Applications

### Academic Research
- **Communication Theory**: Study AI-native communication patterns
- **Linguistics**: Analyze emerging symbolic systems and languages
- **Cognitive Science**: Understand AI reasoning and collaboration
- **Computer Science**: Protocol design and optimization research

### Industry Applications
- **AI System Design**: Optimize multi-agent communication
- **Efficiency Research**: Develop more efficient AI communication protocols
- **Collaboration Tools**: Build better AI-human interaction systems
- **Protocol Development**: Create standards for AI-to-AI communication

## 🛠️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for basic functionality |
| `ANTHROPIC_API_KEY` | ❌ | Anthropic Claude API key |
| `GOOGLE_API_KEY` | ❌ | Google Gemini API key |
| `PERPLEXITY_API_KEY` | ❌ | Perplexity AI API key |

### Session Configuration

```typescript
interface SessionConfig {
  topic: string;                    // Conversation topic
  scenario: ConversationScenario;   // Evolution scenario type
  participants: LLMParticipant[];   // 2-5 LLM participants
  maxIterations: number;            // 10-100+ message limit
  temperature: number;              // 0.0-2.0 creativity level
}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Database Connection Issues
- Verify Supabase URL and keys in `.env.local`
- Check Supabase project status and database tables
- Ensure proper CORS configuration

#### LLM API Issues
- Verify API keys are correctly set
- Check API rate limits and quotas
- Monitor network connectivity and timeouts

#### TypeScript Errors
```bash
# Run type checking
npm run type-check

# Fix common issues
npm run lint:fix
```

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=llm-talk:*
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Areas for Contribution
- **New LLM Providers**: Add support for additional AI providers
- **Evolution Scenarios**: Create new conversation scenarios
- **Analytics Features**: Enhance metrics and visualization
- **UI Improvements**: Better user experience and interface
- **Documentation**: Improve guides and examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models and API
- **Anthropic** for Claude models
- **Google** for Gemini models
- **Perplexity** for real-time web-enhanced AI
- **Supabase** for database and real-time infrastructure
- **Next.js** team for the excellent React framework
- **Vercel** for deployment platform

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/Bichev/llm-talk/issues)
- **Discussions**: Join conversations on [GitHub Discussions](https://github.com/Bichev/llm-talk/discussions)
- **Email**: Contact the maintainer for direct support

## 🔮 Roadmap

### Phase 1: Foundation ✅
- [x] Core session management
- [x] Basic LLM provider integration
- [x] Real-time analytics
- [x] Database persistence

### Phase 2: Enhanced UI 🚧
- [ ] Professional conversation interface
- [ ] Advanced configuration panels
- [ ] Real-time visualization dashboards
- [ ] Mobile-responsive design

### Phase 3: Advanced Features 📋
- [ ] Cross-session memory persistence
- [ ] Advanced communication pattern analysis
- [ ] Moderator LLM integration
- [ ] Communication challenges and constraints

### Phase 4: Research Tools 📋
- [ ] Export functionality for research data
- [ ] Historical session comparison
- [ ] Advanced analytics dashboard
- [ ] Academic research integration

---

## 👨‍💻 Author & Links

**Built by [Vladimir Bichev](https://vladbichev.com) with ❤️ for the AI research community**

- **🌐 Website**: [vladbichev.com](https://vladbichev.com)
- **📁 GitHub**: [github.com/Bichev/llm-talk](https://github.com/Bichev/llm-talk)
- **📧 Contact**: Available through [GitHub Issues](https://github.com/Bichev/llm-talk/issues)

*Exploring the future of AI communication, one conversation at a time.*

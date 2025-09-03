# LLM-Talk: Deployment Guide

## Overview
This guide covers deploying LLM-Talk as a single Next.js application to Vercel with proper environment variable configuration and monitoring setup.

## Prerequisites

### Required Accounts & API Keys
1. **Vercel Account**: For hosting the application
2. **OpenAI API Key**: For GPT models
3. **Anthropic API Key**: For Claude models  
4. **Google AI API Key**: For Gemini models
5. **Perplexity API Key**: For Perplexity AI models
6. **GitHub Account**: For code repository (already configured)

### Local Development Setup
```bash
# Clone repository
git clone https://github.com/Bichev/llm-talk.git
cd llm-talk

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# See Environment Variables section below
```

## Environment Variables

### Required Variables
Create `.env.local` for local development and configure in Vercel dashboard for production:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORG_ID=org-your-org-id  # Optional

# Anthropic Claude Configuration  
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Google Gemini Configuration
GOOGLE_API_KEY=your-google-api-key
GOOGLE_PROJECT_ID=your-project-id  # Optional

# Perplexity Configuration
PERPLEXITY_API_KEY=pplx-your-perplexity-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
NODE_ENV=development

# Optional: Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
SENTRY_DSN=your-sentry-dsn      # Error tracking
```

### API Key Validation
```typescript
// Environment validation utility
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY', 
  'GOOGLE_API_KEY',
  'PERPLEXITY_API_KEY'
];

function validateEnvironment() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

## Local Development

### Development Server
```bash
# Start development server
npm run dev

# The application will be available at:
# http://localhost:3000

# API endpoints available at:
# http://localhost:3000/api/*
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Testing Before Deployment
```bash
# Run all checks before deploying
npm run lint          # ESLint checks
npm run type-check    # TypeScript checks  
npm run test          # Unit tests
npm run build         # Production build test
npm run start         # Test production build locally
```

## Vercel Deployment

### Initial Setup
1. **Connect Repository**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project" 
   - Import `Bichev/llm-talk` from GitHub
   - Vercel will auto-detect Next.js configuration

2. **Configure Build Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all required API keys from `.env.example`
   - Set appropriate values for production

### Vercel Configuration
Create `vercel.json` in root directory:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://llm-talk.vercel.app"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://llm-talk.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods", 
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### Custom Domain (Optional)
1. **Purchase Domain**: Buy domain from registrar
2. **Add to Vercel**: 
   - Project Settings → Domains
   - Add custom domain
   - Configure DNS records as instructed
3. **SSL**: Automatically handled by Vercel

## Production Optimizations

### Next.js Configuration
Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  
  // Environment variables available to client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // API route configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### Performance Optimizations
```typescript
// Dynamic imports for heavy components
const AnalyticsPanel = dynamic(() => import('./AnalyticsPanel'), {
  loading: () => <AnalyticsSkeleton />
});

// Image optimization
import Image from 'next/image';

// Font optimization
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

## Monitoring & Analytics

### Error Tracking with Sentry
1. **Setup Sentry Account**
2. **Install SDK**:
   ```bash
   npm install @sentry/nextjs
   ```

3. **Configure** (`sentry.client.config.js`):
   ```javascript
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

### Analytics Setup
```typescript
// Google Analytics 4
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({children}) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
```

### Custom Metrics
```typescript
// Custom analytics for LLM usage
async function trackSessionMetrics(sessionData: SessionAnalytics) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'session_completed', {
      custom_parameter_1: sessionData.totalTokens,
      custom_parameter_2: sessionData.efficiency,
    });
  }
}
```

## Security Considerations

### API Key Security
- ✅ Never expose API keys in client-side code
- ✅ Use environment variables for all secrets
- ✅ Implement request validation
- ✅ Add rate limiting to prevent abuse

### CORS Configuration
```typescript
// API route CORS handling
export async function POST(request: NextRequest) {
  // Add CORS headers
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL);
  return response;
}
```

### Input Validation
```typescript
// Validate all user inputs
import { z } from 'zod';

const sessionConfigSchema = z.object({
  topic: z.string().min(10).max(500),
  participants: z.array(z.object({
    provider: z.enum(['openai', 'claude', 'gemini', 'perplexity']),
    temperature: z.number().min(0).max(2)
  })).min(2).max(5)
});
```

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] TypeScript checks pass (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] API keys validated
- [ ] Error handling tested

### Post-Deployment  
- [ ] Production URLs working
- [ ] API endpoints responding correctly
- [ ] All LLM providers functional
- [ ] Analytics tracking working
- [ ] Error monitoring active
- [ ] Performance metrics baseline established
- [ ] Custom domain SSL configured (if applicable)

### Monitoring Setup
- [ ] Uptime monitoring configured
- [ ] Error tracking active
- [ ] Performance monitoring in place
- [ ] API usage tracking implemented
- [ ] Cost monitoring alerts set up

## Maintenance & Updates

### Regular Tasks
1. **API Key Rotation**: Rotate API keys quarterly
2. **Dependency Updates**: Update dependencies monthly
3. **Security Patches**: Apply security updates immediately  
4. **Performance Monitoring**: Review metrics weekly
5. **Error Analysis**: Investigate errors weekly

### Scaling Considerations
- **API Rate Limits**: Monitor usage and implement queuing if needed
- **Session Storage**: Consider Redis for persistent sessions
- **CDN**: Use Vercel's CDN for static assets
- **Database**: Add database for session persistence if needed

### Backup & Recovery
- **Code**: Repository automatically backed up on GitHub
- **Configuration**: Document all environment variables
- **Data**: Export functionality for session data
- **Monitoring**: Set up alerts for critical failures

## Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**API Key Issues**:
- Verify all environment variables are set
- Check API key permissions and quotas
- Test individual provider endpoints

**Performance Issues**:
- Monitor Vercel function execution time
- Check API response times
- Review client-side bundle size

**CORS Errors**:
- Verify NEXT_PUBLIC_APP_URL matches domain
- Check API route CORS configuration
- Ensure headers are properly set

### Support Resources
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **API Provider Documentation**: Check individual provider docs
- **Community Support**: GitHub Issues for bug reports

## Cost Management

### API Usage Monitoring
```typescript
// Track API usage and costs
interface UsageMetrics {
  provider: string;
  tokensUsed: number;
  estimatedCost: number;
  timestamp: Date;
}

function trackUsage(provider: string, tokens: number) {
  // Implement cost tracking
  const costPerToken = getCostPerToken(provider);
  const estimatedCost = tokens * costPerToken;
  
  // Log or store usage metrics
  console.log(`${provider}: ${tokens} tokens, ~$${estimatedCost}`);
}
```

### Budget Alerts
- Set up billing alerts with each API provider
- Implement usage limits in application
- Monitor costs through provider dashboards
- Consider implementing usage caps per session
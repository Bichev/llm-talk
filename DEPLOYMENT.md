# 🚀 Vercel Deployment Guide

This guide will help you deploy LLM-Talk to Vercel for production use.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code pushed to GitHub
3. **Supabase Project**: Database setup complete
4. **API Keys**: At minimum OpenAI API key

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `Bichev/llm-talk`
4. Vercel will automatically detect it's a Next.js project

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

#### Required Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Optional Variables (for full functionality):
```env
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_API_KEY=your-google-api-key-here
PERPLEXITY_API_KEY=pplx-your-perplexity-key-here
```

#### Application Variables:
```env
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### 4. Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### 5. Deploy

1. Click **Deploy** in Vercel dashboard
2. Wait for build to complete (2-5 minutes)
3. Your app will be available at `https://your-app-name.vercel.app`

## 🔍 Post-Deployment Verification

### 1. Test Basic Functionality
- Visit your deployed URL
- Check that the home page loads correctly
- Verify the test interface is accessible

### 2. Test Database Connection
- Try creating a session
- Check Supabase dashboard for new records
- Verify real-time subscriptions work

### 3. Test LLM Integration
- Start a session with OpenAI
- Send a test message
- Verify analytics update correctly

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run type-check  # Fix TypeScript errors
npm run lint:fix    # Fix ESLint issues
```

#### Environment Variable Issues
- Ensure all required variables are set
- Check variable names match exactly
- Verify no extra spaces or quotes

#### Database Connection Issues
- Verify Supabase URL and keys
- Check CORS settings in Supabase
- Ensure database tables exist

#### API Route Issues
- Check function timeout settings (max 30s)
- Verify API key permissions
- Monitor Vercel function logs

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=llm-talk:*
```

## 📊 Performance Optimization

### Vercel-Specific Optimizations

1. **Edge Functions**: Consider moving API routes to Edge Runtime
2. **Image Optimization**: Already configured in `next.config.js`
3. **Bundle Analysis**: Use `@next/bundle-analyzer` for optimization
4. **Caching**: Implement proper caching strategies

### Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Function Logs**: Monitor API performance
3. **Error Tracking**: Set up error monitoring
4. **Performance**: Use Vercel Speed Insights

## 🔄 Continuous Deployment

### Automatic Deployments
- Push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Branch-specific deployments for testing

### Manual Deployments
```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --env production
```

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to repository
- Use Vercel's environment variable system
- Rotate keys regularly

### API Security
- Implement rate limiting
- Add request validation
- Monitor for abuse

### Database Security
- Use Row Level Security (RLS) in Supabase
- Implement proper authentication
- Regular security audits

## 📈 Scaling Considerations

### Vercel Limits
- **Function Execution**: 30s timeout (Pro plan: 60s)
- **Bandwidth**: 100GB/month (Hobby plan)
- **Build Time**: 45 minutes (Hobby plan)

### Optimization Tips
- Use Edge Runtime for API routes
- Implement proper caching
- Optimize bundle size
- Use CDN for static assets

## 🆘 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

### Project Support
- [GitHub Issues](https://github.com/Bichev/llm-talk/issues)
- [GitHub Discussions](https://github.com/Bichev/llm-talk/discussions)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Home page loads
- [ ] Test interface accessible
- [ ] Database connection works
- [ ] LLM integration functional
- [ ] Analytics working
- [ ] Performance acceptable

## 🎉 Success!

Your LLM-Talk platform is now live on Vercel! 

**Next Steps:**
1. Share your deployed URL
2. Monitor performance and usage
3. Gather user feedback
4. Plan feature enhancements

---

**Built by [Vladimir Bichev](https://vladbichev.com) with ❤️ for the AI research community**

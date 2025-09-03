# LLM-Talk: Database Setup with Supabase

## Why Supabase?

**Perfect for LLM-Talk because:**
- 🆓 **Generous Free Tier**: 500MB database, 5GB bandwidth, 2GB file storage
- 🔄 **Real-time Subscriptions**: Perfect for live conversation updates
- 🐘 **PostgreSQL**: Advanced JSON support for session states and analytics
- 🚀 **Vercel Integration**: Seamless deployment with zero configuration
- 📊 **Built-in Analytics**: Dashboard for monitoring database performance
- 🔐 **Row Level Security**: Fine-grained access control when needed

## Quick Setup Guide

### 1. Create Supabase Project
```bash
# Visit https://supabase.com and sign up
# Create new project:
# - Name: llm-talk
# - Region: Choose closest to your users
# - Plan: Free tier
```

### 2. Run Database Schema
Copy and paste this SQL in the Supabase SQL Editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table: Core conversation metadata
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('running', 'completed', 'stopped', 'error')) DEFAULT 'running',
  
  -- Configuration
  config JSONB NOT NULL,
  topic TEXT NOT NULL,
  scenario TEXT NOT NULL CHECK (scenario IN ('cooperative', 'debate', 'creative', 'problem-solving')),
  max_iterations INTEGER NOT NULL CHECK (max_iterations > 0 AND max_iterations <= 200),
  
  -- Current state
  current_iteration INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Aggregated analytics
  total_tokens INTEGER DEFAULT 0,
  efficiency_score DECIMAL(5,4),
  avg_response_time INTEGER,
  
  -- Optional metadata
  user_ip INET,
  user_agent TEXT
);

-- Participants: Individual LLM configurations per session
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  
  -- LLM configuration
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'claude', 'gemini', 'perplexity')),
  model TEXT NOT NULL,
  temperature DECIMAL(3,2) NOT NULL CHECK (temperature >= 0 AND temperature <= 2),
  config JSONB DEFAULT '{}',
  
  -- Performance metrics
  total_messages INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  average_response_time INTEGER,
  efficiency_trend DECIMAL[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique participant names per session
  UNIQUE(session_id, name)
);

-- Messages: Individual conversation messages with evolution tracking
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  
  -- Message sequence and content
  iteration INTEGER NOT NULL CHECK (iteration > 0),
  original_prompt TEXT, -- The prompt sent to the LLM
  evolved_message TEXT NOT NULL, -- The LLM's efficient response
  translation TEXT, -- Human-readable translation if needed
  
  -- Metadata
  token_count JSONB NOT NULL, -- {input: number, output: number, total: number}
  processing_time INTEGER CHECK (processing_time >= 0), -- milliseconds
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evolution analysis
  evolution_markers TEXT[] DEFAULT '{}', -- ['symbol_introduction', 'pattern_change', etc.]
  efficiency_score DECIMAL(5,4),
  
  -- Ensure message order integrity
  UNIQUE(session_id, iteration, participant_id)
);

-- Analytics snapshots: Periodic analytics for trend analysis
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  
  -- Snapshot timing
  iteration INTEGER NOT NULL CHECK (iteration >= 0),
  
  -- Analytics data (stored as JSON for flexibility)
  metrics JSONB NOT NULL DEFAULT '{}', -- Current metrics
  trends JSONB NOT NULL DEFAULT '{}',  -- Trend calculations
  patterns JSONB NOT NULL DEFAULT '{}', -- Pattern detection results
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One snapshot per iteration per session
  UNIQUE(session_id, iteration)
);

-- Performance indexes
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX idx_sessions_config ON sessions USING GIN(config);
CREATE INDEX idx_sessions_updated_at ON sessions(updated_at DESC);

CREATE INDEX idx_participants_session ON participants(session_id);
CREATE INDEX idx_participants_provider ON participants(provider);

CREATE INDEX idx_messages_session_iteration ON messages(session_id, iteration);
CREATE INDEX idx_messages_participant ON messages(participant_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX idx_messages_evolution_markers ON messages USING GIN(evolution_markers);

CREATE INDEX idx_analytics_session ON analytics_snapshots(session_id, iteration);
CREATE INDEX idx_analytics_created_at ON analytics_snapshots(created_at DESC);

-- Row Level Security setup for public access (MVP approach)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Public access policies for MVP (tighten later if needed)
CREATE POLICY "Public read/write sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write participants" ON participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write analytics" ON analytics_snapshots FOR ALL USING (true) WITH CHECK (true);

-- Utility functions for complex operations

-- Function: Add message and update session statistics atomically
CREATE OR REPLACE FUNCTION add_message_with_stats(
  p_session_id UUID,
  p_participant_id UUID,
  p_iteration INTEGER,
  p_original_prompt TEXT,
  p_evolved_message TEXT,
  p_translation TEXT,
  p_token_count JSONB,
  p_processing_time INTEGER,
  p_evolution_markers TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  message_id UUID;
  token_total INTEGER;
BEGIN
  -- Validate inputs
  IF p_session_id IS NULL OR p_participant_id IS NULL OR p_evolved_message IS NULL OR p_token_count IS NULL THEN
    RAISE EXCEPTION 'Required parameters cannot be null';
  END IF;
  
  -- Insert message
  INSERT INTO messages (
    session_id, participant_id, iteration, 
    original_prompt, evolved_message, translation, 
    token_count, processing_time, evolution_markers
  )
  VALUES (
    p_session_id, p_participant_id, p_iteration,
    p_original_prompt, p_evolved_message, p_translation,
    p_token_count, p_processing_time, p_evolution_markers
  )
  RETURNING id INTO message_id;
  
  -- Extract token total safely
  token_total := COALESCE((p_token_count->>'total')::INTEGER, 0);
  
  -- Update session statistics
  UPDATE sessions SET
    current_iteration = GREATEST(current_iteration, p_iteration),
    total_messages = total_messages + 1,
    total_tokens = total_tokens + token_total,
    updated_at = NOW()
  WHERE id = p_session_id;
  
  -- Update participant statistics
  UPDATE participants SET
    total_messages = total_messages + 1,
    total_tokens = total_tokens + token_total
  WHERE id = p_participant_id;
  
  RETURN message_id;
END;
$$;

-- Function: Complete session and calculate final analytics
CREATE OR REPLACE FUNCTION complete_session(
  p_session_id UUID,
  p_status TEXT DEFAULT 'completed'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_stats JSONB;
  efficiency_improvement DECIMAL;
  total_time_ms INTEGER;
BEGIN
  -- Validate session exists and is active
  IF NOT EXISTS (SELECT 1 FROM sessions WHERE id = p_session_id AND status = 'running') THEN
    RAISE EXCEPTION 'Session not found or not active: %', p_session_id;
  END IF;
  
  -- Calculate session duration
  SELECT EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
  INTO total_time_ms
  FROM sessions WHERE id = p_session_id;
  
  -- Calculate efficiency improvement (simplified)
  WITH message_efficiency AS (
    SELECT 
      iteration,
      (token_count->>'total')::INTEGER as tokens,
      ROW_NUMBER() OVER (ORDER BY iteration) as rn,
      COUNT(*) OVER () as total_messages
    FROM messages 
    WHERE session_id = p_session_id
    ORDER BY iteration
  ),
  efficiency_trend AS (
    SELECT 
      CASE 
        WHEN total_messages > 5 THEN
          ((SELECT tokens FROM message_efficiency WHERE rn = 1) - 
           (SELECT tokens FROM message_efficiency WHERE rn = total_messages)) * 100.0 / 
           (SELECT tokens FROM message_efficiency WHERE rn = 1)
        ELSE 0
      END as improvement
    FROM message_efficiency LIMIT 1
  )
  SELECT COALESCE(improvement, 0) INTO efficiency_improvement FROM efficiency_trend;
  
  -- Update session with completion data
  UPDATE sessions SET 
    status = p_status,
    completed_at = NOW(),
    efficiency_score = efficiency_improvement
  WHERE id = p_session_id;
  
  -- Generate summary statistics
  SELECT jsonb_build_object(
    'sessionId', p_session_id,
    'status', p_status,
    'duration', total_time_ms,
    'totalMessages', total_messages,
    'totalTokens', total_tokens,
    'efficiencyImprovement', efficiency_improvement,
    'averageResponseTime', avg_response_time,
    'completedAt', completed_at
  )
  INTO session_stats
  FROM sessions WHERE id = p_session_id;
  
  RETURN session_stats;
END;
$$;

-- Create indexes on JSONB fields for better query performance
CREATE INDEX idx_messages_token_count ON messages USING GIN(token_count);
CREATE INDEX idx_analytics_metrics ON analytics_snapshots USING GIN(metrics);
CREATE INDEX idx_analytics_trends ON analytics_snapshots USING GIN(trends);
CREATE INDEX idx_analytics_patterns ON analytics_snapshots USING GIN(patterns);
```

### 3. Get Your Credentials
After creating the project, go to **Settings → API** and copy:

```bash
# Add these to your .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Enable Real-time (Optional)
For live conversation updates:
1. Go to **Database → Replication**
2. Enable real-time for:
   - `messages` table
   - `sessions` table

## Database Operations Examples

### Basic Session Management
```typescript
// Create new session
const { data: session, error } = await supabase
  .from('sessions')
  .insert({
    config: sessionConfig,
    topic: 'AI Evolution Discussion',
    scenario: 'debate',
    max_iterations: 20
  })
  .select()
  .single();

// Add participants
const participants = await Promise.all([
  supabase.from('participants').insert({
    session_id: session.id,
    name: 'GPT-4',
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7
  }),
  supabase.from('participants').insert({
    session_id: session.id,
    name: 'Claude',
    provider: 'claude',
    model: 'claude-3-sonnet',
    temperature: 0.8
  })
]);
```

### Real-time Message Subscription
```typescript
// Subscribe to new messages
const subscription = supabase
  .channel(`session:${sessionId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `session_id=eq.${sessionId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
      // Update UI with new message
    }
  )
  .subscribe();
```

### Analytics Queries
```typescript
// Get session efficiency trends
const { data: trends } = await supabase
  .from('messages')
  .select('iteration, token_count, efficiency_score')
  .eq('session_id', sessionId)
  .order('iteration');

// Get provider comparison
const { data: comparison } = await supabase
  .from('participants')
  .select(`
    name,
    provider,
    total_messages,
    total_tokens,
    average_response_time
  `)
  .eq('session_id', sessionId);
```

## Migration and Maintenance

### Schema Updates
When updating the schema, use migrations:

```sql
-- Example migration: Add new column
ALTER TABLE sessions ADD COLUMN experiment_type TEXT DEFAULT 'standard';

-- Update existing rows
UPDATE sessions SET experiment_type = 'standard' WHERE experiment_type IS NULL;

-- Add constraint
ALTER TABLE sessions ADD CONSTRAINT chk_experiment_type 
  CHECK (experiment_type IN ('standard', 'efficiency', 'creativity'));
```

### Data Cleanup
```sql
-- Clean up old completed sessions (older than 30 days)
DELETE FROM sessions 
WHERE status = 'completed' 
  AND completed_at < NOW() - INTERVAL '30 days';

-- Clean up failed sessions with no messages
DELETE FROM sessions 
WHERE status = 'error' 
  AND total_messages = 0 
  AND created_at < NOW() - INTERVAL '1 day';
```

### Monitoring Queries
```sql
-- Session statistics
SELECT 
  status,
  COUNT(*) as count,
  AVG(total_messages) as avg_messages,
  AVG(total_tokens) as avg_tokens
FROM sessions 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;

-- Provider performance
SELECT 
  provider,
  COUNT(*) as sessions,
  AVG(total_tokens) as avg_tokens,
  AVG(average_response_time) as avg_response_time
FROM participants p
JOIN sessions s ON p.session_id = s.id
WHERE s.created_at > NOW() - INTERVAL '7 days'
GROUP BY provider;
```

## Cost Management

### Free Tier Limits
- **Database size**: 500MB
- **Bandwidth**: 5GB/month  
- **API requests**: 50,000/month
- **Real-time connections**: 200 concurrent

### Optimization Tips
1. **Regular cleanup**: Remove old sessions
2. **Efficient queries**: Use indexes properly
3. **JSON optimization**: Don't store massive JSON blobs
4. **Connection pooling**: Supabase handles this automatically
5. **Monitor usage**: Check dashboard regularly

### Scaling Strategy
When approaching limits:
1. **Upgrade to Pro**: $25/month for 8GB + more bandwidth
2. **Archive old data**: Export and remove old sessions
3. **Optimize JSON storage**: Compress large analytics objects
4. **Database optimization**: Review slow queries

## Troubleshooting

### Common Issues

**Connection errors**:
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Permission errors**:
```sql
-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'sessions';
```

**Performance issues**:
```sql
-- Check index usage
EXPLAIN ANALYZE SELECT * FROM messages WHERE session_id = 'uuid';
```

**Real-time not working**:
1. Check if replication is enabled for the table
2. Verify subscription code
3. Check browser console for connection errors

### Support Resources
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **PostgreSQL Documentation**: [postgresql.org/docs](https://postgresql.org/docs)
- **Community Support**: [supabase.com/dashboard/support](https://supabase.com/dashboard/support)
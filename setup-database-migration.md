# Database Migration: Update Scenario Constraint

## Issue
The database has a check constraint `sessions_scenario_check` that only allows the old scenario values:
- `cooperative`
- `debate` 
- `creative`
- `problem-solving`

But we've updated the application to use new communication evolution scenarios:
- `protocol-evolution`
- `semantic-compression`
- `symbol-invention`
- `meta-communication`

## Solution
Run the migration script to update the database constraint.

## Steps

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrations/update_scenario_constraint.sql`
4. Execute the script

### Option 2: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db reset
# or
supabase db push
```

### Option 3: Direct SQL Execution
If you have direct database access, run:
```sql
-- Drop the existing check constraint
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_scenario_check;

-- Add the new check constraint with communication evolution scenarios
ALTER TABLE sessions ADD CONSTRAINT sessions_scenario_check 
CHECK (scenario IN ('protocol-evolution', 'semantic-compression', 'symbol-invention', 'meta-communication'));

-- Update any existing sessions with old scenario values to the new default
UPDATE sessions 
SET scenario = 'protocol-evolution' 
WHERE scenario IN ('cooperative', 'debate', 'creative', 'problem-solving');
```

## Verification
After running the migration, you can verify it worked by:
1. Starting a new session in the test interface
2. The error should be resolved
3. You should be able to select the new communication evolution scenarios

## Rollback (if needed)
If you need to rollback:
```sql
-- Drop the new constraint
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_scenario_check;

-- Restore the old constraint
ALTER TABLE sessions ADD CONSTRAINT sessions_scenario_check 
CHECK (scenario IN ('cooperative', 'debate', 'creative', 'problem-solving'));
```

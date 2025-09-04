-- Migration: Update scenario constraint to support new communication evolution scenarios
-- Date: 2024-01-XX
-- Description: Replace old conversation scenarios with new AI communication evolution scenarios

-- Drop the existing check constraint
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_scenario_check;

-- Add the new check constraint with communication evolution scenarios
ALTER TABLE sessions ADD CONSTRAINT sessions_scenario_check 
CHECK (scenario IN ('protocol-evolution', 'semantic-compression', 'symbol-invention', 'meta-communication'));

-- Update any existing sessions with old scenario values to the new default
UPDATE sessions 
SET scenario = 'protocol-evolution' 
WHERE scenario IN ('cooperative', 'debate', 'creative', 'problem-solving');

-- Verify the constraint is working
SELECT scenario, COUNT(*) as count 
FROM sessions 
GROUP BY scenario;

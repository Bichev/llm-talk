-- Migration: Fix efficiency_score field precision to handle high efficiency values
-- Date: 2024-01-XX
-- Description: The efficiency_score field is currently numeric(5,4) which can only store values up to 9.9999
-- But our communication evolution experiments are achieving efficiency improvements of 98%+ (0.98+)
-- We need to increase the precision to handle these values

-- First, let's check the current constraint
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'sessions' AND column_name = 'efficiency_score';

-- Update the efficiency_score column to handle larger values
-- Change from numeric(5,4) to numeric(6,4) to allow values up to 99.9999
ALTER TABLE sessions 
ALTER COLUMN efficiency_score TYPE numeric(6,4);

-- Also check if there are similar issues with other numeric fields
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
AND data_type = 'numeric';

-- Verify the change
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'sessions' AND column_name = 'efficiency_score';

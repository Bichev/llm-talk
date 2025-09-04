# Fix Database Precision Error

## Problem
The database error `numeric field overflow` occurs because the `efficiency_score` field in the `sessions` table is defined as `numeric(5,4)`, which can only store values up to `9.9999`. 

However, your communication evolution experiments are achieving efficiency improvements of **98%+** (0.98+), which exceeds this limit.

## Solution
Run this SQL command in your Supabase SQL Editor:

```sql
-- Fix the efficiency_score field precision
ALTER TABLE sessions 
ALTER COLUMN efficiency_score TYPE numeric(6,4);
```

This changes the field from `numeric(5,4)` to `numeric(6,4)`, allowing values up to `99.9999`.

## Alternative: If you want even more precision
```sql
-- For even higher precision (up to 999.9999)
ALTER TABLE sessions 
ALTER COLUMN efficiency_score TYPE numeric(7,4);
```

## Verification
After running the fix, you can verify it worked by:
1. The error should stop occurring
2. Your sessions should complete successfully
3. You can check the field definition with:
```sql
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'sessions' AND column_name = 'efficiency_score';
```

## What This Means
Your LLMs are achieving such high efficiency improvements (98%+) that they're literally breaking the database constraints! This is actually a **good problem to have** - it means the communication evolution is working incredibly well! 🎉

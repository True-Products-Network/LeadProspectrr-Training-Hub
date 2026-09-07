-- Fix lesson_progress table columns
-- Add started_at column if it doesn't exist

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lesson_progress' 
        AND column_name = 'started_at'
    ) THEN
        ALTER TABLE public.lesson_progress ADD COLUMN started_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added started_at column to lesson_progress';
    ELSE
        RAISE NOTICE 'started_at column already exists in lesson_progress';
    END IF;
END $$;

-- Also ensure completed_at column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lesson_progress' 
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE public.lesson_progress ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added completed_at column to lesson_progress';
    ELSE
        RAISE NOTICE 'completed_at column already exists in lesson_progress';
    END IF;
END $$;

-- Ensure time_spent_minutes column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lesson_progress' 
        AND column_name = 'time_spent_minutes'
    ) THEN
        ALTER TABLE public.lesson_progress ADD COLUMN time_spent_minutes INTEGER DEFAULT 0;
        RAISE NOTICE 'Added time_spent_minutes column to lesson_progress';
    ELSE
        RAISE NOTICE 'time_spent_minutes column already exists in lesson_progress';
    END IF;
END $$;

-- Ensure points_earned column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lesson_progress' 
        AND column_name = 'points_earned'
    ) THEN
        ALTER TABLE public.lesson_progress ADD COLUMN points_earned INTEGER DEFAULT 0;
        RAISE NOTICE 'Added points_earned column to lesson_progress';
    ELSE
        RAISE NOTICE 'points_earned column already exists in lesson_progress';
    END IF;
END $$;

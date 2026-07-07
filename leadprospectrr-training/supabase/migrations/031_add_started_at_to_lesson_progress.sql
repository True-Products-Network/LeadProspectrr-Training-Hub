-- Add started_at column to lesson_progress if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'lesson_progress' 
        AND column_name = 'started_at'
    ) THEN
        ALTER TABLE public.lesson_progress ADD COLUMN started_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Fix current_modules view to use SECURITY INVOKER instead of SECURITY DEFINER
-- This ensures the view respects the permissions of the querying user, not the creator

DROP VIEW IF EXISTS public.current_modules;

CREATE OR REPLACE VIEW public.current_modules
WITH (SECURITY_INVOKER)
AS
SELECT *
FROM public.training_modules
WHERE is_active = true
  AND year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY week_number;

-- Grant permissions on the view
GRANT SELECT ON public.current_modules TO authenticated;
GRANT SELECT ON public.current_modules TO anon;

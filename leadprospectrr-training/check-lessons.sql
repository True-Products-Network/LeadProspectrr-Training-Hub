-- Check all lessons in Module 1
SELECT 
    l.lesson_number,
    l.title,
    l.slug,
    l.is_published,
    l.sort_order,
    l.module_id,
    m.title as module_title,
    m.week_number
FROM public.lessons l
JOIN public.training_modules m ON l.module_id = m.id
WHERE m.week_number = 1
ORDER BY l.lesson_number;

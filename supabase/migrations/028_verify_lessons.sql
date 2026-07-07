-- Verify all lessons are properly configured

DO $$
DECLARE
  v_module_id UUID;
  v_count INTEGER;
  v_published_count INTEGER;
  rec RECORD;
BEGIN
  -- Get Module 1
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = 1 LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'ERROR: Module 1 not found';
    RETURN;
  END IF;

  RAISE NOTICE 'Module 1 ID: %', v_module_id;
  
  -- Count total lessons
  SELECT COUNT(*) INTO v_count FROM public.lessons WHERE module_id = v_module_id;
  RAISE NOTICE 'Total lessons in Module 1: %', v_count;
  
  -- Count published lessons
  SELECT COUNT(*) INTO v_published_count FROM public.lessons WHERE module_id = v_module_id AND is_published = true;
  RAISE NOTICE 'Published lessons in Module 1: %', v_published_count;
  
  -- List all lessons
  RAISE NOTICE '--- All Lessons ---';
  FOR rec IN 
    SELECT lesson_number, title, slug, is_published, sort_order 
    FROM public.lessons 
    WHERE module_id = v_module_id
    ORDER BY lesson_number
  LOOP
    RAISE NOTICE 'Lesson %: % (%) - Published: %, Sort: %', 
      rec.lesson_number, rec.title, rec.slug, rec.is_published, rec.sort_order;
  END LOOP;
  
  -- Fix any issues
  IF v_published_count < v_count THEN
    RAISE NOTICE 'Fixing: Setting all lessons to published...';
    UPDATE public.lessons SET is_published = true WHERE module_id = v_module_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM public.lessons WHERE module_id = v_module_id AND sort_order IS NULL) THEN
    RAISE NOTICE 'Fixing: Setting sort_order to match lesson_number...';
    UPDATE public.lessons SET sort_order = lesson_number WHERE module_id = v_module_id;
  END IF;
  
  RAISE NOTICE 'Done!';
END $$;

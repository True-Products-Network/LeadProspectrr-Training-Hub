-- Insert Module 2 lessons if they don't exist
-- Module 2: Contacts and Smart Lists

DO $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Get Module 2
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = 2 LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'ERROR: Module 2 not found';
    RETURN;
  END IF;

  RAISE NOTICE 'Module 2 ID: %', v_module_id;

  -- Lesson 1: Why Contacts Matter
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 1, 'Why Contacts Matter', 'why-contacts-matter',
    'Understand why the Contacts page is one of the most important areas in LeadProspectrr.',
    '<div class="p-4"><h2>Why Contacts Matter</h2><p>Your Contacts page shows all the people in your CRM.</p></div>',
    'standard', 10, 10, true, 1
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 2: Review the Contacts Page
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 2, 'Review the Contacts Page', 'review-contacts-page',
    'Learn how to navigate and understand your Contacts page layout.',
    '<div class="p-4"><h2>Review Contacts Page</h2><p>Navigate your contacts and understand the layout.</p></div>',
    'standard', 10, 10, true, 2
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 3: Open a Contact Record
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 3, 'Open a Contact Record', 'open-contact-record',
    'Learn how to open and view individual contact details.',
    '<div class="p-4"><h2>Open Contact Record</h2><p>View individual contact details.</p></div>',
    'standard', 10, 10, true, 3
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 4: Understand Contact Details
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 4, 'Understand Contact Details', 'understand-contact-details',
    'Learn what information is stored in a contact record.',
    '<div class="p-4"><h2>Contact Details</h2><p>Understand what information is stored.</p></div>',
    'standard', 10, 10, true, 4
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 5: Tags, Filters, and Smart Lists
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 5, 'Tags, Filters, and Smart Lists', 'tags-filters-smart-lists',
    'Understand the tools for organizing and finding contacts.',
    '<div class="p-4"><h2>Tags and Filters</h2><p>Learn about organizing contacts.</p></div>',
    'standard', 10, 10, true, 5
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 6: Before Building a Smart List
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 6, 'Before Building a Smart List', 'before-building-smart-list',
    'Plan your Smart List before you start building it.',
    '<div class="p-4"><h2>Plan Your Smart List</h2><p>What do you want to find?</p></div>',
    'standard', 10, 10, true, 6
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 7: Build Filters
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 7, 'Build Filters', 'build-filters',
    'Learn how to create filters to find specific contacts.',
    '<div class="p-4"><h2>Build Filters</h2><p>Create filters to find contacts.</p></div>',
    'standard', 15, 15, true, 7
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 8: Save a Smart List
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 8, 'Save a Smart List', 'save-smart-list',
    'Save your filtered results as a reusable Smart List.',
    '<div class="p-4"><h2>Save Smart List</h2><p>Save your filters for later use.</p></div>',
    'standard', 10, 10, true, 8
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 9: Use a Smart List
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 9, 'Use a Smart List', 'use-smart-list',
    'Learn how to use your saved Smart Lists.',
    '<div class="p-4"><h2>Use Smart List</h2><p>Access and use your saved lists.</p></div>',
    'standard', 10, 10, true, 9
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  -- Lesson 10: Edit and Reuse Smart Lists
  INSERT INTO public.lessons (
    module_id, lesson_number, title, slug, description, content, 
    lesson_type, duration_minutes, points, is_published, sort_order
  ) VALUES (
    v_module_id, 10, 'Edit and Reuse Smart Lists', 'edit-reuse-smart-lists',
    'Learn how to update and reuse your Smart Lists over time.',
    '<div class="p-4"><h2>Edit Smart Lists</h2><p>Update and reuse your lists.</p></div>',
    'standard', 10, 10, true, 10
  ) ON CONFLICT (slug) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    lesson_number = EXCLUDED.lesson_number,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = true;

  RAISE NOTICE 'Module 2 lessons inserted/updated successfully';
END $$;

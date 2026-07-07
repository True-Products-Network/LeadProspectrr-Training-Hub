-- Ensure all 11 lessons exist for Module 1

DO $$
DECLARE
  v_module_id UUID;
  v_count INTEGER;
BEGIN
  -- Get Module 1
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = 1 LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'ERROR: Module 1 not found';
    RETURN;
  END IF;

  -- Count current lessons
  SELECT COUNT(*) INTO v_count FROM public.lessons WHERE module_id = v_module_id;
  RAISE NOTICE 'Current lessons in Module 1: %', v_count;

  -- Lesson 2: Planning Your Blog Post
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'planning-your-blog-post' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 2, 'Planning Your Blog Post', 'planning-your-blog-post', 'Plan a simple blog post that answers one customer question.', '<div class="p-4"><h2>Planning</h2><p>Plan your content before writing.</p></div>', 'standard', 10, 10, true, 2);
    RAISE NOTICE 'Created lesson 2';
  END IF;

  -- Lesson 3: Blog Settings Overview
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'blog-settings-overview' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 3, 'Blog Settings Overview', 'blog-settings-overview', 'Understand the blog settings before creating your first post.', '<div class="p-4"><h2>Settings</h2><p>Review blog settings first.</p></div>', 'standard', 10, 10, true, 3);
    RAISE NOTICE 'Created lesson 3';
  END IF;

  -- Lesson 4: Creating a New Blog Post
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'creating-a-new-blog-post' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 4, 'Creating a New Blog Post', 'creating-a-new-blog-post', 'Create a new blog post and add the basic details.', '<div class="p-4"><h2>Create Post</h2><p>Create your new blog post.</p></div>', 'standard', 10, 10, true, 4);
    RAISE NOTICE 'Created lesson 4';
  END IF;

  -- Lesson 5: Write and Format Your Content
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'write-and-format-your-content' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 5, 'Write and Format Your Content', 'write-and-format-your-content', 'Add and format the main content of your blog post.', '<div class="p-4"><h2>Content</h2><p>Write your blog content.</p></div>', 'standard', 15, 15, true, 5);
    RAISE NOTICE 'Created lesson 5';
  END IF;

  -- Lesson 6: Adding Images and Links
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'adding-images-and-links' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 6, 'Adding Images and Links', 'adding-images-and-links', 'Add images and links to make your post more engaging.', '<div class="p-4"><h2>Images</h2><p>Add images and links.</p></div>', 'standard', 10, 10, true, 6);
    RAISE NOTICE 'Created lesson 6';
  END IF;

  -- Lesson 7: Add Categories, Tags, and Author
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'add-categories-tags-and-author' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 7, 'Add Categories, Tags, and Author', 'add-categories-tags-and-author', 'Set the category, tags, and author for the blog post.', '<div class="p-4"><h2>Categories</h2><p>Set categories and tags.</p></div>', 'standard', 10, 10, true, 7);
    RAISE NOTICE 'Created lesson 7';
  END IF;

  -- Lesson 8: SEO Basics
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'seo-basics' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 8, 'SEO Basics', 'seo-basics', 'Complete the basic SEO settings for the blog post.', '<div class="p-4"><h2>SEO</h2><p>Add SEO settings.</p></div>', 'standard', 10, 10, true, 8);
    RAISE NOTICE 'Created lesson 8';
  END IF;

  -- Lesson 9: Preview and Review
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'preview-and-review' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 9, 'Preview and Review', 'preview-and-review', 'Check the post before publishing.', '<div class="p-4"><h2>Preview</h2><p>Preview your post.</p></div>', 'standard', 10, 10, true, 9);
    RAISE NOTICE 'Created lesson 9';
  END IF;

  -- Lesson 10: Publish or Schedule
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'publish-or-schedule' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 10, 'Publish or Schedule', 'publish-or-schedule', 'Publish the blog post now or schedule it for later.', '<div class="p-4"><h2>Publish</h2><p>Publish or schedule.</p></div>', 'standard', 10, 10, true, 10);
    RAISE NOTICE 'Created lesson 10';
  END IF;

  -- Lesson 11: Share Your Blog Post
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE slug = 'sharing-your-blog-post' AND module_id = v_module_id) THEN
    INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, content, lesson_type, duration_minutes, points, is_published, sort_order)
    VALUES (v_module_id, 11, 'Share Your Blog Post', 'sharing-your-blog-post', 'Use your published post as part of your follow-up and marketing.', '<div class="p-4"><h2>Share</h2><p>Share your post.</p></div>', 'standard', 15, 20, true, 11);
    RAISE NOTICE 'Created lesson 11';
  END IF;

  -- Final count
  SELECT COUNT(*) INTO v_count FROM public.lessons WHERE module_id = v_module_id;
  RAISE NOTICE 'Total lessons in Module 1 after fix: %', v_count;

END $$;

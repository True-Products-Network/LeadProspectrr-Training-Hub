-- Insert missing lessons 9, 10, 11 for Module 1

DO $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Get Module 1
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = 1 LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'Module 1 not found';
    RETURN;
  END IF;

  -- Lesson 9: Preview and Review
  INSERT INTO public.lessons (
    module_id,
    lesson_number,
    title,
    slug,
    description,
    content,
    lesson_type,
    duration_minutes,
    points,
    is_published,
    sort_order
  ) VALUES (
    v_module_id,
    9,
    'Preview and Review',
    'preview-and-review',
    'Check the post before publishing.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Check the post before publishing.</p>
      
      <h2>Preview Your Post</h2>
      <p>Before publishing, always preview your post. This helps you catch mistakes before your audience sees them.</p>
      
      <p>Preview checklist:</p>
      <ul>
        <li>Click the Preview button</li>
        <li>Check the desktop view</li>
        <li>Check the mobile view</li>
        <li>Make sure all links work</li>
        <li>Proofread for spelling and grammar</li>
        <li>Confirm the featured image displays correctly</li>
        <li>Check that the call to action is clear</li>
      </ul>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3 class="font-semibold text-blue-900">Key Point</h3>
        <p class="text-blue-800">Preview before publishing. It is easier to fix mistakes before the post goes live.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Click Preview to see how your post looks</li>
        <li>Switch to mobile view and check formatting</li>
        <li>Click every link to make sure it works</li>
      </ol>
    </div>',
    'standard',
    10,
    10,
    true,
    9
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 10: Publish or Schedule
  INSERT INTO public.lessons (
    module_id,
    lesson_number,
    title,
    slug,
    description,
    content,
    lesson_type,
    duration_minutes,
    points,
    is_published,
    sort_order
  ) VALUES (
    v_module_id,
    10,
    'Publish or Schedule',
    'publish-or-schedule',
    'Publish the blog post now or schedule it for later.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Publish the blog post now or schedule it for later.</p>
      
      <h2>Publishing Options</h2>
      <p>You have two options for publishing:</p>
      
      <h3>Option A: Publish Now</h3>
      <p>Use this when the post is ready to go live immediately.</p>
      <ol>
        <li>Click the Publish button</li>
        <li>Confirm the post is live</li>
        <li>Copy the blog post URL</li>
      </ol>
      
      <h3>Option B: Schedule for Later</h3>
      <p>Use this when you want the post to go live on a future date.</p>
      <ol>
        <li>Click the dropdown next to Publish</li>
        <li>Select Schedule</li>
        <li>Choose the date and time</li>
        <li>Click Schedule</li>
      </ol>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3 class="font-semibold text-blue-900">Key Point</h3>
        <p class="text-blue-800">Publish when ready, or schedule when you want the post to go live later.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Decide: Publish now or schedule?</li>
        <li>Publish your post or schedule it</li>
        <li>Copy the blog URL for sharing</li>
      </ol>
    </div>',
    'standard',
    10,
    10,
    true,
    10
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 11: Share Your Blog Post
  INSERT INTO public.lessons (
    module_id,
    lesson_number,
    title,
    slug,
    description,
    content,
    lesson_type,
    duration_minutes,
    points,
    is_published,
    sort_order
  ) VALUES (
    v_module_id,
    11,
    'Share Your Blog Post',
    'sharing-your-blog-post',
    'Use your published post as part of your follow-up and marketing.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Use your published post as part of your follow-up and marketing.</p>
      
      <h2>Sharing Your Post</h2>
      <p>Publishing is not the final step. Once the post is live, share it to maximize its value.</p>
      
      <h3>Where to Share</h3>
      <ul>
        <li><strong>Social Media:</strong> LinkedIn, Facebook, Twitter</li>
        <li><strong>Email:</strong> Send to your email list</li>
        <li><strong>Follow-Up:</strong> Include in your CRM sequences</li>
        <li><strong>Direct:</strong> Send to specific contacts who would benefit</li>
      </ul>
      
      <h3>How to Share</h3>
      <ol>
        <li>Copy the blog post URL</li>
        <li>Write a short introduction</li>
        <li>Include the link</li>
        <li>Add a call to action</li>
      </ol>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3 class="font-semibold text-blue-900">Key Point</h3>
        <p class="text-blue-800">A blog post becomes more valuable when you share it and reuse it.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Share on one social platform</li>
        <li>Send to 3 people who would benefit</li>
        <li>Save the link for future follow-ups</li>
      </ol>
      
      <div class="bg-gradient-to-r from-blue-500 to-violet-600 text-white p-6 rounded-lg mt-8">
        <h3 class="font-bold text-xl mb-2">🎉 Congratulations!</h3>
        <p>You have completed Module 1: Creating a Blog Post in LeadProspectrr.</p>
        <p class="mt-2">You now know how to plan, create, format, optimize, publish, and share blog posts.</p>
        <p class="mt-4 font-semibold">Your next step: Create your first blog post and put what you learned into practice!</p>
      </div>
    </div>',
    'standard',
    15,
    20,
    true,
    11
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    is_published = true;

  RAISE NOTICE 'Inserted/updated lessons 9, 10, 11';
END $$;

-- Seed lessons for Module 1: Creating a Blog Post in LeadProspectrr
-- Based on the Blog Post Course content

-- First, ensure Module 1 exists
DO $$
DECLARE
  module_id UUID;
BEGIN
  -- Get or create Module 1
  SELECT id INTO module_id FROM public.training_modules WHERE week_number = 1 LIMIT 1;
  
  IF module_id IS NULL THEN
    INSERT INTO public.training_modules (
      title, 
      description, 
      week_number, 
      color, 
      status,
      is_published
    ) VALUES (
      'Creating a Blog Post in LeadProspectrr',
      'Learn how to create, format, publish, and share blog posts inside LeadProspectrr.',
      1,
      'blue',
      'active',
      true
    ) RETURNING id INTO module_id;
  END IF;

  -- Lesson 1: Why Blog Posts Matter
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
    module_id,
    1,
    'Why Blog Posts Matter',
    'why-blog-posts-matter',
    'Understand why creating blog posts inside LeadProspectrr can help your business.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Understand why creating blog posts inside LeadProspectrr can help your business.</p>
      
      <h2>Lesson Content</h2>
      <p>Blog posts are a simple way to answer questions, educate your audience, and create content you can share again and again.</p>
      
      <p>A blog post can help you:</p>
      <ul>
        <li>Explain what you do</li>
        <li>Answer common customer questions</li>
        <li>Share helpful tips</li>
        <li>Support your email marketing</li>
        <li>Give leads a reason to trust you</li>
        <li>Create content that can be shared on social media</li>
        <li>Give your follow-up emails something useful to link to</li>
      </ul>
      
      <p>Your blog content does not need to be perfect. The goal is to create useful content that helps your audience take the next step.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3 class="font-semibold text-blue-900">Key Point</h3>
        <p class="text-blue-800">Blog posts build trust and give your audience a reason to come back.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Think about one question your customers ask often</li>
        <li>Write down how you would answer it in a blog post</li>
        <li>Keep this idea ready for the next lesson</li>
      </ol>
    </div>',
    'standard',
    10,
    10,
    true,
    1
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 2: Planning Your Blog Post
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
    module_id,
    2,
    'Planning Your Blog Post',
    'planning-your-blog-post',
    'Learn how to plan your blog post before you start writing.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Learn a simple way to plan your blog post before you start writing.</p>
      
      <h2>Lesson Content</h2>
      <p>Before you create a blog post, it helps to have a plan. A simple plan keeps you focused and makes writing easier.</p>
      
      <h3>Start with One Idea</h3>
      <p>Pick one topic or question to answer. Do not try to cover everything in one post.</p>
      
      <h3>Use This Simple Structure</h3>
      <ol>
        <li><strong>Title:</strong> What is the post about?</li>
        <li><strong>Introduction:</strong> Tell the reader what they will learn</li>
        <li><strong>Main Points:</strong> 3-5 key things to cover</li>
        <li><strong>Conclusion:</strong> Summarize and give a next step</li>
      </ol>
      
      <h3>Write for Your Audience</h3>
      <p>Think about who you are helping. Use words they understand. Keep sentences short.</p>
      
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <h3 class="font-semibold text-amber-900">Quick Tip</h3>
        <p class="text-amber-800">If you can explain it to a friend, you can write a blog post about it.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Choose one topic from Lesson 1</li>
        <li>Write a working title</li>
        <li>List 3 main points you want to cover</li>
        <li>Write one sentence for the introduction</li>
      </ol>
    </div>',
    'standard',
    15,
    15,
    true,
    2
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 3: Blog Settings Overview
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
    module_id,
    3,
    'Blog Settings Overview',
    'blog-settings-overview',
    'Learn where to find the blog feature and check your settings.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Understand where the blog feature is located and what settings to check before creating your first post.</p>
      
      <h2>Lesson Content</h2>
      <p>Before you create a blog post, it is important to check your blog settings. This helps make sure your posts publish correctly.</p>
      
      <h3>Where to Find the Blog Feature</h3>
      <p>In LeadProspectrr, go to <strong>Marketing &gt; Blog</strong> in the main menu.</p>
      
      <h3>Settings to Check</h3>
      <ul>
        <li><strong>Blog Site:</strong> Confirm your blog URL and domain settings</li>
        <li><strong>Categories:</strong> Set up categories for organizing posts</li>
        <li><strong>Authors:</strong> Add author information and bios</li>
        <li><strong>SEO Defaults:</strong> Check default meta descriptions and titles</li>
      </ul>
      
      <h3>Why This Matters</h3>
      <p>Having your settings correct before you start means your posts will look professional and be properly organized from day one.</p>
      
      <div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <h3 class="font-semibold text-green-900">Remember</h3>
        <p class="text-green-800">You only need to set these up once. After that, creating posts is much faster.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Navigate to Marketing &gt; Blog in your LeadProspectrr account</li>
        <li>Review your blog site settings</li>
        <li>Check that categories are set up</li>
        <li>Verify author information is correct</li>
      </ol>
    </div>',
    'standard',
    12,
    12,
    true,
    3
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 4: Creating a New Blog Post
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
    module_id,
    4,
    'Creating a New Blog Post',
    'creating-a-new-blog-post',
    'Learn how to create and format your blog post content.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Learn how to create a new blog post and format your content for readability.</p>
      
      <h2>Lesson Content</h2>
      <p>Now that your settings are ready, it is time to create your first blog post.</p>
      
      <h3>Starting a New Post</h3>
      <ol>
        <li>Go to <strong>Marketing &gt; Blog</strong></li>
        <li>Click the <strong>New Post</strong> button</li>
        <li>Enter your post title</li>
        <li>Start writing in the content editor</li>
      </ol>
      
      <h3>Formatting Best Practices</h3>
      <ul>
        <li><strong>Use Headings:</strong> Break up content with H2 and H3 headings</li>
        <li><strong>Short Paragraphs:</strong> Keep paragraphs to 2-3 sentences</li>
        <li><strong>Bullet Points:</strong> Use lists for easy scanning</li>
        <li><strong>Bold Text:</strong> Highlight important information</li>
        <li><strong>White Space:</strong> Leave room between sections</li>
      </ul>
      
      <h3>Making Content Readable</h3>
      <p>Most people scan blog posts rather than reading every word. Make it easy for them:</p>
      <ul>
        <li>Put key information first</li>
        <li>Use descriptive headings</li>
        <li>Keep sentences simple</li>
        <li>Break up long sections</li>
      </ul>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3 class="font-semibold text-blue-900">Key Point</h3>
        <p class="text-blue-800">Good formatting makes your content easier to read and more likely to be shared.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Click New Post in your LeadProspectrr blog</li>
        <li>Enter your planned title</li>
        <li>Write your introduction paragraph</li>
        <li>Add headings for your main points</li>
        <li>Save as draft</li>
      </ol>
    </div>',
    'standard',
    20,
    20,
    true,
    4
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 5: Adding Images and Links
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
    module_id,
    5,
    'Adding Images and Links',
    'adding-images-and-links',
    'Learn how to add featured images, content images, and links to your blog post.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Learn how to add images and links to make your blog post more engaging and useful.</p>
      
      <h2>Lesson Content</h2>
      <p>Images and links make your blog posts more engaging and help readers take action.</p>
      
      <h3>Featured Image</h3>
      <p>Every blog post should have a featured image. This appears:</p>
      <ul>
        <li>At the top of your blog post</li>
        <li>In social media previews</li>
        <li>In blog post listings</li>
      </ul>
      <p><strong>Tips for featured images:</strong></p>
      <ul>
        <li>Use high-quality images</li>
        <li>Make sure they relate to your topic</li>
        <li>Keep file sizes reasonable for fast loading</li>
      </ul>
      
      <h3>Adding Images to Content</h3>
      <p>Break up text with relevant images:</p>
      <ul>
        <li>Screenshots for tutorials</li>
        <li>Diagrams to explain concepts</li>
        <li>Photos to add visual interest</li>
      </ul>
      
      <h3>Adding Links</h3>
      <p>Links help readers learn more and take action:</p>
      <ul>
        <li><strong>Internal links:</strong> Link to other blog posts or pages on your site</li>
        <li><strong>External links:</strong> Link to helpful resources (opens in new tab)</li>
        <li><strong>Call-to-action links:</strong> Link to contact forms, offers, or products</li>
      </ul>
      
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <h3 class="font-semibold text-amber-900">Quick Tip</h3>
        <p class="text-amber-800">Always test your links before publishing to make sure they work correctly.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Upload a featured image for your post</li>
        <li>Add at least one image to your content</li>
        <li>Include 2-3 relevant links</li>
        <li>Preview how it looks</li>
      </ol>
    </div>',
    'standard',
    15,
    15,
    true,
    5
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 6: SEO Basics
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
    module_id,
    6,
    'SEO Basics',
    'seo-basics',
    'Learn basic SEO settings to help your blog post get found.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Complete basic SEO settings to help your blog post get found in search engines.</p>
      
      <h2>Lesson Content</h2>
      <p>SEO (Search Engine Optimization) helps people find your blog post when they search online.</p>
      
      <h3>Basic SEO Settings in LeadProspectrr</h3>
      
      <h4>1. SEO Title</h4>
      <p>This appears in search results. Best practices:</p>
      <ul>
        <li>Keep it under 60 characters</li>
        <li>Include your main keyword</li>
        <li>Make it compelling to click</li>
      </ul>
      
      <h4>2. Meta Description</h4>
      <p>This appears under your title in search results:</p>
      <ul>
        <li>Keep it under 160 characters</li>
        <li>Summarize what the post is about</li>
        <li>Include a call to action</li>
      </ul>
      
      <h4>3. URL Slug</h4>
      <p>The web address for your post:</p>
      <ul>
        <li>Keep it short and descriptive</li>
        <li>Use hyphens between words</li>
        <li>Include your main keyword</li>
      </ul>
      
      <h4>4. Categories and Tags</h4>
      <p>Help organize your content:</p>
      <ul>
        <li><strong>Categories:</strong> Broad topics (1-2 per post)</li>
        <li><strong>Tags:</strong> Specific details (3-5 per post)</li>
      </ul>
      
      <div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <h3 class="font-semibold text-green-900">Remember</h3>
        <p class="text-green-800">Good SEO helps people find your content, but write for humans first, search engines second.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Write an SEO title for your post</li>
        <li>Create a compelling meta description</li>
        <li>Set a clean URL slug</li>
        <li>Add relevant categories and tags</li>
        <li>Save your changes</li>
      </ol>
    </div>',
    'standard',
    18,
    18,
    true,
    6
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 7: Preview and Publish
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
    module_id,
    7,
    'Preview and Publish',
    'preview-and-publish',
    'Learn how to preview your post and publish or schedule it.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Preview your blog post, check everything looks correct, and publish or schedule it.</p>
      
      <h2>Lesson Content</h2>
      <p>Before making your post live, always preview it to catch any issues.</p>
      
      <h3>Previewing Your Post</h3>
      <p>Click the <strong>Preview</strong> button to see how your post will look when published. Check for:</p>
      <ul>
        <li>Formatting looks correct</li>
        <li>Images display properly</li>
        <li>Links work correctly</li>
        <li>No spelling or grammar errors</li>
        <li>Mobile-friendly layout</li>
      </ul>
      
      <h3>Publishing Options</h3>
      
      <h4>Publish Now</h4>
      <p>Makes your post live immediately. Choose this when:</p>
      <ul>
        <li>Your post is complete and ready</li>
        <li>You want to share it right away</li>
        <li>It is timely content</li>
      </ul>
      
      <h4>Schedule for Later</h4>
      <p>Set a future date and time to publish. Use this when:</p>
      <ul>
        <li>You want to publish at optimal times</li>
        <li>You are batch-creating content</li>
        <li>You want consistent posting</li>
      </ul>
      
      <h4>Save as Draft</h4>
      <p>Keep working on it later. Your post is saved but not visible to visitors.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3 class="font-semibold text-blue-900">Key Point</h3>
        <p class="text-blue-800">Always preview before publishing. It is easier to fix issues before your post is live.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Click Preview to review your post</li>
        <li>Check on both desktop and mobile views</li>
        <li>Fix any issues you find</li>
        <li>Choose Publish, Schedule, or keep as Draft</li>
        <li>Confirm your choice</li>
      </ol>
    </div>',
    'standard',
    12,
    12,
    true,
    7
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

  -- Lesson 8: Sharing Your Blog Post
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
    module_id,
    8,
    'Sharing Your Blog Post',
    'sharing-your-blog-post',
    'Learn how to share your published blog post with your audience.',
    '<div class="space-y-6">
      <h2>Lesson Goal</h2>
      <p>Learn how to share your published blog post and get it in front of your audience.</p>
      
      <h2>Lesson Content</h2>
      <p>Creating a great blog post is just the start. Now you need to share it.</p>
      
      <h3>Ways to Share Your Post</h3>
      
      <h4>1. Social Media</h4>
      <p>Share on your business social accounts:</p>
      <ul>
        <li>Write a compelling post with the link</li>
        <li>Use relevant hashtags</li>
        <li>Include the featured image</li>
        <li>Post at optimal times for your audience</li>
      </ul>
      
      <h4>2. Email Marketing</h4>
      <p>Include in your emails:</p>
      <ul>
        <li>Link in your email signature</li>
        <li>Feature in your newsletter</li>
        <li>Include in follow-up sequences</li>
        <li>Share with relevant contact segments</li>
      </ul>
      
      <h4>3. Direct Sharing</h4>
      <p>Send to specific people:</p>
      <ul>
        <li>Clients who asked related questions</li>
        <li>Prospects in your pipeline</li>
        <li>Partners who might share it</li>
      </ul>
      
      <h3>Tracking Your Results</h3>
      <p>LeadProspectrr shows you:</p>
      <ul>
        <li>How many people viewed your post</li>
        <li>Where traffic came from</li>
        <li>Which posts perform best</li>
      </ul>
      
      <div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <h3 class="font-semibold text-green-900">Remember</h3>
        <p class="text-green-800">The best blog post does not help anyone if they cannot find it. Sharing is part of the process.</p>
      </div>
      
      <h2>Action Steps</h2>
      <ol>
        <li>Copy your blog post URL</li>
        <li>Share on one social media platform</li>
        <li>Add the link to your email signature</li>
        <li>Send to 3 people who would find it helpful</li>
        <li>Check your analytics in one week</li>
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
    8
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    is_published = true;

END $$;

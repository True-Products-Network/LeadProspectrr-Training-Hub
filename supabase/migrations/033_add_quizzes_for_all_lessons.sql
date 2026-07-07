-- Quiz questions for Lessons 2-11
-- Lesson 2: Planning Your Blog Post
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What should you do before writing a blog post?' as question,
  '["Start writing immediately", "Plan your content and structure", "Publish the first draft", "Skip planning and edit later"]'::jsonb as options,
  'Plan your content and structure' as correct_answer,
  'Planning helps you organize your thoughts and create a more effective blog post that answers your reader''s questions.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'planning-your-blog-post'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What is a good way to structure a blog post?' as question,
  '["Random thoughts in any order", "Introduction, main content, conclusion with a call to action", "Only the conclusion", "One long paragraph"]'::jsonb as options,
  'Introduction, main content, conclusion with a call to action' as correct_answer,
  'A clear structure helps readers follow your content and know what to do next.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'planning-your-blog-post'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: You should write for your target audience, not for everyone.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Writing for your specific target audience helps you create more relevant and useful content.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'planning-your-blog-post'
ON CONFLICT DO NOTHING;

-- Lesson 3: Blog Settings Overview
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What should you check before creating your first blog post?' as question,
  '["Nothing, just start writing", "Blog settings including sites, categories, and authors", "Only the color scheme", "Your email signature"]'::jsonb as options,
  'Blog settings including sites, categories, and authors' as correct_answer,
  'Checking blog settings first ensures your post will be properly organized and attributed.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'blog-settings-overview'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'Why are blog categories important?' as question,
  '["They make the blog look colorful", "They help organize content and make it easier to find", "They are required by law", "They slow down the website"]'::jsonb as options,
  'They help organize content and make it easier to find' as correct_answer,
  'Categories help readers find related content and improve the overall organization of your blog.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'blog-settings-overview'
ON CONFLICT DO NOTHING;

-- Lesson 4: Creating a New Blog Post
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What are the basic details you need when creating a new blog post?' as question,
  '["Only the title", "Title, content, and basic formatting", "Just the author name", "Only the publish date"]'::jsonb as options,
  'Title, content, and basic formatting' as correct_answer,
  'A blog post needs a clear title, well-formatted content, and proper structure to be effective.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'creating-a-new-blog-post'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: Headings and paragraphs help keep your content readable.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Proper formatting with headings and paragraphs makes your content easier to read and understand.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'creating-a-new-blog-post'
ON CONFLICT DO NOTHING;

-- Lesson 5: Write and Format Your Content
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What makes blog content engaging?' as question,
  '["Long technical jargon", "Clear, helpful content with proper formatting", "Random unrelated topics", "No formatting at all"]'::jsonb as options,
  'Clear, helpful content with proper formatting' as correct_answer,
  'Engaging content is clear, helpful, and well-formatted to keep readers interested.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'write-and-format-your-content'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'Why should you include a call to action in your blog post?' as question,
  '["To tell readers what to do next", "To make the post longer", "It is not important", "To confuse readers"]'::jsonb as options,
  'To tell readers what to do next' as correct_answer,
  'A clear call to action guides readers on the next step, whether it''s contacting you, reading more, or making a purchase.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'write-and-format-your-content'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: Headings help break up content and make it easier to scan.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Headings help readers quickly find the information they need and improve readability.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'write-and-format-your-content'
ON CONFLICT DO NOTHING;

-- Lesson 6: Adding Images and Links
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What is a featured image?' as question,
  '["The main image that represents your blog post", "An image hidden in the code", "A random stock photo", "The author''s photo only"]'::jsonb as options,
  'The main image that represents your blog post' as correct_answer,
  'A featured image is the main visual that represents your post and appears in previews and social shares.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'adding-images-and-links'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'Why should you add links to your blog post?' as question,
  '["To make the post look busy", "To guide readers to next steps and related content", "Links are not useful", "To slow down readers"]'::jsonb as options,
  'To guide readers to next steps and related content' as correct_answer,
  'Links help readers find more information and guide them toward taking action.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'adding-images-and-links'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: Inline images can help explain your content better.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Images within your content can illustrate points, break up text, and make your post more engaging.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'adding-images-and-links'
ON CONFLICT DO NOTHING;

-- Lesson 7: Add Categories Tags and Author
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'Why should you set a category for your blog post?' as question,
  '["To organize your content and help readers find related posts", "It is optional and not useful", "To make the post longer", "Categories slow down the site"]'::jsonb as options,
  'To organize your content and help readers find related posts' as correct_answer,
  'Categories help organize your blog and make it easier for readers to find related content.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'add-categories-tags-and-author'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What are tags used for?' as question,
  '["Decorating the page", "Adding more specific topics to help with search", "Slowing down the site", "They have no purpose"]'::jsonb as options,
  'Adding more specific topics to help with search' as correct_answer,
  'Tags add more specific topic labels that help with search and content discovery.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'add-categories-tags-and-author'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: Setting the correct author builds credibility.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Attributing posts to the correct author builds trust and credibility with your readers.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'add-categories-tags-and-author'
ON CONFLICT DO NOTHING;

-- Lesson 8: SEO Basics
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What is the purpose of SEO settings?' as question,
  '["To make the post look pretty", "To help search engines understand and rank your content", "To confuse readers", "SEO is not important"]'::jsonb as options,
  'To help search engines understand and rank your content' as correct_answer,
  'SEO settings help search engines understand your content and can improve your visibility in search results.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'seo-basics'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What is a meta description?' as question,
  '["A hidden code that slows down the site", "A brief summary that appears in search results", "The full blog post content", "An image description only"]'::jsonb as options,
  'A brief summary that appears in search results' as correct_answer,
  'A meta description is a short summary that appears under your title in search engine results.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'seo-basics'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: A clean URL slug helps with SEO.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Clean, descriptive URL slugs help search engines and users understand what your page is about.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'seo-basics'
ON CONFLICT DO NOTHING;

-- Lesson 9: Preview and Review
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'Why should you preview your post before publishing?' as question,
  '["To check for errors and formatting issues", "It is not necessary", "To waste time", "Preview is automatic"]'::jsonb as options,
  'To check for errors and formatting issues' as correct_answer,
  'Previewing helps you catch errors, check formatting, and ensure everything looks correct before going live.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'preview-and-review'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What should you check in the preview?' as question,
  '["Only the title", "Formatting, links, images, and overall appearance", "Nothing at all", "Just the word count"]'::jsonb as options,
  'Formatting, links, images, and overall appearance' as correct_answer,
  'A thorough preview check includes formatting, links, images, and how the post appears to readers.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'preview-and-review'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: Testing links in the preview is important.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Testing links ensures they work correctly and take readers to the right destination.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'preview-and-review'
ON CONFLICT DO NOTHING;

-- Lesson 10: Publish or Schedule
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What are your options for publishing a blog post?' as question,
  '["Only publish immediately", "Publish now or schedule for later", "You cannot publish", "Only save as draft"]'::jsonb as options,
  'Publish now or schedule for later' as correct_answer,
  'You can either publish your post immediately or schedule it to go live at a future date and time.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'publish-or-schedule'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'Why might you schedule a post instead of publishing immediately?' as question,
  '["To plan your content calendar and publish at optimal times", "Scheduling is not useful", "To forget about it", "It is required"]'::jsonb as options,
  'To plan your content calendar and publish at optimal times' as correct_answer,
  'Scheduling helps you maintain a consistent publishing schedule and reach your audience at the best times.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'publish-or-schedule'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: You can copy the blog post URL after publishing.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Once published, you can copy the URL to share your post on social media, email, or other channels.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'publish-or-schedule'
ON CONFLICT DO NOTHING;

-- Lesson 11: Sharing Your Blog Post
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'How can you use your published blog post?' as question,
  '["Just leave it on the website", "Share it in follow-up emails and marketing", "Hide it from everyone", "Delete it immediately"]'::jsonb as options,
  'Share it in follow-up emails and marketing' as correct_answer,
  'Your blog posts are valuable content that can be shared in follow-ups, emails, and marketing materials.' as explanation,
  1 as sort_order
FROM public.lessons WHERE slug = 'sharing-your-blog-post'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'What is a good way to share your blog post?' as question,
  '["Only tell one person", "Include it in follow-up sequences and social media", "Never share it", "Print it and mail it"]'::jsonb as options,
  'Include it in follow-up sequences and social media' as correct_answer,
  'Sharing your post through follow-up sequences, social media, and email helps maximize its reach and value.' as explanation,
  2 as sort_order
FROM public.lessons WHERE slug = 'sharing-your-blog-post'
ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
SELECT 
  id as lesson_id,
  'True or False: Tracking your blog post results helps you understand what works.' as question,
  '["True", "False"]'::jsonb as options,
  'True' as correct_answer,
  'Tracking views, engagement, and conversions helps you understand what content resonates with your audience.' as explanation,
  3 as sort_order
FROM public.lessons WHERE slug = 'sharing-your-blog-post'
ON CONFLICT DO NOTHING;

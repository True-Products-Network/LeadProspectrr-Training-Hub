-- Seed data for LeadProspectrr Training Library
-- Sample resources for the initial 6-week cycle

DO $$
DECLARE
  module1_id UUID;
  module2_id UUID;
  module3_id UUID;
  module4_id UUID;
  module5_id UUID;
  module6_id UUID;
BEGIN
  -- Get module IDs for the first cycle
  SELECT id INTO module1_id FROM public.training_modules WHERE week_number = 1 AND year = 2026 AND cycle_number = 1;
  SELECT id INTO module2_id FROM public.training_modules WHERE week_number = 2 AND year = 2026 AND cycle_number = 1;
  SELECT id INTO module3_id FROM public.training_modules WHERE week_number = 3 AND year = 2026 AND cycle_number = 1;
  SELECT id INTO module4_id FROM public.training_modules WHERE week_number = 4 AND year = 2026 AND cycle_number = 1;
  SELECT id INTO module5_id FROM public.training_modules WHERE week_number = 5 AND year = 2026 AND cycle_number = 1;
  SELECT id INTO module6_id FROM public.training_modules WHERE week_number = 6 AND year = 2026 AND cycle_number = 1;

  -- Week 1: Creating Blog Posts
  IF module1_id IS NOT NULL THEN
    INSERT INTO public.resources (module_id, title, description, file_type, file_url, file_size, is_published) VALUES
      (module1_id, 'Blog Writing for Beginners - Dummies Guide', 'Complete guide to writing compelling blog posts that convert readers into leads', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Blog+Guide+PDF', 2500000, true),
      (module1_id, 'Blog Post Template Pack', 'Ready-to-use templates for different types of blog posts including how-to, listicles, and case studies', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Blog+Templates', 1500000, true),
      (module1_id, 'SEO Cheat Sheet', 'Quick reference for optimizing blog posts for search engines', 'cheatsheet', 'https://placehold.co/400x600/e2e8f0/475569?text=SEO+Cheat+Sheet', 500000, true),
      (module1_id, 'Content Calendar Template', 'Plan your blog content with this monthly calendar template', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Content+Calendar', 800000, true),
      (module1_id, 'Headline Formulas Worksheet', '100 proven headline formulas to grab attention', 'worksheet', 'https://placehold.co/400x600/e2e8f0/475569?text=Headline+Worksheet', 600000, true);
  END IF;

  -- Week 2: Contacts and Smart Lists
  IF module2_id IS NOT NULL THEN
    INSERT INTO public.resources (module_id, title, description, file_type, file_url, file_size, is_published) VALUES
      (module2_id, 'Contact Management Mastery Guide', 'How to organize and manage your contacts effectively for maximum ROI', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Contact+Guide', 1800000, true),
      (module2_id, 'Smart List Creation Cheat Sheet', 'Step-by-step guide to creating powerful smart lists that segment automatically', 'cheatsheet', 'https://placehold.co/400x600/e2e8f0/475569?text=Smart+Lists', 600000, true),
      (module2_id, 'Contact Import Template', 'CSV template for bulk importing contacts with proper field mapping', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Import+Template', 50000, true),
      (module2_id, 'Segmentation Strategy Worksheet', 'Plan your contact segments with this comprehensive worksheet', 'worksheet', 'https://placehold.co/400x600/e2e8f0/475569?text=Segmentation+Worksheet', 400000, true),
      (module2_id, 'Tagging Best Practices Checklist', 'Ensure consistent tagging across your contact database', 'checklist', 'https://placehold.co/400x600/e2e8f0/475569?text=Tagging+Checklist', 300000, true);
  END IF;

  -- Week 3: Email Templates & Campaigns
  IF module3_id IS NOT NULL THEN
    INSERT INTO public.resources (module_id, title, description, file_type, file_url, file_size, is_published) VALUES
      (module3_id, 'Email Marketing Mastery Guide', 'Everything you need to know about creating high-converting email campaigns', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Email+Guide', 3200000, true),
      (module3_id, '50 Email Templates Pack', 'Pre-written email templates for every situation - welcome, nurture, sales, and more', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Email+Templates', 2500000, true),
      (module3_id, 'Subject Line Cheat Sheet', '100+ proven subject lines that get opened and clicked', 'cheatsheet', 'https://placehold.co/400x600/e2e8f0/475569?text=Subject+Lines', 700000, true),
      (module4_id, 'Email Campaign Checklist', 'Ensure your campaigns are perfect every time with this comprehensive checklist', 'checklist', 'https://placehold.co/400x600/e2e8f0/475569?text=Email+Checklist', 400000, true),
      (module3_id, 'Email Sequence Planner', 'Map out your automated email sequences with this visual planner', 'worksheet', 'https://placehold.co/400x600/e2e8f0/475569?text=Sequence+Planner', 550000, true);
  END IF;

  -- Week 4: Understanding Conversations Inbox
  IF module4_id IS NOT NULL THEN
    INSERT INTO public.resources (module4_id, title, description, file_type, file_url, file_size, is_published) VALUES
      (module4_id, 'Inbox Zero Mastery Guide', 'Master your conversations inbox and stay organized with high volumes', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Inbox+Guide', 2100000, true),
      (module4_id, 'Response Templates Library', 'Quick reply templates for common inquiries and scenarios', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Response+Templates', 1200000, true),
      (module4_id, 'Conversation Flow Diagram', 'Visual guide to managing customer conversations effectively', 'image', 'https://placehold.co/800x600/e2e8f0/475569?text=Flow+Diagram', 800000, true),
      (module4_id, 'SLA Tracking Spreadsheet', 'Track response times and ensure you meet your service level agreements', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=SLA+Tracker', 350000, true),
      (module4_id, 'Tone & Voice Guidelines', 'Maintain consistent communication style across all conversations', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Tone+Guide', 900000, true);
  END IF;

  -- Week 5: Opportunities & Pipelines
  IF module5_id IS NOT NULL THEN
    INSERT INTO public.resources (module_id, title, description, file_type, file_url, file_size, is_published) VALUES
      (module5_id, 'Sales Pipeline Management Guide', 'Build and optimize your sales pipeline for consistent revenue growth', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Pipeline+Guide', 2800000, true),
      (module5_id, 'Pipeline Stage Definitions Template', 'Define each stage of your sales process with clear criteria', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Stage+Definitions', 550000, true),
      (module5_id, 'Deal Tracking Template', 'Track opportunities from lead to close with this comprehensive tracker', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Deal+Tracker', 600000, true),
      (module5_id, 'Win Rate Calculator', 'Calculate and improve your win rates with this automated calculator', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Win+Rate+Calc', 300000, true),
      (module5_id, 'Pipeline Review Checklist', 'Weekly pipeline review checklist for sales managers', 'checklist', 'https://placehold.co/400x600/e2e8f0/475569?text=Pipeline+Checklist', 350000, true);
  END IF;

  -- Week 6: Calendars and Bookings
  IF module6_id IS NOT NULL THEN
    INSERT INTO public.resources (module_id, title, description, file_type, file_url, file_size, is_published) VALUES
      (module6_id, 'Calendar Setup & Optimization Guide', 'Configure your booking system for maximum conversions and minimal no-shows', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Calendar+Guide', 1900000, true),
      (module6_id, 'Appointment Types Template', 'Define different types of appointments with duration and requirements', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Appointment+Types', 450000, true),
      (module6_id, 'Booking Page Best Practices', 'Optimize your booking pages for conversions with these proven tactics', 'cheatsheet', 'https://placehold.co/400x600/e2e8f0/475569?text=Booking+Best+Practices', 650000, true),
      (module6_id, 'Calendar Integration Setup Guide', 'Connect your calendar with other tools for seamless scheduling', 'guide', 'https://placehold.co/400x600/e2e8f0/475569?text=Integration+Guide', 1200000, true),
      (module6_id, 'Reminder & Follow-up Templates', 'Automated reminder and follow-up message templates', 'template', 'https://placehold.co/400x600/e2e8f0/475569?text=Reminder+Templates', 400000, true);
  END IF;

END $$;

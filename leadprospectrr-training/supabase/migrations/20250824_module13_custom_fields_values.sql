-- Module 13: Custom Fields vs Custom Values
-- Migration: Add Module 13 and all 7 lessons

-- Insert Module 13
INSERT INTO public.training_modules (
  week_number,
  year,
  cycle_number,
  title,
  description,
  color,
  is_active,
  created_at,
  updated_at
) VALUES (
  13,
  2026,
  1,
  'Custom Fields vs Custom Values',
  'Learn how to use Custom Fields and Custom Values correctly in LeadProspectrr. Understand what each one does, when to use each one, and how to apply both in a simple business setup.',
  'indigo',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (week_number, year, cycle_number) 
DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert all lessons for Module 13
DO $$
DECLARE
  v_module_id UUID;
  v_lesson_id UUID;
BEGIN
  -- Get Module 13 ID
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = 13 LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module 13 not found';
  END IF;

  -- ============================================
  -- LESSON 1: What Custom Fields Are
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 1, 'What Custom Fields Are', 'what-custom-fields-are',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Understand what a Custom Field is and why it matters for storing record-specific information.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">What Is a Custom Field?</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Stores Information About a Record</h4>
          <p class="text-sm text-slate-600">A Custom Field stores information about a record. The information can be different for each person or deal.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Works Across Record Types</h4>
          <p class="text-sm text-slate-600">You can use fields on contacts, opportunities, companies, and other supported record types.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Common Examples</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Service Interested In</h4>
          <p class="text-sm text-slate-600">Track which service a lead is interested in.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Referral Source</h4>
          <p class="text-sm text-slate-600">Know where your leads are coming from.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Budget</h4>
          <p class="text-sm text-slate-600">Store budget information for each contact or deal.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Event Date</h4>
          <p class="text-sm text-slate-600">Track important dates specific to each record.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Custom Fields store record-specific information that varies from person to person or deal to deal.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">List Your Lead Information</h4>
          <p class="text-sm text-slate-600">List 5 pieces of information you collect from leads right now. Mark which of those should be Custom Fields.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Identify Field Candidates</h4>
          <p class="text-sm text-slate-600">Identify which pieces of information are unique to each contact and would work well as Custom Fields.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Plan Your Fields</h4>
          <p class="text-sm text-slate-600">Write down 3 Custom Fields you want to create first.</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 1, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'What is the main purpose of a Custom Field?', '[{"option_text": "To store reusable business information like company phone numbers", "is_correct": false}, {"option_text": "To store record-specific information that varies for each person or deal", "is_correct": true}, {"option_text": "To replace all other CRM features", "is_correct": false}, {"option_text": "To send emails automatically", "is_correct": false}]'::jsonb, 'Custom Fields store information about a record that can be different for each person or deal.', 1, NOW(), NOW()),
    (v_lesson_id, 'Which of these should be stored in a Custom Field?', '[{"option_text": "Company main phone number", "is_correct": false}, {"option_text": "A lead''s budget amount", "is_correct": true}, {"option_text": "Your booking link", "is_correct": false}, {"option_text": "Support email address", "is_correct": false}]'::jsonb, 'A lead''s budget is specific to that lead and varies from person to person.', 2, NOW(), NOW()),
    (v_lesson_id, 'Where can Custom Fields be used?', '[{"option_text": "Only on contacts", "is_correct": false}, {"option_text": "On contacts, opportunities, companies, and other supported record types", "is_correct": true}, {"option_text": "Only in emails", "is_correct": false}, {"option_text": "Only by admins", "is_correct": false}]'::jsonb, 'Custom Fields can be used on contacts, opportunities, companies, and other supported record types.', 3, NOW(), NOW());

  -- ============================================
  -- LESSON 2: What Custom Values Are
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 2, 'What Custom Values Are', 'what-custom-values-are',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Understand what a Custom Value is and why it saves time by storing reusable business information.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">What Is a Custom Value?</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Reusable Business Information</h4>
          <p class="text-sm text-slate-600">A Custom Value stores reusable business information. You set it once and use it in many places.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Update Once, Apply Everywhere</h4>
          <p class="text-sm text-slate-600">When it changes, you update it once. Every place that uses it updates automatically.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Common Examples</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Main Booking Link</h4>
          <p class="text-sm text-slate-600">Your primary calendar booking URL used across emails and pages.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Support Email</h4>
          <p class="text-sm text-slate-600">Your support email address used in templates and workflows.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Company Phone Number</h4>
          <p class="text-sm text-slate-600">Your main business phone number for signatures and contact info.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Zoom Room Link</h4>
          <p class="text-sm text-slate-600">Your standard meeting room link for calls and appointments.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Custom Values store reusable business information that stays the same across all records. Update once, use everywhere.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">List Repeated Information</h4>
          <p class="text-sm text-slate-600">List 5 things you type over and over in emails, workflows, or pages. Mark which of those should be Custom Values.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Identify Value Candidates</h4>
          <p class="text-sm text-slate-600">Identify information that is the same for your entire business and would work well as Custom Values.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Plan Your Values</h4>
          <p class="text-sm text-slate-600">Write down 3 Custom Values you want to create first.</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 2, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'What is the main purpose of a Custom Value?', '[{"option_text": "To store unique information about each contact", "is_correct": false}, {"option_text": "To store reusable business information used across many places", "is_correct": true}, {"option_text": "To replace custom fields", "is_correct": false}, {"option_text": "To track deal stages", "is_correct": false}]'::jsonb, 'Custom Values store reusable business information that you set once and use in many places.', 1, NOW(), NOW()),
    (v_lesson_id, 'Which of these should be stored as a Custom Value?', '[{"option_text": "A lead''s preferred contact method", "is_correct": false}, {"option_text": "Your main booking link", "is_correct": true}, {"option_text": "A client''s event date", "is_correct": false}, {"option_text": "A prospect''s budget range", "is_correct": false}]'::jsonb, 'Your main booking link is the same for everyone and used repeatedly across emails and pages.', 2, NOW(), NOW()),
    (v_lesson_id, 'What happens when you update a Custom Value?', '[{"option_text": "Only one email template updates", "is_correct": false}, {"option_text": "Every place using it updates automatically", "is_correct": true}, {"option_text": "Nothing changes until you manually update each place", "is_correct": false}, {"option_text": "It only updates in workflows", "is_correct": false}]'::jsonb, 'When you update a Custom Value, every place that uses it updates automatically.', 3, NOW(), NOW());

  RAISE NOTICE 'Lessons 1 and 2 created. Continuing...';

  -- ============================================
  -- LESSON 3: Contact Fields vs Opportunity Fields
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 3, 'Contact Fields vs Opportunity Fields', 'contact-vs-opportunity-fields',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Learn to put information in the correct place by understanding the difference between Contact and Opportunity fields.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Contact Fields</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">For the Person</h4>
          <p class="text-sm text-slate-600">Contact fields are for the person. They describe attributes of the individual that stay with them across all deals.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Examples</h4>
          <p class="text-sm text-slate-600">Birthday, Lead source, Service interest, Preferred contact method, Referral source.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-6 border border-amber-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Opportunity Fields</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">For the Deal</h4>
          <p class="text-sm text-slate-600">Opportunity fields are for the deal. They describe attributes of a specific transaction or opportunity.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Examples</h4>
          <p class="text-sm text-slate-600">Proposal amount, Budget, Event date, Close target date, Deal-specific notes.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-rose-50 rounded-2xl p-6 border border-rose-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">The Golden Rule</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Do Not Mix Them Up</h4>
          <p class="text-sm text-slate-600">Do not put deal-specific information on the contact just because it is easier. Keep contact data and deal data separate.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Contact fields describe the person. Opportunity fields describe the deal. Keep them separate for a cleaner CRM setup.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">Audit Your Current Fields</h4>
          <p class="text-sm text-slate-600">Review your existing Custom Fields. Identify any that are on contacts but should be on opportunities, or vice versa.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Create Field Plan</h4>
          <p class="text-sm text-slate-600">A coach sells one-to-one coaching, group coaching, and VIP days. Create 3 Contact fields and 3 Opportunity fields that would make sense.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Fix Misplaced Fields</h4>
          <p class="text-sm text-slate-600">If you find fields in the wrong place, plan how to move them to the correct record type.</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 3, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'Where should you store a client''s birthday?', '[{"option_text": "On the opportunity", "is_correct": false}, {"option_text": "On the contact", "is_correct": true}, {"option_text": "In a Custom Value", "is_correct": false}, {"option_text": "In a tag", "is_correct": false}]'::jsonb, 'A birthday is an attribute of the person, not the deal. It stays with the contact across all opportunities.', 1, NOW(), NOW()),
    (v_lesson_id, 'Where should you store a proposal amount?', '[{"option_text": "On the contact", "is_correct": false}, {"option_text": "On the opportunity", "is_correct": true}, {"option_text": "In a Custom Value", "is_correct": false}, {"option_text": "In the contact''s first name", "is_correct": false}]'::jsonb, 'Proposal amount is specific to a particular deal. A contact might have multiple opportunities with different amounts.', 2, NOW(), NOW()),
    (v_lesson_id, 'Why shouldn''t you put deal information on contacts just because it''s easier?', '[{"option_text": "Because it makes the contact record too long", "is_correct": false}, {"option_text": "Because a contact can have multiple deals, and the data will get mixed up", "is_correct": true}, {"option_text": "Because you can''t use contact fields in workflows", "is_correct": false}, {"option_text": "Because it''s not allowed", "is_correct": false}]'::jsonb, 'When you put deal-specific information on a contact with multiple deals, the data gets confused.', 3, NOW(), NOW());

  RAISE NOTICE 'Lesson 3 created';

  -- ============================================
  -- LESSON 4: How to Create and Use Custom Fields
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 4, 'How to Create and Use Custom Fields', 'create-use-custom-fields',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Learn the simple setup process for creating Custom Fields in LeadProspectrr.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Creating Custom Fields</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-blue-700">1</span></div>
        <div><h4 class="font-semibold text-slate-900">Go to Settings</h4><p class="text-sm text-slate-600">Navigate to Settings → Custom Fields.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-green-700">2</span></div>
        <div><h4 class="font-semibold text-slate-900">Add Field</h4><p class="text-sm text-slate-600">Click Add Field to start creating a new field.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-purple-700">3</span></div>
        <div><h4 class="font-semibold text-slate-900">Choose Record Type</h4><p class="text-sm text-slate-600">Choose the right object or record type (Contact, Opportunity, etc.).</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-cyan-700">4</span></div>
        <div><h4 class="font-semibold text-slate-900">Name the Field</h4><p class="text-sm text-slate-600">Name the field clearly so everyone understands what it''s for.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-amber-700">5</span></div>
        <div><h4 class="font-semibold text-slate-900">Choose Field Type</h4><p class="text-sm text-slate-600">Select the appropriate field type (text, number, date, dropdown, etc.).</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-green-700">6</span></div>
        <div><h4 class="font-semibold text-slate-900">Save</h4><p class="text-sm text-slate-600">Save the field to make it available throughout the system.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-indigo-700">7</span></div>
        <div><h4 class="font-semibold text-slate-900">Use It</h4><p class="text-sm text-slate-600">Use it in forms, records, workflows, and filters.</p></div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Creating Custom Fields is a simple 7-step process. The key is choosing the right record type and field type for your data.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">Navigate to Custom Fields</h4>
          <p class="text-sm text-slate-600">Go to Settings → Custom Fields and review the current fields in your account.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Create Your First Field</h4>
          <p class="text-sm text-slate-600">Create a field called Service Interested In and decide what field type it should be (text, dropdown, etc.).</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Test Your Field</h4>
          <p class="text-sm text-slate-600">Add the field to a contact record and test using it in a form or workflow.</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 4, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'What is the first step to create a Custom Field?', '[{"option_text": "Click on a contact record", "is_correct": false}, {"option_text": "Go to Settings → Custom Fields", "is_correct": true}, {"option_text": "Open a workflow", "is_correct": false}, {"option_text": "Create a form", "is_correct": false}]'::jsonb, 'To create a Custom Field, you start by navigating to Settings → Custom Fields in the main menu.', 1, NOW(), NOW()),
    (v_lesson_id, 'When creating a Custom Field, why is choosing the right record type important?', '[{"option_text": "It affects the color of the field", "is_correct": false}, {"option_text": "It determines where the field can be used and what data it stores", "is_correct": true}, {"option_text": "It changes the field name", "is_correct": false}, {"option_text": "It''s not important", "is_correct": false}]'::jsonb, 'Choosing the right record type determines where the field appears and what kind of records it can store data for.', 2, NOW(), NOW()),
    (v_lesson_id, 'Where can you use Custom Fields after creating them?', '[{"option_text": "Only on contact records", "is_correct": false}, {"option_text": "In forms, records, workflows, and filters", "is_correct": true}, {"option_text": "Only in emails", "is_correct": false}, {"option_text": "Only by admins", "is_correct": false}]'::jsonb, 'Once created, Custom Fields can be used throughout the system—in forms, records, workflows, filters, and more.', 3, NOW(), NOW());

  RAISE NOTICE 'Lesson 4 created';

  -- ============================================
  -- LESSON 5: How to Create and Use Custom Values
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 5, 'How to Create and Use Custom Values', 'create-use-custom-values',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Learn the simple setup process for creating Custom Values in LeadProspectrr.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Creating Custom Values</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-blue-700">1</span></div>
        <div><h4 class="font-semibold text-slate-900">Go to Settings</h4><p class="text-sm text-slate-600">Navigate to Settings → Custom Values.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-green-700">2</span></div>
        <div><h4 class="font-semibold text-slate-900">New Custom Value</h4><p class="text-sm text-slate-600">Click New Custom Value to start creating.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-cyan-700">3</span></div>
        <div><h4 class="font-semibold text-slate-900">Give It a Name</h4><p class="text-sm text-slate-600">Give it a clear name that describes what it contains.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-purple-700">4</span></div>
        <div><h4 class="font-semibold text-slate-900">Enter the Value</h4><p class="text-sm text-slate-600">Enter the actual value (URL, email, phone number, etc.).</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-green-700">5</span></div>
        <div><h4 class="font-semibold text-slate-900">Save</h4><p class="text-sm text-slate-600">Save the Custom Value to make it available.</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0"><span class="font-bold text-indigo-700">6</span></div>
        <div><h4 class="font-semibold text-slate-900">Use the Picker</h4><p class="text-sm text-slate-600">Insert it with the picker in supported areas like emails and workflows.</p></div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Creating Custom Values is a simple 6-step process. Use the picker to insert them—never type tokens manually.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">Navigate to Custom Values</h4>
          <p class="text-sm text-slate-600">Go to Settings → Custom Values and review any existing values in your account.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Create Your First Value</h4>
          <p class="text-sm text-slate-600">Create a Custom Value called Main Consultation Link with your booking URL.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Identify Usage Places</h4>
          <p class="text-sm text-slate-600">Identify 3 places you could use this Custom Value (email templates, workflows, pages).</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 5, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'What is the first step to create a Custom Value?', '[{"option_text": "Open an email template", "is_correct": false}, {"option_text": "Go to Settings → Custom Values", "is_correct": true}, {"option_text": "Create a workflow", "is_correct": false}, {"option_text": "Edit a contact record", "is_correct": false}]'::jsonb, 'To create a Custom Value, start by navigating to Settings → Custom Values in the main menu.', 1, NOW(), NOW()),
    (v_lesson_id, 'How should you insert a Custom Value into an email or workflow?', '[{"option_text": "Type the token manually", "is_correct": false}, {"option_text": "Use the picker", "is_correct": true}, {"option_text": "Copy and paste from another email", "is_correct": false}, {"option_text": "Ask an admin to insert it", "is_correct": false}]'::jsonb, 'Always use the picker to insert Custom Values. This ensures the correct token is inserted and reduces errors.', 2, NOW(), NOW()),
    (v_lesson_id, 'What happens when you update a Custom Value''s content?', '[{"option_text": "Only new records get the updated value", "is_correct": false}, {"option_text": "Every place using it automatically shows the new value", "is_correct": true}, {"option_text": "You have to manually update each email template", "is_correct": false}, {"option_text": "It only updates in workflows", "is_correct": false}]'::jsonb, 'When you update a Custom Value, every email, workflow, page, or template that uses it will automatically display the new value.', 3, NOW(), NOW());

  -- ============================================
  -- LESSON 6: Common Mistakes to Avoid
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 6, 'Common Mistakes to Avoid', 'common-mistakes',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Keep your setup clean and useful by avoiding common mistakes with Custom Fields and Custom Values.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-rose-50 rounded-2xl p-6 border border-rose-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Common Mistakes</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Creating Too Many Fields</h4>
          <p class="text-sm text-slate-600">Don''t create fields for everything. Focus on information you actually use for segmentation, workflows, or reporting.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Using a Field for Company-Wide Info</h4>
          <p class="text-sm text-slate-600">Don''t store information that is the same for everyone (like your phone number) in a Custom Field. Use a Custom Value instead.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Using a Value for Contact-Specific Info</h4>
          <p class="text-sm text-slate-600">Don''t store unique information about each contact in a Custom Value. Use a Custom Field instead.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Mixing Contact and Deal Data</h4>
          <p class="text-sm text-slate-600">Don''t put deal-specific information on contacts just because it''s easier. Keep them properly separated.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Typing Tokens Manually</h4>
          <p class="text-sm text-slate-600">Don''t type Custom Value tokens manually. Always use the picker to avoid mistakes.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Confusing Names</h4>
          <p class="text-sm text-slate-600">Don''t name items in a confusing way. Use clear, descriptive names everyone understands.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Avoid these common mistakes: too many fields, wrong tool for the data, mixing record types, typing tokens manually, and confusing names.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">Review Your Current Setup</h4>
          <p class="text-sm text-slate-600">Review your current CRM setup and write down 3 items you would fix based on what you''ve learned.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Identify Misused Fields</h4>
          <p class="text-sm text-slate-600">Find any Custom Fields storing company-wide info that should be Custom Values, or vice versa.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Plan Corrections</h4>
          <p class="text-sm text-slate-600">Create a plan to fix the mistakes you''ve identified, prioritizing the most impactful changes.</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 6, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'Which is a mistake when using Custom Fields and Custom Values?', '[{"option_text": "Using the picker to insert Custom Values", "is_correct": false}, {"option_text": "Storing your company phone number in a Custom Field on every contact", "is_correct": true}, {"option_text": "Creating fields for information you actually use", "is_correct": false}, {"option_text": "Naming fields clearly", "is_correct": false}]'::jsonb, 'Storing company-wide information in a Custom Field is a mistake. This should be stored as a Custom Value instead.', 1, NOW(), NOW()),
    (v_lesson_id, 'Why shouldn''t you type Custom Value tokens manually?', '[{"option_text": "Because it''s slower", "is_correct": false}, {"option_text": "Because you might make a typo that breaks the token", "is_correct": true}, {"option_text": "Because it''s not allowed", "is_correct": false}, {"option_text": "Because tokens are secret", "is_correct": false}]'::jsonb, 'Typing tokens manually can lead to typos that break the token. Always use the picker.', 2, NOW(), NOW()),
    (v_lesson_id, 'What should you do if you have deal-specific information stored on contact records?', '[{"option_text": "Leave it there since it''s already set up", "is_correct": false}, {"option_text": "Move it to opportunity fields where it belongs", "is_correct": true}, {"option_text": "Delete the information", "is_correct": false}, {"option_text": "Convert it to a Custom Value", "is_correct": false}]'::jsonb, 'Deal-specific information should be stored on opportunities, not contacts.', 3, NOW(), NOW());

  RAISE NOTICE 'Lessons 5 and 6 created';

  -- ============================================
  -- LESSON 7: Final Business Project
  -- ============================================
  INSERT INTO public.lessons (module_id, lesson_number, title, slug, content, is_published, sort_order, created_at, updated_at)
  VALUES (
    v_module_id, 7, 'Final Business Project', 'final-business-project',
    '<div class="space-y-8">
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Build a clean Custom Fields and Custom Values setup for your business.</p>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Your Task</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Create a Complete Setup</h4>
          <p class="text-sm text-slate-600">Create a simple setup for your own business with: 5 Custom Fields, 2 Opportunity Custom Fields, and 5 Custom Values.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">If You Are a Speaker</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Suggested Contact Fields</h4>
          <p class="text-sm text-slate-600">Event Type, Speaking Topic, Event Date, Referral Source, Follow-Up Status.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Suggested Custom Values</h4>
          <p class="text-sm text-slate-600">Main booking link, Speaker one-sheet link, Media page URL, Office phone number, Standard sign-off.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">If You Are a Coach or Consultant</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Suggested Contact Fields</h4>
          <p class="text-sm text-slate-600">Service Interested In, Business Stage, Budget Range, Referral Source, Preferred Contact Method.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Suggested Custom Values</h4>
          <p class="text-sm text-slate-600">Discovery call link, Support email, Company phone number, Client portal URL, Pricing page URL.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-6 border border-amber-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">If You Are a Service Business</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Suggested Contact Fields</h4>
          <p class="text-sm text-slate-600">Service Requested, Service Area, Estimate Needed, Lead Source, Project Date.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Suggested Custom Values</h4>
          <p class="text-sm text-slate-600">Quote request link, Main office number, Support email, Review link, Payment page URL.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-2">Key Point</h3>
        <p class="text-white/90">Create a complete setup tailored to your business type. Start with the suggested fields and values, then customize for your specific needs.</p>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl p-6 border shadow-sm">
    <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
      Action Steps
    </h3>
    <div class="space-y-3">
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">1</div>
        <div>
          <h4 class="font-semibold text-slate-900">Choose Your Business Type</h4>
          <p class="text-sm text-slate-600">Identify whether you are a speaker, coach/consultant, or service business to use the appropriate suggestions.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">2</div>
        <div>
          <h4 class="font-semibold text-slate-900">Create Your Custom Fields</h4>
          <p class="text-sm text-slate-600">Create 5 Contact Custom Fields based on the suggestions for your business type.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">3</div>
        <div>
          <h4 class="font-semibold text-slate-900">Create Your Opportunity Fields</h4>
          <p class="text-sm text-slate-600">Create 2 Opportunity Custom Fields for deal-specific information.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">4</div>
        <div>
          <h4 class="font-semibold text-slate-900">Create Your Custom Values</h4>
          <p class="text-sm text-slate-600">Create 5 Custom Values for reusable business information you use repeatedly.</p>
        </div>
      </div>
    </div>
  </div>
</div>',
    true, 7, NOW(), NOW()
  )
  ON CONFLICT (slug, module_id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()
  RETURNING id INTO v_lesson_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, explanation, sort_order, created_at, updated_at) VALUES
    (v_lesson_id, 'How many Custom Fields should you create for the final project?', '[{"option_text": "2", "is_correct": false}, {"option_text": "5", "is_correct": true}, {"option_text": "10", "is_correct": false}, {"option_text": "Unlimited", "is_correct": false}]'::jsonb, 'The final project asks you to create 5 Custom Fields for contacts, plus 2 Opportunity Custom Fields, for a total of 7 fields.', 1, NOW(), NOW()),
    (v_lesson_id, 'What should you do after creating your Custom Fields and Custom Values?', '[{"option_text": "Nothing, the setup is complete", "is_correct": false}, {"option_text": "Test them in forms, workflows, and records to ensure they work correctly", "is_correct": true}, {"option_text": "Delete them and start over", "is_correct": false}, {"option_text": "Tell your clients to stop using the CRM", "is_correct": false}]'::jsonb, 'After creating your fields and values, you should test them in real scenarios—add them to forms, use them in workflows, and verify they appear correctly on records.', 2, NOW(), NOW()),
    (v_lesson_id, 'Which business type suggestion includes ''Event Type'' as a recommended Custom Field?', '[{"option_text": "Coach or Consultant", "is_correct": false}, {"option_text": "Service Business", "is_correct": false}, {"option_text": "Speaker", "is_correct": true}, {"option_text": "All of the above", "is_correct": false}]'::jsonb, 'Event Type is listed as a suggested Contact Field for speakers, along with Speaking Topic, Event Date, Referral Source, and Follow-Up Status.', 3, NOW(), NOW());

  RAISE NOTICE 'All Module 13 lessons created successfully!';
END $$;

-- Update Lesson 7: Add Categories, Tags, and Author
-- Using color blocks, icons, horizontal cards, and better visual hierarchy

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

  UPDATE public.lessons 
  SET content = '<div class="space-y-8">
  
  <!-- Learning Goal -->
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Set the category, tags, and author for the blog post.</p>
  </div>

  <!-- Categories and Tags -->
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Categories and Tags</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Categories and tags help organize your blog and make it easier for readers to find related content.</p>
    
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Category</h4>
          <p class="text-sm text-slate-600">The main topic bucket (choose 1). Examples: Tips, News, Guides</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Tags</h4>
          <p class="text-sm text-slate-600">Specific topics (choose 2-5). Examples: lead-generation, follow-up, sales</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Author Settings -->
  <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Author Settings</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Set the author for the blog post. This builds credibility and helps readers know who wrote the content.</p>
    
    <div class="bg-white rounded-xl p-5 shadow-sm">
      <p class="font-semibold text-slate-900 mb-3">Author options:</p>
      <ul class="space-y-2">
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Select from existing authors</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Add a new author if needed</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Include author bio and photo</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Example Categories -->
  <div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Example Categories</h3>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div class="bg-white rounded-lg p-3 text-center shadow-sm">
        <span class="text-slate-700 font-medium">Tips</span>
      </div>
      <div class="bg-white rounded-lg p-3 text-center shadow-sm">
        <span class="text-slate-700 font-medium">News</span>
      </div>
      <div class="bg-white rounded-lg p-3 text-center shadow-sm">
        <span class="text-slate-700 font-medium">Guides</span>
      </div>
      <div class="bg-white rounded-lg p-3 text-center shadow-sm">
        <span class="text-slate-700 font-medium">Case Studies</span>
      </div>
      <div class="bg-white rounded-lg p-3 text-center shadow-sm">
        <span class="text-slate-700 font-medium">Industry</span>
      </div>
      <div class="bg-white rounded-lg p-3 text-center shadow-sm">
        <span class="text-slate-700 font-medium">Best Practices</span>
      </div>
    </div>
  </div>

  <!-- Key Point -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-400">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-amber-900 mb-2">Key Point</h3>
        <p class="text-amber-800 text-lg">Categories and tags help readers find more of your content. The author builds trust and credibility.</p>
      </div>
    </div>
  </div>

  <!-- Action Steps -->
  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — Prepare for Lesson 8</h3>
    </div>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
        <div>
          <p class="font-semibold text-slate-900">Select a category</p>
          <p class="text-slate-600 text-sm">Choose the best fit for your post topic</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
        <div>
          <p class="font-semibold text-slate-900">Add 2-5 tags</p>
          <p class="text-slate-600 text-sm">Use specific keywords related to your content</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
        <div>
          <p class="font-semibold text-slate-900">Set the author</p>
          <p class="text-slate-600 text-sm">Choose who should be credited for this post</p>
        </div>
      </div>
    </div>
  </div>

</div>'
  WHERE slug = 'add-categories-tags-and-author' AND module_id = v_module_id;

END $$;

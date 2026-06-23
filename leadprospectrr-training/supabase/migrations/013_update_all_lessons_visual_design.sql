-- Update ALL 11 lessons with creative visual design
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

  -- ============================================
  -- LESSON 2: Before You Write
  -- ============================================
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
    <p class="text-white/90 text-lg">Plan your blog post before opening the editor.</p>
  </div>

  <!-- Why Planning Matters -->
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Before You Write</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Before you click anything inside LeadProspectrr, take a few minutes to plan your post. This makes writing easier and helps you avoid scattered content.</p>
    
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Choose your topic</h4>
          <p class="text-sm text-slate-600">Pick one clear subject for your post</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Know your audience</h4>
          <p class="text-sm text-slate-600">Who are you writing this for?</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Pick a keyword</h4>
          <p class="text-sm text-slate-600">One main phrase to focus on</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Write your headline</h4>
          <p class="text-sm text-slate-600">Clear and compelling title</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Gather images</h4>
          <p class="text-sm text-slate-600">Collect visuals you want to use</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Decide next step</h4>
          <p class="text-sm text-slate-600">What action should reader take?</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Planning Questions -->
  <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Planning Questions</h3>
    </div>
    
    <div class="space-y-3">
      <div class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
        <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
        <p class="text-slate-700">Who am I writing this for?</p>
      </div>
      <div class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
        <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
        <p class="text-slate-700">What question am I answering?</p>
      </div>
      <div class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
        <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
        <p class="text-slate-700">What do I want the reader to understand?</p>
      </div>
      <div class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
        <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
        <p class="text-slate-700">What should they do after reading?</p>
      </div>
      <div class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
        <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
        <p class="text-slate-700">What keyword should this post focus on?</p>
      </div>
    </div>
  </div>

  <!-- Example -->
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-400">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-blue-900 mb-2">Example</h3>
        <div class="space-y-2 text-blue-800">
          <p><strong>Topic:</strong> Follow-up after a networking event</p>
          <p><strong>Audience:</strong> Small business owners</p>
          <p><strong>Keyword:</strong> follow-up with new leads</p>
          <p><strong>Headline:</strong> How to Follow Up With New Leads Without Feeling Pushy</p>
          <p><strong>Call to Action:</strong> Book a call or download a checklist</p>
        </div>
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
        <p class="text-amber-800 text-lg">Plan your post first. It will make the setup and writing much easier.</p>
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
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — Prepare for Lesson 3</h3>
    </div>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
        <div>
          <p class="font-semibold text-slate-900">Choose your topic</p>
          <p class="text-slate-600 text-sm">Pick one topic from your list in Lesson 1</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
        <div>
          <p class="font-semibold text-slate-900">Answer the 5 planning questions</p>
          <p class="text-slate-600 text-sm">Write down your answers for each question</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
        <div>
          <p class="font-semibold text-slate-900">Write your headline</p>
          <p class="text-slate-600 text-sm">Create a clear, compelling headline for your post</p>
        </div>
      </div>
    </div>
  </div>

</div>'
  WHERE slug = 'planning-your-blog-post' AND module_id = v_module_id;

  -- ============================================
  -- LESSON 3: Check Blog Settings First
  -- ============================================
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
    <p class="text-white/90 text-lg">Understand why the Settings area should be checked before creating a new blog post.</p>
  </div>

  <!-- Settings Overview -->
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Check Blog Settings First</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Before clicking New Post, check your blog settings. This is where you manage blog sites, categories, and authors. You usually only need to do this once.</p>
    
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Blog Site</h4>
          <p class="text-sm text-slate-600">Where your posts will live</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Categories</h4>
          <p class="text-sm text-slate-600">Organize your posts</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Authors</h4>
          <p class="text-sm text-slate-600">Who writes the posts</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Where to Go -->
  <div class="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg">
    <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    </div>
    <h3 class="text-xl font-bold mb-3">Where to Go</h3>
    <p class="text-2xl text-white/90 font-medium">Sites → Blog → Settings</p>
  </div>

  <!-- What to Check -->
  <div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">What to Check</h3>
    </div>
    
    <div class="space-y-4">
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h4 class="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
          Blog Site
        </h4>
        <ul class="space-y-2 ml-10">
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> The blog site has been created
          </li>
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> The name is clear
          </li>
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Connected to correct domain
          </li>
        </ul>
      </div>
      
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h4 class="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
          Categories
        </h4>
        <ul class="space-y-2 ml-10">
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Main categories created
          </li>
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Names are simple
          </li>
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Not too many at start
          </li>
        </ul>
      </div>
      
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <h4 class="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">3</span>
          Authors
        </h4>
        <ul class="space-y-2 ml-10">
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Author name added
          </li>
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Profile details correct
          </li>
          <li class="flex items-center gap-2 text-slate-700">
            <span class="text-green-500">✓</span> Correct author will show
          </li>
        </ul>
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
        <p class="text-amber-800 text-lg">Settings come before New Post. Set up the blog site, categories, and authors first. Then create the blog post.</p>
      </div>
    </div>
  </div>

  <!-- Action Steps -->
  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">

  -- ============================================
  -- LESSON 4: Create a New Blog Post
  -- ============================================
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
    <p class="text-white/90 text-lg">Create a new blog post inside LeadProspectrr.</p>
  </div>

  <!-- Create Post -->
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Create a New Blog Post</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Once your settings are ready, you can create your blog post.</p>
    
    <div class="space-y-3">
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span class="text-blue-600 font-bold text-lg">1</span>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Go to Sites</h4>
          <p class="text-sm text-slate-600">Navigate to the Sites section</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <span class="text-green-600 font-bold text-lg">2</span>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Click Blog</h4>
          <p class="text-sm text-slate-600">Select the Blog option</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <span class="text-amber-600 font-bold text-lg">3</span>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Click New Post</h4>
          <p class="text-sm text-slate-600">Start creating your content</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <span class="text-purple-600 font-bold text-lg">4</span>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Choose blog site</h4>
          <p class="text-sm text-slate-600">Select the correct site</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <span class="text-rose-600 font-bold text-lg">5</span>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Add your title</h4>
          <p class="text-sm text-slate-600">Write a clear headline</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <span class="text-cyan-600 font-bold text-lg">6</span>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">Review URL slug</h4>
          <p class="text-sm text-slate-600">Keep it short and clean</p>
        </div>
      </div>
    </div>
  </div>

  <!-- URL Slug Tip -->
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-400">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-blue-900 mb-2">URL Slug Tip</h3>
        <p class="text-blue-800 mb-2">The URL slug is the web address for your blog post. Keep it short, clear, and easy to understand.</p>
        <div class="bg-white rounded-lg p-3 mt-3">
          <p class="text-sm"><strong>Title:</strong> 5 Simple Ways to Follow Up With New Leads</p>
          <p class="text-sm text-green-600 mt-1"><strong>Good slug:</strong> follow-up-with-new-leads</p>
        </div>
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
        <p class="text-amber-800 text-lg">Your title tells people what the post is about. Your URL slug should be short and clean.</p>
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
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — Prepare for Lesson 5</h3>
    </div>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
        <div>
          <p class="font-semibold text-slate-900">Navigate to Sites → Blog → New Post</p>
          <p class="text-slate-600 text-sm">Practice finding the new post button</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
        <div>
          <p class="font-semibold text-slate-900">Enter your headline</p>
          <p class="text-slate-600 text-sm">Use the headline you wrote in Lesson 2</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
        <div>
          <p class="font-semibold text-slate-900">Review the URL slug</p>
          <p class="text-slate-600 text-sm">Make sure it is clean and simple</p>
        </div>
      </div>
    </div>
  </div>

</div>'
  WHERE slug = 'creating-a-new-blog-post' AND module_id = v_module_id;

END $$;

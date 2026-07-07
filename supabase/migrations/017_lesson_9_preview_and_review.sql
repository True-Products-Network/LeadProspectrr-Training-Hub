-- Update Lesson 9: Preview and Review
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
    <p class="text-white/90 text-lg">Check the post before publishing.</p>
  </div>

  <!-- Preview Checklist -->
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Preview and Review</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Before publishing, always preview your post. This helps you catch mistakes before your audience sees them.</p>
    
    <div class="bg-white rounded-xl p-5 shadow-sm">
      <p class="font-semibold text-slate-900 mb-3">Preview Checklist:</p>
      <ul class="space-y-2">
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Preview the post</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Check the desktop view</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Check the mobile view</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Make sure all links work</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Proofread for spelling and grammar</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Confirm the featured image displays correctly</span>
        </li>
        <li class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">✓</span>
          <span class="text-slate-700">Confirm the call to action is clear</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Things to Look For -->
  <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Things to Look For</h3>
    </div>
    
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Missing image</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Broken link</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Long paragraph</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Wrong category</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Missing author</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Weak call to action</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Typos</span>
      </div>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-slate-700">• Strange spacing</span>
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
        <p class="text-amber-800 text-lg">Preview before publishing. It is easier to fix mistakes before the post goes live.</p>
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
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — Prepare for Lesson 10</h3>
    </div>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
        <div>
          <p class="font-semibold text-slate-900">Click Preview</p>
          <p class="text-slate-600 text-sm">See how your post looks before publishing</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
        <div>
          <p class="font-semibold text-slate-900">Check on mobile</p>
          <p class="text-slate-600 text-sm">Switch to mobile view and check formatting</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
        <div>
          <p class="font-semibold text-slate-900">Click every link</p>
          <p class="text-slate-600 text-sm">Make sure all links work correctly</p>
        </div>
      </div>
    </div>
  </div>

</div>'
  WHERE slug = 'preview-and-review' AND module_id = v_module_id;

END $$;

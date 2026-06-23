-- Update Lesson 10: Publish or Schedule
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
    <p class="text-white/90 text-lg">Publish the blog post now or schedule it for later.</p>
  </div>

  <!-- Publishing Options -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Publish Now -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900">Option A: Publish Now</h3>
      </div>
      
      <p class="text-slate-700 mb-4">Use this when the post is ready to go live immediately.</p>
      
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="font-semibold text-slate-900 mb-2">Steps:</p>
        <ol class="space-y-2 text-slate-700">
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">1</span>
            <span>Click <strong>Publish</strong></span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
            <span>Confirm the post is live</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">3</span>
            <span>Copy the blog post URL</span>
          </li>
        </ol>
      </div>
    </div>

    <!-- Schedule -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900">Option B: Schedule</h3>
      </div>
      
      <p class="text-slate-700 mb-4">Use this when you want the post to go live on a future date.</p>
      
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="font-semibold text-slate-900 mb-2">Steps:</p>
        <ol class="space-y-2 text-slate-700">
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
            <span>Click dropdown next to <strong>Publish</strong></span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
            <span>Select <strong>Schedule</strong></span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">3</span>
            <span>Choose date and time</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">4</span>
            <span>Click <strong>Schedule</strong></span>
          </li>
        </ol>
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
        <p class="text-amber-800 text-lg">Publish when ready, or schedule when you want the post to go live later.</p>
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
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — Prepare for Lesson 11</h3>
    </div>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
        <div>
          <p class="font-semibold text-slate-900">Decide: Publish or Schedule?</p>
          <p class="text-slate-600 text-sm">Choose based on your content calendar</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
        <div>
          <p class="font-semibold text-slate-900">Publish your post</p>
          <p class="text-slate-600 text-sm">Or schedule it for the optimal time</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
        <div>
          <p class="font-semibold text-slate-900">Copy the blog URL</p>
          <p class="text-slate-600 text-sm">Save it somewhere — you will need it for sharing</p>
        </div>
      </div>
    </div>
  </div>

</div>'
  WHERE slug = 'publish-or-schedule' AND module_id = v_module_id;

END $$;

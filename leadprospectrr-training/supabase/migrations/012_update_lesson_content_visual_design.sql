-- Update Lesson 1 with creative visual design
-- Using color blocks, icons, and better visual hierarchy

DO $$
DECLARE
  module_id UUID;
  lesson1_id UUID;
BEGIN
  -- Get Module 1
  SELECT id INTO module_id FROM public.training_modules WHERE week_number = 1 LIMIT 1;
  
  -- Get Lesson 1
  SELECT id INTO lesson1_id FROM public.lessons WHERE slug = 'why-blog-posts-matter' AND module_id = module_id;
  
  IF lesson1_id IS NOT NULL THEN
    UPDATE public.lessons SET
      content = '<div class="space-y-8">
  
  <!-- Lesson Goal -->
  <div class="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold">Lesson Goal</h3>
    </div>
    <p class="text-white/90 text-lg">Understand why creating blog posts inside LeadProspectrr can help your business grow and build trust with your audience.</p>
  </div>

  <!-- Why Blog Posts Matter -->
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Why Blog Posts Matter</h3>
    </div>
    
    <p class="text-slate-700 mb-4 text-lg">Blog posts are a simple way to answer questions, educate your audience, and create content you can share again and again.</p>
    
    <div class="bg-white rounded-xl p-5 shadow-sm">
      <p class="font-semibold text-slate-900 mb-3">A blog post can help you:</p>
      <ul class="space-y-3">
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
          <span class="text-slate-700"><strong>Explain what you do</strong> — Clarify your services for potential clients</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
          <span class="text-slate-700"><strong>Answer common questions</strong> — Address FAQs before prospects ask</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
          <span class="text-slate-700"><strong>Share helpful tips</strong> — Demonstrate your expertise</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
          <span class="text-slate-700"><strong>Support email marketing</strong> — Give your emails valuable content to link to</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
          <span class="text-slate-700"><strong>Build trust</strong> — Give leads a reason to trust your expertise</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
          <span class="text-slate-700"><strong>Create social content</strong> — Shareable posts for your channels</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Key Point -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-400">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-amber-900 mb-2">Key Point</h3>
        <p class="text-amber-800 text-lg">Your blog content does not need to be perfect. The goal is to create useful content that helps your audience take the next step.</p>
      </div>
    </div>
  </div>

  <!-- The Golden Rule -->
  <div class="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg">
    <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
      </svg>
    </div>
    <h3 class="text-xl font-bold mb-3">The Golden Rule of Blogging</h3>
    <p class="text-xl text-white/90 font-medium">A good blog post should help the reader <span class="text-amber-300">understand something</span>, <span class="text-amber-300">solve something</span>, or <span class="text-amber-300">take the next step</span>.</p>
  </div>

  <!-- Action Steps -->
  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — Prepare for Lesson 2</h3>
    </div>
    
    <p class="text-emerald-700 mb-4">Complete these steps before moving to the next lesson. They will help you apply what you learned.</p>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
        <div>
          <p class="font-semibold text-slate-900">Identify one common question</p>
          <p class="text-slate-600 text-sm">Think about one question your customers ask often about your product or service.</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
        <div>
          <p class="font-semibold text-slate-900">Draft your answer</p>
          <p class="text-slate-600 text-sm">Write down how you would answer that question in a blog post format.</p>
        </div>
      </div>
      
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
        <div>
          <p class="font-semibold text-slate-900">Save your idea</p>
          <p class="text-slate-600 text-sm">Keep this idea ready — you will use it when creating your first blog post in Lesson 4.</p>
        </div>
      </div>
    </div>
    
    <div class="mt-5 p-4 bg-emerald-100 rounded-xl">
      <p class="text-emerald-800 text-sm flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <strong>Tip:</strong> The action steps in each lesson build on each other. Complete them to get the most from this training.
      </p>
    </div>
  </div>

</div>'
    WHERE id = lesson1_id;
  END IF;

END $$;

#!/usr/bin/env node
/**
 * Course Content Creator Skill
 * 
 * Generates visually engaging course lesson content with consistent formatting.
 * Creates SQL migration files ready for Supabase/PostgreSQL.
 * 
 * Features:
 * - Interactive CLI for lesson creation
 * - Quiz question generation
 * - Multiple module support
 * - Batch creation from JSON files
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Types
interface QuizOption {
  option_text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

interface LessonSection {
  title: string;
  icon: string;
  color: string;
  items: Array<{
    icon: string;
    color: string;
    title: string;
    description: string;
  }>;
}

interface ActionStep {
  number: number;
  title: string;
  description: string;
}

interface LessonData {
  lessonNumber: number;
  slug: string;
  title: string;
  moduleWeek: number;
  moduleName: string;
  learningGoal: string;
  sections: LessonSection[];
  keyPoint: string;
  actionSteps: ActionStep[];
  nextLessonTitle: string;
  quizzes?: QuizQuestion[];
}

// Icon library
const ICONS: Record<string, string> = {
  target: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
  pencil: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
  info: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  users: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
  tag: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>',
  link: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>',
  image: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  search: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
  eye: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
  check: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
  clock: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  share: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>',
  lightbulb: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
  checklist: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
  warning: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
  star: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
  mail: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
  chat: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>',
  location: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  settings: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  question: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  book: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
  video: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
  document: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
  download: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>',
  play: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  trophy: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
};

const COLORS = ['blue', 'green', 'amber', 'purple', 'rose', 'cyan', 'indigo', 'violet', 'teal', 'pink'];

// HTML Generators
function generateLearningGoal(goal: string): string {
  return `  <!-- Learning Goal -->
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        ${ICONS.target}
      </div>
      <h3 class="text-lg font-bold">Learning Goal</h3>
    </div>
    <p class="text-white/90 text-lg">${goal}</p>
  </div>`;
}

function generateContentSection(section: LessonSection): string {
  const itemsHtml = section.items.map((item, index) => {
    const color = item.color || COLORS[index % COLORS.length];
    return `
      <div class="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0">
          ${ICONS[item.icon] || ICONS.info}
        </div>
        <div>
          <h4 class="font-semibold text-slate-900">${item.title}</h4>
          <p class="text-sm text-slate-600">${item.description}</p>
        </div>
      </div>`;
  }).join('');

  return `
  <!-- ${section.title} -->
  <div class="bg-gradient-to-br from-slate-50 to-${section.color}-50 rounded-2xl p-6 border border-${section.color}-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-${section.color}-100 flex items-center justify-center">
        ${ICONS[section.icon] || ICONS.info}
      </div>
      <h3 class="text-xl font-bold text-slate-900">${section.title}</h3>
    </div>
    
    <div class="space-y-3">
      ${itemsHtml}
    </div>
  </div>`;
}

function generateKeyPoint(point: string): string {
  return `
  <!-- Key Point -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-400">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        ${ICONS.lightbulb}
      </div>
      <div>
        <h3 class="text-lg font-bold text-amber-900 mb-2">Key Point</h3>
        <p class="text-amber-800 text-lg">${point}</p>
      </div>
    </div>
  </div>`;
}

function generateActionSteps(steps: ActionStep[], nextLessonTitle: string): string {
  const stepsHtml = steps.map(step => `
      <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">${step.number}</div>
        <div>
          <p class="font-semibold text-slate-900">${step.title}</p>
          <p class="text-slate-600 text-sm">${step.description}</p>
        </div>
      </div>`).join('');

  return `
  <!-- Action Steps -->
  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
        ${ICONS.checklist}
      </div>
      <h3 class="text-xl font-bold text-emerald-900">Action Steps — ${nextLessonTitle}</h3>
    </div>
    
    <div class="space-y-4">
      ${stepsHtml}
    </div>
  </div>`;
}

// SQL Generators
function generateLessonSQL(data: LessonData): string {
  const content = `<div class="space-y-8">
${generateLearningGoal(data.learningGoal)}
${data.sections.map(s => generateContentSection(s)).join('')}
${generateKeyPoint(data.keyPoint)}
${generateActionSteps(data.actionSteps, data.nextLessonTitle)}
</div>`;

  return `-- Insert/Update Lesson ${data.lessonNumber}: ${data.title}
-- Module ${data.moduleWeek}: ${data.moduleName}
-- Using color blocks, icons, horizontal cards, and better visual hierarchy

DO $$
DECLARE
  v_module_id UUID;
  v_lesson_id UUID;
BEGIN
  -- Get Module by week number
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = ${data.moduleWeek} LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'Module ${data.moduleWeek} not found';
    RETURN;
  END IF;

  -- Check if lesson exists
  SELECT id INTO v_lesson_id 
  FROM public.lessons 
  WHERE slug = '${data.slug}' AND module_id = v_module_id;
  
  IF v_lesson_id IS NULL THEN
    -- Insert new lesson
    INSERT INTO public.lessons (
      module_id, 
      lesson_number, 
      title, 
      slug, 
      content, 
      is_published, 
      sort_order,
      created_at,
      updated_at
    ) VALUES (
      v_module_id,
      ${data.lessonNumber},
      '${data.title.replace(/'/g, "''")}',
      '${data.slug}',
      '${content.replace(/'/g, "''")}',
      true,
      ${data.lessonNumber},
      NOW(),
      NOW()
    )
    RETURNING id INTO v_lesson_id;
    
    RAISE NOTICE 'Created lesson: ${data.title}';
  ELSE
    -- Update existing lesson
    UPDATE public.lessons 
    SET 
      content = '${content.replace(/'/g, "''")}',
      title = '${data.title.replace(/'/g, "''")}',
      lesson_number = ${data.lessonNumber},
      sort_order = ${data.lessonNumber},
      updated_at = NOW()
    WHERE id = v_lesson_id;
    
    RAISE NOTICE 'Updated lesson: ${data.title}';
  END IF;

END $$;
`;
}

function generateQuizSQL(data: LessonData): string {
  if (!data.quizzes || data.quizzes.length === 0) return '';

  let sql = `-- Insert Quiz Questions for Lesson: ${data.title}

DO $$
DECLARE
  v_module_id UUID;
  v_lesson_id UUID;
  v_quiz_id UUID;
BEGIN
  -- Get Module by week number
  SELECT id INTO v_module_id FROM public.training_modules WHERE week_number = ${data.moduleWeek} LIMIT 1;
  
  IF v_module_id IS NULL THEN
    RAISE NOTICE 'Module ${data.moduleWeek} not found';
    RETURN;
  END IF;

  -- Get the lesson ID
  SELECT id INTO v_lesson_id 
  FROM public.lessons 
  WHERE slug = '${data.slug}' AND module_id = v_module_id;
  
  IF v_lesson_id IS NULL THEN
    RAISE NOTICE 'Lesson ${data.slug} not found in module ${data.moduleWeek}';
    RETURN;
  END IF;
  
  -- Delete existing quizzes to avoid duplicates
  DELETE FROM public.lesson_quizzes WHERE lesson_id = v_lesson_id;

`;

  data.quizzes.forEach((quiz, index) => {
    // Build options JSON array
    const optionsJson = JSON.stringify(quiz.options.map((o, i) => ({
      id: i + 1,
      text: o.option_text,
      is_correct: o.is_correct
    })));
    
    // Find the correct answer (index + 1 since IDs are 1-based)
    const correctAnswer = quiz.options.findIndex(o => o.is_correct) + 1;
    
    sql += `
  -- Question ${index + 1}
  INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, sort_order)
  VALUES (
    v_lesson_id, 
    '${quiz.question.replace(/'/g, "''")}', 
    '${optionsJson.replace(/'/g, "''")}'::jsonb,
    ${correctAnswer},
    '${quiz.explanation.replace(/'/g, "''")}', 
    ${index + 1}
  )
  RETURNING id INTO v_quiz_id;

`;
  });

  sql += `END $$;
`;

  return sql;
}

function generateFullSQL(data: LessonData): string {
  const lessonSQL = generateLessonSQL(data);
  const quizSQL = generateQuizSQL(data);
  
  return `-- Lesson ${data.lessonNumber}: ${data.title}
-- Module ${data.moduleWeek}: ${data.moduleName}
-- Generated by Course Content Creator Skill

${lessonSQL}

${quizSQL}`;
}

// Interactive CLI
async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (question: string): Promise<string> => {
    return new Promise(resolve => rl.question(question, resolve));
  };

  console.log('🎓 Course Content Creator\n');
  console.log('This skill generates visually engaging lesson content.\n');

  const data: LessonData = {
    lessonNumber: parseInt(await ask('Lesson number: ')),
    slug: await ask('Lesson slug (e.g., "lesson-title"): '),
    title: await ask('Lesson title: '),
    moduleWeek: parseInt(await ask('Module week number: ') || '1'),
    moduleName: await ask('Module name: ') || 'Blog Posts',
    learningGoal: await ask('Learning goal (single statement): '),
    sections: [],
    keyPoint: '',
    actionSteps: [],
    nextLessonTitle: '',
    quizzes: []
  };

  console.log('\n--- Content Sections ---');
  console.log('Add sections with items (title, icon, color, and list of items)\n');

  let addMoreSections = true;
  while (addMoreSections) {
    const sectionTitle = await ask('Section title (or "done"): ');
    if (sectionTitle.toLowerCase() === 'done') break;

    const section: LessonSection = {
      title: sectionTitle,
      icon: await ask('Section icon (pencil/info/users/tag/link/image/search/eye/settings/book/video/document): '),
      color: await ask('Section color (blue/green/amber/purple/rose/cyan/indigo/violet/teal/pink): '),
      items: []
    };

    console.log('  Add items to this section:');
    let addMoreItems = true;
    while (addMoreItems) {
      const itemTitle = await ask('    Item title (or "done"): ');
      if (itemTitle.toLowerCase() === 'done') break;

      section.items.push({
        icon: await ask('    Item icon: '),
        color: await ask('    Item color: '),
        title: itemTitle,
        description: await ask('    Item description: ')
      });
    }

    data.sections.push(section);
  }

  data.keyPoint = await ask('\nKey point (highlighted takeaway): ');
  data.nextLessonTitle = await ask('Next lesson title (for action steps header): ');

  console.log('\n--- Action Steps ---');
  let addMoreSteps = true;
  let stepNumber = 1;
  while (addMoreSteps) {
    const stepTitle = await ask(`Action step ${stepNumber} title (or "done"): `);
    if (stepTitle.toLowerCase() === 'done') break;

    data.actionSteps.push({
      number: stepNumber,
      title: stepTitle,
      description: await ask(`Action step ${stepNumber} description: `)
    });
    stepNumber++;
  }

  // Quiz questions - exactly 3 required
  console.log('\n--- Quiz Questions (3 Required) ---');
  
  for (let questionNumber = 1; questionNumber <= 3; questionNumber++) {
    console.log(`\n📋 Question ${questionNumber} of 3:`);
    const question = await ask('Question text: ');

    const quiz: QuizQuestion = {
      question: question,
      options: [],
      explanation: ''
    };

    console.log('  Add 2-4 options (mark one as correct):');
    let optionCount = 0;
    for (let i = 1; i <= 4; i++) {
      const optionText = await ask(`    Option ${i} (or "done"): `);
      if (optionText.toLowerCase() === 'done') break;
      
      const isCorrect = (await ask('    Is this the correct answer? (y/n): ')).toLowerCase() === 'y';
      quiz.options.push({
        option_text: optionText,
        is_correct: isCorrect
      });
      optionCount++;
    }

    quiz.explanation = await ask('  Explanation (shown after answering): ');
    data.quizzes!.push(quiz);
  }

  const sql = generateFullSQL(data);
  const filename = `lesson_${data.lessonNumber}_${data.slug}.sql`;
  
  fs.writeFileSync(filename, sql);
  console.log(`\n✅ Created: ${filename}`);
  
  rl.close();
}

// Parse JSON input - handles both single objects and arrays
function parseLessons(jsonContent: string): LessonData[] {
  const parsed = JSON.parse(jsonContent);
  
  // If it's an array, return it directly
  if (Array.isArray(parsed)) {
    return parsed;
  }
  
  // If it's a single object, wrap it in an array
  if (typeof parsed === 'object' && parsed !== null) {
    return [parsed];
  }
  
  throw new Error('Invalid JSON: expected object or array');
}

// Validate lesson data
function validateLesson(lesson: LessonData, index: number): string[] {
  const errors: string[] = [];
  const prefix = `Lesson ${index + 1}`;
  
  if (!lesson.lessonNumber) errors.push(`${prefix}: missing lessonNumber`);
  if (!lesson.slug) errors.push(`${prefix}: missing slug`);
  if (!lesson.title) errors.push(`${prefix}: missing title`);
  if (!lesson.moduleWeek) errors.push(`${prefix}: missing moduleWeek`);
  if (!lesson.moduleName) errors.push(`${prefix}: missing moduleName`);
  if (!lesson.learningGoal) errors.push(`${prefix}: missing learningGoal`);
  if (!lesson.keyPoint) errors.push(`${prefix}: missing keyPoint`);
  if (!lesson.nextLessonTitle) errors.push(`${prefix}: missing nextLessonTitle`);
  
  if (!lesson.sections || lesson.sections.length === 0) {
    errors.push(`${prefix}: no sections defined`);
  }
  
  if (!lesson.actionSteps || lesson.actionSteps.length === 0) {
    errors.push(`${prefix}: no actionSteps defined`);
  }
  
  // Validate quizzes - exactly 3 required
  if (!lesson.quizzes || lesson.quizzes.length === 0) {
    errors.push(`${prefix}: no quizzes defined (3 required)`);
  } else if (lesson.quizzes.length !== 3) {
    errors.push(`${prefix}: must have exactly 3 quizzes (found ${lesson.quizzes.length})`);
  } else {
    // Validate each quiz has at least 2 options and exactly 1 correct answer
    lesson.quizzes.forEach((quiz, qIndex) => {
      if (!quiz.options || quiz.options.length < 2) {
        errors.push(`${prefix}: quiz ${qIndex + 1} must have at least 2 options`);
      }
      const correctCount = quiz.options?.filter(o => o.is_correct).length || 0;
      if (correctCount !== 1) {
        errors.push(`${prefix}: quiz ${qIndex + 1} must have exactly 1 correct answer (found ${correctCount})`);
      }
    });
  }
  
  return errors;
}

// Batch mode from JSON file or directory
async function batchMode(inputPath: string) {
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File or directory not found: ${inputPath}`);
    process.exit(1);
  }

  const stats = fs.statSync(inputPath);
  let lessons: LessonData[] = [];
  let sourceFiles: string[] = [];
  
  if (stats.isDirectory()) {
    // Process all JSON files in directory
    const files = fs.readdirSync(inputPath)
      .filter(f => f.endsWith('.json'))
      .sort();
    
    if (files.length === 0) {
      console.error(`❌ No JSON files found in directory: ${inputPath}`);
      process.exit(1);
    }
    
    console.log(`📁 Found ${files.length} JSON files in directory\n`);
    
    for (const file of files) {
      const filePath = path.join(inputPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        const fileLessons = parseLessons(content);
        lessons.push(...fileLessons);
        sourceFiles.push(file);
        console.log(`  📄 Loaded: ${file} (${fileLessons.length} lesson(s))`);
      } catch (err) {
        console.error(`  ❌ Error in ${file}: ${(err as Error).message}`);
      }
    }
    console.log();
  } else {
    // Process single JSON file
    const content = fs.readFileSync(inputPath, 'utf-8');
    lessons = parseLessons(content);
    sourceFiles = [path.basename(inputPath)];
  }
  
  if (lessons.length === 0) {
    console.error('❌ No valid lessons found');
    process.exit(1);
  }
  
  // Validate all lessons
  console.log('🔍 Validating lessons...\n');
  const allErrors: string[] = [];
  for (let i = 0; i < lessons.length; i++) {
    const errors = validateLesson(lessons[i], i);
    allErrors.push(...errors);
  }
  
  if (allErrors.length > 0) {
    console.error('❌ Validation errors found:\n');
    allErrors.forEach(err => console.error(`  • ${err}`));
    console.error('\nPlease fix these errors and try again.');
    process.exit(1);
  }
  
  console.log(`✅ All ${lessons.length} lessons validated\n`);
  console.log(`🔄 Processing ${lessons.length} lessons...\n`);

  // Create output directory if it doesn't exist
  const outputDir = 'generated-sql';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const lesson of lessons) {
    const sql = generateFullSQL(lesson);
    const filename = `lesson_${lesson.lessonNumber}_${lesson.slug}.sql`;
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, sql);
    console.log(`✅ Created: ${outputPath}`);
  }

  // Create combined SQL file
  const combinedSQL = lessons.map(l => generateFullSQL(l)).join('\n\n');
  const combinedPath = path.join(outputDir, 'all-lessons.sql');
  fs.writeFileSync(combinedPath, combinedSQL);
  console.log(`\n📦 Combined: ${combinedPath}`);

  console.log(`\n🎉 Generated ${lessons.length} lesson files in ${outputDir}/`);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    const inputPath = args[0];
    // Check if it's a JSON file or directory
    if (inputPath.endsWith('.json') || fs.existsSync(inputPath) && fs.statSync(inputPath).isDirectory()) {
      // Batch mode (file or directory)
      await batchMode(inputPath);
      return;
    }
  }
  
  // Interactive mode
  await interactiveMode();
}

main().catch(console.error);

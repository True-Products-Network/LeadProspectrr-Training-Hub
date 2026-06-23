#!/usr/bin/env node
/**
 * Course Content Creator Skill
 * 
 * Generates visually engaging course lesson content with consistent formatting.
 * Creates SQL migration files ready for Supabase/PostgreSQL.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

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
  learningGoal: string;
  sections: LessonSection[];
  keyPoint: string;
  actionSteps: ActionStep[];
  nextLessonTitle: string;
}

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
};

const COLORS = ['blue', 'green', 'amber', 'purple', 'rose', 'cyan', 'indigo', 'violet'];

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

function generateSQL(data: LessonData): string {
  const content = `<div class="space-y-8">
${generateLearningGoal(data.learningGoal)}
${data.sections.map(s => generateContentSection(s)).join('')}
${generateKeyPoint(data.keyPoint)}
${generateActionSteps(data.actionSteps, data.nextLessonTitle)}
</div>`;

  return `-- Update Lesson ${data.lessonNumber}: ${data.title}
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
  SET content = '${content.replace(/'/g, "''")}'
  WHERE slug = '${data.slug}' AND module_id = v_module_id;

END $$;
`;
}

async function main() {
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
    learningGoal: await ask('Learning goal (single statement): '),
    sections: [],
    keyPoint: '',
    actionSteps: [],
    nextLessonTitle: ''
  };

  console.log('\n--- Content Sections ---');
  console.log('Add sections with items (title, icon, color, and list of items)\n');

  let addMoreSections = true;
  while (addMoreSections) {
    const sectionTitle = await ask('Section title (or "done"): ');
    if (sectionTitle.toLowerCase() === 'done') break;

    const section: LessonSection = {
      title: sectionTitle,
      icon: await ask('Section icon (pencil/info/users/tag/link/image/search/eye/settings): '),
      color: await ask('Section color (blue/green/amber/purple/rose/cyan/indigo/violet): '),
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

  const sql = generateSQL(data);
  const filename = `lesson_${data.lessonNumber}_${data.slug}.sql`;
  
  fs.writeFileSync(filename, sql);
  console.log(`\n✅ Created: ${filename}`);
  
  rl.close();
}

main().catch(console.error);

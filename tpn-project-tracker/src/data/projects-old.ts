export type Status = 'Not Started' | 'In Progress' | 'Review' | 'Complete' | 'Parked';
export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Build Backlog' | 'Ideas & Wishlist' | 'Marketing Assets' | 'Technical Builds' | 'Client Projects' | 'Content';

export interface Project {
  id: string;
  name: string;
  category: Category;
  description: string;
  status: Status;
  priority: Priority;
  owner: string;
  dueDate: string | null;
  nextAction: string;
  assetLocation: string;
  revenueImpact: string;
  goalIds?: string[]; // Links to strategic goals
  progress?: number; // 0-100 calculated from tasks
}

export const projects: Project[] = [
  // BUILD BACKLOG - HIGH PRIORITY
  {
    id: '1',
    name: 'Advanced Security Level Supabase Skill',
    category: 'Build Backlog',
    description: 'OpenClaw add-on skill pack covering Supabase setup, RLS, API keys, schema review, security rules, database checklist, and example business directory schema.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-15',
    nextAction: 'Package files, test against real Supabase project, add security review prompts',
    assetLocation: '/workspace/supabase_advanced/',
    revenueImpact: '$5,000 - Skill pack sales'
  },
  {
    id: '2',
    name: 'GHL Build Manager for OpenClaw',
    category: 'Build Backlog',
    description: 'Main skill that manages GoHighLevel/LeadProspectrr tasks, with sub-skills for workflows, email templates, campaigns, social posts, landing pages, websites, funnels, calendars, and domain setup.',
    status: 'Not Started',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-30',
    nextAction: 'Create final folder structure, scope matrix, API key handling, and safe execution checklist',
    assetLocation: '/workspace/openclaw/',
    revenueImpact: '$10,000 - Agency efficiency + client delivery'
  },
  {
    id: '3',
    name: 'STL Business Guide Rebuild',
    category: 'Build Backlog',
    description: 'Rebuild stlbusinessguide.com with documented pages, listings database, forms, search, claim/redeem offers, local content engine, and admin dashboard.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-08-15',
    nextAction: 'Confirm schema, stack, data entry process, admin dashboard fields, and listing import plan',
    assetLocation: '/workspace/STL-Business-Guide-v3/',
    revenueImpact: '$3,000/mo - Directory subscriptions + ads'
  },
  {
    id: '4',
    name: 'Business System Hub Launch Engine',
    category: 'Build Backlog',
    description: 'Annual plan offer with CRM, AI hub, snapshot, navigator session, blueprint, templates, setup bonuses, emails, SMS, and sales page assets.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-20',
    nextAction: 'Review launch sequence, update deadline/pricing, connect assets to CRM automation',
    assetLocation: '/workspace/tpn-dashboard/',
    revenueImpact: '$60,000/yr - Annual subscriptions'
  },
  {
    id: '5',
    name: 'LeadProspectrr Training Library',
    category: 'Build Backlog',
    description: 'Clinic series with dummies guides, cheat sheets, emails, images, and session processes for contacts, email marketing, conversations inbox, smart lists, and other GHL features.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-25',
    nextAction: 'Create index page and downloadable resource library',
    assetLocation: '/workspace/tpn-dashboard/',
    revenueImpact: '$2,497/mo - Training memberships'
  },
  
  // BUILD BACKLOG - MEDIUM PRIORITY
  {
    id: '6',
    name: 'Speaker Follow-Up Playbook Funnel',
    category: 'Build Backlog',
    description: 'Lead magnet for speakers/trainers including guide, checklist, quiz, outcome types, nurture emails, and booking CTA.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-08-30',
    nextAction: 'Build landing page, quiz, delivery automation, and follow-up sequence',
    assetLocation: '/workspace/marketing-assets/',
    revenueImpact: '$5,000 - Lead gen + consulting clients'
  },
  {
    id: '7',
    name: '42-Day Community Challenge',
    category: 'Build Backlog',
    description: 'Paid membership launch challenge to help people create a community and reach 100 founding members.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-09-15',
    nextAction: 'Package curriculum, call schedule, sales page, onboarding, KPI dashboard',
    assetLocation: '/workspace/community-challenge/',
    revenueImpact: '$15,000 - Challenge revenue'
  },
  {
    id: '8',
    name: 'YouTube Content System',
    category: 'Build Backlog',
    description: '30 short videos and later batches covering marketing, AI, automation, systems, and business growth.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-09-01',
    nextAction: 'Create production tracker, upload calendar, thumbnail/template set',
    assetLocation: '/workspace/youtube-content/',
    revenueImpact: '$2,000/mo - Ad revenue + lead gen'
  },
  {
    id: '9',
    name: 'NSA St. Louis Tech Operations System',
    category: 'Build Backlog',
    description: 'Hybrid meeting setup, color-coded plug-and-play AV kit, speaker support, volunteer setup guide, and tech operations plan.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-08-01',
    nextAction: 'Finalize proposal, one-page visual, checklist, and volunteer training guide',
    assetLocation: '/workspace/nsa-stl/',
    revenueImpact: '$3,000 - Sponsorship + service fees'
  },
  {
    id: '10',
    name: 'Client Document Consistency System',
    category: 'Build Backlog',
    description: 'Terms, SOW, agreement, and legal document consistency cleanup across client systems.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-08-15',
    nextAction: 'Create standard template pack and review workflow',
    assetLocation: '/workspace/client-templates/',
    revenueImpact: '$1,000 - Time savings + professionalism'
  },

  // IDEAS & WISHLIST
  {
    id: '11',
    name: 'Local Newsletter Engine',
    category: 'Ideas & Wishlist',
    description: '100+ STL Business Guide newsletter topics around hidden gems, coffee shops, patios, restaurants, family activities, shopping, wellness, real estate, and local spotlights.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create content calendar and topic clusters',
    assetLocation: '/workspace/stl-business-guide-newsletter/',
    revenueImpact: '$1,500/mo - Newsletter sponsorships'
  },
  {
    id: '12',
    name: 'Local Business Redemption System',
    category: 'Ideas & Wishlist',
    description: 'Coupon redemption emails and offer claim flow for STLBusinessGuide.com customers and participating businesses.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Design redemption flow and email sequences',
    assetLocation: '/workspace/stl-business-guide/',
    revenueImpact: '$500/mo - Transaction fees'
  },
  {
    id: '13',
    name: 'Smart Lists Feature Education',
    category: 'Ideas & Wishlist',
    description: 'Company Smart Lists enable filtered/sorted reusable company views, sharing, duplicate/export/rename/delete, and managed list library.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create training video and documentation',
    assetLocation: '/workspace/training/',
    revenueImpact: '$500 - Training sales'
  },
  {
    id: '14',
    name: 'AI/Automation Workshops',
    category: 'Ideas & Wishlist',
    description: 'Training that shows small businesses how to simplify marketing using AI and automation without making it feel too technical.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Outline workshop curriculum and pricing',
    assetLocation: '/workspace/workshops/',
    revenueImpact: '$5,000 - Workshop fees'
  },
  {
    id: '15',
    name: 'Membership Forum Onboarding',
    category: 'Ideas & Wishlist',
    description: 'Visitor/member welcome sequences for Men Mentoring Men Network, with paid forum access, visitor documentation, and conversion path.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Map visitor-to-paid-member journey',
    assetLocation: '/workspace/membership/',
    revenueImpact: '$1,000/mo - Membership growth'
  },
  {
    id: '16',
    name: 'Website Analysis Blueprint',
    category: 'Ideas & Wishlist',
    description: 'A process for auditing an existing website page by page before rebuilding it in a new stack.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create audit checklist and report template',
    assetLocation: '/workspace/blueprints/',
    revenueImpact: '$2,000 - Audit service fees'
  },
  {
    id: '17',
    name: 'OpenClaw Skill Setup Methodology',
    category: 'Ideas & Wishlist',
    description: 'Repeatable method for creating skills from API documentation, process steps, secrets, scopes, and safe task boundaries.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Document methodology and create template',
    assetLocation: '/workspace/openclaw/',
    revenueImpact: '$3,000 - Skill development efficiency'
  },
  {
    id: '18',
    name: 'Supabase/Airtable/GHL Data Entry Model',
    category: 'Ideas & Wishlist',
    description: 'Decision model for where forms, listings, subscriptions, contact records, and business data should live.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create decision tree diagram and guidelines',
    assetLocation: '/workspace/architecture/',
    revenueImpact: '$1,000 - Architecture consulting'
  },
  {
    id: '19',
    name: 'Local Visual Campaign Library',
    category: 'Ideas & Wishlist',
    description: 'Images and infographics for STL Business Guide, LeadProspectrr clinics, cheat sheets, dummies guides, and local content.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create brand guidelines and template set',
    assetLocation: '/workspace/creative-assets/',
    revenueImpact: '$500 - Asset reuse value'
  },
  {
    id: '20',
    name: 'Schedule/Time Operating System',
    category: 'Ideas & Wishlist',
    description: 'Weekly operating rhythm with deep work, admin/comms, meetings/calls, buffer, daily Pick 3, and Friday reset.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create Notion template and workflow',
    assetLocation: '/workspace/personal-ops/',
    revenueImpact: '$0 - Personal productivity'
  },

  // MARKETING ASSETS
  {
    id: '21',
    name: 'Business System Hub Campaign',
    category: 'Marketing Assets',
    description: 'Annual offer, launch pricing, bonuses, sales angles, comparison flyer, launch emails, reactivation emails, SMS reminders, Snapshot/Navigator/Growth Blueprint framing.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-20',
    nextAction: 'Review and connect into live campaign',
    assetLocation: '/workspace/tpn-dashboard/',
    revenueImpact: '$60,000/yr'
  },
  {
    id: '22',
    name: 'LeadProspectrr/GHL Clinics',
    category: 'Marketing Assets',
    description: 'Week 3 email marketing, Week 4 conversations inbox, smart lists feature, cheat sheets, dummies guides, session processes, invite emails, thank-you emails.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-25',
    nextAction: 'Create training hub and archive all resources',
    assetLocation: '/workspace/tpn-dashboard/',
    revenueImpact: '$2,497/mo'
  },
  {
    id: '23',
    name: 'Speaker Follow-Up Playbook',
    category: 'Marketing Assets',
    description: 'Lead magnet, checklist, quiz outcomes, delivery email, nurture emails, case-study email, booking call CTA.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-08-30',
    nextAction: 'Build funnel and track conversions',
    assetLocation: '/workspace/marketing-assets/',
    revenueImpact: '$5,000 - Lead gen'
  },
  {
    id: '24',
    name: '7-Day Marketing Made Simple Training',
    category: 'Marketing Assets',
    description: 'Day-by-day structure: strategy, AI, automation, presence, content, data, relationships.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Package into evergreen mini-course',
    assetLocation: '/workspace/training/',
    revenueImpact: '$1,000 - Course sales'
  },
  {
    id: '25',
    name: 'Email Templates Library',
    category: 'Marketing Assets',
    description: 'Many emails drafted for scheduling, client project updates, CRM handoffs, NSA clarification, Talkadot updates, PCN appeal correspondence.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create reusable email swipe file',
    assetLocation: '/workspace/email-templates/',
    revenueImpact: '$500 - Time savings'
  },

  // TECHNICAL BUILDS
  {
    id: '26',
    name: 'OpenClaw Supabase Expert Skill',
    category: 'Technical Builds',
    description: 'Supabase setup, API docs, database management, security, RLS/RSL wording correction, schema setup, checklists.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-15',
    nextAction: 'Needs full folder package and testing',
    assetLocation: '/workspace/supabase_specialist/',
    revenueImpact: '$5,000 - Skill sales'
  },
  {
    id: '27',
    name: 'OpenClaw GHL Build Manager',
    category: 'Technical Builds',
    description: 'API key handling, page validation, workflows, email templates, campaigns, social posts, landing pages, websites, funnels, domain setup.',
    status: 'Not Started',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-30',
    nextAction: 'Create manager + 8 sub-skills',
    assetLocation: '/workspace/openclaw/',
    revenueImpact: '$10,000 - Efficiency gains'
  },
  {
    id: '28',
    name: 'OpenClaw White Label Suite Lead Intelligence',
    category: 'Technical Builds',
    description: 'General flow, API/webhook understanding, lead intelligence automation.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create initial skill package and later add API-specific tasks',
    assetLocation: '/workspace/openclaw/',
    revenueImpact: '$3,000 - Lead intelligence service'
  },
  {
    id: '29',
    name: 'STL Business Guide Database',
    category: 'Technical Builds',
    description: 'Need backend for listings, search, claim/redeem, business profiles, admin dashboard.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-08-15',
    nextAction: 'Likely Supabase-backed; define schema and permissions',
    assetLocation: '/workspace/STL-Business-Guide-v3/',
    revenueImpact: '$3,000/mo'
  },
  {
    id: '30',
    name: 'Website Iframe/Form Fixes',
    category: 'Technical Builds',
    description: 'Safari flickering fixes, embedded GHL/Cal forms, heights, same-page iframe handling.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create reusable iframe CSS/snippet library',
    assetLocation: '/workspace/technical-snippets/',
    revenueImpact: '$500 - Client fixes'
  },
  {
    id: '31',
    name: 'Logo/Web Image Processing',
    category: 'Technical Builds',
    description: 'Resize logos to 90px wide, monochrome/black-and-white, individual website-ready downloads.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create repeatable image prep process',
    assetLocation: '/workspace/image-processing/',
    revenueImpact: '$200 - Time savings'
  },
  {
    id: '32',
    name: 'GHL Feature Training System',
    category: 'Technical Builds',
    description: 'Company Smart Lists, conversations inbox, email templates/campaigns, lead prospector usage.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create internal product education library',
    assetLocation: '/workspace/training/',
    revenueImpact: '$2,497/mo'
  },
  {
    id: '33',
    name: 'API/Database Decision Model',
    category: 'Technical Builds',
    description: 'Firebase vs Supabase vs Airtable vs GHL discussion for subscriptions/listings/business guides.',
    status: 'Not Started',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Finalize stack rules by use case',
    assetLocation: '/workspace/architecture/',
    revenueImpact: '$1,000 - Consulting'
  },

  // CLIENT PROJECTS
  {
    id: '34',
    name: 'NSA St. Louis',
    category: 'Client Projects',
    description: 'Technology/operations, hybrid meetings, OWL device, speaker support, volunteer tech setup, member pages, Speakers Academy, referral forms, board emails.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-08-01',
    nextAction: 'Finalize plug-and-play proposal and volunteer instructions',
    assetLocation: '/workspace/nsa-stl/',
    revenueImpact: '$3,000 - Sponsorship'
  },
  {
    id: '35',
    name: 'AIM Training & Consulting / Amy Lemire',
    category: 'Client Projects',
    description: 'Full site structure, SEO, retreat landing, book/program pages, CSP positioning.',
    status: 'Parked',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Keep as reference for speaker/coach builds',
    assetLocation: '/workspace/client-projects/aim/',
    revenueImpact: '$0 - Reference only'
  },
  {
    id: '36',
    name: 'Men Mentoring Men Network',
    category: 'Client Projects',
    description: 'GHL site, paid membership, visitor area, forum categories, onboarding/welcome messaging.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Refine visitor-to-paid-member path',
    assetLocation: '/workspace/client-projects/mmmn/',
    revenueImpact: '$1,000/mo - Membership'
  },
  {
    id: '37',
    name: 'Keane Insights / Nicole Van Valen',
    category: 'Client Projects',
    description: 'CRM optimization, calendar, funnel, reputation, course workflows, payment/timeline proposal.',
    status: 'Parked',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Use as CRM build case study',
    assetLocation: '/workspace/client-projects/keane/',
    revenueImpact: '$0 - Reference only'
  },
  {
    id: '38',
    name: 'Willie Blue / Maximum Blue LLC',
    category: 'Client Projects',
    description: 'Leadership speaking/workshop site copy, military leadership background, book positioning.',
    status: 'Parked',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Maintain as speaker site example',
    assetLocation: '/workspace/client-projects/willieblue/',
    revenueImpact: '$0 - Reference only'
  },
  {
    id: '39',
    name: 'Talkadot / Tonya',
    category: 'Client Projects',
    description: 'Email template review, cadence file, CRM import tasks.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create template update workflow',
    assetLocation: '/workspace/client-projects/talkadot/',
    revenueImpact: '$500 - Service fee'
  },
  {
    id: '40',
    name: 'HoneyBook to CRM Transition',
    category: 'Client Projects',
    description: 'CRM completion, copied HoneyBook content, document consistency issue, new contact migration reminder.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Use as client migration checklist',
    assetLocation: '/workspace/client-projects/migration/',
    revenueImpact: '$1,000 - Migration service'
  },
  {
    id: '41',
    name: 'HydroBoost STL',
    category: 'Client Projects',
    description: 'Competitor radius and ad revisions.',
    status: 'Parked',
    priority: 'Low',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Store as local ad planning example',
    assetLocation: '/workspace/client-projects/hydroboost/',
    revenueImpact: '$0 - Reference only'
  },
  {
    id: '42',
    name: 'Other Client Updates',
    category: 'Client Projects',
    description: 'David Day, Mike McGuire, Angel Tucker, Donna-Marie Realty, Traci Ruiz, and other smaller site/CRM/content tasks.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Keep as separate client mini-project index',
    assetLocation: '/workspace/client-projects/mini/',
    revenueImpact: '$2,000 - Various services'
  },

  // CONTENT
  {
    id: '43',
    name: 'STL Business Guide Content Engine',
    category: 'Content',
    description: 'Newsletter ideas, blog post topics, local guide images, redemption emails, business listing copy, footer language.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-08-15',
    nextAction: 'Build content calendar and image templates',
    assetLocation: '/workspace/stl-business-guide-newsletter/',
    revenueImpact: '$1,500/mo - Content monetization'
  },
  {
    id: '44',
    name: 'YouTube Video Scripts',
    category: 'Content',
    description: 'Short video series around marketing, AI, automation, systems, and business growth.',
    status: 'Not Started',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: '2026-09-01',
    nextAction: 'Create script templates and batch produce',
    assetLocation: '/workspace/youtube-content/',
    revenueImpact: '$2,000/mo - Ad + lead gen'
  },
  {
    id: '45',
    name: 'Blog Post Library',
    category: 'Content',
    description: 'Tailwind HTML snippets, metadata, landing page copy, iframe embeds, website sections.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Organize into publishable posts',
    assetLocation: '/workspace/blog-posts/',
    revenueImpact: '$500 - SEO value'
  },
  {
    id: '46',
    name: 'Cheat Sheets & Dummies Guides',
    category: 'Content',
    description: 'Clinic resources, process documents, quick reference guides.',
    status: 'In Progress',
    priority: 'High',
    owner: 'Nigel',
    dueDate: '2026-07-25',
    nextAction: 'Package into downloadable library',
    assetLocation: '/workspace/tpn-dashboard/',
    revenueImpact: '$2,497/mo - Training value'
  },
  {
    id: '47',
    name: 'SQL & Database Notes',
    category: 'Content',
    description: 'Testimonial insert syntax review, Supabase schema planning, business directory schema ideas.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Create reusable SQL snippet library',
    assetLocation: '/workspace/technical-snippets/',
    revenueImpact: '$300 - Time savings'
  },
  {
    id: '48',
    name: 'Operating Procedures',
    category: 'Content',
    description: 'Clinic session plans, OpenClaw skill workflows, hybrid meeting setup, website rebuild documentation process.',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Nigel',
    dueDate: null,
    nextAction: 'Document SOPs in Notion',
    assetLocation: '/workspace/sops/',
    revenueImpact: '$1,000 - Efficiency gains'
  }
];

export const categories: Category[] = [
  'Build Backlog',
  'Ideas & Wishlist',
  'Marketing Assets',
  'Technical Builds',
  'Client Projects',
  'Content'
];

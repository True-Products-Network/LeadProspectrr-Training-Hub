import { Goal } from '@/types/goal';

export const goals: Goal[] = [
  {
    id: 'goal-revenue',
    name: 'Revenue',
    description: 'Hit annual revenue and monthly recurring revenue targets through scalable productized services and training offerings.',
    target: '$84,000/month MRR by end of 2026',
    metric: 'Monthly Recurring Revenue',
    currentValue: 0, // To be updated monthly
    targetValue: 84000,
    deadline: '2026-12-31',
    status: 'on_track'
  },
  {
    id: 'goal-pipeline',
    name: 'Pipeline',
    description: 'Generate a consistent flow of qualified sales calls every month through targeted marketing and lead generation.',
    target: '10+ qualified sales calls per month',
    metric: 'Qualified Sales Calls Booked',
    currentValue: 0, // To be updated weekly
    targetValue: 10,
    deadline: '2026-12-31',
    status: 'on_track'
  },
  {
    id: 'goal-offers',
    name: 'Offers',
    description: 'Build 3 clear productized service packages that are easy to sell, deliver, and scale.',
    target: '3 defined packages with pricing and delivery systems',
    metric: 'Productized Packages Complete',
    currentValue: 0, // Business System Hub, GHL Build Manager, ?
    targetValue: 3,
    deadline: '2026-09-30',
    status: 'on_track'
  },
  {
    id: 'goal-delivery',
    name: 'Delivery',
    description: 'Create repeatable systems and templates so client work takes less time and delivers consistent quality.',
    target: 'Reduce client project time by 50% through systems',
    metric: 'Hours per Client Project',
    currentValue: 40, // Baseline to be established
    targetValue: 20,
    deadline: '2026-12-31',
    status: 'on_track'
  },
  {
    id: 'goal-authority',
    name: 'Authority',
    description: 'Publish weekly content that positions Nigel as the systems and follow-up expert for coaches, speakers, consultants, and small businesses.',
    target: 'Weekly content: 1 video + 1 blog/newsletter minimum',
    metric: 'Content Pieces Published per Week',
    currentValue: 0, // To be tracked weekly
    targetValue: 2,
    deadline: '2026-12-31',
    status: 'on_track'
  }
];

// Project to Goal mapping
export const projectGoalMapping: Record<string, string[]> = {
  // Revenue Goal Projects
  '4': ['goal-revenue'], // Business System Hub Launch Engine
  '5': ['goal-revenue'], // LeadProspectrr Training Library
  '29': ['goal-revenue'], // STL Business Guide Database
  '21': ['goal-revenue'], // Business System Hub Campaign
  
  // Pipeline Goal Projects
  '6': ['goal-pipeline'], // Speaker Follow-Up Playbook Funnel
  '23': ['goal-pipeline'], // Speaker Follow-Up Playbook
  '42': ['goal-pipeline'], // Other Client Updates
  
  // Offers Goal Projects
  '2': ['goal-offers'], // GHL Build Manager for OpenClaw
  '4': ['goal-offers', 'goal-revenue'], // Business System Hub (also offers)
  '26': ['goal-offers'], // OpenClaw Supabase Expert Skill
  '27': ['goal-offers'], // OpenClaw GHL Build Manager
  
  // Delivery Goal Projects
  '1': ['goal-delivery'], // Advanced Security Level Supabase Skill
  '2': ['goal-delivery', 'goal-offers'], // GHL Build Manager (also delivery)
  '10': ['goal-delivery'], // Client Document Consistency System
  '32': ['goal-delivery'], // GHL Feature Training System
  '48': ['goal-delivery'], // Operating Procedures
  
  // Authority Goal Projects
  '8': ['goal-authority'], // YouTube Content System
  '22': ['goal-authority', 'goal-revenue'], // LeadProspectrr/GHL Clinics
  '43': ['goal-authority', 'goal-revenue'], // STL Business Guide Content Engine
  '44': ['goal-authority'], // YouTube Video Scripts
  '45': ['goal-authority'], // Blog Post Library
  '46': ['goal-authority', 'goal-revenue'], // Cheat Sheets & Dummies Guides
  
  // Multi-goal projects
  '3': ['goal-revenue', 'goal-authority'], // STL Business Guide Rebuild
  '34': ['goal-pipeline', 'goal-revenue'], // NSA St. Louis
  '36': ['goal-revenue', 'goal-delivery'], // Men Mentoring Men Network
};

// Helper function to get projects for a goal
export function getProjectsForGoal(goalId: string): string[] {
  return Object.entries(projectGoalMapping)
    .filter(([_, goals]) => goals.includes(goalId))
    .map(([projectId, _]) => projectId);
}

// Helper function to get goals for a project
export function getGoalsForProject(projectId: string): string[] {
  return projectGoalMapping[projectId] || [];
}

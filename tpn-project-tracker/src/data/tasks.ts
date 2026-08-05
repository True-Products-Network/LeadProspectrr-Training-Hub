import { Task } from '@/types/task';
import { allTasks } from './tasks-all';

// All tasks for all projects
export const initialTasks: Task[] = [
  ...allTasks,
  // Project 1: Advanced Security Level Supabase Skill
  {
    id: 'task-1-1',
    projectId: '1',
    name: 'Create Supabase skill folder structure',
    description: 'Set up the directory structure and base files',
    status: 'done',
    owner: 'Nigel',
    dueDate: '2026-07-10',
    estimatedHours: 2,
    actualHours: 2,
    createdAt: '2026-07-01',
    completedAt: '2026-07-10',
  },
  {
    id: 'task-1-2',
    projectId: '1',
    name: 'Write RLS security rules documentation',
    description: 'Document Row Level Security best practices',
    status: 'in_progress',
    owner: 'Nigel',
    dueDate: '2026-07-12',
    estimatedHours: 4,
    actualHours: 2,
    createdAt: '2026-07-01',
    completedAt: null,
  },
  {
    id: 'task-1-3',
    projectId: '1',
    name: 'Create API key handling examples',
    description: 'Safe API key management patterns',
    status: 'todo',
    owner: 'Nigel',
    dueDate: '2026-07-14',
    estimatedHours: 3,
    actualHours: 0,
    createdAt: '2026-07-01',
    completedAt: null,
  },
  {
    id: 'task-1-4',
    projectId: '1',
    name: 'Test against real Supabase project',
    description: 'Validate all examples work in production',
    status: 'todo',
    owner: 'Nigel',
    dueDate: '2026-07-15',
    estimatedHours: 4,
    actualHours: 0,
    createdAt: '2026-07-01',
    completedAt: null,
  },

  // Project 4: Business System Hub Launch Engine
  {
    id: 'task-4-1',
    projectId: '4',
    name: 'Review launch sequence document',
    description: 'Audit the current launch sequence',
    status: 'done',
    owner: 'Nigel',
    dueDate: '2026-07-15',
    estimatedHours: 2,
    actualHours: 3,
    createdAt: '2026-07-05',
    completedAt: '2026-07-15',
  },
  {
    id: 'task-4-2',
    projectId: '4',
    name: 'Update deadline and pricing',
    description: 'Refresh pricing for 2026 offer',
    status: 'in_progress',
    owner: 'Nigel',
    dueDate: '2026-07-18',
    estimatedHours: 2,
    actualHours: 1,
    createdAt: '2026-07-05',
    completedAt: null,
  },
  {
    id: 'task-4-3',
    projectId: '4',
    name: 'Connect assets to CRM automation',
    description: 'Link all deliverables to automated workflows',
    status: 'todo',
    owner: 'Nigel',
    dueDate: '2026-07-20',
    estimatedHours: 6,
    actualHours: 0,
    createdAt: '2026-07-05',
    completedAt: null,
  },

  // Project 21: Business System Hub Campaign
  {
    id: 'task-21-1',
    projectId: '21',
    name: 'Draft launch emails',
    description: 'Write email sequence for launch',
    status: 'done',
    owner: 'Nigel',
    dueDate: '2026-07-15',
    estimatedHours: 4,
    actualHours: 5,
    createdAt: '2026-07-08',
    completedAt: '2026-07-15',
  },
  {
    id: 'task-21-2',
    projectId: '21',
    name: 'Create comparison flyer',
    description: 'Design one-page comparison sheet',
    status: 'in_progress',
    owner: 'Nigel',
    dueDate: '2026-07-18',
    estimatedHours: 3,
    actualHours: 1,
    createdAt: '2026-07-08',
    completedAt: null,
  },
  {
    id: 'task-21-3',
    projectId: '21',
    name: 'Set up SMS reminders',
    description: 'Configure SMS automation in GHL',
    status: 'todo',
    owner: 'Nigel',
    dueDate: '2026-07-19',
    estimatedHours: 2,
    actualHours: 0,
    createdAt: '2026-07-08',
    completedAt: null,
  },
  {
    id: 'task-21-4',
    projectId: '21',
    name: 'Build sales page',
    description: 'Create landing page for annual offer',
    status: 'todo',
    owner: 'Nigel',
    dueDate: '2026-07-20',
    estimatedHours: 8,
    actualHours: 0,
    createdAt: '2026-07-08',
    completedAt: null,
  },
];

// Helper functions
export function getTasksByProject(tasks: Task[], projectId: string): Task[] {
  return tasks.filter(t => t.projectId === projectId);
}

export function getTaskStats(tasks: Task[]): {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionRate: number;
} {
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, todo, inProgress, done, completionRate };
}

export function calculateProjectProgress(tasks: Task[], projectId: string): number {
  const projectTasks = getTasksByProject(tasks, projectId);
  if (projectTasks.length === 0) return 0;
  
  const completed = projectTasks.filter(t => t.status === 'done').length;
  return Math.round((completed / projectTasks.length) * 100);
}

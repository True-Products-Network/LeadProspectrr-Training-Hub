export type TaskCategory = 
  | 'deep-work'
  | 'meetings'
  | 'admin'
  | 'exercise'
  | 'personal'
  | 'learning'
  | 'creative';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  startTime: string;
  endTime: string;
  completed: boolean;
  notes?: string;
  subtasks?: Subtask[];
  energyLevel?: 'low' | 'medium' | 'high';
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DayFocus {
  date: string;
  mainGoal: string;
  energyPrediction: 'low' | 'medium' | 'high';
  distractionsToAvoid: string[];
}

export interface WeeklyPattern {
  dayOfWeek: number;
  typicalEnergy: 'low' | 'medium' | 'high';
  bestFor: TaskCategory[];
}

export const categoryConfig: Record<TaskCategory, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: string;
}> = {
  'deep-work': {
    label: 'Deep Work',
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.15)',
    icon: 'Brain',
  },
  'meetings': {
    label: 'Meetings',
    color: '#f472b6',
    bgColor: 'rgba(244, 114, 182, 0.15)',
    icon: 'Users',
  },
  'admin': {
    label: 'Admin',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    icon: 'ClipboardList',
  },
  'exercise': {
    label: 'Exercise',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
    icon: 'Dumbbell',
  },
  'personal': {
    label: 'Personal',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.15)',
    icon: 'Heart',
  },
  'learning': {
    label: 'Learning',
    color: '#22d3ee',
    bgColor: 'rgba(34, 211, 238, 0.15)',
    icon: 'BookOpen',
  },
  'creative': {
    label: 'Creative',
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.15)',
    icon: 'Palette',
  },
};

export const priorityConfig: Record<TaskPriority, { 
  label: string; 
  color: string;
}> = {
  low: { label: 'Low', color: '#94a3b8' },
  medium: { label: 'Medium', color: '#fbbf24' },
  high: { label: 'High', color: '#f472b6' },
  critical: { label: 'Critical', color: '#f87171' },
};
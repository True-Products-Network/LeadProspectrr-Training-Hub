import { Task, DayFocus, WeeklyPattern } from './types';

// Generate sample tasks for today
export function getTodayTasks(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      id: '1',
      title: 'Morning Planning & Review',
      category: 'admin',
      priority: 'high',
      startTime: '08:00',
      endTime: '08:30',
      completed: true,
      notes: 'Review goals, check calendar, prioritize tasks',
      energyLevel: 'medium',
    },
    {
      id: '2',
      title: 'Deep Work: Project Alpha',
      category: 'deep-work',
      priority: 'critical',
      startTime: '09:00',
      endTime: '11:00',
      completed: false,
      notes: 'Focus session - no notifications',
      energyLevel: 'high',
      subtasks: [
        { id: '2a', title: 'Review requirements', completed: false },
        { id: '2b', title: 'Draft architecture', completed: false },
        { id: '2c', title: 'Create initial prototype', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Team Standup',
      category: 'meetings',
      priority: 'medium',
      startTime: '11:15',
      endTime: '11:45',
      completed: false,
      energyLevel: 'medium',
    },
    {
      id: '4',
      title: 'Lunch Break',
      category: 'personal',
      priority: 'medium',
      startTime: '12:00',
      endTime: '13:00',
      completed: false,
      notes: 'Step away from screen, eat mindfully',
      energyLevel: 'low',
    },
    {
      id: '5',
      title: 'Email & Communication',
      category: 'admin',
      priority: 'medium',
      startTime: '13:00',
      endTime: '13:30',
      completed: false,
      notes: 'Batch process - no checking outside this window',
      energyLevel: 'low',
    },
    {
      id: '6',
      title: 'Learning: New Framework',
      category: 'learning',
      priority: 'high',
      startTime: '14:00',
      endTime: '15:30',
      completed: false,
      energyLevel: 'medium',
    },
    {
      id: '7',
      title: 'Gym Session',
      category: 'exercise',
      priority: 'high',
      startTime: '17:00',
      endTime: '18:00',
      completed: false,
      notes: 'Cardio + strength training',
      energyLevel: 'high',
    },
    {
      id: '8',
      title: 'Creative Work: Design Review',
      category: 'creative',
      priority: 'medium',
      startTime: '19:30',
      endTime: '20:30',
      completed: false,
      energyLevel: 'medium',
    },
  ];
}

export function getTodayFocus(): DayFocus {
  return {
    date: new Date().toISOString().split('T')[0],
    mainGoal: 'Ship the Project Alpha prototype',
    energyPrediction: 'high',
    distractionsToAvoid: [
      'Social media before noon',
      'Email outside designated times',
      'Unscheduled calls',
    ],
  };
}

export const weeklyPatterns: WeeklyPattern[] = [
  { dayOfWeek: 1, typicalEnergy: 'high', bestFor: ['deep-work', 'creative'] },
  { dayOfWeek: 2, typicalEnergy: 'high', bestFor: ['deep-work', 'meetings'] },
  { dayOfWeek: 3, typicalEnergy: 'medium', bestFor: ['learning', 'admin'] },
  { dayOfWeek: 4, typicalEnergy: 'medium', bestFor: ['meetings', 'creative'] },
  { dayOfWeek: 5, typicalEnergy: 'low', bestFor: ['admin', 'personal'] },
  { dayOfWeek: 6, typicalEnergy: 'medium', bestFor: ['exercise', 'personal'] },
  { dayOfWeek: 0, typicalEnergy: 'low', bestFor: ['personal', 'learning'] },
];

// Local storage helpers
const STORAGE_KEY = 'focus-calendar-data';

export function saveTasks(tasks: Task[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, lastUpdated: new Date().toISOString() }));
  }
}

export function loadTasks(): Task[] | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Only return if from today
      const lastUpdated = new Date(parsed.lastUpdated);
      const today = new Date();
      if (lastUpdated.toDateString() === today.toDateString()) {
        return parsed.tasks;
      }
    }
  }
  return null;
}
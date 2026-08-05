export interface WeeklyReview {
  id: string;
  weekStarting: string; // ISO date: 2026-07-14
  weekEnding: string;
  // Progress Summary
  goalsProgress: {
    goalId: string;
    previousValue: number;
    currentValue: number;
    notes: string;
  }[];
  // Project Activity
  projectsCompleted: string[]; // Project IDs
  projectsStarted: string[]; // Project IDs
  projectsBlocked: string[]; // Project IDs
  // Tasks Summary
  tasksCompleted: number;
  tasksCreated: number;
  totalHoursLogged: number;
  // Weekly Priorities (for next week)
  topPriorities: {
    rank: number;
    description: string;
    goalId: string;
    projectId?: string;
  }[];
  // Reflection
  whatWorked: string;
  whatDidntWork: string;
  lessonsLearned: string;
  focusForNextWeek: string;
  // Blockers & Risks
  blockers: string[];
  risks: string[];
  // Mood/Energy
  energyLevel: 1 | 2 | 3 | 4 | 5; // 1=drained, 5=energized
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // 1=uncertain, 5=confident
  // Status
  status: 'draft' | 'complete';
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyStats {
  weekStarting: string;
  weekEnding: string;
  // Goals
  goalsOnTrack: number;
  goalsAtRisk: number;
  goalsOffTrack: number;
  // Projects
  projectsCompleted: number;
  projectsInProgress: number;
  projectsNotStarted: number;
  // Tasks
  tasksCompleted: number;
  tasksInProgress: number;
  tasksTodo: number;
  completionRate: number;
  // Time
  totalEstimatedHours: number;
  totalActualHours: number;
  // Revenue
  revenueProgress: number; // % toward monthly target
}

export const getWeekDates = (date: Date = new Date()): { start: string; end: string; weekNumber: number } => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
  
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  // Calculate week number
  const startOfYear = new Date(monday.getFullYear(), 0, 1);
  const pastDays = (monday.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
    weekNumber
  };
};

export const formatWeekRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  }
  
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
};

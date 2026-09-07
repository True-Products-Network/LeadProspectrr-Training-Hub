export type GoalStatus = 'on_track' | 'at_risk' | 'off_track' | 'complete';

export interface Goal {
  id: string;
  name: string;
  description: string;
  target: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  status: GoalStatus;
}

export interface GoalProgress {
  goalId: string;
  week: string; // ISO week format: 2026-W28
  currentValue: number;
  notes: string;
  risks: string[];
  wins: string[];
}

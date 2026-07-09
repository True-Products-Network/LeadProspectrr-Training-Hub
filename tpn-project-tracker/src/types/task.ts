export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  owner: string;
  dueDate: string | null;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
  completedAt: string | null;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionRate: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}

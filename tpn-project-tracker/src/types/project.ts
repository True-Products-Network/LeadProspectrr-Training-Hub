export type ProjectStatus = 'Not Started' | 'In Progress' | 'Complete';
export type ProjectPriority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
  createdAt: string;
}

export interface ProjectStats {
  total: number;
  notStarted: number;
  inProgress: number;
  complete: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
}

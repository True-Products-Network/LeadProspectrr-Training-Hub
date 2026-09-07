'use client';

import { useState } from 'react';
import { Project, Status, Priority } from '@/data/projects';
import { Task } from '@/types/task';
import { getGoalsForProject } from '@/data/goals';
import { Goal } from '@/types/goal';
import TaskList from './TaskList';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  PauseCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Folder,
  DollarSign,
  ArrowRight,
  Pencil,
  Trash2,
  ListTodo,
  Target
} from 'lucide-react';

interface ProjectCardViewProps {
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  filterGoalId: string | null;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddTask: (projectId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const statusConfig: Record<Status, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  'Not Started': { icon: Circle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Not Started' },
  'In Progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Progress' },
  'Review': { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Review' },
  'Complete': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Complete' },
  'Parked': { icon: PauseCircle, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Parked' },
};

const priorityConfig: Record<Priority, { color: string; bg: string; border: string }> = {
  'High': { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  'Medium': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  'Low': { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
};

const goalColors: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  'goal-revenue': { 
    bg: 'bg-green-50', 
    border: 'border-green-300', 
    badge: 'bg-green-100 text-green-700',
    text: 'text-green-800'
  },
  'goal-pipeline': { 
    bg: 'bg-blue-50', 
    border: 'border-blue-300', 
    badge: 'bg-blue-100 text-blue-700',
    text: 'text-blue-800'
  },
  'goal-offers': { 
    bg: 'bg-purple-50', 
    border: 'border-purple-300', 
    badge: 'bg-purple-100 text-purple-700',
    text: 'text-purple-800'
  },
  'goal-delivery': { 
    bg: 'bg-amber-50', 
    border: 'border-amber-300', 
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-800'
  },
  'goal-authority': { 
    bg: 'bg-rose-50', 
    border: 'border-rose-300', 
    badge: 'bg-rose-100 text-rose-700',
    text: 'text-rose-800'
  },
};

export default function ProjectCardView({ 
  projects, 
  tasks, 
  goals,
  filterGoalId,
  onEdit, 
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange
}: ProjectCardViewProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  // Filter projects by goal if specified
  const filteredProjects = filterGoalId 
    ? projects.filter(p => {
        const projectGoals = getGoalsForProject(p.id);
        return projectGoals.includes(filterGoalId);
      })
    : projects;

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getProjectTasks = (projectId: string) => tasks.filter(t => t.projectId === projectId);

  const getProjectProgress = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(t => t.status === 'done').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const getPrimaryGoalColor = (projectId: string) => {
    const projectGoals = getGoalsForProject(projectId);
    const primaryGoal = projectGoals[0];
    return goalColors[primaryGoal] || goalColors['goal-revenue'];
  };

  const getGoalBadges = (projectId: string) => {
    const projectGoals = getGoalsForProject(projectId);
    return projectGoals.map(goalId => {
      const goal = goals.find(g => g.id === goalId);
      return goal ? { id: goalId, name: goal.name, color: goalColors[goalId]?.badge || 'bg-gray-100 text-gray-700' } : null;
    }).filter(Boolean);
  };

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredProjects.length} {filterGoalId ? 'projects for this goal' : 'projects'}
        </p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const colors = getPrimaryGoalColor(project.id);
          const status = statusConfig[project.status];
          const priority = priorityConfig[project.priority];
          const progress = getProjectProgress(project.id);
          const projectTasks = getProjectTasks(project.id);
          const goalBadges = getGoalBadges(project.id);
          const isExpanded = expandedProjects.has(project.id);

          return (
            <div 
              key={project.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg`}
            >
              {/* Card Header */}
              <div 
                className="p-5 cursor-pointer"
                onClick={() => toggleProject(project.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Goal Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {goalBadges.map(badge => (
                        <span 
                          key={badge!.id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${badge!.color}`}
                        >
                          <Target className="w-3 h-3" />
                          {badge!.name}
                        </span>
                      ))}
                    </div>

                    {/* Project Name */}
                    <h3 className={`font-bold text-lg ${colors.text} mb-1`}>
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                      
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${priority.bg} ${priority.color} border ${priority.border}`}>
                        {project.priority} Priority
                      </span>

                      {project.dueDate && (
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <User className="w-3 h-3" />
                        {project.owner}
                      </span>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Revenue Impact - PROMINENT */}
                <div className="mt-3 p-2 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">
                      {project.revenueImpact}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className={`font-medium ${colors.text}`}>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {projectTasks.filter(t => t.status === 'done').length} of {projectTasks.length} tasks complete
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-white/50">
                  {/* Next Action */}
                  <div className="px-5 py-3 bg-white/30">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Next Action</span>
                        <p className="text-sm text-gray-700">{project.nextAction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="px-5 pb-5">
                    <TaskList
                      tasks={projectTasks}
                      projectName={project.name}
                      onAddTask={() => onAddTask(project.id)}
                      onEditTask={onEditTask}
                      onDeleteTask={onDeleteTask}
                      onStatusChange={onStatusChange}
                    />
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3 bg-white/30 border-t border-white/50 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No projects found for this goal.</p>
          <p className="text-sm text-gray-400 mt-1">Try selecting a different goal or add new projects.</p>
        </div>
      )}
    </div>
  );
}

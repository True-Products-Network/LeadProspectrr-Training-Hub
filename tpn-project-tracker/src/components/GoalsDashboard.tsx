'use client';

import { Goal, GoalStatus } from '@/types/goal';
import { Project } from '@/data/projects';
import { getGoalsForProject } from '@/data/goals';
import { 
  Target, 
  TrendingUp, 
  Package, 
  Zap, 
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface GoalsDashboardProps {
  goals: Goal[];
  projects: Project[];
  selectedGoalId: string | null;
  onSelectGoal: (goalId: string | null) => void;
}

const goalIcons: Record<string, React.ElementType> = {
  'goal-revenue': TrendingUp,
  'goal-revenue-100day': TrendingUp,
  'goal-pipeline': Target,
  'goal-offers': Package,
  'goal-delivery': Zap,
  'goal-authority': Award,
};

const goalColors: Record<string, { bg: string; border: string; text: string; progress: string }> = {
  'goal-revenue': { 
    bg: 'bg-green-50', 
    border: 'border-green-200', 
    text: 'text-green-800',
    progress: 'bg-green-500'
  },
  'goal-revenue-100day': { 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-300', 
    text: 'text-emerald-800',
    progress: 'bg-emerald-500'
  },
  'goal-pipeline': { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-800',
    progress: 'bg-blue-500'
  },
  'goal-offers': { 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    progress: 'bg-purple-500'
  },
  'goal-delivery': { 
    bg: 'bg-amber-50', 
    border: 'border-amber-200', 
    text: 'text-amber-800',
    progress: 'bg-amber-500'
  },
  'goal-authority': { 
    bg: 'bg-rose-50', 
    border: 'border-rose-200', 
    text: 'text-rose-800',
    progress: 'bg-rose-500'
  },
};

const statusConfig: Record<GoalStatus, { icon: React.ElementType; label: string; color: string }> = {
  'on_track': { icon: CheckCircle2, label: 'On Track', color: 'text-green-600' },
  'at_risk': { icon: AlertCircle, label: 'At Risk', color: 'text-amber-600' },
  'off_track': { icon: XCircle, label: 'Off Track', color: 'text-red-600' },
  'complete': { icon: CheckCircle2, label: 'Complete', color: 'text-blue-600' },
};

export default function GoalsDashboard({ goals, projects, selectedGoalId, onSelectGoal }: GoalsDashboardProps) {
  // Calculate goal progress based on linked projects
  const getGoalProgress = (goalId: string): { percent: number; projectCount: number; completedProjects: number } => {
    const linkedProjects = projects.filter(p => {
      const projectGoals = getGoalsForProject(p.id);
      return projectGoals.includes(goalId);
    });

    if (linkedProjects.length === 0) {
      return { percent: 0, projectCount: 0, completedProjects: 0 };
    }

    const completedProjects = linkedProjects.filter(p => p.status === 'Complete').length;
    const percent = Math.round((completedProjects / linkedProjects.length) * 100);

    return { percent, projectCount: linkedProjects.length, completedProjects };
  };

  // Calculate overall stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Complete').length;
  const overallProgress = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">2026 Strategic Goals</h2>
          <p className="text-gray-600 mt-1">
            {selectedGoalId 
              ? 'Click goal again to show all projects' 
              : 'Click a goal to filter projects'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {selectedGoalId && (
            <button
              onClick={() => onSelectGoal(null)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Show All Projects
            </button>
          )}
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-3xl font-bold text-gray-900">{overallProgress}%</p>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const isSelected = selectedGoalId === goal.id;
          const Icon = goalIcons[goal.id] || Target;
          const colors = goalColors[goal.id];
          const progress = getGoalProgress(goal.id);
          const status = statusConfig[goal.status];
          const StatusIcon = status.icon;

          return (
            <div 
              key={goal.id}
              onClick={() => onSelectGoal(isSelected ? null : goal.id)}
              className={`${colors.bg} ${colors.border} border-2 rounded-xl p-5 transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer ${isSelected ? 'ring-4 ring-offset-2 ring-blue-400' : ''}`}
            >
              {/* Goal Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/60 ${colors.text}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </div>
              </div>

              {/* Goal Name */}
              <h3 className={`font-bold text-lg mb-1 ${colors.text}`}>
                {goal.name}
              </h3>

              {/* Target */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {goal.target}
              </p>

              {/* Metric */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Metric</p>
                <p className="text-sm font-medium text-gray-800">{goal.metric}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className={`font-bold ${colors.text}`}>{progress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colors.progress} rounded-full transition-all duration-500`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>

              {/* Project Count */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{progress.projectCount} projects</span>
                <span>{progress.completedProjects} complete</span>
              </div>

              {/* Deadline */}
              <div className="mt-3 pt-3 border-t border-white/30 flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Active Goals</p>
              <p className="text-xl font-bold text-gray-900">
                {goals.filter(g => g.status !== 'complete').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-xl font-bold text-gray-900">{totalProjects}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-green-600">{completedProjects}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Target:</span>
            <span className="text-lg font-bold text-green-600">$84,000/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

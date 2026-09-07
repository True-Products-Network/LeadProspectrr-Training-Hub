'use client';

import { useMemo } from 'react';
import { Project, Status } from '@/data/projects';
import { Task } from '@/types/task';
import { Goal, GoalStatus } from '@/types/goal';
import { getGoalsForProject } from '@/data/goals';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Flag,
  Timer,
  DollarSign
} from 'lucide-react';

interface ReportsDashboardProps {
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
}

interface RiskItem {
  type: 'overdue' | 'stalled' | 'blocked' | 'at_risk' | 'off_track';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  projectId?: string;
  goalId?: string;
  taskId?: string;
  daysOverdue?: number;
}

export default function ReportsDashboard({ projects, tasks, goals }: ReportsDashboardProps) {
  const now = new Date();

  // Calculate risks and alerts
  const risks = useMemo(() => {
    const items: RiskItem[] = [];

    // 1. Overdue Projects (past due date, not complete)
    projects.forEach(project => {
      if (project.dueDate && project.status !== 'Complete' && project.status !== 'Parked') {
        const due = new Date(project.dueDate);
        if (due < now) {
          const daysOverdue = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
          items.push({
            type: 'overdue',
            severity: daysOverdue > 7 ? 'high' : 'medium',
            title: `Overdue: ${project.name}`,
            description: `Due ${daysOverdue} days ago`,
            projectId: project.id,
            daysOverdue
          });
        }
      }
    });

    // 2. Stalled Projects (In Progress but no recent task activity)
    projects.forEach(project => {
      if (project.status === 'In Progress') {
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const recentlyCompleted = projectTasks.filter(t => {
          if (!t.completedAt) return false;
          const completed = new Date(t.completedAt);
          const daysSince = (now.getTime() - completed.getTime()) / (1000 * 60 * 60 * 24);
          return daysSince <= 14;
        });
        
        if (recentlyCompleted.length === 0 && projectTasks.some(t => t.status !== 'done')) {
          items.push({
            type: 'stalled',
            severity: 'medium',
            title: `Stalled: ${project.name}`,
            description: 'No task completion in 14+ days',
            projectId: project.id
          });
        }
      }
    });

    // 3. Overdue Tasks
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'done') {
        const due = new Date(task.dueDate);
        if (due < now) {
          const daysOverdue = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
          items.push({
            type: 'overdue',
            severity: daysOverdue > 3 ? 'high' : 'medium',
            title: `Overdue Task: ${task.name}`,
            description: `${daysOverdue} days overdue`,
            taskId: task.id,
            daysOverdue
          });
        }
      }
    });

    // 4. Goals at risk
    goals.forEach(goal => {
      if (goal.status === 'at_risk') {
        items.push({
          type: 'at_risk',
          severity: 'high',
          title: `At Risk: ${goal.name}`,
          description: goal.target,
          goalId: goal.id
        });
      } else if (goal.status === 'off_track') {
        items.push({
          type: 'off_track',
          severity: 'high',
          title: `Off Track: ${goal.name}`,
          description: goal.target,
          goalId: goal.id
        });
      }
    });

    // Sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }, [projects, tasks, goals, now]);

  // Calculate statistics
  const stats = useMemo(() => {
    // Project stats
    const projectStats = {
      total: projects.length,
      complete: projects.filter(p => p.status === 'Complete').length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      notStarted: projects.filter(p => p.status === 'Not Started').length,
      overdue: projects.filter(p => {
        if (!p.dueDate || p.status === 'Complete') return false;
        return new Date(p.dueDate) < now;
      }).length,
    };

    // Task stats
    const taskStats = {
      total: tasks.length,
      done: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      overdue: tasks.filter(t => {
        if (!t.dueDate || t.status === 'done') return false;
        return new Date(t.dueDate) < now;
      }).length,
    };

    // Time tracking
    const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const totalActual = tasks.reduce((sum, t) => sum + t.actualHours, 0);
    const timeVariance = totalEstimated > 0 
      ? ((totalActual - totalEstimated) / totalEstimated) * 100 
      : 0;

    // Goal progress
    const goalProgress = goals.map(goal => {
      const linkedProjects = projects.filter(p => {
        const pGoals = getGoalsForProject(p.id);
        return pGoals.includes(goal.id);
      });
      const linkedTasks = tasks.filter(t => 
        linkedProjects.some(p => p.id === t.projectId)
      );
      const completed = linkedTasks.filter(t => t.status === 'done').length;
      const percent = linkedTasks.length > 0 
        ? Math.round((completed / linkedTasks.length) * 100)
        : 0;
      
      return {
        goal,
        percent,
        isOnTrack: percent >= 50 || goal.status === 'on_track'
      };
    });

    // Velocity (tasks completed per week - simulated)
    const completedTasks = tasks.filter(t => t.status === 'done');
    const velocity = completedTasks.length > 0 ? completedTasks.length / 4 : 0; // Assume 4 weeks

    return {
      projectStats,
      taskStats,
      totalEstimated,
      totalActual,
      timeVariance,
      goalProgress,
      velocity
    };
  }, [projects, tasks, goals, now]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const categories: Record<string, { count: number; complete: number; revenue: string[] }> = {};
    
    projects.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = { count: 0, complete: 0, revenue: [] };
      }
      categories[p.category].count++;
      if (p.status === 'Complete') {
        categories[p.category].complete++;
      }
      if (p.revenueImpact) {
        categories[p.category].revenue.push(p.revenueImpact);
      }
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      ...data,
      completionRate: Math.round((data.complete / data.count) * 100)
    }));
  }, [projects]);

  const severityIcons = {
    high: <AlertTriangle className="w-5 h-5 text-red-500" />,
    medium: <AlertCircle className="w-5 h-5 text-amber-500" />,
    low: <Clock className="w-5 h-5 text-blue-500" />
  };

  const severityBg = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-amber-50 border-amber-200',
    low: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Risk Alerts</h2>
          <p className="text-gray-600 mt-1">
            Track progress, identify risks, and stay on target
          </p>
        </div>
        <div className="flex items-center gap-2">
          {risks.filter(r => r.severity === 'high').length > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {risks.filter(r => r.severity === 'high').length} Critical
            </span>
          )}
        </div>
      </div>

      {/* Risk Alerts Section */}
      {risks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Risk Alerts ({risks.length})
          </h3>
          <div className="space-y-3">
            {risks.slice(0, 10).map((risk, idx) => (
              <div 
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-lg border ${severityBg[risk.severity]}`}
              >
                {severityIcons[risk.severity]}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{risk.title}</h4>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                </div>
                {risk.daysOverdue && (
                  <span className="px-2 py-1 bg-white rounded text-sm font-medium text-gray-700">
                    {risk.daysOverdue}d
                  </span>
                )}
              </div>
            ))}
            {risks.length > 10 && (
              <p className="text-center text-sm text-gray-500">
                +{risks.length - 10} more alerts
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Project Completion</span>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round((stats.projectStats.complete / stats.projectStats.total) * 100)}%
          </div>
          <div className="text-sm text-gray-500">
            {stats.projectStats.complete} of {stats.projectStats.total}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Task Completion</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round((stats.taskStats.done / stats.taskStats.total) * 100)}%
          </div>
          <div className="text-sm text-gray-500">
            {stats.taskStats.done} of {stats.taskStats.total}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Overdue Items</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.projectStats.overdue + stats.taskStats.overdue}
          </div>
          <div className="text-sm text-gray-500">
            {stats.projectStats.overdue} projects, {stats.taskStats.overdue} tasks
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Weekly Velocity</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.velocity.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">
            tasks/week
          </div>
        </div>
      </div>

      {/* Time Tracking */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5 text-purple-500" />
          Time Tracking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Estimated Hours</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEstimated.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Actual Hours</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalActual.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Variance</p>
            <p className={`text-2xl font-bold ${stats.timeVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.timeVariance > 0 ? '+' : ''}{stats.timeVariance.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ 
                width: `${Math.min((stats.totalActual / stats.totalEstimated) * 100, 100)}%`,
                backgroundColor: stats.timeVariance > 20 ? '#ef4444' : stats.timeVariance > 0 ? '#f59e0b' : '#8b5cf6'
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.timeVariance > 20 
              ? 'Significantly over estimate - review task sizing'
              : stats.timeVariance > 0 
                ? 'Slightly over estimate'
                : 'On track or under estimate'}
          </p>
        </div>
      </div>

      {/* Goal Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Flag className="w-5 h-5 text-blue-500" />
          Goal Health Check
        </h3>
        <div className="space-y-4">
          {stats.goalProgress.map(({ goal, percent, isOnTrack }) => (
            <div key={goal.id} className="flex items-center gap-4">
              <div className="w-32 flex-shrink-0">
                <span className="font-medium text-gray-900">{goal.name}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{percent}% complete</span>
                  <span className={`font-medium ${isOnTrack ? 'text-green-600' : 'text-amber-600'}`}>
                    {isOnTrack ? 'On Track' : 'Needs Attention'}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isOnTrack ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                {isOnTrack ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-500" />
          Projects by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map(cat => (
            <div key={cat.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <span className="text-sm text-gray-500">{cat.count} projects</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${cat.completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{cat.completionRate}% complete</span>
                <span className="text-gray-500">{cat.complete} done</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-800">What's Working</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              {stats.projectStats.complete > 0 && (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {stats.projectStats.complete} projects completed
                </li>
              )}
              {stats.velocity > 2 && (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Strong velocity: {stats.velocity.toFixed(1)} tasks/week
                </li>
              )}
              {stats.goalProgress.filter(g => g.isOnTrack).length >= 3 && (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {stats.goalProgress.filter(g => g.isOnTrack).length} of 5 goals on track
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-red-800">Needs Attention</h4>
            <ul className="space-y-2 text-sm text-red-700">
              {stats.projectStats.overdue > 0 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {stats.projectStats.overdue} overdue projects
                </li>
              )}
              {stats.taskStats.overdue > 0 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {stats.taskStats.overdue} overdue tasks
                </li>
              )}
              {stats.timeVariance > 20 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Time estimates running {stats.timeVariance.toFixed(0)}% over
                </li>
              )}
              {stats.goalProgress.filter(g => !g.isOnTrack).length > 0 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {stats.goalProgress.filter(g => !g.isOnTrack).length} goals need focus
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

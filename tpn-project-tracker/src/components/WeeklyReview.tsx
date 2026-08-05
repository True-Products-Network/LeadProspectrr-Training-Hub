'use client';

import { useState, useMemo } from 'react';
import { Project } from '@/data/projects';
import { Task } from '@/types/task';
import { Goal } from '@/types/goal';
import { WeeklyReview as WeeklyReviewType, getWeekDates, formatWeekRange } from '@/types/weekly';
import { getGoalsForProject } from '@/data/goals';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Target,
  Lightbulb,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Save,
  FileText,
  BarChart3
} from 'lucide-react';

interface WeeklyReviewProps {
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
}

export default function WeeklyReview({ projects, tasks, goals }: WeeklyReviewProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<'review' | 'plan'>('review');
  
  // Get current week dates
  const weekDates = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + (currentWeekOffset * 7));
    return getWeekDates(now);
  }, [currentWeekOffset]);

  // Calculate weekly stats
  const stats = useMemo(() => {
    const weekStart = new Date(weekDates.start);
    const weekEnd = new Date(weekDates.end);
    weekEnd.setHours(23, 59, 59);

    // Tasks completed this week
    const tasksThisWeek = tasks.filter(t => {
      if (t.status !== 'done' || !t.completedAt) return false;
      const completed = new Date(t.completedAt);
      return completed >= weekStart && completed <= weekEnd;
    });

    // Projects with activity this week
    const activeProjects = new Set(tasksThisWeek.map(t => t.projectId));

    // Projects completed this week
    const completedProjects = projects.filter(p => {
      // Check if all tasks are done and project status is Complete
      const projectTasks = tasks.filter(t => t.projectId === p.id);
      const allDone = projectTasks.length > 0 && projectTasks.every(t => t.status === 'done');
      return allDone && p.status === 'Complete';
    });

    // Hours logged
    const hoursLogged = tasksThisWeek.reduce((sum, t) => sum + t.actualHours, 0);

    return {
      tasksCompleted: tasksThisWeek.length,
      tasksInProgress: tasks.filter(t => t.status === 'in_progress').length,
      tasksTodo: tasks.filter(t => t.status === 'todo').length,
      activeProjects: activeProjects.size,
      completedProjects: completedProjects.length,
      hoursLogged,
      completionRate: tasks.length > 0 
        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
        : 0
    };
  }, [tasks, projects, weekDates]);

  // Goal progress summary
  const goalProgress = useMemo(() => {
    return goals.map(goal => {
      const linkedProjects = projects.filter(p => {
        const projectGoals = getGoalsForProject(p.id);
        return projectGoals.includes(goal.id);
      });

      const linkedTasks = tasks.filter(t => 
        linkedProjects.some(p => p.id === t.projectId)
      );

      const completedTasks = linkedTasks.filter(t => t.status === 'done').length;
      const progress = linkedTasks.length > 0 
        ? Math.round((completedTasks / linkedTasks.length) * 100)
        : 0;

      return {
        goal,
        progress,
        totalTasks: linkedTasks.length,
        completedTasks
      };
    });
  }, [goals, projects, tasks]);

  return (
    <div className="space-y-6">
      {/* Header with Week Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Weekly Review & Planning</h2>
            <p className="text-gray-600 mt-1">
              Reflect on progress and plan the week ahead
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Week Navigator */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                className="p-2 hover:bg-white rounded-md transition-colors"
                title="Previous week"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="px-4 py-2 text-center min-w-[200px]">
                <div className="font-semibold text-gray-900">
                  Week {weekDates.weekNumber}
                </div>
                <div className="text-sm text-gray-500">
                  {formatWeekRange(weekDates.start, weekDates.end)}
                </div>
              </div>
              <button
                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                className="p-2 hover:bg-white rounded-md transition-colors"
                title="Next week"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Today Button */}
            {currentWeekOffset !== 0 && (
              <button
                onClick={() => setCurrentWeekOffset(0)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'review'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Weekly Review
            </div>
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'plan'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Weekly Plan
            </div>
          </button>
        </div>
      </div>

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Tasks Completed</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.tasksCompleted}</div>
              <div className="text-sm text-gray-500 mt-1">this week</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Hours Logged</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.hoursLogged}</div>
              <div className="text-sm text-gray-500 mt-1">actual hours</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Active Projects</span>
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
              <div className="text-sm text-gray-500 mt-1">with activity</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Completion Rate</span>
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.completionRate}%</div>
              <div className="text-sm text-gray-500 mt-1">overall progress</div>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Goal Progress This Week
            </h3>
            <div className="space-y-4">
              {goalProgress.map(({ goal, progress, totalTasks, completedTasks }) => (
                <div key={goal.id} className="flex items-center gap-4">
                  <div className="w-32 flex-shrink-0">
                    <span className="font-medium text-gray-900">{goal.name}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{completedTasks} of {totalTasks} tasks</span>
                      <span className="font-medium text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          progress >= 75 ? 'bg-green-500' :
                          progress >= 50 ? 'bg-blue-500' :
                          progress >= 25 ? 'bg-amber-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reflection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                What Worked
              </h3>
              <textarea
                className="w-full h-32 p-3 bg-white border border-green-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="What went well this week? What should you keep doing?"
              />
            </div>

            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                What Didn't Work
              </h3>
              <textarea
                className="w-full h-32 p-3 bg-white border border-red-200 rounded-lg resize-none focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="What obstacles did you face? What should you change?"
              />
            </div>
          </div>

          {/* Lessons & Focus */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Lessons Learned & Focus for Next Week
            </h3>
            <textarea
              className="w-full h-24 p-3 bg-white border border-blue-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Key insights and what to focus on next week..."
            />
          </div>
        </div>
      )}

      {/* Plan Tab */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* Weekly Goal */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Weekly Goal
            </h3>
            <p className="text-gray-600 mb-3">One clear result for this week:</p>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Complete the Business System Hub launch sequence"
            />
          </div>

          {/* Top 3 Priorities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Top 3 Priorities
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {rank}
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={`Priority ${rank}: What must get done?`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Supporting Tasks
            </h3>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Other tasks that support the priorities..."
            />
          </div>

          {/* Risks */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risks & Blockers
            </h3>
            <textarea
              className="w-full h-24 p-3 bg-white border border-amber-200 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="What could slow you down this week?"
            />
          </div>

          {/* End-of-Week Check */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              End-of-Week Check
            </h3>
            <p className="text-gray-600 text-sm">
              At the end of the week, review: Did the priorities get done? What blocked progress? 
              What should carry over to next week?
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Save className="w-5 h-5" />
          Save Weekly Review
        </button>
      </div>
    </div>
  );
}

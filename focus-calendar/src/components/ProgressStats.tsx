'use client';

import { Task } from '@/lib/types';
import { categoryConfig } from '@/lib/types';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Target,
  Calendar
} from 'lucide-react';

interface ProgressStatsProps {
  tasks: Task[];
}

export function ProgressStats({ tasks }: ProgressStatsProps) {
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  
  // Calculate time completed
  const totalScheduledMinutes = tasks.reduce((acc, task) => {
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const [endHour, endMin] = task.endTime.split(':').map(Number);
    return acc + ((endHour * 60 + endMin) - (startHour * 60 + startMin));
  }, 0);
  
  const completedMinutes = completedTasks.reduce((acc, task) => {
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const [endHour, endMin] = task.endTime.split(':').map(Number);
    return acc + ((endHour * 60 + endMin) - (startHour * 60 + startMin));
  }, 0);
  
  const timeProgress = totalScheduledMinutes > 0 ? (completedMinutes / totalScheduledMinutes) * 100 : 0;
  
  // Group by category
  const categoryStats = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { total: 0, completed: 0 };
    }
    acc[task.category].total++;
    if (task.completed) {
      acc[task.category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-sm text-slate-400">Task Completion</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white">{Math.round(completionRate)}%</span>
          <span className="text-sm text-slate-500 mb-1">{completedTasks.length}/{tasks.length}</span>
        </div>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Time Progress */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-sm text-slate-400">Time Completed</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white">{Math.round(timeProgress)}%</span>
          <span className="text-sm text-slate-500 mb-1">{Math.round(completedMinutes / 60)}h done</span>
        </div>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${timeProgress}%` }}
          />
        </div>
      </div>

      {/* Deep Work Hours */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-sm text-slate-400">Deep Work</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white">
            {(() => {
              const deepWorkTasks = tasks.filter(t => t.category === 'deep-work' && t.completed);
              return deepWorkTasks.reduce((acc, task) => {
                const [startHour, startMin] = task.startTime.split(':').map(Number);
                const [endHour, endMin] = task.endTime.split(':').map(Number);
                return acc + ((endHour * 60 + endMin) - (startHour * 60 + startMin));
              }, 0) / 60;
            })()}h
          </span>
          <span className="text-sm text-slate-500 mb-1">completed</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: categoryConfig['deep-work'].color }}
          />
          <span className="text-xs text-slate-500">Focused work sessions</span>
        </div>
      </div>

      {/* Streak */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-sm text-slate-400">Daily Streak</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white">3</span>
          <span className="text-sm text-slate-500 mb-1">days</span>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3].map((day) => (
            <div key={day} className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ))}
          {[4, 5, 6, 7].map((day) => (
            <div key={day} className="w-6 h-6 rounded bg-slate-700/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
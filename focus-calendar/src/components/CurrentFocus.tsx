'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Clock,
  Zap,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryConfig } from '@/lib/types';

interface CurrentFocusProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  currentTime: Date;
}

export function CurrentFocus({ tasks, onToggleComplete, currentTime }: CurrentFocusProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeValue = currentHour * 60 + currentMinute;

    const current = tasks.find(task => {
      const [startHour, startMin] = task.startTime.split(':').map(Number);
      const [endHour, endMin] = task.endTime.split(':').map(Number);
      const startValue = startHour * 60 + startMin;
      const endValue = endHour * 60 + endMin;
      return currentTimeValue >= startValue && currentTimeValue < endValue && !task.completed;
    });

    setActiveTask(current || null);

    if (current) {
      const [endHour, endMin] = current.endTime.split(':').map(Number);
      const [startHour, startMin] = current.startTime.split(':').map(Number);
      const endValue = endHour * 60 + endMin;
      const startValue = startHour * 60 + startMin;
      const totalDuration = endValue - startValue;
      const elapsed = currentTimeValue - startValue;
      const remaining = endValue - currentTimeValue;
      
      setProgress((elapsed / totalDuration) * 100);
      
      const remainingHours = Math.floor(remaining / 60);
      const remainingMins = remaining % 60;
      setTimeRemaining(
        remainingHours > 0 
          ? `${remainingHours}h ${remainingMins}m remaining`
          : `${remainingMins}m remaining`
      );
    }
  }, [tasks, currentTime]);

  const nextTask = tasks.find(t => {
    const [startHour, startMin] = t.startTime.split(':').map(Number);
    const startValue = startHour * 60 + startMin;
    const currentValue = currentTime.getHours() * 60 + currentTime.getMinutes();
    return startValue > currentValue && !t.completed;
  });

  if (!activeTask) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-200">No Active Task</h2>
            <p className="text-sm text-slate-400">You're between scheduled activities</p>
          </div>
        </div>
        
        {nextTask && (
          <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Up Next</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">{nextTask.title}</p>
                <p className="text-sm text-slate-400">{nextTask.startTime} - {nextTask.category}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        )}
      </div>
    );
  }

  const category = categoryConfig[activeTask.category];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 p-6 animate-pulse-glow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: category.bgColor }}
          >
            <Zap className="w-6 h-6" style={{ color: category.color }} />
          </div>
          <div>
            <p className="text-xs text-indigo-400 uppercase tracking-wider font-medium">Current Focus</p>
            <h2 className="text-xl font-bold text-white">{activeTask.title}</h2>
          </div>
        </div>
        <button
          onClick={() => onToggleComplete(activeTask.id)}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            activeTask.completed 
              ? "bg-emerald-500/20 text-emerald-400" 
              : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
          )}
        >
          {activeTask.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
      </div>

      {activeTask.notes && (
        <p className="text-slate-300 mb-4 text-sm">{activeTask.notes}</p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{timeRemaining}</span>
          <span className="text-slate-400">{Math.round(progress)}% complete</span>
        </div>
        
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 animate-progress-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {activeTask.subtasks && activeTask.subtasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Subtasks</p>
          <div className="space-y-2">
            {activeTask.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center gap-3">
                <button
                  onClick={() => {/* Toggle subtask */}}
                  className={cn(
                    "w-5 h-5 rounded border transition-all",
                    subtask.completed 
                      ? "bg-emerald-500/20 border-emerald-500/50" 
                      : "border-slate-600 hover:border-slate-500"
                  )}
                >
                  {subtask.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <span className={cn(
                  "text-sm",
                  subtask.completed ? "text-slate-500 line-through" : "text-slate-300"
                )}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
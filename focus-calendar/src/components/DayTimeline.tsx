'use client';

import { Task } from '@/lib/types';
import { categoryConfig, priorityConfig } from '@/lib/types';
import { 
  CheckCircle2, 
  Circle, 
  Clock,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayTimelineProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  currentTime: Date;
}

export function DayTimeline({ tasks, onToggleComplete, currentTime }: DayTimelineProps) {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeValue = currentHour * 60 + currentMinute;

  // Sort tasks by start time
  const sortedTasks = [...tasks].sort((a, b) => {
    const [aHour, aMin] = a.startTime.split(':').map(Number);
    const [bHour, bMin] = b.startTime.split(':').map(Number);
    return (aHour * 60 + aMin) - (bHour * 60 + bMin);
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Today's Schedule</h3>
      
      <div className="space-y-2">
        {sortedTasks.map((task, index) => {
          const [startHour, startMin] = task.startTime.split(':').map(Number);
          const [endHour, endMin] = task.endTime.split(':').map(Number);
          const startValue = startHour * 60 + startMin;
          const endValue = endHour * 60 + endMin;
          
          const isActive = currentTimeValue >= startValue && currentTimeValue < endValue;
          const isPast = currentTimeValue >= endValue;
          const duration = endValue - startValue;
          const heightClass = duration <= 30 ? 'py-2' : duration <= 60 ? 'py-3' : 'py-4';
          
          const category = categoryConfig[task.category];
          const priority = priorityConfig[task.priority];

          return (
            <div
              key={task.id}
              className={cn(
                "group relative rounded-xl border transition-all duration-300",
                heightClass,
                isActive 
                  ? "bg-slate-800/80 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                  : isPast && task.completed
                    ? "bg-slate-900/30 border-slate-800/50 opacity-60"
                    : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50",
                "animate-slide-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Time indicator line for active task */}
              {isActive && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-xl"
                />
              )}

              <div className="flex items-center gap-4 px-4">
                {/* Time */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-indigo-400" : "text-slate-400"
                  )}>
                    {task.startTime}
                  </span>
                  <span className="text-xs text-slate-600">{task.endTime}</span>
                </div>

                {/* Category indicator */}
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium truncate",
                      isPast && task.completed ? "text-slate-500 line-through" : "text-slate-200",
                      isActive && "text-white"
                    )}>
                      {task.title}
                    </span>
                    {task.priority === 'critical' && !task.completed && (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: category.color }}>{category.label}</span>
                    <span className="text-slate-600">•</span>
                    <span style={{ color: priority.color }}>{priority.label}</span>
                    {task.energyLevel && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">
                          {task.energyLevel === 'high' ? '⚡ High energy' : 
                           task.energyLevel === 'medium' ? '🔋 Medium energy' : '🪫 Low energy'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Completion toggle */}
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                    task.completed 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-slate-700/50 text-slate-500 hover:bg-slate-600/50 hover:text-slate-300"
                  )}
                >
                  {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
              </div>

              {/* Progress bar for active task */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${((currentTimeValue - startValue) / (endValue - startValue)) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
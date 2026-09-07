'use client';

import { useState, useEffect } from 'react';
import { Task, DayFocus } from '@/lib/types';
import { getTodayTasks, getTodayFocus, saveTasks, loadTasks } from '@/lib/data';
import { CurrentFocus } from '@/components/CurrentFocus';
import { DayTimeline } from '@/components/DayTimeline';
import { DailyIntentions } from '@/components/DailyIntentions';
import { ProgressStats } from '@/components/ProgressStats';
import { FocusMode } from '@/components/FocusMode';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Focus,
  Menu,
  Settings,
  Plus
} from 'lucide-react';
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect';
import { format } from 'date-fns';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focus, setFocus] = useState<DayFocus>(getTodayFocus());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useGoogleCalendar, setUseGoogleCalendar] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const saved = loadTasks();
    if (saved) {
      setTasks(saved);
    } else {
      setTasks(getTodayTasks());
    }
    
    // Check if user previously connected Google Calendar
    const gcalConnected = localStorage.getItem('focus-calendar-gcal');
    if (gcalConnected === 'true') {
      setUseGoogleCalendar(true);
    }
  }, []);

  // Save tasks when they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleUpdateFocus = (newFocus: DayFocus) => {
    setFocus(newFocus);
  };

  const openFocusMode = (task: Task) => {
    setActiveFocusTask(task);
    setFocusModeOpen(true);
  };

  const handleGoogleEventsLoaded = (gcalTasks: Task[]) => {
    if (gcalTasks.length > 0) {
      // Merge with local tasks, preferring Google Calendar for time slots
      const mergedTasks = [...gcalTasks];
      setTasks(mergedTasks);
      setUseGoogleCalendar(true);
      localStorage.setItem('focus-calendar-gcal', 'true');
      setError(null);
    }
  };

  const handleGoogleError = (err: string) => {
    setError(err);
    // Fall back to default tasks
    setTasks(getTodayTasks());
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Focus Calendar</h1>
                <p className="text-xs text-slate-400">{format(currentTime, 'EEEE, MMMM d')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress indicator */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400">{Math.round(completionRate)}%</span>
              </div>

              <button
                onClick={() => openFocusMode(tasks[0])}
                className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
              >
                <Focus className="w-5 h-5" />
              </button>

              <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                <Plus className="w-5 h-5" />
              </button>

              <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="mb-8">
          <ProgressStats tasks={tasks} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Focus & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentFocus 
              tasks={tasks} 
              onToggleComplete={handleToggleComplete}
              currentTime={currentTime}
            />
            
            <DayTimeline 
              tasks={tasks} 
              onToggleComplete={handleToggleComplete}
              currentTime={currentTime}
            />
          </div>

          {/* Right Column - Intentions & Tools */}
          <div className="space-y-6">
            <DailyIntentions 
              focus={focus} 
              onUpdateFocus={handleUpdateFocus}
            />

            {/* Quick Actions */}
            <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => openFocusMode(tasks.find(t => !t.completed) || tasks[0])}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
                >
                  <Focus className="w-5 h-5" />
                  <span className="font-medium">Start Focus Mode</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 transition-all">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Add Time Block</span>
                </button>
              </div>
            </div>

            {/* Google Calendar Integration */}
            <GoogleCalendarConnect 
              onEventsLoaded={handleGoogleEventsLoaded}
              onError={handleGoogleError}
            />

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}

            {/* Tips */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 p-6">
              <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-3">Daily Tip</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                "The key to productivity is not doing more, but doing what matters. 
                Focus on your most important task first thing in the morning when your energy is highest."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Mode Overlay */}
      <FocusMode 
        isOpen={focusModeOpen}
        onClose={() => setFocusModeOpen(false)}
        task={activeFocusTask}
      />
    </main>
  );
}
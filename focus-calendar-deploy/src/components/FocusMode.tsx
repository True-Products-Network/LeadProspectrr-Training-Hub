'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  Headphones,
  BellOff,
  Focus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function FocusMode({ isOpen, onClose, task }: FocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'timer'>('pomodoro');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (task && isOpen) {
      const [startHour, startMin] = task.startTime.split(':').map(Number);
      const [endHour, endMin] = task.endTime.split(':').map(Number);
      const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      setTimeLeft(duration * 60);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'pomodoro' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
              <Focus className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Focus Mode</h2>
              <p className="text-slate-400">{task.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="text-center">
            <div className="text-8xl font-bold text-white font-mono tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <p className="text-slate-400 mt-2">
              {isActive ? 'Focusing...' : 'Ready to focus?'}
            </p>
          </div>
          
          {/* Progress ring */}
          {mode === 'pomodoro' && (
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <svg className="w-80 h-80 transform -rotate-90">
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-slate-800"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 150}`}
                  strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress / 100)}`}
                  className="text-indigo-500 transition-all duration-1000"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setTimeLeft(25 * 60)}
            className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all",
              isActive 
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" 
                : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
            )}
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          
          <button
            onClick={() => setMode(mode === 'pomodoro' ? 'timer' : 'pomodoro')}
            className="px-4 py-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium"
          >
            {mode === 'pomodoro' ? '25m' : 'Timer'}
          </button>
        </div>

        {/* Focus Tips */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <BellOff className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-slate-200">Remove Distractions</span>
            </div>
            <p className="text-xs text-slate-400">Turn off notifications and close unnecessary tabs</p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">Deep Focus</span>
            </div>
            <p className="text-xs text-slate-400">Use noise-cancelling headphones or focus music</p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { categoryConfig, TaskCategory } from '@/lib/types';
import { Brain, Users, ClipboardList, Dumbbell, Heart, BookOpen, Palette } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Brain,
  Users,
  ClipboardList,
  Dumbbell,
  Heart,
  BookOpen,
  Palette,
};

export function CategoryLegend() {
  const categories = Object.entries(categoryConfig) as [TaskCategory, typeof categoryConfig[TaskCategory]][];

  return (
    <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-6">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
      <div className="space-y-3">
        {categories.map(([key, config]) => {
          const Icon = iconMap[config.icon];
          return (
            <div key={key} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: config.bgColor }}
              >
                {Icon && <Icon className="w-4 h-4" style={{ color: config.color }} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{config.label}</p>
                <p className="text-xs text-slate-500 capitalize">{key.replace('-', ' ')}</p>
              </div>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
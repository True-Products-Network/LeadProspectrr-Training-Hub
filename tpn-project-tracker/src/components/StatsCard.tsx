'use client';

import { ProjectStats } from '@/types/project';

interface StatsCardProps {
  stats: ProjectStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    { label: 'Total Projects', value: stats.total, color: 'bg-blue-500' },
    { label: 'Not Started', value: stats.notStarted, color: 'bg-gray-500' },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-600' },
    { label: 'Complete', value: stats.complete, color: 'bg-green-500' },
  ];

  const priorityItems = [
    { label: 'High Priority', value: stats.highPriority, color: 'bg-red-500' },
    { label: 'Medium Priority', value: stats.mediumPriority, color: 'bg-yellow-500' },
    { label: 'Low Priority', value: stats.lowPriority, color: 'bg-green-500' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className={`${item.color} text-white rounded-lg p-3 mb-2`}>
              <span className="text-2xl font-bold">{item.value}</span>
            </div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">By Priority</h3>
        <div className="grid grid-cols-3 gap-4">
          {priorityItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className={`${item.color} text-white rounded-lg p-2 mb-1`}>
                <span className="text-xl font-bold">{item.value}</span>
              </div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.total > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Completion Rate</h3>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(stats.complete / stats.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Math.round((stats.complete / stats.total) * 100)}% complete
          </p>
        </div>
      )}
    </div>
  );
}

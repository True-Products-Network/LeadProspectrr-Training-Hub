'use client';

import { ProjectStatus, ProjectPriority } from '@/types/project';

interface FilterBarProps {
  statusFilter: ProjectStatus | 'All';
  priorityFilter: ProjectPriority | 'All';
  onStatusChange: (status: ProjectStatus | 'All') => void;
  onPriorityChange: (priority: ProjectPriority | 'All') => void;
}

const statusOptions: (ProjectStatus | 'All')[] = ['All', 'Not Started', 'In Progress', 'Complete'];
const priorityOptions: (ProjectPriority | 'All')[] = ['All', 'Low', 'Medium', 'High'];

export function FilterBar({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus | 'All')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as ProjectPriority | 'All')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'All Priorities' : `${p} Priority`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

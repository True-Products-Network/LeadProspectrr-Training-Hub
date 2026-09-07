'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { getTaskStats } from '@/data/tasks';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Edit2,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Clock as ClockIcon
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  projectName: string;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  'todo': { 
    icon: Circle, 
    label: 'To Do', 
    color: 'text-gray-500',
    bg: 'bg-gray-100'
  },
  'in_progress': { 
    icon: Clock, 
    label: 'In Progress', 
    color: 'text-amber-600',
    bg: 'bg-amber-100'
  },
  'done': { 
    icon: CheckCircle2, 
    label: 'Done', 
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
};

export default function TaskList({ 
  tasks, 
  projectName, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onStatusChange 
}: TaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const stats = getTaskStats(tasks);

  const handleStatusToggle = (task: Task) => {
    const nextStatus: TaskStatus = 
      task.status === 'todo' ? 'in_progress' :
      task.status === 'in_progress' ? 'done' : 'todo';
    onStatusChange(task.id, nextStatus);
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-3">No tasks yet for this project</p>
        <button
          onClick={onAddTask}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add First Task
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          <h3 className="font-semibold text-gray-900">Tasks</h3>
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Progress mini-bar */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.completionRate}%</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddTask(); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Task List */}
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const StatusIcon = statusConfig[task.status].icon;
            const statusStyle = statusConfig[task.status];

            return (
              <div 
                key={task.id}
                className="p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleStatusToggle(task)}
                    className={`mt-0.5 p-1 rounded-full transition-colors ${statusStyle.bg} ${statusStyle.color} hover:opacity-80`}
                    title={`Click to change status (${statusConfig[task.status].label})`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-medium ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.name}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}

                    {/* Task Meta */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusStyle.label}
                      </span>
                      
                      {task.owner && (
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.owner}
                        </span>
                      )}
                      
                      {task.dueDate && (
                        <span className={`inline-flex items-center gap-1 ${
                          new Date(task.dueDate) < new Date() && task.status !== 'done' 
                            ? 'text-red-600' 
                            : ''
                        }`}>
                          <Calendar className="w-3 h-3" />
                          Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      
                      {(task.estimatedHours > 0 || task.actualHours > 0) && (
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {task.actualHours}h / {task.estimatedHours}h
                          {task.actualHours > task.estimatedHours && (
                            <span className="text-red-500">(over)</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                <span className="font-medium text-gray-900">{stats.done}</span> done
              </span>
              <span className="text-gray-600">
                <span className="font-medium text-amber-600">{stats.inProgress}</span> in progress
              </span>
              <span className="text-gray-600">
                <span className="font-medium text-gray-500">{stats.todo}</span> todo
              </span>
            </div>
            <span className="text-gray-500">
              {stats.completionRate}% complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

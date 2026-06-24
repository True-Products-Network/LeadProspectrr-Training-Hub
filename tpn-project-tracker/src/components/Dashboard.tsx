'use client';

import { Project, Status, Priority } from '@/data/projects';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  PauseCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Plus
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onAddNew: () => void;
}

export default function Dashboard({ projects, onAddNew }: DashboardProps) {
  const stats = {
    total: projects.length,
    notStarted: projects.filter(p => p.status === 'Not Started').length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    inReview: projects.filter(p => p.status === 'Review').length,
    complete: projects.filter(p => p.status === 'Complete').length,
    parked: projects.filter(p => p.status === 'Parked').length,
    highPriority: projects.filter(p => p.priority === 'High').length,
    mediumPriority: projects.filter(p => p.priority === 'Medium').length,
    lowPriority: projects.filter(p => p.priority === 'Low').length,
    withDueDate: projects.filter(p => p.dueDate !== null).length,
    overdue: projects.filter(p => {
      if (!p.dueDate) return false;
      return new Date(p.dueDate) < new Date() && p.status !== 'Complete';
    }).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;

  const statusCards = [
    { 
      label: 'Not Started', 
      count: stats.notStarted, 
      icon: Circle, 
      color: 'bg-gray-100 text-gray-700',
      borderColor: 'border-gray-200'
    },
    { 
      label: 'In Progress', 
      count: stats.inProgress, 
      icon: Clock, 
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'In Review', 
      count: stats.inReview, 
      icon: AlertCircle, 
      color: 'bg-amber-100 text-amber-700',
      borderColor: 'border-amber-200'
    },
    { 
      label: 'Complete', 
      count: stats.complete, 
      icon: CheckCircle2, 
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-200'
    },
    { 
      label: 'Parked', 
      count: stats.parked, 
      icon: PauseCircle, 
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-200'
    }
  ];

  const priorityCards = [
    { label: 'High', count: stats.highPriority, color: 'bg-red-100 text-red-700', borderColor: 'border-red-200' },
    { label: 'Medium', count: stats.mediumPriority, color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-200' },
    { label: 'Low', count: stats.lowPriority, color: 'bg-green-100 text-green-700', borderColor: 'border-green-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats with Add Button */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Due Date</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withDueDate}</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          
          <div className={`p-4 rounded-lg shadow-sm border ${stats.overdue > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${stats.overdue > 0 ? 'text-red-600' : 'text-gray-500'}`}>Overdue</p>
                <p className={`text-2xl font-bold ${stats.overdue > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.overdue}</p>
              </div>
              <AlertCircle className={`w-8 h-8 ${stats.overdue > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
        
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Status Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {statusCards.map((card) => (
            <div 
              key={card.label}
              className={`p-4 rounded-lg border-2 ${card.borderColor} ${card.color} transition-transform hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{card.label}</span>
              </div>
              <p className="text-2xl font-bold">{card.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Priority Breakdown</h3>
        <div className="grid grid-cols-3 gap-3">
          {priorityCards.map((card) => (
            <div 
              key={card.label}
              className={`p-4 rounded-lg border-2 ${card.borderColor} ${card.color} transition-transform hover:scale-105`}
            >
              <span className="text-sm font-medium">{card.label} Priority</span>
              <p className="text-2xl font-bold mt-1">{card.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-sm font-medium text-gray-600">{completionRate}% Complete</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{stats.complete} of {stats.total} projects completed</span>
          <span>{stats.inProgress} in progress</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Project, Status, Priority, Category, categories } from '@/data/projects';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search,
  Calendar,
  User,
  Folder,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  PauseCircle,
  AlertCircle,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

type SortField = 'name' | 'status' | 'priority' | 'owner' | 'dueDate' | 'category' | 'revenueImpact';
type SortDirection = 'asc' | 'desc';

const statusColors: Record<Status, string> = {
  'Not Started': 'bg-gray-100 text-gray-700 border-gray-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'Complete': 'bg-green-100 text-green-700 border-green-200',
  'Parked': 'bg-purple-100 text-purple-700 border-purple-200'
};

const statusIcons: Record<Status, React.ReactNode> = {
  'Not Started': <Circle className="w-4 h-4" />,
  'In Progress': <Clock className="w-4 h-4" />,
  'Review': <AlertCircle className="w-4 h-4" />,
  'Complete': <CheckCircle2 className="w-4 h-4" />,
  'Parked': <PauseCircle className="w-4 h-4" />
};

const priorityColors: Record<Priority, string> = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
};

const categoryColors: Record<Category, string> = {
  'Build Backlog': 'bg-indigo-50 text-indigo-700',
  'Ideas & Wishlist': 'bg-pink-50 text-pink-700',
  'Marketing Assets': 'bg-emerald-50 text-emerald-700',
  'Technical Builds': 'bg-cyan-50 text-cyan-700',
  'Client Projects': 'bg-orange-50 text-orange-700',
  'Content': 'bg-violet-50 text-violet-700'
};

export default function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  const isOverdue = (project: Project) => {
    if (!project.dueDate || project.status === 'Complete') return false;
    return new Date(project.dueDate) < new Date();
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.nextAction.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });

    const priorityOrder: Record<Priority, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const statusOrder: Record<Status, number> = { 
      'In Progress': 5, 
      'Review': 4, 
      'Not Started': 3, 
      'Parked': 2, 
      'Complete': 1 
    };

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'status':
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'owner':
          comparison = a.owner.localeCompare(b.owner);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [projects, searchTerm, categoryFilter, statusFilter, priorityFilter, sortField, sortDirection]);

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Complete">Complete</option>
            <option value="Parked">Parked</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All');
              setStatusFilter('All');
              setPriorityFilter('All');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {filteredAndSortedProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <SortHeader field="name">Project</SortHeader>
                <SortHeader field="category">Category</SortHeader>
                <SortHeader field="status">Status</SortHeader>
                <SortHeader field="priority">Priority</SortHeader>
                <SortHeader field="owner">Owner</SortHeader>
                <SortHeader field="dueDate">Due Date</SortHeader>
                <SortHeader field="revenueImpact">Revenue Impact</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedProjects.map((project) => (
                <>
                  <tr 
                    key={project.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${isOverdue(project) ? 'bg-red-50' : ''}`}
                    onClick={() => toggleRow(project.id)}
                  >
                    <td className="px-4 py-3">
                      {expandedRows.has(project.id) ? 
                        <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColors[project.category]}`}>
                        {project.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[project.status]}`}>
                        {statusIcons[project.status]}
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[project.priority]}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {project.owner}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 text-sm ${isOverdue(project) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '—'}
                        {isOverdue(project) && <span className="text-xs">(Overdue)</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 font-medium truncate max-w-[150px]" title={project.revenueImpact}>
                          {project.revenueImpact || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEdit(project)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.name)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(project.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{project.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                <ArrowRight className="w-4 h-4 text-blue-500" />
                                Next Action
                              </h4>
                              <p className="text-sm text-gray-600">{project.nextAction}</p>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                <Folder className="w-4 h-4 text-amber-500" />
                                Asset Location
                              </h4>
                              <p className="text-sm text-gray-600 font-mono">{project.assetLocation}</p>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                Revenue Impact
                              </h4>
                              <p className="text-sm text-gray-600">{project.revenueImpact}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 mb-2">No projects match your filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

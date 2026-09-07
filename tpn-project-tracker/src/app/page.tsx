'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/data/projects';
import ProjectTable from '@/components/ProjectTable';
import Dashboard from '@/components/Dashboard';
import ProjectModal from '@/components/ProjectModal';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const { projects, isLoaded, addProject, updateProject, deleteProject, resetToDefault } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSave = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                True Products Network
              </h1>
              <p className="text-gray-600 mt-1">
                Master Project Tracker
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset to original catalogue"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Target Revenue</p>
                <p className="text-xl font-bold text-green-600">$84,000/mo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        <section className="mb-8">
          <Dashboard projects={projects} onAddNew={handleAddNew} />
        </section>

        {/* Project Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Projects</h2>
            <div className="text-sm text-gray-500">
              Click any row to expand details
            </div>
          </div>
          <ProjectTable 
            projects={projects} 
            onEdit={handleEdit}
            onDelete={deleteProject}
          />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>True Products Network LLC</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <ProjectModal
        project={editingProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </main>
  );
}

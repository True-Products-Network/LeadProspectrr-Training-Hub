'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, Status, Priority, Category, projects as initialProjects } from '@/data/projects';

const STORAGE_KEY = 'tpn-project-tracker-data';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
      } catch {
        setProjects(initialProjects);
      }
    } else {
      setProjects(initialProjects);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetToDefault = useCallback(() => {
    if (confirm('Are you sure? This will reset all projects to the original catalogue.')) {
      setProjects(initialProjects);
    }
  }, []);

  return {
    projects,
    isLoaded,
    addProject,
    updateProject,
    deleteProject,
    resetToDefault,
  };
}

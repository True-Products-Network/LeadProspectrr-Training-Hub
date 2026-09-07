'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { initialTasks, getTaskStats } from '@/data/tasks';

const STORAGE_KEY = 'tpn-tasks-data';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTasks(parsed);
      } catch {
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: task.status === 'done' ? new Date().toISOString().split('T')[0] : null,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        
        // Auto-set completedAt when status changes to done
        const completedAt = updates.status === 'done' && t.status !== 'done'
          ? new Date().toISOString().split('T')[0]
          : updates.status === 'done' || updates.status === 'in_progress' || updates.status === 'todo'
            ? null
            : t.completedAt;

        return { ...t, ...updates, completedAt };
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTasksByProject = useCallback((projectId: string) => {
    return tasks.filter(t => t.projectId === projectId);
  }, [tasks]);

  const getStats = useCallback(() => {
    return getTaskStats(tasks);
  }, [tasks]);

  const getProjectProgress = useCallback((projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(t => t.status === 'done').length;
    return Math.round((completed / projectTasks.length) * 100);
  }, [tasks]);

  const resetToDefault = useCallback(() => {
    if (confirm('Are you sure? This will reset all tasks to the original sample data.')) {
      setTasks(initialTasks);
    }
  }, []);

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getStats,
    getProjectProgress,
    resetToDefault,
  };
}

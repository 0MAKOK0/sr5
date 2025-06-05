import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { LOCAL_STORAGE_TASKS_KEY, toLocalISOStringDate } from '../constants';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'> & { id?: string, createdAt?: string }) => {
    const newTask: Task = {
      id: task.id || Date.now().toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status || TaskStatus.NEW,
      createdAt: task.createdAt || new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const getTasksForDate = useCallback((date: Date): Task[] => {
    const dateString = toLocalISOStringDate(date);
    return tasks.filter(task => task.dueDate === dateString);
  }, [tasks]);

  return { tasks, addTask, updateTask, deleteTask, getTasksForDate };
};
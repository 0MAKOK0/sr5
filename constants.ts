import { TaskStatus } from './types';

export const APP_NAME = "Task Master Pro";

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.NEW, label: 'Новая' },
  { value: TaskStatus.IN_PROGRESS, label: 'В процессе' },
  { value: TaskStatus.COMPLETED, label: 'Завершена' },
];

export const LOCAL_STORAGE_TASKS_KEY = 'taskmaster_tasks';
export const LOCAL_STORAGE_AUTH_KEY = 'taskmaster_auth';

export const DATE_FORMAT = "yyyy-MM-dd";

export const toLocalISOStringDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
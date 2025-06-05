
export enum TaskStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // Store as ISO string YYYY-MM-DD
  status: TaskStatus;
  createdAt: string; // Store as ISO string
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any; // Task object
}

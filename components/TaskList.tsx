
import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <img src="https://github.com/0MAKOK0/DIMAS_FRONTIK/blob/main/task1.2/profile.png?raw=true_" alt="Список пуст" className="mx-auto mb-4 rounded-lg shadow-md w-64 h-40 object-cover" />
        <p className="text-xl text-slate-400"></p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { [TaskStatus.NEW]: 1, [TaskStatus.IN_PROGRESS]: 2, [TaskStatus.COMPLETED]: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (a.dueDate) {
      return -1; // Tasks with due dates come before those without
    } else if (b.dueDate) {
      return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          onStatusChange={(newStatus) => onUpdateTaskStatus({ ...task, status: newStatus })}
        />
      ))}
    </div>
  );
};

export default TaskList;

import React from 'react';
import { Task, TaskStatus } from '../types';
import { TASK_STATUS_OPTIONS } from '../constants';
import { PencilIcon, TrashIcon, CalendarDaysIcon, CheckCircleIcon, ArrowPathIcon, DocumentIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: TaskStatus) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NEW: return 'border-l-blue-500 bg-slate-800';
      case TaskStatus.IN_PROGRESS: return 'border-l-yellow-500 bg-slate-800';
      case TaskStatus.COMPLETED: return 'border-l-green-500 bg-slate-700 opacity-80';
      default: return 'border-l-gray-500 bg-slate-800';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NEW: return <DocumentIcon className="w-5 h-5 text-blue-400" />;
      case TaskStatus.IN_PROGRESS: return <ArrowPathIcon className="w-5 h-5 text-yellow-400 animate-spin-slow" />;
      case TaskStatus.COMPLETED: return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      default: return <DocumentIcon className="w-5 h-5 text-gray-400" />;
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Без срока';
    try {
        const date = new Date(dateString + 'T00:00:00'); // Ensure correct parsing for YYYY-MM-DD
        return new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    } catch(e) {
        console.error("Error formatting date:", dateString, e);
        return "Неверная дата";
    }
  };

  return (
    <div className={`p-5 rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:scale-[1.01] ${getStatusColor(task.status)}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <h3 className={`text-xl font-semibold ${task.status === TaskStatus.COMPLETED ? 'line-through text-slate-400' : 'text-slate-100'}`}>{task.title}</h3>
        <div className="flex items-center mt-2 sm:mt-0">
          {getStatusIcon(task.status)}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className={`ml-2 p-1.5 text-xs rounded-md bg-slate-700 border border-slate-600 focus:ring-blue-500 focus:border-blue-500 ${task.status === TaskStatus.COMPLETED ? 'text-slate-400' : 'text-slate-100'}`}
            aria-label="Изменить статус задачи"
          >
            {TASK_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      {task.description && <p className="text-slate-300 mb-3 text-sm">{task.description}</p>}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-400">
        <div className="flex items-center mb-2 sm:mb-0">
          <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-cyan-400" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-400 transition duration-150 rounded-md hover:bg-slate-700" aria-label={`Редактировать задачу ${task.title}`}>
            <PencilIcon className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-400 transition duration-150 rounded-md hover:bg-slate-700" aria-label={`Удалить задачу ${task.title}`}>
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
       <p className="text-xs text-slate-500 mt-2">Создана: {new Date(task.createdAt).toLocaleDateString('ru-RU')}</p>
    </div>
  );
};

export default TaskItem;
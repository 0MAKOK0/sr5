
import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from './Icons';
import { toLocalISOStringDate } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  getTasksForDate: (date: Date) => Task[];
}

const DAYS_OF_WEEK = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onEditTask, getTasksForDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedActualDate, setSelectedActualDate] = useState<Date | null>(null);

  const startOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const endOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), [currentDate]);
  const numDaysInMonth = useMemo(() => endOfMonth.getDate(), [endOfMonth]);
  const firstDayOfMonth = useMemo(() => startOfMonth.getDay(), [startOfMonth]); // 0 for Sunday, 1 for Monday, etc.

  const daysInMonthGrid = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= numDaysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate, firstDayOfMonth, numDaysInMonth]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = task.dueDate; // YYYY-MM-DD
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push(task);
      }
    });
    return map;
  }, [tasks]);
  
  const selectedDateTasks = useMemo(() => {
    if (selectedActualDate) {
      return getTasksForDate(selectedActualDate);
    }
    return [];
  }, [selectedActualDate, getTasksForDate]);


  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedActualDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedActualDate(null);
  };

  const handleDayClick = (date: Date | null) => {
    setSelectedActualDate(date);
  };
  
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedActualDate) return false;
    return date.getFullYear() === selectedActualDate.getFullYear() &&
           date.getMonth() === selectedActualDate.getMonth() &&
           date.getDate() === selectedActualDate.getDate();
  }

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 rounded-md hover:bg-slate-700 transition-colors" aria-label="Предыдущий месяц">
          <ChevronLeftIcon className="w-6 h-6 text-blue-300" />
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-300">
          {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-md hover:bg-slate-700 transition-colors" aria-label="Следующий месяц">
          <ChevronRightIcon className="w-6 h-6 text-blue-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-slate-400 mb-2">
        {DAYS_OF_WEEK.map(day => <div key={day} aria-hidden="true">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysInMonthGrid.map((day, index) => {
          const dayKey = day ? toLocalISOStringDate(day) : '';
          const dayTasks = day ? tasksByDate.get(dayKey) || [] : [];
          const dayLabel = day ? day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric'}) : 'Пустой день';
          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`h-16 sm:h-24 p-1.5 sm:p-2 border border-slate-700 rounded-md transition-colors cursor-pointer 
                ${day ? 'hover:bg-slate-600' : 'bg-slate-800/50 opacity-50'}
                ${day && !isSelected(day) ? 'bg-slate-700/50' : ''}
                ${isSelected(day) ? 'bg-blue-500/30 ring-2 ring-blue-400' : ''}
                ${isToday(day) && !isSelected(day) ? 'ring-1 ring-blue-600 bg-slate-700/70' : ''}
                ${isToday(day) && isSelected(day) ? 'ring-2 ring-blue-400' : ''}
              `}
              role="button"
              tabIndex={day ? 0 : -1}
              aria-label={day ? `${dayLabel}${dayTasks.length > 0 ? `, ${dayTasks.length} задач(и)` : ''}${isToday(day) ? ', Сегодня' : ''}` : undefined}
            >
              {day && (
                <>
                  <span className={`text-xs sm:text-sm ${isToday(day) ? 'font-bold text-blue-300' : 'text-slate-300'} ${isSelected(day) ? 'text-blue-200' : ''}`}>{day.getDate()}</span>
                  {dayTasks.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-0.5 justify-center items-center" aria-hidden="true">
                      {dayTasks.slice(0,2).map(task => ( 
                        <div key={task.id} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                            task.status === 'Completed' ? 'bg-green-500' : 
                            task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                      ))}
                      {dayTasks.length > 2 && <span className="text-[0.6rem] sm:text-xs text-slate-400 leading-none ml-0.5">+{dayTasks.length - 2}</span>}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedActualDate && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-blue-200 mb-3">
            Задачи на {selectedActualDate.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          {selectedDateTasks.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {selectedDateTasks.map(task => (
                <li key={task.id} className="flex justify-between items-center p-3 bg-slate-700 hover:bg-slate-600/70 rounded-md text-sm group">
                  <span className={`${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>{task.title}</span>
                  <button 
                    onClick={() => onEditTask(task)} 
                    className="p-1 text-slate-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Редактировать задачу ${task.title}`}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center">Нет задач на этот день.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
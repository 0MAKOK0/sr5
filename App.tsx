
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from './types';
import { useTaskManager } from './hooks/useTaskManager';
import TaskFormModal from './components/TaskFormModal';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import LoginPage from './components/LoginPage';
import { PlusIcon, CalendarIcon, ListBulletIcon, ArrowLeftOnRectangleIcon } from './components/Icons';
import { APP_NAME, LOCAL_STORAGE_AUTH_KEY } from './constants';


type ViewMode = 'list' | 'calendar';

const App: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, getTasksForDate } = useTaskManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    const authStatus = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLogin = useCallback(() => {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const openModalForNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openModalForEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask({ ...task, id: Date.now().toString(), createdAt: new Date().toISOString(), status: task.status || TaskStatus.NEW });
    }
    closeModal();
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 flex flex-col">
      <header className="bg-slate-800 shadow-lg p-4 sm:p-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 mb-2 sm:mb-0">
            {APP_NAME}
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={openModalForNewTask}
              className="flex items-center bg-orange-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-1 sm:mr-2" />
              Новая Задача
            </button>
            <button
              onClick={() => setCurrentView(currentView === 'list' ? 'calendar' : 'list')}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-150 ease-in-out"
              title={currentView === 'list' ? "Переключиться на Календарь" : "Переключиться на Список"}
              aria-label={currentView === 'list' ? "Переключиться на Календарь" : "Переключиться на Список"}
            >
              {currentView === 'list' ? <CalendarIcon className="w-6 h-6" /> : <ListBulletIcon className="w-6 h-6" />}
            </button>
             <button
              onClick={handleLogout}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out"
              title="Выйти"
              aria-label="Выйти"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {currentView === 'list' && (
          <TaskList
            tasks={tasks}
            onEditTask={openModalForEditTask}
            onDeleteTask={deleteTask}
            onUpdateTaskStatus={updateTask}
          />
        )}
        {currentView === 'calendar' && (
          <CalendarView tasks={tasks} onEditTask={openModalForEditTask} getTasksForDate={getTasksForDate}/>
        )}
      </main>

      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          task={editingTask}
        />
      )}
      <footer className="text-center p-4 text-sm text-slate-400 bg-slate-800">
        © {new Date().getFullYear()} {APP_NAME}.
      </footer>
    </div>
  );
};

export default App;
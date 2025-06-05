import React, { useState, FormEvent } from 'react';
import { APP_NAME } from '../constants';
import { LockClosedIcon, UserIcon } from './Icons'; 

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, введите имя пользователя и пароль.');
      return;
    }

    if (isRegisterMode) {
      if (!confirmPassword.trim()) {
        setError('Пожалуйста, подтвердите ваш пароль.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Пароли не совпадают.');
        return;
      }
      console.log('Пользователь зарегистрирован:', username);
      onLogin();
    } else {
      console.log('Пользователь вошел:', username);
      onLogin();
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="w-full max-w-md bg-slate-800 shadow-2xl rounded-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mb-2">
            {APP_NAME}
          </h1>
          <p className="text-slate-400">{isRegisterMode ? 'Создать новый аккаунт' : 'Войдите, чтобы управлять задачами'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">Имя пользователя</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Имя пользователя (например, demo)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Пароль</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegisterMode ? "new-password" : "current-password"}
                required
                className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Пароль (например, demo)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Подтвердите Пароль</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required={isRegisterMode}
                  className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Подтвердите Пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-required={isRegisterMode}
                />
              </div>
            </div>
          )}

          {error && <p role="alert" className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition transform hover:scale-105"
            >
              {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline focus:outline-none"
          >
            {isRegisterMode ? 'Уже есть аккаунт? Войти' : "Нет аккаунта? Зарегистрироваться"}
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center">
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
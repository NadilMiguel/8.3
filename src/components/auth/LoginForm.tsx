import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onLogin(username, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
          Nombre de Usuario
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-amazon-orange/70" />
          </div>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`
              block w-full pl-10 pr-3 py-2 rounded-lg
              bg-white border ${errors.username ? 'border-red-500' : 'border-amazon-orange/30'}
              text-amazon-brown placeholder-amazon-brown/50
              focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent
            `}
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
          Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-amazon-orange/70" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`
              block w-full pl-10 pr-3 py-2 rounded-lg
              bg-white border ${errors.password ? 'border-red-500' : 'border-amazon-orange/30'}
              text-amazon-brown placeholder-amazon-brown/50
              focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent
            `}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded bg-white border-amazon-orange/30 text-amazon-orange focus:ring-amazon-orange"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
            Recordarme
          </label>
        </div>
        <button type="button" className="text-sm text-amazon-orange hover:text-amazon-orange/80 transition-colors duration-200">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-amazon-orange hover:bg-amazon-orange/90 text-white font-medium transition-colors duration-200"
      >
        <LogIn size={18} />
        Iniciar Sesión
      </button>
    </form>
  );
}
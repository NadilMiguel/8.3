import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => void;
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onRegister(username, email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Elige un nombre de usuario"
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
          Correo Electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-amazon-orange/70" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`
              block w-full pl-10 pr-3 py-2 rounded-lg
              bg-white border ${errors.email ? 'border-red-500' : 'border-amazon-orange/30'}
              text-amazon-brown placeholder-amazon-brown/50
              focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent
            `}
            placeholder="Ingresa tu correo electrónico"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
            placeholder="Crea una contraseña"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-1">
          Confirmar Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-amazon-orange/70" />
          </div>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`
              block w-full pl-10 pr-3 py-2 rounded-lg
              bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-amazon-orange/30'}
              text-amazon-brown placeholder-amazon-brown/50
              focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent
            `}
            placeholder="Confirma tu contraseña"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 rounded bg-white border-amazon-orange/30 text-amazon-orange focus:ring-amazon-orange"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
          Acepto los{' '}
          <a href="#" className="text-amazon-orange hover:text-amazon-orange/80 transition-colors duration-200">
            términos y condiciones
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-amazon-orange hover:bg-amazon-orange/90 text-white font-medium transition-colors duration-200"
      >
        <UserPlus size={18} />
        Crear Cuenta
      </button>
    </form>
  );
}
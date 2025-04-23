import React, { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
  initialMode?: 'login' | 'register';
}

export function AuthLayout({ onLogin, onRegister, initialMode = 'login' }: AuthLayoutProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="py-6 px-8 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3">
          <Store size={32} className="text-amazon-brown" />
          <span className="text-xl font-bold text-amazon-brown">Store Manager</span>
        </Link>
        <nav>
          <Link 
            to={authMode === 'login' ? '/register' : '/login'}
            className="text-amazon-brown hover:text-amazon-orange transition-colors duration-200"
          >
            {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-amazon-brown to-amazon-brownDark rounded-xl shadow-xl overflow-hidden border border-amazon-orange/20">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h1>
                <p className="mt-2 text-amazon-orange/80">
                  {authMode === 'login'
                    ? 'Accede a tu cuenta para continuar'
                    : 'Regístrate para comenzar a usar la aplicación'}
                </p>
              </div>

              {authMode === 'login' ? (
                <LoginForm onLogin={onLogin} />
              ) : (
                <RegisterForm onRegister={onRegister} />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 px-8 text-center text-amazon-brown/50 text-sm">
        <p>© 2025 Store Manager. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
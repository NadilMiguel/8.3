import { useState, useEffect } from 'react';
import { authService } from '../services/api';

interface ErrorModal {
  isOpen: boolean;
  message: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorModal, setErrorModal] = useState<ErrorModal>({
    isOpen: false,
    message: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setErrorModal({
        isOpen: true,
        message: 'Error al iniciar sesión. Verifica tus credenciales.'
      });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authService.register(username, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error de registro:', error);
      setErrorModal({
        isOpen: true,
        message: 'Error al registrar. Intenta con otro nombre de usuario o correo.'
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsAuthenticated(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    errorModal,
    setErrorModal
  };
}
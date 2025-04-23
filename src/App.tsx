import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AuthLayout } from './components/auth/AuthLayout';
import { LandingPage } from './components/landing/LandingPage';
import { ErrorModal } from './components/ErrorModal';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, login, register, logout, isLoading, errorModal, setErrorModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#041E42] to-[#06304D]">
        <div className="text-[#0FFCBE] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout onLogin={login} onRegister={register} initialMode="login" />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout onLogin={login} onRegister={register} initialMode="register" />
            )
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Redirect root to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </Router>
  );
}

export default App;
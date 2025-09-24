import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorFallback from './components/common/ErrorFallback';
import './App.css';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const EmotionalSetupPage = lazy(() => import('./pages/EmotionalSetupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Loading component for Suspense fallback
const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <LoadingSpinner size="large" />
  </div>
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error(error)}>
      <LanguageProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="App min-h-screen bg-gray-50">
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                      path="/emotional-setup" 
                      element={
                        <ProtectedRoute>
                          <EmotionalSetupPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/reset-password" 
                      element={<ResetPasswordPage />} 
                    />
                    <Route path="*" element={<div>404 Not Found</div>} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

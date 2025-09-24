import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * ErrorFallback Component
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was caught
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary
 * @returns {JSX.Element} Error fallback UI
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary();
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-6xl">😕</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">¡Vaya! Algo salió mal</h1>
        <p className="mb-6 text-gray-600">
          Hemos encontrado un problema inesperado. Por favor, inténtalo de nuevo más tarde.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 w-full overflow-auto rounded bg-gray-100 p-4 text-left text-sm">
            <summary className="mb-2 cursor-pointer font-medium text-gray-700">Detalles del error</summary>
            <pre className="whitespace-pre-wrap break-words text-red-600">
              {error.message}\n{error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <button
            onClick={handleReset}
            className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;

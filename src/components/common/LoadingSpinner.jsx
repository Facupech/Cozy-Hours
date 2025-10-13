import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner Component
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner (small, medium, large)
 * @param {string} [props.color='primary'] - Color of the spinner
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-4',
  };

  const colorClasses = {
    primary: 'border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent',
    white: 'border-t-white border-r-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${
          sizeClasses[size] || sizeClasses.medium
        } ${colorClasses[color] || colorClasses.primary}`}
        role="status"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'white']),
};

export default LoadingSpinner;

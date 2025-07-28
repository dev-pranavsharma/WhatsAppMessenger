import React from 'react';

/**
 * Loading spinner component with customizable size
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className='flex w-full justify-center'>
    <div className={`spinner ${sizeClasses[size]} ${className}`}></div>
    </div>
  );
};

export default LoadingSpinner;
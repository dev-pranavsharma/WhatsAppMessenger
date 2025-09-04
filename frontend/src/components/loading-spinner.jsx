const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className='flex w-full justify-center'>
    <div className={`spinner  ${sizeClasses[size]} ${className}`}></div>
    </div>
  );
};

export default LoadingSpinner;
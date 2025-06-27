import React from 'react';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = '',
  height = 'h-2',
  backgroundColor = 'bg-gray-200',
  fillColor = 'bg-blue-600',
  rounded = 'rounded-full',
  showLabel = false,
  label = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${height} ${backgroundColor} ${rounded} overflow-hidden`}>
        <div
          className={`${height} ${fillColor} ${rounded} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
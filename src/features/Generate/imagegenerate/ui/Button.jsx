import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#272727] text-white hover:bg-[#1a1a1a] disabled:bg-gray-400 focus:ring-gray-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 focus:ring-gray-400',
    outline: 'border border-[#ededed] bg-white text-[#272727] hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 focus:ring-gray-400',
    gradient: 'bg-gradient-to-b from-white to-[#efefef] border border-[#ededed] text-[#272727] hover:from-gray-50 hover:to-gray-100 focus:ring-gray-400'
  };
  
  const sizes = {
    small: 'px-3 py-1 text-sm h-8',
    medium: 'px-4 py-2 text-base h-10',
    large: 'px-6 py-3 text-lg h-12',
    custom: ''
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
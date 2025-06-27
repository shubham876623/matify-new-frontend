import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '',
  icon,
  ...props 
}) => {
  const baseClasses = 'font-gilroy font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#272727] text-white hover:bg-[#1a1a1a] focus:ring-[#272727] disabled:bg-gray-400',
    secondary: 'bg-white border border-[#ededed] text-black hover:bg-gray-50 focus:ring-gray-300 disabled:bg-gray-100',
    gradient: 'bg-gradient-to-b from-white to-[#efefef] border border-[#ededed] text-black hover:from-gray-50 hover:to-gray-100 focus:ring-gray-300',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm h-8',
    medium: 'px-4 py-2 text-base h-10',
    large: 'px-6 py-3 text-lg h-12',
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {icon && <img src={icon} alt="" className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
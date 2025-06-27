import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  shadow = true,
  border = true,
  rounded = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white';
  
  const variants = {
    default: '',
    elevated: shadow ? 'shadow-[0px_8px_48px_rgba(0,0,0,0.04)]' : '',
    outlined: border ? 'border border-[#0000000a]' : '',
    gray: 'bg-[#f0f0f0]'
  };
  
  const paddings = {
    none: '',
    small: 'p-2',
    default: 'p-4',
    large: 'p-6',
    custom: 'p-5'
  };
  
  const roundedOptions = {
    none: '',
    small: 'rounded-lg',
    default: 'rounded-2xl',
    large: 'rounded-3xl',
    custom: 'rounded-[28px]'
  };
  
  const cardClasses = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${roundedOptions[rounded]} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
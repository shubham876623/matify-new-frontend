import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'medium',
  shadow = true,
  border = true,
  rounded = 'large',
  ...props 
}) => {
  const baseClasses = 'bg-white';
  
  const paddings = {
    none: '',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };
  
  const roundings = {
    none: '',
    small: 'rounded-lg',
    medium: 'rounded-xl',
    large: 'rounded-[28px]'
  };
  
  const cardClasses = `
    ${baseClasses}
    ${paddings[padding]}
    ${shadow ? 'shadow-sm' : ''}
    ${border ? 'border border-[#0000000a]' : ''}
    ${roundings[rounded]}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
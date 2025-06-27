import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-4',
  rounded = 'rounded-lg',
  shadow = 'shadow-sm',
  border = 'border border-gray-200',
  background = 'bg-white',
  ...props 
}) => {
  const cardClasses = `${background} ${border} ${rounded} ${shadow} ${padding} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
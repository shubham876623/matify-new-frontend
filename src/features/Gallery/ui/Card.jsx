import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-colors duration-200';
  
  const variants = {
    default: 'border-[#0000000a]',
    elevated: 'border-[#00000042] shadow-[0_0_15px_rgba(0,0,0,1)]',
    outlined: 'border-[#ededed]',
  };

  const paddings = {
    none: '',
    small: 'p-2',
    default: 'p-4',
    large: 'p-6',
  };

  const shadows = {
    none: '',
    small: 'shadow-sm',
    default: 'shadow-[0_8px_48px_rgba(0,0,0,0.04)]',
    large: 'shadow-lg',
  };

  const cardClasses = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${shadows[shadow]} ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} ${className}`;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  shadow: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  onClick: PropTypes.func,
};

export default Card;
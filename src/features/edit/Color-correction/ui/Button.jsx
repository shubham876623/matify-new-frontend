import React from 'react';

const Buttons = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses =
    'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 font-gilroy';

  const variants = {
    primary:
      'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 border-2 border-[#0000001e]',
    secondary: 'bg-white text-black hover:bg-gray-50 disabled:bg-gray-100 border border-[#ededed]',
    reset:
      'bg-gradient-to-b from-white to-[#efefef] text-black hover:from-gray-50 hover:to-gray-200 border border-[#ededed]',
  };

  const sizes = {
    small: 'px-3 py-1 text-sm h-8',
    medium: 'px-4 py-2 text-base h-10',
    large: 'px-6 py-3 text-lg h-12',
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`;

  return (
    <button onClick={onClick} disabled={disabled} className={buttonClasses} {...props}>
      {icon && <img src={icon} alt="" className="w-5 h-5" />}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Buttons;

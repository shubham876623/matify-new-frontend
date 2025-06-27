import React from 'react';

const Textarea = ({ 
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  rows = 4,
  ...props
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`w-full px-5 py-5 bg-[#f5f5f5] border-0 rounded-2xl text-[24px] font-semibold text-[#272727] placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
      {...props}
    />
  );
};

export default Textarea;
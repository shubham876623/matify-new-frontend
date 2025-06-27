import React from 'react';

const InputField = ({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <img src={icon} alt="input icon" className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-9 px-3 py-2 bg-gradient-to-b from-white to-[#efefef] border border-[#ededed] rounded-lg text-[14px] font-medium text-[#272727] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
          icon ? 'pl-10' : ''
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        {...props}
      />
    </div>
  );
};

export default InputField;
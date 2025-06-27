// src/components/ui/InputField.jsx
import React from 'react';

const InputField = ({
  label,
  icon,
  rightIcon,
  onRightIconClick,
  type = "text",
  ...inputProps
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
        {icon && (
          <img
            src={icon}
            alt="left icon"
            className="w-5 h-5 mr-2 opacity-70"
          />
        )}
        <input
          type={type}
          {...inputProps}  // only valid props like value, onChange, etc.
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {rightIcon && (
          <img
            src={rightIcon}
            alt="right icon"
            className="w-5 h-5 ml-2 cursor-pointer"
            onClick={onRightIconClick}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;

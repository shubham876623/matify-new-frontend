import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option',
  disabled = false,
  className = '',
  icon,
  hideArrows = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const baseClasses = 'relative w-full bg-gradient-to-b from-white to-[#efefef] border border-[#ededed] rounded-lg font-gilroy text-[14px] leading-[17px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#272727]';
  
  const buttonClasses = `${baseClasses} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${buttonClasses} px-3 py-2 flex items-center justify-between gap-2 h-9`}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
          <span className={value ? 'text-black' : 'text-[#a1a1a1]'}>
            {value || placeholder}
          </span>
        </div>
        {!hideArrows && <img 
          src="/images/img_switchvertical01.svg" 
          alt="dropdown" 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#ededed] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto overflow-x-visible w-[fit-content]">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left text-[0.9rem] font-gilroy hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
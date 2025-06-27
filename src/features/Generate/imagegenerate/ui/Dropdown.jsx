import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option',
  icon,
  className = '',
  disabled = false
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

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full h-9 px-3 py-2 bg-gradient-to-b from-white to-[#efefef] border border-[#ededed] rounded-lg flex items-center justify-between text-left text-[14px] font-medium text-[#272727] ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:from-gray-50 hover:to-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <img src={icon} alt="dropdown icon" className="w-4 h-4" />
          )}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <img 
          src="/Genratepageimages/img_chevrondown_gray_500_01.svg" 
          alt="chevron down" 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#ededed] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left text-[14px] text-[#272727] hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
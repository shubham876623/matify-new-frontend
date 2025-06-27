import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ 
  isOpen, 
  onClose, 
  items = [], 
  className = '',
  position = 'bottom-right',
  ...props 
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positions = {
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
  };

  const dropdownClasses = `absolute ${positions[position]} bg-white border border-[#ececec] rounded-lg shadow-lg py-2 min-w-[160px] z-50 ${className}`;

  return (
    <div
      ref={dropdownRef}
      className={dropdownClasses}
      {...props}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            }
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-[#424242] hover:bg-gray-50 transition-colors text-sm font-medium"
          disabled={item.disabled}
        >
          {item.icon && (
            <span className="inline-block w-4 h-4 mr-2">
              {typeof item.icon === 'string' ? (
                <img src={item.icon} alt="" className="w-4 h-4" />
              ) : (
                item.icon
              )}
            </span>
          )}
          {item.label}
        </button>
      ))}
    </div>
  );
};

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      disabled: PropTypes.bool,
    })
  ),
  className: PropTypes.string,
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
};

export default Dropdown;
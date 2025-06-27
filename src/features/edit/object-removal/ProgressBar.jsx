import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({
  value = 0,
  max = 100,
  className = '',
  showValue = false,
  color = 'blue',
  size = 'medium',
  onChange,
}) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6',
  };

  const colorClasses = {
    blue: 'bg-[#279af1]',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  const handleSeek = (e) => {
    if (!barRef.current || !onChange) return;

    const rect = barRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newPercentage = offsetX / rect.width;
    const newValue = Math.round(newPercentage * max);
    onChange(Math.min(Math.max(newValue, 0), max));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={barRef}
        className={`w-full bg-[#0000000f] rounded-full ${sizeClasses[size]} cursor-pointer`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-in-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Slider handle */}
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-white rounded-full shadow-sm border border-gray-200 pointer-events-none"></div>
        </div>
      </div>
      {showValue && <div className="mt-1 text-sm text-gray-600">{Math.round(percentage)}%</div>}
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  showValue: PropTypes.bool,
  color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onChange: PropTypes.func,
};

export default ProgressBar;

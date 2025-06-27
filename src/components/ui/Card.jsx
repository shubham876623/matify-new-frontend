import React from 'react';

const Card = ({ 
  title,
  subtitle,
  image,
  status,
  onGenerate,
  className = '',
  children,
  ...props 
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready':
        return 'bg-[#50d890]';
      case 'processing':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={`bg-white border border-[#909090] rounded-xl p-3 w-full h-full flex-1 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold leading-[19px] text-black font-gilroy">
            {title}
          </h3>
          <p className="text-[12px] font-semibold leading-[15px] text-[#a1a1a1] font-gilroy mt-1">
            {subtitle}
          </p>
        </div>
        {status && (
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
            <span className="text-[12px] font-semibold leading-[15px] text-[#272727] font-gilroy">
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Image */}
      {image && (
        <div className="mb-3">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-[106px] object-cover rounded-lg"
          />
        </div>
      )}

      {/* Custom Content */}
      {children}

      {/* Generate Button */}
      {onGenerate && (
        <button
          onClick={onGenerate}
          className="w-full h-8 bg-gradient-to-b from-white to-[#efefef] border border-[#ededed] rounded-md flex items-center justify-center gap-2 hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
        >
          <img 
            src="/images/img_frame.svg" 
            alt="generate" 
            className="w-4 h-4"
          />
          <span className="text-[14px] font-semibold leading-[18px] text-black font-gilroy">
            Generate
          </span>
        </button>
      )}
    </div>
  );
};

export default Card;
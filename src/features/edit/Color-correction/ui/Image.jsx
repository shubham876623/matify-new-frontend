import React, { useState, useEffect } from 'react';

const Image = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.png',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(() => src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-[22px]"></div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-[22px]">
          <span className="text-gray-400 text-sm">Image not found</span>
        </div>
      )}
    </div>
  );
};

export default Image;

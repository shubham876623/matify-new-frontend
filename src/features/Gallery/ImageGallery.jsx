import React, { useState } from 'react';
import Card from '../Gallery/ui/Card';

const ImageGallery = ({ onImageSelect, images = [], loading }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    if (onImageSelect) {
      onImageSelect(image);
    }
  };

  return (
    <Card className="w-[554px] h-[852px] p-2.5" shadow="default">
      <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto">
        {loading ? (
          <div className="col-span-3 text-center text-gray-500 py-4">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400 py-4">No images found.</div>
        ) : (
          images.map((image, index) => (
            <div
              key={image.id}
              className={`relative cursor-pointer transition-transform hover:scale-120
              }`}
              onClick={() => handleImageClick(image)}
            >
              {/* Featured Style if present */}
              {image.featured ? (
                <Card
                  variant="elevated"
                  padding="small"
                  className="h-[193px] w-[171px]"
                >
                  <img
                    src={image.image_url || image.src}
                    alt={`Generated image ${image.id}`}
                    className="w-full h-[177px] object-cover rounded-xl"
                  />
                </Card>
              ) : (
                <img
                  src={image.image_url || image.src}
                  alt={`Generated image ${image.id}`}
                  className="w-full h-[171px] object-cover rounded-xl"
                />
              )}

              {/* Active Border */}
              {selectedImage?.id === image.id && (
                <div className="absolute inset-0  bg-opacity-20 rounded-xl "></div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ImageGallery;

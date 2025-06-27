import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import ImageGallery from './ImageGallery';
import ImagePreview from './ImagePreview';
import EditActionButtons from '../../components/ui/EditActionButtons';

const GeneratedImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="flex min-h-screen w-screen bg-[#ffffff]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Main Area */}
        <div className="flex-1 bg-[#f9fafb] p-6 overflow-y-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold text-[#272727] font-gilroy leading-[24px] mb-1">
              Generated Images
            </h1>
            <p className="text-sm font-medium text-[#787878] font-gilroy">
              All your generated images will be displayed in this section.
            </p>
          </div>

          {/* Main Layout */}
          <div className="flex gap-6">
            {/* Left - Gallery */}
            <div className="w-[45%] max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
              <ImageGallery onImageSelect={handleImageSelect} />
            </div>

            {/* Right - Preview + Actions */}
            <div className="flex flex-col w-[55%] gap-5">
              {/* Image Preview Card */}
              <div className="bg-white rounded-[22px] p-4 border border-[#e5e7eb] shadow-sm">
                <ImagePreview selectedImage={selectedImage} />
              </div>

              {/* Edit Buttons (if image selected) */}
              {selectedImage && (
                <div className="bg-white rounded-[22px] p-4 border border-[#e5e7eb] shadow-sm">
                  <EditActionButtons
                    imageId={selectedImage.id}
                    outputImageUrl={selectedImage.image_url}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImage;

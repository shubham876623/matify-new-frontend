import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import ImageGallery from './ImageGallery';
import ImagePreview from './ImagePreview';
import CreditDisplay from './CreditDisplay';
import api from '../../api/axiosWithRefresh';
import { toast } from 'react-toastify';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const res = await api.get('/api/gallery/');
        console.log(res.data)
        setImages(res.data);
      } catch (error) {
        console.error('Failed to load gallery:', error);
        toast.error('Failed to load gallery images.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 bg-[#f9fafb] p-5">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-[20px] font-semibold leading-[25px] text-[#272727] font-gilroy mb-2">
              Saved Images
            </h1>
            <p className="text-[15px] font-medium leading-[19px] text-[#787878] font-gilroy">
              All your Saved images will be displayed in this section.
            </p>
          </div>

          {/* Main Dashboard Layout */}
          <div className="flex gap-5">
            {/* Left Side - Image Gallery */}
            <ImageGallery
              onImageSelect={handleImageSelect}
              images={images}
              loading={loading}
            />

            {/* Right Side - Preview and Tools */}
            <div className="flex flex-col gap-5">
              {/* Image Preview */}
              <ImagePreview selectedImage={selectedImage} />

              {/* Editing Tools */}
              <CreditDisplay imageId={selectedImage?.id} outputImageUrl={selectedImage?.image_url} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

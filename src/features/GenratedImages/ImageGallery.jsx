import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import api from '../../api/axiosWithRefresh';

const ImageGallery = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [tab, setTab] = useState('generated');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const [genRes, procRes] = await Promise.all([
          api.get('/api/generated-images/'),
          api.get('/api/processed-images/')
        ]);
        setGeneratedImages(genRes.data);
        setProcessedImages(procRes.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const images = tab === 'generated' ? generatedImages : processedImages;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    if (onImageSelect) {
      onImageSelect(image);
    }
  };

  return (
    <Card className="w-full h-full p-2.5" shadow="default">
      {/* Tabs */}
      <div className="flex justify-between mb-2">
        <button
          className={`px-3 py-1 text-sm rounded-xl font-medium ${
            tab === 'generated' ? 'bg-[#272727] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setTab('generated');
            setSelectedImage(null);
            onImageSelect(null);
          }}
        >
          Generated
        </button>
        {/* <button
          className={`px-3 py-1 text-sm rounded-xl font-medium ${
            tab === 'processed' ? 'bg-[#272727] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => {
            setTab('processed');
            setSelectedImage(null);
            onImageSelect(null);
          }}
        >
          Processed
        </button> */}
      </div>

      <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto">
        {loading ? (
          <p className="text-sm text-gray-500 col-span-3">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-gray-400 col-span-3">No images found.</p>
        ) : (
          images.map((image, index) => (
            <div
              key={image.id}
              className={`relative cursor-pointer transition-transform hover:scale-105 
              }`}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.image_url}
                alt={`Image ${image.id}`}
                className={`w-full ${index === 0 ? 'h-[177px]' : 'h-[171px]'} object-cover rounded-xl`}
              />
              {selectedImage?.id === image.id && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-xl border-2 border-blue-500"></div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ImageGallery;

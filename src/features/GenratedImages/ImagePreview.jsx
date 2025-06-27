import React from 'react';
import Card from '../../components/ui/Card';

const ImagePreview = ({ selectedImage }) => {
  const defaultImage = '';
  const imageToShow = selectedImage ? selectedImage.image_url : defaultImage;

  const handleDoubleClick = () => {
    if (selectedImage && selectedImage.image_url) {
      window.open(selectedImage.image_url, '_blank');
    }
  };

  return (
    <Card className="w-full h-full p-0" shadow="none">
      {/* Header */}
      <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mx-2.5 mt-2.5">
        <h3 className="text-[18px] font-medium leading-[22px] text-[#272727] font-gilroy">
          Image Preview
        </h3>
      </div>

    
      <div className="p-2.5 pt-4 flex items-center justify-center">
        {selectedImage && (
          <img
          src={imageToShow}
          alt="Preview"
          onDoubleClick={handleDoubleClick}
          className="w-full h-full object-cover rounded-[20px] cursor-pointer"
          title="Double click to open in new tab"
          />
        )}
          </div>
          
          </Card>
        );
      };
      
export default ImagePreview;

import React from 'react';
import Card from "../Gallery/ui/Card"


const ImagePreview = ({ selectedImage }) => {
  const defaultImage = '/Gallerypageimages/img_content.png';
  const imageToShow = selectedImage?.image_url || selectedImage?.src ;

  return (
    <Card className="w-[554px] h-[640px] p-0" shadow="none">
      {/* Header */}
      <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mx-2.5 mt-2.5">
        <h3 className="text-[18px] font-medium leading-[22px] text-[#272727] font-gilroy">
          Image Preview
        </h3>
      </div>

      {/* Image Display */}
      <div className="p-2.5 pt-4">
        {(imageToShow &&
          <img
            src={imageToShow}
            alt="Preview"
            className="w-[534px] h-[565px] object-cover rounded-[20px]"
          />
          
        )}
        </div>
    </Card>
  );
};

export default ImagePreview;

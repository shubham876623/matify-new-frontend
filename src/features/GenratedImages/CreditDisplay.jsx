import React from 'react';

const CreditDisplay = () => {
  return (
    <div className="bg-[#f0f0f0] rounded-2xl p-2.5 w-[554px]">
      {/* Editing Tools Row 1 */}
      <div className="flex gap-2.5 mb-2.5">
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_1.png"
            alt="Object Removal"
            className="w-4 h-4 mr-3"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Obj Removal
          </span>
        </div>
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_2.png"
            alt="Add Accessories"
            className="w-4 h-4 mr-2"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Add Accessories
          </span>
        </div>
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_3.png"
            alt="Outfit Swap"
            className="w-4 h-4 mr-3"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Outfit Swap
          </span>
        </div>
      </div>

      {/* Editing Tools Row 2 */}
      <div className="flex gap-2.5 mb-2.5">
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_4.png"
            alt="Background Replace"
            className="w-4 h-4 mr-4"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Bg Replace
          </span>
        </div>
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_5.png"
            alt="Upscale"
            className="w-4 h-4 mr-6"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Upscale
          </span>
        </div>
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_6.png"
            alt="Color Correction"
            className="w-4 h-4 mr-2"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Color Correction
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_label_7.png"
            alt="Add to Gallery"
            className="w-4 h-4 mr-6"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Add to Gallery
          </span>
        </div>
        <div className="bg-white border border-[#ededed] rounded-lg h-10 flex items-center px-4 flex-1">
          <img
            src="/images/img_.png"
            alt="Delete Image"
            className="w-4 h-4 mr-6"
          />
          <span className="text-[16px] font-medium leading-5 text-black font-gilroy">
            Delete Image
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreditDisplay;
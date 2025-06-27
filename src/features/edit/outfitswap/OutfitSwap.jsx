import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from '../../edit/outfitswap/ui/Button';
import api from '../../../api/axiosWithRefresh';
import { toast } from 'react-toastify';
import EditActionButtons from '../../../components/ui/EditActionButtons';
import { FaFileUpload } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const OutfitSwap = () => {
  const location = useLocation();
  const inputImageUrl = location.state?.inputImage || null;

  const [outfitImage, setOutfitImage] = useState(null);
  const [personImage, setPersonImage] = useState(null);
  const [outfitPreview, setOutfitPreview] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (inputImageUrl) {
      setPersonPreview(inputImageUrl);
    }
  }, [inputImageUrl]);

  const handleResetAll = () => {
    setOutfitImage(null);
    setPersonImage(null);
    setOutfitPreview(null);
    setPersonPreview(null);
    setOutputImage(null);
    setIsProcessing(false);
    toast.info('Reset all changes');
  };

  const handleOutfitChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOutfitImage(file);
      setOutfitPreview(URL.createObjectURL(file));
    }
  };

  const handlePersonChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonImage(file);
      setPersonPreview(URL.createObjectURL(file));
    }
  };

  const handleOutfitSwap = async () => {
    if (!outfitImage || (!personImage && !personPreview)) {
      toast.error('Please upload both outfit and person image.');
      return;
    }

    setIsProcessing(true);
    setOutputImage(null);

    try {
      const creditRes = await api.get('/api/credits/');
      if (creditRes.data.credits_remaining < 2) {
        toast.error('Not enough credits.');
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append('outfit_image', outfitImage);

      if (personImage) {
        formData.append('person_image', personImage);
      } else if (personPreview) {
        formData.append('person_url', personPreview);
      }

      const res = await api.post('/api/outfit-swap/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data) {
        setOutputImage(res.data);
        toast.success('Outfit swap successful.');
        await api.post('/api/dedctcredit/', { amount: 2 });
      } else {
        toast.error('No image returned.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Outfit swap failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#f9fafb] p-6">
          <h2 className="text-[18px] font-semibold text-[#272727] font-gilroy mb-1">Outfit Swap</h2>
          <p className="text-[14px] font-medium text-[#787878] font-gilroy leading-[19px] mb-6">
            Change your look with just one tap upload and swap outfits easily.
          </p>

          <div className="flex gap-6">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-6">
              {/* Person Image */}
              <div className="w-[554px] h-[306px] bg-white border border-[#0000000a] rounded-[28px] p-[10px]">
                <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-3">
                  <span className="text-[16px] font-medium text-[#272727] font-gilroy">Upload Your Image</span>
                </div>
                <div className="h-[230px] rounded-[22px] overflow-hidden flex items-center justify-center">
                  {personPreview ? (
                    <img src={personPreview} alt="Person" className="w-full h-full object-cover rounded-[20px]" />
                  ) : (
                    <div onClick={() => document.getElementById('personInput').click()} className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-[20px] cursor-pointer hover:bg-gray-50">
                      <FaFileUpload />
                      <p className="text-[#787878] text-[14px] font-medium text-center font-gilroy">
                        Click to upload<br />or choose from gallery
                      </p>
                      <input type="file" id="personInput" accept="image/*" onChange={handlePersonChange} className="hidden" />
                    </div>
                  )}
                </div>
              </div>

              {/* Outfit Image */}
              <div className="w-[554px] h-[306px] bg-white border border-[#0000000a] rounded-[28px] p-[10px]">
                <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-3">
                  <span className="text-[16px] font-medium text-[#272727] font-gilroy">Upload Outfit Image</span>
                </div>
                <div className="h-[230px] rounded-[22px] overflow-hidden flex items-center justify-center">
                  {outfitPreview ? (
                    <img src={outfitPreview} alt="Outfit" className="w-full h-full object-cover rounded-[20px]" />
                  ) : (
                    <div onClick={() => document.getElementById('outfitInput').click()} className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-[20px] cursor-pointer hover:bg-gray-50">
                      <FaFileUpload />
                      <p className="text-[#787878] text-[14px] font-medium text-center font-gilroy">
                        Click to upload<br />or choose from gallery
                      </p>
                      <input type="file" id="outfitInput" accept="image/*" onChange={handleOutfitChange} className="hidden" />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleResetAll} icon="/outfit-swap/img_refreshccw01.svg" className="w-[269px]">Reset All</Button>
                <Button variant="primary" onClick={handleOutfitSwap} icon="/outfit-swap/img_label_3.png" className="w-[269px]" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Outfit Swap'}
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE - Result */}
            <div className="w-[554px] h-[640px] bg-white border border-[#0000000a] rounded-[28px] p-[10px]">
              <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-3">
                <span className="text-[18px] font-medium text-[#272727] font-gilroy">Final Result</span>
              </div>
              <div className="h-[565px] rounded-[20px] overflow-hidden flex items-center justify-center">
                {isProcessing ? (
                  <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
                ) : outputImage ? (
                  <img
                    src={outputImage}
                    alt="Result"
                    className="w-full h-full object-cover cursor-pointer"
                    onDoubleClick={() => window.open(outputImage, '_blank')}
                    title="Double click to open"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-[#787878] text-[14px] font-medium font-gilroy text-center">Nothing generated yet</p>
                  </div>
                )}
              </div>

              <EditActionButtons outputImageUrl={outputImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSwap;

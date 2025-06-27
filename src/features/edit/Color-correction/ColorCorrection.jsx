// src/pages/edit/ColorCorrectionPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from "../Color-correction/ui/Button";
import Image from '../Color-correction/ui/Image';
import api from '../../../api/axiosWithRefresh';
import { toast } from 'react-toastify';
import { FiUploadCloud } from 'react-icons/fi';
import EditActionButtons from '../../../components/ui/EditActionButtons';
import { useLocation } from 'react-router-dom';

const ColorCorrectionPage = () => {
  const location = useLocation();
  const inputImageFromNav = location.state?.inputImage || null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (inputImageFromNav && !uploadedFile) {
      setSelectedImage(inputImageFromNav);
    }
  }, [inputImageFromNav]);

  const handleResetAll = () => {
    setOutputImage(null);
    setUploadedFile(null);
    setSelectedImage('');
    toast.info('All changes have been reset');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setOutputImage(null);
    }
  };

  const handleColorCorrection = async () => {
    if (!selectedImage && !uploadedFile) {
      toast.error("Please upload or select an image.");
      return;
    }

    setIsProcessing(true);
    setOutputImage(null);

    try {
      const creditRes = await api.get("/api/credits/");
      const credits = creditRes.data.credits_remaining;

      if (credits < 2) {
        toast.error("Not enough credits to apply color correction.");
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      if (uploadedFile) {
        formData.append("main_image", uploadedFile);
      } else {
        formData.append("image_url", selectedImage);
      }

      const response = await api.post("/api/color-correction/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;

      if (result) {
        setOutputImage(typeof result === 'string' ? result : `data:image/png;base64,${result.image}`);
        toast.success("Color correction applied successfully!");
        await api.post("/api/dedctcredit/", { amount: 2 });
      } else {
        toast.error("No output received.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply color correction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#f9fafb] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex flex-col flex-1 px-8 py-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-[22px] font-semibold leading-[26px] text-[#272727] font-gilroy">
              Color Correction
            </h1>
            <p className="text-[14px] font-medium leading-[18px] text-[#787878] font-gilroy">
              Adjust brightness, contrast, and colors to enhance your image.
            </p>
          </div>

          <div className="flex flex-1 flex-col lg:flex-row gap-6">
            {/* LEFT SIDE */}
            <div className="flex-1 h-full">
              <div className="bg-white rounded-[28px] border border-[#0000000a] shadow-md p-5 flex flex-col h-full justify-between">
                <div
                  className={`relative w-full flex-1 bg-[#f9f9f9] border-2 border-dashed ${
                    dragOver ? 'border-black' : 'border-[#d9d9d9]'
                  } rounded-[22px] flex flex-col justify-center items-center transition-all duration-200 overflow-hidden`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setUploadedFile(file);
                      const url = URL.createObjectURL(file);
                      setSelectedImage(url);
                      setOutputImage(null);
                    }
                  }}
                >
                  {!selectedImage && (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-6">
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center mb-3">
                        <FiUploadCloud className="w-6 h-6 text-gray-400" />
                      </div>
                      <span className="text-[14px] text-gray-500 font-medium text-center font-gilroy leading-tight">
                        Click to upload<br />
                        <span
                          className="underline cursor-pointer hover:text-black"
                          onClick={() => alert('Gallery modal placeholder')}
                        >
                          or choose from gallery
                        </span>
                      </span>
                    </label>
                  )}

                  {selectedImage && (
                    <>
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-full object-contain rounded-[22px]"
                      />
                      {uploadedFile && (
                        <div className="">
                          {/* {uploadedFile.name} */}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    variant="reset"
                    onClick={handleResetAll}
                    disabled={isProcessing}
                    icon="/color-correction/img_refreshccw01.svg"
                    className="w-full"
                  >
                    {isProcessing ? 'Resetting...' : 'Reset All'}
                  </Button>

                  <Button
                    variant="primary"
                    onClick={handleColorCorrection}
                    disabled={isProcessing}
                    icon="/color-correction/img_label_6.png"
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Color Correction'}
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 h-full flex flex-col justify-between space-y-4">
              <div className="bg-white rounded-[28px] border border-[#0000000a] p-2.5 flex-1">
                <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-2.5">
                  <span className="text-[18px] font-medium leading-[22px] text-[#272727] font-gilroy">
                    Final Result
                  </span>
                </div>

                <div className="flex-1 rounded-[22px] flex items-center justify-center overflow-hidden">
                  {isProcessing ? (
                    <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                  ) : outputImage ? (
                    <img
                      src={outputImage}
                      alt="Color corrected result"
                      className="w-full h-full object-contain rounded-[22px] cursor-zoom-in"
                      onDoubleClick={() => window.open(outputImage, '_blank')}
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                      {/* <img src="/images/no-output-placeholder.png" alt="No output" className="w-24 h-24" /> */}
                      <span>Nothing generated yet</span>
                    </div>
                  )}
                </div>
              </div>

              <EditActionButtons outputImageUrl={outputImage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ColorCorrectionPage;

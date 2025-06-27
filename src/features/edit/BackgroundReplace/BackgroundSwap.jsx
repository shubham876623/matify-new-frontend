import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from '../BackgroundReplace/ui/Button';
import Card from '../BackgroundReplace/ui/Card';
import EditActionButtons from "../../../components/ui/EditActionButtons";
import api from '../../../api/axiosWithRefresh';
import { toast } from 'react-toastify';
import { FaFileUpload, FaTrashAlt } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const BackgroundSwap = () => {
  const location = useLocation();
  const inputImageFromNav = location.state?.inputImage || null;

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputImage, setOutputImage] = useState('');

  useEffect(() => {
    if (inputImageFromNav) {
      setPreviewUrl(inputImageFromNav);
    }
  }, [inputImageFromNav]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(file);
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setOutputImage('');
    setPrompt('');
    setIsProcessing(false);
  };

  const handleBackgroundReplace = async () => {
    if (!selectedImage && !previewUrl) {
      toast.error('Please upload an image.');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt.');
      return;
    }

    setIsProcessing(true);
    setOutputImage('');

    try {
      const creditRes = await api.get('/api/credits/');
      if (creditRes.data.credits_remaining < 2) {
        toast.error('Not enough credits.');
        setIsProcessing(false);
        return;
      }

      let response;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('prompt', prompt);

        response = await api.post('/api/background-remove/', formData);
      } else {
        response = await api.post('/api/background-remove/', {
          image_url: previewUrl,
          prompt: prompt
        });
      }

      if (response?.data) {
        setOutputImage(response.data);
        toast.success('Background replaced!');
        await api.post('/api/dedctcredit/', { amount: 2 });
      } else {
        throw new Error('No output image returned.');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-5 overflow-auto">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#272727] font-gilroy">Background Replace</h1>
            <p className="text-[15px] text-[#787878] font-gilroy">
              Upload an image and describe the background you want.
            </p>
          </div>

          <div className="flex gap-6">
            {/* LEFT COLUMN */}
            <div className="flex-1 space-y-5">
              {/* Upload Image */}
              <Card className="w-full rounded-[22px]">
                <h2 className="text-sm text-[#272727] font-medium mb-2">Upload Your Image</h2>
                <label htmlFor="image-upload">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Main"
                        className="w-600 h-[600px] object-cover rounded-[20px] cursor-pointer"
                      />
                      <div className="absolute top-2 left-3 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        {selectedImage?.name || 'Image.jpg'}
                      </div>
                      <div
                        className="absolute top-2 right-3 bg-red-100 text-red-500 p-1 rounded-full cursor-pointer"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl('');
                        }}
                      >
                        <FaTrashAlt size={14} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-[280px] bg-gray-100 rounded-[20px] border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer">
                      <FaFileUpload className="text-gray-400 mb-2" size={20} />
                      <p className="text-sm text-gray-400">Click to upload or choose from gallery</p>
                    </div>
                  )}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Prompt Input */}
                <div className="mt-5">
                  <h2 className="text-sm text-[#272727] font-medium mb-2">Prompt</h2>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none"
                    placeholder="Describe the background (e.g. beach, mountains, night city...)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button variant="reset" onClick={handleReset} className="flex-1">
                  Reset All
                </Button>
                <Button variant="primary" onClick={handleBackgroundReplace} disabled={isProcessing} className="flex-1">
                  Background Replace
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-[554px] space-y-5">
              <Card className="h-[640px] rounded-[22px] flex flex-col">
                <div className="text-sm font-medium text-[#272727] mb-3 px-4 pt-4">Final Result</div>
                <div className="flex-1 flex items-center justify-center px-4 pb-4">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-3" />
                      <p className="text-sm text-gray-600">Generating...</p>
                    </div>
                  ) : outputImage ? (
                    <img
                      src={outputImage}
                      alt="Final"
                      className="w-full h-full object-cover rounded-[20px] cursor-pointer"
                      onDoubleClick={() => window.open(outputImage, '_blank')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-sm">
                      {/* <img src="/empty-gallery-placeholder.png" alt="empty" className="w-24 h-24 mb-3" /> */}
                      Nothing generated yet
                    </div>
                  )}
                </div>
              </Card>

              <EditActionButtons outputImageUrl={outputImage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BackgroundSwap;

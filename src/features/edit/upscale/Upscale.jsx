import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from "../Color-correction/ui/Button";
import Card from '../../../features/edit/upscale/ui/Card';
import api from '../../../api/axiosWithRefresh';
import { toast } from 'react-toastify';
import { FiUploadCloud } from 'react-icons/fi';
import EditActionButtons from '../../../components/ui/EditActionButtons';
import { useLocation } from 'react-router-dom';

const Upscale = () => {
  const location = useLocation();
  const inputImageUrl = location.state?.inputImage || null;

  const [selectedImage, setSelectedImage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (inputImageUrl && !uploadedFile) {
      setSelectedImage(inputImageUrl);
    }
  }, [inputImageUrl]);

  const handleUpscale = async () => {
    if (!selectedImage && !uploadedFile) {
      toast.warn("Please upload or select an image to upscale.");
      return;
    }

    setIsProcessing(true);
    setProcessedImage(null);

    try {
      const creditRes = await api.get('/api/credits/');
      const credits = creditRes.data.credits_remaining;

      if (credits < 2) {
        toast.error("Not enough credits to upscale image.");
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      if (uploadedFile) {
        formData.append('image', uploadedFile);
      } else {
        formData.append('image_url', selectedImage);
      }

      const response = await api.post('/api/upscale/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;

      if (data?.image) {
        setProcessedImage(`data:image/png;base64,${data.image}`);
        toast.success('Image upscaled successfully!');
        await api.post('/api/dedctcredit/', { amount: 2 });
      } else if (typeof data === 'string') {
        setProcessedImage(data);
        toast.success('Image upscaled successfully!');
        await api.post('/api/dedctcredit/', { amount: 2 });
      } else {
        toast.error('No image returned.');
      }
    } catch (err) {
      toast.error('Upscale failed.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAll = () => {
    setProcessedImage(null);
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
      setProcessedImage(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f9fafb]">
        <Header />

        <div className="px-5 py-6">
          <h1 className="text-[1.2rem] font-semibold leading-[25px] text-[#272727] font-gilroy">Upscale Image</h1>
          <p className="text-[1rem] font-medium leading-[19px] text-[#787878] font-gilroy mt-2">
            Make your images sharper, clearer, and high-resolution.
          </p>
        </div>

        <div className="flex-1 px-5 pb-5 flex gap-5 items-start justify-between">
          {/* Left Upload Panel */}
          <Card variant="elevated" className="h-full flex flex-col flex-1 border border-[#0000000a]" padding="custom" rounded="custom">
            <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-2">
                <span className="text-[1rem] font-medium text-[#272727] font-gilroy">Upload your image</span>
            </div>
            {/* Upload Section - Only when no image is selected */}
            {!selectedImage && (
              <label className="cursor-pointer block h-full">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div className="bg-[#F3F3F3] border-dashed border border-gray-300 rounded-[22px] h-full flex flex-col flex-1 justify-center items-center">
                  <div className="bg-[#F3F3F3] rounded-full p-4">
                    <FiUploadCloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <span className="text-[0.9rem] font-medium text-[#666] mt-4 font-gilroy">
                    Click to upload <br /> or choose from gallery
                  </span>
                </div>
              </label>
            )}

            {/* Image Preview + Buttons - Only when image is selected */}
            {selectedImage && (
              <>
                <div className="mb-5">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="h-full object-cover rounded-[22px]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="reset" size="custom" onClick={handleResetAll} className="w-[249px] rounded-lg">
                    <img src="/upscale-images/img_refreshccw01.svg" alt="reset" className="w-5 h-5" />
                    Reset All
                  </Button>

                  <Button variant="primary" size="custom" onClick={handleUpscale} disabled={isProcessing} className="w-[249px] rounded-lg">
                    <img src="/upscale-images/img_label_5.png" alt="upscale" className="w-6 h-6" />
                    {isProcessing ? 'Processing...' : 'Upscale'}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Right Final Result Panel */}
          <div className="flex-1 flex flex-col gap-5 h-full">
            <Card variant="outlined" className="h-full" padding="small" rounded="custom">
              <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-2">
                <span className="text-[1rem] font-medium text-[#272727] font-gilroy">Final Result</span>
              </div>

              {isProcessing ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                </div>
              ) : processedImage ? (
                <img
                  src={processedImage}
                  alt="Upscaled"
                  className="w-full object-cover rounded-[20px] cursor-zoom-in"
                  onDoubleClick={() => window.open(processedImage, '_blank')}
                  title="Double-click to open in new tab"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#999] text-sm">
                  Nothing generated yet
                </div>
              )}
            </Card>

            {processedImage && <EditActionButtons outputImageUrl={processedImage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upscale;

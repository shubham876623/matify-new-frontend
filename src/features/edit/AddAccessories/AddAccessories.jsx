import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from '../../../components/ui/Button';
import ProgressBar from '../object-removal/ProgressBar';
import Tooltip from '../object-removal/Tooltip';
import api from '../../../api/axiosWithRefresh';
import { toast } from 'react-toastify';
import EditActionButtons from '../../../components/ui/EditActionButtons';
import { useLocation } from 'react-router-dom';

const AddAccessoriesPage = () => {
  const location = useLocation();
  const inputImageFromNav = location.state?.inputImage || null;

  const [brushThickness, setBrushThickness] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [outputImage, setOutputImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 512, height: 512 });
  const [displaySize, setDisplaySize] = useState({ width: 512, height: 512 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawMode, setDrawMode] = useState(true); // true = draw, false = pan

  const [referencePreviewUrl, setReferencePreviewUrl] = useState(null);
  const [referenceImageSize, setReferenceImageSize] = useState({ width: 512, height: 512 });
  const [referenceDisplaySize, setReferenceDisplaySize] = useState({ width: 512, height: 512 });

  const canvasRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // Calculate display size to fit container while maintaining aspect ratio
  const calculateDisplaySize = (imgWidth, imgHeight, maxWidth = 512, maxHeight = 512) => {
    const imgAspectRatio = imgWidth / imgHeight;
    const containerAspectRatio = maxWidth / maxHeight;

    let displayWidth, displayHeight;

    if (imgAspectRatio > containerAspectRatio) {
      // Image is wider - fit to container width
      displayWidth = Math.min(imgWidth, maxWidth);
      displayHeight = displayWidth / imgAspectRatio;
    } else {
      // Image is taller - fit to container height
      displayHeight = Math.min(imgHeight, maxHeight);
      displayWidth = displayHeight * imgAspectRatio;
    }

    return { width: displayWidth, height: displayHeight };
  };

  useEffect(() => {
    if (inputImageFromNav) {
      setPreviewUrl(inputImageFromNav);
      const img = new Image();
      img.onload = () => {
        const originalSize = { width: img.naturalWidth, height: img.naturalHeight };
        const fitted = calculateDisplaySize(originalSize.width, originalSize.height);
        setImageSize(originalSize);
        setDisplaySize(fitted);
      };
      img.src = inputImageFromNav;
    }
  }, [inputImageFromNav]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.1));

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const resetAll = () => {
    setBrushThickness(20);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setDrawMode(true);
    setOutputImage('');
    setMainImage(null);
    setReferenceImage(null);
    setPreviewUrl(null);
    setReferencePreviewUrl(null);
    setImageSize({ width: 512, height: 512 });
    setDisplaySize({ width: 512, height: 512 });
    setReferenceImageSize({ width: 512, height: 512 });
    setReferenceDisplaySize({ width: 512, height: 512 });
    clearCanvas();
  };

  // Delete main image function
  const deleteMainImage = () => {
    setMainImage(null);
    setPreviewUrl(null);
    setImageSize({ width: 512, height: 512 });
    setDisplaySize({ width: 512, height: 512 });
    setPanOffset({ x: 0, y: 0 });
    clearCanvas();
    setOutputImage('');
  };

  // Delete reference image function
  const deleteReferenceImage = () => {
    setReferenceImage(null);
    setReferencePreviewUrl(null);
    setReferenceImageSize({ width: 512, height: 512 });
    setReferenceDisplaySize({ width: 512, height: 512 });
  };

  const getMaskBlob = () => {
    return new Promise((resolve) => {
      const originalCanvas = canvasRef.current;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imageSize.width;
      tempCanvas.height = imageSize.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Fill with black background
      tempCtx.fillStyle = 'black';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Scale the drawn mask to original image size
      const scaleX = imageSize.width / displaySize.width;
      const scaleY = imageSize.height / displaySize.height;

      tempCtx.scale(scaleX, scaleY);
      tempCtx.drawImage(originalCanvas, 0, 0);

      tempCanvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleGenerate = async () => {
    if (!mainImage && !previewUrl) {
      toast.error('Please upload or select a main image.');
      return;
    }
    if (!referenceImage) {
      toast.error('Please upload reference image.');
      return;
    }

    setLoading(true);
    try {
      const creditRes = await api.get('/api/credits/');
      if (creditRes.data.credits_remaining < 2) {
        toast.error('Not enough credits to generate the image.');
        setLoading(false);
        return;
      }

      const maskBlob = await getMaskBlob();
      const formData = new FormData();

      if (mainImage) {
        formData.append('main_image', mainImage);
      } else {
        formData.append('image_url', previewUrl);
      }

      formData.append('reference_image', referenceImage);
      formData.append('mask_image', maskBlob, 'mask.png');

      const response = await api.post('/api/add-accessories/', formData);
      setOutputImage(response.data);
      toast.success('Image generated successfully.');
      await api.post('/api/dedctcredit/', { amount: 2 });
    } catch (err) {
      console.error('Add accessories error:', err);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const container = imageContainerRef.current;

    if (!canvas || !container) return { x: 0, y: 0 };

    // Get the outer container (the one with 512px height) rect
    const outerContainer = canvas.closest('[style*="512px"]');
    const outerRect = outerContainer
      ? outerContainer.getBoundingClientRect()
      : canvas.parentElement.getBoundingClientRect();

    // Calculate mouse position relative to the outer container
    const mouseX = e.clientX - outerRect.left;
    const mouseY = e.clientY - outerRect.top;

    // Get the center of the outer container
    const centerX = outerRect.width / 2;
    const centerY = outerRect.height / 2;

    // Calculate offset from center
    const offsetX = mouseX - centerX;
    const offsetY = mouseY - centerY;

    // Account for zoom and pan transforms
    const transformedX = (offsetX - panOffset.x) / zoomLevel;
    const transformedY = (offsetY - panOffset.y) / zoomLevel;

    // Convert to canvas coordinates (canvas is centered)
    const canvasX = transformedX + displaySize.width / 2;
    const canvasY = transformedY + displaySize.height / 2;

    return { x: canvasX, y: canvasY };
  };

  const draw = (e) => {
    if (!drawing || !drawMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { x, y } = getCanvasCoordinates(e);

    ctx.lineWidth = brushThickness;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseDown = (e) => {
    if (drawMode) {
      setDrawing(true);
      // Start the path at the correct position
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const { x, y } = getCanvasCoordinates(e);

      ctx.beginPath();
      ctx.moveTo(x, y);

      draw(e);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (drawMode) {
      if (drawing) {
        draw(e);
      }
    } else if (!drawMode && isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (drawMode && drawing) {
      setDrawing(false);
      canvasRef.current.getContext('2d').beginPath();
    } else if (!drawMode && isPanning) {
      setIsPanning(false);
    }
  };

  const handleMouseLeave = () => {
    setDrawing(false);
    setIsPanning(false);
    if (canvasRef.current) {
      canvasRef.current.getContext('2d').beginPath();
    }
  };

  const resetPan = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  const handleImageUpload = (file) => {
    if (file) {
      setMainImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        const originalSize = { width: img.naturalWidth, height: img.naturalHeight };
        const fitted = calculateDisplaySize(originalSize.width, originalSize.height);
        setImageSize(originalSize);
        setDisplaySize(fitted);
        setPanOffset({ x: 0, y: 0 });
        clearCanvas();
        setOutputImage('');
      };
      img.src = url;
    }
  };

  const handleReferenceImageUpload = (file) => {
    if (file) {
      setReferenceImage(file);
      const url = URL.createObjectURL(file);
      setReferencePreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        const originalSize = { width: img.naturalWidth, height: img.naturalHeight };
        // Calculate display size for reference image with max height of 300px to fit better in the container
        const fitted = calculateDisplaySize(originalSize.width, originalSize.height, 400, 300);
        setReferenceImageSize(originalSize);
        setReferenceDisplaySize(fitted);
      };
      img.src = url;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#f9fafb] p-5 overflow-auto">
          <h1 className="text-[20px] font-semibold text-[#272727] font-gilroy mb-4">
            Add Accessories
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Panel */}
            <div className="space-y-5">
              <div className="bg-white rounded-[28px] border p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Main Image
                  </label>
                  {previewUrl && (
                    <button
                      onClick={deleteMainImage}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete main image"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {!previewUrl ? (
                  <div
                    onClick={() => document.getElementById('mainImageInput').click()}
                    className="w-full h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-[20px] cursor-pointer hover:bg-gray-50"
                  >
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-[#787878] text-[14px] font-medium text-center font-gilroy">
                      Click to upload
                      <br />
                      or choose from gallery
                    </p>
                  </div>
                ) : null}

                <input
                  type="file"
                  id="mainImageInput"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                />

                {previewUrl && (
                  <div className="relative mt-4 w-full h-[512px] mx-auto border border-gray-200 rounded-[22px] overflow-hidden bg-[#f3f3f3] flex items-center justify-center">
                    <div
                      ref={imageContainerRef}
                      className="relative overflow-hidden"
                      style={{
                        transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                        transformOrigin: 'center center',
                        width: `${displaySize.width}px`,
                        height: `${displaySize.height}px`,
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Editable"
                        className="absolute top-0 left-0 object-cover pointer-events-none"
                        style={{
                          width: `${displaySize.width}px`,
                          height: `${displaySize.height}px`,
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        width={displaySize.width}
                        height={displaySize.height}
                        className={`absolute top-0 left-0 z-10 ${drawMode ? 'cursor-crosshair' : 'cursor-move'}`}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        // Remove onMouseEnter and onMouseLeave
                      />
                    </div>

                    {/* Mode Toggle */}
                    <div className="absolute top-3 left-3 bg-black border border-[#ffffff28] rounded-lg flex items-center z-20">
                      <button
                        onClick={() => setDrawMode(true)}
                        className={`p-2 text-white rounded-l-lg ${drawMode ? 'bg-gray-600' : 'hover:bg-gray-800'}`}
                        title="Draw Mode"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <div className="w-px h-5 bg-[#a1a1a160]" />
                      <button
                        onClick={() => setDrawMode(false)}
                        className={`p-2 text-white rounded-r-lg ${!drawMode ? 'bg-gray-600' : 'hover:bg-gray-800'}`}
                        title="Pan Mode"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-3 right-3 bg-black border border-[#ffffff28] rounded-lg flex items-center z-20">
                      <Tooltip content="Zoom In">
                        <button
                          onClick={handleZoomIn}
                          className="p-2 text-white hover:bg-gray-800 rounded-l-lg"
                        >
                          <img
                            src="/object-removal/img_plus.svg"
                            alt="zoom in"
                            className="w-5 h-5"
                          />
                        </button>
                      </Tooltip>
                      <div className="w-px h-5 bg-[#a1a1a160]" />
                      <Tooltip content="Zoom Out">
                        <button
                          onClick={handleZoomOut}
                          className="p-2 text-white hover:bg-gray-800"
                        >
                          <img
                            src="/object-removal/img_minus.svg"
                            alt="zoom out"
                            className="w-5 h-5"
                          />
                        </button>
                      </Tooltip>
                      <div className="w-px h-5 bg-[#a1a1a160]" />
                      <Tooltip content="Reset Pan">
                        <button
                          onClick={resetPan}
                          className="p-2 text-white hover:bg-gray-800 rounded-r-lg"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                    </div>

                    {/* Image Info */}
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {imageSize.width} × {imageSize.height} | Zoom: {Math.round(zoomLevel * 100)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Brush Thickness Component - Show only when image is uploaded */}
              {previewUrl && (
                <div className="bg-gradient-to-b from-white to-[#efefef] border rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/object-removal/img_eraser.svg" alt="brush" className="w-4 h-4" />
                    <span className="text-sm font-medium text-black font-gilroy">
                      Brush Thickness
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white border rounded-lg px-4 py-2">
                      <span className="text-sm font-semibold text-black font-gilroy">
                        {brushThickness} px
                      </span>
                    </div>
                    <div className="flex-1">
                      <ProgressBar
                        value={brushThickness}
                        max={100}
                        color="blue"
                        size="medium"
                        onChange={(value) => setBrushThickness(value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="gradient"
                      onClick={clearCanvas}
                      className="w-full justify-center"
                    >
                      <img
                        src="/object-removal/img_refreshccw01.svg"
                        alt="refresh"
                        className="w-4 h-4"
                      />
                      Clear mask
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[28px] border p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Reference Image
                  </label>
                  {referencePreviewUrl && (
                    <button
                      onClick={deleteReferenceImage}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete reference image"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {!referencePreviewUrl ? (
                  <div
                    onClick={() => document.getElementById('referenceImageInput').click()}
                    className="w-full h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-[20px] cursor-pointer hover:bg-gray-50"
                  >
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-[#787878] text-[14px] font-medium text-center font-gilroy">
                      Click to upload
                      <br />
                      or choose from gallery
                    </p>
                  </div>
                ) : null}

                <input
                  type="file"
                  id="referenceImageInput"
                  accept="image/*"
                  onChange={(e) => handleReferenceImageUpload(e.target.files[0])}
                  className="hidden"
                />

                {referencePreviewUrl && (
                  <div className="relative mt-4 w-full h-[320px] border border-gray-200 rounded-[22px] overflow-hidden bg-[#f3f3f3] flex items-center justify-center">
                    <img
                      src={referencePreviewUrl}
                      alt="Reference"
                      className="object-contain"
                      style={{
                        width: `${referenceDisplaySize.width}px`,
                        height: `${referenceDisplaySize.height}px`,
                      }}
                    />

                    {/* Reference Image Info */}
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {referenceImageSize.width} × {referenceImageSize.height}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-6">
                  <Button
                    variant="gradient"
                    onClick={resetAll}
                    className="w-1/2 py-2 font-semibold"
                  >
                    Reset All
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    className="w-1/2 py-2 font-semibold"
                  >
                    Add Accessories
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full h-full bg-white rounded-[28px] border p-5">
              <div className="w-full h-[512px] flex justify-center items-center bg-[#f0f0f0] rounded-[20px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-10 w-10 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-600 font-medium">Processing...</p>
                  </div>
                ) : outputImage ? (
                  <img
                    src={outputImage}
                    alt="Final result"
                    className="w-full h-full object-contain rounded-[20px] cursor-pointer"
                    onDoubleClick={() => window.open(outputImage, '_blank')}
                  />
                ) : (
                  <p className="text-gray-400">Output image will appear here</p>
                )}
              </div>

              {outputImage && (
                <div className="mt-4">
                  <EditActionButtons outputImageUrl={outputImage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccessoriesPage;

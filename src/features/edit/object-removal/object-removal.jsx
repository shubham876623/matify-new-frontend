import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from '../../../components/ui/Button';
import ProgressBar from '../object-removal/ProgressBar';
import Tooltip from '../object-removal/Tooltip';
import api from '../../../api/axiosWithRefresh';
import EditActionButtons from '../../../components/ui/EditActionButtons';
import { useLocation } from 'react-router-dom';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';

const ObjectRemovalPage = () => {
  const location = useLocation();
  const inputImageFromNav = location.state?.inputImage || null;

  const [brushThickness, setBrushThickness] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [inputImage, setInputImage] = useState(null);
  const [outputImage, setOutputImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic image handling
  const [imageSize, setImageSize] = useState({ width: 512, height: 512 });
  const [displaySize, setDisplaySize] = useState({ width: 512, height: 512 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawMode, setDrawMode] = useState(true); // true = draw, false = pan

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
    setInputImage(null);
    setPreviewUrl(null);
    setImageSize({ width: 512, height: 512 });
    setDisplaySize({ width: 512, height: 512 });
    clearCanvas();
  };

  const resetPan = () => {
    setPanOffset({ x: 0, y: 0 });
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

  const handleRemoveObject = async () => {
    if (!previewUrl) return;
    setLoading(true);
    try {
      const maskBlob = await getMaskBlob();
      const formData = new FormData();
      if (inputImage) {
        formData.append('main_image', inputImage);
      } else {
        formData.append('image_url', previewUrl);
      }
      formData.append('mask_image', maskBlob, 'mask.png');
      const response = await api.post('/api/object-removal/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setOutputImage(response.data);
    } catch (err) {
      console.error('Object removal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const draw = (e) => {
    if (!drawing || !drawMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Calculate position relative to the display size and zoom
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    ctx.lineWidth = brushThickness / zoomLevel;
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
      draw(e);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (drawMode && drawing) {
      draw(e);
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

  const handleImageUpload = (file) => {
    if (file) {
      setInputImage(file);
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

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#f9fafb] px-6 py-5 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#272727] font-gilroy mb-1">
              Object Removal
            </h1>
            <p className="text-base text-[#787878] font-gilroy">
              Select and erase anything you don't want in your photo.
            </p>
          </div>

          <div className="flex gap-6 h-full">
            {/* LEFT PANEL */}
            <div className="bg-white border rounded-[28px] p-5 flex flex-col w-1/2">
              <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center justify-between px-4 mb-4">
                <span className="text-base font-medium text-[#272727] font-gilroy">
                  Upload Image
                </span>
                <button
                  className="bg-white/80 rounded-full p-2 hover:bg-white transition"
                  onClick={() => {
                    setInputImage(null);
                    setPreviewUrl(null);
                    setOutputImage('');
                    setImageSize({ width: 512, height: 512 });
                    setDisplaySize({ width: 512, height: 512 });
                    setPanOffset({ x: 0, y: 0 });
                    clearCanvas();
                  }}
                >
                  <FiTrash2 className="w-5 h-5 text-[#FF5C5C]" />
                </button>
              </div>

              {!previewUrl && (
                <div className="relative border-2 border-dashed border-[#D9D9D9] rounded-[22px] flex flex-col justify-center items-center p-10 mb-4 h-[250px] bg-white">
                  <FiUploadCloud className="w-8 h-8 mb-2 text-[#A3A3A3]" />
                  <p className="text-[14px] text-[#787878] text-center font-gilroy leading-[20px]">
                    Click to upload
                    <br />
                    or choose from gallery
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </div>
              )}

              {previewUrl && (
                <>
                  <div className="relative mb-6 overflow-hidden rounded-[22px] border w-full flex justify-center">
                    <div className="relative w-full h-[512px] bg-[#f3f3f3] flex items-center justify-center">
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
                          onMouseLeave={handleMouseLeave}
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
                            <path d="M10 2L3 9l7 7 7-7-7-7zM10 4.414L14.586 9 10 13.586 5.414 9 10 4.414z" />
                          </svg>
                        </button>
                      </div>

                      {/* Zoom Controls */}
                      <div className="absolute top-3 right-3 z-40 flex flex-col gap-2 items-end">
                        <div className="bg-black border border-[#ffffff28] rounded-lg flex items-center">
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
                          <div className="w-px h-5 bg-[#a1a1a160]"></div>
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
                          <div className="w-px h-5 bg-[#a1a1a160]"></div>
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
                      </div>

                      {/* Image Info */}
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {imageSize.width} × {imageSize.height} | Zoom: {Math.round(zoomLevel * 100)}
                        %
                      </div>

                      {loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-30 rounded-[22px]">
                          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brush Control & Buttons */}
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

                  <div className="flex gap-4">
                    <Button variant="gradient" onClick={resetAll} className="flex-1">
                      <img
                        src="/object-removal/img_refreshccw01.svg"
                        alt="reset"
                        className="w-5 h-5"
                      />
                      Reset All
                    </Button>
                    <Button variant="primary" onClick={handleRemoveObject} className="flex-1">
                      <img src="/object-removal/img_label_1.png" alt="remove" className="w-7 h-6" />
                      Remove Object
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-white border rounded-[28px] p-5 flex flex-col w-1/2">
              <div className="bg-[#2727270a] rounded-[22px] h-[45px] flex items-center px-4 mb-4">
                <span className="text-base font-medium text-[#272727] font-gilroy">
                  Final Result
                </span>
              </div>
              {loading ? (
                <div className="flex-1 rounded-[1.25rem] bg-white flex items-center justify-center">
                  <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                </div>
              ) : outputImage ? (
                <>
                  <img
                    src={outputImage}
                    alt="Final result"
                    className="w-full h-full object-cover rounded-[1.25rem] cursor-pointer"
                    onDoubleClick={() => window.open(outputImage, '_blank')}
                  />
                  <EditActionButtons outputImageUrl={outputImage} />
                </>
              ) : (
                <div className="flex-1 rounded-[1.25rem] bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm">
                  Nothing generated yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectRemovalPage;

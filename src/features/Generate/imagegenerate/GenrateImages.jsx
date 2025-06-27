import React, { useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import Button from '../imagegenerate/ui/Button';
import Dropdown from '../imagegenerate/ui/Dropdown';
import Textarea from '../imagegenerate/ui/Textarea';
import { useLocation } from 'react-router-dom';
import api from '../../../api/axiosWithRefresh';
import { toast } from 'react-toastify';

const GenerateImage = () => {
  const location = useLocation();
  const { modelName, modelVersion } = location.state || {};

  const [selectedFormat, setSelectedFormat] = useState('JPEG');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const formatOptions = [
    { value: 'JPEG', label: 'JPEG' },
    { value: 'PNG', label: 'PNG' },
    { value: 'WEBP', label: 'WEBP' }
  ];

  const aspectRatios = [
    { id: '1:1', label: '1 : 1' },
    { id: '4:5', label: '4 : 5' },
    { id: '16:9', label: '16 : 9' }
  ];

  const handleAspectRatioSelect = (ratioId) => {
    setSelectedRatio(ratioId);
  };

  const handleGenerate = async () => {
    if (!modelName || !modelVersion || !prompt) {
      toast.error('Missing required inputs.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const creditRes = await api.get('/api/credits/');
      const credits = creditRes.data.credits_remaining;

      if (credits < 2) {
        toast.error('Not enough credits. Please purchase more to generate an image.');
        setLoading(false);
        return;
      }

      const response = await api.post('/api/predict/', {
        version: modelVersion,
        input: {
          prompt: `${modelName} ${prompt}`,
          aspect_ratio: selectedRatio,
          format: selectedFormat.toLowerCase()
        }
      });

      const data = response.data;
      const imageUrl = data.output?.[0] || '';
      setOutput(imageUrl);

      if (imageUrl) {
        await api.post('/api/dedctcredit/', { amount: 2 });
        await api.post('/api/generated-images/', { image_url: imageUrl });
        toast.success('Image generated successfully.');
      } else {
        toast.error('Failed to generate image.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard!');
  };

  const handleRefresh = () => {
    setPrompt('');
  };

  const editingTools = [
    { icon: '/Genratepageimages/img_label_1.png', text: 'Obj Removal' },
    { icon: '/Genratepageimages/img_label_2.png', text: 'Add Accessories' },
    { icon: '/Genratepageimages/img_label_3.png', text: 'Outfit Swap' },
    { icon: '/Genratepageimages/img_label_4.png', text: 'Bg Replace' },
    { icon: '/Genratepageimages/img_label_5.png', text: 'Upscale' },
    { icon: '/Genratepageimages/img_label_6.png', text: 'Color Correction' }
  ];

  const galleryActions = [
    { icon: '/Genratepageimages/img_label_7.png', text: 'Added to Gallery' },
    { icon: '/Genratepageimages/img_.png', text: 'Delete Image' }
  ];

  const handleToolClick = (toolName) => {
    toast.info(`${toolName} `);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#f9fafb] p-5 flex gap-5">
          {/* LEFT */}
          <div className="w-[554px] flex flex-col gap-5">
            <div>
              <h1 className="text-[20px] font-semibold text-[#272727] mb-2">
                Generate Your Image
              </h1>
              <p className="text-[15px] font-medium text-[#787878]">
                Describe what you want, and we’ll generate it for you.
              </p>
            </div>

            <div className="bg-white border border-[#0000000a] rounded-[28px] p-5 shadow-[0_8px_48px_rgba(0,0,0,0.04)]">
              {/* Model name + Format */}
              <div className="flex gap-4 mb-4">
                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 text-[#272727] flex-1">
                  <img src="/Genratepageimages/img_usersquare.svg" alt="user" className="w-4 h-4 mr-2" />
                  <span>{modelName || 'Model not selected'}</span>
                </div>

                <Dropdown
                  options={formatOptions}
                  value={selectedFormat}
                  onChange={(option) => setSelectedFormat(option.value)}
                  icon="/Genratepageimages/img_image01.svg"
                  className="flex-1"
                />
              </div>

              {/* Aspect Ratio */}
              <div className="bg-[#f8f8f8] rounded-lg p-3 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/Genratepageimages/img_perspective02.svg" alt="aspect" className="w-4 h-4" />
                  <span className="text-[14px] font-medium text-[#272727]">Select Aspect Ratio</span>
                </div>
                <div className="flex gap-4">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => handleAspectRatioSelect(ratio.id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${
                        selectedRatio === ratio.id
                          ? 'bg-white border-[#279af1]'
                          : 'bg-white border-[#00000014]'
                      }`}
                    >
                      <div className="w-7 h-7">
                        {selectedRatio === ratio.id ? (
                          <div className="w-7 h-7 bg-[#279af147] rounded-md"></div>
                        ) : (
                          <img
                            src={ratio.id === '4:5' ? '/Genratepageimages/img_frame_1984078750.svg' : '/Genratepageimages/img_frame_1984078749.svg'}
                            alt={ratio.id}
                            className="w-7 h-7"
                          />
                        )}
                      </div>
                      <span className="text-[14px] font-medium text-[#272727]">
                        {ratio.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="relative">
                <Textarea
                value={`${modelName} ${prompt}`}
                onChange={(e) => {
                  const input = e.target.value;
                  const prefix = `${modelName} `;
                  if (input.startsWith(prefix)) {
                    // Save only the text after the model name
                    setPrompt(input.slice(prefix.length));
                  } else {
                    // Prevent editing/removing model name
                    setPrompt(prompt);
                  }
                }}
                  
                  placeholder="Describe your imagination..."
                  rows={6}
                  className="mb-4"
                />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="custom" onClick={handleCopy} className="w-10 h-10 p-0">
                      <img src="/Genratepageimages/img_copy03.svg" alt="copy" className="w-5 h-5" />
                    </Button>
                    <div className="w-px h-5 bg-[#a1a1a160]"></div>
                    <Button variant="outline" size="custom" onClick={handleRefresh} className="w-10 h-10 p-0">
                      <img src="/Genratepageimages/img_refreshccw01.svg" alt="refresh" className="w-5 h-5" />
                    </Button>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    className="h-10 px-4 rounded-[10px]"
                    disabled={loading}
                  >
                    {loading ? '⏳ Generating...' : '✨ Generate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-white border border-[#0000000a] rounded-[28px] p-2.5 h-[554px]">
              <div className="bg-[#2727270a] rounded-[22px] p-4 mb-4">
                <h3 className="text-[18px] font-medium text-[#272727]">Image Preview</h3>
              </div>
              <div className="h-[475px] rounded-[20px] overflow-hidden flex justify-center items-center">
                {loading ? (
                  <p className="text-gray-400 text-sm">Generating...</p>
                ) : output ? (
                  <img
                    src={output}
                    alt="Generated output"
                    className="w-full h-full object-cover cursor-pointer"
                    onDoubleClick={() => window.open(output, '_blank')}
                  />
                ) : (
                  <div className="text-center text-gray-400 text-sm">
                    <img src="/Genratepageimages/img_content.png" alt="Nothing generated" className="mx-auto mb-2 w-12 h-12" />
                    Nothing generated yet
                  </div>
                )}
              </div>
            </div>

            {/* Editing Tools */}
            <div className="bg-[#f0f0f0] rounded-2xl p-2.5 h-[110px]">
              <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                {editingTools.map((tool, index) => (
                  <Button key={index} variant="outline" onClick={() => handleToolClick(tool.text)} className="h-10 justify-start gap-3 px-4">
                    <img src={tool.icon} alt={tool.text} className="w-4 h-4" />
                    <span className="text-[16px] font-medium text-black">{tool.text}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Gallery Actions */}
            <div className="bg-[#f0f0f0] rounded-2xl p-2.5 h-[60px]">
              <div className="grid grid-cols-2 gap-2.5">
                {galleryActions.map((action, index) => (
                  <Button key={index} variant="outline" onClick={() => handleToolClick(action.text)} className="h-10 justify-center gap-3 px-4">
                    <img src={action.icon} alt={action.text} className="w-4 h-4" />
                    <span className="text-[16px] font-medium text-black">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImage;

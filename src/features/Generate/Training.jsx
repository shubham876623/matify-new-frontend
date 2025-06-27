import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import FileUpload from '../../components/ui/FileUpload';
import Dropdown from '../../components/ui/Dropdown';
import api from '../../api/axiosWithRefresh';
import { toast } from 'react-toastify';

const Training = () => {
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [triggerWord, setTriggerWord] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const aiModels = [
    {
      id: 1,
      name: 'Cameron Williamson',
      status: 'Ready',
      createdAt: '1 day ago',
      image: '/images/model1.svg'
    },
    {
      id: 2,
      name: 'Leslie Alexander',
      status: 'Ready',
      createdAt: '1 day ago',
      image: '/images/model2.svg'
    },
    {
      id: 3,
      name: 'Jerome Bell',
      status: 'Ready',
      createdAt: '1 day ago',
      image: '/images/model3.svg'
    },
    {
      id: 4,
      name: 'Ralph Edwards',
      status: 'Ready',
      createdAt: '1 day ago',
      image: '/images/model4.svg'
    },
    {
      id: 5,
      name: 'Bessie Cooper',
      status: 'Training',
      createdAt: '1 day ago',
      image: '/images/model5.svg'
    },
    {
      id: 6,
      name: 'Wade Warren',
      status: 'Training',
      createdAt: '1 day ago',
      image: '/images/model6.svg'
    }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date Created' },
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' }
  ];

  const handleTrainModel = async () => {
    if (!selectedFile || !triggerWord.trim()) {
      toast.error('Please select a .zip file and enter a trigger word');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Check available credits
      const creditRes = await api.get('/api/credits/');
      const credits = creditRes.data.credits_remaining;

      if (credits < 5) {
        toast.error('Not enough credits. Please purchase more to train a model.');
        setLoading(false);
        return;
      }

      // Step 2: Send training request
      const formData = new FormData();
      formData.append('zip_file', selectedFile);
      formData.append('trigger_word', triggerWord);

      const trainRes = await api.post('/api/train/', formData);

      if (trainRes.status === 200 || trainRes.status === 201) {
        await api.post('/api/dedctcredit/', { amount: 5 });
        toast.success(`Training started: ${trainRes.data.status || 'success'}`);
        setIsTrainModalOpen(false);
        setTriggerWord('');
        setSelectedFile(null);
      } else {
        toast.error(trainRes.data.error || 'Training failed. Please try again.');
      }

    } catch (err) {
      console.error(err);
      toast.error('An error occurred while starting training.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleGenerate = (modelName) => {
    alert(`Generating content with ${modelName} model`);
  };

  const filteredModels = aiModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Generating AI Models</h1>
              <p className="text-gray-600">Manage your trained models and start generating with a click.</p>
            </div>
            <Button
              onClick={() => setIsTrainModalOpen(true)}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              <span className="mr-2">+</span>
              Train My AI
            </Button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-[#f5f6f6] w-[300px]"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={(option) => setSortBy(option.value)}
                className="w-40"
              />
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              // <div key={model.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              //   <div className="aspect-square bg-gray-100 relative">
              //     <div className="absolute top-3 left-3">
              //       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              //         model.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              //       }`}>
              //         <div className={`w-2 h-2 rounded-full mr-1 ${
              //           model.status === 'Ready' ? 'bg-green-400' : 'bg-yellow-400'
              //         }`}></div>
              //         {model.status}
              //       </span>
              //     </div>
              //     <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              //       <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              //     </div>
              //   </div>

              //   <div className="p-4">
              //     <h3 className="font-medium text-gray-900 mb-1">{model.name}</h3>
              //     <p className="text-sm text-gray-500 mb-3">{model.createdAt}</p>

              //     {model.status === 'Ready' ? (
              //       <Button
              //         onClick={() => handleGenerate(model.name)}
              //         variant="ghost"
              //         className="w-full text-gray-600 hover:text-gray-900"
              //       >
              //         <span className="mr-2">+</span>
              //         Generate
              //       </Button>
              //     ) : (
              //       <div className="w-full py-2 text-center text-sm text-gray-500">
              //         Training in progress...
              //       </div>
              //     )}
              //   </div>
              // </div>
              <div key={model.id} className="bg-white border border-[#272727] rounded-[10px] w-full h-full flex flex-col justify-between p-3 gap-2">
                <div className='flex justify-between items-start'>
                  <div className='flex flex-col items-start'>
                    <h3 className="font-semibold text-gray-900 text-lg">{model.name}</h3>
                    <p className="text-sm text-[#a1a1a1] mt-0">{model.createdAt}</p>
                  </div>
                  <div className='flex items-center justify-center'>
                    <div className={`w-3 h-3 mr-2 ${model.status === 'Ready' ? 'bg-green-600': 'bg-yellow-400'} rounded-full`}></div>
                    <div className={`${model.status === 'Ready' ? 'text-[#272727]': 'text-yellow-800'} text-semibold`}>{model.status}</div>
                  </div>
                </div>
                <div className='flex-1'>
                  <img src={model.image} alt={model.name} className="w-full object-cover rounded-t-lg" />
                </div>
                <div className=''>
                  {model.status === 'Ready' ? (
                    <Button
                      onClick={() => handleGenerate(model.name)}
                      variant="ghost"
                      className="w-full text-gray-600 hover:text-gray-900 border bg-[linear-gradient(to_top,#ededed,#ffffff)]"
                    >
                      <img src='/images/genicon.svg' alt='icon' className='mr-2'/>
                      Generate
                    </Button>
                    ) : (
                      <div className="w-full py-2 text-center text-sm text-gray-500 border rounded bg-[linear-gradient(to_top,#ededed,#ffffff)]">
                        Training in progress...
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Train New AI Model Modal */}
      <Modal
        isOpen={isTrainModalOpen}
        onClose={() => setIsTrainModalOpen(false)}
        title="Train a New AI Model"
      >
        <div className="space-y-6">
          <FileUpload
            label="Upload Training Images (.zip)*"
            accept=".zip"
            onFileSelect={handleFileSelect}
            description="Select a ZIP file (with 10+ clear images)"
          />

          <InputField
            label="Trigger Word*"
            placeholder="e.g. hellomrsheel/an"
            value={triggerWord}
            onChange={(e) => setTriggerWord(e.target.value)}
            required
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsTrainModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTrainModel}
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? 'Creating...' : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Create AI Model
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Training;

import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import Dropdown from '../../components/ui/Dropdown';
import Card from '../../components/ui/Card';
import FileUpload from '../../components/ui/FileUpload';
import Modal from '../../components/common/Modal';
import api from '../../api/axiosWithRefresh';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TrainedModels = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [sortValue, setSortValue] = useState('Date Created');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [triggerWord, setTriggerWord] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await api.get('/api/trainings/');
        setModels(response.data || []);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const handleGenerate = (model) => {
    navigate('/generate', {
      state: {
        modelName: model.trigger_word,
        modelVersion: model.version_id
      }
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTrainAI = () => {
    setIsTrainModalOpen(true);
  };

  const handleTrainModel = async () => {
    if (!selectedFile || !triggerWord.trim()) {
      toast.error('Please upload a ZIP file and enter a trigger word.');
      return;
    }

    setIsSubmitting(true);

    try {
      const creditRes = await api.get('/api/credits/');
      if (creditRes.data.credits_remaining < 5) {
        toast.error('Not enough credits to train.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('zip_file', selectedFile);
      formData.append('trigger_word', triggerWord);

      const trainRes = await api.post('/api/train/', formData);
      if (trainRes.status === 200 || trainRes.status === 201) {
        toast.success('Training started!');
        await api.post('/api/dedctcredit/', { amount: 5 });
        setIsTrainModalOpen(false);
        setTriggerWord('');
        setSelectedFile(null);
      } else {
        toast.error(trainRes.data.error || 'Training failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Training failed due to server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredModels = models
    .filter((model) =>
      model.trigger_word.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((model) => {
      if (filterValue === 'All') return true;
      return model.status?.toLowerCase() === filterValue.toLowerCase();
    })
    .sort((a, b) => {
      if (sortValue === 'Date Created') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortValue === 'Name') {
        return a.trigger_word.localeCompare(b.trigger_word);
      }
      if (sortValue === 'Status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-5 overflow-y-auto">
          {/* Top Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[1.25rem] font-semibold leading-[1.5rem] text-[#272727] font-gilroy">
                Generating AI Models
              </h1>
              <p className="text-[1rem] font-medium leading-[1.2rem] text-[#787878] font-gilroy mt-1 mb-1">
                Manage your trained models and start generating with a click.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleTrainAI}
              icon="/images/img_circleplussolid_1.svg"
              className="min-h-10"
            >
              Train My AI
            </Button>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1 max-w-[300px]">
              <InputField
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearch}
                icon="/images/img_searchmd.svg"
                className="bg-[#f5f6f6]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Dropdown
                options={['All', 'succeeded', 'processing', 'canceled']}
                value={filterValue}
                onChange={setFilterValue}
                icon="/images/img_cryptocurrency02.svg"
                hideArrows
              />
              <Dropdown
                options={['Date Created', 'Name', 'Status']}
                value={`Sort: ${sortValue}`}
                onChange={(val) => setSortValue(val.replace('Sort: ', ''))}
                icon="/images/img_switchvertical01.svg"
                hideArrows
              />
            </div>
          </div>

          {/* Models Grid */}
          {loading ? (
            <p className="text-center text-gray-500">Loading models...</p>
          ) : filteredModels.length === 0 ? (
            <p className="text-center text-gray-500">No models found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredModels.map((model) => (
                <Card
                  key={model.training_id}
                  title={model.trigger_word || 'Unnamed Model'}
                  subtitle={new Date(model.created_at).toLocaleDateString()}
                  image="/images/img_image.png"
                  status={model.status === 'succeeded' ? 'Ready' : model.status}
                  onGenerate={() => handleGenerate(model)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Train Modal */}
      <Modal
        isOpen={isTrainModalOpen}
        onClose={() => setIsTrainModalOpen(false)}
        title="Train a New AI Model"
      >
        <div className="space-y-6">
          <FileUpload
            label="Upload Training Images (.zip)*"
            accept=".zip"
            onFileSelect={(file) => setSelectedFile(file)}
            description="Select a ZIP file with 10+ clear images"
          />
          <InputField
            label="Trigger Word*"
            placeholder="e.g. hellomrsheel/an"
            value={triggerWord}
            onChange={(e) => setTriggerWord(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsTrainModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleTrainModel}
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create AI Model'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrainedModels;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '../components/common/Header';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import api from '../api/axiosWithRefresh';
import Layout from './Layout';
import FeatureCards from '@/components/common/FeatureCards';
import MatifyForm from '@/components/common/MatifyForm';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/users/', formData);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        const message = Object.keys(data)
          .map((key) => `${key}: ${data[key]}`)
          .join('\n');
        setError(message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <FeatureCards />
      {/* Right Side - Empty for now */}
      <MatifyForm>
        <div className="text-center mb-6">
            <h1 className="text-[1.6rem] font-semibold leading-[2rem] text-[#272727] mb-2 font-gilroy">
              Sign Up to Matify Studio
            </h1>
            <p className="text-[1rem] font-medium leading-[1rem] text-[#787878] font-gilroy">
              You are just one step away from stunning image edits and smart AI generation
            </p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded mb-4 whitespace-pre-line">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSignUp}>
            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              icon="/signupimages/img_.png"
              required
            />

            <InputField
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleInputChange('username')}
              icon="/signupimages/img__28x20.png"
              required
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              icon="/signupimages/img__1.png"
              showPasswordToggle
              required
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={formData.re_password}
              onChange={handleInputChange('re_password')}
              icon="/signupimages/img__1.png"
              showPasswordToggle
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-[1rem] font-semibold leading-[1.2rem] font-gilroy"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
          <div className="text-center mt-8">
            <span className="text-[1rem] font-medium leading-[1.2rem] text-[#787878] font-gilroy">
              Already have an account?{' '}
            </span>
            <button
              onClick={() => navigate('/login')}
              className="text-[1rem] font-semibold leading-[1.2rem] text-[#272727] underline font-gilroy hover:text-[#1a1a1a] transition-colors"
            >
              Sign In
            </button>
          </div>
      </MatifyForm>
    </Layout>
  );
};

export default SignUpPage;

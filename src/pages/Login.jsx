import React, { useState } from 'react';
// import Header from '../components/common/Header';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import { useNavigate, useLocation } from "react-router-dom";
import api from '../api/axiosWithRefresh';
import { CiLock } from "react-icons/ci";
import Layout from './Layout';
import FeatureCards from '@/components/common/FeatureCards';
import MatifyForm from '@/components/common/MatifyForm';




// import { useAuth } from "../context/AuthContext";
const SignInPage = () => {
    // const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/jwt/create/', { email, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      const userRes = await api.get('/api/auth/users/me/');
      localStorage.setItem('username', userRes.data.username);
      // login(res.data.access, res.data.refresh);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      {/* Left Panel */}
      <FeatureCards />
      <MatifyForm>
        <div className="text-center mb-8">
            <h1 className="text-[1.6rem] font-semibold leading-[2rem] text-[#272727] font-gilroy mb-2">
              Sign In to Matify Studio
            </h1>
            <p className="text-[1rem] font-medium leading-[1rem] text-[#787878] font-gilroy">
              Sign in to access your AI studio, manage your models, and explore your creative dashboard.
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="/signinimages/img_.png"
              placeholder="Enter your email"
            />

            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="/signinimages/img__28x20.png"
              rightIcon="/signinimages/img__1.png"
              onRightIconClick={togglePasswordVisibility}
              placeholder="Enter your password"
            />

            <Button
              variant="primary"
              onClick={handleSignIn}
              className={`w-full rounded-lg text-[1rem] font-semibold leading-[1.2rem] font-gilroy ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center mt-6">
              <span className="text-[1rem] font-medium leading-[1.2rem] text-[#787878] font-gilroy">
                Do not have an account?{' '}
              </span>
              <button
                onClick={handleSignUp}
                className="text-[1rem] font-semibold leading-[1.2rem] text-[#272727] font-gilroy underline hover:no-underline transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
      </MatifyForm>
    </Layout>
  );
};

export default SignInPage;

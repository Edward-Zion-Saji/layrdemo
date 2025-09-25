'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Shield, User, Lock, ArrowLeft, ExternalLink } from 'lucide-react';
import { simulateProcessingDelay } from '@/lib/utils';

const InsurancePortalLogin: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to insurance portal
      await simulateProcessingDelay(2000);

      // For demo purposes, accept any username/password combination
      if (formData.username && formData.password) {
        // Simulate successful login to insurance portal
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'twofa' });
      } else {
        setError('Please enter both username and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInsuranceLogo = (carrier: string) => {
    const logos: { [key: string]: string } = {
      'Anthem BCBS': '🛡️',
      'UnitedHealthcare': '🏥',
      'Aetna': '💊',
      'Cigna': '🏛️',
      'Blue Cross Blue Shield': '🔵',
    };
    return logos[carrier] || '🏥';
  };

  const getInsuranceColors = (carrier: string) => {
    const colors: { [key: string]: { primary: string; secondary: string; accent: string } } = {
      'Anthem BCBS': { primary: 'bg-blue-600', secondary: 'bg-blue-50', accent: 'text-blue-600' },
      'UnitedHealthcare': { primary: 'bg-green-600', secondary: 'bg-green-50', accent: 'text-green-600' },
      'Aetna': { primary: 'bg-red-600', secondary: 'bg-red-50', accent: 'text-red-600' },
      'Cigna': { primary: 'bg-orange-600', secondary: 'bg-orange-50', accent: 'text-orange-600' },
      'Blue Cross Blue Shield': { primary: 'bg-blue-700', secondary: 'bg-blue-50', accent: 'text-blue-700' },
    };
    return colors[carrier] || { primary: 'bg-gray-600', secondary: 'bg-gray-50', accent: 'text-gray-600' };
  };

  const colors = getInsuranceColors(state.currentPatient?.insurance.carrier || '');

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Insurance Branding Header */}
      <div className={`${colors.secondary} rounded-lg p-6 mb-8`}>
        <div className="flex items-center justify-center mb-4">
          <div className="text-4xl mr-3">{getInsuranceLogo(state.currentPatient?.insurance.carrier || '')}</div>
          <div>
            <h2 className={`text-xl font-bold ${colors.accent}`}>
              {state.currentPatient?.insurance.carrier}
            </h2>
            <p className="text-sm text-gray-600">
              Member Portal Login
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-700">
            Plan: {state.currentPatient?.insurance.plan_type}
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Member ID: {state.currentPatient?.insurance.member_id}
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username or Member ID
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username or member ID"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${colors.primary} text-white py-3 px-4 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In to Insurance Portal'
          )}
        </button>
      </form>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'consent' })}
          className="flex items-center justify-center mx-auto text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Consent
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Secure Login
          </div>
          <div className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            Official Portal
          </div>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">
          You are being redirected to your insurance provider's official member portal
        </p>
      </div>
    </div>
  );
};

export default InsurancePortalLogin;

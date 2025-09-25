'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Shield, Smartphone, Mail, MessageSquare, Check, ArrowRight } from 'lucide-react';
import { simulateProcessingDelay } from '@/lib/utils';

const TwoFactorAuth: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const insuranceCarrier = state.currentPatient?.insurance.carrier || 'Your Insurance';

  const twoFactorMethods = [
    {
      id: 'sms',
      name: 'SMS Text Message',
      description: 'Send verification code to your registered phone number',
      icon: MessageSquare,
      details: 'Code sent to ••••-••••-4567',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'email',
      name: 'Email Verification',
      description: 'Send verification code to your registered email address',
      icon: Mail,
      details: 'Code sent to s••••@email.com',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'authenticator',
      name: 'Authenticator App',
      description: 'Use your authenticator app (Google Authenticator, Authy, etc.)',
      icon: Smartphone,
      details: 'Open your authenticator app',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'push',
      name: 'Push Notification',
      description: 'Approve login via push notification on your mobile device',
      icon: Shield,
      details: 'Notification sent to your mobile app',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  const handleMethodSelect = async (methodId: string) => {
    setSelectedMethod(methodId);
    setIsLoading(true);

    try {
      await simulateProcessingDelay(1500); // Simulate sending verification
      setShowCodeInput(true);
    } catch (err) {
      console.error('Error sending verification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await simulateProcessingDelay(1000); // Simulate verification
      
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'processing' });
      } else {
        alert('Please enter a valid 6-digit verification code');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCarrierBranding = (carrierName: string) => {
    switch (carrierName) {
      case 'Anthem Blue Cross Blue Shield':
        return { logo: '/anthem-bcbs-logo.png', bgColor: 'bg-blue-700', textColor: 'text-blue-700' };
      case 'UnitedHealthcare':
        return { logo: '/unitedhealth-logo.png', bgColor: 'bg-green-700', textColor: 'text-green-700' };
      case 'Aetna':
        return { logo: '/aetna-logo.png', bgColor: 'bg-red-700', textColor: 'text-red-700' };
      case 'Cigna':
        return { logo: '/cigna-logo.png', bgColor: 'bg-orange-700', textColor: 'text-orange-700' };
      default:
        return { logo: '/default-insurance-logo.png', bgColor: 'bg-gray-700', textColor: 'text-gray-700' };
    }
  };

  const branding = getCarrierBranding(insuranceCarrier);

  if (showCodeInput) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
        <div className="text-center mb-8">
          <div className={`flex justify-center mb-4 ${branding.bgColor} p-4 rounded-lg`}>
            {branding.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo} alt={`${insuranceCarrier} Logo`} className="h-12 object-contain" />
            )}
            {!branding.logo && <Shield className="h-12 w-12 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Verification Code
          </h2>
          <p className="text-gray-600">
            We've sent a verification code to your selected method
          </p>
        </div>

        <form onSubmit={handleCodeSubmit} className="space-y-6">
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="block w-full px-3 py-3 text-center text-2xl font-mono border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="000000"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter the 6-digit code you received
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${branding.bgColor} hover:${branding.bgColor.replace('700', '800')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Check className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowCodeInput(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to 2FA methods
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This is a simulated 2FA verification for demonstration purposes.</p>
          <p>Enter any 6-digit code to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`${branding.bgColor} p-3 rounded-full`}>
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600">
          {insuranceCarrier} requires additional verification to secure your account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {twoFactorMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? `${method.borderColor} ${method.bgColor} shadow-lg`
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {selectedMethod === method.id && (
                <div className="absolute top-4 right-4">
                  <div className={`${method.color.replace('text-', 'bg-').replace('-600', '-600')} text-white rounded-full p-1`}>
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`${method.bgColor} p-3 rounded-lg`}>
                  <IconComponent className={`h-6 w-6 ${method.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${method.color} mb-2`}>
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {method.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.details}
                  </p>
                </div>
              </div>

              {selectedMethod === method.id && (
                <div className="mt-4 flex items-center justify-center text-blue-600">
                  <span className="text-sm font-medium mr-2">Selected</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Sending verification code...</span>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Having trouble with 2FA?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;

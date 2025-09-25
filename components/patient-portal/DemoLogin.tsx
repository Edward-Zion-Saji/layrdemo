'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { LogIn, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { simulateProcessingDelay } from '@/lib/utils';

const DemoLogin: React.FC = () => {
  const { dispatch } = useDemo();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Demo user accounts
  const demoUsers = [
    {
      email: 'hypertension.demo@layr.com',
      password: 'hypertension123',
      name: 'John Smith',
      condition: 'Hypertension Management',
      description: 'Focus on blood pressure control, cholesterol management, and diabetes care'
    },
    {
      email: 'ankle.fracture@layr.com',
      password: 'ankle456',
      name: 'Maria Garcia',
      condition: 'Ankle Fracture Recovery',
      description: 'Focus on fracture healing, bone health, and physical therapy'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await simulateProcessingDelay(1500);

      // Check if credentials match demo users
      const user = demoUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Create patient data based on user
        const patientData = user.email === 'hypertension.demo@insurfetch.com' 
          ? {
              id: 'P011',
              name: 'John Smith',
              email: 'hypertension.demo@insurfetch.com',
              dob: '1970-05-15',
              phone: '(555) 111-2222',
              address: {
                street: '456 Hypertension Lane',
                city: 'Boston',
                state: 'MA',
                zip: '02101',
              },
              insurance: {
                carrier: 'Anthem Blue Cross Blue Shield',
                member_id: 'ABC111222333',
                group_number: 'GRP011',
                plan_type: 'PPO Gold',
                effective_date: '2024-01-01',
                expiration_date: '2024-12-31',
              },
              consent: {
                data_sharing: true,
                insurance_access: true,
                prescription_verification: true,
                consent_date: '2024-03-01',
              },
              medical_conditions: ['Hypertension', 'Hyperlipidemia', 'Obesity', 'Family history of heart disease'],
              current_medications: ['Lisinopril', 'Atorvastatin', 'Metformin'],
              fracture_risk: 'Low',
              primary_condition: 'Hypertension Management',
              blood_pressure: '145/92',
              last_a1c: '7.2',
              cholesterol_total: '220'
            }
          : {
              id: 'P012',
              name: 'Maria Garcia',
              email: 'ankle.fracture@insurfetch.com',
              dob: '1985-08-22',
              phone: '(555) 333-4444',
              address: {
                street: '789 Fracture Street',
                city: 'Boston',
                state: 'MA',
                zip: '02108',
              },
              insurance: {
                carrier: 'UnitedHealthcare',
                member_id: 'UHC444555666',
                group_number: 'GRP012',
                plan_type: 'HMO Silver',
                effective_date: '2024-01-01',
                expiration_date: '2024-12-31',
              },
              consent: {
                data_sharing: true,
                insurance_access: true,
                prescription_verification: true,
                consent_date: '2024-03-05',
              },
              medical_conditions: ['Ankle fracture', 'Osteopenia', 'Previous sports injury', 'Moderate fracture risk'],
              current_medications: ['Calcium Carbonate', 'Vitamin D3', 'Ibuprofen'],
              fracture_risk: 'Moderate',
              primary_condition: 'Ankle Fracture Recovery',
              recent_injury: 'Right ankle fracture (2024-03-10)',
              surgery_required: false,
              cast_removal_date: '2024-04-15',
              bone_density_t_score: -1.5
            };

        dispatch({ type: 'SET_PATIENT', payload: patientData });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'consent' });
      } else {
        setError('Invalid email or password. Please use one of the demo accounts below.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Demo Login
        </h2>
        <p className="text-gray-600">
          Choose a demo account to experience the insurance integration platform
        </p>
      </div>

      {/* Demo Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {demoUsers.map((user, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{user.condition}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{user.description}</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Lock className="h-3 w-3 mr-2" />
                <span>Email: {user.email}</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-3 w-3 mr-2" />
                <span>Password: {user.password}</span>
              </div>
            </div>
            <button
              onClick={() => handleDemoLogin(user.email, user.password)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Use This Account
            </button>
          </div>
        ))}
      </div>

      {/* Login Form */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Or Login Manually</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          This is a demo application. Use the provided accounts above to explore the platform.
        </p>
      </div>
    </div>
  );
};

export default DemoLogin;

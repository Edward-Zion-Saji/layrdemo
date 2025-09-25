'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Shield, Check, ArrowRight, Upload, LogIn, FileText, Download } from 'lucide-react';
import { simulateProcessingDelay } from '@/lib/utils';

const InsuranceSelector: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [selectedPath, setSelectedPath] = useState<'upload' | 'login' | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const insuranceOptions = [
    {
      id: 'anthem',
      name: 'Anthem Blue Cross Blue Shield',
      logo: '🛡️',
    },
    {
      id: 'unitedhealth',
      name: 'UnitedHealthcare',
      logo: '🏥',
    },
    {
      id: 'aetna',
      name: 'Aetna',
      logo: '💊',
    },
    {
      id: 'cigna',
      name: 'Cigna',
      logo: '🏛️',
    },
    {
      id: 'bcbs',
      name: 'Blue Cross Blue Shield',
      logo: '🔵',
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one document');
      return;
    }

    setIsLoading(true);
    try {
      await simulateProcessingDelay(2000);
      
      // Create mock patient for document upload path
      const mockPatient = {
        id: 'P001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        dob: '1985-03-15',
        phone: '(555) 123-4567',
        address: {
          street: '123 Main Street',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
        },
        insurance: {
          carrier: 'Document Upload',
          member_id: 'TBD', // Will be extracted from documents
          group_number: 'TBD', // Will be extracted from documents
          plan_type: 'TBD', // Will be extracted from documents
          effective_date: '2024-01-01',
          expiration_date: '2024-12-31',
        },
        consent: {
          data_sharing: false,
          insurance_access: false,
          prescription_verification: false,
          consent_date: '',
        },
      };

      dispatch({ type: 'SET_PATIENT', payload: mockPatient });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'consent' });
    } catch (err) {
      console.error('Error processing documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsuranceSelect = async (insuranceId: string) => {
    setSelectedInsurance(insuranceId);
    setIsLoading(true);

    try {
      await simulateProcessingDelay(1000);

      // Create or update patient with selected insurance
      const selectedOption = insuranceOptions.find(opt => opt.id === insuranceId);
      if (selectedOption) {
        // Create a mock patient for the demo
        const mockPatient = {
          id: 'P001',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          dob: '1985-03-15',
          phone: '(555) 123-4567',
          address: {
            street: '123 Main Street',
            city: 'Boston',
            state: 'MA',
            zip: '02101',
          },
          insurance: {
            carrier: selectedOption.name,
            member_id: 'TBD', // Will be retrieved after portal login
            group_number: 'TBD', // Will be retrieved after portal login
            plan_type: 'TBD', // Will be retrieved after portal login
            effective_date: '2024-01-01',
            expiration_date: '2024-12-31',
          },
          consent: {
            data_sharing: false,
            insurance_access: false,
            prescription_verification: false,
            consent_date: '',
          },
        };

        dispatch({ type: 'SET_PATIENT', payload: mockPatient });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'consent' });
      }
    } catch (err) {
      console.error('Error selecting insurance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPath) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Insurance Verification Method
          </h2>
          <p className="text-gray-600">
            Select how you'd like to provide your insurance information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Document Upload Path */}
          <div
            onClick={() => setSelectedPath('upload')}
            className="relative p-8 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Upload Insurance Documents
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your insurance ID card and policy documents for automated extraction
              </p>
              <div className="text-left space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Insurance ID card</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Policy documents</span>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download from your portal</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center text-blue-600">
              <span className="text-sm font-medium mr-2">Select This Method</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Carrier Login Path */}
          <div
            onClick={() => setSelectedPath('login')}
            className="relative p-8 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <LogIn className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Login to Insurance Portal
              </h3>
              <p className="text-gray-600 mb-4">
                Securely log into your insurance provider's portal for automatic data extraction
              </p>
              <div className="text-left space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secure portal login</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Automatic data extraction</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  <span>Real-time verification</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center text-green-600">
              <span className="text-sm font-medium mr-2">Select This Method</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help choosing?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPath === 'upload') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Insurance Documents
          </h2>
          <p className="text-gray-600">
            Upload your insurance ID card and policy documents for automated extraction
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">How to get your documents:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Log into your insurance provider's member portal</li>
            <li>Navigate to "My Coverage" or "Plan Details" section</li>
            <li>Download your insurance ID card (PDF or image)</li>
            <li>Download your policy documents or benefit summary</li>
            <li>Upload the files below</li>
          </ol>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Click to upload documents
            </p>
            <p className="text-sm text-gray-500">
              PDF, JPG, PNG files accepted
            </p>
          </label>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Uploaded Files:</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setSelectedPath(null)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Method Selection
          </button>
          <button
            onClick={handleDocumentUpload}
            disabled={isLoading || uploadedFiles.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Upload className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Processing...' : 'Process Documents'}
          </button>
        </div>
      </div>
    );
  }

  // Carrier Login Path
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <LogIn className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Insurance Provider
        </h2>
        <p className="text-gray-600">
          Choose your insurance provider to log into their portal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insuranceOptions.map((insurance) => (
          <div
            key={insurance.id}
            onClick={() => handleInsuranceSelect(insurance.id)}
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedInsurance === insurance.id
                ? 'border-green-500 bg-green-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {selectedInsurance === insurance.id && (
              <div className="absolute top-4 right-4">
                <div className="bg-green-600 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-4xl mb-4">{insurance.logo}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {insurance.name}
              </h3>
            </div>

            {selectedInsurance === insurance.id && (
              <div className="mt-4 flex items-center justify-center text-green-600">
                <span className="text-sm font-medium mr-2">Selected</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-gray-600">Connecting to insurance provider...</span>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between">
          <button
            onClick={() => setSelectedPath(null)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Method Selection
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't see your insurance provider?{' '}
              <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSelector;

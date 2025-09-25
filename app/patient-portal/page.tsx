'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';

interface PatientData {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  insuranceCarrier?: string;
}

type Step = 'welcome' | 'path-selection' | 'document-upload' | 'insurance-login' | 'consent' | 'processing' | 'completed';

export default function PatientPortalPage() {
  const searchParams = useSearchParams();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedPath, setSelectedPath] = useState<'upload' | 'login' | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const patient = searchParams.get('patient');
    if (patient) {
      setPatientId(patient);
      // In a real app, this would fetch patient data from API
      setPatientData({
        id: patient,
        name: 'John Smith',
        dob: '1985-03-15',
        phone: '(555) 123-4567',
        email: 'john.smith@email.com',
        insuranceCarrier: 'Anthem'
      });
    }
  }, [searchParams]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    // Simulate API calls and data processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setCurrentStep('completed');
  };

  const handlePathSelection = (path: 'upload' | 'login') => {
    setSelectedPath(path);
    if (path === 'upload') {
      setCurrentStep('document-upload');
    } else {
      setCurrentStep('insurance-login');
    }
  };

  const handleConsent = () => {
    setConsentGiven(true);
    setCurrentStep('processing');
    simulateProcessing();
  };

  const renderWelcome = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <Image 
          src="/layr-logo.jpeg" 
          alt="Layr+ Logo" 
          width={250} 
          height={80}
          className="rounded-lg"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Patient Portal
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Please complete your insurance verification to proceed with your appointment.
      </p>
      {patientData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">{patientData.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">{patientData.dob}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">{patientData.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">{patientData.email}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setCurrentStep('path-selection')}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
      >
        Get Started
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );

  const renderPathSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Verification Method
        </h1>
        <p className="text-lg text-gray-600">
          Select how you'd like to verify your insurance information
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={() => handlePathSelection('upload')}
          className="bg-white rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Insurance Documents
            </h2>
            <p className="text-gray-600 mb-6">
              Upload your insurance ID card and plan documents. We'll extract the information for you.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Upload insurance ID card</p>
              <p>• Upload plan documents (SBC, formulary)</p>
              <p>• We'll extract your information</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => handlePathSelection('login')}
          className="bg-white rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Login to Insurance Portal
            </h2>
            <p className="text-gray-600 mb-6">
              Log in to your insurance provider's portal and we'll securely extract your information.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Select your insurance carrier</p>
              <p>• Login to your account</p>
              <p>• We'll extract your data securely</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setCurrentStep('welcome')}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Welcome
        </button>
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Insurance Documents
        </h1>
        <p className="text-lg text-gray-600">
          Please upload your insurance documents for verification
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload your insurance documents
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
          >
            Choose Files
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{file.name}</span>
                    <span className="text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep('path-selection')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={() => setCurrentStep('consent')}
            disabled={uploadedFiles.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderInsuranceLogin = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Insurance Provider
        </h1>
        <p className="text-lg text-gray-600">
          Choose your insurance carrier to proceed with verification
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Anthem', 'UnitedHealthcare', 'Aetna', 'Cigna', 'Blue Cross Blue Shield'].map((carrier) => (
            <button
              key={carrier}
              onClick={() => setCurrentStep('consent')}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left"
            >
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">{carrier}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep('path-selection')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Data Sharing Consent
        </h1>
        <p className="text-lg text-gray-600">
          Please review and consent to the data sharing agreement
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                By proceeding, you consent to the secure extraction and processing of your insurance information for verification purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong>Data Collection:</strong> We will collect your insurance information including member ID, plan details, coverage information, and prescription benefits.
          </p>
          <p>
            <strong>Data Usage:</strong> This information will be used to verify your insurance coverage and determine your benefits for the current visit.
          </p>
          <p>
            <strong>Data Security:</strong> All data is encrypted and transmitted securely. We follow HIPAA compliance standards.
          </p>
          <p>
            <strong>Data Retention:</strong> Your information will be retained for the duration of your treatment and as required by law.
          </p>
        </div>

        <div className="mt-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 mr-3"
            />
            <span className="text-sm text-gray-700">
              I have read and understand the data sharing agreement and consent to the collection and processing of my insurance information.
            </span>
          </label>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(selectedPath === 'upload' ? 'document-upload' : 'insurance-login')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleConsent}
            disabled={!consentGiven}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            I Consent & Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        {isProcessing ? (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        ) : (
          <CheckCircle className="h-10 w-10 text-green-600" />
        )}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isProcessing ? 'Processing Your Information' : 'Processing Complete'}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {isProcessing 
          ? 'Please wait while we verify your insurance information...' 
          : 'Your insurance information has been successfully verified and is now available in your EHR.'
        }
      </p>
      {isProcessing && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Extracting insurance data...</span>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verifying coverage...</span>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Updating EHR records...</span>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompleted = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Verification Complete!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your insurance information has been successfully verified and is now available in your electronic health record.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
        <div className="space-y-3 text-left">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-gray-700">Your insurance coverage has been verified</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-gray-700">Your benefits and copays have been calculated</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-gray-700">Your information is now available in the EHR system</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => window.open(`/ehr?patient=${patientId}`, '_blank')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          View Your EHR Record
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-sm text-gray-500">
          You can now close this window. Your healthcare provider has access to your verified insurance information.
        </p>
      </div>
    </div>
  );

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Access
            </h1>
            <p className="text-gray-600 mb-6">
              This patient portal requires a valid patient ID to access.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                Please contact your healthcare provider for a valid access link.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'path-selection' && renderPathSelection()}
        {currentStep === 'document-upload' && renderDocumentUpload()}
        {currentStep === 'insurance-login' && renderInsuranceLogin()}
        {currentStep === 'consent' && renderConsent()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'completed' && renderCompleted()}
      </div>
    </div>
  );
}

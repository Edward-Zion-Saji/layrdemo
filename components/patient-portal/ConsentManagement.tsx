'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Check, Shield, FileText, Pill, AlertCircle } from 'lucide-react';
import { simulateProcessingDelay } from '@/lib/utils';

const ConsentManagement: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [consentData, setConsentData] = useState({
    dataSharing: false,
    insuranceAccess: false,
    prescriptionVerification: false,
    understandTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleConsentChange = (field: keyof typeof consentData) => {
    setConsentData(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async () => {
    if (!consentData.dataSharing || !consentData.insuranceAccess || !consentData.understandTerms) {
      return;
    }

    setIsLoading(true);

    try {
      await simulateProcessingDelay(1000);

      // Update patient consent
      if (state.currentPatient) {
        const updatedPatient = {
          ...state.currentPatient,
          consent: {
            data_sharing: consentData.dataSharing,
            insurance_access: consentData.insuranceAccess,
            prescription_verification: consentData.prescriptionVerification,
            consent_date: new Date().toISOString().split('T')[0],
          },
        };

        dispatch({ type: 'SET_PATIENT', payload: updatedPatient });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'insurance' });
      }
    } catch (err) {
      console.error('Error updating consent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = consentData.dataSharing && consentData.insuranceAccess && consentData.understandTerms;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Data Sharing Consent
        </h2>
        <p className="text-gray-600">
          Please review and authorize the sharing of your insurance information with healthcare providers
        </p>
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p className="text-gray-900">{state.currentPatient?.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Insurance Provider:</span>
              <p className="text-gray-900">{state.currentPatient?.insurance.carrier}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Member ID:</span>
              <p className="text-gray-900 font-mono">{state.currentPatient?.insurance.member_id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Plan Details:</span>
              <p className="text-gray-500 italic">Will be retrieved after portal login</p>
            </div>
          </div>
        </div>

        {/* Consent Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Consent Options</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleConsentChange('dataSharing')}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                  consentData.dataSharing
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300'
                }`}
              >
                {consentData.dataSharing && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Data Sharing Authorization
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  I authorize the retrieval and sharing of my insurance benefit information (copays, deductibles, 
                  coverage details, formulary) with my healthcare providers to facilitate real-time coverage 
                  verification and cost transparency.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleConsentChange('insuranceAccess')}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                  consentData.insuranceAccess
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300'
                }`}
              >
                {consentData.insuranceAccess && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Insurance Portal Access
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  I consent to secure access to my insurance member portal using my provided credentials 
                  for the purpose of retrieving current benefit information, coverage details, and formulary data.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleConsentChange('prescriptionVerification')}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                  consentData.prescriptionVerification
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300'
                }`}
              >
                {consentData.prescriptionVerification && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-blue-600" />
                  Prescription Coverage Verification
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  I authorize real-time verification of prescription drug coverage using my retrieved 
                  formulary data, including copay amounts, prior authorization requirements, and 
                  alternative medication suggestions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleConsentChange('understandTerms')}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                  consentData.understandTerms
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300'
                }`}
              >
                {consentData.understandTerms && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Terms Understanding
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  I understand that this consent can be revoked at any time and that my data 
                  will be handled in accordance with HIPAA privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Retrieval Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">What Information Will Be Retrieved</h4>
          <p className="text-sm text-yellow-800 mb-2">
            After you log into your insurance portal, we will securely retrieve:
          </p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Your current plan details and coverage levels</li>
            <li>• Copay amounts for different services and medications</li>
            <li>• Deductible and out-of-pocket maximum information</li>
            <li>• Prescription drug formulary and tier information</li>
            <li>• Prior authorization requirements</li>
            <li>• Network provider information</li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Privacy & Security</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All data transmission is encrypted using industry-standard protocols</li>
            <li>• Your information is only shared with authorized healthcare providers</li>
            <li>• You can revoke this consent at any time through your patient portal</li>
            <li>• All data handling complies with HIPAA privacy regulations</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'login' })}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Insurance Selection
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!canProceed || isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Authorize & Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentManagement;

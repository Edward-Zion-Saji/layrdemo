'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { FileText, Download, Brain, CheckCircle, AlertCircle, Database, Shield } from 'lucide-react';
import { simulateProcessingDelay } from '@/lib/utils';

const ProcessingSimulation: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const processingSteps = [
    {
      id: 'download',
      name: 'Downloading Documents',
      description: 'Retrieving benefit documents from insurance portal',
      icon: Download,
      duration: 2000,
    },
    {
      id: 'ocr',
      name: 'Document Processing',
      description: 'Extracting text and data from PDF documents',
      icon: FileText,
      duration: 3000,
    },
    {
      id: 'ai_analysis',
      name: 'AI Analysis',
      description: 'Using machine learning to identify benefit structures',
      icon: Brain,
      duration: 4000,
    },
    {
      id: 'validation',
      name: 'Data Validation',
      description: 'Verifying accuracy and completeness of extracted data',
      icon: CheckCircle,
      duration: 2000,
    },
    {
      id: 'structuring',
      name: 'Data Structuring',
      description: 'Converting to standardized JSON format',
      icon: Database,
      duration: 1500,
    },
    {
      id: 'security',
      name: 'Security Review',
      description: 'Ensuring HIPAA compliance and data protection',
      icon: Shield,
      duration: 1000,
    },
    {
      id: 'integration',
      name: 'EHR Integration',
      description: 'Pushing data to healthcare provider systems',
      icon: CheckCircle,
      duration: 2000,
    },
  ];

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        
        // Add processing step to context
        dispatch({
          type: 'ADD_PROCESSING_STEP',
          payload: {
            id: processingSteps[i].id,
            name: processingSteps[i].name,
            status: 'processing',
            progress: 0,
            description: processingSteps[i].description,
            timestamp: new Date().toISOString(),
          },
        });

        // Simulate processing with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await simulateProcessingDelay(processingSteps[i].duration / 10);
          
          dispatch({
            type: 'UPDATE_PROCESSING_STEP',
            payload: {
              id: processingSteps[i].id,
              updates: { progress },
            },
          });
        }

        // Mark step as completed
        dispatch({
          type: 'UPDATE_PROCESSING_STEP',
          payload: {
            id: processingSteps[i].id,
            updates: { 
              status: 'completed',
              progress: 100,
            },
          },
        });
      }

      setIsComplete(true);
      
      // Load mock insurance data
      const mockInsuranceData = {
        medical: {
          annual_deductible: 1500,
          oop_maximum: 6000,
          deductible_used: 450,
          oop_used: 1200,
          copays: {
            primary_care: 25,
            specialist: 50,
            emergency: 250,
            urgent_care: 75,
          },
        },
        prescription: {
          tiers: {
            generic: 10,
            preferred_brand: 35,
            non_preferred: 70,
            specialty: '30% coinsurance',
          },
          annual_deductible: 500,
          deductible_used: 150,
        },
        network_status: 'in_network' as const,
        effective_date: '2024-01-01',
        expiration_date: '2024-12-31',
      };

      dispatch({ type: 'SET_INSURANCE_DATA', payload: mockInsuranceData });
      
      // Move to EHR step after a short delay
      setTimeout(() => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'ehr' });
      }, 2000);
    };

    processSteps();
  }, [dispatch]);

  const getStepIcon = (step: typeof processingSteps[0], index: number) => {
    const Icon = step.icon;
    
    if (index < currentStep) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (index === currentStep) {
      return <Icon className="h-6 w-6 text-blue-600 animate-pulse" />;
    } else {
      return <Icon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) {
      return 'completed';
    } else if (index === currentStep) {
      return 'processing';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Insurance Data
        </h2>
        <p className="text-gray-600">
          Our AI is analyzing your insurance documents and preparing them for integration
        </p>
      </div>

      <div className="space-y-6">
        {processingSteps.map((step, index) => {
          const status = getStepStatus(index);
          const isCurrentStep = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={step.id}
              className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                isCurrentStep
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : isCompleted
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStepIcon(step, index)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${
                      isCurrentStep ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      {step.name}
                    </h3>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      isCurrentStep
                        ? 'bg-blue-200 text-blue-800'
                        : isCompleted
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? 'Completed' : isCurrentStep ? 'Processing...' : 'Pending'}
                    </span>
                  </div>
                  
                  <p className={`mt-2 ${
                    isCurrentStep ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>

                  {isCurrentStep && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                        <span>Progress</span>
                        <span>{state.processingStatus.find(s => s.id === step.id)?.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${state.processingStatus.find(s => s.id === step.id)?.progress || 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-green-800">
            <CheckCircle className="h-6 w-6" />
            <span className="text-lg font-semibold">Processing Complete!</span>
          </div>
          <p className="text-center text-green-700 mt-2">
            Your insurance data has been successfully integrated. Redirecting to EHR system...
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>All data processing is HIPAA compliant and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingSimulation;

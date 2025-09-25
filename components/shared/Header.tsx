'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Shield, User, FileText, Stethoscope, Pill, LogIn } from 'lucide-react';
import Image from 'next/image';

const Header: React.FC = () => {
  const { state } = useDemo();

  const steps = [
    { id: 'demo-login', label: 'Demo Login', icon: LogIn },
    { id: 'login', label: 'Select Insurance', icon: Shield },
    { id: 'consent', label: 'Consent', icon: FileText },
    { id: 'insurance', label: 'Insurance Login', icon: User },
    { id: 'twofa', label: '2FA Verification', icon: Shield },
    { id: 'processing', label: 'Processing', icon: FileText },
    { id: 'ehr', label: 'EHR System', icon: Stethoscope },
    { id: 'prescription', label: 'Prescription', icon: Pill },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === state.currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/layr-logo.jpeg" 
                alt="Layr+ Logo" 
                width={120} 
                height={32}
                className="rounded-lg"
              />
            </div>
            <div className="text-sm text-gray-500">
              Healthcare Integration Platform
            </div>
          </div>
          
          {state.currentPatient && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Patient:</span> {state.currentPatient.name}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Insurance:</span> {state.currentPatient.insurance.carrier}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DemoProvider, useDemo } from '@/contexts/DemoContext';
import { Patient } from '@/types';
import mockPatients from '@/data/mock-patients.json';
import EHRSystem from '@/components/ehr-system/EHRSystem';
import Image from 'next/image';

function EHRPageContent() {
  const searchParams = useSearchParams();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useDemo();

  useEffect(() => {
    const patient = searchParams.get('patient');
    console.log('Patient ID from URL:', patient);
    if (patient) {
      setPatientId(patient);
      const patientData = mockPatients.patients.find(p => p.id === patient);
      console.log('Found patient data:', patientData);
      if (patientData) {
        dispatch({ type: 'SET_PATIENT', payload: patientData as Patient });
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [searchParams, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/layr-logo.jpeg"
                alt="Layr+ Logo"
                width={200}
                height={64}
                className="rounded-lg"
              />
            </div>
            <p className="text-gray-600 mb-6">
              This EHR system requires a patient ID to access patient records.
            </p>
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <strong>Demo Patient IDs:</strong>
              </div>
              <div className="space-y-2">
                <a 
                  href="/ehr?patient=patient-1" 
                  className="block bg-blue-50 hover:bg-blue-100 p-3 rounded border text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <strong>John Smith</strong> - Hypertension Management
                </a>
                <a 
                  href="/ehr?patient=patient-2" 
                  className="block bg-green-50 hover:bg-green-100 p-3 rounded border text-green-700 hover:text-green-800 transition-colors"
                >
                  <strong>Sarah Johnson</strong> - Ankle Fracture Follow-up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EHRSystem patientId={patientId} />;
}

export default function EHRPage() {
  return (
    <DemoProvider>
      <EHRPageContent />
    </DemoProvider>
  );
}

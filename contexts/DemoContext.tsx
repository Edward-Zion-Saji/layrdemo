'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DemoState, Patient, InsuranceBenefits, ProcessingStep, Prescription, CoverageResult } from '@/types';

type DemoAction =
  | { type: 'SET_PATIENT'; payload: Patient | null }
  | { type: 'SET_INSURANCE_DATA'; payload: InsuranceBenefits | null }
  | { type: 'SET_PROCESSING_STATUS'; payload: ProcessingStep[] }
  | { type: 'ADD_PROCESSING_STEP'; payload: ProcessingStep }
  | { type: 'UPDATE_PROCESSING_STEP'; payload: { id: string; updates: Partial<ProcessingStep> } }
  | { type: 'SET_PRESCRIPTIONS'; payload: Prescription[] }
  | { type: 'ADD_PRESCRIPTION'; payload: Prescription }
  | { type: 'SET_COVERAGE_RESULTS'; payload: CoverageResult[] }
  | { type: 'SET_CURRENT_STEP'; payload: DemoState['currentStep'] }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'RESET_DEMO' };

const initialState: DemoState = {
  currentPatient: null,
  insuranceData: null,
  processingStatus: [],
  prescriptions: [],
  coverageResults: [],
  currentStep: 'demo-login',
  isProcessing: false,
};

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SET_PATIENT':
      return { ...state, currentPatient: action.payload };
    case 'SET_INSURANCE_DATA':
      return { ...state, insuranceData: action.payload };
    case 'SET_PROCESSING_STATUS':
      return { ...state, processingStatus: action.payload };
    case 'ADD_PROCESSING_STEP':
      return { ...state, processingStatus: [...state.processingStatus, action.payload] };
    case 'UPDATE_PROCESSING_STEP':
      return {
        ...state,
        processingStatus: state.processingStatus.map(step =>
          step.id === action.payload.id
            ? { ...step, ...action.payload.updates }
            : step
        ),
      };
    case 'SET_PRESCRIPTIONS':
      return { ...state, prescriptions: action.payload };
    case 'ADD_PRESCRIPTION':
      return { ...state, prescriptions: [...state.prescriptions, action.payload] };
    case 'SET_COVERAGE_RESULTS':
      return { ...state, coverageResults: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'RESET_DEMO':
      return initialState;
    default:
      return state;
  }
}

const DemoContext = createContext<{
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
} | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialState);

  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}

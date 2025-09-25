'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Shield, DollarSign, Calendar, AlertCircle, CheckCircle, Pill } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const InsuranceBenefitsPanel: React.FC = () => {
  const { state } = useDemo();

  if (!state.insuranceData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Insurance Data</h3>
          <p className="text-gray-500">Insurance information will appear here once processing is complete.</p>
        </div>
      </div>
    );
  }

  const { medical, prescription, network_status } = state.insuranceData;

  const getDeductibleProgress = () => {
    const percentage = (medical.deductible_used / medical.annual_deductible) * 100;
    return Math.min(percentage, 100);
  };

  const getOOPProgress = () => {
    const percentage = (medical.oop_used / medical.oop_maximum) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="space-y-6">
      {/* Insurance Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Insurance Benefits</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            network_status === 'in_network'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {network_status === 'in_network' ? 'In Network' : 'Out of Network'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Carrier</p>
            <p className="font-medium text-gray-900">{state.currentPatient?.insurance.carrier}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Plan Type</p>
            <p className="font-medium text-gray-900">{state.currentPatient?.insurance.plan_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member ID</p>
            <p className="font-mono text-sm text-gray-900">{state.currentPatient?.insurance.member_id}</p>
          </div>
        </div>
      </div>

      {/* Medical Benefits */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
          Medical Benefits
        </h3>

        <div className="space-y-6">
          {/* Deductible Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Annual Deductible</span>
              <span className="text-sm text-gray-600">
                {formatCurrency(medical.deductible_used)} / {formatCurrency(medical.annual_deductible)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getDeductibleProgress()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(medical.annual_deductible - medical.deductible_used)} remaining
            </p>
          </div>

          {/* Out-of-Pocket Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Out-of-Pocket Maximum</span>
              <span className="text-sm text-gray-600">
                {formatCurrency(medical.oop_used)} / {formatCurrency(medical.oop_maximum)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getOOPProgress()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(medical.oop_maximum - medical.oop_used)} remaining
            </p>
          </div>

          {/* Copays */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Copay Amounts</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Primary Care</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(medical.copays.primary_care)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Specialist</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(medical.copays.specialist)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Emergency</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(medical.copays.emergency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Urgent Care</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(medical.copays.urgent_care)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Benefits */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Pill className="h-5 w-5 mr-2 text-blue-600" />
          Prescription Benefits
        </h3>

        <div className="space-y-4">
          {/* Prescription Deductible */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Prescription Deductible</span>
              <span className="text-sm text-gray-600">
                {formatCurrency(prescription.deductible_used)} / {formatCurrency(prescription.annual_deductible)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(prescription.deductible_used / prescription.annual_deductible) * 100}%` }}
              />
            </div>
          </div>

          {/* Prescription Tiers */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Copay Tiers</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Generic</span>
                <span className="text-sm font-medium text-green-800">{formatCurrency(prescription.tiers.generic)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Preferred Brand</span>
                <span className="text-sm font-medium text-blue-800">{formatCurrency(prescription.tiers.preferred_brand)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-gray-700">Non-Preferred</span>
                <span className="text-sm font-medium text-yellow-800">{formatCurrency(prescription.tiers.non_preferred)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Specialty</span>
                <span className="text-sm font-medium text-purple-800">{prescription.tiers.specialty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Coverage Status
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Network Status</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Effective Date</span>
            <span className="text-sm font-medium text-gray-900">{state.insuranceData?.effective_date}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Expiration Date</span>
            <span className="text-sm font-medium text-gray-900">{state.insuranceData?.expiration_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceBenefitsPanel;

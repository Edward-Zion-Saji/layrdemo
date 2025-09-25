'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import EHRSidebar from './EHRSidebar';
import InsuranceBenefitsPanel from './InsuranceBenefitsPanel';
import MedicationSearch from './prescription-tool/MedicationSearch';
import DocumentsPanel from './DocumentsPanel';
import { User, Calendar, FileText, AlertTriangle, Activity, Settings } from 'lucide-react';

interface EHRSystemProps {
  patientId: string;
}

const EHRSystem: React.FC<EHRSystemProps> = ({ patientId }) => {
  const { state } = useDemo();
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Demographics</h3>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Insurance</h3>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Documents</h3>
                  <p className="text-sm text-gray-600">3 Available</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Insurance data successfully integrated</span>
                  <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Patient consent received</span>
                  <span className="text-xs text-gray-500 ml-auto">5 minutes ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Insurance portal accessed</span>
                  <span className="text-xs text-gray-500 ml-auto">8 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'insurance':
        return <InsuranceBenefitsPanel />;

      case 'medications':
        return <MedicationSearch patientId={patientId} />;

      case 'documents':
        return <DocumentsPanel />;

      case 'visits':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Visits</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Annual Physical</h3>
                  <span className="text-sm text-gray-500">March 15, 2024</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Dr. Sarah Williams, MD</p>
                <p className="text-sm text-gray-700">Chief Complaint: Annual physical examination</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Hypertension</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Hyperlipidemia</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinical Alerts</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="font-medium text-yellow-800">Prior Authorization Required</h3>
                </div>
                <p className="text-sm text-yellow-700 mt-1">Ozempic requires prior authorization before prescribing</p>
              </div>
              <div className="border-l-4 border-red-400 bg-red-50 p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-medium text-red-800">Drug Interaction Warning</h3>
                </div>
                <p className="text-sm text-red-700 mt-1">Xarelto + Aspirin interaction detected</p>
              </div>
            </div>
          </div>
        );

      case 'vitals':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vital Signs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-600">120/80</h3>
                <p className="text-sm text-gray-600">Blood Pressure</p>
                <p className="text-xs text-gray-500">mmHg</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-2xl font-bold text-green-600">72</h3>
                <p className="text-sm text-gray-600">Heart Rate</p>
                <p className="text-xs text-gray-500">bpm</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-600">98.6</h3>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-xs text-gray-500">°F</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h3 className="text-2xl font-bold text-orange-600">22</h3>
                <p className="text-sm text-gray-600">BMI</p>
                <p className="text-xs text-gray-500">kg/m²</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto-refresh insurance data</span>
                <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Real-time coverage alerts</span>
                <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Prior auth notifications</span>
                <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EHRSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EHRSystem;

'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { 
  User, 
  Shield, 
  Pill, 
  FileText, 
  Calendar, 
  AlertTriangle,
  Activity,
  Settings
} from 'lucide-react';

interface EHRSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EHRSidebar: React.FC<EHRSidebarProps> = ({ activeTab, onTabChange }) => {
  const { state } = useDemo();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'visits', label: 'Visits', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'vitals', label: 'Vitals', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getAlertCount = () => {
    // Mock alert count - in real app this would come from state
    return 3;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      {/* Patient Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {state.currentPatient?.name}
            </h3>
            <p className="text-sm text-gray-500">
              DOB: {state.currentPatient?.dob}
            </p>
            <p className="text-xs text-gray-400">
              ID: {state.currentPatient?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasAlerts = tab.id === 'alerts' && getAlertCount() > 0;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </div>
                {hasAlerts && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {getAlertCount()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Insurance Status */}
      {state.insuranceData && (
        <div className="mt-8 px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Insurance Active
              </span>
            </div>
            <p className="text-xs text-green-700">
              {state.currentPatient?.insurance.carrier}
            </p>
            <p className="text-xs text-green-600">
              {state.currentPatient?.insurance.plan_type}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 px-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            New Prescription
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Schedule Visit
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            View Benefits
          </button>
        </div>
      </div>
    </div>
  );
};

export default EHRSidebar;

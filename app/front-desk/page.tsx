'use client';

import React, { useState } from 'react';
import { 
  UserPlus, 
  QrCode, 
  Copy, 
  Check, 
  Users, 
  FileText, 
  Shield,
  Clock,
  Eye
} from 'lucide-react';
import QRCode from 'qrcode';
import Image from 'next/image';

interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  insuranceCarrier?: string;
  status: 'registered' | 'verified' | 'completed';
  createdAt: string;
  patientLink?: string;
  qrCode?: string;
}

export default function FrontDeskPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState({
    name: '',
    dob: '',
    phone: '',
    email: '',
    insuranceCarrier: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generatePatientLink = (patientId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_PATIENT_PORTAL_URL || 'http://localhost:3000';
    return `${baseUrl}/patient-portal?patient=${patientId}`;
  };

  const generateQRCode = async (patientId: string) => {
    const patientLink = generatePatientLink(patientId);
    try {
      const qrCodeDataURL = await QRCode.toDataURL(patientLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const addPatient = async () => {
    if (!newPatient.name || !newPatient.dob || !newPatient.phone || !newPatient.email) {
      alert('Please fill in all required fields');
      return;
    }

    const patientId = `P011`;
    const patientLink = generatePatientLink(patientId);
    const qrCode = await generateQRCode(patientId);

    const patient: Patient = {
      id: patientId,
      name: newPatient.name,
      dob: newPatient.dob,
      phone: newPatient.phone,
      email: newPatient.email,
      insuranceCarrier: newPatient.insuranceCarrier || undefined,
      status: 'registered',
      createdAt: new Date().toISOString(),
      patientLink,
      qrCode
    };

    setPatients(prev => [patient, ...prev]);
    setNewPatient({ name: '', dob: '', phone: '', email: '', insuranceCarrier: '' });
    setShowAddForm(false);
  };

  const copyToClipboard = async (text: string, patientId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(patientId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered': return <Clock className="h-4 w-4" />;
      case 'verified': return <Shield className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Image 
                src="/layr-logo.jpeg" 
                alt="Layr+ Logo" 
                width={200} 
                height={48}
                className="rounded-lg"
              />
              <div>
                <p className="text-gray-600 mt-1">Patient Registration & Healthcare Verification</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Add Patient
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === 'registered').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === 'verified').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Patient Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={newPatient.dob}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Carrier (Optional)
                  </label>
                  <select
                    value={newPatient.insuranceCarrier}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, insuranceCarrier: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Insurance Carrier</option>
                    <option value="Anthem">Anthem</option>
                    <option value="UnitedHealthcare">UnitedHealthcare</option>
                    <option value="Aetna">Aetna</option>
                    <option value="Cigna">Cigna</option>
                    <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addPatient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Patient Registry</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insurance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">ID: {patient.id}</div>
                        <div className="text-sm text-gray-500">DOB: {patient.dob}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.phone}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.insuranceCarrier || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {getStatusIcon(patient.status)}
                        <span className="ml-1 capitalize">{patient.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(patient.patientLink!, patient.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          {copiedId === patient.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copiedId === patient.id ? 'Copied!' : 'Copy Link'}
                        </button>
                        {patient.qrCode && (
                          <button
                            onClick={() => {
                              const newWindow = window.open();
                              newWindow?.document.write(`
                                <div style="text-align: center; padding: 20px;">
                                  <h2>Patient Portal Access</h2>
                                  <p>${patient.name} (${patient.id})</p>
                                  <img src="${patient.qrCode}" alt="QR Code" style="margin: 20px 0;" />
                                  <p>Scan this QR code to access the patient portal</p>
                                </div>
                              `);
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <QrCode className="h-4 w-4" />
                            QR Code
                          </button>
                        )}
                        <button
                          onClick={() => window.open(`/ehr?patient=${patient.id}`, '_blank')}
                          className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View EHR
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients registered</h3>
                <p className="text-gray-500">Add your first patient to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

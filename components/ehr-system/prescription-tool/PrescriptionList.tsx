'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Medication, Pharmacy } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Send, 
  MapPin, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { mockPharmacies } from '@/data/mock-pharmacies';

interface PrescriptionItem {
  id: string;
  medication: Medication;
  quantity: number;
  instructions: string;
  refills: number;
}

interface PharmacyRanking {
  pharmacy: Pharmacy;
  totalCost: number;
  totalSavings: number;
  benefits: string[];
  score: number;
}

interface PrescriptionListProps {
  prescriptions?: PrescriptionItem[];
  onUpdatePrescriptions?: (prescriptions: PrescriptionItem[]) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({ 
  prescriptions: propPrescriptions, 
  onUpdatePrescriptions 
}) => {
  const { state, dispatch } = useDemo();
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(propPrescriptions || []);
  const [showPharmacySelection, setShowPharmacySelection] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [pharmacyRankings, setPharmacyRankings] = useState<PharmacyRanking[]>([]);

  // Update local state when props change
  React.useEffect(() => {
    if (propPrescriptions) {
      setPrescriptions(propPrescriptions);
    }
  }, [propPrescriptions]);

  // Notify parent when prescriptions change
  React.useEffect(() => {
    if (onUpdatePrescriptions) {
      onUpdatePrescriptions(prescriptions);
    }
  }, [prescriptions, onUpdatePrescriptions]);

  // Calculate pharmacy rankings when prescriptions change
  React.useEffect(() => {
    if (prescriptions.length > 0 && state.currentPatient?.insurance.carrier) {
      calculatePharmacyRankings();
    }
  }, [prescriptions, state.currentPatient?.insurance.carrier]);

  const calculatePharmacyRankings = () => {
    const inNetworkPharmacies = mockPharmacies.filter(pharmacy => 
      pharmacy.in_network && pharmacy.carriers.includes(state.currentPatient!.insurance.carrier)
    );

    const rankings: PharmacyRanking[] = inNetworkPharmacies.map(pharmacy => {
      let totalCost = 0;
      let totalSavings = 0;
      const benefits: string[] = [];

      // Calculate total cost for all prescriptions at this pharmacy
      prescriptions.forEach(prescription => {
        const baseCost = Number(prescription.medication.copay) || 0;
        const discount = Number(pharmacy.benefits.copay_discount) || 0;
        const finalCost = Math.max(0, baseCost - discount);
        
        totalCost += finalCost;
        totalSavings += discount;
      });

      // Collect benefits
      if (pharmacy.benefits.delivery) benefits.push('Delivery');
      if (pharmacy.benefits.drive_through) benefits.push('Drive-Through');
      if (pharmacy.benefits['24_hours']) benefits.push('24 Hours');
      if (pharmacy.benefits.specialty_pharmacy) benefits.push('Specialty Pharmacy');
      if (pharmacy.benefits.mail_order) benefits.push('Mail Order');

      // Calculate score (lower cost = higher score, more benefits = higher score)
      const costScore = Math.max(0, 1000 - totalCost); // Higher score for lower cost
      const benefitScore = benefits.length * 50; // 50 points per benefit
      const savingsScore = totalSavings * 2; // 2 points per dollar saved
      const score = costScore + benefitScore + savingsScore;

      return {
        pharmacy,
        totalCost,
        totalSavings,
        benefits,
        score
      };
    });

    // Sort by score (highest first)
    rankings.sort((a, b) => b.score - a.score);
    setPharmacyRankings(rankings);
  };

  const addToPrescriptionList = (medication: Medication) => {
    const newPrescription: PrescriptionItem = {
      id: `RX${Date.now()}`,
      medication,
      quantity: 30, // Default 30-day supply
      instructions: 'Take as directed by your healthcare provider',
      refills: 0,
    };
    
    setPrescriptions(prev => [...prev, newPrescription]);
  };

  const updatePrescription = (id: string, updates: Partial<PrescriptionItem>) => {
    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === id 
          ? { ...prescription, ...updates }
          : prescription
      )
    );
  };

  const removePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(prescription => prescription.id !== id));
  };

  const selectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowPharmacySelection(false);
  };

  const sendAllPrescriptions = async () => {
    if (!selectedPharmacy) {
      alert('Please select a pharmacy first');
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate sending all prescriptions
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear prescription list
      setPrescriptions([]);
      setSelectedPharmacy(null);
      
      // Show success message
      alert(`All ${prescriptions.length} prescriptions sent to ${selectedPharmacy.name} successfully!`);
      
    } catch (error) {
      console.error('Error sending prescriptions:', error);
      alert('Failed to send prescriptions. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getInNetworkPharmacies = () => {
    if (!state.currentPatient?.insurance.carrier) return [];
    
    return mockPharmacies.filter(pharmacy => 
      pharmacy.in_network && 
      pharmacy.carriers.includes(state.currentPatient!.insurance.carrier)
    );
  };

  const totalCost = prescriptions.reduce((sum, prescription) => {
    const baseCost = Number(prescription.medication.copay) || 0;
    const discount = Number(selectedPharmacy?.benefits.copay_discount) || 0;
    return sum + Math.max(0, baseCost - discount);
  }, 0);

  const totalSavings = prescriptions.reduce((sum, prescription) => {
    const discount = Number(selectedPharmacy?.benefits.copay_discount) || 0;
    return sum + discount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Prescription List</h2>
              <p className="text-sm text-gray-600">
                {prescriptions.length} medication{prescriptions.length !== 1 ? 's' : ''} ready to send
              </p>
            </div>
          </div>
          
          {prescriptions.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Estimated Cost</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalCost.toFixed(2)}
                  {totalSavings > 0 && (
                    <span className="text-sm text-green-600 ml-2">
                      (Save ${totalSavings.toFixed(2)})
                    </span>
                  )}
                </p>
                {selectedPharmacy && (
                  <p className="text-xs text-gray-500">at {selectedPharmacy.name}</p>
                )}
              </div>
              <button
                onClick={sendAllPrescriptions}
                disabled={isSending || !selectedPharmacy}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{isSending ? 'Sending...' : 'Send All'}</span>
              </button>
            </div>
          )}
        </div>

        {prescriptions.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions yet</h3>
            <p className="text-gray-600">
              Search for medications and add them to your prescription list
            </p>
          </div>
        )}
      </div>

      {/* Prescription Items */}
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {prescription.medication.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prescription.medication.coverage_status === 'covered' 
                    ? 'bg-green-100 text-green-800'
                    : prescription.medication.coverage_status === 'prior_auth_required'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {prescription.medication.coverage_status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {prescription.medication.generic_name}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Quantity:</span>
                  <input
                    type="number"
                    value={prescription.quantity}
                    onChange={(e) => updatePrescription(prescription.id, { 
                      quantity: parseInt(e.target.value) || 0 
                    })}
                    className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    min="1"
                  />
                </div>
                <div>
                  <span className="text-gray-500">Refills:</span>
                  <input
                    type="number"
                    value={prescription.refills}
                    onChange={(e) => updatePrescription(prescription.id, { 
                      refills: parseInt(e.target.value) || 0 
                    })}
                    className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    min="0"
                  />
                </div>
                <div>
                  <span className="text-gray-500">Copay:</span>
                  <span className="ml-2 font-medium">
                    ${prescription.medication.copay || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Tier:</span>
                  <span className="ml-2 font-medium">
                    {prescription.medication.tier}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-gray-500 text-sm">Instructions:</span>
                <textarea
                  value={prescription.instructions}
                  onChange={(e) => updatePrescription(prescription.id, { 
                    instructions: e.target.value 
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                  placeholder="Enter prescription instructions..."
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => removePrescription(prescription.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove prescription"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      ))}

      {/* Single Pharmacy Selection */}
      {prescriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Pharmacy for All Prescriptions</h3>
            <button
              onClick={() => setShowPharmacySelection(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>{selectedPharmacy ? 'Change Pharmacy' : 'Select Pharmacy'}</span>
            </button>
          </div>

          {selectedPharmacy ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">{selectedPharmacy.name}</h4>
                  <p className="text-sm text-green-700 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedPharmacy.address} ({selectedPharmacy.distance})
                  </p>
                  <p className="text-sm text-green-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {selectedPharmacy.phone}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPharmacy.benefits.delivery && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Delivery</span>
                    )}
                    {selectedPharmacy.benefits.drive_through && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Drive-Through</span>
                    )}
                    {selectedPharmacy.benefits['24_hours'] && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">24 Hours</span>
                    )}
                    {selectedPharmacy.benefits.specialty_pharmacy && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Specialty</span>
                    )}
                    {selectedPharmacy.benefits.mail_order && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Mail Order</span>
                    )}
                    {selectedPharmacy.benefits.copay_discount > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        ${selectedPharmacy.benefits.copay_discount} Discount
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-yellow-800">
                    No pharmacy selected. Click "Select Pharmacy" to choose where to send all prescriptions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pharmacy Selection Modal */}
      {showPharmacySelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Pharmacy</h3>
                <button
                  onClick={() => setShowPharmacySelection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {pharmacyRankings.map((ranking, index) => (
                  <div
                    key={ranking.pharmacy.id}
                    onClick={() => selectPharmacy(ranking.pharmacy)}
                    className={`border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors ${
                      index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{ranking.pharmacy.name}</h4>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              BEST DEAL
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {ranking.pharmacy.address} ({ranking.pharmacy.distance})
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {ranking.pharmacy.phone}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            Total Cost: ${ranking.totalCost.toFixed(2)}
                            {ranking.totalSavings > 0 && (
                              <span className="text-green-600 ml-2">
                                (Save ${ranking.totalSavings.toFixed(2)})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {ranking.benefits.map((benefit, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {benefit}
                            </span>
                          ))}
                        </div>
                        {ranking.pharmacy.benefits.copay_discount > 0 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                            ${ranking.pharmacy.benefits.copay_discount} Discount
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;



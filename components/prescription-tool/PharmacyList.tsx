'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { MapPin, Phone, Clock, Truck, Car, Pill, Mail, Star, CheckCircle, XCircle } from 'lucide-react';
import { Pharmacy } from '@/types';
import { mockPharmacies } from '@/data/mock-pharmacies';

interface PharmacyListProps {
  medicationName: string;
}

const PharmacyList: React.FC<PharmacyListProps> = ({ medicationName }) => {
  const { state } = useDemo();

  // Filter pharmacies that are in-network for the patient's insurance
  const inNetworkPharmacies = mockPharmacies.filter(pharmacy => 
    pharmacy.in_network && pharmacy.carriers.includes(state.currentPatient?.insurance.carrier || '')
  );

  const getBenefitIcon = (benefit: boolean) => {
    return benefit ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    );
  };

  const getBenefitText = (benefit: boolean) => {
    return benefit ? 'text-green-700' : 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          In-Network Pharmacies for {medicationName}
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Based on your location in {state.currentPatient?.address.city}, {state.currentPatient?.address.state} and your {state.currentPatient?.insurance.carrier} coverage
      </p>

      <div className="space-y-4">
        {inNetworkPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{pharmacy.name}</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    In-Network
                  </span>
                  {pharmacy.benefits.copay_discount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Star className="h-3 w-3 mr-1" />
                      ${pharmacy.benefits.copay_discount} off
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{pharmacy.address}</span>
                  <span className="mx-2">•</span>
                  <span>{pharmacy.distance}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{pharmacy.phone}</span>
                </div>

                {/* Pharmacy Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    {getBenefitIcon(pharmacy.benefits.delivery)}
                    <span className={getBenefitText(pharmacy.benefits.delivery)}>
                      <Truck className="h-4 w-4 inline mr-1" />
                      Delivery
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getBenefitIcon(pharmacy.benefits.drive_through)}
                    <span className={getBenefitText(pharmacy.benefits.drive_through)}>
                      <Car className="h-4 w-4 inline mr-1" />
                      Drive-through
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getBenefitIcon(pharmacy.benefits['24_hours'])}
                    <span className={getBenefitText(pharmacy.benefits['24_hours'])}>
                      <Clock className="h-4 w-4 inline mr-1" />
                      24 Hours
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getBenefitIcon(pharmacy.benefits.specialty_pharmacy)}
                    <span className={getBenefitText(pharmacy.benefits.specialty_pharmacy)}>
                      <Pill className="h-4 w-4 inline mr-1" />
                      Specialty
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getBenefitIcon(pharmacy.benefits.mail_order)}
                    <span className={getBenefitText(pharmacy.benefits.mail_order)}>
                      <Mail className="h-4 w-4 inline mr-1" />
                      Mail Order
                    </span>
                  </div>
                  
                  {pharmacy.benefits.copay_discount > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700 font-medium">
                        ${pharmacy.benefits.copay_discount} Copay Discount
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Select Pharmacy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inNetworkPharmacies.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No In-Network Pharmacies Found</h4>
          <p className="text-gray-600">
            No pharmacies in your area are currently in-network with {state.currentPatient?.insurance.carrier}
          </p>
        </div>
      )}
    </div>
  );
};

export default PharmacyList;



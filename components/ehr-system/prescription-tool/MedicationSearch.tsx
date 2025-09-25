'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Search, Pill, AlertCircle, CheckCircle, DollarSign, Plus, ShoppingCart } from 'lucide-react';
import { getCoverageStatusColor, getCoverageStatusIcon, formatCurrency } from '@/lib/utils';
import { simulateProcessingDelay } from '@/lib/utils';
import PharmacyList from './PharmacyList';
import PrescriptionList from './PrescriptionList';

const MedicationSearch: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);
  const [clickedAlternative, setClickedAlternative] = useState<string>('');
  const [prescriptionList, setPrescriptionList] = useState<any[]>([]);
  const [showPrescriptionList, setShowPrescriptionList] = useState(false);

  // Mock medication data - in real app this would come from API
  const mockMedications = [
    {
      id: 'M001',
      name: 'Atorvastatin',
      generic_name: 'atorvastatin calcium',
      ndc: '0093-0167-01',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: [],
      restrictions: [],
    },
    {
      id: 'M002',
      name: 'Lisinopril',
      generic_name: 'lisinopril',
      ndc: '0093-0123-01',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: ['Enalapril', 'Ramipril'],
      restrictions: [],
    },
    {
      id: 'M003',
      name: 'Metformin',
      generic_name: 'metformin hydrochloride',
      ndc: '0093-0156-01',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: [],
      restrictions: [],
    },
    {
      id: 'M004',
      name: 'Humira',
      generic_name: 'adalimumab',
      ndc: '0074-3799-02',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Enbrel', 'Remicade', 'Simponi'],
      restrictions: ['Step therapy required', 'Quantity limit: 2 pens per 28 days'],
    },
    {
      id: 'M005',
      name: 'Ozempic',
      generic_name: 'semaglutide',
      ndc: '0169-7501-11',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Trulicity', 'Victoza', 'Mounjaro'],
      restrictions: ['Step therapy required', 'BMI > 30 required'],
    },
    {
      id: 'M006',
      name: 'Xarelto',
      generic_name: 'rivaroxaban',
      ndc: '50458-580-30',
      coverage_status: 'covered',
      tier: 'preferred_brand',
      copay: 35,
      prior_auth: false,
      alternatives: ['Eliquis', 'Warfarin'],
      restrictions: [],
    },
    {
      id: 'M007',
      name: 'Eliquis',
      generic_name: 'apixaban',
      ndc: '50458-580-30',
      coverage_status: 'covered',
      tier: 'preferred_brand',
      copay: 35,
      prior_auth: false,
      alternatives: ['Xarelto', 'Warfarin'],
      restrictions: [],
    },
    {
      id: 'M008',
      name: 'Viagra',
      generic_name: 'sildenafil',
      ndc: '0069-4220-20',
      coverage_status: 'not_covered',
      tier: 'non_preferred',
      copay: 70,
      prior_auth: false,
      alternatives: ['Cialis', 'Levitra', 'Stendra'],
      restrictions: ['Not covered for erectile dysfunction'],
      quantity_limit: 4,
      refill_limit: 6
    },
    // Alternative medications
    {
      id: 'M013',
      name: 'Enbrel',
      generic_name: 'etanercept',
      ndc: '58406-001-01',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Humira', 'Remicade', 'Simponi'],
      restrictions: ['Step therapy required', 'Quantity limit: 4 pens per 28 days'],
      quantity_limit: 4,
      refill_limit: 12
    },
    {
      id: 'M014',
      name: 'Remicade',
      generic_name: 'infliximab',
      ndc: '57894-030-01',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Humira', 'Enbrel', 'Simponi'],
      restrictions: ['Step therapy required', 'Infusion required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M015',
      name: 'Simponi',
      generic_name: 'golimumab',
      ndc: '57894-031-01',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Humira', 'Enbrel', 'Remicade'],
      restrictions: ['Step therapy required', 'Quantity limit: 1 pen per 28 days'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M016',
      name: 'Enalapril',
      generic_name: 'enalapril maleate',
      ndc: '0093-0178-01',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: ['Lisinopril', 'Ramipril'],
      restrictions: [],
      quantity_limit: 30,
      refill_limit: 12
    },
    {
      id: 'M017',
      name: 'Ramipril',
      generic_name: 'ramipril',
      ndc: '0093-0179-01',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: ['Lisinopril', 'Enalapril'],
      restrictions: [],
      quantity_limit: 30,
      refill_limit: 12
    },
    {
      id: 'M018',
      name: 'Trulicity',
      generic_name: 'dulaglutide',
      ndc: '0002-3229-30',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Ozempic', 'Victoza', 'Mounjaro'],
      restrictions: ['Step therapy required', 'BMI > 30 required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M019',
      name: 'Victoza',
      generic_name: 'liraglutide',
      ndc: '0169-7501-11',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Ozempic', 'Trulicity', 'Mounjaro'],
      restrictions: ['Step therapy required', 'BMI > 30 required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M020',
      name: 'Mounjaro',
      generic_name: 'tirzepatide',
      ndc: '0002-3230-30',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: '30% coinsurance',
      prior_auth: true,
      alternatives: ['Ozempic', 'Trulicity', 'Victoza'],
      restrictions: ['Step therapy required', 'BMI > 30 required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    // Brand vs Generic coverage examples
    {
      id: 'M021',
      name: 'Nexium',
      generic_name: 'esomeprazole',
      ndc: '0002-3231-30',
      coverage_status: 'not_covered',
      tier: 'non_preferred',
      copay: 80,
      prior_auth: false,
      alternatives: ['Prilosec', 'Protonix', 'Pantoprazole'],
      restrictions: ['Brand not covered - generic available'],
      quantity_limit: 30,
      refill_limit: 12
    },
    {
      id: 'M022',
      name: 'Prilosec',
      generic_name: 'omeprazole',
      ndc: '0002-3232-30',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: ['Nexium', 'Protonix', 'Pantoprazole'],
      restrictions: [],
      quantity_limit: 30,
      refill_limit: 12
    },
    {
      id: 'M023',
      name: 'Protonix',
      generic_name: 'pantoprazole',
      ndc: '0002-3233-30',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 10,
      prior_auth: false,
      alternatives: ['Nexium', 'Prilosec', 'Omeprazole'],
      restrictions: [],
      quantity_limit: 30,
      refill_limit: 12
    },
    {
      id: 'M024',
      name: 'Advair',
      generic_name: 'fluticasone/salmeterol',
      ndc: '0002-3234-30',
      coverage_status: 'not_covered',
      tier: 'non_preferred',
      copay: 90,
      prior_auth: false,
      alternatives: ['Symbicort', 'Breo', 'Dulera'],
      restrictions: ['Brand not covered - alternatives available'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M025',
      name: 'Symbicort',
      generic_name: 'budesonide/formoterol',
      ndc: '0002-3235-30',
      coverage_status: 'covered',
      tier: 'preferred_brand',
      copay: 35,
      prior_auth: false,
      alternatives: ['Advair', 'Breo', 'Dulera'],
      restrictions: [],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M026',
      name: 'Breo',
      generic_name: 'fluticasone/vilanterol',
      ndc: '0002-3236-30',
      coverage_status: 'covered',
      tier: 'preferred_brand',
      copay: 35,
      prior_auth: false,
      alternatives: ['Advair', 'Symbicort', 'Dulera'],
      restrictions: [],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M027',
      name: 'Dulera',
      generic_name: 'mometasone/formoterol',
      ndc: '0002-3237-30',
      coverage_status: 'covered',
      tier: 'preferred_brand',
      copay: 35,
      prior_auth: false,
      alternatives: ['Advair', 'Symbicort', 'Breo'],
      restrictions: [],
      quantity_limit: 1,
      refill_limit: 12
    },
    // Bone Fracture Medications
    {
      id: 'M027',
      name: 'Alendronate',
      generic_name: 'alendronate sodium',
      ndc: '0002-3237-30',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 15,
      prior_auth: false,
      alternatives: ['Risedronate', 'Ibandronate'],
      restrictions: ['Age 65+ or high fracture risk', 'Bone density scan required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M028',
      name: 'Fosamax',
      generic_name: 'alendronate sodium',
      ndc: '0002-3238-30',
      coverage_status: 'not_covered',
      tier: 'non_preferred',
      copay: 120,
      prior_auth: false,
      alternatives: ['Alendronate', 'Risedronate', 'Ibandronate'],
      restrictions: ['Brand not covered - generic available', 'Step therapy required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M029',
      name: 'Risedronate',
      generic_name: 'risedronate sodium',
      ndc: '0002-3239-30',
      coverage_status: 'covered',
      tier: 'preferred_brand',
      copay: 25,
      prior_auth: false,
      alternatives: ['Alendronate', 'Ibandronate'],
      restrictions: ['Bone density scan required'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M030',
      name: 'Boniva',
      generic_name: 'ibandronate sodium',
      ndc: '0002-3240-30',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: 50,
      prior_auth: true,
      alternatives: ['Alendronate', 'Risedronate'],
      restrictions: ['Prior auth required', 'Must try generic first', 'Monthly injection only'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M031',
      name: 'Prolia',
      generic_name: 'denosumab',
      ndc: '0002-3241-30',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: 80,
      prior_auth: true,
      alternatives: ['Alendronate', 'Risedronate', 'Ibandronate'],
      restrictions: ['Prior auth required', 'High fracture risk only', 'Specialty pharmacy'],
      quantity_limit: 1,
      refill_limit: 6
    },
    {
      id: 'M032',
      name: 'Forteo',
      generic_name: 'teriparatide',
      ndc: '0002-3242-30',
      coverage_status: 'prior_auth_required',
      tier: 'specialty',
      copay: 150,
      prior_auth: true,
      alternatives: ['Alendronate', 'Risedronate', 'Prolia'],
      restrictions: ['Prior auth required', 'Severe osteoporosis only', '24-month lifetime limit', 'Specialty pharmacy'],
      quantity_limit: 1,
      refill_limit: 24
    },
    {
      id: 'M033',
      name: 'Calcium Carbonate',
      generic_name: 'calcium carbonate',
      ndc: '0002-3243-30',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 5,
      prior_auth: false,
      alternatives: ['Calcium Citrate', 'Calcium Gluconate'],
      restrictions: [],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M034',
      name: 'Vitamin D3',
      generic_name: 'cholecalciferol',
      ndc: '0002-3244-30',
      coverage_status: 'covered',
      tier: 'generic',
      copay: 8,
      prior_auth: false,
      alternatives: ['Calcitriol', 'Ergocalciferol'],
      restrictions: ['Lab values required for high doses'],
      quantity_limit: 1,
      refill_limit: 12
    },
    {
      id: 'M035',
      name: 'Tylenol #3',
      generic_name: 'acetaminophen/codeine',
      ndc: '0002-3245-30',
      coverage_status: 'prior_auth_required',
      tier: 'controlled',
      copay: 20,
      prior_auth: true,
      alternatives: ['Tramadol', 'Ibuprofen', 'Naproxen'],
      restrictions: ['Prior auth required', 'Controlled substance', '7-day supply limit'],
      quantity_limit: 1,
      refill_limit: 3
    },
    {
      id: 'M036',
      name: 'Oxycodone',
      generic_name: 'oxycodone hydrochloride',
      ndc: '0002-3246-30',
      coverage_status: 'prior_auth_required',
      tier: 'controlled',
      copay: 25,
      prior_auth: true,
      alternatives: ['Tramadol', 'Tylenol #3', 'Morphine'],
      restrictions: ['Prior auth required', 'Controlled substance', '5-day supply limit', 'Opioid risk assessment'],
      quantity_limit: 1,
      refill_limit: 2
    }
  ];

  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true);
      
      // Simulate API delay
      const timeoutId = setTimeout(() => {
        const filtered = mockMedications.filter(med =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.generic_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleMedicationSelect = async (medication: any) => {
    setSelectedMedication(medication);
    setSelectedAlternative(null);
    setIsSearching(false);
    setSearchTerm('');

    // Simulate coverage check
    await simulateProcessingDelay(1000);

    // Create coverage result
    const coverageResult = {
      status: medication.coverage_status as 'covered' | 'prior_auth_required' | 'not_covered' | 'step_therapy',
      copay: medication.copay,
      tier: medication.tier,
      prior_auth_required: medication.prior_auth,
      alternatives: medication.alternatives,
      restrictions: medication.restrictions,
      estimated_cost: typeof medication.copay === 'number' ? medication.copay : 0,
    };

    dispatch({
      type: 'SET_COVERAGE_RESULTS',
      payload: [...state.coverageResults, coverageResult],
    });
  };

  const handleAlternativeSelect = async (alternativeName: string) => {
    console.log('handleAlternativeSelect called with:', alternativeName);
    
    // Find the alternative medication in our mock data
    const alternativeMed = mockMedications.find(med => 
      med.name.toLowerCase() === alternativeName.toLowerCase() ||
      med.generic_name.toLowerCase() === alternativeName.toLowerCase()
    );

    console.log('Found alternative medication:', alternativeMed);

    if (alternativeMed) {
      setSelectedAlternative(alternativeMed);
      console.log('Set selectedAlternative to:', alternativeMed);
      
      // Simulate coverage check for alternative
      await simulateProcessingDelay(1000);

      // Create coverage result for alternative
      const coverageResult = {
        status: alternativeMed.coverage_status as 'covered' | 'prior_auth_required' | 'not_covered' | 'step_therapy',
        copay: alternativeMed.copay,
        tier: alternativeMed.tier,
        prior_auth_required: alternativeMed.prior_auth,
        alternatives: alternativeMed.alternatives,
        restrictions: alternativeMed.restrictions,
        estimated_cost: typeof alternativeMed.copay === 'number' ? alternativeMed.copay : 0,
      };

      dispatch({
        type: 'SET_COVERAGE_RESULTS',
        payload: [...state.coverageResults, coverageResult],
      });
    } else {
      console.log('Alternative medication not found in mock data');
    }
  };

  const handlePrescribe = () => {
    const medicationToPrescribe = selectedAlternative || selectedMedication;
    
    if (medicationToPrescribe) {
      const prescription = {
        id: `RX${Date.now()}`,
        medication: medicationToPrescribe,
        quantity: 30,
        days_supply: 30,
        refills: 3,
        prescriber: 'Dr. Sarah Williams, MD',
        date_prescribed: new Date().toISOString().split('T')[0],
        coverage_result: state.coverageResults[state.coverageResults.length - 1],
      };

      dispatch({
        type: 'ADD_PRESCRIPTION',
        payload: prescription,
      });

      setSelectedMedication(null);
      setSelectedAlternative(null);
    }
  };

  const addToPrescriptionList = (medication: any) => {
    const prescriptionItem = {
      id: `RX${Date.now()}`,
      medication: medication,
      quantity: 30,
      instructions: 'Take as directed by your healthcare provider',
      refills: 0,
    };
    
    setPrescriptionList(prev => [...prev, prescriptionItem]);
    setShowPrescriptionList(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            Medication Search
          </h3>
          <div className="flex items-center space-x-3">
            {prescriptionList.length > 0 && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                {prescriptionList.length} in prescription list
              </span>
            )}
            <button
              onClick={() => setShowPrescriptionList(!showPrescriptionList)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {showPrescriptionList ? 'Hide' : 'Show'} Prescription List
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for medications by name or generic name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((medication) => (
              <div
                key={medication.id}
                onClick={() => handleMedicationSelect(medication)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{medication.name}</h4>
                    <p className="text-sm text-gray-600">{medication.generic_name}</p>
                    <p className="text-xs text-gray-500 font-mono">NDC: {medication.ndc}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCoverageStatusColor(medication.coverage_status)}`}>
                      {getCoverageStatusIcon(medication.coverage_status)} {medication.coverage_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Medication Details */}
      {selectedMedication && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Pill className="h-5 w-5 mr-2 text-blue-600" />
            Coverage Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medication Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Medication Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Brand Name:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMedication.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Generic Name:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMedication.generic_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">NDC Code:</span>
                  <span className="text-sm font-mono text-gray-900">{selectedMedication.ndc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tier:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedMedication.tier.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Coverage Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Coverage Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Coverage Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCoverageStatusColor(selectedMedication.coverage_status)}`}>
                    {getCoverageStatusIcon(selectedMedication.coverage_status)} {selectedMedication.coverage_status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patient Copay:</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {typeof selectedMedication.copay === 'number' ? formatCurrency(selectedMedication.copay) : selectedMedication.copay}
                  </span>
                </div>

                {selectedMedication.prior_auth && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Prior Authorization Required</span>
                  </div>
                )}

                {selectedMedication.restrictions.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Restrictions:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {selectedMedication.restrictions.map((restriction: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alternatives */}
          {selectedMedication.alternatives.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Alternative Medications</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMedication.alternatives.map((alternative: string, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Alternative button clicked:', alternative);
                      setClickedAlternative(alternative);
                      handleAlternativeSelect(alternative);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors cursor-pointer border border-blue-200 hover:border-blue-300"
                  >
                    {alternative}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click on any alternative to view coverage details</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setSelectedMedication(null);
                setSelectedAlternative(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => addToPrescriptionList(selectedMedication)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Prescription List
            </button>
            <button
              onClick={handlePrescribe}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Prescribe {selectedAlternative ? 'Alternative' : 'Medication'}
            </button>
          </div>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-yellow-800 mb-2">Debug Info</h4>
          <p className="text-sm text-yellow-700">Selected Alternative: {selectedAlternative ? selectedAlternative.name : 'None'}</p>
          <p className="text-sm text-yellow-700">Clicked Alternative: {clickedAlternative || 'None'}</p>
        </div>
      )}

      {/* Pharmacy List for Selected Medication */}
      {selectedMedication && (
        <PharmacyList medicationName={selectedMedication.name} />
      )}


      {/* Selected Alternative Medication Details */}
      {selectedAlternative && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Pill className="h-5 w-5 mr-2 text-green-600" />
              Alternative Medication Details
            </h3>
            <button
              onClick={() => setSelectedAlternative(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alternative Medication Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Medication Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Brand Name:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedAlternative.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Generic Name:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedAlternative.generic_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">NDC Code:</span>
                  <span className="text-sm font-mono text-gray-900">{selectedAlternative.ndc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tier:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedAlternative.tier.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Alternative Coverage Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Coverage Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Coverage Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCoverageStatusColor(selectedAlternative.coverage_status)}`}>
                    {getCoverageStatusIcon(selectedAlternative.coverage_status)} {selectedAlternative.coverage_status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patient Copay:</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {typeof selectedAlternative.copay === 'number' ? formatCurrency(selectedAlternative.copay) : selectedAlternative.copay}
                  </span>
                </div>

                {selectedAlternative.prior_auth && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Prior Authorization Required</span>
                  </div>
                )}

                {selectedAlternative.restrictions.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Restrictions:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {selectedAlternative.restrictions.map((restriction: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alternative's Alternatives */}
          {selectedAlternative.alternatives.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Other Alternatives</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAlternative.alternatives.map((alt: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAlternativeSelect(alt)}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors cursor-pointer border border-green-200 hover:border-green-300"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setSelectedAlternative(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => addToPrescriptionList(selectedAlternative)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Prescription List
            </button>
            <button
              onClick={() => {
                setSelectedMedication(selectedAlternative);
                setSelectedAlternative(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Select This Alternative
            </button>
          </div>
        </div>
      )}

      {/* Pharmacy List for Selected Alternative */}
      {selectedAlternative && (
        <PharmacyList medicationName={selectedAlternative.name} />
      )}

      {/* Prescription List */}
      {showPrescriptionList && (
        <PrescriptionList 
          prescriptions={prescriptionList}
          onUpdatePrescriptions={setPrescriptionList}
        />
      )}
    </div>
  );
};

export default MedicationSearch;

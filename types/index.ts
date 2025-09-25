export interface Patient {
  id: string;
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  insurance: {
    carrier: string;
    member_id: string;
    group_number: string;
    plan_type: string;
    effective_date: string;
    expiration_date: string;
  };
  consent: {
    data_sharing: boolean;
    insurance_access: boolean;
    prescription_verification: boolean;
    consent_date: string;
  };
}

export interface InsuranceBenefits {
  medical: {
    annual_deductible: number;
    oop_maximum: number;
    deductible_used: number;
    oop_used: number;
    copays: {
      primary_care: number;
      specialist: number;
      emergency: number;
      urgent_care: number;
    };
  };
  prescription: {
    tiers: {
      generic: number;
      preferred_brand: number;
      non_preferred: number;
      specialty: string;
    };
    annual_deductible: number;
    deductible_used: number;
  };
  network_status: 'in_network' | 'out_of_network';
  effective_date: string;
  expiration_date: string;
}

export interface Medication {
  id: string;
  name: string;
  generic_name: string;
  ndc: string;
  coverage_status: 'covered' | 'prior_auth_required' | 'not_covered' | 'step_therapy';
  tier: 'generic' | 'preferred_brand' | 'non_preferred' | 'specialty';
  copay: number | string;
  prior_auth: boolean;
  alternatives: string[];
  restrictions?: string[];
  quantity_limit?: number;
  refill_limit?: number;
}

export interface Prescription {
  id: string;
  medication: Medication;
  quantity: number;
  days_supply: number;
  refills: number;
  prescriber: string;
  date_prescribed: string;
  coverage_result: CoverageResult;
}

export interface CoverageResult {
  status: 'covered' | 'prior_auth_required' | 'not_covered' | 'step_therapy';
  copay: number | string;
  tier: string;
  prior_auth_required: boolean;
  alternatives: string[];
  restrictions: string[];
  estimated_cost: number;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  description: string;
  timestamp: string;
}

export interface EHRData {
  patient_id: string;
  demographics: Patient;
  insurance: InsuranceBenefits;
  medications: Prescription[];
  visits: Visit[];
  alerts: Alert[];
}

export interface Visit {
  id: string;
  date: string;
  provider: string;
  chief_complaint: string;
  diagnosis: string[];
  medications_prescribed: string[];
  follow_up_required: boolean;
}

export interface Alert {
  id: string;
  type: 'coverage' | 'prior_auth' | 'interaction' | 'cost';
  severity: 'low' | 'medium' | 'high';
  message: string;
  medication?: string;
  action_required: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  in_network: boolean;
  benefits: {
    delivery: boolean;
    drive_through: boolean;
    '24_hours': boolean;
    specialty_pharmacy: boolean;
    mail_order: boolean;
    copay_discount: number;
  };
  carriers: string[];
}

export interface DemoState {
  currentPatient: Patient | null;
  insuranceData: InsuranceBenefits | null;
  processingStatus: ProcessingStep[];
  prescriptions: Prescription[];
  coverageResults: CoverageResult[];
  currentStep: 'demo-login' | 'login' | 'consent' | 'insurance' | 'twofa' | 'processing' | 'ehr' | 'prescription';
  isProcessing: boolean;
}

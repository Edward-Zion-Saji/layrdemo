import { Pharmacy } from '@/types';

export const mockPharmacies: Pharmacy[] = [
  {
    id: "PH001",
    name: "CVS Pharmacy",
    address: "123 Beacon St, Boston, MA 02108",
    phone: "(617) 555-1234",
    distance: "0.3 miles",
    in_network: true,
    benefits: {
      delivery: true,
      drive_through: true,
      "24_hours": false,
      specialty_pharmacy: false,
      mail_order: true,
      copay_discount: 0
    },
    carriers: ["Anthem Blue Cross Blue Shield", "UnitedHealthcare", "Aetna", "Cigna"]
  },
  {
    id: "PH002",
    name: "Walgreens",
    address: "456 Boylston St, Boston, MA 02116",
    phone: "(617) 555-5678",
    distance: "0.7 miles",
    in_network: true,
    benefits: {
      delivery: true,
      drive_through: true,
      "24_hours": true,
      specialty_pharmacy: false,
      mail_order: false,
      copay_discount: 2
    },
    carriers: ["Anthem Blue Cross Blue Shield", "UnitedHealthcare", "Aetna", "Cigna"]
  },
  {
    id: "PH003",
    name: "Rite Aid",
    address: "789 Tremont St, Boston, MA 02118",
    phone: "(617) 555-9012",
    distance: "1.2 miles",
    in_network: true,
    benefits: {
      delivery: false,
      drive_through: true,
      "24_hours": false,
      specialty_pharmacy: false,
      mail_order: false,
      copay_discount: 0
    },
    carriers: ["Anthem Blue Cross Blue Shield", "Aetna"]
  },
  {
    id: "PH004",
    name: "Boston Medical Center Pharmacy",
    address: "88 E Newton St, Boston, MA 02118",
    phone: "(617) 555-3456",
    distance: "1.5 miles",
    in_network: true,
    benefits: {
      delivery: false,
      drive_through: false,
      "24_hours": false,
      specialty_pharmacy: true,
      mail_order: false,
      copay_discount: 5
    },
    carriers: ["Anthem Blue Cross Blue Shield", "UnitedHealthcare", "Aetna", "Cigna"]
  },
  {
    id: "PH005",
    name: "Express Scripts Mail Order",
    address: "Remote Service",
    phone: "1-800-555-7890",
    distance: "Mail Order",
    in_network: true,
    benefits: {
      delivery: true,
      drive_through: false,
      "24_hours": false,
      specialty_pharmacy: false,
      mail_order: true,
      copay_discount: 10
    },
    carriers: ["Anthem Blue Cross Blue Shield", "UnitedHealthcare", "Aetna", "Cigna"]
  },
  {
    id: "PH006",
    name: "Local Pharmacy (Out-of-Network)",
    address: "1000 Washington St, Boston, MA 02118",
    phone: "(617) 555-0000",
    distance: "0.5 miles",
    in_network: false,
    benefits: {
      delivery: false,
      drive_through: false,
      "24_hours": false,
      specialty_pharmacy: false,
      mail_order: false,
      copay_discount: 0
    },
    carriers: []
  }
];

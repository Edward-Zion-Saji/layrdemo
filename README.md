# Layr+ Healthcare Integration Platform

A comprehensive unified demo application showcasing healthcare integration that automates benefit verification and provides real-time coverage information within clinical workflows.

## 🚀 Features

### 🏥 EHR System (`/ehr`)
- Electronic Health Records with integrated prescription tools
- Medication search with insurance coverage verification
- Patient data management
- Prescription management with pharmacy integration

### 🏢 Front Desk Portal (`/front-desk`)
- Patient registration and verification
- QR code generation for patient portal access
- Insurance verification workflow
- Patient management dashboard

### 👤 Patient Portal (`/patient-portal`)
- Insurance document upload
- Insurance portal login integration
- Consent management
- Real-time processing simulation

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Codes**: QRCode.js

## 📁 Project Structure

```
unified-app/
├── app/                    # Next.js App Router pages
│   ├── ehr/               # EHR System page
│   ├── front-desk/        # Front Desk Portal page
│   ├── patient-portal/    # Patient Portal page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ehr-system/       # EHR-specific components
│   ├── patient-portal/   # Patient portal components
│   ├── prescription-tool/ # Prescription management
│   └── shared/           # Shared components
├── contexts/             # React contexts
├── data/                 # Mock data files
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd unified-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

The app is configured for automatic deployment to Vercel with the included `vercel.json` configuration.

### Build for Production

```bash
npm run build
npm start
```

## 📱 Usage

### EHR System
- Navigate to `/ehr` to access the EHR system
- Use patient IDs like `patient-1` or `patient-2` for demo data
- Explore medication search, insurance benefits, and document management

### Front Desk Portal
- Navigate to `/front-desk` to manage patient registrations
- Add new patients and generate QR codes
- Track patient verification status

### Patient Portal
- Navigate to `/patient-portal?patient=<patient-id>` for patient access
- Upload insurance documents or login to insurance portals
- Complete verification workflows

## 🔧 Configuration

The app uses mock data for demonstration purposes. In a production environment, you would:

1. Replace mock data with real API calls
2. Implement proper authentication
3. Add real insurance provider integrations
4. Set up secure data storage

## 📄 License

This project is for demonstration purposes only.

## 🤝 Contributing

This is a demo application. For production use, please implement proper security measures and data handling.
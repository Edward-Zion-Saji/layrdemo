import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Layr+ Healthcare Integration Platform',
  description: 'Comprehensive demo showcasing a healthcare integration platform that automates benefit verification and provides real-time coverage information within clinical workflows.',
  keywords: ['healthcare', 'insurance', 'EHR', 'integration', 'benefits', 'verification', 'demo', 'layr'],
  authors: [{ name: 'Layr+ Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-3">
                <img 
                  src="/layr-logo.jpeg" 
                  alt="Layr+ Logo" 
                  className="h-10 w-auto rounded"
                />
                <span className="text-xl font-bold text-gray-900">Layr+</span>
              </a>
              <div className="flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="/ehr" className="text-gray-600 hover:text-gray-900">EHR System</a>
                <a href="/front-desk" className="text-gray-600 hover:text-gray-900">Front Desk</a>
                <a href="/patient-portal" className="text-gray-600 hover:text-gray-900">Patient Portal</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

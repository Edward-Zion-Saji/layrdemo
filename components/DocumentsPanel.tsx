'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  File, 
  Shield, 
  Pill, 
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Upload,
  X,
  Plus,
  Image,
  Table,
  Video
} from 'lucide-react';
import { generatePDF, viewPDF } from '@/lib/pdf-generator';
import { downloadPDF as clientDownloadPDF } from '@/lib/client-download';
import mockDocumentsData from '@/data/mock-documents-extensive.json';

interface Document {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  file_size: string;
  pages: number;
  status: string;
  category: string;
  content: any;
  has_pdf?: boolean;
  pdf_url?: string;
  is_uploaded?: boolean;
  file_type?: string;
}

const DocumentsPanel: React.FC = () => {
  const { state } = useDemo();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showFullDocument, setShowFullDocument] = useState(false);
  const [fullDocumentContent, setFullDocumentContent] = useState<string>('');

  useEffect(() => {
    // Simulate loading documents
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get documents for current patient
        const patientId = state.currentPatient?.id;
        if (patientId) {
          // Mock documents data - in real app this would come from API
          const mockDocuments = getMockDocuments(patientId);
          setDocuments(mockDocuments);
          setFilteredDocuments(mockDocuments);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [state.currentPatient?.id]);

  useEffect(() => {
    // Filter documents based on search term and category
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === filterCategory);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, filterCategory]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    // Simulate uploading files
    const newDocuments: Document[] = uploadedFiles.map((file, index) => ({
      id: `UPLOAD${Date.now()}-${index}`,
      type: 'UPLOADED',
      title: file.name,
      description: `Uploaded document - ${file.type}`,
      date: new Date().toISOString().split('T')[0],
      file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      pages: 1,
      status: 'Current',
      category: 'Uploaded Documents',
      content: {},
      is_uploaded: true,
      file_type: file.type
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
    setFilteredDocuments(prev => [...prev, ...newDocuments]);
    setUploadedFiles([]);
    setShowUploadModal(false);
  };

  const handleDownloadPDF = (document: Document) => {
    // Use setTimeout to ensure this runs after React hydration
    setTimeout(() => {
      try {
        const content = generatePDF(document);
        const success = clientDownloadPDF(content.content, document.title);
        if (!success) {
          console.warn('Download failed, but no error was thrown');
        }
      } catch (error) {
        console.error('Error generating or downloading PDF:', error);
      }
    }, 0);
  };

  const handleViewFullDocument = (document: Document) => {
    if (document.has_pdf) {
      // In a real app, this would open the PDF in a viewer
      const pdfContent = viewPDF(document);
      setFullDocumentContent(pdfContent.content);
      setShowFullDocument(true);
    } else {
      // Generate content for viewing
      const pdfContent = viewPDF(document);
      setFullDocumentContent(pdfContent.content);
      setShowFullDocument(true);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return <File className="h-5 w-5 text-red-600" />;
    if (fileType?.includes('image')) return <Image className="h-5 w-5 text-blue-600" />;
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel')) return <Table className="h-5 w-5 text-green-600" />;
    if (fileType?.includes('video')) return <Video className="h-5 w-5 text-purple-600" />;
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const getMockDocuments = (patientId: string): Document[] => {
    // Return documents based on patient ID from comprehensive data
    if (patientId === 'P011') {
      return mockDocumentsData.documents.P011.documents || [];
    } else if (patientId === 'P012') {
      return mockDocumentsData.documents.P012.documents || [];
    }
    
    // Fallback to basic documents if patient not found
    return [];
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'SBC':
        return <Shield className="h-5 w-5 text-blue-600" />;
      case 'FORMULARY':
        return <Pill className="h-5 w-5 text-green-600" />;
      case 'PLAN_DETAILS':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'HYPERTENSION_GUIDELINES':
      case 'FRACTURE_GUIDELINES':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'EMERGENCY_COVERAGE':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['all', 'Plan Information', 'Prescription Coverage', 'Clinical Guidelines', 'Emergency Coverage', 'Uploaded Documents'];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Insurance Documents</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload PDF</span>
          </button>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {doc.is_uploaded ? getFileIcon(doc.file_type || '') : getDocumentIcon(doc.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      {doc.is_uploaded && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Uploaded
                        </span>
                      )}
                      {doc.has_pdf && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          PDF
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {doc.date}
                      </span>
                      <span>{doc.file_size}</span>
                      <span>{doc.pages} pages</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewFullDocument(doc);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Full Document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPDF(doc);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getDocumentIcon(selectedDocument.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.title}</h3>
                    <p className="text-sm text-gray-600">{selectedDocument.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Document Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedDocument.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{selectedDocument.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{selectedDocument.file_size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pages:</span>
                        <span className="font-medium">{selectedDocument.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.status)}`}>
                          {selectedDocument.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                      </button>
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View Full Document</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Content Preview */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Content Preview</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {selectedDocument.type === 'SBC' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Plan Name:</span> {selectedDocument.content.plan_name}
                        </div>
                        <div>
                          <span className="font-medium">Deductible:</span> {selectedDocument.content.deductible}
                        </div>
                        <div>
                          <span className="font-medium">Out-of-Pocket Max:</span> {selectedDocument.content.out_of_pocket_max}
                        </div>
                        <div>
                          <span className="font-medium">Premium:</span> {selectedDocument.content.premium}
                        </div>
                        <div>
                          <span className="font-medium">Copays:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            <li>Primary Care: {selectedDocument.content.copays.primary_care}</li>
                            <li>Specialist: {selectedDocument.content.copays.specialist}</li>
                            <li>Emergency: {selectedDocument.content.copays.emergency}</li>
                            <li>Urgent Care: {selectedDocument.content.copays.urgent_care}</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedDocument.type === 'FORMULARY' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Tier 1 - Generic:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {selectedDocument.content.tier_1_generic?.slice(0, 5).map((med: string, index: number) => (
                              <li key={index} className="text-sm">• {med}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium">Tier 2 - Preferred Brand:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {selectedDocument.content.tier_2_preferred_brand?.slice(0, 3).map((med: string, index: number) => (
                              <li key={index} className="text-sm">• {med}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedDocument.type === 'HYPERTENSION_GUIDELINES' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Covered Medications:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {selectedDocument.content.covered_medications?.slice(0, 5).map((med: string, index: number) => (
                              <li key={index} className="text-sm">• {med}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedDocument.type === 'FRACTURE_GUIDELINES' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Covered Medications:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {selectedDocument.content.covered_medications?.slice(0, 5).map((med: string, index: number) => (
                              <li key={index} className="text-sm">• {med}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium">Physical Therapy:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {selectedDocument.content.physical_therapy?.slice(0, 3).map((item: string, index: number) => (
                              <li key={index} className="text-sm">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Click to upload documents
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX, TXT, JPG, PNG files accepted
                    </p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Selected Files:</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeUploadedFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    disabled={uploadedFiles.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Upload {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Document Viewer */}
      {showFullDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Full Document View</h3>
                <button
                  onClick={() => setShowFullDocument(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {fullDocumentContent}
                  </pre>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowFullDocument(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (selectedDocument) {
                      handleDownloadPDF(selectedDocument);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPanel;

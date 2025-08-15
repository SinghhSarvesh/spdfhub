import React, { useState, useCallback } from 'react';
import { Upload, Crown, Shield, Lock, Award, Play, Plus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { ToolCard } from '@/components/ui/tool-card';
import { ProgressModal } from '@/components/ui/progress-modal';
import { usePDFProcessor } from '@/hooks/use-pdf-processor';
import type { PDFTool } from '@shared/schema';

const pdfTools: PDFTool[] = [
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    icon: 'fas fa-layer-group',
    category: 'organize',
    color: 'red',
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: 'fas fa-cut',
    category: 'organize',
    color: 'blue',
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: 'fas fa-compress-arrows-alt',
    category: 'organize',
    color: 'green',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files into easy to edit DOC and DOCX documents with 100% accuracy.',
    icon: 'fas fa-file-word',
    category: 'convert',
    color: 'primary',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    icon: 'fas fa-file-pdf',
    category: 'convert',
    color: 'secondary',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Pull data straight from PDFs into Excel spreadsheets in seconds.',
    icon: 'fas fa-file-excel',
    category: 'convert',
    color: 'emerald',
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Add text, images, shapes or annotations to PDF documents.',
    icon: 'fas fa-edit',
    category: 'edit',
    color: 'purple',
    isNew: true,
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Sign yourself or request electronic signatures from others.',
    icon: 'fas fa-signature',
    category: 'edit',
    color: 'indigo',
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Protect PDF files with password. Encrypt documents to prevent access.',
    icon: 'fas fa-lock',
    category: 'security',
    color: 'yellow',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove PDF password security, giving you freedom to use your PDFs.',
    icon: 'fas fa-unlock',
    category: 'security',
    color: 'orange',
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    description: 'Convert scanned PDFs into searchable and selectable documents.',
    icon: 'fas fa-eye',
    category: 'edit',
    color: 'teal',
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark',
    description: 'Stamp image or text over your PDF. Choose typography and transparency.',
    icon: 'fas fa-tint',
    category: 'edit',
    color: 'cyan',
  },
];

const categories = [
  { id: 'all', name: 'All Tools', icon: 'fas fa-th-large' },
  { id: 'organize', name: 'Organize', icon: 'fas fa-sort' },
  { id: 'convert', name: 'Convert', icon: 'fas fa-exchange-alt' },
  { id: 'edit', name: 'Edit', icon: 'fas fa-edit' },
  { id: 'security', name: 'Security', icon: 'fas fa-shield-alt' },
];

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');

  const {
    status,
    progress,
    error,
    result,
    processFiles,
    downloadResult,
    resetState,
  } = usePDFProcessor({
    onSuccess: () => {
      // Progress modal will show download button
    },
    onError: () => {
      // Error will be displayed in progress modal
    },
  });

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleToolClick = useCallback((toolId: string) => {
    const tool = pdfTools.find(t => t.id === toolId);
    if (!tool) return;

    // For client-side routing to individual tool pages
    const toolRoutes = {
      'merge': '/tools/merge-pdf',
      'split': '/tools/split-pdf', 
      'compress': '/tools/compress-pdf',
    };

    if (toolRoutes[toolId as keyof typeof toolRoutes]) {
      window.location.href = toolRoutes[toolId as keyof typeof toolRoutes];
      return;
    }

    // For tools without dedicated pages, show file upload
    if (selectedFiles.length === 0) {
      document.getElementById('file-upload')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setCurrentOperation(tool.name);
    setShowProgressModal(true);
    processFiles(toolId, selectedFiles);
  }, [selectedFiles, processFiles]);

  const handleCloseProgressModal = useCallback(() => {
    setShowProgressModal(false);
    resetState();
  }, [resetState]);

  const filteredTools = activeCategory === 'all' 
    ? pdfTools 
    : pdfTools.filter(tool => tool.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-50 to-secondary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Every tool you need to work with{' '}
              <span className="text-gradient">PDFs</span>{' '}
              in one place
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              All PDF tools are 100% FREE and easy to use! Merge, split, compress, convert, 
              rotate, unlock and watermark PDFs with just a few clicks.
            </p>

            {/* Quick Upload Area */}
            <div className="max-w-2xl mx-auto mb-12" id="file-upload">
              <FileUpload
                onFilesSelected={handleFilesSelected}
                multiple={true}
                className="animate-slide-up"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="explore-tools-button"
              >
                <i className="fas fa-tools mr-2" />
                Explore All Tools
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                data-testid="watch-demo-button"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful PDF Tools at Your Fingertips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive suite of PDF tools designed to handle any document task
            </p>
          </div>

          {/* Tool Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                className={`px-6 py-3 font-medium transition-all ${
                  activeCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary hover:text-white'
                }`}
                onClick={() => setActiveCategory(category.id)}
                data-testid={`filter-${category.id}`}
              >
                <i className={`${category.icon} mr-2`} />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={handleToolClick}
                className="animate-slide-up"
              />
            ))}
          </div>

          {/* Show More Tools */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-gray-100"
              data-testid="show-more-tools"
            >
              <Plus className="w-5 h-5 mr-2" />
              Show All Tools (25+)
            </Button>
          </div>
        </div>
      </section>

      {/* AdSense Banner Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-ad text-gray-400 text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Advertisement Space - 728x90 Leaderboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Work Your Way</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect solution for your workflow and productivity needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Desktop App */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                  alt="Modern office workspace with computer" 
                  className="w-full h-48 object-cover rounded-2xl mb-6" 
                />
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-desktop text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Work Offline with Desktop</h3>
                <p className="text-muted-foreground mb-6">
                  Batch edit and manage documents locally, with no internet and no limits.
                </p>
                <Button className="w-full bg-primary hover:bg-primary-dark" data-testid="desktop-app-button">
                  Download Desktop App
                </Button>
              </CardContent>
            </Card>

            {/* Mobile App */}
            <Card className="bg-gradient-to-br from-secondary/5 to-purple-50 border-0 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                  alt="Mobile phone with business app" 
                  className="w-full h-48 object-cover rounded-2xl mb-6" 
                />
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-mobile-alt text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">On-the-go with Mobile</h3>
                <p className="text-muted-foreground mb-6">
                  Your favorite tools, right in your pocket. Keep working on your projects anytime, anywhere.
                </p>
                <Button className="w-full bg-secondary hover:bg-pink-600" data-testid="mobile-app-button">
                  Get Mobile App
                </Button>
              </CardContent>
            </Card>

            {/* Business Solution */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                  alt="Business team collaboration" 
                  className="w-full h-48 object-cover rounded-2xl mb-6" 
                />
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-building text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Built for Business</h3>
                <p className="text-muted-foreground mb-6">
                  Automate document management, onboard teams easily, and scale with flexible plans.
                </p>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600" data-testid="business-solution-button">
                  Explore Business
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Premium Features */}
          <Card className="bg-gradient-to-br from-primary/10 via-purple-50 to-secondary/10 border-0">
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt="Premium workspace with documents" 
                    className="w-full h-64 object-cover rounded-2xl" 
                  />
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <Crown className="text-white text-2xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">Get More with Premium</h3>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check-circle text-success mr-3" />
                      Get full access to sPdfHub and work offline with Desktop
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check-circle text-success mr-3" />
                      Edit PDFs, get advanced OCR for scanned documents
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check-circle text-success mr-3" />
                      Request secure e-Signatures and digital certificates
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check-circle text-success mr-3" />
                      Connect tools and create custom workflows
                    </li>
                  </ul>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                    data-testid="premium-cta-button"
                  >
                    Get Premium Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Millions Worldwide</h2>
            <p className="text-xl text-muted-foreground">
              The PDF software trusted by millions of users for security and reliability
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Shield className="text-primary text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">ISO27001 Certified</h4>
              <p className="text-muted-foreground">Industry-standard security certification for data protection</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Lock className="text-success text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Secure HTTPS</h4>
              <p className="text-muted-foreground">All data transfers are encrypted with SSL/TLS protocols</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Award className="text-secondary text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">PDF Association</h4>
              <p className="text-muted-foreground">Official member of the PDF Association standards body</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Monthly Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">1B+</div>
              <div className="text-muted-foreground">Files Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-success mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">4.8/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-primary shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 rounded-full"
          data-testid="help-button"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        onClose={handleCloseProgressModal}
        status={status}
        progress={progress}
        operation={currentOperation}
        error={error}
        onDownload={downloadResult}
        onRetry={() => {
          resetState();
          if (selectedFiles.length > 0) {
            processFiles(currentOperation.toLowerCase().replace(' ', '-'), selectedFiles);
          }
        }}
      />
    </div>
  );
}

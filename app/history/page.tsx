'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Clock, AlertTriangle, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';

interface AnalysisHistory {
  id: string;
  documentType: string;
  summary: string;
  analyzedAt: Date;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskCount: { high: number; medium: number; low: number };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AnalysisHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load history from localStorage (in production, this would be from Firestore)
    loadHistory();
  }, []);

  useEffect(() => {
    // Filter history based on search and document type
    let filtered = history;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((item) => item.documentType.toLowerCase() === filterType.toLowerCase());
    }

    setFilteredHistory(filtered);
  }, [searchTerm, filterType, history]);

  const loadHistory = () => {
    try {
      // Get all analyses from localStorage
      const analyses: AnalysisHistory[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('document_analysis_')) {
          const data = localStorage.getItem(key);
          if (data) {
            const analysis = JSON.parse(data);
            
            // Calculate risk counts
            const riskCount = {
              high: analysis.risks?.filter((r: any) => r.level === 'High').length || 0,
              medium: analysis.risks?.filter((r: any) => r.level === 'Medium').length || 0,
              low: analysis.risks?.filter((r: any) => r.level === 'Low').length || 0,
            };

            // Determine overall risk level
            let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
            if (riskCount.high > 0) riskLevel = 'High';
            else if (riskCount.medium > 0) riskLevel = 'Medium';

            analyses.push({
              id: key.replace('document_analysis_', ''),
              documentType: analysis.documentType || 'Legal Document',
              summary: analysis.summary || 'No summary available',
              analyzedAt: new Date(analysis.timestamp || Date.now()),
              riskLevel,
              riskCount,
            });
          }
        }
      }

      // Sort by date (newest first)
      analyses.sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
      setHistory(analyses);
      setFilteredHistory(analyses);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      localStorage.removeItem(`document_analysis_${id}`);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all analysis history? This action cannot be undone.')) {
      // Remove all document analyses
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('document_analysis_')) {
          localStorage.removeItem(key);
        }
      }
      loadHistory();
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBadgeVariant = (level: string): 'destructive' | 'default' | 'secondary' => {
    switch (level) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const documentTypes = ['all', 'contract', 'agreement', 'lease', 'nda', 'terms of service', 'policy'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LegalEase AI</span>
            </Link>
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Analysis History</h1>
          <p className="text-muted-foreground">View and manage your past document analyses</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by document type or summary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {history.length > 0 && (
                  <Button variant="outline" onClick={handleClearAll} className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{history.length}</div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {history.filter((h) => h.riskLevel === 'High').length}
                </div>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {history.filter((h) => h.riskLevel === 'Medium').length}
                </div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {history.filter((h) => h.riskLevel === 'Low').length}
                </div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analyses Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterType !== 'all'
                  ? 'No results match your search criteria. Try adjusting your filters.'
                  : 'Start by analyzing your first document!'}
              </p>
              <Button asChild>
                <Link href="/upload">Analyze Document</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Left: Document Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{item.documentType}</Badge>
                            <Badge variant={getRiskBadgeVariant(item.riskLevel)}>{item.riskLevel} Risk</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                        </div>
                      </div>

                      {/* Risk Breakdown */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {item.analyzedAt.toLocaleDateString()} at {item.analyzedAt.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.riskCount.high > 0 && (
                            <span className="text-red-600">{item.riskCount.high} High</span>
                          )}
                          {item.riskCount.medium > 0 && (
                            <span className="text-yellow-600">{item.riskCount.medium} Medium</span>
                          )}
                          {item.riskCount.low > 0 && (
                            <span className="text-green-600">{item.riskCount.low} Low</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex md:flex-col gap-2">
                      <Button asChild size="sm" className="flex-1 md:flex-none">
                        <Link href={`/results/${item.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 md:flex-none"
                      >
                        <Trash2 className="w-4 h-4 md:mr-2" />
                        <span className="md:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LegalEase AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 LegalEase AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"
import { ProtectedRoute } from "@/components/protected-route"
import { DocumentCard } from "@/components/document-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Trash2, 
  Download,
  Plus,
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react"
import { DocumentRecord } from "@/lib/document-storage"

interface DocumentStats {
  totalDocuments: number
  totalSize: number
  riskBreakdown: { high: number; medium: number; low: number }
  documentTypes: { [key: string]: number }
  recentActivity: number
}

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentRecord[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<'all' | 'high-risk' | 'medium-risk' | 'low-risk' | 'has-deadlines'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'risk' | 'type'>('date')
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // Load documents and stats
  useEffect(() => {
    loadDocuments()
    loadStats()
  }, [])

  // Filter and search documents
  useEffect(() => {
    let filtered = [...documents]

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.originalName.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
        doc.analysis?.summary?.toLowerCase().includes(query)
      )
    }

    // Apply filters
    switch (filterType) {
      case 'high-risk':
        filtered = filtered.filter(doc => doc.riskLevel === 'High')
        break
      case 'medium-risk':
        filtered = filtered.filter(doc => doc.riskLevel === 'Medium')
        break
      case 'low-risk':
        filtered = filtered.filter(doc => doc.riskLevel === 'Low')
        break
      case 'has-deadlines':
        filtered = filtered.filter(doc => doc.hasDeadlines)
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.originalName.localeCompare(b.originalName))
        break
      case 'risk':
        const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
        filtered.sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel])
        break
      case 'type':
        filtered.sort((a, b) => a.documentType.localeCompare(b.documentType))
        break
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        break
    }

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, filterType, sortBy])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents')
      if (!response.ok) throw new Error('Failed to load documents')
      
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/documents?stats=true')
      if (!response.ok) throw new Error('Failed to load stats')
      
      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleDocumentSelect = (document: DocumentRecord, selected: boolean) => {
    const newSelected = new Set(selectedDocuments)
    if (selected) {
      newSelected.add(document.id)
    } else {
      newSelected.delete(document.id)
    }
    setSelectedDocuments(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedDocuments.size === filteredDocuments.length) {
      setSelectedDocuments(new Set())
    } else {
      setSelectedDocuments(new Set(filteredDocuments.map(doc => doc.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedDocuments.size === 0) return
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedDocuments.size} document(s)?`)
    if (!confirmed) return

    try {
      setBulkDeleting(true)
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: Array.from(selectedDocuments) })
      })

      if (!response.ok) throw new Error('Failed to delete documents')

      await loadDocuments()
      await loadStats()
      setSelectedDocuments(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete documents')
    } finally {
      setBulkDeleting(false)
    }
  }

  const handleDocumentView = (document: DocumentRecord) => {
    // Navigate to the results page with the document's analysis
    const analysisId = `doc_${document.id}`
    localStorage.setItem(analysisId, JSON.stringify(document.analysis))
    router.push(`/results/${analysisId}`)
  }

  const handleDocumentDelete = async (document: DocumentRecord) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${document.originalName}"?`)
    if (!confirmed) return

    try {
      const response = await fetch(`/api/documents?id=${document.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete document')

      await loadDocuments()
      await loadStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document')
    }
  }

  const handleDocumentCompare = (document: DocumentRecord) => {
    // Navigate to compare page with this document pre-selected
    router.push(`/compare?doc1=${document.id}`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <NavigationBar />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading documents...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavigationBar />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
              <p className="text-gray-600 mt-1">
                Manage and review your analyzed documents
              </p>
            </div>
            <Button onClick={() => router.push('/upload')} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold">{stats.totalDocuments}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Storage Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">High Risk Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-2xl font-bold">{stats.riskBreakdown.high}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold">{stats.recentActivity}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Documents</option>
                <option value="high-risk">High Risk</option>
                <option value="medium-risk">Medium Risk</option>
                <option value="low-risk">Low Risk</option>
                <option value="has-deadlines">Has Deadlines</option>
              </select>

              {/* Sort */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="risk">Sort by Risk</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>

            {/* View Mode & Bulk Actions */}
            <div className="flex items-center gap-2">
              {selectedDocuments.size > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedDocuments.size} selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleting}
                    className="flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
                  </Button>
                </>
              )}
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Selection */}
          {filteredDocuments.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <label className="text-sm text-gray-600">
                Select all ({filteredDocuments.length} documents)
              </label>
            </div>
          )}

          {/* Documents Grid/List */}
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {documents.length === 0 ? 'No documents yet' : 'No documents match your search'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {documents.length === 0
                    ? 'Upload your first document to get started with AI-powered analysis.'
                    : 'Try adjusting your search or filters to find documents.'}
                </p>
                {documents.length === 0 && (
                  <Button onClick={() => router.push('/upload')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onView={handleDocumentView}
                  onDelete={handleDocumentDelete}
                  onCompare={handleDocumentCompare}
                  onSelect={handleDocumentSelect}
                  selected={selectedDocuments.has(document.id)}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
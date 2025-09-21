"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavigationBar } from "@/components/navigation-bar"
import { ProtectedRoute } from "@/components/protected-route"
import { DocumentCard } from "@/components/document-card"
import { 
  FileText, 
  Upload, 
  History, 
  Users, 
  TrendingUp, 
  Clock, 
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  FolderOpen
} from "lucide-react"
import { DocumentRecord } from "@/lib/document-storage"

interface DocumentStats {
  totalDocuments: number
  totalSize: number
  riskBreakdown: { high: number; medium: number; low: number }
  documentTypes: { [key: string]: number }
  recentActivity: number
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [recentDocuments, setRecentDocuments] = useState<DocumentRecord[]>([])
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load recent documents and stats in parallel
      const [documentsResponse, statsResponse] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/documents?stats=true')
      ])

      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json()
        setRecentDocuments(documentsData.documents?.slice(0, 5) || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      // Failed to load dashboard data
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentView = (document: DocumentRecord) => {
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

      if (response.ok) {
        await loadDashboardData()
      }
    } catch (error) {
      // Failed to delete document
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="text-gray-600">
          Manage your legal document analyses and track your usage.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/upload">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Upload Document</CardTitle>
                  <CardDescription>Analyze a new legal document</CardDescription>
                </div>
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/compare">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Compare Documents</CardTitle>
                  <CardDescription>Side-by-side document comparison</CardDescription>
                </div>
                <ArrowLeftRight className="w-8 h-8 text-orange-600" />
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/documents">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Document Library</CardTitle>
                  <CardDescription>View all your documents</CardDescription>
                </div>
                <FolderOpen className="w-8 h-8 text-green-600" />
              </div>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mr-3" />
                  <div>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalDocuments || 0}</p>
                  <p className="text-sm text-gray-600">Documents Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats?.totalSize || 0)}</p>
                  <p className="text-sm text-gray-600">Storage Used</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.riskBreakdown.high || 0}</p>
                  <p className="text-sm text-gray-600">High Risk Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.recentActivity || 0}</p>
                  <p className="text-sm text-gray-600">Recent Activity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your latest document analyses</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/documents">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-600 mb-6">
                    Upload your first legal document to get started with AI-powered analysis.
                  </p>
                  <Button asChild>
                    <Link href="/upload">Upload Document</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDocuments.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onView={handleDocumentView}
                      onDelete={handleDocumentDelete}
                      compact={true}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Overview & Quick Stats */}
        <div className="space-y-6">
          {/* Risk Breakdown */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Overview</CardTitle>
                <CardDescription>Document risk distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">High Risk</span>
                  </div>
                  <Badge variant="destructive">{stats.riskBreakdown.high}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <Badge variant="secondary">{stats.riskBreakdown.medium}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Low Risk</span>
                  </div>
                  <Badge variant="outline">{stats.riskBreakdown.low}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Types */}
          {stats && Object.keys(stats.documentTypes).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Types</CardTitle>
                <CardDescription>Your document collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.documentTypes).slice(0, 5).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm truncate">{type}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
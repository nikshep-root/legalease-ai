"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  ArrowLeftRight
} from "lucide-react"
import { DocumentRecord } from "@/lib/document-storage"
// Simple date formatting function
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 30) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

interface DocumentCardProps {
  document: DocumentRecord
  onView?: (document: DocumentRecord) => void
  onDelete?: (document: DocumentRecord) => void
  onCompare?: (document: DocumentRecord) => void
  onSelect?: (document: DocumentRecord, selected: boolean) => void
  selected?: boolean
  showActions?: boolean
  compact?: boolean
}

export function DocumentCard({
  document,
  onView,
  onDelete,
  onCompare,
  onSelect,
  selected = false,
  showActions = true,
  compact = false
}: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <AlertTriangle className="w-3 h-3" />
      case 'Medium': return <Clock className="w-3 h-3" />
      case 'Low': return <CheckCircle className="w-3 h-3" />
      default: return <FileText className="w-3 h-3" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(document)
    } finally {
      setIsDeleting(false)
    }
  }

  const uploadDate = new Date(document.uploadDate)
  const lastAccessed = new Date(document.lastAccessed)

  if (compact) {
    return (
      <Card className={`cursor-pointer transition-all hover:shadow-md ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {onSelect && (
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => onSelect(document, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded"
                />
              )}
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {document.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(uploadDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getRiskColor(document.riskLevel)}`}>
                {getRiskIcon(document.riskLevel)}
                <span className="ml-1">{document.riskLevel}</span>
              </Badge>
              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onView?.(document)
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all hover:shadow-lg ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {onSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect(document, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 rounded"
              />
            )}
            <div className="flex-shrink-0">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {document.originalName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {document.documentType} • {formatFileSize(document.fileSize)}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${getRiskColor(document.riskLevel)} flex items-center`}>
            {getRiskIcon(document.riskLevel)}
            <span className="ml-1">{document.riskLevel} Risk</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Tags */}
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{document.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Summary preview */}
          {document.analysis?.summary && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {document.analysis.summary.substring(0, 120)}...
            </p>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Uploaded {formatRelativeTime(uploadDate)}
            </div>
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              Accessed {formatRelativeTime(lastAccessed)}
            </div>
          </div>

          {/* Key indicators */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex space-x-3">
              {document.hasDeadlines && (
                <span className="flex items-center text-orange-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Has Deadlines
                </span>
              )}
              {document.analysis?.risks?.length > 0 && (
                <span className="flex items-center text-red-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {document.analysis.risks.length} Risk{document.analysis.risks.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <span className="text-gray-400">{document.analysisEngine}</span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(document)}
                  className="flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {onCompare && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCompare(document)}
                    className="flex items-center"
                  >
                    <ArrowLeftRight className="w-4 h-4 mr-1" />
                    Compare
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
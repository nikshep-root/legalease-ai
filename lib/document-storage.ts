import fs from 'fs'
import path from 'path'

export interface DocumentRecord {
  id: string
  fileName: string
  originalName: string
  uploadDate: string
  lastAccessed: string
  analysis: any
  fileSize: number
  documentType: string
  tags: string[]
  userId: string
  textContent: string
  analysisEngine: string
  riskLevel: 'High' | 'Medium' | 'Low'
  hasDeadlines: boolean
}

// Check if we're in a serverless environment (like Vercel)
const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME

const DOCUMENTS_FILE = path.join(process.cwd(), 'data', 'documents.json')

// In-memory storage for serverless environments
let memoryDocuments: DocumentRecord[] = []

// Ensure data directory exists (only for local development)
function ensureDataDirectory() {
  if (isServerless) return
  
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read documents from file or memory
function readDocuments(): DocumentRecord[] {
  try {
    if (isServerless) {
      return memoryDocuments
    }
    
    ensureDataDirectory()
    if (!fs.existsSync(DOCUMENTS_FILE)) {
      return []
    }
    const data = fs.readFileSync(DOCUMENTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading documents:', error)
    return []
  }
}

// Write documents to file or memory
function writeDocuments(documents: DocumentRecord[]) {
  try {
    if (isServerless) {
      memoryDocuments = [...documents]
      return
    }
    
    ensureDataDirectory()
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2))
  } catch (error) {
    console.error('Error writing documents file:', error)
  }
}

// Generate smart tags based on document analysis
function generateDocumentTags(analysis: any, textContent: string): string[] {
  const tags: string[] = []
  
  // Add document type tag
  if (analysis?.documentType) {
    tags.push(analysis.documentType)
  }
  
  // Add risk level tag
  if (analysis?.risks && analysis.risks.length > 0) {
    const highRiskCount = analysis.risks.filter((r: any) => r.level === 'High').length
    if (highRiskCount > 0) {
      tags.push('High Risk')
    } else if (analysis.risks.some((r: any) => r.level === 'Medium')) {
      tags.push('Medium Risk')
    } else {
      tags.push('Low Risk')
    }
  }
  
  // Add deadline tag
  if (analysis?.deadlines && analysis.deadlines.length > 0) {
    tags.push('Has Deadlines')
  }
  
  // Add content-based tags
  const content = textContent.toLowerCase()
  if (content.includes('contract') || content.includes('agreement')) {
    tags.push('Contract')
  }
  if (content.includes('employment') || content.includes('employee')) {
    tags.push('Employment')
  }
  if (content.includes('rental') || content.includes('lease')) {
    tags.push('Real Estate')
  }
  if (content.includes('intellectual property') || content.includes('patent') || content.includes('trademark')) {
    tags.push('IP')
  }
  if (content.includes('confidential') || content.includes('nda')) {
    tags.push('Confidential')
  }
  
  // Remove duplicates and limit to 5 tags
  return [...new Set(tags)].slice(0, 5)
}

// Determine overall risk level
function determineRiskLevel(analysis: any): 'High' | 'Medium' | 'Low' {
  if (!analysis?.risks || analysis.risks.length === 0) {
    return 'Low'
  }
  
  const highRiskCount = analysis.risks.filter((r: any) => r.level === 'High').length
  const mediumRiskCount = analysis.risks.filter((r: any) => r.level === 'Medium').length
  
  if (highRiskCount > 0) {
    return 'High'
  } else if (mediumRiskCount > 0) {
    return 'Medium'
  } else {
    return 'Low'
  }
}

export async function saveDocumentRecord(
  userId: string,
  fileName: string,
  originalName: string,
  textContent: string,
  analysis: any,
  fileSize: number
): Promise<string> {
  try {
    const documents = readDocuments()
    
    // Generate document tags based on analysis
    const tags = generateDocumentTags(analysis, textContent)
    
    // Determine risk level
    const riskLevel = determineRiskLevel(analysis)
    
    // Check for deadlines
    const hasDeadlines = analysis?.deadlines?.length > 0 || false
    
    const documentRecord: DocumentRecord = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName,
      originalName,
      uploadDate: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      analysis,
      fileSize,
      documentType: analysis?.documentType || 'Legal Document',
      tags,
      userId,
      textContent,
      analysisEngine: analysis?.engine || 'Gemini',
      riskLevel,
      hasDeadlines
    }

    documents.push(documentRecord)
    writeDocuments(documents)
    
    console.log(`📄 Document saved: ${originalName} (ID: ${documentRecord.id})`)
    return documentRecord.id
    
  } catch (error) {
    console.error('Error saving document record:', error)
    throw new Error('Failed to save document record')
  }
}

export async function getUserDocuments(userId: string): Promise<DocumentRecord[]> {
  try {
    const documents = readDocuments()
    return documents.filter(doc => doc.userId === userId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  } catch (error) {
    console.error('Error getting user documents:', error)
    return []
  }
}

export async function getRecentDocuments(userId: string, limit: number = 5): Promise<DocumentRecord[]> {
  try {
    const documents = await getUserDocuments(userId)
    return documents.slice(0, limit)
  } catch (error) {
    console.error('Error getting recent documents:', error)
    return []
  }
}

export async function getDocumentById(documentId: string, userId: string): Promise<DocumentRecord | null> {
  try {
    const documents = readDocuments()
    const document = documents.find(doc => doc.id === documentId && doc.userId === userId)
    
    if (document) {
      // Update last accessed time
      document.lastAccessed = new Date().toISOString()
      writeDocuments(documents)
    }
    
    return document || null
  } catch (error) {
    console.error('Error getting document by ID:', error)
    return null
  }
}

export async function deleteDocument(documentId: string, userId: string): Promise<boolean> {
  try {
    const documents = readDocuments()
    const filteredDocuments = documents.filter(doc => !(doc.id === documentId && doc.userId === userId))
    
    if (filteredDocuments.length < documents.length) {
      writeDocuments(filteredDocuments)
      console.log(`🗑️ Document deleted: ${documentId}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error deleting document:', error)
    return false
  }
}

export async function searchDocuments(userId: string, query: string): Promise<DocumentRecord[]> {
  try {
    const documents = await getUserDocuments(userId)
    const lowercaseQuery = query.toLowerCase()
    
    return documents.filter(doc => 
      doc.originalName.toLowerCase().includes(lowercaseQuery) ||
      doc.documentType.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      doc.analysis?.summary?.toLowerCase().includes(lowercaseQuery)
    )
  } catch (error) {
    console.error('Error searching documents:', error)
    return []
  }
}

export async function getDocumentStats(userId: string): Promise<{
  totalDocuments: number
  totalSize: number
  riskBreakdown: { high: number; medium: number; low: number }
  documentTypes: { [key: string]: number }
  recentActivity: number
}> {
  try {
    const documents = await getUserDocuments(userId)
    
    const stats = {
      totalDocuments: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + doc.fileSize, 0),
      riskBreakdown: {
        high: documents.filter(doc => doc.riskLevel === 'High').length,
        medium: documents.filter(doc => doc.riskLevel === 'Medium').length,
        low: documents.filter(doc => doc.riskLevel === 'Low').length
      },
      documentTypes: {} as { [key: string]: number },
      recentActivity: documents.filter(doc => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return new Date(doc.uploadDate) > sevenDaysAgo
      }).length
    }
    
    // Count document types
    documents.forEach(doc => {
      const type = doc.documentType || 'Unknown'
      stats.documentTypes[type] = (stats.documentTypes[type] || 0) + 1
    })
    
    return stats
  } catch (error) {
    console.error('Error getting document stats:', error)
    return {
      totalDocuments: 0,
      totalSize: 0,
      riskBreakdown: { high: 0, medium: 0, low: 0 },
      documentTypes: {},
      recentActivity: 0
    }
  }
}

export async function bulkDeleteDocuments(documentIds: string[], userId: string): Promise<number> {
  try {
    const documents = readDocuments()
    const filteredDocuments = documents.filter(doc => 
      !(documentIds.includes(doc.id) && doc.userId === userId)
    )
    
    const deletedCount = documents.length - filteredDocuments.length
    writeDocuments(filteredDocuments)
    
    console.log(`🗑️ Bulk deleted ${deletedCount} documents`)
    return deletedCount
  } catch (error) {
    console.error('Error bulk deleting documents:', error)
    return 0
  }
}
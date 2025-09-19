import { db } from '@/lib/firebase-admin'
import { Timestamp, FieldValue } from 'firebase-admin/firestore'

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

export interface DocumentStats {
  totalDocuments: number
  totalSize: number
  riskBreakdown: { high: number; medium: number; low: number }
  documentTypes: { [key: string]: number }
  recentActivity: number
}

// Collections
const DOCUMENTS_COLLECTION = 'documents'
const USERS_COLLECTION = 'users'

// Helper function to convert Firestore timestamp to ISO string
function timestampToISO(timestamp: any): string {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString()
  }
  return new Date().toISOString()
}

// Helper function to convert document data
function convertDocumentData(docData: any, docId: string): DocumentRecord {
  return {
    id: docId,
    fileName: docData.fileName || '',
    originalName: docData.originalName || '',
    uploadDate: timestampToISO(docData.uploadDate),
    lastAccessed: timestampToISO(docData.lastAccessed),
    analysis: docData.analysis || {},
    fileSize: docData.fileSize || 0,
    documentType: docData.documentType || 'Unknown',
    tags: docData.tags || [],
    userId: docData.userId || '',
    textContent: docData.textContent || '',
    analysisEngine: docData.analysisEngine || '',
    riskLevel: docData.riskLevel || 'Medium',
    hasDeadlines: docData.hasDeadlines || false
  }
}

// Save a new document record
export async function saveDocumentRecord(
  userId: string,
  fileName: string,
  originalName: string,
  textContent: string,
  analysis: any,
  fileSize: number = 0
): Promise<string> {
  try {
    const now = Timestamp.now()
    
    // Extract document type from analysis
    const documentType = analysis.documentType || 'Legal Document'
    
    // Determine risk level
    const riskLevel = analysis.risks && analysis.risks.length > 0 
      ? analysis.risks[0].level || 'Medium'
      : 'Medium'
    
    // Check if document has deadlines
    const hasDeadlines = analysis.deadlines && analysis.deadlines.length > 0
    
    // Generate tags
    const tags = [
      documentType.toLowerCase(),
      riskLevel.toLowerCase(),
      ...(hasDeadlines ? ['deadlines'] : []),
      ...(analysis.keyPoints ? analysis.keyPoints.slice(0, 3).map((point: string) => 
        point.toLowerCase().split(' ').slice(0, 2).join('-')
      ) : [])
    ]

    const documentData = {
      fileName,
      originalName,
      uploadDate: now,
      lastAccessed: now,
      analysis,
      fileSize,
      documentType,
      tags,
      userId,
      textContent,
      analysisEngine: analysis.engine || 'Gemini Pro',
      riskLevel,
      hasDeadlines
    }

    const docRef = await db.collection(DOCUMENTS_COLLECTION).add(documentData)
    console.log(`📄 Document saved to Firestore with ID: ${docRef.id}`)
    
    return docRef.id
  } catch (error) {
    console.error('Error saving document to Firestore:', error)
    throw error
  }
}

// Get all documents for a user
export async function getUserDocuments(userId: string): Promise<DocumentRecord[]> {
  try {
    const querySnapshot = await db.collection(DOCUMENTS_COLLECTION)
      .where('userId', '==', userId)
      .get()
    
    const documents: DocumentRecord[] = []
    
    querySnapshot.forEach((doc) => {
      documents.push(convertDocumentData(doc.data(), doc.id))
    })
    
    // Sort by upload date in JavaScript instead of Firestore
    documents.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    
    return documents
  } catch (error) {
    console.error('Error getting user documents from Firestore:', error)
    return []
  }
}

// Get a specific document by ID
export async function getDocumentById(documentId: string, userId: string): Promise<DocumentRecord | null> {
  try {
    const docRef = db.collection(DOCUMENTS_COLLECTION).doc(documentId)
    const docSnap = await docRef.get()
    
    if (docSnap.exists) {
      const docData = docSnap.data()
      if (docData && docData.userId === userId) {
        // Update last accessed
        await docRef.update({
          lastAccessed: Timestamp.now()
        })
        
        return convertDocumentData(docData, docSnap.id)
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting document by ID from Firestore:', error)
    return null
  }
}

// Delete a document
export async function deleteDocument(documentId: string, userId: string): Promise<boolean> {
  try {
    const docRef = db.collection(DOCUMENTS_COLLECTION).doc(documentId)
    const docSnap = await docRef.get()
    
    if (docSnap.exists) {
      const docData = docSnap.data()
      if (docData && docData.userId === userId) {
        await docRef.delete()
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Error deleting document from Firestore:', error)
    return false
  }
}

// Search documents
export async function searchDocuments(userId: string, searchQuery: string): Promise<DocumentRecord[]> {
  try {
    // Get all user documents first (Firestore doesn't support full-text search natively)
    const userDocuments = await getUserDocuments(userId)
    
    // Filter documents based on search query
    const searchLower = searchQuery.toLowerCase()
    const filteredDocuments = userDocuments.filter(doc => 
      doc.fileName.toLowerCase().includes(searchLower) ||
      doc.originalName.toLowerCase().includes(searchLower) ||
      doc.documentType.toLowerCase().includes(searchLower) ||
      doc.tags.some(tag => tag.includes(searchLower)) ||
      doc.analysis.summary?.toLowerCase().includes(searchLower)
    )
    
    return filteredDocuments
  } catch (error) {
    console.error('Error searching documents in Firestore:', error)
    return []
  }
}

// Bulk delete documents
export async function bulkDeleteDocuments(documentIds: string[], userId: string): Promise<boolean> {
  try {
    const batch = db.batch()
    
    for (const documentId of documentIds) {
      const docRef = db.collection(DOCUMENTS_COLLECTION).doc(documentId)
      const docSnap = await docRef.get()
      
      if (docSnap.exists) {
        const docData = docSnap.data()
        if (docData && docData.userId === userId) {
          batch.delete(docRef)
        }
      }
    }
    
    await batch.commit()
    return true
  } catch (error) {
    console.error('Error bulk deleting documents from Firestore:', error)
    return false
  }
}

// Get document statistics for a user
export async function getDocumentStats(userId: string): Promise<DocumentStats> {
  try {
    const documents = await getUserDocuments(userId)
    
    const stats: DocumentStats = {
      totalDocuments: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + doc.fileSize, 0),
      riskBreakdown: { high: 0, medium: 0, low: 0 },
      documentTypes: {},
      recentActivity: 0
    }
    
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    
    documents.forEach(doc => {
      // Risk breakdown
      const risk = doc.riskLevel.toLowerCase() as 'high' | 'medium' | 'low'
      stats.riskBreakdown[risk]++
      
      // Document types
      stats.documentTypes[doc.documentType] = (stats.documentTypes[doc.documentType] || 0) + 1
      
      // Recent activity
      if (new Date(doc.uploadDate) > oneDayAgo) {
        stats.recentActivity++
      }
    })
    
    return stats
  } catch (error) {
    console.error('Error getting document stats from Firestore:', error)
    return {
      totalDocuments: 0,
      totalSize: 0,
      riskBreakdown: { high: 0, medium: 0, low: 0 },
      documentTypes: {},
      recentActivity: 0
    }
  }
}
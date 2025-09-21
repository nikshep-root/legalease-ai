import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  searchDocuments,
  bulkDeleteDocuments,
  getDocumentStats
} from "@/lib/firebase-document-storage"

// GET /api/documents - Get user's documents or search
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const docId = searchParams.get('id')
    const stats = searchParams.get('stats')

    // Get document stats
    if (stats === 'true') {
      const documentStats = await getDocumentStats(session.user.id)
      return NextResponse.json({ stats: documentStats })
    }

    // Get specific document by ID
    if (docId) {
      const document = await getDocumentById(docId, session.user.id)
      if (!document) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 })
      }
      return NextResponse.json({ document })
    }

    // Search documents or get all
    let documents
    if (query) {
      documents = await searchDocuments(session.user.id, query)
    } else {
      documents = await getUserDocuments(session.user.id)
    }

    return NextResponse.json({ 
      documents,
      total: documents.length
    })

  } catch (error) {
    // Error in documents GET
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/documents - Delete document(s)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const docId = searchParams.get('id')
    
    if (docId) {
      // Delete single document
      const success = await deleteDocument(docId, session.user.id)
      if (!success) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: "Document deleted" })
    } else {
      // Bulk delete
      const body = await request.json()
      const { documentIds } = body
      
      if (!Array.isArray(documentIds) || documentIds.length === 0) {
        return NextResponse.json(
          { error: "Document IDs array is required" },
          { status: 400 }
        )
      }

      const deletedCount = await bulkDeleteDocuments(documentIds, session.user.id)
      return NextResponse.json({ 
        success: true, 
        message: `${deletedCount} documents deleted`,
        deletedCount
      })
    }

  } catch (error) {
    // Error in documents DELETE
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
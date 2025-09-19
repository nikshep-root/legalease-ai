import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserDocuments, getDocumentStats } from "@/lib/firebase-document-storage"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const debugInfo: any = {
      hasSession: !!session,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
      userName: session?.user?.name || null,
      timestamp: new Date().toISOString()
    }

    if (session?.user?.id) {
      try {
        const documents = await getUserDocuments(session.user.id)
        const stats = await getDocumentStats(session.user.id)
        
        debugInfo.documentsCount = documents.length
        debugInfo.documentsFound = documents.map(doc => ({
          id: doc.id,
          fileName: doc.fileName,
          uploadDate: doc.uploadDate
        }))
        debugInfo.stats = stats
      } catch (dbError) {
        debugInfo.databaseError = dbError instanceof Error ? dbError.message : "Unknown DB error"
      }
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
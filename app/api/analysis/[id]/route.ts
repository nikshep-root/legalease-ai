import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

const DOCUMENTS_COLLECTION = "documents"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    // Fetch the document from Firestore
    const docRef = db.collection(DOCUMENTS_COLLECTION).doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    const docData = docSnap.data()

    if (!docData) {
      return NextResponse.json({ error: "Analysis data not found" }, { status: 404 })
    }

    // Return the analysis data
    // Note: We're making this public for sharing, but you could add
    // additional security checks here if needed (e.g., expiry dates, password protection)
    return NextResponse.json({
      id: docSnap.id,
      fileName: docData.fileName,
      documentType: docData.documentType,
      uploadDate: docData.uploadDate?.toDate?.()?.toISOString() || new Date().toISOString(),
      analysis: docData.analysis,
    })
  } catch (error) {
    console.error("Error fetching analysis:", error)
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 })
  }
}

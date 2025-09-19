import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    // Test Firebase Admin connection
    const result = await db.collection('_test').add({
      message: 'Firebase connection test',
      timestamp: new Date().toISOString()
    })
    
    // Clean up test document
    await result.delete()
    
    return NextResponse.json({ 
      success: true, 
      message: "Firebase connection successful",
      firebaseConnected: true
    })
  } catch (error) {
    console.error("Firebase connection test failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      firebaseConnected: false
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if API key exists (but don't expose it)
    const hasGeminiKey = !!process.env.GOOGLE_AI_API_KEY;
    const hasFirebaseKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      hasGeminiApiKey: hasGeminiKey,
      hasFirebaseKey: hasFirebaseKey,
      geminiKeyLength: process.env.GOOGLE_AI_API_KEY?.length || 0,
      nextauthUrl: process.env.NEXTAUTH_URL || 'not set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
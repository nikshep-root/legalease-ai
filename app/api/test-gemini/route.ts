import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key not found in environment variables' 
      })
    }

    console.log('Testing API key:', apiKey.substring(0, 10) + '...')

    // Test the Gemini API with a simple request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello, are you working? Please respond with 'Yes, Gemini API is working correctly!'"
          }]
        }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: `Gemini API Error: ${data.error?.message || 'Unknown error'}`,
        status: response.status,
        details: data
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Gemini API is working!',
      response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text',
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 10) + '...'
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    })
  }
}
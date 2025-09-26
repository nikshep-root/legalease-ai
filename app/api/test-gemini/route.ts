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

    // Try using the GoogleGenerativeAI SDK directly
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try basic models that should work with your API key
    const modelsToTry = [
      'gemini-pro'
    ]

    let lastError = null

    // Test the specific models that are confirmed available
    const availableModels = ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-2.0-flash']
    
    for (const modelName of availableModels) {
      try {
        console.log(`Testing model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working? Please respond with 'Yes, Gemini API is working correctly!'");
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ 
          success: true, 
          message: `Gemini API is working with model: ${modelName}!`,
          model: modelName,
          response: text,
          apiKeyLength: apiKey.length,
          apiKeyPrefix: apiKey.substring(0, 10) + '...'
        })
        
      } catch (modelError: any) {
        console.log(`Model ${modelName} error:`, modelError.message)
        lastError = modelError
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: `No models available or all models failed`,
      details: lastError
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    })
  }
}
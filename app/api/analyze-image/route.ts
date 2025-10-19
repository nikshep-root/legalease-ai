import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Determine mime type
    const mimeType = file.type || 'image/jpeg';

    // Use Gemini Vision model to extract and analyze text from image
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a legal document analyzer. Extract all text from this image and provide a comprehensive legal analysis.

Please analyze the document and provide your response in the following JSON format:

{
  "extractedText": "The complete text extracted from the image",
  "summary": "A comprehensive summary of the document",
  "documentType": "Type of legal document (e.g., Contract, Agreement, NDA, etc.)",
  "keyPoints": ["List of key points from the document"],
  "risks": [
    {
      "level": "High/Medium/Low",
      "description": "Description of the risk",
      "recommendation": "How to mitigate this risk"
    }
  ],
  "obligations": [
    {
      "party": "Who is obligated",
      "description": "What they must do",
      "deadline": "When (if specified)"
    }
  ],
  "importantClauses": [
    {
      "title": "Clause name",
      "content": "Clause content",
      "importance": "Why this clause is important"
    }
  ],
  "deadlines": [
    {
      "description": "What needs to be done",
      "date": "When (if specified)",
      "consequence": "What happens if missed"
    }
  ]
}

Ensure the response is valid JSON only, no additional text.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Failed to parse analysis response');
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
      extractedText: analysis.extractedText,
      processedAt: new Date().toISOString(),
      engine: 'Gemini Vision',
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

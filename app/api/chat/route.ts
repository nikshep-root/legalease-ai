import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { messages, documentAnalysis, documentText } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]?.content || ""
    
    console.log("[Chat] Processing question:", lastMessage.substring(0, 100))
    console.log("[Chat] Has document context:", !!(documentAnalysis || documentText))
    console.log("[Chat] API Key available:", !!process.env.GOOGLE_AI_API_KEY)

    // Try to use Gemini for intelligent responses first
    let response = ""
    try {
      response = await generateGeminiResponse(lastMessage, documentAnalysis, documentText, messages)
      console.log("[Chat] Gemini response generated successfully, length:", response.length)
    } catch (geminiError: any) {
      console.error("[Chat] Gemini failed with error:", geminiError?.message || geminiError)
      console.error("[Chat] Full error:", JSON.stringify(geminiError, null, 2))
      response = generateFallbackResponse(lastMessage, documentAnalysis)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

async function generateGeminiResponse(
  question: string, 
  documentAnalysis: any, 
  documentText: string, 
  messages: any[]
): Promise<string> {
  // Check if API key is available
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("[Chat] Google AI API key is missing!")
    throw new Error("API key not configured")
  }

  // Initialize Gemini AI with the API key
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

  // Filter out initial welcome message and only include actual conversation
  const conversationMessages = messages.filter(msg => 
    !(msg.role === 'assistant' && msg.content.includes("👋 Hello! I'm your AI Legal Assistant"))
  )
  
  const conversationHistory = conversationMessages.slice(-5).map(msg => 
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n\n')

  let prompt = ''
  
  // If we have document context, use it
  if (documentAnalysis || documentText) {
    prompt = `You are a legal document assistant helping users understand their document. You have access to both the full document text and a detailed analysis.

DOCUMENT ANALYSIS:
- Document Type: ${documentAnalysis?.documentType || 'Legal Document'}
- Summary: ${documentAnalysis?.summary || 'Not available'}
- Key Points: ${documentAnalysis?.keyPoints?.join('; ') || 'Not available'}
- Risks: ${documentAnalysis?.risks?.map((r: any) => `${r.level}: ${r.description}`).join('; ') || 'Not available'}
- Obligations: ${documentAnalysis?.obligations?.map((o: any) => `${o.party}: ${o.description}`).join('; ') || 'Not available'}
- Important Clauses: ${documentAnalysis?.importantClauses?.map((c: any) => `${c.title}: ${c.content}`).join('; ') || 'Not available'}
- Deadlines: ${documentAnalysis?.deadlines?.map((d: any) => `${d.description}: ${d.date || 'TBD'}`).join('; ') || 'Not available'}

${documentText ? `DOCUMENT TEXT (excerpt):\n${documentText.substring(0, 2000)}` : ''}

RECENT CONVERSATION:
${conversationHistory}

CURRENT QUESTION: ${question}

Please provide a helpful, accurate response based on the document analysis and text. If you reference specific information, cite where it comes from (analysis vs document text). Keep responses concise but informative.`
  } else {
    // General legal assistant mode - NO DOCUMENT CONTEXT
    prompt = `You are an expert AI Legal Assistant. Answer the user's question about legal concepts with clear, accurate, and helpful information.

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}User's question: ${question}

IMPORTANT INSTRUCTIONS:
- Answer the SPECIFIC question asked
- Provide detailed, educational content
- Use examples and explanations
- Structure with bullet points when helpful
- DO NOT just list topics you can help with
- DO NOT give a generic response about what you can do
- ANSWER THE ACTUAL QUESTION DIRECTLY

Your response:`
  }

  console.log("[Chat] Calling Gemini API with prompt length:", prompt.length)
  
  // Try gemini-2.0-flash first, fallback to gemini-1.5-flash if needed
  let model;
  let modelName = "gemini-2.0-flash";
  
  try {
    model = genAI.getGenerativeModel({ model: modelName })
    console.log("[Chat] Using model:", modelName)
  } catch (modelError: any) {
    console.error("[Chat] Failed to initialize gemini-2.0-flash, trying gemini-1.5-flash:", modelError?.message)
    modelName = "gemini-1.5-flash"
    model = genAI.getGenerativeModel({ model: modelName })
  }
  
  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()
  
  console.log("[Chat] Gemini response received, length:", text.length)
  console.log("[Chat] Response preview:", text.substring(0, 100))
  
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Gemini")
  }
  
  return text
}

function generateFallbackResponse(question: string, documentAnalysis: any): string {
  const lowerQuestion = question.toLowerCase()

  // Document type specific responses
  if (lowerQuestion.includes("what") && lowerQuestion.includes("document")) {
    return documentAnalysis?.documentType
      ? `This appears to be a ${documentAnalysis.documentType}. ${documentAnalysis.summary || "I can help you understand its key provisions."}`
      : "I can help you understand this legal document. What specific aspect would you like to know about?"
  }

  // Summary requests
  if (lowerQuestion.includes("summary") || lowerQuestion.includes("summarize") || lowerQuestion.includes("overview")) {
    return (
      documentAnalysis?.summary ||
      "I can provide a summary of your document. The key points include the main terms, obligations, and important provisions that affect the parties involved."
    )
  }

  // Risk analysis
  if (lowerQuestion.includes("risk") || lowerQuestion.includes("danger") || lowerQuestion.includes("problem")) {
    if (documentAnalysis?.risks?.length > 0) {
      return `Based on the analysis, here are the main risks to consider: ${documentAnalysis.risks.join("; ")}. These should be carefully reviewed with legal counsel.`
    }
    return "I can help identify potential risks in your document. Common risks include unclear terms, unfavorable conditions, or missing protections. What specific concerns do you have?"
  }

  // Obligations and responsibilities
  if (
    lowerQuestion.includes("obligation") ||
    lowerQuestion.includes("responsibility") ||
    lowerQuestion.includes("duty") ||
    lowerQuestion.includes("must")
  ) {
    if (documentAnalysis?.obligations?.length > 0) {
      return `The main obligations identified are: ${documentAnalysis.obligations.join("; ")}. Make sure you understand each requirement and can fulfill them.`
    }
    return "I can help you understand the obligations in your document. These typically include what each party must do, when they must do it, and the consequences of not fulfilling these duties."
  }

  // Deadlines and dates
  if (
    lowerQuestion.includes("deadline") ||
    lowerQuestion.includes("date") ||
    lowerQuestion.includes("when") ||
    lowerQuestion.includes("time")
  ) {
    if (documentAnalysis?.deadlines?.length > 0) {
      return `Important deadlines found: ${documentAnalysis.deadlines.join("; ")}. Mark these dates in your calendar and plan accordingly.`
    }
    return "I can help you identify important dates and deadlines. These might include signing deadlines, performance dates, renewal periods, or termination notices."
  }

  // Key points and terms
  if (lowerQuestion.includes("key") || lowerQuestion.includes("important") || lowerQuestion.includes("main")) {
    if (documentAnalysis?.keyPoints?.length > 0) {
      return `The key points of this document are: ${documentAnalysis.keyPoints.join("; ")}. These are the most important aspects to understand and remember.`
    }
    return "The key points typically include the main purpose, parties involved, financial terms, duration, and termination conditions. What specific area interests you most?"
  }

  // Payment and financial terms
  if (
    lowerQuestion.includes("pay") ||
    lowerQuestion.includes("money") ||
    lowerQuestion.includes("cost") ||
    lowerQuestion.includes("fee")
  ) {
    return "I can help you understand the financial terms in your document. Look for payment amounts, due dates, late fees, and any conditions that might affect costs."
  }

  // Termination and cancellation
  if (lowerQuestion.includes("cancel") || lowerQuestion.includes("terminate") || lowerQuestion.includes("end")) {
    return "For termination provisions, check for notice requirements, cancellation fees, conditions that allow termination, and what happens to obligations after termination."
  }

  // Default helpful response
  return "I'm here to help you understand your legal document. You can ask me about:\n• Summary and overview\n• Key points and important terms\n• Risks and potential issues\n• Obligations and responsibilities\n• Deadlines and important dates\n• Financial terms and payments\n• Termination conditions\n\nWhat would you like to know?"
}

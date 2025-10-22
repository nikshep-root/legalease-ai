import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { messages, documentAnalysis, documentText } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]?.content || ""
    
    console.log("[Chat] Processing question:", lastMessage.substring(0, 100))

    // Try to use Gemini for intelligent responses first
    let response = ""
    try {
      response = await generateGeminiResponse(lastMessage, documentAnalysis, documentText, messages)
      console.log("[Chat] Gemini response generated successfully")
    } catch (geminiError) {
      console.error("[Chat] Gemini failed, using fallback:", geminiError)
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
  const conversationHistory = messages.slice(-5).map(msg => 
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
    // General legal assistant mode
    prompt = `You are an expert AI Legal Assistant helping users understand legal concepts, contract terms, and legal procedures. You provide clear, accurate, and helpful information.

RECENT CONVERSATION:
${conversationHistory}

USER QUESTION: ${question}

Please provide a clear, professional, and helpful response. Use simple language when possible, provide examples if relevant, and structure your response with bullet points or sections when appropriate. Keep responses concise but comprehensive.`
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
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

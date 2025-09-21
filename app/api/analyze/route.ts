import { type NextRequest, NextResponse } from "next/server"
import { geminiAnalyzer } from "@/lib/gemini-analyzer"
import { saveDocumentRecord } from "@/lib/firebase-document-storage"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  let text: string = ""
  let fileName: string = ""

  try {
    // Get session to identify user
    const session = await getServerSession(authOptions)
    
    const body = await request.json()
    text = body.text
    fileName = body.fileName

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text content" }, { status: 400 })
    }

    if (text.trim().length < 10) {
      return NextResponse.json({ error: "Document content is too short for meaningful analysis" }, { status: 400 })
    }

    // Use Gemini for comprehensive document analysis
    const analysis = await geminiAnalyzer.analyzeDocument(text, fileName || "Unknown Document")

    // Save document record if user is authenticated
    let documentId: string | undefined
    if (session?.user?.id) {
      try {
        // Calculate approximate file size (text length * 1.5 for encoding overhead)
        const estimatedFileSize = text.length * 1.5
        
        documentId = await saveDocumentRecord(
          session.user.id,
          fileName || "Unknown Document", 
          fileName || "Unknown Document",
          text,
          { ...analysis, engine: "Gemini Pro" },
          estimatedFileSize
        )
        
      } catch (saveError) {
        // Document saving failed, but continue with response
        // Don't fail the request if document saving fails
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
      documentId: documentId,
      processedAt: new Date().toISOString(),
      engine: "Gemini Pro"
    })

  } catch (error) {
    
    // Provide fallback analysis if Gemini fails
    const fallbackAnalysis = {
      summary: `Document analysis completed for ${fileName || 'uploaded document'}. The document contains ${text.length || 0} characters of content. A detailed AI analysis was not available at this time, but the document has been successfully processed for basic review.`,
      documentType: "Legal Document",
      keyPoints: [
        `Document successfully processed (${text.length || 0} characters)`,
        "Content extracted and ready for review",
        "Manual review recommended for detailed analysis"
      ],
      risks: [{
        level: "Medium" as const,
        description: "Document requires manual review",
        recommendation: "Please review the document manually or try the analysis again"
      }],
      obligations: [],
      importantClauses: [],
      deadlines: []
    }

    return NextResponse.json({
      success: true,
      analysis: fallbackAnalysis,
      processedAt: new Date().toISOString(),
      engine: "Fallback",
      note: "Advanced AI analysis was not available. Basic processing completed."
    })
  }
}

function generateFallbackSummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  const importantSentences = []

  // Look for sentences with key legal terms
  const keyTerms = [
    "agreement",
    "contract",
    "party",
    "parties",
    "shall",
    "must",
    "required",
    "obligation",
    "payment",
    "fee",
    "termination",
    "breach",
    "confidential",
  ]

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase()
    const termCount = keyTerms.filter((term) => lowerSentence.includes(term)).length
    if (termCount >= 2) {
      importantSentences.push(sentence.trim())
    }
  })

  if (importantSentences.length > 0) {
    return importantSentences.slice(0, 3).join(". ") + "."
  }

  // If no important sentences found, create a basic summary
  const firstSentences = sentences.slice(0, 2).join(". ")
  return firstSentences.length > 0
    ? `This document appears to be a legal document containing various terms and conditions. ${firstSentences}.`
    : "This document contains legal terms and conditions that require careful review."
}

function detectDocumentType(fileName: string, text: string): string {
  const lowerText = text.toLowerCase()
  const lowerFileName = fileName.toLowerCase()

  if (lowerText.includes("contract") || lowerFileName.includes("contract")) return "Contract"
  if (lowerText.includes("agreement") || lowerFileName.includes("agreement")) return "Agreement"
  if (lowerText.includes("policy") || lowerFileName.includes("policy")) return "Policy"
  if (lowerText.includes("terms") || lowerText.includes("conditions")) return "Terms & Conditions"
  if (lowerText.includes("lease") || lowerFileName.includes("lease")) return "Lease Agreement"
  if (lowerText.includes("employment") || lowerFileName.includes("employment")) return "Employment Document"
  return "Legal Document"
}

function extractKeyPoints(text: string): string[] {
  const keyPoints = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)

  // Look for important keywords and phrases
  const importantKeywords = [
    "shall",
    "must",
    "required",
    "obligation",
    "responsible",
    "liable",
    "payment",
    "fee",
    "cost",
    "penalty",
    "termination",
    "breach",
    "confidential",
    "proprietary",
    "intellectual property",
    "copyright",
  ]

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase()
    if (importantKeywords.some((keyword) => lowerSentence.includes(keyword))) {
      keyPoints.push(sentence.trim().substring(0, 150) + (sentence.length > 150 ? "..." : ""))
    }
  })

  return keyPoints.slice(0, 6).length > 0
    ? keyPoints.slice(0, 6)
    : [
        "Document contains legal terms and conditions",
        "Professional legal review recommended",
        "Important clauses may require attention",
        "Compliance requirements may apply",
      ]
}

function identifyRisks(text: string): Array<{ level: string; description: string; recommendation: string }> {
  const risks = []
  const lowerText = text.toLowerCase()

  if (lowerText.includes("penalty") || lowerText.includes("fine")) {
    risks.push({
      level: "High",
      description: "Document contains penalty clauses",
      recommendation: "Review penalty terms carefully before agreeing",
    })
  }

  if (lowerText.includes("termination") || lowerText.includes("breach")) {
    risks.push({
      level: "Medium",
      description: "Termination conditions are specified",
      recommendation: "Understand circumstances that could lead to termination",
    })
  }

  if (lowerText.includes("confidential") || lowerText.includes("non-disclosure")) {
    risks.push({
      level: "Medium",
      description: "Confidentiality obligations present",
      recommendation: "Ensure you can comply with confidentiality requirements",
    })
  }

  return risks.length > 0
    ? risks
    : [
        {
          level: "Medium",
          description: "Document complexity requires professional review",
          recommendation: "Consult with a qualified attorney for detailed analysis",
        },
      ]
}

function extractObligations(text: string): Array<{ party: string; description: string; deadline: string }> {
  const obligations = []
  const sentences = text.split(/[.!?]+/)

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase()
    if (lowerSentence.includes("shall") || lowerSentence.includes("must") || lowerSentence.includes("required")) {
      obligations.push({
        party: "Contracting parties",
        description: sentence.trim().substring(0, 100) + (sentence.length > 100 ? "..." : ""),
        deadline: "As specified in document",
      })
    }
  })

  return obligations.slice(0, 4).length > 0
    ? obligations.slice(0, 4)
    : [
        {
          party: "All parties",
          description: "Review and understand all terms before proceeding",
          deadline: "Before signing or agreeing to terms",
        },
      ]
}

function findImportantClauses(text: string): Array<{ title: string; content: string; importance: string }> {
  const clauses = []
  const sections = text.split(/\n\s*\n/)

  sections.forEach((section) => {
    const lowerSection = section.toLowerCase()
    if (lowerSection.includes("payment") || lowerSection.includes("fee")) {
      clauses.push({
        title: "Payment Terms",
        content: section.substring(0, 200) + (section.length > 200 ? "..." : ""),
        importance: "Defines financial obligations and payment schedules",
      })
    }
    if (lowerSection.includes("termination") || lowerSection.includes("end")) {
      clauses.push({
        title: "Termination Clause",
        content: section.substring(0, 200) + (section.length > 200 ? "..." : ""),
        importance: "Specifies conditions under which agreement can be terminated",
      })
    }
  })

  return clauses.slice(0, 3).length > 0
    ? clauses.slice(0, 3)
    : [
        {
          title: "General Terms",
          content: "Various terms and conditions are present in this document",
          importance: "Understanding all terms is crucial before agreement",
        },
      ]
}

function extractDeadlines(text: string): Array<{ description: string; date: string; consequence: string }> {
  const deadlines = []
  const datePattern = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{1,2}\s+(days?|weeks?|months?|years?)\b/gi
  const matches = text.match(datePattern)

  if (matches && matches.length > 0) {
    matches.slice(0, 3).forEach((match) => {
      deadlines.push({
        description: "Time-sensitive obligation identified",
        date: match,
        consequence: "Review document for specific consequences",
      })
    })
  }

  return deadlines.length > 0
    ? deadlines
    : [
        {
          description: "Review document thoroughly",
          date: "Before execution",
          consequence: "Potential legal obligations if not properly reviewed",
        },
      ]
}

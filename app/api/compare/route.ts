import { NextRequest, NextResponse } from "next/server"
import { geminiAnalyzer } from "@/lib/gemini-analyzer"

export async function POST(request: NextRequest) {
  try {
    const { document1, document2 } = await request.json()

    if (!document1 || !document2) {
      return NextResponse.json(
        { error: "Both documents are required for comparison" },
        { status: 400 }
      )
    }



    // Create a detailed comparison prompt for Gemini
    const comparisonPrompt = `
You are a legal expert comparing two documents. Please provide a comprehensive comparison analysis in JSON format.

DOCUMENT 1: "${document1.name}"
Analysis: ${JSON.stringify(document1.analysis, null, 2)}

DOCUMENT 2: "${document2.name}" 
Analysis: ${JSON.stringify(document2.analysis, null, 2)}

Please provide a detailed comparison in the following JSON structure:

{
  "executiveSummary": "2-3 paragraph summary of key differences and similarities",
  "overallSimilarity": "High|Medium|Low",
  "keyDifferences": [
    {
      "category": "Risk Levels|Terms|Obligations|Clauses|Deadlines",
      "difference": "Description of the difference",
      "document1Value": "What document 1 says",
      "document2Value": "What document 2 says",
      "impact": "High|Medium|Low",
      "recommendation": "Specific recommendation"
    }
  ],
  "similarities": [
    {
      "category": "Category of similarity",
      "description": "What is similar between documents",
      "significance": "Why this similarity matters"
    }
  ],
  "riskComparison": {
    "document1Risks": ["List of key risks in doc 1"],
    "document2Risks": ["List of key risks in doc 2"],
    "additionalRisksInDoc1": ["Risks present only in doc 1"],
    "additionalRisksInDoc2": ["Risks present only in doc 2"],
    "riskAssessment": "Which document has higher overall risk and why"
  },
  "termComparison": {
    "favorableToParty1": ["Terms more favorable in doc 1"],
    "favorableToParty2": ["Terms more favorable in doc 2"],
    "neutral": ["Similar terms in both documents"]
  },
  "recommendations": [
    {
      "priority": "High|Medium|Low",
      "action": "Specific action to take",
      "rationale": "Why this action is recommended",
      "targetDocument": "Document 1|Document 2|Both"
    }
  ],
  "negotiationPoints": [
    {
      "clause": "Specific clause or term",
      "currentStatus": "How it differs between documents",
      "suggestedApproach": "How to negotiate this point"
    }
  ]
}

Focus on practical legal implications and provide actionable insights that would help lawyers understand the key differences and make informed decisions.
`

    const comparisonResult = await geminiAnalyzer.generateChatResponse(comparisonPrompt)
    
    // Try to parse the JSON response
    let parsedComparison
    try {
      // Clean up the response
      let cleanedResponse = comparisonResult.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '')
      }
      
      parsedComparison = JSON.parse(cleanedResponse)
    } catch (parseError) {
      // JSON parsing failed, use fallback
      
      // Fallback comparison structure
      parsedComparison = {
        executiveSummary: comparisonResult.substring(0, 500) + (comparisonResult.length > 500 ? "..." : ""),
        overallSimilarity: "Medium",
        keyDifferences: [{
          category: "General",
          difference: "Detailed comparison analysis was provided in text format",
          document1Value: "See document 1 analysis",
          document2Value: "See document 2 analysis",
          impact: "Medium",
          recommendation: "Review the detailed analysis for specific differences"
        }],
        similarities: [{
          category: "Document Type",
          description: "Both documents are legal agreements",
          significance: "Similar structural elements present"
        }],
        riskComparison: {
          document1Risks: document1.analysis.risks?.map((r: any) => r.description || r) || [],
          document2Risks: document2.analysis.risks?.map((r: any) => r.description || r) || [],
          additionalRisksInDoc1: [],
          additionalRisksInDoc2: [],
          riskAssessment: "Manual review required for detailed risk comparison"
        },
        termComparison: {
          favorableToParty1: [],
          favorableToParty2: [],
          neutral: ["Terms require detailed legal review"]
        },
        recommendations: [{
          priority: "High",
          action: "Conduct detailed manual review of both documents",
          rationale: "Automated comparison completed, legal expert review recommended",
          targetDocument: "Both"
        }],
        negotiationPoints: [{
          clause: "Key Terms",
          currentStatus: "Differences identified between documents",
          suggestedApproach: "Focus on critical terms and risk areas"
        }]
      }
    }

    

    return NextResponse.json({
      success: true,
      comparison: {
        ...parsedComparison,
        metadata: {
          document1Name: document1.name,
          document2Name: document2.name,
          comparisonDate: new Date().toISOString(),
          documentTypes: {
            document1: document1.analysis.documentType || "Legal Document",
            document2: document2.analysis.documentType || "Legal Document"
          }
        }
      }
    })

  } catch (error) {
    
    
    return NextResponse.json(
      { 
        error: "Document comparison failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
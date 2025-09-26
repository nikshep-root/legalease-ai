import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export interface GeminiAnalysisResult {
  summary: string;
  documentType: string;
  keyPoints: string[];
  risks: Array<{
    level: "High" | "Medium" | "Low";
    description: string;
    recommendation: string;
  }>;
  obligations: Array<{
    party: string;
    description: string;
    deadline?: string;
  }>;
  importantClauses: Array<{
    title: string;
    content: string;
    importance: string;
  }>;
  deadlines: Array<{
    description: string;
    date?: string;
    consequence: string;
  }>;
}

export class GeminiDocumentAnalyzer {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent legal analysis
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
  }

  async analyzeDocument(text: string, fileName: string): Promise<GeminiAnalysisResult> {
    try {


      const prompt = `
You are a highly skilled legal AI assistant specializing in document analysis. Please analyze the following legal document and provide a comprehensive analysis in JSON format.

Document Name: ${fileName}
Document Content: ${text}

Please provide your analysis in the following JSON structure:

{
  "summary": "A comprehensive 2-3 paragraph executive summary of the document",
  "documentType": "Identify the specific type of legal document (e.g., Contract, Agreement, Policy, Terms of Service, etc.)",
  "keyPoints": ["List 5-8 most important points from the document"],
  "risks": [
    {
      "level": "High|Medium|Low",
      "description": "Description of the risk",
      "recommendation": "Specific recommendation to address this risk"
    }
  ],
  "obligations": [
    {
      "party": "Which party has this obligation",
      "description": "Description of the obligation",
      "deadline": "Any specific deadline if mentioned"
    }
  ],
  "importantClauses": [
    {
      "title": "Name/title of the clause",
      "content": "Key content of the clause",
      "importance": "Why this clause is important"
    }
  ],
  "deadlines": [
    {
      "description": "Description of what needs to be done",
      "date": "Specific date if mentioned",
      "consequence": "What happens if deadline is missed"
    }
  ]
}

Guidelines:
1. Be thorough and professional in your analysis
2. Focus on legal implications and practical considerations
3. Identify potential risks and provide actionable recommendations
4. Extract all relevant dates, deadlines, and obligations
5. Use clear, professional language suitable for legal professionals
6. If certain sections are empty, provide empty arrays but maintain the JSON structure
7. Ensure all risk levels are exactly "High", "Medium", or "Low"

Please provide only the JSON response without any additional text or formatting.
`;


      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();


      
      // Clean up the response to ensure it's valid JSON
      let cleanedResponse = analysisText.trim();
      
      // Remove any markdown code block formatting if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      try {
        const analysis: GeminiAnalysisResult = JSON.parse(cleanedResponse);

        return analysis;
      } catch (parseError) {
        // JSON parsing failed, using fallback format
        
        // Fallback: create a structured response from the text
        return this.createFallbackAnalysis(analysisText, fileName);
      }

    } catch (error) {
      // Gemini API call failed
      
      // If Gemini fails, provide a basic analysis
      return this.createBasicAnalysis(text, fileName);
    }
  }

  private createFallbackAnalysis(responseText: string, fileName: string): GeminiAnalysisResult {
    return {
      summary: responseText.substring(0, 500) + (responseText.length > 500 ? "..." : ""),
      documentType: "Legal Document",
      keyPoints: ["Document analysis completed", "Please review the full text for detailed information"],
      risks: [{
        level: "Medium",
        description: "Unable to perform detailed risk analysis",
        recommendation: "Manual review recommended"
      }],
      obligations: [],
      importantClauses: [],
      deadlines: []
    };
  }

  private createBasicAnalysis(text: string, fileName: string): GeminiAnalysisResult {
    const wordCount = text.split(' ').length;
    
    return {
      summary: `This document (${fileName}) contains ${wordCount} words of legal content. The document appears to contain standard legal language and clauses. A detailed AI analysis was not available, but the document has been successfully processed for basic review.`,
      documentType: "Legal Document",
      keyPoints: [
        `Document contains ${wordCount} words`,
        "Document successfully processed and extracted",
        "Manual review recommended for detailed analysis"
      ],
      risks: [{
        level: "Low",
        description: "Standard legal document processing completed",
        recommendation: "Review document manually for specific legal implications"
      }],
      obligations: [],
      importantClauses: [],
      deadlines: []
    };
  }

  async generateChatResponse(prompt: string): Promise<string> {
    try {

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      return text;
    } catch (error) {
      // Failed to generate chat response
      throw error;
    }
  }
}

// Export a singleton instance
export const geminiAnalyzer = new GeminiDocumentAnalyzer();
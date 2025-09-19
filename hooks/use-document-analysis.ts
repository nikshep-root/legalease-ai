"use client"

import { useState, useCallback } from "react"
import type { DocumentAnalysis } from "@/lib/document-processor"
import { analyzeDocument, extractTextFromFile } from "@/lib/document-processor"

interface UseDocumentAnalysisReturn {
  analysis: DocumentAnalysis | null
  isAnalyzing: boolean
  error: string | null
  analyzeFile: (file: File) => Promise<void>
  clearAnalysis: () => void
}

export function useDocumentAnalysis(): UseDocumentAnalysisReturn {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeFile = useCallback(async (file: File) => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      // Extract text from file
      const text = await extractTextFromFile(file)

      // Analyze the document
      const result = await analyzeDocument(text, file.name)
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const clearAnalysis = useCallback(() => {
    setAnalysis(null)
    setError(null)
  }, [])

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeFile,
    clearAnalysis,
  }
}

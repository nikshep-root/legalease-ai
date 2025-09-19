"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  FileText, 
  ArrowLeftRight, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Loader2
} from "lucide-react"
import { ComparisonResults } from "@/components/comparison-results"
import { extractTextFromFile } from "@/lib/document-processor"

interface DocumentState {
  file: File | null
  analysis: any | null
  isUploading: boolean
  error: string | null
}

export default function ComparePage() {
  const router = useRouter()
  const [document1, setDocument1] = useState<DocumentState>({
    file: null,
    analysis: null,
    isUploading: false,
    error: null
  })
  const [document2, setDocument2] = useState<DocumentState>({
    file: null,
    analysis: null,
    isUploading: false,
    error: null
  })
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<any>(null)
  
  const fileInput1Ref = useRef<HTMLInputElement>(null)
  const fileInput2Ref = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File, documentNumber: 1 | 2) => {
    const setDoc = documentNumber === 1 ? setDocument1 : setDocument2
    
    setDoc(prev => ({
      ...prev,
      file,
      isUploading: true,
      error: null,
      analysis: null
    }))

    try {
      // First extract text from the PDF file
      console.log(`[Compare] Extracting text from ${file.name}...`)
      const text = await extractTextFromFile(file)
      console.log(`[Compare] Extracted ${text.length} characters from ${file.name}`)

      if (!text || text.trim().length < 10) {
        throw new Error("Could not extract sufficient text from the document. Please ensure it's a valid PDF with readable content.")
      }

      // Then send the extracted text to the analyze API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          fileName: file.name
        }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      setDoc(prev => ({
        ...prev,
        analysis: result.analysis,
        isUploading: false
      }))

    } catch (error) {
      console.error("Error analyzing document:", error)
      setDoc(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Analysis failed",
        isUploading: false
      }))
    }
  }

  const handleCompare = async () => {
    if (!document1.analysis || !document2.analysis) return

    setIsComparing(true)
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document1: {
            name: document1.file?.name,
            analysis: document1.analysis
          },
          document2: {
            name: document2.file?.name,
            analysis: document2.analysis
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`Comparison failed: ${response.statusText}`)
      }

      const result = await response.json()
      setComparisonResult(result.comparison)

    } catch (error) {
      console.error("Error comparing documents:", error)
      // Handle error
    } finally {
      setIsComparing(false)
    }
  }

  const DocumentUploadCard = ({ 
    document, 
    documentNumber, 
    onFileSelect 
  }: { 
    document: DocumentState
    documentNumber: 1 | 2
    onFileSelect: (file: File) => void 
  }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document {documentNumber}
        </CardTitle>
        <CardDescription>
          Upload {documentNumber === 1 ? "first" : "second"} document for comparison
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!document.file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => {
              if (documentNumber === 1) {
                fileInput1Ref.current?.click()
              } else {
                fileInput2Ref.current?.click()
              }
            }}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your document here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <Button variant="outline">
              Choose File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {document.file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(document.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {document.isUploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Analyzing document...</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}

            {document.error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {document.error}
                </AlertDescription>
              </Alert>
            )}

            {document.analysis && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis complete</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (documentNumber === 1) {
                  setDocument1({ file: null, analysis: null, isUploading: false, error: null })
                  fileInput1Ref.current?.click()
                } else {
                  setDocument2({ file: null, analysis: null, isUploading: false, error: null })
                  fileInput2Ref.current?.click()
                }
              }}
            >
              Choose Different File
            </Button>
          </div>
        )}

        <input
          ref={documentNumber === 1 ? fileInput1Ref : fileInput2Ref}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileSelect(file)
          }}
        />
      </CardContent>
    </Card>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Comparison
            </h1>
            <p className="text-gray-600">
              Upload two documents to compare their legal terms, clauses, and identify key differences.
            </p>
          </div>

          {!comparisonResult ? (
            <>
              {/* Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <DocumentUploadCard
                  document={document1}
                  documentNumber={1}
                  onFileSelect={(file) => handleFileSelect(file, 1)}
                />
                
                <DocumentUploadCard
                  document={document2}
                  documentNumber={2}
                  onFileSelect={(file) => handleFileSelect(file, 2)}
                />
              </div>

              {/* Compare Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleCompare}
                  disabled={!document1.analysis || !document2.analysis || isComparing}
                  className="px-8"
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Comparing Documents...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="w-4 h-4 mr-2" />
                      Compare Documents
                    </>
                  )}
                </Button>
                
                {(!document1.analysis || !document2.analysis) && (
                  <p className="text-sm text-gray-500 mt-2">
                    Upload and analyze both documents to enable comparison
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Comparison Results */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Comparison Results</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setComparisonResult(null)
                    setDocument1({ file: null, analysis: null, isUploading: false, error: null })
                    setDocument2({ file: null, analysis: null, isUploading: false, error: null })
                  }}
                >
                  New Comparison
                </Button>
              </div>
              
              <ComparisonResults comparison={comparisonResult} />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
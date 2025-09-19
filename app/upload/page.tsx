"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { extractTextFromFile, analyzeDocument } from "@/lib/document-processor"

interface UploadedFile {
  file: File
  id: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
  analysisId?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const router = useRouter()

  const performAnalysis = useCallback(async (fileData: UploadedFile) => {
    const fileId = fileData.id

    try {
      console.log("[v0] Starting analysis for file:", fileData.file.name)

      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress: 10 } : file)))

      const extractionPromise = extractTextFromFile(fileData.file)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Text extraction timeout")), 30000),
      )

      const text = (await Promise.race([extractionPromise, timeoutPromise])) as string
      console.log("[v0] Text extracted, length:", text.length)

      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress: 30 } : file)))

      if (!text || text.trim().length === 0) {
        throw new Error("No text content found in document")
      }

      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress: 50 } : file)))

      const analysisPromise = analyzeDocument(text, fileData.file.name)
      const analysisTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Analysis timeout")), 60000),
      )

      const analysis = await Promise.race([analysisPromise, analysisTimeoutPromise])
      console.log("[v0] Analysis completed successfully")

      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress: 90 } : file)))

      // Store analysis result and mark as completed
      const analysisId = `analysis_${fileId}_${Date.now()}`

      // Store in localStorage for now (in production, use proper backend)
      localStorage.setItem(analysisId, JSON.stringify(analysis))
      console.log("[v0] Analysis stored with ID:", analysisId)

      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status: "completed", analysisId, progress: 100 } : file)),
      )

      setTimeout(() => {
        console.log("[v0] Auto-redirecting to results page")
        router.push(`/results/${analysisId}`)
      }, 1500)
    } catch (error) {
      console.error("[v0] Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze document"
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status: "error", error: errorMessage } : file)),
      )
    }
  }, [router])

  // Process a single uploaded file: handle upload progress and start analysis
  const processFile = useCallback(async (fileData: UploadedFile) => {
    const fileId = fileData.id

    try {
      let progress = 0
      const progressIncrement = 20
      const uploadInterval = setInterval(() => {
        progress += progressIncrement
        if (progress >= 100) {
          progress = 100
          clearInterval(uploadInterval)

          setFiles((prev) =>
            prev.map((file) => (file.id === fileId ? { ...file, status: "processing", progress: 100 } : file)),
          )

          // Start actual analysis
          performAnalysis(fileData)
        } else {
          setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)))
        }
      }, 300) // Increased interval for more stable progress

      setTimeout(() => {
        clearInterval(uploadInterval)
        if (progress < 100) {
          setFiles((prev) =>
            prev.map((file) => (file.id === fileId ? { ...file, status: "error", error: "Upload timeout" } : file)),
          )
        }
      }, 10000) // 10 second timeout
    } catch (error) {
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status: "error", error: "Failed to process file" } : file)),
      )
    }
  }, [performAnalysis])

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const isValidType = file.type === "application/pdf" || file.type === "text/plain"
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])

    uploadedFiles.forEach((uploadedFile) => {
      processFile(uploadedFile)
    })
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }, [handleFiles])

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const viewResults = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file?.analysisId) {
      router.push(`/results/${file.analysisId}`)
    }
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Analyzing document..."
      case "completed":
        return "Analysis complete"
      case "error":
        return "Error occurred"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LegalEase AI</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Your Legal Document</h1>
          <p className="text-xl text-muted-foreground">
            Upload a PDF or text file to get AI-powered analysis and insights
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop your files here</h3>
              <p className="text-muted-foreground mb-4">or click to browse and select files</p>
              <input
                type="file"
                multiple
                accept=".pdf,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <Button asChild>
                <label htmlFor="file-input" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">Supports PDF and TXT files up to 10MB each</p>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Track the progress of your document analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <FileText className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{file.file.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <span className="text-sm text-muted-foreground">{getStatusText(file.status)}</span>
                      </div>
                    </div>
                    {(file.status === "uploading" || file.status === "processing") && (
                      <Progress value={file.progress} className="h-2" />
                    )}
                    {file.error && <p className="text-sm text-destructive mt-1">{file.error}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <div className="flex gap-2">
                        {file.status === "completed" && (
                          <Button size="sm" onClick={() => viewResults(file.id)}>
                            View Results
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => removeFile(file.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• PDF documents</li>
                <li>• Plain text files (.txt)</li>
                <li>• Maximum 10MB per file</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What We Analyze</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Key clauses and terms</li>
                <li>• Potential risks</li>
                <li>• Important deadlines</li>
                <li>• Obligations and rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Documents processed securely</li>
                <li>• No permanent storage</li>
                <li>• End-to-end encryption</li>
                <li>• GDPR compliant</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Utility functions for document-processor.ts

// We need to dynamically import pdfjsLib to avoid SSR issues in Next.js
import { extractTextWithOcr } from "@/lib/ocr-processor"

let pdfjsLib: any = null

async function loadPdfjsLib() {
  if (!pdfjsLib && typeof window !== "undefined") {
    try {
      console.log("[v0] Loading PDF.js library...")
      const pdfjs = await import("pdfjs-dist")
      
      // Check if the import was successful
      if (!pdfjs || !pdfjs.getDocument) {
        throw new Error("PDF.js library did not load properly")
      }
      
      pdfjsLib = pdfjs
      
      // Set the worker source - this is needed for pdf.js to work in the browser
      // We're using the CDN version to avoid issues with Next.js server-side rendering
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
      }
      
      console.log("[v0] PDF.js library loaded successfully")
    } catch (error) {
      console.error("Failed to load PDF.js:", error)
      throw new Error("Failed to load PDF processing library. Please refresh the page and try again.")
    }
  }
  return pdfjsLib
}

export interface DocumentAnalysis {
  summary: string
  documentType: string
  keyPoints: string[]
  risks: Array<{
    level: "High" | "Medium" | "Low"
    description: string
    recommendation: string
  }>
  obligations: Array<{
    party: string
    description: string
    deadline?: string
  }>
  importantClauses: Array<{
    title: string
    content: string
    importance: string
  }>
  deadlines: Array<{
    description: string
    date?: string
    consequence: string
  }>
}

export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (file.type === "application/pdf") {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        reject(new Error("PDF processing is only available in browser environment"))
        return
      }

      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          console.log("[v0] Starting PDF text extraction...")
          const arrayBuffer = event.target?.result as ArrayBuffer
          if (!arrayBuffer) {
            reject(new Error("Failed to read PDF file - no data received"))
            return
          }

          // Load pdfjsLib dynamically to avoid SSR issues
          const pdfjsLib = await loadPdfjsLib()
          if (!pdfjsLib || !pdfjsLib.getDocument) {
            throw new Error("PDF processing library failed to load properly")
          }

          console.log("[v0] Loading PDF document...")
          
          // Configure PDF.js loading options
          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            verbosity: 0, // Reduce console noise
            isEvalSupported: false, // Security setting
          })
          
          const pdf = await loadingTask.promise
          let fullText = ""

          console.log("[v0] PDF loaded, extracting text from", pdf.numPages, "pages...")

          // Extract text from all pages
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            
            let pageText = ""
            let hasTextContent = false
            
            // Check if textContent has items and is not empty
            if (textContent && textContent.items && textContent.items.length > 0) {
              pageText = textContent.items.map((item: any) => item.str).join(" ").trim()
              if (pageText.length > 10) { // Only consider substantial text
                fullText += pageText + "\n"
                hasTextContent = true
                console.log("[v0] Extracted text from page", i, "- length:", pageText.length)
              }
            }
            
            // If no substantial text content found, use OCR
            if (!hasTextContent) {
              console.log("[v0] No substantial text content found on page", i, "- trying OCR")
              // Add a fallback for image-based PDFs using OCR
  try {
    if (typeof document !== "undefined") {
      console.log("[v0] Creating canvas for OCR processing on page", i)
      // Render PDF page to canvas for OCR with higher quality
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        console.warn('Failed to get canvas context for OCR on page', i)
        continue
      }

      // Use higher scale for better OCR quality
      const viewport = page.getViewport({ scale: 2.0 })
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      console.log("[v0] Rendering page", i, "to canvas with dimensions:", canvas.width, "x", canvas.height)

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise
      
      console.log("[v0] Page", i, "rendered successfully, starting OCR...")

      // Use canvas directly for OCR (more efficient)
      const { extractTextFromCanvas } = await import("./ocr-processor")
      const ocrText = await extractTextFromCanvas(canvas)
      
      if (ocrText && ocrText.trim().length > 0) {
        fullText += ocrText + "\n"
        console.log("[v0] ✅ Extracted text via OCR from page", i, "- length:", ocrText.length)
        console.log("[v0] OCR preview:", ocrText.substring(0, 100) + "...")
      } else {
        console.log("[v0] ❌ OCR returned no text for page", i)
      }
    } else {
      console.warn("[v0] Document not available for OCR on page", i)
    }
  } catch (ocrError) {
    console.error("[v0] ❌ OCR failed for page", i, "Error:", ocrError)
    // Continue processing other pages even if OCR fails for one page
  }
}
          }

          const text = fullText.trim()

          if (text.length < 50) {
            console.log("[v0] PDF extracted very little text (", text.length, "characters):", text.substring(0, 50))
            // Instead of rejecting, resolve with a more informative message
            resolve(`Limited text extracted from PDF (${text.length} characters): ${text}. This may be a scanned document with poor OCR results. Please try with a higher quality PDF or contact support for assistance.`)
            return
          }

          console.log("[v0] Successfully extracted text from PDF:", text.substring(0, 100) + "...")
          resolve(text)
        } catch (error) {
          console.error("[v0] PDF parsing error:", error)
          // Provide more specific error messages based on common PDF issues
          if (error instanceof Error) {
            if (error.message.includes("Invalid PDF structure")) {
              reject(new Error("Invalid PDF structure. The file may be corrupted or not a valid PDF."))
            } else if (error.message.includes("Unexpected server response")) {
              reject(new Error("Failed to load PDF worker. Please check your internet connection and try again."))
            } else {
              reject(new Error(`Failed to extract text from PDF: ${error.message}`))
            }
          } else {
            reject(new Error("Failed to extract text from PDF due to an unknown error."))
          }
        }
      }
      reader.onerror = (event) => {
        console.error("[v0] FileReader error:", event)
        reject(new Error("Error reading PDF file. The file may be corrupted or inaccessible."))
      }
      reader.readAsArrayBuffer(file)
    } else {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === "string") {
          if (result.trim().length === 0) {
            reject(new Error("Document appears to be empty"))
            return
          }
          resolve(result)
        } else {
          reject(new Error("Failed to read file as text"))
        }
      }
      reader.onerror = (event) => {
        console.error("[v0] FileReader text error:", event)
        reject(new Error("Error reading text file. The file may be corrupted or inaccessible."))
      }
      reader.readAsText(file)
    }
  })
}

export async function analyzeDocument(text: string, fileName: string): Promise<DocumentAnalysis> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, fileName }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Analysis failed: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return result.analysis
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Analysis request timed out")
    }
    throw error
  }
}

export function getRiskColor(level: "High" | "Medium" | "Low"): string {
  switch (level) {
    case "High":
      return "text-destructive"
    case "Medium":
      return "text-yellow-600"
    case "Low":
      return "text-green-600"
    default:
      return "text-muted-foreground"
  }
}

export function getRiskBadgeVariant(level: "High" | "Medium" | "Low"): "destructive" | "secondary" | "default" {
  switch (level) {
    case "High":
      return "destructive"
    case "Medium":
      return "secondary"
    case "Low":
      return "default"
    default:
      return "secondary"
  }
}

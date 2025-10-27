"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, Share2, AlertTriangle, Clock, Users, CheckCircle, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import jsPDF from 'jspdf'
import type { DocumentAnalysis } from "@/lib/document-processor"
import { getRiskColor, getRiskBadgeVariant } from "@/lib/document-processor"
import { TextToSpeechControls } from "@/components/text-to-speech-controls"
import { DocumentChat } from "@/components/document-chat"
import { ExportDialog } from "@/components/export-dialog"
import { DocumentHealthScore } from "@/components/document-health-score"
import { SmartTimeline } from "@/components/smart-timeline"
import { ClauseComparison } from "@/components/clause-comparison"
import { NegotiationAssistant } from "@/components/negotiation-assistant"
import { InteractiveAnnotations } from "@/components/interactive-annotations"

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleShare = async () => {
    if (navigator.share && analysis) {
      try {
        await navigator.share({
          title: "Legal Document Analysis",
          text: `Document Analysis Summary: ${analysis.summary.substring(0, 100)}...`,
          url: window.location.href,
        })
      } catch (error) {

      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleExport = () => {
    if (!analysis) return
    
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = 20

    // Color palette
    const primaryColor: [number, number, number] = [37, 99, 235] // Blue
    const secondaryColor: [number, number, number] = [100, 116, 139] // Gray
    const accentColor: [number, number, number] = [16, 185, 129] // Green
    const dangerColor: [number, number, number] = [239, 68, 68] // Red
    const warningColor: [number, number, number] = [245, 158, 11] // Orange

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number = 30) => {
      if (yPosition > pageHeight - requiredSpace) {
        pdf.addPage()
        yPosition = 20
        return true
      }
      return false
    }

    // Helper function to add a colored header box
    const addSectionHeader = (title: string, color: [number, number, number] = primaryColor) => {
      checkNewPage(40)
      pdf.setFillColor(...color)
      pdf.rect(margin, yPosition, maxWidth, 10, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(13)
      pdf.text(title, margin + 5, yPosition + 7)
      pdf.setTextColor(0, 0, 0)
      yPosition += 16
    }

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false, indent: number = 0) => {
      checkNewPage()
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      
      const lines = pdf.splitTextToSize(text, maxWidth - indent)
      pdf.text(lines, margin + indent, yPosition)
      yPosition += lines.length * (fontSize * 0.4) + 4
    }

    // Add professional header with logo placeholder
    pdf.setFillColor(...primaryColor)
    pdf.rect(0, 0, pageWidth, 50, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.text('LegalEase AI', margin, 25)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Legal Document Analysis Report', margin, 38)
    
    pdf.setTextColor(0, 0, 0)
    yPosition = 60

    // Document metadata box
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.5)
    pdf.rect(margin, yPosition, maxWidth, 30)
    
    pdf.setFontSize(10)
    pdf.setTextColor(...secondaryColor)
    pdf.text(`Report Generated: ${new Date().toLocaleString()}`, margin + 5, yPosition + 10)
    pdf.text(`Document Type: ${analysis.documentType || 'Not specified'}`, margin + 5, yPosition + 18)
    pdf.text(`Analysis ID: ${params.id.substring(0, 16)}...`, margin + 5, yPosition + 26)
    
    pdf.setTextColor(0, 0, 0)
    yPosition += 40

    // Executive Summary
    if (analysis.summary) {
      addSectionHeader('EXECUTIVE SUMMARY', primaryColor)
      addText(analysis.summary, 11, false, 5)
      yPosition += 8
    }

    // Key Points
    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      addSectionHeader('KEY POINTS', accentColor)
      analysis.keyPoints.forEach((point, index) => {
        const pointText = typeof point === 'string' ? point : (point as any).description || String(point)
        addText(`${index + 1}. ${pointText}`, 11, false, 5)
      })
      yPosition += 8
    }

    // Legal Risks with color coding
    if (analysis.risks && analysis.risks.length > 0) {
      addSectionHeader('LEGAL RISKS', dangerColor)
      analysis.risks.forEach((risk, index) => {
        if (typeof risk === 'object' && risk !== null) {
          const riskObj = risk as any
          const level = riskObj.level || 'Medium'
          const description = riskObj.description || String(risk)
          const recommendation = riskObj.recommendation || ''
          
          // Risk level indicator
          const levelColor = level === 'High' ? dangerColor : level === 'Medium' ? warningColor : accentColor
          pdf.setTextColor(...levelColor)
          addText(`${index + 1}. [${level.toUpperCase()}]`, 10, true, 5)
          
          pdf.setTextColor(0, 0, 0)
          addText(description, 11, false, 15)
          
          if (recommendation) {
            pdf.setTextColor(...secondaryColor)
            addText(`Recommendation: ${recommendation}`, 10, false, 20)
            pdf.setTextColor(0, 0, 0)
          }
        } else {
          addText(`${index + 1}. ${String(risk)}`, 11, false, 5)
        }
      })
      yPosition += 8
    }

    // Legal Obligations
    if (analysis.obligations && analysis.obligations.length > 0) {
      addSectionHeader('LEGAL OBLIGATIONS', primaryColor)
      analysis.obligations.forEach((obligation, index) => {
        if (typeof obligation === 'object' && obligation !== null) {
          const obligationObj = obligation as any
          const party = obligationObj.party || 'Party'
          const description = obligationObj.description || String(obligation)
          const deadline = obligationObj.deadline || null
          
          addText(`${index + 1}. ${party}:`, 11, true, 5)
          addText(description, 11, false, 15)
          
          if (deadline) {
            pdf.setTextColor(...warningColor)
            addText(`Deadline: ${deadline}`, 10, true, 20)
            pdf.setTextColor(0, 0, 0)
          }
        } else {
          addText(`${index + 1}. ${String(obligation)}`, 11, false, 5)
        }
      })
      yPosition += 8
    }

    // Important Clauses
    if (analysis.importantClauses && analysis.importantClauses.length > 0) {
      addSectionHeader('IMPORTANT CLAUSES', accentColor)
      analysis.importantClauses.forEach((clause, index) => {
        if (typeof clause === 'object' && clause !== null) {
          const clauseObj = clause as any
          const title = clauseObj.title || `Clause ${index + 1}`
          const content = clauseObj.content || String(clause)
          const importance = clauseObj.importance || ''
          
          addText(`${index + 1}. ${title}`, 11, true, 5)
          addText(content, 10, false, 15)
          
          if (importance) {
            pdf.setTextColor(...secondaryColor)
            addText(`Note: ${importance}`, 10, false, 20)
            pdf.setTextColor(0, 0, 0)
          }
        } else {
          addText(`${index + 1}. ${String(clause)}`, 11, false, 5)
        }
      })
      yPosition += 8
    }

    // Important Deadlines
    if (analysis.deadlines && analysis.deadlines.length > 0) {
      addSectionHeader('IMPORTANT DEADLINES', warningColor)
      analysis.deadlines.forEach((deadline, index) => {
        if (typeof deadline === 'object' && deadline !== null) {
          const deadlineObj = deadline as any
          const description = deadlineObj.description || String(deadline)
          const date = deadlineObj.date || 'Not specified'
          const consequence = deadlineObj.consequence || ''
          
          addText(`${index + 1}. ${description}`, 11, true, 5)
          pdf.setTextColor(...warningColor)
          addText(`Date: ${date}`, 10, true, 15)
          pdf.setTextColor(0, 0, 0)
          
          if (consequence) {
            pdf.setTextColor(...dangerColor)
            addText(`Consequence: ${consequence}`, 10, false, 15)
            pdf.setTextColor(0, 0, 0)
          }
        } else {
          addText(`${index + 1}. ${String(deadline)}`, 11, false, 5)
        }
      })
      yPosition += 8
    }

    // Footer on last page
    const pageCount = (pdf as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      
      // Footer line
      pdf.setDrawColor(...primaryColor)
      pdf.setLineWidth(1)
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20)
      
      // Footer text
      pdf.setFontSize(9)
      pdf.setTextColor(...secondaryColor)
      pdf.text('Generated by LegalEase AI', margin, pageHeight - 12)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 30, pageHeight - 12)
      
      // Disclaimer
      pdf.setFontSize(7)
      pdf.text('This analysis is provided for informational purposes only and does not constitute legal advice.', margin, pageHeight - 6)
    }

    // Save the PDF
    const fileName = `LegalEase-Analysis-${new Date().toISOString().split('T')[0]}-${params.id.substring(0, 8)}.pdf`
    pdf.save(fileName)
  }

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        console.log("Loading analysis for ID:", params.id)
        
        // First try localStorage for fast loading (if user analyzed on same browser)
        const storedAnalysis = localStorage.getItem(params.id)
        if (storedAnalysis) {
          try {
            const parsedAnalysis = JSON.parse(storedAnalysis)
            console.log("Analysis loaded from localStorage")
            setAnalysis(parsedAnalysis)
            setIsLoading(false)
            return
          } catch (parseError) {
            console.error("Failed to parse stored analysis:", parseError)
          }
        }

        // Fetch from API (for shared links or if localStorage doesn't have it)
        console.log("Fetching analysis from API:", `/api/analysis/${params.id}`)
        const response = await fetch(`/api/analysis/${params.id}`)
        
        console.log("API response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("Analysis loaded from API:", data)
          setAnalysis(data.analysis)
          
          // Save to localStorage for future quick access
          localStorage.setItem(params.id, JSON.stringify(data.analysis))
        } else if (response.status === 404) {
          // Analysis not found
          console.error("Analysis not found in database")
          const errorText = await response.text()
          console.error("Error details:", errorText)
          setAnalysis(null)
        } else {
          console.error("Failed to load analysis:", response.statusText)
          const errorText = await response.text()
          console.error("Error details:", errorText)
          setAnalysis(null)
        }
      } catch (error) {
        console.error("Error loading analysis:", error)
        setAnalysis(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalysis()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested document analysis could not be found.</p>
          <Button asChild>
            <Link href="/upload">Upload New Document</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LegalEase AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button asChild variant="default">
              <Link href="/upload" className="text-primary-foreground font-medium">
                New Analysis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Document Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{analysis.documentType}</Badge>
            <span className="text-sm text-muted-foreground">Analyzed on {new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Document Analysis Results</h1>

          {/* Document Health Score */}
          <DocumentHealthScore analysis={analysis} />

          {/* Executive Summary with Text-to-Speech and Chat */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{analysis.summary}</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <TextToSpeechControls text={analysis.summary} title="Listen to Summary" />
              <DocumentChat analysis={analysis} />
            </div>
          </div>

          {/* Smart Timeline */}
          <div className="mt-6">
            <SmartTimeline analysis={analysis} />
          </div>

          {/* Clause Comparison */}
          <div className="mt-6">
            <ClauseComparison analysis={analysis} />
          </div>

          {/* Negotiation Assistant */}
          <div className="mt-6">
            <NegotiationAssistant analysis={analysis} />
          </div>

          {/* Interactive Annotations */}
          <div className="mt-6">
            <InteractiveAnnotations analysis={analysis} documentId={params.id} />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground text-foreground font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="risks"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground text-foreground font-medium"
            >
              Risks
            </TabsTrigger>
            <TabsTrigger
              value="obligations"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground text-foreground font-medium"
            >
              Obligations
            </TabsTrigger>
            <TabsTrigger
              value="clauses"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground text-foreground font-medium"
            >
              Key Clauses
            </TabsTrigger>
            <TabsTrigger
              value="deadlines"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground text-foreground font-medium"
            >
              Deadlines
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Points</CardTitle>
                <CardDescription>The most important aspects of this document</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Risk Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              {["High", "Medium", "Low"].map((level) => {
                const risks = analysis.risks.filter((risk) => risk.level === level)
                return (
                  <Card key={level}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${getRiskColor(level as any)}`} />
                        {level} Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-1">{risks.length}</div>
                      <p className="text-sm text-muted-foreground">
                        {risks.length === 1 ? "item identified" : "items identified"}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            {analysis.risks.map((risk, index) => (
              <Alert key={index} className="border-l-4 border-l-destructive">
                <AlertTriangle className="h-4 w-4" />
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getRiskBadgeVariant(risk.level)}>{risk.level} Risk</Badge>
                    </div>
                    <AlertDescription className="text-base mb-2">{risk.description}</AlertDescription>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Recommendation:</p>
                      <p className="text-sm text-muted-foreground">{risk.recommendation}</p>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </TabsContent>

          <TabsContent value="obligations" className="space-y-4">
            <div className="grid gap-4">
              {analysis.obligations.map((obligation, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{obligation.party}</Badge>
                        </div>
                        <p className="font-medium mb-2">{obligation.description}</p>
                        {obligation.deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Due: {obligation.deadline}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clauses" className="space-y-4">
            {analysis.importantClauses.map((clause, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{clause.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-l-primary">
                    <p className="text-sm leading-relaxed">{clause.content}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Why this matters:</p>
                    <p className="text-sm text-muted-foreground">{clause.importance}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            {analysis.deadlines.map((deadline, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{deadline.description}</h3>
                      {deadline.date && <p className="text-sm text-muted-foreground mb-2">Date: {deadline.date}</p>}
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">Consequence:</p>
                        <p className="text-sm text-muted-foreground">{deadline.consequence}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-border">
          <Button asChild className="flex-1">
            <Link href="/upload">Analyze Another Document</Link>
          </Button>
          <ExportDialog analysis={analysis} documentId={params.id} />
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}

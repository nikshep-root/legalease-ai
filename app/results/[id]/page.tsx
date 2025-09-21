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
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = 30

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      if (isBold) {
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFont('helvetica', 'normal')
      }
      
      const lines = pdf.splitTextToSize(text, maxWidth)
      pdf.text(lines, margin, yPosition)
      yPosition += lines.length * (fontSize * 0.4) + 5
      
      // Add new page if needed
      if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage()
        yPosition = 30
      }
    }

    // Add title
    addText('Legal Document Analysis Report', 20, true)
    yPosition += 10
    
    // Add document info
    addText(`Document Analysis Report`, 14, true)
    addText(`Analysis Date: ${new Date().toLocaleDateString()}`, 12)
    addText(`Document Type: ${analysis.documentType || 'Not specified'}`, 12)
    yPosition += 10

    // Add summary
    if (analysis.summary) {
      addText('Executive Summary', 16, true)
      addText(analysis.summary, 11)
      yPosition += 10
    }

    // Add key points
    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      addText('Key Points', 16, true)
      analysis.keyPoints.forEach((point, index) => {
        addText(`${index + 1}. ${point}`, 11)
      })
      yPosition += 10
    }

    // Add risks
    if (analysis.risks && analysis.risks.length > 0) {
      addText('Legal Risks', 16, true)
      analysis.risks.forEach((risk, index) => {
        addText(`${index + 1}. ${risk}`, 11)
      })
      yPosition += 10
    }

    // Add obligations
    if (analysis.obligations && analysis.obligations.length > 0) {
      addText('Legal Obligations', 16, true)
      analysis.obligations.forEach((obligation, index) => {
        addText(`${index + 1}. ${obligation}`, 11)
      })
      yPosition += 10
    }

    // Add important clauses
    if (analysis.importantClauses && analysis.importantClauses.length > 0) {
      addText('Important Clauses', 16, true)
      analysis.importantClauses.forEach((clause, index) => {
        addText(`${index + 1}. ${clause}`, 11)
      })
      yPosition += 10
    }

    // Add deadlines
    if (analysis.deadlines && analysis.deadlines.length > 0) {
      addText('Important Deadlines', 16, true)
      analysis.deadlines.forEach((deadline, index) => {
        addText(`${index + 1}. ${deadline}`, 11)
      })
    }

    // Save the PDF
    const fileName = `legal-analysis-${params.id}-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  }

  useEffect(() => {
    try {

      const storedAnalysis = localStorage.getItem(params.id)
      if (storedAnalysis) {
        const parsedAnalysis = JSON.parse(storedAnalysis)

        setAnalysis(parsedAnalysis)
      } else {
        // No analysis found for the given ID
      }
    } catch (error) {
      // Error loading analysis
    } finally {
      setIsLoading(false)
    }
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

          {/* Executive Summary with Text-to-Speech and Chat */}
          <div className="grid lg:grid-cols-3 gap-6">
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
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}

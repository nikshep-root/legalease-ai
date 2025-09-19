"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Scale, 
  FileText,
  Users,
  Calendar,
  Target
} from "lucide-react"

interface ComparisonResult {
  executiveSummary: string
  overallSimilarity: "High" | "Medium" | "Low"
  keyDifferences: Array<{
    category: string
    difference: string
    document1Value: string
    document2Value: string
    impact: "High" | "Medium" | "Low"
    recommendation: string
  }>
  similarities: Array<{
    category: string
    description: string
    significance: string
  }>
  riskComparison: {
    document1Risks: string[]
    document2Risks: string[]
    additionalRisksInDoc1: string[]
    additionalRisksInDoc2: string[]
    riskAssessment: string
  }
  termComparison: {
    favorableToParty1: string[]
    favorableToParty2: string[]
    neutral: string[]
  }
  recommendations: Array<{
    priority: "High" | "Medium" | "Low"
    action: string
    rationale: string
    targetDocument: string
  }>
  negotiationPoints: Array<{
    clause: string
    currentStatus: string
    suggestedApproach: string
  }>
  metadata: {
    document1Name: string
    document2Name: string
    comparisonDate: string
    documentTypes: {
      document1: string
      document2: string
    }
  }
}

interface ComparisonResultsProps {
  comparison: ComparisonResult
}

const getSimilarityColor = (similarity: string) => {
  switch (similarity) {
    case "High": return "bg-green-100 text-green-800 border-green-200"
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low": return "bg-red-100 text-red-800 border-red-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "High": return "bg-red-100 text-red-800"
    case "Medium": return "bg-yellow-100 text-yellow-800"
    case "Low": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-500"
    case "Medium": return "bg-yellow-500"
    case "Low": return "bg-green-500"
    default: return "bg-gray-500"
  }
}

export function ComparisonResults({ comparison }: ComparisonResultsProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                Document Comparison Summary
              </CardTitle>
              <CardDescription>
                Completed on {new Date(comparison.metadata.comparisonDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge className={getSimilarityColor(comparison.overallSimilarity)}>
              {comparison.overallSimilarity} Similarity
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{comparison.metadata.document1Name}</p>
                <p className="text-sm text-gray-500">{comparison.metadata.documentTypes.document1}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">{comparison.metadata.document2Name}</p>
                <p className="text-sm text-gray-500">{comparison.metadata.documentTypes.document2}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Executive Summary</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              {comparison.executiveSummary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="differences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="differences">Key Differences</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="terms">Term Comparison</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="similarities">Similarities</TabsTrigger>
        </TabsList>

        {/* Key Differences Tab */}
        <TabsContent value="differences" className="space-y-4">
          {comparison.keyDifferences.map((diff, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{diff.category}</CardTitle>
                  <Badge className={getImpactColor(diff.impact)}>
                    {diff.impact} Impact
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{diff.difference}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-medium text-blue-900 mb-1">Document 1</h5>
                    <p className="text-sm text-blue-800">{diff.document1Value}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <h5 className="font-medium text-green-900 mb-1">Document 2</h5>
                    <p className="text-sm text-green-800">{diff.document2Value}</p>
                  </div>
                </div>
                
                <Alert className="border-amber-200 bg-amber-50">
                  <Target className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Recommendation:</strong> {diff.recommendation}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Document 1 Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparison.riskComparison.document1Risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
                
                {comparison.riskComparison.additionalRisksInDoc1.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-red-900 mb-2">Additional Risks (Only in Doc 1)</h5>
                    <ul className="space-y-1">
                      {comparison.riskComparison.additionalRisksInDoc1.map((risk, index) => (
                        <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Document 2 Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparison.riskComparison.document2Risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
                
                {comparison.riskComparison.additionalRisksInDoc2.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-orange-900 mb-2">Additional Risks (Only in Doc 2)</h5>
                    <ul className="space-y-1">
                      {comparison.riskComparison.additionalRisksInDoc2.map((risk, index) => (
                        <li key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Overall Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{comparison.riskComparison.riskAssessment}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Term Comparison Tab */}
        <TabsContent value="terms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Favorable to Document 1</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparison.termComparison.favorableToParty1.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Favorable to Document 2</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparison.termComparison.favorableToParty2.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm">{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-700">Neutral Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparison.termComparison.neutral.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-gray-400 rounded-full mt-1"></div>
                      <span className="text-sm">{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {comparison.recommendations.map((rec, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)} mt-1`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{rec.action}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rec.priority} Priority
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {rec.targetDocument}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm">{rec.rationale}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Similarities Tab */}
        <TabsContent value="similarities" className="space-y-4">
          {comparison.similarities.map((sim, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{sim.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{sim.description}</p>
                <div className="bg-green-50 rounded-lg p-3">
                  <h5 className="font-medium text-green-900 mb-1">Significance</h5>
                  <p className="text-sm text-green-800">{sim.significance}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
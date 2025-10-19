'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import type { DocumentAnalysis } from '@/lib/document-processor';

interface DocumentHealthScoreProps {
  analysis: DocumentAnalysis;
}

export function DocumentHealthScore({ analysis }: DocumentHealthScoreProps) {
  // Calculate overall health score
  const calculateHealthScore = () => {
    let score = 100;
    
    analysis.risks.forEach(risk => {
      if (risk.level === 'High') score -= 15;
      else if (risk.level === 'Medium') score -= 8;
      else if (risk.level === 'Low') score -= 3;
    });
    
    return Math.max(0, Math.min(100, score));
  };

  // Calculate category scores
  const calculateCategoryScores = () => {
    const categories = {
      legal: 100,
      financial: 100,
      compliance: 100,
      operational: 100,
    };

    analysis.risks.forEach(risk => {
      const description = risk.description.toLowerCase();
      const penalty = risk.level === 'High' ? 20 : risk.level === 'Medium' ? 12 : 5;

      if (description.includes('legal') || description.includes('law') || description.includes('litigation')) {
        categories.legal -= penalty;
      }
      if (description.includes('payment') || description.includes('fee') || description.includes('cost') || description.includes('financial')) {
        categories.financial -= penalty;
      }
      if (description.includes('compliance') || description.includes('regulation') || description.includes('gdpr')) {
        categories.compliance -= penalty;
      }
      if (description.includes('operational') || description.includes('delivery') || description.includes('timeline')) {
        categories.operational -= penalty;
      }
    });

    return {
      legal: Math.max(0, Math.min(100, categories.legal)),
      financial: Math.max(0, Math.min(100, categories.financial)),
      compliance: Math.max(0, Math.min(100, categories.compliance)),
      operational: Math.max(0, Math.min(100, categories.operational)),
    };
  };

  const healthScore = calculateHealthScore();
  const categoryScores = calculateCategoryScores();

  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200' };
    if (score >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200' };
    return { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', icon: CheckCircle };
    if (score >= 80) return { label: 'Good', icon: TrendingUp };
    if (score >= 60) return { label: 'Fair', icon: Shield };
    if (score >= 40) return { label: 'Poor', icon: TrendingDown };
    return { label: 'Critical', icon: AlertTriangle };
  };

  const scoreColor = getScoreColor(healthScore);
  const scoreLabel = getScoreLabel(healthScore);
  const ScoreIcon = scoreLabel.icon;

  // Calculate stroke dash array for circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <Card className={`${scoreColor.border} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Document Health Score
        </CardTitle>
        <CardDescription>Overall safety and risk assessment of this document</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`${scoreColor.color} transition-all duration-1000 ease-out`}
                />
              </svg>
              {/* Score text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-bold ${scoreColor.color}`}>{healthScore}</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
            
            {/* Score Label */}
            <div className={`mt-4 px-4 py-2 rounded-full ${scoreColor.bg} flex items-center gap-2`}>
              <ScoreIcon className={`w-5 h-5 ${scoreColor.color}`} />
              <span className={`font-semibold ${scoreColor.color}`}>{scoreLabel.label}</span>
            </div>

            {/* Risk Summary */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {analysis.risks.filter(r => r.level === 'High').length} High • 
              {analysis.risks.filter(r => r.level === 'Medium').length} Medium • 
              {analysis.risks.filter(r => r.level === 'Low').length} Low Risk
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Category Breakdown</h4>
            
            {/* Legal */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Legal Compliance</span>
                <span className={`text-sm font-bold ${getScoreColor(categoryScores.legal).color}`}>
                  {categoryScores.legal}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    categoryScores.legal >= 80 ? 'bg-green-600' : 
                    categoryScores.legal >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${categoryScores.legal}%` }}
                />
              </div>
            </div>

            {/* Financial */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Financial Safety</span>
                <span className={`text-sm font-bold ${getScoreColor(categoryScores.financial).color}`}>
                  {categoryScores.financial}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    categoryScores.financial >= 80 ? 'bg-green-600' : 
                    categoryScores.financial >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${categoryScores.financial}%` }}
                />
              </div>
            </div>

            {/* Compliance */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Regulatory Compliance</span>
                <span className={`text-sm font-bold ${getScoreColor(categoryScores.compliance).color}`}>
                  {categoryScores.compliance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    categoryScores.compliance >= 80 ? 'bg-green-600' : 
                    categoryScores.compliance >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${categoryScores.compliance}%` }}
                />
              </div>
            </div>

            {/* Operational */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Operational Risk</span>
                <span className={`text-sm font-bold ${getScoreColor(categoryScores.operational).color}`}>
                  {categoryScores.operational}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    categoryScores.operational >= 80 ? 'bg-green-600' : 
                    categoryScores.operational >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${categoryScores.operational}%` }}
                />
              </div>
            </div>

            {/* Recommendation */}
            <div className={`mt-4 p-3 rounded-lg ${scoreColor.bg} border ${scoreColor.border}`}>
              <p className="text-xs font-medium mb-1">Recommendation:</p>
              <p className="text-sm">
                {healthScore >= 80 && "This document appears safe with minimal risks. Review the identified issues and proceed with confidence."}
                {healthScore >= 60 && healthScore < 80 && "This document has moderate risks. Carefully review the highlighted concerns and consider negotiating key terms."}
                {healthScore < 60 && "This document has significant risks. Consult with a legal professional before proceeding. Consider substantial revisions."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

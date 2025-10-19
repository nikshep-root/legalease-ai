'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import type { DocumentAnalysis } from '@/lib/document-processor';

interface ClauseComparisonProps {
  analysis: DocumentAnalysis;
}

export function ClauseComparison({ analysis }: ClauseComparisonProps) {
  const [expandedClauses, setExpandedClauses] = useState<Set<number>>(new Set());

  const toggleClause = (index: number) => {
    const newExpanded = new Set(expandedClauses);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedClauses(newExpanded);
  };

  // Industry standards and best practices
  const industryStandards = {
    'Confidentiality': {
      rating: 'standard',
      bestPractice: 'Should include clear definitions of confidential information, explicit exclusions, and reasonable time limits (typically 2-5 years).',
      improvements: [
        'Add explicit definition of what constitutes confidential information',
        'Include carve-outs for publicly available information',
        'Specify duration of confidentiality obligations',
      ],
    },
    'Termination': {
      rating: 'better',
      bestPractice: 'Should specify grounds for termination, notice periods, and post-termination obligations. Industry standard is 30-90 days notice.',
      improvements: [
        'Ensure mutual termination rights',
        'Include cure period for breaches (typically 30 days)',
        'Clarify survival clauses',
      ],
    },
    'Liability': {
      rating: 'worse',
      bestPractice: 'Should include reasonable liability caps and clear exclusions. Common practice limits indirect damages and caps liability at contract value.',
      improvements: [
        'Consider mutual liability caps',
        'Exclude consequential damages',
        'Specify insurance requirements',
      ],
    },
    'Intellectual Property': {
      rating: 'standard',
      bestPractice: 'Should clearly define IP ownership, license grants, and derivative works. Best practice includes background IP protection.',
      improvements: [
        'Clarify ownership of work product',
        'Define scope of license grants',
        'Address improvements and derivatives',
      ],
    },
    'Payment Terms': {
      rating: 'worse',
      bestPractice: 'Industry standard is Net 30 with clear milestones. Should include late payment penalties and currency specifications.',
      improvements: [
        'Negotiate more favorable payment terms (Net 30 or better)',
        'Add milestone-based payments',
        'Include interest on late payments',
      ],
    },
    'Indemnification': {
      rating: 'better',
      bestPractice: 'Should be mutual with reasonable limitations. Best practice includes notice requirements and right to control defense.',
      improvements: [
        'Ensure indemnification is mutual',
        'Cap indemnification obligations',
        'Clarify procedures for indemnification claims',
      ],
    },
  };

  // Analyze clauses against standards
  const analyzedClauses = analysis.importantClauses.map((clause, index) => {
    const title = clause.title.toLowerCase();
    let matchedStandard = null;
    let rating: 'better' | 'standard' | 'worse' = 'standard';

    // Match clause to industry standard
    for (const [key, value] of Object.entries(industryStandards)) {
      if (title.includes(key.toLowerCase()) || clause.content.toLowerCase().includes(key.toLowerCase())) {
        matchedStandard = { name: key, ...value };
        rating = value.rating as any;
        break;
      }
    }

    // If no match, analyze based on content
    if (!matchedStandard) {
      const hasRisks = analysis.risks.some(risk => 
        risk.description.toLowerCase().includes(clause.title.toLowerCase())
      );
      rating = hasRisks ? 'worse' : 'standard';
    }

    return {
      ...clause,
      rating,
      matchedStandard,
      index,
    };
  });

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'better':
        return { Icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' };
      case 'worse':
        return { Icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' };
      default:
        return { Icon: Minus, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' };
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'better':
        return <Badge className="bg-green-600">Better than Standard</Badge>;
      case 'worse':
        return <Badge variant="destructive">Below Standard</Badge>;
      default:
        return <Badge variant="secondary">Industry Standard</Badge>;
    }
  };

  const ratingCounts = {
    better: analyzedClauses.filter(c => c.rating === 'better').length,
    standard: analyzedClauses.filter(c => c.rating === 'standard').length,
    worse: analyzedClauses.filter(c => c.rating === 'worse').length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Clause Comparison with Industry Standards
        </CardTitle>
        <CardDescription>
          Analysis of key clauses against best practices and industry benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{ratingCounts.better}</span>
            </div>
            <p className="text-xs text-muted-foreground">Better than Standard</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Minus className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{ratingCounts.standard}</span>
            </div>
            <p className="text-xs text-muted-foreground">Industry Standard</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{ratingCounts.worse}</span>
            </div>
            <p className="text-xs text-muted-foreground">Below Standard</p>
          </div>
        </div>

        {/* Clause Analysis */}
        <div className="space-y-4">
          {analyzedClauses.map((clause) => {
            const { Icon, color, bg } = getRatingIcon(clause.rating);
            const isExpanded = expandedClauses.has(clause.index);

            return (
              <Collapsible key={clause.index} open={isExpanded} onOpenChange={() => toggleClause(clause.index)}>
                <div className={`border rounded-lg ${clause.rating === 'worse' ? 'border-red-200' : ''}`}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-accent">
                      <div className="flex items-start gap-4 text-left flex-1">
                        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{clause.title}</h4>
                            {getRatingBadge(clause.rating)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{clause.content}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground ml-4">
                        {isExpanded ? '−' : '+'}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4 border-t pt-4 mt-2">
                      {/* Full clause content */}
                      <div>
                        <p className="text-sm font-medium mb-2">Full Clause:</p>
                        <div className="p-3 bg-muted/30 rounded-md text-sm">
                          {clause.content}
                        </div>
                      </div>

                      {/* Industry standard comparison */}
                      {clause.matchedStandard && (
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium mb-1">Industry Best Practice:</p>
                              <p className="text-sm text-muted-foreground">{clause.matchedStandard.bestPractice}</p>
                            </div>
                          </div>

                          {clause.matchedStandard.improvements.length > 0 && (
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium mb-2">Suggested Improvements:</p>
                                <ul className="space-y-1">
                                  {clause.matchedStandard.improvements.map((improvement, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-primary">•</span>
                                      <span>{improvement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Why this matters */}
                      {clause.importance && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium mb-1">Why This Matters:</p>
                            <p className="text-sm text-muted-foreground">{clause.importance}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>

        {/* Overall recommendation */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Overall Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">
            {ratingCounts.worse > 0 ? (
              `This document has ${ratingCounts.worse} clause${ratingCounts.worse > 1 ? 's' : ''} below industry standards. Consider negotiating these terms with legal counsel before signing.`
            ) : ratingCounts.better > ratingCounts.standard ? (
              'This document generally meets or exceeds industry standards. Review the highlighted areas and proceed with confidence.'
            ) : (
              'This document aligns with industry standards. Review the specific suggestions to optimize terms further.'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

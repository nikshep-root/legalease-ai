'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Handshake, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import type { DocumentAnalysis } from '@/lib/document-processor';

interface NegotiationAssistantProps {
  analysis: DocumentAnalysis;
}

interface NegotiationStrategy {
  riskTitle: string;
  riskLevel: string;
  currentIssue: string;
  counterProposal: string;
  talkingPoints: string[];
  leverageScore: number;
  rationale: string;
  fallbackPosition: string;
}

export function NegotiationAssistant({ analysis }: NegotiationAssistantProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Generate negotiation strategies for high-risk items
  const generateStrategies = (): NegotiationStrategy[] => {
    const highRisks = analysis.risks.filter(risk => risk.level === 'High' || risk.level === 'Medium');
    
    return highRisks.map(risk => {
      const title = risk.description;
      const level = risk.level;
      
      // Generate counter-proposals based on risk type
      let strategy: NegotiationStrategy;

      if (title.toLowerCase().includes('liability') || title.toLowerCase().includes('indemnity')) {
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Unlimited liability exposure puts your organization at significant financial risk.',
          counterProposal: 'Propose mutual liability cap at 2x annual contract value, excluding intentional misconduct and confidentiality breaches.',
          talkingPoints: [
            'Industry standard liability caps typically range from 1-3x contract value',
            'Mutual caps demonstrate good faith and balanced risk allocation',
            'Insurance coverage should align with liability limits',
            'Carve-outs for gross negligence protect against bad faith',
          ],
          leverageScore: 75,
          rationale: 'Most companies accept reasonable liability caps to limit exposure while maintaining accountability.',
          fallbackPosition: 'If full cap rejected, propose separate caps for direct damages (2x) and indirect damages (1x), with uncapped liability only for willful misconduct.',
        };
      } else if (title.toLowerCase().includes('termination') || title.toLowerCase().includes('cancel')) {
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Restrictive termination terms lock you into unfavorable arrangements with limited exit options.',
          counterProposal: 'Add mutual termination for convenience with 90-day notice and pro-rated refund of prepaid fees.',
          talkingPoints: [
            'Business needs change, flexibility is essential for both parties',
            'Mutual termination rights create balanced relationship',
            '90-day notice provides adequate transition period',
            'Fair refund policy demonstrates confidence in service quality',
          ],
          leverageScore: 85,
          rationale: 'Termination flexibility is highly negotiable, especially in service agreements. Most vendors prefer happy customers.',
          fallbackPosition: 'If convenience termination rejected, negotiate for cause termination with reasonable cure periods (30-60 days) and clear breach definitions.',
        };
      } else if (title.toLowerCase().includes('payment') || title.toLowerCase().includes('fee')) {
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Aggressive payment terms strain cash flow and create financial pressure.',
          counterProposal: 'Modify to Net 45 payment terms with milestone-based invoicing and 1.5% monthly late fee cap.',
          talkingPoints: [
            'Extended payment terms align with standard accounting cycles',
            'Milestone-based payments tie cost to value delivery',
            'Reasonable late fees incentivize timely payment without being punitive',
            'Better terms enable longer partnership and additional purchases',
          ],
          leverageScore: 70,
          rationale: 'Payment terms are often negotiable, especially for larger contracts or repeat customers.',
          fallbackPosition: 'If Net 45 rejected, offer Net 30 with early payment discount (2% for payment within 10 days).',
        };
      } else if (title.toLowerCase().includes('intellectual property') || title.toLowerCase().includes('ip')) {
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Overly broad IP assignment could transfer your proprietary technology and background IP.',
          counterProposal: 'Limit IP assignment to deliverables specifically created under this agreement, with explicit exclusion of background IP and general methodologies.',
          talkingPoints: [
            'Background IP represents significant prior investment',
            'Assignment should only cover work product created for this project',
            'General knowledge, tools, and methodologies should remain yours',
            'Clear IP boundaries prevent future disputes',
          ],
          leverageScore: 80,
          rationale: 'IP rights are critical and most parties accept work-for-hire limited to specific deliverables.',
          fallbackPosition: 'If full ownership required, negotiate perpetual license back to your background IP for your own business purposes.',
        };
      } else if (title.toLowerCase().includes('confidential') || title.toLowerCase().includes('nda')) {
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Indefinite or overly restrictive confidentiality obligations create long-term compliance burden.',
          counterProposal: 'Limit confidentiality period to 3 years post-disclosure with standard exclusions (public domain, independently developed, rightfully received).',
          talkingPoints: [
            'Industry standard confidentiality periods are 2-5 years',
            'Information loses commercial value over time',
            'Standard exclusions are universally accepted',
            'Reasonable terms ensure practical compliance',
          ],
          leverageScore: 90,
          rationale: 'Time-limited confidentiality with standard carve-outs is nearly universal in commercial agreements.',
          fallbackPosition: 'If 3 years rejected, offer 5 years with automatic expiration (no survival) and clear marking requirements for confidential information.',
        };
      } else if (title.toLowerCase().includes('warranty') || title.toLowerCase().includes('guarantee')) {
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Unlimited warranties create open-ended obligations that are difficult to manage and expensive to maintain.',
          counterProposal: 'Add express warranty with specific scope and time limit (e.g., 90-day warranty for conformance to specifications), plus disclaimer of implied warranties.',
          talkingPoints: [
            'Specific warranties are clearer and more enforceable than general ones',
            'Time limits align with product lifecycle and support capabilities',
            'Disclaimer of implied warranties is standard in B2B agreements',
            'Clear warranty scope sets expectations and prevents disputes',
          ],
          leverageScore: 65,
          rationale: 'Warranty limitations are common but may face resistance. Emphasize clarity and specificity over duration.',
          fallbackPosition: 'If implied warranty disclaimer rejected, limit implied warranties to same period as express warranties (90 days).',
        };
      } else {
        // Generic strategy for other risks
        strategy = {
          riskTitle: title,
          riskLevel: level,
          currentIssue: 'Current terms create imbalanced risk allocation favoring the other party.',
          counterProposal: 'Request mutual obligations and balanced risk-sharing for this provision.',
          talkingPoints: [
            'Best agreements create win-win scenarios for both parties',
            'Mutual obligations demonstrate good faith and partnership',
            'Balanced risk allocation leads to better long-term relationships',
            'Fair terms reduce likelihood of disputes',
          ],
          leverageScore: 60,
          rationale: 'Most provisions can be made mutual without significant business impact.',
          fallbackPosition: 'If full mutuality rejected, propose graduated remedies tied to materiality of breach.',
        };
      }

      return strategy;
    }).slice(0, 6); // Limit to top 6 strategies
  };

  const strategies = generateStrategies();

  const getLeverageColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLeverageBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">Strong Leverage</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-600">Moderate Leverage</Badge>;
    return <Badge variant="destructive">Weak Leverage</Badge>;
  };

  const averageLeverage = strategies.length > 0 
    ? Math.round(strategies.reduce((acc, s) => acc + s.leverageScore, 0) / strategies.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="w-5 h-5" />
          AI-Powered Negotiation Assistant
        </CardTitle>
        <CardDescription>
          Strategic counter-proposals and talking points for high-risk clauses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold">{strategies.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Negotiation Strategies</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className={`w-5 h-5 ${getLeverageColor(averageLeverage)}`} />
              <span className={`text-2xl font-bold ${getLeverageColor(averageLeverage)}`}>
                {averageLeverage}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Average Leverage Score</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold">{strategies.filter(s => s.leverageScore >= 70).length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Strong Positions</p>
          </div>
        </div>

        {/* Strategies */}
        <div className="space-y-6">
          {strategies.map((strategy, index) => (
            <Card key={index} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-4 h-4 ${strategy.riskLevel === 'High' ? 'text-red-600' : 'text-yellow-600'}`} />
                      <CardTitle className="text-lg">{strategy.riskTitle}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={strategy.riskLevel === 'High' ? 'destructive' : 'secondary'}>
                        {strategy.riskLevel} Risk
                      </Badge>
                      {getLeverageBadge(strategy.leverageScore)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Leverage</div>
                    <div className={`text-3xl font-bold ${getLeverageColor(strategy.leverageScore)}`}>
                      {strategy.leverageScore}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="proposal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="proposal">Counter-Proposal</TabsTrigger>
                    <TabsTrigger value="talking">Talking Points</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="proposal" className="space-y-4 mt-4">
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">Current Issue:</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{strategy.currentIssue}</p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm font-medium">Proposed Counter-Language:</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(strategy.counterProposal, index)}
                          className="h-6 px-2"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        {strategy.counterProposal}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="talking" className="space-y-3 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium">Key Points to Emphasize:</p>
                    </div>
                    <ul className="space-y-2">
                      {strategy.talkingPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <span className="text-blue-600 font-bold mt-0.5">{idx + 1}</span>
                          <span className="text-sm flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="strategy" className="space-y-4 mt-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">Strategic Rationale:</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{strategy.rationale}</p>
                      
                      <div className="flex items-start gap-2 pt-4 border-t">
                        <Shield className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Fallback Position:</p>
                          <p className="text-sm text-muted-foreground">{strategy.fallbackPosition}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {strategies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Handshake className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No high-risk clauses identified that require negotiation strategies.</p>
            <p className="text-sm mt-1">This document appears to have balanced terms.</p>
          </div>
        )}

        {/* Overall Guidance */}
        {strategies.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Negotiation Guidance
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Prioritize items with leverage scores above 70% - these have the highest chance of successful negotiation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Present counter-proposals in writing with clear rationale - this demonstrates professionalism.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Be prepared to compromise - have your fallback positions ready for each key point.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Consider bundling requests - trading concessions on lower-priority items for wins on critical terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Always involve legal counsel before finalizing significant contract modifications.</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

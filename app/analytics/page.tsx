'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface AnalysisData {
  id: string;
  documentType: string;
  risks: Array<{ level: string; description: string }>;
  analyzedAt: Date;
}

interface RiskStats {
  high: number;
  medium: number;
  low: number;
}

export default function AnalyticsPage() {
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [riskStats, setRiskStats] = useState<RiskStats>({ high: 0, medium: 0, low: 0 });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    try {
      const analysesData: AnalysisData[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('document_analysis_')) {
          const data = localStorage.getItem(key);
          if (data) {
            const analysis = JSON.parse(data);
            analysesData.push({
              id: key.replace('document_analysis_', ''),
              documentType: analysis.documentType || 'Legal Document',
              risks: analysis.risks || [],
              analyzedAt: new Date(analysis.timestamp || Date.now()),
            });
          }
        }
      }

      // Sort by date
      analysesData.sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
      setAnalyses(analysesData);
      setTotalAnalyses(analysesData.length);

      // Calculate risk statistics
      const stats = { high: 0, medium: 0, low: 0 };
      analysesData.forEach((analysis) => {
        analysis.risks.forEach((risk) => {
          if (risk.level === 'High') stats.high++;
          else if (risk.level === 'Medium') stats.medium++;
          else if (risk.level === 'Low') stats.low++;
        });
      });
      setRiskStats(stats);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for charts
  const riskDistributionData = [
    { name: 'High Risk', value: riskStats.high, color: '#ef4444' },
    { name: 'Medium Risk', value: riskStats.medium, color: '#f59e0b' },
    { name: 'Low Risk', value: riskStats.low, color: '#10b981' },
  ];

  const documentTypeData = analyses.reduce((acc, analysis) => {
    const existing = acc.find((item) => item.name === analysis.documentType);
    if (existing) {
      existing.count++;
      existing.high += analysis.risks.filter((r) => r.level === 'High').length;
      existing.medium += analysis.risks.filter((r) => r.level === 'Medium').length;
      existing.low += analysis.risks.filter((r) => r.level === 'Low').length;
    } else {
      acc.push({
        name: analysis.documentType,
        count: 1,
        high: analysis.risks.filter((r) => r.level === 'High').length,
        medium: analysis.risks.filter((r) => r.level === 'Medium').length,
        low: analysis.risks.filter((r) => r.level === 'Low').length,
      });
    }
    return acc;
  }, [] as Array<{ name: string; count: number; high: number; medium: number; low: number }>);

  // Timeline data (last 10 analyses)
  const timelineData = analyses.slice(0, 10).reverse().map((analysis, index) => ({
    name: `Doc ${index + 1}`,
    high: analysis.risks.filter((r) => r.level === 'High').length,
    medium: analysis.risks.filter((r) => r.level === 'Medium').length,
    low: analysis.risks.filter((r) => r.level === 'Low').length,
    date: analysis.analyzedAt.toLocaleDateString(),
    total: analysis.risks.length,
  }));

  const totalRisks = riskStats.high + riskStats.medium + riskStats.low;
  const avgRisksPerDoc = totalAnalyses > 0 ? (totalRisks / totalAnalyses).toFixed(1) : 0;
  const riskScore = totalAnalyses > 0 ? Math.max(0, 100 - (riskStats.high * 10 + riskStats.medium * 5)) : 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LegalEase AI</span>
            </Link>
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Risk Analytics</h1>
          <p className="text-muted-foreground">Visual insights and trends from your document analysis</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : totalAnalyses === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Start analyzing documents to see visual risk analytics and insights.
              </p>
              <Button asChild>
                <Link href="/upload">Analyze Your First Document</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <Badge variant="secondary">{totalAnalyses}</Badge>
                  </div>
                  <div className="text-2xl font-bold">{totalAnalyses}</div>
                  <p className="text-sm text-muted-foreground">Documents Analyzed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <Badge variant="destructive">{riskStats.high}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{riskStats.high}</div>
                  <p className="text-sm text-muted-foreground">High Risk Issues</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-primary" />
                    <Badge>{avgRisksPerDoc}</Badge>
                  </div>
                  <div className="text-2xl font-bold">{avgRisksPerDoc}</div>
                  <p className="text-sm text-muted-foreground">Avg Risks Per Doc</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-8 h-8 text-green-600" />
                    <Badge variant="secondary">{riskScore}/100</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{riskScore}</div>
                  <p className="text-sm text-muted-foreground">Overall Safety Score</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Risk Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Risk Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of risk levels across all documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">High ({riskStats.high})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Medium ({riskStats.medium})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">Low ({riskStats.low})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Types Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Risks by Document Type
                  </CardTitle>
                  <CardDescription>Risk analysis grouped by document category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={documentTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="high" fill="#ef4444" name="High Risk" />
                      <Bar dataKey="medium" fill="#f59e0b" name="Medium Risk" />
                      <Bar dataKey="low" fill="#10b981" name="Low Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Analysis Trend
                </CardTitle>
                <CardDescription>Risk levels in your last 10 document analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                              <p className="text-sm mb-1">Total Risks: {payload[0].payload.total}</p>
                              {payload.map((entry, index) => (
                                <p key={index} style={{ color: entry.color }} className="text-sm">
                                  {entry.name}: {entry.value}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="high"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      name="High Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="medium"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      name="Medium Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="low"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Low Risk"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Insights & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Risk Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskStats.high > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">High Risk Alert</p>
                        <p className="text-sm text-muted-foreground">
                          You have {riskStats.high} high-risk {riskStats.high === 1 ? 'issue' : 'issues'} that require immediate attention.
                        </p>
                      </div>
                    </div>
                  )}
                  {riskStats.medium > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <Activity className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Medium Priority</p>
                        <p className="text-sm text-muted-foreground">
                          {riskStats.medium} medium-risk {riskStats.medium === 1 ? 'item' : 'items'} should be reviewed soon.
                        </p>
                      </div>
                    </div>
                  )}
                  {riskScore >= 80 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Good Safety Score</p>
                        <p className="text-sm text-muted-foreground">
                          Your documents maintain a strong safety profile. Keep up the good work!
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button asChild className="w-full justify-start">
                      <Link href="/upload">
                        <FileText className="w-4 h-4 mr-2" />
                        Analyze New Document
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/history">
                        <Activity className="w-4 h-4 mr-2" />
                        View Full History
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/contact">
                        <Shield className="w-4 h-4 mr-2" />
                        Get Expert Help
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LegalEase AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 LegalEase AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

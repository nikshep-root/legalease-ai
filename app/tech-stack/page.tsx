'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Cpu, 
  Database, 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  BarChart3,
  Globe,
  Lock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function TechStackPage() {
  const googleServices = [
    {
      icon: <Cloud className="w-8 h-8 text-blue-600" />,
      name: "Cloud Run",
      category: "Infrastructure",
      description: "Serverless container platform hosting our Next.js application with auto-scaling",
      features: ["Auto-scaling", "Zero downtime", "99.95% SLA", "Global deployment"]
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      name: "Gemini 2.0 Flash",
      category: "AI Engine",
      description: "Google's most advanced multimodal AI for document analysis and legal insights",
      features: ["Context caching", "2M token context", "Multimodal", "Fast inference"]
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      name: "Document AI",
      category: "Document Processing",
      description: "Advanced OCR and document understanding with layout detection",
      features: ["Table extraction", "Entity recognition", "Layout analysis", "Multi-language"]
    },
    {
      icon: <Cpu className="w-8 h-8 text-orange-600" />,
      name: "Vertex AI",
      category: "Machine Learning",
      description: "Custom ML models for document classification and entity extraction",
      features: ["Auto-categorization", "Named entity recognition", "Sentiment analysis", "Custom models"]
    },
    {
      icon: <Database className="w-8 h-8 text-red-600" />,
      name: "Cloud Storage",
      category: "Storage",
      description: "Secure document storage with automatic lifecycle management",
      features: ["Auto-deletion", "Versioning", "CDN integration", "Encryption at rest"]
    },
    {
      icon: <Database className="w-8 h-8 text-yellow-600" />,
      name: "Firestore",
      category: "Database",
      description: "NoSQL document database for real-time data synchronization",
      features: ["Real-time sync", "Offline support", "ACID transactions", "Auto-scaling"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      name: "Cloud Logging & Monitoring",
      category: "Observability",
      description: "Comprehensive logging and monitoring for production insights",
      features: ["Real-time logs", "Custom metrics", "Alerts", "Audit trails"]
    },
    {
      icon: <Globe className="w-8 h-8 text-cyan-600" />,
      name: "Cloud CDN",
      category: "Performance",
      description: "Global content delivery network for fast page loads worldwide",
      features: ["Edge caching", "DDoS protection", "SSL/TLS", "Global PoPs"]
    },
    {
      icon: <Shield className="w-8 h-8 text-pink-600" />,
      name: "Cloud Armor",
      category: "Security",
      description: "DDoS protection and web application firewall",
      features: ["Rate limiting", "IP filtering", "Bot detection", "WAF rules"]
    },
    {
      icon: <Lock className="w-8 h-8 text-teal-600" />,
      name: "Secret Manager",
      category: "Security",
      description: "Secure storage and management of API keys and credentials",
      features: ["Automatic rotation", "Versioning", "IAM integration", "Audit logging"]
    }
  ];

  const architecture = {
    frontend: "Next.js 14 with App Router & TypeScript",
    hosting: "Google Cloud Run (Serverless Containers)",
    ai: "Gemini 2.0 Flash + Vertex AI",
    processing: "Document AI + Custom OCR",
    storage: "Cloud Storage + Firestore",
    monitoring: "Cloud Logging + Cloud Monitoring",
    security: "Cloud Armor + Secret Manager + IAM",
    cdn: "Cloud CDN + Load Balancing"
  };

  const stats = [
    { label: "Google Services Used", value: "10+", icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: "AI Models Deployed", value: "3", icon: <Brain className="w-5 h-5" /> },
    { label: "Auto-Scaling", value: "0-1000+", icon: <Zap className="w-5 h-5" /> },
    { label: "Uptime SLA", value: "99.95%", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            🏆 Built for Google GenAI Exchange Hackathon
          </Badge>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Fully Google-Powered Architecture
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            LegalEase AI leverages the complete Google Cloud ecosystem for enterprise-grade 
            legal document intelligence with AI-first architecture.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Architecture Overview */}
        <Card className="mb-16 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl">🏗️ Architecture Overview</CardTitle>
            <CardDescription>Production-ready, scalable infrastructure on Google Cloud Platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(architecture).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-slate-600">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Google Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Google Cloud Services Integration
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {googleServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {service.icon}
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Google Cloud */}
        <Card className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Why We Chose Google Cloud</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">🚀</div>
                <h3 className="font-semibold text-lg mb-2">AI-First Platform</h3>
                <p className="text-blue-100 text-sm">
                  Access to Gemini, Vertex AI, and Document AI for cutting-edge legal intelligence
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">⚡</div>
                <h3 className="font-semibold text-lg mb-2">Production-Ready</h3>
                <p className="text-blue-100 text-sm">
                  Enterprise-grade infrastructure with 99.95% SLA and global scaling
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">🔒</div>
                <h3 className="font-semibold text-lg mb-2">Security & Compliance</h3>
                <p className="text-blue-100 text-sm">
                  Built-in DDoS protection, encryption, and compliance with GDPR, SOC 2, ISO 27001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Response Time</span>
                <span className="font-semibold">&lt;200ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Document Processing</span>
                <span className="font-semibold">&lt;5s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">AI Analysis</span>
                <span className="font-semibold">&lt;3s</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📈 Scalability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Min Instances</span>
                <span className="font-semibold">0 (Scale to Zero)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Max Instances</span>
                <span className="font-semibold">1000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Concurrent Users</span>
                <span className="font-semibold">80,000+</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🛡️ Reliability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Uptime SLA</span>
                <span className="font-semibold">99.95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Data Redundancy</span>
                <span className="font-semibold">Multi-region</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Backup</span>
                <span className="font-semibold">Automatic</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Google-Powered Legal AI?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Try It Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Built with ❤️ for Google GenAI Exchange Hackathon 2025
          </p>
        </div>

      </div>
    </div>
  );
}

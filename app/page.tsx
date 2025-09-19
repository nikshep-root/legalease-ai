import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Brain, Shield, Clock, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { DemoModal } from "@/components/demo-modal"
import { NavigationBar } from "@/components/navigation-bar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationBar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Powered by Advanced AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Simplify Legal Documents with <span className="text-primary">AI-Powered Analysis</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Upload contracts, policies, and legal documents to get instant summaries, risk analysis, and key clause
            identification. No legal expertise required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/upload">Analyze Document</Link>
            </Button>
            <DemoModal />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Free trial • No credit card required • Secure & confidential
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LegalEase AI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform complex legal documents into clear, actionable insights in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Summaries</CardTitle>
                <CardDescription>
                  Get concise, clear summaries of complex legal documents in plain English
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Identify potential risks, liabilities, and red flags before you sign</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-chart-2" />
                </div>
                <CardTitle>Key Clause Detection</CardTitle>
                <CardDescription>Automatically highlight important clauses, deadlines, and obligations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>Instant Results</CardTitle>
                <CardDescription>Upload and analyze documents in seconds, not hours of manual review</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-chart-5" />
                </div>
                <CardTitle>For Everyone</CardTitle>
                <CardDescription>Perfect for students, professionals, and businesses of all sizes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>Your documents are processed securely and never stored permanently</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to understand any legal document
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Document</h3>
              <p className="text-muted-foreground">
                Drag and drop your PDF or text document. We support contracts, policies, agreements, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI processes your document, extracting key information and identifying important clauses.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Insights</h3>
              <p className="text-muted-foreground">
                Receive a clear summary, risk analysis, and highlighted key clauses in an easy-to-understand format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Legal Documents?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust LegalEase AI to make sense of complex legal language.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/upload">Start Analyzing Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LegalEase AI</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
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
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 LegalEase AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

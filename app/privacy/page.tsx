import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
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
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: October 19, 2025</p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Encrypted Storage</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">No Third-Party Ads</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Database className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Processing</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <UserCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">You Own Your Data</p>
              </CardContent>
            </Card>
          </div>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                At LegalEase AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our legal document analysis platform.
              </p>
              <p className="font-medium text-primary">
                By using LegalEase AI, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p>When you create an account or use our service, we may collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Name and email address</li>
                  <li>Account credentials (encrypted)</li>
                  <li>Profile information you provide</li>
                  <li>Payment information (processed securely through payment providers)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Document Data</h3>
                <p>We process documents you upload for analysis, including:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Document content and text for AI analysis</li>
                  <li>Document metadata (file name, size, type, upload date)</li>
                  <li>Analysis results and insights generated</li>
                  <li>Your notes and annotations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <p>We automatically collect certain information about your device and usage:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Browser type and version</li>
                  <li>Device information (type, OS, screen resolution)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and features used</li>
                  <li>Time spent on the platform</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our AI-powered document analysis services</li>
                <li><strong>AI Processing:</strong> To analyze your documents using Google Gemini AI and generate insights</li>
                <li><strong>Account Management:</strong> To create and manage your user account</li>
                <li><strong>Communication:</strong> To send you service updates, security alerts, and support messages</li>
                <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Storage and Security */}
          <Card>
            <CardHeader>
              <CardTitle>3. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <div>
                <h3 className="font-semibold mb-2">How We Store Your Data</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Documents are stored in secure cloud storage with encryption at rest</li>
                  <li>Analysis results are stored in Firebase/Firestore databases</li>
                  <li>Personal data is encrypted using industry-standard protocols</li>
                  <li>Backups are maintained in geographically distributed locations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Security Measures</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Monitoring for suspicious activities</li>
                  <li>Secure API integrations with trusted providers</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Note:</strong> While we implement robust security measures, no method of transmission over 
                  the internet is 100% secure. We cannot guarantee absolute security but continuously work to protect your data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>4. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>We use the following trusted third-party services:</p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Google Gemini AI</h3>
                  <p className="text-sm text-muted-foreground">
                    For AI-powered document analysis. Documents are processed through Google's secure API with enterprise-grade security.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Firebase/Firestore</h3>
                  <p className="text-sm text-muted-foreground">
                    For authentication and database services. Subject to Google's privacy policy.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Vercel</h3>
                  <p className="text-sm text-muted-foreground">
                    For hosting and content delivery. Ensures fast, secure access to our platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Analytics Services</h3>
                  <p className="text-sm text-muted-foreground">
                    We may use analytics tools to understand usage patterns (anonymized data only).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>We retain your information for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <div className="mt-4 space-y-2">
                <p><strong>Account Data:</strong> Retained while your account is active</p>
                <p><strong>Documents:</strong> Stored until you delete them or close your account</p>
                <p><strong>Analysis Results:</strong> Retained in your account history</p>
                <p><strong>Logs:</strong> Typically retained for 90 days for security purposes</p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>6. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Withdraw Consent:</strong> Stop processing based on consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@legalease-ai.com" className="text-primary hover:underline">
                  privacy@legalease-ai.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintain your session and keep you logged in</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Improve platform performance</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                LegalEase AI is not intended for users under the age of 18. We do not knowingly collect personal information 
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* International Users */}
          <Card>
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for material changes</li>
              </ul>
              <p className="mt-4">
                We encourage you to review this policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="space-y-2 mt-4">
                <p><strong>Email:</strong> privacy@legalease-ai.com</p>
                <p><strong>Support:</strong> support@legalease-ai.com</p>
                <p>
                  <strong>Contact Form:</strong>{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    Visit our contact page
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button asChild size="lg">
              <Link href="/">
                I Understand
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/terms">
                Read Terms of Service
              </Link>
            </Button>
          </div>
        </div>
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

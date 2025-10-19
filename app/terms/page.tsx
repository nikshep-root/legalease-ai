import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: October 19, 2025</p>
          </div>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Welcome to LegalEase AI. By accessing or using our service, you agree to be bound by these Terms of Service. 
                Please read them carefully before using our platform.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                By accessing and using LegalEase AI, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                LegalEase AI provides AI-powered legal document analysis services. Our platform helps users:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analyze legal documents and contracts</li>
                <li>Identify key clauses, risks, and obligations</li>
                <li>Extract important dates and deadlines</li>
                <li>Generate summaries and insights</li>
              </ul>
              <p className="text-destructive font-medium mt-4">
                Important: LegalEase AI is not a substitute for professional legal advice. Our service provides informational 
                analysis only and should not be relied upon for legal decisions without consulting a qualified attorney.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>As a user of LegalEase AI, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not upload malicious files or content</li>
                <li>Not attempt to reverse engineer or hack our systems</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>4. Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                We take your privacy seriously. Documents you upload are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processed using secure AI services</li>
                <li>Stored temporarily for analysis</li>
                <li>Not shared with third parties for marketing purposes</li>
                <li>Subject to our Privacy Policy</li>
              </ul>
              <p>
                For detailed information about how we handle your data, please review our{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                All content, features, and functionality of LegalEase AI, including but not limited to text, graphics, logos, 
                and software, are owned by LegalEase AI and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You retain all rights to documents you upload. By using our service, you grant us a limited license to process 
                your documents for the purpose of providing our analysis services.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer of Warranties */}
          <Card>
            <CardHeader>
              <CardTitle>6. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p className="font-medium">
                LegalEase AI is provided "as is" and "as available" without warranties of any kind, either express or implied.
              </p>
              <p>
                We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>AI analysis will be 100% accurate</li>
                <li>All security vulnerabilities will be prevented</li>
                <li>The service will meet your specific requirements</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                To the maximum extent permitted by law, LegalEase AI and its affiliates shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use or inability to use the service</li>
                <li>Errors or inaccuracies in AI-generated analysis</li>
                <li>Loss of data or documents</li>
                <li>Unauthorized access to your account</li>
                <li>Any decisions made based on our service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account Termination */}
          <Card>
            <CardHeader>
              <CardTitle>8. Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                We reserve the right to suspend or terminate your account at any time if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You violate these Terms of Service</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>Your account poses a security risk</li>
                <li>We discontinue the service</li>
              </ul>
              <p>
                You may also terminate your account at any time by contacting us.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                We may update these Terms of Service from time to time. We will notify users of significant changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the new terms on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications (for major changes)</li>
              </ul>
              <p>
                Your continued use of the service after changes take effect constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>10. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which LegalEase AI operates, without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: support@legalease-ai.com</li>
                <li>
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Form
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Agreement Button */}
          <div className="flex justify-center pt-6">
            <Button asChild size="lg">
              <Link href="/">
                I Understand and Agree
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

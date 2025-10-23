import { FileText, Users, Ban, AlertCircle, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-4 rounded-full">
              <FileText className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Please read these terms carefully before using LegalEase AI
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Effective Date: October 23, 2025 | Last Updated: October 23, 2025
          </p>
        </div>

        {/* Agreement Notice */}
        <Alert className="mb-8 border-indigo-400 bg-indigo-50">
          <AlertCircle className="h-5 w-5 text-indigo-600" />
          <AlertDescription className="text-indigo-900">
            <strong>By using LegalEase AI,</strong> you agree to be bound by these Terms of Service. 
            If you do not agree, please do not use our platform.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                These Terms of Service ("Terms") govern your access to and use of LegalEase AI ("Service", "Platform", "we", "us", or "our"). 
                By creating an account, accessing our website, or using any of our services, you agree to:
              </p>
              <ul className="space-y-2">
                <li>Be bound by these Terms and all applicable laws and regulations</li>
                <li>Our <Link href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
                <li>Our <Link href="/legal/disclaimer" className="text-blue-600 hover:underline">Legal Disclaimer</Link></li>
                <li>Any additional terms specific to certain features</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Eligibility & Account Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Eligibility</h3>
              <p>To use LegalEase AI, you must:</p>
              <ul className="space-y-2">
                <li>Be at least 18 years old</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using the service under applicable laws</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Account Security</h3>
              <p>You are responsible for:</p>
              <ul className="space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and current information</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>LegalEase AI provides:</p>
              <ul className="space-y-2">
                <li><strong>AI Document Analysis:</strong> Automated analysis of legal documents</li>
                <li><strong>Risk Assessment:</strong> AI-powered risk identification and scoring</li>
                <li><strong>Document Summarization:</strong> Concise summaries of legal content</li>
                <li><strong>AI Legal Assistant:</strong> Chat-based legal information (not advice)</li>
                <li><strong>Document Comparison:</strong> Side-by-side document analysis</li>
                <li><strong>Template Library:</strong> Access to legal document templates</li>
              </ul>

              <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <strong>Important:</strong> Our AI provides information and analysis for educational purposes only. 
                This is NOT legal advice. See our <Link href="/legal/disclaimer" className="underline">Legal Disclaimer</Link>.
              </p>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-600" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                You MAY:
              </h3>
              <ul className="space-y-2">
                <li>Use the service for lawful purposes only</li>
                <li>Upload documents you own or have permission to analyze</li>
                <li>Share analysis results with authorized parties</li>
                <li>Use AI insights to inform your legal research</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                You MAY NOT:
              </h3>
              <ul className="space-y-2">
                <li><strong>Upload illegal content:</strong> Documents related to illegal activities</li>
                <li><strong>Violate privacy:</strong> Upload documents containing others' confidential information without consent</li>
                <li><strong>Misuse the service:</strong> Attempt to reverse-engineer, hack, or exploit vulnerabilities</li>
                <li><strong>Spam or abuse:</strong> Send spam, malware, or excessive requests</li>
                <li><strong>Resell or redistribute:</strong> Resell access or redistribute our AI analysis</li>
                <li><strong>Impersonate others:</strong> Create fake accounts or impersonate individuals/entities</li>
                <li><strong>Scrape or mine data:</strong> Use automated tools to extract data</li>
              </ul>

              <p className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900">
                <strong>⚠️ Violation of these terms may result in immediate account suspension or termination.</strong>
              </p>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Our IP</h3>
              <p>
                LegalEase AI, our logo, design, AI models, algorithms, and all content are protected by 
                copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="space-y-2">
                <li>Copy, modify, or distribute our platform or content</li>
                <li>Use our branding without permission</li>
                <li>Create derivative works based on our service</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Your Content</h3>
              <p>
                You retain ownership of documents you upload. By using our service, you grant us a 
                limited license to:
              </p>
              <ul className="space-y-2">
                <li>Process your documents using our AI</li>
                <li>Store documents temporarily (auto-deleted after 30 days)</li>
                <li>Generate analysis and insights for you</li>
              </ul>
              <p className="mt-3 text-green-700 font-semibold">
                ✅ We do NOT claim ownership of your documents or use them to train our AI models.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                LegalEase AI is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, 
                either express or implied, including but not limited to:
              </p>
              <ul className="space-y-2">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Accuracy, completeness, or reliability of AI-generated content</li>
                <li>Uninterrupted or error-free service</li>
                <li>Security of data transmission</li>
                <li>Results or outcomes from using the service</li>
              </ul>
              <p className="mt-4 font-semibold text-amber-900">
                You use this service at your own risk. We do not guarantee specific results.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                To the maximum extent permitted by law, LegalEase AI and its affiliates shall NOT be 
                liable for any:
              </p>
              <ul className="space-y-2">
                <li><strong>Indirect, incidental, special, or consequential damages</strong></li>
                <li><strong>Loss of profits, data, or business opportunities</strong></li>
                <li><strong>Damages resulting from:</strong>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>Use or inability to use the service</li>
                    <li>Reliance on AI-generated content</li>
                    <li>Errors, omissions, or inaccuracies in analysis</li>
                    <li>Unauthorized access to your data</li>
                    <li>Third-party services or integrations</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-4 p-4 bg-slate-100 border border-slate-300 rounded-lg">
                <strong>Maximum Liability:</strong> Our total liability for any claims shall not exceed 
                the amount you paid us in the 12 months prior to the claim (or $100 if no payment was made).
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                You agree to indemnify and hold harmless LegalEase AI from any claims, damages, losses, 
                or expenses (including legal fees) arising from:
              </p>
              <ul className="space-y-2">
                <li>Your use or misuse of the service</li>
                <li>Violation of these Terms</li>
                <li>Violation of any third-party rights</li>
                <li>Content you upload or share</li>
                <li>Your breach of applicable laws</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <p>
                You may terminate your account at any time through account settings or by contacting us.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">Our Rights</h3>
              <p>We may suspend or terminate your access if you:</p>
              <ul className="space-y-2">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Pose a security or legal risk</li>
                <li>Have not logged in for an extended period</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Effect of Termination</h3>
              <p>Upon termination:</p>
              <ul className="space-y-2">
                <li>Your access to the service will cease immediately</li>
                <li>Your data will be deleted per our retention policy</li>
                <li>Outstanding payments remain due</li>
                <li>Certain provisions survive (liability, indemnification, etc.)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Governing Law & Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Governing Law</h3>
              <p>
                These Terms are governed by and construed in accordance with applicable laws, 
                without regard to conflict of law principles.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">Dispute Resolution</h3>
              <p>For any disputes:</p>
              <ol className="space-y-2">
                <li><strong>Informal Resolution:</strong> Contact us first to resolve informally</li>
                <li><strong>Mediation:</strong> If unresolved, we agree to good-faith mediation</li>
                <li><strong>Arbitration/Litigation:</strong> As a last resort, through appropriate legal channels</li>
              </ol>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We may modify these Terms at any time. Changes will be effective upon posting with 
                an updated "Last Updated" date. Material changes will be communicated via:
              </p>
              <ul className="space-y-2">
                <li>Email notification</li>
                <li>In-app notification</li>
                <li>Prominent notice on our website</li>
              </ul>
              <p className="mt-3">
                Continued use after changes constitutes acceptance. If you don't agree, stop using 
                the service and close your account.
              </p>
            </CardContent>
          </Card>

          {/* Section 12 */}
          <Card>
            <CardHeader>
              <CardTitle>General Provisions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <ul className="space-y-2">
                <li><strong>Severability:</strong> If any provision is invalid, the rest remains in effect</li>
                <li><strong>No Waiver:</strong> Failure to enforce rights doesn't waive future enforcement</li>
                <li><strong>Entire Agreement:</strong> These Terms constitute the complete agreement</li>
                <li><strong>Assignment:</strong> You may not assign rights; we may assign to affiliates</li>
                <li><strong>Force Majeure:</strong> We're not liable for events beyond our control</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle>Questions About These Terms?</CardTitle>
              <CardDescription>
                Contact us if you have any questions or concerns.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p><strong>Legal Team:</strong> legal@legalease-ai.com</p>
                <p><strong>Support:</strong> support@legalease-ai.com</p>
                <p><strong>General Inquiries:</strong> info@legalease-ai.com</p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-2"><strong>Related Documents:</strong></p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/legal/disclaimer" className="text-blue-600 hover:underline text-sm">
                    Legal Disclaimer
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/legal/privacy" className="text-blue-600 hover:underline text-sm">
                    Privacy Policy
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/legal/security" className="text-blue-600 hover:underline text-sm">
                    Security & Compliance
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
          <p className="text-center text-indigo-900 font-semibold">
            📋 By using LegalEase AI, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

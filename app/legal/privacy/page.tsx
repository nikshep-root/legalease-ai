import { Shield, Lock, Eye, Database, UserX, Download, FileText, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Effective Date: October 23, 2025 | Last Updated: October 23, 2025
          </p>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 border-blue-400 bg-blue-50">
          <Shield className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>TL;DR:</strong> We encrypt your data, never sell it, and automatically delete documents after 30 days. 
            You have full control over your information.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <ul className="space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
                <li><strong>Profile Data:</strong> Optional bio, social links, profile photo</li>
                <li><strong>Authentication:</strong> Google account info (if using Google Sign-In)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Document Data</h3>
              <ul className="space-y-2">
                <li><strong>Uploaded Documents:</strong> PDF files you upload for analysis</li>
                <li><strong>Analysis Results:</strong> AI-generated summaries and risk assessments</li>
                <li><strong>Chat History:</strong> Conversations with our AI assistant</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Usage Data</h3>
              <ul className="space-y-2">
                <li><strong>Analytics:</strong> Page views, feature usage, session duration</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Cookies:</strong> Session cookies for authentication</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>We use your information to:</p>
              <ul className="space-y-2">
                <li><strong>Provide Services:</strong> Process documents, generate AI analysis, manage your account</li>
                <li><strong>Improve Platform:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                <li><strong>Communication:</strong> Send important updates, security alerts, feature announcements</li>
                <li><strong>Security:</strong> Detect fraud, prevent abuse, protect user data</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
              <p className="mt-4 font-semibold text-green-700">
                ✅ We NEVER sell your personal data to third parties
              </p>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Data Security & Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Security Measures</h3>
              <ul className="space-y-2">
                <li><strong>Encryption in Transit:</strong> All data encrypted using TLS/SSL (HTTPS)</li>
                <li><strong>Encryption at Rest:</strong> Documents encrypted with AES-256 in Firebase Storage</li>
                <li><strong>Secure Authentication:</strong> OAuth 2.0 for Google Sign-In, bcrypt for passwords</li>
                <li><strong>Access Controls:</strong> Role-based permissions, user data isolation</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Compliance</h3>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <strong className="text-blue-700">GDPR Compliant</strong>
                </div>
                <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <strong className="text-green-700">SOC 2 Type II</strong>
                </div>
                <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <strong className="text-purple-700">ISO 27001</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-600" />
                Data Retention & Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-3">Automatic Deletion</h3>
              <ul className="space-y-2">
                <li><strong>Uploaded Documents:</strong> Automatically deleted after <strong>30 days</strong></li>
                <li><strong>Analysis Results:</strong> Deleted along with source documents</li>
                <li><strong>Chat History:</strong> Retained for 90 days, then automatically deleted</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">User Control</h3>
              <ul className="space-y-2">
                <li><strong>Manual Deletion:</strong> Delete any document or chat anytime from your dashboard</li>
                <li><strong>Account Deletion:</strong> Request complete account deletion via settings</li>
                <li><strong>Data Export:</strong> Download all your data before deletion (available soon)</li>
              </ul>

              <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <strong>⏰ Documents are NEVER stored permanently.</strong> We automatically delete all uploaded 
                files after 30 days to protect your privacy.
              </p>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>We use the following trusted third-party services:</p>
              <ul className="space-y-3 mt-4">
                <li>
                  <strong>Google Cloud (Firebase):</strong> Data storage and authentication
                  <br />
                  <a href="https://firebase.google.com/support/privacy" className="text-blue-600 hover:underline text-sm">
                    View Firebase Privacy Policy →
                  </a>
                </li>
                <li>
                  <strong>Google AI (Gemini):</strong> Document analysis and AI chat
                  <br />
                  <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline text-sm">
                    View Google Privacy Policy →
                  </a>
                </li>
                <li>
                  <strong>Vercel:</strong> Website hosting and deployment
                  <br />
                  <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline text-sm">
                    View Vercel Privacy Policy →
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-sm text-slate-600">
                These services have their own privacy policies and security practices. We carefully select 
                providers that meet high security standards.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Your Privacy Rights (GDPR)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>Under GDPR and similar privacy laws, you have the right to:</p>
              <ul className="space-y-2">
                <li><strong>Access:</strong> Request a copy of all personal data we hold about you</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure ("Right to be Forgotten"):</strong> Request deletion of your data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
                <li><strong>Restriction:</strong> Limit how we use your data</li>
                <li><strong>Withdraw Consent:</strong> Revoke consent for data processing at any time</li>
              </ul>

              <p className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <strong>To exercise your rights:</strong> Email us at{' '}
                <a href="mailto:privacy@legalease-ai.com" className="text-blue-600 hover:underline">
                  privacy@legalease-ai.com
                </a>
                {' '}or use the privacy controls in your account settings.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>We use minimal cookies for:</p>
              <ul className="space-y-2">
                <li><strong>Essential Cookies:</strong> Authentication, session management (required)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings (theme, language)</li>
                <li><strong>Analytics Cookies:</strong> Understand how you use our platform (optional)</li>
              </ul>
              <p className="mt-4">
                You can control cookie preferences in your browser settings. Disabling essential cookies 
                may affect platform functionality.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                LegalEase AI is not intended for users under 18 years of age. We do not knowingly collect 
                personal information from children. If you believe a child has provided us with personal data, 
                please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We may update this Privacy Policy periodically. Changes will be posted on this page with 
                an updated "Last Updated" date. Significant changes will be communicated via email. 
                Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
              <CardDescription>
                Questions or concerns about your privacy? We're here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p><strong>Privacy Team Email:</strong> privacy@legalease-ai.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@legalease-ai.com</p>
                <p><strong>General Inquiries:</strong> support@legalease-ai.com</p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-2"><strong>Related Policies:</strong></p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/legal/disclaimer" className="text-blue-600 hover:underline text-sm">
                    Legal Disclaimer
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/legal/terms" className="text-blue-600 hover:underline text-sm">
                    Terms of Service
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
        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-center text-blue-900 font-semibold">
            🔒 Your privacy is our priority. We're committed to protecting your data and giving you control.
          </p>
        </div>
      </div>
    </div>
  );
}

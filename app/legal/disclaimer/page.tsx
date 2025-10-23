import { Scale, AlertTriangle, Shield, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-100 p-4 rounded-full">
              <Scale className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Legal Disclaimer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Important information about the use of LegalEase AI services
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: October 23, 2025
          </p>
        </div>

        {/* Warning Alert */}
        <Alert className="mb-8 border-amber-400 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900 font-medium">
            <strong>IMPORTANT:</strong> This service is NOT a substitute for professional legal advice. 
            Always consult a qualified attorney for legal matters.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                No Attorney-Client Relationship
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                The use of LegalEase AI and any information provided through our platform does <strong>NOT</strong> create 
                an attorney-client relationship between you and LegalEase AI, its owners, operators, or any affiliated parties.
              </p>
              <p>
                Any information, document analysis, summaries, or recommendations provided by our AI-powered tools are 
                for <strong>informational and educational purposes only</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Not Legal Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                LegalEase AI is an artificial intelligence-powered document analysis tool. The content, analysis, 
                and suggestions provided should <strong>NOT be construed as legal advice</strong>.
              </p>
              <ul className="space-y-2">
                <li>Our AI analyzes patterns and provides general information</li>
                <li>We do not provide legal opinions or represent you in legal matters</li>
                <li>AI-generated content may contain errors or omissions</li>
                <li>Legal requirements vary by jurisdiction and individual circumstances</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                Consult a Licensed Attorney
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Before making any legal decisions or taking any legal actions:
              </p>
              <ul className="space-y-2">
                <li><strong>Always consult</strong> with a licensed attorney in your jurisdiction</li>
                <li><strong>Verify all information</strong> provided by our AI tools with legal professionals</li>
                <li><strong>Do not rely solely</strong> on AI-generated analysis for legal decisions</li>
                <li><strong>Seek professional review</strong> of any documents before signing or submitting</li>
              </ul>
              <p className="mt-4">
                A qualified attorney can provide personalized legal advice based on your specific situation, 
                applicable laws, and jurisdiction.
              </p>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Limitations of AI Technology
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                While we use advanced AI technology, you acknowledge and understand that:
              </p>
              <ul className="space-y-2">
                <li><strong>AI is not perfect:</strong> Our system may make errors, omissions, or provide incomplete analysis</li>
                <li><strong>Context matters:</strong> AI may not fully understand the nuances of your specific legal situation</li>
                <li><strong>Jurisdictional differences:</strong> Laws vary by location; our AI provides general analysis</li>
                <li><strong>Constant changes:</strong> Laws and regulations change; AI training data may not reflect the latest updates</li>
                <li><strong>No guarantees:</strong> We make no warranties about the accuracy, completeness, or reliability of AI-generated content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                To the fullest extent permitted by law, LegalEase AI and its affiliates shall <strong>NOT be liable</strong> for:
              </p>
              <ul className="space-y-2">
                <li>Any decisions made based on information provided by our platform</li>
                <li>Any damages, losses, or consequences arising from use of our services</li>
                <li>Errors, omissions, or inaccuracies in AI-generated content</li>
                <li>Any reliance placed on our AI analysis or recommendations</li>
              </ul>
              <p className="mt-4 font-semibold">
                You use this service entirely at your own risk and responsibility.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle>Your Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                By using LegalEase AI, you agree to:
              </p>
              <ul className="space-y-2">
                <li>Use the service for informational purposes only</li>
                <li>Not rely on AI-generated content as a substitute for legal advice</li>
                <li>Consult with qualified legal professionals before making legal decisions</li>
                <li>Verify all information independently</li>
                <li>Understand the limitations of AI technology</li>
                <li>Accept full responsibility for your use of the platform</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                This disclaimer is governed by and construed in accordance with applicable laws. 
                Any disputes arising from the use of this service shall be subject to the exclusive 
                jurisdiction of the appropriate courts.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We reserve the right to modify this disclaimer at any time. Changes will be effective 
                immediately upon posting. Your continued use of LegalEase AI after changes constitutes 
                acceptance of the updated disclaimer.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle>Questions or Concerns?</CardTitle>
              <CardDescription>
                If you have any questions about this disclaimer, please contact us:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@legalease-ai.com</p>
                <p><strong>Address:</strong> LegalEase AI, Legal Department</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <p className="text-center text-amber-900 font-semibold">
            ⚖️ By using LegalEase AI, you acknowledge that you have read, understood, 
            and agree to this disclaimer. If you do not agree, please do not use our services.
          </p>
        </div>
      </div>
    </div>
  );
}

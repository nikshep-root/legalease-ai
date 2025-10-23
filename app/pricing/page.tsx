'use client';

import { useState } from 'react';
import { Check, X, Zap, Building2, Sparkles, ArrowRight, Shield, Users, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = (plan: string) => {
    if (!session) {
      router.push('/signin?callbackUrl=/pricing');
    } else {
      // In production, this would go to checkout
      router.push('/dashboard');
    }
  };

  const plans = {
    monthly: {
      free: { price: 0, period: 'month' },
      pro: { price: 29, period: 'month' },
      enterprise: { price: 'Custom', period: 'month' }
    },
    annual: {
      free: { price: 0, period: 'year' },
      pro: { price: 290, period: 'year', save: '17%' },
      enterprise: { price: 'Custom', period: 'year' }
    }
  };

  const currentPricing = plans[billingPeriod];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            💎 Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-4 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                billingPeriod === 'annual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="h-8 w-8 text-slate-600" />
              </div>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out LegalEase AI</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleGetStarted('free')}
                className="w-full mb-6" 
                variant="outline"
              >
                Get Started Free
              </Button>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>5 documents</strong> per month</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Basic AI analysis</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Document summarization</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Risk assessment</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI chat assistant</strong> (10 messages/day)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Template library</strong> access</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400">Advanced AI features</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400">Document comparison</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400">Priority support</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-slate-500">
              No credit card required
            </CardFooter>
          </Card>

          {/* Pro Plan - Most Popular */}
          <Card className="border-2 border-blue-500 hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1">
                ⭐ Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For professionals and small teams</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    ${typeof currentPricing.pro.price === 'number' ? currentPricing.pro.price : currentPricing.pro.price}
                  </span>
                  <span className="text-slate-600">/{currentPricing.pro.period}</span>
                </div>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-1">
                    💰 Save ${29 * 12 - 290}/year
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleGetStarted('pro')}
                className="w-full mb-6 bg-blue-600 hover:bg-blue-700"
              >
                Start Pro Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Unlimited documents</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Advanced AI analysis</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Document comparison</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Unlimited AI chat</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>PDF export</strong> of analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Custom templates</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Priority email support</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Analytics dashboard</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>API access</strong></span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-slate-500">
              14-day free trial • Cancel anytime
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For large teams and organizations</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">Custom</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Tailored to your needs
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/contact')}
                className="w-full mb-6" 
                variant="outline"
              >
                Contact Sales
              </Button>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Everything in Pro</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Unlimited users</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Dedicated account manager</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Custom AI training</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>SSO & SAML</strong> authentication</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Advanced security</strong> & compliance</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>24/7 phone support</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>SLA guarantee</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>On-premise deployment</strong> option</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-slate-500">
              Custom contract • Volume discounts
            </CardFooter>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold bg-blue-50">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">Documents per month</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-center py-3 px-4 bg-blue-50">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">AI chat messages</td>
                  <td className="text-center py-3 px-4">10/day</td>
                  <td className="text-center py-3 px-4 bg-blue-50">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Document comparison</td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center py-3 px-4 bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">PDF export</td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center py-3 px-4 bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">API access</td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center py-3 px-4 bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Team members</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4 bg-blue-50">Up to 5</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Support</td>
                  <td className="text-center py-3 px-4">Community</td>
                  <td className="text-center py-3 px-4 bg-blue-50">Email</td>
                  <td className="text-center py-3 px-4">24/7 Phone</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">SLA</td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center py-3 px-4 bg-blue-50"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! You can cancel your subscription at any time. Your access continues until the end 
                  of your billing period, and you won't be charged again.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Pro plan comes with a 14-day free trial. No credit card required. The Free plan is 
                  always free with no trial needed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and 
                  wire transfer for Enterprise plans.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect 
                  immediately and billing is prorated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! We use AES-256 encryption, TLS/SSL, and automatically delete documents after 30 days. 
                  See our <Link href="/legal/security" className="text-blue-600 hover:underline">Security Policy</Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust LegalEase AI with their legal documents
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => handleGetStarted('free')}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-slate-100"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => router.push('/contact')}
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Contact Sales
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">Trusted by legal professionals worldwide</p>
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">AES-256 Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

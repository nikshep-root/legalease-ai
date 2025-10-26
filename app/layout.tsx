import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingChatButton } from "@/components/floating-chat-button"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://legalease-ai-591134707706.us-central1.run.app'),
  title: {
    default: 'LegalEase AI - AI-Powered Legal Document Analysis',
    template: '%s | LegalEase AI'
  },
  description: 'Transform legal documents into actionable insights with LegalEase AI. Powered by Google Gemini 2.0, our platform provides instant analysis, risk detection, and intelligent summaries for contracts, NDAs, and legal agreements.',
  keywords: [
    'legal document analysis',
    'AI legal assistant',
    'contract analysis',
    'legal AI',
    'document review',
    'legal tech',
    'Gemini AI',
    'Google Cloud',
    'legal automation',
    'contract review',
    'NDA analysis',
    'legal compliance',
    'document intelligence',
    'AI contract review',
    'legal document scanning'
  ],
  authors: [{ name: 'LegalEase AI Team' }],
  creator: 'LegalEase AI',
  publisher: 'LegalEase AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legalease-ai-591134707706.us-central1.run.app',
    title: 'LegalEase AI - AI-Powered Legal Document Analysis',
    description: 'Transform legal documents into actionable insights with Google Gemini 2.0 powered AI analysis.',
    siteName: 'LegalEase AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LegalEase AI - AI-Powered Legal Document Analysis',
    description: 'Transform legal documents into actionable insights with Google Gemini 2.0 powered AI analysis.',
    creator: '@legalease_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google2fa25c73ab809fb8',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <FloatingChatButton />
            <LegalDisclaimer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

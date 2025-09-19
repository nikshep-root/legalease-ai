import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "LegalEase AI - Simplify Legal Documents with AI",
  description:
    "Upload legal documents and get AI-powered summaries, risk analysis, and key clause identification. Perfect for students, professionals, and businesses.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}

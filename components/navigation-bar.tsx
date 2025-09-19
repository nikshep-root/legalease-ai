"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Scale } from "lucide-react"

export function NavigationBar() {
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === "loading") {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Scale className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">LegalEase</span>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Scale className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">LegalEase</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {session && (
              <>
                <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                  Upload Document
                </Link>
                <Link href="/documents" className="text-gray-600 hover:text-gray-900">
                  Documents
                </Link>
                <Link href="/compare" className="text-gray-600 hover:text-gray-900">
                  Compare
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Hello, {session.user?.name || session.user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
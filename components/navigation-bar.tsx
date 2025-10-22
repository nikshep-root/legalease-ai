"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Scale } from "lucide-react"
import { MobileSidebar, MobileMenuButton } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function NavigationBar() {
  const { data: session, status } = useSession()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
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
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              <MobileMenuButton onClick={toggleMobileSidebar} />
              
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Scale className="w-8 h-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">LegalEase</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {session && (
                <>
                  <Link href="/upload" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Upload
                  </Link>
                  <Link href="/templates" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Templates
                  </Link>
                  <Link href="/documents" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Documents
                  </Link>
                  <Link href="/analytics" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Analytics
                  </Link>
                  <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Blog
                  </Link>
                </>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              {session ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="max-w-[120px] truncate">{session.user?.name || 'Profile'}</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/signin">
                    <Button variant="ghost" size="sm">
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

            {/* Mobile User Avatar/Sign In Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              {session ? (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              ) : (
                <Link href="/signin">
                  <Button size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={closeMobileSidebar} 
      />
    </>
  )
}
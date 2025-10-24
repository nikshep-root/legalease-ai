"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Scale, ChevronDown } from "lucide-react"
import { MobileSidebar, MobileMenuButton } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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
                  
                  {/* Documents Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none">
                      Documents
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/documents" className="w-full cursor-pointer">
                          📄 My Documents
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/history" className="w-full cursor-pointer">
                          🕒 History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/compare" className="w-full cursor-pointer">
                          🔄 Compare
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="w-full cursor-pointer">
                          📊 Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Link href="/analytics" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Analytics
                  </Link>
                  <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Blog
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Pricing
                  </Link>
                  <Link href="/tech-stack" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Tech Stack
                  </Link>
                </>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              {session ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="max-w-[100px] truncate">{session.user?.name || session.user?.email?.split('@')[0] || 'User'}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full cursor-pointer">
                          👤 Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="w-full cursor-pointer">
                          📊 Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
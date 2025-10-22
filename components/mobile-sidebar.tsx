"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  User, 
  LogOut, 
  Upload, 
  FileText, 
  ArrowRightLeft, 
  BarChart3,
  Clock,
  TrendingUp,
  X,
  Menu,
  FileCheck
} from "lucide-react"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    onClose()
  }

  const handleLinkClick = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LE</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900">LegalEase</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        {session && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 py-4">
          {session ? (
            <nav className="space-y-1 px-4">
              <Link 
                href="/upload" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <Upload className="w-5 h-5" />
                <span>Upload Document</span>
              </Link>
              
              <Link 
                href="/history" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <Clock className="w-5 h-5" />
                <span>Analysis History</span>
              </Link>
              
              <Link 
                href="/analytics" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Risk Analytics</span>
              </Link>
              
              <Link 
                href="/documents" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <FileText className="w-5 h-5" />
                <span>My Documents</span>
              </Link>
              
              <Link 
                href="/compare" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <ArrowRightLeft className="w-5 h-5" />
                <span>Compare Documents</span>
              </Link>
              
              <Link 
                href="/templates" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <FileCheck className="w-5 h-5" />
                <span>Templates</span>
              </Link>
              
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLinkClick}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </nav>
          ) : (
            <div className="px-4 space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Sign in to access all features
              </p>
              <Link href="/signin" onClick={handleLinkClick}>
                <Button className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/signin" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full justify-center">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        {session && (
          <div className="border-t p-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-center flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="md:hidden p-2"
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
}
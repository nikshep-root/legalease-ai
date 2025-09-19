"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Scale, ArrowLeft } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (!formData.email) {
      newErrors.push("Email is required")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push("Please enter a valid email address")
    }
    
    if (!formData.password) {
      newErrors.push("Password is required")
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.push("Password must be at least 8 characters long")
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.push("Name is required")
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.push("Passwords do not match")
      }
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsLoading(true)
    setErrors([])
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        isSignUp: (!isLogin).toString(),
        redirect: false,
      })

      if (result?.error) {
        setErrors([result.error])
      } else if (result?.ok) {
        // Authentication successful, redirect to home page
        router.push('/')
        router.refresh()
      }
      
    } catch (error) {
      console.error('Authentication error:', error)
      setErrors(["Authentication failed. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">LegalEase</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? "Sign in to access your legal document analysis" 
              : "Join LegalEase to start analyzing your legal documents"
            }
          </p>
        </div>

        {/* Sign In/Up Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Sign In" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Enter your credentials to access your account" 
                : "Create a new account to get started"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Create a password (min. 8 characters)"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              )}

              {/* Error messages */}
              {errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index} className="text-red-700">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? "Signing in..." : "Creating account...") 
                  : (isLogin ? "Sign In" : "Create Account")
                }
              </Button>
            </form>

            {/* Forgot password link for login */}
            {isLogin && (
              <div className="text-center mt-4">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            {/* Toggle between login and signup */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setFormData({ email: "", password: "", confirmPassword: "", name: "" })
                    setErrors([])
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>By signing {isLogin ? "in" : "up"}, you agree to our</p>
          <div className="space-x-4">
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
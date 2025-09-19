"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play, FileText, Upload, Brain, CheckCircle } from "lucide-react"

export function DemoModal() {
  const [currentStep, setCurrentStep] = useState(0)

  const demoSteps = [
    {
      title: "Upload Your Document",
      description: "Drag and drop any PDF or text file containing legal content",
      icon: <Upload className="w-8 h-8 text-primary" />,
      content:
        "Simply drag your legal document into our secure upload area. We support PDFs, contracts, agreements, and text files up to 10MB.",
    },
    {
      title: "AI Analysis in Progress",
      description: "Our advanced AI processes your document in seconds",
      icon: <Brain className="w-8 h-8 text-primary" />,
      content:
        "Our AI-powered system analyzes your document, identifying key clauses, risks, obligations, and important deadlines.",
    },
    {
      title: "Get Comprehensive Results",
      description: "Receive detailed insights in an easy-to-understand format",
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      content:
        "View your analysis results organized into clear sections: summary, risks, obligations, key clauses, and deadlines.",
    },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
          <Play className="w-5 h-5 mr-2" />
          Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            How LegalEase AI Works
          </DialogTitle>
          <DialogDescription>See how easy it is to analyze legal documents with AI</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex justify-center space-x-2">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">{demoSteps[currentStep].icon}</div>
            <h3 className="text-xl font-semibold">{demoSteps[currentStep].title}</h3>
            <p className="text-muted-foreground">{demoSteps[currentStep].description}</p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{demoSteps[currentStep].content}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentStep < demoSteps.length - 1) {
                  setCurrentStep(currentStep + 1)
                } else {
                  // Close modal and redirect to upload
                  window.location.href = "/upload"
                }
              }}
            >
              {currentStep === demoSteps.length - 1 ? "Try It Now" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

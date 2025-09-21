"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react"
import type { DocumentAnalysis } from "@/lib/document-processor"

interface DocumentChatProps {
  analysis: DocumentAnalysis
  documentText?: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export function DocumentChat({ analysis, documentText }: DocumentChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm here to help you understand your document analysis. I can answer questions about the risks, obligations, key clauses, and deadlines in your ${analysis.documentType.toLowerCase()}. What would you like to know?`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          documentAnalysis: analysis,
          documentText: documentText || "",
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.content ||
          "I apologize, but I'm having trouble processing your question right now. Please try rephrasing it or ask about specific aspects of your document analysis.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      // Chat error occurred
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. You can still review the detailed analysis in the tabs above, or try asking your question again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    "What are the main risks I should be concerned about?",
    "Can you explain the key obligations in simple terms?",
    "What happens if I miss the deadlines?",
    "Are there any red flags in this document?",
    "What should I negotiate before signing?",
  ]

  if (!isOpen) {
    return (
      <Card className="border-primary/20 bg-card">
        <CardContent className="pt-6">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center gap-2 font-medium !bg-primary !text-primary-foreground hover:!bg-primary/90 border-0"
            variant="default"
          >
            <MessageCircle className="w-4 h-4" />
            Ask Questions About Your Document
          </Button>
          <p className="text-sm text-foreground/80 mt-2 text-center">Get instant answers about your analysis results</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Document Assistant
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-80 w-full border rounded-md p-4 bg-background">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex-1 space-y-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
            <div className="grid gap-2">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto p-2 text-xs bg-transparent"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          This AI assistant provides general information. Always consult with a qualified attorney for legal advice.
        </p>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from './language-provider'
import { useChat } from './chat-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const schemeRecommendations = [
  {
    trigger: ['education', 'study', 'school', 'college', 'scholarship', 'student'],
    response: "Based on your interest in education, I recommend:\n\n1. **National Scholarship Portal** - Up to ₹50,000/year for students\n2. **PM Vidya Lakshmi** - Education loans with interest subsidy\n3. **State Merit Scholarship** - For top-performing students\n\nWould you like me to check your eligibility for any of these?",
    schemes: ['education'],
  },
  {
    trigger: ['farmer', 'agriculture', 'farming', 'crop', 'kisan'],
    response: "For agriculture support, here are suitable schemes:\n\n1. **PM-KISAN** - ₹6,000/year direct benefit\n2. **Kisan Credit Card** - Low-interest farm loans\n3. **Fasal Bima Yojana** - Crop insurance protection\n\nShall I help you apply for any of these?",
    schemes: ['agriculture'],
  },
  {
    trigger: ['house', 'home', 'housing', 'accommodation', 'awas'],
    response: "For housing assistance, consider these schemes:\n\n1. **PM Awas Yojana** - Subsidy up to ₹2.67 lakh for home construction\n2. **Credit Linked Subsidy Scheme** - Interest subsidy on home loans\n\nWould you like to check your eligibility?",
    schemes: ['housing'],
  },
  {
    trigger: ['health', 'medical', 'hospital', 'treatment', 'insurance'],
    response: "For healthcare support, I recommend:\n\n1. **Ayushman Bharat** - Free treatment up to ₹5 lakh/year\n2. **State Health Insurance** - Additional coverage for families\n3. **Jan Aushadhi** - Affordable medicines\n\nWant me to help you enroll?",
    schemes: ['health'],
  },
  {
    trigger: ['job', 'employment', 'work', 'skill', 'training', 'rojgar'],
    response: "For employment and skill development:\n\n1. **PM Kaushal Vikas Yojana** - Free skill training with certification\n2. **MGNREGA** - Guaranteed 100 days of employment\n3. **Startup India** - Support for entrepreneurs\n\nShall I guide you through the application process?",
    schemes: ['employment'],
  },
  {
    trigger: ['loan', 'finance', 'money', 'credit', 'mudra'],
    response: "For financial support:\n\n1. **PM Mudra Yojana** - Business loans up to ₹10 lakh\n2. **Stand-Up India** - Loans for SC/ST/Women entrepreneurs\n3. **Sukanya Samriddhi** - Savings scheme for girl child\n\nWould you like details on any of these?",
    schemes: ['finance'],
  },
  {
    trigger: ['status', 'application', 'track', 'check', 'update'],
    response: "I can help you track your application status! Based on your records:\n\n📋 **PM-KISAN**: Approved - Disbursement on 15th March\n📋 **Scholarship**: Under Review - Fraud check completed\n\nWould you like more details on any specific application?",
    schemes: [],
  },
  {
    trigger: ['eligibility', 'eligible', 'qualify', 'criteria'],
    response: "To check your eligibility, I need some information:\n\n1. Your annual family income\n2. Category (General/SC/ST/OBC)\n3. State of residence\n4. Occupation\n\nPlease share these details, and I'll find all schemes you qualify for!",
    schemes: [],
  },
]

const defaultResponse = "I'm here to help you find the right government schemes and subsidies. You can ask me about:\n\n• Education scholarships\n• Agriculture support\n• Housing assistance\n• Healthcare schemes\n• Employment programs\n• Financial aid\n• Application status\n\nHow can I assist you today?"

export function Chatbot() {
  const { t } = useLanguage()
  const { messages, addMessage, isOpen, setIsOpen, isListening, setIsListening } = useChat()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [setIsListening])

  // Handle listening state changes
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch {
        // Recognition might already be running
      }
    } else if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // Recognition might not be running
      }
    }
  }, [isListening])

  const getAIResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    for (const rec of schemeRecommendations) {
      if (rec.trigger.some(trigger => lowerMessage.includes(trigger))) {
        return rec.response
      }
    }
    
    return defaultResponse
  }, [])

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Remove markdown formatting for speech
      const cleanText = text.replace(/\*\*/g, '').replace(/\n/g, '. ')
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const handleSend = useCallback(() => {
    if (!input.trim()) return

    addMessage('user', input)
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(input)
      addMessage('assistant', response)
      setIsTyping(false)
      speakText(response)
    }, 1000)
  }, [input, addMessage, getAIResponse, speakText])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        size="icon"
        aria-label={t('chatWithUs')}
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 h-[32rem] sm:h-[36rem] flex flex-col shadow-2xl z-50 border-2">
      <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{t('chatWithUs')}</CardTitle>
              <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Assistant
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">{t('close')}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-base",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary text-secondary-foreground rounded-bl-md'
              )}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {message.content.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-3 border-t bg-card">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={toggleListening}
            className={cn("shrink-0 h-11 w-11", isListening && "animate-pulse")}
            aria-label={isListening ? t('listening') : t('speakNow')}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? t('listening') : t('askQuestion')}
            className="flex-1 h-11 text-base"
            disabled={isListening}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="shrink-0 h-11 w-11"
            aria-label={t('send')}
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => messages.length > 1 && speakText(messages[messages.length - 1].content)}
            className="shrink-0 h-11 w-11"
            aria-label={t('voiceAssistant')}
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

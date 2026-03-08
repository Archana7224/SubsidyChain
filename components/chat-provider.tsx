"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatContextType {
  messages: Message[]
  addMessage: (role: 'user' | 'assistant', content: string) => void
  clearMessages: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI assistant. I can help you find suitable subsidy schemes, check your eligibility, and answer questions about your applications. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I am your AI assistant. I can help you find suitable subsidy schemes, check your eligibility, and answer questions about your applications. How can I help you today?',
        timestamp: new Date(),
      },
    ])
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isOpen,
        setIsOpen,
        isListening,
        setIsListening,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

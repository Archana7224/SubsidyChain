import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LanguageProvider } from '@/components/language-provider'
import { ChatProvider } from '@/components/chat-provider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Citizen Subsidy Portal',
  description: 'Apply for subsidies and track your applications',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#3B5998',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
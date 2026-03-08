"use client"

import { useState } from 'react'
import { useLanguage } from './language-provider'
import { useChat } from './chat-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Bell,
  Menu,
  User,
  Globe,
  Volume2,
  Home,
  FileText,
  LayoutGrid,
  BarChart3,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { t, language, setLanguage, languages } = useLanguage()
  const { setIsOpen, setIsListening, isListening } = useChat()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { key: 'dashboard', icon: Home, href: '#dashboard' },
    { key: 'myApplications', icon: FileText, href: '#applications' },
    { key: 'schemes', icon: LayoutGrid, href: '#schemes' },
    { key: 'transparency', icon: BarChart3, href: '#transparency' },
    { key: 'help', icon: HelpCircle, href: '#help' },
  ]

  const handleVoiceClick = () => {
    setIsListening(!isListening)
    setIsOpen(true)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">C</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Citizen Portal
            </h1>
            <p className="text-xs text-muted-foreground">Subsidy Services</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.key)}</span>
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Voice Assistant Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceClick}
            className={cn(
              "relative h-11 w-11 rounded-full transition-all",
              isListening && "bg-destructive/10 text-destructive animate-pulse"
            )}
            aria-label={t('voiceAssistant')}
          >
            <Volume2 className="h-6 w-6" />
            {isListening && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-ping" />
            )}
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full">
                <Globe className="h-6 w-6" />
                <span className="sr-only">{t('language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "text-base py-2",
                    language === lang.code && "bg-primary/10 font-semibold"
                  )}
                >
                  <span className="mr-2">{lang.nativeName}</span>
                  <span className="text-muted-foreground text-sm">({lang.name})</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive" />
            <span className="sr-only">{t('notifications')}</span>
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full bg-secondary">
                <User className="h-6 w-6" />
                <span className="sr-only">{t('profile')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-base py-2">
                <User className="mr-2 h-5 w-5" />
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base py-2 text-destructive">
                <LogOut className="mr-2 h-5 w-5" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-11 w-11">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 p-4 border-b">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <span className="text-2xl font-bold text-primary-foreground">C</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">Citizen Portal</h1>
                    <p className="text-sm text-muted-foreground">Subsidy Services</p>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      <item.icon className="h-6 w-6" />
                      <span>{t(item.key)}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { Navbar } from '@/components/navbar'
import { ApplicationCard } from '@/components/application-card'
import { SchemeCard } from '@/components/scheme-card'
import { StatsSection } from '@/components/stats-section'
import { CategoryTabs } from '@/components/category-tabs'
import { Chatbot } from '@/components/chatbot'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  Search,
  Sparkles,
  ClipboardList,
  ChevronRight,
} from 'lucide-react'

// Sample data
const applications = [
  {
    id: '1',
    schemeName: 'PM-KISAN Samman Nidhi',
    status: 'disbursed' as const,
    amount: 6000,
    expectedDate: '2026-03-15',
    submittedDate: '2025-12-01',
    category: 'Agriculture',
  },
  {
    id: '2',
    schemeName: 'National Scholarship Portal',
    status: 'fraudCheck' as const,
    amount: 50000,
    expectedDate: '2026-04-01',
    submittedDate: '2026-01-15',
    category: 'Education',
  },
  {
    id: '3',
    schemeName: 'Ayushman Bharat - PMJAY',
    status: 'approved' as const,
    amount: 500000,
    expectedDate: '2026-03-20',
    submittedDate: '2026-02-01',
    category: 'Health',
  },
  {
    id: '4',
    schemeName: 'PM Awas Yojana - Urban',
    status: 'submitted' as const,
    amount: 267000,
    expectedDate: '2026-06-15',
    submittedDate: '2026-02-28',
    category: 'Housing',
  },
]

const schemes = [
  {
    id: '1',
    name: 'PM-KISAN Samman Nidhi',
    category: 'agriculture' as const,
    description: 'Direct income support of ₹6,000 per year to farmer families for agricultural expenses.',
    maxAmount: 6000,
    eligibility: ['Small and marginal farmers', 'Land holding up to 2 hectares', 'Valid Aadhaar card'],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account'],
    applicants: 125000,
    isRecommended: true,
  },
  {
    id: '2',
    name: 'National Scholarship Portal',
    category: 'education' as const,
    description: 'Scholarships for students from economically weaker sections pursuing higher education.',
    maxAmount: 100000,
    eligibility: ['Family income below ₹8 lakh', 'Enrolled in recognized institution', 'Merit-based selection'],
    documents: ['Income Certificate', 'Academic Records', 'Aadhaar Card'],
    applicants: 85000,
    isRecommended: true,
  },
  {
    id: '3',
    name: 'Ayushman Bharat PMJAY',
    category: 'health' as const,
    description: 'Free health insurance coverage up to ₹5 lakh per family per year for hospitalization.',
    maxAmount: 500000,
    eligibility: ['Deprived rural families', 'Identified occupational categories', 'No other health insurance'],
    documents: ['Family Card', 'Aadhaar Card', 'Income Proof'],
    applicants: 200000,
  },
  {
    id: '4',
    name: 'PM Awas Yojana - Urban',
    category: 'housing' as const,
    description: 'Interest subsidy for purchasing or constructing a house for economically weaker sections.',
    maxAmount: 267000,
    eligibility: ['First-time home buyer', 'EWS/LIG category', 'Valid residence proof'],
    documents: ['Income Certificate', 'Address Proof', 'No-property Declaration'],
    applicants: 150000,
  },
  {
    id: '5',
    name: 'PM Mudra Yojana',
    category: 'finance' as const,
    description: 'Collateral-free loans up to ₹10 lakh for small businesses and entrepreneurs.',
    maxAmount: 1000000,
    eligibility: ['Non-corporate small business', 'Engaged in manufacturing/trading', 'Age 18-65 years'],
    documents: ['Business Plan', 'Identity Proof', 'Address Proof'],
    applicants: 95000,
    isRecommended: true,
  },
  {
    id: '6',
    name: 'PM Kaushal Vikas Yojana',
    category: 'employment' as const,
    description: 'Free skill development training with certification for employment opportunities.',
    maxAmount: 0,
    eligibility: ['Indian citizen', 'Age 15-45 years', 'Minimum Class 10 pass'],
    documents: ['Aadhaar Card', 'Education Certificate', 'Bank Account'],
    applicants: 180000,
  },
  {
    id: '7',
    name: 'Sukanya Samriddhi Yojana',
    category: 'finance' as const,
    description: 'High-interest savings scheme for girl child education and marriage expenses.',
    maxAmount: 150000,
    eligibility: ['Girl child below 10 years', 'Maximum 2 accounts per family', 'Indian resident'],
    documents: ['Birth Certificate', "Parent's Aadhaar", 'Address Proof'],
    applicants: 75000,
  },
  {
    id: '8',
    name: 'Fasal Bima Yojana',
    category: 'agriculture' as const,
    description: 'Crop insurance scheme to protect farmers against losses due to natural calamities.',
    maxAmount: 200000,
    eligibility: ['Farmers growing notified crops', 'Both loanee and non-loanee farmers', 'Valid land records'],
    documents: ['Land Records', 'Aadhaar Card', 'Bank Account'],
    applicants: 110000,
  },
]

const stats = {
  totalApplications: 4,
  approvedApplications: 2,
  pendingApplications: 2,
  disbursedAmount: 506000,
  processingDays: 15,
  successRate: 87,
  totalDisbursed: 2850000000,
}

type Category = 'all' | 'education' | 'finance' | 'agriculture' | 'health' | 'housing' | 'employment'

export default function HomePage() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory = activeCategory === 'all' || scheme.category === activeCategory
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const recommendedSchemes = schemes.filter(scheme => scheme.isRecommended)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <section id="dashboard" className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-8 text-primary-foreground">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight text-balance">
              {t('welcome')}
            </h1>
            <p className="mt-2 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              {t('welcomeDesc')}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg font-semibold h-14 px-8"
              >
                {t('applyNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg font-semibold h-14 px-8 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                {t('trackStatus')}
              </Button>
            </div>
          </div>
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute inset-0 bg-primary-foreground rounded-full transform translate-x-1/2 -translate-y-1/2" />
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* My Applications Section */}
        <section id="applications">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="h-7 w-7" />
              {t('myApplications')}
            </h2>
            <Button variant="ghost" className="text-base font-medium">
              {t('viewAll')}
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </section>

        {/* AI Recommendations Section */}
        <section>
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-accent" />
                {t('recommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendedSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* All Schemes Section */}
        <section id="schemes">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t('schemes')}
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('searchSchemes')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <CategoryTabs 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No schemes found matching your criteria.
              </p>
            </div>
          )}
        </section>

        {/* Help Section */}
        <section id="help" className="pb-8">
          <Card className="bg-secondary/50">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t('help')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Need assistance? Our AI chatbot can help you find the right schemes, check eligibility, and answer your questions 24/7.
                  </p>
                </div>
                <Button size="lg" className="text-lg font-semibold h-14 px-8 shrink-0">
                  {t('chatWithUs')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}

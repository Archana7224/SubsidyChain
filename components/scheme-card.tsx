"use client"

import { useLanguage } from './language-provider'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Wallet,
  Tractor,
  Heart,
  Home,
  Briefcase,
  ArrowRight,
  FileText,
  CheckCircle,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Scheme {
  id: string
  name: string
  category: 'education' | 'finance' | 'agriculture' | 'health' | 'housing' | 'employment'
  description: string
  maxAmount: number
  eligibility: string[]
  documents: string[]
  applicants: number
  isRecommended?: boolean
}

interface SchemeCardProps {
  scheme: Scheme
}

const categoryConfig = {
  education: {
    icon: GraduationCap,
    color: 'bg-chart-1 text-primary-foreground',
    lightColor: 'bg-chart-1/10 text-chart-1',
  },
  finance: {
    icon: Wallet,
    color: 'bg-chart-2 text-primary-foreground',
    lightColor: 'bg-chart-2/10 text-chart-2',
  },
  agriculture: {
    icon: Tractor,
    color: 'bg-chart-3 text-primary-foreground',
    lightColor: 'bg-chart-3/10 text-chart-3',
  },
  health: {
    icon: Heart,
    color: 'bg-chart-4 text-primary-foreground',
    lightColor: 'bg-chart-4/10 text-chart-4',
  },
  housing: {
    icon: Home,
    color: 'bg-chart-5 text-primary-foreground',
    lightColor: 'bg-chart-5/10 text-chart-5',
  },
  employment: {
    icon: Briefcase,
    color: 'bg-primary text-primary-foreground',
    lightColor: 'bg-primary/10 text-primary',
  },
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { t } = useLanguage()
  const config = categoryConfig[scheme.category]
  const CategoryIcon = config.icon

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-200 h-full flex flex-col",
      scheme.isRecommended && "ring-2 ring-accent"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("p-3 rounded-lg shrink-0", config.color)}>
            <CategoryIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-xs", config.lightColor)}>
                {t(scheme.category)}
              </Badge>
              {scheme.isRecommended && (
                <Badge className="bg-accent text-accent-foreground text-xs">
                  {t('recommendations').split(' ')[0]}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold text-foreground mt-2 leading-tight">
              {scheme.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-base text-muted-foreground leading-relaxed">
          {scheme.description}
        </p>
        
        {/* Max Amount */}
        <div className="p-3 rounded-lg bg-secondary">
          <p className="text-sm text-muted-foreground">{t('amount')} (Max)</p>
          <p className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(scheme.maxAmount)}
          </p>
        </div>

        {/* Quick Eligibility */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            {t('eligibilityCheck')}
          </p>
          <ul className="space-y-1">
            {scheme.eligibility.slice(0, 3).map((item, index) => (
              <li key={index} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-success mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Applicants */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{scheme.applicants.toLocaleString()} applicants</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <Button className="w-full text-base font-medium" size="lg">
          {t('applyForScheme')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="outline" className="w-full text-base">
          <FileText className="mr-2 h-5 w-5" />
          {t('documentsRequired')}
        </Button>
      </CardFooter>
    </Card>
  )
}

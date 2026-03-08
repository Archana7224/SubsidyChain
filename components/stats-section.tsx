"use client"

import { useLanguage } from './language-provider'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  CheckCircle2,
  Clock,
  Banknote,
  TrendingUp,
  Timer,
  Award,
} from 'lucide-react'

interface StatsData {
  totalApplications: number
  approvedApplications: number
  pendingApplications: number
  disbursedAmount: number
  processingDays: number
  successRate: number
  totalDisbursed: number
}

interface StatsSectionProps {
  stats: StatsData
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { t } = useLanguage()

  const statCards = [
    {
      key: 'totalApplications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'bg-primary text-primary-foreground',
      format: 'number',
    },
    {
      key: 'approvedApplications',
      value: stats.approvedApplications,
      icon: CheckCircle2,
      color: 'bg-success text-success-foreground',
      format: 'number',
    },
    {
      key: 'pendingApplications',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'bg-warning text-warning-foreground',
      format: 'number',
    },
    {
      key: 'disbursedAmount',
      value: stats.disbursedAmount,
      icon: Banknote,
      color: 'bg-accent text-accent-foreground',
      format: 'currency',
    },
  ]

  const transparencyCards = [
    {
      key: 'processingTime',
      value: stats.processingDays,
      icon: Timer,
      suffix: ` ${t('days')}`,
    },
    {
      key: 'successRate',
      value: stats.successRate,
      icon: TrendingUp,
      suffix: '%',
    },
    {
      key: 'totalDisbursed',
      value: stats.totalDisbursed,
      icon: Award,
      format: 'currency',
    },
  ]

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(1)}Cr`
      } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`
      }
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value)
    }
    return value.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {t(stat.key)}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatValue(stat.value, stat.format)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transparency Metrics */}
      <div id="transparency">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {t('transparencyMetrics')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {transparencyCards.map((stat) => (
            <Card key={stat.key} className="bg-secondary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t(stat.key)}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.format === 'currency' 
                      ? formatValue(stat.value, 'currency')
                      : `${stat.value}${stat.suffix || ''}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

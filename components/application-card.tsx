"use client"

import { useLanguage } from './language-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Banknote,
  ChevronRight,
  Shield,
  FileCheck,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Application {
  id: string
  schemeName: string
  status: 'submitted' | 'fraudCheck' | 'approved' | 'disbursed' | 'pending' | 'rejected'
  amount: number
  expectedDate: string
  submittedDate: string
  category: string
}

interface ApplicationCardProps {
  application: Application
}

const statusConfig = {
  submitted: {
    icon: Send,
    color: 'bg-info text-info-foreground',
    bgColor: 'bg-info/10',
    step: 1,
  },
  fraudCheck: {
    icon: Shield,
    color: 'bg-warning text-warning-foreground',
    bgColor: 'bg-warning/10',
    step: 2,
  },
  approved: {
    icon: FileCheck,
    color: 'bg-success text-success-foreground',
    bgColor: 'bg-success/10',
    step: 3,
  },
  disbursed: {
    icon: Banknote,
    color: 'bg-success text-success-foreground',
    bgColor: 'bg-success/10',
    step: 4,
  },
  pending: {
    icon: Clock,
    color: 'bg-warning text-warning-foreground',
    bgColor: 'bg-warning/10',
    step: 0,
  },
  rejected: {
    icon: AlertCircle,
    color: 'bg-destructive text-destructive-foreground',
    bgColor: 'bg-destructive/10',
    step: 0,
  },
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { t } = useLanguage()
  const config = statusConfig[application.status]
  const StatusIcon = config.icon

  const timelineSteps = [
    { key: 'submitted', step: 1 },
    { key: 'fraudCheck', step: 2 },
    { key: 'approved', step: 3 },
    { key: 'disbursed', step: 4 },
  ]

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold text-foreground truncate">
              {application.schemeName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{application.category}</p>
          </div>
          <Badge className={cn("shrink-0 text-sm px-3 py-1", config.color)}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {t(application.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount and Expected Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn("p-3 rounded-lg", config.bgColor)}>
            <p className="text-sm text-muted-foreground">{t('amount')}</p>
            <p className="text-xl font-bold text-foreground">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(application.amount)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground">{t('expectedDate')}</p>
            <p className="text-lg font-semibold text-foreground">
              {new Date(application.expectedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Timeline */}
        {application.status !== 'rejected' && application.status !== 'pending' && (
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {t('applicationTimeline')}
            </p>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, index) => {
                const isCompleted = config.step >= step.step
                const isCurrent = config.step === step.step
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                          isCompleted
                            ? "bg-success text-success-foreground"
                            : "bg-secondary text-muted-foreground",
                          isCurrent && "ring-2 ring-success ring-offset-2"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          step.step
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 text-center max-w-16 leading-tight">
                        {t(step.key)}
                      </span>
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-1 mx-1",
                          config.step > step.step
                            ? "bg-success"
                            : "bg-secondary"
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <Button variant="outline" className="w-full mt-2 text-base font-medium">
          {t('viewDetails')}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  )
}

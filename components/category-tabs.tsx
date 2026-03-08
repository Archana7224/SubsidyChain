"use client"

import { useLanguage } from './language-provider'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  GraduationCap,
  Wallet,
  Tractor,
  Heart,
  Home,
  Briefcase,
  LayoutGrid,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Category = 'all' | 'education' | 'finance' | 'agriculture' | 'health' | 'housing' | 'employment'

interface CategoryTabsProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
}

const categories: { key: Category; icon: React.ElementType }[] = [
  { key: 'all', icon: LayoutGrid },
  { key: 'education', icon: GraduationCap },
  { key: 'finance', icon: Wallet },
  { key: 'agriculture', icon: Tractor },
  { key: 'health', icon: Heart },
  { key: 'housing', icon: Home },
  { key: 'employment', icon: Briefcase },
]

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const { t } = useLanguage()

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={activeCategory === category.key ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category.key)}
            className={cn(
              "flex items-center gap-2 text-base font-medium shrink-0 h-12 px-5",
              activeCategory === category.key && "shadow-md"
            )}
          >
            <category.icon className="h-5 w-5" />
            <span>{category.key === 'all' ? t('allSchemes') : t(category.key)}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  )
}

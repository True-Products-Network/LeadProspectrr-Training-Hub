import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Users, 
  Mail, 
  MessageSquare, 
  Target, 
  Calendar,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Extended icons for unlimited weeks
const moduleIcons = [
  FileText,      // Week 1: Blog Posts
  Users,         // Week 2: Contacts
  Mail,          // Week 3: Email
  MessageSquare, // Week 4: Conversations
  Target,        // Week 5: Pipelines
  Calendar,      // Week 6: Calendars
  BarChart3,     // Week 7: Analytics
  Sparkles,      // Week 8: Automation
  FileText,      // Week 9+
]

const colorVariants: Record<string, { bg: string; border: string; badge: string; progress: string }> = {
  emerald: { 
    bg: 'bg-emerald-50 hover:bg-emerald-100', 
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    progress: 'bg-emerald-600'
  },
  blue: { 
    bg: 'bg-blue-50 hover:bg-blue-100', 
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    progress: 'bg-blue-600'
  },
  violet: { 
    bg: 'bg-violet-50 hover:bg-violet-100', 
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    progress: 'bg-violet-600'
  },
  amber: { 
    bg: 'bg-amber-50 hover:bg-amber-100', 
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    progress: 'bg-amber-600'
  },
  rose: { 
    bg: 'bg-rose-50 hover:bg-rose-100', 
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    progress: 'bg-rose-600'
  },
  cyan: { 
    bg: 'bg-cyan-50 hover:bg-cyan-100', 
    border: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-700',
    progress: 'bg-cyan-600'
  },
  indigo: { 
    bg: 'bg-indigo-50 hover:bg-indigo-100', 
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
    progress: 'bg-indigo-600'
  },
  fuchsia: { 
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100', 
    border: 'border-fuchsia-200',
    badge: 'bg-fuchsia-100 text-fuchsia-700',
    progress: 'bg-fuchsia-600'
  },
  orange: { 
    bg: 'bg-orange-50 hover:bg-orange-100', 
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    progress: 'bg-orange-600'
  },
  teal: { 
    bg: 'bg-teal-50 hover:bg-teal-100', 
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    progress: 'bg-teal-600'
  },
  pink: { 
    bg: 'bg-pink-50 hover:bg-pink-100', 
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
    progress: 'bg-pink-600'
  },
  lime: { 
    bg: 'bg-lime-50 hover:bg-lime-100', 
    border: 'border-lime-200',
    badge: 'bg-lime-100 text-lime-700',
    progress: 'bg-lime-600'
  },
}

const statusConfig = {
  not_started: { icon: Circle, label: 'Not Started', color: 'text-slate-400' },
  in_progress: { icon: PlayCircle, label: 'In Progress', color: 'text-amber-500' },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-green-500' },
}

interface ModuleCardProps {
  module: {
    id: string
    week_number: number
    title: string
    description: string
    color: string
    cycle_number?: number
    progress?: {
      status: 'not_started' | 'in_progress' | 'completed'
    }
  }
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = moduleIcons[(module.week_number - 1) % moduleIcons.length] || FileText
  const colors = colorVariants[module.color] || colorVariants.blue
  const status = statusConfig[module.progress?.status || 'not_started']
  const StatusIcon = status.icon

  return (
    <Link href={`/dashboard/training/week-${module.week_number}`}>
      <Card className={cn(
        'group cursor-pointer transition-all duration-300 border-2 overflow-hidden h-full',
        colors.bg,
        colors.border,
        'hover:shadow-xl hover:-translate-y-1'
      )}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center',
              'bg-white shadow-sm'
            )}>
              <Icon className={cn('w-7 h-7', colors.progress.replace('bg-', 'text-'))} />
            </div>
            <Badge className={cn(colors.badge, 'font-medium shrink-0')}>
              Week {module.week_number}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700">
            {module.title}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
            {module.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 mt-auto">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn('w-5 h-5', status.color)} />
              <span className="text-sm font-medium text-slate-600">{status.label}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

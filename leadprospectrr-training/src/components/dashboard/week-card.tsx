import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Users, 
  Mail, 
  MessageSquare, 
  Target, 
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const weekIcons = [FileText, Users, Mail, MessageSquare, Target, Calendar]

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
}

const statusConfig = {
  not_started: { icon: Circle, label: 'Not Started', color: 'text-slate-400' },
  in_progress: { icon: PlayCircle, label: 'In Progress', color: 'text-amber-500' },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-green-500' },
}

interface WeekCardProps {
  week: {
    id: string
    week_number: number
    title: string
    description: string
    color: string
    progress?: {
      status: 'not_started' | 'in_progress' | 'completed'
    }
  }
}

export function WeekCard({ week }: WeekCardProps) {
  const Icon = weekIcons[week.week_number - 1] || FileText
  const colors = colorVariants[week.color] || colorVariants.blue
  const status = statusConfig[week.progress?.status || 'not_started']
  const StatusIcon = status.icon

  return (
    <Link href={`/dashboard/training/week-${week.week_number}`}>
      <Card className={cn(
        'group cursor-pointer transition-all duration-300 border-2 overflow-hidden',
        colors.bg,
        colors.border,
        'hover:shadow-lg hover:-translate-y-1'
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center',
              'bg-white shadow-sm'
            )}>
              <Icon className={cn('w-7 h-7', colors.progress.replace('bg-', 'text-'))} />
            </div>
            <Badge className={cn(colors.badge, 'font-medium')}>
              Week {week.week_number}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700">
            {week.title}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {week.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
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

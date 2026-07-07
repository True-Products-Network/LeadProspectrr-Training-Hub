'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Users, 
  Mail, 
  MessageSquare, 
  Target, 
  Calendar,
  BarChart3,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Circle,
  Download,
  FileImage,
  Video,
  FileCode,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const moduleIcons = [
  FileText, Users, Mail, MessageSquare, Target, Calendar,
  BarChart3, Sparkles, FileText, Users, Mail, MessageSquare,
]

const colorVariants: Record<string, { bg: string; lightBg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-600', lightBg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-600', lightBg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  violet: { bg: 'bg-violet-600', lightBg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  amber: { bg: 'bg-amber-600', lightBg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-600', lightBg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  cyan: { bg: 'bg-cyan-600', lightBg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  indigo: { bg: 'bg-indigo-600', lightBg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  fuchsia: { bg: 'bg-fuchsia-600', lightBg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  orange: { bg: 'bg-orange-600', lightBg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  teal: { bg: 'bg-teal-600', lightBg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  pink: { bg: 'bg-pink-600', lightBg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  lime: { bg: 'bg-lime-600', lightBg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
}

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  doc: FileText,
  video: Video,
  image: FileImage,
  template: FileCode,
  cheatsheet: FileText,
  guide: BookOpen,
  worksheet: FileSpreadsheet,
  checklist: CheckSquare,
}

const fileTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  pdf: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  doc: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  video: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  image: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  template: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  cheatsheet: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  guide: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  worksheet: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  checklist: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
}

const statusConfig = {
  not_started: { icon: Circle, label: 'Not Started', color: 'text-slate-400', bgColor: 'bg-slate-100' },
  in_progress: { icon: PlayCircle, label: 'In Progress', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
}

interface Resource {
  id: string
  title: string
  description: string
  file_type: string
  file_url: string
  file_size?: number
}

interface WeekDetailProps {
  module: {
    id: string
    week_number: number
    title: string
    description: string
    color: string
  }
  resources: Resource[]
  progress?: {
    status: 'not_started' | 'in_progress' | 'completed'
  }
  userId: string
}

export function WeekDetail({ module, resources, progress, userId }: WeekDetailProps) {
  const [currentStatus, setCurrentStatus] = useState(progress?.status || 'not_started')
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const Icon = moduleIcons[(module.week_number - 1) % moduleIcons.length] || FileText
  const colors = colorVariants[module.color] || colorVariants.blue
  const status = statusConfig[currentStatus]
  const StatusIcon = status.icon

  const handleStatusChange = async (newStatus: 'not_started' | 'in_progress' | 'completed') => {
    setIsUpdating(true)
    
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        module_id: module.id,
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
      }, {
        onConflict: 'user_id,module_id'
      })

    if (!error) {
      setCurrentStatus(newStatus)
    }
    
    setIsUpdating(false)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`
  }

  const prevWeek = module.week_number > 1 ? module.week_number - 1 : null
  const nextWeek = module.week_number + 1

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/training">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <Badge className={cn(colors.bg, 'text-white')}>
              Week {module.week_number}
            </Badge>
            <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium', status.bgColor, status.color)}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{module.title}</h1>
          <p className="text-lg text-slate-600 mt-2">{module.description}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevWeek ? (
          <Link href={`/dashboard/training/week-${prevWeek}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Week {prevWeek}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        <Link href={`/dashboard/training/week-${nextWeek}`}>
          <Button variant="outline" className="gap-2">
            Week {nextWeek}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Progress Actions */}
      <Card className={cn('border-2', colors.border, colors.lightBg)}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm')}>
                <Icon className={cn('w-7 h-7', colors.text)} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Update Your Progress</h3>
                <p className="text-sm text-slate-600">Mark this module as complete when you&apos;re done</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={currentStatus === 'not_started' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('not_started')}
                disabled={isUpdating}
                size="sm"
                className={currentStatus === 'not_started' ? 'bg-slate-600' : ''}
              >
                <Circle className="w-4 h-4 mr-2" />
                Not Started
              </Button>
              <Button
                variant={currentStatus === 'in_progress' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('in_progress')}
                disabled={isUpdating}
                size="sm"
                className={currentStatus === 'in_progress' ? 'bg-amber-600' : ''}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                In Progress
              </Button>
              <Button
                variant={currentStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
                size="sm"
                className={currentStatus === 'completed' ? 'bg-green-600' : ''}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Training Resources</h2>
        {resources.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No resources yet</h3>
              <p className="text-slate-600">Resources for this module will be added soon.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {resources.map((resource) => {
              const FileIcon = fileTypeIcons[resource.file_type] || FileText
              const fileColors = fileTypeColors[resource.file_type] || fileTypeColors.pdf
              return (
                <Card key={resource.id} className="group hover:shadow-md transition-shadow border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn('p-4 rounded-2xl shrink-0 border-2', fileColors.bg, fileColors.text, fileColors.border)}>
                        <FileIcon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {resource.title}
                            </h3>
                            {resource.description && (
                              <p className="text-slate-600 mt-1">{resource.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary" className="capitalize">
                                {resource.file_type}
                              </Badge>
                              {resource.file_size && (
                                <span className="text-sm text-slate-500">
                                  {formatFileSize(resource.file_size)}
                                </span>
                              )}
                            </div>
                          </div>
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                            <Button className="shrink-0">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

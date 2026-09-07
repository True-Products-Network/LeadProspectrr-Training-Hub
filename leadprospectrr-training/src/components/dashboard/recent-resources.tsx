import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  ExternalLink, 
  FileImage, 
  Video, 
  FileCode,
  BookOpen,
  CheckSquare,
  FileSpreadsheet
} from 'lucide-react'

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

const fileTypeColors: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700',
  doc: 'bg-blue-100 text-blue-700',
  video: 'bg-purple-100 text-purple-700',
  image: 'bg-green-100 text-green-700',
  template: 'bg-amber-100 text-amber-700',
  cheatsheet: 'bg-cyan-100 text-cyan-700',
  guide: 'bg-violet-100 text-violet-700',
  worksheet: 'bg-pink-100 text-pink-700',
  checklist: 'bg-orange-100 text-orange-700',
}

interface Resource {
  id: string
  title: string
  file_type: string
  training_modules: {
    week_number: number
    title: string
  }
}

interface RecentResourcesProps {
  resources: Resource[]
}

export function RecentResources({ resources }: RecentResourcesProps) {
  if (resources.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Recent Resources</h2>
        <Link href="/dashboard/resources">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            View All
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => {
          const Icon = fileTypeIcons[resource.file_type] || FileText
          return (
            <Card key={resource.id} className="group hover:shadow-md transition-shadow border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${fileTypeColors[resource.file_type] || 'bg-slate-100'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Week {resource.training_modules.week_number}
                      </Badge>
                      <span className="text-xs text-slate-500 capitalize">
                        {resource.file_type}
                      </span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="shrink-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  FileImage,
  Video,
  FileCode,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  CheckCircle2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

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

const weekColors: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700',
  orange: 'bg-orange-100 text-orange-700',
  teal: 'bg-teal-100 text-teal-700',
  pink: 'bg-pink-100 text-pink-700',
  lime: 'bg-lime-100 text-lime-700',
}

interface Resource {
  id: string
  title: string
  description: string
  file_type: string
  file_url: string
  file_size?: number
  download_count: number
  training_modules: {
    week_number: number
    title: string
    color: string
  }
}

interface ResourcesLibraryProps {
  resources: Resource[]
  downloadedIds: string[]
  userId: string
}

export function ResourcesLibrary({ resources, downloadedIds: initialDownloadedIds, userId }: ResourcesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set(initialDownloadedIds))
  const supabase = createClient()

  const fileTypes = useMemo(() => {
    const types = new Set(resources.map(r => r.file_type))
    return Array.from(types).sort()
  }, [resources])

  const weeks = useMemo(() => {
    const weekSet = new Map<number, { number: number; title: string; color: string }>()
    resources.forEach(r => {
      if (!weekSet.has(r.training_modules.week_number)) {
        weekSet.set(r.training_modules.week_number, {
          number: r.training_modules.week_number,
          title: r.training_modules.title,
          color: r.training_modules.color,
        })
      }
    })
    return Array.from(weekSet.values()).sort((a, b) => a.number - b.number)
  }, [resources])

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = selectedType === null || resource.file_type === selectedType
      const matchesWeek = selectedWeek === null || resource.training_modules.week_number === selectedWeek

      return matchesSearch && matchesType && matchesWeek
    })
  }, [resources, searchQuery, selectedType, selectedWeek])

  const handleDownload = async (resource: Resource) => {
    // Prevent default and stop propagation
    console.log('Download started for:', resource.title)
    
    // Open file first in same window context to avoid popup blocker
    const newWindow = window.open('', '_blank')
    
    try {
      // Track download - insert and ignore duplicates
      console.log('Attempting to insert into resource_downloads...')
      const { data: insertData, error: downloadError } = await supabase
        .from('resource_downloads')
        .insert({
          user_id: userId,
          resource_id: resource.id,
        })
        .select()
      
      console.log('Insert result:', { data: insertData, error: downloadError })
      
      // Only log real errors, ignore duplicates
      if (downloadError && !downloadError.message?.includes('duplicate') && !downloadError.code?.includes('23505')) {
        console.error('Download tracking error:', downloadError)
      }

      // Update local state
      setDownloadedIds(prev => new Set([...prev, resource.id]))

      // Get current download count and increment
      const { data: currentResource } = await supabase
        .from('resources')
        .select('download_count')
        .eq('id', resource.id)
        .single()
      
      if (currentResource) {
        await supabase
          .from('resources')
          .update({ download_count: (currentResource.download_count || 0) + 1 })
          .eq('id', resource.id)
      }

      // Now set the URL on the already opened window
      if (newWindow) {
        newWindow.location.href = resource.file_url
      }
    } catch (error) {
      console.error('Download error:', error)
      // Still open the file even if tracking fails
      if (newWindow) {
        newWindow.location.href = resource.file_url
      }
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedType(null)
    setSelectedWeek(null)
  }

  const hasFilters = searchQuery || selectedType || selectedWeek

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Resource Library</h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Access all your training materials, guides, templates, and cheat sheets in one place.
        </p>
        <div className="flex gap-8 mt-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-3xl font-bold">{resources.length}</p>
            <p className="text-slate-400 text-sm">Total Resources</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{downloadedIds.size}</p>
            <p className="text-slate-400 text-sm">Downloaded</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{fileTypes.length}</p>
            <p className="text-slate-400 text-sm">File Types</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>
          
          {fileTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors',
                selectedType === type
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {type}
            </button>
          ))}
          
          <div className="w-px h-6 bg-slate-200 mx-2" />
          
          {weeks.map(week => (
            <button
              key={week.number}
              onClick={() => setSelectedWeek(selectedWeek === week.number ? null : week.number)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                selectedWeek === week.number
                  ? 'bg-slate-800 text-white'
                  : weekColors[week.color] || 'bg-slate-100 text-slate-700'
              )}
            >
              Week {week.number}
            </button>
          ))}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Showing {filteredResources.length} of {resources.length} resources
        </p>

        {filteredResources.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No resources found</h3>
              <p className="text-slate-600">Try adjusting your search or filters.</p>
              {hasFilters && (
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredResources.map((resource) => {
              const FileIcon = fileTypeIcons[resource.file_type] || FileText
              const colors = fileTypeColors[resource.file_type] || fileTypeColors.pdf
              const isDownloaded = downloadedIds.has(resource.id)

              return (
                <Card key={resource.id} className="group hover:shadow-md transition-all border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn('p-4 rounded-2xl shrink-0 border-2', colors.bg, colors.text, colors.border)}>
                        <FileIcon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {resource.title}
                              </h3>
                              {isDownloaded && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Downloaded
                                </Badge>
                              )}
                            </div>
                            {resource.description && (
                              <p className="text-slate-600">{resource.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <Badge variant="secondary" className="capitalize">
                                {resource.file_type}
                              </Badge>
                              <Badge className={weekColors[resource.training_modules.color] || 'bg-slate-100'}>
                                Week {resource.training_modules.week_number}
                              </Badge>
                              {resource.file_size && (
                                <span className="text-sm text-slate-500">
                                  {formatFileSize(resource.file_size)}
                                </span>
                              )}
                              <span className="text-sm text-slate-400">
                                {resource.download_count} downloads
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              console.log('Button clicked for:', resource.title)
                              handleDownload(resource)
                            }}
                            className={`shrink-0 px-4 py-2 rounded-md font-medium flex items-center gap-2 ${isDownloaded ? 'border-2 border-slate-300 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            type="button"
                          >
                            <Download className="w-4 h-4" />
                            {isDownloaded ? 'Download Again' : 'Download'}
                          </button>
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

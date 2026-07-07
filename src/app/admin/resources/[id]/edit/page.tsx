'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const fileTypes = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'doc', label: 'Word Document' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
  { value: 'template', label: 'Template' },
  { value: 'cheatsheet', label: 'Cheat Sheet' },
  { value: 'guide', label: 'Guide' },
  { value: 'worksheet', label: 'Worksheet' },
  { value: 'checklist', label: 'Checklist' },
]

interface TrainingModule {
  id: string
  week_number: number
  title: string
}

interface Resource {
  id: string
  title: string
  description: string
  file_type: string
  file_url: string
  file_size: number
  module_id: string
  is_published: boolean
  download_count: number
}

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [resource, setResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_type: 'pdf',
    module_id: '',
    is_published: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch resource
      const { data: resourceData } = await supabase
        .from('resources')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (resourceData) {
        setResource(resourceData)
        setFormData({
          title: resourceData.title,
          description: resourceData.description || '',
          file_type: resourceData.file_type,
          module_id: resourceData.module_id,
          is_published: resourceData.is_published,
        })
      }

      // Fetch modules
      const { data: modulesData } = await supabase
        .from('training_modules')
        .select('id, week_number, title')
        .eq('is_active', true)
        .order('week_number')
      
      if (modulesData) {
        setModules(modulesData)
      }
    }
    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('resources')
      .update({
        title: formData.title,
        description: formData.description,
        file_type: formData.file_type,
        module_id: formData.module_id,
        is_published: formData.is_published,
      })
      .eq('id', params.id)

    setIsLoading(false)

    if (error) {
      alert('Error updating resource: ' + error.message)
      return
    }

    router.push('/admin/resources')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resource? This cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    // Delete file from storage if it exists
    if (resource?.file_url) {
      const filePath = resource.file_url.split('/').pop()
      if (filePath) {
        await supabase.storage
          .from('training-resources')
          .remove([`resources/${filePath}`])
      }
    }

    // Delete resource record
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', params.id)

    setIsDeleting(false)

    if (error) {
      alert('Error deleting resource: ' + error.message)
      return
    }

    router.push('/admin/resources')
    router.refresh()
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/resources">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Resource</h1>
            <p className="text-slate-600 mt-1">Update resource details</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="gap-2"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="file_type">File Type *</Label>
                <select
                  id="file_type"
                  required
                  value={formData.file_type}
                  onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {fileTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="module_id">Training Week *</Label>
                <select
                  id="module_id"
                  required
                  value={formData.module_id}
                  onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      Week {module.week_number}: {module.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Current File:</span>{' '}
                <a 
                  href={resource.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  View File
                </a>
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'} • {resource.download_count} downloads
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="is_published" className="text-sm font-normal">
                Published (visible to users)
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/admin/resources" className="flex-1">
                <Button variant="outline" className="w-full">Cancel</Button>
              </Link>
              <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

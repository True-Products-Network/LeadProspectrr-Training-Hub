'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2, Upload } from 'lucide-react'
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

export default function NewResourcePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modules, setModules] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    async function fetchModules() {
      const supabase = createClient()
      const { data } = await supabase
        .from('training_modules')
        .select('id, week_number, title')
        .eq('is_active', true)
        .order('week_number', { ascending: true })
      
      setModules(data || [])
    }
    
    fetchModules()
  }, [])

  async function uploadFile(file: File): Promise<string | null> {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `resources/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('training-resources')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('training-resources')
      .getPublicUrl(filePath)

    return publicUrl
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!selectedFile) {
      setError('Please select a file to upload')
      setIsLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    // Upload file first
    setIsUploading(true)
    const fileUrl = await uploadFile(selectedFile)
    setIsUploading(false)

    if (!fileUrl) {
      setError('Failed to upload file. Please try again.')
      setIsLoading(false)
      return
    }

    const resourceData = {
      module_id: formData.get('module_id') as string || null,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      file_type: formData.get('file_type') as string,
      file_url: fileUrl,
      file_size: selectedFile.size,
      is_published: formData.get('is_published') === 'on',
    }

    const { error: insertError } = await supabase
      .from('resources')
      .insert(resourceData)

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin/resources')
    router.refresh()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <a
          href="/admin/resources"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Upload Resource</h1>
          <p className="text-slate-600 mt-1">Add a new training resource or file</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="file">File *</Label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-violet-300 transition-colors">
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <label
              htmlFor="file"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="w-8 h-8 text-slate-400" />
              <span className="text-sm text-slate-600">
                {selectedFile ? selectedFile.name : 'Click to select a file'}
              </span>
              <span className="text-xs text-slate-400">
                PDF, DOC, images, videos, and more
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g., Email Marketing Template"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Brief description of this resource..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="file_type">File Type *</Label>
            <select
              id="file_type"
              name="file_type"
              required
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {fileTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="module_id">Assign to Module</Label>
            <select
              id="module_id"
              name="module_id"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">None (Unassigned)</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  Week {module.week_number}: {module.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked
            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <Label htmlFor="is_published" className="text-sm font-normal cursor-pointer">
            Published (visible to users)
          </Label>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isLoading || isUploading} className="gap-2">
            {(isLoading || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? 'Uploading...' : 'Upload Resource'}
          </Button>
          <a href="/admin/resources">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </a>
        </div>
      </form>
    </div>
  )
}

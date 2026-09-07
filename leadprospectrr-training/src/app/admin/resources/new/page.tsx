'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Plus, Upload, FileIcon, X } from 'lucide-react'
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

export default function NewResourcePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_type: 'pdf',
    module_id: '',
    is_published: true,
  })

  useEffect(() => {
    const fetchModules = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('training_modules')
        .select('id, week_number, title')
        .eq('is_active', true)
        .order('week_number')
      
      if (data) {
        setModules(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, module_id: data[0].id }))
        }
      }
    }
    fetchModules()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadedUrl('')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadedUrl(result.url)
      setIsUploading(false)
      return result
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
      setIsUploading(false)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !uploadedUrl) {
      alert('Please select a file to upload')
      return
    }

    setIsLoading(true)

    try {
      // Upload file if not already uploaded
      let fileUrl = uploadedUrl
      let fileSize = file?.size || 0

      if (!uploadedUrl) {
        const uploadResult = await handleUpload()
        fileUrl = uploadResult.url
        fileSize = uploadResult.fileSize
      }

      // Create resource record
      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          file_type: formData.file_type,
          file_url: fileUrl,
          file_size: fileSize,
          module_id: formData.module_id,
          is_published: formData.is_published,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create resource')
      }

      router.push('/admin/resources')
      router.refresh()
    } catch (error: any) {
      alert('Error: ' + error.message)
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadedUrl('')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/resources">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add Resource</h1>
          <p className="text-slate-600 mt-1">Upload a new training resource</p>
        </div>
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
                placeholder="e.g., Blog Post Template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this resource..."
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

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label>File *</Label>
              {!file && !uploadedUrl ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-300 transition-colors bg-slate-50">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer block">
                    <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF, DOC, images, videos up to 50MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file?.name}</p>
                      <p className="text-xs text-slate-500">
                        {file && formatFileSize(file.size)}
                        {uploadedUrl && ' • Uploaded'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {isUploading && (
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Uploading...</p>
                    </div>
                  )}
                </div>
              )}
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
                Publish immediately
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/admin/resources" className="flex-1">
                <Button variant="outline" className="w-full">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                className="flex-1 gap-2" 
                disabled={isLoading || isUploading || (!file && !uploadedUrl)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Resource
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

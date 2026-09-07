'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
]

export default function EditModulePage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState('blue')
  const [module, setModule] = useState<any>(null)

  useEffect(() => {
    async function fetchModule() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        setError('Failed to load module')
        setIsFetching(false)
        return
      }

      setModule(data)
      setSelectedColor(data.color)
      setIsFetching(false)
    }

    fetchModule()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const moduleData = {
      week_number: parseInt(formData.get('week_number') as string),
      year: parseInt(formData.get('year') as string),
      cycle_number: parseInt(formData.get('cycle_number') as string),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      color: selectedColor,
      is_active: formData.get('is_active') === 'on',
    }

    const { error: updateError } = await supabase
      .from('training_modules')
      .update(moduleData)
      .eq('id', params.id)

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin/modules')
    router.refresh()
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (!module) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Module not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <a
          href="/admin/modules"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Module</h1>
          <p className="text-slate-600 mt-1">Update training week/module details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="week_number">Week Number *</Label>
            <Input
              id="week_number"
              name="week_number"
              type="number"
              min={1}
              required
              defaultValue={module.week_number}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              required
              defaultValue={module.year}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cycle_number">Cycle *</Label>
            <Input
              id="cycle_number"
              name="cycle_number"
              type="number"
              min={1}
              required
              defaultValue={module.cycle_number}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={module.title}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={module.description || ''}
          />
        </div>

        <div className="space-y-2">
          <Label>Color Theme</Label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 rounded-lg ${color.class} transition-all ${
                  selectedColor === color.value
                    ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                    : 'hover:scale-105'
                }`}
                title={color.label}
              />
            ))}
          </div>
          <input type="hidden" name="color" value={selectedColor} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            defaultChecked={module.is_active}
            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
            Active (visible to users)
          </Label>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </Button>
          <a href="/admin/modules">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </a>
        </div>
      </form>
    </div>
  )
}

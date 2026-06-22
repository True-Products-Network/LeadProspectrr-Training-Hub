'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewModulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState('blue')

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

    const { error: insertError } = await supabase
      .from('training_modules')
      .insert(moduleData)

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push('/admin/modules')
    router.refresh()
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
          <h1 className="text-3xl font-bold text-slate-900">Add New Module</h1>
          <p className="text-slate-600 mt-1">Create a new training week/module</p>
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
              placeholder="e.g., 7"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              defaultValue={new Date().getFullYear()}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cycle_number">Cycle *</Label>
            <Input
              id="cycle_number"
              name="cycle_number"
              type="number"
              min={1}
              defaultValue={1}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g., Advanced Automation Techniques"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe what this module covers..."
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
            defaultChecked
            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
            Active (visible to users)
          </Label>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Module
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

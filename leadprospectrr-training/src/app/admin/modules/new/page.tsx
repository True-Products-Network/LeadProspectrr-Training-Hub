'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const colorOptions = [
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
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
  const [success, setSuccess] = useState(false)
  const [selectedColor, setSelectedColor] = useState('blue')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

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

    try {
      const { error: insertError } = await supabase
        .from('training_modules')
        .insert(moduleData)

      if (insertError) {
        setError(insertError.message)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/modules')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/modules">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add Training Week</h1>
          <p className="text-slate-600 mt-1">Create a new week for the clinic</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Week Created!</h3>
              <p className="text-slate-600">Redirecting to modules list...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Describe what this week covers..."
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
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300"
                />
                <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
                  Active (visible to users)
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/admin/modules" className="flex-1">
                  <Button variant="outline" className="w-full">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Week
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

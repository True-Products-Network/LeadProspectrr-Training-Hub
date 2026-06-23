import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Edit, Eye, EyeOff, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminModulesPage() {
  const supabase = await createClient()
  
  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/admin/modules')
  }

  // Check admin role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect('/dashboard?error=not_admin')
  }

  // Fetch modules
  const { data: modules, error } = await supabase
    .from('training_modules')
    .select('*')
    .order('week_number', { ascending: true })

  if (error) {
    console.error('Error fetching modules:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Training Modules</h1>
          <p className="text-slate-600 mt-1">Manage your training weeks and content</p>
        </div>
        <Link href="/admin/modules/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Week
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading modules: {error.message}
        </div>
      )}

      <div className="grid gap-4">
        {modules?.map((module) => (
          <div 
            key={module.id} 
            className="bg-white rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ 
                backgroundColor: 
                  module.color === 'emerald' ? '#10b981' :
                  module.color === 'blue' ? '#3b82f6' :
                  module.color === 'violet' ? '#8b5cf6' :
                  module.color === 'amber' ? '#f59e0b' :
                  module.color === 'rose' ? '#f43f5e' :
                  module.color === 'cyan' ? '#06b6d4' :
                  module.color === 'indigo' ? '#6366f1' :
                  module.color === 'orange' ? '#f97316' :
                  '#6b7280'
              }}
            >
              {module.week_number}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
              <p className="text-slate-500 text-sm truncate">{module.description || 'No description'}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                <span>{module.year} / Cycle {module.cycle_number}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  module.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {module.is_active ? (
                    <><Eye className="w-3 h-3" /> Active</>
                  ) : (
                    <><EyeOff className="w-3 h-3" /> Inactive</>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/modules/${module.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        ))}
        
        {(!modules || modules.length === 0) && !error && (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules yet</h3>
            <p className="text-slate-600 mb-4">Create your first training week to get started</p>
            <Link href="/admin/modules/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Week
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

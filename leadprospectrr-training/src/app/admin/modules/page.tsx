import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Plus, Edit, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminModulesPage() {
  const user = await getUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  const { data: modules } = await supabase
    .from('training_modules')
    .select('*, resources(count)')
    .order('week_number', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Training Modules</h1>
          <p className="text-slate-600 mt-1">Manage your training weeks and content</p>
        </div>
        <a href="/admin/modules/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Module
          </Button>
        </a>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Week</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Year/Cycle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Resources</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {modules?.map((module: any) => (
                <tr key={module.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
                      {module.week_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{module.title}</p>
                      <p className="text-sm text-slate-500 truncate max-w-xs">{module.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {module.year} / Cycle {module.cycle_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {module.resources?.[0]?.count || 0} resources
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
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
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/modules/${module.id}/edit`}
                        className="p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </a>
                      <form action={`/api/admin/modules/${module.id}/delete`} method="POST" className="inline">
                        <button
                          type="submit"
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            if (!confirm('Are you sure you want to delete this module?')) {
                              e.preventDefault()
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!modules || modules.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-500">No modules found. Create your first module to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

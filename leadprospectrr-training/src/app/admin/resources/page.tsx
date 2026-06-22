import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Plus, Edit, Eye, EyeOff, Trash2, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fileTypeIcons: Record<string, string> = {
  pdf: 'PDF',
  doc: 'DOC',
  video: 'Video',
  image: 'Image',
  template: 'Template',
  cheatsheet: 'Sheet',
  guide: 'Guide',
  worksheet: 'Worksheet',
  checklist: 'List',
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
  checklist: 'bg-emerald-100 text-emerald-700',
}

export default async function AdminResourcesPage() {
  const user = await getUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  const { data: resources } = await supabase
    .from('resources')
    .select('*, training_modules(week_number, title)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
          <p className="text-slate-600 mt-1">Manage training materials and files</p>
        </div>
        <a href="/admin/resources/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Resource
          </Button>
        </a>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Resource</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Module</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Downloads</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {resources?.map((resource: any) => (
                <tr key={resource.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                        fileTypeColors[resource.file_type] || 'bg-slate-100 text-slate-700'
                      }`}>
                        {fileTypeIcons[resource.file_type] || 'File'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{resource.title}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs">{resource.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {resource.file_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {resource.training_modules ? (
                      <span>Week {resource.training_modules.week_number}: {resource.training_modules.title}</span>
                    ) : (
                      <span className="text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {resource.download_count}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      resource.is_published
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {resource.is_published ? (
                        <><Eye className="w-3 h-3" /> Published</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Draft</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                      <a
                        href={`/admin/resources/${resource.id}/edit`}
                        className="p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </a>
                      <form action={`/api/admin/resources/${resource.id}/delete`} method="POST" className="inline">
                        <button
                          type="submit"
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            if (!confirm('Are you sure you want to delete this resource?')) {
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
        {(!resources || resources.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-500">No resources found. Upload your first resource to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

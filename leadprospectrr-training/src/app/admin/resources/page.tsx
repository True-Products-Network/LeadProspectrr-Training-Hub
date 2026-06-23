import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Edit, Eye, EyeOff, FileText, Download, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  const supabase = await createClient()
  
  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/admin/resources')
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

  // Fetch resources
  const { data: resources, error } = await supabase
    .from('resources')
    .select('*, training_modules(week_number, title)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
          <p className="text-slate-600 mt-1">Manage training materials and files</p>
        </div>
        <Link href="/admin/resources/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Resource
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading resources: {error.message}
        </div>
      )}

      <div className="grid gap-4">
        {resources?.map((resource) => (
          <div 
            key={resource.id} 
            className="bg-white rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              fileTypeColors[resource.file_type] || 'bg-slate-100 text-slate-700'
            }`}>
              <FileIcon className="w-7 h-7" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900">{resource.title}</h3>
              <p className="text-slate-500 text-sm truncate">{resource.description || 'No description'}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                <span className="capitalize px-2 py-0.5 bg-slate-100 rounded-full text-xs">{resource.file_type}</span>
                {resource.training_modules ? (
                  <span>Week {resource.training_modules.week_number}: {resource.training_modules.title}</span>
                ) : (
                  <span className="text-slate-400">Unassigned</span>
                )}
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {resource.download_count} downloads
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
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
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5" />
              </a>
              <Link href={`/admin/resources/${resource.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        ))}
        
        {(!resources || resources.length === 0) && !error && (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No resources yet</h3>
            <p className="text-slate-600 mb-4">Upload your first training resource</p>
            <Link href="/admin/resources/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Upload Resource
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

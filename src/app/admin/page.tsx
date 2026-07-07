import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp,
  Activity
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const user = await getUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: totalUsers },
    { count: totalModules },
    { count: totalResources },
    { data: recentUsers },
    { data: moduleStats }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('training_modules').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('users')
      .select('id, email, name, created_at, role')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('training_modules')
      .select('id, title, week_number, (select count(*) from user_progress where module_id = training_modules.id) as progress_count')
      .order('week_number', { ascending: true })
  ])

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers || 0,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Training Modules',
      value: totalModules || 0,
      icon: BookOpen,
      color: 'emerald',
    },
    {
      title: 'Resources',
      value: totalResources || 0,
      icon: FileText,
      color: 'violet',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">Manage your training platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            violet: 'bg-violet-50 text-violet-600',
          }[stat.color]

          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
              <a 
                href="/admin/users" 
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                View All
              </a>
            </div>
          </div>
          <div className="divide-y">
            {recentUsers?.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{user.name || user.email}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Module Progress */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Module Engagement</h2>
              <a 
                href="/admin/modules" 
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Manage
              </a>
            </div>
          </div>
          <div className="divide-y">
            {moduleStats?.slice(0, 5).map((module: any) => (
              <div key={module.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Week {module.week_number}: {module.title}</p>
                  <p className="text-sm text-slate-500">Module ID: {module.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {module.progress_count || 0} users
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/modules/new"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-violet-300 hover:bg-violet-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-900">Add Module</span>
          </a>
          <a
            href="/admin/resources/new"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-violet-300 hover:bg-violet-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-900">Upload Resource</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-violet-300 hover:bg-violet-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-900">Manage Users</span>
          </a>
        </div>
      </div>
    </div>
  )
}

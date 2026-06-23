import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Download, 
  Users, 
  BookOpen,
  BarChart3
} from 'lucide-react'

export default async function AdminAnalytics() {
  const supabase = createAdminClient()

  // Get user stats
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: newUsersThisMonth } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(new Date().setDate(1)).toISOString())

  // Get resource stats
  const { count: totalResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })

  const { count: publishedResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  // Get download stats
  const { count: totalDownloads } = await supabase
    .from('resource_downloads')
    .select('*', { count: 'exact', head: true })

  // Get top downloaded resources
  const { data: topResources } = await supabase
    .from('resources')
    .select('title, download_count, file_type')
    .order('download_count', { ascending: false })
    .limit(5)

  // Get module completion stats
  const { data: moduleStats } = await supabase
    .from('training_modules')
    .select('id, week_number, title')
    .eq('is_active', true)
    .order('week_number')

  const moduleCompletionData = await Promise.all(
    (moduleStats || []).map(async (module) => {
      const { count: completed } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', module.id)
        .eq('status', 'completed')
      
      const { count: inProgress } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', module.id)
        .eq('status', 'in_progress')

      return {
        ...module,
        completed: completed || 0,
        inProgress: inProgress || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">Platform usage and engagement metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-green-600 mt-1">
              +{newUsersThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              {publishedResources || 0} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Downloads</CardTitle>
            <Download className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              Total downloads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers && totalDownloads 
                ? Math.round((totalDownloads / totalUsers) * 10) / 10 
                : 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Downloads per user
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Top Downloaded Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topResources?.map((resource, index) => (
                <div key={resource.title} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{resource.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{resource.file_type}</p>
                  </div>
                  <div className="text-sm font-semibold">{resource.download_count}</div>
                </div>
              ))}
              {(!topResources || topResources.length === 0) && (
                <p className="text-sm text-slate-500 text-center py-4">No downloads yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Module Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Module Completion Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleCompletionData.map((module) => {
                const total = module.completed + module.inProgress
                const completionRate = totalUsers ? Math.round((module.completed / totalUsers) * 100) : 0
                
                return (
                  <div key={module.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Week {module.week_number}</span>
                      <span className="text-sm text-slate-500">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      <span>{module.completed} completed</span>
                      <span>{module.inProgress} in progress</span>
                    </div>
                  </div>
                )
              })}
              {moduleCompletionData.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No module data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

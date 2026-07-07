import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Mail, 
  Calendar,
  CheckCircle2,
  Clock,
  Circle
} from 'lucide-react'

export default async function AdminUsers() {
  const supabase = await createClient()

  // Fetch all users with their progress
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch progress for all users
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('*, training_modules(week_number, title)')

  // Fetch total modules count
  const { count: totalModules } = await supabase
    .from('training_modules')
    .select('*', { count: 'exact', head: true })

  const getUserProgress = (userId: string) => {
    const userProgress = allProgress?.filter(p => p.user_id === userId) || []
    const completed = userProgress.filter(p => p.status === 'completed').length
    const inProgress = userProgress.filter(p => p.status === 'in_progress').length
    return { completed, inProgress, total: userProgress.length }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-600 mt-1">Manage clinic participants</p>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => {
          const progress = getUserProgress(user.id)
          const progressPercent = totalModules ? Math.round((progress.completed / totalModules) * 100) : 0

          return (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.name || 'Unnamed User'}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm text-slate-500">{progressPercent}% complete</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          {progress.completed} completed
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-4 w-4" />
                          {progress.inProgress} in progress
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Circle className="h-4 w-4" />
                          {totalModules ? totalModules - progress.completed - progress.inProgress : 0} not started
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {(!users || users.length === 0) && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No users yet</h3>
              <p className="text-slate-600">Users will appear here when they sign up</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

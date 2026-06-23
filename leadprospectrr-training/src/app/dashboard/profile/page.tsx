import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Calendar } from 'lucide-react'

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch user's progress stats
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)

  const completedModules = progress?.filter(p => p.status === 'completed').length || 0
  const inProgressModules = progress?.filter(p => p.status === 'in_progress').length || 0

  // Fetch user's download count
  const { count: downloadCount } = await supabase
    .from('resource_downloads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600 mt-1">Manage your account and view your progress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={user.name || 'Not set'}
                disabled
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-slate-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={user.role || 'Client'}
                disabled
                className="bg-slate-50 capitalize"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{completedModules}</p>
                <p className="text-sm text-slate-600">Modules Completed</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-3xl font-bold text-amber-600">{inProgressModules}</p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
              <div className="text-center p-4 bg-violet-50 rounded-lg">
                <p className="text-3xl font-bold text-violet-600">{downloadCount || 0}</p>
                <p className="text-sm text-slate-600">Resources Downloaded</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{progress?.length || 0}</p>
                <p className="text-sm text-slate-600">Total Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">Profile editing coming soon. Contact an administrator to update your information.</p>
          <Button disabled>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

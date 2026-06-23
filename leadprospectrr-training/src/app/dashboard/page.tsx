import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ModuleCard } from '@/components/dashboard/module-card'
import { ProgressOverview } from '@/components/dashboard/progress-overview'
import { RecentResources } from '@/components/dashboard/recent-resources'
import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { getUserStreak, recordActivity } from '@/app/actions/gamification'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch current training modules (supports unlimited weeks)
  const { data: modules } = await supabase
    .from('training_modules')
    .select('*')
    .eq('is_active', true)
    .order('week_number', { ascending: true })

  // Fetch user progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)

  // Fetch recent resources
  const { data: recentResources } = await supabase
    .from('resources')
    .select('*, training_modules(week_number, title)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(4)

  // Fetch total resource count
  const { count: totalResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  // Get user's current streak
  const currentStreak = await getUserStreak(user.id)

  // Record login activity (for streak tracking)
  await recordActivity(user.id, 'login')

  // Calculate overall progress
  const totalModules = modules?.length || 0
  const completedModules = progress?.filter(p => p.status === 'completed').length || 0
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  // Merge progress data with modules
  const modulesWithProgress = modules?.map(module => ({
    ...module,
    progress: progress?.find(p => p.module_id === module.id) || { status: 'not_started' }
  }))

  return (
    <div className="space-y-8">
      <WelcomeHeader user={user} />
      
      <ProgressOverview 
        overallProgress={overallProgress}
        completedModules={completedModules}
        totalModules={totalModules}
        totalResources={totalResources || 0}
        currentStreak={currentStreak}
      />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Training Program</h2>
          <span className="text-sm text-slate-500">
            {totalModules} weeks of content
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {modulesWithProgress?.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      <RecentResources resources={recentResources || []} />
    </div>
  )
}

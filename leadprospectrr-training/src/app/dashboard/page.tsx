import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ProgressOverview } from '@/components/dashboard/progress-overview'
import { RecentResources } from '@/components/dashboard/recent-resources'
import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { getUserStreak, recordActivity } from '@/app/actions/gamification'
import { BookOpen, FileText, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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

  // Get user's current streak (with error handling)
  let currentStreak = 0
  try {
    currentStreak = await getUserStreak(user.id)
  } catch (e) {
    console.error('Failed to get user streak:', e)
  }

  // Record login activity (for streak tracking) - don't block on error
  try {
    await recordActivity(user.id, 'login')
  } catch (e) {
    console.error('Failed to record activity:', e)
  }

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
      <WelcomeHeader user={user} timezone={user.timezone || 'America/Chicago'} />
      
      <ProgressOverview 
        overallProgress={overallProgress}
        completedModules={completedModules}
        totalModules={totalModules}
        totalResources={totalResources || 0}
        currentStreak={currentStreak}
      />

      {/* Training Program Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-violet-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <Badge className="bg-blue-100 text-blue-700 mb-3">Training Program</Badge>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Weekly LeadProspectrr Clinics
              </h2>
              <p className="text-slate-600 mb-4 max-w-2xl">
                Simple, practical training to help you use LeadProspectrr with confidence. 
                Learn the tools, take action, and grow your business.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {totalModules} Modules
                </span>
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {totalResources || 0} Resources
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Growing Content
                </span>
              </div>
              
              <div className="mt-4 w-full max-w-md">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Your Progress</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>
            
            <Link href="/dashboard/training-program">
              <Button className="bg-gradient-to-r from-blue-500 to-violet-600 whitespace-nowrap" size="lg">
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <RecentResources resources={recentResources || []} />
    </div>
  )
}

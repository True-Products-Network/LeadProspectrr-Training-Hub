import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Target, 
  Zap, 
  LayoutTemplate,
  FileText,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default async function TrainingProgramPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch all active training modules
  const { data: modules } = await supabase
    .from('training_modules')
    .select('*')
    .eq('is_active', true)
    .order('week_number', { ascending: true })

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)

  // Fetch total resources
  const { count: totalResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  // Calculate overall stats
  const totalModules = modules?.length || 0
  const completedModules = progress?.filter(p => p.status === 'completed').length || 0
  const inProgressModules = progress?.filter(p => p.status === 'in_progress').length || 0
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  // Get first incomplete module
  const firstIncompleteModule = modules?.find(m => {
    const p = progress?.find(prog => prog.module_id === m.id)
    return !p || p.status !== 'completed'
  }) || modules?.[0]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="max-w-3xl">
          <Badge className="bg-white/20 text-white mb-4">
            Training Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Weekly LeadProspectrr Clinics
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Master the art of lead generation with our comprehensive weekly training program. 
            New content added regularly as the clinic builds up over time.
          </p>
          
          {/* Program Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalModules}</p>
              <p className="text-sm text-white/80">Modules</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalResources || 0}</p>
              <p className="text-sm text-white/80">Resources</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">Growing</p>
              <p className="text-sm text-white/80">Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Progress */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Progress</h2>
              <p className="text-slate-600 mb-4">
                {completedModules} of {totalModules} modules completed • {inProgressModules} in progress
              </p>
              <div className="w-full max-w-md">
                <Progress value={overallProgress} className="h-3" />
                <p className="text-sm text-slate-500 mt-2">{overallProgress}% complete</p>
              </div>
            </div>
            
            {firstIncompleteModule && (
              <Link href={`/dashboard/training/${firstIncompleteModule.id}`}>
                <Button className="bg-gradient-to-r from-blue-500 to-violet-600 whitespace-nowrap" size="lg">
                  {completedModules === 0 ? 'Start First Clinic' : 'Continue Training'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* What You Get */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <LayoutTemplate className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Templates</h3>
              <p className="text-sm text-slate-600">
                Ready-to-use templates you can customize for your business
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Cheat Sheets</h3>
              <p className="text-sm text-slate-600">
                Quick reference guides for fast access to key information
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Step-by-Step Guides</h3>
              <p className="text-sm text-slate-600">
                Detailed instructions to help you learn and apply
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Program Outline */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Program Outline</h2>
        <div className="space-y-4">
          {modules?.map((module, index) => {
            const moduleProgress = progress?.find(p => p.module_id === module.id)
            const isCompleted = moduleProgress?.status === 'completed'
            const isInProgress = moduleProgress?.status === 'in_progress'
            
            return (
              <Link key={module.id} href={`/dashboard/training/${module.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Week Number */}
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                        ${isCompleted ? 'bg-green-100' : isInProgress ? 'bg-blue-100' : 'bg-slate-100'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        ) : (
                          <span className={`
                            text-2xl font-bold
                            ${isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : 'text-slate-400'}
                          `}>
                            {module.week_number}
                          </span>
                        )}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={isCompleted ? 'default' : isInProgress ? 'secondary' : 'outline'}>
                            Week {module.week_number}
                          </Badge>
                          {isInProgress && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              In Progress
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-1">
                          {module.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* How It Works */}
      <Card className="bg-slate-50">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">1. Follow Weekly</h3>
              <p className="text-sm text-slate-600">Each week covers a new topic</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">2. Learn at Your Pace</h3>
              <p className="text-sm text-slate-600">Complete lessons when ready</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">3. Earn Points</h3>
              <p className="text-sm text-slate-600">Track progress and achievements</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">4. Grow Your Skills</h3>
              <p className="text-sm text-slate-600">Build expertise over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

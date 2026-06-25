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
  BarChart3,
  FileCode,
  ScrollText,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Extended icons for unlimited weeks
const moduleIcons = [
  FileText,      // Week 1: Blog Posts
  Target,        // Week 2: Contacts
  FileCode,      // Week 3: Email
  ScrollText,    // Week 4: Conversations
  BarChart3,     // Week 5: Pipelines
  Clock,         // Week 6: Calendars
  Zap,           // Week 7: Analytics
  Award,         // Week 8: Automation
  GraduationCap, // Week 9+
]

const colorVariants: Record<string, { bg: string; border: string; badge: string; icon: string; gradient: string }> = {
  emerald: { 
    bg: 'bg-emerald-50 hover:bg-emerald-100', 
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  blue: { 
    bg: 'bg-blue-50 hover:bg-blue-100', 
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  violet: { 
    bg: 'bg-violet-50 hover:bg-violet-100', 
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    icon: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600'
  },
  amber: { 
    bg: 'bg-amber-50 hover:bg-amber-100', 
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600'
  },
  rose: { 
    bg: 'bg-rose-50 hover:bg-rose-100', 
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    icon: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600'
  },
  cyan: { 
    bg: 'bg-cyan-50 hover:bg-cyan-100', 
    border: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-700',
    icon: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  indigo: { 
    bg: 'bg-indigo-50 hover:bg-indigo-100', 
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  fuchsia: { 
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100', 
    border: 'border-fuchsia-200',
    badge: 'bg-fuchsia-100 text-fuchsia-700',
    icon: 'text-fuchsia-600',
    gradient: 'from-fuchsia-500 to-fuchsia-600'
  },
  orange: { 
    bg: 'bg-orange-50 hover:bg-orange-100', 
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    icon: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  teal: { 
    bg: 'bg-teal-50 hover:bg-teal-100', 
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    icon: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600'
  },
  pink: { 
    bg: 'bg-pink-50 hover:bg-pink-100', 
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
    icon: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600'
  },
  lime: { 
    bg: 'bg-lime-50 hover:bg-lime-100', 
    border: 'border-lime-200',
    badge: 'bg-lime-100 text-lime-700',
    icon: 'text-lime-600',
    gradient: 'from-lime-500 to-lime-600'
  },
}

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

  // Get first module (for Start First Clinic button)
  const firstModule = modules?.[0]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="max-w-3xl">
          <Badge className="bg-white/20 text-white mb-4">
            Weekly LeadProspectrr Clinics
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to LeadProspectrr Clinics
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Simple, practical training to help you use LeadProspectrr with confidence. 
            Learn the tools, take action, and grow your business.
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

      {/* The 4 Steps - What You Get */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">1. Understand the Basics</h3>
                <p className="text-sm text-slate-600">
                  Learn what the tools do and when to use them
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">2. Take Action Faster</h3>
                <p className="text-sm text-slate-600">
                  Work smarter with simple steps you can use right away
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">3. Use Ready-Made Tools</h3>
                <p className="text-sm text-slate-600">
                  Templates, cheat sheets, and guides to save time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">4. Grow with Confidence</h3>
                <p className="text-sm text-slate-600">
                  Build better systems, follow-up, and results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What You Will Find in Each Clinic */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            What You Will Find in Each Clinic
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Templates</h4>
                <p className="text-sm text-slate-600">
                  Ready-to-use templates you can customize for your business
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Cheat Sheets</h4>
                <p className="text-sm text-slate-600">
                  Quick reference guides for fast access to key information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Guides</h4>
                <p className="text-sm text-slate-600">
                  Step-by-step instructions to help you learn and apply
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Each clinic helps you learn, apply, and move forward
              </h3>
              <p className="text-slate-600">
                One step at a time. Track your progress, earn points, and build your skills.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            
            {firstModule && (
              <Link href={`/dashboard/training/${firstModule.id}`}>
                <Button className="bg-gradient-to-r from-blue-500 to-violet-600 whitespace-nowrap" size="lg">
                  {completedModules === 0 ? 'Start First Clinic' : 'Continue Training'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Program Outline - Color Cards */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Program Outline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules?.map((module, index) => {
            const Icon = moduleIcons[(module.week_number - 1) % moduleIcons.length] || BookOpen
            const colors = colorVariants[module.color] || colorVariants.blue
            const moduleProgress = progress?.find(p => p.module_id === module.id)
            const isCompleted = moduleProgress?.status === 'completed'
            const isInProgress = moduleProgress?.status === 'in_progress'

            return (
              <Link key={module.id} href={`/dashboard/training/${module.id}`}>
                <Card className={cn(
                  'group cursor-pointer transition-all duration-300 border-2 overflow-hidden h-full',
                  colors.bg,
                  colors.border,
                  'hover:shadow-xl hover:-translate-y-1'
                )}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center',
                        'bg-white shadow-sm'
                      )}>
                        <Icon className={cn('w-7 h-7', colors.icon)} />
                      </div>
                      <Badge className={cn(colors.badge, 'font-medium shrink-0')}>
                        Week {module.week_number}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                      {module.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 mt-auto">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-slate-600">Completed</span>
                          </>
                        ) : isInProgress ? (
                          <>
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium text-slate-600">In Progress</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                            <span className="text-sm font-medium text-slate-600">Not Started</span>
                          </>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}

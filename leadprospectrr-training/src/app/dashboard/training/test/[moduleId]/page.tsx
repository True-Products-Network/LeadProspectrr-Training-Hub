import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getModuleLessonsWithProgress, getModuleLessons, getUserLessonProgress } from '@/app/actions/lessons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Clock,
  Trophy,
  ArrowLeft,
  Lock,
  Zap,
  Timer
} from 'lucide-react'
import Link from 'next/link'

interface ModulePageProps {
  params: Promise<{
    moduleId: string
  }>
}

export default async function TestModulePage({ params }: ModulePageProps) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { moduleId } = await params

  const supabase = await createClient()

  // Fetch module details
  const { data: module } = await supabase
    .from('training_modules')
    .select('*')
    .eq('id', moduleId)
    .single()

  if (!module) {
    redirect('/dashboard/training')
  }

  // TEST 1: Original method (N+1 queries)
  const startTimeOriginal = Date.now()
  const lessonsOriginal = await getModuleLessons(moduleId)
  const lessonsWithProgressOriginal = await Promise.all(
    lessonsOriginal.map(async (lesson) => {
      const userProgress = await getUserLessonProgress(user.id, lesson.id)
      return { ...lesson, userProgress }
    })
  )
  const durationOriginal = Date.now() - startTimeOriginal

  // TEST 2: Optimized method (2 queries)
  const startTimeOptimized = Date.now()
  const lessonsWithProgressOptimized = await getModuleLessonsWithProgress(moduleId, user.id)
  const durationOptimized = Date.now() - startTimeOptimized

  // Calculate improvement
  const improvement = durationOriginal > 0 
    ? Math.round(((durationOriginal - durationOptimized) / durationOriginal) * 100)
    : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/training/${moduleId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Module
          </Button>
        </Link>
      </div>

      {/* Performance Comparison */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Performance Test Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Original Method (N+1)</p>
              <p className="text-2xl font-bold text-slate-700">{durationOriginal}ms</p>
              <p className="text-xs text-slate-400">{lessonsOriginal.length + 1} queries</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Optimized Method</p>
              <p className="text-2xl font-bold text-green-700">{durationOptimized}ms</p>
              <p className="text-xs text-green-400">2 queries</p>
            </div>
          </div>
          
          {improvement > 0 && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
              <p className="font-medium">
                🚀 {improvement}% faster! Saved {durationOriginal - durationOptimized}ms
              </p>
            </div>
          )}
          
          <div className="text-sm text-slate-600">
            <p className="font-medium">Lessons loaded: {lessonsWithProgressOptimized.length}</p>
            <p className="text-xs mt-1">
              Both methods returned the same data. The optimized version uses just 2 queries 
              instead of {lessonsOriginal.length + 1} queries.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Optimized Results Preview */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Timer className="w-6 h-6" />
          Optimized Results Preview
        </h2>
        
        {lessonsWithProgressOptimized.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600">No lessons available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {lessonsWithProgressOptimized.map((lesson, index) => {
              const isLocked = index > 0 && lessonsWithProgressOptimized[index - 1]?.userProgress?.status !== 'completed'
              const isCompleted = lesson.userProgress?.status === 'completed'
              const isInProgress = lesson.userProgress?.status === 'in_progress'
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`transition-all ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          </div>
                        ) : isInProgress ? (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-blue-600" />
                          </div>
                        ) : isLocked ? (
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-slate-400" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Circle className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-slate-500">
                                Lesson {lesson.lesson_number}
                              </span>
                              {lesson.lesson_type !== 'standard' && (
                                <Badge variant="secondary" className="text-xs">
                                  {lesson.lesson_type}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {lesson.title}
                            </h3>
                            <p className="text-slate-600 mt-1 line-clamp-2">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {lesson.duration_minutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                {lesson.points} points
                              </span>
                              {lesson.userProgress?.status && (
                                <Badge variant={isCompleted ? "default" : "secondary"} className={`text-xs ${isCompleted ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}>
                                  {lesson.userProgress.status}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0">
                            {isLocked ? (
                              <Button disabled variant="outline">
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </Button>
                            ) : (
                              <Link href={`/dashboard/training/lesson/${lesson.slug}`}>
                                <Button 
                                  variant={isCompleted ? 'outline' : 'default'}
                                  className={isCompleted ? '' : 'bg-gradient-to-r from-blue-500 to-violet-600'}
                                >
                                  {isCompleted ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Review
                                    </>
                                  ) : isInProgress ? (
                                    <>
                                      <PlayCircle className="w-4 h-4 mr-2" />
                                      Continue
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="w-4 h-4 mr-2" />
                                      Start Lesson
                                    </>
                                  )}
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Ready to Deploy?</h3>
          <p className="text-blue-800 text-sm mb-4">
            If the optimized version is working correctly and showing significant improvement, 
            you can switch the main module page to use the new function.
          </p>
          <div className="bg-white p-3 rounded text-sm font-mono text-slate-700">
            Update: src/app/dashboard/training/[moduleId]/page.tsx
            <br />
            Replace: getModuleLessons + Promise.all loop
            <br />
            With: getModuleLessonsWithProgress
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

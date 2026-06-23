import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getModuleLessons, getModuleLessonProgress } from '@/app/actions/lessons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Clock,
  Trophy,
  ArrowLeft,
  Lock
} from 'lucide-react'
import Link from 'next/link'

interface ModulePageProps {
  params: {
    moduleId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch module details
  const { data: module } = await supabase
    .from('training_modules')
    .select('*')
    .eq('id', params.moduleId)
    .single()

  if (!module) {
    redirect('/dashboard/training')
  }

  // Fetch lessons for this module
  const lessons = await getModuleLessons(params.moduleId)
  
  // Fetch user's progress
  const progress = await getModuleLessonProgress(user.id, params.moduleId)

  // Calculate overall progress percentage
  const progressPercentage = progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/training">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
        </Link>
      </div>

      {/* Module Header */}
      <div className={`bg-gradient-to-r from-${module.color}-500 to-${module.color}-600 rounded-3xl p-8 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <Badge className="bg-white/20 text-white mb-4">
              Week {module.week_number}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {module.title}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {module.description}
            </p>
          </div>
          <div className="hidden md:block text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{progress.totalPoints}</p>
              <p className="text-white/80">Points Earned</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Module Progress</span>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
          <p className="text-sm text-white/80 mt-2">
            {progress.completedLessons} of {progress.totalLessons} lessons completed
          </p>
        </div>
      </div>

      {/* Lessons List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Lessons</h2>
        
        {lessons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No lessons available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isLocked = index > 0 && lessons[index - 1]?.userProgress?.status !== 'completed'
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

      {/* Module Completion Celebration */}
      {progress.completedLessons === progress.totalLessons && progress.totalLessons > 0 && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Module Completed! 🎉</h3>
            <p className="text-white/90 mb-4">
              Congratulations! You've completed all lessons in this module.
            </p>
            <p className="text-white/80">
              You've earned {progress.totalPoints} points and are ready to move on to the next module!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

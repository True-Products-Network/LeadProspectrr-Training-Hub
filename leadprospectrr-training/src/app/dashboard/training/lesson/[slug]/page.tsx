'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getLessonBySlug, startLesson, completeLesson, getUserLessonProgress } from '@/app/actions/lessons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  ChevronRight,
  ChevronLeft,
  Play,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { cn } from '@/lib/utils'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [lesson, setLesson] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    if (!user) return
    
    const loadLesson = async () => {
      const slug = params.slug as string
      const lessonData = await getLessonBySlug(slug)
      
      if (!lessonData) {
        router.push('/dashboard/training')
        return
      }
      
      setLesson(lessonData)
      
      // Start the lesson automatically
      await startLesson(user.id, lessonData.id)
      setStartTime(new Date())
      
      // Get progress
      const progressData = await getUserLessonProgress(user.id, lessonData.id)
      setProgress(progressData)
      
      setIsLoading(false)
    }
    
    loadLesson()
  }, [params.slug, user, router])

  const handleComplete = async () => {
    if (!user || !lesson || !startTime) return
    
    const endTime = new Date()
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    
    const result = await completeLesson(user.id, lesson.id, timeSpent)
    
    if (result.success) {
      setShowComplete(true)
      setProgress({ ...progress, status: 'completed', points_earned: result.pointsEarned })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lesson) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/training/${lesson.module_id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Module
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            Lesson {lesson.lesson_number}
          </span>
          <Badge variant={progress?.status === 'completed' ? 'default' : 'secondary'}>
            {progress?.status === 'completed' ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
      </div>

      {/* Lesson Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {lesson.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {lesson.duration_minutes} min read
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {lesson.points} points
          </span>
          {lesson.lesson_type !== 'standard' && (
            <Badge variant="outline">{lesson.lesson_type}</Badge>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Progress 
        value={progress?.status === 'completed' ? 100 : 50} 
        className="h-2"
      />

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-8">
          {lesson.video_url && (
            <div className="aspect-video bg-slate-900 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg">Video Lesson</p>
                <p className="text-sm text-white/60">Click to play</p>
              </div>
            </div>
          )}
          
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </CardContent>
      </Card>

      {/* Completion Section */}
      {showComplete || progress?.status === 'completed' ? (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Lesson Complete! 🎉</h3>
            <p className="text-white/90 mb-4">
              Great job! You've earned {lesson.points} points.
            </p>
            <div className="flex justify-center gap-4">
              <Link href={`/dashboard/training/${lesson.module_id}`}>
                <Button variant="secondary">
                  Continue to Module
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Ready to complete this lesson?
            </h3>
            <p className="text-slate-600 mb-6">
              Mark this lesson as complete to earn {lesson.points} points and continue your progress.
            </p>
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-blue-500 to-violet-600"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Complete Lesson
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" disabled>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button variant="outline" disabled>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

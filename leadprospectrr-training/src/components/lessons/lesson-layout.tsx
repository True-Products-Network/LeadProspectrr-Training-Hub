'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Clock,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Star,
  Target,
  Lightbulb,
  FileText,
  Download,
  Lock,
  Unlock
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LessonLayoutProps {
  lesson: {
    id: string
    lesson_number: number
    title: string
    slug: string
    description: string | null
    content: string
    duration_minutes: number
    points: number
  }
  module: {
    id: string
    title: string
    week_number: number
    color: string
  }
  progress: {
    status: 'not_started' | 'in_progress' | 'completed'
    completed_at?: string | null
  } | null
  totalLessons: number
  nextLesson?: { slug: string; title: string }
  prevLesson?: { slug: string; title: string }
  resources?: Array<{
    id: string
    title: string
    description: string
    file_type: string
    download_count: number
  }>
  onComplete: () => void
}

export function LessonLayout({
  lesson,
  module,
  progress,
  totalLessons,
  nextLesson,
  prevLesson,
  resources,
  onComplete
}: LessonLayoutProps) {
  const [activeSection, setActiveSection] = useState<'content' | 'quiz' | 'resources'>('content')
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [completionChecklist, setCompletionChecklist] = useState<Record<string, boolean>>({})

  const isCompleted = progress?.status === 'completed'
  const progressPercent = (lesson.lesson_number / totalLessons) * 100

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Lesson Header */}
      <div className={`bg-gradient-to-r from-${module.color}-500 to-${module.color}-600 rounded-3xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-white/20 text-white">
            Week {module.week_number} • Lesson {lesson.lesson_number} of {totalLessons}
          </Badge>
          {isCompleted && (
            <Badge className="bg-green-400 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{lesson.title}</h1>
        <p className="text-lg text-white/90 mb-6">{lesson.description}</p>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{lesson.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>{lesson.points} points</span>
          </div>
          <div className="flex-1 max-w-xs">
            <Progress value={progressPercent} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSection('content')}
          className={cn(
            'px-6 py-3 font-medium transition-colors border-b-2 -mb-px',
            activeSection === 'content'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Lesson Content
        </button>
        <button
          onClick={() => setActiveSection('quiz')}
          className={cn(
            'px-6 py-3 font-medium transition-colors border-b-2 -mb-px',
            activeSection === 'quiz'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Knowledge Check
        </button>
        {resources && resources.length > 0 && (
          <button
            onClick={() => setActiveSection('resources')}
            className={cn(
              'px-6 py-3 font-medium transition-colors border-b-2 -mb-px',
              activeSection === 'resources'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Resources ({resources.length})
          </button>
        )}
      </div>

      {/* Content Section */}
      {activeSection === 'content' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </CardContent>
          </Card>

          {/* Completion Checklist */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Lesson Completion Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  'I understand why blog posts matter for my business',
                  'I can explain the benefits of blogging to others',
                  'I know how blog posts support email marketing',
                  'I understand that blog content helps build trust'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      checked={completionChecklist[index] || false}
                      onCheckedChange={(checked) => {
                        setCompletionChecklist(prev => ({
                          ...prev,
                          [index]: checked as boolean
                        }))
                      }}
                    />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mark Complete Button */}
          {!isCompleted ? (
            <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border-dashed">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to complete this lesson?
                </h3>
                <p className="text-slate-600 mb-6">
                  Mark this lesson as complete to earn {lesson.points} points and continue to the knowledge check.
                </p>
                <Button 
                  onClick={onComplete}
                  className="bg-gradient-to-r from-blue-500 to-violet-600"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Complete Lesson & Earn {lesson.points} Points
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Lesson Complete! 🎉</h3>
                <p className="text-white/90 mb-4">
                  Great job! You've earned {lesson.points} points.
                </p>
                <div className="flex justify-center gap-4">
                  {nextLesson ? (
                    <Link href={`/dashboard/training/lesson/${nextLesson.slug}`}>
                      <Button variant="secondary" size="lg">
                        Next Lesson: {nextLesson.title}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/training/${module.id}`}>
                      <Button variant="secondary" size="lg">
                        Back to Module
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quiz Section */}
      {activeSection === 'quiz' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Knowledge Check
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-600 mb-6">
                Test your understanding with these questions. You need to answer all correctly to unlock the next lesson.
              </p>
              
              <div className="space-y-6">
                {/* Quiz questions would be dynamically loaded here */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium mb-3">1. What is the main purpose of a blog post?</p>
                  <div className="space-y-2">
                    {[
                      'To sell products directly',
                      'To help readers understand, solve, or take the next step',
                      'To replace your website',
                      'To avoid talking to customers'
                    ].map((answer, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-slate-50">
                        <input
                          type="radio"
                          name="q1"
                          value={answer}
                          checked={quizAnswers[1] === answer}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, 1: answer }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{answer}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                className="mt-6 w-full"
                onClick={() => setShowQuizResults(true)}
              >
                Check Answers
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resources Section */}
      {activeSection === 'resources' && resources && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Downloadable Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {resources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{resource.title}</h4>
                        <p className="text-sm text-slate-600">{resource.description}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {resource.file_type.toUpperCase()} • {resource.download_count} downloads
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lesson Navigation */}
      <div className="flex justify-between pt-4">
        {prevLesson ? (
          <Link href={`/dashboard/training/lesson/${prevLesson.slug}`}>
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous: {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}
        
        {nextLesson ? (
          <Link href={`/dashboard/training/lesson/${nextLesson.slug}`}>
            <Button variant="outline">
              Next: {nextLesson.title}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

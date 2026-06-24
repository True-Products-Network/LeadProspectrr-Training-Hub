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
  Target,
  Lightbulb,
  FileText,
  Download,
  CheckSquare,
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

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
  nextLesson?: { slug: string; title: string; isLocked?: boolean }
  prevLesson?: { slug: string; title: string }
  resources?: Array<{
    id: string
    title: string
    description: string
    file_type: string
    download_count: number
  }>
  quizQuestions?: QuizQuestion[]
  learningGoal?: string
  learningObjectives?: string[]
  onComplete: () => Promise<void>
  initialTab?: 'content' | 'quiz' | 'resources'
}

export function LessonLayout({
  lesson,
  module,
  progress,
  totalLessons,
  nextLesson,
  prevLesson,
  resources,
  quizQuestions = [],
  learningGoal,
  learningObjectives = [],
  onComplete,
  initialTab = 'content'
}: LessonLayoutProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<'content' | 'quiz' | 'resources'>(initialTab)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [objectivesChecked, setObjectivesChecked] = useState<Record<number, boolean>>({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)

  const isCompleted = progress?.status === 'completed'
  const progressPercent = (lesson.lesson_number / totalLessons) * 100

  const handleQuizSubmit = () => {
    const results: Record<string, boolean> = {}
    quizQuestions.forEach(q => {
      results[q.id] = quizAnswers[q.id] === q.correct_answer
    })
    setQuizResults(results)
    setShowQuizResults(true)
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    setCompleteError(null)
    try {
      console.log('[LessonLayout] Starting lesson completion...')
      await onComplete()
      console.log('[LessonLayout] Lesson completed successfully, navigating to quiz...')
      // Navigate to quiz tab with full page reload to ensure fresh data
      window.location.href = `/dashboard/training/lesson/${lesson.slug}?tab=quiz`
    } catch (err) {
      console.error('[LessonLayout] Error completing lesson:', err)
      setCompleteError('Failed to complete lesson. Please try again.')
      setIsCompleting(false)
    }
  }

  const handleContinueToNextLesson = () => {
    if (nextLesson) {
      window.location.href = `/dashboard/training/lesson/${nextLesson.slug}`
    } else {
      window.location.href = `/dashboard/training/${module.id}`
    }
  }

  const allCorrect = quizQuestions.length > 0 && quizQuestions.every(q => quizResults[q.id])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Lesson Header */}
      <div className="bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-3xl p-8 text-white">
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

      {/* Learning Goal - Single Goal */}
      {learningGoal && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">Learning Goal</h3>
          </div>
          <p className="text-white/90 text-lg">{learningGoal}</p>
        </div>
      )}

      {/* Learning Objectives - Interactive Checklist */}
      {learningObjectives.length > 0 && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-slate-600 mb-4">By the end of this lesson, you will be able to:</p>
            <div className="space-y-3">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Checkbox
                    checked={objectivesChecked[index] || false}
                    onCheckedChange={(checked) => {
                      setObjectivesChecked(prev => ({
                        ...prev,
                        [index]: checked as boolean
                      }))
                    }}
                  />
                  <span className={cn(
                    "text-slate-700 transition-all",
                    objectivesChecked[index] && "line-through text-slate-400"
                  )}>{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
          {quizQuestions.length > 0 && (
            <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full">{quizQuestions.length}</span>
          )}
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
          {/* Main Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </CardContent>
          </Card>

          {/* Mark Complete Button */}
          {!isCompleted ? (
            <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border-dashed border-2">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to complete this lesson?
                </h3>
                <p className="text-slate-600 mb-6">
                  Mark this lesson as complete to earn {lesson.points} points and unlock the knowledge check.
                </p>
                {completeError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {completeError}
                  </div>
                )}
                <Button 
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-blue-500 to-violet-600"
                  size="lg"
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Complete Lesson & Earn {lesson.points} Points
                    </>
                  )}
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
                <p className="text-white/80 mb-4">
                  Now take the Knowledge Check to test your understanding.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setActiveSection('quiz')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Go to Knowledge Check
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
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
              {!isCompleted ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Complete the lesson first to unlock the quiz!</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 mb-6">
                  Test your understanding with these questions. Answer all correctly to fully complete this lesson.
                </p>
              )}
              
              {quizQuestions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No quiz questions available for this lesson.
                </div>
              ) : (
                <div className="space-y-6">
                  {quizQuestions.map((q, qIndex) => (
                    <div key={q.id} className={cn(
                      "p-4 rounded-lg border",
                      showQuizResults 
                        ? quizResults[q.id] 
                          ? "bg-green-50 border-green-200" 
                          : "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                    )}>
                      <p className="font-medium mb-3 flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">
                          {qIndex + 1}
                        </span>
                        {q.question}
                      </p>
                      <div className="space-y-2 ml-8">
                        {q.options.map((option, idx) => (
                          <label key={idx} className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            showQuizResults && option === q.correct_answer
                              ? "bg-green-100 border border-green-300"
                              : showQuizResults && quizAnswers[q.id] === option && option !== q.correct_answer
                                ? "bg-red-100 border border-red-300"
                                : "bg-white hover:bg-slate-50 border border-transparent"
                          )}>
                            <input
                              type="radio"
                              name={q.id}
                              value={option}
                              checked={quizAnswers[q.id] === option}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: option }))}
                              disabled={showQuizResults || !isCompleted}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>{option}</span>
                            {showQuizResults && option === q.correct_answer && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                      {showQuizResults && (
                        <div className={cn(
                          "mt-3 ml-8 p-3 rounded-lg text-sm",
                          quizResults[q.id] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                          {quizResults[q.id] ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Correct! {q.explanation}
                            </span>
                          ) : (
                            <span>
                              <strong>Incorrect.</strong> {q.explanation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {!showQuizResults && isCompleted && (
                    <Button 
                      className="w-full"
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                    >
                      Check Answers
                    </Button>
                  )}

                  {showQuizResults && (
                    <div className={cn(
                      "p-4 rounded-lg text-center",
                      allCorrect ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    )}>
                      {allCorrect ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-bold">Perfect! You got all questions correct!</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-bold">You got {Object.values(quizResults).filter(Boolean).length} out of {quizQuestions.length} correct.</p>
                          <p className="text-sm mt-1">Review the explanations above and continue when ready.</p>
                        </>
                      )}
                    </div>
                  )}

                  {showQuizResults && !allCorrect && (
                    <Button 
                      variant="outline"
                      className="w-full mb-3"
                      onClick={() => {
                        setShowQuizResults(false)
                        setQuizAnswers({})
                        setQuizResults({})
                      }}
                    >
                      Try Again
                    </Button>
                  )}

                  {showQuizResults && (
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-violet-600"
                      onClick={handleContinueToNextLesson}
                    >
                      {nextLesson ? (
                        <>
                          Continue to Next Lesson: {nextLesson.title}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Back to Module
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
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
              Previous
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}
        
        {nextLesson ? (
          nextLesson.isLocked ? (
            <Button variant="outline" disabled>
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </Button>
          ) : (
            <Link href={`/dashboard/training/lesson/${nextLesson.slug}`}>
              <Button variant="outline">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )
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

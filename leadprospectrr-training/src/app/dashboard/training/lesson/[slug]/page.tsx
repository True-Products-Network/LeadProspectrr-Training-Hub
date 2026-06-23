import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLessonBySlug, getUserLessonProgress, completeLesson } from '@/app/actions/lessons'
import { LessonLayout } from '@/components/lessons/lesson-layout'

interface LessonPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { slug } = await params
  
  const lesson = await getLessonBySlug(slug)
  
  if (!lesson) {
    redirect('/dashboard/training-program')
  }

  const supabase = await createClient()

  // Fetch module details
  const { data: module } = await supabase
    .from('training_modules')
    .select('*')
    .eq('id', lesson.module_id)
    .single()

  if (!module) {
    redirect('/dashboard/training-program')
  }

  // Fetch user's progress for this lesson
  const progress = await getUserLessonProgress(user.id, lesson.id)

  // Fetch total lessons in module
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, slug, title, lesson_number')
    .eq('module_id', lesson.module_id)
    .eq('is_published', true)
    .order('lesson_number', { ascending: true })

  const totalLessons = lessons?.length || 0
  
  // Find next and previous lessons
  const currentIndex = lessons?.findIndex(l => l.id === lesson.id) || -1
  const nextLesson = currentIndex >= 0 && currentIndex < (lessons?.length || 0) - 1 
    ? lessons?.[currentIndex + 1] 
    : undefined
  const prevLesson = currentIndex > 0 
    ? lessons?.[currentIndex - 1] 
    : undefined

  // Fetch resources for this lesson/module
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('module_id', lesson.module_id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Handle lesson completion
  async function handleComplete() {
    'use server'
    await completeLesson(user.id, lesson.id, lesson.duration_minutes)
  }

  return (
    <LessonLayout
      lesson={lesson}
      module={module}
      progress={progress}
      totalLessons={totalLessons}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
      resources={resources || []}
      onComplete={handleComplete}
    />
  )
}

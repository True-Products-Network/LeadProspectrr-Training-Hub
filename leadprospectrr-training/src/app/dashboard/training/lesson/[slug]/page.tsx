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

// Learning objectives for each lesson
const lessonObjectives: Record<string, string[]> = {
  'why-blog-posts-matter': [
    'Understand the value of blog content for your business',
    'Identify how blogs support marketing and trust-building',
    'Recognize the role of blog posts in your follow-up strategy'
  ],
  'planning-your-blog-post': [
    'Plan your blog post before creating it',
    'Use a simple structure for organizing content',
    'Write for your target audience'
  ],
  'blog-settings-overview': [
    'Find the blog feature in LeadProspectrr',
    'Check blog settings before creating a post',
    'Set up blog sites, categories, and authors'
  ],
  'creating-a-new-blog-post': [
    'Create a new blog post',
    'Format content using headings and paragraphs',
    'Keep content readable and organized'
  ],
  'adding-images-and-links': [
    'Add a featured image to your post',
    'Include inline images in your content',
    'Add links to guide readers to next steps'
  ],
  'seo-basics': [
    'Complete basic SEO settings',
    'Write effective meta descriptions',
    'Create clean URL slugs'
  ],
  'preview-and-publish': [
    'Preview your post before publishing',
    'Check for errors and formatting issues',
    'Publish or schedule your blog post'
  ],
  'sharing-your-blog-post': [
    'Share your published blog post',
    'Use blog content in your marketing',
    'Track the results of your posts'
  ]
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

  // Fetch quiz questions for this lesson
  const { data: quizQuestions } = await supabase
    .from('lesson_quizzes')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('sort_order', { ascending: true })

  // Handle lesson completion
  async function handleComplete() {
    'use server'
    if (!lesson) return
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
      quizQuestions={quizQuestions || []}
      learningObjectives={lessonObjectives[slug] || []}
      onComplete={handleComplete}
    />
  )
}

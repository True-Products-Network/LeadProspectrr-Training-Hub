import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLessonBySlug, getUserLessonProgress, completeLesson } from '@/app/actions/lessons'
import { LessonLayout } from '@/components/lessons/lesson-layout'
import { revalidatePath } from 'next/cache'

interface LessonPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    tab?: string
  }>
}

// Learning goals for each lesson (single goal)
const lessonGoals: Record<string, string> = {
  // Module 1: Blog Posts
  'why-blog-posts-matter': 'Understand why creating blog posts inside LeadProspectrr can help your business.',
  'planning-your-blog-post': 'Plan a simple blog post that answers one customer question.',
  'blog-settings-overview': 'Understand the blog settings before creating your first post.',
  'creating-a-new-blog-post': 'Create a new blog post and add the basic details.',
  'write-and-format-your-content': 'Add and format the main content of your blog post.',
  'adding-images-and-links': 'Add images and links to make your post more engaging.',
  'add-categories-tags-and-author': 'Set the category, tags, and author for the blog post.',
  'seo-basics': 'Complete the basic SEO settings for the blog post.',
  'preview-and-review': 'Check the post before publishing.',
  'publish-or-schedule': 'Publish the blog post now or schedule it for later.',
  'sharing-your-blog-post': 'Use your published post as part of your follow-up and marketing.',
  // Module 2: Contacts and Smart Lists
  'why-contacts-matter': 'Understand why the Contacts page is one of the most important areas in LeadProspectrr.',
  'review-contacts-page': 'Learn how to navigate and understand your Contacts page layout.',
  'open-contact-record': 'Learn how to open and view individual contact details.',
  'understand-contact-details': 'Learn what information is stored in a contact record.',
  'tags-filters-smart-lists': 'Understand the tools for organizing and finding contacts.',
  'before-building-smart-list': 'Plan your Smart List before you start building it.',
  'build-filters': 'Learn how to create filters to find specific contacts.',
  'save-smart-list': 'Save your filtered results as a reusable Smart List.',
  'use-smart-list': 'Learn how to use your saved Smart Lists.',
  'edit-reuse-smart-lists': 'Learn how to update and reuse your Smart Lists over time.'
}

// Learning objectives for each lesson
const lessonObjectives: Record<string, string[]> = {
  // Module 1: Blog Posts
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
  'write-and-format-your-content': [
    'Write engaging blog post content',
    'Format using headings and paragraphs',
    'Add a clear call to action'
  ],
  'adding-images-and-links': [
    'Add a featured image to your post',
    'Include inline images in your content',
    'Add links to guide readers to next steps'
  ],
  'add-categories-tags-and-author': [
    'Set the appropriate category',
    'Add relevant tags',
    'Assign the correct author'
  ],
  'seo-basics': [
    'Complete basic SEO settings',
    'Write effective meta descriptions',
    'Create clean URL slugs'
  ],
  'preview-and-review': [
    'Preview your post before publishing',
    'Check for errors and formatting issues',
    'Test all links and images'
  ],
  'publish-or-schedule': [
    'Publish your post immediately',
    'Schedule for future publication',
    'Copy the blog post URL'
  ],
  'sharing-your-blog-post': [
    'Share your published blog post',
    'Use blog content in your marketing',
    'Track the results of your posts'
  ],
  // Module 2: Contacts and Smart Lists
  'why-contacts-matter': [
    'Understand why the Contacts page is important',
    'Identify the types of people in your CRM',
    'Recognize how contacts support your business'
  ],
  'review-contacts-page': [
    'Navigate the Contacts page',
    'Understand the layout and features',
    'Find your way around contact lists'
  ],
  'open-contact-record': [
    'Open individual contact records',
    'Navigate contact details',
    'Find specific contact information'
  ],
  'understand-contact-details': [
    'Know what information is stored',
    'Understand contact fields',
    'Find contact history'
  ],
  'tags-filters-smart-lists': [
    'Understand tags and how to use them',
    'Know what filters are available',
    'Learn what Smart Lists can do'
  ],
  'before-building-smart-list': [
    'Plan what you want to find',
    'Choose the right criteria',
    'Think about how you will use the list'
  ],
  'build-filters': [
    'Create filters to find contacts',
    'Combine multiple filters',
    'Narrow down your search results'
  ],
  'save-smart-list': [
    'Save your filter combinations',
    'Name your Smart Lists clearly',
    'Organize your lists for easy access'
  ],
  'use-smart-list': [
    'Access saved Smart Lists',
    'View contacts in a Smart List',
    'Use lists for campaigns and follow-ups'
  ],
  'edit-reuse-smart-lists': [
    'Update existing Smart Lists',
    'Modify filters when needed',
    'Keep lists current and useful'
  ]
}

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { slug } = await params
  const { tab } = await searchParams
  
  const lesson = await getLessonBySlug(slug)
  
  console.log('[LessonPage] Fetched lesson:', { 
    slug, 
    id: lesson?.id, 
    title: lesson?.title,
    contentLength: lesson?.content?.length,
    hasContent: !!lesson?.content
  })
  
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
  console.log('[LessonPage] User progress for lesson:', lesson.id, 'progress:', progress)

  // Fetch total lessons in module
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, slug, title, lesson_number')
    .eq('module_id', lesson.module_id)
    .eq('is_published', true)
    .order('lesson_number', { ascending: true })

  console.log('[LessonPage] Lessons query:', { 
    moduleId: lesson.module_id, 
    lessonsCount: lessons?.length, 
    error: lessonsError,
    currentLessonId: lesson.id,
    lessonNumbers: lessons?.map(l => ({ id: l.id, num: l.lesson_number, slug: l.slug }))
  })

  const totalLessons = lessons?.length || 0
  
  // Find next and previous lessons
  const currentIndex = lessons?.findIndex(l => l.id === lesson.id) ?? -1
  console.log('[LessonPage] currentIndex:', currentIndex, 'totalLessons:', totalLessons)
  console.log('[LessonPage] Lesson ID comparison:', { 
    lessonId: lesson.id, 
    availableIds: lessons?.map(l => l.id),
    foundMatch: lessons?.some(l => l.id === lesson.id)
  })
  
  const nextLessonData = currentIndex >= 0 && currentIndex < (lessons?.length || 0) - 1 
    ? lessons?.[currentIndex + 1] 
    : undefined
  const prevLesson = currentIndex > 0 
    ? lessons?.[currentIndex - 1] 
    : undefined
    
  // Check if next lesson is locked (current lesson not completed)
  // First lesson is always unlocked, subsequent lessons require previous completion
  let nextLessonIsLocked = false
  if (nextLessonData && currentIndex >= 0) {
    const currentLessonProgress = await getUserLessonProgress(user.id, lesson.id)
    nextLessonIsLocked = currentLessonProgress?.status !== 'completed'
    console.log('[LessonPage] Lock check - current lesson progress:', currentLessonProgress?.status, 'isLocked:', nextLessonIsLocked)
  }
  
  const nextLesson = nextLessonData ? {
    slug: nextLessonData.slug,
    title: nextLessonData.title,
    isLocked: nextLessonIsLocked
  } : undefined
    
  console.log('[LessonPage] nextLesson:', nextLesson, 'prevLesson:', prevLesson)

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
    
    try {
      // Get user inside the server action
      const actionUser = await getUser()
      if (!actionUser) throw new Error('User not authenticated')
      
      // Get lesson details inside the server action
      const actionLesson = await getLessonBySlug(slug)
      if (!actionLesson) throw new Error('Lesson not found')
      
      console.log('[handleComplete] Starting completion for lesson:', actionLesson.id, 'user:', actionUser.id)
      const result = await completeLesson(actionUser.id, actionLesson.id, actionLesson.duration_minutes)
      console.log('[handleComplete] completeLesson result:', result)
      
      if (!result.success) {
        const errorMsg = result.error || 'Server returned unsuccessful result'
        console.error('[handleComplete] completeLesson failed:', errorMsg)
        throw new Error(`Failed to complete lesson: ${errorMsg}`)
      }
      
      // Revalidate all relevant paths
      revalidatePath('/dashboard/training')
      revalidatePath(`/dashboard/training/${actionLesson.module_id}`)
      revalidatePath(`/dashboard/training/lesson/${slug}`)
      console.log('[handleComplete] Paths revalidated')
    } catch (error) {
      console.error('[handleComplete] Error in handleComplete:', error)
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Lesson completion failed: ${error.message}`)
      }
      throw new Error('Lesson completion failed due to an unexpected error')
    }
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
      learningGoal={lessonGoals[slug]}
      learningObjectives={lessonObjectives[slug] || []}
      onComplete={handleComplete}
      initialTab={tab === 'quiz' ? 'quiz' : 'content'}
    />
  )
}

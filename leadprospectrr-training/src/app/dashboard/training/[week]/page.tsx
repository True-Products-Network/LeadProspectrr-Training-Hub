import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { WeekDetail } from '@/components/training/week-detail'

interface WeekPageProps {
  params: Promise<{
    week: string
  }>
}

export default async function WeekPage({ params }: WeekPageProps) {
  const { week } = await params
  const weekNumber = parseInt(week.replace('week-', ''))
  
  if (isNaN(weekNumber) || weekNumber < 1) {
    notFound()
  }

  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch module data for this week
  const { data: module } = await supabase
    .from('training_modules')
    .select('*')
    .eq('week_number', weekNumber)
    .eq('is_active', true)
    .single()

  if (!module) {
    notFound()
  }

  // Fetch resources for this module
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('module_id', module.id)
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Fetch user progress for this module
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('module_id', module.id)
    .single()

  return (
    <WeekDetail 
      module={module} 
      resources={resources || []} 
      progress={progress}
      userId={user.id}
    />
  )
}

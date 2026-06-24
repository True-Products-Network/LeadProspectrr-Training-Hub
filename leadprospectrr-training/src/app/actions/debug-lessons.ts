'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function debugLessons() {
  const supabase = createAdminClient()
  
  // Get Module 1
  const { data: module } = await supabase
    .from('training_modules')
    .select('id, title, week_number')
    .eq('week_number', 1)
    .single()
  
  if (!module) {
    return { error: 'Module 1 not found' }
  }
  
  // Get all lessons for module (without is_published filter)
  const { data: allLessons, error: allError } = await supabase
    .from('lessons')
    .select('lesson_number, title, slug, is_published, sort_order')
    .eq('module_id', module.id)
    .order('lesson_number', { ascending: true })
  
  // Get only published lessons
  const { data: publishedLessons, error: pubError } = await supabase
    .from('lessons')
    .select('lesson_number, title, slug, is_published, sort_order')
    .eq('module_id', module.id)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('lesson_number', { ascending: true })
  
  return {
    module: {
      id: module.id,
      title: module.title,
      week_number: module.week_number
    },
    allLessons: allLessons || [],
    publishedLessons: publishedLessons || [],
    allLessonsCount: allLessons?.length || 0,
    publishedLessonsCount: publishedLessons?.length || 0,
    errors: {
      all: allError?.message,
      published: pubError?.message
    }
  }
}

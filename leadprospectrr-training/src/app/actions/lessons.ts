'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { recordActivity } from './gamification'

export interface Lesson {
  id: string
  module_id: string
  lesson_number: number
  title: string
  slug: string
  description: string | null
  content: string
  lesson_type: string
  video_url: string | null
  duration_minutes: number
  points: number
  is_published: boolean
  sort_order: number
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  started_at: string | null
  completed_at: string | null
  time_spent_minutes: number
  points_earned: number
}

export async function getModuleLessons(moduleId: string): Promise<Lesson[]> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('lesson_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }
  
  return data || []
}

export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  if (error) {
    console.error('Error fetching lesson:', error)
    return null
  }
  
  return data
}

export async function getUserLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching lesson progress:', error)
  }
  
  return data
}

export async function startLesson(userId: string, lessonId: string): Promise<void> {
  const supabase = createAdminClient()
  
  // Check if progress exists
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
  
  if (!existing) {
    // Create new progress record
    await supabase
      .from('lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
    
    // Record activity
    await recordActivity(userId, 'lesson_start', { lesson_id: lessonId })
  } else if (existing.status === 'not_started') {
    // Update to in_progress
    await supabase
      .from('lesson_progress')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', existing.id)
  }
}

export async function completeLesson(
  userId: string, 
  lessonId: string, 
  timeSpentMinutes: number = 0
): Promise<{ success: boolean; pointsEarned: number }> {
  const supabase = createAdminClient()
  
  // Get lesson details for points
  const { data: lesson } = await supabase
    .from('lessons')
    .select('points, module_id')
    .eq('id', lessonId)
    .single()
  
  if (!lesson) {
    return { success: false, pointsEarned: 0 }
  }
  
  const pointsEarned = lesson.points || 10
  
  // Update or create progress record
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
  
  if (existing) {
    // Only update if not already completed
    if (existing.status !== 'completed') {
      await supabase
        .from('lesson_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          time_spent_minutes: timeSpentMinutes,
          points_earned: pointsEarned
        })
        .eq('id', existing.id)
      
      // Record activity
      await recordActivity(userId, 'lesson_complete', { 
        lesson_id: lessonId, 
        points: pointsEarned,
        module_id: lesson.module_id
      })
      
      // Check for mystery badges
      await supabase.rpc('check_mystery_badges', { p_user_id: userId })
      
      revalidatePath('/dashboard/training')
      return { success: true, pointsEarned }
    }
  } else {
    // Create completed record
    await supabase
      .from('lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        time_spent_minutes: timeSpentMinutes,
        points_earned: pointsEarned
      })
    
    // Record activity
    await recordActivity(userId, 'lesson_complete', { 
      lesson_id: lessonId, 
      points: pointsEarned,
      module_id: lesson.module_id
    })
    
    // Check for mystery badges
    await supabase.rpc('check_mystery_badges', { p_user_id: userId })
    
    revalidatePath('/dashboard/training')
    return { success: true, pointsEarned }
  }
  
  return { success: false, pointsEarned: 0 }
}

export async function getModuleLessonProgress(
  userId: string, 
  moduleId: string
): Promise<{ 
  totalLessons: number; 
  completedLessons: number; 
  inProgressLessons: number;
  totalPoints: number;
}> {
  const supabase = createAdminClient()
  
  // Get all published lessons for this module
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, points')
    .eq('module_id', moduleId)
    .eq('is_published', true)
  
  if (!lessons || lessons.length === 0) {
    return { totalLessons: 0, completedLessons: 0, inProgressLessons: 0, totalPoints: 0 }
  }
  
  const lessonIds = lessons.map(l => l.id)
  
  // Get user's progress for these lessons
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('status, points_earned')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)
  
  const completedLessons = progress?.filter(p => p.status === 'completed').length || 0
  const inProgressLessons = progress?.filter(p => p.status === 'in_progress').length || 0
  const totalPoints = progress?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0
  
  return {
    totalLessons: lessons.length,
    completedLessons,
    inProgressLessons,
    totalPoints
  }
}

export async function getDailyChallenge(userId: string) {
  const supabase = createAdminClient()
  
  // Get today's challenge
  const { data: challenge } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('challenge_date', new Date().toISOString().split('T')[0])
    .eq('is_active', true)
    .single()
  
  if (!challenge) return null
  
  // Get user's progress on this challenge
  const { data: userProgress } = await supabase
    .from('user_daily_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challenge.id)
    .single()
  
  return {
    ...challenge,
    userProgress: userProgress || { progress: 0, completed: false }
  }
}

export async function updateChallengeProgress(
  userId: string, 
  challengeId: string, 
  progress: number
): Promise<void> {
  const supabase = createAdminClient()
  
  const { data: challenge } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('id', challengeId)
    .single()
  
  if (!challenge) return
  
  const completed = progress >= challenge.target_value
  
  await supabase
    .from('user_daily_challenges')
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      progress,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    }, {
      onConflict: 'user_id,challenge_id'
    })
  
  if (completed) {
    // Award bonus points
    await supabase
      .from('users')
      .update({
        total_points: supabase.rpc('increment', { x: challenge.bonus_points })
      })
      .eq('id', userId)
  }
}

export async function getStudyBuddies(userId: string) {
  const supabase = createAdminClient()
  
  const { data: buddies } = await supabase
    .from('study_buddies')
    .select(`
      *,
      buddy:users!buddy_id(id, name, email, avatar_url, current_streak, total_points)
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted')
  
  return buddies || []
}

export async function getUserMysteryBadges(userId: string) {
  const supabase = createAdminClient()
  
  const { data: badges } = await supabase
    .from('user_mystery_badges')
    .select(`
      *,
      badge:mystery_badges(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  
  return badges || []
}

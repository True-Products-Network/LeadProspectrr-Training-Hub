'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getUserStreak(userId: string): Promise<number> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .rpc('calculate_user_streak', { p_user_id: userId })
  
  if (error) {
    console.error('Error calculating streak:', error)
    return 0
  }
  
  return data || 0
}

export async function recordActivity(
  userId: string, 
  activityType: 'login' | 'module_complete' | 'resource_download' | 'quiz_complete' | 'lesson_start' | 'lesson_complete',
  metadata: Record<string, any> = {}
): Promise<void> {
  const supabase = createAdminClient()
  
  await supabase
    .rpc('record_user_activity', {
      p_user_id: userId,
      p_activity_type: activityType,
      p_metadata: metadata
    })
  
  // Update user's streak
  const streak = await getUserStreak(userId)
  const { data: user } = await supabase
    .from('users')
    .select('longest_streak, total_points')
    .eq('id', userId)
    .single()
  
  if (user) {
    const newLongestStreak = Math.max(streak, user.longest_streak || 0)
    
    await supabase
      .from('users')
      .update({
        current_streak: streak,
        longest_streak: newLongestStreak
      })
      .eq('id', userId)
  }
  
  // Check for new achievements
  await checkAchievements(userId)
}

export async function checkAchievements(userId: string): Promise<void> {
  const supabase = createAdminClient()
  
  // Get user's stats
  const { data: user } = await supabase
    .from('users')
    .select('current_streak, longest_streak, total_points')
    .eq('id', userId)
    .single()
  
  if (!user) return
  
  // Get completed modules count
  const { count: completedModules } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed')
  
  // Get download count
  const { count: downloadCount } = await supabase
    .from('resource_downloads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  
  // Get all achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
  
  // Get user's existing achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)
  
  const earnedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || [])
  
  // Check each achievement
  for (const achievement of achievements || []) {
    if (earnedAchievementIds.has(achievement.id)) continue
    
    let earned = false
    
    switch (achievement.requirement_type) {
      case 'streak':
        earned = (user.current_streak || 0) >= achievement.requirement_value
        break
      case 'modules':
        earned = (completedModules || 0) >= achievement.requirement_value
        break
      case 'downloads':
        earned = (downloadCount || 0) >= achievement.requirement_value
        break
      case 'points':
        earned = (user.total_points || 0) >= achievement.requirement_value
        break
    }
    
    if (earned) {
      // Award achievement
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id
        })
      
      // Add points
      await supabase
        .from('users')
        .update({
          total_points: (user.total_points || 0) + achievement.points
        })
        .eq('id', userId)
    }
  }
}

export async function getUserAchievements(userId: string) {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
  
  return data || []
}

export async function getAllAchievements() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('requirement_value', { ascending: true })
  
  if (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
  
  return data || []
}

'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface UserSettings {
  email_notifications: boolean
  progress_reminders: boolean
  profile_visibility: boolean
  activity_status: boolean
  dark_mode: boolean
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, return defaults
      return {
        email_notifications: false,
        progress_reminders: false,
        profile_visibility: true,
        activity_status: true,
        dark_mode: false,
      }
    }
    console.error('Error fetching user settings:', error)
    return null
  }
  
  return {
    email_notifications: data.email_notifications,
    progress_reminders: data.progress_reminders,
    profile_visibility: data.profile_visibility,
    activity_status: data.activity_status,
    dark_mode: data.dark_mode,
  }
}

export async function saveUserSettings(userId: string, settings: UserSettings): Promise<boolean> {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      email_notifications: settings.email_notifications,
      progress_reminders: settings.progress_reminders,
      profile_visibility: settings.profile_visibility,
      activity_status: settings.activity_status,
      dark_mode: settings.dark_mode,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    })
  
  if (error) {
    console.error('Error saving user settings:', error)
    return false
  }
  
  revalidatePath('/dashboard/settings')
  return true
}

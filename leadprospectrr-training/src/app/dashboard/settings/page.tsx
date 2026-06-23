'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Lock, Eye, Moon } from 'lucide-react'
import { getUserSettings, saveUserSettings, type UserSettings } from '@/app/actions/settings'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: false,
    progress_reminders: false,
    profile_visibility: true,
    activity_status: true,
    dark_mode: false,
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // Load user and settings on mount
  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const savedSettings = await getUserSettings(user.id)
        if (savedSettings) {
          setSettings(savedSettings)
        }
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  const handleToggle = (key: keyof UserSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    if (!userId) return
    
    setSaving(true)
    const success = await saveUserSettings(userId, settings)
    setSaving(false)
    
    if (success) {
      alert('Settings saved successfully!')
    } else {
      alert('Failed to save settings. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Loading your preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your preferences and account settings</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive updates about new modules and resources</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={settings.email_notifications}
                onCheckedChange={() => handleToggle('email_notifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="progress-reminders">Progress Reminders</Label>
                <p className="text-sm text-slate-500">Get reminded to continue your training</p>
              </div>
              <Switch 
                id="progress-reminders" 
                checked={settings.progress_reminders}
                onCheckedChange={() => handleToggle('progress_reminders')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-slate-500">Make your profile visible to other users</p>
              </div>
              <Switch 
                id="profile-visibility" 
                checked={settings.profile_visibility}
                onCheckedChange={() => handleToggle('profile_visibility')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-status">Show Activity Status</Label>
                <p className="text-sm text-slate-500">Display when you're active on the platform</p>
              </div>
              <Switch 
                id="activity-status" 
                checked={settings.activity_status}
                onCheckedChange={() => handleToggle('activity_status')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-violet-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-slate-500">Toggle dark mode theme</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={settings.dark_mode}
                onCheckedChange={() => handleToggle('dark_mode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Password</Label>
                <p className="text-sm text-slate-500">Change your account password</p>
              </div>
              <Button variant="outline" onClick={() => alert('Password change coming soon!')}>Change Password</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" onClick={() => alert('2FA coming soon!')}>Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}

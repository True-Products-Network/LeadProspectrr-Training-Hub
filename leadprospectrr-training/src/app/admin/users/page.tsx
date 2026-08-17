'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Mail, 
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  created_at: string
}

interface UserProgress {
  user_id: string
  status: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [allProgress, setAllProgress] = useState<UserProgress[]>([])
  const [totalModules, setTotalModules] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      
      // Fetch all users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Fetch progress for all users
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('user_id, status')
      
      // Fetch total modules count
      const { count: modulesCount } = await supabase
        .from('training_modules')
        .select('*', { count: 'exact', head: true })
      
      setUsers(usersData || [])
      setAllProgress(progressData || [])
      setTotalModules(modulesCount || 0)
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrorMessage('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(userId: string) {
    try {
      setDeletingUserId(userId)
      setErrorMessage(null)
      
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }
      
      // Remove user from local state
      setUsers(users.filter(u => u.id !== userId))
      setDeleteDialogOpen(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete user')
    } finally {
      setDeletingUserId(null)
    }
  }

  const getUserProgress = (userId: string) => {
    const userProgress = allProgress?.filter(p => p.user_id === userId) || []
    const completed = userProgress.filter(p => p.status === 'completed').length
    const inProgress = userProgress.filter(p => p.status === 'in_progress').length
    return { completed, inProgress, total: userProgress.length }
  }

  const getRoleBadge = (role: string) => {
    // Change 'client' to 'member'
    const displayRole = role === 'client' ? 'member' : role
    
    if (role === 'admin') {
      return <Badge variant="default">{displayRole}</Badge>
    }
    return <Badge variant="secondary">{displayRole}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">Manage clinic participants</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-600 mt-1">Manage clinic participants</p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4">
        {users?.map((user) => {
          const progress = getUserProgress(user.id)
          const progressPercent = totalModules ? Math.round((progress.completed / totalModules) * 100) : 0

          return (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.name || 'Unnamed User'}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        
                        {/* Delete User Button */}
                        <Dialog open={deleteDialogOpen === user.id} onOpenChange={(open) => setDeleteDialogOpen(open ? user.id : null)}>
                          <DialogTrigger>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Delete User
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete <strong>{user.name || user.email}</strong>? 
                                This action cannot be undone. All their progress, badges, and data will be permanently removed.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteUser(user.id)}
                                disabled={deletingUserId === user.id}
                              >
                                {deletingUserId === user.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  'Delete User'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm text-slate-500">{progressPercent}% complete</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex gap-4 mt-3 text-sm flex-wrap">
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          {progress.completed} completed
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-4 w-4" />
                          {progress.inProgress} in progress
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Circle className="h-4 w-4" />
                          {totalModules ? totalModules - progress.completed - progress.inProgress : 0} not started
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {(!users || users.length === 0) && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No users yet</h3>
              <p className="text-slate-600">Users will appear here when they sign up</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

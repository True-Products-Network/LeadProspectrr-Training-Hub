'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Fetch additional user data from the users table
        const { data: userData } = await supabase
          .from('users')
          .select('name, avatar_url')
          .eq('id', session.user.id)
          .single()
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: userData?.name || session.user.email?.split('@')[0],
          avatar_url: userData?.avatar_url
        })
      }
      
      setIsLoading(false)
    }
    
    getUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.email?.split('@')[0]
        })
      } else {
        setUser(null)
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, isLoading }
}

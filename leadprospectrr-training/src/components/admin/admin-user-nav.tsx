'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminUserNavProps {
  user: {
    email?: string
    name?: string
    role?: string
  }
}

export function AdminUserNav({ user }: AdminUserNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative h-10 w-10 rounded-full cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'Admin'}</p>
            <p className="text-xs leading-none text-slate-500">{user.email}</p>
            <p className="text-xs text-indigo-600 font-medium">{user.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Client Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Admin Panel</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

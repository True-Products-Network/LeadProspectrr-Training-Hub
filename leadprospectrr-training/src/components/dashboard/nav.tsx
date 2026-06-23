'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, LayoutDashboard, Library } from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Training Program',
    href: '/dashboard/training-program',
    icon: BookOpen,
  },
  {
    title: 'Resources',
    href: '/dashboard/resources',
    icon: Library,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

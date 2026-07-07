'use client'

import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  Plus,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Modules',
    href: '/admin/modules',
    icon: BookOpen,
    children: [
      { title: 'All Modules', href: '/admin/modules' },
      { title: 'Add New', href: '/admin/modules/new' },
    ],
  },
  {
    title: 'Resources',
    href: '/admin/resources',
    icon: FileText,
    children: [
      { title: 'All Resources', href: '/admin/resources' },
      { title: 'Upload New', href: '/admin/resources/new' },
    ],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r hidden lg:block">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <div key={item.href} className="space-y-1">
              <a
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
                {item.children && (
                  <ChevronRight className={cn(
                    'w-4 h-4 ml-auto transition-transform',
                    isActive && 'rotate-90'
                  )} />
                )}
              </a>
              {item.children && isActive && (
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                        pathname === child.href
                          ? 'text-violet-700 font-medium'
                          : 'text-slate-500 hover:text-slate-900'
                      )}
                    >
                      {child.title === 'Add New' || child.title === 'Upload New' ? (
                        <Plus className="w-3 h-3" />
                      ) : null}
                      {child.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

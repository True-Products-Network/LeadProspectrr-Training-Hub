import { requireAdmin } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/nav'
import { getUser } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl hidden sm:block">Admin Panel</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/dashboard" 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>
      <div className="flex">
        <AdminNav />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

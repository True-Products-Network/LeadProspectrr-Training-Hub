import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminUserNav } from '@/components/admin/admin-user-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirect=/admin')
  }

  // Check if user exists in public.users table
  const { data: userData } = await supabase
    .from('users')
    .select('role, name, email')
    .eq('id', user.id)
    .single()

  // Check role - must be admin
  if (userData?.role !== 'admin') {
    redirect('/dashboard?error=not_admin')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="lg:ml-64 min-h-screen">
        {/* Top bar with user nav */}
        <div className="h-16 border-b bg-white flex items-center justify-end px-6 lg:px-8">
          <AdminUserNav user={userData || { email: user.email }} />
        </div>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

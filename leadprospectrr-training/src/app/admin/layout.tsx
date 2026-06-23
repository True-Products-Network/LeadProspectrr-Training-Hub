import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'

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
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, name')
    .eq('id', user.id)
    .single()

  // If user doesn't exist in public.users, create them
  if (userError || !userData) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        role: 'client',
      })
    
    if (insertError) {
      console.error('Error creating user:', insertError)
    }
    
    redirect('/dashboard?error=not_admin')
  }

  if (userData?.role !== 'admin') {
    redirect('/dashboard?error=not_admin')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

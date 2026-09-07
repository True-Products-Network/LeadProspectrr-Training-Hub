import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SetupAdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirect=/setup-admin')
  }

  // Check if any admin exists
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  const isFirstUser = !admins || admins.length === 0

  async function makeAdmin() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Check if user record exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      // Update to admin
      await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id)
    } else {
      // Create as admin
      await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          role: 'admin',
        })
    }

    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFirstUser ? (
            <>
              <p className="text-slate-600 text-center">
                You are the first user. Click below to become an administrator.
              </p>
              <form action={makeAdmin}>
                <Button type="submit" className="w-full">
                  Become Admin
                </Button>
              </form>
            </>
          ) : (
            <>
              <p className="text-slate-600 text-center">
                An admin already exists. Please contact them for access.
              </p>
              <a href="/dashboard" className="inline-flex items-center justify-center w-full px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
                Go to Dashboard
              </a>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

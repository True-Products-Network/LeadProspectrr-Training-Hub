import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let authUser = null
  let publicUser = null
  let error = null
  
  if (user) {
    authUser = {
      id: user.id,
      email: user.email,
    }
    
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (fetchError) {
      error = fetchError.message
    } else {
      publicUser = data
    }
  }
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Info</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-100 rounded-lg">
          <h2 className="font-semibold mb-2">Auth User (from auth.users)</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(authUser, null, 2)}</pre>
        </div>
        
        <div className="p-4 bg-slate-100 rounded-lg">
          <h2 className="font-semibold mb-2">Public User (from public.users)</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(publicUser, null, 2)}</pre>
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 rounded-lg">
            <h2 className="font-semibold mb-2 text-red-700">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="font-semibold mb-2">Admin Check</h2>
          <p>
            Is Admin: <span className={publicUser?.role === 'admin' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {publicUser?.role === 'admin' ? 'YES' : 'NO'}
            </span>
          </p>
          <p className="text-sm text-slate-600 mt-2">Role: {publicUser?.role || 'not found'}</p>
        </div>
      </div>
      
      <div className="mt-8 space-y-2">
        <a href="/admin" className="block text-blue-600 hover:underline">Try /admin</a>
        <a href="/dashboard" className="block text-blue-600 hover:underline">Go to /dashboard</a>
        <a href="/login" className="block text-blue-600 hover:underline">Go to /login</a>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default async function StatusPage() {
  const supabase = await createClient()
  const checks = []

  // Check 1: Database Connection
  let dbStatus = { status: 'unknown', message: '' }
  try {
    const { data, error } = await supabase.from('training_modules').select('count')
    if (error) throw error
    dbStatus = { status: 'ok', message: 'Connected' }
  } catch (e: any) {
    dbStatus = { status: 'error', message: e.message }
  }
  checks.push({ name: 'Database Connection', ...dbStatus })

  // Check 2: Auth
  let authStatus = { status: 'unknown', message: '' }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    authStatus = { status: 'ok', message: user ? `Logged in as ${user.email}` : 'No user logged in' }
  } catch (e: any) {
    authStatus = { status: 'error', message: e.message }
  }
  checks.push({ name: 'Authentication', ...authStatus })

  // Check 3: Storage Bucket
  let storageStatus = { status: 'unknown', message: '' }
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const hasBucket = buckets?.find(b => b.id === 'training-resources')
    storageStatus = hasBucket 
      ? { status: 'ok', message: 'Bucket exists' }
      : { status: 'error', message: 'Bucket not found' }
  } catch (e: any) {
    storageStatus = { status: 'error', message: e.message }
  }
  checks.push({ name: 'Storage Bucket', ...storageStatus })

  // Check 4: RLS Policies
  let rlsStatus = { status: 'unknown', message: '' }
  try {
    const { data: userData } = await supabase.from('users').select('role').limit(1)
    rlsStatus = { status: 'ok', message: 'RLS working' }
  } catch (e: any) {
    if (e.message.includes('infinite recursion')) {
      rlsStatus = { status: 'error', message: 'RLS recursion error' }
    } else {
      rlsStatus = { status: 'warning', message: e.message }
    }
  }
  checks.push({ name: 'RLS Policies', ...rlsStatus })

  // Check 5: Training Modules
  let modulesStatus = { status: 'unknown', message: '' }
  try {
    const { count } = await supabase.from('training_modules').select('*', { count: 'exact', head: true })
    modulesStatus = { status: 'ok', message: `${count || 0} modules found` }
  } catch (e: any) {
    modulesStatus = { status: 'error', message: e.message }
  }
  checks.push({ name: 'Training Modules', ...modulesStatus })

  // Check 6: Resources
  let resourcesStatus = { status: 'unknown', message: '' }
  try {
    const { count } = await supabase.from('resources').select('*', { count: 'exact', head: true })
    resourcesStatus = { status: 'ok', message: `${count || 0} resources found` }
  } catch (e: any) {
    resourcesStatus = { status: 'error', message: e.message }
  }
  checks.push({ name: 'Resources', ...resourcesStatus })

  const allOk = checks.every(c => c.status === 'ok')
  const hasErrors = checks.some(c => c.status === 'error')

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">System Status</h1>
        <p className="text-slate-600 mb-6">Check if all components are working correctly</p>

        {allOk && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-800">All systems operational</span>
          </div>
        )}

        {hasErrors && (
          <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <span className="font-medium text-red-800">Some systems have errors</span>
          </div>
        )}

        <div className="space-y-4">
          {checks.map((check) => (
            <Card key={check.name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {check.status === 'ok' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {check.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  {check.status === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                  <span className="font-medium">{check.name}</span>
                </div>
                <span className={`text-sm ${
                  check.status === 'ok' ? 'text-green-600' :
                  check.status === 'error' ? 'text-red-600' :
                  'text-amber-600'
                }`}>
                  {check.message}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/admin" className="text-blue-600 hover:underline">Go to Admin</a>
          <a href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</a>
          <a href="/debug" className="text-blue-600 hover:underline">Debug Info</a>
        </div>
      </div>
    </div>
  )
}

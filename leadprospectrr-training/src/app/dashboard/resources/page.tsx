import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ResourcesLibrary } from '@/components/resources/resources-library'

export default async function ResourcesPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch all resources with module info
  const { data: resources } = await supabase
    .from('resources')
    .select('*, training_modules(week_number, title, color)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Fetch user's downloaded resources
  const { data: downloads } = await supabase
    .from('resource_downloads')
    .select('resource_id')
    .eq('user_id', user.id)

  const downloadedIds = new Set(downloads?.map(d => d.resource_id) || [])

  return (
    <ResourcesLibrary 
      resources={resources || []} 
      downloadedIds={Array.from(downloadedIds)}
      userId={user.id}
    />
  )
}

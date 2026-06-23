import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ModuleCard } from '@/components/dashboard/module-card'
import { TrainingHeader } from '@/components/training/training-header'
import { ClinicIntroduction } from '@/components/dashboard/clinic-introduction'

export default async function TrainingPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch all active training modules (supports unlimited weeks)
  const { data: modules } = await supabase
    .from('training_modules')
    .select('*')
    .eq('is_active', true)
    .order('week_number', { ascending: true })

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)

  // Fetch total resource count
  const { count: totalResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  const modulesWithProgress = modules?.map(module => ({
    ...module,
    progress: progress?.find(p => p.module_id === module.id) || { status: 'not_started' }
  }))

  return (
    <div className="space-y-8">
      <TrainingHeader totalModules={modules?.length || 0} totalResources={totalResources || 0} />
      
      {/* Clinic Introduction */}
      <ClinicIntroduction />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modulesWithProgress?.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  )
}

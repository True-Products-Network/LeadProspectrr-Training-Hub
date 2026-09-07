'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function trackDownload(resourceId: string, userId: string, fileUrl: string) {
  const supabase = createAdminClient()
  
  try {
    console.log('Track download called:', { resourceId, userId })
    
    // Always increment the download count first (this is what matters for analytics)
    const { data: currentResource, error: fetchError } = await supabase
      .from('resources')
      .select('download_count')
      .eq('id', resourceId)
      .single()
    
    console.log('Current resource:', { currentResource, fetchError })
    
    if (currentResource) {
      const newCount = (currentResource.download_count || 0) + 1
      console.log('Updating count to:', newCount)
      
      const { error: updateError } = await supabase
        .from('resources')
        .update({ download_count: newCount })
        .eq('id', resourceId)
      
      console.log('Update result:', { updateError })
    }

    // Try to track the download (may fail if duplicate, but that's ok)
    // This is just for tracking unique user downloads
    await supabase
      .from('resource_downloads')
      .insert({
        user_id: userId,
        resource_id: resourceId,
      })

    // Revalidate the resources page to show updated counts
    revalidatePath('/dashboard/resources')
    revalidatePath('/admin/analytics')

    return { success: true, fileUrl }
  } catch (error) {
    console.error('Download error:', error)
    // Still return success so the file opens
    return { success: true, fileUrl }
  }
}

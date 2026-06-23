'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function trackDownload(resourceId: string, userId: string, fileUrl: string) {
  const supabase = createAdminClient()
  
  try {
    // Always increment the download count first (this is what matters for analytics)
    const { data: currentResource } = await supabase
      .from('resources')
      .select('download_count')
      .eq('id', resourceId)
      .single()
    
    if (currentResource) {
      await supabase
        .from('resources')
        .update({ download_count: (currentResource.download_count || 0) + 1 })
        .eq('id', resourceId)
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

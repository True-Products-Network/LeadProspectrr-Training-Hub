'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function trackDownload(resourceId: string, userId: string, fileUrl: string) {
  const supabase = createAdminClient()
  
  try {
    // Track the download
    const { error: downloadError } = await supabase
      .from('resource_downloads')
      .insert({
        user_id: userId,
        resource_id: resourceId,
      })
    
    // Ignore duplicate key errors
    if (downloadError && !downloadError.message?.includes('duplicate') && downloadError.code !== '23505') {
      console.error('Download tracking error:', downloadError)
    }

    // Get current download count and increment
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

    // Revalidate the resources page to show updated counts
    revalidatePath('/dashboard/resources')
    revalidatePath('/admin/analytics')

    return { success: true, fileUrl }
  } catch (error) {
    console.error('Download error:', error)
    return { success: false, fileUrl }
  }
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DownloadButtonProps {
  resourceId: string
  fileUrl: string
  fileName: string
  userId: string
}

export function DownloadButton({ resourceId, fileUrl, fileName, userId }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const supabase = createClient()

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Track the download (ignore if already exists due to unique constraint)
      const { error: downloadError } = await supabase
        .from('resource_downloads')
        .insert({
          user_id: userId,
          resource_id: resourceId,
        })
      
      // Ignore duplicate key errors (user already downloaded)
      if (downloadError && !downloadError.message.includes('duplicate')) {
        console.error('Download tracking error:', downloadError)
      }

      // Increment download count using a raw query via RPC or fetch the current count first
      // First get current count
      const { data: resource } = await supabase
        .from('resources')
        .select('download_count')
        .eq('id', resourceId)
        .single()
      
      // Then update with incremented value
      if (resource) {
        await supabase
          .from('resources')
          .update({ download_count: (resource.download_count || 0) + 1 })
          .eq('id', resourceId)
      }

      // Open file in new tab (this works for any URL)
      window.open(fileUrl, '_blank')
    } catch (error) {
      console.error('Download error:', error)
      // Still try to open the file even if tracking fails
      window.open(fileUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="gap-2"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download
    </Button>
  )
}

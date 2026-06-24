'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Trophy, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CompleteButtonProps {
  lessonId: string
  lessonPoints: number
  onComplete: () => Promise<void>
}

export function CompleteButton({ lessonId, lessonPoints, onComplete }: CompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await onComplete()
      // Refresh the page to show updated state
      router.refresh()
    } catch (err) {
      console.error('Error completing lesson:', err)
      setError('Failed to complete lesson. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      <Button 
        onClick={handleComplete}
        className="bg-gradient-to-r from-blue-500 to-violet-600"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Completing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Complete Lesson & Earn {lessonPoints} Points
          </>
        )}
      </Button>
    </div>
  )
}

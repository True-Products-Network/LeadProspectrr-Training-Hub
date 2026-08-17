import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the site URL to check configured providers
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Check which providers are enabled via environment variables
    // You can also query Supabase for this info if you store it there
    const providers = []
    
    // Google is enabled if credentials are configured
    if (process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== 'false') {
      providers.push({
        id: 'google',
        name: 'Google',
        enabled: true,
      })
    }
    
    // GitHub is enabled if credentials are configured
    if (process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED !== 'false') {
      providers.push({
        id: 'github',
        name: 'GitHub',
        enabled: true,
      })
    }
    
    return NextResponse.json({ providers })
  } catch (error) {
    console.error('Error fetching auth providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// DELETE /api/admin/users?id=user-id
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Verify admin role
    const { data: adminData } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminUser.id)
      .single()
    
    if (adminData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Get user ID to delete
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    // Prevent deleting yourself
    if (userId === adminUser.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }
    
    // Delete user from auth (this will cascade to users table via trigger)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 }}
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

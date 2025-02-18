'use client'

import Dashboard from '@/components/Dashboard'
import { createClient } from '@/lib/supabaseClient'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('No session found, redirecting to login')
    redirect('/login')
  }
  console.log(session);

  // Fetch user data
  const { data: userData } = await supabase
    .from('users')
    .select('id, name, role')
    .eq('id', session.user.id)
    .single()

  return (
    <main className="min-h-screen bg-background">
      <Dashboard initialUser={userData} />
    </main>
  )
}
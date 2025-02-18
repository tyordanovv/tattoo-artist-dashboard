'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export function useUser() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log(`User with id ${session.user.id}`)
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        setUser({ ...session.user, ...userData })
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        getSession()
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return user
}
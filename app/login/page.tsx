'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { H1, P } from '@/components/ui/typography'
import { createClient } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
  
    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
  
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
  
      if (authError) {
        setError(authError.message)
        toast.error('Login failed', {
          description: authError.message,
        })
        return
      }
  
      const {
        data: { session },
      } = await supabase.auth.getSession()
      
      console.log(session)

      if (session) {
        toast.success('Login successful!')
        router.replace('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* <NavigationBar /> */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
        <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
          <div className="text-center">
            <H1>Login to Your Account</H1>
            <P className="mt-2 text-muted-foreground">
              Welcome back, artist. Let&apos;s create some masterpieces.
            </P>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <P className="text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}
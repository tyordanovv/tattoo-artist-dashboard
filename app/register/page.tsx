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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const name = formData.get('name') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirm-password') as string

      // Validate form fields
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('All fields are required')
      }

      // Validate password
      const passwordError = validatePassword(password)
      if (passwordError) {
        throw new Error(passwordError)
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'artist'
          }
        }
      })

      if (signUpError) throw signUpError

      // Insert user data into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user?.id,
            email,
            name,
            role: 'artist'
          }
        ])

      if (insertError) throw insertError

      // Show success message
      toast.success('Account created successfully! Please check your email for verification.')
      
      // Redirect to login page
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
        <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
          <div className="text-center">
            <H1>Artist Registration</H1>
            <P className="mt-2 text-muted-foreground">
              Join our community of talented tattoo artists.
            </P>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1"
                  disabled={loading}
                  placeholder="Enter your artist name"
                />
              </div>
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
                  placeholder="artist@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="pr-10"
                    disabled={loading}
                    placeholder="••••••••"
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
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1"
                  disabled={loading}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Register as Artist'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <P className="text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}
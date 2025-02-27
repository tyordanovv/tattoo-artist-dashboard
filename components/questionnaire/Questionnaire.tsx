'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import ThemeQuestion from './questions/ThemeQuestion'
import StyleQuestion from './questions/StyleQuestion'
import SizeQuestion from './questions/SizeQuestion'
import InspirationQuestion from './questions/InspirationQuestion'
import ReferenceUpload from './questions/ReferenceUpload'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Eye, EyeOff } from 'lucide-react'
import DesignElementsInput from './questions/DesignElementsInput'

const questions = [
  'Theme',
  'Style',
  'Placement',
  'Size',
  'Inspiration',
  'Reference Upload'
]

interface QuestionnaireProps {
  surveyId: string
}

export default function Questionnaire({ surveyId }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    theme: [] as string[],
    style: [] as string[],
    placement: '',
    size: '',
    inspiration: '',
    referenceImages: [] as File[]
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (surveyId) {  
        const { data: invite, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('id', surveyId)
          .single()

        if (!invite || inviteError) {
          console.error('Invalid questionnaire id:', surveyId)
          router.push('/login')
          return
        }
  
        console.log(`Valid questionnaire id: ${surveyId}`)
      }
    }
  
    checkQuestionnaire()
  }, [surveyId, supabase, router])

  const progress = ((currentStep + 1) / questions.length) * 100

  // Helper function to convert a File to a base64-encoded string.
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      try {
        setLoading(true)
        
        // Convert the selected reference image files to base64 strings.
        let referenceImagesData: string[] = []
        if (answers.referenceImages.length > 0) {
          referenceImagesData = await Promise.all(
            answers.referenceImages.map(file => fileToBase64(file))
          )
        }
        
        // Create the payload with the survey answers and the converted images.
        const payload = {
          answers,
          referenceImages: referenceImagesData,
          inviteId: surveyId
        }

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
  
        if (!response.ok) {
          throw new Error('Generation failed');
      }
      
      const data = await response.json();
      
      const ids = data.designs.map((design: { id: string }) => design.id);
      
      const encodedIds = encodeURIComponent(ids.join(','));
      router.push(`/designs?ids=${encodedIds}`);

      } catch (error) {
        console.error('Submission error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

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

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
            role: 'client'
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
            role: 'client'
          }
        ])

      if (insertError) throw insertError
      setShowProfileForm(false)
    } catch (err: any) {
      console.error('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Generic handler for answers (already memoized).
  const handleAnswer = useCallback((question: string, answer: any) => {
    const key = question === 'referenceImages' ? 'referenceImages' : question.toLowerCase()
    setAnswers(prev => ({ ...prev, [key]: answer }))
  }, [])

  // Memoized callbacks for each question component.
  const handleThemeAnswer = useCallback(
    (answer: any) => handleAnswer('theme', answer),
    [handleAnswer]
  )
  const handleStyleAnswer = useCallback(
    (answer: any) => handleAnswer('style', answer),
    [handleAnswer]
  )
  const handleElementsAnswer = useCallback(
    (answer: any) => handleAnswer('elements', answer),
    [handleAnswer]
  )
  const handleSizeAnswer = useCallback(
    (answer: any) => handleAnswer('size', answer),
    [handleAnswer]
  )
  const handleInspirationAnswer = useCallback(
    (answer: any) => handleAnswer('inspiration', answer),
    [handleAnswer]
  )
  const handleReferenceUpload = useCallback(
    (files: File[]) => handleAnswer('referenceImages', files),
    [handleAnswer]
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card shadow-lg rounded-lg overflow-hidden">
        {showProfileForm ? (
          <form className="p-6 space-y-6" onSubmit={handleProfileSubmit} noValidate>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Create Your Profile</h2>
              <div className="space-y-2">
                <Label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </Label>
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
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium">
                  Email
                </Label>
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
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Tattoo Preferences</h1>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="space-y-4">
              {currentStep === 0 && <ThemeQuestion onAnswer={handleThemeAnswer} />}
              {currentStep === 1 && <StyleQuestion onAnswer={handleStyleAnswer} />}
              {currentStep === 2 && <DesignElementsInput onAnswer={handleElementsAnswer} />}
              {currentStep === 3 && <SizeQuestion onAnswer={handleSizeAnswer} />}
              {currentStep === 4 && <InspirationQuestion onAnswer={handleInspirationAnswer} />}
              {currentStep === 5 && <ReferenceUpload onUpload={handleReferenceUpload} />}
            </div>
            <div className="flex justify-between mt-6">
              <Button onClick={handlePrevious} disabled={currentStep === 0}>
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import ThemeQuestion from './questions/ThemeQuestion'
import StyleQuestion from './questions/StyleQuestion'
import PlacementQuestion from './questions/PlacementQuestion'
import SizeQuestion from './questions/SizeQuestion'
import InspirationQuestion from './questions/InspirationQuestion'
import ReferenceUpload from './questions/ReferenceUpload'
import { useRouter, useSearchParams } from 'next/navigation'

const questions = [
  'Theme',
  'Style',
  'Placement',
  'Size',
  'Inspiration',
  'Reference Upload'
]

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    theme: [],
    style: [],
    placement: '',
    size: '',
    inspiration: '',
    referenceImages: []
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const clientName = searchParams.get('client')
    const clientId = searchParams.get('id')
    if (clientName && clientId) {
      // TODO: Fetch any existing data for this client if needed
      console.log(`Questionnaire for client: ${clientName}, ID: ${clientId}`)
    }
  }, [searchParams])

  const progress = ((currentStep + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // TODO: Send a request to the backend with the answers and photos
      // const response = await fetch('/api/submit-questionnaire', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     clientName: searchParams.get('client'),
      //     clientId: searchParams.get('id'),
      //     answers,
      //   }),
      // })
      // const data = await response.json()

      // Navigate to the designs page
      router.push('/designs')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnswer = (question: string, answer: any) => {
    setAnswers({ ...answers, [question.toLowerCase()]: answer })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Tattoo Preferences</h1>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="space-y-4">
            {currentStep === 0 && <ThemeQuestion onAnswer={(answer) => handleAnswer('theme', answer)} />}
            {currentStep === 1 && <StyleQuestion onAnswer={(answer) => handleAnswer('style', answer)} />}
            {currentStep === 2 && <PlacementQuestion onAnswer={(answer) => handleAnswer('placement', answer)} />}
            {currentStep === 3 && <SizeQuestion onAnswer={(answer) => handleAnswer('size', answer)} />}
            {currentStep === 4 && <InspirationQuestion onAnswer={(answer) => handleAnswer('inspiration', answer)} />}
            {currentStep === 5 && <ReferenceUpload onUpload={(files: any) => handleAnswer('referenceImages', files)} />}
          </div>
          <div className="flex justify-between mt-6">
            <Button onClick={handlePrevious} disabled={currentStep === 0}>Previous</Button>
            <Button onClick={handleNext}>
              {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
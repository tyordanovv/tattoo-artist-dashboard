import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

export default function InspirationQuestion({ onAnswer }: { onAnswer: (answer: string) => void }) {
  const [inspiration, setInspiration] = useState<string>('')

  useEffect(() => {
    onAnswer(inspiration)
  }, [inspiration, onAnswer])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Do you have a story or inspiration behind your tattoo idea?</h2>
      <Textarea
        placeholder="Share your inspiration or story here (optional)"
        value={inspiration}
        onChange={(e) => setInspiration(e.target.value)}
        rows={4}
      />
    </div>
  )
}
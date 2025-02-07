import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function InspirationQuestion({ onAnswer }: { onAnswer: (answer: string) => void }) {
  const [inspiration, setInspiration] = useState<string>('')

  const handleSubmit = () => {
    onAnswer(inspiration)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Do you have a story or inspiration behind your tattoo idea?</h2>
      <Textarea
        placeholder="Share your inspiration or story here (optional)"
        value={inspiration}
        onChange={(e) => setInspiration(e.target.value)}
        rows={4}
      />
      <Button onClick={handleSubmit} className="mt-4">Confirm</Button>
    </div>
  )
}


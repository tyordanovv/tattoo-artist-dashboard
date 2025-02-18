import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const sizes = [
  'Tiny (1-3 inches, delicate)', 
  'Small (4-6 inches)', 
  'Medium (7-10 inches)', 
  'Large (11+ inches, e.g., half-sleeve)', 
  'Extra-large (full sleeve, back piece, thigh panel)'
]

export default function SizeQuestion({ onAnswer }: { onAnswer: (answer: string) => void }) {
  const [selectedSize, setSelectedSize] = useState<string>('')

  useEffect(() => {
    onAnswer(selectedSize)
  }, [selectedSize, onAnswer])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">How large do you want your tattoo to be?</h2>
      <div className="flex flex-wrap gap-4">
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => setSelectedSize(prev => 
              prev === size ? '' : size
            )}
            variant={selectedSize === size ? 'default' : 'outline'}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  )
}
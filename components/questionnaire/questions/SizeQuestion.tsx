import { useState } from 'react'
import { Button } from '@/components/ui/button'

const sizes = ['Small', 'Medium', 'Large', 'Full Sleeve']

export default function SizeQuestion({ onAnswer }: { onAnswer: (answer: string) => void }) {
  const [selectedSize, setSelectedSize] = useState<string>('')

  const handleSubmit = () => {
    if (selectedSize) {
      onAnswer(selectedSize)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">How large do you want your tattoo to be?</h2>
      <div className="flex flex-wrap gap-4">
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => setSelectedSize(size)}
            variant={selectedSize === size ? 'default' : 'outline'}
          >
            {size}
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={!selectedSize} className="mt-4">Confirm Selection</Button>
    </div>
  )
}
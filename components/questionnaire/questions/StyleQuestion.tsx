import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const styles = [
  { name: 'Black-and-Gray', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Color', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Watercolor', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Minimalistic', image: '/placeholder.svg?height=100&width=100' },
]

export default function StyleQuestion({ onAnswer }: { onAnswer: (answer: string[]) => void }) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  const handleSubmit = () => {
    onAnswer(selectedStyles)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">What tattoo style(s) do you prefer?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styles.map((style) => (
          <Button
            key={style.name}
            onClick={() => toggleStyle(style.name)}
            variant={selectedStyles.includes(style.name) ? 'default' : 'outline'}
            className="h-32 flex flex-col items-center justify-center p-2"
          >
            <Image src={style.image} alt={style.name} width={100} height={100} className="mb-2" />
            {style.name}
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} className="mt-4">Confirm Selection</Button>
    </div>
  )
}


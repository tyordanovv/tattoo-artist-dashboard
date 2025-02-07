import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const placements = [
  { name: 'Forearm', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Upper Arm', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Back', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Chest', image: '/placeholder.svg?height=100&width=100' },
]

export default function PlacementQuestion({ onAnswer }: { onAnswer: (answer: string) => void }) {
  const [selectedPlacement, setSelectedPlacement] = useState<string>('')

  const handleSubmit = () => {
    if (selectedPlacement) {
      onAnswer(selectedPlacement)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Where on your body would you like the tattoo?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {placements.map((placement) => (
          <Button
            key={placement.name}
            onClick={() => setSelectedPlacement(placement.name)}
            variant={selectedPlacement === placement.name ? 'default' : 'outline'}
            className="h-32 flex flex-col items-center justify-center p-2"
          >
            <Image src={placement.image} alt={placement.name} width={100} height={100} className="mb-2" />
            {placement.name}
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={!selectedPlacement} className="mt-4">Confirm Selection</Button>
    </div>
  )
}
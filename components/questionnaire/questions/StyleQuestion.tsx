'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const styles = [
  { name: 'Traditional', image: '/style-traditional.jpg' },
  { name: 'Realism', image: '/style-realism.jpg' },
  { name: 'Watercolor', image: '/style-watercolor.jpg' },
  { name: 'Blackwork', image: '/style-blackwork.jpg' },
  { name: 'Minimalist', image: '/style-minimalist.jpg' },
  { name: 'Neo-traditional', image: '/style-neo-traditional.jpg' },
  { name: 'Japanese', image: '/style-japanese.jpg' },
  { name: 'Trash Polka', image: '/style-trash-polka.jpg' },
  { name: 'Dotwork/stippling', image: '/style-stippling.jpg' },
]

export default function StyleQuestion({ onAnswer }: { onAnswer: (answer: string[]) => void }) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  useEffect(() => {
    onAnswer(selectedStyles)
  }, [selectedStyles, onAnswer])

  const toggleStyle = (theme: string) => {
    setSelectedStyles(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">What tattoo style(s) do you prefer?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {styles.map((style) => (
          <Button
            key={style.name}
            onClick={() => toggleStyle(style.name)}
            variant={selectedStyles.includes(style.name) ? 'default' : 'outline'}
            className="h-40 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
          >
            <div className="w-24 h-24 relative mb-2">
              <Image 
                src={style.image} 
                alt={style.name} 
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100px, 100px"
              />
            </div>
            <span className="text-sm font-medium mt-1 text-center">
              {style.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
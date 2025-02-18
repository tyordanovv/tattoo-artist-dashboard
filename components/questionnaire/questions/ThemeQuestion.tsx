import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const themes = [
  { name: 'Nature', image: '/theme-nature.jpg' },
  { name: 'Spiritual and religious', image: '/theme-spiritual.jpg' },
  { name: 'Traditional patterns and folklore', image: '/theme-traditional.jpg' },
  { name: 'Geometric and surrealism', image: '/theme-abstract.jpg' },
  { name: 'Pop culture (movie, music)', image: '/theme-pop-culture.jpg' },
  { name: 'Quotes and typography', image: '/theme-quotes.jpg' },
  { name: 'Cosmic (space, stars, galaxies)', image: '/theme-cosmic.jpg' },
]

export default function ThemeQuestion({ onAnswer }: { onAnswer: (answer: string[]) => void }) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])

  useEffect(() => {
    onAnswer(selectedThemes)
  }, [selectedThemes, onAnswer])

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">What theme(s) inspire your tattoo?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Button
            key={theme.name}
            onClick={() => toggleTheme(theme.name)}
            variant={selectedThemes.includes(theme.name) ? 'default' : 'outline'}
            className="h-40 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
          >
            <div className="w-24 h-24 relative mb-2">
              <Image 
                src={theme.image} 
                alt={theme.name} 
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100px, 100px"
              />
            </div>
            <span className="text-sm font-medium mt-1 text-center">
              {theme.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
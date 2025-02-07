import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Flower, Shapes, Sparkles, Hexagon } from 'lucide-react'

const themes = [
  { name: 'Floral', icon: Flower },
  { name: 'Abstract', icon: Shapes },
  { name: 'Mythological', icon: Sparkles },
  { name: 'Geometric', icon: Hexagon },
]

export default function ThemeQuestion({ onAnswer }: { onAnswer: (answer: string[]) => void }) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    )
  }

  const handleSubmit = () => {
    onAnswer(selectedThemes)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">What theme(s) inspire your tattoo?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <Button
            key={theme.name}
            onClick={() => toggleTheme(theme.name)}
            variant={selectedThemes.includes(theme.name) ? 'default' : 'outline'}
            className="h-24 flex flex-col items-center justify-center"
          >
            <theme.icon className="h-8 w-8 mb-2" />
            {theme.name}
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} className="mt-4">Confirm Selection</Button>
    </div>
  )
}
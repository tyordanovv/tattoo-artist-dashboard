import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface DesignElementsInputProps {
  onAnswer: (elements: string[]) => void
}

export default function DesignElementsInput({ onAnswer }: DesignElementsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [elements, setElements] = useState<string[]>([])

  // Update parent answer whenever elements change.
  useEffect(() => {
    onAnswer(elements)
  }, [elements, onAnswer])

  const handleAddElement = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !elements.includes(trimmed)) {
      setElements(prev => [...prev, trimmed])
    }
    setInputValue('')
  }

  const handleRemoveElement = (element: string) => {
    setElements(prev => prev.filter(e => e !== element))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddElement()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Add design elements you want in your tattoo (e.g. waterfall, Honda CBR, young woman):
      </h2>
      <div className="flex items-center space-x-2">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an element and press Enter or click Add"
          className="border p-2 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handleAddElement}>Add</Button>
      </div>
      {elements.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {elements.map((element, index) => (
            <li key={index} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md">
              <span>{element}</span>
              <button 
                onClick={() => handleRemoveElement(element)}
                className="text-red-500 font-bold hover:text-red-700"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

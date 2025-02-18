'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewUserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate link')
      }

      setGeneratedLink(data.inviteUrl)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Invitation Link',
        text: 'Join the platform using this link:',
        url: generatedLink,
      })
    } catch (error) {
      console.error('Sharing failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/">
        <Button variant="link" className="text-foreground">
          &larr; Back to Home
        </Button>
      </Link>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Client name</Label>
          <Input
            id="name"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Client email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Invite Link'}
        </Button>

        {generatedLink && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                value={generatedLink} 
                readOnly 
                className="flex-1"
              />
              <Button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                type="button"
                variant="secondary"
              >
                Copy
              </Button>
              <Button
                onClick={handleShare}
                type="button"
                variant="secondary"
                disabled={!navigator.share}
              >
                Share
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Send this link to your client. It will expire after 7 days.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
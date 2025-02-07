'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewUserForm() {
  const [clientName, setClientName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to server-side API to generate the link
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientName }),
      });

      const data = await response.json();
      setGeneratedLink(data.link);
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="clientName">Client email or phone</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Link'}
        </Button>
        {generatedLink && (
          <div className="mt-4">
            <Label>Generated Link:</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input value={generatedLink} readOnly />
              <Button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                type="button"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
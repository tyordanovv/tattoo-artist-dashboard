import { Metadata } from 'next'
import CollaborationInterface from '@/components/CollaborationInterface'
import { NavigationBar } from '@/components/NavigationBar'

export const metadata: Metadata = {
  title: 'Design Collaboration',
  description: 'Collaborate on tattoo designs with your artist',
}

export default function CollaborationPage({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <NavigationBar />
      <main className="min-h-screen bg-background">
        <CollaborationInterface projectId={params.projectId} />
      </main>
    </div>
  )
}


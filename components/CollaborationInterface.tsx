'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DesignCanvas from './DesignCanvas'
import CommentSystem from './CommentSystem'
import VersionControl from './VersionControl'
import SchedulingTool from './SchedulingTool'
import ApprovalButtons from './ApprovalButtons'
import { Project } from '@/lib/types'
import { getProjectById } from '@/lib/api'
import { H1, P } from '@/components/ui/typography'
import { Breadcrumb } from './Breadcrumb'

interface CollaborationInterfaceProps {
  projectId: string
}

export default function CollaborationInterface({ projectId }: CollaborationInterfaceProps) {
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProjectById(projectId)
      setProject(fetchedProject)
    }
    fetchProject()
  }, [projectId])

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-card p-4 border-b border-border">
        <Breadcrumb
          items={[
            { name: 'Dashboard', href: '/' },
            { name: 'Collaboration', href: '/collaboration' },
            { name: project.clientName, href: `/collaboration/${projectId}` },
          ]}
        />
        <H1 className="mt-4">{project.clientName}&apos;s Design</H1>
        <P className="text-muted-foreground">{project.theme}</P>
      </header>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="design" className="h-full flex flex-col">
          <TabsList className="justify-start px-4 py-2 border-b border-border bg-card">
            <TabsTrigger value="design" className="data-[state=active]:bg-background">Design</TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-background">Comments</TabsTrigger>
            <TabsTrigger value="versions" className="data-[state=active]:bg-background">Versions</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-background">Schedule</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto">
            <TabsContent value="design" className="h-full">
              <DesignCanvas projectId={projectId} />
            </TabsContent>
            <TabsContent value="comments">
              <CommentSystem projectId={projectId} />
            </TabsContent>
            <TabsContent value="versions">
              <VersionControl projectId={projectId} />
            </TabsContent>
            <TabsContent value="schedule">
              <SchedulingTool projectId={projectId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <footer className="bg-card p-4 border-t border-border">
        <ApprovalButtons projectId={projectId} />
      </footer>
    </div>
  )
}


'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DesignCanvas from './DesignCanvas'
import SchedulingTool from './SchedulingTool'
import ApprovalButtons from './ApprovalButtons'
import { Design, User } from '@/lib/types'
import { Breadcrumb } from './Breadcrumb'
import { H1 } from './ui/typography'

interface CollaborationInterfaceProps {
  project: Design,
  user: User | null,
}

export default function CollaborationInterface({ project, user }: CollaborationInterfaceProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="bg-card p-4 border-b border-border">
        <Breadcrumb
          items={[
            { name: 'Dashboard', href: '/' },
            { name: project.clientName, href: `/collaboration/${project.id}` },
          ]}
        />
        <H1 className="mt-4">{project.clientName}&apos;s Design</H1>
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="design" className="h-full flex flex-col">
          <TabsList className="flex overflow-x-auto px-4 py-2 border-b border-border bg-card">
            <TabsTrigger value="design" className="data-[state=active]:bg-background whitespace-nowrap">
              Design
            </TabsTrigger>
            {/* <TabsTrigger value="comments" className="data-[state=active]:bg-background whitespace-nowrap">Comments</TabsTrigger> */}
            {/* <TabsTrigger value="versions" className="data-[state=active]:bg-background whitespace-nowrap">Versions</TabsTrigger> */}
            <TabsTrigger value="schedule" className="data-[state=active]:bg-background whitespace-nowrap">
              Schedule
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto">
            <TabsContent value="design" className="h-full">
              <DesignCanvas projectId={project.id} url={project.imageUrl} />
            </TabsContent>
            {/* <TabsContent value="comments">
              <CommentSystem projectId={project.id} />
            </TabsContent> */}
            {/* <TabsContent value="versions">
              <VersionControl projectId={project.id} />
            </TabsContent> */}
            <TabsContent value="schedule">
              <SchedulingTool design={project} user={user}/>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <footer className="bg-card p-4 border-t border-border">
        <ApprovalButtons designId={project.id} />
      </footer>
    </div>
  )
}


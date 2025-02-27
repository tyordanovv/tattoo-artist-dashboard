'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeftRight, Eye } from 'lucide-react'
import { Version } from '@/lib/types'
import Image from 'next/image' // Import Next.js Image component

interface VersionControlProps {
  projectId: string
}

export default function VersionControl({ projectId }: VersionControlProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)

  useEffect(() => {
    const fetchVersions = async () => { // TODO
      //const fetchedVersions = await getVersions(projectId)
      // setVersions(fetchedVersions)
      // setSelectedVersion(fetchedVersions[0])
    }
    fetchVersions()
  }, [projectId])

  return (
    <div className="h-full flex p-4 space-x-4">
      <ScrollArea className="w-1/3 border rounded-md">
        {versions.map((version) => (
          <Button
            key={version.id}
            variant={selectedVersion?.id === version.id ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setSelectedVersion(version)}
          >
            <span className="truncate">Version {version.number}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {new Date(version.createdAt).toLocaleDateString()}
            </span>
          </Button>
        ))}
      </ScrollArea>
      <div className="flex-1 flex flex-col">
        {selectedVersion && (
          <>
            <div className="aspect-square relative mb-4">
              <Image
                src={selectedVersion.imageUrl}
                alt={`Version ${selectedVersion.number}`}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
              <Button variant="outline" size="sm">
                <ArrowLeftRight className="mr-2 h-4 w-4" /> Compare
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-card text-card-foreground">
        <CardHeader className="p-0">
          <div className="relative h-48">
            <Image
              src={project.designUrl}
              alt={`Design for ${project.clientName}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold mb-2 text-foreground">{project.clientName}</CardTitle>
          <p className="text-sm text-muted-foreground mb-2">{project.theme}</p>
          <Badge className={`status-${project.status.toLowerCase().replace(' ', '-')}`}>
            {project.status}
          </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" asChild className="text-foreground hover:text-primary">
            <Link href={`/collaboration/${project.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}


'use client'

import { useState } from 'react'
import Header from './Header'
import ProjectCard from './ProjectCard'
import { projects } from '@/lib/mock-data'
import { H1 } from '@/components/ui/typography'
import { Breadcrumb } from './Breadcrumb'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredProjects = projects.filter(project => 
    (project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     project.theme.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || project.status === filterStatus)
  )

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
        <Breadcrumb items={[{ name: 'Dashboard', href: '/' }]} />
        <H1 className="mt-4 mb-6">Active Projects</H1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  )
}


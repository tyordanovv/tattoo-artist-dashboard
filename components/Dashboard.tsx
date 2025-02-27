'use client'

import { useEffect, useState } from 'react'
import Header from './Header'
import ProjectCard from './ProjectCard'
import { H1 } from '@/components/ui/typography'
import { Breadcrumb } from './Breadcrumb'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabaseClient'
import { Design } from '@/lib/types'

export default function Dashboard({ initialUser }: { initialUser: any }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [projects, setProjects] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const clientUser = useUser() || initialUser

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        
        let query = supabase
          .from('designs')
          .select('*')

        if (clientUser?.role === 'client') {
          query = query.eq('client_id', clientUser.id)
        }

        const { data, error } = await query

        console.log("data")
        console.log(data)

        if (error) throw error
        setProjects(data || [])

        console.log("setProjects")
        console.log(projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [clientUser?.id, clientUser?.role])

  const filteredProjects = projects.filter(project => 
    (project.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) &&
    (filterStatus === 'all' || project.status === filterStatus)
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
        user={clientUser}
        // searchTerm={searchTerm} 
        // setSearchTerm={setSearchTerm}
        // filterStatus={filterStatus}
        // setFilterStatus={setFilterStatus}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
        <Breadcrumb items={[{ name: 'Dashboard', href: '/' }]} />
        
        <H1 className="mt-4 mb-6">
          {clientUser?.role === 'artist' ? 'Client Projects' : 'My Designs'}
        </H1>

        {loading ? (
          <div className="text-center">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No projects found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
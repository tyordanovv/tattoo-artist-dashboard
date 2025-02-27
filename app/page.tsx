'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Design, User } from '@/lib/types'
import Header from '@/components/Header'
import ProjectCard from '@/components/ProjectCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { H1 } from '@/components/ui/typography'
import { checkAndRedirect, getProjects } from '@/lib/api'
import Footer from '@/components/Footer'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [projects, setProjects] = useState<Design[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true)
        
        // Check authentication and get user data
        const { authenticated, user: userData } = await checkAndRedirect()
        
        if (!authenticated) {
          router.push('/login')
          return
        }
        
        setUser(userData)
        
        // Fetch projects
        if (userData) {
          const projectsData = await getProjects(userData.id, userData.role)
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router])

  const filteredProjects = projects.filter(project =>
    (project.clientName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || project.status === filterStatus)
  )

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
          user={user}
          // searchTerm={searchTerm} 
          // setSearchTerm={setSearchTerm}
          // filterStatus={filterStatus}
          // setFilterStatus={setFilterStatus}
        />        
      <main className="min-h-screen bg-background">
        <section className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <Breadcrumb items={[{ name: 'Dashboard', href: '/' }]} />
          
          <H1 className="mt-4 mb-6">
            {user?.role === 'artist' ? 'Client Projects' : 'My Designs'}
          </H1>
  
          {loading ? (
            <div className="text-center">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No projects found matching your criteria now
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer/>
    </div>
  )
}
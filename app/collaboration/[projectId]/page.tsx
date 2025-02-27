"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Design, User } from '@/lib/types'
import CollaborationInterface from '@/components/CollaborationInterface'
import Header from '@/components/Header'
import { checkAndRedirect, getProjectById } from '@/lib/api'
import Footer from '@/components/Footer'

export default function CollaborationPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Design | null>(null)
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
        
        // Fetch project
        const projectData = await getProjectById(params.projectId)
        setProject(projectData)
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [params.projectId, router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header
        user={user}
        // TODO: searchTerm={searchTerm}
        // TODO: setSearchTerm={setSearchTerm}
        // TODO: filterStatus={filterStatus}
        // TODO: setFilterStatus={setFilterStatus}
      />
      <main className="min-h-screen bg-background">
        <CollaborationInterface project={project} user={user} />
      </main>
      <Footer/>
    </div>
  )
}
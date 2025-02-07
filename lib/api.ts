import { Project, Comment, Version } from './types'

// Mock data
const projects: Project[] = [
  {
    id: '1',
    clientName: 'Alice Johnson',
    theme: 'Nature-inspired sleeve',
    status: 'In Progress',
    designUrl: '/placeholder.svg?height=400&width=600',
  },
  // ... (add more mock projects as needed)
]

const comments: { [key: string]: Comment[] } = {
  '1': [
    {
      id: '1',
      author: { name: 'Alice Johnson', avatarUrl: '/placeholder.svg?height=40&width=40' },
      content: 'I love the overall design! Can we add more flowers?',
      timestamp: '2023-06-15T10:30:00Z',
    },
    // ... (add more mock comments as needed)
  ],
}

const versions: { [key: string]: Version[] } = {
  '1': [
    {
      id: '1',
      number: 1,
      imageUrl: '/placeholder.svg?height=400&width=600',
      createdAt: '2023-06-14T09:00:00Z',
    },
    // ... (add more mock versions as needed)
  ],
}

// API functions
export const getProjectById = async (id: string): Promise<Project> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = projects.find(p => p.id === id)
      resolve(project || projects[0])
    }, 500)
  })
}

export const getComments = async (projectId: string): Promise<Comment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(comments[projectId] || [])
    }, 500)
  })
}

export const postComment = async (projectId: string, content: string): Promise<Comment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: { name: 'Current User', avatarUrl: '/placeholder.svg?height=40&width=40' },
        content,
        timestamp: new Date().toISOString(),
      }
      comments[projectId] = [...(comments[projectId] || []), newComment]
      resolve(newComment)
    }, 500)
  })
}

export const getVersions = async (projectId: string): Promise<Version[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(versions[projectId] || [])
    }, 500)
  })
}

export const scheduleConsultation = async (projectId: string, date: Date, time: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Scheduled consultation for project ${projectId} on ${date.toDateString()} at ${time}`)
      resolve()
    }, 500)
  })
}

export const approveDesign = async (projectId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Approved design for project ${projectId}`)
      resolve()
    }, 500)
  })
}

export const rejectDesign = async (projectId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Rejected design for project ${projectId}`)
      resolve()
    }, 500)
  })
}

export const requestEdit = async (projectId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Requested edit for project ${projectId}`)
      resolve()
    }, 500)
  })
}


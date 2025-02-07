export interface Project {
  id: string
  clientName: string
  theme: string
  status: 'In Progress' | 'Awaiting Feedback' | 'Approved'
  designUrl: string
}

export interface Comment {
  id: string
  author: {
    name: string
    avatarUrl: string
  }
  content: string
  timestamp: string
}

export interface Version {
  id: string
  number: number
  imageUrl: string
  createdAt: string
}


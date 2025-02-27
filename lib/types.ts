export interface Design {
  id: string
  clientId: string
  clientName: string
  status: 'In Progress' | 'Awaiting Feedback' | 'Approved'
  imageUrl: string
  version: number
  createdAt: string
  isSelected: boolean
  scheduledAt: Date
}

export interface Comment {
  id: string
  designId: string
  author: {
    id: string
    name: string
    avatarUrl: string
  }
  content: string
  createdAt: string
}

export interface Version {
  id: string
  number: number
  imageUrl: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  role: string
}


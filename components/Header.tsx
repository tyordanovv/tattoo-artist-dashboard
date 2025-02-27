'use client'

import { Bell, Search, LogOut, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from './ui/badge'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'

interface HeaderProps {
  user: User | null
  // searchTerm: string
  // setSearchTerm: (term: string) => void
  // filterStatus: string
  // setFilterStatus: (status: string) => void
}

export default function Header({ user }: HeaderProps) { // , searchTerm, setSearchTerm, filterStatus, setFilterStatus
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
  
  return (
    <header className="bg-card border-b border-border p-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-4 mb-4 sm:mb-0">

        {/* <Search className="text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-background text-foreground"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] bg-background text-foreground">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="awaiting-feedback">Awaiting Feedback</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-4 flex-wrap">
        <Button variant="ghost" size="icon" className="text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {user?.role === 'artist' && (
          <Button 
            variant="default"
            size="sm"
            onClick={() => router.push('/new-user')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Invite Client
          </Button>
        )}
        <div className="flex items-center gap-2">
          <span>{user?.name}</span>
          <Badge variant="outline">{user?.role}</Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
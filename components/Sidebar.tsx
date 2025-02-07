import { Home, Users, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  return (
    <aside className="bg-card w-64 p-6 hidden md:block border-r border-border">
      <nav className="space-y-4">
        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary hover:bg-secondary">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary hover:bg-secondary">
          <Users className="mr-2 h-4 w-4" />
          Clients
        </Button>
        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary hover:bg-secondary">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
      <div className="absolute bottom-6">
        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary hover:bg-secondary">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}


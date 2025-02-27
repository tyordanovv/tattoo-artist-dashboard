'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Design, User } from '@/lib/types'
import { updateDesignSchedule } from '@/lib/api'

interface SchedulingToolProps {
  design: Design
  user: User | null
}

export default function SchedulingTool({ design, user }: SchedulingToolProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('12:00')
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch the scheduled date from the database
    async function fetchSchedule() {
      if (design?.scheduledAt) {
        setScheduledAt(design.scheduledAt)
      }
    }
    fetchSchedule()
  }, [design])

  const handleSchedule = async () => {
    if (selectedDate) {
      const fullDateTime = `${selectedDate.toISOString().split('T')[0]}T${time}:00Z`
      await updateDesignSchedule(design.id, fullDateTime)
      setScheduledAt(new Date(fullDateTime))
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Scheduled on</h3>
      {scheduledAt ? (
        <p className="mt-2">
          {new Date(scheduledAt).toLocaleDateString()} at {new Date(scheduledAt).toLocaleTimeString()}
        </p>
      ) : (
        <p className="mt-2 text-gray-500">No consultation scheduled yet.</p>
      )}

      {user?.role === 'artist' && (
        <>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border mt-4"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Schedule Consultation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Consultation</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    value={selectedDate?.toLocaleDateString()}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleSchedule}>Confirm Scheduling</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
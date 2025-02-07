'use client'

import { Button } from '@/components/ui/button'
import { Check, X, Edit3 } from 'lucide-react'
import { approveDesign, rejectDesign, requestEdit } from '@/lib/api'

interface ApprovalButtonsProps {
  projectId: string
}

export default function ApprovalButtons({ projectId }: ApprovalButtonsProps) {
  const handleApprove = async () => {
    await approveDesign(projectId)
    // You might want to show a success message or update the UI here
  }

  const handleReject = async () => {
    await rejectDesign(projectId)
    // You might want to show a success message or update the UI here
  }

  const handleRequestEdit = async () => {
    await requestEdit(projectId)
    // You might want to show a success message or update the UI here
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={handleRequestEdit}>
        <Edit3 className="mr-2 h-4 w-4" /> Request Edit
      </Button>
      <Button variant="destructive" onClick={handleReject}>
        <X className="mr-2 h-4 w-4" /> Reject
      </Button>
      <Button variant="default" onClick={handleApprove}>
        <Check className="mr-2 h-4 w-4" /> Approve
      </Button>
    </div>
  )
}


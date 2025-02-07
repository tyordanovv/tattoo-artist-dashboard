'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send } from 'lucide-react'
import { Comment } from '@/lib/types'
import { getComments, postComment } from '@/lib/api'

interface CommentSystemProps {
  projectId: string
}

export default function CommentSystem({ projectId }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(projectId)
      setComments(fetchedComments)
    }
    fetchComments()
  }, [projectId])

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      const comment = await postComment(projectId, newComment)
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 overflow-auto mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={comment.author.avatarUrl} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{comment.author.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleSubmitComment}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send comment</span>
        </Button>
      </div>
    </div>
  )
}


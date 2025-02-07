import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

export default function ReferenceUpload({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = () => {
    onUpload(files)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Do you have any reference images or ideas you'd like to upload?</h2>
      <div className="flex items-center space-x-4">
        <Input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
            <Upload className="h-5 w-5" />
            <span>Choose Files</span>
          </div>
        </label>
        <span>{files.length} file(s) selected</span>
      </div>
      <Button onClick={handleSubmit} disabled={files.length === 0} className="mt-4">Upload References</Button>
    </div>
  )
}
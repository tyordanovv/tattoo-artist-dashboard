'use client'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border text-center p-4">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} INKEDVISION. All rights reserved.
      </p>
    </footer>
  )
}
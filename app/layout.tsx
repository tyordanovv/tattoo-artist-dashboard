import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tattoo Artist Dashboard',
  description: 'Manage your tattoo designs efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning={true} className={`${inter.className} tattoo-bg`}>
        <div className="ink-splash" />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}


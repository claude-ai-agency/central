import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agency Dashboard',
  description: 'claude-ai-agency Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="bg-void text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

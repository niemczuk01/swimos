import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Natare',
  description: 'A free, community-driven platform for swimmers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

import '../globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/ui/navbar'
import { AuthBar } from '@/components/ui/authbar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode

}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-cols-2 z-100 sticky top-0">
          <Navbar />
          <div className="ml-auto static">
            <AuthBar />
          </div>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

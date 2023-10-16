import '../globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode

}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-black h-screen w-screen flex">
          <div className="m-auto w-4/12">
            {children}
          </div>
        </div>
        <Toaster />
    </body>
    </html >
  )
}

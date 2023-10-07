import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpendCTRL - ',
  description: 'Generated by create next app',
}

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
    </body>
    </html >
  )
}

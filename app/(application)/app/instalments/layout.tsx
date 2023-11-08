import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Instalments"
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode

}) {
  return (
    <>
    {children}
    </>
  )
}

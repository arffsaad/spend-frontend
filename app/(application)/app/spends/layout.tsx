import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Spending"
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

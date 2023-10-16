import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Wallets"
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

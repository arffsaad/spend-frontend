import { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
      default: 'SpendCTRL', // a default is required when creating a template
      template: '%s | SpendCTRL',
    }
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

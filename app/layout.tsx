import type { Metadata } from 'next'
import { NextUIProvider } from '@nextui-org/react'

import { ATProtoProvider } from '@/services/atproto'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashcards',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <ATProtoProvider>{children}</ATProtoProvider>
        </NextUIProvider>
      </body>
    </html>
  )
}

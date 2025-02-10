import type { Metadata } from 'next'
import { HeroUIProvider } from '@heroui/react'

import { ATProtoProvider } from '@/services/atproto'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashcards',
  description: 'A simple flashcard studying tool based on AT Protocol.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>
          <ATProtoProvider>{children}</ATProtoProvider>
        </HeroUIProvider>
      </body>
    </html>
  )
}

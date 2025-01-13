'use client'

import { useATProto } from '@/services/atproto'
import Link from 'next/link'

export default function Home() {
  const { profile } = useATProto()

  return (
    <div>
      <h1>Welcome to Flashcards App!</h1>
      {!!profile ? (
        <p>New Deck</p>
      ) : (
        <p>
          <Link href="/login">Sign in</Link> to create your first deck!
        </p>
      )}
    </div>
  )
}

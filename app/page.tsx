'use client'

import Link from 'next/link'

import { useATProto } from '@/services/atproto'
import DecksList from '@/components/DecksList'

export default function Home() {
  const { profile } = useATProto()

  return (
    <div>
      <h1>Flashcards</h1>
      <h2>A simple study tool created by Scott Polhemus</h2>
      {!!profile ? (
        <>
          <p>
            <Link href="/login">Create a deck</Link>
          </p>
          <h3>Your Decks</h3>
          <DecksList repo={profile.did} />
        </>
      ) : (
        <p>
          <Link href="/login">Sign in</Link> to start creating your own decks!
        </p>
      )}
    </div>
  )
}

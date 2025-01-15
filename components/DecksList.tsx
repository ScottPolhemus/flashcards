import { useEffect, useState } from 'react'

import { UsPolhemFlashcardsDeck } from '@/app/__generated__/lexicons'
import { useATProto } from '@/services/atproto'
import LoadingScreen from './LoadingScreen'
import { parseAtProtoUri } from '@/utils/atProtoUri'
import Link from 'next/link'

export default function DecksList({ repo }: { repo: string }) {
  const { flashcards } = useATProto()
  const [decks, setDecks] = useState<
    { uri: string; value: UsPolhemFlashcardsDeck.Record }[]
  >([])
  const [loading, setLoading] = useState(true)

  if (!flashcards) {
    throw new Error('Flashcards client not initialized')
  }

  useEffect(() => {
    flashcards.deck
      .list({
        repo,
      })
      .then((response) => {
        setDecks(response.records)
        setLoading(false)
      })
  }, [flashcards, repo])

  if (loading) {
    return <LoadingScreen />
  }

  if (!decks.length) {
    return <p>No decks found.</p>
  }

  return (
    <>
      {decks.map((deck) => {
        const { rkey, authorDid } = parseAtProtoUri(deck.uri)

        return (
          <p key={deck.uri}>
            <Link href={`/deck?repo=${authorDid}&rkey=${rkey}`}>
              {deck.value.name}
            </Link>
          </p>
        )
      })}
    </>
  )
}

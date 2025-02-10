'use client'

import {
  UsPolhemFlashcardsNS,
  UsPolhemFlashcardsDeck,
} from '@/app/__generated__/lexicons'
import { useATProto } from '@/services/atproto'
import { useEffect, useState } from 'react'

async function listDecks({
  flashcards,
  repo,
}: {
  flashcards: UsPolhemFlashcardsNS
  repo: string
}) {
  let response = await flashcards.deck.list({
    repo,
  })
  let results = response.records

  do {
    response = await flashcards.deck.list({
      repo,
      cursor: response.cursor,
    })
    if (response.records.length) {
      results = results.concat(response.records)
    }
  } while (response.records.length > 0)

  return results
}

export default function useDecksList({ repo }: { repo: string }) {
  const { flashcards } = useATProto()
  const [loading, setLoading] = useState(true)
  const [decks, setDecks] =
    useState<{ uri: string; value: UsPolhemFlashcardsDeck.Record }[]>()

  if (!flashcards) {
    throw new Error('Flashcards client not initialized')
  }

  useEffect(() => {
    listDecks({ flashcards, repo }).then((decks) => {
      setDecks(decks)
      setLoading(false)
    })
  }, [flashcards, repo])

  return {
    decks,
    loading,
  }
}

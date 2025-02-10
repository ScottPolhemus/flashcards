'use client'

import { useEffect, useState } from 'react'

import {
  UsPolhemFlashcardsCard,
  UsPolhemFlashcardsDeck,
} from '@/app/__generated__/lexicons'
import { useATProto } from '@/services/atproto'
import listCards from '@/utils/listCards'

export default function useDeck({
  repo,
  rkey,
}: {
  repo: string
  rkey: string
}) {
  const { flashcards } = useATProto()
  const [loading, setLoading] = useState(true)
  const [deck, setDeck] = useState<{
    uri: string
    value: UsPolhemFlashcardsDeck.Record
  }>()
  const [cards, setCards] =
    useState<{ uri: string; value: UsPolhemFlashcardsCard.Record }[]>()

  if (!flashcards) {
    throw new Error('Flashcards client not initialized')
  }

  useEffect(() => {
    flashcards.deck
      .get({
        repo,
        rkey,
      })
      .then((response) => {
        setDeck(response)

        // TODO: Cache deck details in browser storage, skip card requests if deck updated datetime has not changed
        listCards({ flashcards, repo, deckUri: response.uri }).then((cards) => {
          setCards(cards)
          setLoading(false)
        })
      })
  }, [flashcards, repo, rkey])

  return {
    deck,
    cards,
    loading,
  }
}

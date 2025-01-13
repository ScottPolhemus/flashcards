'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import {
  UsPolhemFlashcardsCard,
  UsPolhemFlashcardsDeck,
} from '@/app/__generated__/lexicons'
import { useATProto } from '@/services/atproto'
import DeckDetails from '@/components/DeckDetails'
import LoadingScreen from '@/components/LoadingScreen'
import listCards from '@/utils/listCards'
import DeckPractice from '@/components/DeckPractice'

export default function DeckPage() {
  const searchParams = useSearchParams()
  const repo = searchParams.get('repo')
  const rkey = searchParams.get('rkey')

  if (!repo || !rkey) {
    throw new Error('Invalid query params')
  }

  const { flashcards } = useATProto()
  const [deck, setDeck] = useState<UsPolhemFlashcardsDeck.Record>()
  const [cards, setCards] = useState<UsPolhemFlashcardsCard.Record[]>([])
  const [loading, setLoading] = useState(true)
  const [practicing, setPracticing] = useState(false)

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
        setDeck(response.value)

        listCards({ flashcards, repo, deckUri: response.uri }).then((cards) => {
          setCards(cards)
          setLoading(false)
        })
      })
  }, [flashcards, repo, rkey])

  if (loading || !deck) {
    return <LoadingScreen />
  }

  if (practicing) {
    return <DeckPractice cards={cards} />
  }

  return (
    <>
      <DeckDetails deck={deck} cards={cards} />
      <button onClick={() => setPracticing(true)}>Practice!</button>
    </>
  )
}

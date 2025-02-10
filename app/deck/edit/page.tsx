'use client'

import { useSearchParams } from 'next/navigation'

import DeckForm from '@/components/DeckForm'
import LoadingScreen from '@/components/LoadingScreen'
import useDeck from '@/hooks/useDeck'

export default function EditDeckPage() {
  const searchParams = useSearchParams()
  const repo = searchParams.get('repo')
  const rkey = searchParams.get('rkey')

  if (!repo || !rkey) {
    throw new Error('"repo" and "rkey" query params are required')
  }

  const { deck, cards, loading } = useDeck({ repo, rkey })

  if (loading) {
    return <LoadingScreen />
  }

  if (!deck || !cards) {
    throw new Error('Error loading deck.')
  }

  return (
    <>
      <h1 className="mx-4 text-3xl font-bold">Edit deck</h1>
      <DeckForm deck={deck} cards={cards} />
    </>
  )
}

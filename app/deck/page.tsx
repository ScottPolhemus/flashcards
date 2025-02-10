'use client'

import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@heroui/react'

import DeckDetails from '@/components/DeckDetails'
import DeckPractice from '@/components/DeckPractice'
import LoadingScreen from '@/components/LoadingScreen'
import useDeck from '@/hooks/useDeck'

export default function DeckPage() {
  const searchParams = useSearchParams()
  const repo = searchParams.get('repo')
  const rkey = searchParams.get('rkey')

  if (!repo || !rkey) {
    throw new Error('Invalid query params')
  }

  const { deck, cards, loading } = useDeck({ repo, rkey })
  const [practicing, setPracticing] = useState(false)

  const onPressPractice = useCallback(() => {
    setPracticing(true)
  }, [])

  if (loading || !deck || !cards) {
    return <LoadingScreen />
  }

  if (practicing) {
    return <DeckPractice cards={cards} />
  }

  return (
    <>
      <DeckDetails deck={deck} cards={cards} />
      <Button onPress={onPressPractice}>Practice!</Button>
    </>
  )
}

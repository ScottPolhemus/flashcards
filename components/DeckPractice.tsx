import _shuffle from 'lodash/shuffle'
import { useState } from 'react'

import { UsPolhemFlashcardsCard } from '@/app/__generated__/lexicons'

export default function DeckPractice({
  cards,
}: {
  cards: UsPolhemFlashcardsCard.Record[]
}) {
  const [randomizedCards, setRandomizedCards] = useState(_shuffle(cards))
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  return (
    <div>
      <div>
        {showBack ? randomizedCards[index].back : randomizedCards[index].front}
      </div>
      <button
        onClick={() => {
          setShowBack(!showBack)
        }}
      >
        Turn over
      </button>
      <button
        onClick={() => {
          if (index < randomizedCards.length - 1) {
            setIndex(index + 1)
          } else {
            setRandomizedCards(_shuffle(cards))
            setIndex(0)
          }
        }}
      >
        Next Card
      </button>
    </div>
  )
}

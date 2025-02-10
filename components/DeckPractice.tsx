import { useCallback, useState } from 'react'
import _shuffle from 'lodash/shuffle'
import Tilt from 'react-parallax-tilt'

import { UsPolhemFlashcardsCard } from '@/app/__generated__/lexicons'

export default function DeckPractice({
  cards,
}: {
  cards: { uri: string; value: UsPolhemFlashcardsCard.Record }[]
}) {
  const [shuffledCards, setShuffledCards] = useState(_shuffle(cards))
  const [index, setIndex] = useState(0)
  const [showCardBack, setShowCardBack] = useState(false)

  const toggleShowCardBack = useCallback(() => {
    setShowCardBack(!showCardBack)
  }, [showCardBack])

  const drawNextCard = useCallback(() => {
    if (index < cards.length - 1) {
      setIndex(index + 1)
    } else {
      setShuffledCards(_shuffle(cards))
      setIndex(0)
    }
  }, [index, cards])

  return (
    <div className="p-4">
      <Tilt
        tiltReverse
        flipHorizontally={showCardBack}
        className="relative mx-auto aspect-[2/3] max-w-[500px] transform-3d"
      >
        <div className="absolute inset-0 border-2 border-black transform-3d">
          <div className="absolute inset-0 bg-white p-4">
            {shuffledCards[index].value.front}
          </div>
          <div
            className="absolute inset-0 bg-white p-4 backface-hidden"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            {shuffledCards[index].value.back}
          </div>
        </div>
      </Tilt>
      <button onClick={toggleShowCardBack}>Turn over</button>
      <button onClick={drawNextCard}>Next Card</button>
    </div>
  )
}

import { useCallback, useState } from 'react'
import _shuffle from 'lodash/shuffle'
import Tilt from 'react-parallax-tilt'

import { UsPolhemFlashcardsCard } from '@/app/__generated__/lexicons'

export default function DeckPractice({
  cards,
}: {
  cards: UsPolhemFlashcardsCard.Record[]
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
        className="transform-3d relative mx-auto aspect-[2/3] max-w-[500px]"
      >
        <div className="transform-3d absolute inset-0 border-2 border-black">
          <div className="absolute inset-0 bg-white p-4">
            {shuffledCards[index].front}
          </div>
          <div
            className="backface-hidden absolute inset-0 bg-white p-4"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            {shuffledCards[index].back}
          </div>
        </div>
      </Tilt>
      <button onClick={toggleShowCardBack}>Turn over</button>
      <button onClick={drawNextCard}>Next Card</button>
    </div>
  )
}

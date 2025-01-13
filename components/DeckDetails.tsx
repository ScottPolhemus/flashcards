import {
  UsPolhemFlashcardsDeck,
  UsPolhemFlashcardsCard,
} from '@/app/__generated__/lexicons'

export default function DeckDetails({
  deck,
  cards,
}: {
  deck: UsPolhemFlashcardsDeck.Record
  cards: UsPolhemFlashcardsCard.Record[]
}) {
  return (
    <>
      <h1>{deck.name}</h1>
      <p>{cards.length} cards</p>
    </>
  )
}

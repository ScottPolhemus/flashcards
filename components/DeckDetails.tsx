import {
  UsPolhemFlashcardsDeck,
  UsPolhemFlashcardsCard,
} from '@/app/__generated__/lexicons'

export default function DeckDetails({
  deck,
  cards,
}: {
  deck: { uri: string; value: UsPolhemFlashcardsDeck.Record }
  cards: { uri: string; value: UsPolhemFlashcardsCard.Record }[]
}) {
  return (
    <>
      <h1>{deck.value.name}</h1>
      <p>{cards.length} cards</p>
    </>
  )
}

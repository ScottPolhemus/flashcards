import { UsPolhemFlashcardsNS } from '@/app/__generated__/lexicons'

export default async function listCards({
  flashcards,
  repo,
  deckUri,
}: {
  flashcards: UsPolhemFlashcardsNS
  repo: string
  deckUri: string
}) {
  let response = await flashcards.card.list({
    repo,
  })
  let results = response.records

  do {
    response = await flashcards.card.list({
      repo,
      cursor: response.cursor,
    })
    if (response.records.length) {
      results = results.concat(response.records)
    }
  } while (response.records.length > 0)

  return results
    .map(({ value }) => value)
    .filter((card) => {
      return card.deck === deckUri
    })
}

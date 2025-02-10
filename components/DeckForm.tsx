'use client'

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { Form, Textarea, Button, Input } from '@heroui/react'
import moment from 'moment'

import {
  UsPolhemFlashcardsCard,
  UsPolhemFlashcardsDeck,
} from '@/app/__generated__/lexicons'
import { useATProto } from '@/services/atproto'
import { parseAtProtoUri } from '@/utils/atProtoUri'

interface DraftDeck {
  uri?: string
  value: Partial<UsPolhemFlashcardsDeck.Record>
}

interface DraftCard {
  uri?: string
  value: Partial<UsPolhemFlashcardsCard.Record>
}

export default function DeckForm({
  deck,
  cards,
}: {
  deck?: {
    uri: string
    value: UsPolhemFlashcardsDeck.Record
  }
  cards?: Array<{
    uri: string
    value: UsPolhemFlashcardsCard.Record
  }>
}) {
  const { agent, flashcards } = useATProto()

  const [draftDeck, setDraftDeck] = useState<DraftDeck>(deck || { value: {} })
  const [draftCards, setDraftCards] = useState<DraftCard[]>(
    cards || [{ value: {} }]
  )
  const [submitting, setSubmitting] = useState(false)

  const onChangeDeckField = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newDraftDeck = { ...draftDeck }

      if (event.target.name === 'deck[name]') {
        newDraftDeck.value.name = event.target.value
      } else if (event.target.name === 'deck[description]') {
        newDraftDeck.value.description = event.target.value
      }

      setDraftDeck(newDraftDeck)
    },
    [draftDeck]
  )

  const onChangeCardField = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const matches = event.target.name.match(/card\[(.+)\]\[(.+)\]/)

      if (!matches) {
        throw new Error('Invalid card field name')
      }

      const [index, key] = matches

      setDraftCards(
        draftCards.map((draft, draftIndex) => {
          if (draftIndex === parseInt(index)) {
            if (key === 'front') {
              return {
                ...draft,
                front: event.target.value,
              }
            } else if (key === 'back') {
              return {
                ...draft,
                back: event.target.value,
              }
            }
          }
          return draft
        })
      )
    },
    [draftCards]
  )

  const onPressRemoveCard = useCallback<
    NonNullable<Parameters<typeof Button>[0]['onPress']>
  >(
    (event) => {
      const matches = (event.target as HTMLButtonElement).name.match(
        /card\[(.+)\]\[remove\]/
      )

      if (!matches) {
        throw new Error('Invalid card field name')
      }

      const draftCardIndexToRemove = parseInt(matches[1])
      console.log({ matches, draftCardIndexToRemove })

      setDraftCards(
        draftCards.filter((draft, i) => i !== draftCardIndexToRemove)
      )
    },
    [draftCards]
  )

  const onPressAddCard = useCallback(() => {
    setDraftCards([
      ...draftCards,
      {
        value: {},
      },
    ])
  }, [draftCards])

  const onSubmitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!flashcards || !agent) {
        throw new Error('ATProto client not initialized')
      }

      if (submitting) {
        return
      }

      setSubmitting(true)

      const now = moment().format()

      const deckData = {
        ...draftDeck.value,
        createdAt: draftDeck.value.createdAt || now,
        updatedAt: now,
      }

      const validation = UsPolhemFlashcardsDeck.validateRecord(deckData)

      if (!validation.success) {
        throw validation.error
      }

      // TODO: Validate all card records before performing requests?

      // Create or update deck record
      const deck = !!draftDeck.uri
        ? await agent.com.atproto.repo.putRecord({
            repo: agent.sessionManager.did as string,
            collection: 'us.polhem.flashcards.deck',
            rkey: parseAtProtoUri(draftDeck.uri).rkey,
            record: deckData as UsPolhemFlashcardsDeck.Record,
          })
        : await flashcards.deck.create(
            {
              repo: agent.sessionManager.did,
            },
            deckData as UsPolhemFlashcardsDeck.Record
          )

      const deckUri = deck && 'data' in deck ? deck.data.uri : deck?.uri

      // Create or update card records
      // TODO: Limit concurrency and enable some number of retries for requests
      await Promise.all(
        draftCards.map((draftCard) => {
          const cardData = {
            ...draftCard.value,
            createdAt: draftCard.value.createdAt || now,
            deck: deckUri,
          }

          const validation = UsPolhemFlashcardsCard.validateRecord(cardData)

          if (!validation.success) {
            throw validation.error
          }

          if (draftCard.uri) {
            return agent.com.atproto.repo.putRecord({
              repo: agent.sessionManager.did as string,
              collection: 'us.polhem.flashcards.card',
              rkey: parseAtProtoUri(draftCard.uri).rkey,
              record: cardData,
            })
          } else {
            return flashcards.card.create(
              {
                repo: agent.sessionManager.did,
              },
              cardData as UsPolhemFlashcardsCard.Record
            )
          }
        })
      )

      // TODO: Decide if/where to redirect or show success message inline
      alert('Deck updated!')
    },
    [agent, flashcards, submitting, draftDeck, draftCards]
  )

  return (
    <Form className="p-4" onSubmit={onSubmitForm} validationBehavior="native">
      <Input
        name="deck[name]"
        label="Deck name"
        value={draftDeck?.value?.name}
        onChange={onChangeDeckField}
        isRequired
      />
      <Textarea
        name="deck[description]"
        label="Deck description"
        value={draftDeck?.value?.description}
        onChange={onChangeDeckField}
      />
      {draftCards.map((card, i) => (
        <fieldset key={i} className="my-2 flex w-full gap-2">
          <Textarea
            label="Front text"
            name={`card[${i}][front]`}
            value={card.value.front}
            onChange={onChangeCardField}
            isRequired
          />
          <Textarea
            label="Back text"
            name={`card[${i}][back]`}
            value={card.value.back}
            onChange={onChangeCardField}
            isRequired
          />
          <Button
            type="button"
            name={`card[${i}][remove]`}
            size="sm"
            onPress={onPressRemoveCard}
            isDisabled={draftCards.length === 1}
          >
            Remove
          </Button>
        </fieldset>
      ))}
      <Button type="button" onPress={onPressAddCard}>
        Add Card
      </Button>
      <Button size="lg" type="submit" isLoading={submitting}>
        {draftDeck.uri ? 'Update' : 'Create'} Deck
      </Button>
    </Form>
  )
}

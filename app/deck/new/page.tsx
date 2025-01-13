'use client'

import { useState } from 'react'
import { Form, Textarea, Button, Input } from '@nextui-org/react'

import { useATProto } from '@/services/atproto'
import moment from 'moment'

export default function NewDeckPage() {
  const { agent, flashcards } = useATProto()
  const [deckName, setDeckName] = useState('')
  const [draftCards, setDraftCards] = useState<
    Array<{ front: string; back: string }>
  >([{ front: '', back: '' }])
  const [submitting, setSubmitting] = useState(false)

  const onChangeDeckNameField: Parameters<typeof Textarea>[0]['onChange'] = (
    event
  ) => {
    setDeckName(event.target.value)
  }

  const onPressAddCard = () => {
    setDraftCards([...draftCards, { front: '', back: '' }])
  }

  const onPressRemoveCard: Parameters<typeof Button>[0]['onPress'] = (
    event
  ) => {
    if ((event.target as HTMLButtonElement).disabled) {
      return
    }

    const i = parseInt(
      event.target
        .closest('[data-card-index]')
        ?.getAttribute('data-card-index') as string
    )

    setDraftCards(
      draftCards.filter((card, index) => {
        return index !== i
      })
    )
  }

  const onChangeCardField: Parameters<typeof Textarea>[0]['onChange'] = (
    event
  ) => {
    const i = parseInt(
      event.target
        .closest('[data-card-index]')
        ?.getAttribute('data-card-index') as string
    )

    setDraftCards(
      draftCards.map((draft, draftIndex) => {
        if (draftIndex === i) {
          if (event.target.name.includes('front')) {
            return {
              ...draft,
              front: event.target.value,
            }
          } else {
            return {
              ...draft,
              back: event.target.value,
            }
          }
        }

        return draft
      })
    )
  }

  const onPressCreateDeck: Parameters<
    typeof Button
  >[0]['onPress'] = async () => {
    if (submitting) {
      return
    }

    if (!flashcards) {
      throw new Error('Flashcards client not initialized')
    }

    setSubmitting(true)

    const createdAt = moment().format('YYYY-MM-DDTHH:mm')

    const deck = await flashcards.deck.create(
      {
        repo: agent?.sessionManager.did,
      },
      {
        name: deckName,
        createdAt,
      }
    )

    await Promise.all(
      draftCards.map(({ front, back }) => {
        return flashcards.card.create(
          {
            repo: agent?.sessionManager.did,
          },
          {
            front,
            back,
            deck: deck.uri,
            createdAt,
          }
        )
      })
    )

    alert('Success!')
  }

  return (
    <>
      <h1>New Deck</h1>
      <Form className="p-4">
        <Input
          name="name"
          label="Deck name"
          required
          value={deckName}
          onChange={onChangeDeckNameField}
          isRequired
        />
        {draftCards.map(({ front, back }, i) => (
          <fieldset
            className="my-2 flex w-full gap-2"
            key={`card[${i}]`}
            data-card-index={i}
          >
            <Textarea
              label="Front text"
              name={`cards[${i}][front]`}
              value={front}
              onChange={onChangeCardField}
              isRequired
            />
            <Textarea
              label="Back text"
              name={`cards[${i}][back]`}
              value={back}
              onChange={onChangeCardField}
              isRequired
            />
            <Button
              type="button"
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
        <Button size="lg" onPress={onPressCreateDeck} isLoading={submitting}>
          Create Deck
        </Button>
      </Form>
    </>
  )
}

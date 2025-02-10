'use client'

import { Form, Input, Button } from '@heroui/react'

import { useATProto } from '@/services/atproto'
import { useState } from 'react'

export default function LoginPage() {
  const { oAuth } = useATProto()
  const [submitting, setSubmitting] = useState(false)

  const onSubmit: Parameters<typeof Form>[0]['onSubmit'] = (event) => {
    event.preventDefault()

    const handle = new FormData(event.target as HTMLFormElement).get('handle')

    if (!oAuth) {
      throw new Error('OAuth not initialized')
    }

    if (!handle) {
      throw new Error('Handle is required')
    }

    oAuth.signIn(handle.toString())
    setSubmitting(true)
  }

  return (
    <div className="p-4">
      <Form
        onSubmit={onSubmit}
        validationBehavior="native"
        className="mx-auto flex max-w-xl flex-col gap-4"
      >
        <Input
          name="handle"
          label="Handle"
          placeholder="Enter your handle (e.g. alice.bsky.social)"
          isRequired
        />
        <Button
          type="submit"
          isDisabled={!oAuth || submitting}
          color="primary"
          size="lg"
          fullWidth
        >
          {submitting ? 'Please wait...' : 'Sign in'}
        </Button>
        <p>
          Flashcards is built on AT Protocol, the decentralized social platform
          created by Bluesky. If you have an account hosted on Bluesky or
          another compatible server, you can use it to sign in here.
        </p>
      </Form>
    </div>
  )
}

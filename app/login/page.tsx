'use client'

import { Form, Input, Button } from '@nextui-org/react'

import { useATProto } from '@/services/atproto'

export default function LoginPage() {
  const { oAuth } = useATProto()

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
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Input
          name="handle"
          label="Handle"
          placeholder="Enter your handle (e.g. alice.bsky.social)"
          required
        />
        <Button
          type="submit"
          isDisabled={!oAuth}
          color="primary"
          size="lg"
          fullWidth
        >
          Sign in
        </Button>
      </Form>
      <p className="mx-auto mb-4">
        Flashcards is built on AT Protocol, the decentralized social platform
        created by Bluesky. If you have an account hosted on Bluesky or another
        compatible server, you can use it to sign in here.
      </p>
    </>
  )
}

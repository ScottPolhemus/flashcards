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
    <Form onSubmit={onSubmit}>
      <Input name="handle" label="Handle" required />
      <Button
        type="submit"
        disabled={!oAuth}
        color="primary"
        size="lg"
        fullWidth
      >
        Sign in with Bluesky
      </Button>
    </Form>
  )
}

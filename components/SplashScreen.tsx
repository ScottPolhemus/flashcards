import Link from 'next/link'

export default function SplashScreen() {
  return (
    <div className="p-4 text-center">
      <h1 className="mb-4 text-3xl uppercase">Flashcards</h1>
      <h2 className="mb-8 text-xl">
        A simple study tool created by Scott Polhemus
      </h2>
      <p>
        <Link className="underline" href="/login">
          Sign in with your AT Protocol identity (e.g. Bluesky handle)
        </Link>{' '}
        to start creating your own flashcard decks!
      </p>
    </div>
  )
}

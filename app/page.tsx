'use client'

import Link from 'next/link'

import { useATProto } from '@/services/atproto'
import AppNav from '@/components/AppNav'
import SplashScreen from '@/components/SplashScreen'

export default function Home() {
  const { accountProfile } = useATProto()

  if (!accountProfile) {
    return <SplashScreen />
  }

  return (
    <>
      <AppNav />
      <div className="flex h-screen flex-col px-4">
        <h1 className="text-xl">Welcome, {accountProfile.displayName}!</h1>
        <p className="mb-4 text-sm underline">Log out</p>
        <div className="flex gap-4">
          <Link
            href="/deck/new"
            className="flex-1 rounded-md bg-gray-500 p-4 text-center text-white"
          >
            Create a new deck
          </Link>
          <Link
            href={`/profile?actor=${accountProfile.handle}`}
            className="flex-1 rounded-md bg-gray-500 p-4 text-center text-white"
          >
            Browse your decks
          </Link>
        </div>
      </div>
    </>
  )
}

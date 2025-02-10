'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AppBskyActorDefs } from '@atproto/api'

import { useATProto } from '@/services/atproto'
import AppNav from '@/components/AppNav'
import LoadingScreen from '@/components/LoadingScreen'
import useDecksList from '@/hooks/useDecksList'
import { parseAtProtoUri } from '@/utils/atProtoUri'

export default function ProfilePage() {
  const [profile, setProfile] = useState<AppBskyActorDefs.ProfileViewDetailed>()
  const [profileLoading, setProfileLoading] = useState(false)

  const searchParams = useSearchParams()
  const actor = searchParams.get('actor')

  if (!actor) {
    throw new Error('"actor" query param is required')
  }

  const { agent, accountProfile } = useATProto()

  if (!agent) {
    throw new Error('AT Protocol agent not initialized')
  }

  useEffect(() => {
    if (!profile && !profileLoading) {
      setProfileLoading(true)

      if ([accountProfile?.did, accountProfile?.handle].includes(actor)) {
        setProfile(accountProfile)
        setProfileLoading(false)
      } else {
        agent.app.bsky.actor.getProfile({ actor }).then((profileResponse) => {
          setProfile(profileResponse.data)
          setProfileLoading(false)
        })
      }
    }
  }, [agent, actor, accountProfile, profile, profileLoading])

  const { decks } = useDecksList({
    repo: actor,
  })

  if (!profile || !decks) {
    return <LoadingScreen />
  }

  return (
    <div>
      <AppNav />
      <header>
        <div>
          <img
            className="max-h-[250px] min-h-[150px] w-full object-cover"
            alt=""
            src={profile.banner}
          />
          <img
            className="ml-4 mt-[-10%] inline-block h-[20%] w-[20%] rounded-full border-4 border-white"
            alt=""
            src={profile.avatar}
          ></img>
        </div>
        <div className="p-4">
          <h1 className="text-3xl font-bold">{profile.displayName}</h1>
          <h2 className="opacity-50">
            <Link
              className="group"
              href={`https://bsky.app/profile/${profile.handle}`}
              target="_blank"
            >
              @{profile.handle}
            </Link>
          </h2>
          <p>
            <span className="font-bold">{decks.length}</span> deck
            {decks.length === 1 ? '' : 's'}
          </p>
          <p>{profile.description}</p>
        </div>
      </header>
      <div>
        <h3 className="p-4 font-bold">Decks</h3>
        <ul className="border-t">
          {decks.map(({ uri, value: deck }) => {
            const { rkey } = parseAtProtoUri(uri)
            return (
              <li key={rkey} className="flex border-b">
                <Link
                  className="group flex flex-1 justify-between gap-4 p-4"
                  href={`/deck?repo=${actor}&rkey=${rkey}`}
                >
                  <p>{deck.name}</p>
                  <p className="group-hover:underline">View Deck</p>
                </Link>
                {accountProfile?.did === profile.did && (
                  <Link
                    className="flex justify-between gap-4 p-4 hover:underline"
                    href={`/deck/edit?repo=${actor}&rkey=${rkey}`}
                  >
                    <p>Edit Deck</p>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

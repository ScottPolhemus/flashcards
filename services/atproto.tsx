'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { OAuthSession, BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { Agent, AppBskyActorDefs } from '@atproto/api'

import { UsPolhemFlashcardsNS } from '@/app/__generated__/lexicons'
import LoadingScreen from '@/components/LoadingScreen'
import { clientMetadata } from './oauth'

if (!process.env.NEXT_PUBLIC_APP_HOST) {
  throw new Error('Missing NEXT_PUBLIC_APP_HOST env variable')
}

export type ATProtoContextValue = {
  oAuth?: BrowserOAuthClient
  session?: OAuthSession
  agent?: Agent
  profile?: AppBskyActorDefs.ProfileViewDetailed
  flashcards?: UsPolhemFlashcardsNS
  loading: boolean
}

const ATProtoContext = createContext<ATProtoContextValue | null>(null)

export function ATProtoProvider({ children }: { children: ReactNode }) {
  const [oAuth, setOAuth] = useState<BrowserOAuthClient>()
  const [agent, setAgent] = useState<Agent>()
  const [profile, setProfile] = useState<AppBskyActorDefs.ProfileViewDetailed>()
  const [flashcards, setFlashcards] = useState<UsPolhemFlashcardsNS>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const oAuthClient = new BrowserOAuthClient({
      clientMetadata,
      handleResolver: 'https://bsky.social',
    })

    oAuthClient.init().then((result) => {
      setOAuth(oAuthClient)

      if (!!result && 'session' in result) {
        const atProtoAgent = new Agent(result.session)
        setAgent(atProtoAgent)
        setFlashcards(new UsPolhemFlashcardsNS(atProtoAgent))

        atProtoAgent
          .getProfile({ actor: result.session.sub })
          .then((response) => {
            setProfile(response.data)
            setLoading(false)
          })
      } else {
        const atProtoAgent = new Agent('https://bsky.social')
        setAgent(atProtoAgent)
        setFlashcards(new UsPolhemFlashcardsNS(atProtoAgent))
        setLoading(false)
      }
    })
  }, [])

  return (
    <ATProtoContext.Provider
      value={{
        oAuth,
        agent,
        flashcards,
        profile,
        loading,
      }}
    >
      {!!loading ? <LoadingScreen /> : children}
    </ATProtoContext.Provider>
  )
}

export function useATProto() {
  const atproto = useContext(ATProtoContext)

  if (!atproto) {
    throw new Error('Missing ATProtoContext')
  }

  return atproto
}

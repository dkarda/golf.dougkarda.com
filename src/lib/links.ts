import { useEffect, useState } from 'react'
import type { GolfLink } from '../types'

export const GOLF_LINKS_URL =
  'https://assets.dougkarda.com/data/golf/golfLinks.json'

export type LinksLoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; links: GolfLink[] }

let inflight: Promise<GolfLink[]> | null = null

export async function fetchGolfLinks(): Promise<GolfLink[]> {
  if (!inflight) {
    inflight = fetch(GOLF_LINKS_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Could not load links (${res.status})`)
        const data: unknown = await res.json()
        return Array.isArray(data) ? (data as GolfLink[]) : []
      })
      .catch((err) => {
        inflight = null
        throw err
      })
  }
  return inflight
}

export function useGolfLinks(): LinksLoadState {
  const [state, setState] = useState<LinksLoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchGolfLinks()
      .then((links) => {
        if (!cancelled) setState({ status: 'ready', links })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              err instanceof Error ? err.message : 'Could not load links',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function snapshotRecommended(links: GolfLink[], limit = 3): GolfLink[] {
  return links.filter((l) => l.recommended).slice(0, limit)
}

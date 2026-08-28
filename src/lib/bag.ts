import { useEffect, useState } from 'react'
import { BAG_CATEGORY_ORDER } from './labels'
import type { BagAccessory, Club, ClubCategory, GolfBag } from '../types'

export const GOLF_BAG_URL = 'https://assets.dougkarda.com/data/golfBag.json'

/** Confirmed directory on the CDN (listing is 403). Filenames in JSON 404 today. */
export const BAG_IMAGE_BASE = 'https://assets.dougkarda.com/images/golf/'

export type BagLoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; bag: GolfBag }

type ActiveFlag = { active?: boolean }

let inflight: Promise<GolfBag> | null = null

export function resolveBagImage(
  image: string | null | undefined,
): string | undefined {
  if (!image) return undefined
  if (/^https?:\/\//i.test(image)) return image
  return `${BAG_IMAGE_BASE}${image.replace(/^\//, '')}`
}

export function isInTheBag(item: ActiveFlag, siblings: ActiveFlag[]): boolean {
  if (item.active === true) return true
  if (item.active === false) return false
  const siblingMarkedActive = siblings.some((s) => s.active === true)
  return !siblingMarkedActive
}

export function clubsCurrentlyInBag(clubs: Club[]): Club[] {
  return clubs.filter((club) =>
    isInTheBag(
      club,
      clubs.filter((sibling) => sibling.category === club.category),
    ),
  )
}

export function accessoriesCurrentlyInBag(items: BagAccessory[]): BagAccessory[] {
  return items.filter((item) => isInTheBag(item, items))
}

export function formatLoft(loft: number | string | null | undefined): string | undefined {
  if (loft == null || loft === '') return undefined
  if (typeof loft === 'number') return `${loft}°`
  return /°/.test(loft) ? loft : `${loft}°`
}

export function humanizeKey(key: string): string {
  const spaced = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export async function fetchGolfBag(): Promise<GolfBag> {
  if (!inflight) {
    inflight = fetch(GOLF_BAG_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Could not load bag (${res.status})`)
        const data = (await res.json()) as GolfBag
        return {
          clubs: Array.isArray(data.clubs) ? data.clubs : [],
          accessories: Array.isArray(data.accessories) ? data.accessories : [],
        }
      })
      .catch((err) => {
        inflight = null
        throw err
      })
  }
  return inflight
}

export function useGolfBag(): BagLoadState {
  const [state, setState] = useState<BagLoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchGolfBag()
      .then((bag) => {
        if (!cancelled) setState({ status: 'ready', bag })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Could not load bag',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function clubsInBagOrder(clubs: Club[]): Club[] {
  const rank = new Map<ClubCategory, number>(
    BAG_CATEGORY_ORDER.map((cat, i) => [cat, i]),
  )
  return [...clubs].sort((a, b) => {
    const ra = rank.get(a.category) ?? 99
    const rb = rank.get(b.category) ?? 99
    return ra - rb
  })
}

export function snapshotClubs(bag: GolfBag, limit = 4): Club[] {
  return clubsInBagOrder(clubsCurrentlyInBag(bag.clubs)).slice(0, limit)
}

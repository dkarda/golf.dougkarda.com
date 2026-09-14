import golfLinks from '../data/golfLinks.json'
import type { GolfLink } from '../types'

export function loadGolfLinks(): GolfLink[] {
  return Array.isArray(golfLinks) ? (golfLinks as GolfLink[]) : []
}

export function snapshotRecommended(links: GolfLink[], limit = 3): GolfLink[] {
  return links.filter((l) => l.recommended).slice(0, limit)
}

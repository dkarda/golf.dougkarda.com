import golfRules from '../data/golfRules.json'
import type { GolfRule } from '../types'

export function loadGolfRules(): GolfRule[] {
  return Array.isArray(golfRules) ? (golfRules as GolfRule[]) : []
}

export function snapshotRecommended(links: GolfRule[], limit = 3): GolfRule[] {
  return links.filter((l) => l.recommended).slice(0, limit)
}

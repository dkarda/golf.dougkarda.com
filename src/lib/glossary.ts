import golfGlossary from '../data/golfGlossary.json'
import type { GolfGlossary } from '../types'

export function loadGolfGlossary(): GolfGlossary[] {
  return Array.isArray(golfGlossary) ? (golfGlossary as GolfGlossary[]) : []
}

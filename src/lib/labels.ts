import type { BagSectionCategory, ClubCategory } from '../types'

export const BAG_CATEGORY_ORDER: ClubCategory[] = [
  'driver',
  'wood',
  'hybrid',
  'iron',
  'wedge',
  'putter',
  'other',
]

export const BAG_CATEGORY_LABEL: Record<BagSectionCategory, string> = {
  driver: 'Driver',
  wood: 'Woods',
  hybrid: 'Hybrids',
  iron: 'Irons',
  wedge: 'Wedges',
  putter: 'Putter',
  other: 'Other',
  accessory: 'Accessories',
}

export const NOTE_SOURCE_LABEL = {
  lesson: 'Lesson',
  'self-study': 'Self-study',
  'on-course': 'On-course',
} as const

import type { BagSectionCategory, ClubCategory, NoteSource } from '../types'

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

export const NOTE_SOURCE_ORDER: NoteSource[] = [
  'lesson',
  'on-course',
  'self-study',
  'ob-pro-lesson',
]

export const NOTE_SOURCE_LABEL: Record<NoteSource, string> = {
  lesson: 'Lesson',
  'self-study': 'Self-study',
  'on-course': 'On-course',
  'ob-pro-lesson': 'Oyster Bay Pro Lesson',
}

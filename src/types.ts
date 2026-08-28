export type ClubCategory =
  | 'driver'
  | 'wood'
  | 'hybrid'
  | 'iron'
  | 'wedge'
  | 'putter'
  | 'other'

export type BagSectionCategory = ClubCategory | 'accessory'

export type ClubGrip = {
  original?: string | null
  current?: string | null
  previous?: string | null
  installed?: string | null
}

export type ClubPurchase = {
  location?: string | null
  date?: string | null
}

export type Club = {
  category: ClubCategory
  brand: string
  model: string
  year?: number
  loft?: number | string | null
  flex?: string | null
  shaft?: string | null
  shaftLength?: string | null
  grip?: ClubGrip
  adjustments?: Record<string, string | number | null>
  purchase?: ClubPurchase
  image?: string | null
  active?: boolean
  number?: number
  set?: string
  lofts?: Record<string, number | string>
  bounce?: number | string
  grind?: string
}

export type BagAccessory = {
  category: string
  brand: string
  model: string
  purchase?: ClubPurchase
  image?: string | null
  active?: boolean
}

export type GolfBag = {
  clubs: Club[]
  accessories?: BagAccessory[]
}

export type MyCourse = {
  id?: string | null
  name: string
  city?: string
  state?: string
  why?: string
  photos?: string[]
  scorecardImage?: string
  mapImage?: string
  featured?: boolean
}

export type LinkKind = 'youtube' | 'website'

export type GolfLink = {
  title: string
  url: string
  kind: LinkKind
  description?: string
  recommended?: boolean
}

export type NoteSource = 'lesson' | 'self-study' | 'on-course'

export type NoteMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  source: NoteSource
  body: string
}

export type CourseSearchHit = {
  id: string
  name?: string
  course_name?: string
  city?: string | null
  state?: string | null
  type?: string | null
  par?: number | null
  latitude?: number | null
  longitude?: number | null
}

export type CourseTee = {
  tee_key?: string
  tee_name?: string
  tee_color?: string
  gender?: string | null
  course_rating?: number | null
  slope?: number | null
  par?: number | null
  yardage?: number | null
}

export type CourseHole = {
  number: number
  par?: number | null
  handicap_index?: number | null
  yardages?: Record<string, number | null>
}

export type CourseDetail = {
  id: string
  course_name?: string
  club_name?: string
  city?: string | null
  state?: string | null
  lat?: number | null
  lng?: number | null
  type?: string | null
  par?: number | null
  holes?: number | null
  yardage?: number | null
  architect?: string | null
  year_built?: number | null
  description?: string | null
  phone?: string | null
  website?: string | null
  address?: string | null
  tees?: CourseTee[] | null
  holes_data?: CourseHole[] | null
}

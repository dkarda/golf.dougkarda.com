import { useEffect, useState } from 'react'
import type { MyCourse } from '../types'

export const GOLF_COURSES_URL =
  'https://assets.dougkarda.com/data/golfCourses.json'

/** Same directory as bag photos. Some scorecard/map filenames 404. */
export const COURSE_IMAGE_BASE = 'https://assets.dougkarda.com/images/golf/'

export type PublishedMyCourse = MyCourse & { id: string }

export type CoursesLoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; courses: PublishedMyCourse[] }

let inflight: Promise<PublishedMyCourse[]> | null = null

export function isPublishedCourseId(id: unknown): id is string {
  return typeof id === 'string' && id.trim() !== ''
}

export function isPublishedCourse(
  course: MyCourse,
): course is PublishedMyCourse {
  return isPublishedCourseId(course.id)
}

export function publishedCourses(list: MyCourse[]): PublishedMyCourse[] {
  return list.filter(isPublishedCourse)
}

export function courseTitle(course: MyCourse): string {
  return course.course
}

export function coursePlace(course: MyCourse): string {
  return [course.region, course.state].filter(Boolean).join(', ')
}

export function resolveCourseImage(
  image: string | null | undefined,
): string | undefined {
  if (!image || image.trim() === '') return undefined
  if (/^https?:\/\//i.test(image)) return image
  return `${COURSE_IMAGE_BASE}${image.replace(/^\//, '')}`
}

export function courseImageUrls(course: MyCourse): string[] {
  const seen = new Set<string>()
  const urls: string[] = []
  for (const raw of [
    course.mainImg,
    course.logoBallImg,
    course.scorecard,
    course.courseMap,
  ]) {
    const url = resolveCourseImage(raw)
    if (url && !seen.has(url)) {
      seen.add(url)
      urls.push(url)
    }
  }
  return urls
}

export async function fetchCuratedCourses(): Promise<PublishedMyCourse[]> {
  if (!inflight) {
    inflight = fetch(GOLF_COURSES_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Could not load courses (${res.status})`)
        const data: unknown = await res.json()
        const list = Array.isArray(data) ? (data as MyCourse[]) : []
        return publishedCourses(list)
      })
      .catch((err) => {
        inflight = null
        throw err
      })
  }
  return inflight
}

export function useCuratedCourses(): CoursesLoadState {
  const [state, setState] = useState<CoursesLoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchCuratedCourses()
      .then((courses) => {
        if (!cancelled) setState({ status: 'ready', courses })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              err instanceof Error ? err.message : 'Could not load courses',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

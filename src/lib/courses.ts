import type { MyCourse } from '../types'
import golfCourses from '../data/golfCourses.json'

export function loadGolfCourses(): MyCourse[] {
  return Array.isArray(golfCourses) ? (golfCourses as MyCourse[]) : []
}

/** Same directory as bag photos. Some scorecard/map filenames 404. */
export const COURSE_IMAGE_BASE = '/images/'

export type PublishedMyCourse = MyCourse & { course: string }

/** OpenGolfAPI id — optional on curated rows until it is filled in. */
export function isOpenGolfCourseId(id: unknown): id is string {
  return typeof id === 'string' && id.trim() !== ''
}

export function isPublishedCourseName(name: unknown): name is string {
  return typeof name === 'string' && name.trim() !== ''
}

export function isPublishedCourse(
  course: MyCourse,
): course is PublishedMyCourse {
  return isPublishedCourseName(course.course)
}

export function publishedCourses(list: MyCourse[]): PublishedMyCourse[] {
  return list.filter(isPublishedCourse)
}

export function courseTitle(course: MyCourse): string {
  return isPublishedCourseName(course.course) ? course.course : ''
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

/** Curated `logoBallImg` files live under `images`. */
export function resolveLogoBallImage(
  image: string | null | undefined,
): string | undefined {
  if (!image || image.trim() === '') return undefined
  if (/^https?:\/\//i.test(image)) return image
  const path = image.replace(/^\//, '')
  return resolveCourseImage(
    path.startsWith('logoballs/') ? path : `logoballs/${path}`,
  )
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


import type { MyCourse } from '../types'
import golfCourses from '../data/golfCourses.json'

export function loadGolfCourses(): MyCourse[] {
  return Array.isArray(golfCourses) ? (golfCourses as MyCourse[]) : []
}

/** Course main photos: public/images/courses/ → /images/courses/ */
export const COURSE_IMAGE_BASE = '/images/courses/'
export const LOGO_BALL_IMAGE_BASE = '/images/logoballs/'
export const SCORECARD_IMAGE_BASE = '/images/scorecards/'
export const COURSEMAP_IMAGE_BASE = '/images/coursemaps/'

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

export function uniqueCourseStates(list: MyCourse[]): string[] {
  const names = new Set<string>()
  for (const course of list) {
    const state = course.state?.trim()
    if (state) names.add(state)
  }
  return [...names].sort((a, b) => a.localeCompare(b))
}

export function courseTitle(course: MyCourse): string {
  return isPublishedCourseName(course.course) ? course.course : ''
}

export function coursePlace(course: MyCourse): string {
  return [course.region, course.state].filter(Boolean).join(', ')
}

function resolveUnderBase(
  image: string | null | undefined,
  base: string,
  folderPrefix?: string,
): string | undefined {
  if (!image || image.trim() === '') return undefined
  if (/^https?:\/\//i.test(image)) return image
  let path = image.replace(/^\//, '')
  if (folderPrefix) {
    const prefix = `${folderPrefix}/`
    if (path.startsWith(prefix)) path = path.slice(prefix.length)
  }
  return `${base}${path}`
}

export function resolveCourseImage(
  image: string | null | undefined,
): string | undefined {
  return resolveUnderBase(image, COURSE_IMAGE_BASE, 'courses')
}

export function resolveLogoBallImage(
  image: string | null | undefined,
): string | undefined {
  return resolveUnderBase(image, LOGO_BALL_IMAGE_BASE, 'logoballs')
}

export function resolveScorecardImage(
  image: string | null | undefined,
): string | undefined {
  return resolveUnderBase(image, SCORECARD_IMAGE_BASE, 'scorecards')
}

export function resolveCourseMapImage(
  image: string | null | undefined,
): string | undefined {
  return resolveUnderBase(image, COURSEMAP_IMAGE_BASE, 'coursemaps')
}

export function courseImageUrls(course: MyCourse): string[] {
  const seen = new Set<string>()
  const urls: string[] = []
  for (const url of [
    resolveCourseImage(course.mainImg),
    resolveCourseMapImage(course.courseMap),
  ]) {
    if (url && !seen.has(url)) {
      seen.add(url)
      urls.push(url)
    }
  }
  return urls
}


import myCourses from '../data/courses.json'
import type { MyCourse } from '../types'

export type PublishedMyCourse = MyCourse & { id: string }

export function isPublishedCourseId(id: unknown): id is string {
  return typeof id === 'string' && id.trim() !== ''
}

export function isPublishedCourse(
  course: MyCourse,
): course is PublishedMyCourse {
  return isPublishedCourseId(course.id)
}

export const curatedCourses: PublishedMyCourse[] = (
  myCourses as MyCourse[]
).filter(isPublishedCourse)

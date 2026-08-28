import type { CourseDetail, CourseSearchHit } from '../types'

const SEARCH_URL = 'https://api.opengolfapi.org/v1/courses/search'
const DETAIL_URL = 'https://api.opengolfapi.org/api/v1/courses'

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`OpenGolfAPI ${res.status}`)
  }
  return (await res.json()) as T
}

export function courseDisplayName(course: {
  name?: string | null
  course_name?: string | null
}): string {
  return course.course_name || course.name || 'Untitled course'
}

export async function searchCourses(q: string): Promise<CourseSearchHit[]> {
  const url = new URL(SEARCH_URL)
  url.searchParams.set('q', q.trim())
  url.searchParams.set('limit', '20')
  const data = await readJson<{ courses?: CourseSearchHit[] }>(
    await fetch(url.toString()),
  )
  return data.courses ?? []
}

export async function getCourse(id: string): Promise<CourseDetail> {
  const data = await readJson<CourseDetail>(
    await fetch(`${DETAIL_URL}/${encodeURIComponent(id)}`),
  )
  return data
}

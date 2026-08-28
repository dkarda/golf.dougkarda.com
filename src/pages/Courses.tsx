import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CardLink, PageHeader, SectionLabel } from '../components/ui'
import {
  coursePlace,
  courseTitle,
  useCuratedCourses,
} from '../lib/courses'
import { courseDisplayName, searchCourses } from '../lib/opengolf'
import type { CourseSearchHit } from '../types'

export default function Courses() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [fetched, setFetched] = useState<{
    q: string
    hits: CourseSearchHit[]
    error: boolean
  } | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 300)
    return () => window.clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (debounced.length < 2) return
    const q = debounced
    let cancelled = false
    searchCourses(q)
      .then((hits) => {
        if (!cancelled) setFetched({ q, hits, error: false })
      })
      .catch(() => {
        if (!cancelled) setFetched({ q, hits: [], error: true })
      })
    return () => {
      cancelled = true
    }
  }, [debounced])

  const searching = debounced.length >= 2
  const loading = searching && fetched?.q !== debounced
  const searchError = searching && fetched?.q === debounced && fetched.error
  const results =
    searching && fetched?.q === debounced && !fetched.error ? fetched.hits : []

  const myCoursesState = useCuratedCourses()
  const myCourses =
    myCoursesState.status === 'ready' ? myCoursesState.courses : []
  const myIds = useMemo(() => new Set(myCourses.map((c) => c.id)), [myCourses])

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Courses" eyebrow="My list + search">
        <p>
          Curated rounds I care about, plus live search of US courses via
          OpenGolfAPI. Open a course to see the scorecard and map.
        </p>
      </PageHeader>

      <SectionLabel>My Courses</SectionLabel>
      {myCoursesState.status === 'loading' && (
        <p className="mb-10 text-sm text-ink/70">Loading courses…</p>
      )}
      {myCoursesState.status === 'error' && (
        <p className="mb-10 text-sm text-ink/70">{myCoursesState.message}</p>
      )}
      {myCoursesState.status === 'ready' && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {myCourses.map((course) => (
            <CardLink
              key={course.id}
              to={`/courses/${course.id}`}
              title={courseTitle(course)}
              meta={coursePlace(course)}
            />
          ))}
        </div>
      )}

      <SectionLabel>Search any US course</SectionLabel>
      <label className="mb-4 block">
        <span className="mb-1 block text-sm text-ink/70">Course name</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pebble, Pinehurst, local muni…"
          className="w-full rounded-lg border border-fairway/20 bg-white px-3 py-2 outline-none focus:border-gold"
        />
      </label>

      {loading && <p className="text-sm text-ink/70">Searching…</p>}
      {searchError && (
        <p className="text-sm text-red-800">Could not reach OpenGolfAPI.</p>
      )}
      {searching && !loading && !searchError && results.length === 0 && (
        <p className="text-sm text-ink/70">No courses matched that search.</p>
      )}

      <ul className="divide-y divide-fairway/10 rounded-xl border border-fairway/10 bg-white/50">
        {results.map((hit) => {
          const name = courseDisplayName(hit)
          const place = [hit.city, hit.state].filter(Boolean).join(', ')
          return (
            <li key={hit.id}>
              <Link
                to={`/courses/${hit.id}`}
                className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 hover:bg-gold/10"
              >
                <span className="font-medium text-fairway">{name}</span>
                <span className="text-sm text-ink/60">
                  {place}
                  {hit.par != null ? ` · Par ${hit.par}` : ''}
                  {myIds.has(hit.id) ? ' · My Courses' : ''}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

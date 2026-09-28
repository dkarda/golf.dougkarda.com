import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CardLink,
  CardStatic,
  LogoBall,
  PageHeader,
  SectionLabel,
} from '../components/ui'
import {
  coursePlace,
  courseTitle,
  isOpenGolfCourseId,
  loadGolfCourses,
  publishedCourses,
  resolveLogoBallImage,
  uniqueCourseStates,
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

  const [stateFilter, setStateFilter] = useState('')
  const myCourses = publishedCourses(loadGolfCourses())
  const states = uniqueCourseStates(myCourses)
  const visibleCourses = stateFilter
    ? myCourses.filter((c) => c.state === stateFilter)
    : myCourses
  const myIds = useMemo(
    () =>
      new Set(
        myCourses.map((c) => c.id).filter(isOpenGolfCourseId),
      ),
    [myCourses],
  )

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Courses" eyebrow="My list + search">
        <p>
          A collection of courses I've played or have an interest in playing. If there's a golf ball image next to a course, that means I've played it. If the course exists in the OpenGolfAPI, you can click it to view course details, including the scorecard, map and more.
        </p>
      </PageHeader>

      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <SectionLabel>My Courses</SectionLabel>
        <label className="block text-sm">
          <span className="mr-2 text-ink/90 font-bold">State filter:</span>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-lg border border-fairway/20 bg-white px-3 py-2 outline-none focus:border-gold w-full"
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
      </div>
      {visibleCourses.length === 0 ? (
        <p className="mb-10 text-sm text-ink/70">No courses in this state.</p>
      ) : (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {visibleCourses.map((course, index) => {
          const logoSrc = resolveLogoBallImage(course.logoBallImg)
          const title = courseTitle(course)
          const meta = coursePlace(course)
          const leading = logoSrc ? <LogoBall src={logoSrc} /> : undefined
          if (!isOpenGolfCourseId(course.id)) {
            return (
              <CardStatic
                key={`unlinked-${index}`}
                title={title}
                meta={meta}
                leading={leading}
              />
            )
          }
          return (
            <CardLink
              key={course.id}
              to={`/courses/${course.id}`}
              title={title}
              meta={meta}
              leading={leading}
            />
          )
        })}
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

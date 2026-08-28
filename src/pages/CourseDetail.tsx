import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CopyIdButton from '../components/CopyIdButton'
import ScorecardTable from '../components/ScorecardTable'
import { PageHeader } from '../components/ui'
import myCourses from '../data/courses.json'
import { courseDisplayName, getCourse } from '../lib/opengolf'
import type { CourseDetail, MyCourse } from '../types'

const CourseMap = lazy(() => import('../components/CourseMap'))

const curated = myCourses as MyCourse[]

export default function CourseDetailPage() {
  const { id } = useParams()
  if (!id) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p>Missing course id.</p>
      </section>
    )
  }
  return <CourseDetailBody key={id} id={id} />
}

function CourseDetailBody({ id }: { id: string }) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getCourse(id)
      .then((data) => {
        if (!cancelled) setCourse(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this course.')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const mine = curated.find((c) => c.id === id)
  const photos = mine?.photos?.filter(Boolean) ?? []
  const extraImages = [mine?.scorecardImage, mine?.mapImage].filter(
    (src): src is string => Boolean(src),
  )

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-red-800">{error}</p>
        <Link to="/courses" className="mt-4 inline-block text-fairway underline">
          Back to courses
        </Link>
      </section>
    )
  }

  if (!course) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-ink/70">Loading course…</p>
      </section>
    )
  }

  const name = courseDisplayName(course)
  const place = [course.city, course.state].filter(Boolean).join(', ')
  const lat = course.lat
  const lng = course.lng
  const hasMap = typeof lat === 'number' && typeof lng === 'number'

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <p className="mb-4 text-sm">
        <Link to="/courses" className="text-fairway underline">
          ← Courses
        </Link>
      </p>
      <PageHeader title={name} eyebrow={mine ? 'My Courses' : 'OpenGolfAPI'}>
        <p>
          {place}
          {course.type ? ` · ${course.type}` : ''}
          {course.par != null ? ` · Par ${course.par}` : ''}
          {course.holes != null ? ` · ${course.holes} holes` : ''}
        </p>
      </PageHeader>

      {mine?.why && (
        <p className="mb-6 rounded-xl border border-gold/30 bg-gold/10 p-4">
          {mine.why}
        </p>
      )}

      <dl className="mb-8 grid gap-3 text-sm sm:grid-cols-2">
        {course.address && (
          <div>
            <dt className="text-ink/50">Address</dt>
            <dd>{course.address}</dd>
          </div>
        )}
        {course.phone && (
          <div>
            <dt className="text-ink/50">Phone</dt>
            <dd>{course.phone}</dd>
          </div>
        )}
        {course.website && (
          <div>
            <dt className="text-ink/50">Website</dt>
            <dd>
              <a
                href={course.website}
                className="text-fairway underline"
                rel="noreferrer"
                target="_blank"
              >
                {course.website.replace(/^https?:\/\//, '')}
              </a>
            </dd>
          </div>
        )}
        {course.architect && (
          <div>
            <dt className="text-ink/50">Architect</dt>
            <dd>{course.architect}</dd>
          </div>
        )}
        {course.year_built && (
          <div>
            <dt className="text-ink/50">Year built</dt>
            <dd>{course.year_built}</dd>
          </div>
        )}
      </dl>

      <div className="mb-8">
        <h2 className="font-display mb-3 text-2xl text-fairway">Location</h2>
        {hasMap ? (
          <Suspense
            fallback={
              <div className="h-72 rounded-lg bg-cream-dark/60" aria-hidden />
            }
          >
            <CourseMap lat={lat} lng={lng} label={name} />
          </Suspense>
        ) : (
          <p className="text-sm text-ink/70">No coordinates for a map pin.</p>
        )}
      </div>

      {(photos.length > 0 || extraImages.length > 0) && (
        <div className="mb-8">
          <h2 className="font-display mb-3 text-2xl text-fairway">Photos</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[...photos, ...extraImages].map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-56 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {course.description && (
        <p className="mb-8 text-ink/80">{course.description}</p>
      )}

      <h2 className="font-display mb-3 text-2xl text-fairway">Scorecard</h2>
      <ScorecardTable
        tees={course.tees ?? []}
        holes={course.holes_data ?? []}
      />

      <div className="mt-10 border-t border-fairway/10 pt-6">
        <h2 className="font-display mb-2 text-xl text-fairway">Add to My Courses</h2>
        <CopyIdButton id={course.id} />
      </div>
    </section>
  )
}

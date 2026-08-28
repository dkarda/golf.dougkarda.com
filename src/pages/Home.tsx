import { Link } from 'react-router-dom'
import { CardLink, SectionLabel } from '../components/ui'
import links from '../data/links.json'
import { formatLoft, snapshotClubs, useGolfBag } from '../lib/bag'
import { coursePlace, courseTitle, useCuratedCourses } from '../lib/courses'
import { BAG_CATEGORY_LABEL } from '../lib/labels'
import { loadNotes } from '../lib/notes'
import type { GolfLink } from '../types'

const allLinks = links as GolfLink[]

export default function Home() {
  const bagState = useGolfBag()
  const coursesState = useCuratedCourses()
  const featured =
    coursesState.status === 'ready' ? coursesState.courses.slice(0, 3) : []
  const latestNotes = loadNotes().slice(0, 3)
  const snapshot =
    bagState.status === 'ready' ? snapshotClubs(bagState.bag, 4) : []
  const recs = allLinks.filter((l) => l.recommended).slice(0, 3)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-12">
        <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
          golf.dougkarda.com
        </p>
        <h1 className="font-display mt-2 text-4xl text-fairway md:text-5xl">
          A public notebook for courses, clubs, and the next swing thought.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/80">
          Curated courses with live OpenGolfAPI scorecards, the bag as it sits
          today, lesson notes in markdown, and a short list of places worth
          watching. No login, no scoring app — just the published list.
        </p>
      </section>

      <section className="mb-12">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <SectionLabel>Featured courses</SectionLabel>
          <Link to="/courses" className="text-sm text-fairway underline">
            All courses
          </Link>
        </div>
        {coursesState.status === 'loading' && (
          <p className="text-sm text-ink/70">Loading courses…</p>
        )}
        {coursesState.status === 'error' && (
          <p className="text-sm text-ink/70">{coursesState.message}</p>
        )}
        {coursesState.status === 'ready' && (
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((course) => (
              <CardLink
                key={course.id}
                to={`/courses/${course.id}`}
                title={courseTitle(course)}
                meta={coursePlace(course)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <SectionLabel>Latest notes</SectionLabel>
          <Link to="/notes" className="text-sm text-fairway underline">
            All notes
          </Link>
        </div>
        <div className="grid gap-4">
          {latestNotes.map((note) => (
            <CardLink
              key={note.slug}
              to={`/notes/${note.slug}`}
              title={note.title}
              meta={note.date}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <SectionLabel>Bag snapshot</SectionLabel>
          <Link to="/bag" className="text-sm text-fairway underline">
            Full bag
          </Link>
        </div>
        {bagState.status === 'loading' && (
          <p className="text-sm text-ink/70">Loading the bag…</p>
        )}
        {bagState.status === 'error' && (
          <p className="text-sm text-ink/70">{bagState.message}</p>
        )}
        {bagState.status === 'ready' && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {snapshot.map((club, i) => {
              const loft = formatLoft(club.loft)
              return (
                <li
                  key={`${club.model}-${i}`}
                  className="rounded-xl border border-fairway/10 bg-white/50 px-4 py-3"
                >
                  <p className="text-xs text-gold uppercase">
                    {BAG_CATEGORY_LABEL[club.category]}
                    {loft ? ` · ${loft}` : ''}
                    {club.set ? ` · ${club.set}` : ''}
                  </p>
                  <p className="font-medium text-fairway">
                    {club.brand} {club.model}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <SectionLabel>Recommended links</SectionLabel>
          <Link to="/links" className="text-sm text-fairway underline">
            All links
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {recs.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-fairway/10 bg-white/50 p-4 hover:border-gold/40"
              >
                <p className="font-display text-lg text-fairway">{link.title}</p>
                <p className="mt-1 text-sm text-ink/70">{link.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

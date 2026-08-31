import { useMemo, useState } from 'react'
import { CardLink, PageHeader } from '../components/ui'
import { NOTE_SOURCE_LABEL } from '../lib/labels'
import { loadNotes } from '../lib/notes'

export default function Notes() {
  const notes = useMemo(() => loadNotes(), [])
  const tags = useMemo(() => {
    const set = new Set<string>()
    for (const note of notes) {
      for (const tag of note.tags) set.add(tag)
    }
    return [...set].sort()
  }, [notes])
  const [active, setActive] = useState<string | null>(null)

  const visible = active
    ? notes.filter((note) => note.tags.includes(active))
    : notes

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Notes" eyebrow="Lessons & study">
        <p>
          My personal swing thoughts, lessons, and study notes.
        </p>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`rounded-full px-3 py-1 text-sm ${
            active === null
              ? 'bg-fairway text-cream'
              : 'bg-white/70 text-fairway hover:bg-gold/20'
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            className={`rounded-full px-3 py-1 text-sm ${
              active === tag
                ? 'bg-fairway text-cream'
                : 'bg-white/70 text-fairway hover:bg-gold/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {visible.map((note) => (
          <CardLink
            key={note.slug}
            to={`/notes/${note.slug}`}
            title={note.title}
            meta={`${note.date} · ${NOTE_SOURCE_LABEL[note.source]}`}
          >
            {note.tags.length > 0 && (
              <p className="text-ink/50">{note.tags.join(' · ')}</p>
            )}
          </CardLink>
        ))}
      </div>
    </section>
  )
}

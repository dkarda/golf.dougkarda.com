import { useMemo } from 'react'
import { CardLink, PageHeader, SectionLabel } from '../components/ui'
import { loadNotes, noteMetaLine, notesBySource } from '../lib/notes'

export default function Notes() {
  const notes = useMemo(() => loadNotes(), [])
  const groups = useMemo(() => notesBySource(notes), [notes])

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Notes" eyebrow="Lessons & study">
        <p>Swing thoughts from lessons, practice, and the course.</p>
      </PageHeader>

      {groups.length === 0 && (
        <p className="text-ink/70">No notes published yet.</p>
      )}

      {groups.length > 0 && (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.source ?? 'unlabeled'}>
              <SectionLabel>{group.label}</SectionLabel>
              <div className="grid gap-4">
                {group.notes.map((note) => (
                  <CardLink
                    key={note.slug}
                    to={`/notes/${note.slug}`}
                    title={note.title}
                    meta={noteMetaLine(note, { includeSource: false })}
                  >
                    {note.tags.length > 0 && (
                      <p className="text-ink/50">{note.tags.join(' · ')}</p>
                    )}
                  </CardLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}

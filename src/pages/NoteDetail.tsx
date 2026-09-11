import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { NOTE_SOURCE_LABEL } from '../lib/labels'
import { getNote } from '../lib/notes'

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="font-display mt-8 mb-3 text-2xl text-fairway">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display mt-6 mb-2 text-xl text-fairway">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display mt-5 mb-2 text-lg text-fairway">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-ink/80">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-ink/80">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-ink/80">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-medium text-ink">{children}</strong>
  ),
}

export default function NoteDetail() {
  const { slug } = useParams()
  const note = slug ? getNote(slug) : undefined

  if (!note) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-ink/80">No note with that slug.</p>
        <Link to="/notes" className="mt-4 inline-block text-fairway underline">
          Back to notes
        </Link>
      </section>
    )
  }

  const eyebrow = note.source ? NOTE_SOURCE_LABEL[note.source] : undefined

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <p className="mb-4 text-sm">
        <Link to="/notes" className="text-fairway underline">
          ← Notes
        </Link>
      </p>
      <PageHeader title={note.title} eyebrow={eyebrow}>
        {note.date && <p>{note.date}</p>}
        {note.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white/70 px-3 py-1 text-sm text-fairway"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </PageHeader>
      <div className="max-w-2xl">
        <ReactMarkdown components={markdownComponents}>{note.body}</ReactMarkdown>
      </div>
    </article>
  )
}

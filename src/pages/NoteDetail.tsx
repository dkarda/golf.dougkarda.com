import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { NOTE_SOURCE_LABEL } from '../lib/labels'
import { getNote } from '../lib/notes'

export default function NoteDetail() {
  const { slug } = useParams()
  const note = slug ? getNote(slug) : undefined

  if (!note) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p>No note with that slug.</p>
        <Link to="/notes" className="mt-4 inline-block text-fairway underline">
          Back to notes
        </Link>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <p className="mb-4 text-sm">
        <Link to="/notes" className="text-fairway underline">
          ← Notes
        </Link>
      </p>
      <PageHeader title={note.title} eyebrow={NOTE_SOURCE_LABEL[note.source]}>
        <p>
          {note.date}
          {note.tags.length > 0 ? ` · ${note.tags.join(', ')}` : ''}
        </p>
      </PageHeader>
      <div className="note-body max-w-2xl">
        <ReactMarkdown>{note.body}</ReactMarkdown>
      </div>
    </article>
  )
}

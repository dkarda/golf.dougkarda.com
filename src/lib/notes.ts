import { NOTE_SOURCE_LABEL, NOTE_SOURCE_ORDER } from './labels'
import type { NoteMeta, NoteSource } from '../types'

const files = import.meta.glob('../data/notes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseList(value: string): string[] {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  if (!inner) return []
  return inner
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

function isSource(value: string): value is NoteSource {
  return value === 'lesson' || value === 'self-study' || value === 'on-course'
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { meta: {}, body: raw.trim() }
  }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) continue
    meta[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return { meta, body: match[2].trim() }
}

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.md$/, '')
}

export function loadNotes(): NoteMeta[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { meta, body } = parseFrontmatter(raw)
      const source = isSource(meta.source) ? meta.source : undefined
      const date = meta.date || undefined
      return {
        slug: slugFromPath(path),
        title: meta.title || slugFromPath(path),
        date,
        tags: parseList(meta.tags ?? ''),
        source,
        body,
      } satisfies NoteMeta
    })
    .sort((a, b) => {
      if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date)
      if (a.date && !b.date) return -1
      if (!a.date && b.date) return 1
      return a.title.localeCompare(b.title)
    })
}

export function getNote(slug: string): NoteMeta | undefined {
  return loadNotes().find((note) => note.slug === slug)
}

export function noteMetaLine(note: NoteMeta, opts?: { includeSource?: boolean }): string | undefined {
  const parts: string[] = []
  if (note.date) parts.push(note.date)
  if (opts?.includeSource !== false && note.source) {
    parts.push(NOTE_SOURCE_LABEL[note.source])
  }
  return parts.length ? parts.join(' · ') : undefined
}

export function notesBySource(notes: NoteMeta[]) {
  const known = NOTE_SOURCE_ORDER.map((source) => ({
    source,
    label: NOTE_SOURCE_LABEL[source],
    notes: notes.filter((note) => note.source === source),
  })).filter((group) => group.notes.length > 0)

  const unlabeled = notes.filter((note) => !note.source)
  if (unlabeled.length === 0) return known
  return [...known, { source: undefined, label: 'Notes', notes: unlabeled }]
}

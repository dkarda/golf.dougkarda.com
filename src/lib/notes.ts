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
    const idx = line.indexOf(':')
    if (idx === -1) continue
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
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
      const source = isSource(meta.source) ? meta.source : 'self-study'
      return {
        slug: slugFromPath(path),
        title: meta.title || slugFromPath(path),
        date: meta.date || '1970-01-01',
        tags: parseList(meta.tags ?? ''),
        source,
        body,
      } satisfies NoteMeta
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNote(slug: string): NoteMeta | undefined {
  return loadNotes().find((note) => note.slug === slug)
}

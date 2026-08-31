import { PageHeader, SectionLabel } from '../components/ui'
import { useGolfLinks } from '../lib/links'
import type { GolfLink, LinkKind } from '../types'

const KIND_ORDER: { kind: LinkKind; label: string }[] = [
  { kind: 'youtube', label: 'YouTube' },
  { kind: 'website', label: 'Websites' },
]

function groupByKind(links: GolfLink[]) {
  return KIND_ORDER.map(({ kind, label }) => ({
    kind,
    label,
    items: links.filter((link) => link.kind === kind),
  })).filter((group) => group.items.length > 0)
}

export default function Links() {
  const state = useGolfLinks()
  const groups = state.status === 'ready' ? groupByKind(state.links) : []

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Links" eyebrow="Watch & read">
        <p>Recommended channels and sites.</p>
      </PageHeader>

      {state.status === 'loading' && (
        <p className="text-ink/70">Loading links…</p>
      )}
      {state.status === 'error' && (
        <p className="text-ink/70">{state.message}</p>
      )}
      {state.status === 'ready' && groups.length === 0 && (
        <p className="text-ink/70">No links published yet.</p>
      )}
      {state.status === 'ready' && groups.length > 0 && (
        <div className="space-y-10">
          {groups.map(({ kind, label, items }) => (
            <section key={kind}>
              <SectionLabel>{label}</SectionLabel>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-fairway/10 bg-white/50 p-4 hover:border-gold/40"
                    >
                      <h3 className="font-display text-xl text-fairway">
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className="mt-1 text-sm text-ink/70">
                          {link.description}
                        </p>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}

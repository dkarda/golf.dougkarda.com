import { PageHeader, SectionLabel } from '../components/ui'
import links from '../data/links.json'
import type { GolfLink, LinkKind } from '../types'

const allLinks = links as GolfLink[]

const KIND_ORDER: { kind: LinkKind; label: string }[] = [
  { kind: 'youtube', label: 'YouTube' },
  { kind: 'website', label: 'Websites' },
]

export default function Links() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Links" eyebrow="Watch & read">
        <p>
          Recommended channels and sites from <code>src/data/links.json</code>.
          Swap them whenever the list changes.
        </p>
      </PageHeader>

      {KIND_ORDER.map(({ kind, label }) => {
        const items = allLinks.filter((link) => link.kind === kind)
        if (items.length === 0) return null
        return (
          <section key={kind} className="mb-10">
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
                    <h2 className="font-display text-xl text-fairway">
                      {link.title}
                    </h2>
                    {link.description && (
                      <p className="mt-1 text-sm text-ink/70">{link.description}</p>
                    )}
                    <p className="mt-2 text-xs text-gold">Open ↗</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </section>
  )
}

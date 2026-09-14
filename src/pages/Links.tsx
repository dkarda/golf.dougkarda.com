import globeIcon from '../assets/globe.svg'
import youtubeIcon from '../assets/youtube.svg'
import { PageHeader, SectionLabel } from '../components/ui'
import { loadGolfLinks } from '../lib/links'
import type { GolfLink, LinkKind } from '../types'

const KIND_ORDER: { kind: LinkKind; label: string; icon: string }[] = [
  { kind: 'youtube', label: 'YouTube', icon: youtubeIcon },
  { kind: 'website', label: 'Websites', icon: globeIcon },
]

function groupByKind(links: GolfLink[]) {
  return KIND_ORDER.map(({ kind, label, icon }) => ({
    kind,
    label,
    icon,
    items: links.filter((link) => link.kind === kind),
  })).filter((group) => group.items.length > 0)
}

function SectionIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 shrink-0 bg-current"
      style={{
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  )
}

export default function Links() {
  const groups = groupByKind(loadGolfLinks())

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Links" eyebrow="Watch & read">
        <p>Recommended channels and sites.</p>
      </PageHeader>

      {groups.length === 0 && (
        <p className="text-ink/70">No links published yet.</p>
      )}
      {groups.length > 0 && (
        <div className="space-y-10">
          {groups.map(({ kind, label, icon, items }) => (
            <section key={kind}>
              <SectionLabel>
                <span className="inline-flex items-center gap-2">
                  <SectionIcon src={icon} />
                  {label}
                </span>
              </SectionLabel>
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

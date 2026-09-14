import { PageHeader } from '../components/ui'
import { loadGolfGlossary } from '../lib/glossary'

export default function Glossary() {

  const entries = loadGolfGlossary()

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Glossary" eyebrow="Learn the game">
        <p>Understand the language of golf.</p>
      </PageHeader>

      {entries.length > 0 && (
        <div className="space-y-10">
            <dl className="grid gap-3 sm:grid-cols-1">
              {entries.map((item) => (
                <div key={item.term}>
                <dt className="font-display text-xl text-fairway">
                      {item.term}
                </dt>
                <dd className="mt-1 text-sm text-ink/70">
                      {item.definition}
                </dd>
                </div>
              ))}
            </dl>
        </div>
      )}
    </section>
  )
}

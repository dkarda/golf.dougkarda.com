import { useState } from 'react'
import {
  accessoriesCurrentlyInBag,
  clubsCurrentlyInBag,
  formatLoft,
  humanizeKey,
  resolveBagImage,
  useGolfBag,
} from '../lib/bag'
import { BAG_CATEGORY_LABEL, BAG_CATEGORY_ORDER } from '../lib/labels'
import { PageHeader } from '../components/ui'
import type { BagAccessory, Club, ClubCategory, ClubGrip, ClubPurchase } from '../types'

function groupClubs(list: Club[]) {
  const groups = new Map<ClubCategory, Club[]>()
  for (const category of BAG_CATEGORY_ORDER) {
    groups.set(category, [])
  }
  for (const club of list) {
    const bucket = groups.get(club.category) ?? groups.get('other')!
    bucket.push(club)
  }
  return BAG_CATEGORY_ORDER.filter((cat) => (groups.get(cat) ?? []).length > 0).map(
    (category) => ({
      category,
      clubs: groups.get(category) ?? [],
    }),
  )
}

function BagImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  const resolved = resolveBagImage(src)
  if (!resolved || failed) return null
  return (
    <img
      src={resolved}
      alt={alt}
      onError={() => setFailed(true)}
      className="mt-3 h-36 w-full rounded object-contain bg-fairway/5"
    />
  )
}

function Spec({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === '') return null
  return (
    <>
      <dt className="text-ink/50">{label}</dt>
      <dd>{value}</dd>
    </>
  )
}

function GripBlock({ grip }: { grip?: ClubGrip }) {
  if (!grip) return null
  const rows: [string, string | null | undefined][] = [
    ['Current', grip.current],
    ['Original', grip.original],
    ['Previous', grip.previous],
    ['Installed', grip.installed],
  ]
  const shown = rows.filter(([, v]) => v)
  if (shown.length === 0) return null
  return (
    <div className="mt-3 border-t border-fairway/10 pt-2">
      <p className="text-xs tracking-wide text-gold uppercase">Grip</p>
      <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-ink/75">
        {shown.map(([label, value]) => (
          <Spec key={label} label={label} value={value} />
        ))}
      </dl>
    </div>
  )
}

function PurchaseBlock({ purchase }: { purchase?: ClubPurchase }) {
  if (!purchase) return null
  const parts = [purchase.location, purchase.date].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <p className="mt-2 text-sm text-ink/70">
      <span className="text-ink/50">Purchased </span>
      {parts.join(' · ')}
    </p>
  )
}

function LoftMap({ lofts }: { lofts: Record<string, number | string> }) {
  const entries = Object.entries(lofts)
  if (entries.length === 0) return null
  return (
    <div className="mt-3">
      <p className="text-xs tracking-wide text-gold uppercase">Set lofts</p>
      <ul className="mt-1 grid grid-cols-4 gap-1 text-sm sm:grid-cols-8">
        {entries.map(([club, loft]) => (
          <li
            key={club}
            className="rounded bg-fairway/5 px-1.5 py-1 text-center"
          >
            <span className="block text-[10px] text-ink/50 uppercase">{club}</span>
            <span className="text-fairway">{formatLoft(loft)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ClubCard({ club }: { club: Club }) {
  const title = [club.brand, club.model].filter(Boolean).join(' ')
  const loft = formatLoft(club.loft)
  const eyebrow = [club.number != null ? `#${club.number}` : null, loft, club.set]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="rounded-xl border border-fairway/10 bg-white/50 p-4">
      <p className="text-xs tracking-wide text-gold uppercase">
        {eyebrow || club.category}
      </p>
      <h3 className="font-display text-lg text-fairway">
        {title}
        {club.year != null ? (
          <span className="ml-1 text-sm font-sans font-normal text-ink/50">
            {club.year}
          </span>
        ) : null}
      </h3>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-ink/75">
        <Spec label="Loft" value={loft} />
        <Spec label="Shaft" value={club.shaft} />
        <Spec label="Flex" value={club.flex} />
        <Spec label="Length" value={club.shaftLength} />
        <Spec label="Bounce" value={club.bounce} />
        <Spec label="Grind" value={club.grind} />
      </dl>
      {club.lofts && <LoftMap lofts={club.lofts} />}
      {club.adjustments &&
        Object.entries(club.adjustments).some(([, v]) => v != null && v !== '') && (
          <div className="mt-3 border-t border-fairway/10 pt-2">
            <p className="text-xs tracking-wide text-gold uppercase">Adjustments</p>
            <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-ink/75">
              {Object.entries(club.adjustments).map(([key, value]) => (
                <Spec key={key} label={humanizeKey(key)} value={value} />
              ))}
            </dl>
          </div>
        )}
      <GripBlock grip={club.grip} />
      <PurchaseBlock purchase={club.purchase} />
      <BagImage src={club.image ?? undefined} alt={title} />
    </li>
  )
}

function AccessoryCard({ item }: { item: BagAccessory }) {
  const title = [item.brand, item.model].filter(Boolean).join(' ')
  return (
    <li className="rounded-xl border border-fairway/10 bg-white/50 p-4">
      <p className="text-xs tracking-wide text-gold uppercase">{item.category}</p>
      <h3 className="font-display text-lg text-fairway">{title}</h3>
      <PurchaseBlock purchase={item.purchase} />
      <BagImage src={item.image ?? undefined} alt={title} />
    </li>
  )
}

export default function Bag() {
  const state = useGolfBag()
  const inBagClubs =
    state.status === 'ready' ? clubsCurrentlyInBag(state.bag.clubs) : []
  const inBagAccessories =
    state.status === 'ready'
      ? accessoriesCurrentlyInBag(state.bag.accessories ?? [])
      : []

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="The bag" eyebrow="Live list">
        <p>
          Clubs and accessories currently in the bag, loaded from the published
          bag file.
        </p>
      </PageHeader>

      {state.status === 'loading' && (
        <p className="text-ink/70">Loading the bag…</p>
      )}
      {state.status === 'error' && (
        <p className="text-ink/70">{state.message}</p>
      )}
      {state.status === 'ready' && (
        <div className="space-y-10">
          {groupClubs(inBagClubs).map(({ category, clubs }) => (
            <section key={category}>
              <h2 className="font-display mb-3 text-2xl text-fairway">
                {BAG_CATEGORY_LABEL[category]}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {clubs.map((club, i) => (
                  <ClubCard
                    key={`${club.brand}-${club.model}-${i}`}
                    club={club}
                  />
                ))}
              </ul>
            </section>
          ))}
          {inBagAccessories.length > 0 && (
            <section>
              <h2 className="font-display mb-3 text-2xl text-fairway">
                {BAG_CATEGORY_LABEL.accessory}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {inBagAccessories.map((item, i) => (
                  <AccessoryCard
                    key={`${item.brand}-${item.model}-${i}`}
                    item={item}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </section>
  )
}

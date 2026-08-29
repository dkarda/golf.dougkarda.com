import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  eyebrow?: string
  children?: ReactNode
}

export function PageHeader({ title, eyebrow, children }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-2">
      {eyebrow && (
        <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl text-fairway md:text-4xl">{title}</h1>
      {children && <div className="max-w-2xl text-ink/80">{children}</div>}
    </header>
  )
}

const cardShell =
  'flex items-center gap-4 rounded-xl border border-fairway/10 bg-white/50 p-4 shadow-sm'

type CardContentProps = {
  title: string
  meta?: string
  leading?: ReactNode
  children?: ReactNode
}

function CardContent({ title, meta, leading, children }: CardContentProps) {
  return (
    <>
      {leading}
      <div className="min-w-0">
        <h2 className="font-display text-xl text-fairway">{title}</h2>
        {meta && <p className="mt-1 text-sm text-ink/60">{meta}</p>}
        {children && <div className="mt-2 text-sm text-ink/80">{children}</div>}
      </div>
    </>
  )
}

export function CardLink({
  to,
  title,
  meta,
  leading,
  children,
}: CardContentProps & { to: string }) {
  return (
    <Link
      to={to}
      className={`${cardShell} transition hover:border-gold/40 hover:shadow`}
    >
      <CardContent title={title} meta={meta} leading={leading}>
        {children}
      </CardContent>
    </Link>
  )
}

/** Same layout as CardLink, without navigation or hover affordance. */
export function CardStatic({
  title,
  meta,
  leading,
  children,
}: CardContentProps) {
  return (
    <div className={cardShell}>
      <CardContent title={title} meta={meta} leading={leading}>
        {children}
      </CardContent>
    </div>
  )
}

export function LogoBall({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-fairway/15"
    />
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mb-3 text-2xl text-fairway">{children}</h2>
  )
}

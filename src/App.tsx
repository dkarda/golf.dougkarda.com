import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/courses', label: 'Courses', end: false },
  { to: '/bag', label: 'Bag', end: false },
  { to: '/notes', label: 'Notes', end: false },
  { to: '/links', label: 'Links', end: false },
] as const

function navClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-1.5 text-sm font-medium tracking-wide transition-colors',
    isActive
      ? 'bg-gold/15 text-gold'
      : 'text-cream/90 hover:bg-cream/10 hover:text-cream',
  ].join(' ')
}

export default function App() {
  return (
    <div className="flex min-h-svh flex-col bg-cream text-ink">
      <header className="sticky top-0 z-50 border-b border-gold/30 bg-fairway-deep/95 text-cream backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink
            to="/"
            className="font-display text-lg tracking-wide text-cream"
          >
            golf.dougkarda.com
          </NavLink>
          <nav aria-label="Main" className="flex flex-wrap items-center gap-1">
            {nav.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={navClassName}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gold/20 bg-fairway text-cream/80">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm">
          <p>
            Course data via{' '}
            <a
              className="underline hover:text-gold"
              href="https://opengolfapi.org/"
              rel="noreferrer"
              target="_blank"
            >
              OpenGolfAPI
            </a>
            . Map tiles ©{' '}
            <a
              className="underline hover:text-gold"
              href="https://www.openstreetmap.org/copyright"
              rel="noreferrer"
              target="_blank"
            >
              OpenStreetMap
            </a>{' '}
            contributors (ODbL).
          </p>
        </div>
      </footer>
    </div>
  )
}

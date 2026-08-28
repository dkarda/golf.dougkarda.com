import type { CourseHole, CourseTee } from '../types'

function uniqueTeeColors(tees: CourseTee[]): string[] {
  const seen = new Set<string>()
  const colors: string[] = []
  for (const tee of tees) {
    const key = (tee.tee_color || tee.tee_name || '').toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    colors.push(key)
  }
  return colors
}

function yardageFor(hole: CourseHole, color: string): string {
  const yards = hole.yardages?.[color] ?? hole.yardages?.[color.toLowerCase()]
  return yards == null ? '—' : String(yards)
}

function holeTotals(holes: CourseHole[], color: string) {
  return holes.reduce(
    (acc, hole) => {
      const yards = hole.yardages?.[color]
      return {
        par: acc.par + (hole.par ?? 0),
        yards: acc.yards + (typeof yards === 'number' ? yards : 0),
      }
    },
    { par: 0, yards: 0 },
  )
}

type ScorecardTableProps = {
  tees: CourseTee[]
  holes: CourseHole[]
}

export default function ScorecardTable({ tees, holes }: ScorecardTableProps) {
  const colors = uniqueTeeColors(tees)
  const front = holes.filter((h) => h.number <= 9)
  const back = holes.filter((h) => h.number > 9)

  if (!holes.length && !tees.length) {
    return <p className="text-sm text-ink/70">No scorecard data for this course.</p>
  }

  return (
    <div className="space-y-6">
      {tees.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-fairway/15">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-fairway text-cream">
              <tr>
                <th className="px-3 py-2 font-medium">Tee</th>
                <th className="px-3 py-2 font-medium">Gender</th>
                <th className="px-3 py-2 font-medium">Rating</th>
                <th className="px-3 py-2 font-medium">Slope</th>
                <th className="px-3 py-2 font-medium">Yardage</th>
                <th className="px-3 py-2 font-medium">Par</th>
              </tr>
            </thead>
            <tbody className="bg-white/60">
              {tees.map((tee, i) => (
                <tr key={tee.tee_key ?? `${tee.tee_name}-${i}`} className="border-t border-fairway/10">
                  <td className="px-3 py-2 capitalize">{tee.tee_name ?? tee.tee_color ?? '—'}</td>
                  <td className="px-3 py-2">{tee.gender ?? '—'}</td>
                  <td className="px-3 py-2">{tee.course_rating ?? '—'}</td>
                  <td className="px-3 py-2">{tee.slope ?? '—'}</td>
                  <td className="px-3 py-2">{tee.yardage ?? '—'}</td>
                  <td className="px-3 py-2">{tee.par ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {holes.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-fairway/15">
          <table className="min-w-max text-center text-sm">
            <thead className="bg-fairway text-cream">
              <tr>
                <th className="sticky left-0 bg-fairway px-3 py-2 text-left font-medium">Hole</th>
                {holes.map((hole) => (
                  <th key={hole.number} className="px-2 py-2 font-medium">
                    {hole.number}
                  </th>
                ))}
                {front.length === 9 && <th className="px-2 py-2 font-medium">Out</th>}
                {back.length > 0 && <th className="px-2 py-2 font-medium">In</th>}
                <th className="px-2 py-2 font-medium">Tot</th>
              </tr>
            </thead>
            <tbody className="bg-white/60">
              <tr className="border-t border-fairway/10">
                <th className="sticky left-0 bg-cream-dark/80 px-3 py-2 text-left font-medium">Par</th>
                {holes.map((hole) => (
                  <td key={hole.number} className="px-2 py-2">
                    {hole.par ?? '—'}
                  </td>
                ))}
                {front.length === 9 && (
                  <td className="px-2 py-2 font-medium">
                    {front.reduce((s, h) => s + (h.par ?? 0), 0)}
                  </td>
                )}
                {back.length > 0 && (
                  <td className="px-2 py-2 font-medium">
                    {back.reduce((s, h) => s + (h.par ?? 0), 0)}
                  </td>
                )}
                <td className="px-2 py-2 font-medium">
                  {holes.reduce((s, h) => s + (h.par ?? 0), 0)}
                </td>
              </tr>
              <tr className="border-t border-fairway/10">
                <th className="sticky left-0 bg-cream-dark/80 px-3 py-2 text-left font-medium">HCP</th>
                {holes.map((hole) => (
                  <td key={hole.number} className="px-2 py-2">
                    {hole.handicap_index ?? '—'}
                  </td>
                ))}
                {front.length === 9 && <td className="px-2 py-2">—</td>}
                {back.length > 0 && <td className="px-2 py-2">—</td>}
                <td className="px-2 py-2">—</td>
              </tr>
              {colors.map((color) => {
                const total = holeTotals(holes, color)
                const out = holeTotals(front, color)
                const inn = holeTotals(back, color)
                return (
                  <tr key={color} className="border-t border-fairway/10">
                    <th className="sticky left-0 bg-cream-dark/80 px-3 py-2 text-left font-medium capitalize">
                      {color}
                    </th>
                    {holes.map((hole) => (
                      <td key={hole.number} className="px-2 py-2">
                        {yardageFor(hole, color)}
                      </td>
                    ))}
                    {front.length === 9 && (
                      <td className="px-2 py-2 font-medium">{out.yards || '—'}</td>
                    )}
                    {back.length > 0 && (
                      <td className="px-2 py-2 font-medium">{inn.yards || '—'}</td>
                    )}
                    <td className="px-2 py-2 font-medium">{total.yards || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

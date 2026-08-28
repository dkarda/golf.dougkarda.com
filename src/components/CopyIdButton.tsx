import { useState } from 'react'

type CopyIdButtonProps = {
  id: string
}

export default function CopyIdButton({ id }: CopyIdButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <code className="rounded bg-fairway-deep/10 px-2 py-1 break-all">{id}</code>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded-md border border-gold/50 bg-gold/15 px-2 py-1 text-fairway hover:bg-gold/25"
      >
        {copied ? 'Copied' : 'Copy id'}
      </button>
      <span className="text-ink/60">Paste into src/data/courses.json to add My Courses.</span>
    </div>
  )
}

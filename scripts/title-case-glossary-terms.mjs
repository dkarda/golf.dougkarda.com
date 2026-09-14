import fs from 'node:fs'

const path = new URL('../src/data/golfGlossary.json', import.meta.url)
const raw = fs.readFileSync(path, 'utf8')
const orig = JSON.parse(raw)

function isAcronymCore(core) {
  if (!core) return false
  if (/^\d/.test(core)) return true
  const letters = core.replace(/[^A-Za-z]/g, '')
  if (letters.length >= 2 && !/[a-z]/.test(core) && /[A-Z]/.test(core)) return true
  if (/^[A-Z](\.[A-Z])+\.?$/.test(core)) return true
  return false
}

function titleCasePart(part) {
  if (!part) return part
  const m = part.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/)
  if (!m) return part
  const [, lead, core, trail] = m
  if (!core) return part
  if (isAcronymCore(core)) return lead + core + trail
  return lead + core.charAt(0).toUpperCase() + core.slice(1) + trail
}

function titleCaseTerm(s) {
  return s
    .split(/(\s+)/)
    .map((tok) => {
      if (/^\s+$/.test(tok)) return tok
      return tok.split('-').map(titleCasePart).join('-')
    })
    .join('')
}

const examples = []
let termUpdates = 0
let relatedUpdates = 0
const next = orig.map((item) => {
  const term = titleCaseTerm(item.term)
  if (term !== item.term) {
    if (examples.length < 15) examples.push({ before: item.term, after: term })
    termUpdates++
  }
  let relatedTerms = item.relatedTerms
  if (Array.isArray(relatedTerms)) {
    relatedTerms = relatedTerms.map((t) => {
      const a = titleCaseTerm(t)
      if (a !== t) relatedUpdates++
      return a
    })
  }
  return { ...item, term, relatedTerms }
})

let out = raw
for (let i = 0; i < orig.length; i++) {
  const oldT = orig[i].term
  const newT = next[i].term
  if (oldT === newT) continue
  const needle = `"term": ${JSON.stringify(oldT)}`
  const repl = `"term": ${JSON.stringify(newT)}`
  const idx = out.indexOf(needle)
  if (idx < 0) {
    console.error('FAILED to find term:', oldT)
    process.exit(1)
  }
  out = out.slice(0, idx) + repl + out.slice(idx + needle.length)
}

fs.writeFileSync(path, out)
const verify = JSON.parse(fs.readFileSync(path, 'utf8'))
if (verify.length !== orig.length) throw new Error('length mismatch')
for (let i = 0; i < verify.length; i++) {
  if (verify[i].term !== next[i].term) throw new Error(`term mismatch ${i}`)
  if (verify[i].definition !== orig[i].definition) throw new Error(`def changed ${i}`)
}

console.log(JSON.stringify({ termUpdates, relatedUpdates, total: orig.length, examples }, null, 2))

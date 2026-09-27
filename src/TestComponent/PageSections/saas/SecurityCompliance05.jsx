// CipherScrambleSecurityCompliance

// SecurityCompliance05 · SaaS Platforms › Security & Compliance

// Description:
// A cinematic encryption demo for the fictional data-privacy platform Cipherly. Next to the
// heading "Readable to you. Noise to everyone else." five sensitive records (a patient
// name, a card number, a salary, an API key, a home address) scramble character by
// character into ciphertext, and a "Decrypt with your key" button plays it back the other
// way. Four key facts sit alongside (256-bit AES-GCM, 90-day key rotation, 0 staff with
// access, FIPS 140-3 Level 3 HSMs). Use it on a security, privacy or developer landing page.

// Design:
// - Black #050505 background, white text, magenta #e11d74 for the scramble wave, labels,
//   progress bar and focus rings; zinc greys for secondary copy
// - font-mono throughout the demo; heading text-4xl → lg:text-6xl bold sans with a magenta
//   underline bar; facts use large mono numbers
// - The demo is a rounded-3xl terminal card with a 1px white/10 border: each record row has a
//   type chip, the scrambling text (break-all so it never overflows) and a lock state icon
// - Characters in the scramble zone render in magenta, resolved ciphertext in zinc-500 and
//   plaintext in white; a thin magenta bar tracks progress
// - Responsive: one column below lg (demo first, facts below in 2 columns), two columns on lg
//   (demo 1.25fr, facts 1fr in a single column)

// What it does:
// - mode ("plain" or "cipher") sets the target text; frame advances every 35 ms in a
//   useEffect interval until every character has resolved, then the interval is cleared
// - The first encryption starts when the demo scrolls into view (useInView, once); the
//   button toggles between "Decrypt with your key" and "Encrypt again"
// - The server render shows the plaintext; with reduced motion the text jumps straight to the
//   final state, and an aria-live line announces "Records encrypted" / "Records decrypted"
// - Scramble glyphs are derived from the frame and character index, so no randomness; the
//   whitepaper link points to #cipherly-whitepaper

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CipherScrambleSecurityCompliance from '@/TestComponent/PageSections/saas/SecurityCompliance05';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <CipherScrambleSecurityCompliance />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiLockClosed, HiLockOpen } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const GLYPHS = '#%&@$*+=?/\\<>[]{}01xX§¤¶'
const ZONE = 9
const ROW_DELAY = 6

function cipherOf(text, seed) {
    let out = ''
    let h = seed * 2654435761
    for (let i = 0; i < text.length; i++) {
        h = (h ^ (text.charCodeAt(i) + i * 31)) >>> 0
        h = Math.imul(h, 16777619) >>> 0
        out += B64[h % 64]
    }
    return out.slice(0, -2) + '=='
}

const records = [
    { id: 'phi', type: 'PHI', plain: 'patient=Amara Okafor; dob=1988-03-14' },
    { id: 'pci', type: 'PCI', plain: 'card=4929 1022 7781 0443; exp=09/29' },
    { id: 'hr', type: 'HR', plain: 'salary=148,500 USD; band=L6; bonus=12%' },
    { id: 'key', type: 'SECRET', plain: 'api_key=cph_live_7Qx2mNv9LsT4' },
    { id: 'pii', type: 'PII', plain: 'addr=41 Harbour St, Leith EH6 6PL' },
].map((record, i) => ({ ...record, cipher: cipherOf(record.plain, i + 7) }))

const longest = Math.max(...records.map((r) => r.plain.length))
const LAST_FRAME = (records.length - 1) * ROW_DELAY + longest + ZONE

const facts = [
    { value: '256-bit', label: 'AES-GCM on every field, with a fresh key per record' },
    { value: '90 days', label: 'Automatic key rotation, or on demand from the console' },
    { value: '0', label: 'Cipherly staff who can read your plaintext' },
    { value: 'FIPS 140-3', label: 'Level 3 HSMs hold the master keys in 4 regions' },
]

function renderRow(record, rowIndex, frame, from, to) {
    const source = record[from]
    const target = record[to]
    const length = Math.max(source.length, target.length)
    const parts = []
    for (let i = 0; i < length; i++) {
        const resolveAt = rowIndex * ROW_DELAY + i + ZONE
        if (frame >= resolveAt) parts.push({ kind: 'done', ch: target[i] ?? '' })
        else if (frame >= resolveAt - ZONE) parts.push({ kind: 'noise', ch: GLYPHS[(i * 7 + frame * 13 + rowIndex * 3) % GLYPHS.length] })
        else parts.push({ kind: 'src', ch: source[i] ?? '' })
    }
    const merged = []
    for (const part of parts) {
        const last = merged[merged.length - 1]
        if (last && last.kind === part.kind) last.ch += part.ch
        else merged.push({ ...part })
    }
    return merged
}

export function CipherScrambleSecurityCompliance({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const demoRef = useRef(null)
    const inView = useInView(demoRef, { once: true, amount: 0.4 })
    const [mode, setMode] = useState('plain')
    const [frame, setFrame] = useState(LAST_FRAME)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        if (!inView || started) return
        setStarted(true)
        setMode('cipher')
        setFrame(reduceMotion ? LAST_FRAME : 0)
    }, [inView, started, reduceMotion])

    const running = frame < LAST_FRAME

    useEffect(() => {
        if (!running) return undefined
        const id = setInterval(() => {
            setFrame((f) => (f + 1 >= LAST_FRAME ? LAST_FRAME : f + 1))
        }, 35)
        return () => clearInterval(id)
    }, [running])

    const toggle = () => {
        setStarted(true)
        setMode((m) => (m === 'cipher' ? 'plain' : 'cipher'))
        setFrame(reduceMotion ? LAST_FRAME : 0)
    }

    const from = mode === 'cipher' ? 'plain' : 'cipher'
    const done = !running
    const encrypted = mode === 'cipher'
    const progress = Math.round((frame / LAST_FRAME) * 100)
    const sealed = encrypted ? progress : 100 - progress

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#050505] px-4 py-16 text-base font-normal text-zinc-300 sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-1/3 -z-10 size-[460px] rounded-full bg-[#e11d74]/15 blur-[120px]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#e11d74]">
                        Cipherly / field-level encryption
                    </p>
                    <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Readable to you.{' '}
                        <span className="relative inline-block text-white">
                            Noise
                            <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-1.5 bg-[#e11d74]" />
                        </span>{' '}
                        to everyone else.
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400">
                        Cipherly encrypts sensitive fields in your app before they ever touch a disk, a log
                        or a backup. Only services holding your key see the original values.
                    </p>
                </div>

                <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
                    <div
                        ref={demoRef}
                        className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0c] shadow-[0_40px_120px_-40px_rgba(225,29,116,0.45)]"
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
                            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                                customers.sensitive · 5 rows
                            </p>
                            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#e11d74]">
                                {encrypted ? <HiLockClosed className="size-3.5" aria-hidden="true" /> : <HiLockOpen className="size-3.5" aria-hidden="true" />}
                                {done ? (encrypted ? 'sealed' : 'open') : 'working'}
                            </p>
                        </div>
                        <div className="h-0.5 bg-white/5" aria-hidden="true">
                            <div className="h-full bg-[#e11d74] transition-[width] duration-75" style={{ width: `${sealed}%` }} />
                        </div>

                        <ul className="divide-y divide-white/5 px-4 sm:px-6">
                            {records.map((record, rowIndex) => {
                                const parts = renderRow(record, rowIndex, frame, from, mode)
                                const rowDone = frame >= rowIndex * ROW_DELAY + longest + ZONE
                                return (
                                    <li key={record.id} className="flex items-start gap-3 py-4 sm:gap-4">
                                        <span className="mt-0.5 w-16 shrink-0 rounded-md border border-[#e11d74]/40 px-1.5 py-0.5 text-center font-mono text-[10px] font-bold tracking-widest text-[#e11d74]">
                                            {record.type}
                                        </span>
                                        <p className="min-w-0 flex-1 break-all font-mono text-xs leading-relaxed sm:text-sm">
                                            <span className="sr-only">{encrypted && rowDone ? 'Encrypted value' : record.plain}</span>
                                            {parts.map((part, i) => (
                                                <span
                                                    key={i}
                                                    aria-hidden="true"
                                                    className={cn(
                                                        part.kind === 'noise' && 'text-[#e11d74]',
                                                        part.kind !== 'noise' &&
                                                            ((part.kind === 'done' ? mode : from) === 'cipher' ? 'text-zinc-500' : 'text-white'),
                                                    )}
                                                >
                                                    {part.ch}
                                                </span>
                                            ))}
                                        </p>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full transition-colors duration-300',
                                                rowDone && encrypted ? 'bg-[#e11d74] text-white' : 'bg-white/5 text-zinc-500',
                                            )}
                                        >
                                            {rowDone && encrypted ? <HiLockClosed className="size-3.5" /> : <HiLockOpen className="size-3.5" />}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="font-mono text-[11px] text-zinc-500">key: kms://eu-1/acme-prod/v14</p>
                            <button
                                type="button"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e11d74] px-5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#f43f8e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e11d74]"
                                onClick={toggle}
                            >
                                {encrypted ? <HiLockOpen className="size-4" aria-hidden="true" /> : <HiLockClosed className="size-4" aria-hidden="true" />}
                                {encrypted ? 'Decrypt with your key' : 'Encrypt again'}
                            </button>
                        </div>
                        <p aria-live="polite" className="sr-only">
                            {started && done ? (encrypted ? 'Records encrypted' : 'Records decrypted') : ''}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-1 lg:gap-y-0 lg:divide-y lg:divide-white/10">
                            {facts.map((fact, index) => (
                                <motion.div
                                    key={fact.value}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="flex flex-col lg:py-6 lg:first:pt-0"
                                >
                                    <dt className="order-2 mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">{fact.label}</dt>
                                    <dd className="order-1 font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl">
                                        {fact.value}
                                    </dd>
                                </motion.div>
                            ))}
                        </dl>
                        <a
                            href="#cipherly-whitepaper"
                            className="group mt-10 inline-flex min-h-10 items-center gap-2 self-start font-mono text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#e11d74] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e11d74]"
                        >
                            Read the cryptography whitepaper
                            <HiArrowLongRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CipherScrambleSecurityCompliance

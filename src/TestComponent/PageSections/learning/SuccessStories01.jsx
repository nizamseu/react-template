// CertificateVerifySuccessStories

// SuccessStories01 · Learning Management Systems › Student Success Stories & Certificates

// Description:
// A trustworthy, engraved-paper section for the fictional Credential Institute that proves
// its certificates are real. Beside the serif heading "Every certificate, verifiable in
// seconds." sits a certificate mock with an SVG gold seal, a "Verify certificate" form
// (enter an ID → valid or not-found result, with a "Use sample ID" shortcut) and two short
// graduate quotes. Use it on a program page, an employer page or a graduate outcomes page.

// Design:
// - Ivory #fbf8f1 paper, deep green #1b4332 ink and gold #b8860b details; the certificate
//   has a green outer rule, an inset gold hairline frame and SVG corner flourishes
// - Seal: SVG scalloped rosette with a gold linear gradient, two ribbon tails and ring text
//   on a textPath ("CREDENTIAL INSTITUTE · VERIFIED GRADUATE ·") that slowly rotates
// - Serif display type (italic recipient name), small-caps tracking for labels, mono for
//   certificate IDs; form card is white with a green focus ring and rounded-2xl corners
// - The recipient name and program crossfade when a new ID verifies; the seal ring stops
//   rotating for reduced motion
// - Responsive: stacked on mobile, lg:grid-cols-[1.2fr_1fr] with the certificate left;
//   the certificate keeps a 1.414:1 ratio from sm up and grows naturally below; quotes
//   1 → md:2 columns

// What it does:
// - Controlled input (uppercased as you type) with validation: empty → "Enter a
//   certificate ID", wrong pattern → "IDs look like CI-2026-48213"
// - Submit shows "Checking registry…" for 700 ms (timeout cleared on unmount / resubmit),
//   then looks the ID up in a local registry: a match shows a valid card and swaps the
//   certificate to that graduate; no match shows a not-found card linking #contact-registry
// - "Use sample ID" fills CI-2026-48213; results are announced via aria-live; no network

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CertificateVerifySuccessStories from '@/TestComponent/PageSections/learning/SuccessStories01';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <CertificateVerifySuccessStories />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheckBadge, HiOutlineExclamationTriangle, HiOutlineShieldCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const SAMPLE_ID = 'CI-2026-48213'
const PATTERN = /^CI-\d{4}-\d{5}$/

const registry = {
    'CI-2026-48213': {
        name: 'Priya Raman',
        program: 'Professional Certificate in Supply Chain Analytics',
        awarded: '14 August 2026',
        hours: 160,
        grade: 'Distinction',
    },
    'CI-2025-30977': {
        name: 'Mateo Alvarez',
        program: 'Advanced Diploma in Data Engineering',
        awarded: '2 December 2025',
        hours: 240,
        grade: 'Merit',
    },
    'CI-2026-51102': {
        name: 'Hannah Lindqvist',
        program: 'Certificate in Clinical Research Practice',
        awarded: '30 June 2026',
        hours: 120,
        grade: 'Pass',
    },
}

const quotes = [
    {
        id: 'priya',
        quote: 'My new manager checked my certificate ID during the interview. Ten seconds, and the conversation moved on to what I could actually do.',
        name: 'Priya Raman',
        role: 'Supply Chain Analyst, Northgate Freight',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
        alt: 'Portrait of a smiling woman in a white collar, lit by warm light',
    },
    {
        id: 'mateo',
        quote: 'I moved from Valencia to Rotterdam mid-course. A credential anyone can verify made the job hunt far less painful.',
        name: 'Mateo Alvarez',
        role: 'Data Engineer, Havenlink Logistics',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
        alt: 'Portrait of a smiling man wearing a scarf',
    },
]

function Seal({ uid, reduce }) {
    const scallops = Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2
        return { x: 60 + Math.cos(a) * 46, y: 58 + Math.sin(a) * 46 }
    })
    return (
        <svg viewBox="0 0 120 150" className="h-full w-full" aria-hidden="true">
            <defs>
                <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f3d27a" />
                    <stop offset="0.45" stopColor="#b8860b" />
                    <stop offset="0.7" stopColor="#e5bd5a" />
                    <stop offset="1" stopColor="#8a6508" />
                </linearGradient>
                <path id={`${uid}-ring`} d="M60,58 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
            </defs>
            <path d="M42 86 L30 146 L45 136 L55 148 L60 92 Z" fill="#1b4332" />
            <path d="M78 86 L90 146 L75 136 L65 148 L60 92 Z" fill="#24573f" />
            {scallops.map((p, i) => (
                <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r="6.5" fill={`url(#${uid}-gold)`} />
            ))}
            <circle cx="60" cy="58" r="46" fill={`url(#${uid}-gold)`} />
            <circle cx="60" cy="58" r="43" fill="none" stroke="#fbf8f1" strokeOpacity="0.55" strokeWidth="0.8" />
            <circle cx="60" cy="58" r="29" fill="#1b4332" />
            <circle cx="60" cy="58" r="26" fill="none" stroke="#e5bd5a" strokeWidth="0.8" />
            <motion.g
                animate={reduce ? { rotate: 0 } : { rotate: 360 }}
                transition={reduce ? { duration: 0 } : { duration: 60, ease: 'linear', repeat: Infinity }}
            >
                {/* invisible circle centres the group's box so it spins around the seal centre */}
                <circle cx="60" cy="58" r="44" fill="none" />
                <text fill="#1b4332" fontSize="6.6" fontFamily="Georgia, serif" letterSpacing="1" fontWeight="700">
                    <textPath href={`#${uid}-ring`}>CREDENTIAL INSTITUTE · VERIFIED GRADUATE ·</textPath>
                </text>
            </motion.g>
            <text x="60" y="64" textAnchor="middle" fill="#f3d27a" fontSize="17" fontFamily="Georgia, serif" fontStyle="italic">
                CI
            </text>
            <path d="M48 70 H72" stroke="#e5bd5a" strokeWidth="0.8" />
        </svg>
    )
}

function Flourish({ className }) {
    return (
        <svg viewBox="0 0 40 40" className={cn('absolute h-8 w-8 text-[#b8860b] sm:h-10 sm:w-10', className)} aria-hidden="true">
            <path d="M2 38 V14 Q2 2 14 2 H38" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 38 V18 Q8 8 18 8 H38" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="14" cy="14" r="2.2" fill="currentColor" />
        </svg>
    )
}

export function CertificateVerifySuccessStories({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const uid = `ci${useId().replace(/[^a-zA-Z0-9]/g, '')}`
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [status, setStatus] = useState('idle') // idle | checking | valid | missing
    const [checkedId, setCheckedId] = useState('')
    const [shownId, setShownId] = useState(SAMPLE_ID)
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    const record = registry[shownId]
    const result = registry[checkedId]

    const onSubmit = (event) => {
        event.preventDefault()
        const id = value.trim()
        clearTimeout(timer.current)
        if (!id) {
            setError('Enter a certificate ID.')
            setStatus('idle')
            return
        }
        if (!PATTERN.test(id)) {
            setError(`IDs look like ${SAMPLE_ID}: “CI”, the year, then five digits.`)
            setStatus('idle')
            return
        }
        setError('')
        setStatus('checking')
        timer.current = setTimeout(() => {
            setCheckedId(id)
            if (registry[id]) {
                setStatus('valid')
                setShownId(id)
            } else {
                setStatus('missing')
            }
        }, 700)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fbf8f1] px-4 py-16 text-base font-normal text-[#1b4332] antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b8860b]">
                        <span className="h-px w-10 bg-[#b8860b]" aria-hidden="true" />
                        Credential Institute · Registry of graduates
                    </p>
                    <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#1b4332] sm:text-5xl lg:text-6xl">
                        Every certificate, <em className="text-[#b8860b]">verifiable</em> in seconds.
                    </h2>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-[#1b4332]/75">
                        41,300 graduates since 2011. Each credential carries a unique ID that employers
                        and universities can check against our registry, any time.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                    {/* Certificate mock */}
                    <figure className="relative rounded-md border-2 border-[#1b4332] bg-[#fffdf7] p-2 shadow-[0_30px_60px_-35px_rgba(27,67,50,0.55)] sm:aspect-[1.414/1] sm:p-3">
                        <div className="relative flex h-full flex-col items-center justify-center border border-[#b8860b]/70 px-5 pb-6 pt-8 text-center sm:px-10 sm:py-6">
                            <Flourish className="left-1.5 top-1.5" />
                            <Flourish className="right-1.5 top-1.5 rotate-90" />
                            <Flourish className="bottom-1.5 right-1.5 rotate-180" />
                            <Flourish className="bottom-1.5 left-1.5 -rotate-90" />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#1b4332]/70">Credential Institute</p>
                            <p className="mt-2 font-serif text-2xl text-[#1b4332] sm:text-3xl">Certificate of Completion</p>
                            <p className="mt-3 text-xs italic text-[#1b4332]/70 sm:mt-4">This certifies that</p>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={shownId}
                                    initial={reduce ? false : { opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <p className="mt-1 font-serif text-3xl italic text-[#1b4332] sm:text-4xl">{record.name}</p>
                                    <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#1b4332]/80 sm:text-sm">
                                        has completed the <span className="font-semibold">{record.program}</span>, {record.hours} guided hours, with {record.grade.toLowerCase()}.
                                    </p>
                                    <p className="mt-2 text-[11px] text-[#1b4332]/70">Awarded {record.awarded}</p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-5 grid w-full grid-cols-[1fr_auto_1fr] items-end gap-2 sm:mt-6 sm:gap-4">
                                <div className="text-left">
                                    <svg viewBox="0 0 120 30" className="h-6 w-full max-w-[7.5rem]" aria-hidden="true">
                                        <path d="M4 22 C14 4 20 28 30 14 S46 6 50 18 S66 26 74 12 S96 8 116 16" fill="none" stroke="#1b4332" strokeWidth="1.4" strokeLinecap="round" />
                                    </svg>
                                    <p className="border-t border-[#1b4332]/40 pt-1 text-[9px] leading-tight text-[#1b4332]/75 sm:text-[10px]">
                                        Dr. Helen Achterberg, Dean
                                    </p>
                                </div>
                                <div className="h-24 w-20 sm:h-28 sm:w-24">
                                    <Seal uid={uid} reduce={reduce} />
                                </div>
                                <div className="text-right">
                                    <svg viewBox="0 0 120 30" className="ml-auto h-6 w-full max-w-[7.5rem]" aria-hidden="true">
                                        <path d="M6 18 C18 6 24 24 36 12 C44 4 52 26 62 16 C72 6 84 22 96 10 L114 14" fill="none" stroke="#1b4332" strokeWidth="1.4" strokeLinecap="round" />
                                    </svg>
                                    <p className="border-t border-[#1b4332]/40 pt-1 text-[9px] leading-tight text-[#1b4332]/75 sm:text-[10px]">
                                        Samuel Oyelaran, Registrar
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-[#1b4332]/70">ID {shownId}</p>
                        </div>
                        <figcaption className="sr-only">
                            Sample certificate for {record.name}, {record.program}, awarded {record.awarded}, ID {shownId}.
                        </figcaption>
                    </figure>

                    {/* Verify form */}
                    <div className="rounded-2xl border border-[#1b4332]/15 bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1b4332] text-[#f3d27a]">
                                <HiOutlineShieldCheck className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <h3 className="font-serif text-2xl font-normal text-[#1b4332]">Verify a certificate</h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[#1b4332]/70">
                            Enter the ID printed at the bottom of the certificate.
                        </p>
                        <form noValidate className="mt-6" onSubmit={onSubmit}>
                            <label htmlFor={`${uid}-input`} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1b4332]/80">
                                Certificate ID
                            </label>
                            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                                <input
                                    id={`${uid}-input`}
                                    type="text"
                                    inputMode="text"
                                    autoComplete="off"
                                    spellCheck={false}
                                    placeholder="CI-2026-00000"
                                    value={value}
                                    aria-invalid={Boolean(error)}
                                    aria-describedby={`${uid}-hint${error ? ` ${uid}-error` : ''}`}
                                    className={cn(
                                        'min-h-12 w-full min-w-0 flex-1 rounded-xl border bg-[#fbf8f1] px-4 font-mono text-base tracking-wider text-[#1b4332] placeholder:text-[#1b4332]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]',
                                        error ? 'border-[#9b2226]' : 'border-[#1b4332]/25',
                                    )}
                                    onChange={(e) => {
                                        setValue(e.target.value.toUpperCase())
                                        if (error) setError('')
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'checking'}
                                    className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#1b4332] px-6 text-sm font-semibold text-[#fbf8f1] transition-colors hover:bg-[#24573f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8860b] disabled:opacity-70"
                                >
                                    {status === 'checking' ? 'Checking…' : 'Verify certificate'}
                                </button>
                            </div>
                            {error && (
                                <p id={`${uid}-error`} className="mt-2 text-sm text-[#9b2226]">
                                    {error}
                                </p>
                            )}
                            <p id={`${uid}-hint`} className="mt-3 text-sm text-[#1b4332]/70">
                                Sample ID: <span className="font-mono">{SAMPLE_ID}</span>{' '}
                                <button
                                    type="button"
                                    className="ml-1 inline-flex min-h-10 items-center font-semibold text-[#b8860b] underline underline-offset-4 hover:text-[#8a6508] focus-visible:outline-2 focus-visible:outline-[#b8860b]"
                                    onClick={() => {
                                        setValue(SAMPLE_ID)
                                        setError('')
                                    }}
                                >
                                    Use sample ID
                                </button>
                            </p>
                        </form>

                        <div aria-live="polite" className="mt-4">
                            <AnimatePresence mode="wait" initial={false}>
                                {status === 'checking' && (
                                    <motion.p key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-[#1b4332]/70">
                                        Checking registry…
                                    </motion.p>
                                )}
                                {status === 'valid' && result && (
                                    <motion.div
                                        key={`valid-${checkedId}`}
                                        initial={reduce ? false : { opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="rounded-xl border border-[#1b4332]/20 bg-[#1b4332]/[0.04] p-4"
                                    >
                                        <p className="flex items-center gap-2 text-sm font-semibold text-[#1b4332]">
                                            <HiCheckBadge className="h-5 w-5 text-[#b8860b]" aria-hidden="true" />
                                            Valid certificate
                                        </p>
                                        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                                            <dt className="text-[#1b4332]/60">Holder</dt>
                                            <dd className="font-semibold">{result.name}</dd>
                                            <dt className="text-[#1b4332]/60">Program</dt>
                                            <dd>{result.program}</dd>
                                            <dt className="text-[#1b4332]/60">Awarded</dt>
                                            <dd>
                                                {result.awarded} · {result.grade}
                                            </dd>
                                        </dl>
                                    </motion.div>
                                )}
                                {status === 'missing' && (
                                    <motion.div
                                        key={`missing-${checkedId}`}
                                        initial={reduce ? false : { opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="rounded-xl border border-[#9b2226]/25 bg-[#9b2226]/[0.04] p-4"
                                    >
                                        <p className="flex items-center gap-2 text-sm font-semibold text-[#9b2226]">
                                            <HiOutlineExclamationTriangle className="h-5 w-5" aria-hidden="true" />
                                            No certificate found
                                        </p>
                                        <p className="mt-2 text-sm text-[#1b4332]/75">
                                            Nothing in the registry matches <span className="font-mono">{checkedId}</span>. Check for typos or{' '}
                                            <a href="#contact-registry" className="font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#1b4332]">
                                                contact the registrar
                                            </a>
                                            .
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="mt-14 grid gap-6 border-t border-[#1b4332]/15 pt-10 md:grid-cols-2 md:gap-10">
                    {quotes.map((q) => (
                        <figure key={q.id} className="flex gap-5">
                            <img
                                src={q.image}
                                alt={q.alt}
                                loading="lazy"
                                className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#b8860b]/60 ring-offset-2 ring-offset-[#fbf8f1] sm:h-20 sm:w-20"
                            />
                            <div className="min-w-0">
                                <blockquote className="font-serif text-lg leading-snug text-[#1b4332] sm:text-xl">“{q.quote}”</blockquote>
                                <figcaption className="mt-3 text-sm">
                                    <span className="font-semibold">{q.name}</span>
                                    <span className="text-[#1b4332]/65"> · {q.role}</span>
                                </figcaption>
                            </div>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CertificateVerifySuccessStories

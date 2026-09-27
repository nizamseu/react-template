// ThreadBuilderPostComposer

// PostComposer05 · Social Networks & Communities › Post Creation Widget

// Description:
// A multi-part thread composer for the micro-blogging app Chirpline. Beside the heading
// "Long thought? Thread it." a timeline of connected parts, each with its own 280-character
// ring counter, lets you add parts below, remove them, or "Split at 280" when one runs
// long. "Post all" is disabled while any part is empty or over the limit; posted threads
// appear underneath. Use it for long-form social posts, announcements or build-in-public logs.

// Design:
// - lg:grid-cols-[21rem_1fr]: a sticky aside (intro, live stats, numbering switch,
//   shortcuts) and the builder; the aside sits above the builder below lg
// - Sky #e0f2fe section, navy #0c4a6e ink and buttons, white part cards, ring states in
//   sky #0284c7 → amber #d97706 (20 left) → red #dc2626 (over), faint dotted grid backdrop
// - Heavy sans heading text-4xl → lg:text-6xl, mono tabular numbers for counters and part
//   labels; cards rounded-3xl with a navy/10 ring; avatars joined by a 2px timeline rail
// - Parts animate in/out and reflow with AnimatePresence + layout (off for reduced
//   motion); the ring stroke eases between lengths
// - Toolbars under each part wrap on narrow screens; every control is at least 40px tall

// What it does:
// - parts[] state holds each part's text; "Add part below" / Ctrl or ⌘ + Enter insert a
//   part and focus it, the trash button removes one (never the last), "Split at 280"
//   breaks an over-long part at the last space before the limit (max 12 parts)
// - The "Number parts" switch appends " 2/5" style suffixes that count toward each limit
// - Validation: every part needs text and must fit 280 characters (suffix included); the
//   hint names the first problem part and "Post all" stays disabled until it is fixed
// - Submit (preventDefault) prepends the thread to "Posted threads", resets the builder
//   to one empty part and announces success; no network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThreadBuilderPostComposer from '@/TestComponent/PageSections/community/PostComposer05';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ThreadBuilderPostComposer />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiOutlineArrowPath,
    HiOutlineChatBubbleOvalLeft,
    HiOutlineCheckCircle,
    HiOutlineHeart,
    HiOutlinePlus,
    HiOutlineScissors,
    HiOutlineTrash,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const LIMIT = 280
const WARN_AT = 20
const MAX_PARTS = 12
const RADIUS = 11
const CIRC = 2 * Math.PI * RADIUS

const ME = {
    name: 'Ada Okoye',
    handle: '@ada.hosts',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
}

const seedParts = [
    'We just wrapped our 12th Community Night: 400 people, three venues and zero catering budget. Here is everything I wish someone had told me before the first one.',
    'Your venue is the product. We moved from a noisy bar to a library event room and no-shows dropped from 41% to 18%. People commit to calm places. Ask for daylight, two exits and the Wi-Fi password before the night.',
    'Name tags are a moderation tool. Everyone writes their first name plus one thing they could talk about for ten minutes: sourdough, Rust, bouldering, Portuguese. Strangers get an opener, shy people get approached, and the loudest folks spread out instead of circling the snacks.',
]

const seedPosted = [
    {
        id: 'thread-0',
        time: 'Tue 22 Sep',
        parts: [
            'Six months of building a neighbourhood tool library in public. Numbers, mistakes and one very overdue hedge trimmer.',
            '312 members, 184 tools, 1,960 loans. Top borrowed item: a pressure washer (61 loans). Least borrowed: a unicycle someone donated “for the vibes”.',
        ],
        replies: 38,
        likes: 412,
    },
]

function partSuffix(index, total, numbered) {
    return numbered && total > 1 ? ` ${index + 1}/${total}` : ''
}

function splitText(text, limit) {
    if (text.length <= limit) return null
    const head0 = text.slice(0, limit + 1)
    let cut = head0.lastIndexOf(' ')
    if (cut < limit * 0.5) cut = limit
    const head = text.slice(0, cut).trimEnd()
    const tail = text.slice(cut).trimStart()
    return tail ? [head, tail] : null
}

function Ring({ used }) {
    const left = LIMIT - used
    const over = left < 0
    const warn = !over && left <= WARN_AT
    const progress = Math.min(used / LIMIT, 1)
    return (
        <span className="relative grid size-10 place-items-center" aria-hidden="true">
            <svg viewBox="0 0 28 28" className="size-8 -rotate-90">
                <circle cx="14" cy="14" r={RADIUS} fill="none" stroke="#0c4a6e" strokeOpacity="0.1" strokeWidth="2.5" />
                <circle
                    cx="14"
                    cy="14"
                    r={RADIUS}
                    fill="none"
                    strokeWidth={warn || over ? 3 : 2.5}
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC * (1 - progress)}
                    className={cn(
                        'transition-[stroke-dashoffset,stroke] duration-300 ease-out motion-reduce:transition-none',
                        over ? 'stroke-[#dc2626]' : warn ? 'stroke-[#d97706]' : 'stroke-[#0284c7]',
                    )}
                />
            </svg>
            {(warn || over) && (
                <span
                    className={cn(
                        'absolute font-mono text-[10px] font-bold tabular-nums',
                        over ? 'text-[#dc2626]' : 'text-[#d97706]',
                    )}
                >
                    {left}
                </span>
            )}
        </span>
    )
}

export function ThreadBuilderPostComposer({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const nextId = useRef(seedParts.length)
    const focusId = useRef(null)

    const [parts, setParts] = useState(() => seedParts.map((text, i) => ({ id: `part-${i + 1}`, text })))
    const [numbered, setNumbered] = useState(true)
    const [posted, setPosted] = useState(seedPosted)
    const [status, setStatus] = useState('')

    useEffect(() => {
        if (!focusId.current) return
        const el = document.getElementById(`${uid}-${focusId.current}`)
        focusId.current = null
        if (el) {
            el.focus()
            el.setSelectionRange(el.value.length, el.value.length)
        }
    }, [parts, uid])

    const total = parts.length
    const measured = parts.map((p, i) => ({ ...p, used: p.text.length + partSuffix(i, total, numbered).length }))
    const emptyIndex = measured.findIndex((p) => !p.text.trim())
    const overIndex = measured.findIndex((p) => p.used > LIMIT)
    const overCount = measured.filter((p) => p.used > LIMIT).length
    const totalChars = measured.reduce((s, p) => s + p.text.length, 0)
    const words = parts.reduce((s, p) => s + (p.text.trim() ? p.text.trim().split(/\s+/).length : 0), 0)
    const valid = emptyIndex < 0 && overIndex < 0
    const hint =
        overIndex >= 0
            ? `Part ${overIndex + 1} is ${measured[overIndex].used - LIMIT} characters over — trim it or split it.`
            : emptyIndex >= 0
              ? `Part ${emptyIndex + 1} is empty. Write something or remove it.`
              : `Ready: ${total} ${total === 1 ? 'part' : 'parts'}, all within ${LIMIT} characters.`

    const makeId = () => {
        nextId.current += 1
        return `part-${nextId.current}`
    }

    const updatePart = (id, text) => setParts((list) => list.map((p) => (p.id === id ? { ...p, text } : p)))

    const addBelow = (index, text = '') => {
        if (parts.length >= MAX_PARTS) return
        const id = makeId()
        focusId.current = id
        setParts((list) => [...list.slice(0, index + 1), { id, text }, ...list.slice(index + 1)])
    }

    const removePart = (id) => {
        if (parts.length <= 1) return
        const index = parts.findIndex((p) => p.id === id)
        const neighbour = parts[index - 1] ?? parts[index + 1]
        focusId.current = neighbour?.id ?? null
        setParts((list) => list.filter((p) => p.id !== id))
        setStatus(`Part ${index + 1} removed.`)
    }

    const splitPart = (index) => {
        if (parts.length >= MAX_PARTS) return
        const limit = LIMIT - partSuffix(index, total + 1, numbered).length
        const pieces = splitText(parts[index].text, limit)
        if (!pieces) return
        const id = makeId()
        focusId.current = id
        setParts((list) => [
            ...list.slice(0, index),
            { ...list[index], text: pieces[0] },
            { id, text: pieces[1] },
            ...list.slice(index + 1),
        ])
        setStatus(`Part ${index + 1} split into two parts.`)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if (!valid) return
        nextId.current += 1
        setPosted((list) => [
            {
                id: `thread-${nextId.current}`,
                time: 'Just now',
                parts: parts.map((p, i) => p.text.trim() + partSuffix(i, total, numbered)),
                replies: 0,
                likes: 0,
            },
            ...list,
        ])
        const fresh = makeId()
        setParts([{ id: fresh, text: '' }])
        setStatus(`Thread posted — ${total} ${total === 1 ? 'part' : 'parts'} are live on ${ME.handle}.`)
    }

    const resetExample = () => {
        setParts(seedParts.map((text) => ({ id: makeId(), text })))
        setStatus('Example thread restored.')
    }

    const rise = reduceMotion ? 0 : 14

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#e0f2fe] px-4 py-16 text-base font-normal text-[#0c4a6e] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#0c4a6e_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.07]"
            />

            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-14">
                <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#0284c7]">
                        Chirpline · Thread builder
                    </p>
                    <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-tight text-[#0c4a6e] sm:text-5xl lg:text-6xl">
                        Long thought? Thread it.
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-[#0c4a6e]/75">
                        Draft every part in one place. Each ring fills toward {LIMIT} characters, and nothing goes
                        live until the whole thread fits.
                    </p>

                    <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-[#0c4a6e]/10 ring-1 ring-[#0c4a6e]/10">
                        {[
                            ['Parts', `${total}/${MAX_PARTS}`],
                            ['Characters', totalChars.toLocaleString('en-US')],
                            ['Read time', `~${Math.max(1, Math.round(words / 200))} min`],
                            ['Over limit', overCount],
                        ].map(([label, value]) => (
                            <div key={label} className="bg-white/80 p-4">
                                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0c4a6e]/60">{label}</dt>
                                <dd
                                    className={cn(
                                        'mt-1 font-mono text-2xl font-bold tabular-nums',
                                        label === 'Over limit' && overCount > 0 ? 'text-[#dc2626]' : 'text-[#0c4a6e]',
                                    )}
                                >
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-white/80 p-4 ring-1 ring-[#0c4a6e]/10">
                        <span id={`${uid}-num`} className="text-sm font-semibold text-[#0c4a6e]">
                            Number parts <span className="font-mono text-xs font-normal text-[#0c4a6e]/60">(adds “ 2/5”)</span>
                        </span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={numbered}
                            aria-labelledby={`${uid}-num`}
                            className={cn(
                                'relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]',
                                numbered ? 'bg-[#0c4a6e]' : 'bg-[#0c4a6e]/20',
                            )}
                            onClick={() => setNumbered((v) => !v)}
                        >
                            <motion.span
                                layout={!reduceMotion}
                                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                                className={cn('absolute top-1 size-6 rounded-full bg-white shadow', numbered ? 'right-1' : 'left-1')}
                            />
                        </button>
                    </div>

                    <p className="mt-6 hidden text-sm leading-relaxed text-[#0c4a6e]/70 lg:block">
                        <kbd className="rounded-md bg-white px-1.5 py-0.5 font-mono text-xs text-[#0c4a6e] ring-1 ring-[#0c4a6e]/15">
                            Ctrl / ⌘ + Enter
                        </kbd>{' '}
                        adds a new part below the one you are typing in.
                    </p>
                </aside>

                <div className="min-w-0">
                    <form noValidate onSubmit={onSubmit}>
                        <ol className="relative" aria-label="Thread parts">
                            <AnimatePresence initial={false}>
                                {measured.map((part, i) => {
                                    const suffix = partSuffix(i, total, numbered)
                                    const over = part.used > LIMIT
                                    const last = i === total - 1
                                    const rows = Math.min(8, Math.max(3, Math.ceil(part.text.length / 54) + (part.text.match(/\n/g)?.length ?? 0)))
                                    return (
                                        <motion.li
                                            key={part.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, y: -rise }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -rise }}
                                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex gap-3 sm:gap-4"
                                        >
                                            <div className="flex w-10 shrink-0 flex-col items-center">
                                                <img
                                                    src={ME.avatar}
                                                    alt=""
                                                    loading="lazy"
                                                    className={cn(
                                                        'size-10 rounded-full object-cover ring-4 ring-[#e0f2fe]',
                                                        i > 0 && 'opacity-70',
                                                    )}
                                                />
                                                {!last && <span aria-hidden="true" className="w-0.5 flex-1 bg-[#0c4a6e]/20" />}
                                            </div>
                                            <div className="min-w-0 flex-1 pb-6">
                                                <div
                                                    className={cn(
                                                        'rounded-3xl bg-white p-4 ring-1 transition-shadow focus-within:shadow-[0_18px_40px_-24px_rgba(12,74,110,0.55)] sm:p-5',
                                                        over ? 'ring-2 ring-[#fca5a5]' : 'ring-[#0c4a6e]/10 focus-within:ring-[#0284c7]',
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm">
                                                            <span className="font-bold text-[#0c4a6e]">{ME.name}</span>{' '}
                                                            <span className="text-[#0c4a6e]/55">{ME.handle}</span>
                                                        </p>
                                                        <span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-[#0c4a6e]">
                                                            {i + 1}/{total}
                                                        </span>
                                                    </div>
                                                    <label htmlFor={`${uid}-${part.id}`} className="sr-only">
                                                        Part {i + 1} of {total}
                                                    </label>
                                                    <textarea
                                                        id={`${uid}-${part.id}`}
                                                        rows={rows}
                                                        value={part.text}
                                                        placeholder={i === 0 ? 'Start your thread…' : 'Keep going…'}
                                                        aria-invalid={over}
                                                        aria-describedby={`${uid}-${part.id}-count`}
                                                        className="mt-2 block w-full resize-none bg-transparent text-[17px] leading-relaxed text-[#0c4a6e] placeholder:text-[#0c4a6e]/35 focus:outline-none"
                                                        onChange={(e) => updatePart(part.id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                                e.preventDefault()
                                                                addBelow(i)
                                                            }
                                                        }}
                                                    />
                                                    {suffix && part.text && (
                                                        <p className="font-mono text-xs text-[#0284c7]" aria-hidden="true">
                                                            …{suffix.trim()}
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#0c4a6e]/10 pt-3">
                                                        <Ring used={part.used} />
                                                        <span
                                                            id={`${uid}-${part.id}-count`}
                                                            className={cn(
                                                                'mr-auto font-mono text-xs tabular-nums',
                                                                over ? 'font-bold text-[#dc2626]' : 'text-[#0c4a6e]/60',
                                                            )}
                                                        >
                                                            {part.used}/{LIMIT}
                                                            {over && ' · over limit'}
                                                        </span>
                                                        {over && (
                                                            <button
                                                                type="button"
                                                                disabled={total >= MAX_PARTS}
                                                                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#fee2e2] px-3 text-xs font-bold text-[#b91c1c] transition-colors hover:bg-[#fecaca] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
                                                                onClick={() => splitPart(i)}
                                                            >
                                                                <HiOutlineScissors className="size-4" aria-hidden="true" />
                                                                Split at {LIMIT}
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            disabled={total >= MAX_PARTS}
                                                            aria-label={`Add a part below part ${i + 1}`}
                                                            className="grid size-10 place-items-center rounded-full text-[#0284c7] transition-colors hover:bg-[#e0f2fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:cursor-not-allowed disabled:opacity-40"
                                                            onClick={() => addBelow(i)}
                                                        >
                                                            <HiOutlinePlus className="size-5" aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={total <= 1}
                                                            aria-label={`Remove part ${i + 1}`}
                                                            className="grid size-10 place-items-center rounded-full text-[#0c4a6e]/60 transition-colors hover:bg-[#fee2e2] hover:text-[#dc2626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#0c4a6e]/60"
                                                            onClick={() => removePart(part.id)}
                                                        >
                                                            <HiOutlineTrash className="size-5" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </ol>

                        <div className="flex gap-3 sm:gap-4">
                            <span className="w-10 shrink-0" aria-hidden="true" />
                            <button
                                type="button"
                                disabled={total >= MAX_PARTS}
                                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#0c4a6e]/25 text-sm font-bold text-[#0c4a6e] transition-colors hover:border-[#0284c7] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => addBelow(total - 1)}
                            >
                                <HiOutlinePlus className="size-4" aria-hidden="true" />
                                {total >= MAX_PARTS ? `${MAX_PARTS} parts is the maximum` : 'Add another part'}
                            </button>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-[#0c4a6e] p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-5">
                            <p id={`${uid}-hint`} className={cn('text-sm', valid ? 'text-[#bae6fd]' : 'text-[#fecaca]')}>
                                {hint}
                            </p>
                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Restore the example thread"
                                    className="grid size-11 place-items-center rounded-full text-[#bae6fd] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    onClick={resetExample}
                                >
                                    <HiOutlineArrowPath className="size-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!valid}
                                    aria-describedby={`${uid}-hint`}
                                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#0c4a6e] transition-colors hover:bg-[#e0f2fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50 sm:flex-none"
                                >
                                    Post all {total > 1 ? total : ''}
                                </button>
                            </div>
                        </div>
                        <p role="status" className="mt-3 min-h-6 text-sm font-semibold text-[#0c4a6e]">
                            {status && (
                                <span className="inline-flex items-center gap-2">
                                    <HiOutlineCheckCircle className="size-5 text-[#0284c7]" aria-hidden="true" />
                                    {status}
                                </span>
                            )}
                        </p>
                    </form>

                    <div className="mt-10">
                        <h3 className="text-2xl font-black tracking-tight text-[#0c4a6e]">Posted threads</h3>
                        <ul className="mt-5 space-y-4">
                            <AnimatePresence initial={false}>
                                {posted.map((thread) => (
                                    <motion.li
                                        key={thread.id}
                                        layout={!reduceMotion}
                                        initial={{ opacity: 0, y: rise }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="rounded-3xl bg-white/80 p-4 ring-1 ring-[#0c4a6e]/10 sm:p-5"
                                    >
                                        <ol className="space-y-4">
                                            {thread.parts.map((text, i) => (
                                                <li key={`${thread.id}-${i}`} className="flex gap-3">
                                                    <div className="flex w-9 shrink-0 flex-col items-center">
                                                        <img src={ME.avatar} alt="" loading="lazy" className="size-9 rounded-full object-cover" />
                                                        {i < thread.parts.length - 1 && (
                                                            <span aria-hidden="true" className="-mb-4 mt-1 w-0.5 flex-1 bg-[#0c4a6e]/15" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm">
                                                            <span className="font-bold text-[#0c4a6e]">{ME.name}</span>{' '}
                                                            <span className="text-[#0c4a6e]/55">· {thread.time}</span>
                                                        </p>
                                                        <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed text-[#0c4a6e]">
                                                            {text}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                        <p className="mt-4 flex items-center gap-5 border-t border-[#0c4a6e]/10 pt-3 pl-12 font-mono text-xs tabular-nums text-[#0c4a6e]/60">
                                            <span className="inline-flex items-center gap-1.5">
                                                <HiOutlineChatBubbleOvalLeft className="size-4" aria-hidden="true" />
                                                {thread.replies} replies
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <HiOutlineHeart className="size-4" aria-hidden="true" />
                                                {thread.likes} likes
                                            </span>
                                        </p>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ThreadBuilderPostComposer

// MoodStatusPostComposer

// PostComposer03 · Social Networks & Communities › Post Creation Widget

// Description:
// A playful status composer for the social app Moments. Under "How are you, really?" a
// live preview card re-tints itself for the chosen mood while you write a short status,
// pick one of eight moods, choose who sees it from an audience chip menu (Public / Friends
// / Only me) and when it clears. "Share status" pins it to the "Today on Moments" row
// beside friends' statuses. Use it on a profile, a home feed header or a stories screen.

// Design:
// - Centred header, then a frosted card split into preview + controls
//   (lg:grid-cols-[0.9fr_1.1fr]); status tiles grid-cols-1 → sm:2 → lg:4 below
// - Blush #fff1f2 section with blurred rose / lilac blobs, rose #e11d48 accents, ink
//   #3f0d1b; each mood owns a two-stop pastel gradient that cross-fades on the preview
// - Mixed type: bold sans heading (text-4xl → lg:text-6xl) with an italic serif phrase;
//   the status itself renders in italic serif; pills and rounded-[28px]–[36px] cards
// - Motion: mood glyph springs in and gently bobs (off for reduced motion), gradient
//   cross-fades, the audience menu scales in, tiles animate in/out with AnimatePresence
// - Mood picker is a 4-column grid of 56px round buttons on every width; the card padding
//   grows from p-3 to sm:p-4 and the preview keeps a min height of 320px

// What it does:
// - Mood radiogroup (roving tabindex, arrow keys), status textarea (max 150 chars with a
//   counter), audience listbox menu (click, ↑ / ↓, Enter, Escape, outside click) and a
//   "Clears after" chip group — all controlled state feeding the live preview
// - Validation: a mood plus 3–150 characters; the hint explains what is missing and
//   "Share status" is disabled until valid; submit (preventDefault) replaces your status
// - Your tile has a "Clear" button; friends' tiles have a heart toggle (aria-pressed) with
//   a count; a status line announces what happened

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MoodStatusPostComposer from '@/TestComponent/PageSections/community/PostComposer03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <MoodStatusPostComposer />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    PiAirplaneTiltBold,
    PiCaretDownBold,
    PiCheckBold,
    PiCoffeeBold,
    PiConfettiBold,
    PiGlobeHemisphereWestBold,
    PiHeartBold,
    PiLightningBold,
    PiLockSimpleBold,
    PiMoonStarsBold,
    PiSmileyBold,
    PiSmileyMeltingBold,
    PiUsersThreeBold,
    PiXBold,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const MAX = 150

const moods = [
    { id: 'happy', label: 'Happy', icon: PiSmileyBold, bg: 'from-[#fecdd3] to-[#fde68a]', ink: 'text-[#e11d48]' },
    { id: 'cosy', label: 'Cosy', icon: PiCoffeeBold, bg: 'from-[#fed7aa] to-[#fecaca]', ink: 'text-[#c2410c]' },
    { id: 'celebrating', label: 'Celebrating', icon: PiConfettiBold, bg: 'from-[#fbcfe8] to-[#c7d2fe]', ink: 'text-[#db2777]' },
    { id: 'loved', label: 'Loved', icon: PiHeartBold, bg: 'from-[#fda4af] to-[#f9a8d4]', ink: 'text-[#be123c]' },
    { id: 'sleepy', label: 'Sleepy', icon: PiMoonStarsBold, bg: 'from-[#c7d2fe] to-[#e9d5ff]', ink: 'text-[#4f46e5]' },
    { id: 'energised', label: 'Energised', icon: PiLightningBold, bg: 'from-[#fde68a] to-[#bbf7d0]', ink: 'text-[#ca8a04]' },
    { id: 'wandering', label: 'Wandering', icon: PiAirplaneTiltBold, bg: 'from-[#bae6fd] to-[#fbcfe8]', ink: 'text-[#0284c7]' },
    { id: 'melting', label: 'Melting', icon: PiSmileyMeltingBold, bg: 'from-[#e9d5ff] to-[#fecdd3]', ink: 'text-[#9333ea]' },
]
const moodById = Object.fromEntries(moods.map((m) => [m.id, m]))

const audiences = [
    { id: 'public', label: 'Public', note: 'Anyone on Moments', icon: PiGlobeHemisphereWestBold },
    { id: 'friends', label: 'Friends', note: 'Your 312 friends', icon: PiUsersThreeBold },
    { id: 'me', label: 'Only me', note: 'A private note to self', icon: PiLockSimpleBold },
]
const audienceById = Object.fromEntries(audiences.map((a) => [a.id, a]))

const clearOptions = ['1 hour', 'Today', 'This week']

const ME = {
    name: 'Zoë Laurent',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
}

const friends = [
    {
        id: 'ines',
        name: 'Inês Duarte',
        avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80',
        mood: 'celebrating',
        text: 'Passed my driving test on the third try!! Roads, beware.',
        audience: 'public',
        time: '18 min',
        hearts: 41,
    },
    {
        id: 'kofi',
        name: 'Kofi Mensah',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
        mood: 'cosy',
        text: 'Rain, a new record and absolutely nowhere to be.',
        audience: 'friends',
        time: '1 h',
        hearts: 12,
    },
    {
        id: 'mei',
        name: 'Mei Tanaka',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
        mood: 'wandering',
        text: 'Lisbon for four days — send me your pastel de nata spots.',
        audience: 'public',
        time: '3 h',
        hearts: 27,
    },
    {
        id: 'arjun',
        name: 'Arjun Rao',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        mood: 'sleepy',
        text: 'Night shift done. Please do not perceive me until 4 pm.',
        audience: 'friends',
        time: '5 h',
        hearts: 9,
    },
]

export function MoodStatusPostComposer({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const menuWrap = useRef(null)
    const triggerRef = useRef(null)
    const listRef = useRef(null)

    const [text, setText] = useState('')
    const [mood, setMood] = useState(null)
    const [audience, setAudience] = useState('friends')
    const [clearAfter, setClearAfter] = useState('Today')
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuIndex, setMenuIndex] = useState(1)
    const [mine, setMine] = useState(null)
    const [hearts, setHearts] = useState({})
    const [status, setStatus] = useState('')

    useEffect(() => {
        if (!menuOpen) return undefined
        listRef.current?.focus()
        const onDown = (event) => {
            if (!menuWrap.current?.contains(event.target)) setMenuOpen(false)
        }
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false)
                triggerRef.current?.focus()
            }
        }
        document.addEventListener('pointerdown', onDown)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onDown)
            document.removeEventListener('keydown', onKey)
        }
    }, [menuOpen])

    const trimmed = text.trim().length
    const over = text.length > MAX
    const problem = !mood
        ? 'Pick a mood to go with it.'
        : trimmed < 3
          ? 'Write a few words — at least 3 characters.'
          : over
            ? `${text.length - MAX} characters over the limit.`
            : null
    const valid = problem === null

    const activeMood = mood ? moodById[mood] : null
    const activeAudience = audienceById[audience]
    const AudienceIcon = activeAudience.icon

    const openMenu = () => {
        setMenuIndex(audiences.findIndex((a) => a.id === audience))
        setMenuOpen(true)
    }

    const chooseAudience = (id) => {
        setAudience(id)
        setMenuOpen(false)
        triggerRef.current?.focus()
    }

    const onListKey = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setMenuIndex((i) => (i + 1) % audiences.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setMenuIndex((i) => (i - 1 + audiences.length) % audiences.length)
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            chooseAudience(audiences[menuIndex].id)
        } else if (event.key === 'Tab') {
            setMenuOpen(false)
        }
    }

    const onMoodKey = (event, index) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
        if (!(event.key in keys)) return
        event.preventDefault()
        const next = (index + keys[event.key] + moods.length) % moods.length
        setMood(moods[next].id)
        document.getElementById(`${uid}-mood-${moods[next].id}`)?.focus()
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if (!valid) return
        setMine({ mood, text: text.trim(), audience, clearAfter })
        setText('')
        setMood(null)
        setStatus(`Status shared with ${activeAudience.label === 'Only me' ? 'only you' : activeAudience.label.toLowerCase()}. It clears ${clearAfter === '1 hour' ? 'in 1 hour' : clearAfter.toLowerCase()}.`)
    }

    const clearMine = () => {
        setMine(null)
        setStatus('Your status was cleared.')
    }

    const toggleHeart = (id) => setHearts((h) => ({ ...h, [id]: !h[id] }))

    const tiles = [
        ...(mine ? [{ id: 'me', name: 'You', avatar: ME.avatar, time: 'Just now', mine: true, ...mine }] : []),
        ...friends,
    ]

    const PreviewIcon = activeMood?.icon ?? PiSmileyBold

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#fff1f2] px-4 py-16 text-base font-normal text-[#3f0d1b] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-10 size-72 rounded-full bg-[#fecdd3] opacity-70 blur-3xl" />
                <div className="absolute -right-20 top-1/3 size-80 rounded-full bg-[#e9d5ff] opacity-60 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 size-64 rounded-full bg-[#fbcfe8] opacity-60 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e11d48]">Moments · Status</p>
                    <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight text-[#3f0d1b] sm:text-5xl lg:text-6xl">
                        How are you, <span className="font-serif font-normal italic text-[#e11d48]">really?</span>
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-[#3f0d1b]/70">
                        A mood, a few words and the right people. Statuses fade on their own, so say the small
                        stuff too.
                    </p>
                </div>

                <form
                    noValidate
                    className="mt-12 grid gap-4 rounded-[36px] bg-white/70 p-3 shadow-[0_40px_80px_-40px_rgba(225,29,72,0.35)] ring-1 ring-[#ffe4e6] backdrop-blur sm:p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                    onSubmit={onSubmit}
                >
                    <figure className="relative isolate flex min-h-[320px] flex-col overflow-hidden rounded-[28px] p-5 sm:p-7">
                        <figcaption className="sr-only">Live preview of your status</figcaption>
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={activeMood?.id ?? 'none'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.5 }}
                                className={cn(
                                    'absolute inset-0 -z-10 bg-linear-to-br',
                                    activeMood ? activeMood.bg : 'from-[#ffe4e6] to-[#fdf2f8]',
                                )}
                                aria-hidden="true"
                            />
                        </AnimatePresence>
                        <div className="flex items-center gap-3">
                            <img src={ME.avatar} alt="" className="size-10 rounded-full object-cover ring-2 ring-white" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[#3f0d1b]">{ME.name}</p>
                                <p className="text-xs text-[#3f0d1b]/70">
                                    {activeMood ? `Feeling ${activeMood.label.toLowerCase()}` : 'Choose a mood'}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#3f0d1b]">
                                <AudienceIcon className="size-3.5" aria-hidden="true" />
                                {activeAudience.label}
                            </span>
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={activeMood?.id ?? 'none'}
                                    initial={{ scale: reduceMotion ? 1 : 0.4, opacity: 0, rotate: reduceMotion ? 0 : -20 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                                    className="grid size-20 place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(63,13,27,0.45)] sm:size-24"
                                    aria-hidden="true"
                                >
                                    <motion.span
                                        animate={reduceMotion ? { y: 0 } : { y: [0, -5, 0] }}
                                        transition={reduceMotion ? { duration: 0 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                                        className={cn('grid place-items-center', activeMood ? activeMood.ink : 'text-[#fda4af]')}
                                    >
                                        <PreviewIcon className="size-10 sm:size-12" />
                                    </motion.span>
                                </motion.span>
                            </AnimatePresence>
                            <p
                                className={cn(
                                    'mt-6 max-w-sm break-words font-serif text-2xl italic leading-snug sm:text-3xl',
                                    text.trim() ? 'text-[#3f0d1b]' : 'text-[#3f0d1b]/40',
                                )}
                            >
                                {text.trim() ? `“${text.trim()}”` : 'Your status will appear here'}
                            </p>
                        </div>

                        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#3f0d1b]/60">
                            Clears {clearAfter === '1 hour' ? 'in 1 hour' : clearAfter.toLowerCase()}
                        </p>
                    </figure>

                    <div className="min-w-0 p-2 sm:p-4">
                        <label htmlFor={`${uid}-text`} className="text-sm font-bold text-[#3f0d1b]">
                            What’s on your mind?
                        </label>
                        <div className="relative mt-2">
                            <textarea
                                id={`${uid}-text`}
                                rows={3}
                                value={text}
                                placeholder="Tiny wins, big feelings, soup opinions…"
                                aria-describedby={`${uid}-hint ${uid}-count`}
                                aria-invalid={over}
                                className={cn(
                                    'block w-full resize-none rounded-3xl border-2 bg-white px-5 pb-8 pt-4 text-base text-[#3f0d1b] placeholder:text-[#3f0d1b]/35 focus-visible:outline-none',
                                    over ? 'border-[#e11d48] focus:ring-4 focus:ring-[#ffe4e6]' : 'border-[#ffe4e6] focus:border-[#fda4af] focus:ring-4 focus:ring-[#ffe4e6]',
                                )}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <span
                                id={`${uid}-count`}
                                className={cn(
                                    'absolute bottom-3 right-5 font-mono text-xs tabular-nums',
                                    over ? 'font-bold text-[#e11d48]' : 'text-[#3f0d1b]/50',
                                )}
                            >
                                {MAX - text.length} left
                            </span>
                        </div>

                        <p id={`${uid}-mood-label`} className="mt-6 text-sm font-bold text-[#3f0d1b]">
                            Mood
                        </p>
                        <div
                            role="radiogroup"
                            aria-labelledby={`${uid}-mood-label`}
                            className="mt-3 grid grid-cols-4 gap-x-2 gap-y-4"
                        >
                            {moods.map((m, i) => {
                                const checked = mood === m.id
                                const Icon = m.icon
                                const focusable = checked || (!mood && i === 0)
                                return (
                                    <button
                                        key={m.id}
                                        id={`${uid}-mood-${m.id}`}
                                        type="button"
                                        role="radio"
                                        aria-checked={checked}
                                        tabIndex={focusable ? 0 : -1}
                                        className="group flex flex-col items-center gap-1.5 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e11d48]"
                                        onClick={() => setMood(checked ? null : m.id)}
                                        onKeyDown={(e) => onMoodKey(e, i)}
                                    >
                                        <span
                                            className={cn(
                                                'grid size-14 place-items-center rounded-full bg-linear-to-br transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
                                                m.bg,
                                                checked ? 'scale-110 ring-4 ring-[#e11d48] ring-offset-2 ring-offset-white' : 'opacity-80 group-hover:opacity-100',
                                            )}
                                        >
                                            <Icon className={cn('size-6', m.ink)} aria-hidden="true" />
                                        </span>
                                        <span
                                            className={cn(
                                                'text-[11px] font-semibold sm:text-xs',
                                                checked ? 'text-[#e11d48]' : 'text-[#3f0d1b]/70',
                                            )}
                                        >
                                            {m.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
                            <div ref={menuWrap} className="relative">
                                <p id={`${uid}-aud-label`} className="text-sm font-bold text-[#3f0d1b]">
                                    Who can see it
                                </p>
                                <button
                                    ref={triggerRef}
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={menuOpen}
                                    aria-controls={`${uid}-aud-list`}
                                    aria-labelledby={`${uid}-aud-label ${uid}-aud-value`}
                                    className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#3f0d1b] pl-4 pr-3 text-sm font-semibold text-white transition-colors hover:bg-[#e11d48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]"
                                    onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                            e.preventDefault()
                                            openMenu()
                                        }
                                    }}
                                >
                                    <AudienceIcon className="size-4" aria-hidden="true" />
                                    <span id={`${uid}-aud-value`}>{activeAudience.label}</span>
                                    <PiCaretDownBold
                                        className={cn('size-3.5 transition-transform', menuOpen && 'rotate-180')}
                                        aria-hidden="true"
                                    />
                                </button>
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.ul
                                            key="menu"
                                            ref={listRef}
                                            id={`${uid}-aud-list`}
                                            role="listbox"
                                            tabIndex={-1}
                                            aria-labelledby={`${uid}-aud-label`}
                                            aria-activedescendant={`${uid}-aud-${audiences[menuIndex].id}`}
                                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95, y: reduceMotion ? 0 : -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                                            transition={{ duration: 0.16 }}
                                            className="absolute bottom-full left-0 z-30 mb-2 w-64 origin-bottom-left rounded-3xl bg-white p-2 shadow-[0_24px_48px_-20px_rgba(63,13,27,0.45)] ring-1 ring-[#ffe4e6] focus:outline-none"
                                            onKeyDown={onListKey}
                                        >
                                            {audiences.map((a, i) => {
                                                const Icon = a.icon
                                                const selected = audience === a.id
                                                return (
                                                    <li
                                                        key={a.id}
                                                        id={`${uid}-aud-${a.id}`}
                                                        role="option"
                                                        aria-selected={selected}
                                                        className={cn(
                                                            'flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2',
                                                            i === menuIndex && 'bg-[#fff1f2]',
                                                        )}
                                                        onClick={() => chooseAudience(a.id)}
                                                        onMouseEnter={() => setMenuIndex(i)}
                                                    >
                                                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#ffe4e6] text-[#e11d48]">
                                                            <Icon className="size-4" aria-hidden="true" />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-sm font-bold text-[#3f0d1b]">{a.label}</span>
                                                            <span className="block text-xs text-[#3f0d1b]/60">{a.note}</span>
                                                        </span>
                                                        {selected && <PiCheckBold className="size-4 shrink-0 text-[#e11d48]" aria-hidden="true" />}
                                                    </li>
                                                )
                                            })}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div>
                                <p id={`${uid}-clear-label`} className="text-sm font-bold text-[#3f0d1b]">
                                    Clears after
                                </p>
                                <div role="group" aria-labelledby={`${uid}-clear-label`} className="mt-2 flex flex-wrap gap-1.5">
                                    {clearOptions.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            aria-pressed={clearAfter === c}
                                            className={cn(
                                                'min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]',
                                                clearAfter === c
                                                    ? 'bg-[#ffe4e6] text-[#be123c] ring-1 ring-[#fda4af]'
                                                    : 'text-[#3f0d1b]/70 hover:bg-[#fff1f2]',
                                            )}
                                            onClick={() => setClearAfter(c)}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p id={`${uid}-hint`} className={cn('text-sm', valid ? 'font-semibold text-[#be123c]' : 'text-[#3f0d1b]/60')}>
                                {valid ? 'Looking lovely. Ready when you are.' : problem}
                            </p>
                            <button
                                type="submit"
                                disabled={!valid}
                                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e11d48] px-7 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(225,29,72,0.8)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f0d1b] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#fecdd3] disabled:text-white disabled:shadow-none motion-reduce:transition-none"
                            >
                                {mine ? 'Update status' : 'Share status'}
                            </button>
                        </div>
                    </div>
                </form>

                <p role="status" className="mt-4 min-h-6 text-center text-sm font-semibold text-[#be123c]">
                    {status}
                </p>

                <div className="mt-10 flex items-end justify-between gap-4">
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#3f0d1b] sm:text-3xl">Today on Moments</h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f0d1b]/50">{tiles.length} statuses</p>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <AnimatePresence initial={false} mode="popLayout">
                        {tiles.map((t) => {
                            const m = moodById[t.mood]
                            const Icon = m.icon
                            const A = audienceById[t.audience]
                            const AIcon = A.icon
                            const hearted = Boolean(hearts[t.id])
                            return (
                                <motion.li
                                    key={t.mine ? `me-${t.mood}-${t.text}` : t.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        'flex flex-col rounded-[28px] bg-linear-to-br p-5',
                                        m.bg,
                                        t.mine && 'ring-2 ring-[#e11d48] ring-offset-2 ring-offset-[#fff1f2]',
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={t.avatar} alt="" loading="lazy" className="size-9 rounded-full object-cover ring-2 ring-white" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-[#3f0d1b]">{t.name}</p>
                                            <p className="flex items-center gap-1 text-xs text-[#3f0d1b]/65">
                                                <AIcon className="size-3" aria-hidden="true" />
                                                <span>{A.label} · {t.time}</span>
                                            </p>
                                        </div>
                                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/80" aria-hidden="true">
                                            <Icon className={cn('size-5', m.ink)} />
                                        </span>
                                    </div>
                                    <p className="mt-4 flex-1 break-words font-serif text-lg italic leading-snug text-[#3f0d1b]">
                                        “{t.text}”
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#3f0d1b]/60">Feeling {m.label.toLowerCase()}</span>
                                        {t.mine ? (
                                            <button
                                                type="button"
                                                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/80 px-3 text-xs font-bold text-[#be123c] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]"
                                                onClick={clearMine}
                                            >
                                                <PiXBold className="size-3.5" aria-hidden="true" />
                                                Clear
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                aria-pressed={hearted}
                                                aria-label={`${hearted ? 'Remove heart from' : 'Send a heart to'} ${t.name}`}
                                                className={cn(
                                                    'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]',
                                                    hearted ? 'bg-[#e11d48] text-white' : 'bg-white/80 text-[#3f0d1b] hover:bg-white',
                                                )}
                                                onClick={() => toggleHeart(t.id)}
                                            >
                                                <PiHeartBold className="size-3.5" aria-hidden="true" />
                                                <span className="tabular-nums">{t.hearts + (hearted ? 1 : 0)}</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </ul>
            </div>
        </section>
    )
}

export default MoodStatusPostComposer

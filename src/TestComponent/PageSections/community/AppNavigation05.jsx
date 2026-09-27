// FloatingDockAppNavigation

// AppNavigation05 · Social Networks & Communities › Global Navigation & Profile Quick-Access

// Description:
// A mobile-first floating dock for Moments, a pastel photo-sharing app for close friends.
// A glassy pill (Home, Discover, Create, Inbox, Profile) floats over a "Your circle’s
// Sunday" photo board; the big gradient Create button opens a "Create a moment" action
// sheet with Photo, Story and Live. On large screens the dock magnifies icons under the
// cursor. Use it as the bottom navigation of a social or camera-first app.

// Design:
// - Pastel gradient canvas #fdf2f8 → #f5f3ff → #eef2ff, indigo ink #1e1b4b, pink #ec4899
//   → periwinkle #818cf8 gradient on the Create button, active dot and Live chip
// - Dock: white/70 glass pill with backdrop blur, white ring and a soft lilac shadow;
//   48px round items, a 60px raised Create button; photos are rounded-[28px] tiles with
//   alternating slight tilts and white caption chips
// - Heading in font-serif italic text-4xl → lg:text-6xl; action sheet is a white
//   rounded-t-[32px] card with a grab handle and three tinted option rows
// - Motion: dock items grow up to 76px by cursor distance (useMotionValue + useSpring) on
//   lg only; the active dot glides (layoutId); the sheet springs up; reduced motion turns
//   magnification off and uses fades
// - Responsive: board is 2 columns → md:3; the dock is sticky at the bottom of the section
//   on every size so it stays in reach while scrolling

// What it does:
// - active dock tab (home / discover / inbox / profile) swaps the heading and intro;
//   opening Inbox clears its badge
// - Create toggles the action sheet (role="dialog", aria-modal): focus moves to the first
//   option, Tab is trapped, Escape / scrim / Cancel close it and focus returns to Create
// - Photo and Story show a toast for 2.6 s; Live starts a "LIVE 00:00" chip with a
//   1 s counter and an End button (interval and timeouts cleared on unmount)
// - Magnification runs only when (min-width: 1024px) and (hover: hover) match

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FloatingDockAppNavigation from '@/TestComponent/PageSections/community/AppNavigation05';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <FloatingDockAppNavigation />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion';
import { LuCompass, LuHouse, LuImage, LuMessageCircle, LuPlus, LuRadio, LuSparkles, LuX } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const NADIA = 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80'

const moments = [
    {
        id: 'm1',
        src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends hugging on a hill at sunset',
        user: 'lulu.sun',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        ratio: 'aspect-[4/5]',
        tilt: '-rotate-1',
    },
    {
        id: 'm2',
        src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        alt: 'Two lattes on a wooden cafe table',
        user: 'mateo.eats',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        ratio: 'aspect-square',
        tilt: 'rotate-1',
    },
    {
        id: 'm3',
        src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
        alt: 'Colourful houses on a cliffside village above the sea',
        user: 'ines.away',
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
        ratio: 'aspect-[4/5]',
        tilt: 'rotate-[0.6deg]',
    },
    {
        id: 'm4',
        src: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends laughing together with drinks',
        user: 'sam.k',
        avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
        ratio: 'aspect-square',
        tilt: '-rotate-[0.6deg]',
    },
    {
        id: 'm5',
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        alt: 'Calm beach at sunset with soft waves',
        user: 'lulu.sun',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        ratio: 'aspect-[4/5]',
        tilt: 'rotate-1',
    },
    {
        id: 'm6',
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        alt: 'Group of friends sitting above a city view',
        user: 'nadia.m',
        avatar: NADIA,
        ratio: 'aspect-square',
        tilt: '-rotate-1',
    },
]

const headings = {
    home: { eyebrow: 'Sunday, 27 Sep', title: 'Your circle’s Sunday', sub: '6 new moments from 4 friends since breakfast.' },
    discover: { eyebrow: 'Discover', title: 'Circles near you', sub: 'Film photographers, brunch clubs and coast walkers.' },
    inbox: { eyebrow: 'Inbox', title: 'Three new notes', sub: 'Lulu, Mateo and Inès replied to your beach moment.' },
    profile: { eyebrow: '@nadia.m', title: 'Nadia’s moments', sub: '214 friends · 1,208 moments since 2021.' },
}

const actions = [
    { id: 'photo', label: 'Photo', hint: 'Share up to 10 photos', Icon: LuImage, tint: 'bg-[#fce7f3] text-[#be185d]' },
    { id: 'story', label: 'Story', hint: 'Disappears after 24 hours', Icon: LuSparkles, tint: 'bg-[#ede9fe] text-[#6d28d9]' },
    { id: 'live', label: 'Live', hint: 'Go live to 214 friends', Icon: LuRadio, tint: 'bg-[#e0e7ff] text-[#4338ca]' },
]

const pad = (n) => String(n).padStart(2, '0')

function DockItem({ mouseX, enabled, active, label, badge, onClick, children, groupId }) {
    const ref = useRef(null)
    const distance = useTransform(mouseX, (x) => {
        const box = ref.current?.getBoundingClientRect()
        if (!box || !Number.isFinite(x)) return 999
        return x - box.left - box.width / 2
    })
    const target = useTransform(distance, [-150, 0, 150], [48, 76, 48])
    const sizeSpring = useSpring(target, { mass: 0.1, stiffness: 180, damping: 14 })

    return (
        <li className="relative flex flex-col items-center">
            <motion.button
                ref={ref}
                type="button"
                aria-label={badge ? `${label}, ${badge} new` : label}
                aria-current={active ? 'page' : undefined}
                style={enabled ? { width: sizeSpring, height: sizeSpring } : undefined}
                className={cn(
                    'relative grid size-12 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#818cf8]',
                    active ? 'bg-white text-[#1e1b4b] shadow-[0_6px_18px_-8px_rgba(129,140,248,0.8)]' : 'text-[#6366f1]/70 hover:text-[#1e1b4b]',
                )}
                onClick={onClick}
            >
                {children}
                {badge > 0 && (
                    <span
                        aria-hidden="true"
                        className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#ec4899] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
                    >
                        {badge}
                    </span>
                )}
            </motion.button>
            {active && (
                <motion.span
                    layoutId={`${groupId}-dock-dot`}
                    aria-hidden="true"
                    className="absolute -bottom-2 size-1.5 rounded-full bg-linear-to-r from-[#ec4899] to-[#818cf8]"
                />
            )}
        </li>
    )
}

export function FloatingDockAppNavigation({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
    const [isLg, setIsLg] = useState(false)
    const [active, setActive] = useState('home')
    const [inbox, setInbox] = useState(3)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [toast, setToast] = useState('')
    const [live, setLive] = useState(false)
    const [liveSeconds, setLiveSeconds] = useState(0)
    const createRef = useRef(null)
    const sheetRef = useRef(null)

    const magnify = isLg && !reduceMotion
    const heading = headings[active]

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px) and (hover: hover)')
        const update = () => setIsLg(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        if (!toast) return undefined
        const id = setTimeout(() => setToast(''), 2600)
        return () => clearTimeout(id)
    }, [toast])

    useEffect(() => {
        if (!live) return undefined
        const id = setInterval(() => setLiveSeconds((s) => s + 1), 1000)
        return () => clearInterval(id)
    }, [live])

    useEffect(() => {
        if (!sheetOpen) return undefined
        sheetRef.current?.querySelector('button')?.focus()
        const onKey = (event) => {
            if (event.key !== 'Escape') return
            setSheetOpen(false)
            createRef.current?.focus()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [sheetOpen])

    const closeSheet = () => {
        setSheetOpen(false)
        createRef.current?.focus()
    }

    const trapFocus = (event) => {
        if (event.key !== 'Tab') return
        const focusables = Array.from(sheetRef.current?.querySelectorAll('button') ?? [])
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
        }
    }

    const choose = (id) => {
        closeSheet()
        if (id === 'photo') setToast('Photo picker opened · choose up to 10')
        if (id === 'story') setToast('Story camera is ready')
        if (id === 'live') {
            setLiveSeconds(0)
            setLive(true)
            setToast('You’re live to 214 friends')
        }
    }

    const selectTab = (id) => {
        setActive(id)
        if (id === 'inbox') setInbox(0)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-linear-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eef2ff] text-base font-normal text-[#1e1b4b]',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-[#fbcfe8]/60 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-1/2 size-80 rounded-full bg-[#c7d2fe]/60 blur-3xl"
            />

            <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 md:pt-12 lg:px-8">
                <div className="flex items-center justify-between gap-3">
                    <a
                        href="#moments-home"
                        className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#818cf8]"
                    >
                        <span aria-hidden="true" className="relative size-8">
                            <span className="absolute inset-0 rounded-full bg-linear-to-br from-[#f9a8d4] to-[#a5b4fc]" />
                            <span className="absolute inset-[7px] rounded-full bg-white" />
                            <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-[#ec4899]" />
                        </span>
                        <span className="font-serif text-2xl italic tracking-tight text-[#1e1b4b]">moments</span>
                    </a>
                    <AnimatePresence>
                        {live && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2 rounded-full bg-white/80 py-1 pl-3 pr-1 shadow-sm ring-1 ring-white backdrop-blur"
                            >
                                <span className="relative flex size-2.5">
                                    <span className="absolute inset-0 animate-ping rounded-full bg-[#ec4899] opacity-70 motion-reduce:animate-none" />
                                    <span className="relative size-2.5 rounded-full bg-[#ec4899]" />
                                </span>
                                <span className="font-mono text-xs font-bold tabular-nums text-[#be185d]" role="timer" aria-label={`Live for ${liveSeconds} seconds`}>
                                    LIVE {pad(Math.floor(liveSeconds / 60))}:{pad(liveSeconds % 60)}
                                </span>
                                <button
                                    type="button"
                                    className="min-h-8 rounded-full bg-[#1e1b4b] px-3 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#818cf8]"
                                    onClick={() => {
                                        setLive(false)
                                        setToast(`Live ended after ${liveSeconds} s`)
                                    }}
                                >
                                    End
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                        transition={{ duration: 0.22 }}
                        className="mt-10 md:mt-14"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db2777]">{heading.eyebrow}</p>
                        <h2 className="mt-3 font-serif text-4xl font-normal italic leading-[1.02] tracking-tight text-[#1e1b4b] sm:text-5xl lg:text-6xl">
                            {heading.title}
                        </h2>
                        <p className="mt-3 max-w-md text-base leading-relaxed text-[#4338ca]/70">{heading.sub}</p>
                    </motion.div>
                </AnimatePresence>

                <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
                    {moments.map((m, index) => (
                        <li key={m.id} className={cn('transition-transform duration-500 hover:rotate-0', m.tilt, index % 3 === 1 && 'md:translate-y-8')}>
                            <figure className="relative overflow-hidden rounded-[28px] bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(99,102,241,0.55)]">
                                <img
                                    src={m.src}
                                    alt={m.alt}
                                    loading="lazy"
                                    className={cn('w-full rounded-[22px] object-cover', m.ratio)}
                                />
                                <figcaption className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/85 py-1 pl-1 pr-2.5 text-[11px] font-semibold text-[#1e1b4b] backdrop-blur">
                                    <img src={m.avatar} alt="" loading="lazy" className="size-5 shrink-0 rounded-full object-cover" />
                                    <span className="truncate">@{m.user}</span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pointer-events-none sticky bottom-4 z-30 flex flex-col items-center gap-3 px-4 pb-6 sm:bottom-6">
                <AnimatePresence>
                    {toast && (
                        <motion.p
                            key={toast}
                            aria-hidden="true"
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-full bg-[#1e1b4b] px-4 py-2 text-center text-xs font-semibold text-white shadow-lg"
                        >
                            {toast}
                        </motion.p>
                    )}
                </AnimatePresence>

                <LayoutGroup id={baseId}>
                    <nav
                        aria-label="Moments"
                        className="pointer-events-auto rounded-full bg-white/70 px-3 py-2.5 shadow-[0_24px_60px_-20px_rgba(129,140,248,0.65)] ring-1 ring-white backdrop-blur-xl"
                        onMouseMove={(event) => {
                            if (magnify) mouseX.set(event.clientX)
                        }}
                        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
                    >
                        <ul className="flex items-end gap-2 sm:gap-3">
                            <DockItem mouseX={mouseX} enabled={magnify} groupId={baseId} active={active === 'home'} label="Home" onClick={() => selectTab('home')}>
                                <LuHouse aria-hidden="true" className="size-[45%]" />
                            </DockItem>
                            <DockItem mouseX={mouseX} enabled={magnify} groupId={baseId} active={active === 'discover'} label="Discover" onClick={() => selectTab('discover')}>
                                <LuCompass aria-hidden="true" className="size-[45%]" />
                            </DockItem>
                            <li className="px-1">
                                <button
                                    ref={createRef}
                                    type="button"
                                    aria-label={sheetOpen ? 'Close create menu' : 'Create a moment'}
                                    aria-haspopup="dialog"
                                    aria-expanded={sheetOpen}
                                    className="-mt-6 grid size-[60px] place-items-center rounded-full bg-linear-to-br from-[#ec4899] via-[#c084fc] to-[#818cf8] text-white shadow-[0_14px_30px_-10px_rgba(236,72,153,0.8)] ring-4 ring-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#818cf8] motion-reduce:transition-none motion-reduce:hover:scale-100"
                                    onClick={() => (sheetOpen ? closeSheet() : setSheetOpen(true))}
                                >
                                    <LuPlus
                                        aria-hidden="true"
                                        className={cn('size-7 transition-transform duration-300', sheetOpen && 'rotate-45')}
                                    />
                                </button>
                            </li>
                            <DockItem mouseX={mouseX} enabled={magnify} groupId={baseId} active={active === 'inbox'} label="Inbox" badge={inbox} onClick={() => selectTab('inbox')}>
                                <LuMessageCircle aria-hidden="true" className="size-[45%]" />
                            </DockItem>
                            <DockItem mouseX={mouseX} enabled={magnify} groupId={baseId} active={active === 'profile'} label="Profile" onClick={() => selectTab('profile')}>
                                <img src={NADIA} alt="" className="size-[78%] rounded-full object-cover" />
                            </DockItem>
                        </ul>
                    </nav>
                </LayoutGroup>
            </div>

            <p aria-live="polite" className="sr-only">
                {toast}
            </p>

            <AnimatePresence>
                {sheetOpen && (
                    <>
                        <motion.div
                            key="scrim"
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-[#1e1b4b]/25 backdrop-blur-sm"
                            onClick={closeSheet}
                        />
                        <motion.div
                            key="sheet"
                            ref={sheetRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${baseId}-sheet-title`}
                            initial={{ y: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
                            transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 36 }}
                            className="fixed inset-x-0 bottom-0 z-[61] mx-auto w-full max-w-md rounded-t-[32px] bg-white px-4 pb-6 pt-3 shadow-[0_-20px_60px_-20px_rgba(99,102,241,0.5)] sm:px-6"
                            onKeyDown={trapFocus}
                        >
                            <span aria-hidden="true" className="mx-auto block h-1.5 w-12 rounded-full bg-[#e0e7ff]" />
                            <div className="mt-4 flex items-center justify-between">
                                <h3 id={`${baseId}-sheet-title`} className="font-serif text-2xl font-normal italic text-[#1e1b4b]">
                                    Create a moment
                                </h3>
                            </div>
                            <ul className="mt-4 space-y-2">
                                {actions.map((a) => (
                                    <li key={a.id}>
                                        <button
                                            type="button"
                                            className="flex min-h-16 w-full items-center gap-4 rounded-2xl px-3 text-left transition-colors hover:bg-[#f5f3ff] focus-visible:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-[#818cf8]"
                                            onClick={() => choose(a.id)}
                                        >
                                            <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', a.tint)}>
                                                <a.Icon aria-hidden="true" className="size-6" />
                                            </span>
                                            <span>
                                                <span className="block text-base font-semibold text-[#1e1b4b]">{a.label}</span>
                                                <span className="block text-sm text-[#6366f1]/70">{a.hint}</span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f5f3ff] text-sm font-semibold text-[#4338ca] hover:bg-[#ede9fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#818cf8]"
                                onClick={closeSheet}
                            >
                                <LuX aria-hidden="true" className="size-4" />
                                Cancel
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    )
}

export default FloatingDockAppNavigation

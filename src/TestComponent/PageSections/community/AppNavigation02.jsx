// IconRailAppNavigation

// AppNavigation02 · Social Networks & Communities › Global Navigation & Profile Quick-Access

// Description:
// A dark, focused app shell for Loop, a community app built around shared "spaces". A
// slim left icon rail (Home, Explore, Spaces, Inbox, Saved, Settings) shows a tooltip on
// hover or focus and slides a violet active pill between items; the content pane beside it
// swaps to a "Your loop" / "Explore" / "Spaces" placeholder with skeleton cards. On phones
// the rail becomes a sticky bottom tab bar. Use it as the primary navigation of a web app.

// Design:
// - Near-black #0f0f14 canvas, rail #131319 with a white/5 hairline, zinc #a1a1aa icons,
//   electric violet #7c3aed for the active pill, left marker bar, badges and glows
// - Rail is 84px wide with 48px rounded-2xl targets; white tooltips with a caret slide in
//   from the left on hover / focus-visible; logo is an SVG pair of linked rings
// - Content pane: mono breadcrumb, text-4xl → lg:text-6xl heading, violet radial glow and
//   glassy skeleton cards (animate-pulse lines) in a 1 → sm:2 → xl:3 column grid
// - Active pill and marker use framer-motion layoutId springs (instant when reduced
//   motion); pane content cross-fades on tab change
// - Responsive: base / sm use a sticky bottom tab bar (5 tabs, 64px tall) and a compact
//   top header with logo and avatar; md and up show the vertical rail instead

// What it does:
// - active state (home / explore / spaces / inbox / saved / settings) is set from the rail
//   or the tab bar; aria-current="page" marks the active item
// - Opening Inbox clears its unread badge (5); Arrow Up / Down on the rail and Arrow Left /
//   Right on the tab bar move focus between items
// - The controlled "Filter this view" field narrows the pane's cards and shows an empty
//   note when nothing matches
// - Tooltips are visual only (buttons carry aria-label); "New loop" and the avatar link to
//   #loop-new and #loop-profile

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IconRailAppNavigation from '@/TestComponent/PageSections/community/AppNavigation02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <IconRailAppNavigation />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { LuBookmark, LuCompass, LuHouse, LuInbox, LuLayers, LuPlus, LuSearch, LuSettings } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AVATAR = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80'

const items = [
    { id: 'home', label: 'Home', Icon: LuHouse, hint: 'G H' },
    { id: 'explore', label: 'Explore', Icon: LuCompass, hint: 'G E' },
    { id: 'spaces', label: 'Spaces', Icon: LuLayers, hint: 'G S' },
    { id: 'inbox', label: 'Inbox', Icon: LuInbox, hint: 'G I' },
    { id: 'saved', label: 'Saved', Icon: LuBookmark, hint: 'G B' },
]

const settingsItem = { id: 'settings', label: 'Settings', Icon: LuSettings, hint: ',' }

const panes = {
    home: {
        eyebrow: 'loop / home',
        title: 'Your loop',
        sub: '14 updates from 6 spaces since yesterday evening.',
        cards: ['Synth Club · 4 new clips', 'Type Nerds · weekly crit', 'Loop HQ · changelog 3.2'],
    },
    explore: {
        eyebrow: 'loop / explore',
        title: 'Explore',
        sub: 'Trending loops in design, audio and indie games.',
        cards: ['#modular-synths', '#pixel-art-sunday', '#field-recording'],
    },
    spaces: {
        eyebrow: 'loop / spaces',
        title: 'Spaces',
        sub: 'You belong to 8 spaces · 2 have live rooms right now.',
        cards: ['Synth Club · 2.1k members', 'Type Nerds · 940 members', 'Night Shift · 312 members'],
    },
    inbox: {
        eyebrow: 'loop / inbox',
        title: 'Inbox',
        sub: 'Replies, mentions and DMs, newest first.',
        cards: ['Rae Lindqvist replied', 'Mention in #crit-room', 'Kofi Mensah sent a clip'],
    },
    saved: {
        eyebrow: 'loop / saved',
        title: 'Saved',
        sub: '31 posts saved for later, sorted by space.',
        cards: ['Kerning cheat sheet', 'Tape delay presets', 'Crit-room etiquette'],
    },
    settings: {
        eyebrow: 'loop / settings',
        title: 'Settings',
        sub: 'Profile, notifications, privacy and connected apps.',
        cards: ['Profile & handle', 'Notifications', 'Privacy & blocking'],
    },
}

function LoopMark({ className }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            <circle cx="15" cy="20" r="9" fill="none" stroke="#7c3aed" strokeWidth="4" />
            <circle cx="25" cy="20" r="9" fill="none" stroke="#c4b5fd" strokeWidth="4" />
            <path d="M15 11a9 9 0 0 1 9 5" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
        </svg>
    )
}

function moveFocus(event, keys) {
    if (!keys.includes(event.key)) return
    const buttons = Array.from(event.currentTarget.querySelectorAll('button[data-nav-item]'))
    const index = buttons.indexOf(document.activeElement)
    if (index < 0) return
    event.preventDefault()
    const step = event.key === keys[1] ? 1 : -1
    buttons[(index + step + buttons.length) % buttons.length].focus()
}

export function IconRailAppNavigation({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const groupId = useId()
    const [active, setActive] = useState('home')
    const [inboxCount, setInboxCount] = useState(5)
    const [query, setQuery] = useState('')

    const spring = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 36 }
    const pane = panes[active]
    const cards = pane.cards.filter((card) => card.toLowerCase().includes(query.trim().toLowerCase()))

    const select = (id) => {
        setActive(id)
        if (id === 'inbox') setInboxCount(0)
    }

    const railButton = (item) => {
        const isActive = active === item.id
        const count = item.id === 'inbox' ? inboxCount : 0
        return (
            <li key={item.id} className="relative">
                {isActive && (
                    <motion.span
                        layoutId="loop-rail-marker"
                        transition={spring}
                        aria-hidden="true"
                        className="absolute -left-[18px] top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#7c3aed] shadow-[0_0_16px_#7c3aed]"
                    />
                )}
                <button
                    type="button"
                    data-nav-item
                    aria-label={count ? `${item.label}, ${count} unread` : item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                        'group relative grid size-12 place-items-center rounded-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]',
                        isActive ? 'text-white' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white',
                    )}
                    onClick={() => select(item.id)}
                >
                    {isActive && (
                        <motion.span
                            layoutId="loop-rail-pill"
                            transition={spring}
                            aria-hidden="true"
                            className="absolute inset-0 rounded-2xl bg-[#7c3aed]/25 ring-1 ring-inset ring-[#7c3aed]/60"
                        />
                    )}
                    <item.Icon aria-hidden="true" className="relative size-[22px]" />
                    {count > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#7c3aed] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#131319]"
                        >
                            {count}
                        </span>
                    )}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-full top-1/2 z-20 ml-4 flex -translate-x-1 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0f0f14] opacity-0 shadow-[0_10px_30px_-10px_rgba(124,58,237,0.6)] transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    >
                        <span className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-white" />
                        {item.label}
                        <kbd className="rounded bg-[#ede9fe] px-1 font-mono text-[10px] font-medium text-[#5b21b6]">
                            {item.hint}
                        </kbd>
                    </span>
                </button>
            </li>
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-clip bg-[#0f0f14] text-base font-normal text-[#e4e4e7]', className)}
            {...props}
        >
            <LayoutGroup id={groupId}>
                <div className="flex min-h-[640px]">
                    <nav
                        aria-label="Loop"
                        className="relative z-10 hidden w-[84px] shrink-0 flex-col items-center border-r border-white/5 bg-[#131319] py-5 md:flex"
                        onKeyDown={(event) => moveFocus(event, ['ArrowUp', 'ArrowDown'])}
                    >
                        <a
                            href="#loop-home"
                            aria-label="Loop home"
                            className="grid size-12 place-items-center rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                        >
                            <LoopMark className="size-9" />
                        </a>
                        <a
                            href="#loop-new"
                            aria-label="New loop"
                            className="mt-4 grid size-11 place-items-center rounded-xl bg-[#7c3aed] text-white shadow-[0_8px_24px_-8px_#7c3aed] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                        >
                            <LuPlus aria-hidden="true" className="size-5" />
                        </a>
                        <span aria-hidden="true" className="my-5 h-px w-8 bg-white/10" />
                        <ul className="flex flex-col gap-2">{items.map(railButton)}</ul>
                        <ul className="mt-auto flex flex-col items-center gap-3 pt-6">
                            {railButton(settingsItem)}
                            <li>
                                <a
                                    href="#loop-profile"
                                    aria-label="Your profile, Theo Brandt"
                                    className="block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                                >
                                    <img
                                        src={AVATAR}
                                        alt=""
                                        loading="lazy"
                                        className="size-10 rounded-full object-cover ring-2 ring-[#7c3aed]/70"
                                    />
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="relative min-w-0 flex-1">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[520px] max-w-full rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.35),transparent)] blur-2xl"
                        />

                        <div className="relative flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-6 md:hidden">
                            <a
                                href="#loop-home"
                                className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                            >
                                <LoopMark className="size-8" />
                                <span className="text-lg font-bold tracking-tight text-white">loop</span>
                            </a>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Settings"
                                    aria-current={active === 'settings' ? 'page' : undefined}
                                    className={cn(
                                        'grid size-10 place-items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]',
                                        active === 'settings' ? 'bg-[#7c3aed]/25 text-white' : 'text-[#a1a1aa]',
                                    )}
                                    onClick={() => select('settings')}
                                >
                                    <LuSettings aria-hidden="true" className="size-5" />
                                </button>
                                <img
                                    src={AVATAR}
                                    alt="Theo Brandt"
                                    loading="lazy"
                                    className="size-9 rounded-full object-cover ring-2 ring-[#7c3aed]/70"
                                />
                            </div>
                        </div>

                        <div className="relative px-4 pb-10 pt-8 sm:px-6 md:px-10 md:pt-10 lg:px-14">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <label className="relative flex h-11 w-full max-w-xs items-center rounded-xl border border-white/10 bg-white/[0.03] sm:w-72">
                                    <span className="sr-only">Filter cards in this view</span>
                                    <LuSearch aria-hidden="true" className="absolute left-3.5 size-4 text-[#71717a]" />
                                    <input
                                        type="search"
                                        value={query}
                                        placeholder="Filter this view"
                                        className="h-full w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]"
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </label>
                                <div className="flex items-center gap-3 text-xs text-[#a1a1aa]">
                                    <span className="relative flex size-2">
                                        <span className="absolute inset-0 animate-ping rounded-full bg-[#a78bfa] opacity-60 motion-reduce:animate-none" />
                                        <span className="relative size-2 rounded-full bg-[#a78bfa]" />
                                    </span>
                                    218 people looping now
                                </div>
                            </div>

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-[#a78bfa]">
                                        {pane.eyebrow}
                                    </p>
                                    <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                                        {pane.title}
                                    </h2>
                                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#a1a1aa] sm:text-base">
                                        {pane.sub}
                                    </p>

                                    {cards.length === 0 && (
                                        <p className="mt-8 rounded-2xl border border-dashed border-white/10 p-6 text-sm text-[#a1a1aa]">
                                            Nothing in {pane.title} matches “{query.trim()}”.
                                        </p>
                                    )}
                                    <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {cards.map((card, index) => (
                                            <li
                                                key={card}
                                                className={cn(
                                                    'rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur',
                                                    index === 0 && 'sm:col-span-2 xl:col-span-1',
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'size-9 rounded-xl',
                                                            index === 0 && 'bg-linear-to-br from-[#7c3aed] to-[#c4b5fd]',
                                                            index === 1 && 'bg-linear-to-br from-[#4c1d95] to-[#7c3aed]',
                                                            index === 2 && 'bg-linear-to-br from-[#27272a] to-[#52525b]',
                                                        )}
                                                    />
                                                    <p className="text-sm font-semibold text-white">{card}</p>
                                                </div>
                                                <div aria-hidden="true" className="mt-5 space-y-2.5">
                                                    <span className="block h-2.5 w-11/12 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
                                                    <span className="block h-2.5 w-3/4 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
                                                    <span className="block h-2.5 w-1/2 animate-pulse rounded-full bg-white/[0.06] motion-reduce:animate-none" />
                                                </div>
                                                <div aria-hidden="true" className="mt-5 h-24 rounded-xl bg-linear-to-br from-white/[0.06] to-transparent" />
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <nav
                    aria-label="Loop tabs"
                    className="sticky bottom-0 z-20 border-t border-white/10 bg-[#131319]/95 backdrop-blur md:hidden"
                    onKeyDown={(event) => moveFocus(event, ['ArrowLeft', 'ArrowRight'])}
                >
                    <ul className="mx-auto grid h-16 max-w-md grid-cols-5 px-2">
                        {items.map((item) => {
                            const isActive = active === item.id
                            const count = item.id === 'inbox' ? inboxCount : 0
                            return (
                                <li key={item.id} className="flex">
                                    <button
                                        type="button"
                                        data-nav-item
                                        aria-label={count ? `${item.label}, ${count} unread` : item.label}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={cn(
                                            'relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#a78bfa]',
                                            isActive ? 'text-white' : 'text-[#71717a]',
                                        )}
                                        onClick={() => select(item.id)}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="loop-tab-pill"
                                                transition={spring}
                                                aria-hidden="true"
                                                className="absolute top-1.5 h-8 w-12 rounded-full bg-[#7c3aed]/30"
                                            />
                                        )}
                                        <span className="relative mt-0.5">
                                            <item.Icon aria-hidden="true" className="size-5" />
                                            {count > 0 && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#7c3aed] px-1 text-[10px] font-bold leading-none text-white"
                                                >
                                                    {count}
                                                </span>
                                            )}
                                        </span>
                                        <span className="relative">{item.label}</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </LayoutGroup>
        </section>
    )
}

export default IconRailAppNavigation

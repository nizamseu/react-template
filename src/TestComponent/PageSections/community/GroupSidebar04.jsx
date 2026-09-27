// PinnedSpacesGroupSidebar

// GroupSidebar04 · Social Networks & Communities › Community / Group Sidebar

// Description:
// A dark, glassy spaces sidebar for the team-community app Loop. Under "Your loops, in your
// order." pinned spaces (Product Squad, Design Crit, Eng — Platform…) can be dragged into
// any order with framer-motion Reorder or moved with the keyboard, muted per space, unpinned
// and filtered; an "All spaces" block pins more (up to six). The right pane shows the
// selected space with its stats and recent threads. Use it for workspace or club apps.

// Design:
// - lg:grid-cols-[22rem_1fr]: a floating glass sidebar + space detail; stacked below lg
// - Ink #0f0f14 section with a violet #7c3aed radial glow, glass panels #17171f/80 with
//   white/8 borders, text #ededf5 / #8a8aa3, lilac #a78bfa highlights; each space has a
//   two-tone gradient monogram tile
// - Light-weight + bold mixed heading (text-4xl → lg:text-6xl); rows are 56px rounded-2xl
//   with a six-dot drag handle, mono unread counts and 40px icon buttons
// - Dragged rows lift with a violet shadow and slight scale; reorders and section collapses
//   animate (layout transitions switch to instant for reduced motion)
// - Detail pane: huge monogram, text-3xl → sm:text-5xl name, stat tiles grid-cols-3

// What it does:
// - pinned[] order changes by dragging the handle (Reorder.Group, pointer + touch) or by
//   focusing the handle and pressing ↑ / ↓; each move is announced ("moved to 2 of 5")
// - Mute toggles (aria-pressed) dim a space and hide its unread count; the pin button
//   unpins, and "All spaces" pins more (disabled at 6); selecting a space clears its count
// - The filter narrows both lists; while filtering, dragging is paused with a note; both
//   section headers collapse (aria-expanded); "Open space" links to #space-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PinnedSpacesGroupSidebar from '@/TestComponent/PageSections/community/GroupSidebar04';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <PinnedSpacesGroupSidebar />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, Reorder, motion, useDragControls, useReducedMotion } from 'framer-motion';
import {
    PiBellSimpleBold,
    PiBellSimpleSlashBold,
    PiCaretDownBold,
    PiDotsSixVerticalBold,
    PiMagnifyingGlassBold,
    PiPushPinBold,
    PiPushPinSlashBold,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const MAX_PINNED = 6

const spaces = {
    product: {
        name: 'Product Squad',
        mono: 'PS',
        tint: 'from-[#7c3aed] to-[#c084fc]',
        members: 24,
        online: 9,
        unread: 7,
        about: 'Roadmap calls, spec reviews and the weekly “what did we ship” round-up.',
        threads: [
            { title: 'Q4 roadmap: final cut before Friday', who: 'Imani', time: '12 min' },
            { title: 'Should onboarding v2 ship behind a flag?', who: 'Karl', time: '1 h' },
        ],
    },
    crit: {
        name: 'Design Crit',
        mono: 'DC',
        tint: 'from-[#db2777] to-[#f472b6]',
        members: 17,
        online: 4,
        unread: 3,
        about: 'Tuesday and Thursday crits. Post a frame, get three honest notes.',
        threads: [
            { title: 'Settings page — density pass', who: 'Yara', time: '25 min' },
            { title: 'Empty states: illustration or copy only?', who: 'Tom', time: '3 h' },
        ],
    },
    eng: {
        name: 'Eng — Platform',
        mono: 'EP',
        tint: 'from-[#0891b2] to-[#22d3ee]',
        members: 41,
        online: 16,
        unread: 12,
        about: 'Infra, CI and the on-call hand-off. Incidents get their own thread.',
        threads: [
            { title: 'CI queue times down 38% after cache change', who: 'Ola', time: '8 min' },
            { title: 'On-call hand-off notes — week 39', who: 'Rafa', time: '2 h' },
        ],
    },
    launch: {
        name: 'Launch Room · Q4',
        mono: 'LR',
        tint: 'from-[#d97706] to-[#fbbf24]',
        members: 32,
        online: 7,
        unread: 1,
        about: 'Everything for the 14 October launch: checklists, copy and go/no-go.',
        threads: [
            { title: 'Go / no-go checklist v3', who: 'Priya', time: '40 min' },
            { title: 'Press embargo lifts 09:00 PT', who: 'Dana', time: 'Yesterday' },
        ],
    },
    random: {
        name: 'Random & Memes',
        mono: 'R!',
        tint: 'from-[#65a30d] to-[#a3e635]',
        members: 118,
        online: 33,
        unread: 42,
        about: 'Office dogs, lunch spots and the occasional very good gif.',
        threads: [
            { title: 'Biscuit the corgi has a new raincoat', who: 'June', time: '5 min' },
            { title: 'Best ramen within 10 minutes of the office?', who: 'Leo', time: '1 h' },
        ],
    },
    research: {
        name: 'User Research',
        mono: 'UR',
        tint: 'from-[#2563eb] to-[#60a5fa]',
        members: 12,
        online: 2,
        unread: 0,
        about: 'Interview notes, recruiting and the insight wall.',
        threads: [
            { title: '6 interviews on the new billing flow — notes', who: 'Mina', time: '4 h' },
            { title: 'Recruiting power users for October', who: 'Sol', time: '2 d' },
        ],
    },
    offsite: {
        name: 'Offsite Lisbon 2026',
        mono: 'OL',
        tint: 'from-[#ea580c] to-[#fb923c]',
        members: 58,
        online: 5,
        unread: 0,
        about: 'Flights, rooms and the agenda for 9–12 November.',
        threads: [
            { title: 'Room list is final — check your roommate', who: 'Ana', time: '6 h' },
            { title: 'Day 2 workshop signup', who: 'Rui', time: '1 d' },
        ],
    },
    books: {
        name: 'Book Club',
        mono: 'BC',
        tint: 'from-[#e11d48] to-[#fb7185]',
        members: 19,
        online: 1,
        unread: 0,
        about: 'One book a month, one long lunch to argue about it.',
        threads: [
            { title: 'October pick: “The Design of Everyday Things”', who: 'Nell', time: '3 d' },
            { title: 'Audiobook or paper? (poll)', who: 'Omar', time: '4 d' },
        ],
    },
}

const allIds = Object.keys(spaces)

function Monogram({ space, className }) {
    return (
        <span
            className={cn('grid shrink-0 place-items-center bg-linear-to-br font-black tracking-tight text-white', space.tint, className)}
            aria-hidden="true"
        >
            {space.mono}
        </span>
    )
}

function PinnedRow({ id, index, total, uid, space, active, muted, unread, draggable, reduceMotion, onSelect, onMute, onUnpin, onMove }) {
    const controls = useDragControls()
    const row = (
        <div
            className={cn(
                'relative flex min-h-14 items-center gap-1 rounded-2xl pr-1 transition-colors',
                active ? 'bg-[#7c3aed]/20 ring-1 ring-[#7c3aed]/60' : 'hover:bg-white/[0.04]',
            )}
        >
            <button
                id={`${uid}-handle-${id}`}
                type="button"
                disabled={!draggable}
                aria-label={`Reorder ${space.name}, position ${index + 1} of ${total}. Use arrow up or down.`}
                className="grid h-10 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-[#5b5b73] hover:text-[#a78bfa] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#a78bfa] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
                onPointerDown={(e) => draggable && controls.start(e)}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault()
                        onMove(id, e.key === 'ArrowUp' ? -1 : 1)
                    }
                }}
            >
                <PiDotsSixVerticalBold className="size-5" aria-hidden="true" />
            </button>
            <button
                type="button"
                aria-current={active ? 'true' : undefined}
                className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#a78bfa]"
                onClick={() => onSelect(id)}
            >
                <Monogram space={space} className={cn('size-9 rounded-xl text-xs', muted && 'opacity-40 grayscale')} />
                <span className="min-w-0 flex-1">
                    <span className={cn('block truncate text-sm', muted ? 'text-[#5b5b73]' : unread ? 'font-semibold text-white' : 'text-[#c9c9d9]')}>
                        {space.name}
                    </span>
                    <span className="block truncate text-[11px] text-[#6b6b85]">
                        {muted ? 'Muted' : `${space.online} online`}
                    </span>
                </span>
                {!muted && unread > 0 && (
                    <span className="rounded-full bg-[#7c3aed] px-2 font-mono text-[11px] font-bold leading-5 text-white">
                        {unread > 99 ? '99+' : unread}
                        <span className="sr-only"> unread</span>
                    </span>
                )}
            </button>
            <button
                type="button"
                aria-pressed={muted}
                aria-label={`Mute ${space.name}`}
                className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[#a78bfa]',
                    muted ? 'text-[#f472b6]' : 'text-[#6b6b85] hover:bg-white/5 hover:text-white',
                )}
                onClick={() => onMute(id)}
            >
                {muted ? <PiBellSimpleSlashBold className="size-[18px]" aria-hidden="true" /> : <PiBellSimpleBold className="size-[18px]" aria-hidden="true" />}
            </button>
            <button
                type="button"
                aria-label={`Unpin ${space.name}`}
                className="grid size-10 shrink-0 place-items-center rounded-xl text-[#6b6b85] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#a78bfa]"
                onClick={() => onUnpin(id)}
            >
                <PiPushPinSlashBold className="size-[18px]" aria-hidden="true" />
            </button>
        </div>
    )

    if (!draggable) return <li>{row}</li>

    return (
        <Reorder.Item
            value={id}
            dragListener={false}
            dragControls={controls}
            transition={reduceMotion ? { duration: 0 } : undefined}
            whileDrag={{ scale: reduceMotion ? 1 : 1.03, boxShadow: '0 18px 40px -12px rgba(124,58,237,0.65)' }}
            className="relative rounded-2xl bg-[#17171f]"
        >
            {row}
        </Reorder.Item>
    )
}

export function PinnedSpacesGroupSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()

    const [pinned, setPinned] = useState(['product', 'crit', 'eng', 'launch', 'random'])
    const [muted, setMuted] = useState(['random'])
    const [unread, setUnread] = useState(() => {
        const map = Object.fromEntries(allIds.map((id) => [id, spaces[id].unread]))
        map.crit = 0
        return map
    })
    const [selected, setSelected] = useState('crit')
    const [query, setQuery] = useState('')
    const [openPinned, setOpenPinned] = useState(true)
    const [openAll, setOpenAll] = useState(true)
    const [announce, setAnnounce] = useState('')

    const q = query.trim().toLowerCase()
    const match = (id) => !q || spaces[id].name.toLowerCase().includes(q)
    const pinnedShown = pinned.filter(match)
    const others = allIds.filter((id) => !pinned.includes(id) && match(id))
    const draggable = !q
    const space = spaces[selected]
    const position = pinned.indexOf(selected)
    const isMuted = muted.includes(selected)

    const select = (id) => {
        setSelected(id)
        setUnread((u) => ({ ...u, [id]: 0 }))
    }

    const toggleMute = (id) => {
        const on = !muted.includes(id)
        setMuted((m) => (on ? [...m, id] : m.filter((x) => x !== id)))
        setAnnounce(`${spaces[id].name} ${on ? 'muted' : 'unmuted'}.`)
    }

    const unpin = (id) => {
        setPinned((p) => p.filter((x) => x !== id))
        setAnnounce(`${spaces[id].name} unpinned.`)
    }

    const pin = (id) => {
        if (pinned.length >= MAX_PINNED) return
        setPinned((p) => [...p, id])
        setAnnounce(`${spaces[id].name} pinned at position ${pinned.length + 1}.`)
    }

    const move = (id, delta) => {
        const from = pinned.indexOf(id)
        const to = from + delta
        if (from < 0 || to < 0 || to >= pinned.length) return
        const next = [...pinned]
        next.splice(from, 1)
        next.splice(to, 0, id)
        setPinned(next)
        setAnnounce(`${spaces[id].name} moved to position ${to + 1} of ${next.length}.`)
        requestAnimationFrame(() => document.getElementById(`${uid}-handle-${id}`)?.focus())
    }

    const onReorder = (next) => {
        setPinned(next)
        setAnnounce('Pinned order updated.')
    }

    const collapse = {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: reduceMotion ? 0 : 0.22 },
    }

    const header = (label, count, isOpen, toggle, controls) => (
        <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={controls}
            className="flex min-h-10 w-full items-center gap-2 rounded-lg px-1 text-left focus-visible:outline-2 focus-visible:outline-[#a78bfa]"
            onClick={toggle}
        >
            <PiCaretDownBold
                className={cn('size-3 text-[#6b6b85] transition-transform motion-reduce:transition-none', !isOpen && '-rotate-90')}
                aria-hidden="true"
            />
            <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a8aa3]">{label}</span>
            <span className="font-mono text-[11px] text-[#5b5b73]">{count}</span>
        </button>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f0f14] px-4 py-16 text-base font-normal text-[#ededf5] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(124,58,237,0.28),transparent_70%),radial-gradient(40%_40%_at_90%_80%,rgba(167,139,250,0.12),transparent_70%)]"
            />

            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a78bfa]">Loop · Spaces</p>
                        <h2 className="mt-4 text-4xl font-light leading-[1.02] tracking-tight text-[#ededf5] sm:text-5xl lg:text-6xl">
                            Your loops, <span className="font-bold text-white">in your order.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#8a8aa3]">
                        Drag the six-dot handle to reorder pinned spaces — or focus it and press{' '}
                        <kbd className="rounded bg-white/10 px-1 font-mono text-xs text-white">↑</kbd>{' '}
                        <kbd className="rounded bg-white/10 px-1 font-mono text-xs text-white">↓</kbd>. Mute the noisy ones.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
                    <aside
                        aria-label="Spaces"
                        className="min-w-0 self-start rounded-[28px] border border-white/[0.08] bg-[#17171f]/80 p-3 shadow-[0_30px_80px_-40px_rgba(124,58,237,0.6)] backdrop-blur sm:p-4"
                    >
                        <label htmlFor={`${uid}-q`} className="sr-only">
                            Filter spaces
                        </label>
                        <div className="relative">
                            <PiMagnifyingGlassBold
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6b6b85]"
                                aria-hidden="true"
                            />
                            <input
                                id={`${uid}-q`}
                                type="search"
                                value={query}
                                placeholder="Filter spaces"
                                className="min-h-11 w-full rounded-2xl border border-white/[0.08] bg-[#0f0f14] pl-10 pr-3 text-sm text-white placeholder:text-[#5b5b73] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#7c3aed]"
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="mt-4">
                            {header(`Pinned · ${pinned.length}/${MAX_PINNED}`, '', openPinned, () => setOpenPinned((v) => !v), `${uid}-pinned`)}
                            <AnimatePresence initial={false}>
                                {openPinned && (
                                    <motion.div key="pinned" id={`${uid}-pinned`} {...collapse} className="overflow-hidden">
                                        {!draggable && pinnedShown.length > 0 && (
                                            <p className="px-2 pb-1 text-[11px] text-[#8a8aa3]">Clear the filter to reorder.</p>
                                        )}
                                        {draggable ? (
                                            <Reorder.Group axis="y" values={pinned} className="mt-1 space-y-1" onReorder={onReorder}>
                                                {pinned.map((id, i) => (
                                                    <PinnedRow
                                                        key={id}
                                                        draggable
                                                        id={id}
                                                        index={i}
                                                        total={pinned.length}
                                                        uid={uid}
                                                        space={spaces[id]}
                                                        active={selected === id}
                                                        muted={muted.includes(id)}
                                                        unread={unread[id]}
                                                        reduceMotion={reduceMotion}
                                                        onSelect={select}
                                                        onMute={toggleMute}
                                                        onUnpin={unpin}
                                                        onMove={move}
                                                    />
                                                ))}
                                            </Reorder.Group>
                                        ) : (
                                            <ul className="mt-1 space-y-1">
                                                {pinnedShown.map((id) => (
                                                    <PinnedRow
                                                        key={id}
                                                        id={id}
                                                        index={pinned.indexOf(id)}
                                                        total={pinned.length}
                                                        uid={uid}
                                                        space={spaces[id]}
                                                        active={selected === id}
                                                        muted={muted.includes(id)}
                                                        unread={unread[id]}
                                                        draggable={false}
                                                        reduceMotion={reduceMotion}
                                                        onSelect={select}
                                                        onMute={toggleMute}
                                                        onUnpin={unpin}
                                                        onMove={move}
                                                    />
                                                ))}
                                            </ul>
                                        )}
                                        {pinnedShown.length === 0 && (
                                            <p className="px-2 py-3 text-sm text-[#6b6b85]">{q ? 'No pinned spaces match.' : 'Pin a space below to keep it here.'}</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-4 border-t border-white/[0.06] pt-4">
                            {header('All spaces', others.length, openAll, () => setOpenAll((v) => !v), `${uid}-all`)}
                            <AnimatePresence initial={false}>
                                {openAll && (
                                    <motion.div key="all" id={`${uid}-all`} {...collapse} className="overflow-hidden">
                                        <ul className="mt-1 space-y-1">
                                            {others.map((id) => (
                                                <li key={id} className="flex items-center gap-1 rounded-2xl pl-2 hover:bg-white/[0.03]">
                                                    <button
                                                        type="button"
                                                        aria-current={selected === id ? 'true' : undefined}
                                                        className={cn(
                                                            'flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-[#a78bfa]',
                                                            selected === id ? 'text-white' : 'text-[#8a8aa3]',
                                                        )}
                                                        onClick={() => select(id)}
                                                    >
                                                        <Monogram space={spaces[id]} className="size-8 rounded-lg text-[10px] opacity-80" />
                                                        <span className="min-w-0 flex-1 truncate text-sm">{spaces[id].name}</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={pinned.length >= MAX_PINNED}
                                                        aria-label={`Pin ${spaces[id].name}`}
                                                        title={pinned.length >= MAX_PINNED ? 'Six pinned spaces max' : 'Pin'}
                                                        className="grid size-10 shrink-0 place-items-center rounded-xl text-[#a78bfa] transition-colors hover:bg-[#7c3aed]/20 focus-visible:outline-2 focus-visible:outline-[#a78bfa] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                                        onClick={() => pin(id)}
                                                    >
                                                        <PiPushPinBold className="size-[18px]" aria-hidden="true" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        {others.length === 0 && (
                                            <p className="px-2 py-3 text-sm text-[#6b6b85]">{q ? 'Nothing else matches.' : 'Every space is pinned.'}</p>
                                        )}
                                        {pinned.length >= MAX_PINNED && others.length > 0 && (
                                            <p className="px-2 pt-1 text-[11px] text-[#8a8aa3]">Six pinned max — unpin one to add another.</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </aside>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.article
                            key={selected}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            className="min-w-0 rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8"
                        >
                            <div className="flex flex-wrap items-start gap-5">
                                <Monogram space={space} className={cn('size-20 rounded-3xl text-2xl sm:size-24 sm:text-3xl', isMuted && 'grayscale')} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[#7c3aed]/20 px-2.5 py-1 font-mono text-[11px] font-bold text-[#c4b5fd]">
                                            {position >= 0 ? `Pinned #${position + 1}` : 'Not pinned'}
                                        </span>
                                        {isMuted && (
                                            <span className="rounded-full bg-[#f472b6]/15 px-2.5 py-1 font-mono text-[11px] font-bold text-[#f9a8d4]">Muted</span>
                                        )}
                                    </div>
                                    <h3 className="mt-3 break-words text-3xl font-bold tracking-tight text-white sm:text-5xl">{space.name}</h3>
                                    <p className="mt-3 max-w-xl text-base leading-relaxed text-[#8a8aa3]">{space.about}</p>
                                </div>
                            </div>

                            <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                                {[
                                    ['Members', space.members],
                                    ['Online', space.online],
                                    ['Unread', isMuted ? '—' : unread[selected]],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl border border-white/[0.06] bg-[#17171f] p-3 sm:p-4">
                                        <dt className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b85]">{label}</dt>
                                        <dd className="mt-1 font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">{value}</dd>
                                    </div>
                                ))}
                            </dl>

                            <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8aa3]">Recent threads</h4>
                            <ul className="mt-3 divide-y divide-white/[0.06]">
                                {space.threads.map((t) => (
                                    <li key={t.title} className="flex items-baseline justify-between gap-4 py-3">
                                        <p className="min-w-0 text-[15px] text-[#ededf5]">
                                            {t.title} <span className="text-[#6b6b85]">· {t.who}</span>
                                        </p>
                                        <span className="shrink-0 font-mono text-xs text-[#6b6b85]">{t.time}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href={`#space-${selected}`}
                                    className="inline-flex min-h-11 items-center rounded-full bg-[#7c3aed] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                                >
                                    Open space
                                </a>
                                <button
                                    type="button"
                                    disabled={position < 0 && pinned.length >= MAX_PINNED}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-[#ededf5] transition-colors hover:border-[#a78bfa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] disabled:cursor-not-allowed disabled:opacity-40"
                                    onClick={() => (position >= 0 ? unpin(selected) : pin(selected))}
                                >
                                    {position >= 0 ? <PiPushPinSlashBold className="size-4" aria-hidden="true" /> : <PiPushPinBold className="size-4" aria-hidden="true" />}
                                    {position >= 0 ? 'Unpin' : 'Pin to sidebar'}
                                </button>
                                <button
                                    type="button"
                                    aria-pressed={isMuted}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-[#ededf5] transition-colors hover:border-[#a78bfa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                                    onClick={() => toggleMute(selected)}
                                >
                                    {isMuted ? <PiBellSimpleSlashBold className="size-4" aria-hidden="true" /> : <PiBellSimpleBold className="size-4" aria-hidden="true" />}
                                    {isMuted ? 'Muted' : 'Mute'}
                                </button>
                            </div>
                        </motion.article>
                    </AnimatePresence>
                </div>
                <p aria-live="polite" className="sr-only">
                    {announce}
                </p>
            </div>
        </section>
    )
}

export default PinnedSpacesGroupSidebar

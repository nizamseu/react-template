// GroupCardsGroupSidebar

// GroupSidebar02 · Social Networks & Communities › Community / Group Sidebar

// Description:
// A friendly neighbourhood groups sidebar for Neighbour Net (Elm Park). "Your groups" lists
// joined groups with cover thumbnails, member counts and green "new posts" dots; you can
// search, sort (Recent / A–Z / Members) and expand the list. A "Suggested for you" block
// offers Join / Request toggles, and the right pane previews the selected group with its
// latest post and next meet-up. Use it on local-community, club or HOA platforms.

// Design:
// - lg:grid-cols-[23rem_1fr]: sidebar card + group preview; below lg the sidebar stacks
//   above the preview; suggested cards are grid-cols-2 inside the sidebar at every width
// - White #ffffff section on a faint mint wash, ink #0f1f14, zinc #52525b / #e4e4e7,
//   leaf green #16a34a (dots, active row, buttons), mint #f0fdf4 / #dcfce7 fills
// - Rounded-3xl cards with 1px borders, rounded-xl photo thumbs, a text-4xl → lg:text-6xl
//   bold heading with a hand-drawn SVG underline; small caps-style section labels
// - Rows re-order with framer-motion layout animation when sorting or joining; sections
//   collapse with height animation (instant for reduced motion)
// - Preview: 16:7 cover photo, avatar stack, meta chips that wrap on small screens

// What it does:
// - Clicking a group selects it (aria-current), clears its new-post count and updates the
//   preview; "Leave group" removes it and selects the next one
// - Search filters both lists; the sort segmented control re-orders "Your groups"; "Show
//   all" expands past four rows; both section headers collapse (aria-expanded)
// - Suggested public groups toggle Join ⇄ Joined (and appear in Your groups); private ones
//   toggle Request ⇄ Requested; a polite live region announces each change
// - "Open group" links point to #group-<id>; no network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GroupCardsGroupSidebar from '@/TestComponent/PageSections/community/GroupSidebar02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <GroupCardsGroupSidebar />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiCheck,
    HiChevronDown,
    HiOutlineArrowRightOnRectangle,
    HiOutlineCalendarDays,
    HiOutlineGlobeAlt,
    HiOutlineLockClosed,
    HiOutlineMagnifyingGlass,
    HiOutlineMapPin,
    HiOutlineUserPlus,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const faces = [
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80',
]

const groups = {
    sourdough: {
        name: 'Elm Park Sourdough Swap',
        cover: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        alt: 'Rustic sourdough loaves on a wooden board',
        members: 214,
        privacy: 'public',
        activity: 1,
        news: 3,
        about: 'Starters, discards and Saturday loaves traded on the green. Bring a jar, leave with a jar.',
        post: { who: 'Ruth A.', text: 'Rye starter “Big Doug” has babies. Six jars on my porch at 14 Linden Rd, help yourselves.' },
        next: 'Sat 3 Oct · 10:00 · Bandstand',
    },
    trail: {
        name: 'Sunday Trail Walkers',
        cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        alt: 'Sunlit path winding through a green forest',
        members: 142,
        privacy: 'public',
        activity: 2,
        news: 5,
        about: 'Easy 5–8 mile loops every Sunday. Dogs welcome, pace is chatty, cake is mandatory.',
        post: { who: 'Dev S.', text: 'Route for this week: Hollow Wood loop, 6.2 mi, one muddy stile. Meet at the car park.' },
        next: 'Sun 4 Oct · 09:30 · Hollow Wood car park',
    },
    hoops: {
        name: 'Pickup Hoops @ Rec Ground',
        cover: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
        alt: 'Outdoor basketball hoop against the sky',
        members: 76,
        privacy: 'public',
        activity: 3,
        news: 1,
        about: 'Casual 3v3 and 5v5 on the rec ground courts. All levels, no ego, bring water.',
        post: { who: 'Marcus T.', text: 'Floodlights fixed! Evening runs are back on Tue and Thu from 7.' },
        next: 'Tue 6 Oct · 19:00 · Rec ground courts',
    },
    plants: {
        name: 'Plant & Cutting Swap',
        cover: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        alt: 'Small succulent planted in a mint green pot',
        members: 389,
        privacy: 'public',
        activity: 4,
        news: 0,
        about: 'Cuttings, seedlings and rescue plants passed from windowsill to windowsill.',
        post: { who: 'Aiko M.', text: 'Monstera cuttings with roots — three available, swap for anything trailing.' },
        next: 'Sun 11 Oct · 14:00 · Library garden',
    },
    books: {
        name: 'Little Free Library Crew',
        cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
        alt: 'Tall bookshelf filled with books',
        members: 123,
        privacy: 'public',
        activity: 5,
        news: 0,
        about: 'Looking after the four book boxes in Elm Park. Restock rota, repairs and book chat.',
        post: { who: 'Gwen P.', text: 'Box on Cedar Lane is overflowing with thrillers again. Anyone want to rotate some out?' },
        next: 'Wed 7 Oct · 18:30 · Cedar Lane box',
    },
    supper: {
        name: 'Long Table Supper Club',
        cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends sharing dishes around a long dinner table',
        members: 58,
        privacy: 'private',
        activity: 6,
        news: 0,
        about: 'Monthly potluck at a different house each time. Twelve seats, sign-up opens a week before.',
        post: { who: 'Leon K.', text: 'October theme is “grandma’s recipe”. Four seats left.' },
        next: 'Fri 16 Oct · 19:30 · Host revealed on RSVP',
    },
    cowork: {
        name: 'Coffee & Co-working Mornings',
        cover: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
        alt: 'Two friends talking over coffee in a cafe',
        members: 1020,
        privacy: 'public',
        activity: 7,
        news: 2,
        about: 'Remote workers sharing a table at Kiln Café, weekdays 9–12. Quiet mornings, loud lunches.',
        post: { who: 'Priya R.', text: 'Kiln has a new long table by the window. Grabbing it Monday — join!' },
        next: 'Mon 5 Oct · 09:00 · Kiln Café',
    },
    stars: {
        name: 'Night Sky Watchers',
        cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        alt: 'Starry night sky above snowy mountains',
        members: 188,
        privacy: 'public',
        activity: 8,
        news: 1,
        about: 'Telescopes, binoculars or just eyes. Dark-sky trips when the forecast clears.',
        post: { who: 'Omar F.', text: 'Clear skies forecast Thursday — Saturn and the Moon side by side after 9 pm.' },
        next: 'Thu 8 Oct · 21:00 · Beacon Hill',
    },
    market: {
        name: 'Saturday Market Volunteers',
        cover: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
        alt: 'Colourful fresh produce at a market stall',
        members: 97,
        privacy: 'private',
        activity: 9,
        news: 0,
        about: 'Setting up stalls, running the veg share table and packing down by 2 pm.',
        post: { who: 'Hana O.', text: 'Need two more people for the 7 am set-up crew this week.' },
        next: 'Sat 10 Oct · 07:00 · Market square',
    },
    runners: {
        name: 'Riverside 5K Club',
        cover: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        alt: 'Sprinter running on an athletics track',
        members: 431,
        privacy: 'public',
        activity: 10,
        news: 0,
        about: 'A free, timed 5K along the river every Wednesday evening. Walkers welcome.',
        post: { who: 'Chen L.', text: 'New PB board is up! 47 personal bests last month.' },
        next: 'Wed 7 Oct · 18:00 · Boathouse',
    },
}

const initialJoined = ['sourdough', 'trail', 'hoops', 'plants', 'books', 'supper']
const suggestedIds = ['cowork', 'stars', 'market', 'runners']
const sorts = [
    { id: 'recent', label: 'Recent' },
    { id: 'az', label: 'A–Z' },
    { id: 'members', label: 'Members' },
]
const COLLAPSED_ROWS = 4

function sortIds(ids, sort) {
    const list = [...ids]
    if (sort === 'az') return list.sort((a, b) => groups[a].name.localeCompare(groups[b].name))
    if (sort === 'members') return list.sort((a, b) => groups[b].members - groups[a].members)
    return list.sort((a, b) => groups[a].activity - groups[b].activity)
}

export function GroupCardsGroupSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()

    const [joined, setJoined] = useState(initialJoined)
    const [requested, setRequested] = useState([])
    const [selected, setSelected] = useState('trail')
    const [news, setNews] = useState(() => {
        const map = Object.fromEntries(Object.entries(groups).map(([id, g]) => [id, g.news]))
        map.trail = 0
        return map
    })
    const [sort, setSort] = useState('recent')
    const [query, setQuery] = useState('')
    const [expanded, setExpanded] = useState(false)
    const [openMine, setOpenMine] = useState(true)
    const [openSuggested, setOpenSuggested] = useState(true)
    const [announce, setAnnounce] = useState('')

    const q = query.trim().toLowerCase()
    const matches = (id) => !q || groups[id].name.toLowerCase().includes(q)
    const mine = sortIds(joined, sort).filter(matches)
    const shown = expanded || q ? mine : mine.slice(0, COLLAPSED_ROWS)
    const suggested = suggestedIds.filter(matches)
    const totalNew = joined.reduce((s, id) => s + (news[id] || 0), 0)
    const group = groups[selected]

    const select = (id) => {
        setSelected(id)
        setNews((n) => ({ ...n, [id]: 0 }))
    }

    const toggleJoin = (id) => {
        const g = groups[id]
        if (g.privacy === 'private') {
            const has = requested.includes(id)
            setRequested((r) => (has ? r.filter((x) => x !== id) : [...r, id]))
            setAnnounce(has ? `Request to join ${g.name} withdrawn.` : `Request sent to ${g.name}.`)
            return
        }
        if (joined.includes(id)) {
            leave(id)
            return
        }
        setJoined((j) => [...j, id])
        setAnnounce(`You joined ${g.name}.`)
    }

    const leave = (id) => {
        const remaining = joined.filter((x) => x !== id)
        setJoined(remaining)
        if (selected === id && remaining.length) setSelected(sortIds(remaining, sort)[0])
        setAnnounce(`You left ${groups[id].name}.`)
    }

    const sectionHeader = (label, count, isOpen, toggle, controls) => (
        <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={controls}
            className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
            onClick={toggle}
        >
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#52525b]">
                {label} <span className="font-mono text-[#a1a1aa]">{count}</span>
            </span>
            <HiChevronDown
                className={cn('size-4 text-[#71717a] transition-transform motion-reduce:transition-none', !isOpen && '-rotate-90')}
                aria-hidden="true"
            />
        </button>
    )

    const collapse = {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: reduceMotion ? 0 : 0.25 },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f1f14] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-linear-to-b from-[#f0fdf4] to-white" />

            <div className="mx-auto max-w-6xl">
                <div className="max-w-2xl">
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16a34a]">
                        <HiOutlineMapPin className="size-4" aria-hidden="true" />
                        Neighbour Net · Elm Park
                    </p>
                    <h2 className="mt-4 text-4xl font-extrabold leading-[1.04] tracking-tight text-[#0f1f14] sm:text-5xl lg:text-6xl">
                        Your street,{' '}
                        <span className="relative inline-block">
                            your groups.
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 300 16"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3 w-full text-[#16a34a]"
                            >
                                <path d="M3 11 C 70 3, 150 3, 297 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-[#52525b]">
                        Bread swaps, Sunday walks and the people three doors down. Everything you have joined, plus a
                        few groups your neighbours love.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[23rem_minmax(0,1fr)]">
                    <aside
                        aria-label="Groups"
                        className="min-w-0 self-start rounded-3xl border border-[#e4e4e7] bg-white p-4 shadow-[0_24px_60px_-36px_rgba(15,31,20,0.35)] sm:p-5"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold text-[#0f1f14]">Groups</h3>
                            {totalNew > 0 && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-semibold text-[#15803d]">
                                    <span className="size-1.5 rounded-full bg-[#16a34a]" aria-hidden="true" />
                                    {totalNew} new posts
                                </span>
                            )}
                        </div>

                        <label htmlFor={`${uid}-q`} className="sr-only">
                            Search groups
                        </label>
                        <div className="relative mt-4">
                            <HiOutlineMagnifyingGlass
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]"
                                aria-hidden="true"
                            />
                            <input
                                id={`${uid}-q`}
                                type="search"
                                value={query}
                                placeholder="Search groups"
                                className="min-h-11 w-full rounded-2xl border border-[#e4e4e7] bg-[#fafafa] pl-10 pr-3 text-sm text-[#0f1f14] placeholder:text-[#a1a1aa] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="mt-5">
                            {sectionHeader('Your groups', joined.length, openMine, () => setOpenMine((v) => !v), `${uid}-mine`)}
                            <AnimatePresence initial={false}>
                                {openMine && (
                                    <motion.div key="mine" id={`${uid}-mine`} {...collapse} className="overflow-hidden">
                                        <div role="group" aria-label="Sort groups" className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-[#f4f4f5] p-1">
                                            {sorts.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    aria-pressed={sort === s.id}
                                                    className={cn(
                                                        'min-h-9 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]',
                                                        sort === s.id ? 'bg-white text-[#15803d] shadow-sm' : 'text-[#71717a] hover:text-[#0f1f14]',
                                                    )}
                                                    onClick={() => setSort(s.id)}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                        <ul className="mt-3 space-y-1">
                                            <AnimatePresence initial={false}>
                                                {shown.map((id) => {
                                                    const g = groups[id]
                                                    const isActive = selected === id
                                                    const count = news[id] || 0
                                                    return (
                                                        <motion.li
                                                            key={id}
                                                            layout={!reduceMotion}
                                                            initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                        >
                                                            <button
                                                                type="button"
                                                                aria-current={isActive ? 'true' : undefined}
                                                                className={cn(
                                                                    'flex min-h-14 w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]',
                                                                    isActive ? 'bg-[#f0fdf4] ring-1 ring-[#bbf7d0]' : 'hover:bg-[#fafafa]',
                                                                )}
                                                                onClick={() => select(id)}
                                                            >
                                                                <span className="relative shrink-0">
                                                                    <img src={g.cover} alt="" loading="lazy" className="size-11 rounded-xl object-cover" />
                                                                    {count > 0 && (
                                                                        <span
                                                                            className="absolute -right-1 -top-1 size-3.5 rounded-full border-2 border-white bg-[#16a34a]"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                </span>
                                                                <span className="min-w-0 flex-1">
                                                                    <span className={cn('block truncate text-sm text-[#0f1f14]', count > 0 ? 'font-bold' : 'font-semibold')}>
                                                                        {g.name}
                                                                    </span>
                                                                    <span className="block truncate text-xs text-[#71717a]">
                                                                        {g.members.toLocaleString('en-US')} members
                                                                        {count > 0 && (
                                                                            <span className="font-semibold text-[#15803d]">
                                                                                {' '}
                                                                                · {count} new {count === 1 ? 'post' : 'posts'}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </span>
                                                                {g.privacy === 'private' && (
                                                                    <>
                                                                        <HiOutlineLockClosed className="size-4 shrink-0 text-[#a1a1aa]" aria-hidden="true" />
                                                                        <span className="sr-only">Private group</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </motion.li>
                                                    )
                                                })}
                                            </AnimatePresence>
                                        </ul>
                                        {mine.length === 0 && (
                                            <p className="px-2 py-3 text-sm text-[#71717a]">
                                                {q ? `None of your groups match “${query.trim()}”.` : 'You have not joined any groups yet.'}
                                            </p>
                                        )}
                                        {!q && mine.length > COLLAPSED_ROWS && (
                                            <button
                                                type="button"
                                                aria-expanded={expanded}
                                                className="mt-2 min-h-10 w-full rounded-xl text-sm font-semibold text-[#15803d] hover:bg-[#f0fdf4] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
                                                onClick={() => setExpanded((v) => !v)}
                                            >
                                                {expanded ? 'Show fewer' : `Show all ${mine.length}`}
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-5 border-t border-[#f4f4f5] pt-5">
                            {sectionHeader('Suggested for you', suggested.length, openSuggested, () => setOpenSuggested((v) => !v), `${uid}-sugg`)}
                            <AnimatePresence initial={false}>
                                {openSuggested && (
                                    <motion.div key="sugg" id={`${uid}-sugg`} {...collapse} className="overflow-hidden">
                                        <ul className="mt-3 grid grid-cols-2 gap-3">
                                            {suggested.map((id) => {
                                                const g = groups[id]
                                                const isPrivate = g.privacy === 'private'
                                                const on = isPrivate ? requested.includes(id) : joined.includes(id)
                                                return (
                                                    <li key={id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e4e4e7]">
                                                        <img src={g.cover} alt={g.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                                                        <div className="flex flex-1 flex-col p-2.5">
                                                            <p className="line-clamp-2 text-[13px] font-bold leading-snug text-[#0f1f14]">{g.name}</p>
                                                            <p className="mt-1 text-[11px] text-[#71717a]">
                                                                {g.members.toLocaleString('en-US')} · {isPrivate ? 'Private' : 'Public'}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                aria-pressed={on}
                                                                aria-label={`${isPrivate ? 'Request to join' : 'Join'} ${g.name}`}
                                                                className={cn(
                                                                    'mt-2.5 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]',
                                                                    on
                                                                        ? 'bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0]'
                                                                        : 'bg-[#16a34a] text-white hover:bg-[#15803d]',
                                                                )}
                                                                onClick={() => toggleJoin(id)}
                                                            >
                                                                {on ? <HiCheck className="size-3.5" aria-hidden="true" /> : <HiOutlineUserPlus className="size-3.5" aria-hidden="true" />}
                                                                {isPrivate ? (on ? 'Requested' : 'Request') : on ? 'Joined' : 'Join'}
                                                            </button>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        {suggested.length === 0 && <p className="px-2 py-3 text-sm text-[#71717a]">No suggestions match.</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <AnimatePresence mode="wait" initial={false}>
                            {joined.includes(selected) ? (
                                <motion.article
                                    key={selected}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden rounded-3xl border border-[#e4e4e7] bg-white"
                                >
                                    <img src={group.cover} alt={group.alt} loading="lazy" className="aspect-[16/7] w-full object-cover" />
                                    <div className="p-5 sm:p-8">
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2.5 py-1 text-[#15803d]">
                                                {group.privacy === 'private' ? (
                                                    <HiOutlineLockClosed className="size-3.5" aria-hidden="true" />
                                                ) : (
                                                    <HiOutlineGlobeAlt className="size-3.5" aria-hidden="true" />
                                                )}
                                                {group.privacy === 'private' ? 'Private group' : 'Public group'}
                                            </span>
                                            <span className="rounded-full bg-[#f4f4f5] px-2.5 py-1 text-[#52525b]">
                                                {group.members.toLocaleString('en-US')} members
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0f1f14] sm:text-4xl">{group.name}</h3>
                                        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#52525b]">{group.about}</p>

                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {faces.map((f) => (
                                                    <img key={f} src={f} alt="" loading="lazy" className="size-8 rounded-full border-2 border-white object-cover" />
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#52525b]">
                                                <span className="font-semibold text-[#0f1f14]">14 neighbours</span> active this week
                                            </p>
                                        </div>

                                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                                            <div className="rounded-2xl bg-[#fafafa] p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a1a1aa]">Latest post</p>
                                                <p className="mt-2 text-sm leading-relaxed text-[#0f1f14]">
                                                    <span className="font-bold">{group.post.who}</span> {group.post.text}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-[#f0fdf4] p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#15803d]">Next meet-up</p>
                                                <p className="mt-2 flex items-start gap-2 text-sm font-semibold leading-relaxed text-[#0f1f14]">
                                                    <HiOutlineCalendarDays className="mt-0.5 size-4 shrink-0 text-[#16a34a]" aria-hidden="true" />
                                                    {group.next}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <a
                                                href={`#group-${selected}`}
                                                className="inline-flex min-h-11 items-center rounded-full bg-[#16a34a] px-6 text-sm font-bold text-white transition-colors hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                                            >
                                                Open group
                                            </a>
                                            <button
                                                type="button"
                                                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e4e4e7] px-5 text-sm font-semibold text-[#52525b] transition-colors hover:border-[#fca5a5] hover:text-[#b91c1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                                                onClick={() => leave(selected)}
                                            >
                                                <HiOutlineArrowRightOnRectangle className="size-4" aria-hidden="true" />
                                                Leave group
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-[#d4d4d8] p-8 text-center"
                                >
                                    <p className="max-w-xs text-sm text-[#71717a]">
                                        Pick a group from the sidebar — or join one of the suggestions — to see what is happening.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <p aria-live="polite" className="sr-only">
                    {announce}
                </p>
            </div>
        </section>
    )
}

export default GroupCardsGroupSidebar

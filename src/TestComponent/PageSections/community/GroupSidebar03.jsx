// ServerRailGroupSidebar

// GroupSidebar03 · Social Networks & Communities › Community / Group Sidebar

// Description:
// A neon gaming sidebar for Pixelhaven. A narrow rail of community icons (Pixelhaven HQ,
// Speedrun Society, Cozy Farmers, Raid Night EU, Retro Arcade Club, Indie Dev Jam) with an
// animated active pill sits beside a second pane listing the selected community's rooms
// by section, with LIVE badges, player counts, favourites and an All / Live / Starred
// filter. A lobby panel previews the chosen room with a "Join room" toggle. Use it for
// gaming hubs, esports communities or any multi-server chat product.

// Design:
// - App frame grid-cols-[4.5rem_1fr] (rail + rooms) → md:grid-cols-[4.5rem_17rem_1fr]
//   with the lobby as a third column; below md the lobby spans the full width underneath
// - Midnight #0b0b1e section, rail #07071a, rooms pane #12122b, lobby #181836, lavender
//   text #e4e4f7 / #8b8bb0, neon pink #ff3ea5 (pill, LIVE, buttons, focus), cyan #22d3ee
//   for slot meters
// - Uppercase italic font-black heading (text-4xl → lg:text-7xl) with a pink glow;
//   mono uppercase labels; rail icons are 48px gradient squircles that tighten their
//   radius when active; faint pixel-grid backdrop
// - The rail pill and the room highlight glide with shared layoutIds; the rooms pane and
//   lobby cross-fade when switching (instant for reduced motion); LIVE dots pulse only
//   when motion is allowed
// - Rail tooltips appear on hover/focus from md up; below md names come from aria-labels

// What it does:
// - Selecting a community (aria-current, ↑ / ↓ move focus along the rail) clears its
//   unread pill and mention badge and restores the last room chosen in it
// - Room rows select the room for the lobby; the star button (aria-pressed) adds it to
//   Starred; the All / Live / Starred tabs filter the list with an empty state
// - "Join room" (aria-pressed) adds you to the player count unless the room is full;
//   a polite live region announces joins; "Discover" links to #pixelhaven-discover

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ServerRailGroupSidebar from '@/TestComponent/PageSections/community/GroupSidebar03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ServerRailGroupSidebar />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    PiCompassBold,
    PiCubeBold,
    PiGameControllerBold,
    PiGhostBold,
    PiHashBold,
    PiLightningBold,
    PiPlantBold,
    PiSpeakerHighBold,
    PiStarBold,
    PiStarFill,
    PiSwordBold,
    PiTrophyBold,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const party = [
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1614644147724-2d4785d69962?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80',
]

const communities = [
    {
        id: 'hq',
        name: 'Pixelhaven HQ',
        icon: PiGameControllerBold,
        tint: 'from-[#ff3ea5] to-[#7c3aed]',
        banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        alt: 'Retro computers glowing under pink neon light',
        online: '6,104',
        unread: true,
        mentions: 2,
        rooms: [
            { id: 'patch-notes', section: 'Lobby', type: 'text', name: 'patch-notes', players: 0, mode: 'Read-only · v3.8 notes' },
            { id: 'lfg', section: 'Lobby', type: 'text', name: 'looking-for-group', players: 318, mode: 'Post your rank + role' },
            { id: 'arena', section: 'Squads', type: 'voice', name: 'Arena Queue', players: 12, cap: 16, live: true, mode: '5v5 Ranked · EU West' },
            { id: 'chill', section: 'Squads', type: 'voice', name: 'Chill Lounge', players: 4, cap: 20, mode: 'Hangout · no queue' },
            { id: 'cup', section: 'Tournaments', type: 'voice', name: 'Friday Cup Finals', players: 10, cap: 10, live: true, mode: 'Bracket · Best of 3' },
        ],
    },
    {
        id: 'speedrun',
        name: 'Speedrun Society',
        icon: PiLightningBold,
        tint: 'from-[#22d3ee] to-[#2563eb]',
        banner: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
        alt: 'Player wearing a VR headset in coloured light',
        online: '1,932',
        unread: true,
        mentions: 0,
        rooms: [
            { id: 'wr-feed', section: 'Lobby', type: 'text', name: 'world-records', players: 88, mode: 'Verified runs only' },
            { id: 'routing', section: 'Lobby', type: 'text', name: 'routing-lab', players: 41, mode: 'Skips, clips and splits' },
            { id: 'race-a', section: 'Races', type: 'voice', name: 'Any% Race Room', players: 6, cap: 8, live: true, mode: 'Race · starts 21:00' },
            { id: 'practice', section: 'Races', type: 'voice', name: 'Practice Pit', players: 3, cap: 12, mode: 'Segment practice' },
        ],
    },
    {
        id: 'farm',
        name: 'Cozy Farmers',
        icon: PiPlantBold,
        tint: 'from-[#a3e635] to-[#16a34a]',
        banner: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80',
        alt: 'Wooden cabin in a quiet forest',
        online: '842',
        unread: false,
        mentions: 0,
        rooms: [
            { id: 'harvest', section: 'Lobby', type: 'text', name: 'harvest-moon', players: 57, mode: 'Seasonal tips' },
            { id: 'trades', section: 'Lobby', type: 'text', name: 'seed-trades', players: 23, mode: 'Swap rare seeds' },
            { id: 'co-op', section: 'Co-op', type: 'voice', name: 'Co-op Farm #3', players: 3, cap: 4, mode: 'Year 2 · Autumn' },
            { id: 'fishing', section: 'Co-op', type: 'voice', name: 'Fishing Pier', players: 2, cap: 8, live: true, mode: 'Derby stream' },
        ],
    },
    {
        id: 'raid',
        name: 'Raid Night EU',
        icon: PiSwordBold,
        tint: 'from-[#f97316] to-[#dc2626]',
        banner: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        alt: 'Neon-lit city street at night',
        online: '2,417',
        unread: true,
        mentions: 5,
        rooms: [
            { id: 'roster', section: 'Lobby', type: 'text', name: 'raid-roster', players: 64, mode: 'Sign-ups close 19:30' },
            { id: 'strats', section: 'Lobby', type: 'text', name: 'boss-strats', players: 29, mode: 'Phase 3 is the wall' },
            { id: 'raid-1', section: 'Raids', type: 'voice', name: 'Raid Group Alpha', players: 18, cap: 20, live: true, mode: 'Heroic · Boss 6/9' },
            { id: 'raid-2', section: 'Raids', type: 'voice', name: 'Raid Group Bravo', players: 20, cap: 20, mode: 'Normal · Boss 2/9' },
            { id: 'afk', section: 'Raids', type: 'voice', name: 'Repair & AFK', players: 5, cap: 30, mode: 'Between pulls' },
        ],
    },
    {
        id: 'arcade',
        name: 'Retro Arcade Club',
        icon: PiGhostBold,
        tint: 'from-[#facc15] to-[#ff3ea5]',
        banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        alt: 'Crowd under colourful festival lights',
        online: '611',
        unread: false,
        mentions: 0,
        rooms: [
            { id: 'hiscores', section: 'Lobby', type: 'text', name: 'high-scores', players: 34, mode: 'Photo proof required' },
            { id: 'cabinet', section: 'Lobby', type: 'text', name: 'cabinet-repair', players: 12, mode: 'CRTs and joysticks' },
            { id: 'coinop', section: 'Play', type: 'voice', name: 'Coin-op Night', players: 7, cap: 12, live: true, mode: 'Netplay · 1987 classics' },
        ],
    },
    {
        id: 'jam',
        name: 'Indie Dev Jam',
        icon: PiCubeBold,
        tint: 'from-[#a78bfa] to-[#ec4899]',
        banner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        alt: 'Laptop on a desk lit with purple neon',
        online: '1,208',
        unread: true,
        mentions: 0,
        rooms: [
            { id: 'theme', section: 'Lobby', type: 'text', name: 'jam-theme', players: 140, mode: 'Theme: “Out of time”' },
            { id: 'showcase', section: 'Lobby', type: 'text', name: 'showcase', players: 76, mode: 'Post builds + gifs' },
            { id: 'cowork', section: 'Voice', type: 'voice', name: 'Co-working Room', players: 9, cap: 25, mode: 'Cameras optional' },
            { id: 'playtest', section: 'Voice', type: 'voice', name: 'Playtest Party', players: 5, cap: 10, live: true, mode: 'Build 0.4 · feedback' },
        ],
    },
]

const communityById = Object.fromEntries(communities.map((c) => [c.id, c]))
const filters = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'starred', label: 'Starred' },
]

export function ServerRailGroupSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()

    const [communityId, setCommunityId] = useState('hq')
    const [roomBy, setRoomBy] = useState(() => Object.fromEntries(communities.map((c) => [c.id, c.rooms.find((r) => r.type === 'voice').id])))
    const [badges, setBadges] = useState(() =>
        Object.fromEntries(communities.map((c) => [c.id, { unread: c.id === 'hq' ? false : c.unread, mentions: c.id === 'hq' ? 0 : c.mentions }])),
    )
    const [filter, setFilter] = useState('all')
    const [starred, setStarred] = useState(['hq:cup', 'raid:raid-1'])
    const [joined, setJoined] = useState(null)
    const [announce, setAnnounce] = useState('')

    const community = communityById[communityId]
    const room = community.rooms.find((r) => r.id === roomBy[communityId]) ?? community.rooms[0]
    const roomKey = (r) => `${communityId}:${r.id}`
    const visibleRooms = community.rooms.filter((r) => {
        if (filter === 'live') return r.live
        if (filter === 'starred') return starred.includes(roomKey(r))
        return true
    })
    const sections = [...new Set(visibleRooms.map((r) => r.section))]
    const isJoined = joined === roomKey(room)
    const players = room.players + (isJoined ? 1 : 0)
    const full = room.cap && room.players >= room.cap && !isJoined

    const selectCommunity = (id) => {
        setCommunityId(id)
        setBadges((b) => ({ ...b, [id]: { unread: false, mentions: 0 } }))
    }

    const onRailKey = (event, index) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        event.preventDefault()
        const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + communities.length) % communities.length
        document.getElementById(`${uid}-rail-${communities[next].id}`)?.focus()
    }

    const toggleStar = (r) => {
        const key = roomKey(r)
        setStarred((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]))
    }

    const toggleJoin = () => {
        const key = roomKey(room)
        if (isJoined) {
            setJoined(null)
            setAnnounce(`Left ${room.name}.`)
            return
        }
        if (full) return
        setJoined(key)
        setAnnounce(`Joined ${room.name} in ${community.name}.`)
    }

    const fade = {
        initial: { opacity: 0, x: reduceMotion ? 0 : 10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0 },
        transition: { duration: reduceMotion ? 0 : 0.22 },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b0b1e] px-4 py-16 text-base font-normal text-[#e4e4f7] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] [background-size:24px_24px]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-[#ff3ea5] opacity-20 blur-3xl" />

            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#ff3ea5]">Pixelhaven / Servers</p>
                        <h2 className="mt-4 text-4xl font-black uppercase italic leading-[0.92] tracking-tight text-white [text-shadow:0_0_32px_rgba(255,62,165,0.55)] sm:text-6xl lg:text-7xl">
                            Pick your
                            <br />
                            <span className="text-[#ff3ea5]">server.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed text-[#8b8bb0]">
                        Six communities, one rail. Hop between squads, star the rooms you live in and see who is queued
                        before you drop in.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden rounded-3xl ring-1 ring-white/10 md:grid-cols-[4.5rem_17rem_minmax(0,1fr)]">
                    <nav aria-label="Communities" className="flex flex-col items-center gap-2 bg-[#07071a] py-4">
                        <ul className="flex flex-col items-center gap-2">
                            {communities.map((c, i) => {
                                const Icon = c.icon
                                const active = c.id === communityId
                                const badge = badges[c.id]
                                return (
                                    <li key={c.id} className="group relative flex w-[4.5rem] justify-center">
                                        {active ? (
                                            <motion.span
                                                layoutId={`${uid}-pill`}
                                                transition={{ type: 'spring', stiffness: 520, damping: 36 }}
                                                className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-[#ff3ea5] shadow-[0_0_12px_#ff3ea5]"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <span
                                                className={cn(
                                                    'absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-white transition-all duration-200 motion-reduce:transition-none',
                                                    badge.unread ? 'h-2 group-hover:h-5' : 'h-0 group-hover:h-5',
                                                )}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <button
                                            id={`${uid}-rail-${c.id}`}
                                            type="button"
                                            aria-current={active ? 'true' : undefined}
                                            aria-label={`${c.name}${badge.mentions ? `, ${badge.mentions} mentions` : badge.unread ? ', unread activity' : ''}`}
                                            className={cn(
                                                'relative grid size-12 place-items-center bg-linear-to-br text-white transition-[border-radius,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3ea5] motion-reduce:transition-none',
                                                c.tint,
                                                active ? 'rounded-xl' : 'rounded-[1.5rem] opacity-80 hover:rounded-xl hover:opacity-100',
                                            )}
                                            onClick={() => selectCommunity(c.id)}
                                            onKeyDown={(e) => onRailKey(e, i)}
                                        >
                                            <Icon className="size-6" aria-hidden="true" />
                                            {badge.mentions > 0 && (
                                                <span className="absolute -bottom-1 -right-1 grid min-w-5 place-items-center rounded-full border-[3px] border-[#07071a] bg-[#ff3ea5] px-1 font-mono text-[10px] font-bold leading-4 text-white">
                                                    {badge.mentions}
                                                </span>
                                            )}
                                        </button>
                                        <span
                                            role="presentation"
                                            className="pointer-events-none absolute left-full top-1/2 z-20 ml-1 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:block"
                                        >
                                            {c.name}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                        <span className="my-1 h-0.5 w-8 rounded-full bg-white/10" aria-hidden="true" />
                        <a
                            href="#pixelhaven-discover"
                            aria-label="Discover communities"
                            className="grid size-12 place-items-center rounded-[1.5rem] bg-[#12122b] text-[#22d3ee] transition-[border-radius,background-color] hover:rounded-xl hover:bg-[#22d3ee] hover:text-[#07071a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3ea5]"
                        >
                            <PiCompassBold className="size-6" aria-hidden="true" />
                        </a>
                    </nav>

                    <div className="min-w-0 bg-[#12122b]">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div key={communityId} {...fade}>
                                <div className="relative h-24 overflow-hidden">
                                    <img src={community.banner} alt={community.alt} loading="lazy" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#12122b] via-[#12122b]/50 to-transparent" />
                                    <div className="absolute inset-x-3 bottom-2">
                                        <h3 className="truncate text-base font-black uppercase italic tracking-tight text-white">{community.name}</h3>
                                        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#c4c4e0]">
                                            <span className="size-1.5 rounded-full bg-[#4ade80]" aria-hidden="true" />
                                            {community.online} online
                                        </p>
                                    </div>
                                </div>

                                <div role="tablist" aria-label="Filter rooms" className="mx-3 mt-3 grid grid-cols-3 gap-1 rounded-xl bg-[#0b0b1e] p-1">
                                    {filters.map((f) => (
                                        <button
                                            key={f.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={filter === f.id}
                                            aria-controls={`${uid}-rooms`}
                                            className={cn(
                                                'min-h-9 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#ff3ea5]',
                                                filter === f.id ? 'bg-[#ff3ea5] text-white' : 'text-[#8b8bb0] hover:text-white',
                                            )}
                                            onClick={() => setFilter(f.id)}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                <div id={`${uid}-rooms`} role="tabpanel" aria-label={`${community.name} rooms`} className="space-y-4 px-2 py-4">
                                    {sections.length === 0 && (
                                        <p className="px-2 py-6 text-center text-sm text-[#8b8bb0]">
                                            {filter === 'live' ? 'Nobody is live here right now.' : 'Star a room to pin it here.'}
                                        </p>
                                    )}
                                    {sections.map((section) => (
                                        <div key={section}>
                                            <p className="px-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b6b94]">{section}</p>
                                            <ul className="mt-1 space-y-0.5">
                                                {visibleRooms
                                                    .filter((r) => r.section === section)
                                                    .map((r) => {
                                                        const Icon = r.type === 'voice' ? PiSpeakerHighBold : PiHashBold
                                                        const active = r.id === room.id
                                                        const star = starred.includes(roomKey(r))
                                                        const count = r.players + (joined === roomKey(r) ? 1 : 0)
                                                        return (
                                                            <li key={r.id} className="relative flex items-center">
                                                                {active && (
                                                                    <motion.span
                                                                        layoutId={`${uid}-room`}
                                                                        transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                                                                        className="absolute inset-0 rounded-lg bg-[#ff3ea5]/15 ring-1 ring-[#ff3ea5]/40"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    aria-current={active ? 'true' : undefined}
                                                                    className={cn(
                                                                        'relative flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg pl-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff3ea5]',
                                                                        active ? 'text-white' : 'text-[#b4b4d4] hover:text-white',
                                                                    )}
                                                                    onClick={() => setRoomBy((m) => ({ ...m, [communityId]: r.id }))}
                                                                >
                                                                    <Icon className="size-4 shrink-0 text-[#6b6b94]" aria-hidden="true" />
                                                                    <span className="min-w-0 flex-1 truncate">{r.name}</span>
                                                                    {r.live && (
                                                                        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[#ff3ea5] px-1 font-mono text-[9px] font-bold uppercase text-white">
                                                                            <span
                                                                                className={cn('size-1 rounded-full bg-white', !reduceMotion && 'animate-pulse')}
                                                                                aria-hidden="true"
                                                                            />
                                                                            Live
                                                                        </span>
                                                                    )}
                                                                    {r.type === 'voice' && (
                                                                        <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#8b8bb0]">
                                                                            {count}/{r.cap}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    aria-pressed={star}
                                                                    aria-label={`${star ? 'Unstar' : 'Star'} ${r.name}`}
                                                                    className={cn(
                                                                        'relative grid size-10 shrink-0 place-items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff3ea5]',
                                                                        star ? 'text-[#facc15]' : 'text-[#4b4b74] hover:text-[#c4c4e0]',
                                                                    )}
                                                                    onClick={() => toggleStar(r)}
                                                                >
                                                                    {star ? <PiStarFill className="size-4" aria-hidden="true" /> : <PiStarBold className="size-4" aria-hidden="true" />}
                                                                </button>
                                                            </li>
                                                        )
                                                    })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="col-span-2 min-w-0 border-t border-white/5 bg-[#181836] md:col-span-1 md:border-l md:border-t-0">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div key={`${communityId}-${room.id}`} {...fade} className="flex h-full flex-col p-5 sm:p-7">
                                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b8bb0]">
                                    {community.name} / {room.section}
                                </p>
                                <h3 className="mt-2 flex items-center gap-2 text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
                                    {room.type === 'voice' ? (
                                        <PiSpeakerHighBold className="size-6 shrink-0 text-[#ff3ea5]" aria-hidden="true" />
                                    ) : (
                                        <PiHashBold className="size-6 shrink-0 text-[#ff3ea5]" aria-hidden="true" />
                                    )}
                                    <span className="min-w-0 break-words">{room.name}</span>
                                </h3>
                                <p className="mt-2 text-sm text-[#b4b4d4]">{room.mode}</p>

                                {room.type === 'voice' ? (
                                    <>
                                        <div className="mt-6 flex items-end justify-between gap-4">
                                            <p className="font-mono text-4xl font-bold tabular-nums text-white">
                                                {players}
                                                <span className="text-lg text-[#6b6b94]">/{room.cap}</span>
                                            </p>
                                            {room.live && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff3ea5] px-3 py-1 font-mono text-[11px] font-bold uppercase text-[#ff3ea5]">
                                                    <PiTrophyBold className="size-3.5" aria-hidden="true" />
                                                    Streaming now
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
                                            {Array.from({ length: room.cap }, (_, i) => (
                                                <span
                                                    key={i}
                                                    className={cn(
                                                        'h-2.5 w-4 rounded-sm',
                                                        i < room.players ? 'bg-[#22d3ee]' : i < players ? 'bg-[#ff3ea5]' : 'bg-white/10',
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {party.slice(0, Math.min(5, room.players)).map((src) => (
                                                    <img key={src} src={src} alt="" loading="lazy" className="size-9 rounded-full border-2 border-[#181836] object-cover" />
                                                ))}
                                            </div>
                                            {room.players > 5 && <span className="font-mono text-xs text-[#8b8bb0]">+{room.players - 5} more</span>}
                                        </div>
                                    </>
                                ) : (
                                    <p className="mt-6 rounded-2xl bg-[#12122b] p-4 text-sm leading-relaxed text-[#b4b4d4]">
                                        <span className="font-mono text-2xl font-bold text-white">{room.players}</span> players chatting here right now.
                                        Text rooms keep history, so you can catch up any time.
                                    </p>
                                )}

                                <div className="mt-auto pt-8">
                                    <button
                                        type="button"
                                        aria-pressed={isJoined}
                                        disabled={Boolean(full)}
                                        className={cn(
                                            'inline-flex min-h-12 w-full items-center justify-center rounded-xl font-mono text-sm font-bold uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3ea5] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-[#6b6b94] disabled:shadow-none',
                                            isJoined
                                                ? 'border border-[#ff3ea5] text-[#ff3ea5] hover:bg-[#ff3ea5]/10'
                                                : 'bg-[#ff3ea5] text-white shadow-[0_0_28px_-6px_#ff3ea5] hover:bg-[#ff5fb5]',
                                        )}
                                        onClick={toggleJoin}
                                    >
                                        {full ? 'Room full' : isJoined ? 'Joined · Leave' : room.type === 'voice' ? 'Join room' : 'Open room'}
                                    </button>
                                </div>
                            </motion.div>
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

export default ServerRailGroupSidebar

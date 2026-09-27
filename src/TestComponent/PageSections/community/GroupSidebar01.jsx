// ChannelCategoriesGroupSidebar

// GroupSidebar01 · Social Networks & Communities › Community / Group Sidebar

// Description:
// A dark, warm channel sidebar for the community app Campfire, shown inside an app window
// for the server "Northwoods Hikers". Collapsible categories (Base camp, Campsite, Around
// the fire, Clubs) list # text, announcement and voice channels with unread and mention
// badges, a "Jump to a channel" filter, voice rooms you can join and a user panel. The
// right pane previews the selected channel. Use it for chat-style community products.

// Design:
// - App window rounded-[28px]: md:grid-cols-[18rem_1fr] (sidebar + channel pane); below md
//   the sidebar comes first, full width, and the pane follows with a 22rem minimum height
// - Charcoal #1e1f22 section, sidebar #26272b, pane #2d2e33, stone text #e7e5e4 / #a1a1aa,
//   ember orange #f97316 for mentions, active bar, voice ring and focus outlines
// - Banner photo with a charcoal gradient; channel rows are 40px rounded-lg buttons with
//   Phosphor icons; category labels in tiny uppercase tracking; mono counts
// - The active highlight glides between rows via a shared layoutId; categories and new
//   messages expand/animate with framer-motion (instant for reduced motion)
// - Header copy sits above the window; on lg the heading and intro split into two columns

// What it does:
// - Category buttons toggle open/closed (aria-expanded); a collapsed category still shows
//   the active channel and anything with mentions; a check button marks a category read
// - Selecting a text channel makes it active and clears its unread count; selecting a
//   voice channel joins it (you appear under it) and shows a "Voice connected" bar with a
//   disconnect button; mute / deafen toggles use aria-pressed
// - The filter narrows channels across all categories and opens them while searching
// - The pane shows sample messages and a working message box that appends to the channel

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ChannelCategoriesGroupSidebar from '@/TestComponent/PageSections/community/GroupSidebar01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ChannelCategoriesGroupSidebar />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    PiCaretDownBold,
    PiCheckBold,
    PiHashBold,
    PiHeadphonesBold,
    PiMagnifyingGlassBold,
    PiMegaphoneBold,
    PiMicrophoneBold,
    PiMicrophoneSlashBold,
    PiPaperPlaneTiltBold,
    PiPhoneDisconnectBold,
    PiSpeakerHighBold,
    PiSpeakerSlashBold,
    PiWaveformBold,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const people = {
    maya: { name: 'Maya Cortez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    theo: { name: 'Theo Lindqvist', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    juno: { name: 'Juno Park', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80' },
    sam: { name: 'Sam Okafor', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
    me: { name: 'Rowan Pike', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
}

const categories = [
    {
        id: 'base',
        name: 'Base camp',
        channels: [
            { id: 'welcome', type: 'text', name: 'welcome', topic: 'Say hi, share your home trail.' },
            { id: 'announcements', type: 'announce', name: 'announcements', topic: 'Club news from the organisers.' },
            { id: 'trail-rules', type: 'text', name: 'trail-rules', topic: 'Leave no trace. Leave no drama.' },
        ],
    },
    {
        id: 'campsite',
        name: 'Campsite',
        channels: [
            { id: 'general', type: 'text', name: 'general', topic: 'Anything and everything outdoors.' },
            { id: 'trail-talk', type: 'text', name: 'trail-talk', topic: 'Conditions, closures and route beta.' },
            { id: 'gear-swap', type: 'text', name: 'gear-swap', topic: 'Buy, sell, lend. Prices in USD.' },
            { id: 'carpools', type: 'text', name: 'carpools', topic: 'Rides to the trailheads — fill the seats.' },
            { id: 'photo-dump', type: 'text', name: 'photo-dump', topic: 'Summits, sunsets and blurry marmots.' },
        ],
    },
    {
        id: 'fire',
        name: 'Around the fire',
        channels: [
            { id: 'fireside', type: 'voice', name: 'Fireside Lounge', members: ['maya', 'theo', 'juno'] },
            { id: 'night-hike', type: 'voice', name: 'Night Hike Planning', members: [] },
            { id: 'quiet-tent', type: 'voice', name: 'Quiet Tent', members: ['sam'] },
        ],
    },
    {
        id: 'clubs',
        name: 'Clubs',
        channels: [
            { id: 'bouldering', type: 'text', name: 'bouldering', topic: 'Crag days and gym sessions.' },
            { id: 'paddling', type: 'text', name: 'paddling', topic: 'Canoes, kayaks, cold water.' },
            { id: 'birding', type: 'text', name: 'birding', topic: 'Spotted something? Post it with a location.' },
        ],
    },
]

const allChannels = categories.flatMap((c) => c.channels.map((ch) => ({ ...ch, category: c.id })))
const channelById = Object.fromEntries(allChannels.map((ch) => [ch.id, ch]))

const initialUnread = {
    announcements: { count: 2, mentions: 0 },
    general: { count: 14, mentions: 2 },
    'gear-swap': { count: 3, mentions: 0 },
    carpools: { count: 1, mentions: 1 },
    paddling: { count: 5, mentions: 0 },
}

const initialMessages = {
    'trail-talk': [
        { id: 'm1', who: 'maya', time: '9:12 am', text: 'Heads up: the Ridge Loop bridge at mile 3.4 is closed until Oct 10. Detour adds about 1.2 mi.' },
        { id: 'm2', who: 'theo', time: '9:20 am', text: 'Thanks! Is the Cedar Falls spur still muddy after Thursday’s rain?' },
        { id: 'm3', who: 'juno', time: '9:31 am', text: 'Hiked it yesterday — ankle-deep near the falls, fine otherwise. Gaiters recommended.' },
    ],
    general: [
        { id: 'g1', who: 'sam', time: '8:02 am', text: 'Sunrise from Owl Point this morning was unreal. Photos going in #photo-dump.' },
        { id: 'g2', who: 'maya', time: '8:15 am', text: 'Reminder: Saturday’s beginner hike meets at the north lot, 7:30 sharp.' },
    ],
    announcements: [
        { id: 'a1', who: 'maya', time: 'Mon', text: 'Fall Traverse sign-ups open Friday at noon. 24 spots, two guides, one very large pot of chilli.' },
    ],
}

const typeIcon = { text: PiHashBold, announce: PiMegaphoneBold, voice: PiSpeakerHighBold }

export function ChannelCategoriesGroupSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()

    const [open, setOpen] = useState({ base: true, campsite: true, fire: true, clubs: false })
    const [active, setActive] = useState('trail-talk')
    const [unread, setUnread] = useState(initialUnread)
    const [voice, setVoice] = useState(null)
    const [muted, setMuted] = useState(false)
    const [deafened, setDeafened] = useState(false)
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState(initialMessages)
    const [draft, setDraft] = useState('')
    const [announce, setAnnounce] = useState('')

    const q = query.trim().toLowerCase()
    const activeChannel = channelById[active]
    const totalMentions = Object.values(unread).reduce((s, u) => s + u.mentions, 0)

    const selectChannel = (channel) => {
        if (channel.type === 'voice') {
            setVoice(channel.id)
            setActive(channel.id)
            setAnnounce(`Joined ${channel.name}.`)
            return
        }
        setActive(channel.id)
        setUnread((u) => {
            if (!u[channel.id]) return u
            const next = { ...u }
            delete next[channel.id]
            return next
        })
    }

    const markRead = (category) => {
        setUnread((u) => {
            const next = { ...u }
            category.channels.forEach((ch) => delete next[ch.id])
            return next
        })
        setAnnounce(`Marked ${category.name} as read.`)
    }

    const leaveVoice = () => {
        const name = channelById[voice]?.name
        setVoice(null)
        setAnnounce(`Left ${name}.`)
    }

    const send = (event) => {
        event.preventDefault()
        const text = draft.trim()
        if (!text || activeChannel.type === 'voice') return
        setMessages((m) => ({
            ...m,
            [active]: [...(m[active] ?? []), { id: `${active}-${Date.now()}`, who: 'me', time: 'Now', text }],
        }))
        setDraft('')
    }

    const ActiveIcon = typeIcon[activeChannel.type]
    const channelList = activeChannel.type === 'voice' ? [] : messages[active] ?? []
    const voiceMembers = (channel) => [...channel.members, ...(voice === channel.id ? ['me'] : [])]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#1e1f22] px-4 py-16 text-base font-normal text-[#e7e5e4] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-[#f97316] opacity-[0.12] blur-3xl"
            />
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#f97316]">Campfire · Servers</p>
                        <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-[#fafaf9] sm:text-5xl lg:text-6xl">
                            Every trail needs a <span className="text-[#f97316]">campfire.</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-[#a1a1aa] lg:justify-self-end">
                        Channels grouped the way your club actually talks — fold away what you do not need, and
                        never miss the ping that matters.
                    </p>
                </div>

                <div className="mt-12 overflow-hidden rounded-[28px] bg-[#26272b] shadow-[0_40px_120px_-40px_rgba(249,115,22,0.35)] ring-1 ring-white/10 md:grid md:grid-cols-[18rem_minmax(0,1fr)]">
                    <nav aria-label="Northwoods Hikers channels" className="flex min-w-0 flex-col border-white/5 md:border-r">
                        <div className="relative h-28 shrink-0 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
                                alt="View from inside a tent looking out to a pine forest"
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#26272b] via-[#26272b]/40 to-transparent" />
                            <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="truncate text-base font-bold text-white">Northwoods Hikers</p>
                                    <p className="font-mono text-[11px] text-[#d6d3d1]">1,284 members · 96 online</p>
                                </div>
                                {totalMentions > 0 && (
                                    <span className="shrink-0 rounded-full bg-[#f97316] px-2 py-0.5 font-mono text-[11px] font-bold text-[#1e1f22]">
                                        @{totalMentions}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="px-3 pt-3">
                            <label htmlFor={`${uid}-filter`} className="sr-only">
                                Jump to a channel
                            </label>
                            <div className="relative">
                                <PiMagnifyingGlassBold
                                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#71717a]"
                                    aria-hidden="true"
                                />
                                <input
                                    id={`${uid}-filter`}
                                    type="search"
                                    value={query}
                                    placeholder="Jump to a channel"
                                    className="min-h-10 w-full rounded-lg bg-[#1e1f22] pl-9 pr-3 text-sm text-[#e7e5e4] placeholder:text-[#71717a] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#f97316]"
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto px-2 py-4 md:max-h-[34rem]">
                            {categories.map((category) => {
                                const matches = q
                                    ? category.channels.filter((ch) => ch.name.toLowerCase().includes(q))
                                    : category.channels
                                if (q && matches.length === 0) return null
                                const isOpen = q ? true : open[category.id]
                                const visible = isOpen
                                    ? matches
                                    : matches.filter((ch) => ch.id === active || ch.id === voice || unread[ch.id]?.mentions)
                                const hasUnread = category.channels.some((ch) => unread[ch.id])
                                const listId = `${uid}-cat-${category.id}`
                                return (
                                    <div key={category.id}>
                                        <div className="flex items-center gap-1 pr-1">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={listId}
                                                disabled={Boolean(q)}
                                                className="flex min-h-10 flex-1 items-center gap-1.5 rounded-md px-1.5 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#a1a1aa] transition-colors hover:text-[#fafaf9] focus-visible:outline-2 focus-visible:outline-[#f97316] disabled:cursor-default"
                                                onClick={() => setOpen((o) => ({ ...o, [category.id]: !o[category.id] }))}
                                            >
                                                <PiCaretDownBold
                                                    className={cn(
                                                        'size-3 shrink-0 transition-transform duration-200 motion-reduce:transition-none',
                                                        !isOpen && '-rotate-90',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                <span className="truncate">{category.name}</span>
                                            </button>
                                            {hasUnread && (
                                                <button
                                                    type="button"
                                                    aria-label={`Mark ${category.name} as read`}
                                                    title="Mark as read"
                                                    className="grid size-10 place-items-center rounded-md text-[#71717a] transition-colors hover:bg-white/5 hover:text-[#f97316] focus-visible:outline-2 focus-visible:outline-[#f97316]"
                                                    onClick={() => markRead(category)}
                                                >
                                                    <PiCheckBold className="size-3.5" aria-hidden="true" />
                                                </button>
                                            )}
                                        </div>
                                        <ul id={listId} className="mt-0.5 space-y-0.5">
                                            <AnimatePresence initial={false}>
                                                {visible.map((ch) => {
                                                    const Icon = typeIcon[ch.type]
                                                    const u = unread[ch.id]
                                                    const isActive = active === ch.id
                                                    const isVoice = ch.type === 'voice'
                                                    const members = isVoice ? voiceMembers(ch) : []
                                                    return (
                                                        <motion.li
                                                            key={ch.id}
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <button
                                                                type="button"
                                                                aria-current={isActive ? 'page' : undefined}
                                                                aria-label={[
                                                                    isVoice ? `${ch.name} voice channel` : `${ch.name} channel`,
                                                                    u ? `${u.count} unread` : '',
                                                                    u?.mentions ? `${u.mentions} mentions` : '',
                                                                    isVoice && members.length ? `${members.length} connected` : '',
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(', ')}
                                                                className={cn(
                                                                    'group relative flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-[15px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f97316]',
                                                                    isActive ? 'text-white' : u ? 'text-[#fafaf9]' : 'text-[#a1a1aa] hover:bg-white/[0.04] hover:text-[#e7e5e4]',
                                                                )}
                                                                onClick={() => selectChannel(ch)}
                                                            >
                                                                {isActive && (
                                                                    <motion.span
                                                                        layoutId={`${uid}-active`}
                                                                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                                                        className="absolute inset-0 rounded-lg bg-white/[0.08]"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {u && !isActive && (
                                                                    <span
                                                                        className="absolute left-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r-full bg-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                <Icon
                                                                    className={cn(
                                                                        'relative size-[18px] shrink-0',
                                                                        isVoice && voice === ch.id ? 'text-[#f97316]' : 'text-[#71717a]',
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                <span className={cn('relative min-w-0 flex-1 truncate', u && 'font-semibold')}>
                                                                    {ch.name}
                                                                </span>
                                                                {u?.mentions > 0 && (
                                                                    <span className="relative rounded-full bg-[#f97316] px-1.5 font-mono text-[11px] font-bold leading-5 text-[#1e1f22]">
                                                                        {u.mentions}
                                                                    </span>
                                                                )}
                                                                {u && !u.mentions && (
                                                                    <span className="relative font-mono text-[11px] text-[#a1a1aa]">{u.count}</span>
                                                                )}
                                                                {isVoice && ch.members.length === 0 && voice !== ch.id && (
                                                                    <span className="relative text-[11px] text-[#71717a]">empty</span>
                                                                )}
                                                            </button>
                                                            {isVoice && members.length > 0 && (
                                                                <ul className="mb-1 ml-8 mt-0.5 space-y-0.5" aria-label={`In ${ch.name}`}>
                                                                    {members.map((id) => (
                                                                        <li key={id} className="flex items-center gap-2 py-0.5 text-[13px] text-[#a1a1aa]">
                                                                            <img
                                                                                src={people[id].avatar}
                                                                                alt=""
                                                                                loading="lazy"
                                                                                className={cn(
                                                                                    'size-6 rounded-full object-cover',
                                                                                    id === 'maya' && 'ring-2 ring-[#f97316]',
                                                                                )}
                                                                            />
                                                                            <span className={cn('truncate', id === 'me' && 'text-[#fafaf9]')}>
                                                                                {people[id].name}
                                                                            </span>
                                                                            {id === 'me' && muted && (
                                                                                <>
                                                                                    <PiMicrophoneSlashBold className="size-3.5 shrink-0 text-[#f87171]" aria-hidden="true" />
                                                                                    <span className="sr-only">(muted)</span>
                                                                                </>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </motion.li>
                                                    )
                                                })}
                                            </AnimatePresence>
                                        </ul>
                                    </div>
                                )
                            })}
                            {q && !allChannels.some((ch) => ch.name.toLowerCase().includes(q)) && (
                                <p className="px-3 text-sm text-[#a1a1aa]">No channels match “{query.trim()}”.</p>
                            )}
                        </div>

                        <AnimatePresence initial={false}>
                            {voice && (
                                <motion.div
                                    key="voice"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                    className="overflow-hidden border-t border-white/5 bg-[#222326]"
                                >
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <PiWaveformBold className="size-5 shrink-0 text-[#4ade80]" aria-hidden="true" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-[#4ade80]">Voice connected</p>
                                            <p className="truncate text-xs text-[#a1a1aa]">{channelById[voice].name} / Northwoods</p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label="Disconnect from voice"
                                            className="grid size-10 place-items-center rounded-lg text-[#e7e5e4] transition-colors hover:bg-white/5 hover:text-[#f87171] focus-visible:outline-2 focus-visible:outline-[#f97316]"
                                            onClick={leaveVoice}
                                        >
                                            <PiPhoneDisconnectBold className="size-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-2 border-t border-white/5 bg-[#222326] px-3 py-2">
                            <span className="relative shrink-0">
                                <img src={people.me.avatar} alt="" loading="lazy" className="size-9 rounded-full object-cover" />
                                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-[3px] border-[#222326] bg-[#4ade80]" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#fafaf9]">{people.me.name}</p>
                                <p className="truncate text-[11px] text-[#a1a1aa]">Online · Trail lead</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={muted}
                                aria-label="Mute microphone"
                                className={cn(
                                    'grid size-10 place-items-center rounded-lg transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#f97316]',
                                    muted ? 'text-[#f87171]' : 'text-[#a1a1aa]',
                                )}
                                onClick={() => setMuted((m) => !m)}
                            >
                                {muted ? <PiMicrophoneSlashBold className="size-5" aria-hidden="true" /> : <PiMicrophoneBold className="size-5" aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                aria-pressed={deafened}
                                aria-label="Deafen"
                                className={cn(
                                    'grid size-10 place-items-center rounded-lg transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#f97316]',
                                    deafened ? 'text-[#f87171]' : 'text-[#a1a1aa]',
                                )}
                                onClick={() => setDeafened((d) => !d)}
                            >
                                {deafened ? <PiSpeakerSlashBold className="size-5" aria-hidden="true" /> : <PiHeadphonesBold className="size-5" aria-hidden="true" />}
                            </button>
                        </div>
                    </nav>

                    <div className="flex min-h-[22rem] min-w-0 flex-col bg-[#2d2e33]">
                        <header className="flex min-h-14 items-center gap-3 border-b border-black/20 px-4 sm:px-5">
                            <ActiveIcon className="size-5 shrink-0 text-[#71717a]" aria-hidden="true" />
                            <h3 className="truncate text-base font-bold text-[#fafaf9]">{activeChannel.name}</h3>
                            {activeChannel.topic && (
                                <p className="hidden min-w-0 truncate border-l border-white/10 pl-3 text-sm text-[#a1a1aa] sm:block">
                                    {activeChannel.topic}
                                </p>
                            )}
                        </header>

                        {activeChannel.type === 'voice' ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
                                <ul className="flex flex-wrap justify-center gap-4">
                                    {voiceMembers(activeChannel).map((id) => (
                                        <li key={id} className="flex w-24 flex-col items-center gap-2">
                                            <img
                                                src={people[id].avatar}
                                                alt=""
                                                loading="lazy"
                                                className={cn(
                                                    'size-16 rounded-full object-cover',
                                                    id === 'maya' ? 'ring-4 ring-[#f97316]' : 'ring-4 ring-white/5',
                                                )}
                                            />
                                            <span className="w-full truncate text-xs text-[#d6d3d1]">{people[id].name}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-[#a1a1aa]">
                                    {voice === activeChannel.id
                                        ? `You are in ${activeChannel.name}${muted ? ' (muted)' : ''}.`
                                        : `Select ${activeChannel.name} to join.`}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ol className="flex flex-1 flex-col justify-end gap-4 p-4 sm:p-5" aria-label={`Messages in ${activeChannel.name}`}>
                                    {channelList.length === 0 && (
                                        <li className="text-sm text-[#a1a1aa]">
                                            <p className="text-xl font-bold text-[#fafaf9]">Welcome to #{activeChannel.name}</p>
                                            <p className="mt-1">{activeChannel.topic} Be the first to post.</p>
                                        </li>
                                    )}
                                    <AnimatePresence initial={false}>
                                        {channelList.map((m) => (
                                            <motion.li
                                                key={m.id}
                                                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-3"
                                            >
                                                <img src={people[m.who].avatar} alt="" loading="lazy" className="size-9 shrink-0 rounded-full object-cover" />
                                                <div className="min-w-0">
                                                    <p className="text-sm">
                                                        <span className={cn('font-semibold', m.who === 'me' ? 'text-[#fdba74]' : 'text-[#fafaf9]')}>
                                                            {people[m.who].name}
                                                        </span>{' '}
                                                        <span className="font-mono text-[11px] text-[#71717a]">{m.time}</span>
                                                    </p>
                                                    <p className="mt-0.5 break-words text-[15px] leading-relaxed text-[#d6d3d1]">{m.text}</p>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ol>
                                <form className="px-4 pb-4 sm:px-5 sm:pb-5" onSubmit={send}>
                                    <label htmlFor={`${uid}-msg`} className="sr-only">
                                        Message #{activeChannel.name}
                                    </label>
                                    <div className="flex items-center gap-2 rounded-xl bg-[#393a40] pl-4 pr-1.5 focus-within:outline-2 focus-within:outline-[#f97316]">
                                        <input
                                            id={`${uid}-msg`}
                                            type="text"
                                            value={draft}
                                            maxLength={400}
                                            placeholder={`Message #${activeChannel.name}`}
                                            className="min-h-12 min-w-0 flex-1 bg-transparent text-[15px] text-[#fafaf9] placeholder:text-[#71717a] focus:outline-none"
                                            onChange={(e) => setDraft(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!draft.trim()}
                                            aria-label="Send message"
                                            className="grid size-10 place-items-center rounded-lg bg-[#f97316] text-[#1e1f22] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <PiPaperPlaneTiltBold className="size-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
                <p role="status" className="sr-only">
                    {announce}
                </p>
            </div>
        </section>
    )
}

export default ChannelCategoriesGroupSidebar

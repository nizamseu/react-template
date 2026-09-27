// ActivityLogActivityFeed

// ActivityFeed05 · Social Networks & Communities › Activity / Community Feed

// Description:
// A compact, ledger-style activity log for Guildhall, a guild of makers and craftspeople.
// "The Ledger" lists who joined which channel ("Maya Lindgren joined #design"), who earned
// a badge ("Omar Haddad earned the Mentor badge") and who posted, grouped by day with clock
// times, filter chips (All / Joins / Badges / Posts), Welcome and Cheer toggles, live
// entries that queue behind a "new entries" pill and a "Load older activity" button.

// Design:
// - Parchment #f6f1e7 canvas, ink #1c1917 text, burgundy #7f1d1d for the wax-seal logo,
//   active chips, channel names, the ledger margin rule and focus rings; brass #a16207 for
//   badge icons; hairlines in #d6cbb5
// - Serif typography throughout (heading text-4xl → md:text-6xl), small-caps day headers
//   with a hairline, mono clock times; the ledger card has faint ruled lines and a double
//   burgundy margin rule like account-book paper
// - Rows: 52px time column, 32px avatar with a tiny type medallion, one-line sentence,
//   then channel + action on a second line; 40px min targets for every control
// - Motion: rows fade and slide with layout animation when filters change; merged live
//   entries flash a pale gold background; reduced motion keeps fades only
// - Responsive: header stacks on base and splits from md; chips wrap; the time column
//   stays fixed so sentences wrap cleanly at 360px

// What it does:
// - filter state (all / joins / badges / posts) narrows the log; each chip shows its count
//   and aria-pressed; an empty-state line appears when a filter has no rows
// - After mount a 9 s interval queues up to three live entries (cleared when done or on
//   unmount); the "n new entries" pill merges them into Today with a highlight
// - Welcome (joins) and Cheer (badges, count ±1) are aria-pressed toggles; post titles
//   link to #guildhall-post-<id>; "Load older activity" appends Earlier this week once,
//   then shows "You’re all caught up"

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ActivityLogActivityFeed from '@/TestComponent/PageSections/community/ActivityFeed05';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ActivityLogActivityFeed />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowUp, LuAward, LuHand, LuPenLine, LuScrollText, LuUserPlus } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const face = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const kinds = {
    join: { Icon: LuUserPlus, medal: 'bg-[#1c1917] text-[#f6f1e7]' },
    badge: { Icon: LuAward, medal: 'bg-[#a16207] text-[#fef9c3]' },
    post: { Icon: LuPenLine, medal: 'bg-[#7f1d1d] text-[#fef2f2]' },
}

const initialEntries = [
    { id: 'e1', day: 'today', time: '09:42', kind: 'join', who: 'Maya Lindgren', img: face('1517841905240-472988babdf9'), channel: 'design' },
    { id: 'e2', day: 'today', time: '09:15', kind: 'badge', who: 'Omar Haddad', img: face('1599566150163-29194dcaad36'), badge: 'Mentor', note: 'for 50 helpful answers', cheers: 14 },
    { id: 'e3', day: 'today', time: '08:57', kind: 'post', who: 'Lena Park', img: face('1544005313-94ddf0286df2'), title: 'Letterpress pricing sheet, 2026 edition', channel: 'letterpress' },
    { id: 'e4', day: 'today', time: '08:20', kind: 'join', who: 'Tomasz Nowak', img: face('1570295999919-56ceb5ecca61'), channel: 'bookbinding' },
    { id: 'e5', day: 'today', time: '07:48', kind: 'badge', who: 'Adaeze Okoro', img: face('1531123897727-8f129e1688ce'), badge: 'First Commission', note: 'sold her first piece through the guild', cheers: 6 },
    { id: 'e6', day: 'yesterday', time: '21:10', kind: 'post', who: 'Hugo Almeida', img: face('1472099645785-5658abf4ff4e'), title: 'Gilding with 23k leaf: what went wrong', channel: 'bookbinding' },
    { id: 'e7', day: 'yesterday', time: '18:34', kind: 'badge', who: 'Sigrid Holm', img: face('1508214751196-bcfd4ca60f91'), badge: 'Archivist', note: 'for tagging 200 old threads', cheers: 21 },
    { id: 'e8', day: 'yesterday', time: '16:02', kind: 'join', who: 'Ravi Menon', img: face('1566492031773-4f4e44671857'), channel: 'woodcraft' },
    { id: 'e9', day: 'yesterday', time: '11:45', kind: 'post', who: 'Omar Haddad', img: face('1599566150163-29194dcaad36'), title: 'Office hours: portfolio reviews on Thursday', channel: 'mentors' },
]

const olderEntries = [
    { id: 'o1', day: 'earlier', time: 'Thu 19:30', kind: 'badge', who: 'Lena Park', img: face('1544005313-94ddf0286df2'), badge: 'Illuminator', note: 'for 10 hand-lettered covers', cheers: 33 },
    { id: 'o2', day: 'earlier', time: 'Wed 14:05', kind: 'join', who: 'Inès Laurent', img: face('1554151228-14d9def656e4'), channel: 'calligraphy' },
    { id: 'o3', day: 'earlier', time: 'Tue 10:12', kind: 'post', who: 'Adaeze Okoro', img: face('1531123897727-8f129e1688ce'), title: 'A plain-English commission contract template', channel: 'business' },
]

const liveQueue = [
    { id: 'n1', day: 'today', time: 'Just now', kind: 'join', who: 'Jun Takeda', img: face('1542909168-82c3e7fdca5c'), channel: 'calligraphy', fresh: true },
    { id: 'n2', day: 'today', time: 'Just now', kind: 'badge', who: 'Maya Lindgren', img: face('1517841905240-472988babdf9'), badge: 'First Post', note: 'shared her first sketchbook', cheers: 0, fresh: true },
    { id: 'n3', day: 'today', time: 'Just now', kind: 'post', who: 'Sigrid Holm', img: face('1508214751196-bcfd4ca60f91'), title: 'Scanner settings for crumbling archives', channel: 'archives', fresh: true },
]

const days = [
    { id: 'today', label: 'Today', date: 'Sunday 27 September' },
    { id: 'yesterday', label: 'Yesterday', date: 'Saturday 26 September' },
    { id: 'earlier', label: 'Earlier this week', date: '21 – 24 September' },
]

const filters = [
    { id: 'all', label: 'All' },
    { id: 'join', label: 'Joins' },
    { id: 'badge', label: 'Badges' },
    { id: 'post', label: 'Posts' },
]

function WaxSeal({ className }) {
    const dots = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return { key: i, cx: 20 + Math.cos(a) * 16.5, cy: 20 + Math.sin(a) * 16.5 }
    })
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            {dots.map((d) => (
                <circle key={d.key} cx={d.cx} cy={d.cy} r="3.4" fill="#7f1d1d" />
            ))}
            <circle cx="20" cy="20" r="16" fill="#7f1d1d" />
            <circle cx="20" cy="20" r="11.5" fill="none" stroke="#f6f1e7" strokeOpacity="0.45" strokeWidth="1" />
            <text x="20" y="25.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fontStyle="italic" fill="#f6f1e7">
                G
            </text>
        </svg>
    )
}

export function ActivityLogActivityFeed({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [entries, setEntries] = useState(initialEntries)
    const [pending, setPending] = useState([])
    const [queued, setQueued] = useState(0)
    const [filter, setFilter] = useState('all')
    const [loadedOlder, setLoadedOlder] = useState(false)
    const [welcomed, setWelcomed] = useState({})
    const [cheered, setCheered] = useState({})

    useEffect(() => {
        if (queued >= liveQueue.length) return undefined
        const id = setInterval(() => {
            setQueued((q) => Math.min(q + 1, liveQueue.length))
        }, 9000)
        return () => clearInterval(id)
    }, [queued])

    useEffect(() => {
        if (queued === 0) return
        const next = liveQueue[queued - 1]
        setPending((prev) => (prev.some((e) => e.id === next.id) ? prev : [next, ...prev]))
    }, [queued])

    const showPending = () => {
        setEntries((prev) => [...pending, ...prev.map((e) => ({ ...e, fresh: false }))])
        setPending([])
        setFilter('all')
    }

    const visible = filter === 'all' ? entries : entries.filter((e) => e.kind === filter)
    const countOf = (id) => (id === 'all' ? entries.length : entries.filter((e) => e.kind === id).length)

    const sentence = (e) => {
        if (e.kind === 'join') {
            return (
                <>
                    <span className="font-semibold text-[#1c1917]">{e.who}</span> joined{' '}
                    <span className="font-semibold text-[#7f1d1d]">#{e.channel}</span>
                </>
            )
        }
        if (e.kind === 'badge') {
            return (
                <>
                    <span className="font-semibold text-[#1c1917]">{e.who}</span> earned the{' '}
                    <span className="font-semibold italic text-[#a16207]">{e.badge}</span> badge{' '}
                    <span className="text-[#57534e]">— {e.note}</span>
                </>
            )
        }
        return (
            <>
                <span className="font-semibold text-[#1c1917]">{e.who}</span> posted{' '}
                <a
                    href={`#guildhall-post-${e.id}`}
                    className="rounded italic text-[#1c1917] underline decoration-[#7f1d1d]/40 underline-offset-2 hover:decoration-[#7f1d1d] focus-visible:outline-2 focus-visible:outline-[#7f1d1d]"
                >
                    “{e.title}”
                </a>{' '}
                in <span className="font-semibold text-[#7f1d1d]">#{e.channel}</span>
            </>
        )
    }

    const action = (e) => {
        if (e.kind === 'join') {
            const on = Boolean(welcomed[e.id])
            return (
                <button
                    type="button"
                    aria-pressed={on}
                    aria-label={on ? `Welcomed ${e.who}` : `Welcome ${e.who}`}
                    className={cn(
                        'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 font-sans text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]',
                        on ? 'border-[#1c1917] bg-[#1c1917] text-[#f6f1e7]' : 'border-[#d6cbb5] text-[#44403c] hover:border-[#1c1917]',
                    )}
                    onClick={() => setWelcomed((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                >
                    <LuHand aria-hidden="true" className="size-3.5" />
                    {on ? 'Welcomed' : 'Welcome'}
                </button>
            )
        }
        if (e.kind === 'badge') {
            const on = Boolean(cheered[e.id])
            const count = e.cheers + (on ? 1 : 0)
            return (
                <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`${on ? 'Remove cheer for' : 'Cheer'} ${e.who}, ${count} cheers`}
                    className={cn(
                        'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 font-sans text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]',
                        on ? 'border-[#a16207] bg-[#a16207] text-[#fefce8]' : 'border-[#d6cbb5] text-[#44403c] hover:border-[#a16207]',
                    )}
                    onClick={() => setCheered((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                >
                    <LuAward aria-hidden="true" className="size-3.5" />
                    Cheer
                    <span className="tabular-nums opacity-80">{count}</span>
                </button>
            )
        }
        return (
            <a
                href={`#guildhall-post-${e.id}`}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#d6cbb5] px-3 font-sans text-xs font-semibold text-[#44403c] transition-colors hover:border-[#7f1d1d] hover:text-[#7f1d1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
            >
                <LuScrollText aria-hidden="true" className="size-3.5" />
                Read
            </a>
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f6f1e7] py-12 font-serif text-base font-normal text-[#1c1917] md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7f1d1d]">
                            <WaxSeal className="size-9" />
                            Guildhall · Est. 2019
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-none tracking-tight text-[#1c1917] sm:text-5xl md:text-6xl">
                            The <em className="text-[#7f1d1d]">Ledger</em>
                        </h2>
                        <p className="mt-3 max-w-md text-base leading-relaxed text-[#57534e]">
                            Every arrival, honour and new piece of writing in the guild, entered in order.
                        </p>
                    </div>
                    <p className="flex items-center gap-2 font-sans text-xs text-[#57534e]">
                        <span className="relative flex size-2">
                            <span className="absolute inset-0 animate-ping rounded-full bg-[#7f1d1d] opacity-50 motion-reduce:animate-none" />
                            <span className="relative size-2 rounded-full bg-[#7f1d1d]" />
                        </span>
                        Recording live · 1,406 members
                    </p>
                </div>

                <div role="group" aria-label="Filter activity" className="mt-8 flex flex-wrap gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            aria-pressed={filter === f.id}
                            className={cn(
                                'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]',
                                filter === f.id
                                    ? 'border-[#7f1d1d] bg-[#7f1d1d] text-[#f6f1e7]'
                                    : 'border-[#d6cbb5] bg-[#fbf8f1] text-[#44403c] hover:border-[#7f1d1d]',
                            )}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                            <span
                                className={cn(
                                    'rounded-full px-1.5 text-[11px] tabular-nums',
                                    filter === f.id ? 'bg-[#f6f1e7]/20' : 'bg-[#ede5d3] text-[#57534e]',
                                )}
                            >
                                {countOf(f.id)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#d6cbb5] bg-[#fbf8f1] bg-[repeating-linear-gradient(180deg,transparent_0,transparent_35px,rgba(127,29,29,0.06)_35px,rgba(127,29,29,0.06)_36px)] shadow-[0_24px_50px_-36px_rgba(28,25,23,0.5)]">
                    <span aria-hidden="true" className="absolute inset-y-0 left-[60px] w-[3px] border-x border-[#7f1d1d]/25 sm:left-[76px]" />

                    <AnimatePresence>
                        {pending.length > 0 && (
                            <motion.div
                                key="pending"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                                className="relative overflow-hidden"
                            >
                                <div className="flex justify-center px-4 pt-4">
                                    <button
                                        type="button"
                                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#1c1917] px-4 font-sans text-xs font-semibold text-[#f6f1e7] shadow-lg hover:bg-[#7f1d1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                        onClick={showPending}
                                    >
                                        <LuArrowUp aria-hidden="true" className="size-3.5" />
                                        {pending.length} new {pending.length === 1 ? 'entry' : 'entries'} — show
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <p aria-live="polite" className="sr-only">
                        {pending.length ? `${pending.length} new activity entries available` : ''}
                    </p>

                    <div className="relative px-3 pb-4 pt-2 sm:px-5">
                        {days.map((day) => {
                            const rows = visible.filter((e) => e.day === day.id)
                            if (!rows.length) return null
                            return (
                                <div key={day.id} className="pt-5">
                                    <h3 className="flex items-baseline gap-3 pl-[60px] font-serif text-sm font-normal text-[#1c1917] sm:pl-[72px]">
                                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f1d1d] [font-variant:small-caps]">
                                            {day.label}
                                        </span>
                                        <span className="h-px flex-1 bg-[#d6cbb5]" aria-hidden="true" />
                                        <span className="shrink-0 text-xs italic text-[#78716c]">{day.date}</span>
                                    </h3>
                                    <ul className="mt-2">
                                        <AnimatePresence initial={false}>
                                            {rows.map((e) => {
                                                const kind = kinds[e.kind]
                                                return (
                                                    <motion.li
                                                        key={e.id}
                                                        layout={!reduceMotion}
                                                        initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                            backgroundColor: e.fresh ? ['rgba(250,204,21,0.28)', 'rgba(250,204,21,0)'] : 'rgba(250,204,21,0)',
                                                        }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3, backgroundColor: { duration: 2.4 } }}
                                                        className="flex items-start gap-3 rounded-xl py-2.5 pr-1"
                                                    >
                                                        <span className="w-12 shrink-0 pt-1.5 text-right font-mono text-[11px] leading-tight text-[#78716c] sm:w-14">
                                                            {e.time}
                                                        </span>
                                                        <span className="relative ml-1 shrink-0 sm:ml-3">
                                                            <img
                                                                src={e.img}
                                                                alt=""
                                                                loading="lazy"
                                                                className="size-8 rounded-full object-cover grayscale-[35%] sepia-[20%]"
                                                            />
                                                            <span
                                                                aria-hidden="true"
                                                                className={cn(
                                                                    'absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full ring-2 ring-[#fbf8f1]',
                                                                    kind.medal,
                                                                )}
                                                            >
                                                                <kind.Icon className="size-2.5" />
                                                            </span>
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[15px] leading-snug text-[#44403c]">{sentence(e)}</p>
                                                            <div className="mt-1.5">{action(e)}</div>
                                                        </div>
                                                    </motion.li>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </ul>
                                </div>
                            )
                        })}

                        {visible.length === 0 && (
                            <p className="py-10 text-center italic text-[#78716c]">Nothing of this kind has been entered yet.</p>
                        )}

                        <div className="mt-6 flex justify-center border-t border-[#d6cbb5] pt-5">
                            {loadedOlder ? (
                                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">
                                    You’re all caught up
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#1c1917] px-5 font-sans text-sm font-semibold text-[#1c1917] transition-colors hover:bg-[#1c1917] hover:text-[#f6f1e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d1d]"
                                    onClick={() => {
                                        setEntries((prev) => [...prev, ...olderEntries])
                                        setLoadedOlder(true)
                                    }}
                                >
                                    <LuScrollText aria-hidden="true" className="size-4" />
                                    Load older activity
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ActivityLogActivityFeed

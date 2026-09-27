// AccountSwitcherAppNavigation

// AppNavigation04 · Social Networks & Communities › Global Navigation & Profile Quick-Access

// Description:
// A crisp black-and-white header for Threadly, a text-first social app for writers. The
// search field opens a "Recent searches" dropdown (remove one, "Clear all", people
// suggestions) and filters the "For you" timeline below. The account button opens a quick
// switcher with two accounts (@dana.writes, @okafor.studio), an "Add account" form and an
// Online / Away / Do not disturb status picker. Use it for apps with multiple identities.

// Design:
// - White canvas, black #0a0a0a ink and 2px black rules, sky #0ea5e9 for focus rings,
//   the active-account check, the "Add account" link and the brand dot in the wordmark
// - Wordmark "threadly" in font-black lowercase with an SVG spool mark; the search is a
//   rounded-xl field with a 2px black border and a hard offset shadow when focused
// - Popovers are white cards with a 2px black border and a 6px black offset shadow;
//   status dots are #22c55e / #f59e0b / #ef4444; threads use large text-lg leading
// - Motion: popovers drop 6px and fade in (fade only with reduced motion); timeline
//   rows fade when the search filter changes
// - Responsive: base / sm put the search on its own full-width row under the logo bar;
//   md and up place logo, search and account button in one 72px row

// What it does:
// - Search: controlled input; focus or Arrow Down opens the dropdown, Arrow keys move
//   between options, Escape or an outside click closes it; submitting (or picking a
//   recent / person) filters the timeline and moves the term to the top of the recents
// - Empty submit shows "Type something to search"; each recent has a remove button and
//   "Clear all" empties the list
// - Account switcher: radio rows switch the active account (avatar, name, timeline
//   greeting update); "Add account" validates a 3-20 character handle, rejects duplicates,
//   adds it and switches to it (max 3); the status radios recolour the avatar dot
// - The switcher closes on Escape (focus back to the button) or outside click; "Log out"
//   links to #threadly-logout

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AccountSwitcherAppNavigation from '@/TestComponent/PageSections/community/AppNavigation04';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <AccountSwitcherAppNavigation />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiCheck,
    HiChevronUpDown,
    HiMagnifyingGlass,
    HiOutlineArrowPath,
    HiOutlineArrowRightOnRectangle,
    HiOutlineChatBubbleLeft,
    HiOutlineClock,
    HiOutlinePlus,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const statuses = [
    { id: 'online', label: 'Online', hint: 'Show when you’re active', dot: 'bg-[#22c55e]' },
    { id: 'away', label: 'Away', hint: 'Replies may be slow', dot: 'bg-[#f59e0b]' },
    { id: 'dnd', label: 'Do not disturb', hint: 'Mute all notifications', dot: 'bg-[#ef4444]' },
]

const startAccounts = [
    {
        handle: 'dana.writes',
        name: 'Dana Okafor',
        note: 'Personal',
        img: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=400&q=80',
    },
    { handle: 'okafor.studio', name: 'Okafor Studio', note: 'Brand · 3 new', initials: 'OS' },
]

const people = [
    {
        handle: 'rafa.m',
        name: 'Rafael Moreno',
        img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'imo.reads',
        name: 'Imogen Clarke',
        img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'finch.types',
        name: 'Walter Finch',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
]

const threads = [
    {
        id: 't1',
        person: people[0],
        time: '12m',
        text: 'Hot take: the best writing advice is “cut the first paragraph”. Nine times out of ten the piece starts in paragraph two.',
        replies: 128,
        reposts: 42,
    },
    {
        id: 't2',
        person: people[1],
        time: '2h',
        text: 'Starting a 30-day journaling challenge, one page a day. Day 1: the kettle, the rain, the unfinished crossword.',
        replies: 64,
        reposts: 19,
    },
    {
        id: 't3',
        person: people[2],
        time: '5h',
        text: 'Typewriter repair tip: one drop of sewing-machine oil on the carriage rail. Never WD-40. Your platen will thank you.',
        replies: 31,
        reposts: 7,
    },
]

const HANDLE_RE = /^[a-z0-9._]{3,20}$/

function SpoolMark({ className }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" fill="#0a0a0a" />
            <path
                d="M10 12.5c4-2 8 2 12 0M10 16c4-2 8 2 12 0M10 19.5c4-2 8 2 12 0"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="24" cy="24" r="3.5" fill="#0ea5e9" stroke="#0a0a0a" strokeWidth="1.5" />
        </svg>
    )
}

function AccountAvatar({ account, className }) {
    if (account.img) return <img src={account.img} alt="" className={cn('rounded-full object-cover', className)} />
    return (
        <span
            aria-hidden="true"
            className={cn(
                'grid place-items-center rounded-full bg-[#0a0a0a] text-[11px] font-black tracking-wider text-[#7dd3fc]',
                className,
            )}
        >
            {account.initials}
        </span>
    )
}

export function AccountSwitcherAppNavigation({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const [query, setQuery] = useState('')
    const [searched, setSearched] = useState('')
    const [searchError, setSearchError] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [recents, setRecents] = useState(['writing prompts', 'journaling', 'typewriter repair', 'short fiction'])
    const [accounts, setAccounts] = useState(startAccounts)
    const [current, setCurrent] = useState('dana.writes')
    const [status, setStatus] = useState('online')
    const [switcherOpen, setSwitcherOpen] = useState(false)
    const [adding, setAdding] = useState(false)
    const [newHandle, setNewHandle] = useState('')
    const [handleError, setHandleError] = useState('')
    const searchWrapRef = useRef(null)
    const inputRef = useRef(null)
    const switcherRef = useRef(null)
    const accountBtnRef = useRef(null)
    const skipOpenRef = useRef(false)

    const account = accounts.find((a) => a.handle === current) ?? accounts[0]
    const statusMeta = statuses.find((s) => s.id === status)
    const q = query.trim().toLowerCase()
    const matchingRecents = q ? recents.filter((r) => r.toLowerCase().includes(q)) : recents
    const matchingPeople = q
        ? people.filter((p) => p.name.toLowerCase().includes(q) || p.handle.includes(q.replace(/^@/, '')))
        : []
    const needle = searched.toLowerCase().replace(/^@/, '')
    const visibleThreads = needle
        ? threads.filter(
            (t) =>
                t.text.toLowerCase().includes(needle) ||
                t.person.name.toLowerCase().includes(needle) ||
                t.person.handle.includes(needle),
        )
        : threads

    useEffect(() => {
        if (!searchOpen) return undefined
        const onPointer = (event) => {
            if (!searchWrapRef.current?.contains(event.target)) setSearchOpen(false)
        }
        document.addEventListener('pointerdown', onPointer)
        return () => document.removeEventListener('pointerdown', onPointer)
    }, [searchOpen])

    useEffect(() => {
        if (!switcherOpen) return undefined
        const onPointer = (event) => {
            if (switcherRef.current?.contains(event.target) || accountBtnRef.current?.contains(event.target)) return
            setSwitcherOpen(false)
        }
        const onKey = (event) => {
            if (event.key !== 'Escape') return
            setSwitcherOpen(false)
            accountBtnRef.current?.focus()
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [switcherOpen])

    const runSearch = (term) => {
        const clean = term.trim()
        if (!clean) {
            setSearchError('Type something to search')
            return
        }
        setSearchError('')
        setQuery(clean)
        setSearched(clean)
        setRecents((prev) => [clean, ...prev.filter((r) => r.toLowerCase() !== clean.toLowerCase())].slice(0, 6))
        setSearchOpen(false)
        if (typeof document !== 'undefined' && document.activeElement !== inputRef.current) {
            skipOpenRef.current = true
            inputRef.current?.focus()
        }
    }

    const onSearchSubmit = (event) => {
        event.preventDefault()
        runSearch(query)
    }

    const focusOption = (dir) => {
        const options = Array.from(searchWrapRef.current?.querySelectorAll('[data-search-option]') ?? [])
        if (!options.length) return
        const index = options.indexOf(document.activeElement)
        if (index === -1) {
            options[dir > 0 ? 0 : options.length - 1].focus()
            return
        }
        const next = index + dir
        if (next < 0) inputRef.current?.focus()
        else options[Math.min(next, options.length - 1)].focus()
    }

    const onSearchKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (!searchOpen) setSearchOpen(true)
            else focusOption(1)
        } else if (event.key === 'ArrowUp' && searchOpen) {
            event.preventDefault()
            focusOption(-1)
        } else if (event.key === 'Escape' && searchOpen) {
            event.preventDefault()
            setSearchOpen(false)
            inputRef.current?.focus()
        }
    }

    const addAccount = (event) => {
        event.preventDefault()
        const handle = newHandle.trim().replace(/^@/, '').toLowerCase()
        if (!HANDLE_RE.test(handle)) {
            setHandleError('Use 3-20 letters, numbers, dots or underscores.')
            return
        }
        if (accounts.some((a) => a.handle === handle)) {
            setHandleError(`@${handle} is already signed in.`)
            return
        }
        const initials = handle.replace(/[^a-z]/g, '').slice(0, 2).toUpperCase() || 'TH'
        setAccounts((prev) => [...prev, { handle, name: `@${handle}`, note: 'Just added', initials }])
        setCurrent(handle)
        setNewHandle('')
        setHandleError('')
        setAdding(false)
    }

    const pop = {
        initial: { opacity: 0, y: reduceMotion ? 0 : -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: reduceMotion ? 0 : -4 },
        transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
    }

    const searchBox = (
        <div ref={searchWrapRef} className="relative w-full" onKeyDown={onSearchKeyDown}>
            <form role="search" noValidate onSubmit={onSearchSubmit}>
                <label htmlFor={`${baseId}-search`} className="sr-only">
                    Search Threadly
                </label>
                <HiMagnifyingGlass
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-[22px] size-5 -translate-y-1/2 text-[#0a0a0a]"
                />
                <input
                    ref={inputRef}
                    id={`${baseId}-search`}
                    type="search"
                    value={query}
                    autoComplete="off"
                    aria-describedby={`${baseId}-search-hint ${baseId}-search-error`}
                    placeholder="Search threads, people, tags"
                    className="h-11 w-full rounded-xl border-2 border-[#0a0a0a] bg-white pl-11 pr-4 text-sm font-medium text-[#0a0a0a] placeholder:text-[#737373] transition-shadow focus:shadow-[4px_4px_0_#0a0a0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2"
                    onFocus={() => {
                        if (skipOpenRef.current) {
                            skipOpenRef.current = false
                            return
                        }
                        setSearchOpen(true)
                    }}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setSearchOpen(true)
                        setSearchError('')
                        if (!event.target.value) setSearched('')
                    }}
                />
            </form>
            <p id={`${baseId}-search-hint`} className="sr-only">
                Recent searches appear below; use the arrow keys to move through them.
            </p>
            <p id={`${baseId}-search-error`} aria-live="polite" className="sr-only">
                {searchError}
            </p>
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        {...pop}
                        className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border-2 border-[#0a0a0a] bg-white shadow-[6px_6px_0_#0a0a0a]"
                    >
                        {searchError && (
                            <p className="border-b border-[#e5e5e5] px-4 py-2.5 text-xs font-semibold text-[#dc2626]">
                                {searchError}
                            </p>
                        )}
                        {q && (
                            <button
                                type="button"
                                data-search-option
                                className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm font-semibold text-[#0a0a0a] hover:bg-[#f0f9ff] focus-visible:bg-[#e0f2fe] focus-visible:outline-none"
                                onClick={() => runSearch(query)}
                            >
                                <HiMagnifyingGlass aria-hidden="true" className="size-4 text-[#0ea5e9]" />
                                Search for “{query.trim()}”
                            </button>
                        )}
                        <div className="flex items-center justify-between px-4 pb-1 pt-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373]">
                                Recent searches
                            </p>
                            {recents.length > 0 && (
                                <button
                                    type="button"
                                    className="min-h-8 rounded px-1 text-xs font-bold text-[#0284c7] hover:underline focus-visible:outline-2 focus-visible:outline-[#0ea5e9]"
                                    onClick={() => setRecents([])}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                        {matchingRecents.length === 0 && (
                            <p className="px-4 pb-3 pt-1 text-sm text-[#737373]">
                                {recents.length ? 'No recent matches.' : 'Your searches will show up here.'}
                            </p>
                        )}
                        <ul className="pb-2">
                            {matchingRecents.map((term) => (
                                <li key={term} className="flex items-center pr-2">
                                    <button
                                        type="button"
                                        data-search-option
                                        className="flex min-h-11 min-w-0 flex-1 items-center gap-3 px-4 text-left text-sm text-[#262626] hover:bg-[#f5f5f5] focus-visible:bg-[#e0f2fe] focus-visible:outline-none"
                                        onClick={() => runSearch(term)}
                                    >
                                        <HiOutlineClock aria-hidden="true" className="size-4 shrink-0 text-[#a3a3a3]" />
                                        <span className="truncate">{term}</span>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Remove “${term}” from recent searches`}
                                        className="grid size-10 shrink-0 place-items-center rounded-lg text-[#737373] hover:bg-[#f5f5f5] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-[#0ea5e9]"
                                        onClick={() => setRecents((prev) => prev.filter((r) => r !== term))}
                                    >
                                        <HiXMark aria-hidden="true" className="size-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {matchingPeople.length > 0 && (
                            <ul className="border-t-2 border-[#0a0a0a] py-2">
                                {matchingPeople.map((person) => (
                                    <li key={person.handle}>
                                        <button
                                            type="button"
                                            data-search-option
                                            className="flex min-h-12 w-full items-center gap-3 px-4 text-left hover:bg-[#f5f5f5] focus-visible:bg-[#e0f2fe] focus-visible:outline-none"
                                            onClick={() => runSearch(`@${person.handle}`)}
                                        >
                                            <img src={person.img} alt="" className="size-8 rounded-full object-cover" />
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-bold text-[#0a0a0a]">
                                                    {person.name}
                                                </span>
                                                <span className="block truncate text-xs text-[#737373]">@{person.handle}</span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white text-base font-normal text-[#0a0a0a]', className)}
            {...props}
        >
            <header className="relative z-30 border-b-2 border-[#0a0a0a] bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 md:h-[72px] md:flex-nowrap md:py-0 lg:px-8">
                    <a
                        href="#threadly-home"
                        className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0ea5e9]"
                    >
                        <SpoolMark className="size-9" />
                        <span className="text-2xl font-black lowercase tracking-[-0.05em] text-[#0a0a0a]">
                            threadly<span className="text-[#0ea5e9]">.</span>
                        </span>
                    </a>

                    <div className="order-last w-full md:order-none md:mx-auto md:max-w-md md:flex-1">{searchBox}</div>

                    <div className="relative ml-auto md:ml-0">
                        <button
                            ref={accountBtnRef}
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={switcherOpen}
                            aria-controls={`${baseId}-switcher`}
                            className={cn(
                                'flex h-12 items-center gap-2.5 rounded-xl border-2 border-transparent py-1 pl-1 pr-2 transition-colors hover:border-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]',
                                switcherOpen && 'border-[#0a0a0a] shadow-[3px_3px_0_#0a0a0a]',
                            )}
                            onClick={() => setSwitcherOpen((v) => !v)}
                        >
                            <span className="relative">
                                <AccountAvatar account={account} className="size-9" />
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ring-2 ring-white',
                                        statusMeta.dot,
                                    )}
                                />
                            </span>
                            <span className="hidden min-w-0 text-left sm:block">
                                <span className="block max-w-36 truncate text-sm font-bold leading-tight text-[#0a0a0a]">
                                    {account.name}
                                </span>
                                <span className="block text-xs leading-tight text-[#737373]">{statusMeta.label}</span>
                            </span>
                            <span className="sr-only">
                                Switch account, signed in as @{account.handle}, status {statusMeta.label}
                            </span>
                            <HiChevronUpDown aria-hidden="true" className="size-5 text-[#525252]" />
                        </button>

                        <AnimatePresence>
                            {switcherOpen && (
                                <motion.div
                                    ref={switcherRef}
                                    id={`${baseId}-switcher`}
                                    role="dialog"
                                    aria-label="Switch account and status"
                                    {...pop}
                                    className="absolute right-0 top-full z-40 mt-3 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border-2 border-[#0a0a0a] bg-white shadow-[6px_6px_0_#0a0a0a]"
                                >
                                    <p id={`${baseId}-acc-label`} className="px-4 pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373]">
                                        Accounts
                                    </p>
                                    <div role="radiogroup" aria-labelledby={`${baseId}-acc-label`} className="px-2 pt-2">
                                        {accounts.map((a) => {
                                            const on = a.handle === current
                                            return (
                                                <button
                                                    key={a.handle}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={on}
                                                    className={cn(
                                                        'flex min-h-14 w-full items-center gap-3 rounded-xl px-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0ea5e9]',
                                                        on ? 'bg-[#f0f9ff]' : 'hover:bg-[#f5f5f5]',
                                                    )}
                                                    onClick={() => setCurrent(a.handle)}
                                                >
                                                    <AccountAvatar account={a} className="size-10 shrink-0" />
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-bold text-[#0a0a0a]">{a.name}</span>
                                                        <span className="block truncate text-xs text-[#737373]">
                                                            @{a.handle} · {a.note}
                                                        </span>
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'grid size-6 shrink-0 place-items-center rounded-full border-2',
                                                            on ? 'border-[#0ea5e9] bg-[#0ea5e9] text-white' : 'border-[#d4d4d4]',
                                                        )}
                                                    >
                                                        {on && <HiCheck className="size-3.5" />}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className="px-2 pb-2">
                                        {!adding ? (
                                            <button
                                                type="button"
                                                disabled={accounts.length >= 3}
                                                className="flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-sm font-bold text-[#0284c7] hover:bg-[#f0f9ff] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0ea5e9] disabled:cursor-not-allowed disabled:text-[#a3a3a3] disabled:hover:bg-transparent"
                                                onClick={() => setAdding(true)}
                                            >
                                                <span className="grid size-10 place-items-center rounded-full border-2 border-dashed border-current">
                                                    <HiOutlinePlus aria-hidden="true" className="size-5" />
                                                </span>
                                                {accounts.length >= 3 ? 'Up to 3 accounts' : 'Add account'}
                                            </button>
                                        ) : (
                                            <form noValidate className="rounded-xl bg-[#f5f5f5] p-3" onSubmit={addAccount}>
                                                <label
                                                    htmlFor={`${baseId}-handle`}
                                                    className="text-xs font-bold uppercase tracking-[0.15em] text-[#525252]"
                                                >
                                                    Handle
                                                </label>
                                                <div className="mt-1.5 flex gap-2">
                                                    <input
                                                        id={`${baseId}-handle`}
                                                        value={newHandle}
                                                        autoComplete="off"
                                                        placeholder="@your.handle"
                                                        aria-invalid={Boolean(handleError)}
                                                        aria-describedby={`${baseId}-handle-msg`}
                                                        className="h-10 min-w-0 flex-1 rounded-lg border-2 border-[#0a0a0a] bg-white px-3 text-sm text-[#0a0a0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]"
                                                        onChange={(event) => {
                                                            setNewHandle(event.target.value)
                                                            setHandleError('')
                                                        }}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="h-10 rounded-lg bg-[#0a0a0a] px-3 text-sm font-bold text-white hover:bg-[#0ea5e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                <p
                                                    id={`${baseId}-handle-msg`}
                                                    aria-live="polite"
                                                    className={cn('mt-1.5 text-xs', handleError ? 'font-semibold text-[#dc2626]' : 'text-[#737373]')}
                                                >
                                                    {handleError || 'Signs in without leaving this page.'}
                                                </p>
                                                <button
                                                    type="button"
                                                    className="mt-1 min-h-8 text-xs font-bold text-[#525252] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#0ea5e9]"
                                                    onClick={() => {
                                                        setAdding(false)
                                                        setHandleError('')
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    <div className="border-t-2 border-[#0a0a0a] px-2 pb-2 pt-3">
                                        <p id={`${baseId}-status-label`} className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373]">
                                            Status
                                        </p>
                                        <div role="radiogroup" aria-labelledby={`${baseId}-status-label`} className="mt-1.5">
                                            {statuses.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={status === s.id}
                                                    className={cn(
                                                        'flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0ea5e9]',
                                                        status === s.id ? 'bg-[#f5f5f5]' : 'hover:bg-[#fafafa]',
                                                    )}
                                                    onClick={() => setStatus(s.id)}
                                                >
                                                    <span aria-hidden="true" className={cn('size-3 shrink-0 rounded-full', s.dot)} />
                                                    <span className="flex-1">
                                                        <span className="block text-sm font-semibold text-[#0a0a0a]">{s.label}</span>
                                                        <span className="block text-xs text-[#737373]">{s.hint}</span>
                                                    </span>
                                                    {status === s.id && <HiCheck aria-hidden="true" className="size-4 text-[#0ea5e9]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-[#e5e5e5] p-2">
                                        <a
                                            href="#threadly-logout"
                                            className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-semibold text-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0ea5e9]"
                                        >
                                            <HiOutlineArrowRightOnRectangle aria-hidden="true" className="size-5" />
                                            Log out of @{account.handle}
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <div className="mx-auto min-h-[560px] max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#0a0a0a] pb-4">
                            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0a0a0a] sm:text-5xl">
                                {searched ? `Results for “${searched}”` : 'For you'}
                            </h2>
                            {searched && (
                                <button
                                    type="button"
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-[#0a0a0a] px-3 text-xs font-bold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
                                    onClick={() => {
                                        setSearched('')
                                        setQuery('')
                                    }}
                                >
                                    <HiXMark aria-hidden="true" className="size-4" />
                                    Clear search
                                </button>
                            )}
                        </div>
                        <p aria-live="polite" className="mt-3 text-sm text-[#525252]">
                            {searched
                                ? `${visibleThreads.length} thread${visibleThreads.length === 1 ? '' : 's'} found`
                                : `Signed in as @${account.handle} · ${statusMeta.label}`}
                        </p>
                        <ul className="mt-2">
                            {visibleThreads.map((t) => (
                                <motion.li
                                    key={t.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-4 border-b border-[#e5e5e5] py-6"
                                >
                                    <img
                                        src={t.person.img}
                                        alt={`${t.person.name}’s avatar`}
                                        loading="lazy"
                                        className="size-11 shrink-0 rounded-full object-cover grayscale"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm">
                                            <span className="font-bold text-[#0a0a0a]">{t.person.name}</span>{' '}
                                            <span className="text-[#737373]">
                                                @{t.person.handle} · {t.time}
                                            </span>
                                        </p>
                                        <p className="mt-1.5 text-lg leading-snug text-[#171717]">{t.text}</p>
                                        <p className="mt-3 flex gap-5 text-xs font-semibold text-[#525252]">
                                            <span className="inline-flex items-center gap-1.5">
                                                <HiOutlineChatBubbleLeft aria-hidden="true" className="size-4" />
                                                {t.replies} replies
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <HiOutlineArrowPath aria-hidden="true" className="size-4" />
                                                {t.reposts} reposts
                                            </span>
                                        </p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                        {visibleThreads.length === 0 && (
                            <p className="mt-6 rounded-xl border-2 border-dashed border-[#d4d4d4] p-6 text-sm text-[#525252]">
                                No threads match “{searched}” yet. Try “journaling” or “@rafa.m”.
                            </p>
                        )}
                    </div>

                    <aside className="h-fit rounded-2xl border-2 border-[#0a0a0a] p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373]">Posting as</p>
                        <div className="mt-3 flex items-center gap-3">
                            <AccountAvatar account={account} className="size-12" />
                            <div className="min-w-0">
                                <p className="truncate font-bold text-[#0a0a0a]">{account.name}</p>
                                <p className="flex items-center gap-1.5 text-xs text-[#525252]">
                                    <span aria-hidden="true" className={cn('size-2 rounded-full', statusMeta.dot)} />
                                    {statusMeta.label}
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-[#525252]">
                            Switch accounts from the top-right button. Status is shared across Threadly on web and
                            mobile.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default AccountSwitcherAppNavigation

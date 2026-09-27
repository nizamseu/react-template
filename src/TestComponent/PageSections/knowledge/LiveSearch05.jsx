// RecentPopularLiveSearch

// LiveSearch05 · Knowledge Bases & Documentation › Live Search with Autocomplete

// Description:
// A friendly intranet search for the fictional Orbit Wiki. Beside "Find it before you
// finish typing." a search card shows removable recent searches and "Popular this week"
// pages while the field is empty; typing switches the panel to highlighted suggestions,
// or offers to create the missing page. Use it on an internal wiki or team handbook.

// Design:
// - Zinc #f4f4f5 section with slowly orbiting rings and planets (inline SVG) peeking
//   from behind the card; ink #18181b text, zinc #52525b body copy, orange #ea580c for
//   accents, marks and focus
// - Heading text-4xl → sm:5xl → lg:6xl in heavy sans with tight tracking; a white
//   rounded-[28px] search card with a 64px field and a soft layered shadow
// - lg: 5 / 7 column split (copy + "Spaces" list left, card right); single column below
//   with the spaces list as wrapping chips
// - Panel modes (recent + popular / suggestions / no match) cross-fade via
//   AnimatePresence; the orbit animation and slide offsets are switched off for reduced
//   motion

// What it does:
// - The input is an ARIA combobox over one grouped listbox (aria-activedescendant); ↑/↓
//   move across recents and popular pages, Enter runs a recent search or opens a page
// - Delete (or Backspace on an empty field) removes the active recent search; the × on
//   each row removes it by mouse; "Clear all" empties the list
// - Opening a suggestion saves the typed query to recents (max 6, de-duplicated),
//   clears the field and follows #wiki/<page-id>; no match offers a "Create …" link to
//   #wiki/new?title=<query>
// - Escape clears the query; a polite live region announces mode and result counts

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RecentPopularLiveSearch from '@/TestComponent/PageSections/knowledge/LiveSearch05';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <RecentPopularLiveSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiMagnifyingGlass,
    HiOutlineArrowTrendingUp,
    HiOutlineClock,
    HiOutlineDocumentPlus,
    HiOutlineDocumentText,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const spaces = [
    { id: 'people', label: 'People', count: 214 },
    { id: 'engineering', label: 'Engineering', count: 486 },
    { id: 'design', label: 'Design', count: 132 },
    { id: 'operations', label: 'Operations', count: 98 },
    { id: 'sales', label: 'Sales', count: 121 },
]

const pagesList = [
    { id: 'expense-policy', space: 'Operations', title: 'Expense policy 2026', crumb: 'Finance › Policies', updated: 'Sep 14', views: 1840, keywords: ['receipts', 'reimbursement', 'money', 'card'] },
    { id: 'eng-onboarding', space: 'Engineering', title: 'Onboarding checklist for engineers', crumb: 'Handbook › First week', updated: 'Sep 22', views: 1320, keywords: ['new hire', 'setup', 'laptop', 'first day'] },
    { id: 'holiday-emea', space: 'People', title: 'Holiday calendar — EMEA', crumb: 'Time off › Calendars', updated: 'Aug 30', views: 2210, keywords: ['public holidays', 'time off', 'leave', 'europe'] },
    { id: 'holiday-amer', space: 'People', title: 'Holiday calendar — Americas', crumb: 'Time off › Calendars', updated: 'Aug 30', views: 1460, keywords: ['public holidays', 'time off', 'leave'] },
    { id: 'incident-retros', space: 'Engineering', title: 'How we run incident retros', crumb: 'Reliability › Process', updated: 'Sep 03', views: 640, keywords: ['postmortem', 'outage', 'blameless'] },
    { id: 'brand-guidelines', space: 'Design', title: 'Brand guidelines v5', crumb: 'Brand › Foundations', updated: 'Jul 18', views: 980, keywords: ['logo', 'colors', 'typography', 'brand colors'] },
    { id: 'wifi', space: 'Operations', title: 'Office Wi-Fi & guest access', crumb: 'Workplace › Lisbon office', updated: 'Sep 09', views: 1110, keywords: ['internet', 'password', 'network', 'guest'] },
    { id: 'parental-leave', space: 'People', title: 'Parental leave policy', crumb: 'Benefits › Leave', updated: 'Jun 27', views: 530, keywords: ['maternity', 'paternity', 'leave', 'benefits'] },
    { id: 'q4-planning', space: 'Operations', title: 'Q4 2026 planning timeline', crumb: 'Company › Planning', updated: 'Sep 25', views: 1570, keywords: ['okrs', 'roadmap', 'deadlines', 'quarter'] },
    { id: 'design-review', space: 'Design', title: 'Design review process', crumb: 'Design › Rituals', updated: 'Aug 21', views: 420, keywords: ['critique', 'feedback', 'figma'] },
    { id: 'laptop-refresh', space: 'Operations', title: 'Laptop refresh programme', crumb: 'IT › Hardware', updated: 'Sep 01', views: 760, keywords: ['hardware', 'mac', 'upgrade', 'it'] },
    { id: 'on-call', space: 'Engineering', title: 'On-call rotation handbook', crumb: 'Reliability › On-call', updated: 'Sep 19', views: 890, keywords: ['pager', 'on-call rotation', 'incident', 'schedule'] },
    { id: 'security-training', space: 'People', title: 'Annual security training', crumb: 'Compliance › Training', updated: 'Sep 10', views: 1030, keywords: ['phishing', 'compliance', 'course'] },
    { id: 'travel-booking', space: 'Operations', title: 'Booking business travel', crumb: 'Finance › Travel', updated: 'Aug 12', views: 690, keywords: ['flights', 'hotel', 'trip', 'expenses'] },
    { id: 'sales-playbook', space: 'Sales', title: 'Sales playbook: mid-market', crumb: 'Sales › Playbooks', updated: 'Sep 16', views: 570, keywords: ['deals', 'discovery', 'pricing'] },
    { id: 'escalations', space: 'Sales', title: 'Customer escalation path', crumb: 'Support › Escalations', updated: 'Sep 05', views: 480, keywords: ['support', 'urgent', 'vip'] },
    { id: 'release-train', space: 'Engineering', title: 'Release train schedule', crumb: 'Delivery › Releases', updated: 'Sep 23', views: 720, keywords: ['deploy', 'release', 'freeze', 'calendar'] },
    { id: 'no-meeting', space: 'People', title: 'Meeting-free Wednesdays', crumb: 'Culture › Rituals', updated: 'May 04', views: 350, keywords: ['focus', 'calendar', 'meetings'] },
]

const popularIds = ['holiday-emea', 'expense-policy', 'q4-planning', 'eng-onboarding']
const pageById = Object.fromEntries(pagesList.map((page) => [page.id, page]))
const initialRecent = ['expense policy', 'on-call rotation', 'holiday calendar emea', 'brand colors']
const orbits = [
    { r: 120, planet: 7, duration: 36, fill: '#ea580c', start: -40 },
    { r: 190, planet: 5, duration: 58, fill: '#18181b', start: -95 },
    { r: 260, planet: 9, duration: 84, fill: '#fdba74', start: -20 },
]

function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function scorePage(page, tokens) {
    const title = page.title.toLowerCase()
    const haystack = `${page.title} ${page.space} ${page.crumb} ${page.keywords.join(' ')}`.toLowerCase()
    let score = 0
    for (const token of tokens) {
        if (!haystack.includes(token)) return 0
        if (title.split(/[\s—-]+/).some((word) => word.startsWith(token))) score += 5
        else if (title.includes(token)) score += 3
        else score += 1
    }
    return score + page.views / 10000
}

function Highlight({ text, tokens }) {
    if (!tokens.length) return text
    const pattern = [...tokens]
        .sort((a, b) => b.length - a.length)
        .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')
    return text.split(new RegExp(`(${pattern})`, 'gi')).map((part, index) =>
        index % 2 === 1 ? (
            <mark key={index} className="rounded-[4px] bg-[#ffedd5] px-0.5 font-semibold text-[#c2410c]">
                {part}
            </mark>
        ) : (
            <span key={index}>{part}</span>
        ),
    )
}

const formatViews = (views) => (views >= 1000 ? `${(views / 1000).toFixed(1)}k` : String(views))

export function RecentPopularLiveSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const inputRef = useRef(null)
    const [query, setQuery] = useState('')
    const [recent, setRecent] = useState(initialRecent)
    const [active, setActive] = useState(-1)
    const [announce, setAnnounce] = useState('')

    const tokens = useMemo(() => tokenize(query), [query])
    const mode = !tokens.length ? 'empty' : 'suggest'

    const suggestions = useMemo(() => {
        if (!tokens.length) return []
        return pagesList
            .map((page) => ({ page, score: scorePage(page, tokens) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 7)
            .map((entry) => entry.page)
    }, [tokens])

    const options = useMemo(() => {
        if (mode === 'empty') {
            return [
                ...recent.map((term) => ({ kind: 'recent', key: `recent-${term}`, term })),
                ...popularIds.map((id) => ({ kind: 'popular', key: `popular-${id}`, page: pageById[id] })),
            ]
        }
        return suggestions.map((page) => ({ kind: 'page', key: `page-${page.id}`, page }))
    }, [mode, recent, suggestions])

    const activeIndex = active < options.length ? active : -1
    const optionId = (key) => `${uid}-${key.replace(/\s+/g, '-')}`
    const activeOptionId = activeIndex >= 0 ? optionId(options[activeIndex].key) : undefined
    const listId = `${uid}-list`
    const recentLabelId = `${uid}-recent-label`
    const popularLabelId = `${uid}-popular-label`
    const hintId = `${uid}-hint`

    useEffect(() => {
        if (activeOptionId) document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' })
    }, [activeOptionId])

    const updateQuery = (value) => {
        setQuery(value)
        setActive(-1)
        setAnnounce('')
    }

    const removeRecent = (term) => {
        setRecent((list) => list.filter((item) => item !== term))
        setAnnounce(`Removed ${term} from recent searches`)
        setActive((index) => Math.max(-1, Math.min(index, recent.length - 2)))
    }

    const openPage = (page) => {
        const term = query.trim()
        if (term) setRecent((list) => [term, ...list.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6))
        setQuery('')
        setActive(-1)
        setAnnounce(`Opening ${page.title}`)
        window.location.hash = `wiki/${page.id}`
    }

    const activate = (option) => {
        if (option.kind === 'recent') {
            updateQuery(option.term)
            inputRef.current?.focus()
        } else {
            openPage(option.page)
        }
    }

    const onKeyDown = (event) => {
        const current = activeIndex >= 0 ? options[activeIndex] : null
        if (event.key === 'ArrowDown' && options.length) {
            event.preventDefault()
            setActive((activeIndex + 1) % options.length)
        } else if (event.key === 'ArrowUp' && options.length) {
            event.preventDefault()
            setActive(activeIndex <= 0 ? options.length - 1 : activeIndex - 1)
        } else if (event.key === 'Enter') {
            event.preventDefault()
            if (current) activate(current)
            else if (mode === 'suggest' && suggestions.length) openPage(suggestions[0])
        } else if (event.key === 'Escape' && query) {
            event.preventDefault()
            updateQuery('')
        } else if ((event.key === 'Delete' || (event.key === 'Backspace' && !query)) && current?.kind === 'recent') {
            event.preventDefault()
            removeRecent(current.term)
        }
    }

    const status =
        announce ||
        (mode === 'empty'
            ? `${recent.length} recent searches and ${popularIds.length} popular pages`
            : suggestions.length
              ? `${suggestions.length} suggestions`
              : `No pages match ${query.trim()}`)

    const panelMotion = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }

    const renderOption = (option, index, content, extraClass) => {
        const isActive = index === activeIndex
        return (
            <li
                key={option.key}
                id={optionId(option.key)}
                role="option"
                aria-selected={isActive}
                aria-describedby={option.kind === 'recent' ? hintId : undefined}
                className={cn(
                    'group relative flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-100',
                    isActive ? 'bg-[#fff7ed]' : 'hover:bg-[#fafafa]',
                    extraClass,
                )}
                onMouseMove={() => setActive(index)}
                onClick={() => activate(option)}
            >
                {content(isActive)}
            </li>
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-[#f4f4f5] px-4 py-16 text-base font-normal text-[#18181b] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 600 600"
                className="pointer-events-none absolute -bottom-[260px] -left-[260px] -z-10 w-[640px] opacity-80 lg:-right-[240px] lg:-top-[260px] lg:bottom-auto lg:left-auto lg:w-[760px]"
            >
                {orbits.map((orbit) => (
                    <motion.g
                        key={orbit.r}
                        initial={{ rotate: orbit.start }}
                        animate={{ rotate: reduceMotion ? orbit.start : orbit.start + 360 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
                    >
                        <circle cx="300" cy="300" r={orbit.r} fill="none" stroke="#d4d4d8" strokeDasharray="2 6" />
                        <circle cx={300 + orbit.r} cy="300" r={orbit.planet} fill={orbit.fill} />
                        <circle cx={300 - orbit.r} cy="300" r={orbit.planet} fill="none" />
                    </motion.g>
                ))}
                <circle cx="300" cy="300" r="34" fill="#ea580c" opacity="0.12" />
                <circle cx="300" cy="300" r="16" fill="#ea580c" />
            </svg>

            <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-5">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#18181b] px-3 py-1.5 text-xs font-semibold text-[#fafafa]">
                        <span className="size-2 rounded-full bg-[#ea580c]" aria-hidden="true" />
                        Orbit Wiki · 1,051 pages
                    </p>
                    <h2 className="mt-6 text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#18181b] sm:text-5xl lg:text-6xl">
                        Find it before you finish <span className="text-[#ea580c]">typing.</span>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#52525b] sm:text-lg">
                        Policies, playbooks and the Wi-Fi password — searched 3,400 times a week by 620
                        people at Orbit. Your recent searches stay one tap away.
                    </p>
                    <h3 className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#71717a]">Spaces</h3>
                    <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-[#e4e4e7]">
                        {spaces.map((space) => (
                            <li key={space.id}>
                                <a
                                    href={`#wiki/space/${space.id}`}
                                    className="group flex min-h-10 items-center justify-between gap-3 rounded-full border border-[#e4e4e7] bg-white px-4 text-sm font-medium text-[#18181b] transition-colors hover:border-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c] lg:min-h-12 lg:rounded-none lg:border-0 lg:border-b lg:bg-transparent lg:px-1"
                                >
                                    <span className="group-hover:text-[#ea580c]">{space.label}</span>
                                    <span className="font-mono text-xs text-[#71717a]">{space.count}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-[28px] bg-white p-2 shadow-[0_1px_2px_rgba(24,24,27,0.06),0_24px_60px_-28px_rgba(24,24,27,0.35)] ring-1 ring-[#e4e4e7] sm:p-3">
                        <div className="flex h-16 items-center gap-3 rounded-[20px] border-2 border-transparent bg-[#f4f4f5] px-4 transition-colors focus-within:border-[#ea580c] focus-within:bg-white sm:px-5">
                            <HiMagnifyingGlass className="size-5 shrink-0 text-[#ea580c]" aria-hidden="true" />
                            <label htmlFor={`${uid}-input`} className="sr-only">
                                Search Orbit Wiki
                            </label>
                            <input
                                ref={inputRef}
                                id={`${uid}-input`}
                                type="text"
                                role="combobox"
                                aria-expanded={options.length > 0}
                                aria-controls={listId}
                                aria-autocomplete="list"
                                aria-activedescendant={activeOptionId}
                                autoComplete="off"
                                placeholder="Search pages, people, policies…"
                                value={query}
                                className="h-full min-w-0 flex-1 bg-transparent text-base font-medium text-[#18181b] placeholder:font-normal placeholder:text-[#a1a1aa] focus:outline-none sm:text-lg"
                                onChange={(event) => updateQuery(event.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            {query && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    className="grid size-10 shrink-0 place-items-center rounded-full text-[#71717a] hover:bg-[#e4e4e7] hover:text-[#18181b] focus-visible:outline-2 focus-visible:outline-[#ea580c]"
                                    onClick={() => {
                                        updateQuery('')
                                        inputRef.current?.focus()
                                    }}
                                >
                                    <HiXMark className="size-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <p className="sr-only" aria-live="polite">
                            {status}
                        </p>
                        <p id={hintId} className="sr-only">
                            Press Delete to remove this recent search.
                        </p>

                        <div className="min-h-[420px] px-1 pb-2 pt-4 sm:px-2">
                            <AnimatePresence mode="wait" initial={false}>
                                {mode === 'empty' ? (
                                    <motion.div key="empty" {...panelMotion} transition={{ duration: 0.18 }}>
                                        <div className="flex min-h-10 items-center justify-between px-3">
                                            <p id={recentLabelId} className="text-xs font-bold uppercase tracking-[0.18em] text-[#71717a]">
                                                Recent searches
                                            </p>
                                            {recent.length > 0 && (
                                                <button
                                                    type="button"
                                                    className="min-h-10 rounded-full px-3 text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed] focus-visible:outline-2 focus-visible:outline-[#ea580c]"
                                                    onClick={() => {
                                                        setRecent([])
                                                        setActive(-1)
                                                        setAnnounce('Recent searches cleared')
                                                    }}
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                        <ul id={listId} role="listbox" aria-label="Recent searches and popular pages">
                                            <li role="presentation">
                                                {recent.length ? (
                                                    <ul role="group" aria-labelledby={recentLabelId}>
                                                        {options
                                                            .filter((option) => option.kind === 'recent')
                                                            .map((option, index) =>
                                                                renderOption(option, index, (isActive) => (
                                                                    <>
                                                                        <HiOutlineClock
                                                                            className={cn('size-5 shrink-0', isActive ? 'text-[#ea580c]' : 'text-[#a1a1aa]')}
                                                                            aria-hidden="true"
                                                                        />
                                                                        <span className="min-w-0 flex-1 truncate text-[15px] text-[#27272a]">
                                                                            {option.term}
                                                                        </span>
                                                                        <span
                                                                            aria-hidden="true"
                                                                            className={cn(
                                                                                'hidden font-mono text-[10px] uppercase text-[#a1a1aa]',
                                                                                isActive && 'sm:inline',
                                                                            )}
                                                                        >
                                                                            del
                                                                        </span>
                                                                        <span
                                                                            aria-hidden="true"
                                                                            className="grid size-9 shrink-0 place-items-center rounded-full text-[#a1a1aa] hover:bg-[#ffedd5] hover:text-[#c2410c]"
                                                                            onClick={(event) => {
                                                                                event.stopPropagation()
                                                                                removeRecent(option.term)
                                                                            }}
                                                                        >
                                                                            <HiXMark className="size-4" />
                                                                        </span>
                                                                    </>
                                                                )),
                                                            )}
                                                    </ul>
                                                ) : (
                                                    <p className="px-3 pb-3 pt-1 text-sm text-[#71717a]">
                                                        No recent searches — the next thing you look up will appear here.
                                                    </p>
                                                )}
                                            </li>
                                            <li role="presentation" className="mt-3 border-t border-[#f4f4f5] pt-3">
                                                <p id={popularLabelId} className="flex min-h-10 items-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#71717a]">
                                                    <HiOutlineArrowTrendingUp className="size-4 text-[#ea580c]" aria-hidden="true" />
                                                    Popular this week
                                                </p>
                                                <ul role="group" aria-labelledby={popularLabelId} className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                                                    {options
                                                        .filter((option) => option.kind === 'popular')
                                                        .map((option, index) =>
                                                            renderOption(option, recent.length + index, (isActive) => (
                                                                <>
                                                                    <span
                                                                        aria-hidden="true"
                                                                        className={cn(
                                                                            'grid size-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold',
                                                                            isActive ? 'bg-[#ea580c] text-white' : 'bg-[#f4f4f5] text-[#18181b]',
                                                                        )}
                                                                    >
                                                                        {index + 1}
                                                                    </span>
                                                                    <span className="min-w-0 flex-1">
                                                                        <span className="block truncate text-sm font-semibold text-[#18181b]">
                                                                            {option.page.title}
                                                                        </span>
                                                                        <span className="mt-0.5 block truncate text-xs text-[#71717a]">
                                                                            {option.page.space} · {formatViews(option.page.views)} views
                                                                        </span>
                                                                    </span>
                                                                </>
                                                            )),
                                                        )}
                                                </ul>
                                            </li>
                                        </ul>
                                    </motion.div>
                                ) : suggestions.length ? (
                                    <motion.div key="suggest" {...panelMotion} transition={{ duration: 0.18 }}>
                                        <p className="flex min-h-10 items-center justify-between px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#71717a]">
                                            <span>Suggestions</span>
                                            <span className="font-mono normal-case tracking-normal">{suggestions.length} pages</span>
                                        </p>
                                        <ul id={listId} role="listbox" aria-label="Suggested pages">
                                            {options.map((option, index) =>
                                                renderOption(option, index, (isActive) => (
                                                    <>
                                                        <span
                                                            aria-hidden="true"
                                                            className={cn(
                                                                'grid size-10 shrink-0 place-items-center rounded-xl',
                                                                isActive ? 'bg-[#ea580c] text-white' : 'bg-[#f4f4f5] text-[#52525b]',
                                                            )}
                                                        >
                                                            <HiOutlineDocumentText className="size-5" />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block truncate text-[15px] font-semibold text-[#18181b]">
                                                                <Highlight text={option.page.title} tokens={tokens} />
                                                            </span>
                                                            <span className="mt-0.5 block truncate text-xs text-[#71717a]">
                                                                {option.page.space} › {option.page.crumb} · edited {option.page.updated}
                                                            </span>
                                                        </span>
                                                        <HiArrowRight
                                                            className={cn(
                                                                'size-4 shrink-0 text-[#ea580c] transition-opacity',
                                                                isActive ? 'opacity-100' : 'opacity-0',
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )),
                                            )}
                                        </ul>
                                    </motion.div>
                                ) : (
                                    <motion.div key="none" {...panelMotion} transition={{ duration: 0.18 }} className="px-3 py-12 text-center">
                                        <div id={listId} />
                                        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff7ed] text-[#ea580c]">
                                            <HiOutlineDocumentPlus className="size-7" aria-hidden="true" />
                                        </span>
                                        <p className="mt-4 text-lg font-bold text-[#18181b]">No pages match “{query.trim()}”</p>
                                        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-[#52525b]">
                                            Nobody has written this down yet. Start the page and the space owners will
                                            get a review request.
                                        </p>
                                        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
                                            <a
                                                href={`#wiki/new?title=${encodeURIComponent(query.trim())}`}
                                                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ea580c] px-5 text-sm font-semibold text-white hover:bg-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                            >
                                                Create “{query.trim().slice(0, 24)}”
                                            </a>
                                            <button
                                                type="button"
                                                className="min-h-11 rounded-full px-4 text-sm font-semibold text-[#52525b] hover:bg-[#f4f4f5] focus-visible:outline-2 focus-visible:outline-[#ea580c]"
                                                onClick={() => {
                                                    updateQuery('')
                                                    inputRef.current?.focus()
                                                }}
                                            >
                                                Back to recent
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <p className="hidden items-center justify-between border-t border-[#f4f4f5] px-4 pb-1 pt-3 text-xs text-[#71717a] sm:flex">
                            <span>↑ ↓ move · ↵ open · del remove recent · esc clear</span>
                            <span className="font-semibold text-[#18181b]">Orbit Wiki</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RecentPopularLiveSearch

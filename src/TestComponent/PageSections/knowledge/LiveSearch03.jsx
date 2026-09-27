// ScopedTabsLiveSearch

// LiveSearch03 · Knowledge Bases & Documentation › Live Search with Autocomplete

// Description:
// A console-style search for the fictional Nimbus Developer Hub that queries guides,
// API endpoints and forum threads at once. Under "Search the docs, the API and the
// forum — at once." one query feeds All / Guides / API / Community tabs with live
// counts, a ranked list and an inspector pane. Use it on a developer portal home or
// search results page.

// Design:
// - Navy #0f172a section, console card #0b1222 with slate #1e293b hairlines; cyan
//   #22d3ee for the prompt glyph, active tab underline, focus rings and highlighted
//   matches
// - Mono eyebrow + sans heading text-3xl → sm:5xl → lg:[3.5rem]; HTTP verbs as coloured
//   mono badges (GET cyan, POST emerald, PATCH amber, PUT violet, DELETE rose)
// - Results list and inspector split 1.35fr / 1fr on lg; they stack below lg and the
//   list caps at 420px with its own scroll; tabs scroll sideways inside their bar on
//   narrow phones
// - The active tab underline glides between tabs with a shared layoutId (useId-scoped)
//   and the inspector cross-fades between results; both are instant for reduced motion

// What it does:
// - Typing filters 23 local items (8 guides, 8 endpoints, 7 threads); every tab shows
//   how many of them match the same query, and matches are highlighted in titles and
//   paths
// - The input is an ARIA combobox bound to the scoped listbox (aria-activedescendant);
//   ↑/↓ or a click pick the result shown in the inspector, Enter (or double-click)
//   follows its #hub/<type>/<id> link and flashes "Opened" on the CTA, Escape clears
//   the query
// - Tabs follow the ARIA tabs pattern with ←/→/Home/End; "/" focuses the input only
//   while focus is already inside this section
// - Empty scopes offer one-click jumps to scopes that do have matches, or broader
//   queries

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ScopedTabsLiveSearch from '@/TestComponent/PageSections/knowledge/LiveSearch03';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <ScopedTabsLiveSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowUpRight,
    HiCheck,
    HiCheckBadge,
    HiOutlineBookOpen,
    HiOutlineChatBubbleLeftRight,
    HiOutlineCodeBracket,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const scopes = [
    { key: 'all', label: 'All' },
    { key: 'guide', label: 'Guides' },
    { key: 'api', label: 'API' },
    { key: 'community', label: 'Community' },
]

const methodTone = {
    GET: 'border-[#22d3ee]/40 bg-[#22d3ee]/10 text-[#67e8f9]',
    POST: 'border-[#34d399]/40 bg-[#34d399]/10 text-[#6ee7b7]',
    PATCH: 'border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fcd34d]',
    PUT: 'border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#c4b5fd]',
    DELETE: 'border-[#fb7185]/40 bg-[#fb7185]/10 text-[#fda4af]',
}

const items = [
    { id: 'first-instance', type: 'guide', title: 'Deploy your first Nimbus instance', area: 'Compute', minutes: 8, updated: 'Sep 18, 2026', text: 'Pick a region, choose the n2-standard-2 shape and boot an instance with the CLI or console.', keywords: ['vm', 'server', 'quickstart', 'instances'] },
    { id: 'autoscaling', type: 'guide', title: 'Configure autoscaling groups', area: 'Compute', minutes: 12, updated: 'Sep 02, 2026', text: 'Scale on CPU, queue depth or a custom metric, with cooldowns and a minimum floor.', keywords: ['scale', 'instances', 'cpu', 'metrics'] },
    { id: 'buckets', type: 'guide', title: 'Store files in Nimbus Buckets', area: 'Storage', minutes: 6, updated: 'Aug 27, 2026', text: 'Create a bucket, upload objects with multipart and serve them through signed URLs.', keywords: ['storage', 'upload', 'objects', 's3'] },
    { id: 'rotate-keys', type: 'guide', title: 'Rotate API keys without downtime', area: 'Security', minutes: 5, updated: 'Sep 21, 2026', text: 'Issue a second key, roll it out, then revoke the old one — with zero failed requests.', keywords: ['keys', 'security', 'secrets', 'auth'] },
    { id: 'vpc', type: 'guide', title: 'Set up private networking (VPC)', area: 'Networking', minutes: 10, updated: 'Jul 30, 2026', text: 'Isolate instances in a VPC, add subnets per zone and peer networks across regions.', keywords: ['network', 'peering', 'subnet', 'private'] },
    { id: 'log-streaming', type: 'guide', title: 'Stream logs to your observability stack', area: 'Observability', minutes: 7, updated: 'Sep 11, 2026', text: 'Forward structured logs over HTTPS or syslog with per-service filters and sampling.', keywords: ['logs', 'monitoring', 'syslog'] },
    { id: 'cron', type: 'guide', title: 'Schedule jobs with Nimbus Cron', area: 'Functions', minutes: 4, updated: 'Aug 14, 2026', text: 'Run functions on a cron expression in any time zone, with retries and alerting.', keywords: ['schedule', 'jobs', 'functions', 'timer'] },
    { id: 'sdk-v2', type: 'guide', title: 'Migrate from SDK v1 to v2', area: 'SDKs', minutes: 9, updated: 'Sep 05, 2026', text: 'Renamed clients, promise-based pagination and typed errors — plus a codemod.', keywords: ['sdk', 'typescript', 'upgrade', 'migration'] },
    { id: 'create-instance', type: 'api', method: 'POST', title: '/v2/instances', summary: 'Create an instance', text: 'Boots a new instance from an image and shape; returns 202 with a provisioning status.', params: ['region', 'shape', 'image_id'], keywords: ['instances', 'vm', 'create'] },
    { id: 'get-instance', type: 'api', method: 'GET', title: '/v2/instances/{id}', summary: 'Retrieve an instance', text: 'Returns status, public IPs, attached volumes and the current autoscaling group.', params: ['id', 'expand[]'], keywords: ['instances', 'status'] },
    { id: 'scale-instance', type: 'api', method: 'PATCH', title: '/v2/instances/{id}/scale', summary: 'Scale an instance', text: 'Changes the shape in place; the instance restarts within about 45 seconds.', params: ['id', 'shape'], keywords: ['instances', 'scale', 'autoscaling', 'resize'] },
    { id: 'delete-bucket', type: 'api', method: 'DELETE', title: '/v2/buckets/{name}', summary: 'Delete a bucket', text: 'Deletes an empty bucket. Pass force=true to remove every object first.', params: ['name', 'force'], keywords: ['storage', 'buckets', 'remove'] },
    { id: 'put-object', type: 'api', method: 'PUT', title: '/v2/buckets/{name}/objects/{key}', summary: 'Upload an object', text: 'Single-request upload up to 5 GB; use multipart sessions for anything larger.', params: ['name', 'key', 'content_type'], keywords: ['storage', 'upload', 'buckets', 'objects'] },
    { id: 'rotate-key', type: 'api', method: 'POST', title: '/v2/keys/{id}/rotate', summary: 'Rotate an API key', text: 'Issues a replacement key and schedules the old one to expire after a grace window.', params: ['id', 'grace_period'], keywords: ['keys', 'security', 'auth'] },
    { id: 'list-logs', type: 'api', method: 'GET', title: '/v2/logs', summary: 'List log entries', text: 'Cursor-paginated log entries filtered by service, level and time range.', params: ['service', 'level', 'cursor'], keywords: ['logs', 'pagination', 'monitoring'] },
    { id: 'invoke-fn', type: 'api', method: 'POST', title: '/v2/functions/{id}/invoke', summary: 'Invoke a function', text: 'Runs a function synchronously and returns its output, or 202 when async=true.', params: ['id', 'payload', 'async'], keywords: ['functions', 'run', 'cron'] },
    { id: 'thread-autoscale', type: 'community', title: 'Autoscaling ignores my min instance count after deploy', author: 'kaito.dev', replies: 14, answered: true, age: '2 days ago', text: 'Accepted answer: the deploy resets the group unless min_size is set in nimbus.toml.', keywords: ['autoscaling', 'instances', 'scale'] },
    { id: 'thread-upload', type: 'community', title: 'Best way to upload 20 GB objects to a bucket?', author: 'marta_ops', replies: 9, answered: true, age: '5 days ago', text: 'Accepted answer: multipart with 64 MB parts and 8 parallel streams.', keywords: ['storage', 'upload', 'buckets', 'multipart'] },
    { id: 'thread-ci-keys', type: 'community', title: 'Rotating keys broke our CI — what did we miss?', author: 'devon.r', replies: 6, answered: false, age: '9 hours ago', text: 'The pipeline cached the old key in a runner secret; still waiting on a fix.', keywords: ['keys', 'ci', 'security', 'rotate'] },
    { id: 'thread-peering', type: 'community', title: 'VPC peering between eu-west and us-east', author: 'lin.cloud', replies: 11, answered: true, age: '3 weeks ago', text: 'Accepted answer: enable global routing on both VPCs before creating the peer.', keywords: ['vpc', 'network', 'peering', 'regions'] },
    { id: 'thread-cron-dst', type: 'community', title: 'Cron job runs twice when daylight saving ends', author: 'amir.builds', replies: 4, answered: false, age: '1 day ago', text: 'Happens with Europe/Berlin schedules at 02:30 — reproduced by two other users.', keywords: ['cron', 'schedule', 'timezone'] },
    { id: 'thread-logs-dupes', type: 'community', title: 'Logs API pagination returns duplicates', author: 'priya.k', replies: 7, answered: true, age: '1 week ago', text: 'Accepted answer: pass the cursor, not the offset — offsets shift as logs arrive.', keywords: ['logs', 'pagination', 'api'] },
    { id: 'thread-sdk-types', type: 'community', title: 'SDK v2 TypeScript types for instance metadata', author: 'noah.ts', replies: 3, answered: false, age: '4 days ago', text: 'Metadata is typed as Record<string, string>; a generic is planned for v2.3.', keywords: ['sdk', 'typescript', 'instances'] },
]

const typeMeta = {
    guide: { label: 'Guide', icon: HiOutlineBookOpen },
    api: { label: 'API', icon: HiOutlineCodeBracket },
    community: { label: 'Thread', icon: HiOutlineChatBubbleLeftRight },
}

const quickQueries = ['instances', 'upload', 'keys', 'logs']

function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function scoreItem(item, tokens) {
    const title = item.title.toLowerCase()
    const haystack = `${item.title} ${item.summary || ''} ${item.area || ''} ${item.text} ${item.keywords.join(' ')}`.toLowerCase()
    let score = 0
    for (const token of tokens) {
        if (!haystack.includes(token)) return 0
        if (title.includes(token)) score += 5
        else if ((item.summary || '').toLowerCase().includes(token)) score += 4
        else if (item.keywords.some((keyword) => keyword.startsWith(token))) score += 3
        else score += 1
    }
    return score
}

function Highlight({ text, tokens }) {
    if (!tokens.length) return text
    const pattern = [...tokens]
        .sort((a, b) => b.length - a.length)
        .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')
    return text.split(new RegExp(`(${pattern})`, 'gi')).map((part, index) =>
        index % 2 === 1 ? (
            <mark key={index} className="rounded-sm bg-[#22d3ee]/20 text-[#a5f3fc] shadow-[inset_0_-1px_0_#22d3ee]">
                {part}
            </mark>
        ) : (
            <span key={index}>{part}</span>
        ),
    )
}

export function ScopedTabsLiveSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const rootRef = useRef(null)
    const inputRef = useRef(null)
    const tabRefs = useRef([])
    const [query, setQuery] = useState('')
    const [scope, setScope] = useState('all')
    const [active, setActive] = useState(0)
    const [launched, setLaunched] = useState(null)

    const tokens = useMemo(() => tokenize(query), [query])

    const matches = useMemo(() => {
        if (!tokens.length) return items
        return items
            .map((item) => ({ item, score: scoreItem(item, tokens) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((entry) => entry.item)
    }, [tokens])

    const counts = useMemo(() => {
        const next = { all: matches.length, guide: 0, api: 0, community: 0 }
        for (const item of matches) next[item.type] += 1
        return next
    }, [matches])

    const results = scope === 'all' ? matches : matches.filter((item) => item.type === scope)
    const activeIndex = results.length ? Math.min(active, results.length - 1) : -1
    const current = activeIndex >= 0 ? results[activeIndex] : null
    const optionId = (id) => `${uid}-opt-${id}`
    const listId = `${uid}-list`
    const panelId = `${uid}-panel`
    const activeOptionId = current ? optionId(current.id) : undefined

    useEffect(() => {
        if (activeOptionId) document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' })
    }, [activeOptionId])

    useEffect(() => {
        if (!launched) return undefined
        const id = setTimeout(() => setLaunched(null), 1600)
        return () => clearTimeout(id)
    }, [launched])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== '/' || event.defaultPrevented) return
            const root = rootRef.current
            const focused = document.activeElement
            if (!root || !root.contains(focused)) return
            if (focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement) return
            event.preventDefault()
            inputRef.current?.focus()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    const selectScope = (key, focusTab = false) => {
        setScope(key)
        setActive(0)
        if (focusTab) tabRefs.current[scopes.findIndex((entry) => entry.key === key)]?.focus()
    }

    const openResult = (item) => {
        setLaunched(item.id)
        window.location.hash = `hub/${item.type}/${item.id}`
    }

    const onInputKeyDown = (event) => {
        if (event.key === 'ArrowDown' && results.length) {
            event.preventDefault()
            setActive((activeIndex + 1) % results.length)
        } else if (event.key === 'ArrowUp' && results.length) {
            event.preventDefault()
            setActive((activeIndex - 1 + results.length) % results.length)
        } else if (event.key === 'Enter' && current) {
            event.preventDefault()
            openResult(current)
        } else if (event.key === 'Escape' && query) {
            event.preventDefault()
            setQuery('')
            setActive(0)
        }
    }

    const onTabKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % scopes.length
        else if (event.key === 'ArrowLeft') next = (index - 1 + scopes.length) % scopes.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = scopes.length - 1
        if (next === null) return
        event.preventDefault()
        selectScope(scopes[next].key, true)
    }

    const scopeLabel = scopes.find((entry) => entry.key === scope).label
    const otherScopes = scopes.filter((entry) => entry.key !== 'all' && entry.key !== scope && counts[entry.key] > 0)
    const status = tokens.length
        ? `${results.length} ${scope === 'all' ? '' : `${scopeLabel} `}results for ${query.trim()}`
        : `${results.length} items in ${scopeLabel}`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(34,211,238,0.16),transparent_70%)]"
            />
            <div ref={rootRef} className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#22d3ee]">
                            nimbus://developer-hub/search
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-[#f8fafc] sm:text-5xl lg:text-[3.5rem]">
                            Search the docs, the API and the forum — at once.
                        </h2>
                    </div>
                    <dl className="grid shrink-0 grid-cols-3 gap-5 font-mono text-xs text-[#94a3b8] md:text-right">
                        <div>
                            <dt>guides</dt>
                            <dd className="mt-1 text-lg text-[#f8fafc]">412</dd>
                        </div>
                        <div>
                            <dt>endpoints</dt>
                            <dd className="mt-1 text-lg text-[#f8fafc]">186</dd>
                        </div>
                        <div>
                            <dt>threads</dt>
                            <dd className="mt-1 text-lg text-[#f8fafc]">9.7k</dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0b1222] shadow-[0_40px_90px_-40px_rgba(34,211,238,0.35)]">
                    <div className="flex items-center gap-3 border-b border-[#1e293b] px-4 sm:px-6">
                        <span className="font-mono text-xl text-[#22d3ee]" aria-hidden="true">
                            ›
                        </span>
                        <label htmlFor={`${uid}-input`} className="sr-only">
                            Search Nimbus Developer Hub
                        </label>
                        <input
                            ref={inputRef}
                            id={`${uid}-input`}
                            type="text"
                            role="combobox"
                            aria-expanded="true"
                            aria-controls={listId}
                            aria-autocomplete="list"
                            aria-activedescendant={activeOptionId}
                            autoComplete="off"
                            spellCheck="false"
                            placeholder="Search guides, endpoints, threads…"
                            value={query}
                            className="h-16 min-w-0 flex-1 bg-transparent font-mono text-[15px] text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none sm:text-base"
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setActive(0)
                            }}
                            onKeyDown={onInputKeyDown}
                        />
                        {query ? (
                            <button
                                type="button"
                                aria-label="Clear search"
                                className="grid size-10 shrink-0 place-items-center rounded-lg text-[#94a3b8] hover:bg-white/5 hover:text-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                                onClick={() => {
                                    setQuery('')
                                    setActive(0)
                                    inputRef.current?.focus()
                                }}
                            >
                                <HiXMark className="size-5" aria-hidden="true" />
                            </button>
                        ) : (
                            <kbd className="hidden shrink-0 rounded-md border border-[#334155] px-2 py-0.5 font-mono text-xs text-[#94a3b8] sm:block">
                                /
                            </kbd>
                        )}
                    </div>

                    <div className="flex items-center gap-4 border-b border-[#1e293b] px-2 sm:px-4">
                        <div role="tablist" aria-label="Search scope" className="flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
                            {scopes.map((entry, index) => {
                                const selected = entry.key === scope
                                return (
                                    <button
                                        key={entry.key}
                                        ref={(node) => {
                                            tabRefs.current[index] = node
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${uid}-tab-${entry.key}`}
                                        aria-selected={selected}
                                        aria-controls={panelId}
                                        tabIndex={selected ? 0 : -1}
                                        className={cn(
                                            'relative flex min-h-12 shrink-0 items-center gap-2 px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee] sm:px-4',
                                            selected ? 'text-[#f8fafc]' : 'text-[#94a3b8] hover:text-[#e2e8f0]',
                                        )}
                                        onClick={() => selectScope(entry.key)}
                                        onKeyDown={(event) => onTabKeyDown(event, index)}
                                    >
                                        {entry.label}
                                        <span
                                            className={cn(
                                                'min-w-6 rounded-full px-1.5 py-0.5 text-center font-mono text-[11px] tabular-nums',
                                                selected
                                                    ? 'bg-[#22d3ee] text-[#0f172a]'
                                                    : counts[entry.key]
                                                      ? 'bg-[#1e293b] text-[#cbd5e1]'
                                                      : 'bg-[#1e293b]/60 text-[#64748b]',
                                            )}
                                        >
                                            {counts[entry.key]}
                                        </span>
                                        {selected && (
                                            <motion.span
                                                layoutId={`${uid}-tab-line`}
                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
                                                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#22d3ee]"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                        <p className="hidden shrink-0 font-mono text-[11px] text-[#64748b] md:block">↑↓ results · ↵ open · esc clear</p>
                    </div>

                    <p className="sr-only" aria-live="polite">
                        {status}
                    </p>

                    <div
                        id={panelId}
                        role="tabpanel"
                        aria-labelledby={`${uid}-tab-${scope}`}
                        className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr]"
                    >
                        <div className="border-b border-[#1e293b] lg:border-b-0 lg:border-r">
                            {results.length ? (
                                <ul id={listId} role="listbox" aria-label={`${scopeLabel} results`} className="max-h-[420px] overflow-y-auto p-2 sm:p-3">
                                    {results.map((item, index) => {
                                        const isActive = index === activeIndex
                                        const Icon = typeMeta[item.type].icon
                                        return (
                                            <li
                                                key={item.id}
                                                id={optionId(item.id)}
                                                role="option"
                                                aria-selected={isActive}
                                                className={cn(
                                                    'relative flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-100 sm:px-4',
                                                    isActive ? 'bg-[#22d3ee]/[0.08]' : 'hover:bg-white/[0.03]',
                                                )}
                                                onMouseMove={() => setActive(index)}
                                                onClick={() => setActive(index)}
                                                onDoubleClick={() => openResult(item)}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#22d3ee] transition-opacity',
                                                        isActive ? 'opacity-100' : 'opacity-0',
                                                    )}
                                                />
                                                {item.type === 'community' ? (
                                                    <span
                                                        aria-hidden="true"
                                                        className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1e293b] font-mono text-xs uppercase text-[#cbd5e1]"
                                                    >
                                                        {item.author.slice(0, 2)}
                                                    </span>
                                                ) : (
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'grid size-9 shrink-0 place-items-center rounded-lg border',
                                                            isActive ? 'border-[#22d3ee]/40 text-[#22d3ee]' : 'border-[#1e293b] text-[#94a3b8]',
                                                        )}
                                                    >
                                                        <Icon className="size-4" />
                                                    </span>
                                                )}
                                                <span className="min-w-0 flex-1">
                                                    {item.type === 'api' ? (
                                                        <span className="flex min-w-0 items-center gap-2">
                                                            <span
                                                                className={cn(
                                                                    'shrink-0 rounded border px-1.5 py-px font-mono text-[10px] font-bold tracking-wide',
                                                                    methodTone[item.method],
                                                                )}
                                                            >
                                                                {item.method}
                                                            </span>
                                                            <span className="truncate font-mono text-sm text-[#f8fafc]">
                                                                <Highlight text={item.title} tokens={tokens} />
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="block text-[15px] font-medium leading-snug text-[#f8fafc]">
                                                            <Highlight text={item.title} tokens={tokens} />
                                                        </span>
                                                    )}
                                                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#94a3b8]">
                                                        {scope === 'all' && (
                                                            <span className="font-mono uppercase tracking-wider text-[#64748b]">
                                                                {typeMeta[item.type].label}
                                                            </span>
                                                        )}
                                                        {item.type === 'guide' && (
                                                            <span>
                                                                {item.area} · {item.minutes} min read
                                                            </span>
                                                        )}
                                                        {item.type === 'api' && (
                                                            <span>
                                                                <Highlight text={item.summary} tokens={tokens} />
                                                            </span>
                                                        )}
                                                        {item.type === 'community' && (
                                                            <>
                                                                <span>{item.replies} replies</span>
                                                                {item.answered ? (
                                                                    <span className="inline-flex items-center gap-1 text-[#6ee7b7]">
                                                                        <HiCheckBadge className="size-3.5" aria-hidden="true" />
                                                                        Answered
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[#fcd34d]">Open</span>
                                                                )}
                                                                <span>{item.age}</span>
                                                            </>
                                                        )}
                                                    </span>
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div id={listId} className="px-6 py-14 text-center">
                                    <p className="font-mono text-sm text-[#22d3ee]">0 results</p>
                                    <p className="mt-2 text-lg font-medium text-[#f8fafc]">
                                        No {scope === 'all' ? '' : `${scopeLabel} `}matches for “{query.trim()}”
                                    </p>
                                    {otherScopes.length ? (
                                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                                            {otherScopes.map((entry) => (
                                                <button
                                                    key={entry.key}
                                                    type="button"
                                                    className="min-h-10 rounded-lg border border-[#334155] px-3.5 text-sm text-[#e2e8f0] hover:border-[#22d3ee] hover:text-[#f8fafc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                                    onClick={() => selectScope(entry.key, true)}
                                                >
                                                    {counts[entry.key]} in {entry.label} →
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mt-2 text-sm text-[#94a3b8]">Try a broader term:</p>
                                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                                {quickQueries.map((term) => (
                                                    <button
                                                        key={term}
                                                        type="button"
                                                        className="min-h-10 rounded-lg border border-[#334155] px-3.5 font-mono text-sm text-[#e2e8f0] hover:border-[#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                                        onClick={() => {
                                                            setQuery(term)
                                                            setActive(0)
                                                            inputRef.current?.focus()
                                                        }}
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                            <a
                                                href="#hub/community/new"
                                                className="mt-5 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#22d3ee] hover:text-[#a5f3fc] focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                                            >
                                                Ask the community
                                                <HiArrowUpRight className="size-4" aria-hidden="true" />
                                            </a>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative min-h-[300px] p-5 sm:p-6 lg:min-h-[420px]">
                            <AnimatePresence mode="wait" initial={false}>
                                {current ? (
                                    <motion.article
                                        key={current.id}
                                        initial={{ opacity: 0, x: reduceMotion ? 0 : 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.18 }}
                                        className="flex h-full flex-col"
                                    >
                                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#64748b]">
                                            {current.type === 'guide' && `Guides › ${current.area}`}
                                            {current.type === 'api' && 'API reference › v2'}
                                            {current.type === 'community' && 'Community › Q&A'}
                                        </p>
                                        {current.type === 'api' ? (
                                            <>
                                                <h3 className="mt-3 text-xl font-semibold text-[#f8fafc]">{current.summary}</h3>
                                                <p className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-[#1e293b] bg-[#020617] px-3 py-2.5 font-mono text-[13px]">
                                                    <span className={cn('shrink-0 rounded border px-1.5 py-px text-[10px] font-bold', methodTone[current.method])}>
                                                        {current.method}
                                                    </span>
                                                    <span className="truncate text-[#e2e8f0]">{current.title}</span>
                                                </p>
                                            </>
                                        ) : (
                                            <h3 className="mt-3 text-xl font-semibold leading-snug text-[#f8fafc]">{current.title}</h3>
                                        )}
                                        <p className="mt-3 text-sm leading-relaxed text-[#cbd5e1]">{current.text}</p>
                                        <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                                            {current.type === 'guide' && (
                                                <>
                                                    <div className="rounded-lg border border-[#1e293b] p-3">
                                                        <dt className="text-[#64748b]">reading</dt>
                                                        <dd className="mt-1 text-[#f8fafc]">{current.minutes} min</dd>
                                                    </div>
                                                    <div className="rounded-lg border border-[#1e293b] p-3">
                                                        <dt className="text-[#64748b]">updated</dt>
                                                        <dd className="mt-1 text-[#f8fafc]">{current.updated}</dd>
                                                    </div>
                                                </>
                                            )}
                                            {current.type === 'api' && (
                                                <div className="col-span-2 rounded-lg border border-[#1e293b] p-3">
                                                    <dt className="text-[#64748b]">parameters</dt>
                                                    <dd className="mt-2 flex flex-wrap gap-1.5">
                                                        {current.params.map((param) => (
                                                            <span key={param} className="rounded bg-[#1e293b] px-1.5 py-0.5 text-[#a5f3fc]">
                                                                {param}
                                                            </span>
                                                        ))}
                                                    </dd>
                                                </div>
                                            )}
                                            {current.type === 'community' && (
                                                <>
                                                    <div className="rounded-lg border border-[#1e293b] p-3">
                                                        <dt className="text-[#64748b]">asked by</dt>
                                                        <dd className="mt-1 truncate text-[#f8fafc]">@{current.author}</dd>
                                                    </div>
                                                    <div className="rounded-lg border border-[#1e293b] p-3">
                                                        <dt className="text-[#64748b]">status</dt>
                                                        <dd className={cn('mt-1', current.answered ? 'text-[#6ee7b7]' : 'text-[#fcd34d]')}>
                                                            {current.answered ? 'answered' : 'open'} · {current.replies}
                                                        </dd>
                                                    </div>
                                                </>
                                            )}
                                        </dl>
                                        <a
                                            href={`#hub/${current.type}/${current.id}`}
                                            className={cn(
                                                'mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee] lg:mt-auto',
                                                launched === current.id
                                                    ? 'bg-[#34d399] text-[#022c22]'
                                                    : 'bg-[#22d3ee] text-[#0f172a] hover:bg-[#67e8f9]',
                                            )}
                                            onClick={() => setLaunched(current.id)}
                                        >
                                            {launched === current.id ? (
                                                <>
                                                    <HiCheck className="size-4" aria-hidden="true" />
                                                    Opened
                                                </>
                                            ) : (
                                                <>
                                                    {current.type === 'guide' && 'Read guide'}
                                                    {current.type === 'api' && 'View endpoint'}
                                                    {current.type === 'community' && 'Open thread'}
                                                    <HiArrowUpRight className="size-4" aria-hidden="true" />
                                                </>
                                            )}
                                        </a>
                                    </motion.article>
                                ) : (
                                    <motion.p
                                        key="none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.12 }}
                                        className="grid h-full min-h-[240px] place-items-center text-center font-mono text-sm text-[#64748b]"
                                    >
                                        Nothing selected
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ScopedTabsLiveSearch

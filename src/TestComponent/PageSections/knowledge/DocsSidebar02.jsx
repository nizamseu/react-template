// VersionSwitchDocsSidebar

// DocsSidebar02 · Knowledge Bases & Documentation › Hierarchical Sidebar (TOC)

// Description:
// A versioned docs sidebar for the fictional Nimbus Developer Hub. A version picker
// (v3.2 Latest, v3.1 Maintained, v2.x End of life) swaps the whole tree, where pages
// carry "New" or "Deprecated" badges, and the article pane explains missing or
// deprecated pages. Use it for APIs, SDKs or any docs site that publishes several major
// versions.

// Design:
// - Slate-navy #0f172a section, sidebar #0b1222, hairlines #1e293b; cyan #22d3ee for
//   the current page bar, "New" badges, focus rings; amber #fbbf24 for "Deprecated" and
//   EOL notes
// - Mono uppercase section labels with counts; pages are 40px rows on a left rule that
//   turns cyan for the current page; deprecated pages are struck through at 60% opacity
// - Version picker: full-width button with status dot, popup listbox with release
//   dates; version banner under it (EOL warning on v2.x, "v3.2 is out" hint on v3.1)
// - The tree cross-fades/slides when the version changes, groups animate their height,
//   and the article fades between pages; all instant with reduced motion
// - lg: 320px sidebar beside the article; below lg the sidebar stacks on top

// What it does:
// - Picker = button (aria-haspopup="listbox", aria-expanded) + listbox with
//   aria-activedescendant; ↑/↓/Home/End move, Enter/Space choose, Escape/Tab/outside
//   click close
// - Switching version keeps the current page when it exists there, otherwise falls back
//   to Overview and says so in a dismissible notice (also announced via aria-live)
// - Section headers are disclosure buttons (aria-expanded + aria-controls); the section
//   of the active page is always re-opened; links use aria-current="page" and
//   #nimbus/<version>/<id>
// - Deprecated pages show their replacement in the article with a link that opens it

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VersionSwitchDocsSidebar from '@/TestComponent/PageSections/knowledge/DocsSidebar02';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <VersionSwitchDocsSidebar />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiChevronDown,
    HiChevronUpDown,
    HiOutlineExclamationTriangle,
    HiOutlineInformationCircle,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const versions = [
    { id: 'v3.2', status: 'Latest', date: 'Released Sep 09, 2026', dot: 'bg-[#22d3ee]' },
    { id: 'v3.1', status: 'Maintained', date: 'Released May 20, 2026', dot: 'bg-[#94a3b8]' },
    { id: 'v2.x', status: 'End of life', date: 'EOL since Mar 31, 2026', dot: 'bg-[#fbbf24]' },
]

const p = (id, label, badge, replacement) => ({ id, label, badge, replacement })

const docs = {
    'v3.2': [
        { id: 'get-started', label: 'Get started', pages: [p('overview', 'Overview'), p('quickstart', 'Quickstart'), p('regions', 'Regions & zones')] },
        { id: 'compute', label: 'Compute', pages: [p('instances', 'Instances'), p('autoscaling', 'Autoscaling groups'), p('gpu', 'GPU instances', 'new'), p('spot', 'Spot capacity')] },
        { id: 'storage', label: 'Storage', pages: [p('buckets', 'Buckets'), p('volumes', 'Block volumes'), p('vector-store', 'Vector Store', 'new')] },
        { id: 'networking', label: 'Networking', pages: [p('vpc', 'VPC'), p('load-balancers', 'Load balancers'), p('private-dns', 'Private DNS')] },
        { id: 'functions', label: 'Functions', pages: [p('functions', 'Functions overview'), p('cron', 'Cron triggers'), p('edge-functions', 'Edge Functions', 'new')] },
        { id: 'security', label: 'Security', pages: [p('api-keys', 'API keys'), p('service-accounts', 'Service accounts'), p('classic-webhooks', 'Classic webhooks', 'deprecated', 'event-streams'), p('legacy-tokens', 'Legacy auth tokens', 'deprecated', 'service-accounts')] },
        { id: 'reference', label: 'API reference', pages: [p('rest-v2', 'REST API v2'), p('event-streams', 'Event Streams', 'new'), p('errors', 'Error codes')] },
    ],
    'v3.1': [
        { id: 'get-started', label: 'Get started', pages: [p('overview', 'Overview'), p('quickstart', 'Quickstart'), p('regions', 'Regions & zones')] },
        { id: 'compute', label: 'Compute', pages: [p('instances', 'Instances'), p('autoscaling', 'Autoscaling groups'), p('spot', 'Spot capacity', 'new')] },
        { id: 'storage', label: 'Storage', pages: [p('buckets', 'Buckets'), p('volumes', 'Block volumes')] },
        { id: 'networking', label: 'Networking', pages: [p('vpc', 'VPC'), p('load-balancers', 'Load balancers'), p('private-dns', 'Private DNS', 'new')] },
        { id: 'functions', label: 'Functions', pages: [p('functions', 'Functions overview'), p('cron', 'Cron triggers', 'new')] },
        { id: 'security', label: 'Security', pages: [p('api-keys', 'API keys'), p('service-accounts', 'Service accounts'), p('classic-webhooks', 'Classic webhooks'), p('legacy-tokens', 'Legacy auth tokens', 'deprecated', 'service-accounts')] },
        { id: 'reference', label: 'API reference', pages: [p('rest-v2', 'REST API v2'), p('errors', 'Error codes')] },
    ],
    'v2.x': [
        { id: 'get-started', label: 'Get started', pages: [p('overview', 'Overview'), p('quickstart', 'Quickstart (v2)'), p('regions', 'Regions')] },
        { id: 'compute', label: 'Compute', pages: [p('instances', 'Instances'), p('instance-groups', 'Instance groups')] },
        { id: 'storage', label: 'Storage', pages: [p('buckets', 'Buckets'), p('volumes', 'Block volumes')] },
        { id: 'networking', label: 'Networking', pages: [p('vpc', 'VPC'), p('load-balancers', 'Load balancers')] },
        { id: 'tasks', label: 'Tasks', pages: [p('scheduled-tasks', 'Scheduled tasks', 'deprecated', 'cron')] },
        { id: 'security', label: 'Security', pages: [p('legacy-tokens', 'Auth tokens'), p('classic-webhooks', 'Webhooks')] },
        { id: 'reference', label: 'API reference', pages: [p('rest-v1', 'REST API v1', 'deprecated', 'rest-v2'), p('errors', 'Error codes')] },
    ],
}

const summaries = {
    overview: 'What Nimbus is, how projects, regions and resources fit together, and where to start.',
    quickstart: 'Boot an instance, attach a bucket and call it from the CLI in about ten minutes.',
    regions: 'Eleven regions and 31 zones, with latency tables and data-residency notes.',
    instances: 'Shapes, images, metadata and lifecycle states for virtual machines.',
    autoscaling: 'Scale instance groups on CPU, queue depth or custom metrics with cooldowns.',
    'instance-groups': 'Group identical instances behind a template and resize them together.',
    gpu: 'A100 and L4 shapes for training and inference, billed per second.',
    spot: 'Run interruptible workloads for up to 70% less with a two-minute warning.',
    buckets: 'Object storage with versioning, lifecycle rules and signed URLs.',
    volumes: 'Network block storage from 10 GB to 64 TB with snapshots.',
    'vector-store': 'Store embeddings next to your data and query them with cosine or dot product.',
    vpc: 'Private networks with subnets per zone, routes and firewall rules.',
    'load-balancers': 'Layer 4 and layer 7 load balancing with managed certificates.',
    'private-dns': 'Resolve internal service names inside a VPC without public records.',
    functions: 'Deploy event-driven functions in Node.js, Python or Go.',
    cron: 'Trigger functions on a cron expression in any time zone, with retries.',
    'edge-functions': 'Run functions in 42 edge locations with a 5 ms cold start.',
    'scheduled-tasks': 'The v2 scheduler for recurring scripts on a single instance.',
    'api-keys': 'Create, scope and rotate keys for the REST API and SDKs.',
    'service-accounts': 'Machine identities with short-lived tokens and fine-grained roles.',
    'classic-webhooks': 'HTTP callbacks for resource events, signed with a shared secret.',
    'legacy-tokens': 'Long-lived personal tokens from the original authentication system.',
    'rest-v1': 'The original REST API, frozen since v2.8 and removed in v3.0.',
    'rest-v2': 'Resource-oriented REST API with cursor pagination and idempotency keys.',
    'event-streams': 'Durable, replayable event feeds that replace classic webhooks.',
    errors: 'Every error code, what triggers it and how to recover.',
}

const INITIAL_VERSION = 'v3.2'
const INITIAL_PAGE = 'vector-store'

function findPage(version, id) {
    for (const section of docs[version]) {
        const page = section.pages.find((entry) => entry.id === id)
        if (page) return { page, section }
    }
    return null
}

export function VersionSwitchDocsSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const pickerRef = useRef(null)
    const buttonRef = useRef(null)
    const listRef = useRef(null)
    const [version, setVersion] = useState(INITIAL_VERSION)
    const [pageId, setPageId] = useState(INITIAL_PAGE)
    const [expanded, setExpanded] = useState(() => new Set(['get-started', 'storage']))
    const [menuOpen, setMenuOpen] = useState(false)
    const [highlight, setHighlight] = useState(0)
    const [notice, setNotice] = useState(null)

    const current = findPage(version, pageId) || findPage(version, 'overview')
    const versionMeta = versions.find((entry) => entry.id === version)
    const sections = docs[version]
    const counts = useMemo(() => {
        const all = sections.flatMap((section) => section.pages)
        return {
            total: all.length,
            added: all.filter((page) => page.badge === 'new').length,
            deprecated: all.filter((page) => page.badge === 'deprecated').length,
        }
    }, [sections])

    useEffect(() => {
        if (!menuOpen) return undefined
        listRef.current?.focus()
        const onPointerDown = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) setMenuOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [menuOpen])

    const openPage = (id, targetVersion = version) => {
        const found = findPage(targetVersion, id)
        if (!found) return
        setPageId(id)
        setExpanded((prev) => new Set([...prev, found.section.id]))
    }

    const chooseVersion = (nextVersion) => {
        setMenuOpen(false)
        buttonRef.current?.focus()
        if (nextVersion === version) return
        const found = findPage(nextVersion, current.page.id)
        if (found) {
            setNotice(null)
            setVersion(nextVersion)
            setExpanded((prev) => new Set([...prev, found.section.id]))
        } else {
            setNotice({ missing: current.page.label, version: nextVersion })
            setVersion(nextVersion)
            setPageId('overview')
            setExpanded((prev) => new Set([...prev, 'get-started']))
        }
    }

    const openMenu = () => {
        setHighlight(versions.findIndex((entry) => entry.id === version))
        setMenuOpen(true)
    }

    const onButtonKeyDown = (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            openMenu()
        }
    }

    const onListKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setHighlight((index) => Math.min(versions.length - 1, index + 1))
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setHighlight((index) => Math.max(0, index - 1))
        } else if (event.key === 'Home') {
            event.preventDefault()
            setHighlight(0)
        } else if (event.key === 'End') {
            event.preventDefault()
            setHighlight(versions.length - 1)
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            chooseVersion(versions[highlight].id)
        } else if (event.key === 'Escape') {
            event.preventDefault()
            setMenuOpen(false)
            buttonRef.current?.focus()
        } else if (event.key === 'Tab') {
            setMenuOpen(false)
        }
    }

    const toggleSection = (id) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const replacement = current.page.replacement ? findPage(version, current.page.replacement) || findPage('v3.2', current.page.replacement) : null
    const replacementInVersion = replacement && findPage(version, current.page.replacement)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 right-[-10%] h-[420px] w-[620px] bg-[radial-gradient(closest-side,rgba(34,211,238,0.14),transparent)]" />
            </div>
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#22d3ee]">Nimbus Developer Hub · Docs</p>
                        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-[#f8fafc] sm:text-5xl">
                            One sidebar, every version you still run.
                        </h2>
                    </div>
                    <dl className="flex gap-6 font-mono text-xs text-[#94a3b8]">
                        <div>
                            <dt>pages in {version}</dt>
                            <dd className="mt-1 text-2xl text-[#f8fafc]">{counts.total}</dd>
                        </div>
                        <div>
                            <dt>new</dt>
                            <dd className="mt-1 text-2xl text-[#22d3ee]">{counts.added}</dd>
                        </div>
                        <div>
                            <dt>deprecated</dt>
                            <dd className="mt-1 text-2xl text-[#fbbf24]">{counts.deprecated}</dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0b1222] lg:grid-cols-[320px_1fr]">
                    <aside className="border-b border-[#1e293b] lg:border-b-0 lg:border-r">
                        <div className="border-b border-[#1e293b] p-4">
                            <p id={`${uid}-version-label`} className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#64748b]">
                                Version
                            </p>
                            <div ref={pickerRef} className="relative">
                                <button
                                    ref={buttonRef}
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={menuOpen}
                                    aria-controls={`${uid}-versions`}
                                    aria-labelledby={`${uid}-version-label ${uid}-version-value`}
                                    className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-[#334155] bg-[#0f172a] px-3.5 text-left transition-colors hover:border-[#22d3ee]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                    onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
                                    onKeyDown={onButtonKeyDown}
                                >
                                    <span className={cn('size-2 shrink-0 rounded-full', versionMeta.dot)} aria-hidden="true" />
                                    <span id={`${uid}-version-value`} className="flex-1 font-mono text-sm text-[#f8fafc]">
                                        {version} <span className="text-[#94a3b8]">· {versionMeta.status}</span>
                                    </span>
                                    <HiChevronUpDown className="size-4 text-[#94a3b8]" aria-hidden="true" />
                                </button>

                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.ul
                                            ref={listRef}
                                            id={`${uid}-versions`}
                                            role="listbox"
                                            tabIndex={-1}
                                            aria-labelledby={`${uid}-version-label`}
                                            aria-activedescendant={`${uid}-version-${highlight}`}
                                            initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                                            transition={{ duration: 0.14 }}
                                            className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-[#334155] bg-[#0f172a] p-1.5 shadow-[0_24px_50px_-12px_rgba(2,6,23,0.9)] focus:outline-none"
                                            onKeyDown={onListKeyDown}
                                        >
                                            {versions.map((entry, index) => (
                                                <li
                                                    key={entry.id}
                                                    id={`${uid}-version-${index}`}
                                                    role="option"
                                                    aria-selected={entry.id === version}
                                                    className={cn(
                                                        'flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-3 py-2',
                                                        index === highlight ? 'bg-[#22d3ee]/10' : 'hover:bg-white/[0.03]',
                                                    )}
                                                    onMouseMove={() => setHighlight(index)}
                                                    onClick={() => chooseVersion(entry.id)}
                                                >
                                                    <span className={cn('size-2 shrink-0 rounded-full', entry.dot)} aria-hidden="true" />
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block font-mono text-sm text-[#f8fafc]">
                                                            {entry.id} <span className="text-[#94a3b8]">· {entry.status}</span>
                                                        </span>
                                                        <span className="block text-xs text-[#64748b]">{entry.date}</span>
                                                    </span>
                                                    {entry.id === version && <HiCheck className="size-4 text-[#22d3ee]" aria-hidden="true" />}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            {version === 'v2.x' && (
                                <div className="mt-3 flex gap-2.5 rounded-xl border border-[#fbbf24]/30 bg-[#fbbf24]/[0.07] p-3 text-xs leading-relaxed text-[#fde68a]">
                                    <HiOutlineExclamationTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                    <p>
                                        v2.x reached end of life on Mar 31, 2026.{' '}
                                        <button
                                            type="button"
                                            className="font-semibold text-[#fbbf24] underline underline-offset-2 hover:text-[#fde68a] focus-visible:outline-2 focus-visible:outline-[#fbbf24]"
                                            onClick={() => chooseVersion('v3.2')}
                                        >
                                            Switch to v3.2
                                        </button>
                                    </p>
                                </div>
                            )}
                            {version === 'v3.1' && (
                                <div className="mt-3 flex gap-2.5 rounded-xl border border-[#22d3ee]/25 bg-[#22d3ee]/[0.06] p-3 text-xs leading-relaxed text-[#a5f3fc]">
                                    <HiOutlineInformationCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                    <p>
                                        v3.2 adds GPU instances and Vector Store.{' '}
                                        <button
                                            type="button"
                                            className="font-semibold text-[#22d3ee] underline underline-offset-2 hover:text-[#a5f3fc] focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                                            onClick={() => chooseVersion('v3.2')}
                                        >
                                            View latest
                                        </button>
                                    </p>
                                </div>
                            )}
                        </div>

                        <nav aria-label={`Nimbus ${version} documentation`} className="max-h-[440px] overflow-y-auto p-3 lg:max-h-[620px]">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.ul
                                    key={version}
                                    initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: reduceMotion ? 0 : 10 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                                    className="space-y-1"
                                >
                                    {sections.map((section) => {
                                        const isOpen = expanded.has(section.id)
                                        const panelId = `${uid}-${version}-${section.id}`
                                        const hasActive = section.pages.some((page) => page.id === current.page.id)
                                        return (
                                            <li key={section.id}>
                                                <button
                                                    type="button"
                                                    aria-expanded={isOpen}
                                                    aria-controls={panelId}
                                                    className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-[#94a3b8] hover:bg-white/[0.03] hover:text-[#e2e8f0] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee]"
                                                    onClick={() => toggleSection(section.id)}
                                                >
                                                    <span className={cn('flex-1', hasActive && 'text-[#f8fafc]')}>{section.label}</span>
                                                    {hasActive && !isOpen && <span className="size-1.5 rounded-full bg-[#22d3ee]" aria-hidden="true" />}
                                                    <span className="normal-case tracking-normal text-[#475569]">{section.pages.length}</span>
                                                    <HiChevronDown
                                                        className={cn('size-3.5 transition-transform duration-200', !isOpen && '-rotate-90')}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.ul
                                                            id={panelId}
                                                            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                            animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                                            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            {section.pages.map((page) => {
                                                                const isActive = page.id === current.page.id
                                                                return (
                                                                    <li key={page.id}>
                                                                        <a
                                                                            href={`#nimbus/${version}/${page.id}`}
                                                                            aria-current={isActive ? 'page' : undefined}
                                                                            className={cn(
                                                                                'relative ml-2.5 flex min-h-10 items-center gap-2 border-l py-1.5 pl-4 pr-2 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee]',
                                                                                isActive
                                                                                    ? 'border-[#22d3ee] bg-linear-to-r from-[#22d3ee]/10 to-transparent font-medium text-[#f8fafc]'
                                                                                    : 'border-[#1e293b] text-[#cbd5e1] hover:border-[#475569] hover:text-[#f8fafc]',
                                                                            )}
                                                                            onClick={() => openPage(page.id)}
                                                                        >
                                                                            <span
                                                                                className={cn(
                                                                                    'min-w-0 flex-1 truncate',
                                                                                    page.badge === 'deprecated' && 'line-through decoration-[#fbbf24]/60 opacity-60',
                                                                                )}
                                                                            >
                                                                                {page.label}
                                                                            </span>
                                                                            {page.badge === 'new' && (
                                                                                <span className="shrink-0 rounded-full bg-[#22d3ee]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#67e8f9]">
                                                                                    New
                                                                                </span>
                                                                            )}
                                                                            {page.badge === 'deprecated' && (
                                                                                <span className="shrink-0 rounded-full border border-[#fbbf24]/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#fcd34d]">
                                                                                    Deprecated
                                                                                </span>
                                                                            )}
                                                                        </a>
                                                                    </li>
                                                                )
                                                            })}
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        )
                                    })}
                                </motion.ul>
                            </AnimatePresence>
                        </nav>
                    </aside>

                    <div className="min-w-0 p-5 sm:p-10 lg:p-12">
                        <div aria-live="polite">
                            {notice && (
                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#334155] bg-[#0f172a] p-4 text-sm text-[#cbd5e1]">
                                    <HiOutlineInformationCircle className="mt-0.5 size-5 shrink-0 text-[#22d3ee]" aria-hidden="true" />
                                    <p className="flex-1">
                                        “{notice.missing}” isn’t part of {notice.version} — showing Overview instead.
                                    </p>
                                    <button
                                        type="button"
                                        aria-label="Dismiss notice"
                                        className="-m-2 grid size-10 shrink-0 place-items-center rounded-lg text-[#94a3b8] hover:text-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                                        onClick={() => setNotice(null)}
                                    >
                                        <HiXMark className="size-4" aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.article
                                key={`${version}-${current.page.id}`}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                            >
                                <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#64748b]">
                                    <span className="rounded-md border border-[#334155] px-1.5 py-0.5 text-[#cbd5e1]">{version}</span>
                                    <span>{current.section.label}</span>
                                    <span aria-hidden="true">/</span>
                                    <span className="text-[#94a3b8]">{current.page.id}</span>
                                </p>
                                <h3 className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight text-[#f8fafc] sm:text-4xl">
                                    {current.page.label}
                                    {current.page.badge === 'new' && (
                                        <span className="rounded-full bg-[#22d3ee] px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-[#0f172a]">
                                            New in {version}
                                        </span>
                                    )}
                                </h3>
                                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#cbd5e1]">{summaries[current.page.id]}</p>

                                {current.page.badge === 'deprecated' && replacement && (
                                    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#fbbf24]/30 bg-[#fbbf24]/[0.06] p-4 sm:flex-row sm:items-center">
                                        <HiOutlineExclamationTriangle className="size-5 shrink-0 text-[#fbbf24]" aria-hidden="true" />
                                        <p className="flex-1 text-sm text-[#fde68a]">
                                            Deprecated in {version}. Use <strong className="font-semibold">{replacement.page.label}</strong>
                                            {replacementInVersion ? '' : ' in v3.2'} instead.
                                        </p>
                                        <a
                                            href={`#nimbus/${replacementInVersion ? version : 'v3.2'}/${replacement.page.id}`}
                                            className="inline-flex min-h-10 items-center gap-1.5 self-start rounded-lg bg-[#fbbf24] px-3.5 text-sm font-semibold text-[#0f172a] hover:bg-[#fcd34d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbbf24] sm:self-auto"
                                            onClick={() => {
                                                if (replacementInVersion) openPage(replacement.page.id)
                                                else {
                                                    setNotice(null)
                                                    setVersion('v3.2')
                                                    openPage(replacement.page.id, 'v3.2')
                                                }
                                            }}
                                        >
                                            Open {replacement.page.label}
                                            <HiArrowRight className="size-4" aria-hidden="true" />
                                        </a>
                                    </div>
                                )}

                                <div aria-hidden="true" className="mt-8 space-y-3">
                                    {['w-full', 'w-[92%]', 'w-[84%]', 'w-[56%]'].map((width) => (
                                        <span key={width} className={cn('block h-3 rounded-full bg-[#1e293b]', width)} />
                                    ))}
                                </div>
                                <div aria-hidden="true" className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {[0, 1].map((card) => (
                                        <div key={card} className="rounded-xl border border-[#1e293b] p-4">
                                            <span className="block h-3 w-1/3 rounded-full bg-[#22d3ee]/30" />
                                            <span className="mt-3 block h-2.5 w-full rounded-full bg-[#1e293b]" />
                                            <span className="mt-2 block h-2.5 w-4/5 rounded-full bg-[#1e293b]" />
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-8 font-mono text-xs text-[#64748b]">
                                    Viewing docs for {version} · {versionMeta.date}
                                </p>
                            </motion.article>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VersionSwitchDocsSidebar

// FilterTreeDocsSidebar

// DocsSidebar03 · Knowledge Bases & Documentation › Hierarchical Sidebar (TOC)

// Description:
// A light help-centre sidebar for the fictional Helpbase whose filter field narrows a
// three-level article tree as you type. Under "Type to narrow 29 articles down to the
// one you need." matches stay visible with parents auto-expanded and matched letters
// highlighted, beside an article preview. Use it for large help centres and manuals.

// Design:
// - White section, sidebar #f8fafc with #e2e8f0 hairlines, navy #0f172a text and blue
//   #2563eb for the active article, focus rings and highlight marks (#dbeafe)
// - Section rows carry a 32px blue icon tile and a right-hand chevron; nested levels
//   indent behind a left guide rule; the active article is a white card with a blue
//   left bar and soft shadow
// - Article pane: breadcrumb, semibold title text-2xl → sm:4xl, meta, skeleton copy and
//   an "In this section" list of sibling articles
// - Folders open and close with a framer-motion height animation and the article
//   cross-fades between pages; both are instant with reduced motion
// - lg: 340px sidebar beside the article; below lg the sidebar stacks on top with a
//   420px scroll

// What it does:
// - Filter matches every word of the query against article and folder names; ancestors
//   of matches are shown and expanded, a matching folder keeps all its children, and
//   matched text is wrapped in <mark>; "3 of 29 articles" updates live (aria-live)
// - Folders are disclosure buttons with aria-expanded/aria-controls; toggles made while
//   filtering are temporary and your own open/closed state returns when the filter
//   clears
// - ↓ in the filter jumps into the tree, ↑/↓ move between rows, Escape clears the
//   filter, and "/" focuses the filter while focus is inside this section
// - Choosing an article sets aria-current="page", re-opens its parents and links to
//   #help/<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FilterTreeDocsSidebar from '@/TestComponent/PageSections/knowledge/DocsSidebar03';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <FilterTreeDocsSidebar />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiChevronRight,
    HiOutlineBolt,
    HiOutlineChartBar,
    HiOutlineCreditCard,
    HiOutlineFunnel,
    HiOutlineInboxStack,
    HiOutlineRocketLaunch,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tree = [
    {
        id: 'getting-started',
        label: 'Getting started',
        icon: HiOutlineRocketLaunch,
        children: [
            { id: 'welcome', label: 'Welcome to Helpbase' },
            {
                id: 'workspace-setup',
                label: 'Set up your workspace',
                children: [
                    { id: 'first-inbox', label: 'Create your first inbox' },
                    { id: 'invite-team', label: 'Invite your team' },
                    { id: 'chat-widget', label: 'Install the chat widget' },
                    { id: 'email-forwarding', label: 'Forward your support email' },
                ],
            },
            { id: 'shortcuts', label: 'Keyboard shortcuts' },
        ],
    },
    {
        id: 'inbox',
        label: 'Inbox & conversations',
        icon: HiOutlineInboxStack,
        children: [
            { id: 'assign-snooze', label: 'Assign and snooze conversations' },
            {
                id: 'tags-fields',
                label: 'Tags and custom fields',
                children: [
                    { id: 'create-tags', label: 'Create and colour tags' },
                    { id: 'custom-fields', label: 'Custom conversation fields' },
                    { id: 'bulk-tag', label: 'Bulk-tag conversations' },
                ],
            },
            { id: 'saved-replies', label: 'Saved replies' },
            { id: 'merge', label: 'Merge duplicate conversations' },
            { id: 'private-notes', label: 'Private notes and mentions' },
        ],
    },
    {
        id: 'automation',
        label: 'Automation',
        icon: HiOutlineBolt,
        children: [
            {
                id: 'rules',
                label: 'Rules',
                children: [
                    { id: 'auto-assign', label: 'Auto-assign by team' },
                    { id: 'auto-close', label: 'Auto-close stale conversations' },
                    { id: 'vip-priority', label: 'Priority rules for VIP customers' },
                ],
            },
            { id: 'sla', label: 'SLAs and business hours' },
            { id: 'chatbot', label: 'Chatbot flows' },
            { id: 'webhooks', label: 'Webhooks for new conversations' },
        ],
    },
    {
        id: 'reporting',
        label: 'Reporting',
        icon: HiOutlineChartBar,
        children: [
            { id: 'team-dashboard', label: 'Team performance dashboard' },
            { id: 'csat', label: 'CSAT surveys' },
            { id: 'export-reports', label: 'Export reports to CSV' },
            { id: 'first-response', label: 'First response time explained' },
        ],
    },
    {
        id: 'account',
        label: 'Account & billing',
        icon: HiOutlineCreditCard,
        children: [
            { id: 'reset-password', label: 'Reset your password' },
            { id: 'two-factor', label: 'Two-factor authentication' },
            {
                id: 'plans-invoices',
                label: 'Plans and invoices',
                children: [
                    { id: 'change-plan', label: 'Change your plan' },
                    { id: 'download-invoices', label: 'Download invoices' },
                    { id: 'payment-method', label: 'Update your payment method' },
                ],
            },
            { id: 'delete-account', label: 'Delete your account' },
        ],
    },
]

const nodeById = {}
const parentOf = {}
const indexTree = (nodes, parent) => {
    for (const node of nodes) {
        nodeById[node.id] = node
        parentOf[node.id] = parent
        if (node.children) indexTree(node.children, node.id)
    }
}
indexTree(tree, null)
const TOTAL = Object.values(nodeById).filter((node) => !node.children).length

const ancestorsOf = (id) => {
    const list = []
    for (let parent = parentOf[id]; parent; parent = parentOf[parent]) list.unshift(parent)
    return list
}

const INITIAL_ACTIVE = 'bulk-tag'
const readTimes = [2, 3, 4, 3, 5, 2, 6]

function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function Highlight({ text, tokens }) {
    if (!tokens.length) return text
    const pattern = [...tokens]
        .sort((a, b) => b.length - a.length)
        .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')
    return text.split(new RegExp(`(${pattern})`, 'gi')).map((part, i) =>
        i % 2 === 1 ? (
            <mark key={i} className="rounded-[3px] bg-[#dbeafe] px-px font-semibold text-[#1d4ed8]">
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        ),
    )
}

export function FilterTreeDocsSidebar({
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
    const navRef = useRef(null)
    const [query, setQuery] = useState('')
    const [activeId, setActiveId] = useState(INITIAL_ACTIVE)
    const [expanded, setExpanded] = useState(() => new Set(['getting-started', ...ancestorsOf(INITIAL_ACTIVE)]))
    const [filterClosed, setFilterClosed] = useState(() => new Set())

    const tokens = useMemo(() => tokenize(query), [query])
    const filtering = tokens.length > 0

    const filter = useMemo(() => {
        if (!filtering) return null
        const visible = new Set()
        const open = new Set()
        let matches = 0
        const labelMatches = (node) => tokens.every((token) => node.label.toLowerCase().includes(token))
        const addSubtree = (node) => {
            visible.add(node.id)
            if (!node.children) matches += 1
            node.children?.forEach(addSubtree)
        }
        const visit = (node) => {
            if (labelMatches(node)) {
                addSubtree(node)
                ancestorsOf(node.id).forEach((id) => {
                    visible.add(id)
                    open.add(id)
                })
                if (node.children) open.add(node.id)
                return
            }
            node.children?.forEach(visit)
        }
        tree.forEach(visit)
        return { visible, open, matches }
    }, [filtering, tokens])

    const isOpen = (id) => (filter ? filter.open.has(id) && !filterClosed.has(id) : expanded.has(id))
    const isVisible = (id) => !filter || filter.visible.has(id)

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== '/' || event.defaultPrevented) return
            const focused = document.activeElement
            if (!rootRef.current?.contains(focused)) return
            if (focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement) return
            event.preventDefault()
            inputRef.current?.focus()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    const updateQuery = (value) => {
        setQuery(value)
        setFilterClosed(new Set())
    }

    const toggle = (id) => {
        if (filter) {
            setFilterClosed((prev) => {
                const next = new Set(prev)
                if (filter.open.has(id) && !prev.has(id)) next.add(id)
                else next.delete(id)
                return next
            })
            return
        }
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const activate = (id) => {
        setActiveId(id)
        setExpanded((prev) => new Set([...prev, ...ancestorsOf(id)]))
    }

    const focusables = () => [...(navRef.current?.querySelectorAll('[data-tree-row]') || [])]

    const onInputKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            focusables()[0]?.focus()
        } else if (event.key === 'Escape' && query) {
            event.preventDefault()
            updateQuery('')
        }
    }

    const onNavKeyDown = (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        const rows = focusables()
        const at = rows.indexOf(document.activeElement)
        if (at < 0) return
        event.preventDefault()
        if (event.key === 'ArrowDown') rows[at + 1]?.focus()
        else if (at === 0) inputRef.current?.focus()
        else rows[at - 1]?.focus()
    }

    const renderNodes = (nodes, level) =>
        nodes
            .filter((node) => isVisible(node.id))
            .map((node) => {
                const open = isOpen(node.id)
                const Icon = node.icon
                const panelId = `${uid}-${node.id}`
                const onPath = ancestorsOf(activeId).includes(node.id)
                if (node.children) {
                    return (
                        <li key={node.id}>
                            <button
                                type="button"
                                data-tree-row=""
                                aria-expanded={open}
                                aria-controls={panelId}
                                className={cn(
                                    'flex min-h-10 w-full items-center gap-2.5 rounded-lg pr-2 text-left transition-colors hover:bg-[#eef2f7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563eb]',
                                    level === 1 ? 'pl-1.5 text-sm font-semibold text-[#0f172a]' : 'pl-2.5 text-sm font-medium text-[#334155]',
                                )}
                                onClick={() => toggle(node.id)}
                            >
                                {Icon ? (
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]" aria-hidden="true">
                                        <Icon className="size-4" />
                                    </span>
                                ) : null}
                                <span className="min-w-0 flex-1 truncate">
                                    <Highlight text={node.label} tokens={tokens} />
                                </span>
                                {onPath && !open && <span className="size-1.5 shrink-0 rounded-full bg-[#2563eb]" aria-hidden="true" />}
                                <HiChevronRight
                                    className={cn('size-4 shrink-0 text-[#94a3b8] transition-transform duration-200', open && 'rotate-90 text-[#2563eb]')}
                                    aria-hidden="true"
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {open && (
                                    <motion.ul
                                        id={panelId}
                                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                        animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                                        className={cn('overflow-hidden border-l border-[#e2e8f0]', level === 1 ? 'ml-[21px] pl-2' : 'ml-3.5 pl-2')}
                                    >
                                        {renderNodes(node.children, level + 1)}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                    )
                }
                const isActive = node.id === activeId
                return (
                    <li key={node.id}>
                        <a
                            href={`#help/${node.id}`}
                            data-tree-row=""
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'relative my-0.5 flex min-h-10 items-center rounded-lg px-2.5 py-2 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563eb]',
                                isActive
                                    ? 'bg-white font-semibold text-[#1d4ed8] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_6px_16px_-8px_rgba(37,99,235,0.35)] ring-1 ring-[#dbeafe]'
                                    : 'text-[#475569] hover:bg-[#eef2f7] hover:text-[#0f172a]',
                            )}
                            onClick={() => activate(node.id)}
                        >
                            {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#2563eb]" aria-hidden="true" />}
                            <Highlight text={node.label} tokens={tokens} />
                        </a>
                    </li>
                )
            })

    const activeNode = nodeById[activeId]
    const crumbs = ancestorsOf(activeId).map((id) => nodeById[id].label)
    const siblings = nodeById[parentOf[activeId]].children.filter((node) => !node.children)
    const readTime = readTimes[activeId.length % readTimes.length]
    const countLabel = filter ? `${filter.matches} of ${TOTAL} articles` : `${TOTAL} articles`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div ref={rootRef} className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                    <div>
                        <p className="text-sm font-semibold text-[#2563eb]">Helpbase Docs</p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0f172a] sm:text-5xl">
                            Type to narrow {TOTAL} articles down to the one you need.
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-[#475569] lg:justify-self-end">
                        Try “tag”, “invoice” or “auto”. Folders with matches open by themselves and every hit is
                        highlighted — clear the filter and your tree is exactly how you left it.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] lg:grid-cols-[340px_1fr]">
                    <aside className="border-b border-[#e2e8f0] bg-[#f8fafc] lg:border-b-0 lg:border-r">
                        <div className="border-b border-[#e2e8f0] p-4">
                            <label htmlFor={`${uid}-filter`} className="sr-only">
                                Filter articles
                            </label>
                            <div className="flex h-12 items-center gap-2.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 transition-shadow focus-within:border-[#2563eb] focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]">
                                <HiOutlineFunnel className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
                                <input
                                    ref={inputRef}
                                    id={`${uid}-filter`}
                                    type="search"
                                    autoComplete="off"
                                    aria-describedby={`${uid}-count`}
                                    placeholder="Filter articles…"
                                    value={query}
                                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                                    onChange={(event) => updateQuery(event.target.value)}
                                    onKeyDown={onInputKeyDown}
                                />
                                {query ? (
                                    <button
                                        type="button"
                                        aria-label="Clear filter"
                                        className="-mr-2 grid size-10 shrink-0 place-items-center rounded-lg text-[#64748b] hover:text-[#0f172a] focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                        onClick={() => {
                                            updateQuery('')
                                            inputRef.current?.focus()
                                        }}
                                    >
                                        <HiXMark className="size-4" aria-hidden="true" />
                                    </button>
                                ) : (
                                    <kbd className="hidden rounded border border-[#e2e8f0] px-1.5 font-sans text-xs text-[#64748b] sm:block">/</kbd>
                                )}
                            </div>
                            <p id={`${uid}-count`} aria-live="polite" className="mt-2.5 flex items-center justify-between px-1 text-xs text-[#64748b]">
                                <span>{countLabel}</span>
                                {filter && <span className="font-medium text-[#2563eb]">Esc to clear</span>}
                            </p>
                        </div>

                        <nav ref={navRef} aria-label="Helpbase articles" className="max-h-[420px] overflow-y-auto p-3 lg:max-h-[600px]" onKeyDown={onNavKeyDown}>
                            {filter && filter.matches === 0 ? (
                                <div className="px-3 py-10 text-center">
                                    <p className="text-sm font-semibold text-[#0f172a]">No articles match “{query.trim()}”</p>
                                    <p className="mt-1 text-sm text-[#64748b]">Check the spelling or use fewer words.</p>
                                    <div className="mt-4 flex flex-col items-center gap-2">
                                        <button
                                            type="button"
                                            className="min-h-10 rounded-lg bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                            onClick={() => {
                                                updateQuery('')
                                                inputRef.current?.focus()
                                            }}
                                        >
                                            Clear filter
                                        </button>
                                        <a
                                            href={`#help/search?q=${encodeURIComponent(query.trim())}`}
                                            className="inline-flex min-h-10 items-center text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                        >
                                            Search all of Helpbase instead
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <ul className="space-y-1">{renderNodes(tree, 1)}</ul>
                            )}
                        </nav>
                    </aside>

                    <div className="min-w-0 p-6 sm:p-10 lg:p-14">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.article
                                key={activeId}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                            >
                                <p className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748b]">
                                    {crumbs.map((crumb, i) => (
                                        <span key={crumb} className="flex items-center gap-1.5">
                                            {i > 0 && <HiChevronRight className="size-3.5 text-[#cbd5e1]" aria-hidden="true" />}
                                            {crumb}
                                        </span>
                                    ))}
                                </p>
                                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[#0f172a] sm:text-4xl">{activeNode.label}</h3>
                                <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#64748b]">
                                    <span className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 font-medium text-[#1d4ed8]">{readTime} min read</span>
                                    <span>Updated Sep 18, 2026 by the Helpbase Support team</span>
                                </p>
                                <div aria-hidden="true" className="mt-8 space-y-3">
                                    {['w-full', 'w-[95%]', 'w-[89%]', 'w-[64%]'].map((width) => (
                                        <span key={width} className={cn('block h-3 rounded-full bg-[#f1f5f9]', width)} />
                                    ))}
                                </div>
                                <div aria-hidden="true" className="mt-6 rounded-2xl border border-[#e2e8f0] bg-[linear-gradient(135deg,#eff6ff,#f8fafc_60%)] p-5">
                                    <span className="block h-3 w-1/4 rounded-full bg-[#bfdbfe]" />
                                    <span className="mt-4 block h-2.5 w-2/3 rounded-full bg-[#e2e8f0]" />
                                    <span className="mt-2 block h-2.5 w-1/2 rounded-full bg-[#e2e8f0]" />
                                    <span className="mt-5 flex flex-wrap gap-2">
                                        {['w-16', 'w-20', 'w-12'].map((width) => (
                                            <span key={width} className={cn('h-6 rounded-full border border-[#bfdbfe] bg-white', width)} />
                                        ))}
                                    </span>
                                </div>
                                <p className="sr-only">Article preview for {activeNode.label}.</p>
                            </motion.article>
                        </AnimatePresence>

                        {siblings.length > 1 && (
                            <div className="mt-10 border-t border-[#e2e8f0] pt-6">
                                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                                    In this section · {nodeById[parentOf[activeId]].label}
                                </h4>
                                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {siblings
                                        .filter((node) => node.id !== activeId)
                                        .map((node) => (
                                            <li key={node.id}>
                                                <a
                                                    href={`#help/${node.id}`}
                                                    className="flex min-h-11 items-center gap-2 rounded-xl border border-[#e2e8f0] px-3.5 text-sm font-medium text-[#334155] transition-colors hover:border-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                                    onClick={() => activate(node.id)}
                                                >
                                                    <span className="min-w-0 flex-1 truncate">{node.label}</span>
                                                    <HiChevronRight className="size-4 shrink-0 text-[#94a3b8]" aria-hidden="true" />
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FilterTreeDocsSidebar

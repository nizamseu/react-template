// NestedTreeDocsSidebar

// DocsSidebar01 · Knowledge Bases & Documentation › Hierarchical Sidebar (TOC)

// Description:
// A dark, three-level docs tree for the fictional Stackdocs platform inside a docs-app
// frame with a placeholder article. Under "Three levels deep. Never lost." it lists
// five sections (Getting started, Core concepts, Guides, API reference, CLI); the
// active page is highlighted and its parents stay open. Use it as the navigation shell
// of a large docs site.

// Design:
// - Ink #0b0b0f section; the app frame is #0f0f14 with a #101016 sidebar, white/8
//   hairlines and violet #8b5cf6 for the active bar, focus rings, dots and the "Expand
//   all" control
// - Tree rows are 40px min, indented 16px per level with vertical guide lines; chevrons
//   turn 90° when open; the current page gets a violet left bar and a violet/12 fill
// - Content pane: mono breadcrumb, semibold title text-2xl → sm:3xl, meta line,
//   skeleton paragraphs, a faux code block and prev / next page cards
// - Groups open and close with a framer-motion height animation; the article
//   cross-fades on page change (both instant with reduced motion)
// - lg: 300px sidebar + fluid content; below lg the tree sits on top in a 380px scroll
//   box

// What it does:
// - ARIA tree (navigation treeview pattern): role="tree"/"treeitem"/"group",
//   aria-level, aria-expanded on parents, aria-current="page" on the active link,
//   roving tabindex
// - Keys: ↑/↓ move, → opens or enters a group, ← closes or goes to the parent, Home/End
//   jump, Enter follows a page link or toggles a group, letters type-ahead to the next
//   match
// - Choosing a page (tree, prev/next) makes it active and re-opens all of its
//   ancestors; "Collapse all" keeps the current page's path open; a collapsed parent
//   that contains the current page shows a violet dot. Page links point to
//   #docs/<page-id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NestedTreeDocsSidebar from '@/TestComponent/PageSections/knowledge/DocsSidebar01';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <NestedTreeDocsSidebar />
//     </main>
// )
// ```

'use client'

import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowLeft,
    HiArrowRight,
    HiChevronRight,
    HiOutlineBookOpen,
    HiOutlineCodeBracket,
    HiOutlineCommandLine,
    HiOutlineCube,
    HiOutlineRocketLaunch,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tree = [
    {
        id: 'getting-started',
        label: 'Getting started',
        icon: HiOutlineRocketLaunch,
        children: [
            { id: 'introduction', label: 'Introduction' },
            { id: 'quickstart', label: 'Quickstart' },
            {
                id: 'installation',
                label: 'Installation',
                children: [
                    { id: 'install-macos', label: 'macOS & Linux' },
                    { id: 'install-windows', label: 'Windows (WSL)' },
                    { id: 'install-docker', label: 'Docker image' },
                ],
            },
        ],
    },
    {
        id: 'core-concepts',
        label: 'Core concepts',
        icon: HiOutlineCube,
        children: [
            { id: 'projects', label: 'Projects & environments' },
            {
                id: 'deployments',
                label: 'Deployments',
                children: [
                    { id: 'build-pipeline', label: 'Build pipeline' },
                    { id: 'preview-deploys', label: 'Preview deployments' },
                    { id: 'rollbacks', label: 'Promotions & rollbacks' },
                ],
            },
            {
                id: 'routing',
                label: 'Routing',
                children: [
                    { id: 'file-routes', label: 'File-based routes' },
                    { id: 'middleware', label: 'Middleware' },
                    { id: 'redirects', label: 'Redirects & rewrites' },
                ],
            },
        ],
    },
    {
        id: 'guides',
        label: 'Guides',
        icon: HiOutlineBookOpen,
        children: [
            { id: 'custom-domains', label: 'Custom domains' },
            {
                id: 'edge-caching',
                label: 'Edge caching',
                children: [
                    { id: 'cache-control', label: 'Cache-Control headers' },
                    { id: 'revalidation', label: 'On-demand revalidation' },
                    { id: 'purge-tags', label: 'Purging by tag' },
                ],
            },
            { id: 'env-vars', label: 'Environment variables' },
            { id: 'monorepos', label: 'Monorepos' },
        ],
    },
    {
        id: 'api-reference',
        label: 'API reference',
        icon: HiOutlineCodeBracket,
        children: [
            {
                id: 'rest-api',
                label: 'REST API',
                children: [
                    { id: 'api-auth', label: 'Authentication' },
                    { id: 'api-deployments', label: 'Deployments' },
                    { id: 'api-domains', label: 'Domains' },
                    { id: 'api-rate-limits', label: 'Rate limits' },
                ],
            },
            {
                id: 'sdk',
                label: 'SDK',
                children: [
                    { id: 'sdk-deploy', label: 'stack.deploy()' },
                    { id: 'sdk-env', label: 'stack.env()' },
                ],
            },
            { id: 'webhooks', label: 'Webhooks' },
        ],
    },
    {
        id: 'cli',
        label: 'CLI',
        icon: HiOutlineCommandLine,
        children: [
            { id: 'cli-deploy', label: 'stack deploy' },
            { id: 'cli-env', label: 'stack env' },
            { id: 'cli-logs', label: 'stack logs' },
        ],
    },
]

const nodeById = {}
const parentOf = {}
const leafIds = []
const walk = (nodes, parent) => {
    for (const node of nodes) {
        nodeById[node.id] = node
        parentOf[node.id] = parent
        if (node.children) walk(node.children, node.id)
        else leafIds.push(node.id)
    }
}
walk(tree, null)

const ancestorsOf = (id) => {
    const list = []
    for (let parent = parentOf[id]; parent; parent = parentOf[parent]) list.unshift(parent)
    return list
}

const allParentIds = Object.keys(nodeById).filter((id) => nodeById[id].children)
const updatedDates = ['Sep 21, 2026', 'Sep 12, 2026', 'Aug 30, 2026', 'Sep 03, 2026', 'Jul 27, 2026']
const INITIAL_ACTIVE = 'revalidation'

export function NestedTreeDocsSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const itemRefs = useRef({})
    const [activeId, setActiveId] = useState(INITIAL_ACTIVE)
    const [expanded, setExpanded] = useState(() => new Set(ancestorsOf(INITIAL_ACTIVE)))
    const [focusedId, setFocusedId] = useState(INITIAL_ACTIVE)

    const visible = useMemo(() => {
        const list = []
        const collect = (nodes, level) => {
            for (const node of nodes) {
                list.push({ id: node.id, level })
                if (node.children && expanded.has(node.id)) collect(node.children, level + 1)
            }
        }
        collect(tree, 1)
        return list
    }, [expanded])

    const visibleIds = useMemo(() => new Set(visible.map((entry) => entry.id)), [visible])
    let rovingId = focusedId
    while (rovingId && !visibleIds.has(rovingId)) rovingId = parentOf[rovingId]
    if (!rovingId) rovingId = visible[0].id

    const activeAncestors = ancestorsOf(activeId)
    const allOpen = allParentIds.every((id) => expanded.has(id))

    const focusItem = (id) => {
        if (!id) return
        setFocusedId(id)
        itemRefs.current[id]?.focus()
    }

    const setOpen = (id, open) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (open) next.add(id)
            else next.delete(id)
            return next
        })
    }

    const activate = (id) => {
        setActiveId(id)
        setFocusedId(id)
        setExpanded((prev) => new Set([...prev, ...ancestorsOf(id)]))
    }

    const toggleAll = () => {
        if (allOpen) {
            setExpanded(new Set(activeAncestors))
            setFocusedId(activeId)
        } else {
            setExpanded(new Set(allParentIds))
        }
    }

    const onTreeKeyDown = (event) => {
        const index = visible.findIndex((entry) => entry.id === rovingId)
        const node = nodeById[rovingId]
        const isOpen = expanded.has(rovingId)
        let handled = true
        if (event.key === 'ArrowDown') focusItem(visible[index + 1]?.id)
        else if (event.key === 'ArrowUp') focusItem(visible[index - 1]?.id)
        else if (event.key === 'Home') focusItem(visible[0].id)
        else if (event.key === 'End') focusItem(visible[visible.length - 1].id)
        else if (event.key === 'ArrowRight') {
            if (node.children && !isOpen) setOpen(rovingId, true)
            else if (node.children) focusItem(node.children[0].id)
        } else if (event.key === 'ArrowLeft') {
            if (node.children && isOpen) setOpen(rovingId, false)
            else focusItem(parentOf[rovingId])
        } else if (event.key.length === 1 && /\S/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
            const char = event.key.toLowerCase()
            const ordered = [...visible.slice(index + 1), ...visible.slice(0, index + 1)]
            const match = ordered.find((entry) => nodeById[entry.id].label.toLowerCase().startsWith(char))
            if (match) focusItem(match.id)
        } else handled = false
        if (handled) event.preventDefault()
    }

    const renderNodes = (nodes, level) =>
        nodes.map((node) => {
            const isParent = Boolean(node.children)
            const isOpen = expanded.has(node.id)
            const isActive = node.id === activeId
            const onPath = activeAncestors.includes(node.id)
            const Icon = node.icon
            const groupId = `${uid}-group-${node.id}`
            const common = {
                ref: (el) => {
                    itemRefs.current[node.id] = el
                },
                role: 'treeitem',
                'aria-level': level,
                tabIndex: node.id === rovingId ? 0 : -1,
                onFocus: () => setFocusedId(node.id),
                style: { paddingLeft: `${12 + (level - 1) * 16}px` },
            }
            const rowClass = cn(
                'relative flex min-h-10 w-full items-center gap-2 rounded-lg pr-3 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#8b5cf6]',
                level === 1 ? 'font-semibold' : 'font-normal',
            )
            return (
                <li key={node.id} role="none">
                    {isParent ? (
                        <button
                            type="button"
                            {...common}
                            aria-expanded={isOpen}
                            aria-owns={isOpen ? groupId : undefined}
                            className={cn(
                                rowClass,
                                onPath || level === 1 ? 'text-[#ededf2]' : 'text-[#a1a1b5]',
                                'hover:bg-white/[0.04] hover:text-[#ededf2]',
                            )}
                            onClick={() => {
                                setFocusedId(node.id)
                                setOpen(node.id, !isOpen)
                            }}
                        >
                            <HiChevronRight
                                className={cn(
                                    'size-3.5 shrink-0 text-[#6f6d7e] transition-transform duration-200',
                                    isOpen && 'rotate-90 text-[#c4b5fd]',
                                )}
                                aria-hidden="true"
                            />
                            {Icon && <Icon className="size-4 shrink-0 text-[#8b5cf6]" aria-hidden="true" />}
                            <span className="min-w-0 flex-1 truncate">{node.label}</span>
                            {onPath && !isOpen && (
                                <span className="size-1.5 shrink-0 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_#8b5cf6]" aria-hidden="true" />
                            )}
                            {onPath && !isOpen && <span className="sr-only">(contains current page)</span>}
                        </button>
                    ) : (
                        <a
                            href={`#docs/${node.id}`}
                            {...common}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                rowClass,
                                isActive
                                    ? 'bg-[#8b5cf6]/[0.12] font-medium text-[#f5f3ff]'
                                    : 'text-[#a1a1b5] hover:bg-white/[0.04] hover:text-[#ededf2]',
                            )}
                            onClick={() => activate(node.id)}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'absolute inset-y-2 left-0 w-0.5 rounded-full',
                                    isActive ? 'bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6]' : 'bg-transparent',
                                )}
                            />
                            <span aria-hidden="true" className="grid w-3.5 shrink-0 place-items-center">
                                <span className={cn('size-1 rounded-full', isActive ? 'bg-[#c4b5fd]' : 'bg-[#3f3d4d]')} />
                            </span>
                            <span
                                className={cn(
                                    'min-w-0 flex-1 truncate',
                                    (node.label.includes('()') || node.label.startsWith('stack ')) && 'font-mono text-[13px]',
                                )}
                            >
                                {node.label}
                            </span>
                        </a>
                    )}
                    {isParent && (
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.ul
                                    key="group"
                                    id={groupId}
                                    role="group"
                                    initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                    animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative overflow-hidden"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute bottom-1 top-1 w-px bg-white/[0.08]"
                                        style={{ left: `${18 + (level - 1) * 16}px` }}
                                    />
                                    {renderNodes(node.children, level + 1)}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    )}
                </li>
            )
        })

    const activeNode = nodeById[activeId]
    const crumbs = [...activeAncestors.map((id) => nodeById[id].label), activeNode.label]
    const leafIndex = leafIds.indexOf(activeId)
    const prevId = leafIds[leafIndex - 1]
    const nextId = leafIds[leafIndex + 1]
    const minutes = 3 + ((leafIndex * 5) % 8)
    const sectionLabel = nodeById[activeAncestors[0]]?.label

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-[#0b0b0f] px-4 py-16 text-base font-normal text-[#ededf2] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-10 -z-10 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_65%)] blur-2xl"
            />
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#a1a1b5]">
                            <span className="text-[#8b5cf6]">◆</span> Stackdocs / Navigation
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#ededf2] sm:text-5xl">
                            Three levels deep. <span className="text-[#a78bfa]">Never lost.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#a1a1b5]">
                        212 pages in five sections. The tree remembers what you opened and always keeps the
                        path to your current page in view.
                    </p>
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f14] shadow-[0_40px_120px_-50px_rgba(139,92,246,0.5)]">
                    <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
                        <span className="grid size-7 place-items-center rounded-md bg-[#8b5cf6] text-xs font-bold text-white" aria-hidden="true">
                            S
                        </span>
                        <span className="text-sm font-semibold text-[#ededf2]">Stackdocs</span>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-[#a1a1b5]">v4.2</span>
                        <span className="ml-auto hidden truncate font-mono text-xs text-[#6f6d7e] sm:block">
                            docs.stack.app/{activeAncestors.join('/')}/{activeId}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
                        <nav aria-label="Stackdocs documentation" className="border-b border-white/[0.08] bg-[#101016] lg:border-b-0 lg:border-r">
                            <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6f6d7e]">Contents</p>
                                <button
                                    type="button"
                                    aria-label={allOpen ? 'Collapse all except the current page' : 'Expand all sections'}
                                    className="min-h-10 rounded-lg px-2.5 font-mono text-[11px] text-[#c4b5fd] hover:bg-[#8b5cf6]/10 focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                    onClick={toggleAll}
                                >
                                    {allOpen ? 'Collapse all' : 'Expand all'}
                                </button>
                            </div>
                            <ul
                                role="tree"
                                aria-label="Documentation pages"
                                className="max-h-[380px] space-y-0.5 overflow-y-auto px-2 pb-4 lg:max-h-[640px]"
                                onKeyDown={onTreeKeyDown}
                            >
                                {renderNodes(tree, 1)}
                            </ul>
                        </nav>

                        <div className="min-w-0 px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.article
                                    key={activeId}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                >
                                    <p className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-[#8a889b]">
                                        {crumbs.map((crumb, index) => (
                                            <span key={crumb} className="flex items-center gap-1.5">
                                                {index > 0 && <HiChevronRight className="size-3" aria-hidden="true" />}
                                                <span className={index === crumbs.length - 1 ? 'text-[#c4b5fd]' : undefined}>{crumb}</span>
                                            </span>
                                        ))}
                                    </p>
                                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#ededf2] sm:text-3xl">{activeNode.label}</h3>
                                    <p className="mt-3 text-sm text-[#a1a1b5]">
                                        {sectionLabel} · {minutes} min read · Updated {updatedDates[leafIndex % updatedDates.length]}
                                    </p>

                                    <div aria-hidden="true" className="mt-8 space-y-3">
                                        {['w-full', 'w-[94%]', 'w-[88%]', 'w-[60%]'].map((width) => (
                                            <span key={width} className={cn('block h-3 rounded-full bg-white/[0.07]', width)} />
                                        ))}
                                    </div>
                                    <div aria-hidden="true" className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0f] p-4 font-mono text-[13px] leading-6">
                                        <span className="block text-[#6f6d7e]">{'// '}{activeNode.label.toLowerCase()}</span>
                                        <span className="block">
                                            <span className="text-[#c4b5fd]">import</span> <span className="text-[#ededf2]">{'{ stack }'}</span>{' '}
                                            <span className="text-[#c4b5fd]">from</span> <span className="text-[#86efac]">&apos;@stack/sdk&apos;</span>
                                        </span>
                                        <span className="mt-1 block h-3 w-2/3 rounded-full bg-white/[0.06]" />
                                        <span className="mt-2 block h-3 w-1/2 rounded-full bg-white/[0.06]" />
                                    </div>
                                    <div aria-hidden="true" className="mt-8 space-y-3">
                                        {['w-[97%]', 'w-[91%]', 'w-[72%]'].map((width) => (
                                            <span key={width} className={cn('block h-3 rounded-full bg-white/[0.07]', width)} />
                                        ))}
                                    </div>
                                    <p className="sr-only">Placeholder content for {activeNode.label}.</p>
                                </motion.article>
                            </AnimatePresence>

                            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    ['prev', prevId, 'Previous'],
                                    ['next', nextId, 'Next'],
                                ].map(([dir, id, label]) =>
                                    id ? (
                                        <a
                                            key={dir}
                                            href={`#docs/${id}`}
                                            className={cn(
                                                'group flex min-h-16 flex-col justify-center rounded-xl border border-white/[0.08] px-4 py-3 transition-colors hover:border-[#8b5cf6]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]',
                                                dir === 'next' && 'sm:col-start-2 sm:items-end sm:text-right',
                                            )}
                                            onClick={() => activate(id)}
                                        >
                                            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a889b]">
                                                {dir === 'prev' && <HiArrowLeft className="size-3.5" aria-hidden="true" />}
                                                {label}
                                                {dir === 'next' && <HiArrowRight className="size-3.5" aria-hidden="true" />}
                                            </span>
                                            <span className="mt-1 text-sm font-medium text-[#ededf2] group-hover:text-[#c4b5fd]">
                                                {nodeById[id].label}
                                            </span>
                                        </a>
                                    ) : null,
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NestedTreeDocsSidebar

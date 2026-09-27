// MobileDrawerDocsSidebar

// DocsSidebar05 · Knowledge Bases & Documentation › Hierarchical Sidebar (TOC)

// Description:
// A responsive wiki shell for the fictional Orbit Wiki. On large screens a persistent
// sidebar lists four spaces with collapsible folders; on smaller screens it hides
// behind a "Menu" button and slides in as a drawer. Headed "Big-screen sidebar.
// Pocket-sized drawer." with a wiki article beside it. Use it for internal wikis and
// handbooks read on phones.

// Design:
// - Zinc #f4f4f5 section, white frame (rounded-[28px], #e4e4e7 ring), ink #18181b text,
//   zinc #52525b copy; orange #ea580c for the active page pill, focus rings, space dots
//   and CTA
// - Heavy sans heading text-4xl → sm:5xl → lg:6xl with tight tracking; sidebar rows
//   40px with chevrons; active page gets #fff7ed fill, orange text and a 3px orange bar
// - Drawer: 86vw (max 360px) white panel with a zinc/60 blurred backdrop, slides in
//   from the left with framer-motion (fade only for reduced motion); folders animate
//   their height
// - Below lg: top bar with Menu button + breadcrumb, article full width; lg: 290px
//   sidebar beside the article and the Menu button disappears

// What it does:
// - "Menu" (aria-expanded, aria-controls) opens a modal drawer (role="dialog",
//   aria-modal): focus moves to its close button, Tab/Shift+Tab stay inside, Escape or
//   the backdrop close it and focus returns to "Menu"; body scroll is locked while it
//   is open
// - The drawer also closes after choosing a page and when the viewport grows to lg
// - Folders are disclosure buttons (aria-expanded + aria-controls, unique ids for the
//   sidebar and drawer copies); choosing a page re-opens its parents and sets
//   aria-current="page"
// - Page links point to #wiki/<page-id>; "Edit page" links to #wiki/<page-id>/edit

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MobileDrawerDocsSidebar from '@/TestComponent/PageSections/knowledge/DocsSidebar05';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <MobileDrawerDocsSidebar />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiBars3, HiChevronRight, HiOutlinePencilSquare, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const spaces = [
    {
        id: 'handbook',
        label: 'Handbook',
        dot: 'bg-[#ea580c]',
        children: [
            { id: 'welcome', label: 'Welcome to Orbit' },
            {
                id: 'rituals',
                label: 'Values & rituals',
                children: [
                    { id: 'no-meeting', label: 'Meeting-free Wednesdays' },
                    { id: 'demo-fridays', label: 'Demo Fridays' },
                    { id: 'writing', label: 'Our writing culture' },
                ],
            },
            {
                id: 'time-off',
                label: 'Time off',
                children: [
                    { id: 'holiday-emea', label: 'Holiday calendar — EMEA' },
                    { id: 'holiday-amer', label: 'Holiday calendar — Americas' },
                    { id: 'parental-leave', label: 'Parental leave' },
                ],
            },
        ],
    },
    {
        id: 'engineering',
        label: 'Engineering',
        dot: 'bg-[#18181b]',
        children: [
            {
                id: 'on-call',
                label: 'On-call',
                children: [
                    { id: 'rotation', label: 'Rotation handbook' },
                    { id: 'escalation', label: 'Escalation matrix' },
                    { id: 'retros', label: 'Incident retros' },
                ],
            },
            { id: 'release-train', label: 'Release train schedule' },
            { id: 'code-review', label: 'Code review guidelines' },
        ],
    },
    {
        id: 'operations',
        label: 'Operations',
        dot: 'bg-[#fdba74]',
        children: [
            { id: 'expenses', label: 'Expense policy 2026' },
            {
                id: 'travel',
                label: 'Travel',
                children: [
                    { id: 'booking', label: 'Booking business travel' },
                    { id: 'per-diem', label: 'Per-diem rates 2026' },
                ],
            },
            { id: 'wifi', label: 'Office Wi-Fi & guest access' },
        ],
    },
    {
        id: 'design',
        label: 'Design',
        dot: 'bg-[#a1a1aa]',
        children: [
            { id: 'brand', label: 'Brand guidelines v5' },
            { id: 'design-review', label: 'Design review process' },
        ],
    },
]

const summaries = {
    rotation:
        'Every engineer joins the rotation after their sixth week. Shifts run Monday 10:00 to Monday 10:00 CET, with a primary and a secondary, and a paid day off after any night with more than two pages.',
    escalation: 'Who to wake up, in what order, for Sev-1 to Sev-4 incidents — with phone numbers kept in the pager app, not here.',
    retros: 'Blameless retros within five working days of any Sev-1 or Sev-2, written in the shared template and read aloud on Demo Friday.',
    'holiday-emea': 'Public holidays for Lisbon, Berlin and Dublin in 2026, plus the company-wide winter break from Dec 24 to Jan 1.',
    expenses: 'Spend like it is your own money: up to €60 without approval, receipts within 30 days, and no alcohol on the company card.',
}

const ownerBySpace = {
    handbook: ['MB', 'Marta Borges', 'People Partner'],
    engineering: ['PN', 'Priya Nair', 'Engineering Manager'],
    operations: ['TO', 'Tomás Oliveira', 'Head of Operations'],
    design: ['LK', 'Lea Krüger', 'Design Director'],
}

const nodeById = {}
const parentOf = {}
const indexTree = (nodes, parent) => {
    for (const node of nodes) {
        nodeById[node.id] = node
        parentOf[node.id] = parent
        if (node.children) indexTree(node.children, node.id)
    }
}
indexTree(spaces, null)

const ancestorsOf = (id) => {
    const list = []
    for (let parent = parentOf[id]; parent; parent = parentOf[parent]) list.unshift(parent)
    return list
}

const INITIAL_PAGE = 'rotation'

function WikiTree({ idPrefix, activeId, expanded, onToggle, onSelect, reduceMotion }) {
    const renderNodes = (nodes, level) =>
        nodes.map((node) => {
            if (!node.children) {
                const isActive = node.id === activeId
                return (
                    <li key={node.id}>
                        <a
                            href={`#wiki/${node.id}`}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'relative flex min-h-10 items-center rounded-xl py-2 pl-4 pr-3 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]',
                                isActive ? 'bg-[#fff7ed] font-semibold text-[#c2410c]' : 'text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                            )}
                            onClick={() => onSelect(node.id)}
                        >
                            <span
                                aria-hidden="true"
                                className={cn('absolute inset-y-2 left-1 w-[3px] rounded-full', isActive ? 'bg-[#ea580c]' : 'bg-transparent')}
                            />
                            {node.label}
                        </a>
                    </li>
                )
            }
            const isOpen = expanded.has(node.id)
            const panelId = `${idPrefix}-${node.id}`
            const holdsActive = ancestorsOf(activeId).includes(node.id)
            return (
                <li key={node.id} className={cn(level === 1 && 'pt-2 first:pt-0')}>
                    <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className={cn(
                            'flex min-h-10 w-full items-center gap-2 rounded-xl px-2 text-left transition-colors hover:bg-[#f4f4f5] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]',
                            level === 1 ? 'text-sm font-bold text-[#18181b]' : 'text-sm font-medium text-[#27272a]',
                        )}
                        onClick={() => onToggle(node.id)}
                    >
                        <HiChevronRight
                            className={cn('size-4 shrink-0 text-[#a1a1aa] transition-transform duration-200', isOpen && 'rotate-90 text-[#ea580c]')}
                            aria-hidden="true"
                        />
                        {node.dot && <span className={cn('size-2.5 shrink-0 rounded-full', node.dot)} aria-hidden="true" />}
                        <span className="min-w-0 flex-1 truncate">{node.label}</span>
                        {holdsActive && !isOpen && <span className="size-1.5 shrink-0 rounded-full bg-[#ea580c]" aria-hidden="true" />}
                    </button>
                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.ul
                                id={panelId}
                                initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                                exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                className="ml-[15px] overflow-hidden border-l border-[#e4e4e7] pl-2"
                            >
                                {renderNodes(node.children, level + 1)}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </li>
            )
        })
    return <ul className="space-y-0.5">{renderNodes(spaces, 1)}</ul>
}

export function MobileDrawerDocsSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const menuRef = useRef(null)
    const panelRef = useRef(null)
    const closeRef = useRef(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [activeId, setActiveId] = useState(INITIAL_PAGE)
    const [expanded, setExpanded] = useState(() => new Set(['handbook', 'engineering', ...ancestorsOf(INITIAL_PAGE)]))

    const drawerId = `${uid}-drawer`

    useEffect(() => {
        if (!drawerOpen) return undefined
        const menuButton = menuRef.current
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const frame = requestAnimationFrame(() => closeRef.current?.focus())
        const media = window.matchMedia('(min-width: 1024px)')
        const onChange = (event) => {
            if (event.matches) setDrawerOpen(false)
        }
        media.addEventListener('change', onChange)
        return () => {
            cancelAnimationFrame(frame)
            document.body.style.overflow = previous
            media.removeEventListener('change', onChange)
            if (menuButton && window.getComputedStyle(menuButton).display !== 'none') menuButton.focus({ preventScroll: true })
        }
    }, [drawerOpen])

    const toggle = (id) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const select = (id) => {
        setActiveId(id)
        setExpanded((prev) => new Set([...prev, ...ancestorsOf(id)]))
        setDrawerOpen(false)
    }

    const onPanelKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            setDrawerOpen(false)
            return
        }
        if (event.key !== 'Tab' || !panelRef.current) return
        const focusables = [...panelRef.current.querySelectorAll('a[href], button:not([disabled])')]
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    const activeNode = nodeById[activeId]
    const trail = ancestorsOf(activeId).map((id) => nodeById[id])
    const space = trail[0]
    const [initials, owner, role] = ownerBySpace[space.id]
    const summary =
        summaries[activeId] ||
        `${activeNode.label} lives in the ${space.label} space. This page is maintained by ${owner} and reviewed every quarter; comments and suggested edits go straight to the owner.`

    const treeProps = { activeId, expanded, onToggle: toggle, onSelect: select, reduceMotion }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f4f4f5] px-4 py-16 text-base font-normal text-[#18181b] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#18181b] ring-1 ring-[#e4e4e7]">
                            <span className="size-2 rounded-full bg-[#ea580c]" aria-hidden="true" />
                            Orbit Wiki · Navigation
                        </p>
                        <h2 className="mt-5 text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#18181b] sm:text-5xl lg:text-6xl">
                            Big-screen sidebar. <span className="text-[#ea580c]">Pocket-sized drawer.</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-[#52525b] lg:justify-self-end">
                        On a laptop the whole wiki tree stays pinned on the left. On a phone it tucks behind
                        one Menu button and slides in when you need it.
                    </p>
                </div>

                <div className="mt-10 overflow-hidden rounded-[28px] bg-white shadow-[0_30px_70px_-40px_rgba(24,24,27,0.35)] ring-1 ring-[#e4e4e7]">
                    <div className="flex min-h-16 items-center gap-3 border-b border-[#e4e4e7] px-3 sm:px-5">
                        <button
                            ref={menuRef}
                            type="button"
                            aria-expanded={drawerOpen}
                            aria-controls={drawerId}
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#18181b] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#27272a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c] lg:hidden"
                            onClick={() => setDrawerOpen(true)}
                        >
                            <HiBars3 className="size-5" aria-hidden="true" />
                            Menu
                        </button>
                        <span className="hidden items-center gap-2.5 lg:flex">
                            <span aria-hidden="true" className="relative grid size-8 place-items-center">
                                <span className="absolute inset-0 rounded-full border-2 border-[#ea580c]/30" />
                                <span className="size-3 rounded-full bg-[#ea580c]" />
                            </span>
                            <span className="text-sm font-extrabold tracking-tight text-[#18181b]">Orbit Wiki</span>
                        </span>
                        <p className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-sm text-[#71717a] lg:ml-2 lg:border-l lg:border-[#e4e4e7] lg:pl-5">
                            {trail.map((node) => (
                                <span key={node.id} className="hidden shrink-0 items-center gap-1.5 sm:flex">
                                    {node.label}
                                    <HiChevronRight className="size-3.5 text-[#d4d4d8]" aria-hidden="true" />
                                </span>
                            ))}
                            <span className="truncate font-semibold text-[#18181b]">{activeNode.label}</span>
                        </p>
                        <a
                            href={`#wiki/${activeId}/edit`}
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#ea580c] hover:bg-[#fff7ed] focus-visible:outline-2 focus-visible:outline-[#ea580c]"
                        >
                            <HiOutlinePencilSquare className="size-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Edit page</span>
                            <span className="sr-only sm:hidden">Edit page</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr]">
                        <aside className="hidden border-r border-[#e4e4e7] bg-[#fafafa] lg:block">
                            <nav aria-label="Orbit Wiki pages" className="max-h-[680px] overflow-y-auto p-4">
                                <WikiTree idPrefix={`${uid}-side`} {...treeProps} />
                            </nav>
                        </aside>

                        <div className="min-w-0 px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.article
                                    key={activeId}
                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                    className="max-w-2xl"
                                >
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c]">{space.label}</p>
                                    <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#18181b] sm:text-4xl">
                                        {activeNode.label}
                                    </h3>
                                    <div className="mt-5 flex items-center gap-3">
                                        <span
                                            aria-hidden="true"
                                            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#18181b] text-xs font-bold text-white"
                                        >
                                            {initials}
                                        </span>
                                        <p className="text-sm leading-snug text-[#52525b]">
                                            <span className="font-semibold text-[#18181b]">{owner}</span> · {role}
                                            <span className="block text-xs text-[#71717a]">Last edited Sep 19, 2026 · 6 min read</span>
                                        </p>
                                    </div>
                                    <p className="mt-8 text-base leading-relaxed text-[#3f3f46] sm:text-lg">{summary}</p>
                                    <div aria-hidden="true" className="mt-8 space-y-3">
                                        {['w-full', 'w-[93%]', 'w-[81%]', 'w-[58%]'].map((width) => (
                                            <span key={width} className={cn('block h-3 rounded-full bg-[#f4f4f5]', width)} />
                                        ))}
                                    </div>
                                    <div aria-hidden="true" className="mt-8 rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-5">
                                        <span className="block h-3 w-1/3 rounded-full bg-[#fdba74]" />
                                        <span className="mt-3 block h-2.5 w-5/6 rounded-full bg-[#ffedd5]" />
                                        <span className="mt-2 block h-2.5 w-2/3 rounded-full bg-[#ffedd5]" />
                                    </div>
                                </motion.article>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {drawerOpen && (
                    <motion.div
                        key="drawer"
                        className="fixed inset-0 z-[80] lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div aria-hidden="true" className="absolute inset-0 bg-[#18181b]/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                        <motion.div
                            ref={panelRef}
                            id={drawerId}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${uid}-drawer-title`}
                            initial={reduceMotion ? { opacity: 0 } : { x: '-100%' }}
                            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { x: '-100%' }}
                            transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 38 }}
                            className="absolute inset-y-0 left-0 flex w-[86vw] max-w-[360px] flex-col bg-white shadow-[24px_0_60px_-20px_rgba(24,24,27,0.45)]"
                            onKeyDown={onPanelKeyDown}
                        >
                            <div className="flex min-h-16 items-center gap-3 border-b border-[#e4e4e7] px-4">
                                <span aria-hidden="true" className="relative grid size-8 place-items-center">
                                    <span className="absolute inset-0 rounded-full border-2 border-[#ea580c]/30" />
                                    <span className="size-3 rounded-full bg-[#ea580c]" />
                                </span>
                                <h3 id={`${uid}-drawer-title`} className="flex-1 text-base font-extrabold tracking-tight text-[#18181b]">
                                    Orbit Wiki
                                </h3>
                                <button
                                    ref={closeRef}
                                    type="button"
                                    aria-label="Close menu"
                                    className="grid size-11 place-items-center rounded-xl text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:outline-2 focus-visible:outline-[#ea580c]"
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    <HiXMark className="size-6" aria-hidden="true" />
                                </button>
                            </div>
                            <nav aria-label="Orbit Wiki pages" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
                                <WikiTree idPrefix={`${uid}-drawer`} {...treeProps} />
                            </nav>
                            <p className="border-t border-[#e4e4e7] px-5 py-4 text-xs text-[#71717a]">1,051 pages · 4 spaces · Esc to close</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default MobileDrawerDocsSidebar

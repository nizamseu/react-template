// SearchableDirectoryIntegrationsGrid

// IntegrationsGrid02 · SaaS Platforms › Integrations Grid

// Description:
// A clean, filterable app directory for the fictional webhook platform Hookline. Under
// "Hook into the tools you already run." a search field and category tabs (All, Messaging,
// CRM, Developer, Commerce, Data) filter 19 cards for fictional apps such as Chatwise,
// Paylane and Codebase Hub, each with a one-liner, trigger/action counts and a "Popular"
// badge where earned.
// A friendly empty state offers "Clear filters" and "Request an integration".

// Design:
// - White section, ink #0f172a, slate #64748b body text, emerald #10b981 accents on the
//   search focus ring, active tab underline, badges and links; a pale #ecfdf5 wash behind
//   the header with a dotted hook-line SVG flourish
// - Search: rounded-2xl input (min-h-14) with a leading icon and a clear button; tabs are
//   text buttons with count pills and an emerald underline that glides via layoutId
// - Cards: rounded-2xl, 1px slate-200 border, white; a white generic (lucide) icon on a
//   tile in the app's colour; hover lifts 2px with an emerald border; layout motion in/out
// - Empty state: dashed emerald panel with an SVG broken-link drawing and two actions
// - Responsive: tabs scroll sideways inside their row on narrow screens; grid 1 → sm:2 →
//   lg:3 columns; header stacks on mobile and splits on md

// What it does:
// - query state filters by name, one-liner or category (case-insensitive); Escape in the
//   field or the × button clears it
// - category state is set by role="tab" buttons (aria-selected, roving tabindex, Arrow /
//   Home / End keys); tab counts reflect the current search
// - An aria-live line reports the result count; "Clear filters" resets both; cards link to
//   #hookline-<app>, "Request an integration" to #hookline-request

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SearchableDirectoryIntegrationsGrid from '@/TestComponent/PageSections/saas/IntegrationsGrid02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <SearchableDirectoryIntegrationsGrid />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import {
    LuBug,
    LuContact,
    LuCreditCard,
    LuDatabase,
    LuGitBranch,
    LuGitMerge,
    LuHandshake,
    LuHash,
    LuHeadphones,
    LuMessagesSquare,
    LuPhone,
    LuRocket,
    LuServer,
    LuSheet,
    LuShoppingCart,
    LuSmartphone,
    LuStore,
    LuTable2,
    LuWallet,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'crm', label: 'CRM' },
    { id: 'developer', label: 'Developer' },
    { id: 'commerce', label: 'Commerce' },
    { id: 'data', label: 'Data' },
]

const integrations = [
    { id: 'chatwise', name: 'Chatwise', icon: LuMessagesSquare, color: '#6366f1', category: 'messaging', popular: true, triggers: 6, actions: 9, blurb: 'Post formatted alerts to any channel the moment an event fires.' },
    { id: 'pingroom', name: 'Pingroom', icon: LuHash, color: '#8b5cf6', category: 'messaging', triggers: 4, actions: 5, blurb: 'Route bot messages and moderation events to the right room.' },
    { id: 'textlark', name: 'Textlark', icon: LuSmartphone, color: '#0ea5e9', category: 'messaging', triggers: 2, actions: 4, blurb: 'Fire an SMS when a high-priority webhook fails three times.' },
    { id: 'ringpost', name: 'Ringpost', icon: LuPhone, color: '#f43f5e', category: 'messaging', triggers: 5, actions: 6, blurb: 'Ring the on-call phone when an endpoint stays down.' },
    { id: 'dealwell', name: 'Dealwell', icon: LuHandshake, color: '#f97316', category: 'crm', popular: true, triggers: 11, actions: 14, blurb: 'Create contacts and deals from any form or checkout payload.' },
    { id: 'clientloop', name: 'Clientloop', icon: LuContact, color: '#0284c7', category: 'crm', triggers: 9, actions: 12, blurb: 'Upsert leads and log activity against the right account.' },
    { id: 'driftdesk', name: 'Driftdesk', icon: LuHeadphones, color: '#0891b2', category: 'crm', triggers: 7, actions: 5, blurb: 'Open a conversation when a customer hits a billing error.' },
    { id: 'codebase-hub', name: 'Codebase Hub', icon: LuGitBranch, color: '#1f2937', category: 'developer', popular: true, triggers: 18, actions: 7, blurb: 'Fan out push, pull request and release events to any endpoint.' },
    { id: 'mergebox', name: 'Mergebox', icon: LuGitMerge, color: '#ea580c', category: 'developer', triggers: 12, actions: 6, blurb: 'Relay pipeline status to chat, dashboards and status pages.' },
    { id: 'bugnest', name: 'Bugnest', icon: LuBug, color: '#7c3aed', category: 'developer', triggers: 5, actions: 3, blurb: 'Turn new issues into routed, de-duplicated incident alerts.' },
    { id: 'shipdeck', name: 'Shipdeck', icon: LuRocket, color: '#334155', category: 'developer', triggers: 4, actions: 2, blurb: 'Kick off smoke tests the second a deployment goes live.' },
    { id: 'paylane', name: 'Paylane', icon: LuCreditCard, color: '#4f46e5', category: 'commerce', popular: true, triggers: 24, actions: 8, blurb: 'Verify signatures and replay failed payment events safely.' },
    { id: 'coinpost', name: 'Coinpost', icon: LuWallet, color: '#1d4ed8', category: 'commerce', triggers: 10, actions: 4, blurb: 'Normalise payout and refund payloads into one clean schema.' },
    { id: 'tillhouse', name: 'Tillhouse', icon: LuStore, color: '#65a30d', category: 'commerce', triggers: 16, actions: 9, blurb: 'Stream orders and fulfilment updates to your warehouse.' },
    { id: 'cartisan', name: 'Cartisan', icon: LuShoppingCart, color: '#a21caf', category: 'commerce', triggers: 8, actions: 5, blurb: 'Sync refunds and stock changes without a single plugin.' },
    { id: 'gridbase', name: 'Gridbase', icon: LuTable2, color: '#0ea5e9', category: 'data', triggers: 3, actions: 6, blurb: 'Append rows from any payload with drag-and-drop field mapping.' },
    { id: 'sheetly', name: 'Sheetly', icon: LuSheet, color: '#16a34a', category: 'data', popular: true, triggers: 2, actions: 5, blurb: 'Log every event to a sheet for instant, shareable reporting.' },
    { id: 'warehaus', name: 'Warehaus', icon: LuDatabase, color: '#0369a1', category: 'data', triggers: 1, actions: 3, blurb: 'Batch events into warehouse tables every 60 seconds.' },
    { id: 'rowstack', name: 'Rowstack', icon: LuServer, color: '#be123c', category: 'data', triggers: 4, actions: 6, blurb: 'Insert rows and call edge functions on each delivery.' },
]

const tabLabel = Object.fromEntries(tabs.map((t) => [t.id, t.label]))

const matches = (item, q) => {
    if (!q) return true
    const hay = `${item.name} ${item.blurb} ${tabLabel[item.category]}`.toLowerCase()
    return hay.includes(q)
}

export function SearchableDirectoryIntegrationsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('all')
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const tabRefs = useRef([])
    const inputRef = useRef(null)

    const q = query.trim().toLowerCase()
    const searched = integrations.filter((item) => matches(item, q))
    const results = searched.filter((item) => category === 'all' || item.category === category)
    const countFor = (id) => (id === 'all' ? searched.length : searched.filter((i) => i.category === id).length)

    const clearAll = () => {
        setQuery('')
        setCategory('all')
        inputRef.current?.focus()
    }

    const onTabKeyDown = (e, index) => {
        let next = null
        if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
        else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        else if (e.key === 'Home') next = 0
        else if (e.key === 'End') next = tabs.length - 1
        if (next === null) return
        e.preventDefault()
        setCategory(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-b from-[#ecfdf5] to-white" />
            <svg
                aria-hidden="true"
                viewBox="0 0 400 120"
                className="absolute right-0 top-10 -z-10 hidden h-32 w-[420px] text-[#10b981]/40 md:block"
                fill="none"
            >
                <path
                    d="M0 60h180c30 0 30-40 60-40s30 40 60 40 30 40 60 40h40"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="2 8"
                    strokeLinecap="round"
                />
                <circle cx="240" cy="20" r="5" fill="currentColor" />
                <circle cx="360" cy="100" r="5" fill="currentColor" />
            </svg>

            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#10b981]/10 px-3 py-1 text-xs font-semibold text-[#047857]">
                            <span className="size-1.5 rounded-full bg-[#10b981]" aria-hidden="true" />
                            Hookline directory
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0f172a] sm:text-5xl">
                            Hook into the tools you already run.
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#64748b] md:text-right">
                        140+ verified integrations with signed payloads, automatic retries and field mapping. Here are
                        the 19 our customers install first.
                    </p>
                </div>

                <div className="relative mt-10">
                    <label htmlFor={`${uid}-search`} className="sr-only">
                        Search integrations
                    </label>
                    <HiMagnifyingGlass
                        aria-hidden="true"
                        className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#94a3b8]"
                    />
                    <input
                        ref={inputRef}
                        id={`${uid}-search`}
                        type="search"
                        value={query}
                        placeholder="Search Chatwise, Paylane, Codebase Hub…"
                        autoComplete="off"
                        className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-13 pr-14 text-base text-[#0f172a] shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] outline-none transition-[border-color,box-shadow] placeholder:text-[#94a3b8] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/15 [&::-webkit-search-cancel-button]:appearance-none"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' && query) {
                                e.preventDefault()
                                setQuery('')
                            }
                        }}
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] focus-visible:outline-2 focus-visible:outline-[#10b981]"
                            onClick={() => {
                                setQuery('')
                                inputRef.current?.focus()
                            }}
                        >
                            <HiXMark className="size-5" />
                        </button>
                    )}
                </div>

                <div className="mt-6 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
                    <div role="tablist" aria-label="Integration categories" className="flex min-w-max gap-1 border-b border-slate-200">
                        {tabs.map((tab, index) => {
                            const selected = category === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`${uid}-tab-${tab.id}`}
                                    aria-selected={selected}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'relative inline-flex min-h-12 items-center gap-2 rounded-t-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#10b981] sm:px-4',
                                        selected ? 'text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]',
                                    )}
                                    onClick={() => setCategory(tab.id)}
                                    onKeyDown={(e) => onTabKeyDown(e, index)}
                                >
                                    {tab.label}
                                    <span
                                        className={cn(
                                            'rounded-full px-1.5 py-0.5 text-[11px] tabular-nums',
                                            selected ? 'bg-[#10b981] text-white' : 'bg-slate-100 text-[#64748b]',
                                        )}
                                    >
                                        {countFor(tab.id)}
                                    </span>
                                    {selected && (
                                        <motion.span
                                            layoutId={`${uid}-underline`}
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
                                            className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#10b981]"
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <p aria-live="polite" className="mt-5 text-sm text-[#64748b]">
                    {results.length === 0
                        ? 'No integrations found'
                        : `Showing ${results.length} integration${results.length === 1 ? '' : 's'}${category === 'all' ? '' : ` in ${tabLabel[category]}`}${q ? ` for “${query.trim()}”` : ''}`}
                </p>

                <div
                    role="tabpanel"
                    id={`${uid}-panel`}
                    aria-labelledby={`${uid}-tab-${category}`}
                    className="mt-4"
                >
                    {results.length > 0 ? (
                        <motion.ul layout={!reduceMotion} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {results.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <motion.li
                                            key={item.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <a
                                                href={`#hookline-${item.id}`}
                                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#10b981] hover:shadow-[0_18px_40px_-24px_rgba(16,185,129,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981] motion-reduce:hover:translate-y-0"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <span
                                                        className="grid size-12 shrink-0 place-items-center rounded-xl text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]"
                                                        style={{ backgroundColor: item.color }}
                                                    >
                                                        <Icon aria-hidden="true" className="size-6" />
                                                    </span>
                                                    {item.popular && (
                                                        <span className="rounded-full bg-[#10b981]/10 px-2.5 py-1 text-[11px] font-semibold text-[#047857]">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{item.name}</h3>
                                                <p className="text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
                                                    {tabLabel[item.category]}
                                                </p>
                                                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#475569]">{item.blurb}</p>
                                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-[#64748b]">
                                                    <span className="tabular-nums">
                                                        {item.triggers} triggers · {item.actions} actions
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 font-semibold text-[#10b981]">
                                                        Connect
                                                        <HiArrowUpRight
                                                            aria-hidden="true"
                                                            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                        />
                                                    </span>
                                                </div>
                                            </a>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.ul>
                    ) : (
                        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-[#10b981]/40 bg-[#ecfdf5]/60 px-6 py-14 text-center">
                            <svg aria-hidden="true" viewBox="0 0 96 48" className="h-12 w-24 text-[#10b981]" fill="none">
                                <path
                                    d="M38 16h-14a8 8 0 0 0 0 16h14M58 16h14a8 8 0 0 1 0 16H58"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <path d="M44 10l-3-6M52 10l3-6M44 38l-3 6M52 38l3 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <h3 className="mt-5 text-lg font-semibold text-[#0f172a]">
                                No integrations match {q ? `“${query.trim()}”` : 'this filter'}
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-[#64748b]">
                                Try a different name, or tell us what you need. Most requests ship within six weeks.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    className="min-h-11 rounded-xl bg-[#10b981] px-5 text-sm font-semibold text-white hover:bg-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                                    onClick={clearAll}
                                >
                                    Clear filters
                                </button>
                                <a
                                    href="#hookline-request"
                                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0f172a] hover:border-[#10b981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
                                >
                                    Request an integration
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default SearchableDirectoryIntegrationsGrid

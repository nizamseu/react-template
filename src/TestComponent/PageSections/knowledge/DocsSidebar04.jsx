// IconRailDocsSidebar

// DocsSidebar04 · Knowledge Bases & Documentation › Hierarchical Sidebar (TOC)

// Description:
// A two-pane support navigation for the fictional payments company Payloop: a
// deep-green icon rail holds six sections (Payments, Payouts, Billing, Disputes,
// Developers, Account) and the second pane lists the chosen section's pages in
// collapsible groups beside an article preview. Headed "Six rooms, one quiet hallway."
// for help centres with few, stable top-level areas.

// Design:
// - Cream #fdfaf3 section with a warm white #fffdf8 frame and #e7e0cf hairlines; the
//   rail is deep green #14532d with cream icons, the active section a cream tile with a
//   green icon
// - Serif section and article titles (font-serif), uppercase group labels, green
//   #15803d for the current page (left bar + tint), focus rings and "you are here" dots
// - md+: 76px vertical rail with hover/focus tooltips; below md the rail is a
//   horizontal, scrollable strip with tiny labels under each icon
// - The pages pane slides between sections and groups animate their height
//   (framer-motion); both become instant with reduced motion
// - Layout: base stacks rail / pages / article; md: rail + pages side by side, article
//   below; lg: rail | 300px pages | article

// What it does:
// - The rail is an ARIA tablist (aria-orientation="vertical") with roving tabindex; ↑/↓
//   and ←/→ move and activate, Home/End jump; the pages pane is its tabpanel
// - Groups are disclosure buttons (aria-expanded + aria-controls); the group holding
//   the current page is always re-opened, and the rail marks the section that holds it
//   with a dot
// - Clicking a page sets aria-current="page", updates the article and links to
//   #support/<section>/<page>; "Related" links in the article jump across sections

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IconRailDocsSidebar from '@/TestComponent/PageSections/knowledge/DocsSidebar04';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <IconRailDocsSidebar />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiChevronDown,
    HiOutlineBanknotes,
    HiOutlineCodeBracket,
    HiOutlineCreditCard,
    HiOutlineQuestionMarkCircle,
    HiOutlineReceiptPercent,
    HiOutlineScale,
    HiOutlineUserCircle,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const g = (id, label, pages) => ({ id, label, pages: pages.map(([pageId, title]) => ({ id: pageId, title })) })

const sections = [
    {
        id: 'payments',
        label: 'Payments',
        icon: HiOutlineCreditCard,
        blurb: 'Take money online, in person and by link.',
        groups: [
            g('accept', 'Accept payments', [['payment-links', 'Payment links'], ['checkout', 'Hosted checkout'], ['tap', 'In person with Payloop Tap']]),
            g('manage', 'Manage payments', [['refunds', 'Refund a payment'], ['captures', 'Authorise now, capture later'], ['statuses', 'Payment statuses explained']]),
            g('methods', 'Payment methods', [['cards', 'Cards and 3-D Secure'], ['bank-debits', 'Bank debits'], ['wallets', 'Digital wallets']]),
        ],
    },
    {
        id: 'payouts',
        label: 'Payouts',
        icon: HiOutlineBanknotes,
        blurb: 'Move your balance into your bank account.',
        groups: [
            g('schedules', 'Schedules', [['payout-schedule', 'Payout schedule'], ['instant-payouts', 'Instant payouts'], ['payout-holds', 'Why a payout is on hold']]),
            g('banks', 'Bank accounts', [['add-bank', 'Add a bank account'], ['multi-currency', 'Multi-currency balances']]),
        ],
    },
    {
        id: 'billing',
        label: 'Billing',
        icon: HiOutlineReceiptPercent,
        blurb: 'Invoices, subscriptions and recurring revenue.',
        groups: [
            g('invoices', 'Invoices', [['send-invoice', 'Send an invoice'], ['invoice-reminders', 'Automatic reminders'], ['invoice-pdf', 'Download invoice PDFs']]),
            g('subscriptions', 'Subscriptions', [['create-plan', 'Create a pricing plan'], ['proration', 'Upgrades and proration'], ['dunning', 'Recover failed renewals']]),
        ],
    },
    {
        id: 'disputes',
        label: 'Disputes',
        icon: HiOutlineScale,
        blurb: 'Chargebacks, evidence and fraud prevention.',
        groups: [
            g('responding', 'Responding', [['evidence', 'Submit evidence'], ['timeline', 'The dispute timeline'], ['dispute-fees', 'Dispute fees']]),
            g('prevention', 'Prevention', [['shield-rules', 'Payloop Shield rules'], ['descriptors', 'Clear statement descriptors']]),
        ],
    },
    {
        id: 'developers',
        label: 'Developers',
        icon: HiOutlineCodeBracket,
        blurb: 'Keys, SDKs, webhooks and test mode.',
        groups: [
            g('start', 'Getting started', [['api-keys', 'API keys'], ['test-mode', 'Test mode'], ['sdks', 'Server SDKs']]),
            g('webhooks', 'Webhooks', [['webhook-setup', 'Set up webhooks'], ['webhook-signatures', 'Verify signatures'], ['webhook-retries', 'Retries and ordering']]),
        ],
    },
    {
        id: 'account',
        label: 'Account',
        icon: HiOutlineUserCircle,
        blurb: 'Your business profile, team and security.',
        groups: [
            g('business', 'Your business', [['verify', 'Verify your business'], ['team', 'Team members and roles'], ['two-factor', 'Two-factor login']]),
            g('security', 'Security', [['sessions', 'Active sessions'], ['close-account', 'Close your account']]),
        ],
    },
]

const locate = (pageId) => {
    for (const section of sections) {
        for (const group of section.groups) {
            const page = group.pages.find((entry) => entry.id === pageId)
            if (page) return { section, group, page }
        }
    }
    return null
}

const related = {
    refunds: ['statuses', 'dispute-fees', 'payout-holds'],
    'payout-schedule': ['instant-payouts', 'add-bank', 'refunds'],
    'api-keys': ['test-mode', 'webhook-signatures', 'two-factor'],
}
const defaultRelated = ['refunds', 'payout-schedule', 'api-keys']

const INITIAL_PAGE = 'refunds'

export function IconRailDocsSidebar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const tabRefs = useRef([])
    const initial = locate(INITIAL_PAGE)
    const [sectionId, setSectionId] = useState(initial.section.id)
    const [pageId, setPageId] = useState(INITIAL_PAGE)
    const [open, setOpen] = useState(() => new Set(sections.map((section) => `${section.id}:${section.groups[0].id}`).concat(`${initial.section.id}:${initial.group.id}`)))

    const section = sections.find((entry) => entry.id === sectionId)
    const current = locate(pageId)
    const sectionIndex = sections.indexOf(section)

    const selectSection = (index, focus = false) => {
        setSectionId(sections[index].id)
        if (focus) tabRefs.current[index]?.focus()
    }

    const onRailKeyDown = (event) => {
        let next = null
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (sectionIndex + 1) % sections.length
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (sectionIndex - 1 + sections.length) % sections.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = sections.length - 1
        if (next === null) return
        event.preventDefault()
        selectSection(next, true)
    }

    const toggleGroup = (key) => {
        setOpen((prev) => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const openPage = (id) => {
        const found = locate(id)
        if (!found) return
        setPageId(id)
        setSectionId(found.section.id)
        setOpen((prev) => new Set([...prev, `${found.section.id}:${found.group.id}`]))
    }

    const relatedIds = (related[pageId] || defaultRelated).filter((id) => id !== pageId).slice(0, 3)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fdfaf3] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#15803d]">Payloop Support · Library</p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#1c1917] sm:text-6xl">
                            Six rooms, one <em className="text-[#15803d]">quiet</em> hallway.
                        </h2>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed text-[#57534e]">
                        Pick a room on the rail, then a page. 84 guides, each owned by the team that builds
                        the feature.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#e7e0cf] bg-[#fffdf8] shadow-[0_40px_80px_-60px_rgba(28,25,23,0.6)] md:grid-cols-[76px_1fr] lg:grid-cols-[76px_300px_1fr]">
                    <div className="flex items-center gap-2 bg-[#14532d] p-2 md:flex-col md:items-stretch md:gap-3 md:px-3 md:py-5">
                        <span
                            aria-hidden="true"
                            className="hidden size-[52px] shrink-0 place-items-center rounded-2xl bg-[#fdfaf3]/10 font-serif text-2xl italic text-[#bbf7d0] md:grid"
                        >
                            p
                        </span>
                        <div
                            role="tablist"
                            aria-label="Support sections"
                            aria-orientation="vertical"
                            className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] md:flex-none md:flex-col md:gap-2 md:overflow-visible md:border-t md:border-[#fdfaf3]/10 md:pt-3"
                            onKeyDown={onRailKeyDown}
                        >
                            {sections.map((entry, index) => {
                                const selected = entry.id === sectionId
                                const holdsCurrent = entry.id === current.section.id
                                const Icon = entry.icon
                                return (
                                    <button
                                        key={entry.id}
                                        ref={(node) => {
                                            tabRefs.current[index] = node
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${uid}-tab-${entry.id}`}
                                        aria-selected={selected}
                                        aria-controls={`${uid}-panel`}
                                        aria-label={entry.label}
                                        tabIndex={selected ? 0 : -1}
                                        className={cn(
                                            'group relative flex min-h-14 min-w-[64px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bbf7d0] md:size-[52px] md:min-h-0 md:min-w-0 md:px-0',
                                            selected ? 'bg-[#fdfaf3] text-[#14532d]' : 'text-[#dcfce7]/80 hover:bg-[#fdfaf3]/10 hover:text-[#fdfaf3]',
                                        )}
                                        onClick={() => selectSection(index)}
                                    >
                                        <Icon className="size-5 md:size-6" aria-hidden="true" />
                                        <span aria-hidden="true" className="text-[10px] font-semibold md:hidden">
                                            {entry.label}
                                        </span>
                                        {holdsCurrent && (
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute right-1.5 top-1.5 size-2 rounded-full ring-2',
                                                    selected ? 'bg-[#15803d] ring-[#fdfaf3]' : 'bg-[#86efac] ring-[#14532d]',
                                                )}
                                            />
                                        )}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#1c1917] px-2.5 py-1.5 text-xs font-semibold text-[#fdfaf3] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
                                        >
                                            {entry.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        <a
                            href="#support/contact"
                            aria-label="Contact Payloop support"
                            className="hidden size-[52px] shrink-0 place-items-center rounded-2xl text-[#dcfce7]/80 hover:bg-[#fdfaf3]/10 hover:text-[#fdfaf3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bbf7d0] md:mt-auto md:grid"
                        >
                            <HiOutlineQuestionMarkCircle className="size-6" aria-hidden="true" />
                        </a>
                    </div>

                    <div
                        id={`${uid}-panel`}
                        role="tabpanel"
                        aria-labelledby={`${uid}-tab-${sectionId}`}
                        className="min-w-0 border-[#e7e0cf] lg:border-r"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.nav
                                key={sectionId}
                                aria-label={`${section.label} pages`}
                                initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
                                transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="p-5 sm:p-6"
                            >
                                <h3 className="font-serif text-2xl font-normal text-[#1c1917]">{section.label}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[#78716c]">{section.blurb}</p>
                                <ul className="mt-5 space-y-3">
                                    {section.groups.map((group) => {
                                        const key = `${section.id}:${group.id}`
                                        const isOpen = open.has(key)
                                        const hasCurrent = current.section.id === section.id && current.group.id === group.id
                                        const panelId = `${uid}-${section.id}-${group.id}`
                                        return (
                                            <li key={group.id} className="border-t border-[#e7e0cf] pt-3 first:border-t-0 first:pt-0">
                                                <button
                                                    type="button"
                                                    aria-expanded={isOpen}
                                                    aria-controls={panelId}
                                                    className="flex min-h-10 w-full items-center gap-2 rounded-lg text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[#78716c] hover:text-[#1c1917] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                                                    onClick={() => toggleGroup(key)}
                                                >
                                                    <span className="flex-1">{group.label}</span>
                                                    {hasCurrent && !isOpen && <span className="size-1.5 rounded-full bg-[#15803d]" aria-hidden="true" />}
                                                    <span className="font-serif text-xs normal-case tracking-normal">{group.pages.length}</span>
                                                    <HiChevronDown
                                                        className={cn('size-4 transition-transform duration-200', !isOpen && '-rotate-90')}
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
                                                            transition={{ duration: reduceMotion ? 0 : 0.22 }}
                                                            className="overflow-hidden"
                                                        >
                                                            {group.pages.map((page) => {
                                                                const isActive = page.id === pageId
                                                                return (
                                                                    <li key={page.id}>
                                                                        <a
                                                                            href={`#support/${section.id}/${page.id}`}
                                                                            aria-current={isActive ? 'page' : undefined}
                                                                            className={cn(
                                                                                'relative mt-1 flex min-h-10 items-center rounded-xl py-2 pl-4 pr-3 text-[15px] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#15803d]',
                                                                                isActive
                                                                                    ? 'bg-[#dcfce7]/70 font-medium text-[#14532d]'
                                                                                    : 'text-[#44403c] hover:bg-[#f6f1e4] hover:text-[#1c1917]',
                                                                            )}
                                                                            onClick={() => openPage(page.id)}
                                                                        >
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className={cn(
                                                                                    'absolute inset-y-2.5 left-1.5 w-[3px] rounded-full',
                                                                                    isActive ? 'bg-[#15803d]' : 'bg-transparent',
                                                                                )}
                                                                            />
                                                                            {page.title}
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
                                </ul>
                            </motion.nav>
                        </AnimatePresence>
                    </div>

                    <div className="min-w-0 border-t border-[#e7e0cf] p-6 sm:p-10 md:col-span-2 lg:col-span-1 lg:border-t-0 lg:p-12">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.article
                                key={pageId}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#15803d]">
                                    {current.section.label} · {current.group.label}
                                </p>
                                <h3 className="mt-4 font-serif text-3xl font-normal leading-tight text-[#1c1917] sm:text-5xl">
                                    {current.page.title}
                                </h3>
                                <p className="mt-4 text-sm text-[#78716c]">Updated Sep 24, 2026 · Reviewed by the {current.section.label} team</p>
                                <ol aria-hidden="true" className="mt-8 space-y-5">
                                    {['w-[92%]', 'w-[78%]', 'w-[86%]'].map((width, step) => (
                                        <li key={width} className="flex gap-4">
                                            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#15803d]/40 font-serif text-sm text-[#15803d]">
                                                {step + 1}
                                            </span>
                                            <span className="flex-1 pt-1.5">
                                                <span className={cn('block h-3 rounded-full bg-[#ebe4d2]', width)} />
                                                <span className="mt-2 block h-3 w-1/2 rounded-full bg-[#f3eee0]" />
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                                <p className="sr-only">Article preview for {current.page.title}.</p>
                            </motion.article>
                        </AnimatePresence>

                        <div className="mt-10 border-t border-[#e7e0cf] pt-6">
                            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#78716c]">Related</h4>
                            <ul className="mt-3 divide-y divide-[#e7e0cf]">
                                {relatedIds.map((id) => {
                                    const found = locate(id)
                                    return (
                                        <li key={id}>
                                            <a
                                                href={`#support/${found.section.id}/${id}`}
                                                className="group flex min-h-12 items-center gap-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                                                onClick={() => openPage(id)}
                                            >
                                                <span className="w-24 shrink-0 text-xs text-[#78716c]">{found.section.label}</span>
                                                <span className="min-w-0 flex-1 font-serif text-lg text-[#1c1917] group-hover:text-[#15803d]">
                                                    {found.page.title}
                                                </span>
                                                <HiArrowRight
                                                    className="size-4 shrink-0 text-[#15803d] transition-transform duration-200 group-hover:translate-x-1"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IconRailDocsSidebar

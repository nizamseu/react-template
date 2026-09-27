// SearchFilterFaqAccordion

// FaqAccordion02 · SaaS Platforms › FAQ Accordion

// Description:
// A searchable help ledger for the fictional bookkeeping app Tallybook. Under the serif
// heading "Ask the ledger anything." a search box filters 15 questions live, highlighting
// matches in both questions and answers, while category chips (Getting started, Invoicing,
// Taxes & VAT, Bank feeds, Billing) narrow the list. Rows read like ledger entries with a
// reference number, and a friendly "No entries match" state offers a way back. Use it as a
// help-center FAQ or a long pricing-page FAQ.

// Design:
// - Beige #f5efe4 paper with faint ruled lines, brown #5c3d2e ink for text, borders and the
//   active chip; mustard #e9c46a highlight marks; a double rule separates the header
// - Serif heading text-4xl → lg:text-6xl; questions in serif text-lg; references, counts and
//   labels in 11px font-mono uppercase with wide tracking
// - Rows are ledger lines: mono ref column ("TB-007"), serif question, plus/minus square on
//   the right; open rows get a tinted background and answers animate height
// - Sidebar holds the search input (48px, brown 1.5px border, focus ring) and the chips; on
//   lg it is a sticky 300px column and chips become a vertical index with counts
// - Responsive: sidebar stacks above the list below lg with chips wrapping; the ref column
//   hides below sm

// What it does:
// - query (search text) and category are state; the list, category counts and the "Showing
//   6 of 15" line are derived from them; Escape in the search box or the ✕ button clears it
// - Matches are wrapped in <mark> in questions and answers; rows matching only in the answer
//   show a "match in answer" tag
// - openIds allows several rows open at once (aria-expanded / aria-controls, role="region");
//   the result count is announced through an aria-live region
// - "No entries match" shows "Clear search" and "Show all categories" buttons plus a link to
//   #tallybook-ask; useReducedMotion() removes the height animation

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SearchFilterFaqAccordion from '@/TestComponent/PageSections/saas/FaqAccordion02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <SearchFilterFaqAccordion />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiMagnifyingGlass, HiMinus, HiPlus, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = [
    { id: 'all', label: 'All questions' },
    { id: 'start', label: 'Getting started' },
    { id: 'invoicing', label: 'Invoicing' },
    { id: 'tax', label: 'Taxes & VAT' },
    { id: 'bank', label: 'Bank feeds' },
    { id: 'billing', label: 'Billing' },
]

const faqs = [
    { id: 'TB-001', cat: 'start', q: 'How long does setup take?', a: 'Most sole traders are up and running in about 20 minutes: connect a bank, import last year’s closing balances and pick your VAT scheme. Our setup checklist tracks what’s left.' },
    { id: 'TB-002', cat: 'start', q: 'Can I import my old spreadsheet?', a: 'Upload any CSV or XLSX file. Tallybook maps columns like date, payee and amount automatically and flags likely duplicates before anything is posted.' },
    { id: 'TB-003', cat: 'start', q: 'Can my accountant see my books?', a: 'Invite your accountant for free with read-only or full access. They get their own login, can leave notes on transactions and export trial balances in one click.' },
    { id: 'TB-004', cat: 'invoicing', q: 'Can I send recurring invoices?', a: 'Set invoices to repeat weekly, monthly or quarterly. Tallybook sends them for you and chases late payers with polite reminders at 3, 7 and 14 days overdue.' },
    { id: 'TB-005', cat: 'invoicing', q: 'How can clients pay my invoices?', a: 'Clients can pay by card, bank transfer or direct debit from a link on every invoice. Paid invoices reconcile themselves against your bank feed.' },
    { id: 'TB-006', cat: 'invoicing', q: 'Can I invoice in other currencies?', a: 'Invoice in 42 currencies. Exchange rates update daily at 16:00 GMT and realised gains or losses are booked for you when the payment lands.' },
    { id: 'TB-007', cat: 'tax', q: 'Does Tallybook file my VAT return?', a: 'Yes. Tallybook prepares your VAT return from your categorised transactions and submits it digitally under Making Tax Digital, with a PDF copy saved to your records.' },
    { id: 'TB-008', cat: 'tax', q: 'Can it estimate my income tax bill?', a: 'Your dashboard shows a live tax estimate that updates with every transaction, and a suggested amount to set aside each month so January never surprises you.' },
    { id: 'TB-009', cat: 'tax', q: 'Which VAT schemes are supported?', a: 'Standard, Flat Rate and Cash Accounting schemes are supported, including switching scheme mid-year. Partial exemption is on the roadmap for early 2027.' },
    { id: 'TB-010', cat: 'bank', q: 'Which banks can I connect?', a: 'Over 2,400 UK and EU banks through open banking. Connections are read-only, and you renew consent every 90 days with a single tap.' },
    { id: 'TB-011', cat: 'bank', q: 'How often do transactions sync?', a: 'Bank feeds sync every 4 hours automatically. Tap Refresh on any account to pull new transactions straight away.' },
    { id: 'TB-012', cat: 'bank', q: 'Is my bank login safe?', a: 'We never see or store your bank password. Your bank issues a read-only token that you can revoke at any time from Tallybook or your banking app.' },
    { id: 'TB-013', cat: 'billing', q: 'How much does Tallybook cost?', a: 'Solo is £9 a month and Team is £24 a month for up to 5 users. Both start with a 30-day free trial, no card required.' },
    { id: 'TB-014', cat: 'billing', q: 'Can I get a refund?', a: 'Annual plans can be refunded pro rata within 30 days of payment. Monthly plans can be cancelled any time and stay active until the period ends.' },
    { id: 'TB-015', cat: 'billing', q: 'Do you offer charity discounts?', a: 'Registered charities and community interest companies get 50% off any plan. Email your registration number and we’ll apply it the same day.' },
]

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }) {
    if (!query) return text
    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <mark key={i} className="rounded-sm bg-[#e9c46a] px-0.5 text-[#3b2418]">
                {part}
            </mark>
        ) : (
            part
        ),
    )
}

export function SearchFilterFaqAccordion({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('all')
    const [openIds, setOpenIds] = useState(['TB-001'])

    const needle = query.trim().toLowerCase()
    const matchesQuery = (item) =>
        !needle || item.q.toLowerCase().includes(needle) || item.a.toLowerCase().includes(needle)
    const searchHits = faqs.filter(matchesQuery)
    const results = searchHits.filter((item) => category === 'all' || item.cat === category)
    const countFor = (id) => (id === 'all' ? searchHits.length : searchHits.filter((item) => item.cat === id).length)
    const activeLabel = categories.find((c) => c.id === category)?.label

    const toggle = (id) => setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f5efe4] px-4 py-16 text-base font-normal text-[#5c3d2e] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_35px,rgba(92,61,46,0.07)_35px,rgba(92,61,46,0.07)_36px)]"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 border-b-[3px] border-double border-[#5c3d2e]/60 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#5c3d2e]/70">
                            Tallybook · Help ledger · Vol. 4
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#3b2418] sm:text-5xl lg:text-6xl">
                            Ask the ledger <em className="text-[#5c3d2e]">anything.</em>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-[#5c3d2e]/80 md:text-right">
                        {faqs.length} answers from our bookkeepers, checked every Friday. Type a word like
                        “VAT” or “refund” to jump straight there.
                    </p>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <label htmlFor={`${uid}-search`} className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#5c3d2e]/70">
                            Search questions
                        </label>
                        <div className="relative mt-2">
                            <HiMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-[#5c3d2e]/60" aria-hidden="true" />
                            <input
                                id={`${uid}-search`}
                                type="search"
                                value={query}
                                placeholder="e.g. invoices, VAT, bank"
                                autoComplete="off"
                                className="min-h-12 w-full rounded-xl border-[1.5px] border-[#5c3d2e]/50 bg-[#fbf8f2] pl-11 pr-11 text-base text-[#3b2418] placeholder:text-[#5c3d2e]/45 focus:border-[#5c3d2e] focus:outline-none focus:ring-4 focus:ring-[#5c3d2e]/15 [&::-webkit-search-cancel-button]:hidden"
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Escape') setQuery('')
                                }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-[#5c3d2e] hover:bg-[#5c3d2e]/10 focus-visible:outline-2 focus-visible:outline-[#5c3d2e]"
                                    onClick={() => setQuery('')}
                                >
                                    <HiXMark className="size-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-[#5c3d2e]/70" id={`${uid}-cats`}>
                            Categories
                        </p>
                        <div role="group" aria-labelledby={`${uid}-cats`} className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                            {categories.map((cat) => {
                                const isActive = cat.id === category
                                const count = countFor(cat.id)
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        className={cn(
                                            'inline-flex min-h-10 items-center justify-between gap-3 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3d2e] lg:rounded-lg lg:border-transparent',
                                            isActive
                                                ? 'border-[#5c3d2e] bg-[#5c3d2e] text-[#f5efe4]'
                                                : 'border-[#5c3d2e]/30 text-[#5c3d2e] hover:border-[#5c3d2e] lg:hover:border-transparent lg:hover:bg-[#5c3d2e]/10',
                                        )}
                                        onClick={() => setCategory(cat.id)}
                                    >
                                        <span>{cat.label}</span>
                                        <span className={cn('font-mono text-xs tabular-nums', isActive ? 'text-[#f5efe4]/70' : 'text-[#5c3d2e]/55')}>
                                            {count}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#5c3d2e]/70">
                            Showing {results.length} of {faqs.length}
                            {category !== 'all' && ` in ${activeLabel}`}
                            {needle && ` for “${query.trim()}”`}
                        </p>

                        {results.length === 0 ? (
                            <div className="mt-6 flex flex-col items-center rounded-2xl border-[1.5px] border-dashed border-[#5c3d2e]/40 bg-[#fbf8f2]/70 px-6 py-12 text-center">
                                <svg viewBox="0 0 96 80" className="h-20 w-24" aria-hidden="true">
                                    <rect x="10" y="8" width="56" height="64" rx="4" fill="#fbf8f2" stroke="#5c3d2e" strokeWidth="2" />
                                    <path d="M20 24h36M20 34h36M20 44h24" stroke="#5c3d2e" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="64" cy="50" r="13" fill="#f5efe4" stroke="#5c3d2e" strokeWidth="2.5" />
                                    <path d="M73.5 59.5 85 71" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M60 46.5c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.3c0 2.7-4 2.7-4 5.2M64 55.5v.1" fill="none" stroke="#5c3d2e" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <h3 className="mt-5 font-serif text-2xl font-normal text-[#3b2418]">
                                    No entries match {needle ? `“${query.trim()}”` : 'this filter'}
                                </h3>
                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#5c3d2e]/80">
                                    Try a shorter word, check the spelling, or ask one of our bookkeepers. They
                                    usually reply within a working day.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {needle && (
                                        <button
                                            type="button"
                                            className="min-h-10 rounded-full bg-[#5c3d2e] px-5 text-sm font-semibold text-[#f5efe4] hover:bg-[#3b2418] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3d2e]"
                                            onClick={() => setQuery('')}
                                        >
                                            Clear search
                                        </button>
                                    )}
                                    {category !== 'all' && (
                                        <button
                                            type="button"
                                            className="min-h-10 rounded-full border border-[#5c3d2e] px-5 text-sm font-semibold text-[#5c3d2e] hover:bg-[#5c3d2e]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3d2e]"
                                            onClick={() => setCategory('all')}
                                        >
                                            Show all categories
                                        </button>
                                    )}
                                    <a
                                        href="#tallybook-ask"
                                        className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-[#5c3d2e] underline decoration-[#5c3d2e]/40 underline-offset-4 hover:decoration-[#5c3d2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3d2e]"
                                    >
                                        Ask a bookkeeper
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <ul className="mt-4 border-t-[1.5px] border-[#5c3d2e]">
                                {results.map((item) => {
                                    const isOpen = openIds.includes(item.id)
                                    const answerOnly = needle && !item.q.toLowerCase().includes(needle)
                                    return (
                                        <li
                                            key={item.id}
                                            className={cn(
                                                'border-b border-[#5c3d2e]/25 transition-colors',
                                                isOpen && 'bg-[#5c3d2e]/[0.06]',
                                            )}
                                        >
                                            <h3 className="font-serif text-lg font-normal text-[#3b2418] sm:text-xl">
                                                <button
                                                    type="button"
                                                    id={`${uid}-q-${item.id}`}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`${uid}-a-${item.id}`}
                                                    className="group flex w-full items-start gap-4 px-2 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#5c3d2e] sm:px-3"
                                                    onClick={() => toggle(item.id)}
                                                >
                                                    <span className="mt-1.5 hidden w-14 shrink-0 font-mono text-[11px] tracking-wider text-[#5c3d2e]/60 sm:block">
                                                        {item.id}
                                                    </span>
                                                    <span className="min-w-0 flex-1 leading-snug">
                                                        <Highlight text={item.q} query={needle} />
                                                        {answerOnly && (
                                                            <span className="ml-2 inline-block rounded-full bg-[#e9c46a]/50 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-[#3b2418]">
                                                                match in answer
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'grid size-8 shrink-0 place-items-center rounded-md border-[1.5px] border-[#5c3d2e] transition-colors',
                                                            isOpen ? 'bg-[#5c3d2e] text-[#f5efe4]' : 'text-[#5c3d2e] group-hover:bg-[#5c3d2e]/10',
                                                        )}
                                                    >
                                                        {isOpen ? <HiMinus className="size-4" /> : <HiPlus className="size-4" />}
                                                    </span>
                                                </button>
                                            </h3>
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        key="answer"
                                                        id={`${uid}-a-${item.id}`}
                                                        role="region"
                                                        aria-labelledby={`${uid}-q-${item.id}`}
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="px-2 pb-5 pr-14 text-sm leading-relaxed text-[#5c3d2e] sm:pl-[5.25rem] sm:text-base">
                                                            <Highlight text={item.a} query={needle} />
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchFilterFaqAccordion

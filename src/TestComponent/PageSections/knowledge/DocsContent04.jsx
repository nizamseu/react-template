// ReleaseNotesDocsContent

// DocsContent04 · Knowledge Bases & Documentation › Main Content Area

// Description:
// An editorial changelog for Payloop Support titled "What’s new in Payloop". Each
// release (v4.12.0 "Instant payouts in 14 more countries", v4.11.2, v4.11.0 ...) shows
// its version, date and a list of changes tagged New, Improved or Fixed; one entry
// carries a migration code snippet. A filter bar narrows every release to one tag and
// "Show older releases" reveals two more. Use it as a release-notes or product-updates
// page.

// Design:
// - Cream #fdfaf3 paper, ink #1c1917 text, green #15803d accent; serif display type for
//   the heading and version numbers, mono for dates; hairline #e7e0cf rules between
//   releases
// - Releases sit on a timeline: from md a 200px sticky version column with a green dot
//   on a vertical rule, and the notes column beside it; below md the version stacks on
//   top
// - Tags: New solid green, Improved ochre #a16207 on #fef3c7, Fixed rose #9f1239 on
//   #ffe4e6; the filter is a pill group with a sliding ink indicator and live counts
// - Code snippet: deep green #0f2a1d panel with cream-toned token colours, line numbers
//   and a Copy button; it scrolls sideways inside itself
// - Heading text-4xl → sm:5xl → lg:6xl; header actions wrap under the title below md;
//   items animate in and out (layout + opacity) when filtering, instant for reduced
//   motion

// What it does:
// - filter ("all" | "new" | "improved" | "fixed") is a group of aria-pressed buttons;
//   it hides non-matching items and removes releases with no match; counts cover the
//   shown releases and an aria-live line reports "n changes in m releases"
// - showOlder toggles two older releases (v4.10.0, v4.9.3) with "Show older releases";
//   the code snippet hides while the filter is Improved or Fixed
// - Copy writes the snippet via the clipboard API (textarea fallback) and shows
//   "Copied" for 1.8 s; RSS, email and "Read the full guide" links are #hash anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ReleaseNotesDocsContent from '@/TestComponent/PageSections/knowledge/DocsContent04';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <ReleaseNotesDocsContent />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiChevronDown,
    HiOutlineClipboardDocument,
    HiOutlineEnvelope,
    HiOutlineRss,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TAGS = {
    new: { label: 'New', className: 'bg-[#15803d] text-[#f0fdf4]' },
    improved: { label: 'Improved', className: 'bg-[#fef3c7] text-[#a16207] ring-1 ring-inset ring-[#fcd34d]' },
    fixed: { label: 'Fixed', className: 'bg-[#ffe4e6] text-[#9f1239] ring-1 ring-inset ring-[#fecdd3]' },
}

const FILTERS = ['all', 'new', 'improved', 'fixed']

const RETRY_SNIPPET = `// Opt a subscription into smart retries
await payloop.subscriptions.update('sub_8Hk2QwT4', {
    retry_policy: { mode: 'smart', max_attempts: 4 },
})`

const releases = [
    {
        version: '4.12.0',
        date: 'Sep 22, 2026',
        latest: true,
        title: 'Instant payouts in 14 more countries',
        summary:
            'Merchants across Central Europe and the Nordics can now move their balance to a debit card in under 30 minutes, any day of the week.',
        items: [
            { tag: 'new', text: 'Instant payouts in Poland, Czechia, Romania, Finland and 10 more countries, for a 1.5% fee.' },
            { tag: 'new', text: 'The payout.settled webhook fires when funds land in the destination account.' },
            { tag: 'improved', text: 'Payout reports export three times faster and include fee breakdown columns.' },
            { tag: 'fixed', text: 'Dashboard payout dates showed UTC instead of your account time zone.' },
        ],
    },
    {
        version: '4.11.2',
        date: 'Sep 8, 2026',
        title: 'Invoice reminders that respect time zones',
        summary: 'A maintenance release focused on invoicing accuracy.',
        items: [
            { tag: 'improved', text: 'Reminder emails now send at 9:00 in the customer’s local time, not yours.' },
            { tag: 'fixed', text: 'Credit notes over $10,000 rounded the tax line by one cent.' },
            { tag: 'fixed', text: 'The invoice PDF footer overlapped long bank details on A4 paper.' },
        ],
    },
    {
        version: '4.11.0',
        date: 'Aug 25, 2026',
        title: 'Smart retries for failed card payments',
        summary:
            'Retries are now timed per card network and issuer. In the beta, smart retries recovered 11% more failed renewals than a fixed schedule.',
        snippet: RETRY_SNIPPET,
        items: [
            { tag: 'new', text: 'Smart retries: up to four attempts, scheduled when the issuer is most likely to approve.' },
            { tag: 'new', text: 'retry_policy parameter on subscriptions, available in API version 2026-08-01.' },
            { tag: 'improved', text: 'Dunning emails include a one-click “Update card” link that expires after 7 days.' },
        ],
    },
    {
        version: '4.10.0',
        date: 'Aug 4, 2026',
        title: 'Partial refunds from the order timeline',
        summary: 'Refund part of an order without leaving the timeline view.',
        older: true,
        items: [
            { tag: 'new', text: 'Partial refunds by line item or custom amount, straight from the order timeline.' },
            { tag: 'improved', text: 'Refund status syncs to connected accounting tools within 60 seconds.' },
            { tag: 'fixed', text: 'Refund emails showed the wrong currency symbol for CHF payments.' },
        ],
    },
    {
        version: '4.9.3',
        date: 'Jul 21, 2026',
        title: 'Security and stability',
        summary: 'Small fixes, plus read-only API keys for reporting tools.',
        older: true,
        items: [
            { tag: 'improved', text: 'API keys can be scoped to read-only for BI and reporting tools.' },
            { tag: 'fixed', text: 'Two-factor codes were rejected when a phone clock drifted by 30 seconds.' },
            { tag: 'fixed', text: 'Bulk export stalled on accounts with more than 250,000 customers.' },
        ],
    },
]

const JS_KEYWORDS = new Set(['await', 'const', 'import', 'from', 'true', 'false'])
const JS_RE = /(\/\/.*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g

const TOKEN_CLASS = {
    keyword: 'text-[#86efac]',
    string: 'text-[#fde68a]',
    number: 'text-[#fdba74]',
    comment: 'italic text-[#6f9a82]',
    fn: 'text-[#a7f3d0]',
    prop: 'text-[#f5e6c8]',
    punct: 'text-[#7fa591]',
    plain: 'text-[#ecf5ee]',
}

function tokenize(line) {
    return [...line.matchAll(JS_RE)].map((m) => {
        const [text, comment, str, num, word, space] = m
        if (comment) return { type: 'comment', text }
        if (str) return { type: 'string', text }
        if (num) return { type: 'number', text }
        if (word) {
            const next = line.slice(m.index + text.length).trimStart()[0]
            if (JS_KEYWORDS.has(word)) return { type: 'keyword', text }
            if (next === '(') return { type: 'fn', text }
            if (next === ':') return { type: 'prop', text }
            return { type: 'plain', text }
        }
        return { type: space ? 'plain' : 'punct', text }
    })
}

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.top = '0'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
    } catch {
        return false
    }
}

async function copyText(text) {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch {
        // blocked by permissions: use the fallback
    }
    return legacyCopy(text)
}

function Snippet({ code }) {
    const [status, setStatus] = useState({ state: 'idle', n: 0 })
    const lines = useMemo(() => code.split('\n').map(tokenize), [code])

    useEffect(() => {
        if (status.state === 'idle') return undefined
        const id = setTimeout(() => setStatus((s) => ({ ...s, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [status])

    const onCopy = async () => {
        const ok = await copyText(code)
        setStatus((s) => ({ state: ok ? 'copied' : 'failed', n: s.n + 1 }))
    }

    return (
        <div className="mt-6 overflow-hidden rounded-2xl bg-[#0f2a1d] shadow-[0_20px_40px_-28px_rgba(15,42,29,0.9)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5 pl-4 pr-1.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8fb9a1]">Node · payloop@4.11</p>
                <button
                    type="button"
                    aria-label={status.state === 'copied' ? 'Snippet copied' : 'Copy snippet'}
                    className={cn(
                        'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]',
                        status.state === 'copied'
                            ? 'bg-[#86efac] text-[#0f2a1d]'
                            : 'text-[#d1e7d9] hover:bg-white/10 hover:text-white',
                    )}
                    onClick={onCopy}
                >
                    {status.state === 'copied' ? (
                        <HiCheck aria-hidden="true" className="size-4" />
                    ) : (
                        <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
                    )}
                    {status.state === 'copied' ? 'Copied' : status.state === 'failed' ? 'Press ⌘C' : 'Copy'}
                </button>
            </div>
            <pre
                aria-label="Smart retries code example"
                tabIndex={0}
                className="overflow-x-auto py-4 font-mono text-[12.5px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#86efac] sm:text-[13px]"
            >
                <code className="block w-max min-w-full">
                    {lines.map((tokens, i) => (
                        <span key={i} className="flex pr-6">
                            <span aria-hidden="true" className="w-10 shrink-0 select-none pr-4 text-right text-[#44705a]">
                                {i + 1}
                            </span>
                            <span className="whitespace-pre">
                                {tokens.map((token, j) => (
                                    <span key={j} className={TOKEN_CLASS[token.type]}>
                                        {token.text}
                                    </span>
                                ))}
                            </span>
                        </span>
                    ))}
                </code>
            </pre>
            <span aria-live="polite" className="sr-only">
                {status.state === 'copied' ? 'Snippet copied to clipboard' : ''}
            </span>
        </div>
    )
}

export function ReleaseNotesDocsContent({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [filter, setFilter] = useState('all')
    const [showOlder, setShowOlder] = useState(false)

    const pool = releases.filter((r) => showOlder || !r.older)
    const counts = FILTERS.reduce((acc, key) => {
        acc[key] = pool.reduce(
            (sum, r) => sum + r.items.filter((item) => key === 'all' || item.tag === key).length,
            0,
        )
        return acc
    }, {})
    const visible = pool
        .map((r) => ({ ...r, shown: r.items.filter((item) => filter === 'all' || item.tag === filter) }))
        .filter((r) => r.shown.length > 0)
    const transition = { duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-[#fdfaf3] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-col gap-8 border-b border-[#1c1917] pb-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#15803d]" />
                            Payloop Support · Changelog
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl">
                            What’s new in <em className="text-[#15803d]">Payloop</em>
                        </h2>
                        <p className="mt-5 max-w-xl text-[17px] leading-8 text-[#57534e]">
                            Every change to payouts, invoicing and the API, written for the people who run the money
                            side of a business. Shipped every other Monday.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <a
                            href="#payloop-changelog-rss"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#1c1917]/15 px-4 text-sm font-semibold text-[#1c1917] transition-colors hover:border-[#15803d] hover:text-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                        >
                            <HiOutlineRss aria-hidden="true" className="size-4" />
                            RSS
                        </a>
                        <a
                            href="#payloop-release-emails"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c1917] px-4 text-sm font-semibold text-[#fdfaf3] transition-colors hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                        >
                            <HiOutlineEnvelope aria-hidden="true" className="size-4" />
                            Email me releases
                        </a>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div
                        role="group"
                        aria-label="Filter changes by tag"
                        className="grid grid-cols-4 gap-1 rounded-full border border-[#e7e0cf] bg-white/70 p-1 sm:inline-flex"
                    >
                        {FILTERS.map((key) => {
                            const active = filter === key
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={active}
                                    className={cn(
                                        'relative inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d] sm:px-4',
                                        active ? 'text-[#fdfaf3]' : 'text-[#57534e] hover:text-[#1c1917]',
                                    )}
                                    onClick={() => setFilter(key)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId={`${uid}-filter-pill`}
                                            className="absolute inset-0 rounded-full bg-[#1c1917]"
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    )}
                                    <span className="relative">{key === 'all' ? 'All' : TAGS[key].label}</span>
                                    <span
                                        className={cn(
                                            'relative hidden font-mono text-[11px] tabular-nums min-[400px]:inline',
                                            active ? 'text-[#86efac]' : 'text-[#a8a29e]',
                                        )}
                                    >
                                        {counts[key]}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    <p aria-live="polite" className="font-mono text-xs text-[#78716c]">
                        {counts[filter]} changes in {visible.length} releases
                    </p>
                </div>

                <ol className="relative mt-6">
                    <AnimatePresence initial={false} mode="popLayout">
                        {visible.map((release) => (
                            <motion.li
                                key={release.version}
                                layout={!reduceMotion}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={transition}
                                className="grid gap-5 border-b border-[#e7e0cf] py-10 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10"
                            >
                                <div className="relative md:border-l md:border-[#d9cfb8] md:pl-6">
                                    <div className="md:sticky md:top-6">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'absolute top-3 -left-[31px] hidden size-3.5 rounded-full border-2 border-[#fdfaf3] md:block',
                                                release.latest
                                                    ? 'bg-[#15803d] shadow-[0_0_0_4px_rgba(21,128,61,0.18)]'
                                                    : 'bg-[#c9bda2]',
                                            )}
                                        />
                                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 md:block">
                                            <p className="font-serif text-4xl leading-none tracking-tight text-[#1c1917] lg:text-5xl">
                                                <span className="text-[#a8a29e]">v</span>
                                                {release.version.split('.').slice(0, 2).join('.')}
                                                <span className="text-2xl text-[#a8a29e] lg:text-3xl">
                                                    .{release.version.split('.')[2]}
                                                </span>
                                            </p>
                                            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#78716c] md:mt-3">
                                                <time>{release.date}</time>
                                            </p>
                                            {release.latest && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#15803d] md:mt-3">
                                                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#15803d]" />
                                                    Latest
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-serif text-2xl font-normal leading-tight tracking-tight text-[#1c1917] sm:text-3xl">
                                        {release.title}
                                    </h3>
                                    <p className="mt-3 max-w-2xl text-[16px] leading-7 text-[#57534e]">{release.summary}</p>
                                    <ul className="mt-6 space-y-3">
                                        <AnimatePresence initial={false}>
                                            {release.shown.map((item) => (
                                                <motion.li
                                                    key={item.text}
                                                    layout={!reduceMotion}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }}
                                                    transition={transition}
                                                    className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-3 rounded-2xl bg-white/60 p-3 ring-1 ring-[#efe8d8] sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-4 sm:p-4"
                                                >
                                                    <span
                                                        className={cn(
                                                            'inline-flex justify-center rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]',
                                                            TAGS[item.tag].className,
                                                        )}
                                                    >
                                                        {TAGS[item.tag].label}
                                                    </span>
                                                    <span className="text-[15px] leading-6 text-[#292524]">{item.text}</span>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </ul>
                                    {release.snippet && filter !== 'fixed' && filter !== 'improved' && (
                                        <Snippet code={release.snippet} />
                                    )}
                                    {release.latest && (
                                        <a
                                            href="#payloop-instant-payouts-guide"
                                            className="group mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]"
                                        >
                                            <span className="border-b border-[#15803d]/40 pb-0.5 group-hover:border-[#15803d]">
                                                Read the full guide to instant payouts
                                            </span>
                                            <HiArrowRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </a>
                                    )}
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ol>

                {visible.length === 0 && (
                    <p className="py-12 text-center font-serif text-2xl text-[#78716c]">
                        No {TAGS[filter]?.label.toLowerCase()} changes in these releases.
                    </p>
                )}

                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        aria-expanded={showOlder}
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#1c1917] px-6 text-sm font-semibold text-[#1c1917] transition-colors hover:bg-[#1c1917] hover:text-[#fdfaf3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                        onClick={() => setShowOlder((v) => !v)}
                    >
                        {showOlder ? 'Hide older releases' : 'Show older releases'}
                        <HiChevronDown
                            aria-hidden="true"
                            className={cn('size-4 transition-transform duration-300', showOlder && 'rotate-180')}
                        />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ReleaseNotesDocsContent

// HeroAutocompleteLiveSearch

// LiveSearch02 · Knowledge Bases & Documentation › Live Search with Autocomplete

// Description:
// A bright, centred help-centre hero for the fictional Helpbase. Under "How can we help
// you today?" a large field suggests articles as you type, with matches highlighted, a
// category label per result and a "No results — contact support" fallback; trending
// searches and six topic tiles sit below. Use it as the first section of a help centre
// or FAQ home.

// Design:
// - Centred column (max-w-3xl search, max-w-6xl tiles) on white with a soft blue
//   #2563eb radial glow and a masked 22px dot grid; navy #0f172a text, slate #475569
//   body copy
// - Headline text-4xl → sm:6xl → lg:7xl, semibold, tight tracking; the search field is
//   64px (72px on sm+) with rounded-2xl, a 1px #cbd5e1 border and a blue focus ring +
//   glow
// - Suggestions dropdown: white rounded-2xl card with deep shadow; each row shows a
//   category pill (tinted dot per category), highlighted title and a one-line excerpt
// - Dropdown and the "Opened" strip fade/slide in with framer-motion (fade only for
//   reduced motion); topic tiles lift on hover
// - Tiles grid-cols-1 → sm:2 → lg:3; trending chips wrap; the submit button collapses
//   to an icon below sm

// What it does:
// - The input is an ARIA combobox (aria-expanded, aria-controls,
//   aria-activedescendant); the dropdown opens on focus (popular articles) or typing
//   (up to 6 ranked matches)
// - ↓/↑ move the active option, Enter or the Search button opens the active (or top)
//   article, Escape closes the list and a second Escape clears the query; clicks
//   outside close it
// - Choosing an article fills the field and shows an "Opened" strip linking to
//   #help/<id>; no matches shows "No results — contact support" with a link to
//   #contact-support
// - Trending chips fill the query and reopen the list; topic tiles link to
//   #help/<topic>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HeroAutocompleteLiveSearch from '@/TestComponent/PageSections/knowledge/LiveSearch02';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <HeroAutocompleteLiveSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiArrowUpRight,
    HiMagnifyingGlass,
    HiOutlineCreditCard,
    HiOutlineLifebuoy,
    HiOutlinePuzzlePiece,
    HiOutlineRocketLaunch,
    HiOutlineShieldCheck,
    HiOutlineUserCircle,
    HiOutlineWrenchScrewdriver,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = {
    start: { label: 'Getting started', dot: 'bg-[#2563eb]' },
    account: { label: 'Account', dot: 'bg-[#7c3aed]' },
    billing: { label: 'Billing', dot: 'bg-[#059669]' },
    integrations: { label: 'Integrations', dot: 'bg-[#0891b2]' },
    admin: { label: 'Workspace admin', dot: 'bg-[#d97706]' },
    trouble: { label: 'Troubleshooting', dot: 'bg-[#e11d48]' },
}

const articles = [
    { id: 'reset-password', cat: 'account', title: 'Reset your password', excerpt: 'Use “Forgot password” on the sign-in page — the link expires after 30 minutes.', read: 2, keywords: ['login', 'forgot', 'sign in', 'locked out'] },
    { id: 'two-factor', cat: 'account', title: 'Turn on two-factor authentication', excerpt: 'Protect your login with an authenticator app or a hardware security key.', read: 3, keywords: ['2fa', 'security', 'mfa', 'login'] },
    { id: 'change-email', cat: 'account', title: 'Change the email on your account', excerpt: 'Confirm the new address from your inbox; your old one keeps working for 7 days.', read: 2, keywords: ['address', 'profile', 'login'] },
    { id: 'delete-workspace', cat: 'account', title: 'Delete your workspace', excerpt: 'Export your data first — deletion is permanent after a 14-day grace period.', read: 4, keywords: ['close', 'remove', 'gdpr'] },
    { id: 'payment-method', cat: 'billing', title: 'Update your payment method', excerpt: 'Swap cards or switch to bank-transfer invoicing from Settings › Billing.', read: 2, keywords: ['card', 'credit', 'invoice', 'pay'] },
    { id: 'invoices', cat: 'billing', title: 'Download past invoices', excerpt: 'Every invoice since 2021 as a PDF, with your VAT number printed on it.', read: 1, keywords: ['receipt', 'vat', 'pdf', 'tax'] },
    { id: 'cancel-plan', cat: 'billing', title: 'Cancel or pause your plan', excerpt: 'Pause for up to three months, or cancel at the end of the billing cycle.', read: 3, keywords: ['subscription', 'downgrade', 'refund'] },
    { id: 'upgrade-team', cat: 'billing', title: 'Upgrade from Starter to Team', excerpt: 'Upgrades are prorated to the day and unlock shared inboxes and SLAs instantly.', read: 2, keywords: ['plan', 'pricing', 'seats'] },
    { id: 'chat-workspace', cat: 'integrations', title: 'Connect a team chat workspace', excerpt: 'Get a message for every new ticket and reply to customers without leaving chat.', read: 4, keywords: ['notifications', 'channel', 'alerts'] },
    { id: 'import-contacts', cat: 'integrations', title: 'Import contacts from a CSV file', excerpt: 'Map columns to fields, preview the first 20 rows and import up to 50,000 contacts.', read: 3, keywords: ['upload', 'crm', 'spreadsheet'] },
    { id: 'issue-tracker', cat: 'integrations', title: 'Send tickets to your issue tracker', excerpt: 'Turn any conversation into a linked bug report and sync its status back.', read: 5, keywords: ['bug', 'engineering', 'sync'] },
    { id: 'sso', cat: 'admin', title: 'Set up single sign-on (SSO)', excerpt: 'SAML 2.0 with any identity provider, plus an option to enforce SSO for everyone.', read: 6, keywords: ['saml', 'okta', 'login', 'security'] },
    { id: 'invite-team', cat: 'admin', title: 'Invite teammates and set roles', excerpt: 'Owner, Admin, Agent and Viewer roles — each with a clear list of permissions.', read: 3, keywords: ['users', 'members', 'permissions', 'seats'] },
    { id: 'export-csv', cat: 'admin', title: 'Export conversations to CSV', excerpt: 'Filter by date, tag or assignee and download a CSV in under a minute.', read: 2, keywords: ['download', 'report', 'data', 'backup'] },
    { id: 'merge-contacts', cat: 'admin', title: 'Merge duplicate contacts', excerpt: 'Combine two profiles and keep every conversation, note and custom field.', read: 2, keywords: ['duplicate', 'cleanup', 'crm'] },
    { id: 'first-inbox', cat: 'start', title: 'Create your first shared inbox', excerpt: 'Forward support@yourcompany.com to Helpbase and start replying as a team.', read: 4, keywords: ['setup', 'email', 'onboarding'] },
    { id: 'chat-widget', cat: 'start', title: 'Install the chat widget on your site', excerpt: 'Paste one script tag before the closing body tag — it weighs just 38 KB.', read: 3, keywords: ['embed', 'script', 'website', 'live chat'] },
    { id: 'business-hours', cat: 'start', title: 'Set business hours and auto-replies', excerpt: 'Tell customers when to expect a reply and pause SLA timers overnight.', read: 2, keywords: ['schedule', 'away', 'holiday', 'sla'] },
    { id: 'email-missing', cat: 'trouble', title: 'Emails are not arriving in Helpbase', excerpt: 'Check forwarding rules, SPF records and the spam quarantine, in that order.', read: 5, keywords: ['forwarding', 'spf', 'spam', 'inbox'] },
    { id: 'widget-hidden', cat: 'trouble', title: 'The chat widget is not showing', excerpt: 'Usually a content-security policy or an ad blocker — here is how to tell which.', read: 3, keywords: ['csp', 'script', 'blocked', 'live chat'] },
    { id: 'notifications', cat: 'trouble', title: 'Desktop notifications stopped working', excerpt: 'Re-allow notifications in your browser and check your quiet-hours settings.', read: 2, keywords: ['alerts', 'browser', 'sound'] },
]

const popularIds = ['reset-password', 'invoices', 'chat-widget', 'sso']
const trending = ['reset password', 'invoice', 'SSO', 'export CSV', 'widget not showing']

const topics = [
    { id: 'getting-started', label: 'Getting started', count: 32, blurb: 'Inboxes, widget and your first reply.', icon: HiOutlineRocketLaunch },
    { id: 'account', label: 'Account & login', count: 48, blurb: 'Passwords, 2FA and profile settings.', icon: HiOutlineUserCircle },
    { id: 'billing', label: 'Billing & plans', count: 27, blurb: 'Invoices, seats and payment methods.', icon: HiOutlineCreditCard },
    { id: 'integrations', label: 'Integrations', count: 61, blurb: 'Chat, CRM, issue trackers and webhooks.', icon: HiOutlinePuzzlePiece },
    { id: 'admin', label: 'Workspace admin', count: 39, blurb: 'Roles, SSO, exports and data retention.', icon: HiOutlineShieldCheck },
    { id: 'troubleshooting', label: 'Troubleshooting', count: 44, blurb: 'Fixes for email, widget and alerts.', icon: HiOutlineWrenchScrewdriver },
]

const articleById = Object.fromEntries(articles.map((article) => [article.id, article]))

function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function scoreArticle(article, tokens) {
    const title = article.title.toLowerCase()
    const haystack = `${article.title} ${categories[article.cat].label} ${article.excerpt} ${article.keywords.join(' ')}`.toLowerCase()
    let score = 0
    for (const token of tokens) {
        if (!haystack.includes(token)) return 0
        if (title.split(/\s+/).some((word) => word.startsWith(token))) score += 6
        else if (title.includes(token)) score += 4
        else if (article.keywords.some((keyword) => keyword.includes(token))) score += 2
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
            <mark key={index} className="rounded bg-[#dbeafe] px-0.5 font-semibold text-[#1d4ed8]">
                {part}
            </mark>
        ) : (
            <span key={index}>{part}</span>
        ),
    )
}

export function HeroAutocompleteLiveSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const wrapRef = useRef(null)
    const inputRef = useRef(null)
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(-1)
    const [picked, setPicked] = useState(null)

    const listId = `${uid}-list`
    const inputId = `${uid}-input`
    const tokens = useMemo(() => tokenize(query), [query])

    const { results, total } = useMemo(() => {
        if (!tokens.length) {
            return { results: popularIds.map((id) => articleById[id]), total: popularIds.length }
        }
        const matches = articles
            .map((article) => ({ article, score: scoreArticle(article, tokens) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((entry) => entry.article)
        return { results: matches.slice(0, 6), total: matches.length }
    }, [tokens])

    const activeIndex = active < results.length ? active : -1
    const optionId = (id) => `${uid}-opt-${id}`
    const noResults = tokens.length > 0 && results.length === 0

    useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [open])

    const activeId = open && activeIndex >= 0 ? optionId(results[activeIndex].id) : undefined

    useEffect(() => {
        if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' })
    }, [activeId])

    const choose = (article) => {
        setPicked(article)
        setQuery(article.title)
        setOpen(false)
        setActive(-1)
    }

    const updateQuery = (value) => {
        setQuery(value)
        setActive(-1)
        setOpen(true)
        setPicked(null)
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (!open) {
                setOpen(true)
                return
            }
            if (results.length) setActive((activeIndex + 1) % results.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (!open) {
                setOpen(true)
                return
            }
            if (results.length) setActive(activeIndex <= 0 ? results.length - 1 : activeIndex - 1)
        } else if (event.key === 'Escape') {
            if (open) {
                event.preventDefault()
                setOpen(false)
                setActive(-1)
            } else if (query) {
                event.preventDefault()
                updateQuery('')
                setOpen(false)
            }
        } else if (event.key === 'Tab') {
            setOpen(false)
        }
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if (open && activeIndex >= 0) choose(results[activeIndex])
        else if (tokens.length && results.length) choose(results[0])
        else {
            setOpen(true)
            inputRef.current?.focus()
        }
    }

    const status = !open
        ? picked
            ? `Opened ${picked.title}`
            : ''
        : noResults
          ? `No results for ${query.trim()}`
          : tokens.length
            ? `${total} ${total === 1 ? 'article' : 'articles'} found, showing ${results.length}`
            : `${results.length} popular articles`

    const fade = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate bg-white px-4 pb-20 pt-16 text-base font-normal text-[#0f172a] sm:px-6 md:pb-28 md:pt-24 lg:px-10', className)}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.14),transparent_70%)]" />
                <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_80%_at_50%_0%,black,transparent_75%)]" />
            </div>

            <div className="mx-auto max-w-3xl text-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#1d4ed8] shadow-sm backdrop-blur">
                    <HiOutlineLifebuoy className="size-4" aria-hidden="true" />
                    Helpbase Help Center · 412 articles
                </p>
                <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#0f172a] sm:text-6xl lg:text-7xl">
                    How can we help <span className="text-[#2563eb]">you</span> today?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
                    Search guides written by the Helpbase support team. Most answers take less than
                    three minutes to read.
                </p>

                <form role="search" className="relative mt-10 text-left" onSubmit={onSubmit}>
                    <div ref={wrapRef} className="relative">
                        <label htmlFor={inputId} className="sr-only">
                            Search the help center
                        </label>
                        <div
                            className={cn(
                                'flex h-16 items-center gap-2 rounded-2xl border bg-white pl-4 pr-2 transition-shadow duration-200 sm:h-[72px] sm:gap-3 sm:pl-6',
                                open
                                    ? 'border-[#2563eb] shadow-[0_0_0_4px_rgba(37,99,235,0.14),0_24px_50px_-24px_rgba(37,99,235,0.45)]'
                                    : 'border-[#cbd5e1] shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] hover:border-[#94a3b8]',
                            )}
                        >
                            <HiMagnifyingGlass className="size-6 shrink-0 text-[#2563eb]" aria-hidden="true" />
                            <input
                                ref={inputRef}
                                id={inputId}
                                type="text"
                                role="combobox"
                                aria-expanded={open}
                                aria-controls={listId}
                                aria-autocomplete="list"
                                aria-activedescendant={activeId}
                                autoComplete="off"
                                placeholder="Try “reset password” or “invoice”"
                                value={query}
                                className="h-full min-w-0 flex-1 bg-transparent text-base text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none sm:text-lg"
                                onFocus={() => setOpen(true)}
                                onChange={(event) => updateQuery(event.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            {query && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    className="grid size-10 shrink-0 place-items-center rounded-xl text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                    onClick={() => {
                                        updateQuery('')
                                        inputRef.current?.focus()
                                    }}
                                >
                                    <HiXMark className="size-5" aria-hidden="true" />
                                </button>
                            )}
                            <button
                                type="submit"
                                aria-label="Search"
                                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#2563eb] px-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] sm:h-14 sm:px-6 sm:text-base"
                            >
                                <HiArrowRight className="size-5 sm:hidden" aria-hidden="true" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>

                        <p className="sr-only" aria-live="polite">
                            {status}
                        </p>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    key="dropdown"
                                    {...fade}
                                    transition={{ duration: 0.16, ease: 'easeOut' }}
                                    className="absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)]"
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    {noResults ? (
                                        <div id={listId} className="px-5 py-10 text-center sm:px-10">
                                            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
                                                <HiOutlineLifebuoy className="size-7" aria-hidden="true" />
                                            </span>
                                            <p className="mt-4 text-lg font-semibold text-[#0f172a]">
                                                No results for “{query.trim()}”
                                            </p>
                                            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-[#475569]">
                                                Try fewer words, or ask a person — the Helpbase team replies in about 2 hours
                                                on weekdays.
                                            </p>
                                            <a
                                                href="#contact-support"
                                                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0f172a] px-5 text-sm font-semibold text-white hover:bg-[#1e293b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                            >
                                                Contact support
                                                <HiArrowRight className="size-4" aria-hidden="true" />
                                            </a>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                                                <span>{tokens.length ? 'Suggested articles' : 'Popular right now'}</span>
                                                {tokens.length > 0 && (
                                                    <span className="normal-case tracking-normal">
                                                        {results.length} of {total}
                                                    </span>
                                                )}
                                            </p>
                                            <ul id={listId} role="listbox" aria-label="Suggested articles" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
                                                {results.map((article, index) => {
                                                    const isActive = index === activeIndex
                                                    return (
                                                        <li
                                                            key={article.id}
                                                            id={optionId(article.id)}
                                                            role="option"
                                                            aria-selected={isActive}
                                                            className={cn(
                                                                'flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 sm:gap-4 sm:px-4',
                                                                isActive ? 'bg-[#eff6ff]' : 'hover:bg-[#f8fafc]',
                                                            )}
                                                            onMouseMove={() => setActive(index)}
                                                            onClick={() => choose(article)}
                                                        >
                                                            <span className="min-w-0 flex-1">
                                                                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#334155]">
                                                                        <span className={cn('size-1.5 rounded-full', categories[article.cat].dot)} aria-hidden="true" />
                                                                        {categories[article.cat].label}
                                                                    </span>
                                                                    <span className="text-xs text-[#64748b]">{article.read} min read</span>
                                                                </span>
                                                                <span className="mt-1.5 block text-[15px] font-medium text-[#0f172a] sm:text-base">
                                                                    <Highlight text={article.title} tokens={tokens} />
                                                                </span>
                                                                <span className="mt-0.5 block truncate text-sm text-[#64748b]">
                                                                    <Highlight text={article.excerpt} tokens={tokens} />
                                                                </span>
                                                            </span>
                                                            <HiArrowRight
                                                                className={cn(
                                                                    'mt-7 size-4 shrink-0 text-[#2563eb] transition-all duration-150',
                                                                    isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <p className="hidden items-center justify-between border-t border-[#f1f5f9] px-5 py-3 text-xs text-[#64748b] sm:flex">
                                                <span>
                                                    <kbd className="rounded border border-[#e2e8f0] px-1 font-sans">↑</kbd>{' '}
                                                    <kbd className="rounded border border-[#e2e8f0] px-1 font-sans">↓</kbd> to move ·{' '}
                                                    <kbd className="rounded border border-[#e2e8f0] px-1 font-sans">↵</kbd> to open ·{' '}
                                                    <kbd className="rounded border border-[#e2e8f0] px-1 font-sans">esc</kbd> to close
                                                </span>
                                                <a
                                                    href="#contact-support"
                                                    className="font-semibold text-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                                >
                                                    Still stuck? Contact us
                                                </a>
                                            </p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm text-[#64748b]">Trending:</span>
                    {trending.map((term) => (
                        <button
                            key={term}
                            type="button"
                            className="min-h-10 rounded-full border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#334155] transition-colors duration-200 hover:border-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                            onClick={() => {
                                updateQuery(term)
                                inputRef.current?.focus()
                            }}
                        >
                            {term}
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {picked && (
                        <motion.div
                            key={picked.id}
                            {...fade}
                            transition={{ duration: 0.2 }}
                            className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-4 text-left sm:flex-row sm:items-center sm:p-5"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
                                    Opened · {categories[picked.cat].label}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-[#0f172a]">{picked.title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[#475569]">{picked.excerpt}</p>
                            </div>
                            <a
                                href={`#help/${picked.id}`}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                            >
                                Read article · {picked.read} min
                                <HiArrowUpRight className="size-4" aria-hidden="true" />
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mx-auto mt-16 max-w-6xl md:mt-20">
                <div className="flex items-end justify-between gap-4 border-b border-[#e2e8f0] pb-4">
                    <h3 className="text-lg font-semibold text-[#0f172a] sm:text-xl">Browse by topic</h3>
                    <a
                        href="#help/all"
                        className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                    >
                        All 412 articles
                        <HiArrowRight className="size-4" aria-hidden="true" />
                    </a>
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((topic) => {
                        const Icon = topic.icon
                        return (
                            <li key={topic.id}>
                                <a
                                    href={`#help/${topic.id}`}
                                    className="group flex h-full items-start gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#bfdbfe] hover:shadow-[0_20px_40px_-24px_rgba(37,99,235,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] motion-reduce:hover:translate-y-0"
                                >
                                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eff6ff] text-[#2563eb] transition-colors duration-300 group-hover:bg-[#2563eb] group-hover:text-white">
                                        <Icon className="size-6" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-base font-semibold text-[#0f172a]">{topic.label}</span>
                                        <span className="mt-1 block text-sm leading-relaxed text-[#475569]">{topic.blurb}</span>
                                        <span className="mt-2 block text-xs font-semibold text-[#2563eb]">{topic.count} articles</span>
                                    </span>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default HeroAutocompleteLiveSearch

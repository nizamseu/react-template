// InstantAnswerLiveSearch

// LiveSearch04 · Knowledge Bases & Documentation › Live Search with Autocomplete

// Description:
// An editorial support search for the fictional payments company Payloop. Beside the
// serif headline "Ask Payloop anything." visitors search 18 help articles; for
// well-known questions ("refund", "api key", "invoice", "payout", "dispute") an
// "Instant answer" card with steps appears above the matching articles. Use it at the
// top of a support centre where a handful of questions make up most of the traffic.

// Design:
// - Cream #fdfaf3 section, ink #1c1917 text, stone #57534e body copy, green #15803d
//   accents; hairline #e7e0cf rules and warm white #fffdf8 cards with rounded-[20px]
// - Serif headline text-4xl → sm:6xl → lg:[4.25rem] with an italic green word; small
//   caps eyebrows with wide tracking; numbered steps set in green serif figures
// - Two columns on lg (5 / 7 split, left column sticky), single column below; question
//   chips wrap; result rows keep 56px min height
// - Instant answer card grows in with framer-motion (height + fade) and the result list
//   re-flows with layout animation; both become plain fades with reduced motion

// What it does:
// - The input is an ARIA combobox over the results listbox (aria-activedescendant); ↑/↓
//   move, Enter opens the active article (#support/<id>) and marks it "Viewed", Escape
//   clears
// - Instant answers trigger when the query contains a known phrase or a 4+ letter
//   prefix of one (e.g. "refu"); the "Did this answer it?" thumbs record Yes/No per
//   answer (visual only)
// - Empty query lists this week's top questions; no match shows a chat-with-support
//   fallback
// - Question chips fill the query; the live region announces answer + result counts

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InstantAnswerLiveSearch from '@/TestComponent/PageSections/knowledge/LiveSearch04';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <InstantAnswerLiveSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiMagnifyingGlass,
    HiOutlineBolt,
    HiOutlineChatBubbleLeftRight,
    HiOutlineHandThumbDown,
    HiOutlineHandThumbUp,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const answers = [
    {
        id: 'refund',
        triggers: ['refund', 'money back', 'return a payment'],
        title: 'How to refund a payment',
        summary:
            'Refunds reach your customer’s card in 5–10 business days. The original processing fee is not returned, and you can refund up to 180 days after the charge.',
        steps: ['Open Dashboard › Payments and find the charge', 'Choose Refund and enter a full or partial amount', 'Add a reason and confirm — the customer gets an email receipt'],
        link: 'refund-payment',
    },
    {
        id: 'api-key',
        triggers: ['api key', 'secret key', 'publishable key', 'apikey'],
        title: 'Where to find your API keys',
        summary:
            'Publishable keys (pk_live_…) are safe in the browser; secret keys (sk_live_…) must stay on your server. Rolling a key keeps the old one alive for 12 hours.',
        steps: ['Go to Developers › API keys', 'Click Reveal next to the secret key and confirm with 2FA', 'Use Roll key if a key has ever been committed or shared'],
        link: 'api-keys',
    },
    {
        id: 'invoice',
        triggers: ['invoice', 'receipt', 'bill a customer'],
        title: 'Send or download an invoice',
        summary:
            'Payloop emails a hosted payment page and sends reminders 3, 7 and 14 days after the due date. Every invoice can be downloaded as a PDF.',
        steps: ['Open Billing › Invoices and click New invoice', 'Add line items, tax and a due date', 'Send it, or choose Download PDF on any past invoice'],
        link: 'send-invoice',
    },
    {
        id: 'payout',
        triggers: ['payout', 'deposit', 'get paid', 'bank transfer'],
        title: 'When your payouts arrive',
        summary:
            'Payouts run daily on a two-business-day rolling schedule, so Friday’s payments land on Tuesday. Instant payouts arrive in about 30 minutes for a 1% fee.',
        steps: ['Check Balances › Payouts for the next arrival date', 'Switch to weekly or monthly under Settings › Payout schedule', 'Use Pay out now for an instant payout (min. $0.50)'],
        link: 'payout-schedule',
    },
    {
        id: 'dispute',
        triggers: ['dispute', 'chargeback'],
        title: 'Responding to a dispute',
        summary:
            'You have 7 days to submit evidence. Payloop holds the disputed amount plus a $15 fee, refunded in full if the bank rules in your favour.',
        steps: ['Open Payments › Disputes and pick the case', 'Upload receipts, tracking numbers or customer emails', 'Submit before the deadline — you can’t edit evidence afterwards'],
        link: 'respond-dispute',
    },
]

const articles = [
    { id: 'refund-payment', cat: 'Payments', title: 'Refund a payment in full or in part', minutes: 3, keywords: ['refund', 'return', 'money back'] },
    { id: 'refund-timing', cat: 'Payments', title: 'Why a refund hasn’t reached the customer yet', minutes: 2, keywords: ['refund', 'pending', 'bank'] },
    { id: 'failed-payments', cat: 'Payments', title: 'Understand declined and failed payments', minutes: 4, keywords: ['declined', 'card', 'error'] },
    { id: 'payment-links', cat: 'Payments', title: 'Accept payments with a shareable link', minutes: 3, keywords: ['link', 'checkout', 'no code'] },
    { id: 'payout-schedule', cat: 'Payouts', title: 'Change your payout schedule', minutes: 2, keywords: ['payout', 'weekly', 'monthly', 'deposit'] },
    { id: 'instant-payouts', cat: 'Payouts', title: 'Instant payouts: fees and limits', minutes: 3, keywords: ['payout', 'instant', 'fee'] },
    { id: 'bank-account', cat: 'Payouts', title: 'Update the bank account for payouts', minutes: 2, keywords: ['bank', 'iban', 'payout', 'account'] },
    { id: 'send-invoice', cat: 'Billing', title: 'Create and send an invoice', minutes: 4, keywords: ['invoice', 'bill', 'customer'] },
    { id: 'invoice-reminders', cat: 'Billing', title: 'Customise invoice reminder emails', minutes: 2, keywords: ['invoice', 'reminder', 'email', 'overdue'] },
    { id: 'tax-rates', cat: 'Billing', title: 'Add tax rates to invoices and subscriptions', minutes: 5, keywords: ['tax', 'vat', 'invoice'] },
    { id: 'subscriptions', cat: 'Billing', title: 'Pause, cancel or prorate a subscription', minutes: 4, keywords: ['subscription', 'cancel', 'proration'] },
    { id: 'respond-dispute', cat: 'Disputes', title: 'Respond to a dispute with the right evidence', minutes: 6, keywords: ['dispute', 'chargeback', 'evidence'] },
    { id: 'prevent-fraud', cat: 'Disputes', title: 'Reduce fraud with Payloop Shield rules', minutes: 5, keywords: ['fraud', 'rules', 'chargeback', 'risk'] },
    { id: 'api-keys', cat: 'Developers', title: 'Find, reveal and roll your API keys', minutes: 3, keywords: ['api key', 'secret', 'publishable', 'token'] },
    { id: 'webhooks', cat: 'Developers', title: 'Verify webhook signatures', minutes: 5, keywords: ['webhook', 'signature', 'api', 'events'] },
    { id: 'test-mode', cat: 'Developers', title: 'Use test mode and test card numbers', minutes: 2, keywords: ['test', 'sandbox', 'card', 'api key'] },
    { id: 'verify-identity', cat: 'Account', title: 'Verify your business identity', minutes: 4, keywords: ['kyc', 'documents', 'verification'] },
    { id: 'team-roles', cat: 'Account', title: 'Invite teammates and assign roles', minutes: 3, keywords: ['team', 'users', 'permissions'] },
]

const topQuestionIds = ['refund-payment', 'payout-schedule', 'api-keys', 'send-invoice', 'failed-payments']
const chips = ['refund', 'api key', 'invoice', 'payout', 'chargeback']
const articleById = Object.fromEntries(articles.map((article) => [article.id, article]))

function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function findAnswer(query) {
    const q = query.toLowerCase().trim().replace(/\s+/g, ' ')
    if (q.length < 3) return null
    return (
        answers.find((answer) =>
            answer.triggers.some((trigger) => q.includes(trigger) || (q.length >= 4 && trigger.startsWith(q))),
        ) || null
    )
}

function scoreArticle(article, tokens) {
    const title = article.title.toLowerCase()
    const haystack = `${article.title} ${article.cat} ${article.keywords.join(' ')}`.toLowerCase()
    let score = 0
    for (const token of tokens) {
        if (!haystack.includes(token)) return 0
        if (title.includes(token)) score += 4
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
            <mark key={index} className="bg-[linear-gradient(transparent_58%,#bbf7d0_58%)] text-[#14532d]">
                {part}
            </mark>
        ) : (
            <span key={index}>{part}</span>
        ),
    )
}

export function InstantAnswerLiveSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const inputRef = useRef(null)
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(-1)
    const [viewed, setViewed] = useState([])
    const [votes, setVotes] = useState({})

    const tokens = useMemo(() => tokenize(query), [query])
    const answer = useMemo(() => findAnswer(query), [query])

    const results = useMemo(() => {
        if (!tokens.length) return topQuestionIds.map((id) => articleById[id])
        return articles
            .map((article) => {
                const score = scoreArticle(article, tokens)
                return { article, score: score && answer?.link === article.id ? score + 3 : score }
            })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((entry) => entry.article)
    }, [tokens, answer])

    const activeIndex = active < results.length ? active : -1
    const listId = `${uid}-list`
    const optionId = (id) => `${uid}-opt-${id}`
    const activeOptionId = activeIndex >= 0 ? optionId(results[activeIndex].id) : undefined

    useEffect(() => {
        if (activeOptionId) document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' })
    }, [activeOptionId])

    const updateQuery = (value) => {
        setQuery(value)
        setActive(-1)
    }

    const openArticle = (article) => {
        setViewed((list) => (list.includes(article.id) ? list : [...list, article.id]))
        window.location.hash = `support/${article.id}`
    }

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown' && results.length) {
            event.preventDefault()
            setActive((activeIndex + 1) % results.length)
        } else if (event.key === 'ArrowUp' && results.length) {
            event.preventDefault()
            setActive(activeIndex <= 0 ? results.length - 1 : activeIndex - 1)
        } else if (event.key === 'Enter') {
            event.preventDefault()
            const target = activeIndex >= 0 ? results[activeIndex] : tokens.length ? results[0] : null
            if (target) openArticle(target)
        } else if (event.key === 'Escape' && query) {
            event.preventDefault()
            updateQuery('')
        }
    }

    const status = tokens.length
        ? `${answer ? 'Instant answer available. ' : ''}${results.length} ${results.length === 1 ? 'article' : 'articles'} found`
        : ''

    const noResults = tokens.length > 0 && !results.length && !answer

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fdfaf3] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-24">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#15803d]">
                            <span className="grid size-6 place-items-center rounded-full bg-[#15803d] font-serif text-xs normal-case tracking-normal text-[#fdfaf3]">
                                p
                            </span>
                            Payloop Support
                        </p>
                        <h2 className="mt-6 font-serif text-4xl font-normal leading-[1] tracking-[-0.02em] text-[#1c1917] sm:text-6xl lg:text-[4.25rem]">
                            Ask Payloop <em className="text-[#15803d]">anything.</em>
                        </h2>
                        <p className="mt-6 max-w-md text-base leading-relaxed text-[#57534e] sm:text-lg">
                            Start typing a question. For the ones we hear every day, the answer shows up
                            before you finish — no article required.
                        </p>

                        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#78716c]">
                            People often ask about
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {chips.map((chip) => (
                                <button
                                    key={chip}
                                    type="button"
                                    aria-pressed={query.trim().toLowerCase() === chip}
                                    className={cn(
                                        'min-h-10 rounded-full border px-4 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]',
                                        query.trim().toLowerCase() === chip
                                            ? 'border-[#15803d] bg-[#15803d] text-[#fdfaf3]'
                                            : 'border-[#d6cfbd] bg-[#fffdf8] text-[#1c1917] hover:border-[#15803d] hover:text-[#15803d]',
                                    )}
                                    onClick={() => {
                                        updateQuery(chip)
                                        inputRef.current?.focus()
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 hidden border-t border-[#e7e0cf] pt-6 lg:block">
                            <p className="font-serif text-2xl text-[#1c1917]">4 min</p>
                            <p className="mt-1 text-sm text-[#57534e]">
                                Median first reply from a human on live chat, Monday to Saturday.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-[20px] border border-[#e7e0cf] bg-[#fffdf8] p-2 shadow-[0_1px_0_#e7e0cf,0_30px_60px_-40px_rgba(28,25,23,0.45)]">
                        <div className="flex h-14 items-center gap-3 rounded-[14px] bg-[#f6f1e4] px-4 focus-within:ring-2 focus-within:ring-[#15803d] sm:h-16 sm:px-5">
                            <HiMagnifyingGlass className="size-5 shrink-0 text-[#15803d]" aria-hidden="true" />
                            <label htmlFor={`${uid}-input`} className="sr-only">
                                Search Payloop Support
                            </label>
                            <input
                                ref={inputRef}
                                id={`${uid}-input`}
                                type="text"
                                role="combobox"
                                aria-expanded={results.length > 0}
                                aria-controls={listId}
                                aria-autocomplete="list"
                                aria-activedescendant={activeOptionId}
                                aria-describedby={answer ? `${uid}-answer` : undefined}
                                autoComplete="off"
                                placeholder="e.g. How do I refund a payment?"
                                value={query}
                                className="h-full min-w-0 flex-1 bg-transparent text-base text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none sm:text-lg"
                                onChange={(event) => updateQuery(event.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            {query && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    className="grid size-10 shrink-0 place-items-center rounded-full text-[#78716c] hover:bg-[#ebe3cf] hover:text-[#1c1917] focus-visible:outline-2 focus-visible:outline-[#15803d]"
                                    onClick={() => {
                                        updateQuery('')
                                        inputRef.current?.focus()
                                    }}
                                >
                                    <HiXMark className="size-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <p className="sr-only" aria-live="polite">
                            {status}
                        </p>

                        <AnimatePresence initial={false}>
                            {answer && (
                                <motion.div
                                    key={answer.id}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <article
                                        id={`${uid}-answer`}
                                        aria-label={`Instant answer: ${answer.title}`}
                                        className="relative mt-2 overflow-hidden rounded-[14px] bg-[#14532d] p-5 text-[#f0fdf4] sm:p-7"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full border-[28px] border-[#15803d]/60"
                                        />
                                        <p className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#86efac]">
                                            <HiOutlineBolt className="size-4" aria-hidden="true" />
                                            Instant answer
                                        </p>
                                        <h3 className="relative mt-3 font-serif text-2xl font-normal leading-tight text-[#f0fdf4] sm:text-3xl">
                                            {answer.title}
                                        </h3>
                                        <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-[#dcfce7] sm:text-[15px]">
                                            {answer.summary}
                                        </p>
                                        <ol className="relative mt-5 space-y-3">
                                            {answer.steps.map((step, index) => (
                                                <li key={step} className="flex gap-3 text-sm leading-snug text-[#f0fdf4]">
                                                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#fdfaf3] font-serif text-sm text-[#14532d]">
                                                        {index + 1}
                                                    </span>
                                                    <span className="pt-1">{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                        <div className="relative mt-6 flex flex-col gap-4 border-t border-[#f0fdf4]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                            <a
                                                href={`#support/${answer.link}`}
                                                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#f0fdf4] underline decoration-[#86efac] decoration-2 underline-offset-4 hover:text-[#bbf7d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]"
                                            >
                                                Read the full guide
                                                <HiArrowRight className="size-4" aria-hidden="true" />
                                            </a>
                                            {votes[answer.id] ? (
                                                <p className="flex items-center gap-2 text-sm text-[#bbf7d0]" role="status">
                                                    <HiCheck className="size-4" aria-hidden="true" />
                                                    Thanks — noted.
                                                </p>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm text-[#dcfce7]">
                                                    <span>Did this answer it?</span>
                                                    {[
                                                        ['yes', 'Yes, it did', HiOutlineHandThumbUp],
                                                        ['no', 'No, it did not', HiOutlineHandThumbDown],
                                                    ].map(([vote, label, Icon]) => (
                                                        <button
                                                            key={vote}
                                                            type="button"
                                                            aria-label={label}
                                                            className="grid size-10 place-items-center rounded-full border border-[#f0fdf4]/25 text-[#f0fdf4] transition-colors hover:bg-[#f0fdf4] hover:text-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86efac]"
                                                            onClick={() => setVotes((prev) => ({ ...prev, [answer.id]: vote }))}
                                                        >
                                                            <Icon className="size-4" aria-hidden="true" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="px-3 pb-2 pt-5 sm:px-5">
                            <p className="flex items-baseline justify-between gap-4 border-b border-[#e7e0cf] pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#78716c]">
                                <span>{tokens.length ? (answer ? 'Related articles' : 'Articles') : 'Top questions this week'}</span>
                                <span className="font-serif text-sm normal-case tracking-normal">
                                    {tokens.length ? `${results.length} found` : `${articles.length} total`}
                                </span>
                            </p>

                            {results.length ? (
                                <ul id={listId} role="listbox" aria-label="Help articles" className="max-h-[440px] overflow-y-auto py-2">
                                    {results.map((article, index) => {
                                        const isActive = index === activeIndex
                                        const isViewed = viewed.includes(article.id)
                                        return (
                                            <motion.li
                                                key={article.id}
                                                layout={reduceMotion ? false : 'position'}
                                                id={optionId(article.id)}
                                                role="option"
                                                aria-selected={isActive}
                                                className={cn(
                                                    'group flex min-h-14 cursor-pointer items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-150',
                                                    isActive ? 'bg-[#f0fdf4]' : 'hover:bg-[#f6f1e4]',
                                                )}
                                                onMouseMove={() => setActive(index)}
                                                onClick={() => openArticle(article)}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'w-6 shrink-0 font-serif text-lg tabular-nums',
                                                        isActive ? 'text-[#15803d]' : 'text-[#a8a29e]',
                                                    )}
                                                >
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span
                                                        className={cn(
                                                            'block text-[15px] leading-snug sm:text-base',
                                                            isViewed ? 'text-[#78716c]' : 'text-[#1c1917]',
                                                        )}
                                                    >
                                                        <Highlight text={article.title} tokens={tokens} />
                                                    </span>
                                                    <span className="mt-1 flex items-center gap-2 text-xs text-[#78716c]">
                                                        <span className="font-semibold text-[#15803d]">{article.cat}</span>
                                                        <span aria-hidden="true">·</span>
                                                        <span>{article.minutes} min read</span>
                                                        {isViewed && (
                                                            <span className="inline-flex items-center gap-1 text-[#15803d]">
                                                                <HiCheck className="size-3.5" aria-hidden="true" />
                                                                Viewed
                                                            </span>
                                                        )}
                                                    </span>
                                                </span>
                                                <HiArrowRight
                                                    className={cn(
                                                        'size-4 shrink-0 text-[#15803d] transition-all duration-200',
                                                        isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </motion.li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div id={listId} className="py-10 text-center">
                                    {noResults ? (
                                        <>
                                            <p className="font-serif text-2xl text-[#1c1917]">Nothing matches “{query.trim()}”.</p>
                                            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#57534e]">
                                                Try a single word like “refund” or “payout” — or ask a person. We reply in
                                                about four minutes.
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-[#57534e]">
                                            The instant answer above covers it — or talk to the team below.
                                        </p>
                                    )}
                                    <a
                                        href="#support/chat"
                                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#15803d] px-5 text-sm font-semibold text-[#fdfaf3] hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]"
                                    >
                                        <HiOutlineChatBubbleLeftRight className="size-4" aria-hidden="true" />
                                        Chat with support
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="mt-4 hidden text-center text-xs text-[#78716c] sm:block">
                        ↑ ↓ to move through articles · Enter to open · Esc to clear
                    </p>
                </div>
            </div>
        </section>
    )
}

export default InstantAnswerLiveSearch

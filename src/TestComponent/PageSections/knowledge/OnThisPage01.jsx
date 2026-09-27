// ScrollspyRailOnThisPage

// OnThisPage01 · Knowledge Bases & Documentation › On-This-Page Navigation

// Description:
// A Stackdocs reference page, "Authenticate API requests", whose body scrolls inside a
// framed article box while an "On this page" rail tracks the heading in view. The rail
// lists nine headings (Overview, API keys › Create a key / Rotate a key, OAuth 2.0 ›
// Scopes, Webhook signatures, Rate limits, Errors); clicking one smooth-scrolls the box
// to it. Use it as the layout for any long docs page that needs a scrollspy table of
// contents.

// Design:
// - White page, ink #15121f text, violet #8b5cf6 accent; the article sits in a
//   rounded-[28px] frame with a soft violet shadow, fade masks at the top and bottom of
//   the scroll box
// - Rail (lg): 1px #ece8f7 track; a violet-edged #f3effe pill glides to the active item
//   (framer-motion layoutId) and the parent of an active sub-heading turns ink; nested
//   items are indented, with a "06 / 09" counter, "Back to top" and "Edit this page"
// - Below lg the rail becomes a horizontal chip row above the box that scrolls itself
//   to keep the active chip visible; the box is 460px → sm:520px → lg:600px tall
// - The article uses tinted cards for key types, mono scope pills, a small #14121c code
//   block with token colours and a Copy button, and prev / next page cards at the end
// - Title text-3xl → sm:4xl → lg:5xl; the code block scrolls sideways inside the
//   article

// What it does:
// - An IntersectionObserver with the article box as root (rootMargin -75% bottom) and a
//   debounced scroll-end check mark the last heading above the 25% line as active; the
//   last heading wins at the very bottom; the active link gets aria-current="location"
// - Rail links are #hash anchors whose click is intercepted: the box scrollTo()s the
//   heading (instant for reduced motion), the spy is paused until scrolling ends and
//   the heading receives focus; "Back to top" scrolls the box to 0
// - Copy writes the cURL example via the clipboard API (textarea fallback) and shows
//   "Copied" for 1.8 s; prev / next and edit links point to #hash anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ScrollspyRailOnThisPage from '@/TestComponent/PageSections/knowledge/OnThisPage01';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <ScrollspyRailOnThisPage />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowLeft,
    HiArrowRight,
    HiArrowUp,
    HiCheck,
    HiOutlineClipboardDocument,
    HiOutlineKey,
    HiOutlinePencilSquare,
    HiOutlineUserGroup,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TOC = [
    { id: 'overview', label: 'Overview', level: 1 },
    { id: 'api-keys', label: 'API keys', level: 1 },
    { id: 'create-key', label: 'Create a key', level: 2 },
    { id: 'rotate-key', label: 'Rotate a key', level: 2 },
    { id: 'oauth', label: 'OAuth 2.0', level: 1 },
    { id: 'scopes', label: 'Scopes', level: 2 },
    { id: 'webhooks', label: 'Webhook signatures', level: 1 },
    { id: 'rate-limits', label: 'Rate limits', level: 1 },
    { id: 'errors', label: 'Errors', level: 1 },
]

const SPY_IDS = TOC.map((item) => item.id)
const PARENT = TOC.reduce((acc, item, i) => {
    acc[item.id] = item.level === 2 ? TOC.slice(0, i).findLast((prev) => prev.level === 1).id : null
    return acc
}, {})

const CURL = `curl https://api.stackdocs.dev/v2/pages \\
  -H "Authorization: Bearer sd_live_9f2KqT7mWx41" \\
  -H "Stackdocs-Workspace: acme-docs"`

const CURL_RE = /("(?:[^"\\]|\\.)*")|(-[A-Za-z])|(\\)|([^\s"]+)|(\s+)/g

function tokenizeCurl(line) {
    return [...line.matchAll(CURL_RE)].map((m, i) => {
        const [text, str, flag, slash] = m
        if (str) return { className: 'text-[#86efac]', text }
        if (flag) return { className: 'text-[#c4b5fd]', text }
        if (slash) return { className: 'text-[#6f6987]', text }
        if (i === 0) return { className: 'text-[#7dd3fc]', text }
        return { className: 'text-[#ece9f5]', text }
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
        // clipboard API refused: fall back
    }
    return legacyCopy(text)
}

function useScrollSpy(ids, reduceMotion) {
    const boxRef = useRef(null)
    const headingRefs = useRef({})
    const lockRef = useRef(0)
    const [active, setActive] = useState(ids[0])

    useEffect(() => {
        const root = boxRef.current
        if (!root) return undefined

        const compute = () => {
            const line = root.getBoundingClientRect().top + root.clientHeight * 0.25
            let current = ids[0]
            ids.forEach((id) => {
                const el = headingRefs.current[id]
                if (el && el.getBoundingClientRect().top <= line) current = id
            })
            if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) current = ids[ids.length - 1]
            setActive(current)
        }

        let observer = null
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                () => {
                    if (Date.now() > lockRef.current) compute()
                },
                { root, rootMargin: '0px 0px -75% 0px', threshold: [0, 1] },
            )
            ids.forEach((id) => headingRefs.current[id] && observer.observe(headingRefs.current[id]))
        }

        let idle = null
        const onScroll = () => {
            clearTimeout(idle)
            idle = setTimeout(() => {
                if (Date.now() < lockRef.current) {
                    lockRef.current = 0
                    return
                }
                compute()
            }, 140)
        }
        root.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            observer?.disconnect()
            root.removeEventListener('scroll', onScroll)
            clearTimeout(idle)
        }
    }, [ids])

    const jump = (id) => {
        const root = boxRef.current
        const el = headingRefs.current[id]
        if (!root || !el) return
        const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 20
        lockRef.current = Date.now() + 1500
        root.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' })
        setActive(id)
        el.focus({ preventScroll: true })
    }

    const toTop = () => {
        lockRef.current = Date.now() + 1500
        boxRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
        setActive(ids[0])
    }

    return { boxRef, headingRefs, active, jump, toTop }
}

export function ScrollspyRailOnThisPage({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const { boxRef, headingRefs, active, jump, toTop } = useScrollSpy(SPY_IDS, reduceMotion)
    const chipsRef = useRef(null)
    const [copy, setCopy] = useState({ state: 'idle', n: 0 })
    const curlLines = useMemo(() => CURL.split('\n').map(tokenizeCurl), [])
    const activeIndex = SPY_IDS.indexOf(active)

    useEffect(() => {
        const row = chipsRef.current
        const chip = row?.querySelector(`[data-chip="${active}"]`)
        if (!row || !chip || row.offsetParent === null) return
        row.scrollTo({ left: chip.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' })
    }, [active, reduceMotion])

    useEffect(() => {
        if (copy.state === 'idle') return undefined
        const id = setTimeout(() => setCopy((c) => ({ ...c, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [copy])

    const onCopy = async () => {
        const ok = await copyText(CURL)
        setCopy((c) => ({ state: ok ? 'copied' : 'failed', n: c.n + 1 }))
    }

    const hid = (id) => `${uid}-${id}`
    const headingProps = (id) => ({
        id: hid(id),
        ref: (el) => {
            headingRefs.current[id] = el
        },
        tabIndex: -1,
    })
    const onLink = (event, id) => {
        event.preventDefault()
        jump(id)
    }

    const h3 = 'scroll-mt-6 text-2xl font-semibold tracking-[-0.02em] text-[#15121f] outline-none sm:text-[28px]'
    const h4 = 'scroll-mt-6 text-lg font-semibold tracking-tight text-[#15121f] outline-none'
    const p = 'text-[15.5px] leading-7 text-[#4a4458]'
    const code = 'rounded-md bg-[#f1edfb] px-1.5 py-0.5 font-mono text-[0.86em] text-[#5b21b6]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-white px-4 py-16 text-base font-normal text-[#15121f] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 right-0 h-96 w-[36rem] max-w-full rounded-full bg-[#8b5cf6]/10 blur-3xl"
            />
            <div className="relative mx-auto max-w-6xl">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8b5cf6]">
                    Stackdocs · API reference · Security
                </p>
                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <h2 className="max-w-2xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#15121f] sm:text-4xl lg:text-5xl">
                        Authenticate API requests
                    </h2>
                    <p className="text-sm text-[#6b6480]">7 min read · Updated Sep 14, 2026</p>
                </div>

                <div className="mt-6 lg:hidden">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d86a3]">On this page</p>
                    <nav aria-label="On this page, compact">
                        <ul
                            ref={chipsRef}
                            className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6"
                        >
                            {TOC.map((item) => (
                                <li key={item.id} className="shrink-0">
                                    <a
                                        href={`#${hid(item.id)}`}
                                        data-chip={item.id}
                                        aria-current={active === item.id ? 'location' : undefined}
                                        className={cn(
                                            'inline-flex min-h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]',
                                            active === item.id
                                                ? 'border-[#8b5cf6] bg-[#8b5cf6] text-white'
                                                : 'border-[#ece8f7] bg-white text-[#4a4458]',
                                            item.level === 2 && active !== item.id && 'text-[#8d86a3]',
                                        )}
                                        onClick={(event) => onLink(event, item.id)}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="mt-4 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
                    <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-[#ece8f7] bg-white shadow-[0_40px_80px_-48px_rgba(91,33,182,0.45)]">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b from-white to-transparent"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-white to-transparent"
                        />
                        <div
                            ref={boxRef}
                            role="region"
                            aria-label="Article: Authenticate API requests"
                            tabIndex={0}
                            className="h-[460px] overflow-y-auto overscroll-y-contain px-5 py-8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#8b5cf6] sm:h-[520px] sm:px-10 lg:h-[600px]"
                        >
                            <article className="mx-auto max-w-2xl space-y-5">
                                <p className="text-lg leading-8 text-[#2a2440]">
                                    Every request to the Stackdocs API identifies a workspace. Use a secret key from your
                                    own servers, or OAuth 2.0 when your app acts for somebody else’s workspace.
                                </p>

                                <h3 {...headingProps('overview')} className={cn(h3, 'pt-4')}>
                                    Overview
                                </h3>
                                <p className={p}>
                                    Credentials travel in the <code className={code}>Authorization</code> header over HTTPS
                                    only. Requests over plain HTTP are rejected before they reach your data.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        { icon: HiOutlineKey, title: 'API keys', text: 'Server-to-server jobs, CI and build scripts.' },
                                        { icon: HiOutlineUserGroup, title: 'OAuth 2.0', text: 'Integrations that act for other workspaces.' },
                                    ].map((card) => (
                                        <div key={card.title} className="rounded-2xl border border-[#ece8f7] bg-[#fbfaff] p-4">
                                            <card.icon aria-hidden="true" className="size-5 text-[#8b5cf6]" />
                                            <p className="mt-3 font-semibold text-[#15121f]">{card.title}</p>
                                            <p className="mt-1 text-sm leading-6 text-[#6b6480]">{card.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <h3 {...headingProps('api-keys')} className={cn(h3, 'pt-6')}>
                                    API keys
                                </h3>
                                <p className={p}>
                                    Keys are scoped to one workspace and one environment. Live keys start with{' '}
                                    <code className={code}>sd_live_</code>, test keys with <code className={code}>sd_test_</code>
                                    . Treat both like passwords: never ship them in a browser bundle.
                                </p>
                                <div className="overflow-hidden rounded-2xl bg-[#14121c]">
                                    <div className="flex items-center justify-between border-b border-white/[0.07] py-1 pl-4 pr-1">
                                        <span className="font-mono text-xs text-[#8f89a6]">cURL</span>
                                        <button
                                            type="button"
                                            aria-label={copy.state === 'copied' ? 'Example copied' : 'Copy cURL example'}
                                            className={cn(
                                                'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]',
                                                copy.state === 'copied'
                                                    ? 'bg-[#8b5cf6] text-white'
                                                    : 'text-[#cfc9e3] hover:bg-white/10 hover:text-white',
                                            )}
                                            onClick={onCopy}
                                        >
                                            {copy.state === 'copied' ? (
                                                <HiCheck aria-hidden="true" className="size-4" />
                                            ) : (
                                                <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
                                            )}
                                            {copy.state === 'copied' ? 'Copied' : copy.state === 'failed' ? 'Press ⌘C' : 'Copy'}
                                        </button>
                                    </div>
                                    <pre
                                        aria-label="cURL example"
                                        tabIndex={0}
                                        className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a78bfa]"
                                    >
                                        <code className="block w-max">
                                            {curlLines.map((tokens, i) => (
                                                <span key={i} className="block whitespace-pre">
                                                    {tokens.map((token, j) => (
                                                        <span key={j} className={token.className}>
                                                            {token.text}
                                                        </span>
                                                    ))}
                                                </span>
                                            ))}
                                        </code>
                                    </pre>
                                    <span aria-live="polite" className="sr-only">
                                        {copy.state === 'copied' ? 'cURL example copied to clipboard' : ''}
                                    </span>
                                </div>

                                <h4 {...headingProps('create-key')} className={cn(h4, 'pt-3')}>
                                    Create a key
                                </h4>
                                <ol className="space-y-2.5">
                                    {[
                                        'Open Settings → Developers → API keys.',
                                        'Choose Live or Test, name the key after the service that uses it.',
                                        'Copy the key now — it is shown only once, then stored as a hash.',
                                    ].map((step, i) => (
                                        <li key={step} className="flex gap-3 text-[15.5px] leading-7 text-[#4a4458]">
                                            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[#ede9fe] font-mono text-xs font-semibold text-[#6d28d9]">
                                                {i + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>

                                <h4 {...headingProps('rotate-key')} className={cn(h4, 'pt-3')}>
                                    Rotate a key
                                </h4>
                                <p className={p}>
                                    Rotation creates a new key and keeps the old one valid for a grace period you choose, from
                                    one hour to seven days. Deploy the new key, watch the old key’s{' '}
                                    <code className={code}>last_used_at</code> stop changing, then revoke it.
                                </p>
                                <p className={p}>
                                    Rotate at least every 90 days, and immediately if a key appears in logs, screenshots or a
                                    public repository. Stackdocs scans public code hosts and emails you if it finds one.
                                </p>

                                <h3 {...headingProps('oauth')} className={cn(h3, 'pt-6')}>
                                    OAuth 2.0
                                </h3>
                                <p className={p}>
                                    Integrations listed in the Stackdocs marketplace use the authorization code flow with
                                    PKCE. Users approve access on a consent screen and can revoke it from their workspace at
                                    any time.
                                </p>
                                <p className={p}>
                                    Access tokens expire after one hour; refresh tokens after 60 days of inactivity. Always
                                    store refresh tokens encrypted at rest.
                                </p>

                                <h4 {...headingProps('scopes')} className={cn(h4, 'pt-3')}>
                                    Scopes
                                </h4>
                                <ul className="divide-y divide-[#f1edfb] rounded-2xl border border-[#ece8f7]">
                                    {[
                                        ['pages:read', 'Read published and draft pages'],
                                        ['pages:write', 'Create, edit and publish pages'],
                                        ['search:read', 'Query the search index'],
                                        ['analytics:read', 'Page views and search terms'],
                                    ].map(([scope, text]) => (
                                        <li key={scope} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                                            <code className="w-fit rounded-md bg-[#15121f] px-2 py-0.5 font-mono text-xs text-[#e9e3fb] sm:w-36">
                                                {scope}
                                            </code>
                                            <span className="text-sm text-[#4a4458]">{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <h3 {...headingProps('webhooks')} className={cn(h3, 'pt-6')}>
                                    Webhook signatures
                                </h3>
                                <p className={p}>
                                    Every webhook carries a <code className={code}>Stackdocs-Signature</code> header: an
                                    HMAC-SHA256 of the raw body, signed with your endpoint secret. Compare it with a
                                    constant-time check before you parse the JSON.
                                </p>
                                <p className={p}>
                                    Reject events whose timestamp is more than five minutes old to stop replay attacks. The
                                    official SDKs do both checks for you in one call.
                                </p>

                                <h3 {...headingProps('rate-limits')} className={cn(h3, 'pt-6')}>
                                    Rate limits
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        ['600', 'req / min', 'Live keys'],
                                        ['120', 'req / min', 'Test keys'],
                                        ['60', 'req / min', 'OAuth per user'],
                                    ].map(([value, unit, label]) => (
                                        <div key={label} className="rounded-2xl bg-[#faf8ff] p-3 text-center sm:p-4">
                                            <p className="text-2xl font-semibold tracking-tight text-[#15121f] sm:text-3xl">{value}</p>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-[#8b5cf6]">{unit}</p>
                                            <p className="mt-1 text-xs text-[#6b6480]">{label}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className={p}>
                                    Every response includes <code className={code}>RateLimit-Remaining</code> and{' '}
                                    <code className={code}>RateLimit-Reset</code> so clients can back off before they hit
                                    the ceiling.
                                </p>

                                <h3 {...headingProps('errors')} className={cn(h3, 'pt-6')}>
                                    Errors
                                </h3>
                                <dl className="space-y-3">
                                    {[
                                        ['401', 'Missing, malformed or revoked credentials.'],
                                        ['403', 'Valid credentials without the scope this endpoint needs.'],
                                        ['429', 'Rate limit reached. Retry after the RateLimit-Reset time.'],
                                    ].map(([status, text]) => (
                                        <div key={status} className="flex gap-4 rounded-2xl border border-[#ece8f7] p-4">
                                            <dt className="font-mono text-lg font-semibold text-[#8b5cf6]">{status}</dt>
                                            <dd className="text-[15px] leading-6 text-[#4a4458]">{text}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <footer className="mt-10 border-t border-[#ece8f7] pt-6 pb-40">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <a
                                            href="#stackdocs-quickstart"
                                            className="group rounded-2xl border border-[#ece8f7] p-4 transition-colors hover:border-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                        >
                                            <span className="flex items-center gap-1.5 text-xs text-[#8d86a3]">
                                                <HiArrowLeft aria-hidden="true" className="size-3.5" /> Previous
                                            </span>
                                            <span className="mt-1 block font-semibold text-[#15121f] group-hover:text-[#6d28d9]">
                                                Quickstart
                                            </span>
                                        </a>
                                        <a
                                            href="#stackdocs-pagination"
                                            className="group rounded-2xl border border-[#ece8f7] p-4 text-right transition-colors hover:border-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                        >
                                            <span className="flex items-center justify-end gap-1.5 text-xs text-[#8d86a3]">
                                                Next <HiArrowRight aria-hidden="true" className="size-3.5" />
                                            </span>
                                            <span className="mt-1 block font-semibold text-[#15121f] group-hover:text-[#6d28d9]">
                                                Pagination
                                            </span>
                                        </a>
                                    </div>
                                    <p className="mt-6 text-center text-xs text-[#a8a1bd]">End of article · 9 sections</p>
                                </footer>
                            </article>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d86a3]">On this page</p>
                                <p className="font-mono text-[11px] tabular-nums text-[#a8a1bd]">
                                    {String(activeIndex + 1).padStart(2, '0')} / {String(TOC.length).padStart(2, '0')}
                                </p>
                            </div>
                            <nav aria-label="On this page" className="mt-4">
                                <ul className="relative border-l border-[#ece8f7]">
                                    {TOC.map((item) => {
                                        const isActive = active === item.id
                                        const isParent = PARENT[active] === item.id
                                        return (
                                            <li key={item.id} className="relative">
                                                {isActive && (
                                                    <motion.span
                                                        layoutId={`${uid}-rail-bar`}
                                                        aria-hidden="true"
                                                        className="absolute inset-y-0.5 -left-px right-0 rounded-r-xl border-l-2 border-[#8b5cf6] bg-linear-to-r from-[#f3effe] to-[#faf8ff]"
                                                        transition={
                                                            reduceMotion
                                                                ? { duration: 0 }
                                                                : { type: 'spring', stiffness: 380, damping: 32 }
                                                        }
                                                    />
                                                )}
                                                <a
                                                    href={`#${hid(item.id)}`}
                                                    aria-current={isActive ? 'location' : undefined}
                                                    className={cn(
                                                        'relative flex min-h-10 items-center rounded-r-lg pr-2 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#8b5cf6]',
                                                        item.level === 2 ? 'pl-8 text-[13px]' : 'pl-4',
                                                        isActive
                                                            ? 'font-semibold text-[#6d28d9]'
                                                            : isParent
                                                              ? 'font-medium text-[#15121f]'
                                                              : 'text-[#6b6480] hover:text-[#15121f]',
                                                    )}
                                                    onClick={(event) => onLink(event, item.id)}
                                                >
                                                    {item.label}
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>
                            <div className="mt-6 space-y-1 border-t border-[#ece8f7] pt-4">
                                <button
                                    type="button"
                                    className="flex min-h-10 w-full items-center gap-2 rounded-lg text-sm font-medium text-[#6b6480] hover:text-[#6d28d9] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                    onClick={toTop}
                                >
                                    <HiArrowUp aria-hidden="true" className="size-4" />
                                    Back to top
                                </button>
                                <a
                                    href="#stackdocs-edit-authentication"
                                    className="flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-[#6b6480] hover:text-[#6d28d9] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                >
                                    <HiOutlinePencilSquare aria-hidden="true" className="size-4" />
                                    Edit this page
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default ScrollspyRailOnThisPage

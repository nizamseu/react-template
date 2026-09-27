// MinimapOnThisPage

// OnThisPage05 · Knowledge Bases & Documentation › On-This-Page Navigation

// Description:
// An Orbit Wiki runbook page, "Database failover runbook", whose article scrolls in a
// box with a tiny document minimap beside it: one bar per heading, paragraph, list,
// callout and code block, plus an orange viewport frame showing what is on screen.
// Click or drag the minimap to jump; on lg a heading list sits next to it, on phones a
// "Jump to" select sits above the article. Use it for long wiki pages, runbooks and
// specs.

// Design:
// - Light gray #f4f4f5 page, zinc #18181b text, orange #ea580c accent; white article
//   box (rounded-2xl, 1px #e4e4e7 border) with mono labels and an orange SEV-1 badge
// - Minimap: a white strip as tall as the box (56px wide → lg:72px); paragraphs render
//   as striped text lines, headings as bars (orange when active), code as dark blocks,
//   callouts as #fed7aa blocks; the viewport frame is a 2px orange outline on a 10%
//   tint
// - Grid: article + 56px minimap below lg; article + 72px minimap + 190px heading list
//   on lg; box height 460px → sm:520px → lg:600px; title text-3xl → sm:4xl → lg:5xl
// - The failover commands sit in a #18181b code block with token colours (commands
//   orange, flags amber, strings green, comments zinc) and a Copy button; it scrolls
//   sideways

// What it does:
// - Block positions are measured from the article (offsetTop / scrollHeight,
//   re-measured by a ResizeObserver) with estimated positions for the server render;
//   box scroll moves the viewport frame
// - The minimap is a role="slider": pointer down jumps (smooth), dragging follows the
//   pointer (instant), Arrow / Page / Home / End keys scroll the box; reduced motion =
//   instant
// - An IntersectionObserver rooted on the box (plus a scroll-end check) tracks the
//   active heading for the minimap, the list (aria-current) and the select; list links
//   and the select smooth-scroll to headings; Copy uses the clipboard API with a
//   fallback

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MinimapOnThisPage from '@/TestComponent/PageSections/knowledge/OnThisPage05';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <MinimapOnThisPage />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { HiCheck, HiOutlineClipboardDocument, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const COMMANDS = `# 1. Freeze writes from the app tier
orbitctl maintenance on --service api --reason "db failover"
# 2. Promote the replica in eu-west-1b
orbitctl db promote --cluster wiki-prod --replica eu-west-1b
# 3. Point the app at the new primary, then unfreeze
orbitctl config set DATABASE_HOST=wiki-prod-b.internal --service api
orbitctl maintenance off --service api`

const BLOCKS = [
    { key: 'lead', kind: 'p', w: 0.95, text: 'Follow this page when the primary Postgres cluster for Orbit Wiki (wiki-prod) stops accepting writes. The whole procedure takes 10–15 minutes and needs two people: a driver and a scribe.' },
    { key: 'summary', kind: 'h', w: 0.5, label: 'Summary' },
    { key: 'summary-p', kind: 'p', w: 0.9, text: 'wiki-prod runs a primary in eu-west-1a with a streaming replica in eu-west-1b. Failover promotes the replica, repoints the API and accepts up to five seconds of lost writes.' },
    { key: 'summary-c', kind: 'callout', w: 1, text: 'Start this runbook if writes fail for more than 2 minutes or replication lag passes 30 seconds. Do not wait for the cloud provider’s status page.' },
    { key: 'detection', kind: 'h', w: 0.55, label: 'Detection' },
    { key: 'detection-p', kind: 'p', w: 0.85, text: 'The on-call pager fires one of three alerts. Any of them on its own is enough to begin triage.' },
    { key: 'detection-l', kind: 'list', w: 0.8, items: ['db-primary-unreachable for 2 min', 'api-5xx-rate above 5% for 3 min', 'replication-lag above 30 s'] },
    { key: 'triage', kind: 'h', w: 0.4, label: 'Triage' },
    { key: 'triage-p', kind: 'p', w: 0.92, text: 'Confirm the problem is the database and not the network in between. Check the status of the primary from a bastion host, then look at connection counts on the replica. If the primary answers from the bastion, escalate to networking instead of failing over.' },
    { key: 'triage-l', kind: 'list', w: 0.75, items: ['Primary unreachable from bastion', 'Replica healthy and lag under 5 s', 'Incident channel opened, scribe assigned'] },
    { key: 'procedure', kind: 'h', w: 0.7, label: 'Failover procedure' },
    { key: 'procedure-p', kind: 'p', w: 0.88, text: 'Run the commands in order from the ops bastion. Each step prints a confirmation; stop and page the database lead if any step fails.' },
    { key: 'procedure-code', kind: 'code', w: 1 },
    { key: 'procedure-p2', kind: 'p', w: 0.8, text: 'Promotion usually completes in under 40 seconds. Maintenance mode shows readers a banner and keeps pages viewable while writes are frozen.' },
    { key: 'verification', kind: 'h', w: 0.6, label: 'Verification' },
    { key: 'verification-l', kind: 'list', w: 0.85, items: ['Create and delete a test page in the Sandbox space', 'Search returns results edited in the last hour', 'api-5xx-rate back under 0.5%'] },
    { key: 'communication', kind: 'h', w: 0.65, label: 'Communication' },
    { key: 'communication-p', kind: 'p', w: 0.9, text: 'The scribe posts updates every 15 minutes in #incident and on the status page, even when nothing has changed.' },
    { key: 'communication-q', kind: 'quote', w: 1, text: 'We are failing over the Orbit Wiki database. Pages stay readable; editing is paused for about 10 minutes. Next update at 14:30 UTC.' },
    { key: 'review', kind: 'h', w: 0.75, label: 'Post-incident review' },
    { key: 'review-p', kind: 'p', w: 0.86, text: 'Book a blameless review within two working days. Attach the incident timeline, the replication lag graph and any commands that did not behave as this page describes — then update this runbook.' },
    { key: 'end', kind: 'end', w: 0.4 },
]

const HEADINGS = BLOCKS.filter((b) => b.kind === 'h')
const SPY_IDS = HEADINGS.map((h) => h.key)

const ESTIMATE = (() => {
    const heights = BLOCKS.map((b) => {
        if (b.kind === 'h') return 72
        if (b.kind === 'p') return Math.ceil(b.text.length / 72) * 28 + 20
        if (b.kind === 'list') return b.items.length * 36 + 20
        if (b.kind === 'code') return 240
        if (b.kind === 'callout' || b.kind === 'quote') return 110
        return 200
    })
    const total = heights.reduce((a, b) => a + b, 64)
    let y = 32
    return BLOCKS.map((b, i) => {
        const block = { key: b.key, kind: b.kind, w: b.w, top: y / total, height: heights[i] / total }
        y += heights[i]
        return block
    })
})()

const CMD_RE = /(#.*)|("[^"]*")|(--?[A-Za-z][\w-]*)|([^\s"#]+)|(\s+)/g

function tokenize(line) {
    return [...line.matchAll(CMD_RE)].map((m, i) => {
        const [text, comment, str, flag, word] = m
        if (comment) return { className: 'italic text-[#71717a]', text }
        if (str) return { className: 'text-[#86efac]', text }
        if (flag) return { className: 'text-[#fcd34d]', text }
        if (word && i === 0) return { className: 'font-semibold text-[#fb923c]', text }
        if (word && word.includes('=')) return { className: 'text-[#93c5fd]', text }
        return { className: 'text-[#e4e4e7]', text }
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
        // clipboard blocked: fall back
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

    return { boxRef, headingRefs, active, jump }
}

export function MinimapOnThisPage({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const { boxRef, headingRefs, active, jump } = useScrollSpy(SPY_IDS, reduceMotion)
    const articleRef = useRef(null)
    const trackRef = useRef(null)
    const dragRef = useRef(false)
    const [blocks, setBlocks] = useState(ESTIMATE)
    const [view, setView] = useState({ top: 0, height: 0.2 })
    const [copy, setCopy] = useState({ state: 'idle', n: 0 })
    const codeLines = useMemo(() => COMMANDS.split('\n').map(tokenize), [])

    useEffect(() => {
        const box = boxRef.current
        const article = articleRef.current
        if (!box || !article) return undefined
        const readView = () => {
            const total = box.scrollHeight || 1
            setView({ top: box.scrollTop / total, height: Math.min(1, box.clientHeight / total) })
        }
        const measure = () => {
            const total = box.scrollHeight || 1
            setBlocks(
                [...article.querySelectorAll('[data-mm]')].map((el) => ({
                    key: el.dataset.key,
                    kind: el.dataset.mm,
                    w: Number(el.dataset.w),
                    top: el.offsetTop / total,
                    height: el.offsetHeight / total,
                })),
            )
            readView()
        }
        measure()
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
        ro?.observe(article)
        ro?.observe(box)
        box.addEventListener('scroll', readView, { passive: true })
        return () => {
            ro?.disconnect()
            box.removeEventListener('scroll', readView)
        }
    }, [boxRef])

    useEffect(() => {
        if (copy.state === 'idle') return undefined
        const id = setTimeout(() => setCopy((c) => ({ ...c, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [copy])

    const onCopy = async () => {
        const ok = await copyText(COMMANDS)
        setCopy((c) => ({ state: ok ? 'copied' : 'failed', n: c.n + 1 }))
    }

    const scrollToRatio = (ratio, smooth) => {
        const box = boxRef.current
        if (!box) return
        const top = ratio * box.scrollHeight - box.clientHeight / 2
        box.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' })
    }
    const ratioFrom = (event) => {
        const rect = trackRef.current.getBoundingClientRect()
        return Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    }
    const onPointerDown = (event) => {
        event.preventDefault()
        dragRef.current = true
        trackRef.current.setPointerCapture?.(event.pointerId)
        trackRef.current.focus({ preventScroll: true })
        scrollToRatio(ratioFrom(event), true)
    }
    const onPointerMove = (event) => {
        if (dragRef.current) scrollToRatio(ratioFrom(event), false)
    }
    const onPointerUp = (event) => {
        dragRef.current = false
        trackRef.current.releasePointerCapture?.(event.pointerId)
    }
    const onTrackKey = (event) => {
        const box = boxRef.current
        if (!box) return
        const behavior = reduceMotion ? 'auto' : 'smooth'
        const steps = {
            ArrowDown: box.clientHeight * 0.3,
            ArrowUp: -box.clientHeight * 0.3,
            PageDown: box.clientHeight * 0.9,
            PageUp: -box.clientHeight * 0.9,
        }
        if (event.key in steps) box.scrollBy({ top: steps[event.key], behavior })
        else if (event.key === 'Home') box.scrollTo({ top: 0, behavior })
        else if (event.key === 'End') box.scrollTo({ top: box.scrollHeight, behavior })
        else return
        event.preventDefault()
    }

    const maxTop = Math.max(0.0001, 1 - view.height)
    const pct = Math.round(Math.min(1, view.top / maxTop) * 100)
    const activeLabel = HEADINGS.find((h) => h.key === active)?.label
    const hid = (id) => `${uid}-${id}`
    const onLink = (event, id) => {
        event.preventDefault()
        jump(id)
    }

    const p = 'text-[16px] leading-7 text-[#3f3f46]'

    const renderBlock = (b) => {
        const mm = { 'data-mm': b.kind, 'data-key': b.key, 'data-w': b.w }
        if (b.kind === 'h')
            return (
                <h3
                    key={b.key}
                    ref={(el) => {
                        headingRefs.current[b.key] = el
                    }}
                    {...mm}
                    id={hid(b.key)}
                    tabIndex={-1}
                    className="flex items-baseline gap-3 pt-6 text-2xl font-semibold tracking-[-0.02em] text-[#18181b] outline-none sm:text-[26px]"
                >
                    <span className="font-mono text-sm font-medium text-[#ea580c]">
                        {String(SPY_IDS.indexOf(b.key) + 1).padStart(2, '0')}
                    </span>
                    {b.label}
                </h3>
            )
        if (b.kind === 'p')
            return (
                <p key={b.key} {...mm} className={b.key === 'lead' ? 'text-lg leading-8 text-[#27272a]' : p}>
                    {b.text}
                </p>
            )
        if (b.kind === 'list')
            return (
                <ul key={b.key} {...mm} className="space-y-2">
                    {b.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[15.5px] leading-7 text-[#3f3f46]">
                            <span aria-hidden="true" className="mt-3 h-0.5 w-3 shrink-0 bg-[#ea580c]" />
                            {item}
                        </li>
                    ))}
                </ul>
            )
        if (b.kind === 'callout')
            return (
                <div key={b.key} {...mm} className="flex gap-3 rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4">
                    <HiOutlineExclamationTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#ea580c]" />
                    <p className="text-[15px] leading-6 text-[#7c2d12]">{b.text}</p>
                </div>
            )
        if (b.kind === 'quote')
            return (
                <blockquote
                    key={b.key}
                    {...mm}
                    className="rounded-r-xl border-l-4 border-[#ea580c] bg-[#f4f4f5] px-4 py-3 font-mono text-[13px] leading-6 text-[#3f3f46]"
                >
                    {b.text}
                </blockquote>
            )
        if (b.kind === 'code')
            return (
                <div key={b.key} {...mm} className="overflow-hidden rounded-xl bg-[#18181b]">
                    <div className="flex items-center justify-between border-b border-white/10 py-1 pl-4 pr-1">
                        <span className="font-mono text-xs text-[#a1a1aa]">ops-bastion · bash</span>
                        <button
                            type="button"
                            aria-label={copy.state === 'copied' ? 'Commands copied' : 'Copy failover commands'}
                            className={cn(
                                'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                copy.state === 'copied'
                                    ? 'bg-[#ea580c] text-white'
                                    : 'text-[#d4d4d8] hover:bg-white/5 hover:text-white',
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
                        aria-label="Failover commands"
                        tabIndex={0}
                        className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]"
                    >
                        <code className="block w-max">
                            {codeLines.map((tokens, i) => (
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
                        {copy.state === 'copied' ? 'Failover commands copied to clipboard' : ''}
                    </span>
                </div>
            )
        return (
            <div key={b.key} {...mm} className="pb-40 pt-8">
                <p className="border-t border-[#e4e4e7] pt-5 text-center font-mono text-xs text-[#a1a1aa]">
                    Last reviewed Sep 3, 2026 by Platform team · v14
                </p>
            </div>
        )
    }

    const barClass = (b) => {
        if (b.kind === 'h') return active === b.key ? 'bg-[#ea580c]' : 'bg-[#52525b]'
        if (b.kind === 'p') return 'bg-[repeating-linear-gradient(to_bottom,#d4d4d8_0_2px,transparent_2px_5px)]'
        if (b.kind === 'list') return 'ml-1.5 bg-[repeating-linear-gradient(to_bottom,#e4e4e7_0_2px,transparent_2px_6px)]'
        if (b.kind === 'code') return 'rounded-[2px] bg-[#27272a]'
        if (b.kind === 'callout') return 'rounded-[2px] bg-[#fed7aa]'
        if (b.kind === 'quote') return 'rounded-[2px] border-l-2 border-[#ea580c] bg-[#e4e4e7]'
        return 'hidden'
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-[#f4f4f5] px-4 py-16 text-base font-normal text-[#18181b] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#71717a]">
                    Orbit Wiki / Engineering / Runbooks
                </p>
                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#18181b] sm:text-4xl lg:text-5xl">
                        Database failover runbook
                    </h2>
                    <ul className="flex flex-wrap gap-2 text-xs font-medium">
                        <li className="rounded-md bg-[#ea580c] px-2.5 py-1 font-mono font-semibold text-white">SEV-1</li>
                        <li className="rounded-md border border-[#e4e4e7] bg-white px-2.5 py-1 text-[#52525b]">Owner: Platform team</li>
                        <li className="rounded-md border border-[#e4e4e7] bg-white px-2.5 py-1 text-[#52525b]">12 min read</li>
                    </ul>
                </div>

                <label className="mt-6 flex items-center gap-3 lg:hidden">
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#71717a]">Jump to</span>
                    <select
                        value={active}
                        className="min-h-11 w-full min-w-0 rounded-xl border border-[#d4d4d8] bg-white px-3 text-sm font-semibold text-[#18181b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                        onChange={(event) => jump(event.target.value)}
                    >
                        {HEADINGS.map((h, i) => (
                            <option key={h.key} value={h.key}>
                                {String(i + 1).padStart(2, '0')} · {h.label}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_56px] gap-2.5 sm:gap-4 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_72px_190px] lg:gap-6">
                    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_24px_50px_-36px_rgba(24,24,27,0.4)]">
                        <div
                            ref={boxRef}
                            role="region"
                            aria-label="Article: Database failover runbook"
                            tabIndex={0}
                            className="relative h-[460px] overflow-y-auto overscroll-y-contain px-4 py-8 [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c] sm:h-[520px] sm:px-10 lg:h-[600px]"
                        >
                            <article ref={articleRef} className="mx-auto max-w-2xl space-y-5">
                                {BLOCKS.map(renderBlock)}
                            </article>
                        </div>
                    </div>

                    <div className="h-[460px] rounded-2xl border border-[#e4e4e7] bg-white p-1.5 sm:h-[520px] lg:h-[600px] lg:p-2">
                        <div
                            ref={trackRef}
                            role="slider"
                            tabIndex={0}
                            aria-label="Document minimap"
                            aria-orientation="vertical"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={pct}
                            aria-valuetext={`${pct}% scrolled, section ${activeLabel}`}
                            className="relative h-full cursor-pointer touch-none select-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                            onKeyDown={onTrackKey}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                        >
                            {blocks.map((b) => (
                                <span
                                    key={b.key}
                                    aria-hidden="true"
                                    className={cn('absolute left-0.5 transition-colors duration-300', barClass(b))}
                                    style={{
                                        top: `${b.top * 100}%`,
                                        height: b.kind === 'h' ? 3 : `max(2px, ${b.height * 100}%)`,
                                        width: `calc(${b.w * 100}% - 4px)`,
                                        marginTop: b.kind === 'h' ? 4 : 0,
                                    }}
                                />
                            ))}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-x-0.5 rounded-md border-2 border-[#ea580c] bg-[#ea580c]/10 shadow-[0_4px_14px_-4px_rgba(234,88,12,0.5)]"
                                style={{ top: `${view.top * 100}%`, height: `${view.height * 100}%` }}
                            />
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717a]">On this page</p>
                        <nav aria-label="On this page" className="mt-3">
                            <ol className="space-y-0.5">
                                {HEADINGS.map((h, i) => (
                                    <li key={h.key}>
                                        <a
                                            href={`#${hid(h.key)}`}
                                            aria-current={active === h.key ? 'location' : undefined}
                                            className={cn(
                                                'flex min-h-10 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#ea580c]',
                                                active === h.key
                                                    ? 'bg-white font-semibold text-[#18181b] shadow-[inset_2px_0_0_#ea580c]'
                                                    : 'text-[#71717a] hover:text-[#18181b]',
                                            )}
                                            onClick={(event) => onLink(event, h.key)}
                                        >
                                            <span
                                                className={cn(
                                                    'font-mono text-[11px]',
                                                    active === h.key ? 'text-[#ea580c]' : 'text-[#a1a1aa]',
                                                )}
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            {h.label}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                        <div className="mt-6 rounded-xl border border-[#e4e4e7] bg-white p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717a]">Position</p>
                            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-[#18181b]">{pct}%</p>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#f4f4f5]">
                                <div className="h-full rounded-full bg-[#ea580c]" style={{ width: `${pct}%` }} />
                            </div>
                            <p className="mt-3 text-xs leading-5 text-[#71717a]">Click or drag the minimap to move through the page.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default MinimapOnThisPage

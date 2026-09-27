// CommandPaletteLiveSearch

// LiveSearch01 · Knowledge Bases & Documentation › Live Search with Autocomplete

// Description:
// A dark, developer-grade search entry for the fictional Stackdocs docs. Beside "Every
// answer is one keystroke away." a "Search docs ⌘K" bar opens a modal command palette
// that filters 20 doc pages into Getting started, Guides, API reference and CLI groups
// with highlighted matches, plus a "Last opened" card. Use it at the top of a docs home
// or developer portal.

// Design:
// - Two columns on lg (copy + search bar left, oversized ⌘ / K keycaps, "Last opened"
//   card and index stats right); stacks on base/sm/md; keycaps are 80px → sm:112px →
//   lg:128px
// - Ink #0b0b0f canvas with a masked 56px grid and violet #8b5cf6 radial glow; text
//   #ededf2, muted #a1a1b5, surfaces #131318 with white/10 hairlines; matches marked in
//   #c4b5fd
// - Sans display heading text-4xl → sm:5xl → lg:6xl, mono eyebrows and kbd chips,
//   rounded-2xl panels, violet ring + deep glow shadow on the palette
// - Palette fades/scales in with framer-motion (plain fade for reduced motion); keycaps
//   sink 6px whenever the shortcut fires; the palette is a full-width sheet on mobile,
//   672px on sm+
// - Result rows keep a 48px min height; the palette list caps at min(60vh, 440px) and
//   scrolls

// What it does:
// - ⌘K / Ctrl+K toggles the palette only while focus is inside the section, or while
//   the section is at least 35% in view and nothing else on the page has focus
// - The input is an ARIA combobox (aria-expanded, aria-controls, aria-activedescendant)
//   over a grouped listbox; ↑/↓ move, Enter opens, Escape closes and focus returns to
//   the trigger
// - Empty query shows "Recently viewed" + "Suggested"; no match shows an empty state
//   with one-tap alternative queries; Tab is trapped in the dialog and body scroll is
//   locked
// - Opening a page updates "Last opened" and the recent list; links point to
//   #docs/<page-id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommandPaletteLiveSearch from '@/TestComponent/PageSections/knowledge/LiveSearch01';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <CommandPaletteLiveSearch />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
    HiArrowDown,
    HiArrowTurnDownLeft,
    HiArrowUp,
    HiArrowUpRight,
    HiMagnifyingGlass,
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineCodeBracket,
    HiOutlineCommandLine,
    HiOutlineRocketLaunch,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const groups = [
    { key: 'start', label: 'Getting started', icon: HiOutlineRocketLaunch },
    { key: 'guides', label: 'Guides', icon: HiOutlineBookOpen },
    { key: 'api', label: 'API reference', icon: HiOutlineCodeBracket },
    { key: 'cli', label: 'CLI', icon: HiOutlineCommandLine },
]

const pages = [
    {
        id: 'quickstart',
        group: 'start',
        title: 'Quickstart: deploy in five minutes',
        path: 'Getting started › Quickstart',
        excerpt: 'Create a project, connect a Git repo and ship your first build to a *.stack.app URL.',
        keywords: ['deploy', 'first', 'tutorial', 'git'],
    },
    {
        id: 'install-cli',
        group: 'start',
        title: 'Install the Stack CLI',
        path: 'Getting started › Installation',
        excerpt: 'Run npm i -g @stack/cli, then stack login to link this machine to your workspace.',
        keywords: ['npm', 'setup', 'terminal', 'login'],
    },
    {
        id: 'project-structure',
        group: 'start',
        title: 'Project structure',
        path: 'Getting started › Project structure',
        excerpt: 'Where stack.config.ts, /routes and /edge live, and what each folder is for.',
        keywords: ['folders', 'layout', 'files'],
    },
    {
        id: 'upgrade-v4',
        group: 'start',
        title: 'Upgrading from v3 to v4',
        path: 'Getting started › Upgrade guide',
        excerpt: 'Codemods, renamed config keys and the new persistent build cache in v4.0.',
        keywords: ['migrate', 'migration', 'breaking', 'codemod'],
    },
    {
        id: 'env-vars',
        group: 'guides',
        title: 'Environment variables',
        path: 'Guides › Configuration',
        excerpt: 'Scope variables to Production, Preview or Development and pull them locally.',
        keywords: ['env', 'secrets', 'config', 'dotenv'],
    },
    {
        id: 'custom-domains',
        group: 'guides',
        title: 'Custom domains & TLS',
        path: 'Guides › Networking',
        excerpt: 'Point a CNAME at cname.stack.app; certificates are issued in about 40 seconds.',
        keywords: ['dns', 'ssl', 'https', 'cname', 'certificate'],
    },
    {
        id: 'preview-deploys',
        group: 'guides',
        title: 'Preview deployments',
        path: 'Guides › Workflow',
        excerpt: 'Every pull request gets its own URL, a status comment and optional password protection.',
        keywords: ['pull request', 'branch', 'staging', 'pr'],
    },
    {
        id: 'edge-caching',
        group: 'guides',
        title: 'Edge caching & revalidation',
        path: 'Guides › Performance',
        excerpt: 'Cache-Control, stale-while-revalidate and on-demand purges across 42 regions.',
        keywords: ['cdn', 'cache', 'purge', 'headers'],
    },
    {
        id: 'deploy-hooks',
        group: 'guides',
        title: 'Deploy hooks',
        path: 'Guides › Workflow',
        excerpt: 'Trigger a build from a CMS or a cron job with a unique POST URL per branch.',
        keywords: ['webhook', 'trigger', 'cms', 'build'],
    },
    {
        id: 'rollbacks',
        group: 'guides',
        title: 'Instant rollbacks',
        path: 'Guides › Operations',
        excerpt: 'Promote any previous deployment to production in one click or with stack rollback.',
        keywords: ['revert', 'undo', 'incident'],
    },
    {
        id: 'monorepos',
        group: 'guides',
        title: 'Monorepos & workspaces',
        path: 'Guides › Workflow',
        excerpt: 'Set a root directory per project and skip builds for packages nobody touched.',
        keywords: ['pnpm', 'workspace', 'turbo'],
    },
    {
        id: 'config-ref',
        group: 'api',
        title: 'stack.config.ts reference',
        path: 'API reference › Configuration',
        excerpt: 'Every option for builds, routes, headers, regions and functions, with defaults.',
        keywords: ['config', 'options', 'typescript'],
    },
    {
        id: 'define-route',
        group: 'api',
        title: 'defineRoute()',
        path: 'API reference › Runtime',
        excerpt: 'Declare a route handler with typed params, caching rules and middleware.',
        keywords: ['routing', 'handler', 'function', 'middleware'],
    },
    {
        id: 'rate-limits',
        group: 'api',
        title: 'Rate limits',
        path: 'API reference › REST API',
        excerpt: '600 requests per minute per token; 429 responses include a Retry-After header.',
        keywords: ['429', 'quota', 'throttle', 'limit'],
    },
    {
        id: 'deployments-api',
        group: 'api',
        title: 'Deployments API',
        path: 'API reference › REST API',
        excerpt: 'POST /v4/deployments creates a build; poll GET /v4/deployments/:id for its status.',
        keywords: ['rest', 'endpoint', 'http', 'status'],
    },
    {
        id: 'webhook-events',
        group: 'api',
        title: 'Webhook events',
        path: 'API reference › Events',
        excerpt: 'deployment.succeeded, deployment.failed and domain.verified payloads, signed with HMAC.',
        keywords: ['events', 'signature', 'hmac', 'payload'],
    },
    {
        id: 'cli-deploy',
        group: 'cli',
        title: 'stack deploy',
        path: 'CLI › Commands',
        excerpt: 'Build locally or remotely and upload; --prod promotes straight to production.',
        keywords: ['command', 'ship', 'prod', 'release'],
    },
    {
        id: 'cli-env-pull',
        group: 'cli',
        title: 'stack env pull',
        path: 'CLI › Commands',
        excerpt: 'Write the variables of the current environment to .env.local.',
        keywords: ['env', 'dotenv', 'variables'],
    },
    {
        id: 'cli-logs',
        group: 'cli',
        title: 'stack logs --follow',
        path: 'CLI › Commands',
        excerpt: 'Stream runtime and build logs, filtered by function, region or status code.',
        keywords: ['logs', 'debug', 'tail', 'stream'],
    },
    {
        id: 'cli-login',
        group: 'cli',
        title: 'stack login',
        path: 'CLI › Commands',
        excerpt: 'Authenticate with a browser handshake, or set STACK_TOKEN for CI runners.',
        keywords: ['auth', 'token', 'ci'],
    },
]

const pageById = Object.fromEntries(pages.map((page) => [page.id, page]))
const groupByKey = Object.fromEntries(groups.map((group) => [group.key, group]))
const suggestedIds = ['quickstart', 'env-vars', 'deploy-hooks', 'rate-limits']
const tryQueries = ['deploy', 'env', 'logs', 'cache']
const popularQueries = ['deploy hooks', 'env', 'rate limits', 'stack logs']

function tokenize(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function scorePage(page, tokens) {
    const title = page.title.toLowerCase()
    const haystack = `${page.title} ${page.path} ${page.excerpt} ${page.keywords.join(' ')}`.toLowerCase()
    let score = 0
    for (const token of tokens) {
        if (!haystack.includes(token)) return 0
        if (title.startsWith(token)) score += 8
        else if (title.includes(token)) score += 5
        else if (page.keywords.some((keyword) => keyword.startsWith(token))) score += 3
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
            <mark
                key={index}
                className="rounded-[3px] bg-[#8b5cf6]/20 px-0.5 text-[#c4b5fd] underline decoration-[#8b5cf6] decoration-2 underline-offset-[3px]"
            >
                {part}
            </mark>
        ) : (
            <span key={index}>{part}</span>
        ),
    )
}

export function CommandPaletteLiveSearch({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const rootRef = useRef(null)
    const triggerRef = useRef(null)
    const inputRef = useRef(null)
    const dialogRef = useRef(null)
    const inView = useInView(rootRef, { amount: 0.35 })

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(0)
    const [recent, setRecent] = useState(['custom-domains', 'cli-logs'])
    const [opened, setOpened] = useState(null)
    const [pressed, setPressed] = useState(false)
    const [modLabel, setModLabel] = useState('⌘')

    const listId = `${uid}-list`
    const titleId = `${uid}-title`

    const tokens = useMemo(() => tokenize(query), [query])

    const sections = useMemo(() => {
        if (!tokens.length) {
            return [
                {
                    key: 'recent',
                    label: 'Recently viewed',
                    items: recent.map((id) => pageById[id]),
                },
                {
                    key: 'suggested',
                    label: 'Suggested',
                    items: suggestedIds.filter((id) => !recent.includes(id)).map((id) => pageById[id]),
                },
            ].filter((section) => section.items.length)
        }
        const scored = pages
            .map((page) => ({ page, score: scorePage(page, tokens) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
        const result = []
        for (const { page } of scored) {
            let section = result.find((entry) => entry.key === page.group)
            if (!section) {
                section = { key: page.group, label: groupByKey[page.group].label, items: [] }
                result.push(section)
            }
            section.items.push(page)
        }
        return result
    }, [tokens, recent])

    const flat = useMemo(
        () =>
            sections.flatMap((section) =>
                section.items.map((page) => ({ page, optionId: `${uid}-${section.key}-${page.id}` })),
            ),
        [sections, uid],
    )
    const activeIndex = flat.length ? Math.min(active, flat.length - 1) : -1
    const activeOption = activeIndex >= 0 ? flat[activeIndex] : null

    useEffect(() => {
        const nav = typeof navigator !== 'undefined' ? navigator : null
        const platform = nav?.userAgentData?.platform || nav?.platform || ''
        if (platform && !/mac|iphone|ipad/i.test(platform)) setModLabel('Ctrl')
    }, [])

    useEffect(() => {
        if (!pressed) return undefined
        const id = setTimeout(() => setPressed(false), 220)
        return () => clearTimeout(id)
    }, [pressed])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.defaultPrevented || event.repeat) return
            if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return
            const root = rootRef.current
            if (!root) return
            const focused = document.activeElement
            const focusInside = root.contains(focused)
            const nothingFocused = !focused || focused === document.body || focused === document.documentElement
            if (!focusInside && !(inView && nothingFocused)) return
            event.preventDefault()
            setPressed(true)
            setOpen((value) => !value)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [inView])

    useEffect(() => {
        if (!open) return undefined
        const root = rootRef.current
        const trigger = triggerRef.current
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const frame = requestAnimationFrame(() => inputRef.current?.focus())
        return () => {
            cancelAnimationFrame(frame)
            document.body.style.overflow = previous
            const focused = document.activeElement
            if (!focused || focused === document.body || root?.contains(focused)) {
                trigger?.focus({ preventScroll: true })
            }
        }
    }, [open])

    useEffect(() => {
        if (!open || !activeOption) return
        document.getElementById(activeOption.optionId)?.scrollIntoView({ block: 'nearest' })
    }, [open, activeOption])

    const openPalette = (initialQuery = '') => {
        setQuery(initialQuery)
        setActive(0)
        setPressed(true)
        setOpen(true)
    }

    const closePalette = () => setOpen(false)

    const choose = (page) => {
        setOpened(page)
        setRecent((list) => [page.id, ...list.filter((id) => id !== page.id)].slice(0, 3))
        closePalette()
    }

    const onInputKeyDown = (event) => {
        if (event.key === 'ArrowDown' && flat.length) {
            event.preventDefault()
            setActive((activeIndex + 1) % flat.length)
        } else if (event.key === 'ArrowUp' && flat.length) {
            event.preventDefault()
            setActive((activeIndex - 1 + flat.length) % flat.length)
        } else if (event.key === 'Enter' && activeOption) {
            event.preventDefault()
            choose(activeOption.page)
        }
    }

    const onDialogKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            closePalette()
            return
        }
        if (event.key !== 'Tab' || !dialogRef.current) return
        const focusables = [...dialogRef.current.querySelectorAll('input, button, a[href]')]
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

    const resultLabel = tokens.length
        ? `${flat.length} ${flat.length === 1 ? 'result' : 'results'} for ${query.trim()}`
        : `${flat.length} suggestions`

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b0b0f] px-4 py-16 text-base font-normal text-[#ededf2] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.35),transparent_65%)] blur-2xl"
            />

            <div ref={rootRef} className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                <div>
                    <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.24em] text-[#a1a1b5]">
                        <span className="size-1.5 rounded-full bg-[#8b5cf6] shadow-[0_0_12px_#8b5cf6]" aria-hidden="true" />
                        Stackdocs / Search
                    </p>
                    <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#ededf2] sm:text-5xl lg:text-6xl">
                        Every answer is{' '}
                        <span className="bg-linear-to-r from-[#c4b5fd] via-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">
                            one keystroke
                        </span>{' '}
                        away.
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-[#a1a1b5] sm:text-lg">
                        Search 1,284 pages of guides, API reference and CLI docs. Press{' '}
                        <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-sm text-[#ededf2]">
                            {modLabel} K
                        </kbd>{' '}
                        while you are here, type three letters and hit enter.
                    </p>

                    <button
                        ref={triggerRef}
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        aria-keyshortcuts="Meta+K Control+K"
                        className="group mt-10 flex min-h-14 w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-[#131318] px-4 text-left shadow-[0_20px_50px_-24px_rgba(139,92,246,0.55)] transition-colors duration-200 hover:border-[#8b5cf6]/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6] sm:px-5"
                        onClick={() => openPalette()}
                    >
                        <HiMagnifyingGlass className="size-5 shrink-0 text-[#8b5cf6]" aria-hidden="true" />
                        <span className="flex-1 truncate text-base text-[#a1a1b5] group-hover:text-[#ededf2]">
                            Search docs
                        </span>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-[#ededf2]" aria-hidden="true">
                            <kbd className="grid h-7 min-w-7 place-items-center rounded-md border border-white/15 bg-white/5 px-1.5">
                                {modLabel}
                            </kbd>
                            <kbd className="grid h-7 min-w-7 place-items-center rounded-md border border-white/15 bg-white/5 px-1.5">
                                K
                            </kbd>
                        </span>
                    </button>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="mr-1 font-mono text-xs uppercase tracking-[0.2em] text-[#a1a1b5]">Popular</span>
                        {popularQueries.map((term) => (
                            <button
                                key={term}
                                type="button"
                                className="min-h-10 rounded-full border border-white/10 px-3.5 font-mono text-[13px] text-[#d4d2de] transition-colors duration-200 hover:border-[#8b5cf6]/60 hover:text-[#ededf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                onClick={() => openPalette(term)}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div aria-hidden="true" className="flex items-end justify-center gap-4 sm:gap-5 lg:justify-start">
                        {[modLabel, 'K'].map((cap, index) => (
                            <motion.span
                                key={index === 0 ? 'mod' : 'k'}
                                animate={{ y: pressed && !reduceMotion ? 6 : 0 }}
                                transition={{ type: 'spring', stiffness: 700, damping: 28 }}
                                className={cn(
                                    'grid size-20 place-items-center rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,#24212f,#141319)] font-semibold text-[#ededf2] shadow-[0_10px_0_#2a1f4d,0_30px_60px_-18px_rgba(139,92,246,0.65)] sm:size-28 lg:size-32 lg:rounded-[26px]',
                                    cap.length > 1 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl',
                                    pressed && 'shadow-[0_4px_0_#2a1f4d,0_18px_40px_-18px_rgba(139,92,246,0.9)]',
                                )}
                            >
                                {cap}
                            </motion.span>
                        ))}
                    </div>

                    <div className="mt-12 rounded-2xl border border-white/10 bg-[#131318]/80 p-5 backdrop-blur sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#a1a1b5]">Last opened</p>
                            <p className="font-mono text-xs text-[#a1a1b5]">{opened ? groupByKey[opened.group].label : '—'}</p>
                        </div>
                        <div aria-live="polite">
                            {opened ? (
                                <div className="mt-4">
                                    <p className="text-sm text-[#a1a1b5]">{opened.path}</p>
                                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[#ededf2] sm:text-2xl">
                                        {opened.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#b9b7c6]">{opened.excerpt}</p>
                                    <a
                                        href={`#docs/${opened.id}`}
                                        className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-[#ededf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                    >
                                        Open page
                                        <HiArrowUpRight className="size-4" aria-hidden="true" />
                                    </a>
                                </div>
                            ) : (
                                <p className="mt-4 text-sm leading-relaxed text-[#a1a1b5]">
                                    Nothing yet. Open the palette, pick a result and it lands here with its
                                    breadcrumb and summary.
                                </p>
                            )}
                        </div>
                    </div>

                    <dl className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 text-center">
                        {[
                            ['Pages indexed', '1,284'],
                            ['Median query', '38 ms'],
                            ['Re-indexed', '4 min ago'],
                        ].map(([label, value]) => (
                            <div key={label} className="px-2 py-4">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a1a1b5] sm:text-[11px]">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-base font-semibold text-[#ededf2] sm:text-lg">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="palette"
                            className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-3 sm:px-6 sm:pt-[12vh]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[#050507]/75 backdrop-blur-sm"
                                onClick={closePalette}
                            />
                            <motion.div
                                ref={dialogRef}
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={titleId}
                                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }}
                                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#131318] text-[#ededf2] shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_40px_100px_-30px_rgba(139,92,246,0.55)] sm:max-h-[76vh]"
                                onKeyDown={onDialogKeyDown}
                            >
                                <h3 id={titleId} className="sr-only text-base font-semibold text-[#ededf2]">
                                    Search Stackdocs
                                </h3>
                                <div className="flex items-center gap-3 border-b border-white/10 px-4 sm:px-5">
                                    <HiMagnifyingGlass className="size-5 shrink-0 text-[#8b5cf6]" aria-hidden="true" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        role="combobox"
                                        aria-label="Search docs"
                                        aria-expanded="true"
                                        aria-controls={listId}
                                        aria-autocomplete="list"
                                        aria-activedescendant={activeOption?.optionId}
                                        autoComplete="off"
                                        spellCheck="false"
                                        placeholder="Search guides, API, CLI…"
                                        value={query}
                                        className="h-14 min-w-0 flex-1 bg-transparent text-base text-[#ededf2] placeholder:text-[#6f6d7e] focus:outline-none"
                                        onChange={(event) => {
                                            setQuery(event.target.value)
                                            setActive(0)
                                        }}
                                        onKeyDown={onInputKeyDown}
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            aria-label="Clear search"
                                            className="grid size-10 shrink-0 place-items-center rounded-lg text-[#a1a1b5] hover:bg-white/5 hover:text-[#ededf2] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                            onClick={() => {
                                                setQuery('')
                                                setActive(0)
                                                inputRef.current?.focus()
                                            }}
                                        >
                                            <HiXMark className="size-4" aria-hidden="true" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Close search"
                                        className="grid h-10 shrink-0 place-items-center rounded-lg border border-white/10 px-2 font-mono text-[11px] uppercase text-[#a1a1b5] hover:text-[#ededf2] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                        onClick={closePalette}
                                    >
                                        Esc
                                    </button>
                                </div>

                                <p className="sr-only" aria-live="polite">
                                    {resultLabel}
                                </p>

                                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-[min(60vh,440px)]">
                                    {flat.length ? (
                                        <ul id={listId} role="listbox" aria-label="Search results" className="space-y-1">
                                            {sections.map((section) => {
                                                const labelId = `${uid}-${section.key}-label`
                                                return (
                                                    <li key={section.key} role="presentation">
                                                        <p
                                                            id={labelId}
                                                            className="flex items-center gap-2 px-3 pb-1.5 pt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8a889b]"
                                                        >
                                                            {section.key === 'recent' && (
                                                                <HiOutlineClock className="size-3.5" aria-hidden="true" />
                                                            )}
                                                            {section.label}
                                                        </p>
                                                        <ul role="group" aria-labelledby={labelId}>
                                                            {section.items.map((page) => {
                                                                const optionId = `${uid}-${section.key}-${page.id}`
                                                                const isActive = activeOption?.optionId === optionId
                                                                const Icon = groupByKey[page.group].icon
                                                                return (
                                                                    <li
                                                                        key={optionId}
                                                                        id={optionId}
                                                                        role="option"
                                                                        aria-selected={isActive}
                                                                        className={cn(
                                                                            'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-100',
                                                                            isActive ? 'bg-[#8b5cf6]/15' : 'hover:bg-white/[0.03]',
                                                                        )}
                                                                        onMouseMove={() =>
                                                                            setActive(flat.findIndex((entry) => entry.optionId === optionId))
                                                                        }
                                                                        onClick={() => choose(page)}
                                                                    >
                                                                        <span
                                                                            className={cn(
                                                                                'grid size-9 shrink-0 place-items-center rounded-lg border',
                                                                                isActive
                                                                                    ? 'border-[#8b5cf6]/50 bg-[#8b5cf6]/20 text-[#c4b5fd]'
                                                                                    : 'border-white/10 bg-white/[0.03] text-[#a1a1b5]',
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <Icon className="size-4" />
                                                                        </span>
                                                                        <span className="min-w-0 flex-1">
                                                                            <span
                                                                                className={cn(
                                                                                    'block truncate text-[15px] font-medium',
                                                                                    page.group === 'cli' || page.group === 'api'
                                                                                        ? 'font-mono text-[14px]'
                                                                                        : '',
                                                                                    isActive ? 'text-[#ededf2]' : 'text-[#d4d2de]',
                                                                                )}
                                                                            >
                                                                                <Highlight text={page.title} tokens={tokens} />
                                                                            </span>
                                                                            <span className="mt-0.5 block truncate text-xs text-[#8a889b]">
                                                                                <Highlight text={page.path} tokens={tokens} />
                                                                            </span>
                                                                        </span>
                                                                        <HiArrowTurnDownLeft
                                                                            className={cn(
                                                                                'size-4 shrink-0 text-[#c4b5fd] transition-opacity',
                                                                                isActive ? 'opacity-100' : 'opacity-0',
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <div id={listId} className="px-4 py-12 text-center">
                                            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#8b5cf6]">
                                                <HiMagnifyingGlass className="size-5" aria-hidden="true" />
                                            </span>
                                            <p className="mt-4 text-base font-medium text-[#ededf2]">
                                                No results for “{query.trim()}”
                                            </p>
                                            <p className="mt-1.5 text-sm text-[#a1a1b5]">
                                                Check the spelling, or try one of these:
                                            </p>
                                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                                {tryQueries.map((term) => (
                                                    <button
                                                        key={term}
                                                        type="button"
                                                        className="min-h-10 rounded-full border border-white/10 px-3.5 font-mono text-[13px] text-[#d4d2de] hover:border-[#8b5cf6]/60 hover:text-[#ededf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                                        onClick={() => {
                                                            setQuery(term)
                                                            setActive(0)
                                                            inputRef.current?.focus()
                                                        }}
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                            <a
                                                href="#community-help"
                                                className="mt-5 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#c4b5fd] hover:text-[#ededf2] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                            >
                                                Ask in the community forum
                                                <HiArrowUpRight className="size-4" aria-hidden="true" />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 font-mono text-[11px] text-[#8a889b] sm:px-5">
                                    <span className="hidden items-center gap-4 sm:flex" aria-hidden="true">
                                        <span className="flex items-center gap-1.5">
                                            <HiArrowUp className="size-3.5" />
                                            <HiArrowDown className="size-3.5" />
                                            navigate
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <HiArrowTurnDownLeft className="size-3.5" />
                                            open
                                        </span>
                                        <span>esc close</span>
                                    </span>
                                    <span>{tokens.length ? `${flat.length} of ${pages.length} pages` : 'Stackdocs v4.2'}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

export default CommandPaletteLiveSearch

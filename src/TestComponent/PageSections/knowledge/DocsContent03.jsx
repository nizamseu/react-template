// TutorialChecklistDocsContent

// DocsContent03 · Knowledge Bases & Documentation › Main Content Area

// Description:
// A hands-on Helpbase tutorial, "Launch your help center in six steps", where each step
// is an expandable card with instructions, a small UI preview or code snippet and a
// "Mark as done" checkbox. A sticky progress card at the top shows "2 of 6 done", a
// segmented bar and the minutes left; finishing every step reveals "Your help center is
// live". Use it for onboarding tutorials, setup checklists or course-style docs.

// Design:
// - White page with a pale blue #eff6ff wash at the top, slate #0f172a text and blue
//   #2563eb for progress, checks, focus rings and links; single 768px reading column
// - Progress card: white, rounded-3xl, sticky top-3 while the steps scroll; a 6-segment
//   bar whose segments fill blue (motion width) and double as jump buttons
// - Step cards: rounded-3xl, 1px slate border; the open card lifts with a blue ring and
//   a soft shadow, done cards dim with a filled blue check; previews are drawn with
//   markup
// - Step 5 has a light code panel (#f8fafc) with HTML token colours (tags blue,
//   attributes violet, strings emerald, comments slate) and a Copy button; it scrolls
//   sideways inside
// - Responsive: title text-4xl → sm:5xl → lg:6xl; header meta wraps; step bodies and
//   footers stack below sm; the finish banner stacks its button under the text below sm

// What it does:
// - done (array) starts at ["workspace", "import"] and open at "categories"; toggling
//   "Mark as done" updates the bar, the "x of 6" count and minutes left, collapses the
//   card and opens the next unfinished step
// - Step headers are buttons with aria-expanded; progress segments open their step and
//   scroll it into view (instant scroll for reduced motion); "Reset" clears everything
// - Copy uses the clipboard API with a textarea fallback and shows "Copied" for 1.8 s;
//   links (#helpbase-custom-domain, #helpbase-open-help-center, ...) are #hash anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TutorialChecklistDocsContent from '@/TestComponent/PageSections/knowledge/DocsContent03';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <TutorialChecklistDocsContent />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiArrowUpRight,
    HiCheck,
    HiChevronDown,
    HiOutlineArrowPath,
    HiOutlineBars3BottomLeft,
    HiOutlineClipboardDocument,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const WIDGET = `<!-- Helpbase widget: paste before </body> -->
<script
  src="https://widget.helpbase.io/v2/loader.js"
  data-workspace="acme"
  data-position="bottom-right"
  data-greeting="Hi! Search our guides or ask us."
  defer
></script>`

const steps = [
    {
        id: 'workspace',
        title: 'Create your workspace',
        minutes: 3,
        body: 'Choose a subdomain for your help center. Customers will see it in every link, so keep it short — you can connect a custom domain later.',
        preview: 'workspace',
    },
    {
        id: 'import',
        title: 'Import your existing articles',
        minutes: 5,
        body: 'Upload a CSV or a zipped Markdown folder. Helpbase keeps headings, images and internal links, and flags anything it could not convert.',
        preview: 'import',
    },
    {
        id: 'categories',
        title: 'Organise categories',
        minutes: 4,
        body: 'Drag categories into the order customers expect. Six to eight top-level categories is the sweet spot — deeper topics belong in sections.',
        preview: 'categories',
    },
    {
        id: 'brand',
        title: 'Brand your help center',
        minutes: 4,
        body: 'Upload your logo, pick an accent colour and write a one-line greeting for the search hero. Changes preview live before you publish.',
        preview: 'brand',
    },
    {
        id: 'widget',
        title: 'Add the help widget to your site',
        minutes: 5,
        body: 'Paste this snippet before the closing body tag of your app. The widget opens search, suggested articles and chat without leaving the page.',
        preview: 'widget',
    },
    {
        id: 'publish',
        title: 'Publish and share',
        minutes: 4,
        body: 'Switch visibility to Public, then share the link in your app menu, email footer and auto-replies. Search engines start indexing within a day.',
        preview: 'publish',
    },
]

const HTML_RE = /(<!--.*?-->)|(<\/?[A-Za-z][\w-]*|\/?>)|("[^"]*")|([A-Za-z_:][\w:.-]*(?==))|([A-Za-z][\w-]*)|(\s+)|([\s\S])/g

const TOKEN_CLASS = {
    comment: 'italic text-[#94a3b8]',
    tag: 'text-[#1d4ed8]',
    string: 'text-[#047857]',
    attr: 'text-[#7c3aed]',
    plain: 'text-[#334155]',
}

function tokenizeHtml(line) {
    return [...line.matchAll(HTML_RE)].map((m) => {
        const [text, comment, tag, str, attr] = m
        if (comment) return { type: 'comment', text }
        if (tag) return { type: 'tag', text }
        if (str) return { type: 'string', text }
        if (attr) return { type: 'attr', text }
        return { type: 'plain', text }
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
        // clipboard permission denied: try the legacy path
    }
    return legacyCopy(text)
}

function WidgetCode() {
    const [status, setStatus] = useState({ state: 'idle', n: 0 })
    const lines = useMemo(() => WIDGET.split('\n').map(tokenizeHtml), [])

    useEffect(() => {
        if (status.state === 'idle') return undefined
        const id = setTimeout(() => setStatus((s) => ({ ...s, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [status])

    const onCopy = async () => {
        const ok = await copyText(WIDGET)
        setStatus((s) => ({ state: ok ? 'copied' : 'failed', n: s.n + 1 }))
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]">
            <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] bg-white py-1.5 pl-4 pr-1.5">
                <p className="flex items-center gap-2 font-mono text-xs text-[#475569]">
                    <HiOutlineDocumentText aria-hidden="true" className="size-4 text-[#2563eb]" />
                    index.html
                </p>
                <button
                    type="button"
                    aria-label={status.state === 'copied' ? 'Widget snippet copied' : 'Copy widget snippet'}
                    className={cn(
                        'inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]',
                        status.state === 'copied'
                            ? 'bg-[#2563eb] text-white'
                            : 'text-[#334155] hover:bg-[#eff6ff] hover:text-[#1d4ed8]',
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
                aria-label="Help widget HTML snippet"
                tabIndex={0}
                className="overflow-x-auto py-3.5 font-mono text-[12.5px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563eb]"
            >
                <code className="block w-max min-w-full">
                    {lines.map((tokens, i) => (
                        <span key={i} className={cn('flex pr-5', i === 3 && 'bg-[#dbeafe]/70')}>
                            <span aria-hidden="true" className="w-9 shrink-0 select-none pr-3 text-right text-[#cbd5e1]">
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
                {status.state === 'copied' ? 'Widget snippet copied to clipboard' : ''}
            </span>
        </div>
    )
}

function Preview({ kind }) {
    if (kind === 'workspace')
        return (
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <p className="text-xs font-semibold text-[#475569]">Help center address</p>
                <div className="mt-2 flex min-w-0 items-center overflow-hidden rounded-xl border border-[#bfdbfe] bg-white text-sm ring-4 ring-[#dbeafe]/60">
                    <HiOutlineGlobeAlt aria-hidden="true" className="ml-3 size-4 shrink-0 text-[#2563eb]" />
                    <span className="min-w-0 truncate px-2 py-2.5 font-semibold text-[#0f172a]">acme</span>
                    <span className="ml-auto shrink-0 border-l border-[#e2e8f0] bg-[#f1f5f9] px-3 py-2.5 text-[#64748b]">
                        .helpbase.io
                    </span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#15803d]">
                    <HiCheck aria-hidden="true" className="size-3.5" /> acme.helpbase.io is available
                </p>
            </div>
        )
    if (kind === 'import')
        return (
            <ul className="grid grid-cols-3 gap-2 text-center">
                {[
                    ['142', 'articles'],
                    ['12', 'categories'],
                    ['3', 'to review'],
                ].map(([value, label], i) => (
                    <li
                        key={label}
                        className={cn(
                            'rounded-2xl border px-2 py-3',
                            i === 2 ? 'border-[#fde68a] bg-[#fffbeb]' : 'border-[#e2e8f0] bg-[#f8fafc]',
                        )}
                    >
                        <span className="block text-2xl font-semibold tracking-tight text-[#0f172a]">{value}</span>
                        <span className="text-xs text-[#64748b]">{label}</span>
                    </li>
                ))}
            </ul>
        )
    if (kind === 'categories')
        return (
            <ol className="space-y-1.5">
                {['Getting started', 'Billing & plans', 'Account & security', 'Integrations'].map((name, i) => (
                    <li
                        key={name}
                        className={cn(
                            'flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-sm',
                            i === 1
                                ? 'translate-x-2 rotate-[-0.6deg] border-[#93c5fd] shadow-[0_10px_24px_-12px_rgba(37,99,235,0.45)]'
                                : 'border-[#e2e8f0]',
                        )}
                    >
                        <HiOutlineBars3BottomLeft aria-hidden="true" className="size-4 shrink-0 text-[#94a3b8]" />
                        <span className="font-medium text-[#0f172a]">{name}</span>
                        <span className="ml-auto text-xs text-[#94a3b8]">{[18, 24, 15, 31][i]} articles</span>
                    </li>
                ))}
            </ol>
        )
    if (kind === 'brand')
        return (
            <div className="overflow-hidden rounded-2xl border border-[#e2e8f0]">
                <div className="bg-[#1e3a8a] px-4 py-5 text-center">
                    <p className="text-sm font-semibold text-white">How can we help?</p>
                    <div className="mx-auto mt-3 h-9 max-w-xs rounded-full bg-white/95" />
                </div>
                <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3">
                    <span className="text-xs font-semibold text-[#475569]">Accent</span>
                    {['#1e3a8a', '#2563eb', '#0d9488', '#9333ea', '#e11d48'].map((hex, i) => (
                        <span
                            key={hex}
                            aria-hidden="true"
                            className={cn('size-6 rounded-full', i === 0 && 'ring-2 ring-offset-2 ring-[#1e3a8a]')}
                            style={{ backgroundColor: hex }}
                        />
                    ))}
                </div>
            </div>
        )
    if (kind === 'widget') return <WidgetCode />
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <span aria-hidden="true" className="relative h-6 w-11 rounded-full bg-[#2563eb]">
                    <span className="absolute right-1 top-1 size-4 rounded-full bg-white" />
                </span>
                <span className="text-sm font-semibold text-[#0f172a]">Visibility: Public</span>
            </div>
            <a
                href="#helpbase-open-help-center"
                className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
            >
                acme.helpbase.io
                <HiArrowUpRight aria-hidden="true" className="size-4" />
            </a>
        </div>
    )
}

export function TutorialChecklistDocsContent({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [done, setDone] = useState(['workspace', 'import'])
    const [open, setOpen] = useState('categories')
    const cardRefs = useRef({})

    const doneCount = done.length
    const pct = Math.round((doneCount / steps.length) * 100)
    const minutesLeft = steps.filter((s) => !done.includes(s.id)).reduce((sum, s) => sum + s.minutes, 0)
    const complete = doneCount === steps.length

    const toggleDone = (id) => {
        if (done.includes(id)) {
            setDone(done.filter((d) => d !== id))
            return
        }
        const nextDone = [...done, id]
        setDone(nextDone)
        const index = steps.findIndex((s) => s.id === id)
        const next =
            steps.slice(index + 1).find((s) => !nextDone.includes(s.id)) ?? steps.find((s) => !nextDone.includes(s.id))
        setOpen(next ? next.id : null)
    }

    const jumpTo = (id) => {
        setOpen(id)
        cardRefs.current[id]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }

    const reset = () => {
        setDone([])
        setOpen(steps[0].id)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-white px-4 pb-16 pt-14 text-base font-normal text-[#0f172a] sm:px-6 md:pb-24 md:pt-20 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-linear-to-b from-[#eff6ff] via-[#f8fbff] to-white"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full border-[40px] border-[#dbeafe]/60 sm:size-96"
            />

            <div className="relative mx-auto max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-3 py-1 text-xs font-semibold text-white">
                    Tutorial
                    <span aria-hidden="true" className="h-3 w-px bg-white/40" />
                    Helpbase Academy
                </p>
                <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#0f172a] sm:text-5xl lg:text-6xl">
                    Launch your help center in six steps
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">
                    Work through each step at your own pace. We save your place, so you can close the tab after importing
                    and pick up again with branding tomorrow.
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#475569]">
                    <li className="flex items-center gap-2">
                        <HiOutlineClock aria-hidden="true" className="size-4 text-[#2563eb]" />
                        25 minutes total
                    </li>
                    <li className="flex items-center gap-2">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2563eb]" />
                        No code needed except step 5
                    </li>
                    <li className="flex items-center gap-2">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2563eb]" />
                        Updated Sep 9, 2026
                    </li>
                </ul>

                <div className="sticky top-3 z-20 mt-10 rounded-3xl border border-[#e2e8f0] bg-white/90 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <p className="text-sm text-[#475569]">
                            <span className="text-2xl font-bold tabular-nums tracking-tight text-[#0f172a]">{pct}%</span>
                            <span className="ml-2">
                                {doneCount} of {steps.length} steps done
                            </span>
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-[#64748b]">
                                {complete ? 'All done' : `About ${minutesLeft} min left`}
                            </span>
                            <button
                                type="button"
                                aria-label="Reset tutorial progress"
                                className="grid size-10 place-items-center rounded-xl text-[#64748b] transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                onClick={reset}
                            >
                                <HiOutlineArrowPath aria-hidden="true" className="size-4" />
                            </button>
                        </div>
                    </div>
                    <div role="group" aria-label="Jump to a step" className="mt-3 grid grid-cols-6 gap-1.5">
                        {steps.map((step, i) => {
                            const isDone = done.includes(step.id)
                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    aria-label={`Step ${i + 1}: ${step.title}${isDone ? ', done' : ''}`}
                                    className="group flex min-h-10 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                    onClick={() => jumpTo(step.id)}
                                >
                                    <span className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0] transition-colors group-hover:bg-[#cbd5e1]">
                                        <motion.span
                                            className="absolute inset-y-0 left-0 rounded-full bg-[#2563eb]"
                                            initial={false}
                                            animate={{ width: isDone ? '100%' : open === step.id ? '18%' : '0%' }}
                                            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <ol className="mt-8 space-y-4">
                    {steps.map((step, i) => {
                        const isDone = done.includes(step.id)
                        const isOpen = open === step.id
                        const panelId = `${uid}-${step.id}-panel`
                        const checkId = `${uid}-${step.id}-check`
                        return (
                            <li
                                key={step.id}
                                ref={(el) => {
                                    cardRefs.current[step.id] = el
                                }}
                                className={cn(
                                    'scroll-mt-36 rounded-3xl border bg-white transition-[border-color,box-shadow] duration-300',
                                    isOpen
                                        ? 'border-[#93c5fd] shadow-[0_0_0_4px_rgba(219,234,254,0.8),0_24px_48px_-28px_rgba(37,99,235,0.45)]'
                                        : 'border-[#e2e8f0] hover:border-[#cbd5e1]',
                                )}
                            >
                                <h3 className="text-base font-semibold text-[#0f172a]">
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        className="flex min-h-16 w-full items-center gap-4 rounded-3xl px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] sm:px-6"
                                        onClick={() => setOpen(isOpen ? null : step.id)}
                                    >
                                        <span
                                            className={cn(
                                                'grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-bold transition-colors duration-300',
                                                isDone
                                                    ? 'bg-[#2563eb] text-white'
                                                    : isOpen
                                                      ? 'bg-[#dbeafe] text-[#1d4ed8]'
                                                      : 'bg-[#f1f5f9] text-[#64748b]',
                                            )}
                                        >
                                            {isDone ? <HiCheck aria-hidden="true" className="size-5" /> : i + 1}
                                            {isDone && <span className="sr-only">Done:</span>}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span
                                                className={cn(
                                                    'block text-[17px] font-semibold leading-snug tracking-tight sm:text-lg',
                                                    isDone && !isOpen ? 'text-[#64748b]' : 'text-[#0f172a]',
                                                )}
                                            >
                                                {step.title}
                                            </span>
                                            <span className="mt-0.5 block text-xs font-medium text-[#94a3b8]">
                                                Step {i + 1} · {step.minutes} min
                                            </span>
                                        </span>
                                        <HiChevronDown
                                            aria-hidden="true"
                                            className={cn(
                                                'size-5 shrink-0 text-[#94a3b8] transition-transform duration-300',
                                                isOpen && 'rotate-180 text-[#2563eb]',
                                            )}
                                        />
                                    </button>
                                </h3>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={panelId}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-5 sm:px-6 sm:pb-6 sm:pl-20">
                                                <p className="text-[15.5px] leading-7 text-[#334155]">{step.body}</p>
                                                <div className="mt-4">
                                                    <Preview kind={step.preview} />
                                                </div>
                                                <div className="mt-5 flex flex-col gap-3 border-t border-[#f1f5f9] pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <label
                                                        htmlFor={checkId}
                                                        className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-[#0f172a]"
                                                    >
                                                        <input
                                                            id={checkId}
                                                            type="checkbox"
                                                            checked={isDone}
                                                            className="peer sr-only"
                                                            onChange={() => toggleDone(step.id)}
                                                        />
                                                        <span
                                                            aria-hidden="true"
                                                            className="grid size-6 place-items-center rounded-lg border-2 border-[#cbd5e1] bg-white text-transparent transition-colors group-hover:border-[#2563eb] peer-checked:border-[#2563eb] peer-checked:bg-[#2563eb] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2563eb]"
                                                        >
                                                            <HiCheck className="size-4" />
                                                        </span>
                                                        Mark as done
                                                    </label>
                                                    {i === 0 && (
                                                        <a
                                                            href="#helpbase-custom-domain"
                                                            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                                        >
                                                            Use a custom domain instead
                                                            <HiArrowRight aria-hidden="true" className="size-4" />
                                                        </a>
                                                    )}
                                                    {i > 0 && i < steps.length - 1 && (
                                                        <p className="text-xs text-[#94a3b8]">
                                                            Next: {steps[i + 1].title}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        )
                    })}
                </ol>

                <AnimatePresence>
                    {complete && (
                        <motion.div
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="relative mt-8 overflow-hidden rounded-3xl bg-[#2563eb] p-6 text-white sm:p-8"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10"
                            />
                            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bfdbfe]">
                                        6 of 6 complete
                                    </p>
                                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        Your help center is live.
                                    </h3>
                                    <p className="mt-1 text-sm text-[#dbeafe]">Customers can find it at acme.helpbase.io</p>
                                </div>
                                <a
                                    href="#helpbase-open-help-center"
                                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-[#1d4ed8] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Open help center
                                    <HiArrowUpRight aria-hidden="true" className="size-4" />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <p aria-live="polite" className="sr-only">
                    {`${doneCount} of ${steps.length} steps done`}
                </p>
            </div>
        </section>
    )
}

export default TutorialChecklistDocsContent

// APIReferenceDocsContent

// DocsContent02 · Knowledge Bases & Documentation › Main Content Area

// Description:
// An API reference page for the Nimbus Developer Hub documenting "Create a payment"
// (POST /v1/payments). An endpoint bar with the full URL sits above auth, idempotency
// and rate-limit chips, a parameters table (headers + body, nested child attributes),
// request examples in cURL / JavaScript / Python and a response block with 200 and 402
// examples. Use it as the template for any REST endpoint page in a developer portal.

// Design:
// - Deep navy #0f172a canvas with a faint cyan blueprint grid and glow; cyan #22d3ee is
//   the only accent (method badge, required markers, tab indicator, focus rings)
// - Endpoint bar: POST badge + mono path with the version segment tinted and a copy-URL
//   button, under a status pill with a pulsing (motion-safe) "Operational" dot; title
//   text-3xl → sm:4xl → lg:5xl
// - Parameters render as an ARIA table: column headers and a 3-column grid from md,
//   stacked name/type chips over the description below md; enum values show as mono
//   chips
// - Code panels are #020617 cards with sliding underline tabs, line numbers and custom
//   token colours (keys cyan, strings lime, numbers amber, keywords pink, comments
//   slate)
// - Layout: one column below lg; on lg the params (left) and a sticky request/response
//   stack (right) sit side by side; code scrolls horizontally inside its panel

// What it does:
// - "Show optional" is a role="switch" that hides or reveals optional parameters; "Show
//   child attributes" expands nested fields of payment_method (aria-expanded)
// - Request tabs (cURL / JavaScript / Python) and response tabs (200 / 402) are
//   tablists with arrow-key support; Copy buttons copy the visible snippet or the
//   endpoint URL (clipboard API with a textarea fallback) and show "Copied" for 1.8 s
// - "Run in sandbox" fakes a request: a 900 ms timer (cleared on unmount) then selects
//   the 200 tab and shows "200 OK · 184 ms"; nothing is sent over the network

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import APIReferenceDocsContent from '@/TestComponent/PageSections/knowledge/DocsContent02';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <APIReferenceDocsContent />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    HiCheck,
    HiChevronDown,
    HiOutlineArrowPath,
    HiOutlineBolt,
    HiOutlineClipboardDocument,
    HiOutlineKey,
    HiOutlinePlay,
    HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const BASE_URL = 'https://api.nimbus.dev/v1/payments'

const REQUESTS = {
    cURL: {
        lang: 'bash',
        code: `curl https://api.nimbus.dev/v1/payments \\
  -H "Authorization: Bearer sk_test_nb_7Qx2Lm9Vb4Rt" \\
  -H "Idempotency-Key: 8f2c1d7e-order-10482" \\
  -d amount=4999 \\
  -d currency=usd \\
  -d "payment_method[type]=card" \\
  -d "payment_method[token]=tok_visa_4242" \\
  -d description="Order #10482"`,
    },
    JavaScript: {
        lang: 'js',
        code: `import Nimbus from '@nimbus/node'

const nimbus = new Nimbus(process.env.NIMBUS_SECRET_KEY)

const payment = await nimbus.payments.create(
    {
        amount: 4999,
        currency: 'usd',
        payment_method: { type: 'card', token: 'tok_visa_4242' },
        description: 'Order #10482',
    },
    { idempotencyKey: '8f2c1d7e-order-10482' },
)
// payment.status === 'succeeded'`,
    },
    Python: {
        lang: 'python',
        code: `import os
import nimbus

nimbus.api_key = os.environ["NIMBUS_SECRET_KEY"]

payment = nimbus.Payment.create(
    amount=4999,
    currency="usd",
    payment_method={"type": "card", "token": "tok_visa_4242"},
    description="Order #10482",
    idempotency_key="8f2c1d7e-order-10482",
)
print(payment.status)  # "succeeded"`,
    },
}

const RESPONSES = {
    '200': {
        label: '200 OK',
        tone: 'ok',
        code: `{
  "id": "pay_3Nx8QkLr2vT9",
  "object": "payment",
  "amount": 4999,
  "currency": "usd",
  "status": "succeeded",
  "captured": true,
  "payment_method": {
    "type": "card",
    "brand": "visa",
    "last4": "4242"
  },
  "customer": null,
  "created": 1790467200,
  "livemode": false
}`,
    },
    '402': {
        label: '402 Failed',
        tone: 'error',
        code: `{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "decline_code": "insufficient_funds",
    "message": "The card has insufficient funds.",
    "param": "payment_method",
    "request_id": "req_Fq81ZbV0kd"
  }
}`,
    },
}

const headerParams = [
    {
        name: 'Authorization',
        type: 'string',
        required: true,
        desc: 'Bearer token with your secret key. Test keys start with sk_test_, live keys with sk_live_.',
    },
    {
        name: 'Idempotency-Key',
        type: 'string',
        required: false,
        desc: 'Any unique value up to 255 characters. Retries with the same key return the first result for 24 hours.',
    },
]

const bodyParams = [
    {
        name: 'amount',
        type: 'integer',
        required: true,
        desc: 'Amount in the smallest currency unit — 4999 charges $49.99. Minimum 50.',
    },
    {
        name: 'currency',
        type: 'string',
        required: true,
        desc: 'Three-letter ISO 4217 code, lowercase.',
        values: ['usd', 'eur', 'gbp', 'cad', 'jpy'],
    },
    {
        name: 'payment_method',
        type: 'object',
        required: true,
        desc: 'How the customer pays. Pass a token from Nimbus Elements or a saved method id.',
        children: [
            { name: 'type', type: 'enum', desc: 'card, bank_transfer or wallet.' },
            { name: 'token', type: 'string', desc: 'Single-use token, e.g. tok_visa_4242.' },
            { name: 'save_for_later', type: 'boolean', desc: 'Attach the method to customer for reuse.' },
        ],
    },
    {
        name: 'customer',
        type: 'string',
        required: false,
        desc: 'Id of an existing customer (cus_…). Required when save_for_later is true.',
    },
    {
        name: 'capture',
        type: 'boolean',
        required: false,
        fallback: 'true',
        desc: 'Set to false to authorise now and capture later with POST /v1/payments/:id/capture.',
    },
    {
        name: 'description',
        type: 'string',
        required: false,
        desc: 'Shown on receipts and in the dashboard. Up to 500 characters.',
    },
    {
        name: 'metadata',
        type: 'object',
        required: false,
        desc: 'Up to 20 key–value pairs for your own references, like order_id.',
    },
]

const JS_KEYWORDS = new Set(['import', 'from', 'const', 'await', 'new', 'return', 'true', 'false', 'null'])
const PY_KEYWORDS = new Set(['import', 'from', 'def', 'return', 'True', 'False', 'None'])
const C_RE = /(\/\/.*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g
const PY_RE = /(#.*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)|(\s+)|([\s\S])/g
const SH_RE = /('[^']*'|"(?:[^"\\]|\\.)*")|(-{1,2}[A-Za-z][\w-]*)|(\b\d+\b)|([^\s'"]+)|(\s+)|([\s\S])/g

const TOKEN_CLASS = {
    keyword: 'text-[#f472b6]',
    string: 'text-[#a3e635]',
    number: 'text-[#fbbf24]',
    comment: 'italic text-[#64748b]',
    fn: 'text-[#93c5fd]',
    prop: 'text-[#67e8f9]',
    flag: 'text-[#f472b6]',
    punct: 'text-[#64748b]',
    plain: 'text-[#cbd5e1]',
}

function tokenize(line, lang) {
    if (lang === 'bash') {
        return [...line.matchAll(SH_RE)].map((m, i) => {
            const [text, str, flag, num, word] = m
            if (str) return { type: 'string', text }
            if (flag) return { type: 'flag', text }
            if (num) return { type: 'number', text }
            if (word === '\\') return { type: 'punct', text }
            if (word && i === 0) return { type: 'fn', text }
            return { type: 'plain', text }
        })
    }
    const re = lang === 'python' ? PY_RE : C_RE
    const keywords = lang === 'python' ? PY_KEYWORDS : JS_KEYWORDS
    return [...line.matchAll(re)].map((m) => {
        const [text, comment, str, num, word, space] = m
        const next = line.slice(m.index + text.length).trimStart()[0]
        if (comment) return { type: 'comment', text }
        if (str) return { type: next === ':' && lang === 'json' ? 'prop' : 'string', text }
        if (num) return { type: 'number', text }
        if (word) {
            if (keywords.has(word)) return { type: 'keyword', text }
            if (next === '(') return { type: 'fn', text }
            if (next === ':' && lang === 'js') return { type: 'prop', text }
            if (next === '=' && lang === 'python' && line.slice(m.index + text.length)[0] === '=') {
                return { type: 'prop', text }
            }
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
        // clipboard API blocked: fall back to execCommand
    }
    return legacyCopy(text)
}

function useCopy() {
    const [status, setStatus] = useState({ state: 'idle', n: 0 })

    useEffect(() => {
        if (status.state === 'idle') return undefined
        const id = setTimeout(() => setStatus((s) => ({ ...s, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [status])

    const copy = async (text) => {
        const ok = await copyText(text)
        setStatus((s) => ({ state: ok ? 'copied' : 'failed', n: s.n + 1 }))
    }

    return [status.state, copy]
}

function Code({ code, lang, label }) {
    const lines = useMemo(() => code.split('\n').map((line) => tokenize(line, lang)), [code, lang])
    return (
        <pre
            aria-label={label}
            tabIndex={0}
            className="max-h-[360px] overflow-auto py-4 font-mono text-[12.5px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee] sm:text-[13px]"
        >
            <code className="block w-max min-w-full">
                {lines.map((tokens, i) => (
                    <span key={i} className="flex pr-5">
                        <span aria-hidden="true" className="w-10 shrink-0 select-none pr-4 text-right text-[#334155]">
                            {i + 1}
                        </span>
                        <span className="whitespace-pre">
                            {tokens.length === 0 && ' '}
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
    )
}

function Tabs({ label, tabs, active, onChange, uid, renderLabel }) {
    const onKeyDown = (event) => {
        const index = tabs.indexOf(active)
        let next = null
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length]
        if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length]
        if (event.key === 'Home') next = tabs[0]
        if (event.key === 'End') next = tabs[tabs.length - 1]
        if (!next) return
        event.preventDefault()
        onChange(next)
        event.currentTarget.querySelector(`[data-tab="${next}"]`)?.focus()
    }

    return (
        <div role="tablist" aria-label={label} className="flex min-w-0 items-stretch" onKeyDown={onKeyDown}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    role="tab"
                    data-tab={tab}
                    id={`${uid}-tab-${tab}`}
                    aria-selected={tab === active}
                    aria-controls={`${uid}-panel`}
                    tabIndex={tab === active ? 0 : -1}
                    className={cn(
                        'relative min-h-11 whitespace-nowrap px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee] sm:px-3.5 sm:text-[13px]',
                        tab === active ? 'text-white' : 'text-[#64748b] hover:text-[#cbd5e1]',
                    )}
                    onClick={() => onChange(tab)}
                >
                    {renderLabel ? renderLabel(tab) : tab}
                    {tab === active && (
                        <motion.span
                            layoutId={`${uid}-underline`}
                            className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]"
                            transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                        />
                    )}
                </button>
            ))}
        </div>
    )
}

function CopyButton({ state, label, onCopy, compact = false }) {
    return (
        <button
            type="button"
            aria-label={state === 'copied' ? `${label} copied` : `Copy ${label}`}
            className={cn(
                'inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]',
                compact ? 'min-w-10 px-2.5' : 'px-3',
                state === 'copied'
                    ? 'bg-[#22d3ee] text-[#082f49]'
                    : 'text-[#94a3b8] hover:bg-white/[0.06] hover:text-white',
            )}
            onClick={onCopy}
        >
            {state === 'copied' ? (
                <HiCheck aria-hidden="true" className="size-4" />
            ) : (
                <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
            )}
            {!compact && (state === 'copied' ? 'Copied' : state === 'failed' ? 'Press ⌘C' : 'Copy')}
        </button>
    )
}

function ParamRow({ param, uid }) {
    const [open, setOpen] = useState(false)
    const panelId = `${uid}-${param.name}-children`
    return (
        <div role="row" className="grid gap-2 border-t border-white/[0.07] py-5 md:grid-cols-[190px_104px_minmax(0,1fr)] md:gap-4">
            <div role="cell" className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-[14px] font-semibold text-white">{param.name}</code>
                {param.required ? (
                    <span className="rounded-md bg-[#22d3ee]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#22d3ee]">
                        Required
                    </span>
                ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">Optional</span>
                )}
            </div>
            <div role="cell" className="font-mono text-[13px] text-[#94a3b8] md:pt-px">
                {param.type}
                {param.fallback && <span className="text-[#64748b]"> = {param.fallback}</span>}
            </div>
            <div role="cell" className="min-w-0 text-[14.5px] leading-6 text-[#cbd5e1]">
                {param.desc}
                {param.values && (
                    <span className="mt-2.5 flex flex-wrap gap-1.5">
                        {param.values.map((value) => (
                            <code
                                key={value}
                                className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-xs text-[#a5f3fc]"
                            >
                                {value}
                            </code>
                        ))}
                    </span>
                )}
                {param.children && (
                    <div className="mt-3">
                        <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={panelId}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-3.5 text-xs font-semibold text-[#e2e8f0] transition-colors hover:border-[#22d3ee]/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? 'Hide' : 'Show'} {param.children.length} child attributes
                            <HiChevronDown
                                aria-hidden="true"
                                className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')}
                            />
                        </button>
                        <AnimatePresence initial={false}>
                            {open && (
                                <motion.div
                                    id={panelId}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#020617]/60">
                                        <ul className="divide-y divide-white/[0.06]">
                                            {param.children.map((child) => (
                                                <li key={child.name} className="px-4 py-3">
                                                    <p className="flex flex-wrap items-baseline gap-x-2 font-mono text-[13px]">
                                                        <span className="text-[#64748b]">{param.name}.</span>
                                                        <span className="-ml-2 font-semibold text-white">{child.name}</span>
                                                        <span className="text-xs text-[#94a3b8]">{child.type}</span>
                                                    </p>
                                                    <p className="mt-1 text-[13.5px] leading-6 text-[#94a3b8]">{child.desc}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

function ParamTable({ title, params, uid }) {
    return (
        <div className="mt-10">
            <h3 className="flex items-baseline justify-between gap-4 text-lg font-semibold tracking-tight text-white">
                {title}
                <span className="font-mono text-xs font-normal text-[#64748b]">{params.length} fields</span>
            </h3>
            <div role="table" aria-label={title}>
                <div role="rowgroup">
                    <div
                        role="row"
                        className="sr-only md:not-sr-only md:mt-4 md:grid md:grid-cols-[190px_104px_minmax(0,1fr)] md:gap-4 md:pb-2 md:text-[11px] md:font-semibold md:uppercase md:tracking-[0.18em] md:text-[#64748b]"
                    >
                        <span role="columnheader">Parameter</span>
                        <span role="columnheader">Type</span>
                        <span role="columnheader">Description</span>
                    </div>
                </div>
                <div role="rowgroup" className="max-md:mt-3">
                    <AnimatePresence initial={false}>
                        {params.map((param) => (
                            <motion.div
                                key={param.name}
                                role="none"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <ParamRow param={param} uid={uid} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export function APIReferenceDocsContent({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [showOptional, setShowOptional] = useState(true)
    const [lang, setLang] = useState('cURL')
    const [status, setStatus] = useState('200')
    const [run, setRun] = useState({ state: 'idle', ms: 0 })
    const [urlState, copyUrl] = useCopy()
    const [reqState, copyReq] = useCopy()
    const [resState, copyRes] = useCopy()

    useEffect(() => {
        if (run.state !== 'running') return undefined
        const id = setTimeout(() => {
            setStatus('200')
            setRun({ state: 'done', ms: 184 })
        }, 900)
        return () => clearTimeout(id)
    }, [run.state])

    const visibleHeaders = showOptional ? headerParams : headerParams.filter((p) => p.required)
    const visibleBody = showOptional ? bodyParams : bodyParams.filter((p) => p.required)
    const request = REQUESTS[lang]
    const response = RESPONSES[status]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] max-w-[140%] -translate-x-1/2 rounded-full bg-[#22d3ee]/15 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
                    <p className="flex flex-wrap items-center gap-2 text-[#64748b]">
                        <span className="font-semibold text-[#e2e8f0]">Nimbus Developer Hub</span>
                        <span aria-hidden="true">/</span>
                        <a
                            href="#nimbus-api-reference"
                            className="inline-flex min-h-10 items-center hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                        >
                            API reference
                        </a>
                        <span aria-hidden="true">/</span>
                        <a
                            href="#nimbus-payments"
                            className="inline-flex min-h-10 items-center hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                        >
                            Payments
                        </a>
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-[#94a3b8]">
                        <span className="relative flex size-2">
                            <span
                                aria-hidden="true"
                                className="absolute inline-flex size-full rounded-full bg-[#34d399] opacity-60 motion-safe:animate-ping"
                            />
                            <span className="relative inline-flex size-2 rounded-full bg-[#34d399]" />
                        </span>
                        Operational · API 2026-08-01
                    </span>
                </div>

                <div className="mt-8 flex min-w-0 items-stretch overflow-hidden rounded-2xl border border-white/10 bg-[#020617]/80 shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_30px_60px_-30px_rgba(34,211,238,0.35)]">
                    <span className="grid shrink-0 place-items-center bg-[#22d3ee] px-3 font-mono text-sm font-bold tracking-wider text-[#083344] sm:px-5 sm:text-base">
                        POST
                    </span>
                    <p className="min-w-0 flex-1 truncate px-3 py-3 font-mono text-sm sm:px-5 sm:text-lg">
                        <span className="hidden text-[#475569] sm:inline">https://api.nimbus.dev</span>
                        <span className="text-[#22d3ee]">/v1</span>
                        <span className="text-white">/payments</span>
                    </p>
                    <div className="flex items-center border-l border-white/10 px-1.5">
                        <CopyButton compact state={urlState} label="endpoint URL" onCopy={() => copyUrl(BASE_URL)} />
                    </div>
                </div>
                <span aria-live="polite" className="sr-only">
                    {urlState === 'copied' ? 'Endpoint URL copied' : ''}
                </span>

                <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
                    <div className="min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#22d3ee]">Payments · Endpoint</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                            Create a payment
                        </h2>
                        <p className="mt-5 max-w-xl text-[16px] leading-7 text-[#94a3b8]">
                            Charges a card, bank account or wallet in one call. Payments succeed synchronously for
                            cards; bank transfers return <code className="font-mono text-[#a5f3fc]">processing</code> and
                            settle through the <code className="font-mono text-[#a5f3fc]">payment.succeeded</code> webhook.
                        </p>

                        <ul className="mt-6 flex flex-wrap gap-2 text-[13px]">
                            {[
                                { icon: HiOutlineKey, text: 'Secret key auth' },
                                { icon: HiOutlineShieldCheck, text: 'Idempotent with key' },
                                { icon: HiOutlineBolt, text: '100 req/s per account' },
                            ].map((chip) => (
                                <li
                                    key={chip.text}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[#cbd5e1]"
                                >
                                    <chip.icon aria-hidden="true" className="size-4 text-[#22d3ee]" />
                                    {chip.text}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                            <p className="text-sm text-[#94a3b8]">
                                <span className="font-semibold text-white">{visibleHeaders.length + visibleBody.length}</span>{' '}
                                of {headerParams.length + bodyParams.length} parameters shown
                            </p>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={showOptional}
                                className="inline-flex min-h-10 items-center gap-3 rounded-full text-sm font-semibold text-[#e2e8f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d3ee]"
                                onClick={() => setShowOptional((v) => !v)}
                            >
                                Show optional
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'relative h-6 w-11 rounded-full transition-colors duration-300',
                                        showOptional ? 'bg-[#22d3ee]' : 'bg-[#334155]',
                                    )}
                                >
                                    <motion.span
                                        className="absolute top-1 left-1 size-4 rounded-full bg-white shadow"
                                        animate={{ x: showOptional ? 20 : 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                                    />
                                </span>
                            </button>
                        </div>

                        <ParamTable title="Header parameters" params={visibleHeaders} uid={`${uid}-h`} />
                        <ParamTable title="Body parameters" params={visibleBody} uid={`${uid}-b`} />
                    </div>

                    <div className="min-w-0">
                        <div className="space-y-5 lg:sticky lg:top-6">
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#020617] shadow-[0_30px_60px_-35px_rgba(0,0,0,0.9)]">
                                <div className="flex items-center justify-between gap-2 border-b border-white/10 pl-2 pr-1.5">
                                    <div className="min-w-0 overflow-x-auto">
                                        <Tabs
                                            label="Request example language"
                                            tabs={Object.keys(REQUESTS)}
                                            active={lang}
                                            uid={`${uid}-req`}
                                            onChange={setLang}
                                        />
                                    </div>
                                    <CopyButton state={reqState} label={`${lang} request`} onCopy={() => copyReq(request.code)} />
                                </div>
                                <div id={`${uid}-req-panel`} role="tabpanel" aria-labelledby={`${uid}-req-tab-${lang}`}>
                                    <Code code={request.code} lang={request.lang} label={`${lang} request example`} />
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                                    <p aria-live="polite" className="font-mono text-xs text-[#64748b]">
                                        {run.state === 'running' && 'Sending to sandbox…'}
                                        {run.state === 'done' && (
                                            <span className="text-[#34d399]">200 OK · {run.ms} ms · sandbox</span>
                                        )}
                                        {run.state === 'idle' && 'Uses your test key · no charges'}
                                    </p>
                                    <span aria-live="polite" className="sr-only">
                                        {reqState === 'copied' ? `${lang} request copied` : ''}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={run.state === 'running'}
                                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#22d3ee] px-4 text-sm font-bold text-[#083344] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                        onClick={() => setRun({ state: 'running', ms: 0 })}
                                    >
                                        {run.state === 'running' ? (
                                            <HiOutlineArrowPath aria-hidden="true" className="size-4 animate-spin" />
                                        ) : (
                                            <HiOutlinePlay aria-hidden="true" className="size-4" />
                                        )}
                                        {run.state === 'done' ? 'Run again' : 'Run in sandbox'}
                                    </button>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    'overflow-hidden rounded-2xl border bg-[#020617] transition-colors duration-500',
                                    run.state === 'done' ? 'border-[#22d3ee]/40' : 'border-white/10',
                                )}
                            >
                                <div className="flex items-center justify-between gap-2 border-b border-white/10 pl-2 pr-1.5">
                                    <div className="flex min-w-0 items-center overflow-x-auto">
                                        <span className="hidden px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#475569] sm:inline">
                                            Response
                                        </span>
                                        <Tabs
                                            label="Response status"
                                            tabs={Object.keys(RESPONSES)}
                                            active={status}
                                            uid={`${uid}-res`}
                                            renderLabel={(key) => (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'size-1.5 rounded-full',
                                                            RESPONSES[key].tone === 'ok' ? 'bg-[#34d399]' : 'bg-[#fb7185]',
                                                        )}
                                                    />
                                                    {RESPONSES[key].label}
                                                </span>
                                            )}
                                            onChange={setStatus}
                                        />
                                    </div>
                                    <CopyButton state={resState} label="response" onCopy={() => copyRes(response.code)} />
                                </div>
                                <div id={`${uid}-res-panel`} role="tabpanel" aria-labelledby={`${uid}-res-tab-${status}`}>
                                    <Code code={response.code} lang="json" label={`${response.label} response body`} />
                                </div>
                                <span aria-live="polite" className="sr-only">
                                    {resState === 'copied' ? 'Response copied' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default APIReferenceDocsContent

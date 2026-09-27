// LayerStackSecurityCompliance

// SecurityCompliance03 · SaaS Platforms › Security & Compliance

// Description:
// A defence-in-depth explainer for the fictional hosting platform Fortress Cloud. Under the
// heading "Four layers between your data and everyone else." an isometric SVG stack shows
// the Network, Application, Data and People layers; hovering, focusing or tapping a layer
// lifts it and swaps in its controls and a proof metric (e.g. "41.2M malicious requests
// blocked in August"). Use it on a security or enterprise page to explain how protection
// is layered.

// Design:
// - Light sky #f0f9ff background, navy #0c4a6e headings, text and active slab, sky
//   #bae6fd / #7dd3fc slab faces, white detail card with a 1px navy/10 border and soft shadow
// - Isometric slabs are SVG polygons (top face + two side faces) with a dashed inset and a
//   dot pattern per layer; the active slab turns navy and lifts 14px with a spring
// - Heading text-4xl → lg:text-6xl semibold with tight tracking; layer buttons show a
//   2-digit index, name and one-line summary; the active one gets a navy fill
// - The detail card cross-fades and slides (AnimatePresence) when the layer changes; its
//   controls are a check list and the metric sits in a navy pill
// - Responsive: stack illustration above the controls below lg, side by side on lg; layer
//   buttons are a 2×2 grid below lg and a vertical list on lg

// What it does:
// - active (layer id, default "network") changes on hover, focus or click of a layer button
//   and on hover or click of a slab in the illustration
// - The buttons form a tablist (role="tab", aria-selected, aria-controls); Arrow keys,
//   Home and End move between layers
// - useReducedMotion() removes the slab lift spring and panel slide (instant swap)
// - "Read the security whitepaper" links to #fortress-whitepaper

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LayerStackSecurityCompliance from '@/TestComponent/PageSections/saas/SecurityCompliance03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <LayerStackSecurityCompliance />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const layers = [
    {
        id: 'people',
        name: 'People',
        summary: 'Least privilege, verified humans',
        intro: 'Every Fortress engineer is background-checked, trained quarterly and can only reach production through a time-boxed, peer-approved session.',
        controls: [
            'Hardware security keys for all 186 staff',
            'Just-in-time production access, max 4 hours',
            'Quarterly phishing drills and secure-code training',
            'Access reviews every 90 days, auto-revoked on exit',
        ],
        metric: '0 standing admin accounts',
        dots: [[0.3, 0.3], [0.3, 0.7], [0.7, 0.3], [0.7, 0.7]],
    },
    {
        id: 'data',
        name: 'Data',
        summary: 'Encrypted, isolated, recoverable',
        intro: 'Customer data is encrypted with keys you can own, split by tenant, and backed up to a second region every five minutes.',
        controls: [
            'AES-256 at rest with customer-managed keys',
            'Per-tenant schemas and row-level isolation',
            'Point-in-time restore for 35 days',
            'Residency in Frankfurt, Virginia or Sydney',
        ],
        metric: 'RPO 5 min · RTO 38 min',
        dots: [[0.5, 0.5], [0.25, 0.5], [0.75, 0.5], [0.5, 0.25], [0.5, 0.75]],
    },
    {
        id: 'application',
        name: 'Application',
        summary: 'Hardened code, scanned every build',
        intro: 'Every commit runs through static analysis, dependency and container scanning before it can be deployed, and a WAF watches it in production.',
        controls: [
            'SAST, SCA and container scans on every build',
            'Signed artifacts with SLSA level 3 provenance',
            'Managed WAF with OWASP Top 10 rules',
            'Twice-yearly external pen-tests',
        ],
        metric: 'Criticals patched in < 24 h',
        dots: [[0.2, 0.2], [0.5, 0.2], [0.8, 0.2], [0.2, 0.8], [0.5, 0.8], [0.8, 0.8]],
    },
    {
        id: 'network',
        name: 'Network',
        summary: 'Private by default, filtered at the edge',
        intro: 'Traffic hits our global edge first, where DDoS scrubbing and rate limits drop bad requests long before they reach your workloads.',
        controls: [
            'Private VPC per customer, no public databases',
            'DDoS scrubbing up to 3.2 Tbps',
            'mTLS between every internal service',
            'Geo and IP allow-lists per project',
        ],
        metric: '41.2M malicious requests blocked in August',
        dots: [[0.2, 0.5], [0.4, 0.5], [0.6, 0.5], [0.8, 0.5], [0.5, 0.2], [0.5, 0.8]],
    },
]

const CX = 180
const HALF_W = 132
const HALF_H = 66
const DEPTH = 18
const GAP = 76

const pt = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`

function slabGeometry(y) {
    const top = [CX, y]
    const right = [CX + HALF_W, y + HALF_H]
    const bottom = [CX, y + HALF_H * 2]
    const left = [CX - HALF_W, y + HALF_H]
    const iso = (u, v, inset = 0) => {
        const uu = inset + u * (1 - inset * 2)
        const vv = inset + v * (1 - inset * 2)
        return [CX + HALF_W * uu - HALF_W * vv, y + HALF_H * uu + HALF_H * vv]
    }
    return {
        topFace: [top, right, bottom, left].map((p) => pt(...p)).join(' '),
        leftFace: [left, bottom, [bottom[0], bottom[1] + DEPTH], [left[0], left[1] + DEPTH]].map((p) => pt(...p)).join(' '),
        rightFace: [bottom, right, [right[0], right[1] + DEPTH], [bottom[0], bottom[1] + DEPTH]].map((p) => pt(...p)).join(' '),
        inset: [iso(0, 0, 0.12), iso(1, 0, 0.12), iso(1, 1, 0.12), iso(0, 1, 0.12)].map((p) => pt(...p)).join(' '),
        iso,
    }
}

export function LayerStackSecurityCompliance({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState('network')
    const tabRefs = useRef([])
    const baseId = useId()
    const activeIndex = layers.findIndex((l) => l.id === active)
    const layer = layers[activeIndex]

    const onKeyDown = (event, index) => {
        const last = layers.length - 1
        let next = null
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setActive(layers[next].id)
        tabRefs.current[next]?.focus()
    }

    const drawOrder = [...layers.keys()].reverse()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f0f9ff] px-4 py-16 text-base font-normal text-[#0c4a6e] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0369a1]">
                        Fortress Cloud · Defence in depth
                    </p>
                    <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-tight text-[#0c4a6e] sm:text-5xl lg:text-6xl">
                        Four layers between your data and everyone else.
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-[#0c4a6e]/75">
                        No single control keeps you safe. Fortress stacks independent safeguards so a
                        failure in one layer is caught by the next. Pick a layer to see what guards it.
                    </p>
                </div>

                <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div aria-hidden="true" className="absolute inset-x-8 bottom-4 h-16 rounded-[50%] bg-[#0c4a6e]/10 blur-2xl" />
                        <svg viewBox="0 0 360 400" className="relative h-auto w-full" aria-hidden="true">
                            {drawOrder.map((index) => {
                                const item = layers[index]
                                const isActive = item.id === active
                                const g = slabGeometry(20 + index * GAP)
                                return (
                                    <motion.g
                                        key={item.id}
                                        className="cursor-pointer"
                                        animate={{ y: isActive && !reduceMotion ? -14 : 0 }}
                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
                                        onMouseEnter={() => setActive(item.id)}
                                        onClick={() => setActive(item.id)}
                                    >
                                        <polygon
                                            points={g.leftFace}
                                            className={cn('transition-colors duration-300', isActive ? 'fill-[#082f49]' : 'fill-[#7dd3fc]')}
                                        />
                                        <polygon
                                            points={g.rightFace}
                                            className={cn('transition-colors duration-300', isActive ? 'fill-[#0a3a57]' : 'fill-[#38bdf8]')}
                                        />
                                        <polygon
                                            points={g.topFace}
                                            strokeWidth="1.5"
                                            className={cn(
                                                'stroke-[#0c4a6e] transition-colors duration-300',
                                                isActive ? 'fill-[#0c4a6e]' : 'fill-[#e0f2fe]',
                                            )}
                                        />
                                        <polygon
                                            points={g.inset}
                                            fill="none"
                                            strokeDasharray="4 4"
                                            className={cn('transition-colors duration-300', isActive ? 'stroke-[#7dd3fc]' : 'stroke-[#0c4a6e]/35')}
                                        />
                                        {item.dots.map(([u, v]) => {
                                            const [x, y] = g.iso(u, v, 0.12)
                                            return (
                                                <ellipse
                                                    key={`${u}-${v}`}
                                                    cx={x}
                                                    cy={y}
                                                    rx="7"
                                                    ry="3.5"
                                                    className={cn('transition-colors duration-300', isActive ? 'fill-[#7dd3fc]' : 'fill-[#0c4a6e]/30')}
                                                />
                                            )
                                        })}
                                    </motion.g>
                                )
                            })}
                        </svg>
                    </div>

                    <div>
                        <div
                            role="tablist"
                            aria-label="Security layers"
                            aria-orientation="vertical"
                            className="grid grid-cols-2 gap-2 lg:grid-cols-1"
                        >
                            {layers.map((item, index) => {
                                const isActive = item.id === active
                                return (
                                    <button
                                        key={item.id}
                                        ref={(el) => {
                                            tabRefs.current[index] = el
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${baseId}-tab-${item.id}`}
                                        aria-selected={isActive}
                                        aria-controls={`${baseId}-panel`}
                                        tabIndex={isActive ? 0 : -1}
                                        className={cn(
                                            'flex min-h-14 items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] lg:items-center',
                                            isActive
                                                ? 'border-[#0c4a6e] bg-[#0c4a6e] text-white'
                                                : 'border-[#0c4a6e]/15 bg-white/70 text-[#0c4a6e] hover:border-[#0c4a6e]/40',
                                        )}
                                        onClick={() => setActive(item.id)}
                                        onMouseEnter={() => setActive(item.id)}
                                        onFocus={() => setActive(item.id)}
                                        onKeyDown={(event) => onKeyDown(event, index)}
                                    >
                                        <span
                                            className={cn(
                                                'font-mono text-xs tabular-nums',
                                                isActive ? 'text-[#7dd3fc]' : 'text-[#0c4a6e]/50',
                                            )}
                                        >
                                            {String(layers.length - index).padStart(2, '0')}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold sm:text-base">{item.name}</span>
                                            <span
                                                className={cn(
                                                    'hidden text-sm sm:block',
                                                    isActive ? 'text-white/70' : 'text-[#0c4a6e]/60',
                                                )}
                                            >
                                                {item.summary}
                                            </span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        <div
                            id={`${baseId}-panel`}
                            role="tabpanel"
                            aria-labelledby={`${baseId}-tab-${layer.id}`}
                            className="mt-4 overflow-hidden rounded-3xl border border-[#0c4a6e]/10 bg-white shadow-[0_24px_60px_-30px_rgba(12,74,110,0.45)]"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={layer.id}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
                                    className="p-6 sm:p-8"
                                >
                                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#0284c7]">
                                        Layer {String(layers.length - activeIndex).padStart(2, '0')} / {String(layers.length).padStart(2, '0')}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0c4a6e] sm:text-3xl">
                                        {layer.name} layer
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-[#0c4a6e]/75 sm:text-base">{layer.intro}</p>
                                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                                        {layer.controls.map((control) => (
                                            <li key={control} className="flex gap-2.5 text-sm leading-snug text-[#0c4a6e]">
                                                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#e0f2fe] text-[#0369a1]">
                                                    <HiCheck className="size-3.5" aria-hidden="true" />
                                                </span>
                                                {control}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-6 inline-flex rounded-full bg-[#0c4a6e] px-4 py-2 text-xs font-semibold text-white sm:text-sm">
                                        {layer.metric}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <a
                            href="#fortress-whitepaper"
                            className="group mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0c4a6e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284c7]"
                        >
                            <span className="border-b border-[#0c4a6e]/40 pb-0.5 group-hover:border-[#0c4a6e]">
                                Read the security whitepaper
                            </span>
                            <HiArrowLongRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LayerStackSecurityCompliance

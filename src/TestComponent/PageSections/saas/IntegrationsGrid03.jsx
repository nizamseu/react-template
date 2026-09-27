// FlowLinesIntegrationsGrid

// IntegrationsGrid03 · SaaS Platforms › Integrations Grid

// Description:
// A pipeline diagram for the fictional data-movement tool Pipewise. Under "Every source
// in. Every destination out." five fictional sources (Paylane, Tillhouse, Rowstack,
// Dealwell, Funnelry) flow into a dark Pipewise hub and on to five destinations (Warehaus,
// Querybay, Lakehold, Bucketly, Chartroom) along animated dashed lines. Picking a source
// and a destination lights up that route and a status bar describes the sync.

// Design:
// - Off-white #f8fafc section, slate #0f172a / #64748b text, orange #fb923c accents; node
//   cards are white rounded-2xl chips (generic lucide icon on a tile in the app's colour)
//   whose border and tile ring turn orange when active
// - Connectors: inline SVG cubic curves (viewBox stretched, non-scaling 1.5px strokes) with
//   dashes that march toward the hub; the active route is a 2.5px orange line
// - Hub: slate-900 rounded-[28px] card with an orange logo mark, Extract / Transform / Load
//   chips and a rows-per-minute / schema-drift readout; a soft orange glow sits behind it
// - Status bar: white pill-shaped strip with a pulsing orange dot and the route summary
// - Responsive: below lg everything stacks (sources grid 2 → sm:3 columns, vertical dashed
//   connectors, hub, destinations); from lg a 5-column row with fixed 460px height

// What it does:
// - source and destination state (Paylane → Warehaus to start) are set by the node buttons
//   (aria-pressed); the matching curves turn orange and the status bar updates
// - Until someone clicks a node, the source auto-advances every 3.2 s (skipped with reduced
//   motion; the interval is cleared on first click or unmount); the status line only
//   becomes aria-live="polite" after a click
// - useReducedMotion() also freezes the marching dashes; "See all 210 connectors" links to
//   #pipewise-connectors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FlowLinesIntegrationsGrid from '@/TestComponent/PageSections/saas/IntegrationsGrid03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <FlowLinesIntegrationsGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import {
    LuChartColumn,
    LuChartPie,
    LuCloud,
    LuCreditCard,
    LuDatabase,
    LuHandshake,
    LuLayers,
    LuPackage,
    LuServer,
    LuStore,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const sources = [
    { id: 'paylane', name: 'Paylane', icon: LuCreditCard, color: '#4f46e5', meta: '18 tables · webhooks', rows: '42,180' },
    { id: 'tillhouse', name: 'Tillhouse', icon: LuStore, color: '#65a30d', meta: '11 tables · orders', rows: '18,905' },
    { id: 'rowstack', name: 'Rowstack', icon: LuServer, color: '#0f766e', meta: 'CDC · 64 tables', rows: '1.2M' },
    { id: 'dealwell', name: 'Dealwell', icon: LuHandshake, color: '#0284c7', meta: '9 objects · deals', rows: '6,340' },
    { id: 'funnelry', name: 'Funnelry', icon: LuChartPie, color: '#db2777', meta: 'Web & app events', rows: '310K' },
]

const destinations = [
    { id: 'warehaus', name: 'Warehaus', icon: LuDatabase, color: '#0369a1', meta: 'Warehouse', every: '5 min' },
    { id: 'querybay', name: 'Querybay', icon: LuLayers, color: '#7c3aed', meta: 'Warehouse', every: '5 min' },
    { id: 'lakehold', name: 'Lakehold', icon: LuCloud, color: '#0891b2', meta: 'Lakehouse', every: '15 min' },
    { id: 'bucketly', name: 'Bucketly', icon: LuPackage, color: '#ca8a04', meta: 'Parquet files', every: '1 hour' },
    { id: 'chartroom', name: 'Chartroom', icon: LuChartColumn, color: '#16a34a', meta: 'BI dashboards', every: '15 min' },
]

const rowY = (i, n) => ((i + 0.5) * 100) / n

function Connector({ count, activeIndex, flip, reduceMotion }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="hidden size-full overflow-visible lg:block"
            fill="none"
        >
            {Array.from({ length: count }, (_, i) => {
                const y = rowY(i, count)
                const d = flip ? `M0 50 C50 50 50 ${y} 100 ${y}` : `M0 ${y} C50 ${y} 50 50 100 50`
                const active = i === activeIndex
                return (
                    <motion.path
                        key={i}
                        d={d}
                        vectorEffect="non-scaling-stroke"
                        stroke={active ? '#fb923c' : '#cbd5e1'}
                        strokeWidth={active ? 2.5 : 1.5}
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -24] }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : { duration: active ? 0.8 : 1.6, repeat: Infinity, ease: 'linear' }
                        }
                    />
                )
            })}
        </svg>
    )
}

function VerticalConnector({ reduceMotion }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 8 56" className="mx-auto h-14 w-2 lg:hidden" fill="none">
            <motion.path
                d="M4 0v56"
                stroke="#fb923c"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -24] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </svg>
    )
}

function Node({ item, active, onSelect, side }) {
    const Icon = item.icon
    return (
        <button
            type="button"
            aria-pressed={active}
            className={cn(
                'flex min-h-16 w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-[border-color,box-shadow,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb923c]',
                side === 'right' && 'lg:flex-row-reverse lg:text-right',
                active
                    ? 'border-[#fb923c] shadow-[0_12px_30px_-16px_rgba(251,146,60,0.8)]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-[0_10px_24px_-18px_rgba(15,23,42,0.4)]',
            )}
            onClick={onSelect}
        >
            <span
                className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-xl text-white transition-shadow',
                    active && 'ring-2 ring-[#fb923c] ring-offset-2',
                )}
                style={{ backgroundColor: item.color }}
            >
                <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#0f172a]">{item.name}</span>
                <span className="block truncate text-xs text-[#64748b]">{item.meta}</span>
            </span>
        </button>
    )
}

export function FlowLinesIntegrationsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [sourceIndex, setSourceIndex] = useState(0)
    const [destIndex, setDestIndex] = useState(0)
    const [touched, setTouched] = useState(false)
    const reduceMotion = useReducedMotion()
    const source = sources[sourceIndex]
    const dest = destinations[destIndex]

    useEffect(() => {
        if (touched || reduceMotion) return undefined
        const id = setInterval(() => setSourceIndex((i) => (i + 1) % sources.length), 3200)
        return () => clearInterval(id)
    }, [touched, reduceMotion])

    const pickSource = (i) => {
        setTouched(true)
        setSourceIndex(i)
    }
    const pickDest = (i) => {
        setTouched(true)
        setDestIndex(i)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative isolate overflow-hidden bg-[#f8fafc] px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#ea580c]">
                        Pipewise · Connectors
                    </p>
                    <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#0f172a] sm:text-5xl">
                        Every source in. Every destination out.
                    </h2>
                    <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#64748b]">
                        Pick a source and a destination to trace the route. Pipewise handles schema drift, retries and
                        backfills in between.
                    </p>
                </div>

                <div className="mt-14 flex flex-col lg:grid lg:h-[460px] lg:grid-cols-[minmax(0,1fr)_minmax(48px,0.5fr)_minmax(0,1.1fr)_minmax(48px,0.5fr)_minmax(0,1fr)] lg:items-stretch">
                    <div>
                        <p className="mb-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748b] lg:hidden">
                            Sources
                        </p>
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:h-full lg:flex-col lg:justify-around lg:gap-0">
                            {sources.map((item, i) => (
                                <li key={item.id}>
                                    <Node item={item} active={i === sourceIndex} side="left" onSelect={() => pickSource(i)} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <VerticalConnector reduceMotion={reduceMotion} />
                    <Connector count={sources.length} activeIndex={sourceIndex} reduceMotion={reduceMotion} />

                    <div className="relative flex items-center justify-center">
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 -z-10 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fb923c]/25 blur-3xl"
                        />
                        <div className="w-full max-w-sm rounded-[28px] bg-[#0f172a] p-5 text-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.7)] sm:p-6">
                            <div className="flex items-center gap-3">
                                <span className="grid size-11 place-items-center rounded-2xl bg-[#fb923c]">
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 text-[#0f172a]" fill="none">
                                        <path
                                            d="M3 8h8a4 4 0 0 1 4 4v0a4 4 0 0 0 4 4h2"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="4" cy="8" r="2" fill="currentColor" />
                                        <circle cx="20" cy="16" r="2" fill="currentColor" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-lg font-semibold leading-tight text-white">Pipewise</p>
                                    <p className="font-mono text-[11px] text-white/60">pipeline · prod-eu-1</p>
                                </div>
                            </div>
                            <ol className="mt-5 flex flex-wrap gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide">
                                {['Extract', 'Transform', 'Load'].map((stage, i) => (
                                    <li
                                        key={stage}
                                        className={cn(
                                            'flex-1 rounded-lg px-2 py-2 text-center',
                                            i === 1 ? 'bg-[#fb923c] text-[#0f172a]' : 'bg-white/10 text-white/80',
                                        )}
                                    >
                                        {stage}
                                    </li>
                                ))}
                            </ol>
                            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                                <div>
                                    <dt className="text-[11px] text-white/55">Rows / min</dt>
                                    <dd className="font-mono text-lg font-semibold tabular-nums text-white">12.4K</dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] text-white/55">Schema drift</dt>
                                    <dd className="font-mono text-sm font-semibold leading-7 text-[#fdba74]">Auto-fixed</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <VerticalConnector reduceMotion={reduceMotion} />
                    <Connector flip count={destinations.length} activeIndex={destIndex} reduceMotion={reduceMotion} />

                    <div>
                        <p className="mb-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748b] lg:hidden">
                            Destinations
                        </p>
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:h-full lg:flex-col lg:justify-around lg:gap-0">
                            {destinations.map((item, i) => (
                                <li key={item.id}>
                                    <Node item={item} active={i === destIndex} side="right" onSelect={() => pickDest(i)} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mx-auto mt-10 flex max-w-3xl flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)] sm:flex-row sm:items-center sm:rounded-full sm:px-6">
                    <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
                        {!reduceMotion && (
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#fb923c] opacity-70" />
                        )}
                        <span className="relative inline-flex size-2.5 rounded-full bg-[#fb923c]" />
                    </span>
                    <p aria-live={touched ? 'polite' : 'off'} className="text-sm text-[#334155]">
                        <span className="font-semibold text-[#0f172a]">
                            {source.name} → Pipewise → {dest.name}
                        </span>
                        <span className="text-[#64748b]">
                            {' '}
                            · {source.rows} rows in the last hour · lands every {dest.every}
                        </span>
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <a
                        href="#pipewise-connectors"
                        className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0f172a] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb923c]"
                    >
                        See all 210 connectors
                        <HiArrowRight aria-hidden="true" className="size-4 text-[#fb923c] transition-transform group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default FlowLinesIntegrationsGrid

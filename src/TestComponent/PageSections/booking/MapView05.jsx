// PanZoomMapView

// MapView05 · Booking & Reservations › Interactive Map View

// Description:
// A dark, topographic property map for Hearthside Cabins. Under "Find your cabin in
// 2,400 acres of quiet" six cabins (Fernhollow, Stillwater, Tamarack, Ridgeback, Juniper
// Knoll, Lantern Cove) and the check-in lodge sit on contour lines, a lake and dashed
// trails. Guests drag to pan, zoom with +/− or a double-click, reset the view and fly to
// any cabin to see its details. Use it for campgrounds, glamping sites or cabin resorts.

// Design:
// - Header with three stats, then lg: map (480 → sm: 560 → lg: 640px) + 360px detail
//   card; a row of "fly to" cabin chips sits under the map; everything stacks below lg
// - Forest night #0a1510 page, map #0f1f17 with generated contour rings (#1f3a2b, every
//   fourth #2d5540), lake #10302f, cream #f5efe4 trails and type, ember #e8a65d cabins
// - Rounded-[28px] frame; glassy control stack (zoom in, zoom out, reset, level readout),
//   legend, drag hint and a live minimap with a viewport rectangle (sm and up)
// - The map canvas (1400×1000) is sized with container-query units to cover the frame;
//   markers are counter-scaled so they stay the same size at every zoom level
// - framer-motion drag with bounds, momentum and elastic edges; springs for zoom, reset
//   and fly-to; momentum and springs become instant with reduced motion

// What it does:
// - x / y / scale motion values hold the view; zoomIndex steps through 1×, 1.5×, 2.25×
//   and 3× around the view centre, and drag bounds are recomputed from the measured frame
// - The focusable map pans with arrow keys and zooms with + / − (0 resets); cabin names
//   appear on the map from 1.5×
// - selectedId (marker, chip) updates the detail card and flies the view to the cabin;
//   "Check dates" links to #cabin-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PanZoomMapView from '@/TestComponent/PageSections/booking/MapView05';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <PanZoomMapView />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { LuCrosshair, LuMinus, LuMove, LuPlus, LuRotateCcw } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const VB_W = 1400
const VB_H = 1000
const RATIO = VB_W / VB_H
const ZOOMS = [1, 1.5, 2.25, 3]

const cabins = [
    {
        id: 'fernhollow',
        name: 'Fernhollow',
        price: 215,
        sleeps: 4,
        rooms: '1 bedroom + loft',
        elevation: '1,120 m',
        features: ['Wood stove', 'Lake path 2 min', 'Outdoor shower'],
        x: 560,
        y: 540,
        image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=700&q=80',
        alt: 'Small timber cabin among tall trees in a forest clearing',
    },
    {
        id: 'stillwater',
        name: 'Stillwater',
        price: 265,
        sleeps: 6,
        rooms: '2 bedrooms',
        elevation: '1,110 m',
        features: ['Private dock', 'Canoe for two', 'Fire pit'],
        x: 820,
        y: 745,
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80',
        alt: 'Wooden rowboat on a still alpine lake below forested peaks',
    },
    {
        id: 'tamarack',
        name: 'Tamarack',
        price: 189,
        sleeps: 2,
        rooms: 'A-frame studio',
        elevation: '1,380 m',
        features: ['Stargazing deck', 'Telescope', 'Clawfoot tub'],
        x: 980,
        y: 400,
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=80',
        alt: 'Starry night sky over snowy mountain ridges',
    },
    {
        id: 'ridgeback',
        name: 'Ridgeback',
        price: 235,
        sleeps: 4,
        rooms: '2 bedrooms',
        elevation: '1,560 m',
        features: ['Cedar hot tub', 'Summit trail 40 min', 'Wood stove'],
        x: 500,
        y: 265,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
        alt: 'Mountain valley with dark pine forest and rocky peaks',
    },
    {
        id: 'juniper-knoll',
        name: 'Juniper Knoll',
        price: 175,
        sleeps: 3,
        rooms: '1 bedroom',
        elevation: '1,240 m',
        features: ['Reading nook', 'Dog friendly', 'Hammock'],
        x: 1120,
        y: 700,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80',
        alt: 'Bedroom with a wooden bed facing a window onto the trees',
    },
    {
        id: 'lantern-cove',
        name: 'Lantern Cove',
        price: 299,
        sleeps: 8,
        rooms: '3 bedrooms',
        elevation: '1,090 m',
        features: ['Barrel sauna', 'Chef’s kitchen', 'EV charger'],
        x: 620,
        y: 810,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=700&q=80',
        alt: 'Modern cabin with glowing windows at dusk',
    },
]

const LODGE = { x: 320, y: 650 }

const peaks = [
    { x: 360, y: 300, r: 260, n: 10, seed: 1.3, name: 'Harlow Peak', height: '1,842 m' },
    { x: 1060, y: 250, r: 210, n: 8, seed: 2.1, name: 'Tamarack Ridge', height: '1,610 m' },
    { x: 1110, y: 830, r: 170, n: 6, seed: 3.7, name: 'Owl Knob', height: '1,290 m' },
    { x: 170, y: 920, r: 150, n: 5, seed: 5.2 },
]

const r1 = (n) => Math.round(n * 10) / 10

// Closed Catmull-Rom curve through wobbly rings: generated once, identical on server and client
const contourPath = (p, k) => {
    const rk = p.r * (1 - k / (p.n + 0.6))
    const count = 36
    const pts = Array.from({ length: count }, (_, i) => {
        const t = (i / count) * Math.PI * 2
        const wobble =
            1 + 0.12 * Math.sin(3 * t + p.seed + k * 0.35) + 0.07 * Math.sin(5 * t + p.seed * 2.3 - k * 0.2) + 0.03 * Math.sin(9 * t + k)
        return [p.x + Math.cos(t) * rk * wobble * 1.15, p.y + Math.sin(t) * rk * wobble * 0.85]
    })
    let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`
    for (let i = 0; i < count; i++) {
        const p0 = pts[(i - 1 + count) % count]
        const a = pts[i]
        const b = pts[(i + 1) % count]
        const p3 = pts[(i + 2) % count]
        const c1 = [a[0] + (b[0] - p0[0]) / 6, a[1] + (b[1] - p0[1]) / 6]
        const c2 = [b[0] - (p3[0] - a[0]) / 6, b[1] - (p3[1] - a[1]) / 6]
        d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(b[0])} ${r1(b[1])}`
    }
    return `${d} Z`
}

const contours = peaks.flatMap((p, pi) =>
    Array.from({ length: p.n }, (_, k) => ({ key: `${pi}-${k}`, d: contourPath(p, k), index: k % 4 === 0 })),
)

const LAKE = 'M600 600 C 620 540 720 530 790 560 C 860 590 872 660 832 704 C 782 744 690 734 640 712 C 600 692 585 640 600 600 Z'

const trails = [
    'M320 650 C 400 620 470 580 560 540',
    'M560 540 C 600 460 540 360 500 265',
    'M320 650 C 420 720 520 790 620 810',
    'M620 810 C 700 812 760 790 820 745',
    'M820 745 C 900 745 1000 722 1120 700',
    'M560 540 C 680 500 820 470 980 400',
]

const clamp = (v, max) => Math.min(max, Math.max(-max, v))

const pct = (x, y) => ({ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` })

export function PanZoomMapView({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const viewportRef = useRef(null)
    const moved = useRef(false)
    const [box, setBox] = useState({ w: 0, h: 0 })
    const [zoomIndex, setZoomIndex] = useState(0)
    const [selectedId, setSelectedId] = useState(cabins[0].id)
    const [interacted, setInteracted] = useState(false)

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const scale = useMotionValue(1)
    const inverse = useTransform(scale, (v) => 1 / v)

    const lw = Math.max(box.w, box.h * RATIO)
    const lh = lw / RATIO
    const bounds = useCallback(
        (s) => ({ x: Math.max(0, (lw * s - box.w) / 2), y: Math.max(0, (lh * s - box.h) / 2) }),
        [lw, lh, box.w, box.h],
    )
    const b = bounds(ZOOMS[zoomIndex])

    const miniLeft = useTransform([x, scale], ([xv, sv]) => (lw ? `${(0.5 - (box.w / 2 + xv) / (lw * sv)) * 100}%` : '0%'))
    const miniTop = useTransform([y, scale], ([yv, sv]) => (lh ? `${(0.5 - (box.h / 2 + yv) / (lh * sv)) * 100}%` : '0%'))
    const miniW = useTransform(scale, (sv) => (lw ? `${Math.min(1, box.w / (lw * sv)) * 100}%` : '100%'))
    const miniH = useTransform(scale, (sv) => (lh ? `${Math.min(1, box.h / (lh * sv)) * 100}%` : '100%'))

    useEffect(() => {
        const el = viewportRef.current
        if (!el) return undefined
        const update = () => {
            const r = el.getBoundingClientRect()
            setBox({ w: r.width, h: r.height })
        }
        update()
        if (typeof ResizeObserver === 'undefined') return undefined
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Keep the view inside the new bounds after a resize
    useEffect(() => {
        const bb = bounds(scale.get())
        x.set(clamp(x.get(), bb.x))
        y.set(clamp(y.get(), bb.y))
    }, [bounds, scale, x, y])

    const moveTo = useCallback(
        (nx, ny, s) => {
            const bb = bounds(s)
            const opts = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 }
            animate(scale, s, opts)
            animate(x, clamp(nx, bb.x), opts)
            animate(y, clamp(ny, bb.y), opts)
        },
        [bounds, reduceMotion, scale, x, y],
    )

    const zoomTo = (index) => {
        const next = Math.min(ZOOMS.length - 1, Math.max(0, index))
        const k = ZOOMS[next] / scale.get()
        setZoomIndex(next)
        setInteracted(true)
        moveTo(x.get() * k, y.get() * k, ZOOMS[next])
    }

    const reset = () => {
        setZoomIndex(0)
        moveTo(0, 0, 1)
    }

    const flyTo = (cabin) => {
        const next = Math.max(zoomIndex, 1)
        const s = ZOOMS[next]
        setZoomIndex(next)
        moveTo(-(cabin.x / VB_W - 0.5) * lw * s, -(cabin.y / VB_H - 0.5) * lh * s, s)
    }

    const selectCabin = (cabin, fly) => {
        setSelectedId(cabin.id)
        if (fly) flyTo(cabin)
    }

    const onMapKey = (e) => {
        const step = 90
        const s = ZOOMS[zoomIndex]
        const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }
        if (moves[e.key]) {
            e.preventDefault()
            setInteracted(true)
            moveTo(x.get() + moves[e.key][0], y.get() + moves[e.key][1], s)
        } else if (e.key === '+' || e.key === '=') {
            e.preventDefault()
            zoomTo(zoomIndex + 1)
        } else if (e.key === '-' || e.key === '_') {
            e.preventDefault()
            zoomTo(zoomIndex - 1)
        } else if (e.key === '0') {
            e.preventDefault()
            reset()
        }
    }

    const selected = cabins.find((c) => c.id === selectedId) ?? cabins[0]
    const showLabels = zoomIndex >= 1
    const controlClass =
        'grid size-10 place-items-center rounded-xl text-[#f5efe4] transition-colors hover:bg-[#f5efe4]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8a65d] disabled:cursor-not-allowed disabled:opacity-35'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0a1510] py-16 text-base font-normal text-[#f5efe4] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#e8a65d]">
                            Hearthside Cabins · Cedar Hollow Preserve
                        </p>
                        <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-[#f5efe4] sm:text-5xl lg:text-6xl">
                            Find your cabin in 2,400 acres of quiet
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#9fb3a5] sm:text-base">
                            Six hand-built cabins spread over the ridges and the lake shore. Drag the map,
                            zoom into the contours and pick the one that feels like yours.
                        </p>
                    </div>
                    <dl className="grid grid-cols-3 gap-3 sm:gap-6">
                        {[
                            ['6', 'cabins'],
                            ['14 km', 'of trails'],
                            ['1,560 m', 'highest cabin'],
                        ].map(([value, label]) => (
                            <div key={label} className="border-l border-[#2d5540] pl-3 sm:pl-4">
                                <dt className="sr-only">{label}</dt>
                                <dd className="font-mono text-lg font-semibold text-[#f5efe4] sm:text-2xl">{value}</dd>
                                <dd className="mt-1 text-xs text-[#9fb3a5]">{label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="min-w-0">
                        <div className="relative">
                            <div
                                ref={viewportRef}
                                tabIndex={0}
                                role="region"
                                aria-label="Topographic map of Cedar Hollow. Arrow keys pan, plus and minus zoom, 0 resets."
                                className="relative h-[480px] overflow-hidden rounded-[28px] border border-[#1f3a2b] bg-[#0f1f17] [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8a65d] sm:h-[560px] lg:h-[640px]"
                                onKeyDown={onMapKey}
                            >
                                <motion.div
                                    drag
                                    dragConstraints={{ left: -b.x, right: b.x, top: -b.y, bottom: b.y }}
                                    dragElastic={0.08}
                                    dragMomentum={!reduceMotion}
                                    dragTransition={{ power: 0.22, timeConstant: 240, bounceStiffness: 420, bounceDamping: 40 }}
                                    style={{
                                        x,
                                        y,
                                        scale,
                                        width: 'max(100cqw, 140cqh)',
                                        height: 'max(100cqh, calc(100cqw / 1.4))',
                                        marginLeft: 'calc(max(100cqw, 140cqh) / -2)',
                                        marginTop: 'calc(max(100cqh, calc(100cqw / 1.4)) / -2)',
                                    }}
                                    className="absolute left-1/2 top-1/2 cursor-grab touch-none select-none active:cursor-grabbing"
                                    onPointerDown={() => {
                                        moved.current = false
                                    }}
                                    onDragStart={() => {
                                        moved.current = true
                                        setInteracted(true)
                                    }}
                                    onDragEnd={() => {
                                        setTimeout(() => {
                                            moved.current = false
                                        }, 0)
                                    }}
                                    onDoubleClick={() => zoomTo(zoomIndex + 1)}
                                >
                                    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                                        <rect width={VB_W} height={VB_H} fill="#0f1f17" />
                                        <g stroke="#15291f" strokeWidth="1">
                                            {[200, 400, 600, 800, 1000, 1200].map((gx) => (
                                                <line key={`gx${gx}`} x1={gx} y1="0" x2={gx} y2={VB_H} />
                                            ))}
                                            {[200, 400, 600, 800].map((gy) => (
                                                <line key={`gy${gy}`} x1="0" y1={gy} x2={VB_W} y2={gy} />
                                            ))}
                                        </g>
                                        <g fill="none">
                                            {contours.map((c) => (
                                                <path
                                                    key={c.key}
                                                    d={c.d}
                                                    stroke={c.index ? '#2d5540' : '#1f3a2b'}
                                                    strokeWidth={c.index ? 2.2 : 1.2}
                                                />
                                            ))}
                                        </g>
                                        <path d="M860 650 C 950 640 1000 600 1080 560 C 1180 520 1260 540 1400 500" fill="none" stroke="#1f4f4b" strokeWidth="6" strokeLinecap="round" />
                                        <path d="M600 560 C 560 500 520 470 470 440" fill="none" stroke="#1f4f4b" strokeWidth="3" strokeLinecap="round" />
                                        <path d={LAKE} fill="#10302f" stroke="#2a6660" strokeWidth="3" />
                                        <path d="M650 620 C 690 600 740 604 780 620 M660 660 C 700 646 750 650 800 664" fill="none" stroke="#1d4a47" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M0 600 C 100 610 200 640 320 650" fill="none" stroke="#3b5446" strokeWidth="7" strokeLinecap="round" />
                                        <g fill="none" stroke="#d8c8a0" strokeWidth="2.2" strokeDasharray="7 7" strokeLinecap="round" opacity="0.75">
                                            {trails.map((d) => (
                                                <path key={d} d={d} />
                                            ))}
                                        </g>
                                        {peaks
                                            .filter((p) => p.name)
                                            .map((p) => (
                                                <g key={p.name} transform={`translate(${p.x} ${p.y})`}>
                                                    <path d="M0 -10 L9 6 L-9 6 Z" fill="#cdbf99" />
                                                    <text y="26" textAnchor="middle" fontSize="15" fontWeight="600" fill="#cdbf99" letterSpacing="1">
                                                        {p.name}
                                                    </text>
                                                    <text y="44" textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fill="#7f9a88">
                                                        {p.height}
                                                    </text>
                                                </g>
                                            ))}
                                        <g fontFamily="ui-monospace, monospace" fontSize="11" fill="#4f7560">
                                            <text x="240" y="180">1,700</text>
                                            <text x="610" y="330">1,400</text>
                                            <text x="930" y="150">1,500</text>
                                            <text x="1000" y="740">1,200</text>
                                        </g>
                                        <text x="720" y="640" textAnchor="middle" fontSize="16" fontStyle="italic" fill="#5f9c95" fontFamily="ui-serif, Georgia, serif">
                                            Loon Lake
                                        </text>
                                        <text x="1180" y="505" fontSize="13" fontStyle="italic" fill="#4d8580" fontFamily="ui-serif, Georgia, serif" transform="rotate(-12 1180 505)">
                                            Cedar Run
                                        </text>
                                        <text x="60" y="590" fontSize="11" fill="#6b8676" fontFamily="ui-monospace, monospace" transform="rotate(4 60 590)">
                                            FOREST RD 12
                                        </text>
                                    </svg>

                                    <div className="absolute" style={pct(LODGE.x, LODGE.y)}>
                                        <motion.div style={{ scale: inverse }} className="absolute left-0 top-0 origin-top-left">
                                            <span className="absolute left-0 top-0 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border-2 border-[#0f1f17] bg-[#f5efe4] font-mono text-[10px] font-bold text-[#0f1f17]">
                                                HQ
                                            </span>
                                            <span className="absolute left-0 top-6 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0f1f17]/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#f5efe4]">
                                                Lodge · check-in
                                            </span>
                                        </motion.div>
                                    </div>

                                    {cabins.map((c) => {
                                        const on = c.id === selected.id
                                        return (
                                            <div key={c.id} className={cn('absolute', on ? 'z-20' : 'z-10')} style={pct(c.x, c.y)}>
                                                <motion.div style={{ scale: inverse }} className="absolute left-0 top-0 origin-top-left">
                                                    {on && !reduceMotion && (
                                                        <motion.span
                                                            className="pointer-events-none absolute -left-6 -top-6 size-12 rounded-full border-2 border-[#e8a65d]"
                                                            animate={{ scale: [0.6, 1.5], opacity: [0.9, 0] }}
                                                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        aria-pressed={on}
                                                        aria-label={`${c.name}, sleeps ${c.sleeps}, $${c.price} per night`}
                                                        className={cn(
                                                            'absolute left-0 top-0 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-[#0f1f17] shadow-[0_0_0_1px_rgba(232,166,93,0.5),0_10px_20px_-8px_rgba(0,0,0,0.8)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5efe4]',
                                                            on ? 'bg-[#f5efe4] text-[#0f1f17]' : 'bg-[#e8a65d] text-[#0f1f17] hover:bg-[#f0bb7e]',
                                                        )}
                                                        onClick={() => {
                                                            if (moved.current) return
                                                            selectCabin(c, false)
                                                        }}
                                                    >
                                                        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
                                                            <path d="M10 2 L18 17 H2 Z" fill="currentColor" />
                                                            <path d="M8.2 17 V12.5 H11.8 V17" fill={on ? '#f5efe4' : '#e8a65d'} />
                                                        </svg>
                                                    </button>
                                                    <AnimatePresence initial={false}>
                                                        {(showLabels || on) && (
                                                            <motion.span
                                                                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 4 }}
                                                                className={cn(
                                                                    'pointer-events-none absolute left-0 top-6 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold',
                                                                    on ? 'bg-[#f5efe4] text-[#0f1f17]' : 'bg-[#0f1f17]/85 text-[#f5efe4]',
                                                                )}
                                                            >
                                                                {c.name} · ${c.price}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </div>
                                        )
                                    })}
                                </motion.div>

                                <div className="absolute right-3 top-3 z-30 flex flex-col items-center gap-1 rounded-2xl border border-[#f5efe4]/10 bg-[#0a1510]/80 p-1 backdrop-blur" role="group" aria-label="Map controls">
                                    <button type="button" aria-label="Zoom in" disabled={zoomIndex === ZOOMS.length - 1} className={controlClass} onClick={() => zoomTo(zoomIndex + 1)}>
                                        <LuPlus className="size-5" aria-hidden="true" />
                                    </button>
                                    <span className="font-mono text-[11px] tabular-nums text-[#9fb3a5]" aria-live="polite">
                                        {ZOOMS[zoomIndex]}×
                                    </span>
                                    <button type="button" aria-label="Zoom out" disabled={zoomIndex === 0} className={controlClass} onClick={() => zoomTo(zoomIndex - 1)}>
                                        <LuMinus className="size-5" aria-hidden="true" />
                                    </button>
                                    <span className="my-0.5 h-px w-6 bg-[#f5efe4]/15" aria-hidden="true" />
                                    <button type="button" aria-label="Reset view" className={controlClass} onClick={reset}>
                                        <LuRotateCcw className="size-4" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="pointer-events-none absolute left-3 top-3 z-30 hidden flex-col gap-1.5 rounded-xl bg-[#0a1510]/80 px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider text-[#9fb3a5] backdrop-blur sm:flex">
                                    <span className="flex items-center gap-2">
                                        <span className="size-2.5 rounded-full bg-[#e8a65d]" /> Cabin
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="size-2.5 rounded-sm bg-[#f5efe4]" /> Lodge
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 border-t-2 border-dashed border-[#d8c8a0]" /> Trail
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 border-t border-[#2d5540]" /> 100 m contour
                                    </span>
                                </div>

                                <AnimatePresence>
                                    {!interacted && (
                                        <motion.p
                                            initial={false}
                                            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.3 } }}
                                            className="pointer-events-none absolute bottom-3 left-3 z-30 inline-flex items-center gap-2 rounded-full bg-[#f5efe4] px-3.5 py-2 text-xs font-semibold text-[#0f1f17] shadow-lg"
                                        >
                                            <LuMove className="size-4" aria-hidden="true" />
                                            Drag to explore · double-click to zoom
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <div className="pointer-events-none absolute bottom-3 right-3 z-30 hidden h-[94px] w-[132px] overflow-hidden rounded-xl border border-[#f5efe4]/20 bg-[#0a1510]/85 sm:block" aria-hidden="true">
                                    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full">
                                        {peaks.map((p) => (
                                            <ellipse key={p.seed} cx={p.x} cy={p.y} rx={p.r * 1.1} ry={p.r * 0.8} fill="none" stroke="#2d5540" strokeWidth="18" />
                                        ))}
                                        <path d={LAKE} fill="#1d4a47" />
                                        {cabins.map((c) => (
                                            <circle key={c.id} cx={c.x} cy={c.y} r={c.id === selected.id ? 34 : 24} fill={c.id === selected.id ? '#f5efe4' : '#e8a65d'} />
                                        ))}
                                    </svg>
                                    <motion.span
                                        className="absolute rounded-sm border-2 border-[#f5efe4]"
                                        style={{ left: miniLeft, top: miniTop, width: miniW, height: miniH }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Fly to a cabin">
                            {cabins.map((c) => {
                                const on = c.id === selected.id
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        aria-pressed={on}
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8a65d]',
                                            on
                                                ? 'border-[#e8a65d] bg-[#e8a65d] text-[#0f1f17]'
                                                : 'border-[#2d5540] text-[#f5efe4] hover:border-[#e8a65d]',
                                        )}
                                        onClick={() => selectCabin(c, true)}
                                    >
                                        <LuCrosshair className="size-3.5" aria-hidden="true" />
                                        {c.name}
                                        <span className={cn('font-mono text-xs', on ? 'text-[#0f1f17]/70' : 'text-[#9fb3a5]')}>${c.price}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <aside className="self-start overflow-hidden rounded-[28px] border border-[#1f3a2b] bg-[#0f1f17]" aria-live="polite">
                        <div className="relative aspect-[16/10] bg-[#15291f]">
                            <AnimatePresence initial={false} mode="popLayout">
                                <motion.img
                                    key={selected.id}
                                    src={selected.image}
                                    alt={selected.alt}
                                    loading="lazy"
                                    initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
                                    transition={{ duration: 0.45 }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </AnimatePresence>
                            <span className="absolute left-4 top-4 rounded-full bg-[#0a1510]/80 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#e8a65d] backdrop-blur">
                                Elev. {selected.elevation}
                            </span>
                        </div>
                        <div className="p-6">
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#9fb3a5]">Cabin</p>
                            <h3 className="mt-1 text-3xl font-semibold tracking-tight text-[#f5efe4]">{selected.name}</h3>
                            <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-[#1f3a2b] py-4 text-center">
                                <div>
                                    <dt className="text-[11px] text-[#9fb3a5]">Sleeps</dt>
                                    <dd className="mt-0.5 font-mono text-lg text-[#f5efe4]">{selected.sleeps}</dd>
                                </div>
                                <div className="border-x border-[#1f3a2b] px-1">
                                    <dt className="text-[11px] text-[#9fb3a5]">Layout</dt>
                                    <dd className="mt-0.5 text-sm leading-tight text-[#f5efe4]">{selected.rooms}</dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] text-[#9fb3a5]">From</dt>
                                    <dd className="mt-0.5 font-mono text-lg text-[#e8a65d]">${selected.price}</dd>
                                </div>
                            </dl>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {selected.features.map((f) => (
                                    <li key={f} className="rounded-full bg-[#15291f] px-3 py-1.5 text-xs text-[#d8e2da]">
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <a
                                    href={`#cabin-${selected.id}`}
                                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#e8a65d] px-5 text-sm font-semibold text-[#0f1f17] transition-colors hover:bg-[#f0bb7e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5efe4]"
                                >
                                    Check dates
                                </a>
                                <button
                                    type="button"
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#2d5540] px-4 text-sm font-semibold text-[#f5efe4] transition-colors hover:border-[#e8a65d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8a65d]"
                                    onClick={() => flyTo(selected)}
                                >
                                    <LuCrosshair className="size-4" aria-hidden="true" />
                                    Center on map
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default PanZoomMapView

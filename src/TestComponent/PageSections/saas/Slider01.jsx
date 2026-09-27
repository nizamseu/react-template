// ProductTourSlider

// Slider01 · SaaS Platforms › Animated Slider

// Description:
// A guided product tour for Flowcast, a revenue-forecasting workspace. Under the heading
// "From raw data to a board-ready forecast in five steps." a browser-window mock cycles
// through five UI screens built in markup (Connect data, Model drivers, Forecast, Compare
// scenarios, Share), each with a blue tour tip and a "1/5 Connect data" style caption.
// Use it on a SaaS homepage or product page to walk visitors through the core workflow.

// Design:
// - White background, ink #0b1220 text, slate #475569 copy, Flowcast blue #2563eb for the
//   tour tips, bars, active step and CTA; a blurred blue glow and a #bfdbfe dot grid sit
//   behind a rounded-[22px] app window with a hairline #e2e8f0 border and a blue shadow.
// - Window: chrome bar with traffic lights and a URL pill that changes per step, an icon
//   sidebar from sm (active step highlighted with a sliding pill) and a screen area
//   h-[400px] → sm:h-[420px] → lg:h-[440px]; screens are lists, sliders, an SVG line chart
//   with a P10–P90 band, scenario bars and an approvals card.
// - Type: semibold tight sans headline text-[2rem] → sm:text-5xl → lg:text-[3.5rem]; mono
//   eyebrows, URL and step numbers; captions text-xl → sm:text-2xl.
// - Motion: direction-aware slide + fade between screens, staggered rows, bars and slider
//   fills grow from the left, the chart lines draw in, tour tips spring in (pulsing beacons
//   are motion-safe only); MotionConfig reducedMotion="user" drops the transforms.
// - Below the window: caption on the left, pause/prev/next on the right (stacked below md)
//   and a 5-column step rail whose bars double as the 6 s autoplay progress (labels
//   from md, numbers only below).

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play/pause preference. A
//   framer-motion animate() runs a 0→1 progress motion value for 6 s and then advances;
//   it pauses on mouse hover, keyboard focus or dragging, resumes where it stopped, is
//   stopped on unmount and is off for prefers-reduced-motion until the visitor presses Play.
// - Drag or swipe the screen (framer-motion pan, touch-action pan-y): it follows the
//   pointer; 60 px, or a quick flick (< 250 ms), changes step in the drag direction.
//   ←/→/Home/End work while focus is inside the carousel; drag and the arrow buttons wrap
//   round; step rail buttons jump directly.
// - The caption is an aria-live region (polite while paused); the active step button has
//   aria-current="step". "Start free trial" → #flowcast-trial, "Book a live demo" →
//   #flowcast-demo; the screens themselves are visual only.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ProductTourSlider from '@/TestComponent/PageSections/saas/Slider01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ProductTourSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
    HiArrowLongLeft,
    HiArrowLongRight,
    HiArrowPath,
    HiCheck,
    HiMiniPause,
    HiMiniPlay,
    HiPlus,
    HiSparkles,
} from 'react-icons/hi2';
import { LuChartLine, LuGitBranch, LuPlug, LuSend, LuSlidersHorizontal } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 6
const EASE = [0.22, 1, 0.36, 1]

const steps = [
    {
        id: 'connect',
        label: 'Connect data',
        path: 'sources',
        icon: LuPlug,
        title: 'Plug in billing, CRM and your warehouse.',
        copy: 'Native connectors for Paylane, Salesforge, Ledgerbase and Postgres sync every 15 minutes — no CSV exports, no copy-paste.',
    },
    {
        id: 'model',
        label: 'Model drivers',
        path: 'drivers',
        icon: LuSlidersHorizontal,
        title: 'Turn history into drivers you can tune.',
        copy: 'Flowcast fits new MRR, expansion and churn from 24 months of history, then lets you nudge each driver and see the impact.',
    },
    {
        id: 'forecast',
        label: 'Forecast',
        path: 'forecast/fy27',
        icon: LuChartLine,
        title: 'See the year ahead with honest error bars.',
        copy: 'Every forecast ships with a P10–P90 band, so the board sees a range — not a single hopeful number.',
    },
    {
        id: 'scenarios',
        label: 'Compare scenarios',
        path: 'scenarios',
        icon: LuGitBranch,
        title: 'Stress-test the plan before you commit.',
        copy: 'Clone the base case, add four AEs or a price rise, and compare ending ARR, payback and burn side by side.',
    },
    {
        id: 'share',
        label: 'Share',
        path: 'reports/q3-board-pack',
        icon: LuSend,
        title: 'Send a live board pack, not a stale deck.',
        copy: 'Reports refresh with the data, collect sign-off from approvers and go out every Monday at 08:00.',
    },
]

const total = steps.length
const pad = (n) => String(n).padStart(2, '0')

const screenVariants = {
    enter: (dir) => ({ x: dir < 0 ? '-16%' : '16%', opacity: 0 }),
    center: {
        x: '0%',
        opacity: 1,
        transition: {
            x: { duration: 0.6, ease: EASE },
            opacity: { duration: 0.35 },
            staggerChildren: 0.06,
            delayChildren: 0.12,
        },
    },
    exit: (dir) => ({
        x: dir < 0 ? '16%' : '-16%',
        opacity: 0,
        transition: { duration: 0.32, ease: 'easeIn' },
    }),
}

const item = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
}

const grow = {
    enter: { scaleX: 0 },
    center: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: 0.25 } },
    exit: {},
}

const draw = {
    enter: { pathLength: 0 },
    center: { pathLength: 1, transition: { duration: 1.1, ease: 'easeInOut', delay: 0.2 } },
    exit: {},
}

const tip = {
    enter: { opacity: 0, scale: 0.85, y: 6 },
    center: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 22, delay: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
}

const tipArrow = {
    'top-right': '-top-1 right-4',
    'top-left': '-top-1 left-4',
    'bottom-right': '-bottom-1 right-4',
    'bottom-left': '-bottom-1 left-4',
}

function TourTip({ children, arrow = 'top-right', className, style }) {
    return (
        <motion.span
            variants={tip}
            style={style}
            className={cn(
                'pointer-events-none absolute z-20 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#2563eb] px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_14px_28px_-10px_rgba(37,99,235,0.75)]',
                className,
            )}
        >
            <span aria-hidden="true" className={cn('absolute h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#2563eb]', tipArrow[arrow])} />
            <HiSparkles aria-hidden="true" className="relative shrink-0" />
            <span className="relative">{children}</span>
        </motion.span>
    )
}

function Beacon({ className, style }) {
    return (
        <span
            aria-hidden="true"
            style={style}
            className={cn('pointer-events-none absolute z-10 grid h-3 w-3 place-items-center', className)}
        >
            <span className="absolute h-3 w-3 rounded-full bg-[#2563eb]/40 motion-safe:animate-ping" />
            <span className="h-2 w-2 rounded-full border-2 border-white bg-[#2563eb]" />
        </span>
    )
}

function ScreenHeader({ eyebrow, title, children }) {
    return (
        <motion.div variants={item} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[#64748b]">{eyebrow}</p>
                <p className="mt-1 truncate text-base font-semibold tracking-tight text-[#0b1220] sm:text-lg">{title}</p>
            </div>
            {children}
        </motion.div>
    )
}

const sources = [
    { name: 'Paylane Billing', meta: '48,210 invoices', status: 'Synced', pct: 100, tone: 'bg-[#2563eb]', mark: 'P' },
    { name: 'Salesforge CRM', meta: '12,904 deals', status: 'Synced', pct: 100, tone: 'bg-[#7c3aed]', mark: 'S' },
    { name: 'Ledgerbase GL', meta: '3,118 journal lines', status: 'Syncing', pct: 64, tone: 'bg-[#0891b2]', mark: 'L' },
    { name: 'Postgres warehouse', meta: '2.1M usage events', status: 'Queued', pct: 12, tone: 'bg-[#f59e0b]', mark: 'W' },
]

const statusTone = {
    Synced: 'bg-[#ecfdf5] text-[#047857]',
    Syncing: 'bg-[#eff6ff] text-[#1d4ed8]',
    Queued: 'bg-[#f1f5f9] text-[#475569]',
}

function ConnectScreen() {
    return (
        <div className="flex h-full flex-col">
            <ScreenHeader eyebrow="Northbeam · workspace" title="Data sources">
                <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#2563eb] px-2.5 text-xs font-semibold text-white">
                    <HiPlus aria-hidden="true" />
                    Add source
                </span>
            </ScreenHeader>
            <ul className="mt-4 space-y-2">
                {sources.map((source, i) => (
                    <motion.li
                        key={source.name}
                        variants={item}
                        className={cn(
                            'relative flex items-center gap-3 rounded-xl border bg-white p-2.5 sm:p-3',
                            i === 0 ? 'border-[#93c5fd] ring-4 ring-[#2563eb]/10' : 'border-[#e2e8f0]',
                        )}
                    >
                        <span
                            className={cn(
                                'grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold text-white',
                                source.tone,
                            )}
                        >
                            {source.mark}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                                <p className="truncate text-sm font-semibold text-[#0b1220]">{source.name}</p>
                                <p className="hidden shrink-0 font-mono text-[11px] text-[#64748b] md:block">{source.meta}</p>
                            </div>
                            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#eef2f7]">
                                <motion.span
                                    variants={grow}
                                    className={cn('block h-full rounded-full', source.pct === 100 ? 'bg-[#2563eb]' : 'bg-[#93c5fd]')}
                                    style={{ width: `${source.pct}%`, originX: 0 }}
                                />
                            </span>
                        </div>
                        <span
                            className={cn(
                                'inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[11px] font-semibold',
                                statusTone[source.status],
                            )}
                        >
                            {source.status === 'Synced' && <HiCheck aria-hidden="true" />}
                            {source.status}
                        </span>
                        {i === 0 && (
                            <>
                                <Beacon className="-right-1 -top-1" />
                                <TourTip className="right-2 top-[calc(100%+6px)]">Synced 2 min ago · 48,210 rows</TourTip>
                            </>
                        )}
                    </motion.li>
                ))}
            </ul>
            <motion.p variants={item} className="mt-auto flex items-center gap-2 pt-3 font-mono text-[11px] text-[#64748b]">
                <HiArrowPath aria-hidden="true" className="shrink-0" />
                Next sync in 12 min · every 15 min
            </motion.p>
        </div>
    )
}

const drivers = [
    { name: 'New MRR', detail: 'per month', value: '$184k', pct: 62, spark: [6, 7, 6, 8, 9, 8, 10, 11] },
    { name: 'Expansion', detail: 'net, monthly', value: '3.2%', pct: 48, spark: [5, 6, 6, 5, 7, 7, 8, 8] },
    { name: 'Gross churn', detail: 'monthly, auto-fitted', value: '1.4%', pct: 22, spark: [9, 8, 8, 7, 6, 6, 5, 4], fitted: true },
    { name: 'Seats per deal', detail: 'median', value: '38', pct: 70, spark: [4, 5, 7, 6, 8, 9, 9, 10] },
]

function Sparkline({ values }) {
    const max = Math.max(...values)
    const min = Math.min(...values)
    const points = values
        .map((v, i) => `${((i / (values.length - 1)) * 60).toFixed(1)},${(18 - ((v - min) / (max - min || 1)) * 16).toFixed(1)}`)
        .join(' ')
    return (
        <svg viewBox="0 0 60 20" aria-hidden="true" className="hidden h-5 w-14 shrink-0 sm:block">
            <motion.polyline
                variants={draw}
                points={points}
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function ModelScreen() {
    return (
        <div className="flex h-full flex-col">
            <ScreenHeader eyebrow="FY27 plan · v12" title="Revenue drivers">
                <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-2.5 text-[11px] font-semibold text-[#1d4ed8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                    Auto-fit on
                </span>
            </ScreenHeader>
            <ul className="mt-4 space-y-2">
                {drivers.map((driver) => (
                    <motion.li
                        key={driver.name}
                        variants={item}
                        className={cn(
                            'relative rounded-xl border bg-white px-3 py-2',
                            driver.fitted ? 'border-[#93c5fd] ring-4 ring-[#2563eb]/10' : 'border-[#e2e8f0]',
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#0b1220]">{driver.name}</p>
                                <p className="truncate text-[11px] text-[#64748b]">{driver.detail}</p>
                            </div>
                            <Sparkline values={driver.spark} />
                            <span className="w-14 shrink-0 text-right font-mono text-sm font-semibold text-[#0b1220]">
                                {driver.value}
                            </span>
                        </div>
                        <div className="relative mt-1.5 h-1.5 rounded-full bg-[#eef2f7]">
                            <motion.span
                                variants={grow}
                                className="absolute inset-y-0 left-0 rounded-full bg-[#2563eb]"
                                style={{ width: `${driver.pct}%`, originX: 0 }}
                            />
                            <span
                                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2563eb] bg-white shadow-sm"
                                style={{ left: `${driver.pct}%` }}
                            />
                        </div>
                        {driver.fitted && (
                            <TourTip arrow="bottom-left" className="bottom-[calc(100%+6px)] left-3">
                                Fitted from 24 months of history
                            </TourTip>
                        )}
                    </motion.li>
                ))}
            </ul>
        </div>
    )
}

const arr = [22.8, 23.4, 24.1, 24.6, 25.5, 26.2, 26.9, 27.7, 28.6, 29.5, 30.4, 31.4]
const spread = [0, 0, 0, 0, 0, 0, 0.35, 0.6, 0.85, 1.05, 1.2, 1.32]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const px = (i) => (i / 11) * 600
const py = (v) => 200 - ((v - 20) / 14) * 200
const toPath = (points) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
const actualPath = toPath(arr.slice(0, 6).map((v, i) => [px(i), py(v)]))
const forecastPath = toPath(arr.slice(5).map((v, i) => [px(i + 5), py(v)]))
const bandPath = `${toPath([
    ...arr.slice(5).map((v, i) => [px(i + 5), py(v + spread[i + 5])]),
    ...arr
        .slice(5)
        .map((v, i) => [px(i + 5), py(v - spread[i + 5])])
        .reverse(),
])} Z`
const endTop = `${(py(arr[11]) / 200) * 100}%`

function ForecastScreen() {
    return (
        <div className="flex h-full flex-col">
            <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#64748b]">FY27 ending ARR</p>
                    <p className="mt-1 flex items-center gap-2">
                        <span className="text-2xl font-semibold tracking-tight text-[#0b1220] sm:text-3xl">$31.4M</span>
                        <span className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#047857]">
                            +38% YoY
                        </span>
                    </p>
                </div>
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#475569]">
                    <li className="flex items-center gap-1.5">
                        <span className="h-0.5 w-4 rounded-full bg-[#0b1220]" />
                        Actual
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="h-0.5 w-4 rounded-full border-t-2 border-dashed border-[#2563eb]" />
                        Forecast
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="h-2.5 w-4 rounded-sm bg-[#dbeafe]" />
                        P10–P90
                    </li>
                </ul>
            </motion.div>
            <motion.div variants={item} className="relative mt-4 min-h-0 flex-1 pr-3">
                <div className="relative h-full">
                    <svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
                        {[40, 90, 140, 190].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                x2="600"
                                y1={y}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeDasharray="3 5"
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                        <line x1={px(5)} x2={px(5)} y1="0" y2="200" stroke="#cbd5e1" vectorEffect="non-scaling-stroke" />
                        <motion.path variants={item} d={bandPath} fill="#dbeafe" />
                        <motion.path
                            variants={draw}
                            d={actualPath}
                            fill="none"
                            stroke="#0b1220"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                        <motion.path
                            variants={draw}
                            d={forecastPath}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2.5"
                            strokeDasharray="6 5"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <span className="absolute left-[45.45%] top-1 ml-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748b]">
                        Today
                    </span>
                    <Beacon className="-right-1.5 -translate-y-1/2" style={{ top: endTop }} />
                    <TourTip className="right-0" style={{ top: `calc(${endTop} + 14px)` }}>
                        Dec · $31.4M ± 4.2%
                    </TourTip>
                </div>
            </motion.div>
            <motion.div
                variants={item}
                aria-hidden="true"
                className="mt-2 flex h-4 justify-between pr-3 font-mono text-[10px] uppercase text-[#94a3b8]"
            >
                {months.map((m) => (
                    <span key={m} className="relative w-0">
                        <span className="absolute left-0 top-0 -translate-x-1/2 whitespace-nowrap">
                            <span className="sm:hidden">{m[0]}</span>
                            <span className="hidden sm:inline">{m}</span>
                        </span>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

const scenarios = [
    { name: 'Base plan', note: 'Current hiring, list prices', value: '$31.4M', delta: 'Baseline', pct: 78 },
    { name: 'Hire 4 AEs in Q1', note: '+$1.1M headcount · 7.5 mo payback', value: '$33.9M', delta: '+8.0%', pct: 94, best: true },
    { name: 'Price +8% on Pro', note: 'Assumes 0.3 pt extra churn', value: '$32.7M', delta: '+4.1%', pct: 86 },
]

function ScenarioScreen() {
    return (
        <div className="flex h-full flex-col">
            <ScreenHeader eyebrow="Compare · FY27 ending ARR" title="Scenarios">
                <span className="inline-flex h-8 shrink-0 items-center rounded-lg bg-[#f1f5f9] p-0.5 text-[11px] font-semibold text-[#64748b]">
                    <span className="grid h-full place-items-center rounded-md bg-white px-2.5 text-[#0b1220] shadow-sm">ARR</span>
                    <span className="grid h-full place-items-center px-2.5">Cash</span>
                </span>
            </ScreenHeader>
            <ul className="mt-4 space-y-2.5">
                {scenarios.map((scenario) => (
                    <motion.li
                        key={scenario.name}
                        variants={item}
                        className={cn(
                            'relative rounded-xl border p-3',
                            scenario.best ? 'border-[#93c5fd] bg-[#eff6ff] ring-4 ring-[#2563eb]/10' : 'border-[#e2e8f0] bg-white',
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#0b1220]">{scenario.name}</p>
                                <p className="truncate text-[11px] text-[#64748b]">{scenario.note}</p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="font-mono text-sm font-semibold text-[#0b1220]">{scenario.value}</p>
                                <p
                                    className={cn(
                                        'font-mono text-[11px]',
                                        scenario.delta.startsWith('+') ? 'text-[#047857]' : 'text-[#94a3b8]',
                                    )}
                                >
                                    {scenario.delta}
                                </p>
                            </div>
                        </div>
                        <span className="mt-2.5 block h-2 overflow-hidden rounded-full bg-[#e2e8f0]/70">
                            <motion.span
                                variants={grow}
                                className={cn('block h-full rounded-full', scenario.best ? 'bg-[#2563eb]' : 'bg-[#94a3b8]')}
                                style={{ width: `${scenario.pct}%`, originX: 0 }}
                            />
                        </span>
                        {scenario.best && (
                            <TourTip className="right-3 top-[calc(100%+6px)]">Best case · +$2.5M ARR</TourTip>
                        )}
                    </motion.li>
                ))}
            </ul>
            <motion.p variants={item} className="mt-auto hidden pt-3 font-mono text-[11px] text-[#64748b] sm:block">
                Updated 4 min ago by Maya K. · 3 of 5 scenarios shown
            </motion.p>
        </div>
    )
}

const approvers = [
    { initials: 'MK', name: 'Maya Kaur', role: 'CFO', done: true, tone: 'bg-[#dbeafe] text-[#1d4ed8]' },
    { initials: 'DO', name: 'Daniel Osei', role: 'CEO', done: true, tone: 'bg-[#ede9fe] text-[#6d28d9]' },
    { initials: 'LR', name: 'Lena Ruiz', role: 'Board observer', done: false, tone: 'bg-[#fef3c7] text-[#b45309]' },
]

function ShareScreen() {
    return (
        <div className="flex h-full flex-col">
            <ScreenHeader eyebrow="Reports · scheduled" title="Q3 board pack" />
            <div className="mt-4 grid gap-3 sm:grid-cols-[1.25fr_1fr]">
                <motion.div variants={item} className="rounded-xl border border-[#e2e8f0] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">FY27 forecast · v12</p>
                    <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true" className="mt-2 hidden h-16 w-full sm:block">
                        <path d="M0 52 L28 48 L56 45 L84 40 L112 33 L140 27 L168 18 L200 8 L200 60 L0 60 Z" fill="#eff6ff" />
                        <motion.path
                            variants={draw}
                            d="M0 52 L28 48 L56 45 L84 40 L112 33 L140 27 L168 18 L200 8"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <dl className="mt-2 grid grid-cols-3 gap-2">
                        {[
                            ['ARR', '$31.4M'],
                            ['Burn multiple', '1.3×'],
                            ['Runway', '31 mo'],
                        ].map(([term, value]) => (
                            <div key={term} className="min-w-0">
                                <dt className="truncate text-[10px] text-[#64748b]">{term}</dt>
                                <dd className="font-mono text-sm font-semibold text-[#0b1220]">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </motion.div>
                <motion.div variants={item} className="relative rounded-xl border border-[#e2e8f0] bg-white p-3">
                    <p className="hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b] sm:block">Approvals</p>
                    <ul className="space-y-1.5 sm:mt-2">
                        {approvers.map((person) => (
                            <li key={person.name} className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold',
                                        person.tone,
                                    )}
                                >
                                    {person.initials}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-xs text-[#0b1220]">
                                    {person.name} <span className="text-[#94a3b8]">· {person.role}</span>
                                </span>
                                {person.done ? (
                                    <HiCheck aria-hidden="true" className="shrink-0 text-[#059669]" />
                                ) : (
                                    <span className="shrink-0 text-[10px] font-semibold text-[#b45309]">Pending</span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <TourTip arrow="bottom-right" className="bottom-[calc(100%+6px)] right-3">
                        2 of 3 approvers signed off
                    </TourTip>
                </motion.div>
            </div>
            <motion.div variants={item} className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#64748b]">
                    <HiArrowPath aria-hidden="true" />
                    Every Monday · 08:00
                </span>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0b1220] px-3 text-xs font-semibold text-white">
                    <LuSend aria-hidden="true" />
                    Send to board
                </span>
            </motion.div>
        </div>
    )
}

const screens = {
    connect: ConnectScreen,
    model: ModelScreen,
    forecast: ForecastScreen,
    scenarios: ScenarioScreen,
    share: ShareScreen,
}

export function ProductTourSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, direction], setPage] = useState([0, 0])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const panning = useRef(false)
    const panStartTime = useRef(0)
    const moved = useRef(false)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging

    const step = steps[index]
    const Screen = screens[step.id]

    const paginate = useCallback(
        (dir) => {
            progress.jump(0)
            setPage(([current]) => [(current + dir + total) % total, dir])
        },
        [progress],
    )

    const goTo = (target) => {
        if (target === index) return
        progress.jump(0)
        setPage([target, target > index ? 1 : -1])
    }

    useEffect(() => {
        setHydrated(true)
    }, [])

    // Autoplay: animate progress 0 → 1, resume from the current value after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // framer-motion calls onPan before onPanStart, so whichever runs first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        panStartTime.current = performance.now()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        dragX.set(info.offset.x * 0.45)
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // A short, quick swipe also counts as a flick: framer's velocity can read low when
        // the frameloop was idle before the gesture.
        const elapsed = Math.max(performance.now() - panStartTime.current, 16)
        const flick = Math.abs(velocity.x) > 500 || (elapsed < 250 && Math.abs(offset.x) > 24)
        if (offset.x < -60 || (offset.x < -8 && flick)) paginate(1)
        else if (offset.x > 60 || (offset.x > 8 && flick)) paginate(-1)
        animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 32 })
    }

    const handleKeyDown = (event) => {
        const moves = { ArrowRight: 1, ArrowLeft: -1 }
        const isMove = event.key in moves
        if (!isMove && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        setFocused(true)
        if (isMove) paginate(moves[event.key])
        else goTo(event.key === 'Home' ? 0 : total - 1)
    }

    const handleFocus = (event) => {
        let visible = true
        try {
            visible = event.target.matches(':focus-visible')
        } catch {
            visible = true
        }
        if (visible) setFocused(true)
    }

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-14 text-base font-normal text-[#0b1220] sm:px-6 sm:py-20 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
                        <div className="max-w-2xl">
                            <p className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-[#eff6ff] py-1 pl-1.5 pr-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#1d4ed8]">
                                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2563eb]">
                                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
                                        <path
                                            d="M1.5 10.5c2-4 4-4 6.5 0s4.5 4 6.5 0M1.5 5.5c2-4 4-4 6.5 0s4.5 4 6.5 0"
                                            fill="none"
                                            stroke="#fff"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                                Flowcast · product tour
                            </p>
                            <h2 className="mt-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#0b1220] sm:text-5xl lg:text-[3.5rem]">
                                From raw data to a board-ready forecast in{' '}
                                <span className="text-[#2563eb]">five steps.</span>
                            </h2>
                            <p className="mt-4 max-w-xl text-base leading-7 text-[#475569]">
                                Take the two-minute tour of the forecasting workspace used by 1,800 finance and RevOps
                                teams.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="#flowcast-trial"
                                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.8)] transition-colors hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                            >
                                Start free trial
                                <HiArrowLongRight aria-hidden="true" />
                            </a>
                            <a
                                href="#flowcast-demo"
                                className="inline-flex h-12 items-center rounded-xl px-3 text-sm font-semibold text-[#0b1220] underline decoration-[#bfdbfe] decoration-2 underline-offset-4 transition-colors hover:decoration-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                            >
                                Book a live demo
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Flowcast product tour"
                        className="relative mt-10 sm:mt-14"
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(true)
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setHovered(false)
                        }}
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-x-8 -top-10 bottom-24 bg-[radial-gradient(#bfdbfe_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-[80%] -translate-x-1/2 rounded-full bg-[#2563eb]/15 blur-3xl"
                        />

                        <div
                            role="group"
                            tabIndex={0}
                            aria-label="Tour screens, use the left and right arrow keys to browse"
                            className="relative overflow-hidden rounded-[22px] border border-[#e2e8f0] bg-white shadow-[0_40px_80px_-40px_rgba(37,99,235,0.45),0_2px_6px_rgba(15,23,42,0.06)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563eb]"
                        >
                            <div className="flex h-11 items-center gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-3 sm:px-4">
                                <span aria-hidden="true" className="flex shrink-0 gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" />
                                </span>
                                <span className="flex h-7 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md border border-[#e2e8f0] bg-white px-2 font-mono text-[11px] text-[#64748b] sm:mx-auto sm:max-w-md">
                                    <span className="truncate">
                                        app.flowcast.io/northbeam/
                                        <AnimatePresence initial={false} mode="wait">
                                            <motion.span
                                                key={step.path}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-[#0b1220]"
                                            >
                                                {step.path}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                </span>
                                <span className="hidden shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#047857] sm:inline-flex">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                                    Live
                                </span>
                            </div>

                            <div className="flex">
                                <div
                                    aria-hidden="true"
                                    className="hidden w-14 shrink-0 flex-col items-center gap-2 border-r border-[#e2e8f0] bg-[#f8fafc] py-4 sm:flex"
                                >
                                    <span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-[#0b1220]">
                                        <svg viewBox="0 0 16 16" className="h-4 w-4">
                                            <path
                                                d="M1.5 10.5c2-4 4-4 6.5 0s4.5 4 6.5 0M1.5 5.5c2-4 4-4 6.5 0s4.5 4 6.5 0"
                                                fill="none"
                                                stroke="#60a5fa"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </span>
                                    {steps.map((item, i) => {
                                        const Icon = item.icon
                                        return (
                                            <span
                                                key={item.id}
                                                className={cn(
                                                    'relative grid h-9 w-9 place-items-center rounded-lg text-base transition-colors duration-300',
                                                    i === index ? 'text-white' : 'text-[#94a3b8]',
                                                )}
                                            >
                                                {i === index && (
                                                    <motion.span
                                                        layoutId="flowcast-tour-rail"
                                                        className="absolute inset-0 rounded-lg bg-[#2563eb]"
                                                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                    />
                                                )}
                                                <Icon className="relative" />
                                            </span>
                                        )
                                    })}
                                </div>

                                <motion.div
                                    className="relative h-[400px] min-w-0 flex-1 cursor-grab touch-pan-y select-none overflow-hidden bg-[#f8fafc] active:cursor-grabbing sm:h-[420px] lg:h-[440px]"
                                    onPanStart={beginPan}
                                    onPan={handlePan}
                                    onPanEnd={handlePanEnd}
                                    onPointerDownCapture={() => {
                                        moved.current = false
                                    }}
                                    onClickCapture={(event) => {
                                        if (moved.current) {
                                            event.preventDefault()
                                            event.stopPropagation()
                                        }
                                    }}
                                >
                                    <motion.div className="absolute inset-0" style={{ x: dragX }}>
                                        <AnimatePresence initial={false} custom={direction}>
                                            <motion.div
                                                key={step.id}
                                                role="group"
                                                aria-roledescription="slide"
                                                aria-label={`${index + 1} of ${total}: ${step.label}`}
                                                custom={direction}
                                                variants={screenVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                className="absolute inset-0 p-4 sm:p-5 lg:p-7"
                                            >
                                                <Screen />
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
                            <div
                                aria-live={playing ? 'off' : 'polite'}
                                aria-atomic="true"
                                className="min-h-[11.5rem] sm:min-h-[9rem] md:min-h-[7.5rem]"
                            >
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.3, ease: EASE }}
                                    >
                                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#2563eb]">
                                            <span className="font-semibold">
                                                {index + 1}/{total}
                                            </span>{' '}
                                            · {step.label}
                                        </p>
                                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#0b1220] sm:text-2xl">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569] sm:text-base sm:leading-7">
                                            {step.copy}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause the tour' : 'Play the tour'}
                                    className="grid h-11 w-11 place-items-center rounded-full text-lg text-[#475569] transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous step"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#cbd5e1] text-lg text-[#0b1220] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next step"
                                    className="grid h-11 w-11 place-items-center rounded-full bg-[#0b1220] text-lg text-white transition-colors hover:bg-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div role="group" aria-label="Tour steps" className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
                            {steps.map((item, i) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-label={`Step ${i + 1} of ${total}: ${item.label}`}
                                    aria-current={i === index ? 'step' : undefined}
                                    className="group flex min-h-11 min-w-0 flex-col justify-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                                    onClick={() => goTo(i)}
                                >
                                    <span className="relative block h-1 w-full overflow-hidden rounded-full bg-[#e2e8f0] transition-colors group-hover:bg-[#cbd5e1]">
                                        <motion.span
                                            className="absolute inset-0 origin-left rounded-full bg-[#2563eb]"
                                            style={{
                                                scaleX: i === index ? (autoplayOn ? progress : 1) : i < index ? 1 : 0,
                                            }}
                                        />
                                    </span>
                                    <span
                                        className={cn(
                                            'flex min-w-0 items-baseline gap-2 text-xs transition-colors',
                                            i === index ? 'text-[#0b1220]' : 'text-[#94a3b8] group-hover:text-[#475569]',
                                        )}
                                    >
                                        <span className="font-mono font-semibold">{pad(i + 1)}</span>
                                        <span className="hidden truncate font-medium md:inline">{item.label}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default ProductTourSlider

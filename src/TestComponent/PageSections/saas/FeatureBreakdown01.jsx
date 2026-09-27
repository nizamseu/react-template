// StickyScreenFeatureBreakdown

// FeatureBreakdown01 · SaaS Platforms › Feature Breakdown

// Description:
// A scroll-driven product tour for the analytics platform Pulseboard. Under the heading
// "From raw events to the answer, in four screens." a sticky app window on the left swaps
// between a live dashboard, a funnel, a retention cohort grid and an alerts view as the
// matching feature blocks (Dashboards, Funnels, Cohorts, Alerts) scroll past on the right.
// Use it on a product or features page to explain a multi-part tool one idea at a time.

// Design:
// - White #ffffff section, slate #0f172a text, slate #64748b body copy and indigo #4f46e5
//   accents (numbers, active tab, chart line, progress bar); emerald and rose only as UI data
// - lg: two columns (1.1fr / 1fr, minmax(0) tracks); the left app window is sticky at
//   top-24 with a URL bar, four tab pills and a progress bar; right blocks are
//   min-h-[75vh] and fade to 35% when inactive
// - Screens are pure markup + inline SVG: KPI tiles and an area chart, horizontal funnel bars
//   with a drop-off badge, a 6×6 indigo heat-map, and alert cards with a spike sparkline
// - Motion: screens cross-fade and slide 16px with AnimatePresence (mode "wait"); funnel and
//   cohort cells grow in on entry; slide offsets are removed for reduced motion
// - Mobile/tablet (below lg): no sticky window; every block shows its own copy of its screen
//   above the text in a single column

// What it does:
// - Each block uses useInView with a -45% top/bottom margin, so the block crossing the
//   middle of the viewport becomes active and drives the sticky screen
// - The tab pills (aria-current) set the screen and scroll their block to the centre
//   (smooth, or instant for reduced motion)
// - "Start a free 14-day trial" links to #pulseboard-trial; chart data is static and
//   visual-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StickyScreenFeatureBreakdown from '@/TestComponent/PageSections/saas/FeatureBreakdown01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <StickyScreenFeatureBreakdown />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiOutlineBell } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const features = [
    {
        id: 'dashboards',
        label: 'Dashboards',
        path: 'acme/dashboards/growth',
        title: 'Live dashboards that update as events land',
        body: 'Pulseboard streams every event in under two seconds, so the numbers on the office TV match what customers are doing right now. No nightly batch, no stale Monday report.',
        points: ['38 chart types, from sparklines to Sankey', 'Launch and incident annotations', 'Read-only links for the board deck'],
        stat: { value: '1.9s', label: 'median event-to-chart latency' },
    },
    {
        id: 'funnels',
        label: 'Funnels',
        path: 'acme/funnels/trial-to-paid',
        title: 'Funnels that show exactly where people leave',
        body: 'Pick any four events and Pulseboard draws the path between them, flags the worst drop-off and lets you open the sessions behind it with one click.',
        points: ['Conversion windows from 1 hour to 90 days', 'Split by plan, country or campaign', 'Open the users who dropped'],
        stat: { value: '+22%', label: 'average trial-to-paid lift after fixing one step' },
    },
    {
        id: 'cohorts',
        label: 'Cohorts',
        path: 'acme/retention/weekly',
        title: 'Retention cohorts without writing SQL',
        body: 'See whether the people you signed up in August are still around in September. Every cell is clickable, so a dip turns into a list of accounts to call.',
        points: ['Weekly, monthly or custom cohorts', 'Compare two releases side by side', 'Export a cohort to your CRM'],
        stat: { value: '6 wks', label: 'of retention visible on the first day of tracking' },
    },
    {
        id: 'alerts',
        label: 'Alerts',
        path: 'acme/alerts',
        title: 'Alerts that fire before customers notice',
        body: 'Pulseboard learns each metric’s normal rhythm, weekday dips included, and pings the right channel when something drifts. Quiet hours keep the on-call rota sane.',
        points: ['Anomaly detection, no thresholds to guess', 'Chat, email and pager destinations', 'Snooze, mute and quiet hours'],
        stat: { value: '4 min', label: 'mean time to detect a real anomaly' },
    },
]

const activeUsers = [42, 45, 44, 48, 52, 50, 55, 58, 56, 61, 63, 60, 66, 70, 68, 72, 75, 74, 79, 83, 80, 86, 88, 91, 89, 94, 97, 95, 100, 104]
const chartPoints = activeUsers.map((value, index) => [index * (300 / (activeUsers.length - 1)), 104 - (value - 36) * 0.95])
const chartLine = chartPoints.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
const chartArea = `${chartLine} L300 110 L0 110 Z`

const funnel = [
    { label: 'Viewed pricing', value: 12400 },
    { label: 'Started trial', value: 3720 },
    { label: 'Invited a teammate', value: 1860 },
    { label: 'Upgraded to paid', value: 744 },
]

const cohorts = [
    { week: 'Aug 3', cells: [100, 64, 52, 47, 44, 42] },
    { week: 'Aug 10', cells: [100, 61, 50, 46, 43] },
    { week: 'Aug 17', cells: [100, 66, 55, 49] },
    { week: 'Aug 24', cells: [100, 70, 58] },
    { week: 'Aug 31', cells: [100, 72] },
    { week: 'Sep 7', cells: [100] },
]

const alertRules = [
    { id: 'signups', rule: 'Sign-ups drop 30% vs. last Tuesday', channel: '#growth', on: true },
    { id: 'p95', rule: 'p95 page load above 2.5 s', channel: 'Pager · web', on: true },
    { id: 'churn', rule: 'Churned MRR over $5k in a day', channel: 'finance@', on: false },
]

function Panel({ className, children }) {
    return <div className={cn('rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:p-4', className)}>{children}</div>
}

function DashboardScreen() {
    const gradientId = useId()
    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                    { label: 'Active users', value: '18,420', delta: '▲ 12.4%' },
                    { label: 'Conversion', value: '4.8%', delta: '▲ 0.6 pts' },
                    { label: 'MRR', value: '$212k', delta: '▲ 8.1%' },
                ].map((kpi) => (
                    <Panel key={kpi.label} className="p-2.5 sm:p-3">
                        <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[#64748b] sm:text-[10px]">
                            {kpi.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold tabular-nums text-[#0f172a] sm:text-xl">{kpi.value}</p>
                        <p className="mt-0.5 text-[9px] font-semibold text-emerald-600 sm:text-[10px]">{kpi.delta}</p>
                    </Panel>
                ))}
            </div>
            <Panel>
                <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="truncate font-semibold text-[#0f172a]">Active users · last 30 days</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[#64748b]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                        Live
                    </span>
                </div>
                <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="mt-3 h-28 w-full sm:h-40" aria-hidden="true">
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[28, 56, 84].map((y) => (
                        <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                    ))}
                    <path d={chartArea} fill={`url(#${gradientId})`} />
                    <path d={chartLine} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    <line x1="200" x2="200" y1="0" y2="110" stroke="#94a3b8" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#64748b]">
                    <span>Aug 28</span>
                    <span className="rounded bg-[#eef2ff] px-1.5 py-0.5 font-semibold text-[#4f46e5]">v4.2 launch</span>
                    <span>Sep 26</span>
                </div>
            </Panel>
        </div>
    )
}

function FunnelScreen({ reduceMotion }) {
    const max = funnel[0].value
    return (
        <Panel className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="truncate font-semibold text-[#0f172a]">Trial to paid · 30-day window</span>
                <span className="shrink-0 font-semibold text-[#4f46e5]">6.0% overall</span>
            </div>
            {funnel.map((step, index) => {
                const previous = index ? funnel[index - 1].value : step.value
                const rate = Math.round((step.value / previous) * 100)
                const worst = index === 1
                return (
                    <div key={step.label}>
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="truncate text-[#334155]">
                                {index + 1}. {step.label}
                            </span>
                            <span className="shrink-0 tabular-nums text-[#64748b]">
                                {step.value.toLocaleString('en-US')}
                                {index > 0 && (
                                    <span
                                        className={cn(
                                            'ml-1.5 rounded px-1 py-0.5 text-[10px] font-semibold',
                                            worst ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-[#475569]',
                                        )}
                                    >
                                        {rate}%
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="mt-1.5 h-6 overflow-hidden rounded-md bg-slate-100 sm:h-7">
                            <motion.div
                                className="h-full origin-left rounded-md bg-[#4f46e5]"
                                style={{ width: `${(step.value / max) * 100}%`, opacity: 1 - index * 0.18 }}
                                initial={{ scaleX: reduceMotion ? 1 : 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.7, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>
                )
            })}
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] leading-snug text-rose-700">
                Biggest drop: 70% leave between pricing and trial. 212 sessions tagged “plan confusion”.
            </p>
        </Panel>
    )
}

function CohortScreen({ reduceMotion }) {
    return (
        <Panel>
            <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="truncate font-semibold text-[#0f172a]">Weekly retention · all sign-ups</span>
                <span className="shrink-0 text-[#64748b]">% active</span>
            </div>
            <div className="mt-3 grid grid-cols-[3.25rem_repeat(6,minmax(0,1fr))] gap-1 text-[9px] sm:grid-cols-[3.75rem_repeat(6,minmax(0,1fr))] sm:text-[10px]">
                <span />
                {['W0', 'W1', 'W2', 'W3', 'W4', 'W5'].map((week) => (
                    <span key={week} className="text-center font-semibold text-[#64748b]">
                        {week}
                    </span>
                ))}
                {cohorts.map((cohort, row) => (
                    <div key={cohort.week} className="contents">
                        <span className="self-center truncate text-[#475569]">{cohort.week}</span>
                        {[0, 1, 2, 3, 4, 5].map((column) => {
                            const value = cohort.cells[column]
                            return value === undefined ? (
                                <span key={column} className="h-7 rounded bg-slate-50 sm:h-9" />
                            ) : (
                                <motion.span
                                    key={column}
                                    className={cn(
                                        'grid h-7 place-items-center rounded font-semibold tabular-nums sm:h-9',
                                        value > 50 ? 'text-white' : 'text-[#312e81]',
                                    )}
                                    style={{ backgroundColor: `rgba(79, 70, 229, ${0.1 + (value / 100) * 0.85})` }}
                                    initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.35, delay: (row + column) * 0.04 }}
                                >
                                    {value}
                                </motion.span>
                            )
                        })}
                    </div>
                ))}
            </div>
        </Panel>
    )
}

function AlertScreen() {
    return (
        <div className="grid gap-3">
            <Panel className="border-l-4 border-rose-500 ring-rose-200">
                <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                        <HiOutlineBell className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-[#0f172a] sm:text-[13px]">
                            Checkout errors up 3.2× in eu-west-1
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#64748b] sm:text-[11px]">
                            Triggered 14:02 · #payments-oncall notified
                        </p>
                    </div>
                </div>
                <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="mt-3 h-10 w-full" aria-hidden="true">
                    <path
                        d="M0 32 L20 30 L40 33 L60 31 L80 32 L100 30 L120 31 L140 29 L150 12 L160 6 L170 9 L180 8 L200 10"
                        fill="none"
                        stroke="#e11d48"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                    <rect x="0" y="22" width="200" height="14" fill="#4f46e5" opacity="0.08" />
                </svg>
            </Panel>
            <Panel className="space-y-2.5">
                <p className="text-[11px] font-semibold text-[#0f172a]">Alert rules</p>
                {alertRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between gap-3 text-[11px]">
                        <div className="min-w-0">
                            <p className="truncate text-[#334155]">{rule.rule}</p>
                            <p className="text-[10px] text-[#94a3b8]">{rule.channel}</p>
                        </div>
                        <span
                            className={cn(
                                'relative h-4 w-7 shrink-0 rounded-full transition-colors',
                                rule.on ? 'bg-[#4f46e5]' : 'bg-slate-200',
                            )}
                        >
                            <span
                                className={cn(
                                    'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow',
                                    rule.on ? 'left-3.5' : 'left-0.5',
                                )}
                            />
                        </span>
                    </div>
                ))}
            </Panel>
        </div>
    )
}

function Screen({ id, reduceMotion }) {
    if (id === 'funnels') return <FunnelScreen reduceMotion={reduceMotion} />
    if (id === 'cohorts') return <CohortScreen reduceMotion={reduceMotion} />
    if (id === 'alerts') return <AlertScreen />
    return <DashboardScreen />
}

function AppWindow({ path, children, className }) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)]',
                className,
            )}
        >
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-md bg-slate-100 px-3 py-1 font-mono text-[10px] text-[#64748b] sm:text-[11px]">
                    app.pulseboard.io/{path}
                </span>
            </div>
            {children}
        </div>
    )
}

function FeatureBlock({ feature, index, active, onActive, blockRef, reduceMotion }) {
    const localRef = useRef(null)
    const inView = useInView(localRef, { margin: '-45% 0px -45% 0px' })

    useEffect(() => {
        if (inView) onActive(index)
    }, [inView, index, onActive])

    return (
        <article
            ref={(node) => {
                localRef.current = node
                blockRef(node)
            }}
            className={cn(
                'scroll-mt-24 transition-opacity duration-500 lg:flex lg:min-h-[75vh] lg:flex-col lg:justify-center',
                active ? 'lg:opacity-100' : 'lg:opacity-35',
            )}
        >
            <AppWindow path={feature.path} className="mb-8 lg:hidden">
                <div className="p-3 sm:p-4">
                    <Screen id={feature.id} reduceMotion={reduceMotion} />
                </div>
            </AppWindow>

            <p className="font-mono text-xs font-semibold text-[#4f46e5]">
                {String(index + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')} · {feature.label}
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0f172a] sm:text-3xl">
                {feature.title}
            </h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#64748b]">{feature.body}</p>
            <ul className="mt-6 space-y-2.5">
                {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-[#334155]">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#eef2ff] text-[#4f46e5]">
                            <HiCheck className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {point}
                    </li>
                ))}
            </ul>
            <p className="mt-7 flex items-baseline gap-3 border-t border-slate-200 pt-5">
                <span className="text-3xl font-semibold tracking-tight text-[#0f172a]">{feature.stat.value}</span>
                <span className="text-sm text-[#64748b]">{feature.stat.label}</span>
            </p>
        </article>
    )
}

export function StickyScreenFeatureBreakdown({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(0)
    const blocks = useRef([])
    const current = features[active]

    const goTo = (index) => {
        setActive(index)
        blocks.current[index]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#ffffff] py-16 text-base font-normal text-[#0f172a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4f46e5]">
                        Pulseboard · Product tour
                    </p>
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#0f172a] sm:text-5xl lg:text-6xl">
                        From raw events to the answer, in <span className="text-[#4f46e5]">four screens.</span>
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-[#64748b] md:text-lg">
                        One tracking snippet, no warehouse required. Here is what your team sees on day one.
                    </p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-16 md:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <AppWindow path={current.path}>
                                <div className="flex gap-1.5 border-b border-slate-200 bg-white px-4 py-3" role="group" aria-label="Screens">
                                    {features.map((feature, index) => (
                                        <button
                                            key={feature.id}
                                            type="button"
                                            aria-current={active === index ? 'step' : undefined}
                                            onClick={() => goTo(index)}
                                            className={cn(
                                                'min-h-10 rounded-full px-3.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5]',
                                                active === index
                                                    ? 'bg-[#4f46e5] text-white'
                                                    : 'text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a]',
                                            )}
                                        >
                                            {feature.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative h-[27rem] p-5">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={current.id}
                                            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <Screen id={current.id} reduceMotion={reduceMotion} />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <div className="h-1 bg-slate-100" aria-hidden="true">
                                    <motion.div
                                        className="h-full bg-[#4f46e5]"
                                        initial={false}
                                        animate={{ width: `${((active + 1) / features.length) * 100}%` }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                            </AppWindow>
                            <p className="sr-only" aria-live="polite">
                                Showing {current.label}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-20 lg:space-y-0">
                        {features.map((feature, index) => (
                            <FeatureBlock
                                key={feature.id}
                                feature={feature}
                                index={index}
                                active={active === index}
                                onActive={setActive}
                                blockRef={(node) => {
                                    blocks.current[index] = node
                                }}
                                reduceMotion={reduceMotion}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-start gap-4 rounded-2xl bg-[#0f172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 md:mt-20">
                    <p className="text-lg font-semibold text-white">
                        See your own events on these screens in about 10 minutes.
                    </p>
                    <a
                        href="#pulseboard-trial"
                        className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#4f46e5] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#6366f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Start a free 14-day trial
                        <HiArrowLongRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default StickyScreenFeatureBreakdown

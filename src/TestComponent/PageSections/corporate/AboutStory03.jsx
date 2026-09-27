// ValuesLedgerAboutStory

// AboutStory03 · Corporate & Business › About Us / Story

// Description:
// A mission-and-values block for Clearwater Bank, a member-owned regional bank chartered in
// 1919. The mission "We keep a valley’s money close to home, and lend it back on terms
// anyone can read in one sitting." sits beside a note from the president, followed by four
// value cards ("Plain terms", "Local first", "Patient capital", "Open books"), each with
// one audited proof point, and a ledger row of four headline figures that count up. Use it
// on an about page for banks, insurers, co-ops or any trust-led institution.

// Design:
// - White section, ink #10262d, deep teal #0f4c5c for headings and card rules, brass
//   #b08d57 for icons, rosette and double "ledger" rules; cards on mist #f3f6f5
// - Serif display mission (text-3xl → lg:text-[3.3rem]); mono entry numbers, labels and
//   tabular figures; square corners, 3px teal top rules, dotted leaders before each proof
// - A brass guilloche rosette (36 rotated SVG ellipses) sits behind the president's note
//   and turns very slowly (static for reduced motion)
// - Cards invert to teal with white text on hover or keyboard focus-within; figures count
//   up from zero the first time the row scrolls into view
// - Responsive: header stacks then splits 1.45fr / 1fr at lg; cards 1 → sm:2 → xl:4
//   columns; figures 2 × 2 → lg:4 across with vertical hairlines

// What it does:
// - Each figure runs a framer-motion animate() count once in view (useInView); figures
//   already on screen at load, and all figures under reduced motion, show the final value
// - The final value is always in an sr-only span, so screen readers never hear the count
// - "How we measure it" links go to #clearwater-proof-<value>; "Read the 2025 annual
//   statement" goes to #clearwater-annual-statement

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ValuesLedgerAboutStory from '@/TestComponent/PageSections/corporate/AboutStory03';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <ValuesLedgerAboutStory />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { LuBookOpen, LuFileText, LuMapPin, LuSprout } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const values = [
    {
        id: 'plain-terms',
        icon: LuFileText,
        title: 'Plain terms',
        text: 'Every product ships with a one-page summary in everyday English, written before the legal version, not after.',
        proof: '9 pages',
        proofNote: 'Our standard mortgage contract. The US median is 37.',
    },
    {
        id: 'local-first',
        icon: LuMapPin,
        title: 'Local first',
        text: 'Money deposited in the Harbor Valley is lent back in the Harbor Valley: homes, farms, clinics and main-street shops.',
        proof: '94¢',
        proofNote: 'Of every deposit dollar, lent within 60 miles of a branch.',
    },
    {
        id: 'patient-capital',
        icon: LuSprout,
        title: 'Patient capital',
        text: 'We lend on the timeline of the thing being built, not the next quarterly result, and we do not sell loans on.',
        proof: '11.4 yrs',
        proofNote: 'Average term of a Clearwater small-business loan.',
    },
    {
        id: 'open-books',
        icon: LuBookOpen,
        title: 'Open books',
        text: 'Fees, rates and executive pay are published online and taped inside every branch window, updated each quarter.',
        proof: '$0',
        proofNote: 'Overdraft fees charged since 1 January 2021.',
    },
]

const figures = [
    { id: 'lending', value: 4.2, decimals: 1, prefix: '$', suffix: 'B', label: 'Lent in the valley' },
    { id: 'members', value: 186400, label: 'Member-owners' },
    { id: 'years', value: 107, label: 'Years on one charter' },
    { id: 'branches', value: 23, label: 'Branches, each able to approve a loan' },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d57]'

function formatNumber(value, decimals) {
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function Counter({ value, decimals = 0, prefix = '', suffix = '' }) {
    const ref = useRef(null)
    const armed = useRef(false)
    const reduceMotion = useReducedMotion()
    const inView = useInView(ref, { once: true, amount: 0.6 })
    const [display, setDisplay] = useState(value)

    useEffect(() => {
        if (reduceMotion || !ref.current) return
        if (ref.current.getBoundingClientRect().top > window.innerHeight) {
            armed.current = true
            setDisplay(0)
        }
    }, [reduceMotion])

    useEffect(() => {
        if (!inView || !armed.current) return undefined
        armed.current = false
        const controls = animate(0, value, {
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => setDisplay(latest),
        })
        return () => controls.stop()
    }, [inView, value])

    return (
        <span ref={ref}>
            <span aria-hidden="true">
                {prefix}
                {formatNumber(display, decimals)}
                {suffix}
            </span>
            <span className="sr-only">
                {prefix}
                {formatNumber(value, decimals)}
                {suffix}
            </span>
        </span>
    )
}

export function ValuesLedgerAboutStory({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white py-16 font-sans text-base font-normal text-[#10262d] md:py-24',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0f4c5c]">
                    <p className="font-semibold">Clearwater Bank</p>
                    <p className="text-[#10262d]/60">Mission &amp; values · Mutual since 1919</p>
                </div>
                <div aria-hidden="true" className="mt-3 space-y-[3px]">
                    <div className="h-px bg-[#b08d57]" />
                    <div className="h-px bg-[#b08d57]/60" />
                </div>

                <div className="mt-12 grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-center lg:gap-16">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b08d57]">Our mission</p>
                        <h2 className="mt-4 font-serif text-3xl font-normal leading-[1.12] tracking-tight text-[#0f4c5c] sm:text-4xl lg:text-[3.3rem]">
                            We keep a valley’s money close to home, and lend it back on terms{' '}
                            <em className="text-[#10262d]">anyone can read in one sitting.</em>
                        </h2>
                    </div>

                    <div className="relative isolate">
                        <motion.svg
                            viewBox="0 0 400 400"
                            aria-hidden="true"
                            className="absolute -right-16 -top-20 -z-10 size-[22rem] text-[#b08d57] opacity-30 sm:-right-10"
                            animate={reduceMotion ? undefined : { rotate: 360 }}
                            transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
                        >
                            {Array.from({ length: 36 }, (_, i) => (
                                <ellipse
                                    key={i}
                                    cx="200"
                                    cy="200"
                                    rx="190"
                                    ry="64"
                                    transform={`rotate(${i * 5} 200 200)`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.7"
                                />
                            ))}
                            <circle cx="200" cy="200" r="58" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        </motion.svg>
                        <div className="border-l-2 border-[#b08d57] bg-white/85 py-2 pl-6 backdrop-blur-[2px]">
                            <p className="leading-relaxed text-[#10262d]/80">
                                Clearwater is owned by the people who bank here. With no outside shareholders to
                                pay, what we earn goes back into lower rates, fewer fees and the eleven towns along
                                the Harbor Valley.
                            </p>
                            <p className="mt-5 font-serif text-lg italic text-[#0f4c5c]">Adaeze Mbeki</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#10262d]/60">President &amp; CEO since 2017</p>
                            <a
                                href="#clearwater-annual-statement"
                                className={cn(
                                    'group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0f4c5c] hover:text-[#b08d57]',
                                    focusRing,
                                )}
                            >
                                <span className="border-b border-current pb-0.5">Read the 2025 annual statement</span>
                                <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-end justify-between gap-6 border-b border-[#10262d]/15 pb-4 md:mt-20">
                    <h3 className="font-serif text-2xl font-normal tracking-tight text-[#10262d] sm:text-3xl">
                        Four values, each with a receipt
                    </h3>
                    <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#10262d]/55 sm:block">
                        Verified Q4 2025
                    </p>
                </div>

                <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {values.map((value, index) => {
                        const Icon = value.icon
                        return (
                            <li key={value.id}>
                                <article className="group flex h-full flex-col border-t-[3px] border-[#0f4c5c] bg-[#f3f6f5] p-6 transition-colors duration-300 hover:bg-[#0f4c5c] focus-within:bg-[#0f4c5c] sm:p-7">
                                    <div className="flex items-start justify-between">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#10262d]/60 transition-colors group-hover:text-white/70 group-focus-within:text-white/70">
                                            Entry {String(index + 1).padStart(2, '0')}
                                        </p>
                                        <span className="grid size-12 place-items-center rounded-full border border-[#b08d57] text-[#b08d57] transition-colors group-hover:bg-[#b08d57] group-hover:text-[#0f4c5c] group-focus-within:bg-[#b08d57] group-focus-within:text-[#0f4c5c]">
                                            <Icon aria-hidden="true" className="size-5" />
                                        </span>
                                    </div>
                                    <h4 className="mt-6 font-serif text-2xl font-normal text-[#0f4c5c] transition-colors group-hover:text-white group-focus-within:text-white">
                                        {value.title}
                                    </h4>
                                    <p className="mt-3 text-sm leading-relaxed text-[#10262d]/75 transition-colors group-hover:text-white/80 group-focus-within:text-white/80">
                                        {value.text}
                                    </p>

                                    <div className="mt-auto pt-8">
                                        <p className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#b08d57]">
                                            Proof
                                            <span aria-hidden="true" className="flex-1 border-b border-dotted border-[#b08d57]/70" />
                                        </p>
                                        <p className="mt-2 font-serif text-4xl tabular-nums text-[#10262d] transition-colors group-hover:text-white group-focus-within:text-white">
                                            {value.proof}
                                        </p>
                                        <p className="mt-1 text-sm leading-snug text-[#10262d]/70 transition-colors group-hover:text-white/75 group-focus-within:text-white/75">
                                            {value.proofNote}
                                        </p>
                                        <a
                                            href={`#clearwater-proof-${value.id}`}
                                            className={cn(
                                                'mt-4 inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f4c5c] transition-colors group-hover:text-[#e7cf9f] group-focus-within:text-[#e7cf9f]',
                                                focusRing,
                                            )}
                                        >
                                            How we measure it
                                            <HiArrowLongRight aria-hidden="true" className="size-4" />
                                        </a>
                                    </div>
                                </article>
                            </li>
                        )
                    })}
                </ul>

                <dl className="mt-16 grid grid-cols-2 border-y border-[#10262d]/15 lg:grid-cols-4">
                    {figures.map((figure, index) => (
                        <div
                            key={figure.id}
                            className={cn(
                                'px-3 py-8 sm:px-6',
                                index % 2 === 1 && 'border-l border-[#10262d]/15',
                                index >= 2 && 'border-t border-[#10262d]/15 lg:border-t-0',
                                index === 2 && 'lg:border-l',
                            )}
                        >
                            <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#10262d]/60 sm:text-[11px]">
                                {figure.label}
                            </dt>
                            <dd className="mt-3 font-serif text-[2.1rem] leading-none tabular-nums tracking-tight text-[#0f4c5c] sm:text-5xl lg:text-6xl">
                                <Counter
                                    value={figure.value}
                                    decimals={figure.decimals}
                                    prefix={figure.prefix}
                                    suffix={figure.suffix}
                                />
                            </dd>
                            <div aria-hidden="true" className="mt-4 h-[3px] w-10 bg-[#b08d57]" />
                        </div>
                    ))}
                </dl>
                <p className="mt-4 font-mono text-[11px] leading-relaxed tracking-wide text-[#10262d]/55">
                    Figures as at 31 December 2025, from the audited annual statement (Hale &amp; Morrow LLP).
                </p>
            </div>
        </section>
    )
}

export default ValuesLedgerAboutStory

// EditorialQuoteLogoCloud

// LogoCloud05 · SaaS Platforms › Client / Social Proof Bar

// Description:
// A quiet, magazine-style testimonial for the knowledge-base product Nimbus Docs. One large
// serif quote from Mara Ellison, CTO at Tidewater ("We folded four wikis and 11,400 stale
// pages into Nimbus in one quarter …"), sits next to her arched portrait with three
// outcome figures and a "Read the Tidewater field note" link; a thin row of customer
// wordmarks runs underneath. Use it where one credible voice beats a wall of logos.

// Design:
// - Beige #f4efe6 paper, ink #1f1b16 text, a single rust #a4452c accent (highlight
//   underline, outcome rules, link hover); hairline ink/15 rules frame the logo row
// - lg:grid-cols-12 split: portrait in 4 columns (arched rounded-t-full frame, aspect 4/5,
//   caption below), quote in 8; a giant 10rem serif quotation mark sits behind the quote
// - Quote in font-serif text-[1.7rem] → sm:text-4xl → xl:text-5xl with tight leading; the
//   key phrase gets a rust underline; an uppercase meta row ("Field notes", "No. 14 —
//   Tidewater") sits on top
// - Motion: each word "inks in" from 18% to full opacity with a 25ms stagger when the quote
//   enters view (framer-motion); reduced motion shows the text at full opacity immediately
// - Responsive: portrait stacks above the quote (max-w-xs) below lg; the figures go from one
//   column to three at sm; the logo row wraps from 2 to 3 to 6 columns

// What it does:
// - No state: the word reveal is visual only and runs once per page view
// - Uses <figure>, <blockquote> and <figcaption> so the quote and speaker are announced
//   together; the outcome figures are a <dl>
// - "Read the Tidewater field note" links to #nimbus-tidewater-field-note; wordmarks are
//   plain text with decorative SVG marks

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EditorialQuoteLogoCloud from '@/TestComponent/PageSections/saas/LogoCloud05';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <EditorialQuoteLogoCloud />
//     </main>
// )
// ```

'use client'

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const quoteSegments = [
    { text: 'We folded four wikis and 11,400 stale pages into Nimbus in one quarter. Now', highlight: false },
    { text: 'engineers find the runbook before they open a ticket', highlight: true },
    {
        text: '— our internal support queue is down a third, and nobody asks where the latest spec lives any more.',
        highlight: false,
    },
]

const quoteWords = quoteSegments.flatMap((segment, segmentIndex) => {
    const words = segment.text.split(' ')
    return words.map((word, wordIndex) => ({
        id: `${segmentIndex}-${wordIndex}`,
        word,
        highlight: segment.highlight,
        joined: segment.highlight && wordIndex < words.length - 1,
    }))
})

const outcomes = [
    { id: 'pages', value: '11,400', label: 'pages migrated with history intact' },
    { id: 'tickets', value: '−34%', label: 'internal support tickets in 90 days' },
    { id: 'rollout', value: '6 weeks', label: 'to roll out across 1,900 staff' },
]

const alsoIn = [
    { id: 'kestrel', name: 'Kestrel', type: 'font-sans font-bold tracking-tight', mark: 'M3 18 12 5l9 13-9-4Z' },
    { id: 'oakline', name: 'Oakline', type: 'font-serif italic', mark: 'M5 19c0-8 5-14 14-14 0 9-6 14-14 14Z' },
    { id: 'polymer', name: 'POLYMER', type: 'font-mono text-xs font-bold tracking-[0.2em]', mark: 'M4 4h7v7H4ZM13 13h7v7h-7Z' },
    { id: 'quarry', name: 'Quarry', type: 'font-serif font-semibold', mark: 'M3 6h18v3H3ZM5 11h14v3H5ZM7 16h10v3H7Z' },
    { id: 'fernway', name: 'Fernway', type: 'font-sans font-medium tracking-wide', mark: 'M12 2 22 12 12 22 2 12Z' },
    { id: 'castellan', name: 'CASTELLAN', type: 'font-serif text-xs font-semibold tracking-[0.26em]', mark: 'M4 21V5h3v3h3V5h4v3h3V5h3v16Z' },
]

export function EditorialQuoteLogoCloud({
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
            className={cn('relative overflow-hidden bg-[#f4efe6] py-16 text-base font-normal text-[#1f1b16] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between gap-4 border-b border-[#1f1b16]/15 pb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#1f1b16]/60">
                    <span>Nimbus Docs · Field notes</span>
                    <span className="font-serif text-sm normal-case italic tracking-normal">No. 14 — Tidewater</span>
                </div>

                <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-4">
                        <div className="relative mx-auto max-w-xs overflow-hidden rounded-t-full border border-[#1f1b16]/15 bg-[#e8dfcf] lg:mx-0 lg:max-w-none">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                                alt="Mara Ellison, CTO at Tidewater, smiling in a grey blazer"
                                loading="lazy"
                                className="aspect-[4/5] w-full object-cover saturate-[0.85]"
                            />
                        </div>
                        <p className="mx-auto mt-3 max-w-xs text-xs italic text-[#1f1b16]/55 lg:mx-0 lg:max-w-none">
                            Photographed at Tidewater’s Rotterdam office, August 2026.
                        </p>
                    </div>

                    <div className="relative lg:col-span-8 lg:pt-6">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-2 -top-14 select-none font-serif text-[10rem] leading-none text-[#1f1b16]/[0.07] sm:-left-6"
                        >
                            “
                        </span>

                        <figure className="relative">
                            <blockquote>
                                <p className="font-serif text-[1.7rem] font-normal leading-[1.18] tracking-[-0.01em] text-[#1f1b16] sm:text-4xl xl:text-5xl">
                                    {quoteWords.map((token, index) => (
                                        <Fragment key={token.id}>
                                            <motion.span
                                                initial={{ opacity: reduceMotion ? 1 : 0.18 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.5, delay: index * 0.025 }}
                                                className={cn(
                                                    token.highlight &&
                                                        'underline decoration-[#a4452c] decoration-2 underline-offset-[0.18em] sm:decoration-[3px]',
                                                )}
                                            >
                                                {token.word}
                                                {token.joined ? ' ' : null}
                                            </motion.span>
                                            {!token.joined && index < quoteWords.length - 1 ? ' ' : null}
                                        </Fragment>
                                    ))}
                                </p>
                            </blockquote>

                            <figcaption className="mt-10 flex flex-col gap-8 border-t border-[#1f1b16]/15 pt-8 xl:flex-row xl:items-end xl:justify-between">
                                <div>
                                    <p className="font-serif text-2xl italic text-[#1f1b16]">Mara Ellison</p>
                                    <p className="mt-1 text-sm text-[#1f1b16]/65">
                                        Chief Technology Officer, Tidewater · 1,900 employees
                                    </p>
                                </div>
                                <a
                                    href="#nimbus-tidewater-field-note"
                                    className="group inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#1f1b16] transition-colors hover:text-[#a4452c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4452c]"
                                >
                                    <span className="border-b border-current pb-0.5">Read the Tidewater field note</span>
                                    <HiArrowLongRight
                                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                        aria-hidden="true"
                                    />
                                </a>
                            </figcaption>
                        </figure>

                        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                            {outcomes.map((outcome) => (
                                <div key={outcome.id} className="flex flex-col border-l border-[#a4452c]/40 pl-4">
                                    <dt className="order-2 mt-2 text-xs leading-snug text-[#1f1b16]/60">{outcome.label}</dt>
                                    <dd className="order-1 font-serif text-3xl leading-none text-[#1f1b16]">
                                        {outcome.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-6 border-y border-[#1f1b16]/15 py-6 md:mt-20 lg:flex-row lg:items-center lg:gap-10">
                    <p className="shrink-0 font-serif text-sm italic text-[#1f1b16]/60">Also written in Nimbus</p>
                    <ul className="grid flex-1 grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
                        {alsoIn.map((brand) => (
                            <li
                                key={brand.id}
                                className="flex min-w-0 items-center gap-2 text-[#1f1b16]/55 transition-colors duration-300 hover:text-[#1f1b16]"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
                                    <path d={brand.mark} />
                                </svg>
                                <span className={cn('truncate text-base leading-none', brand.type)}>{brand.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default EditorialQuoteLogoCloud

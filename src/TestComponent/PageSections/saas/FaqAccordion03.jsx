// NumberedMonochromeFaqAccordion

// FaqAccordion03 · SaaS Platforms › FAQ Accordion

// Description:
// A stark, typographic FAQ for the fictional website builder Monochrome Studio. A giant
// serif heading "Good questions, plainly answered." sits over six large numbered rows (01 to
// 06) about code, custom domains, speed, leaving the platform, selling online and the
// Studio plan. Several rows can be open at once and an "Expand all" control opens the lot.
// Use it for design-led products whose brand is all type, whitespace and contrast.

// Design:
// - Pure black #000 and white #fff only; secondary text uses black at reduced opacity, rows
//   are split by 1px black rules with a 2px rule on top
// - Serif display type: heading text-5xl → lg:text-8xl, row numbers text-3xl → md:text-6xl,
//   questions text-xl → md:text-3xl; answers in sans text-base with a mono "Related" label
// - Hovering or focusing a question inverts the row (black background, white type); the
//   plus icon is two 2px bars that rotate 45° into a × when the row is open
// - Answers animate height and opacity; on md they sit in a 12-column grid (answer spans 6
//   columns after the number, a related link spans 3)
// - Responsive: header stacks and the Expand all control drops below the heading on small
//   screens; numbers shrink and answers go full width below md

// What it does:
// - openIds (array, default ["01"]) lets any number of rows be open; each question is a
//   button with aria-expanded / aria-controls and answers are role="region"
// - "Expand all" / "Collapse all" opens or closes every row (label follows the state)
// - Related links point to #monochrome-<slug>; "Talk to the studio" points to
//   #monochrome-contact
// - useReducedMotion() makes the height animation instant; the icon rotation respects
//   motion-reduce

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NumberedMonochromeFaqAccordion from '@/TestComponent/PageSections/saas/FaqAccordion03';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <NumberedMonochromeFaqAccordion />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const faqs = [
    {
        id: '01',
        q: 'Do I need to know how to code?',
        a: 'No. Every layout, animation and breakpoint is designed visually on the canvas. If you do write code, drop custom HTML, CSS or JavaScript into any block and it ships exactly as written.',
        related: { label: 'Canvas basics', slug: 'canvas-basics' },
    },
    {
        id: '02',
        q: 'Can I use my own domain?',
        a: 'Yes. Connect a domain you already own in about two minutes, or buy one inside Monochrome. SSL certificates are issued and renewed automatically for every domain and subdomain.',
        related: { label: 'Connecting a domain', slug: 'domains' },
    },
    {
        id: '03',
        q: 'How fast are Monochrome sites?',
        a: 'Pages are pre-rendered and served from 180 edge locations. The median Monochrome homepage loads in 0.9 seconds on 4G and scores 98 on Lighthouse performance.',
        related: { label: 'Performance report 2026', slug: 'performance' },
    },
    {
        id: '04',
        q: 'Can I take my site with me if I leave?',
        a: 'Always. Export clean static HTML, CSS and images, or your content as Markdown and JSON, from Settings at any time. No lock-in, no export fees, no expiry.',
        related: { label: 'Exporting your site', slug: 'export' },
    },
    {
        id: '05',
        q: 'Can I sell things online?',
        a: 'Commerce is built in on the Studio plan: up to 500 products, digital downloads, and subscriptions, with a 0% transaction fee from us on top of your payment provider’s rate.',
        related: { label: 'Selling with Monochrome', slug: 'commerce' },
    },
    {
        id: '06',
        q: 'What does the Studio plan add?',
        a: 'Studio ($28 a month, billed yearly) adds commerce, password-protected pages, 10 editor seats, staging environments and priority support answered by designers, not scripts.',
        related: { label: 'Compare plans', slug: 'plans' },
    },
]

export function NumberedMonochromeFaqAccordion({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [openIds, setOpenIds] = useState(['01'])
    const allOpen = openIds.length === faqs.length

    const toggle = (id) => setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-black sm:px-6 md:py-28 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-black/60">
                            Monochrome Studio — Frequently asked
                        </p>
                        <h2 className="mt-6 max-w-4xl font-serif text-5xl font-normal leading-[0.95] tracking-tight text-black sm:text-6xl lg:text-8xl">
                            Good questions, <em>plainly</em> answered.
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="inline-flex min-h-11 shrink-0 items-center gap-3 self-start border border-black px-5 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:self-auto"
                        onClick={() => setOpenIds(allOpen ? [] : faqs.map((f) => f.id))}
                    >
                        {allOpen ? 'Collapse all' : 'Expand all'}
                        <span className="tabular-nums opacity-60">
                            {openIds.length}/{faqs.length}
                        </span>
                    </button>
                </div>

                <ul className="mt-14 border-t-2 border-black md:mt-20">
                    {faqs.map((item) => {
                        const isOpen = openIds.includes(item.id)
                        return (
                            <li key={item.id} className="border-b border-black">
                                <h3 className="font-serif text-xl font-normal text-black sm:text-2xl md:text-3xl">
                                    <button
                                        type="button"
                                        id={`${uid}-q-${item.id}`}
                                        aria-expanded={isOpen}
                                        aria-controls={`${uid}-a-${item.id}`}
                                        className="group grid w-full grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 bg-white px-2 py-6 text-left text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-none sm:grid-cols-[5rem_minmax(0,1fr)_3rem] sm:px-4 md:grid-cols-[minmax(0,2fr)_minmax(0,9fr)_minmax(0,1fr)] md:gap-6 md:py-8"
                                        onClick={() => toggle(item.id)}
                                    >
                                        <span className="font-serif text-3xl leading-none tabular-nums sm:text-4xl md:text-6xl">
                                            {item.id}
                                        </span>
                                        <span className="leading-tight">{item.q}</span>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'relative size-10 justify-self-end transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:size-11',
                                                isOpen && 'rotate-45',
                                            )}
                                        >
                                            <span className="absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 bg-current" />
                                            <span className="absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                                        </span>
                                    </button>
                                </h3>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="answer"
                                            id={`${uid}-a-${item.id}`}
                                            role="region"
                                            aria-labelledby={`${uid}-q-${item.id}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid gap-6 px-2 pb-8 sm:px-4 md:grid-cols-12 md:gap-6 md:pb-10">
                                                <p className="text-base leading-relaxed text-black/75 md:col-span-6 md:col-start-3 md:text-lg">
                                                    {item.a}
                                                </p>
                                                <div className="md:col-span-3 md:col-start-10">
                                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">Related</p>
                                                    <a
                                                        href={`#monochrome-${item.related.slug}`}
                                                        className="group/rel mt-2 inline-flex min-h-10 items-center gap-2 border-b border-black text-sm text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                                                    >
                                                        {item.related.label}
                                                        <HiArrowUpRight
                                                            className="size-4 transition-transform duration-300 group-hover/rel:-translate-y-0.5 group-hover/rel:translate-x-0.5"
                                                            aria-hidden="true"
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-serif text-2xl italic text-black">Something else on your mind?</p>
                    <a
                        href="#monochrome-contact"
                        className="inline-flex min-h-12 items-center justify-center gap-3 self-start bg-black px-6 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-black hover:ring-1 hover:ring-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:self-auto"
                    >
                        Talk to the studio
                        <HiArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default NumberedMonochromeFaqAccordion

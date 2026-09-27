// ReadingProgressAuthorByline

// AuthorByline04 · Blogs & Digital Media › Author Bylines

// Description:
// A calm, minimal reading module for the essay publication Quiet Signal. Beside the title
// "The case for doing one thing at a time" sits a reader card: an author strip for Noor
// Haddad with a violet progress bar, "% read" and minutes left, four chapter buttons, and
// a scrollable excerpt box whose scrolling drives the bar. Reaching the end swaps in a
// "Finished" state and highlights "Read the full essay". Use it for essays and long reads.

// Design:
// - White #ffffff section, near-black #0a0a0a type, #737373 secondary text, #ececec
//   hairlines, violet #6d28d9 for the progress fill, active chapter and CTA; lavender
//   #ede9fe for the progress track and chips
// - Big, tight sans title (text-4xl → lg:text-6xl) with generous whitespace; the essay
//   itself is set in serif 17–18px with 1.8 line height, roman-numeral chapter heads and a
//   violet-ruled pull quote
// - Reader card: rounded-[28px] white card with a hairline border and a long soft shadow;
//   excerpt box is h-[26rem] → sm:h-[30rem] with fade masks at top and bottom
// - The progress bar follows useScroll({ container }) through a spring (raw value for
//   reduced motion); chapter jumps scroll smoothly unless reduced motion is on
// - Responsive: stacked on mobile (intro, then card); from lg a 4/8 split with the intro
//   sticky on the left; chapter labels show numerals only below sm

// What it does:
// - useScroll on the excerpt box gives scrollYProgress; useMotionValueEvent turns it into
//   pct (0–100), minutes left of the 6-minute excerpt and the active chapter
// - Chapter buttons scroll the box to that heading (aria-current on the active one); the
//   box is a focusable region, so arrow keys and Page Up/Down scroll it
// - At 98%+ the stats read "Finished" and the CTA (#quiet-signal-essay-37) turns violet;
//   the avatar links to #noor-haddad

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ReadingProgressAuthorByline from '@/TestComponent/PageSections/media/AuthorByline04';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <ReadingProgressAuthorByline />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { HiArrowLongRight, HiCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EXCERPT_MINUTES = 6

const chapters = [
    {
        numeral: 'I',
        title: 'The forty-tab afternoon',
        body: [
            'It was a Thursday in February when I counted them: forty-one open tabs, three half-written emails, a podcast paused at minute nine and a kettle I had boiled twice without making tea. I had been “working” since eight. I could not have told you one thing I had finished.',
            'None of it felt like distraction at the time. Each switch felt like responsibility, a small act of keeping up. That is the trick of it. Scattered attention rarely announces itself; it arrives dressed as diligence.',
        ],
    },
    {
        numeral: 'II',
        title: 'What switching costs',
        body: [
            'Researchers have a dry name for the residue a task leaves behind when you abandon it half-done: attention residue. Part of you stays with the unanswered message while the rest of you tries to write the report. You are, in a very literal sense, not all there.',
            'The cost is not the ten seconds it takes to click away. It is the twenty minutes it takes to find the depth you were at before you left, if you find it at all.',
        ],
        quote: 'Scattered attention rarely announces itself. It arrives dressed as diligence.',
    },
    {
        numeral: 'III',
        title: 'A small experiment',
        body: [
            'So I tried something embarrassingly simple. For thirty days, one window, one task, one timer set for fifty minutes. When a thought about something else arrived, I wrote it on an index card and turned the card face down.',
            'The first week was loud. By the second, the cards got fewer. By the third, I noticed I was reading whole articles again, the way I had at nineteen, all the way to the last line.',
        ],
    },
    {
        numeral: 'IV',
        title: 'What stayed',
        body: [
            'I did not become a monk. The tabs came back; they always do. But something recalibrated. I now notice the moment my hand reaches for the next thing, and more often than not I let it rest.',
            'Doing one thing at a time is not a productivity hack. It is a way of being present for your own life, one finished paragraph at a time.',
        ],
    },
]

export function ReadingProgressAuthorByline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const boxRef = useRef(null)
    const headingRefs = useRef([])
    const [pct, setPct] = useState(0)
    const [chapter, setChapter] = useState(0)
    const { scrollYProgress } = useScroll({ container: boxRef })
    const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        setPct(Math.round(value * 100))
        const box = boxRef.current
        if (!box) return
        let current = 0
        headingRefs.current.forEach((el, i) => {
            if (el && el.offsetTop - 96 <= box.scrollTop) current = i
        })
        if (value > 0.985) current = chapters.length - 1
        setChapter(current)
    })

    const jumpTo = (index) => {
        const box = boxRef.current
        const el = headingRefs.current[index]
        if (!box || !el) return
        box.scrollTo({ top: Math.max(0, el.offsetTop - 24), behavior: reduceMotion ? 'auto' : 'smooth' })
    }

    const finished = pct >= 98
    const minutesLeft = Math.max(1, Math.ceil(EXCERPT_MINUTES * (1 - pct / 100)))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-24">
                        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-[#737373]">
                            <span aria-hidden="true" className="size-2 rounded-full bg-[#6d28d9]" />
                            Quiet Signal · Essay No. 37
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#0a0a0a] sm:text-5xl lg:text-[3.4rem]">
                            The case for doing one thing at a time
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-[#737373]">
                            Thirty days, one window, one task. What happened when a chronic multitasker tried to
                            finish things again.
                        </p>
                        <dl className="mt-8 grid max-w-sm grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#ececec] bg-[#ececec] text-sm">
                            <div className="bg-white p-4">
                                <dt className="text-[#737373]">Published</dt>
                                <dd className="mt-1 font-medium text-[#0a0a0a]">
                                    <time dateTime="2026-09-18">18 Sep 2026</time>
                                </dd>
                            </div>
                            <div className="bg-white p-4">
                                <dt className="text-[#737373]">Full essay</dt>
                                <dd className="mt-1 font-medium text-[#0a0a0a]">14 min · 3,100 words</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-8">
                    <div className="overflow-hidden rounded-[28px] border border-[#ececec] bg-white shadow-[0_40px_80px_-48px_rgba(10,10,10,0.35)]">
                        <div className="border-b border-[#ececec] px-5 pb-4 pt-5 sm:px-7">
                            <div className="flex items-center gap-3">
                                <a
                                    href="#noor-haddad"
                                    className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
                                        alt="Noor Haddad"
                                        className="size-11 rounded-full object-cover"
                                    />
                                </a>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[#0a0a0a]">Noor Haddad</p>
                                    <p className="truncate text-xs text-[#737373]">Essayist · Berlin</p>
                                </div>
                                <div className="text-right">
                                    {finished ? (
                                        <p className="inline-flex items-center gap-1.5 rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#6d28d9]">
                                            <HiCheck aria-hidden="true" className="size-3.5" />
                                            Finished
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold tabular-nums text-[#0a0a0a]">
                                                {pct}% <span className="font-normal text-[#737373]">read</span>
                                            </p>
                                            <p className="text-xs tabular-nums text-[#737373]">{minutesLeft} min left</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p aria-live="polite" className="sr-only">
                                {finished ? 'You have finished the excerpt.' : ''}
                            </p>
                            <div
                                role="progressbar"
                                aria-label="Reading progress"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={pct}
                                className="mt-4 h-1 overflow-hidden rounded-full bg-[#ede9fe]"
                            >
                                <motion.div
                                    className="h-full origin-left rounded-full bg-[#6d28d9]"
                                    style={{ scaleX: reduceMotion ? scrollYProgress : smooth }}
                                />
                            </div>

                            <nav aria-label="Chapters" className="mt-3">
                                <ul className="grid grid-cols-4 gap-1.5">
                                    {chapters.map((c, i) => {
                                        const active = i === chapter
                                        return (
                                            <li key={c.numeral} className="min-w-0">
                                                <button
                                                    type="button"
                                                    aria-current={active ? 'true' : undefined}
                                                    aria-label={`Chapter ${c.numeral}: ${c.title}`}
                                                    className={cn(
                                                        'flex min-h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6d28d9]',
                                                        active
                                                            ? 'bg-[#ede9fe] text-[#6d28d9]'
                                                            : 'text-[#737373] hover:bg-[#f5f5f5] hover:text-[#0a0a0a]',
                                                    )}
                                                    onClick={() => jumpTo(i)}
                                                >
                                                    <span className="font-serif text-sm font-semibold">{c.numeral}</span>
                                                    <span className="hidden truncate sm:inline">{c.title}</span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>
                        </div>

                        <div className="relative">
                            <div
                                ref={boxRef}
                                tabIndex={0}
                                role="region"
                                aria-label="Essay excerpt, scroll to read"
                                className="relative h-[26rem] overflow-y-auto overscroll-contain px-5 py-8 font-serif text-[17px] leading-[1.8] text-[#262626] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6d28d9] sm:h-[30rem] sm:px-10 sm:text-lg"
                            >
                                {chapters.map((c, i) => (
                                    <div key={c.numeral} className={cn(i > 0 && 'mt-12')}>
                                        <h3
                                            ref={(el) => {
                                                headingRefs.current[i] = el
                                            }}
                                            className="flex items-baseline gap-3 font-sans text-lg font-semibold tracking-[-0.01em] text-[#0a0a0a]"
                                        >
                                            <span className="font-serif text-base italic text-[#6d28d9]">{c.numeral}.</span>
                                            {c.title}
                                        </h3>
                                        {c.body.map((para) => (
                                            <p key={para.slice(0, 24)} className="mt-4">
                                                {para}
                                            </p>
                                        ))}
                                        {c.quote && (
                                            <blockquote className="my-8 border-l-2 border-[#6d28d9] pl-5 font-serif text-2xl italic leading-snug text-[#0a0a0a] sm:text-[1.7rem]">
                                                “{c.quote}”
                                            </blockquote>
                                        )}
                                    </div>
                                ))}
                                <p className="mt-12 text-center font-sans text-xs uppercase tracking-[0.3em] text-[#a3a3a3]">
                                    End of excerpt
                                </p>
                            </div>
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-white to-transparent"
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent"
                            />
                        </div>

                        <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <p className="text-xs text-[#737373]">
                                Excerpt · {EXCERPT_MINUTES} min of 14. Scroll inside the box to read.
                            </p>
                            <a
                                href="#quiet-signal-essay-37"
                                className={cn(
                                    'group inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]',
                                    finished
                                        ? 'bg-[#6d28d9] text-white hover:bg-[#5b21b6]'
                                        : 'border border-[#0a0a0a]/15 text-[#0a0a0a] hover:border-[#0a0a0a]',
                                )}
                            >
                                Read the full essay
                                <HiArrowLongRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReadingProgressAuthorByline

// CoAuthorStackAuthorByline

// AuthorByline03 · Blogs & Digital Media › Author Bylines

// Description:
// A trustworthy, investigation-style article header for the nonprofit newsroom The Commons
// Journal. Under "Who owns the river?" it shows an overlapping avatar stack for three
// co-authors (hover or focus reveals each name and beat), a "Fact-checked by Rosa
// Lindqvist" badge, publish and "Updated" dates with a changelog popover listing each
// revision, and a captioned lead photo. Use it for reported pieces with shared bylines.

// Design:
// - Beige #f3ede2 section, forest green #2d6a4f accents, ink #1f2a24 type, #6b6558 muted
//   text and #d9cfbd rules; the fact-check badge is a green pill with a white check seal
// - Serif headline text-4xl → md:text-6xl, sans UI; avatars are 48px circles with a 3px
//   beige ring that overlap by 14px and fan apart (with a lift) on hover/focus
// - Tooltips are small ink cards with a caret; the changelog is a white rounded-2xl popover
//   with a green timeline, a close button and a soft shadow
// - Lead image: 16:9 → lg:21:9 photo with rounded-[28px] corners and a caption + credit line
// - Responsive: byline elements wrap in rows on mobile and sit on one ruled line from lg;
//   below lg the popover opens under the whole byline bar, from lg under its trigger

// What it does:
// - activeAuthor state is set on pointer enter / focus of an avatar and cleared on leave /
//   blur or Escape; the beat is also exposed to screen readers via aria-describedby
// - changelogOpen toggles from "Updated …" (aria-expanded, aria-controls); the popover
//   closes on Escape (focus returns to the trigger), outside click or its close button
// - Avatars link to #author-<slug>; "How we fact-check" links to #commons-fact-checking;
//   the fan-out and tooltip motion are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CoAuthorStackAuthorByline from '@/TestComponent/PageSections/media/AuthorByline03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <CoAuthorStackAuthorByline />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiCheckBadge, HiChevronDown, HiOutlineClock, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const authors = [
    {
        slug: 'ines-duarte',
        name: 'Ines Duarte',
        beat: 'Water & land reporter',
        image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80',
    },
    {
        slug: 'kofi-mensah',
        name: 'Kofi Mensah',
        beat: 'Data reporter',
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80',
    },
    {
        slug: 'hana-sato',
        name: 'Hana Sato',
        beat: 'Rural affairs correspondent',
        image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&q=80',
    },
]

const changelog = [
    {
        when: '24 Sep 2026, 16:05',
        iso: '2026-09-24T16:05',
        kind: 'Correction',
        text: 'The reservoir’s capacity is 14 billion litres, not 41 billion as first published.',
    },
    {
        when: '22 Sep 2026, 09:30',
        iso: '2026-09-22T09:30',
        kind: 'Update',
        text: 'Added a response from the Alder Valley Irrigation District received after publication.',
    },
    {
        when: '20 Sep 2026, 18:12',
        iso: '2026-09-20T18:12',
        kind: 'Clarification',
        text: 'Clarified that the 1962 water compact was signed by four counties, not the state.',
    },
]

export function CoAuthorStackAuthorByline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [activeAuthor, setActiveAuthor] = useState(null)
    const [changelogOpen, setChangelogOpen] = useState(false)
    const triggerRef = useRef(null)
    const popoverRef = useRef(null)

    useEffect(() => {
        if (!changelogOpen) return undefined
        popoverRef.current?.focus()
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setChangelogOpen(false)
                triggerRef.current?.focus()
            }
        }
        const onPointer = (event) => {
            if (popoverRef.current?.contains(event.target) || triggerRef.current?.contains(event.target)) return
            setChangelogOpen(false)
        }
        document.addEventListener('keydown', onKey)
        document.addEventListener('mousedown', onPointer)
        document.addEventListener('touchstart', onPointer)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('mousedown', onPointer)
            document.removeEventListener('touchstart', onPointer)
        }
    }, [changelogOpen])

    const closeChangelog = () => {
        setChangelogOpen(false)
        triggerRef.current?.focus()
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f3ede2] px-4 py-16 text-base font-normal text-[#1f2a24] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.22em]">
                    <span className="text-[#1f2a24]">The Commons Journal</span>
                    <span aria-hidden="true" className="h-3 w-px bg-[#1f2a24]/30" />
                    <span className="text-[#2d6a4f]">Investigation · Water</span>
                    <span className="rounded-full border border-[#2d6a4f]/40 px-2.5 py-1 text-[10px] tracking-[0.16em] text-[#2d6a4f]">
                        Part 2 of 3
                    </span>
                </div>

                <h2 className="mt-6 max-w-4xl font-serif text-4xl font-normal leading-[1.03] tracking-[-0.02em] text-[#1f2a24] sm:text-5xl md:text-6xl">
                    Who owns the river? Inside the fight over{' '}
                    <span className="italic text-[#2d6a4f]">Alder Valley’s water</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#1f2a24]/75">
                    Three farming towns, one shrinking reservoir and a 64-year-old agreement nobody can
                    find the original of. We read 2,300 pages of records to trace who controls the water.
                </p>

                <div className="relative mt-10 flex flex-col gap-5 border-y border-[#d9cfbd] py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
                        <ul className="group/stack flex items-center pl-3.5" aria-label="Authors">
                            {authors.map((author, index) => {
                                const active = activeAuthor === author.slug
                                const tipId = `${uid}-tip-${author.slug}`
                                return (
                                    <li
                                        key={author.slug}
                                        className="relative -ml-3.5 transition-[margin] duration-300 group-hover/stack:ml-1 group-focus-within/stack:ml-1 motion-reduce:transition-none"
                                        style={{ zIndex: active ? 10 : authors.length - index }}
                                    >
                                        <a
                                            href={`#author-${author.slug}`}
                                            aria-describedby={tipId}
                                            className="block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
                                            onPointerEnter={() => setActiveAuthor(author.slug)}
                                            onPointerLeave={() => setActiveAuthor(null)}
                                            onFocus={() => setActiveAuthor(author.slug)}
                                            onBlur={() => setActiveAuthor(null)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Escape') setActiveAuthor(null)
                                            }}
                                        >
                                            <img
                                                src={author.image}
                                                alt={author.name}
                                                className={cn(
                                                    'size-12 rounded-full object-cover ring-[3px] ring-[#f3ede2] transition-transform duration-300 motion-reduce:transition-none',
                                                    active && '-translate-y-1 ring-[#2d6a4f]',
                                                )}
                                            />
                                        </a>
                                        <AnimatePresence>
                                            {active && (
                                                <motion.span
                                                    aria-hidden="true"
                                                    initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
                                                    transition={{ duration: 0.18 }}
                                                    className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-max max-w-[11rem] -translate-x-1/2 rounded-xl bg-[#1f2a24] px-3 py-2 text-center text-[#f3ede2] shadow-lg"
                                                >
                                                    <span className="block text-sm font-semibold">{author.name}</span>
                                                    <span className="block text-[11px] text-[#f3ede2]/70">{author.beat}</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute left-1/2 top-full size-2.5 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-[#1f2a24]"
                                                    />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        <span id={tipId} className="sr-only">
                                            {author.beat}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                        <p className="text-sm leading-snug text-[#1f2a24] sm:text-base">
                            By{' '}
                            {authors.map((author, index) => (
                                <span key={author.slug}>
                                    <span className="font-semibold">{author.name}</span>
                                    {index < authors.length - 2 ? ', ' : index === authors.length - 2 ? ' and ' : ''}
                                </span>
                            ))}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="#commons-fact-checking"
                            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#2d6a4f] py-1 pl-1 pr-4 text-sm text-white transition-colors hover:bg-[#245a42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
                        >
                            <span className="grid size-8 place-items-center rounded-full bg-white text-[#2d6a4f]">
                                <HiCheckBadge aria-hidden="true" className="size-5" />
                            </span>
                            <span>
                                Fact-checked by <span className="font-semibold">Rosa Lindqvist</span>
                                <span className="sr-only">. How we fact-check</span>
                            </span>
                        </a>

                        <div className="lg:relative">
                            <button
                                ref={triggerRef}
                                type="button"
                                aria-expanded={changelogOpen}
                                aria-controls={`${uid}-changelog`}
                                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#1f2a24]/20 px-4 text-sm text-[#1f2a24] transition-colors hover:border-[#2d6a4f] hover:text-[#2d6a4f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
                                onClick={() => setChangelogOpen((v) => !v)}
                            >
                                <HiOutlineClock aria-hidden="true" className="size-4" />
                                <span>
                                    Updated <time dateTime="2026-09-24T16:05">24 Sep, 16:05</time>
                                </span>
                                <span className="rounded-full bg-[#2d6a4f]/10 px-1.5 text-[11px] font-semibold text-[#2d6a4f]">
                                    {changelog.length}
                                </span>
                                <HiChevronDown
                                    aria-hidden="true"
                                    className={cn('size-4 transition-transform duration-200', changelogOpen && 'rotate-180')}
                                />
                            </button>

                            <AnimatePresence>
                                {changelogOpen && (
                                    <motion.div
                                        ref={popoverRef}
                                        id={`${uid}-changelog`}
                                        role="dialog"
                                        aria-label="Changelog"
                                        tabIndex={-1}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : -6, scale: reduceMotion ? 1 : 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full z-30 mt-3 w-[min(24rem,calc(100vw-2rem))] origin-top-left rounded-2xl border border-[#d9cfbd] bg-white p-5 text-left shadow-[0_24px_48px_-24px_rgba(31,42,36,0.45)] focus:outline-none lg:left-auto lg:right-0 lg:origin-top-right"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d6a4f]">
                                                    Changelog
                                                </p>
                                                <p className="mt-1 text-sm text-[#6b6558]">
                                                    First published <time dateTime="2026-09-19">19 Sep 2026</time>
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="Close changelog"
                                                className="grid size-10 shrink-0 place-items-center rounded-full text-[#1f2a24] transition-colors hover:bg-[#f3ede2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]"
                                                onClick={closeChangelog}
                                            >
                                                <HiXMark aria-hidden="true" className="size-5" />
                                            </button>
                                        </div>
                                        <ol className="mt-4 space-y-4 border-l-2 border-[#2d6a4f]/20 pl-4">
                                            {changelog.map((entry) => (
                                                <li key={entry.iso} className="relative">
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute -left-[23px] top-1.5 size-3 rounded-full border-2 border-white bg-[#2d6a4f]"
                                                    />
                                                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-[#6b6558]">
                                                        <span className="font-semibold uppercase tracking-[0.14em] text-[#2d6a4f]">
                                                            {entry.kind}
                                                        </span>
                                                        <time dateTime={entry.iso}>{entry.when}</time>
                                                    </p>
                                                    <p className="mt-1 text-sm leading-relaxed text-[#1f2a24]">{entry.text}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-sm text-[#6b6558]">
                    Published <time dateTime="2026-09-19">19 September 2026</time> · 16 min read · Reported with
                    support from the Watershed Reporting Fund
                </p>

                <figure className="mt-10">
                    <img
                        src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80"
                        alt="A shallow river winding through a pine forest"
                        loading="lazy"
                        className="aspect-video w-full rounded-[28px] object-cover lg:aspect-[21/9]"
                    />
                    <figcaption className="mt-3 flex flex-col gap-1 text-sm text-[#6b6558] sm:flex-row sm:justify-between">
                        <span>The upper Alder runs at 38% of its 1990s summer flow, according to state gauges.</span>
                        <span className="text-xs uppercase tracking-[0.18em]">Photograph: Hana Sato</span>
                    </figcaption>
                </figure>
            </div>
        </section>
    )
}

export default CoAuthorStackAuthorByline

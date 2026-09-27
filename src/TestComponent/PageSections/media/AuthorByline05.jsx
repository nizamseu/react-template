// CreditsMastheadAuthorByline

// AuthorByline05 · Blogs & Digital Media › Author Bylines

// Description:
// A dramatic feature opener for the craft quarterly Kiln Magazine. A large rust-and-bone
// duotone portrait of the potter Tadeo Ruiz sits beside the headline "He fires the kiln
// once a year. Everything depends on it." and a mono credits grid (WORDS / PHOTOGRAPHS /
// EDITOR / PUBLISHED) whose entries open to short contributor notes. Use it to open
// profiles, photo essays or any feature where the whole team deserves a credit.

// Design:
// - Black #0c0a09 section, bone #efe7da type, rust #b5532c accents; a vertical "KILN №27"
//   label runs up the portrait edge and a thin rust rule frames the credits
// - Duotone: photo in grayscale + contrast multiplied over bone with a rust layer in
//   lighten mode (shadows → rust, highlights → bone); a toggle crossfades to the original
// - Serif display headline text-4xl → sm:text-5xl → xl:text-7xl, italic rust phrase; all
//   metadata in font-mono uppercase with wide tracking; credits are 2 × 2 cells with rust
//   top rules and a +/– glyph
// - Portrait eases to scale 1.03 on hover; notes expand with a height/opacity animation
//   (instant for reduced motion); a small ceramic detail photo overlaps the portrait on md+
// - Responsive: stacked on mobile (portrait first), a 6/6 split from lg; the credits grid
//   is 1 column below sm and 2 columns from sm

// What it does:
// - duotone state (default on) is toggled by the "Duotone / Original" button (aria-pressed)
// - openCredit state holds the one expanded credit; each credit button has aria-expanded
//   and aria-controls and toggles its note (opening one closes the other)
// - "Read the profile" links to #kiln-tadeo-ruiz; "Issue 27: Heat" links to #kiln-issue-27

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CreditsMastheadAuthorByline from '@/TestComponent/PageSections/media/AuthorByline05';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <CreditsMastheadAuthorByline />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const credits = [
    {
        id: 'words',
        role: 'Words',
        name: 'Saoirse Kavanagh',
        note: 'Writer-at-large for Kiln. She spent nine days on the hillside, including all 72 hours of the firing.',
    },
    {
        id: 'photographs',
        role: 'Photographs',
        name: 'Idris Bello',
        note: 'Shot on medium-format film, pushed one stop through the smoke. His series “Ash Glaze” opens in Porto in November.',
    },
    {
        id: 'editor',
        role: 'Editor',
        name: 'Marguerite Olsen',
        note: 'Features editor. She commissions the long profiles in every issue and still throws pots on Sundays.',
    },
    {
        id: 'published',
        role: 'Published',
        name: '14 September 2026',
        note: 'Issue 27, “Heat”. 4,200 words, 18 minutes to read. Printed on uncoated stock in an edition of 9,000.',
    },
]

export function CreditsMastheadAuthorByline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [duotone, setDuotone] = useState(true)
    const [openCredit, setOpenCredit] = useState(null)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0c0a09] px-4 py-16 text-base font-normal text-[#efe7da] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
                <div className="relative lg:col-span-6">
                    <div className="flex items-stretch gap-3 sm:gap-5">
                        <p
                            aria-hidden="true"
                            className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.5em] text-[#b5532c] [writing-mode:vertical-rl] rotate-180 sm:block"
                        >
                            Kiln №27 — Heat — Profile
                        </p>
                        <figure className="min-w-0 flex-1">
                            <div className="group relative isolate aspect-[4/5] overflow-hidden rounded-[6px] bg-[#efe7da]">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=80"
                                    alt="Portrait of the potter Tadeo Ruiz, an older man with glasses, looking at the camera"
                                    className={cn(
                                        'absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                                        duotone && 'contrast-[1.15] grayscale mix-blend-multiply',
                                    )}
                                />
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'pointer-events-none absolute inset-0 bg-[#b5532c] mix-blend-lighten transition-opacity duration-700',
                                        duotone ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0c0a09]/55 via-transparent to-transparent"
                                />
                                <button
                                    type="button"
                                    aria-pressed={!duotone}
                                    aria-label="Show original colour photograph"
                                    className="absolute bottom-4 left-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#efe7da]/40 bg-[#0c0a09]/70 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#efe7da] backdrop-blur transition-colors hover:border-[#efe7da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7da]"
                                    onClick={() => setDuotone((v) => !v)}
                                >
                                    <span className={cn(duotone ? 'text-[#efe7da]' : 'text-[#efe7da]/50')}>Duotone</span>
                                    <span aria-hidden="true" className="h-3 w-px bg-[#efe7da]/40" />
                                    <span className={cn(!duotone ? 'text-[#efe7da]' : 'text-[#efe7da]/50')}>Original</span>
                                </button>
                            </div>
                            <figcaption className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#efe7da]/55">
                                Tadeo Ruiz beside his wood-fired anagama kiln, August 2026
                            </figcaption>
                        </figure>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=500&q=80"
                        alt="Hand-thrown white cups and vessels from the firing"
                        loading="lazy"
                        className="absolute -right-2 bottom-24 hidden w-36 rotate-3 rounded-[4px] border-4 border-[#0c0a09] object-cover shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] aspect-[3/4] md:block lg:-right-8 lg:w-40"
                    />
                </div>

                <div className="lg:col-span-6">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#efe7da]/60">
                        <span className="font-serif text-lg normal-case italic tracking-normal text-[#efe7da]">Kiln</span>
                        <span aria-hidden="true" className="h-px w-8 bg-[#b5532c]" />
                        <a
                            href="#kiln-issue-27"
                            className="inline-flex min-h-10 items-center hover:text-[#efe7da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5532c]"
                        >
                            Issue 27: Heat
                        </a>
                        <span aria-hidden="true">/</span>
                        <span>Profile</span>
                    </p>
                    <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#efe7da] sm:text-5xl xl:text-7xl">
                        He fires the kiln once a year.{' '}
                        <em className="italic text-[#b5532c]">Everything depends on it.</em>
                    </h2>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#efe7da]/75">
                        For 31 years Tadeo Ruiz has spent eleven months making pots and one week burning
                        four tonnes of oak to finish them. Some come out glassed in ash. Some don’t come out
                        at all.
                    </p>

                    <div className="mt-10 border-t border-[#b5532c]/60 pt-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#b5532c]">Credits</p>
                        <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                            {credits.map((credit) => {
                                const open = openCredit === credit.id
                                const noteId = `${uid}-note-${credit.id}`
                                return (
                                    <div key={credit.id} className="border-t border-[#efe7da]/15 py-4">
                                        <dt className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#efe7da]/50">
                                            {credit.role}
                                        </dt>
                                        <dd>
                                            <button
                                                type="button"
                                                aria-expanded={open}
                                                aria-controls={noteId}
                                                className="group mt-1.5 flex min-h-10 w-full items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5532c]"
                                                onClick={() => setOpenCredit(open ? null : credit.id)}
                                            >
                                                <span className="font-mono text-sm uppercase tracking-[0.12em] text-[#efe7da] transition-colors group-hover:text-[#e0875f] sm:text-[15px]">
                                                    {credit.name}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'grid size-7 shrink-0 place-items-center rounded-full border font-mono text-sm transition-colors duration-300',
                                                        open
                                                            ? 'border-[#b5532c] bg-[#b5532c] text-[#0c0a09]'
                                                            : 'border-[#efe7da]/25 text-[#efe7da]/70 group-hover:border-[#b5532c]',
                                                    )}
                                                >
                                                    {open ? '–' : '+'}
                                                </span>
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {open && (
                                                    <motion.p
                                                        key="note"
                                                        id={noteId}
                                                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                                                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                                        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                        className="overflow-hidden text-sm leading-relaxed text-[#efe7da]/70"
                                                    >
                                                        <span className="block pt-2">{credit.note}</span>
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </dd>
                                    </div>
                                )
                            })}
                        </dl>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <a
                            href="#kiln-tadeo-ruiz"
                            className="group inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-full bg-[#efe7da] px-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0c0a09] transition-colors duration-300 hover:bg-[#b5532c] hover:text-[#efe7da] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b5532c]"
                        >
                            Read the profile
                            <HiArrowLongRight
                                aria-hidden="true"
                                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#efe7da]/45">
                            18 min read · Ceramics · Craft
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CreditsMastheadAuthorByline

// FoundersLetterAboutStory

// AboutStory01 · Corporate & Business › About Us / Story

// Description:
// An "about us" told as a signed letter from the third generation of Harrow & Pike, a
// family structural-engineering firm founded in Bristol in 1962. Under the letterhead the
// headline "Re: Sixty-four years, still signed by hand." opens a four-paragraph letter with
// footnoted phrases, a tipped-in archival portrait, three dated margin facts (1962, 1987,
// 2019) and two ink signatures that draw themselves. Use it as the story block of a
// heritage, family-owned or professional-services company page.

// Design:
// - Desk-tone #e8dbc0 section holding a sepia paper sheet #f3ead8 with ink #2b2118 text,
//   highlighter ochre #e3cd98 and one sealing-wax red #9c4a2f accent (postmark, markers)
// - Sheet: letterhead with monogram seal, double hairline rule, then a 3-column grid on lg
//   (11rem margin notes · letter · 14rem archive column); serif type throughout, drop cap,
//   mono reference numbers, photo corners and a faint Warren-truss line drawing
// - Archival photo is filtered sepia and tilts into place in view; signatures are SVG paths
//   whose pathLength animates 0 → 1 once in view (drawn instantly for reduced motion)
// - Responsive: base is one column (letter → photo + postmark row → notes); sm puts notes
//   in 3 columns; lg moves notes to the left margin and the photo to the right column

// What it does:
// - Hovering a margin note, or hovering/focusing a footnote marker in the letter, sweeps a
//   highlighter across the matching phrase and inks the note; clicking a marker pins the
//   highlight (aria-pressed) until it is clicked again
// - Markers are aria-describedby the note they point to; "Write back to Clara & Tom" links
//   to #contact-harrow-pike and "Browse the project archive" to #harrow-pike-archive
// - The signature draw, photo tilt and truss drawing are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FoundersLetterAboutStory from '@/TestComponent/PageSections/corporate/AboutStory01';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <FoundersLetterAboutStory />
//     </main>
// )
// ```

'use client'

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const notes = [
    {
        id: 'founding',
        year: '1962',
        title: 'Wharf Street',
        text: 'Arthur Harrow and Edith Pike open a two-room drawing office above a ship chandler’s on Wharf Street, Bristol.',
    },
    {
        id: 'grainstore',
        year: '1987',
        title: 'Avonmouth grain store',
        text: 'Our steel-to-concrete strengthening of the 1912 grain store wins the regional structural award and saves 40 m of silo.',
    },
    {
        id: 'ownership',
        year: '2019',
        title: 'Employee-owned',
        text: 'Clara and Tom become joint managing partners; the firm turns employee-owned and 71 of 84 staff now hold shares.',
    },
]

const letter = [
    [
        'Our grandparents ',
        { note: 'founding', text: 'started this firm in 1962' },
        ' with one drafting table, a borrowed slide rule and a stubborn belief that a bridge should outlive the people who drew it. Sixty-four years later, Edith’s rule still sits on the table in reception. It is slightly bent, and nobody is allowed to straighten it.',
    ],
    [
        'Most of what we know, we learned by being trusted with difficult things: ',
        { note: 'grainstore', text: 'a grain store that needed a second life' },
        ', footbridges over tidal rivers, a Victorian school that stayed open while we replaced its roof. Every drawing still leaves this office signed by a named engineer, because a signature is a promise you can find again.',
    ],
    [
        'In 2019 the two of us ',
        { note: 'ownership', text: 'took over from our parents' },
        ', and the firm became employee-owned. It means the people checking your calculations own a share of the consequences. We think that is exactly as it should be.',
    ],
    [
        'If you are reading this because something needs holding up — a roof, a quay wall, a plan that keeps sagging in the middle — we would love to hear about it.',
    ],
]

const signatures = [
    {
        id: 'clara',
        name: 'Clara Harrow',
        viewBox: '0 0 240 80',
        d: 'M34 20C22 12 6 24 8 42C10 60 30 62 42 50C50 42 54 24 52 14C50 6 44 12 46 28C47 44 48 54 56 54C64 54 66 40 74 40C82 40 80 54 72 54C66 54 68 42 78 44C82 46 82 54 88 54C94 54 94 42 100 42C104 42 104 54 110 54C118 54 118 40 126 40C134 40 132 54 124 54C118 54 120 42 130 44C134 46 134 56 142 52M160 12C158 30 156 46 154 62M176 10C174 28 172 46 170 64M146 40C160 36 180 34 196 36C206 37 212 44 204 50C198 54 196 46 206 44C216 42 222 52 232 48M14 70C70 62 150 60 230 66',
    },
    {
        id: 'tom',
        name: 'Tom Pike',
        viewBox: '0 0 200 80',
        d: 'M10 18C30 14 52 12 74 14M40 14C38 32 36 48 32 62C30 68 22 66 24 60M48 50C48 40 60 38 62 48C64 58 50 60 48 50C56 50 62 46 68 44C70 52 70 56 72 56C74 48 78 44 80 50C82 56 84 54 86 48C88 44 92 46 92 54M108 12C106 32 104 48 102 68M106 14C130 8 138 30 110 36C118 36 122 44 124 52C126 56 130 56 132 50C134 40 138 20 140 16C142 12 146 14 142 30C140 42 138 52 138 56C142 46 150 40 154 42C150 48 144 50 146 52C150 56 154 58 158 54C164 50 168 44 164 42C158 42 158 54 166 56C174 58 182 50 190 46M20 72C70 66 130 64 186 70',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9c4a2f]'

export function FoundersLetterAboutStory({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [hovered, setHovered] = useState(null)
    const [pinned, setPinned] = useState(null)
    const lit = hovered ?? pinned
    const noteNumber = (id) => notes.findIndex((note) => note.id === id) + 1

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#e8dbc0] px-3 py-14 font-serif text-base font-normal text-[#2b2118] sm:px-6 md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.45),transparent_55%),radial-gradient(ellipse_at_90%_100%,rgba(43,33,24,0.12),transparent_60%)]"
            />

            <article className="relative mx-auto max-w-6xl rounded-[4px] bg-[#f3ead8] px-5 py-8 shadow-[0_1px_0_rgba(43,33,24,0.08),0_40px_80px_-40px_rgba(43,33,24,0.55)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[4px] bg-[radial-gradient(circle_at_85%_12%,rgba(176,140,80,0.14),transparent_40%),radial-gradient(circle_at_8%_92%,rgba(120,90,50,0.10),transparent_35%)]"
                />

                <header className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <span
                            aria-hidden="true"
                            className="grid size-14 shrink-0 place-items-center rounded-full border border-[#2b2118] text-lg italic tracking-tight outline-1 outline-offset-[3px] outline-[#2b2118]/40"
                        >
                            H&amp;P
                        </span>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.32em] sm:text-xl">Harrow &amp; Pike</p>
                            <p className="mt-1 text-xs italic text-[#2b2118]/70 sm:text-sm">
                                Consulting Structural Engineers · Est. 1962
                            </p>
                        </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#2b2118]/70 sm:text-right">
                        <dt className="sm:order-1">Ref.</dt>
                        <dd className="text-[#2b2118] sm:order-3">HP/26/001</dd>
                        <dt className="sm:order-2">Office</dt>
                        <dd className="text-[#2b2118] sm:order-4">9 Wharf St, BS1 4RN</dd>
                    </dl>
                </header>

                <div aria-hidden="true" className="relative mt-6 space-y-[3px]">
                    <div className="h-px bg-[#2b2118]/70" />
                    <div className="h-px bg-[#2b2118]/30" />
                </div>

                <div className="relative mt-10 grid gap-10 lg:grid-cols-[11rem_1fr_14rem] lg:gap-12">
                    <div className="order-1 min-w-0 lg:order-2">
                        <p className="text-sm italic text-[#2b2118]/70">Bristol, 14 March 2026</p>
                        <h2 className="mt-4 font-serif text-[1.9rem] font-semibold leading-[1.08] tracking-tight text-[#2b2118] sm:text-5xl">
                            Re: Sixty-four years, still <em className="font-normal">signed by hand.</em>
                        </h2>
                        <p className="mt-8 text-lg italic">Dear friends, clients and colleagues,</p>

                        <div className="mt-5 space-y-5 text-[17px] leading-[1.75] sm:text-lg">
                            {letter.map((paragraph, pIndex) => (
                                <p
                                    key={pIndex}
                                    className={cn(
                                        pIndex === 0 &&
                                            'first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:font-semibold first-letter:text-[#9c4a2f]',
                                    )}
                                >
                                    {paragraph.map((segment, sIndex) => {
                                        if (typeof segment === 'string') return <span key={sIndex}>{segment}</span>
                                        const number = noteNumber(segment.note)
                                        const isLit = lit === segment.note
                                        const isPinned = pinned === segment.note
                                        return (
                                            <span key={sIndex}>
                                                <span
                                                    className={cn(
                                                        'rounded-[2px] bg-[linear-gradient(#e3cd98,#e3cd98)] bg-no-repeat [background-position:0_90%] transition-[background-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                                                        isLit ? '[background-size:100%_45%]' : '[background-size:0%_45%]',
                                                    )}
                                                >
                                                    {segment.text}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-pressed={isPinned}
                                                    aria-describedby={`${uid}-note-${segment.note}`}
                                                    aria-label={`Margin note ${number}`}
                                                    className={cn(
                                                        'relative -top-2 ml-0.5 inline-grid size-5 place-items-center rounded-full font-mono text-[10px] font-bold leading-none transition-colors after:absolute after:-inset-2.5 after:content-[""]',
                                                        isLit
                                                            ? 'bg-[#9c4a2f] text-[#f3ead8]'
                                                            : 'border border-[#9c4a2f]/60 text-[#9c4a2f] hover:bg-[#9c4a2f]/10',
                                                        focusRing,
                                                    )}
                                                    onMouseEnter={() => setHovered(segment.note)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onFocus={() => setHovered(segment.note)}
                                                    onBlur={() => setHovered(null)}
                                                    onClick={() => setPinned((current) => (current === segment.note ? null : segment.note))}
                                                >
                                                    {number}
                                                </button>
                                            </span>
                                        )
                                    })}
                                </p>
                            ))}
                        </div>

                        <p className="mt-8 text-lg italic">With gratitude, and a sharpened pencil,</p>

                        <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-lg sm:gap-8">
                            {signatures.map((signature, index) => (
                                <div key={signature.id}>
                                    <svg
                                        viewBox={signature.viewBox}
                                        role="img"
                                        aria-label={`Signature of ${signature.name}`}
                                        className="h-14 w-full max-w-[13rem] text-[#2b2118] sm:h-16"
                                    >
                                        <motion.path
                                            d={signature.d}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            viewport={{ once: true, amount: 0.9 }}
                                            transition={{ duration: reduceMotion ? 0 : 2.6, delay: index * 1.1, ease: [0.45, 0, 0.25, 1] }}
                                        />
                                    </svg>
                                    <p className="mt-1 text-base font-semibold">{signature.name}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-1 text-sm italic text-[#2b2118]/70">
                            Joint Managing Partners, third generation
                        </p>

                        <div className="mt-10 flex flex-col gap-3 border-t border-dashed border-[#2b2118]/30 pt-6 sm:flex-row sm:items-center sm:gap-8">
                            <a
                                href="#contact-harrow-pike"
                                className={cn(
                                    'group inline-flex min-h-11 items-center gap-3 self-start rounded-full bg-[#2b2118] px-6 text-sm font-semibold tracking-wide text-[#f3ead8] transition-colors hover:bg-[#9c4a2f]',
                                    focusRing,
                                )}
                            >
                                Write back to Clara &amp; Tom
                                <HiArrowLongRight
                                    aria-hidden="true"
                                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </a>
                            <a
                                href="#harrow-pike-archive"
                                className={cn(
                                    'inline-flex min-h-11 items-center self-start border-b border-[#2b2118]/40 text-sm italic hover:border-[#9c4a2f] hover:text-[#9c4a2f]',
                                    focusRing,
                                )}
                            >
                                Browse the project archive, 1962–2026
                            </a>
                        </div>
                    </div>

                    <aside
                        aria-label="From the archive"
                        className="order-2 flex flex-wrap items-start gap-8 sm:flex-nowrap lg:order-3 lg:flex-col lg:gap-10"
                    >
                        <motion.figure
                            initial={{ rotate: reduceMotion ? 3 : -5, y: reduceMotion ? 0 : 24 }}
                            whileInView={{ rotate: 3, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ type: 'spring', stiffness: 70, damping: 14 }}
                            className="relative w-44 shrink-0 sm:w-52 lg:w-full"
                        >
                            <div className="relative bg-[#fbf6ea] p-2 pb-3 shadow-[0_18px_30px_-18px_rgba(43,33,24,0.6)]">
                                <img
                                    src="https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=600&q=80"
                                    alt="Black-and-white studio portrait of a bearded man, printed in sepia"
                                    loading="lazy"
                                    className="aspect-[4/5] w-full object-cover sepia-[0.65] contrast-[1.08] brightness-[0.96]"
                                />
                                <span aria-hidden="true" className="absolute -left-1 -top-1 size-6 bg-[#2b2118]/85 [clip-path:polygon(0_0,100%_0,0_100%)]" />
                                <span aria-hidden="true" className="absolute -right-1 -top-1 size-6 bg-[#2b2118]/85 [clip-path:polygon(0_0,100%_0,100%_100%)]" />
                                <span aria-hidden="true" className="absolute -bottom-1 -left-1 size-6 bg-[#2b2118]/85 [clip-path:polygon(0_0,0_100%,100%_100%)]" />
                                <span aria-hidden="true" className="absolute -bottom-1 -right-1 size-6 bg-[#2b2118]/85 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
                            </div>
                            <figcaption className="mt-4 text-sm italic leading-snug text-[#2b2118]/80">
                                Arthur Harrow, photographed for the firm’s first brochure, 1964.
                            </figcaption>
                        </motion.figure>

                        <div className="flex flex-col items-start gap-5">
                            <svg viewBox="0 0 120 120" aria-hidden="true" className="size-28 -rotate-12 text-[#9c4a2f] opacity-80 mix-blend-multiply">
                                <defs>
                                    <path id={`${uid}-arc`} d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0" />
                                </defs>
                                <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1" />
                                <text fill="currentColor" className="font-mono text-[10px] tracking-[0.2em]">
                                    <textPath href={`#${uid}-arc`}>BRISTOL · EST. 1962 · 64 YEARS ·</textPath>
                                </text>
                                <text x="60" y="58" textAnchor="middle" fill="currentColor" className="font-serif text-[15px] italic">
                                    H&amp;P
                                </text>
                                <text x="60" y="74" textAnchor="middle" fill="currentColor" className="font-mono text-[8px] tracking-[0.2em]">
                                    2026
                                </text>
                            </svg>
                            <p className="max-w-[14rem] font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[#2b2118]/70">
                                Enclosed: 3,140 structures, 64 years of drawings, one bent slide rule.
                            </p>
                        </div>
                    </aside>

                    <aside
                        aria-label="Margin notes"
                        className="order-3 lg:order-1 lg:border-r lg:border-[#2b2118]/15 lg:pr-8"
                    >
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#2b2118]/60">In the margin</p>
                        <ol className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-7">
                            {notes.map((note, index) => {
                                const isLit = lit === note.id
                                return (
                                    <li
                                        key={note.id}
                                        id={`${uid}-note-${note.id}`}
                                        className={cn(
                                            'border-l-2 py-1 pl-4 transition-colors duration-300',
                                            isLit ? 'border-[#9c4a2f] bg-[#e3cd98]/35' : 'border-[#2b2118]/20',
                                        )}
                                        onMouseEnter={() => setHovered(note.id)}
                                        onMouseLeave={() => setHovered(null)}
                                    >
                                        <p className="flex items-baseline gap-2">
                                            <span className="font-mono text-[10px] font-bold text-[#9c4a2f]">{index + 1}</span>
                                            <span className="text-3xl italic leading-none">{note.year}</span>
                                        </p>
                                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em]">{note.title}</p>
                                        <p className="mt-1.5 text-sm leading-relaxed text-[#2b2118]/80">{note.text}</p>
                                    </li>
                                )
                            })}
                        </ol>
                    </aside>
                </div>

                <svg
                    viewBox="0 0 600 60"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                    className="relative mt-12 h-10 w-full text-[#2b2118]/20"
                >
                    <path
                        d="M0 10H600M0 50H600M0 50L30 10L60 50L90 10L120 50L150 10L180 50L210 10L240 50L270 10L300 50L330 10L360 50L390 10L420 50L450 10L480 50L510 10L540 50L570 10L600 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </article>
        </section>
    )
}

export default FoundersLetterAboutStory

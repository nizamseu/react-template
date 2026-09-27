// BioModalLeadershipTeam

// LeadershipTeam02 · Corporate & Business › Leadership / Core Team

// Description:
// An archival, sepia-toned leadership section for the fictional family engineering firm
// Harrow & Pike (est. 1962). Under "Three generations, one drawing board." six partners
// appear as mounted photographic plates with name and role; choosing one opens a modal
// "file" with the full biography, education, a pull quote and previous/next navigation.
// Use it on an about or people page where each leader deserves a proper story.

// Design:
// - Sepia paper #f3ead8 section with ink #2b2118 serif type and a rust #9a4a2a accent for
//   the eyebrow rule, plate numbers, quote marks and focus rings; faint ruled-paper lines
// - Cards: portraits in a cream #fbf6ea mat with a hairline ring and soft shadow, photos
//   sepia 60% + lowered saturation that warm to 20% sepia with a slight tilt on hover
// - Grid 2 → md:3 columns; from md the middle column drops by 2.5rem for an editorial rhythm
// - Modal: ink/60 blurred backdrop; a paper sheet max-w-4xl that scrolls inside itself,
//   portrait column 300px from md (stacked on mobile), serif name text-4xl, education as a
//   hairline list, a large italic quote and a sticky prev/next footer; scales/fades in,
//   fade only for reduced motion
// - "Read biography" affordance with an arrow that slides on hover; 40px+ targets throughout

// What it does:
// - openIndex (null or 0–5) controls the dialog; each name is a button whose stretched
//   ::after covers the whole card, so the portrait is clickable too
// - While open: body scroll is locked, focus moves to the close button, Tab / Shift+Tab are
//   trapped inside, ← / → step through partners, Escape or a backdrop click closes it, and
//   focus returns to the card that opened it; an sr-only live line names each partner
// - Footer link "Our story since 1962" points to #harrow-pike-story; no network calls

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BioModalLeadershipTeam from '@/TestComponent/PageSections/corporate/LeadershipTeam02';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <BioModalLeadershipTeam />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLeft, HiArrowLongRight, HiArrowRight, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`

const partners = [
    {
        id: 'edmund-harrow',
        plate: 'I',
        name: 'Edmund Harrow',
        role: 'Chair & Senior Partner',
        joined: 1994,
        image: photo('1552058544-f2b08422138a'),
        alt: 'Black and white portrait of Edmund Harrow, bald with a full grey beard',
        bio: [
            'Grandson of our founder Walter Harrow, Edmund started on the drawing board in 1994 checking steel connections for the Tyne footbridge. He has since led more than 120 structural projects, from grain silos to the Kielder visitor centre.',
            'As chair he looks after the long view: the firm’s employee ownership trust, our apprentice school and the rule that no project leaves the office without two engineers’ signatures.',
        ],
        education: [
            { place: 'Imperial College London', detail: 'MEng Civil Engineering', year: 1993 },
            { place: 'Institution of Civil Engineers', detail: 'Fellow', year: 2008 },
        ],
        quote: 'My grandfather priced every job as if he would have to walk across it himself. We still do.',
    },
    {
        id: 'clara-pike',
        plate: 'II',
        name: 'Clara Pike',
        role: 'Managing Director',
        joined: 2006,
        image: photo('1438761681033-6461ffad8d80'),
        alt: 'Portrait of Clara Pike with shoulder-length red hair',
        bio: [
            'Clara is the granddaughter of co-founder Iris Pike and the first managing director to have come up through our site team, spending four winters on the Ribble flood defences.',
            'Since taking over in 2019 she has doubled the water and resilience practice, opened our Glasgow studio and moved the whole firm to a four-and-a-half-day week without losing a single deadline.',
        ],
        education: [
            { place: 'University of Bristol', detail: 'MEng Civil Engineering', year: 2005 },
            { place: 'London Business School', detail: 'Executive MBA', year: 2015 },
        ],
        quote: 'Family firm does not mean small ambitions. It means we are still here when the concrete is fifty years old.',
    },
    {
        id: 'tomasz-wierzbicki',
        plate: 'III',
        name: 'Tomasz Wierzbicki',
        role: 'Director of Bridges',
        joined: 2009,
        image: photo('1506794778202-cad84cf45f1d'),
        alt: 'Portrait of Tomasz Wierzbicki in a dark knit sweater against a black background',
        bio: [
            'Tomasz joined from Warsaw to work on the A1 viaducts and never left. He now runs a team of 34 bridge engineers across road, rail and pedestrian crossings.',
            'His timber footbridge at Hexham won the 2022 Structural Award, and he is our loudest advocate for designing out steel wherever timber or masonry will do.',
        ],
        education: [
            { place: 'Warsaw University of Technology', detail: 'MSc Bridge Engineering', year: 2007 },
            { place: 'Institution of Structural Engineers', detail: 'Chartered Member', year: 2012 },
        ],
        quote: 'The best bridge is the one a village forgets is there, because it simply works every day.',
    },
    {
        id: 'nadia-rahman',
        plate: 'IV',
        name: 'Nadia Rahman',
        role: 'Director of Water & Flood Resilience',
        joined: 2013,
        image: photo('1544005313-94ddf0286df2'),
        alt: 'Portrait of Nadia Rahman with long brown hair and a striped shirt',
        bio: [
            'Nadia leads our fastest-growing practice, protecting 41,000 homes along the Calder, Aire and Ouse with a mix of hard defences and natural flood management.',
            'She completed her PhD part-time while at the firm, modelling how upland peat restoration slows flood peaks, and now teaches the subject at Leeds one evening a week.',
        ],
        education: [
            { place: 'University of Manchester', detail: 'MEng Civil Engineering', year: 2011 },
            { place: 'University of Leeds', detail: 'PhD Hydraulic Engineering', year: 2018 },
        ],
        quote: 'Rivers don’t read our drawings. So we spend a lot of time reading the river first.',
    },
    {
        id: 'oliver-denholm',
        plate: 'V',
        name: 'Oliver Pike-Denholm',
        role: 'Head of Heritage Structures',
        joined: 2011,
        image: photo('1527980965255-d3b416303d12'),
        alt: 'Portrait of Oliver Pike-Denholm smiling in a dark scarf outdoors',
        bio: [
            'Oliver looks after the old things: listed mills, Victorian train sheds and the cast-iron roofs that most engineers would rather replace. He has saved 23 of them in the last decade.',
            'He is Clara’s cousin and the third Pike at the firm, and he still keeps his grandmother’s slide rule on his desk as a reminder to check the maths by hand.',
        ],
        education: [
            { place: 'University of Bath', detail: 'MEng Civil & Architectural Engineering', year: 2010 },
            { place: 'University of York', detail: 'MA Conservation Studies', year: 2014 },
        ],
        quote: 'Victorian engineers left us their calculations in the ironwork. You only need patience to read them.',
    },
    {
        id: 'margit-holm',
        plate: 'VI',
        name: 'Margit Holm',
        role: 'Finance Director',
        joined: 2017,
        image: photo('1506863530036-1efeddceb993'),
        alt: 'Black and white portrait of Margit Holm with short hair against a dark background',
        bio: [
            'Margit came to Harrow & Pike from a Copenhagen shipping group to set up our employee ownership trust, which now holds 62% of the firm on behalf of 240 staff.',
            'She runs finance, IT and legal, and publishes the firm’s full accounts to every employee each quarter, line by line.',
        ],
        education: [
            { place: 'Copenhagen Business School', detail: 'MSc Finance & Accounting', year: 2004 },
            { place: 'ICAEW', detail: 'Chartered Accountant (ACA)', year: 2008 },
        ],
        quote: 'When the people doing the work own the firm, the numbers get very honest, very quickly.',
    },
]

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function BioModalLeadershipTeam({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [openIndex, setOpenIndex] = useState(null)
    const triggerRefs = useRef([])
    const returnTo = useRef(null)
    const dialogRef = useRef(null)
    const closeRef = useRef(null)
    const isOpen = openIndex !== null
    const person = isOpen ? partners[openIndex] : null

    const openBio = (index) => {
        returnTo.current = triggerRefs.current[index]
        setOpenIndex(index)
    }

    const close = () => setOpenIndex(null)
    const stepBy = (dir) => setOpenIndex((i) => (i === null ? i : (i + dir + partners.length) % partners.length))

    useEffect(() => {
        if (!isOpen) return undefined
        const trigger = returnTo.current
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                setOpenIndex(null)
                return
            }
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault()
                const dir = event.key === 'ArrowRight' ? 1 : -1
                setOpenIndex((i) => (i === null ? i : (i + dir + partners.length) % partners.length))
                return
            }
            if (event.key !== 'Tab' || !dialogRef.current) return
            const nodes = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE))
            if (!nodes.length) return
            const first = nodes[0]
            const last = nodes[nodes.length - 1]
            const inside = dialogRef.current.contains(document.activeElement)
            if (event.shiftKey && (document.activeElement === first || !inside)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
            trigger?.focus({ preventScroll: true })
        }
    }, [isOpen])

    const prev = isOpen ? partners[(openIndex - 1 + partners.length) % partners.length] : null
    const next = isOpen ? partners[(openIndex + 1) % partners.length] : null

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f3ead8] px-4 pb-24 pt-20 text-base font-normal text-[#2b2118] sm:px-6 md:pb-36 md:pt-28 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(43,33,24,0.05)_1px,transparent_1px)] bg-size-[100%_34px]"
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="grid gap-8 border-b border-[#2b2118]/20 pb-10 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-8">
                        <p className="flex items-center gap-3 font-serif text-sm italic text-[#2b2118]/75">
                            <span aria-hidden="true" className="h-px w-10 bg-[#9a4a2a]" />
                            Harrow &amp; Pike · Consulting engineers since 1962
                        </p>
                        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#2b2118] sm:text-5xl md:text-6xl">
                            Three generations,
                            <br />
                            <em className="text-[#9a4a2a]">one drawing board.</em>
                        </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-[#2b2118]/75 md:col-span-4">
                        Six partners run the firm today, two of them grandchildren of the founders. Open any
                        plate to read their file.
                    </p>
                </div>

                <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 md:grid-cols-3 md:gap-x-10 md:gap-y-16">
                    {partners.map((partner, index) => (
                        <li
                            key={partner.id}
                            className="group relative rounded-[2px] outline-offset-8 outline-[#9a4a2a] has-[button:focus-visible]:outline-2 md:nth-[3n+2]:translate-y-10"
                        >
                            <div className="bg-[#fbf6ea] p-2 shadow-[0_1px_0_rgba(43,33,24,0.08),0_22px_34px_-24px_rgba(43,33,24,0.55)] ring-1 ring-[#2b2118]/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:-rotate-1 sm:p-3 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#e6d9bf]">
                                    <img
                                        src={partner.image}
                                        alt={partner.alt}
                                        loading="lazy"
                                        className="h-full w-full object-cover contrast-105 saturate-75 sepia-60 transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:sepia-20"
                                    />
                                </div>
                                <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#2b2118]/55 sm:text-[10px]">
                                    <span>
                                        Plate <span className="text-[#9a4a2a]">{partner.plate}</span>
                                    </span>
                                    <span>Joined {partner.joined}</span>
                                </div>
                            </div>
                            <h3 className="mt-5 font-serif text-xl font-normal leading-tight text-[#2b2118] sm:text-2xl">
                                <button
                                    ref={(el) => {
                                        triggerRefs.current[index] = el
                                    }}
                                    type="button"
                                    aria-haspopup="dialog"
                                    className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                                    onClick={() => openBio(index)}
                                >
                                    {partner.name}
                                    <span className="sr-only">, read biography</span>
                                </button>
                            </h3>
                            <p className="mt-1 font-serif text-sm italic text-[#2b2118]/70 sm:text-base">{partner.role}</p>
                            <p
                                aria-hidden="true"
                                className="mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9a4a2a]"
                            >
                                Read biography
                                <HiArrowLongRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="mt-20 flex flex-col gap-3 border-t border-[#2b2118]/20 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between md:mt-28">
                    <p className="font-serif italic text-[#2b2118]/70">240 engineers, surveyors and apprentices · Newcastle, Leeds &amp; Glasgow</p>
                    <a
                        href="#harrow-pike-story"
                        className="group inline-flex min-h-11 items-center gap-2 font-medium text-[#2b2118] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a4a2a]"
                    >
                        <span className="border-b border-[#9a4a2a] pb-0.5">Our story since 1962</span>
                        <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>
            </div>

            <AnimatePresence>
                {person && (
                    <motion.div
                        key="harrow-pike-dialog"
                        className="fixed inset-0 z-50 flex items-end justify-center bg-[#2b2118]/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) close()
                        }}
                    >
                        <motion.div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="harrow-pike-dialog-title"
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 28, scale: reduceMotion ? 1 : 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-4xl overflow-hidden rounded-[4px] bg-[#f7f0e1] text-[#2b2118] shadow-[0_40px_80px_-30px_rgba(20,14,8,0.7)] ring-1 ring-[#2b2118]/15"
                        >
                            <button
                                ref={closeRef}
                                type="button"
                                aria-label="Close biography"
                                className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-[#f7f0e1]/90 text-[#2b2118] ring-1 ring-[#2b2118]/15 transition-colors hover:bg-[#2b2118] hover:text-[#f7f0e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a4a2a]"
                                onClick={close}
                            >
                                <HiXMark aria-hidden="true" className="size-5" />
                            </button>

                            <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh-3rem)]">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={person.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid md:grid-cols-[300px_1fr]"
                                    >
                                        <div className="relative bg-[#e9dcc2] p-4 md:p-5">
                                            <div className="relative aspect-[4/3] overflow-hidden ring-1 ring-[#2b2118]/15 md:aspect-[4/5]">
                                                <img
                                                    src={person.image}
                                                    alt={person.alt}
                                                    className="h-full w-full object-cover contrast-105 saturate-75 sepia-40"
                                                />
                                            </div>
                                            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2b2118]/60">
                                                Plate {person.plate} · At the firm since {person.joined}
                                            </p>
                                        </div>

                                        <div className="p-6 sm:p-10">
                                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a4a2a]">
                                                Partner file {openIndex + 1} of {partners.length}
                                            </p>
                                            <h3
                                                id="harrow-pike-dialog-title"
                                                className="mt-3 pr-10 font-serif text-3xl font-normal leading-tight text-[#2b2118] sm:text-4xl"
                                            >
                                                {person.name}
                                            </h3>
                                            <p className="mt-1 font-serif text-lg italic text-[#2b2118]/70">{person.role}</p>

                                            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#2b2118]/85">
                                                {person.bio.map((paragraph) => (
                                                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                                                ))}
                                            </div>

                                            <h4 className="mt-8 font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-[#2b2118]/60">
                                                Education &amp; qualifications
                                            </h4>
                                            <ul className="mt-3 border-t border-[#2b2118]/15">
                                                {person.education.map((item) => (
                                                    <li
                                                        key={item.place}
                                                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#2b2118]/15 py-3"
                                                    >
                                                        <span>
                                                            <span className="block font-serif text-base text-[#2b2118]">{item.place}</span>
                                                            <span className="block text-sm text-[#2b2118]/65">{item.detail}</span>
                                                        </span>
                                                        <span className="font-mono text-xs text-[#2b2118]/55">{item.year}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <figure className="relative mt-8 border-l-2 border-[#9a4a2a] pl-5">
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute -top-5 left-3 font-serif text-6xl leading-none text-[#9a4a2a]/35"
                                                >
                                                    “
                                                </span>
                                                <blockquote className="font-serif text-xl italic leading-snug text-[#2b2118] sm:text-2xl">
                                                    {person.quote}
                                                </blockquote>
                                                <figcaption className="mt-2 text-xs uppercase tracking-[0.18em] text-[#2b2118]/55">
                                                    — {person.name.split(' ')[0]}
                                                </figcaption>
                                            </figure>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[#2b2118]/15 bg-[#f7f0e1]/95 px-6 py-2 backdrop-blur sm:px-10">
                                    <button
                                        type="button"
                                        className="group inline-flex min-h-11 min-w-0 items-center gap-2 text-left text-sm text-[#2b2118]/80 hover:text-[#2b2118] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a4a2a]"
                                        onClick={() => stepBy(-1)}
                                    >
                                        <HiArrowLeft aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
                                        <span className="truncate">
                                            <span className="sr-only">Previous: </span>
                                            {prev.name}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="group inline-flex min-h-11 min-w-0 items-center gap-2 text-right text-sm text-[#2b2118]/80 hover:text-[#2b2118] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a4a2a]"
                                        onClick={() => stepBy(1)}
                                    >
                                        <span className="truncate">
                                            <span className="sr-only">Next: </span>
                                            {next.name}
                                        </span>
                                        <HiArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                                <p aria-live="polite" className="sr-only">
                                    {person.name}, {person.role}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default BioModalLeadershipTeam

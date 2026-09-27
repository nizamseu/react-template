// PaperResumeExperienceTimeline

// ExperienceTimeline04 · Portfolios & Personal Websites › Experience & Education Timeline

// Description:
// A printed-CV presentation for photographer and art director Theo Laurent. On a warm
// stone desk, the intro "Fifteen years behind the lens, five in front of the brief." sits
// beside an A4 résumé sheet with a paper-clipped black-and-white portrait, a letter-spaced
// serif name, Profile, Experience (Maison Orée, Studio Halden, Revue Grain, freelance),
// Education, Exhibitions & awards, Clients and Kit. A "Download CV" button and jump
// links sit on the left. Use it for a creative's experience or about page.

// Design:
// - Stone #e7e3dc desk, paper #fcfbf8 sheet with a layered drop shadow and a faint
//   top-right fold; near-black #141414 serif type with hairline #141414/15 rules
// - Sheet is A4 (aspect 210/297, flex column with the footer pinned to the bottom) from
//   lg; small resume type (10–15px), letter-spaced section labels, 104px date column
// - Paper-clip SVG holding a tilted greyscale portrait in the top-right corner
// - Motion: the sheet settles in from a 1.5° tilt on view and experience rows dim their
//   siblings on hover; reduced motion keeps the sheet flat and still
// - Layout: stacked (intro above a centred sheet, max 760px) up to lg; xl two columns
//   with a sticky intro and a 720px sheet

// What it does:
// - hovered (experience id) is set on pointer enter over a row and cleared on leave,
//   dimming the other rows (visual only); no other state
// - "Download CV" links to #cv; the jump links point to the sheet's section ids
//   (#theo-cv-experience, #theo-cv-education, #theo-cv-awards); email links to
//   #theo-contact; the portrait loads lazily

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PaperResumeExperienceTimeline from '@/TestComponent/PageSections/portfolio/ExperienceTimeline04';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <PaperResumeExperienceTimeline />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownTray, HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const experience = [
    {
        id: 'oree',
        dates: '2021 — Present',
        role: 'Art Director',
        org: 'Maison Orée',
        place: 'Paris',
        points: [
            'Direct campaign imagery for a fragrance and leather house in 14 markets.',
            'Built an in-house studio of 6; production costs down 30% in two seasons.',
        ],
    },
    {
        id: 'halden',
        dates: '2017 — 2021',
        role: 'Senior Photographer',
        org: 'Studio Halden',
        place: 'Lisbon',
        points: [
            'Shot hospitality and interiors for 40+ hotels, from Porto to Marrakech.',
            'Introduced a medium-format film workflow now used on every Halden shoot.',
        ],
    },
    {
        id: 'grain',
        dates: '2014 — 2017',
        role: 'Photo Editor',
        org: 'Revue Grain',
        place: 'Paris',
        points: [
            'Commissioned and edited portfolios for a quarterly photography magazine.',
            'Grew the contributor network from 30 to 120 photographers.',
        ],
    },
    {
        id: 'freelance',
        dates: '2011 — 2014',
        role: 'Freelance Photographer',
        org: 'Independent',
        place: 'Lyon',
        points: ['Editorial portraits and live music for regional press and small labels.'],
    },
]

const education = [
    { dates: '2009 — 2011', title: 'MA Photography', org: 'Atelier Supérieur de l’Image, Lyon' },
    { dates: '2006 — 2009', title: 'BA Visual Communication', org: 'École Vauban des Arts, Nîmes' },
]

const awards = [
    { year: '2025', title: '“Salt Rooms”, solo exhibition', org: 'Galerie Nord-Est, Paris' },
    { year: '2023', title: 'Gold, Fashion Campaign', org: 'Lumière Creative Awards' },
    { year: '2019', title: 'Shortlist, Portrait of the Year', org: 'Northlight Photo Prize' },
]

const clients = ['Maison Orée', 'Nordlys Hotels', 'Atelier Sable', 'Oda Records', 'Café Lune']
const kit = ['Medium format digital', '35mm film', 'Capture One', 'Profoto']

const jumps = [
    { href: '#theo-cv-experience', label: 'Experience', count: '04' },
    { href: '#theo-cv-education', label: 'Education', count: '02' },
    { href: '#theo-cv-awards', label: 'Exhibitions & awards', count: '03' },
]

function SectionLabel({ id, children }) {
    return (
        <h3
            id={id}
            className="scroll-mt-10 border-b border-[#141414]/15 pb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#141414]/60"
        >
            {children}
        </h3>
    )
}

export function PaperResumeExperienceTimeline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [hovered, setHovered] = useState(null)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#e7e3dc] text-base font-normal text-[#141414]', className)}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,720px)] xl:gap-16">
                <div className="lg:mx-auto lg:w-full lg:max-w-[760px] xl:sticky xl:top-12 xl:mx-0 xl:max-w-none xl:self-start">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-[#141414]/60">
                        Theo Laurent · Curriculum vitæ
                    </p>
                    <h2 className="mt-6 font-serif text-5xl font-normal leading-[1.02] tracking-tight text-[#141414] sm:text-6xl xl:text-[64px]">
                        Fifteen years behind the lens, <em className="italic">five in front of the brief.</em>
                    </h2>
                    <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-[#141414]/75">
                        Photographer turned art director, working between Paris and Lisbon on campaigns,
                        interiors and the occasional record sleeve.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <a
                            href="#cv"
                            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#141414] px-6 text-sm font-semibold text-[#fcfbf8] transition-colors duration-300 hover:bg-[#3a3a3a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
                        >
                            <HiArrowDownTray
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                            />
                            Download CV
                        </a>
                        <p className="font-mono text-[11px] leading-relaxed text-[#141414]/55">
                            PDF · 2 pages · 412 KB
                            <br />
                            Updated September 2026
                        </p>
                    </div>

                    <nav aria-label="CV sections" className="mt-12 max-w-sm border-t border-[#141414]/15">
                        <ul>
                            {jumps.map((jump) => (
                                <li key={jump.href} className="border-b border-[#141414]/15">
                                    <a
                                        href={jump.href}
                                        className="group flex min-h-12 items-center gap-4 font-serif text-lg text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                                    >
                                        <span className="font-mono text-[11px] text-[#141414]/45">{jump.count}</span>
                                        <span className="flex-1 transition-transform duration-300 group-hover:translate-x-1">
                                            {jump.label}
                                        </span>
                                        <HiArrowLongRight
                                            aria-hidden="true"
                                            className="size-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <motion.article
                    aria-label="Theo Laurent résumé"
                    className="relative mx-auto w-full max-w-[760px] bg-[#fcfbf8] px-5 pb-8 pt-10 shadow-[0_1px_2px_rgba(20,20,20,0.08),0_12px_24px_-12px_rgba(20,20,20,0.18),0_40px_80px_-40px_rgba(20,20,20,0.45)] sm:px-10 sm:pb-10 sm:pt-12 lg:flex lg:aspect-[210/297] lg:flex-col lg:px-12 xl:max-w-none"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 40, rotate: reduceMotion ? 0 : 1.5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span
                        aria-hidden="true"
                        className="absolute right-0 top-0 size-10 bg-[linear-gradient(225deg,#e7e3dc_50%,#ebe7e0_50%)] shadow-[-2px_2px_4px_rgba(20,20,20,0.08)]"
                    />

                    <figure className="absolute right-5 top-6 w-20 rotate-3 bg-white p-1.5 shadow-[0_8px_18px_-8px_rgba(20,20,20,0.45)] sm:right-10 sm:top-8 sm:w-28 lg:right-12">
                        <img
                            src="https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80"
                            alt="Black-and-white portrait of Theo Laurent, bearded, looking into the camera"
                            loading="lazy"
                            className="aspect-[4/5] w-full object-cover grayscale"
                        />
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 64"
                            className="absolute -top-6 left-4 h-14 w-5 -rotate-6 text-[#8a8a8a]"
                        >
                            <path
                                d="M8 44 V10 a6 6 0 0 1 12 0 V50 a9 9 0 0 1 -18 0 V16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </figure>

                    <header className="pr-24 sm:pr-36">
                        <p className="font-serif text-2xl uppercase leading-tight tracking-[0.22em] text-[#141414] sm:text-4xl">
                            Theo Laurent
                        </p>
                        <p className="mt-2 font-serif text-base italic text-[#141414]/75 sm:text-lg">
                            Photographer &amp; Art Director
                        </p>
                        <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#141414]/60 sm:text-[11px]">
                            Paris ↔ Lisbon ·{' '}
                            <a
                                href="#theo-contact"
                                className="underline decoration-[#141414]/30 underline-offset-2 hover:decoration-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                            >
                                studio@theolaurent.fr
                            </a>{' '}
                            · FR / EN / PT
                        </p>
                    </header>

                    <p className="mt-6 border-t border-[#141414] pt-4 font-serif text-[15px] leading-relaxed text-[#141414]/85">
                        Art director with a photographer’s eye and a producer’s calendar: campaigns from the
                        first mood board to the last retouch, with a film camera always in the bag.
                    </p>

                    <div className="mt-6 lg:mt-5">
                        <SectionLabel id="theo-cv-experience">Experience</SectionLabel>
                        <ol className="mt-3 space-y-4">
                            {experience.map((job) => (
                                <li
                                    key={job.id}
                                    className={cn(
                                        'grid gap-1 transition-opacity duration-300 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-4',
                                        hovered && hovered !== job.id ? 'opacity-40' : 'opacity-100',
                                    )}
                                    onPointerEnter={() => setHovered(job.id)}
                                    onPointerLeave={() => setHovered(null)}
                                >
                                    <p className="pt-0.5 font-mono text-[11px] text-[#141414]/55">{job.dates}</p>
                                    <div>
                                        <p className="font-serif text-[15px] leading-snug text-[#141414]">
                                            <span className="font-semibold">{job.role}</span>
                                            <span className="text-[#141414]/60">, </span>
                                            <em className="italic">{job.org}</em>
                                            <span className="text-[#141414]/55"> · {job.place}</span>
                                        </p>
                                        <ul className="mt-1 space-y-0.5">
                                            {job.points.map((point) => (
                                                <li key={point} className="flex gap-2 text-[13px] leading-relaxed text-[#141414]/75">
                                                    <span aria-hidden="true">–</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="mt-6 grid gap-7 sm:grid-cols-2 sm:gap-10 lg:mt-5">
                        <div>
                            <SectionLabel id="theo-cv-education">Education</SectionLabel>
                            <ul className="mt-3 space-y-2.5">
                                {education.map((item) => (
                                    <li key={item.title}>
                                        <p className="font-mono text-[11px] text-[#141414]/55">{item.dates}</p>
                                        <p className="font-serif text-[15px] font-semibold text-[#141414]">{item.title}</p>
                                        <p className="font-serif text-[13px] italic text-[#141414]/70">{item.org}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <SectionLabel id="theo-cv-awards">Exhibitions &amp; awards</SectionLabel>
                            <ul className="mt-3 space-y-2.5">
                                {awards.map((award) => (
                                    <li key={award.title} className="flex gap-3">
                                        <span className="pt-0.5 font-mono text-[11px] text-[#141414]/55">{award.year}</span>
                                        <span>
                                            <span className="block font-serif text-[14px] text-[#141414]">{award.title}</span>
                                            <span className="block font-serif text-[13px] italic text-[#141414]/70">{award.org}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-7 sm:grid-cols-2 sm:gap-10 lg:mb-6 lg:mt-5">
                        <div>
                            <SectionLabel>Selected clients</SectionLabel>
                            <p className="mt-3 font-serif text-[14px] leading-relaxed text-[#141414]/80">
                                {clients.join(' · ')}
                            </p>
                        </div>
                        <div>
                            <SectionLabel>Kit</SectionLabel>
                            <p className="mt-3 font-serif text-[14px] leading-relaxed text-[#141414]/80">
                                {kit.join(' · ')}
                            </p>
                        </div>
                    </div>

                    <footer className="mt-10 flex items-end justify-between lg:mt-auto border-t border-[#141414]/15 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#141414]/45">
                        <span>References on request</span>
                        <span>1 / 2</span>
                    </footer>
                </motion.article>
            </div>
        </section>
    )
}

export default PaperResumeExperienceTimeline

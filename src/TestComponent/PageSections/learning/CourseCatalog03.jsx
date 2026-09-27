// BookshelfSpineCourseCatalog

// CourseCatalog03 · Learning Management Systems › Course Catalog

// Description:
// A reading-room catalogue for the fictional Lumen Library Online, where ten humanities and
// science courses stand on a wooden shelf as book spines. Under "Take a course off the
// shelf." a learner clicks a spine: it slides up out of the row and a library-card panel
// shows the subject, tutor, syllabus length (chapters, lessons, hours), a summary and an
// "Enrol with your library card" link. Use it for a slow-learning or liberal-arts brand.

// Design:
// - Walnut #3a2618 section with a warm lamp-light radial glow; parchment #f3e6cc text and
//   card; spines in muted oxblood, sage, ochre, slate, plum, teal, navy and moss
// - Spines are 50–72px wide and 240–330px tall, with gilt #d8b56a bands, a serif title set
//   vertically ([writing-mode:vertical-rl] + rotate-180) and a roman volume number
// - A dark plank with a highlight edge and deep shadow sits under the row; the card is lined
//   parchment (repeating-linear-gradient) with a round tutor portrait and serif title
// - The selected spine springs up 28px (framer-motion); the card content crossfades with
//   AnimatePresence; reduced motion keeps only a ring and no movement
// - Mobile: the shelf scrolls sideways with scroll-snap and the card sits below; lg: shelf
//   (7 cols) and card (5 cols) side by side

// What it does:
// - selectedId state (starts on "Latin Without Tears"): clicking a spine selects it,
//   clicking the same spine or "Put it back" returns it and shows an empty-card prompt
// - Spines are buttons with aria-expanded and aria-controls pointing at the detail card
// - "Enrol with your library card" links to #enrol-<id>; "Browse all 64 courses" to
//   #lumen-catalogue

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BookshelfSpineCourseCatalog from '@/TestComponent/PageSections/learning/CourseCatalog03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <BookshelfSpineCourseCatalog />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { LuBookMarked, LuLibrary } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const portrait = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`

const tutors = {
    albrecht: { name: 'Dr. Ines Albrecht', role: 'Philosopher, Freiburg', image: portrait('photo-1531123897727-8f129e1688ce'), alt: 'Portrait of Dr. Ines Albrecht in warm light' },
    wierzbicki: { name: 'Tomasz Wierzbicki', role: 'Map curator, Kraków', image: portrait('photo-1599566150163-29194dcaad36'), alt: 'Portrait of Tomasz Wierzbicki, bearded, wearing glasses' },
    okafor: { name: 'Maya Okafor', role: 'Poet and editor, London', image: portrait('photo-1573497019940-1c28c88b4f3e'), alt: 'Portrait of Maya Okafor smiling, wearing a blazer' },
    greaves: { name: 'Hollis Greaves', role: 'Retired botanist, Kew', image: portrait('photo-1472099645785-5658abf4ff4e'), alt: 'Portrait of Hollis Greaves, an older man with glasses' },
    deveraux: { name: 'Prof. Clara Deveraux', role: 'Classicist, Lyon', image: portrait('photo-1580489944761-15a19d654956'), alt: 'Portrait of Professor Clara Deveraux smiling' },
    adeyemi: { name: 'Samuel Adeyemi', role: 'Ethics lecturer, Lagos', image: portrait('photo-1552058544-f2b08422138a'), alt: 'Black and white portrait of Samuel Adeyemi' },
    lindqvist: { name: 'Freya Lindqvist', role: 'Novelist and binder, Uppsala', image: portrait('photo-1554151228-14d9def656e4'), alt: 'Portrait of Freya Lindqvist, a young woman with freckles' },
    montes: { name: 'Rafael Montes', role: 'Amateur astronomer, Granada', image: portrait('photo-1566492031773-4f4e44671857'), alt: 'Portrait of Rafael Montes wearing glasses' },
}

const books = [
    { id: 'attention', vol: 'I', title: 'The Art of Attention', subject: 'Philosophy', tutor: 'albrecht', chapters: 8, lessons: 24, length: '6h 40m', colour: 'bg-[#7a3e35]', size: 'h-[300px] w-[58px]', blurb: 'Simone Weil, William James and a notebook: eight weeks on noticing what you notice.' },
    { id: 'maps', vol: 'II', title: 'A Short History of Maps', subject: 'History', tutor: 'wierzbicki', chapters: 10, lessons: 31, length: '8h 15m', colour: 'bg-[#4f6b5a]', size: 'h-[270px] w-[66px]', blurb: 'From clay tablets to satellite tiles, read twelve maps as arguments about power.' },
    { id: 'poetry', vol: 'III', title: 'Reading Poetry Slowly', subject: 'Literature', tutor: 'okafor', chapters: 6, lessons: 18, length: '4h 50m', colour: 'bg-[#8a6d3b]', size: 'h-[320px] w-[50px]', blurb: 'One poem a day, read aloud, annotated and discussed in a small online circle.' },
    { id: 'botany', vol: 'IV', title: 'Botany for the Curious', subject: 'Science', tutor: 'greaves', chapters: 9, lessons: 27, length: '7h 30m', colour: 'bg-[#34506b]', size: 'h-[250px] w-[72px]', blurb: 'Leaf, root and seed: learn to key out forty plants you pass every week.' },
    { id: 'latin', vol: 'V', title: 'Latin Without Tears', subject: 'Languages', tutor: 'deveraux', chapters: 12, lessons: 48, length: '11h 20m', colour: 'bg-[#5b4a6b]', size: 'h-[305px] w-[62px]', blurb: 'Enough grammar to read Catullus and Pliny in the original by the last chapter.' },
    { id: 'stoicism', vol: 'VI', title: 'Stoicism in Practice', subject: 'Philosophy', tutor: 'adeyemi', chapters: 7, lessons: 21, length: '5h 10m', colour: 'bg-[#2f4a4a]', size: 'h-[285px] w-[54px]', blurb: 'Epictetus and Seneca as daily exercises, with a short journal prompt each morning.' },
    { id: 'novel', vol: 'VII', title: 'The Novel in Twelve Books', subject: 'Literature', tutor: 'lindqvist', chapters: 12, lessons: 36, length: '14h', colour: 'bg-[#6b5a3a]', size: 'h-[330px] w-[70px]', blurb: 'Don Quixote to Beloved: how the novel kept reinventing itself, one book a week.' },
    { id: 'astronomy', vol: 'VIII', title: 'Astronomy by Eye', subject: 'Science', tutor: 'montes', chapters: 8, lessons: 22, length: '5h 45m', colour: 'bg-[#1f2f4f]', size: 'h-[260px] w-[56px]', blurb: 'No telescope needed: constellations, planets and meteor showers from your window.' },
    { id: 'bookbinding', vol: 'IX', title: 'Bookbinding at Home', subject: 'Craft', tutor: 'lindqvist', chapters: 5, lessons: 15, length: '3h 30m', colour: 'bg-[#8c4f3f]', size: 'h-[240px] w-[60px]', blurb: 'Stitch a pamphlet, a Coptic journal and a cased book with kitchen-table tools.' },
    { id: 'archives', vol: 'X', title: 'Into the Archive', subject: 'History', tutor: 'wierzbicki', chapters: 9, lessons: 26, length: '7h', colour: 'bg-[#5d6b4f]', size: 'h-[295px] w-[64px]', blurb: 'Find, read and cite letters, ledgers and parish records like a working historian.' },
]

export function BookshelfSpineCourseCatalog({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [selectedId, setSelectedId] = useState('latin')
    const selected = books.find((book) => book.id === selectedId)
    const tutor = selected ? tutors[selected.tutor] : null

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#3a2618] px-4 py-16 text-base font-normal text-[#f3e6cc] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(243,230,204,0.16),transparent_60%)]"
                aria-hidden="true"
            />
            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-2 font-serif text-sm italic text-[#d8b56a]">
                            <LuLibrary className="h-4 w-4" aria-hidden="true" />
                            Lumen Library Online · The Reading Room
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#f3e6cc] sm:text-5xl md:text-6xl">
                            Take a course <em className="text-[#d8b56a]">off the shelf.</em>
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#f3e6cc]/75">
                            Self-paced courses from librarians, scholars and makers. Free with any
                            member library card, yours to keep reading for a year.
                        </p>
                    </div>
                    <a
                        href="#lumen-catalogue"
                        className="group inline-flex min-h-10 items-center gap-2 self-start font-serif text-lg italic text-[#f3e6cc] underline decoration-[#d8b56a]/60 underline-offset-4 hover:decoration-[#d8b56a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b56a] md:self-end"
                    >
                        Browse all 64 courses
                        <HiArrowLongRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                </div>

                <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-12">
                    <div className="lg:col-span-7">
                        <div className="-mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-6 pt-10 [scrollbar-width:thin] sm:mx-0 sm:px-0">
                            <div className="inline-flex min-w-full flex-col">
                                <div className="flex items-end gap-1.5 px-3" role="group" aria-label="Course shelf">
                                    {books.map((book) => {
                                        const active = book.id === selectedId
                                        return (
                                            <motion.button
                                                key={book.id}
                                                type="button"
                                                aria-expanded={active}
                                                aria-controls="lumen-borrowing-card"
                                                aria-label={`${book.title}, ${book.subject}, volume ${book.vol}`}
                                                animate={{ y: active && !reduceMotion ? -28 : 0 }}
                                                whileHover={reduceMotion || active ? undefined : { y: -8 }}
                                                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                                                className={cn(
                                                    'relative flex shrink-0 snap-start flex-col items-center justify-between rounded-t-[4px] rounded-b-[2px] py-4 text-[#f3e6cc] shadow-[inset_-6px_0_10px_-6px_rgba(0,0,0,0.55),inset_4px_0_6px_-4px_rgba(255,255,255,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b56a]',
                                                    book.colour,
                                                    book.size,
                                                    active && 'ring-2 ring-[#d8b56a] ring-offset-2 ring-offset-[#3a2618]',
                                                )}
                                                onClick={() => setSelectedId(active ? null : book.id)}
                                            >
                                                <span className="flex w-full flex-col gap-1 px-1.5" aria-hidden="true">
                                                    <span className="h-px w-full bg-[#d8b56a]/80" />
                                                    <span className="h-1 w-full bg-[#d8b56a]/50" />
                                                </span>
                                                <span className="rotate-180 font-serif text-[13px] leading-tight tracking-wide [writing-mode:vertical-rl] sm:text-sm">
                                                    {book.title}
                                                </span>
                                                <span className="flex w-full flex-col items-center gap-1.5 px-1.5">
                                                    <span className="font-serif text-[11px] text-[#d8b56a]">{book.vol}</span>
                                                    <span className="h-1 w-full bg-[#d8b56a]/50" aria-hidden="true" />
                                                </span>
                                            </motion.button>
                                        )
                                    })}
                                    <span
                                        className="ml-2 h-[230px] w-[52px] shrink-0 origin-bottom-left rotate-[8deg] rounded-t-[4px] bg-[#2a1b10] shadow-[inset_-6px_0_10px_-6px_rgba(0,0,0,0.6)]"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div
                                    className="h-4 w-full rounded-[3px] border-t-2 border-[#6b4a2f] bg-[#24170e] shadow-[0_22px_30px_-12px_rgba(0,0,0,0.75)]"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        <p className="text-sm italic text-[#f3e6cc]/60">
                            Pull a spine to read its borrowing card.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <div
                            id="lumen-borrowing-card"
                            aria-live="polite"
                            className="relative min-h-[27rem] overflow-hidden rounded-[6px] bg-[#f3e6cc] p-6 text-[#3a2618] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] sm:p-8"
                        >
                            <div
                                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,rgba(58,38,24,0.08)_31px,rgba(58,38,24,0.08)_32px)]"
                                aria-hidden="true"
                            />
                            <div className="absolute inset-y-0 left-10 w-px bg-[#b5483b]/35" aria-hidden="true" />
                            <AnimatePresence mode="wait" initial={false}>
                                {selected ? (
                                    <motion.div
                                        key={selected.id}
                                        initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative pl-8"
                                    >
                                        <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-[#3a2618]/60">
                                            <span>Borrowing card · Vol. {selected.vol}</span>
                                            <span>{selected.subject}</span>
                                        </div>
                                        <h3 className="mt-5 font-serif text-3xl font-normal leading-tight text-[#3a2618] sm:text-4xl">
                                            {selected.title}
                                        </h3>
                                        <p className="mt-3 text-base leading-relaxed text-[#3a2618]/80">{selected.blurb}</p>

                                        <div className="mt-6 flex items-center gap-4">
                                            <img
                                                src={tutor.image}
                                                alt={tutor.alt}
                                                loading="lazy"
                                                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#3a2618]/15"
                                            />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-[#3a2618]/55">Tutor</p>
                                                <p className="font-serif text-lg text-[#3a2618]">{tutor.name}</p>
                                                <p className="text-sm text-[#3a2618]/65">{tutor.role}</p>
                                            </div>
                                        </div>

                                        <dl className="mt-6 grid grid-cols-3 border-y border-[#3a2618]/20 py-4 text-center">
                                            <div>
                                                <dt className="text-[11px] uppercase tracking-[0.18em] text-[#3a2618]/55">Chapters</dt>
                                                <dd className="mt-1 font-serif text-xl text-[#3a2618] sm:text-2xl">{selected.chapters}</dd>
                                            </div>
                                            <div className="border-x border-[#3a2618]/15">
                                                <dt className="text-[11px] uppercase tracking-[0.18em] text-[#3a2618]/55">Lessons</dt>
                                                <dd className="mt-1 font-serif text-xl text-[#3a2618] sm:text-2xl">{selected.lessons}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-[11px] uppercase tracking-[0.18em] text-[#3a2618]/55">Length</dt>
                                                <dd className="mt-1 font-serif text-xl text-[#3a2618] sm:text-2xl">{selected.length}</dd>
                                            </div>
                                        </dl>

                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <a
                                                href={`#enrol-${selected.id}`}
                                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3a2618] px-6 text-sm font-semibold text-[#f3e6cc] transition-colors hover:bg-[#5a3b24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5483b]"
                                            >
                                                Enrol with your library card
                                                <HiArrowLongRight className="h-4 w-4" aria-hidden="true" />
                                            </a>
                                            <button
                                                type="button"
                                                className="inline-flex min-h-11 items-center justify-center rounded-full px-4 font-serif text-base italic text-[#3a2618] underline decoration-[#3a2618]/30 underline-offset-4 hover:decoration-[#3a2618] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5483b]"
                                                onClick={() => setSelectedId(null)}
                                            >
                                                Put it back
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative flex min-h-[23rem] flex-col items-center justify-center pl-8 text-center"
                                    >
                                        <LuBookMarked className="h-10 w-10 text-[#3a2618]/40" aria-hidden="true" />
                                        <h3 className="mt-4 font-serif text-2xl font-normal text-[#3a2618]">The card is blank</h3>
                                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#3a2618]/70">
                                            Choose any spine on the shelf to see its tutor, chapters and how
                                            long it takes to read.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookshelfSpineCourseCatalog

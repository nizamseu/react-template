// ChapterReaderCourseSyllabus

// CourseSyllabus04 · Learning Management Systems › Course Overview & Syllabus

// Description:
// A book-like syllabus for "The Short Story Workshop" at the fictional Quill & Ink Writers'
// Room. A table of contents with roman numerals, dotted leaders and page numbers lists
// eight chapters; choosing one opens it in a reader pane with its lessons and reading
// times, the chapter's total, an excerpt from the tutor's notes with a drop cap, and
// previous / next chapter links. Use it for writing, literature or any reading-heavy course.

// Design:
// - Paper #f5f0e6 section, ink #141414 text in several opacities, font-serif throughout
//   with small-caps style eyebrows (uppercase, 0.25em tracking) and an asterism ornament
// - Heading text-4xl → md:text-6xl with an italic subtitle; the reader pane is a
//   #fbf8f1 page with a 1px ink/15 border, an inner hairline frame and a soft shadow
// - Contents: roman numeral, title, dotted leader and "p. 21"; the open chapter is italic
//   with an ink bar on the left; excerpt uses first-letter drop-cap classes
// - Chapter changes crossfade with an 8px rise (AnimatePresence mode="wait"; fade only
//   for reduced motion)
// - Mobile: the contents list becomes a labelled <select>; md: 5/7 split; lg: 4/8 split
//   with lessons and excerpt side by side inside the pane

// What it does:
// - chapter state (index, starts on III) is set by the contents buttons (aria-current), the
//   mobile select or the previous / next buttons in the pane footer (disabled at either
//   end); an sr-only aria-live line announces the open chapter
// - Lesson counts and reading times (per chapter and for the whole course) are summed from
//   the data
// - "Begin chapter I free" links to #quill-begin; "Join the spring workshop · £380" to
//   #quill-enrol

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ChapterReaderCourseSyllabus from '@/TestComponent/PageSections/learning/CourseSyllabus04';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <ChapterReaderCourseSyllabus />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const chapters = [
    {
        numeral: 'I',
        title: 'The Opening Line',
        page: 1,
        lessons: [['What a first sentence promises', 12], ['Starting late, leaving early', 14], ['Ten openings, dissected', 18]],
        excerpt: 'The best first lines are not clever; they are inevitable. Read the opening of any story you love and notice how much it withholds — a name without a face, a room without a reason. This week you will write forty first sentences and keep three.',
    },
    {
        numeral: 'II',
        title: 'Character from the Inside',
        page: 9,
        lessons: [['Want versus need', 15], ['The telling detail', 11], ['Interior voice without italics', 13], ['Exercise: the stranger on the train', 20]],
        excerpt: 'A character is not a list of traits but a pattern of choices. Give your person something they want badly and something they would never admit to needing, then put the two in the same room and close the door.',
    },
    {
        numeral: 'III',
        title: 'Setting as Pressure',
        page: 21,
        lessons: [['Weather is a verb', 10], ['Rooms that remember', 12], ['Writing a place you have never been', 16]],
        excerpt: 'Setting is not wallpaper. A heatwave shortens tempers, a small flat makes secrets hard to keep, a long drive forces a conversation. Ask of every place in your draft: what does this room make harder?',
    },
    {
        numeral: 'IV',
        title: 'Dialogue That Moves',
        page: 30,
        lessons: [['Subtext and the unsaid', 14], ['Tags, beats and silence', 9], ['Accents without caricature', 12], ['Exercise: an argument about nothing', 18]],
        excerpt: 'People rarely say what they mean, and almost never in full sentences. Good dialogue is an argument conducted in code — about the dishes, the dog, the weather — while the real subject waits outside.',
    },
    {
        numeral: 'V',
        title: 'Point of View & Distance',
        page: 43,
        lessons: [['Close third, explained', 13], ['The unreliable narrator', 15], ['Second person, sparingly', 8]],
        excerpt: 'Point of view is a camera with a zoom lens. Pull back and you gain a whole street; lean in and you hear a single heartbeat. Most drafts wobble between the two without meaning to.',
    },
    {
        numeral: 'VI',
        title: 'Structure and Time',
        page: 52,
        lessons: [['Scene and summary', 12], ['Flashbacks that earn their place', 14], ['Braided structures', 16], ['Exercise: the reverse outline', 15]],
        excerpt: 'A story is a set of decisions about time: what to slow down, what to skip, and what to reveal only at the end. Outline your draft backwards and you will see which scenes are carrying weight.',
    },
    {
        numeral: 'VII',
        title: 'Revision: The Second Draft',
        page: 65,
        lessons: [['Reading like a stranger', 10], ['Cutting twenty per cent', 12], ['The line edit', 14], ['Peer workshop etiquette', 9]],
        excerpt: 'The first draft tells you what the story is about. The second draft is where you make it look as though you knew all along. Print it, read it aloud, and cut every sentence that only clears its throat.',
    },
    {
        numeral: 'VIII',
        title: 'Sending It Out',
        page: 78,
        lessons: [['Finding the right magazine', 11], ['The cover letter', 7], ['Rejection, and what it means', 10]],
        excerpt: 'Submitting is a practice, not a verdict. Keep a spreadsheet, send to five places at once, and when the no arrives — it will — note the date, open the file, and send the story somewhere new that afternoon.',
    },
]

const chapterMinutes = (chapter) => chapter.lessons.reduce((sum, [, min]) => sum + min, 0)

const formatMinutes = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h ? `${h} h ${m} min` : `${m} min`
}

const totalLessons = chapters.reduce((sum, c) => sum + c.lessons.length, 0)
const totalMinutes = chapters.reduce((sum, c) => sum + chapterMinutes(c), 0)

export function ChapterReaderCourseSyllabus({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [index, setIndex] = useState(2)
    const chapter = chapters[index]
    const prev = chapters[index - 1]
    const next = chapters[index + 1]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f5f0e6] px-4 py-16 font-serif text-base font-normal text-[#141414] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 border-b border-[#141414]/20 pb-10 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-8">
                        <p className="text-xs uppercase tracking-[0.25em] text-[#141414]/60">
                            Quill &amp; Ink Writers’ Room · Course No. 7
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#141414] sm:text-5xl md:text-6xl">
                            The Short Story Workshop
                            <span className="mt-2 block text-2xl italic text-[#141414]/60 sm:text-3xl">
                                Eight chapters, one finished story.
                            </span>
                        </h2>
                    </div>
                    <div className="md:col-span-4">
                        <p className="text-base leading-relaxed text-[#141414]/75">
                            Twelve weeks with the novelist Elena Marsh, a workshop group of nine and a
                            story ready to submit by the last page.
                        </p>
                        <p className="mt-3 text-sm italic text-[#141414]/60">
                            {chapters.length} chapters · {totalLessons} lessons · {formatMinutes(totalMinutes)} of reading
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-12 lg:gap-12">
                    <nav aria-label="Chapters" className="md:col-span-5 lg:col-span-4">
                        <div className="md:hidden">
                            <label htmlFor="quill-chapter" className="text-xs uppercase tracking-[0.25em] text-[#141414]/60">
                                Chapter
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="quill-chapter"
                                    value={index}
                                    className="min-h-12 w-full appearance-none border border-[#141414]/30 bg-[#fbf8f1] pl-4 pr-10 font-serif text-base text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                                    onChange={(event) => setIndex(Number(event.target.value))}
                                >
                                    {chapters.map((c, i) => (
                                        <option key={c.numeral} value={i}>
                                            {c.numeral}. {c.title}
                                        </option>
                                    ))}
                                </select>
                                <HiChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#141414]"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <p className="text-center text-xs uppercase tracking-[0.35em] text-[#141414]/60">Contents</p>
                            <ol className="mt-5">
                                {chapters.map((c, i) => {
                                    const active = i === index
                                    return (
                                        <li key={c.numeral}>
                                            <button
                                                type="button"
                                                aria-current={active ? 'true' : undefined}
                                                className={cn(
                                                    'group flex min-h-11 w-full items-baseline gap-3 border-l-2 py-2 pl-3 pr-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]',
                                                    active ? 'border-[#141414] bg-[#141414]/[0.04]' : 'border-transparent hover:border-[#141414]/30',
                                                )}
                                                onClick={() => setIndex(i)}
                                            >
                                                <span className="w-9 shrink-0 text-sm text-[#141414]/55">{c.numeral}.</span>
                                                <span className={cn('text-base leading-snug text-[#141414]', active && 'italic')}>{c.title}</span>
                                                <span
                                                    className="min-w-4 flex-1 translate-y-[-4px] border-b border-dotted border-[#141414]/35"
                                                    aria-hidden="true"
                                                />
                                                <span className="shrink-0 text-sm tabular-nums text-[#141414]/60">p. {c.page}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ol>
                            <p className="mt-6 text-center text-lg text-[#141414]/40" aria-hidden="true">⁂</p>
                        </div>
                    </nav>

                    <div className="md:col-span-7 lg:col-span-8">
                        <div className="relative border border-[#141414]/15 bg-[#fbf8f1] p-2 shadow-[0_30px_60px_-40px_rgba(20,20,20,0.5)]">
                            <div className="border border-[#141414]/10 p-5 sm:p-8 lg:p-10">
                                <p className="sr-only" aria-live="polite">
                                    Showing chapter {chapter.numeral}: {chapter.title}
                                </p>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.article
                                        key={chapter.numeral}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                                        transition={{ duration: 0.28 }}
                                    >
                                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                                            <p className="text-xs uppercase tracking-[0.3em] text-[#141414]/60">Chapter {chapter.numeral}</p>
                                            <p className="text-sm italic text-[#141414]/60">
                                                {chapter.lessons.length} lessons · {formatMinutes(chapterMinutes(chapter))} reading
                                            </p>
                                        </div>
                                        <h3 className="mt-3 font-serif text-3xl font-normal italic leading-tight text-[#141414] sm:text-4xl lg:text-5xl">
                                            {chapter.title}
                                        </h3>

                                        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.25em] text-[#141414]/55">Lessons</p>
                                                <ol className="mt-3 divide-y divide-[#141414]/10 border-y border-[#141414]/10">
                                                    {chapter.lessons.map(([title, minutes], i) => (
                                                        <li key={title} className="flex items-baseline gap-3 py-3">
                                                            <span className="w-6 shrink-0 text-sm tabular-nums text-[#141414]/45">{i + 1}.</span>
                                                            <span className="flex-1 text-base leading-snug text-[#141414]">{title}</span>
                                                            <span className="shrink-0 text-sm italic tabular-nums text-[#141414]/60">{minutes} min</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                            <figure>
                                                <p className="text-xs uppercase tracking-[0.25em] text-[#141414]/55">From the chapter</p>
                                                <blockquote className="mt-3 text-lg leading-relaxed text-[#141414]/85 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[#141414]">
                                                    {chapter.excerpt}
                                                </blockquote>
                                                <figcaption className="mt-4 text-sm italic text-[#141414]/60">— Elena Marsh, tutor notes</figcaption>
                                            </figure>
                                        </div>
                                    </motion.article>
                                </AnimatePresence>

                                <div className="mt-10 flex flex-col gap-3 border-t border-[#141414]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        disabled={!prev}
                                        className="inline-flex min-h-11 items-center gap-2 text-left text-sm text-[#141414] hover:underline disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                                        onClick={() => setIndex(index - 1)}
                                    >
                                        <HiArrowLongLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
                                        {prev ? `${prev.numeral}. ${prev.title}` : 'Beginning'}
                                        <span className="sr-only"> (previous chapter)</span>
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!next}
                                        className="inline-flex min-h-11 items-center gap-2 text-left text-sm text-[#141414] hover:underline disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] sm:text-right"
                                        onClick={() => setIndex(index + 1)}
                                    >
                                        {next ? `${next.numeral}. ${next.title}` : 'The end'}
                                        <span className="sr-only"> (next chapter)</span>
                                        <HiArrowLongRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <a
                                href="#quill-enrol"
                                className="inline-flex min-h-12 items-center justify-center bg-[#141414] px-7 text-base text-[#f5f0e6] transition-colors hover:bg-[#2b2b2b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
                            >
                                Join the spring workshop · £380
                            </a>
                            <a
                                href="#quill-begin"
                                className="inline-flex min-h-12 items-center justify-center px-4 text-base italic text-[#141414] underline decoration-[#141414]/30 underline-offset-4 hover:decoration-[#141414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
                            >
                                Begin chapter I free
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChapterReaderCourseSyllabus

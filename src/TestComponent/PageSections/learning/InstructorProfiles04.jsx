// RosterLedgerInstructorProfiles

// InstructorProfiles04 · Learning Management Systems › Instructor / Mentor Profiles

// Description:
// A purely typographic tutor roster for the fictional language school Atelier Lingua.
// Under a giant serif "The roster." seven tutors are listed as huge serif names on ruled
// ledger lines, each with the languages they teach as text chips (Français, 日本語, …),
// their city, UTC offset and current local time, and an Open / Waitlist availability dot.
// All / Open / Waitlist filters narrow the list. Use it on a language-school or tutoring
// page where names and availability matter more than photos.

// Design:
// - White background, ink #161616 text, hairline rules at 15% ink; the only colours are
//   the green #1c7c54 "Open" dot (with a motion-safe ping) and a hollow ink ring for
//   "Waitlist"
// - Display serif: heading text-6xl → lg:text-[9rem]; names text-4xl → md:text-6xl →
//   xl:text-7xl with tight leading; they slide right and turn italic on hover;
//   keyboard focus italicises them too
// - Mono index numbers, meta labels and filter counts; language chips are rounded-full
//   hairline pills with native-script labels (lang attribute set per chip)
// - Rows fade/collapse with AnimatePresence + layout when the filter changes (instant for
//   reduced motion)
// - Responsive: mobile rows stack (number + name, then a compact meta line); from md a
//   3-column ledger (3.5rem / name / 15rem meta block); header splits at lg

// What it does:
// - filter state ('all' | 'open' | 'waitlist') set by three aria-pressed buttons with
//   live counts; an aria-live line announces how many tutors are shown
// - now state starts at a fixed 09:00 UTC for a stable server render, then syncs to the
//   real clock on mount and every 30 s (interval cleared on unmount) to show local times
// - Each row links to #tutor-<slug>; "Request a trial lesson" links to
//   #atelier-lingua-trial

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RosterLedgerInstructorProfiles from '@/TestComponent/PageSections/learning/InstructorProfiles04';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <RosterLedgerInstructorProfiles />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const INITIAL_NOW = Date.UTC(2026, 8, 28, 9, 0)

const tutors = [
    {
        id: 'celine-moreau',
        name: 'Céline Moreau',
        focus: 'Conversation & exam prep',
        languages: [
            { label: 'Français', lang: 'fr' },
            { label: 'Italiano', lang: 'it' },
        ],
        city: 'Lyon',
        offset: 2,
        status: 'open',
        note: '3 slots this week',
    },
    {
        id: 'mateo-alvarez',
        name: 'Mateo Álvarez',
        focus: 'Business Spanish',
        languages: [
            { label: 'Español', lang: 'es' },
            { label: 'Português', lang: 'pt' },
        ],
        city: 'Buenos Aires',
        offset: -3,
        status: 'waitlist',
        note: '~2 weeks',
    },
    {
        id: 'yuki-tanaka',
        name: 'Yuki Tanaka',
        focus: 'Absolute beginners, kana to kanji',
        languages: [{ label: '日本語', lang: 'ja' }],
        city: 'Osaka',
        offset: 9,
        status: 'open',
        note: '5 slots this week',
    },
    {
        id: 'friederike-lang',
        name: 'Friederike Lang',
        focus: 'Grammar without tears',
        languages: [
            { label: 'Deutsch', lang: 'de' },
            { label: 'Nederlands', lang: 'nl' },
        ],
        city: 'Hamburg',
        offset: 2,
        status: 'waitlist',
        note: '~3 weeks',
    },
    {
        id: 'amara-nwosu',
        name: 'Amara Nwosu',
        focus: 'IELTS & academic writing',
        languages: [
            { label: 'English', lang: 'en' },
            { label: 'Igbo', lang: 'ig' },
        ],
        city: 'Lagos',
        offset: 1,
        status: 'open',
        note: '2 slots this week',
    },
    {
        id: 'hyejin-park',
        name: 'Hye-jin Park',
        focus: 'K-drama listening club',
        languages: [
            { label: '한국어', lang: 'ko' },
            { label: 'English', lang: 'en' },
        ],
        city: 'Seoul',
        offset: 9,
        status: 'waitlist',
        note: '~1 week',
    },
    {
        id: 'omar-el-sayed',
        name: 'Omar El-Sayed',
        focus: 'Modern Standard & Egyptian',
        languages: [
            { label: 'العربية', lang: 'ar' },
            { label: 'Français', lang: 'fr' },
        ],
        city: 'Cairo',
        offset: 3,
        status: 'open',
        note: '4 slots this week',
    },
]

const filters = [
    { id: 'all', label: 'All tutors' },
    { id: 'open', label: 'Open' },
    { id: 'waitlist', label: 'Waitlist' },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#161616]'

function localTime(now, offset) {
    const minutes = (((Math.floor(now / 60000) + offset * 60) % 1440) + 1440) % 1440
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0')
    const mm = String(minutes % 60).padStart(2, '0')
    return `${hh}:${mm}`
}

function formatOffset(offset) {
    if (offset === 0) return 'UTC'
    return `UTC${offset > 0 ? '+' : '−'}${Math.abs(offset)}`
}

function StatusDot({ status }) {
    if (status === 'open') {
        return (
            <span className="relative inline-flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-[#1c7c54] opacity-60 motion-safe:animate-ping" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#1c7c54]" />
            </span>
        )
    }
    return <span className="h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-[#161616]" aria-hidden="true" />
}

export function RosterLedgerInstructorProfiles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [filter, setFilter] = useState('all')
    const [now, setNow] = useState(INITIAL_NOW)

    useEffect(() => {
        setNow(Date.now())
        const id = window.setInterval(() => setNow(Date.now()), 30000)
        return () => window.clearInterval(id)
    }, [])

    const counts = {
        all: tutors.length,
        open: tutors.filter((tutor) => tutor.status === 'open').length,
        waitlist: tutors.filter((tutor) => tutor.status === 'waitlist').length,
    }
    const visible = filter === 'all' ? tutors : tutors.filter((tutor) => tutor.status === filter)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#161616] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between gap-4 border-y border-[#161616] py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#161616] sm:text-[11px]">
                    <span>Atelier Lingua</span>
                    <span className="hidden sm:inline">Tutor roster — Autumn term 2026</span>
                    <span>No. 07</span>
                </div>

                <div className="mt-10 flex flex-col gap-8 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="font-serif text-6xl font-normal leading-[0.85] tracking-[-0.03em] text-[#161616] sm:text-8xl lg:text-[9rem]">
                            The <em>roster.</em>
                        </h2>
                        <p className="mt-6 max-w-md text-sm leading-relaxed text-[#161616]/70 sm:text-base">
                            Seven native-speaker tutors, each with at least 1,000 teaching hours. Book an
                            open tutor today or join a waitlist; we hold your place for 48 hours.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 lg:items-end">
                        <div role="group" aria-label="Filter tutors by availability" className="flex flex-wrap gap-2">
                            {filters.map((item) => {
                                const isActive = filter === item.id
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => setFilter(item.id)}
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
                                            isActive
                                                ? 'border-[#161616] bg-[#161616] text-white'
                                                : 'border-[#161616]/20 text-[#161616] hover:border-[#161616]',
                                            focusRing,
                                        )}
                                    >
                                        {item.label}
                                        <span
                                            className={cn(
                                                'font-mono text-[11px]',
                                                isActive ? 'text-white/70' : 'text-[#161616]/50',
                                            )}
                                        >
                                            {String(counts[item.id]).padStart(2, '0')}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        <p className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#161616]/60">
                            <span className="inline-flex items-center gap-2">
                                <StatusDot status="open" /> Open
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <StatusDot status="waitlist" /> Waitlist
                            </span>
                        </p>
                    </div>
                </div>

                <p className="sr-only" aria-live="polite">
                    {`Showing ${visible.length} of ${tutors.length} tutors`}
                </p>

                <ol className="mt-10 border-b border-[#161616]/15 lg:mt-14">
                    <AnimatePresence initial={false}>
                        {visible.map((tutor) => {
                            const number = String(tutors.indexOf(tutor) + 1).padStart(2, '0')
                            return (
                                <motion.li
                                    key={tutor.id}
                                    layout={!reduceMotion}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden border-t border-[#161616]/15"
                                >
                                    <a
                                        href={`#tutor-${tutor.id}`}
                                        className={cn(
                                            'group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 gap-y-4 py-6 md:grid-cols-[3.5rem_minmax(0,1fr)_15rem] md:items-center md:gap-x-6 md:py-8',
                                            'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#161616]',
                                        )}
                                    >
                                        <span className="pt-2 font-mono text-xs text-[#161616]/50 md:pt-0 md:text-sm">
                                            {number}
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block font-serif text-4xl leading-[0.95] tracking-[-0.02em] text-[#161616] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:italic group-focus-visible:italic motion-reduce:transition-none sm:text-5xl md:text-6xl xl:text-7xl">
                                                {tutor.name}
                                            </span>
                                            <span className="mt-2 block text-sm text-[#161616]/60">{tutor.focus}</span>
                                        </span>

                                        <span className="col-start-2 flex min-w-0 flex-col gap-3 md:col-start-3">
                                            <span className="flex flex-wrap gap-1.5">
                                                {tutor.languages.map((language) => (
                                                    <span
                                                        key={language.label}
                                                        lang={language.lang}
                                                        className="rounded-full border border-[#161616]/25 px-2.5 py-0.5 text-xs text-[#161616]"
                                                    >
                                                        {language.label}
                                                    </span>
                                                ))}
                                            </span>
                                            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#161616]/70">
                                                <span>
                                                    {tutor.city} · {formatOffset(tutor.offset)}
                                                </span>
                                                <span className="tabular-nums text-[#161616]">
                                                    {localTime(now, tutor.offset)} local
                                                </span>
                                            </span>
                                            <span className="flex items-center justify-between gap-3 text-sm">
                                                <span className="inline-flex items-center gap-2 text-[#161616]">
                                                    <StatusDot status={tutor.status} />
                                                    <span className="font-semibold">
                                                        {tutor.status === 'open' ? 'Open' : 'Waitlist'}
                                                    </span>
                                                    <span className="text-[#161616]/60">· {tutor.note}</span>
                                                </span>
                                                <HiArrowUpRight
                                                    className="h-4 w-4 shrink-0 text-[#161616]/40 transition-colors group-hover:text-[#161616]"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </span>
                                    </a>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </ol>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#161616]/55">
                        Local times update every 30 seconds
                    </p>
                    <a
                        href="#atelier-lingua-trial"
                        className={cn(
                            'group/trial inline-flex min-h-11 items-center gap-3 self-start font-serif text-2xl italic text-[#161616] sm:self-auto',
                            focusRing,
                        )}
                    >
                        Request a trial lesson
                        <HiArrowLongRight
                            className="h-6 w-6 transition-transform group-hover/trial:translate-x-1.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default RosterLedgerInstructorProfiles

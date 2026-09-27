// VoiceNoteTestimonials

// Testimonials04 · Portfolios & Personal Websites › Testimonials / Recommendations

// Description:
// A sketchbook page of voice-note testimonials for illustrator Sam Okafor. Under the
// italic heading "Don’t take my word for it — take theirs." four taped-in cards from an
// art director, an editor, an author and a game studio each show a waveform, a play button
// and a transcript that reveals word by word as the note "plays". Use it on an illustrator
// or artist portfolio where personality matters as much as the praise.

// Design:
// - Lined paper #fffdf6 with #dbe6f3 rules every 36px, a double red #e58f8f margin line and
//   punched holes; content sits right of the margin; cards grid-cols-1 → md:grid-cols-2
// - Blue ink #1c3d94 for all text, bars and buttons, red pen #d0473a for margin notes and
//   doodles; cards are white/85 with a hard ink shadow, pastel washi tape and a ±1° tilt
// - Italic serif "handwriting" for headings, names and transcripts; mono tabular timers; an
//   SVG squiggle underline drawn in with pathLength, plus a hand-drawn arrow and circle
// - Playing notes bounce their waveform bars (framer-motion scaleY loops, off for reduced
//   motion); played bars turn solid ink, transcripts open with a height animation
// - Responsive: base narrow margin (left-8), one column, 22 waveform bars; sm wider margin
//   and all 44 bars; md two tilted columns (22 bars); lg 44 bars plus the "press play"
//   note and arrow doodle beside the heading

// What it does:
// - activeId + positions (ms per note) drive playback: the play button toggles a 100 ms
//   interval (cleared on pause/unmount) that advances the note and stops at its length;
//   only one note plays at a time and a finished note restarts from 0:00
// - The waveform is a keyboard slider (arrows ±2 s, Home/End) and click-to-seek target;
//   transcripts open on first play or via the "Transcript" toggle (aria-expanded)
// - No audio is loaded — playback is a visual simulation; "Commission Sam" links to
//   #contact and "Read 23 more" to #kind-words

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VoiceNoteTestimonials from '@/TestComponent/PageSections/portfolio/Testimonials04';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <VoiceNoteTestimonials />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowPath, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const waveFor = (seed) =>
    Array.from({ length: 44 }, (_, i) => {
        const a = (i * 7 + seed * 13) % 17
        const b = (i * i * 3 + seed * 5) % 11
        const envelope = i < 4 || i > 39 ? 0.55 : 1
        return Math.min(100, Math.round((20 + a * 2.8 + b * 3.6) * envelope))
    })

const notes = [
    {
        id: 'grace',
        name: 'Grace Adeyemi',
        role: 'Art Director, Hollowbrook Press',
        recorded: 'Recorded 12 Feb 2026',
        duration: 38,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        tape: 'bg-[#f3d9a4]/80',
        margin: '14 covers, all early!',
        transcript:
            'Hi, it’s Grace from Hollowbrook. So, Sam has done fourteen covers for us now and every single one came in early. Early! The Lantern Keeper sold out its first print run in three weeks, and honestly I think half of that was the fox on the spine.',
    },
    {
        id: 'tom',
        name: 'Tom Brennan',
        role: 'Features Editor, The Sunday Almanac',
        recorded: 'Recorded 3 Jan 2026',
        duration: 27,
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
        tape: 'bg-[#cfe3d4]/80',
        margin: 'brief at 4pm, print at 9am',
        transcript:
            'Sam draws on deadline better than most people breathe. I’ve sent briefs at four in the afternoon for a nine a.m. print and got back pictures our readers cut out and stick on their fridges.',
    },
    {
        id: 'ruth',
        name: 'Ruth Callaghan',
        role: 'Author, Pip and the Paper Moon',
        recorded: 'Recorded 28 Nov 2025',
        duration: 41,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
        tape: 'bg-[#f2c6c2]/80',
        margin: 'the freckled moon',
        transcript:
            'When I wrote Pip I only had a feeling in my head, and Sam found it. The moon has freckles now, which was never in the manuscript, and it is the part every single child points at during readings.',
    },
    {
        id: 'felix',
        name: 'Felix Wagner',
        role: 'Creative Lead, Kite & Kettle Games',
        recorded: 'Recorded 9 Oct 2025',
        duration: 33,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        tape: 'bg-[#d6d9f2]/80',
        margin: '12 sheets → a whole world',
        transcript:
            'We brought Sam in for twelve character sheets and ended up with a whole world. Sam’s sketchbook literally became the style guide for our game, and the team still calls the fox Sam’s fox.',
    },
].map((note, index) => ({ ...note, bars: waveFor(index + 3), words: note.transcript.split(' ') }))

const clock = (ms) => {
    const total = Math.floor(ms / 1000)
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function VoiceNote({ note, index, playing, position, transcriptOpen, reduceMotion, onToggle, onSeek, onTranscript }) {
    const total = note.duration * 1000
    const progress = Math.min(1, position / total)
    const finished = position >= total
    const tracking = playing || (position > 0 && !finished)
    const heard = tracking ? Math.floor(note.words.length * progress) : note.words.length
    const panelId = `${note.id}-transcript`

    const seekFromPointer = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
        onSeek(Math.round(ratio * total))
    }

    const seekFromKeys = (event) => {
        const steps = { ArrowRight: 2000, ArrowUp: 2000, ArrowLeft: -2000, ArrowDown: -2000 }
        if (event.key in steps) {
            event.preventDefault()
            onSeek(Math.min(total, Math.max(0, position + steps[event.key])))
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            onSeek(event.key === 'Home' ? 0 : total)
        }
    }

    return (
        <li className={cn('relative', index % 2 === 0 ? 'md:-rotate-1' : 'md:mt-10 md:rotate-1')}>
            <span
                aria-hidden="true"
                className={cn(
                    'absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 shadow-sm',
                    note.tape,
                )}
            />
            <article className="relative rounded-[3px] bg-white/85 p-5 shadow-[3px_4px_0_rgba(28,61,148,0.14)] ring-1 ring-[#1c3d94]/10 sm:p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={note.avatar}
                        alt={`Portrait of ${note.name}`}
                        loading="lazy"
                        width={52}
                        height={52}
                        className="size-13 shrink-0 rounded-[48%_52%_45%_55%] border-2 border-[#1c3d94] object-cover p-0.5"
                    />
                    <div className="min-w-0">
                        <p className="font-serif text-xl italic leading-tight text-[#1c3d94]">{note.name}</p>
                        <p className="mt-0.5 text-xs leading-snug text-[#1c3d94]/70">{note.role}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#1c3d94]/50">
                            {note.recorded}
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                    <button
                        type="button"
                        aria-label={`${playing ? 'Pause' : finished ? 'Replay' : 'Play'} voice note from ${note.name}, ${clock(total)}`}
                        className={cn(
                            'grid size-12 shrink-0 place-items-center rounded-full text-[#fffdf6] shadow-[2px_2px_0_#d0473a] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d0473a] motion-reduce:hover:translate-y-0',
                            playing ? 'bg-[#d0473a]' : 'bg-[#1c3d94]',
                        )}
                        onClick={onToggle}
                    >
                        {playing ? (
                            <HiMiniPause aria-hidden="true" className="size-6" />
                        ) : finished ? (
                            <HiArrowPath aria-hidden="true" className="size-5" />
                        ) : (
                            <HiMiniPlay aria-hidden="true" className="ml-0.5 size-6" />
                        )}
                    </button>

                    <div
                        role="slider"
                        tabIndex={0}
                        aria-label={`Seek voice note from ${note.name}`}
                        aria-valuemin={0}
                        aria-valuemax={note.duration}
                        aria-valuenow={Math.floor(position / 1000)}
                        aria-valuetext={`${clock(position)} of ${clock(total)}`}
                        className="flex h-12 min-w-0 flex-1 cursor-pointer items-center gap-[2px] rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d0473a]"
                        onClick={seekFromPointer}
                        onKeyDown={seekFromKeys}
                    >
                        {note.bars.map((height, barIndex) => {
                            const played = (barIndex + 0.5) / note.bars.length <= progress
                            return (
                                <motion.span
                                    key={barIndex}
                                    aria-hidden="true"
                                    animate={
                                        playing && !reduceMotion
                                            ? { scaleY: [1, 0.45, 1.15, 0.8, 1] }
                                            : { scaleY: 1 }
                                    }
                                    transition={
                                        playing && !reduceMotion
                                            ? { duration: 0.9, repeat: Infinity, delay: (barIndex % 9) * 0.07, ease: 'easeInOut' }
                                            : { duration: 0.2 }
                                    }
                                    style={{ height: `${height}%` }}
                                    className={cn(
                                        'min-w-0 flex-1 rounded-full transition-colors duration-200',
                                        barIndex % 2 === 1 && 'max-sm:hidden md:max-lg:hidden',
                                        played ? 'bg-[#1c3d94]' : 'bg-[#1c3d94]/25',
                                    )}
                                />
                            )
                        })}
                    </div>

                    <p className="shrink-0 whitespace-nowrap text-right font-mono text-[11px] tabular-nums text-[#1c3d94]/75">
                        {clock(position)} / {clock(total)}
                    </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <button
                        type="button"
                        aria-expanded={transcriptOpen}
                        aria-controls={panelId}
                        className="inline-flex min-h-10 items-center gap-1.5 font-serif text-base italic text-[#1c3d94] underline decoration-[#1c3d94]/30 decoration-wavy underline-offset-4 hover:decoration-[#d0473a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d0473a]"
                        onClick={onTranscript}
                    >
                        {transcriptOpen ? 'Hide transcript' : 'Transcript'}
                    </button>
                    <p className="-rotate-2 font-serif text-sm italic text-[#d0473a]">↖ {note.margin}</p>
                </div>

                <AnimatePresence initial={false}>
                    {transcriptOpen && (
                        <motion.div
                            key="transcript"
                            id={panelId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <p className="mt-3 border-t border-dashed border-[#1c3d94]/25 pt-4 font-serif text-lg italic leading-relaxed">
                                “
                                {note.words.map((word, wordIndex) => (
                                    <span
                                        key={`${word}-${wordIndex}`}
                                        className={cn(
                                            'transition-colors duration-300',
                                            wordIndex < heard ? 'text-[#1c3d94]' : 'text-[#1c3d94]/30',
                                        )}
                                    >
                                        {word}
                                        {wordIndex < note.words.length - 1 ? ' ' : ''}
                                    </span>
                                ))}
                                ”
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </article>
        </li>
    )
}

export function VoiceNoteTestimonials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [activeId, setActiveId] = useState(null)
    const [positions, setPositions] = useState({})
    const [openIds, setOpenIds] = useState([])

    useEffect(() => {
        if (!activeId) return undefined
        const note = notes.find((item) => item.id === activeId)
        const total = note.duration * 1000
        const id = setInterval(() => {
            setPositions((prev) => ({ ...prev, [activeId]: Math.min(total, (prev[activeId] || 0) + 100) }))
        }, 100)
        return () => clearInterval(id)
    }, [activeId])

    useEffect(() => {
        if (!activeId) return
        const note = notes.find((item) => item.id === activeId)
        if ((positions[activeId] || 0) >= note.duration * 1000) setActiveId(null)
    }, [activeId, positions])

    const toggle = (note) => {
        if (activeId === note.id) {
            setActiveId(null)
            return
        }
        if ((positions[note.id] || 0) >= note.duration * 1000) {
            setPositions((prev) => ({ ...prev, [note.id]: 0 }))
        }
        setOpenIds((prev) => (prev.includes(note.id) ? prev : [...prev, note.id]))
        setActiveId(note.id)
    }

    const toggleTranscript = (id) =>
        setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fffdf6] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_35px,#dbe6f3_35px,#dbe6f3_36px)] py-16 text-base font-normal text-[#1c3d94] md:py-24',
                className,
            )}
            {...props}
        >
            <span aria-hidden="true" className="absolute inset-y-0 left-8 w-px bg-[#e58f8f] sm:left-16 lg:left-24" />
            <span aria-hidden="true" className="absolute inset-y-0 left-9 w-px bg-[#e58f8f]/60 sm:left-[4.25rem] lg:left-[6.25rem]" />
            {['top-[18%]', 'top-1/2', 'top-[82%]'].map((top) => (
                <span
                    key={top}
                    aria-hidden="true"
                    className={cn(
                        'absolute left-2 size-4 -translate-y-1/2 rounded-full bg-[#ece5d3] shadow-[inset_1px_2px_3px_rgba(0,0,0,0.12)] sm:left-5 sm:size-5 lg:left-8',
                        top,
                    )}
                />
            ))}

            <div className="relative mx-auto max-w-7xl pl-14 pr-4 sm:pl-24 sm:pr-8 lg:pl-36 lg:pr-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="font-serif text-sm italic text-[#1c3d94]/70">
                            p. 12 — things people said about Sam Okafor, illustrator
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal italic leading-[1.08] tracking-tight text-[#1c3d94] sm:text-5xl lg:text-6xl">
                            Don’t take my word for it — take{' '}
                            <span className="relative inline-block">
                                theirs.
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 200 20"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-2 left-0 h-3 w-full text-[#d0473a]"
                                >
                                    <motion.path
                                        d="M3 13 C 40 3, 70 19, 110 9 S 170 5, 197 12"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, delay: 0.2, ease: 'easeInOut' }}
                                    />
                                </svg>
                            </span>
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#1c3d94]/80">
                            Four voice notes from people I’ve drawn for. Press play and the transcript
                            follows along — no headphones needed.
                        </p>
                    </div>

                    <div aria-hidden="true" className="hidden items-end gap-2 pb-2 lg:flex">
                        <p className="max-w-[9rem] -rotate-6 font-serif text-lg italic leading-tight text-[#d0473a]">
                            press play, they’re lovely
                        </p>
                        <svg viewBox="0 0 80 90" className="h-20 w-16 text-[#d0473a]">
                            <path
                                d="M8 6 C 40 10, 62 30, 52 78 M38 64 L52 80 L66 62"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                <ul className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
                    {notes.map((note, index) => (
                        <VoiceNote
                            key={note.id}
                            note={note}
                            index={index}
                            playing={activeId === note.id}
                            position={positions[note.id] || 0}
                            transcriptOpen={openIds.includes(note.id)}
                            reduceMotion={reduceMotion}
                            onToggle={() => toggle(note)}
                            onSeek={(ms) => setPositions((prev) => ({ ...prev, [note.id]: ms }))}
                            onTranscript={() => toggleTranscript(note.id)}
                        />
                    ))}
                </ul>

                <div className="mt-14 flex flex-col gap-5 border-t border-dashed border-[#1c3d94]/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-serif text-lg italic text-[#1c3d94]">
                        Booking picture books for{' '}
                        <span className="relative mx-1.5 inline-block px-1">
                            spring 2027
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 140 44"
                                preserveAspectRatio="none"
                                className="pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-[#d0473a]"
                            >
                                <path
                                    d="M20 6 C 70 -2, 136 6, 136 22 C 136 40, 40 44, 10 32 C -4 24, 10 8, 44 5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>{' '}
                        — two slots left.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <a
                            href="#kind-words"
                            className="inline-flex min-h-10 items-center font-serif text-base italic text-[#1c3d94] underline decoration-[#1c3d94]/30 underline-offset-4 hover:decoration-[#1c3d94] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d0473a]"
                        >
                            Read 23 more
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex min-h-11 items-center rounded-full bg-[#1c3d94] px-6 text-sm font-semibold text-[#fffdf6] shadow-[3px_3px_0_#d0473a] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d0473a] motion-reduce:hover:translate-y-0"
                        >
                            Commission Sam
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VoiceNoteTestimonials

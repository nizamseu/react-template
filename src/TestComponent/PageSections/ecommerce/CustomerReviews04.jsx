// VideoTestimonialCustomerReviews

// CustomerReviews04 · E-commerce & Marketplaces › Customer Reviews & UGC

// Description:
// A cinematic wall of video reviews for the night-care brand Nocturne Skin Co., titled
// "Real routines, filmed after dark." Five poster cards (one large feature) show the
// reviewer, product, headline quote and runtime; pressing play marks the card "Playing"
// with animated equalizer bars, letterbox bars, a running progress bar and a caption line
// that changes as the "film" plays. Use it on a skincare/beauty home page or a PDP.

// Design:
// - Grid 1 column → sm:grid-cols-2 (feature spans 2) → lg:grid-cols-4 with the feature
//   card spanning 2×2 and four aspect-[4/5] cards filling the right half
// - Near-black #0d0d0d background, neutral-100 text, amber #f5b700 for the play buttons,
//   status chips, equalizer, progress fill and accent italic; posters sit under a
//   black-to-transparent gradient with rounded-2xl corners
// - Headline font-semibold text-4xl → md:text-6xl with a serif italic amber accent;
//   poster quotes in serif (text-2xl → md:text-4xl on the feature); mono runtimes
// - Playing: black letterbox bars slide in (9% top/bottom), the poster slowly zooms, the
//   equalizer bounces and the idle play ring stops pulsing; reduced motion keeps the
//   state changes but drops zoom, pulse and bar bounce
// - Play buttons are 56px (80px on the feature) and cover the whole card as a hit area

// What it does:
// - playing (state) holds the one card that is "playing"; the card button toggles it
//   (aria-pressed), so starting another card pauses the first.
// - elapsed (state map) counts seconds per card with a 1s interval that is cleared on
//   pause/unmount; paused cards show "Paused · m:ss", and at the end the card resets.
// - The caption line (aria-live) is derived from elapsed; no real video is loaded.
// - Links: "Film your routine" → #submit-film, "See all video reviews" → #video-reviews.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VideoTestimonialCustomerReviews from '@/TestComponent/PageSections/ecommerce/CustomerReviews04';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <VideoTestimonialCustomerReviews />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowUpRight, LuCaptions, LuVideo } from 'react-icons/lu';
import { PiPauseFill, PiPlayFill, PiStarFill } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const films = [
    {
        id: 'leila',
        name: 'Leila Haddad',
        product: 'Night Repair Serum · 8 weeks',
        headline: 'My skin finally looks rested.',
        duration: 134,
        poster: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Woman with long dark hair looking at the camera against a dark backdrop',
        captions: [
            'I work night shifts, so my skin always looked exhausted.',
            'Two drops of the serum, then the balm — that’s the whole routine.',
            'By week three, friends asked if I’d been on holiday.',
            'It’s the only routine I’ve ever actually stuck to.',
        ],
    },
    {
        id: 'marcus',
        name: 'Marcus Bell',
        product: 'Overnight Barrier Balm · 6 weeks',
        headline: 'Winter used to wreck my skin.',
        duration: 72,
        poster: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        alt: 'Man in a dark sweater in soft, moody light',
        captions: [
            'Chicago winters and I do not get along.',
            'A pea-sized amount before bed and no more flaky patches.',
            'The tub lasted me almost three months.',
        ],
    },
    {
        id: 'yuki',
        name: 'Yuki Tanaka',
        product: 'Midnight Clay Mask',
        headline: 'Ten minutes, twice a week.',
        duration: 95,
        poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        alt: 'Woman lit by cool blue light, close-up portrait',
        captions: [
            'I use it Sunday and Wednesday nights.',
            'It doesn’t crack or tighten like other clay masks.',
            'My pores look smaller the next morning — genuinely.',
        ],
    },
    {
        id: 'ana',
        name: 'Ana Ruiz, esthetician',
        product: 'Why I recommend the serum',
        headline: 'I use it in my own studio.',
        duration: 161,
        poster: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        alt: 'Client receiving a facial treatment in a spa studio',
        captions: [
            'I see a lot of over-exfoliated skin in my clinic.',
            'This serum repairs rather than strips.',
            'Fragrance-free, which matters for my sensitive clients.',
            'I send most of my clients home with it.',
        ],
    },
    {
        id: 'sienna',
        name: 'Sienna Brooks',
        product: 'Night Repair Serum · 12 weeks',
        headline: 'Sensitive skin, zero redness.',
        duration: 58,
        poster: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        alt: 'Young woman in a hooded denim jacket outdoors',
        captions: [
            'Everything used to make my cheeks flare up.',
            'Twelve weeks in, not a single reaction.',
        ],
    },
]

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function Equalizer({ reduce }) {
    const heights = [0.9, 0.55, 1, 0.7]

    return (
        <span aria-hidden="true" className="flex h-3.5 items-end gap-[2px]">
            {heights.map((h, i) => (
                <motion.span
                    key={i}
                    className="h-full w-[3px] origin-bottom rounded-full bg-[#f5b700]"
                    initial={{ scaleY: h }}
                    animate={reduce ? { scaleY: h } : { scaleY: [h * 0.3, h, h * 0.45, h * 0.9, h * 0.3] }}
                    transition={
                        reduce
                            ? { duration: 0 }
                            : { duration: 0.8 + i * 0.17, repeat: Infinity, ease: 'easeInOut' }
                    }
                />
            ))}
        </span>
    )
}

export function VideoTestimonialCustomerReviews({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [playing, setPlaying] = useState(null)
    const [elapsed, setElapsed] = useState({})
    const reduce = useReducedMotion()

    useEffect(() => {
        if (!playing) return undefined
        const timer = setInterval(() => {
            setElapsed((prev) => ({ ...prev, [playing]: (prev[playing] || 0) + 1 }))
        }, 1000)
        return () => clearInterval(timer)
    }, [playing])

    useEffect(() => {
        const film = films.find((f) => f.id === playing)
        if (film && (elapsed[film.id] || 0) >= film.duration) {
            setPlaying(null)
            setElapsed((prev) => ({ ...prev, [film.id]: 0 }))
        }
    }, [elapsed, playing])

    const toggle = (id) => setPlaying((current) => (current === id ? null : id))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0d0d0d] px-4 py-16 text-neutral-100 antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,183,0,0.12),transparent_70%)]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5b700]">
                            <LuVideo aria-hidden="true" className="h-4 w-4" />
                            Nocturne Skin Co. — Customer films
                        </p>
                        <h2 className="mt-5 max-w-3xl text-4xl leading-[1.02] font-semibold tracking-tight sm:text-5xl md:text-6xl text-neutral-100">
                            Real routines, filmed{' '}
                            <em className="font-serif font-normal text-[#f5b700]">after dark.</em>
                        </h2>
                    </div>
                    <div className="max-w-xs md:text-right">
                        <p className="flex items-center gap-2 text-sm text-neutral-400 md:justify-end">
                            <PiStarFill aria-hidden="true" className="h-4 w-4 text-[#f5b700]" />
                            <span>
                                <span className="font-semibold text-neutral-100">4.8</span> across 2,316
                                unscripted video reviews
                            </span>
                        </p>
                        <a
                            href="#submit-film"
                            className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-700 px-5 text-sm font-medium transition-colors hover:border-[#f5b700] hover:text-[#f5b700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5b700]"
                        >
                            Film your routine
                            <LuArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
                    {films.map((film, i) => {
                        const feature = i === 0
                        const isPlaying = playing === film.id
                        const t = elapsed[film.id] || 0
                        const isPaused = !isPlaying && t > 0
                        const progress = Math.min(1, t / film.duration)
                        const captionIndex = Math.min(
                            film.captions.length - 1,
                            Math.floor(progress * film.captions.length),
                        )
                        const showCaption = isPlaying || isPaused

                        return (
                            <li
                                key={film.id}
                                className={cn(
                                    'group relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition-shadow duration-500',
                                    feature && 'sm:col-span-2 lg:row-span-2',
                                    isPlaying && 'ring-[#f5b700]/60 shadow-[0_0_60px_-20px_rgba(245,183,0,0.5)]',
                                )}
                            >
                                <div
                                    className={cn(
                                        'relative w-full',
                                        feature
                                            ? 'aspect-[4/5] sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto'
                                            : 'aspect-[4/5]',
                                    )}
                                >
                                    <motion.img
                                        src={film.poster}
                                        alt={film.alt}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover"
                                        animate={{ scale: isPlaying && !reduce ? 1.08 : 1 }}
                                        transition={{ duration: isPlaying ? 10 : 0.8, ease: 'easeOut' }}
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40"
                                    />
                                    <motion.span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-black"
                                        initial={false}
                                        animate={{ height: isPlaying ? '9%' : '0%' }}
                                        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                    <motion.span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-black"
                                        initial={false}
                                        animate={{ height: isPlaying ? '9%' : '0%' }}
                                        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />

                                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 sm:p-4">
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium backdrop-blur-md',
                                                isPlaying
                                                    ? 'bg-[#f5b700]/15 text-[#f5b700] ring-1 ring-[#f5b700]/40'
                                                    : 'bg-black/50 text-neutral-200',
                                            )}
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <Equalizer reduce={reduce} />
                                                    Playing
                                                </>
                                            ) : isPaused ? (
                                                `Paused · ${formatTime(t)}`
                                            ) : (
                                                formatTime(film.duration)
                                            )}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-neutral-300 backdrop-blur-md">
                                            <LuCaptions aria-hidden="true" className="h-3.5 w-3.5" />
                                            CC
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        aria-pressed={isPlaying}
                                        aria-label={`Play video review from ${film.name}`}
                                        className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#f5b700]"
                                        onClick={() => toggle(film.id)}
                                    >
                                        <span
                                            className={cn(
                                                'relative flex items-center justify-center rounded-full bg-[#f5b700] text-black shadow-[0_10px_40px_-8px_rgba(245,183,0,0.6)] transition-all duration-300 group-hover:scale-110',
                                                feature ? 'h-20 w-20' : 'h-14 w-14',
                                                isPlaying && 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                                            )}
                                        >
                                            {!isPlaying && !reduce && (
                                                <motion.span
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-full border-2 border-[#f5b700]"
                                                    animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                                                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                                                />
                                            )}
                                            {isPlaying ? (
                                                <PiPauseFill aria-hidden="true" className={feature ? 'h-8 w-8' : 'h-6 w-6'} />
                                            ) : (
                                                <PiPlayFill
                                                    aria-hidden="true"
                                                    className={cn('translate-x-[2px]', feature ? 'h-8 w-8' : 'h-6 w-6')}
                                                />
                                            )}
                                        </span>
                                    </button>

                                    <div
                                        className={cn(
                                            'pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5',
                                            feature && 'md:p-8',
                                        )}
                                    >
                                        <div aria-live="polite" className="min-h-0">
                                            <AnimatePresence mode="wait">
                                                {showCaption && (
                                                    <motion.p
                                                        key={`${film.id}-${captionIndex}`}
                                                        initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className={cn(
                                                            'mx-auto mb-3 w-fit max-w-[95%] rounded bg-black/80 px-2 py-1 text-center text-white',
                                                            feature ? 'text-sm md:text-base' : 'text-xs',
                                                        )}
                                                    >
                                                        {film.captions[captionIndex]}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <p
                                            className={cn(
                                                'font-serif leading-tight text-white',
                                                feature ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-lg',
                                            )}
                                        >
                                            “{film.headline}”
                                        </p>
                                        <p className="mt-2 text-xs text-neutral-400 sm:text-sm">
                                            <span className="font-semibold text-neutral-100">{film.name}</span>
                                            {' · '}
                                            {film.product}
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
                                                <span
                                                    className="absolute inset-y-0 left-0 rounded-full bg-[#f5b700] transition-[width] duration-1000 ease-linear"
                                                    style={{ width: `${progress * 100}%` }}
                                                />
                                            </span>
                                            <span className="font-mono text-[11px] text-neutral-400 tabular-nums">
                                                {formatTime(t)} / {formatTime(film.duration)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center">
                    <p>Every film is from a verified customer and published unedited, with their permission.</p>
                    <a
                        href="#video-reviews"
                        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-[#f5b700] underline decoration-[#f5b700]/30 underline-offset-4 hover:decoration-[#f5b700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5b700]"
                    >
                        See all video reviews
                    </a>
                </div>
            </div>
        </section>
    )
}

export default VideoTestimonialCustomerReviews

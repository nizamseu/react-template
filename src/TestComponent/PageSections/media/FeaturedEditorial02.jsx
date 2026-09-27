// FullBleedCoverFeaturedEditorial

// FeaturedEditorial02 · Blogs & Digital Media › Breaking News / Featured Editorial

// Description:
// A magazine-cover lead for the fictional travel weekly Atlas Weekend. A full-bleed photo of
// Ha Long Bay carries the huge serif headline "The slow boat through a drowned mountain range"
// bottom-left, with the issue number, "22 min read", a "Read the cover story" button and a
// narration toggle; below the fold, "Also in this issue" shows two related stories. Use it
// as the opening section of a long-read or weekend-edition page.

// Design:
// - Black #0a0a0a canvas, white type and saffron #e9c46a accents (kicker, CTA, outlined issue
//   numerals, numbering, focus rings); the photo sits under bottom and left black gradients
// - Cover is min-h 620px → sm:720px → lg:820px; the headline scales with
//   clamp(2.6rem, 8vw, 7.25rem) in serif at leading-[0.92]; the "118" issue numerals are
//   outlined with -webkit-text-stroke and only appear from md up
// - Top bar: spaced wordmark, "Issue No. 118 · Autumn 2026" and a round bookmark toggle;
//   meta row wraps under the headline on mobile
// - Related stories: md:grid-cols-2 cards with 4:3 photos, saffron "02" / "03" numbers,
//   serif headlines and a hairline top border; photos zoom slightly on hover
// - Motion: the cover photo drifts down (parallax via useScroll + useTransform) and the
//   headline block rises in on mount; both are switched off for reduced motion

// What it does:
// - Bookmark button toggles saved state (aria-pressed, label "Save" / "Saved")
// - "Listen · 31 min" toggles a visual-only narration state: the label becomes "Pause
//   narration" and a four-bar equaliser animates (static bars with reduced motion)
// - "Read the cover story" links to #atlas-weekend-cover, "Also in this issue" jumps to
//   #atlas-weekend-related and each related card links to #atlas-weekend-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FullBleedCoverFeaturedEditorial from '@/TestComponent/PageSections/media/FeaturedEditorial02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <FullBleedCoverFeaturedEditorial />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowDown, HiArrowLongRight, HiBookmark, HiOutlineBookmark, HiPause, HiPlay } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const related = [
    {
        id: 'kyoto',
        number: '02',
        kicker: 'Japan · Dispatch',
        title: 'Kyoto after the tour buses leave',
        dek: 'At 6 pm the lanes of Higashiyama empty out. Our writer stayed for the lanterns, the last tofu shop and a monk who keeps a jazz collection.',
        meta: 'Words by Aiko Tanabe · 14 min read',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
        alt: 'Narrow Kyoto street leading to a five-storey wooden pagoda',
    },
    {
        id: 'venice',
        number: '03',
        kicker: 'Italy · Essay',
        title: 'Venice in November belongs to the people who stay',
        dek: 'Fog, acqua alta and half-price vaporetto passes: a season when the city quietly returns to its 49,000 residents.',
        meta: 'Words by Luca Ferrante · 11 min read',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1000&q=80',
        alt: 'The Rialto bridge over the Grand Canal in Venice with gondolas below',
    },
]

const bars = [
    { id: 'a', heights: ['30%', '100%', '45%'] },
    { id: 'b', heights: ['80%', '35%', '90%'] },
    { id: 'c', heights: ['50%', '85%', '25%'] },
    { id: 'd', heights: ['95%', '40%', '70%'] },
]

export function FullBleedCoverFeaturedEditorial({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const coverRef = useRef(null)
    const [saved, setSaved] = useState(false)
    const [listening, setListening] = useState(false)

    const { scrollYProgress } = useScroll({ target: coverRef, offset: ['start start', 'end start'] })
    const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0a0a0a] text-base font-normal text-white', className)}
            {...props}
        >
            <div ref={coverRef} className="relative isolate flex min-h-[620px] flex-col overflow-hidden sm:min-h-[720px] lg:min-h-[820px]">
                <motion.img
                    src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80"
                    alt="Wooden junk boats anchored among the limestone karst towers of Ha Long Bay"
                    style={reduceMotion ? undefined : { y: photoY, scale: 1.12 }}
                    className="absolute inset-0 -z-20 size-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/45 to-[#0a0a0a]/20" />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a0a0a]/70 via-transparent to-transparent" />

                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-6 sm:px-6 lg:px-8">
                    <p className="font-serif text-lg font-semibold uppercase tracking-[0.35em] text-white sm:text-xl">
                        Atlas <span className="italic tracking-[0.2em] text-[#e9c46a]">Weekend</span>
                    </p>
                    <div className="flex items-center gap-3 sm:gap-5">
                        <p className="hidden text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75 sm:block">
                            Issue No. 118 · Autumn 2026
                        </p>
                        <button
                            type="button"
                            aria-pressed={saved}
                            aria-label={saved ? 'Remove cover story from saved' : 'Save cover story'}
                            className={cn(
                                'flex size-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c46a]',
                                saved
                                    ? 'border-[#e9c46a] bg-[#e9c46a] text-[#0a0a0a]'
                                    : 'border-white/40 bg-[#0a0a0a]/30 text-white backdrop-blur hover:border-white',
                            )}
                            onClick={() => setSaved((value) => !value)}
                        >
                            {saved ? (
                                <HiBookmark aria-hidden="true" className="size-5" />
                            ) : (
                                <HiOutlineBookmark aria-hidden="true" className="size-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-20 hidden text-right md:block lg:right-8 lg:top-24"
                >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#e9c46a]">No.</p>
                    <p className="font-serif text-[9rem] font-bold leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_#e9c46a] lg:text-[12rem]">
                        118
                    </p>
                </div>

                <div className="mx-auto mt-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-5xl"
                    >
                        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#e9c46a]">
                            <span aria-hidden="true" className="h-px w-10 bg-[#e9c46a]" />
                            Cover story · Vietnam
                        </p>
                        <h2 className="mt-5 font-serif text-[clamp(2.6rem,8vw,7.25rem)] font-normal leading-[0.92] tracking-tight text-white">
                            The slow boat through a <em className="text-[#e9c46a]">drowned</em> mountain range
                        </h2>
                        <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-white/80 sm:text-xl">
                            Three nights aboard a 1950s junk in Ha Long Bay, where 1,969 limestone islands rise out
                            of jade water and the only schedule is the tide.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            <span>Words by Mireille Duval</span>
                            <span>Photographs by Kenji Arai</span>
                            <span className="text-[#e9c46a]">22 min read</span>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="#atlas-weekend-cover"
                                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e9c46a] px-6 text-sm font-bold text-[#0a0a0a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c46a]"
                            >
                                Read the cover story
                                <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                            <button
                                type="button"
                                aria-pressed={listening}
                                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/40 bg-[#0a0a0a]/30 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c46a]"
                                onClick={() => setListening((value) => !value)}
                            >
                                {listening ? (
                                    <HiPause aria-hidden="true" className="size-4 text-[#e9c46a]" />
                                ) : (
                                    <HiPlay aria-hidden="true" className="size-4 text-[#e9c46a]" />
                                )}
                                {listening ? 'Pause narration' : 'Listen · 31 min'}
                                <span aria-hidden="true" className="flex h-4 w-5 items-end gap-[3px]">
                                    {bars.map((bar) => (
                                        <motion.span
                                            key={bar.id}
                                            className="w-[3px] rounded-full bg-[#e9c46a]"
                                            style={{ height: '35%' }}
                                            animate={
                                                listening && !reduceMotion
                                                    ? { height: bar.heights }
                                                    : { height: listening ? bar.heights[1] : '35%' }
                                            }
                                            transition={
                                                listening && !reduceMotion
                                                    ? { duration: 0.9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
                                                    : { duration: 0.2 }
                                            }
                                        />
                                    ))}
                                </span>
                            </button>
                        </div>
                    </motion.div>

                    <a
                        href="#atlas-weekend-related"
                        className="mt-12 inline-flex min-h-10 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 hover:text-[#e9c46a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c46a]"
                    >
                        <HiArrowDown aria-hidden="true" className="size-4" />
                        Also in this issue
                    </a>
                </div>
            </div>

            <div id="atlas-weekend-related" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-6">
                    <h3 className="font-serif text-3xl font-normal italic text-white sm:text-4xl">Also in this issue</h3>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                        2 more stories · 25 min
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
                    {related.map((story) => (
                        <article key={story.id}>
                            <a
                                href={`#atlas-weekend-${story.id}`}
                                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9c46a]"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                                    <img
                                        src={story.image}
                                        alt={story.alt}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                </div>
                                <div className="mt-6 flex gap-5">
                                    <span className="font-serif text-4xl italic leading-none text-[#e9c46a] sm:text-5xl">
                                        {story.number}
                                    </span>
                                    <div className="min-w-0 border-t border-white/20 pt-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
                                            {story.kicker}
                                        </p>
                                        <h4 className="mt-2 font-serif text-2xl font-normal leading-tight text-white decoration-[#e9c46a] decoration-1 underline-offset-[6px] group-hover:underline sm:text-3xl">
                                            {story.title}
                                        </h4>
                                        <p className="mt-3 text-sm leading-relaxed text-white/70">{story.dek}</p>
                                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e9c46a]">
                                            {story.meta}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FullBleedCoverFeaturedEditorial

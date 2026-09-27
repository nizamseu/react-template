// KineticTypeFeaturedEditorial

// FeaturedEditorial05 · Blogs & Digital Media › Breaking News / Featured Editorial

// Description:
// A loud, poster-like cover story for the fictional culture magazine LOUD. The giant headline
// "The kids run the night now." drops in letter by letter, a lime "Cover story" sticker and a
// spinning "The Night Issue" roundel sit on top, and three jagged photo cut-outs from the club
// scene tilt around the dek, byline and "Read the story" button, followed by an "Also in
// Issue 31" strip. Use it to open a culture, music or nightlife feature.

// Design:
// - Black #050505 background, white type, acid lime #c8ff00 for the sticker, roundel, the
//   word "night", numbering, CTA and focus rings
// - Headline: uppercase font-black at clamp(3.4rem, 14.5vw, 12.5rem), leading-[0.84],
//   tight tracking; each word is a clip mask and each letter a motion span
// - Cut-outs: photos with jagged clip-path edges on lime or white backing shapes, rotated
//   -7° / 5° / -3°; they overlap in a row under the headline on mobile and form a cluster
//   beside the dek from lg up
// - "Also in Issue 31": 1 → md:3 columns split by white/15 rules, lime mono numbers
// - Motion: letters rise out of their masks with a 30 ms stagger when the headline is 25% in
//   view (useInView, once); the roundel spins every 18 s; cut-outs drift at different speeds
//   on scroll and straighten on hover. Reduced motion shows everything static.

// What it does:
// - The "Replay" button remounts the headline to run the letter animation again (hidden when
//   reduced motion is on)
// - The headline keeps its full text in an sr-only span; the animated letters are aria-hidden
// - "Read the story" links to #loud-cover-story and issue items to #loud-<id>; the sticker,
//   roundel and cut-out motion are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import KineticTypeFeaturedEditorial from '@/TestComponent/PageSections/media/FeaturedEditorial05';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <KineticTypeFeaturedEditorial />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowLongRight, HiArrowPath } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const HEADLINE = ['The', 'kids', 'run', 'the', 'night', 'now.']

const JAGGED =
    'polygon(0% 3%, 6% 0%, 14% 2%, 22% 0%, 31% 3%, 40% 0%, 49% 2%, 58% 0%, 67% 3%, 76% 0%, 85% 2%, 93% 0%, 100% 3%, 98% 12%, 100% 22%, 97% 33%, 100% 44%, 98% 55%, 100% 66%, 97% 77%, 100% 88%, 98% 97%, 91% 100%, 82% 97%, 73% 100%, 64% 98%, 55% 100%, 46% 97%, 37% 100%, 28% 98%, 19% 100%, 10% 97%, 2% 100%, 0% 91%, 3% 80%, 0% 69%, 2% 58%, 0% 47%, 3% 36%, 0% 25%, 2% 14%)'

const cutouts = [
    {
        id: 'stage',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
        alt: 'Performer on a smoky stage lit from behind',
        caption: 'Warehouse 9, 02:14',
        rotate: -7,
        backing: 'bg-[#c8ff00]',
        size: 'w-32 sm:w-44 lg:w-56',
        offset: 'lg:absolute lg:right-[46%] lg:top-6',
        speed: 70,
    },
    {
        id: 'crowd',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
        alt: 'Crowd with raised hands under bright concert lights',
        caption: 'Floor, 03:40',
        rotate: 5,
        backing: 'bg-white',
        size: 'w-28 sm:w-40 lg:w-60',
        offset: '-ml-8 mt-10 lg:absolute lg:right-[12%] lg:top-0 lg:m-0',
        speed: -50,
    },
    {
        id: 'street',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        alt: 'Neon-lit city street at night crowded with signs',
        caption: 'Outside, 05:05',
        rotate: -3,
        backing: 'bg-[#c8ff00]',
        size: 'w-28 sm:w-40 lg:w-48',
        offset: '-ml-8 mt-2 lg:absolute lg:bottom-0 lg:right-[30%] lg:m-0',
        speed: 35,
    },
]

const issueItems = [
    { id: 'record-shop', title: 'The last 24-hour record shop in Osaka', meta: 'Music · 9 min' },
    { id: 'door-policy', title: 'Inside the door policy that saved a scene', meta: 'Clubs · 12 min' },
    { id: 'sunrise-set', title: 'Why every great set ends at sunrise', meta: 'Essay · 6 min' },
]

function KineticHeadline({ reduceMotion }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.25 })
    let letterIndex = 0

    return (
        <h2
            ref={ref}
            className="font-sans text-[clamp(3.4rem,14.5vw,12.5rem)] font-black uppercase leading-[0.84] tracking-[-0.045em] text-white"
        >
            <span className="sr-only">{HEADLINE.join(' ')}</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.22em]">
                {HEADLINE.map((word, wordIndex) => (
                    <span
                        key={`${word}-${wordIndex}`}
                        className={cn(
                            '-mb-[0.1em] inline-flex overflow-hidden pb-[0.1em]',
                            word === 'night' && 'italic text-[#c8ff00]',
                        )}
                    >
                        {word.split('').map((letter, i) => {
                            const delay = letterIndex++ * 0.03
                            return (
                                <motion.span
                                    key={`${word}-${i}`}
                                    className="inline-block origin-bottom-left"
                                    initial={reduceMotion ? false : { y: '105%', rotate: 12 }}
                                    animate={inView || reduceMotion ? { y: '0%', rotate: 0 } : undefined}
                                    transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {letter}
                                </motion.span>
                            )
                        })}
                    </span>
                ))}
            </span>
        </h2>
    )
}

function Cutout({ item, progress, reduceMotion }) {
    const y = useTransform(progress, [0, 1], [item.speed, -item.speed])

    return (
        <motion.figure
            style={reduceMotion ? { rotate: item.rotate } : { y, rotate: item.rotate }}
            whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className={cn('relative shrink-0', item.size, item.offset)}
        >
            <div aria-hidden="true" className={cn('absolute inset-0 translate-x-2 translate-y-2', item.backing)} style={{ clipPath: JAGGED }} />
            <div className="relative aspect-[4/5] overflow-hidden bg-white/10" style={{ clipPath: JAGGED }}>
                <img src={item.image} alt={item.alt} loading="lazy" className="size-full object-cover" />
            </div>
            <figcaption className="absolute -bottom-3 left-3 bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#050505]">
                {item.caption}
            </figcaption>
        </motion.figure>
    )
}

export function KineticTypeFeaturedEditorial({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [playKey, setPlayKey] = useState(0)
    const wrapperRef = useRef(null)
    const pathId = `loud-roundel-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start end', 'end start'] })

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#050505] py-14 text-base font-normal text-white md:py-20', className)}
            {...props}
        >
            <div ref={wrapperRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
                    <p className="font-sans text-3xl font-black italic tracking-tighter text-white">
                        LOUD<span className="text-[#c8ff00]">.</span>
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
                        Issue 31 · The Night Issue · October 2026
                    </p>
                </div>

                <div className="relative mt-10 md:mt-14">
                    <div className="mb-6 inline-flex -rotate-3 items-center gap-2 border-2 border-[#050505] bg-[#c8ff00] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-[0.2em] text-[#050505] shadow-[4px_4px_0_0_#ffffff]">
                        <span aria-hidden="true">✦</span>
                        Cover story / Nightlife
                    </div>

                    <motion.div
                        aria-hidden="true"
                        className="absolute -top-6 right-0 hidden size-32 sm:block md:size-40 lg:-top-10 lg:size-44"
                        animate={reduceMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    >
                        <svg viewBox="0 0 200 200" className="size-full">
                            <circle cx="100" cy="100" r="98" fill="#c8ff00" />
                            <path id={pathId} d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" fill="none" />
                            <text className="fill-[#050505] font-mono text-[15px] font-bold uppercase tracking-[0.16em]">
                                <textPath href={`#${pathId}`}>LOUD ★ Issue 31 ★ The Night Issue ★</textPath>
                            </text>
                            <text x="100" y="116" textAnchor="middle" className="fill-[#050505] font-sans text-[44px] font-black italic">
                                31
                            </text>
                        </svg>
                    </motion.div>

                    <KineticHeadline key={playKey} reduceMotion={reduceMotion} />
                </div>

                <div className="relative mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:min-h-[420px] lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <p className="text-xl font-medium leading-snug text-white sm:text-2xl">
                            From Lagos to Leipzig, a generation born after the smoking ban is rebuilding club culture on
                            its own terms: sober rooms, phone-free floors and 6 am breakfasts.
                        </p>
                        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                            Words <span className="text-white">Dara Nwosu</span> · Photos{' '}
                            <span className="text-white">Kit Marlow</span> · 18 min read
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="#loud-cover-story"
                                className="group inline-flex min-h-12 items-center gap-3 bg-[#c8ff00] px-6 font-mono text-sm font-bold uppercase tracking-[0.15em] text-[#050505] shadow-[4px_4px_0_0_#ffffff] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8ff00] motion-reduce:transition-none"
                            >
                                Read the story
                                <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                            </a>
                            {!reduceMotion && (
                                <button
                                    type="button"
                                    className="inline-flex min-h-12 items-center gap-2 border border-white/30 px-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-[#c8ff00] hover:text-[#c8ff00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8ff00]"
                                    onClick={() => setPlayKey((value) => value + 1)}
                                >
                                    <HiArrowPath aria-hidden="true" className="size-4" />
                                    Replay
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start justify-center pb-4 sm:justify-start lg:relative lg:col-span-7 lg:block lg:pb-0">
                        {cutouts.map((item) => (
                            <Cutout key={item.id} item={item} progress={scrollYProgress} reduceMotion={reduceMotion} />
                        ))}
                    </div>
                </div>

                <div className="mt-16 border-t border-white/15 pt-6">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#c8ff00]">Also in Issue 31</h3>
                    <ul className="mt-4 grid grid-cols-1 md:grid-cols-3">
                        {issueItems.map((item, index) => (
                            <li
                                key={item.id}
                                className={cn(
                                    'border-white/15',
                                    index > 0 && 'border-t md:border-l md:border-t-0 md:pl-6',
                                    index < issueItems.length - 1 && 'md:pr-6',
                                )}
                            >
                                <a
                                    href={`#loud-${item.id}`}
                                    className="group flex min-h-16 items-start gap-4 py-4 focus-visible:outline-2 focus-visible:outline-[#c8ff00]"
                                >
                                    <span className="font-mono text-sm font-bold text-[#c8ff00]">0{index + 1}</span>
                                    <span className="min-w-0">
                                        <span className="block text-lg font-bold leading-snug text-white decoration-[#c8ff00] decoration-2 underline-offset-4 group-hover:underline">
                                            {item.title}
                                        </span>
                                        <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
                                            {item.meta}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default KineticTypeFeaturedEditorial

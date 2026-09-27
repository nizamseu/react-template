// LayeredCollageAboutStory

// AboutStory05 · Corporate & Business › About Us / Story

// Description:
// A warm, scrapbook-style company story for Tidewater Foods, an Atlantic-coast food maker
// founded in 1985. Three overlapping, taped-down photo prints (the farms, the kitchen, the
// team) sit beside the headline "Good food starts where the tide comes in.", a short origin
// story and three stats: 3 countries, 1,200 people, 41 years. Use it on the about page of a
// food, hospitality or family-run consumer brand that wants to feel human.

// Design:
// - Warm white #fbf7f0 section, espresso ink #2a1a14, tomato #e4572e for tape, headline
//   accent, stats and CTA; blush #f7dccf chips; prints have white borders and soft shadows
// - Collage: aspect-[10/11] frame (max 36rem) with three absolutely placed prints rotated
//   -7°, 6° and -2°, each with a handwritten-style serif caption and a strip of tomato tape;
//   a rotating "Tidewater Foods · Since 1985" sticker overlaps the corner
// - Heavy sans headline (text-4xl → lg:text-6xl) with a hand-drawn SVG underline that draws
//   in view; stats in extra-bold tabular numerals divided by dashed rules
// - Responsive: base stacks collage above the story; lg splits 1.05fr / 1fr; stats stay in
//   3 columns at every width; chips wrap

// What it does:
// - order (array of photo ids) decides stacking: hovering, focusing or clicking a print, or
//   pressing its chip ("The farms" / "The kitchen" / "The team", aria-pressed), brings it
//   to the front, where it straightens and scales up slightly
// - Each print drifts vertically at its own rate while the collage scrolls (useScroll +
//   useTransform); parallax, the sticker spin and the underline draw are off for reduced motion
// - "Meet our growers" links to #tidewater-growers, "Read the sourcing charter" to
//   #tidewater-charter

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LayeredCollageAboutStory from '@/TestComponent/PageSections/corporate/AboutStory05';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <LayeredCollageAboutStory />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const photos = [
    {
        id: 'farm',
        label: 'The farms',
        caption: 'Dawn market, Vigo',
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80',
        alt: 'Market stall piled high with fresh peppers, squash, greens and fruit',
        position: 'left-0 top-[5%] w-[58%]',
        aspect: 'aspect-[4/5]',
        rotate: -7,
        drift: 36,
        tape: 'left-1/2 -top-3 -translate-x-1/2 -rotate-6',
    },
    {
        id: 'kitchen',
        label: 'The kitchen',
        caption: 'Test kitchen, Porto',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
        alt: 'Chef slicing green chillies on a white chopping board next to mushrooms and salmon',
        position: 'right-0 top-0 w-[47%]',
        aspect: 'aspect-[3/4]',
        rotate: 6,
        drift: -28,
        tape: '-right-4 top-4 rotate-45',
    },
    {
        id: 'team',
        label: 'The team',
        caption: 'Friday lunch, Nantes',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
        alt: 'Colleagues laughing around a long table of shared food and drinks',
        position: 'bottom-[2%] left-[13%] w-[68%]',
        aspect: 'aspect-[4/3]',
        rotate: -2,
        drift: 18,
        tape: '-left-5 top-6 -rotate-45',
    },
]

const stats = [
    { value: '3', label: 'Countries', note: 'Spain · Portugal · France' },
    { value: '1,200', label: 'People', note: 'In 9 kitchens & 4 depots' },
    { value: '41', label: 'Years', note: 'Cooking since 1985' },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4572e]'

function Print({ photo, zIndex, isFront, progress, reduceMotion, onFront }) {
    const y = useTransform(progress, [0, 1], [photo.drift, -photo.drift])

    return (
        <motion.button
            type="button"
            className={cn('absolute cursor-pointer rounded-[3px] text-left', photo.position, focusRing)}
            style={{ zIndex, y: reduceMotion ? 0 : y }}
            initial={false}
            animate={{ rotate: isFront ? photo.rotate / 3 : photo.rotate, scale: isFront ? 1.03 : 1 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 18 }}
            onMouseEnter={onFront}
            onFocus={onFront}
            onClick={onFront}
        >
            <span
                className={cn(
                    'block bg-white p-2 pb-9 transition-shadow duration-300 sm:p-2.5 sm:pb-11',
                    isFront
                        ? 'shadow-[0_30px_50px_-20px_rgba(42,26,20,0.55)]'
                        : 'shadow-[0_14px_30px_-16px_rgba(42,26,20,0.45)]',
                )}
            >
                <img src={photo.image} alt={photo.alt} loading="lazy" className={cn('block w-full object-cover', photo.aspect)} />
                <span className="sr-only">{isFront ? '(in front)' : '(bring to front)'}</span>
                <span className="absolute inset-x-2 bottom-2 truncate font-serif text-[11px] italic text-[#2a1a14]/80 sm:bottom-3 sm:text-sm">
                    {photo.caption}
                </span>
            </span>
            <span
                aria-hidden="true"
                className={cn('absolute h-6 w-20 bg-[#e4572e]/75 mix-blend-multiply sm:w-24', photo.tape)}
            />
        </motion.button>
    )
}

export function LayeredCollageAboutStory({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const collageRef = useRef(null)
    const [order, setOrder] = useState(photos.map((photo) => photo.id))
    const front = order[order.length - 1]
    const { scrollYProgress } = useScroll({ target: collageRef, offset: ['start end', 'end start'] })

    const bringToFront = (id) => {
        setOrder((current) => (current[current.length - 1] === id ? current : [...current.filter((item) => item !== id), id]))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fbf7f0] py-16 font-sans text-base font-normal text-[#2a1a14] md:py-24',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
                <div>
                    <div ref={collageRef} className="relative mx-auto aspect-[10/11] w-full max-w-[36rem]">
                        {photos.map((photo) => (
                            <Print
                                key={photo.id}
                                photo={photo}
                                zIndex={order.indexOf(photo.id) + 1}
                                isFront={front === photo.id}
                                progress={scrollYProgress}
                                reduceMotion={reduceMotion}
                                onFront={() => bringToFront(photo.id)}
                            />
                        ))}

                        <motion.svg
                            viewBox="0 0 120 120"
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-2 right-0 z-20 size-24 sm:size-28"
                            animate={reduceMotion ? undefined : { rotate: 360 }}
                            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                        >
                            <defs>
                                <path id={`${uid}-ring`} d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1 -86 0" />
                            </defs>
                            <circle cx="60" cy="60" r="58" fill="#e4572e" />
                            <text fill="#fbf7f0" className="font-sans text-[10.5px] font-bold uppercase tracking-[0.2em]">
                                <textPath href={`#${uid}-ring`}>Tidewater Foods · Since 1985 ·</textPath>
                            </text>
                            <circle cx="60" cy="63" r="15" fill="#fbf7f0" />
                            <path d="M52 49c4 3 12 3 16 0M60 44v7" stroke="#fbf7f0" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </motion.svg>
                    </div>

                    <div className="mx-auto mt-8 flex max-w-[36rem] flex-wrap items-center justify-center gap-2">
                        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2a1a14]/55">Bring forward</span>
                        {photos.map((photo) => (
                            <button
                                key={photo.id}
                                type="button"
                                aria-pressed={front === photo.id}
                                className={cn(
                                    'min-h-10 rounded-full px-4 text-sm font-semibold transition-colors',
                                    front === photo.id
                                        ? 'bg-[#e4572e] text-[#fbf7f0]'
                                        : 'bg-[#f7dccf] text-[#2a1a14] hover:bg-[#f3c9b6]',
                                    focusRing,
                                )}
                                onClick={() => bringToFront(photo.id)}
                            >
                                {photo.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-xl">
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#e4572e]">Tidewater Foods · Our story</p>
                    <h2 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[#2a1a14] sm:text-5xl lg:text-6xl">
                        Good food starts where the{' '}
                        <span className="relative inline-block text-[#e4572e]">
                            tide
                            <svg
                                viewBox="0 0 120 16"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                                className="absolute -bottom-2 left-0 h-3 w-full"
                            >
                                <motion.path
                                    d="M3 11C22 4 38 4 52 9S86 14 117 5"
                                    fill="none"
                                    stroke="#e4572e"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true, amount: 1 }}
                                    transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                                />
                            </svg>
                        </span>{' '}
                        comes in.
                    </h2>
                    <div className="mt-8 space-y-4 text-lg leading-relaxed text-[#2a1a14]/80">
                        <p>
                            In 1985 Maëlle and Iñigo Arrieta started bottling the summer tomato glut from their
                            smallholding outside Vigo, and sold it from the back of a borrowed van at the Saturday
                            market.
                        </p>
                        <p>
                            Forty-one years later we cook in three countries along the Atlantic coast, with the
                            same rule: buy from farms we can drive to before lunch, and print their names on the jar.
                        </p>
                    </div>

                    <dl className="mt-10 grid grid-cols-3 border-y border-dashed border-[#2a1a14]/25">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={cn('py-6 pr-2', index > 0 && 'border-l border-dashed border-[#2a1a14]/25 pl-3 sm:pl-5')}
                            >
                                <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a1a14]/60">{stat.label}</dt>
                                <dd className="mt-2 text-[2rem] font-extrabold leading-none tabular-nums tracking-tight text-[#e4572e] sm:text-5xl">
                                    {stat.value}
                                </dd>
                                <dd className="mt-2 text-xs leading-snug text-[#2a1a14]/65 sm:text-sm">{stat.note}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                        <a
                            href="#tidewater-growers"
                            className={cn(
                                'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e4572e] px-7 text-sm font-bold text-[#fbf7f0] transition-colors hover:bg-[#c8431d]',
                                focusRing,
                            )}
                        >
                            Meet our growers
                            <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#tidewater-charter"
                            className={cn(
                                'inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[#2a1a14] underline decoration-[#e4572e] decoration-2 underline-offset-4 hover:text-[#e4572e]',
                                focusRing,
                            )}
                        >
                            Read the sourcing charter
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LayeredCollageAboutStory

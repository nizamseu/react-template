// CardDeckTestimonials

// Testimonials05 · Portfolios & Personal Websites › Testimonials / Recommendations

// Description:
// A tactile pile of client testimonials for photographer and art director Theo Laurent.
// Beside the serif heading "Kind words, shuffled." six print-like cards are stacked with
// small tilts; each pairs the photograph Theo made for a client (Maison Oriel, Hôtel
// Verrier, Salt & Stone Quarterly…) with that client’s quote. Clicking or swiping the top
// card flicks it aside and tucks it under the pile. Use it on a photographer’s or studio’s
// portfolio where the work itself should frame the praise.

// Design:
// - Two-zone layout: heading, big "01/06" counter, prev/next and a client index on the
//   left; a fixed-height deck (h-[550px] → sm:h-[590px], max-w-[400px]) on the right
// - Cream #ede6da background, ink #111111 text and controls, card paper #f8f4ec with a
//   hairline ring and a long soft shadow; film-edge mono labels on dark chips over photos
// - Serif display type (text-5xl → lg:text-7xl) and serif quotes, mono metadata; cards
//   rounded-[4px] with a 3:2 photo; stacked cards step down 14px, scale 4.5% and tilt
// - framer-motion springs the pile into place; the top card flies 360px aside with a 10°
//   turn before re-stacking; reduced motion reorders instantly without the fly-out
// - Responsive: base/md stack heading → deck → controls in one column (deck centred); lg
//   splits into the text column and a 440px deck column spanning both rows

// What it does:
// - order (array of card indexes) and leaving ({ id, dir }) drive the deck: next flies the
//   top card out, then moves it to the back on animation complete; previous pulls the
//   bottom card back to the top; the client index rotates the pile to the chosen card
// - The top card also responds to click, horizontal drag/swipe (90px or fast flick) and
//   ←/→ keys while the deck is focused; an aria-live line announces the current card
// - "Commission a shoot" links to #contact; photos and film labels are decorative

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CardDeckTestimonials from '@/TestComponent/PageSections/portfolio/Testimonials05';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <CardDeckTestimonials />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const cards = [
    {
        id: 'oriel',
        client: 'Maison Oriel',
        field: 'Fashion',
        person: 'Camille Aubert',
        role: 'Creative Director',
        project: 'AW26 campaign · Lyon · 2026',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        alt: 'Model in a long blue coat crossing a city square scattered with pigeons',
        quote: 'Theo shot our whole AW26 campaign in one grey morning in Lyon. We had budgeted three days. The pigeons were his idea.',
    },
    {
        id: 'salt',
        client: 'Salt & Stone Quarterly',
        field: 'Print',
        person: 'Henrik Dahl',
        role: 'Photo Editor',
        project: 'Issue 18 cover · Porto · 2025',
        image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
        alt: 'Curved white building facade against a clear blue sky',
        quote: 'He sees the detail an architect hoped nobody would notice — and then everybody notices. Eleven of our covers are his.',
    },
    {
        id: 'verrier',
        client: 'Hôtel Verrier',
        field: 'Hospitality',
        person: 'Inès Moreau',
        role: 'Brand Director',
        project: 'Suites campaign · Annecy · 2025',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
        alt: 'Warm hotel suite with dark wood panelling and a made bed',
        quote: 'Suite bookings rose 27% the month his photographs replaced ours. That is the whole testimonial, really.',
    },
    {
        id: 'braise',
        client: 'Braise',
        field: 'Restaurant',
        person: 'Luca Ferri',
        role: 'Chef & Owner',
        project: 'Opening launch · Marseille · 2024',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        alt: 'Dark, modern restaurant dining room with pendant lights',
        quote: 'Theo waited two hours for the light to cross an empty room, then made it look like the best table in Marseille. It is now.',
    },
    {
        id: 'northbound',
        client: 'Northbound Journal',
        field: 'Travel',
        person: 'Aiko Brandt',
        role: 'Editor-in-Chief',
        project: 'Dolomites feature · 2024',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
        alt: 'Wooden rowboats on a still alpine lake below forested mountains',
        quote: 'He files early, writes his own captions and once rowed across a freezing lake at 5 a.m. for a single frame. We ran it over a spread.',
    },
    {
        id: 'velvet',
        client: 'Velvet Hours Records',
        field: 'Music',
        person: 'Marisol Vega',
        role: 'Label Manager',
        project: 'Album portrait · Paris · 2023',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        alt: 'Portrait of a woman with long dark hair against a dark backdrop',
        quote: 'Our artist hates being photographed. Theo talked to her about bread for an hour, then took the portrait we have used on every release since.',
    },
]

const tilts = [-2.5, 3, -4, 2, -1.5, 3.5]
const pad = (n) => String(n).padStart(2, '0')

export function CardDeckTestimonials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [order, setOrder] = useState(() => cards.map((_, index) => index))
    const [leaving, setLeaving] = useState(null)
    const dragged = useRef(false)

    const topIndex = order[0]
    const current = cards[topIndex]

    const sendBack = (dir = 1) => {
        if (leaving) return
        if (reduceMotion) {
            setOrder((prev) => [...prev.slice(1), prev[0]])
            return
        }
        setLeaving({ id: order[0], dir })
    }

    const finishLeave = (index) => {
        setOrder((prev) => (prev[0] === index ? [...prev.slice(1), index] : prev))
        setLeaving(null)
    }

    const pullBack = () => {
        if (leaving) return
        setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
    }

    const bringToTop = (index) => {
        if (leaving) return
        setOrder((prev) => {
            const at = prev.indexOf(index)
            return [...prev.slice(at), ...prev.slice(0, at)]
        })
    }

    const onDeckKey = (event) => {
        if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            sendBack(1)
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            pullBack()
        }
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ede6da] px-4 py-16 text-base font-normal text-[#111111] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-10">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#111111]/65">
                        Theo Laurent — Photography &amp; Art Direction
                    </p>
                    <h2 className="mt-5 font-serif text-5xl font-normal leading-[0.95] tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
                        Kind words, <em className="italic">shuffled.</em>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#111111]/70">
                        Six clients across fashion, hospitality and print, 2023–2026. Tap or swipe the top
                        card to send it to the back of the pile.
                    </p>
                </div>

                <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
                    <div
                        role="group"
                        tabIndex={0}
                        aria-label="Testimonial deck. Press the right arrow for the next card and the left arrow for the previous one."
                        className="relative mx-auto h-[550px] w-full max-w-[400px] rounded-md focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#111111] sm:h-[590px]"
                        onKeyDown={onDeckKey}
                    >
                        {cards.map((card, index) => {
                            const pos = order.indexOf(index)
                            const isLeaving = leaving?.id === index
                            const isTop = pos === 0
                            const target = isLeaving
                                ? { x: leaving.dir * 360, y: -12, rotate: leaving.dir * 10, scale: 1, opacity: 1 }
                                : {
                                      x: 0,
                                      y: Math.min(pos, 3) * 14,
                                      rotate: isTop ? 0 : tilts[index],
                                      scale: 1 - Math.min(pos, 3) * 0.045,
                                      opacity: pos > 3 ? 0 : 1,
                                  }
                            return (
                                <motion.article
                                    key={card.id}
                                    dragSnapToOrigin
                                    aria-hidden={!isTop}
                                    initial={false}
                                    animate={target}
                                    transition={
                                        reduceMotion
                                            ? { duration: 0 }
                                            : isLeaving
                                              ? { duration: 0.38, ease: [0.4, 0, 0.2, 1] }
                                              : { type: 'spring', stiffness: 240, damping: 28 }
                                    }
                                    drag={isTop && !leaving ? 'x' : false}
                                    dragElastic={0.7}
                                    style={{ zIndex: isLeaving ? 40 : cards.length - pos }}
                                    className={cn(
                                        'absolute inset-x-0 top-0 flex h-[500px] origin-bottom flex-col rounded-[4px] bg-[#f8f4ec] p-3 shadow-[0_30px_60px_-30px_rgba(17,17,17,0.5)] ring-1 ring-[#111111]/10 select-none sm:h-[540px] sm:p-4',
                                        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
                                    )}
                                    onPointerDown={() => {
                                        dragged.current = false
                                    }}
                                    onAnimationComplete={() => {
                                        if (isLeaving) finishLeave(index)
                                    }}
                                    onDragStart={() => {
                                        dragged.current = true
                                    }}
                                    onDragEnd={(_, info) => {
                                        if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) {
                                            sendBack(info.offset.x > 0 ? 1 : -1)
                                        }
                                    }}
                                    onClick={() => {
                                        if (dragged.current) {
                                            dragged.current = false
                                            return
                                        }
                                        if (isTop) sendBack(1)
                                    }}
                                >
                                    <div className="relative aspect-[3/2] shrink-0 overflow-hidden bg-[#d9d1c3]">
                                        <img
                                            src={card.image}
                                            alt={card.alt}
                                            loading="lazy"
                                            draggable={false}
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="absolute left-3 top-2.5 rounded-sm bg-[#111111]/55 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.2em] text-white">
                                            TL 400 ▸ {pad(index + 1)}A
                                        </span>
                                        <span className="absolute bottom-2.5 right-3 rounded-sm bg-[#111111]/70 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-white">
                                            {card.field}
                                        </span>
                                    </div>
                                    <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 px-2 pb-2 pt-5">
                                        <blockquote className="font-serif text-lg leading-snug text-[#111111] sm:text-xl">
                                            <p>“{card.quote}”</p>
                                        </blockquote>
                                        <footer className="border-t border-[#111111]/15 pt-3">
                                            <p className="text-sm font-semibold text-[#111111]">
                                                {card.person}
                                                <span className="font-normal text-[#111111]/60">
                                                    {' '}
                                                    · {card.role}, {card.client}
                                                </span>
                                            </p>
                                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#111111]/50">
                                                {card.project}
                                            </p>
                                        </footer>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                </div>

                <div className="lg:col-start-1 lg:row-start-2">
                    <div className="flex items-end justify-between gap-6 border-t border-[#111111]/20 pt-6">
                        <p className="font-serif leading-none text-[#111111]" aria-hidden="true">
                            <span className="text-7xl sm:text-8xl">{pad(topIndex + 1)}</span>
                            <span className="align-top text-2xl text-[#111111]/45">/{pad(cards.length)}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                aria-label="Previous testimonial"
                                className="grid size-12 place-items-center rounded-full border border-[#111111] text-[#111111] transition-colors hover:bg-[#111111] hover:text-[#ede6da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                                onClick={pullBack}
                            >
                                <HiArrowLeft aria-hidden="true" className="size-5" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next testimonial"
                                className="grid size-12 place-items-center rounded-full bg-[#111111] text-[#ede6da] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] motion-reduce:hover:translate-y-0"
                                onClick={() => sendBack(1)}
                            >
                                <HiArrowRight aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>
                    <p aria-live="polite" className="sr-only">
                        Card {topIndex + 1} of {cards.length}: {current.person}, {current.client}
                    </p>

                    <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 sm:gap-x-8">
                        {cards.map((card, index) => {
                            const active = index === topIndex
                            return (
                                <li key={card.id} className="border-b border-[#111111]/10">
                                    <button
                                        type="button"
                                        aria-current={active ? 'true' : undefined}
                                        className={cn(
                                            'flex min-h-11 w-full items-center gap-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]',
                                            active ? 'text-[#111111]' : 'text-[#111111]/55 hover:text-[#111111]',
                                        )}
                                        onClick={() => bringToTop(index)}
                                    >
                                        <span className="font-mono text-[10px] tracking-[0.16em]">{pad(index + 1)}</span>
                                        <span className={cn('flex-1', active && 'font-semibold')}>{card.client}</span>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'size-2 rounded-full bg-[#111111] transition-transform duration-300',
                                                active ? 'scale-100' : 'scale-0',
                                            )}
                                        />
                                    </button>
                                </li>
                            )
                        })}
                    </ol>

                    <a
                        href="#contact"
                        className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
                    >
                        <span className="border-b border-[#111111] pb-0.5">Commission a shoot</span>
                        <HiArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CardDeckTestimonials

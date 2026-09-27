// HorizontalReelCaseStudies

// CaseStudies05 · Corporate & Business › Case Studies / Portfolio Preview

// Description:
// A black, gallery-like reel of selected work for the fictional brand consultancy
// Northlight Studio. The heading "Seven brands, seven voices." sits above a horizontal,
// scroll-snapping row of seven case cards (Aulos Hall, Kanso Ceramics, Parallel, Ferro &
// Lund, Nightjar, Tidal, Quire Press) with photo, disciplines, year, palette swatches and a
// one-line result, plus prev/next buttons, a "03 / 07" counter, a scroll-synced progress bar
// and an "All work (42)" link. Use it as a portfolio preview on an agency or studio site.

// Design:
// - Black #0a0a0a section, off-white #ece8df type and hairlines; tight sans heading with a
//   muted italic serif second line; mono uppercase meta labels
// - Reel: flex row with CSS scroll-snap (snap-start), hidden scrollbar and cards 80% →
//   sm:58% → md:44% → lg:31% → xl:400px wide; from xl the first card lines up with the
//   centred max-w-7xl header via calc() padding and matching scroll padding
// - Cards: 4/5 photo with rounded-md corners, index number, a "View case" pill that rises
//   in on hover/focus, three palette swatches, client name, disciplines and year
// - Progress: 3px off-white bar on a hairline track, scaled from 1/7 to full by
//   useScroll(container).scrollXProgress; 48px round prev/next buttons invert on hover
// - Header and controls stack on mobile and split into a row from md

// What it does:
// - Scrolling (trackpad, touch, keyboard, mouse drag) updates the counter and the
//   disabled state of prev/next; prev/next and ← / → / Home / End on the focused reel
//   scroll to the neighbouring card (instant with reduced motion)
// - Mouse drag scrolls the reel with snap paused, then settles on the nearest card; a drag
//   of more than 4px swallows the click so links do not fire by accident
// - Cards link to #work-<id>; "All work (42)" links to #northlight-work

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HorizontalReelCaseStudies from '@/TestComponent/PageSections/corporate/CaseStudies05';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <HorizontalReelCaseStudies />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowLeft, HiArrowLongRight, HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const work = [
    {
        id: 'aulos-hall',
        client: 'Aulos Hall',
        what: 'Identity · Wayfinding · Sonic logo',
        year: 2025,
        result: 'Season ticket sales up 34% in the first year.',
        palette: ['#e8e2d4', '#c8553d', '#2c2a28'],
        image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=900&q=80',
        alt: 'Black and white close-up of hands playing a grand piano',
    },
    {
        id: 'kanso-ceramics',
        client: 'Kanso Ceramics',
        what: 'Naming · Identity · Packaging',
        year: 2024,
        result: 'Stocked by 60 design stores within 18 months.',
        palette: ['#f1ece3', '#b9a78f', '#5f6b5a'],
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80',
        alt: 'Hand-thrown white ceramic cups and vessels on a pale surface',
    },
    {
        id: 'parallel',
        client: 'Parallel',
        what: 'Naming · Identity · Motion',
        year: 2025,
        result: 'A name and mark for an AI lab hiring its first 80 researchers.',
        palette: ['#dfe3ff', '#4b5bdc', '#111222'],
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
        alt: 'Large blue three-dimensional letters A and I in a render',
    },
    {
        id: 'ferro-lund',
        client: 'Ferro & Lund',
        what: 'Rebrand · Website · Photography',
        year: 2023,
        result: 'Shortlisted for three public competitions after relaunch.',
        palette: ['#e9f0f2', '#6aa7c0', '#1d2a30'],
        image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=900&q=80',
        alt: 'Curved white building facade against a clear blue sky',
    },
    {
        id: 'nightjar',
        client: 'Nightjar',
        what: 'Identity · Interiors · Menus',
        year: 2022,
        result: 'From 3 to 12 late-night ramen bars in two years.',
        palette: ['#ff4f6d', '#2de2e6', '#0d0b1a'],
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80',
        alt: 'Neon signs glowing above a busy Tokyo street at night',
    },
    {
        id: 'tidal',
        client: 'Tidal',
        what: 'Motion system · App icon',
        year: 2024,
        result: 'A calmer savings app for 1.1 million members.',
        palette: ['#9f7bff', '#29c5f6', '#1a1446'],
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
        alt: 'Abstract purple and blue waves flowing across the frame',
    },
    {
        id: 'quire-press',
        client: 'Quire Press',
        what: 'Identity · Type system · Covers',
        year: 2021,
        result: '112 covers designed from one flexible grid.',
        palette: ['#f5f1e8', '#a4332a', '#1f1c19'],
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
        alt: 'Fountain pen writing in cursive on lined paper',
    },
]

const pad = (n) => String(n).padStart(2, '0')

export function HorizontalReelCaseStudies({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const reelRef = useRef(null)
    const drag = useRef({ active: false, captured: false, moved: false, startX: 0, startLeft: 0 })
    const [index, setIndex] = useState(0)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)
    const [dragging, setDragging] = useState(false)
    const { scrollXProgress } = useScroll({ container: reelRef })
    const progress = useTransform(scrollXProgress, (v) => 1 / work.length + v * (1 - 1 / work.length))

    const measure = () => {
        const el = reelRef.current
        if (!el) return null
        const cards = Array.from(el.querySelectorAll('[data-card]'))
        const padLeft = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
        return { el, cards, padLeft }
    }

    const nearestIndex = () => {
        const m = measure()
        if (!m) return 0
        let best = 0
        let bestDist = Infinity
        m.cards.forEach((card, i) => {
            const dist = Math.abs(card.offsetLeft - m.padLeft - m.el.scrollLeft)
            if (dist < bestDist) {
                bestDist = dist
                best = i
            }
        })
        return best
    }

    const onScroll = () => {
        const el = reelRef.current
        if (!el) return
        const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
        setAtStart(el.scrollLeft <= 4)
        setAtEnd(end)
        setIndex(end ? work.length - 1 : nearestIndex())
    }

    const goTo = (target) => {
        const m = measure()
        if (!m) return
        const i = Math.max(0, Math.min(work.length - 1, target))
        m.el.scrollTo({ left: m.cards[i].offsetLeft - m.padLeft, behavior: reduceMotion ? 'auto' : 'smooth' })
    }

    const step = (dir) => {
        if (dir > 0 && atEnd) return
        goTo(nearestIndex() + dir)
    }

    const onKeyDown = (event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'ArrowRight') step(1)
        else if (event.key === 'ArrowLeft') step(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(work.length - 1)
        else return
        event.preventDefault()
    }

    const onPointerDown = (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return
        const el = reelRef.current
        drag.current = { active: true, captured: false, moved: false, startX: event.clientX, startLeft: el.scrollLeft }
    }

    const onPointerMove = (event) => {
        const d = drag.current
        if (!d.active) return
        const dx = event.clientX - d.startX
        if (!d.moved && Math.abs(dx) > 4) {
            d.moved = true
            setDragging(true)
            if (!d.captured) {
                event.currentTarget.setPointerCapture?.(event.pointerId)
                d.captured = true
            }
        }
        if (d.moved) reelRef.current.scrollLeft = d.startLeft - dx
    }

    const endDrag = () => {
        const d = drag.current
        if (!d.active) return
        d.active = false
        if (d.moved) {
            setDragging(false)
            goTo(nearestIndex())
        }
    }

    const onClickCapture = (event) => {
        if (drag.current.moved) {
            event.preventDefault()
            event.stopPropagation()
            drag.current.moved = false
        }
    }

    const edgePad = 'px-4 sm:px-6 lg:px-10 xl:px-[calc((100%_-_80rem)/2_+_2.5rem)]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0a0a0a] py-20 text-base font-normal text-[#ece8df] md:py-28', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between border-b border-[#ece8df]/15 pb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[#ece8df]/55">
                    <span>Northlight Studio</span>
                    <span>
                        <span className="hidden sm:inline">Selected work · </span>2021 → 2026
                    </span>
                </div>

                <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[#ece8df] sm:text-6xl lg:text-8xl">
                        Seven brands,
                        <span className="block font-serif font-normal italic tracking-[-0.03em] text-[#ece8df]/45">seven voices.</span>
                    </h2>

                    <div className="flex items-center gap-5">
                        <p className="font-mono text-sm tabular-nums text-[#ece8df]/70" aria-live="polite">
                            <span className="text-[#ece8df]">{pad(index + 1)}</span> / {pad(work.length)}
                            <span className="sr-only">: {work[index].client}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                aria-label="Previous case"
                                aria-controls="northlight-reel"
                                disabled={atStart}
                                className="grid size-12 place-items-center rounded-full border border-[#ece8df]/30 text-[#ece8df] transition-colors hover:bg-[#ece8df] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece8df] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#ece8df]"
                                onClick={() => step(-1)}
                            >
                                <HiArrowLeft aria-hidden="true" className="size-5" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next case"
                                aria-controls="northlight-reel"
                                disabled={atEnd}
                                className="grid size-12 place-items-center rounded-full border border-[#ece8df]/30 text-[#ece8df] transition-colors hover:bg-[#ece8df] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece8df] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#ece8df]"
                                onClick={() => step(1)}
                            >
                                <HiArrowRight aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ul
                ref={reelRef}
                id="northlight-reel"
                tabIndex={0}
                aria-label="Case study reel, use left and right arrow keys to move"
                className={cn(
                    'relative mt-12 flex gap-4 overflow-x-auto pb-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ece8df]/60 sm:gap-6 md:mt-16 [&::-webkit-scrollbar]:hidden',
                    'scroll-px-4 sm:scroll-px-6 lg:scroll-px-10 xl:scroll-px-[calc((100%_-_80rem)/2_+_2.5rem)]',
                    edgePad,
                    dragging ? 'cursor-grabbing snap-none select-none' : 'cursor-grab snap-x snap-mandatory',
                )}
                onScroll={onScroll}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onLostPointerCapture={endDrag}
                onClickCapture={onClickCapture}
                onDragStart={(event) => event.preventDefault()}
            >
                {work.map((item, i) => (
                    <li
                        key={item.id}
                        data-card=""
                        className="w-[80%] shrink-0 snap-start sm:w-[58%] md:w-[44%] lg:w-[31%] xl:w-[400px]"
                    >
                        <a
                            href={`#work-${item.id}`}
                            draggable={false}
                            className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece8df]"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#1a1a1a]">
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    loading="lazy"
                                    draggable={false}
                                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
                                />
                                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-black/40" />
                                <span className="absolute left-4 top-4 font-mono text-xs text-[#ece8df]">{pad(i + 1)}</span>
                                <span className="absolute right-4 top-4 flex gap-1.5" aria-hidden="true">
                                    {item.palette.map((color) => (
                                        <span
                                            key={color}
                                            className="size-3 rounded-full ring-1 ring-[#ece8df]/40"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </span>
                                <span className="absolute bottom-4 left-4 inline-flex min-h-10 translate-y-2 items-center gap-2 rounded-full bg-[#ece8df] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                                    View case
                                    <HiArrowUpRight aria-hidden="true" className="size-3.5" />
                                </span>
                            </div>
                            <div className="mt-5 flex items-start justify-between gap-4 border-t border-[#ece8df]/15 pt-4">
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#ece8df] sm:text-[1.75rem]">
                                        {item.client}
                                    </h3>
                                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ece8df]/50">
                                        {item.what}
                                    </p>
                                </div>
                                <span className="shrink-0 font-mono text-xs text-[#ece8df]/45">{item.year}</span>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-[#ece8df]/70">{item.result}</p>
                        </a>
                    </li>
                ))}
            </ul>

            <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:gap-8 sm:px-6 lg:px-10">
                <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.24em] text-[#ece8df]/50">Drag · Scroll · ← →</p>
                <div className="relative h-px w-full bg-[#ece8df]/15 sm:w-auto sm:flex-1" aria-hidden="true">
                    <motion.div
                        className="absolute inset-x-0 -top-px h-[3px] origin-left bg-[#ece8df]"
                        style={{ scaleX: progress }}
                    />
                </div>
                <a
                    href="#northlight-work"
                    className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-[#ece8df] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ece8df]"
                >
                    <span className="border-b border-[#ece8df]/40 pb-0.5 group-hover:border-[#ece8df]">All work (42)</span>
                    <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
            </div>
        </section>
    )
}

export default HorizontalReelCaseStudies

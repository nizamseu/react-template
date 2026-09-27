// PortraitSplitIntroBio

// IntroBio03 · Portfolios & Personal Websites › Intro / Bio

// Description:
// A warm, editorial half-and-half intro for Milan product designer Elena Rossi. One half is
// an arched portrait with a "Hi, I'm Elena" sticker and a "Now" note; the other carries
// the serif catchline "Designing calm software for complicated days.", an availability
// badge that opens a small booking calendar, "See case studies" / "Book a 20-min intro"
// CTAs and a "Previously at" row. Use it as the hero of a designer's portfolio.

// Design:
// - Blush #f7e8e1 page, deeper blush #efd6ca portrait panel, espresso #3b2a24 type and
//   buttons, sage #6b8e5a for "open" availability; serif display, sans body copy
// - Portrait sits in a rounded-t-full arch with an offset hairline arch behind it, rising
//   from the panel's bottom edge; a giant italic "Ciao" watermark fills the panel
// - Headline text-[2.6rem] → sm:6xl → xl:[5.5rem], leading 0.98, italic accent word;
//   pill CTAs (h-12), "Previously at" row of fictional wordmarks in mixed type styles
// - Pointer movement over the portrait panel gives a spring parallax (image vs watermark);
//   it is off for reduced motion and on touch there is simply no movement
// - Responsive: single column with the portrait first (22rem → sm:25rem wide, "Now" note
//   from sm) → lg: two equal halves, min-height 46rem, content vertically centred

// What it does:
// - The availability badge is a button (aria-expanded) that toggles a popover listing
//   Nov / Dec / Jan slots; a click outside or Escape (focus returns to the badge) closes it
// - "Reserve November" in the popover links to #book-intro, "See case studies" to
//   #case-studies and "Book a 20-min intro" to #book-intro
// - Parallax uses motion values only (no re-renders); the sticker and note are static

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PortraitSplitIntroBio from '@/TestComponent/PageSections/portfolio/IntroBio03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <PortraitSplitIntroBio />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { HiArrowRight, HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const slots = [
    { month: 'November 2026', status: 'Open', detail: '2 project slots', tone: 'open' },
    { month: 'December 2026', status: 'Almost full', detail: '1 slot left', tone: 'few' },
    { month: 'January 2027', status: 'Booked', detail: 'Join the waitlist', tone: 'booked' },
]

const toneDot = {
    open: 'bg-[#6b8e5a]',
    few: 'bg-[#c7883d]',
    booked: 'bg-[#3b2a24]/30',
}

const previously = [
    { name: 'Fernwood', className: 'font-serif text-xl italic' },
    { name: 'LUMO HEALTH', className: 'font-sans text-[11px] font-bold tracking-[0.32em]' },
    { name: 'treno.', className: 'font-sans text-lg font-black tracking-tight' },
    { name: 'Studio Aperta', className: 'font-serif text-base uppercase tracking-[0.12em]' },
]

export function PortraitSplitIntroBio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const popoverId = `elena-slots-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const [open, setOpen] = useState(false)
    const wrapRef = useRef(null)
    const buttonRef = useRef(null)

    const px = useMotionValue(0)
    const py = useMotionValue(0)
    const springX = useSpring(px, { stiffness: 120, damping: 20 })
    const springY = useSpring(py, { stiffness: 120, damping: 20 })
    const imageX = useTransform(springX, [-0.5, 0.5], [-14, 14])
    const imageY = useTransform(springY, [-0.5, 0.5], [-10, 10])
    const markX = useTransform(springX, [-0.5, 0.5], [30, -30])

    useEffect(() => {
        if (!open) return undefined
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false)
                buttonRef.current?.focus()
            }
        }
        const onPointer = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false)
        }
        document.addEventListener('keydown', onKey)
        document.addEventListener('pointerdown', onPointer)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('pointerdown', onPointer)
        }
    }, [open])

    const handlePointerMove = (event) => {
        if (reduceMotion || event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        px.set((event.clientX - rect.left) / rect.width - 0.5)
        py.set((event.clientY - rect.top) / rect.height - 0.5)
    }

    const resetPointer = () => {
        px.set(0)
        py.set(0)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#f7e8e1] text-base font-normal text-[#3b2a24]', className)}
            {...props}
        >
            <div className="grid grid-cols-1 lg:min-h-[46rem] lg:grid-cols-2">
                <div
                    className="relative isolate flex items-end justify-center overflow-hidden bg-[#efd6ca] px-6 pt-14 sm:pt-16 lg:px-12"
                    onPointerMove={handlePointerMove}
                    onPointerLeave={resetPointer}
                >
                    <motion.p
                        aria-hidden="true"
                        style={reduceMotion ? undefined : { x: markX }}
                        className="pointer-events-none absolute -left-4 top-6 -z-10 select-none whitespace-nowrap font-serif text-[9rem] italic leading-none text-[#f7e8e1]/70 sm:text-[12rem] lg:top-10 lg:text-[15rem]"
                    >
                        Ciao
                    </motion.p>

                    <div className="relative w-full max-w-[22rem] sm:max-w-[25rem] lg:max-w-[27rem]">
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 -translate-y-4 translate-x-4 rounded-t-full border border-[#3b2a24]/35"
                        />
                        <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#e8c6b7] lg:aspect-auto lg:h-[42rem]">
                            <motion.img
                                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80"
                                alt="Elena Rossi smiling in front of a soft pink backdrop"
                                style={reduceMotion ? undefined : { x: imageX, y: imageY }}
                                className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] max-w-none object-cover object-[50%_20%]"
                            />
                        </div>

                        <p className="absolute -right-2 top-10 rotate-6 rounded-full bg-[#3b2a24] px-4 py-2 font-serif text-lg italic text-[#f7e8e1] shadow-[0_12px_30px_-12px_rgba(59,42,36,0.6)] sm:-right-6 sm:text-xl">
                            Hi, I&apos;m Elena ✿
                        </p>

                        <div className="absolute -left-2 bottom-6 hidden max-w-[15rem] rounded-2xl bg-[#fdf5f1]/95 p-4 shadow-[0_20px_40px_-20px_rgba(59,42,36,0.55)] backdrop-blur sm:-left-8 sm:bottom-10 sm:block">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3b2a24]/60">
                                Now
                            </p>
                            <p className="mt-1 font-serif text-base leading-snug text-[#3b2a24]">
                                Design lead at Fernwood, rebuilding a pharmacy app for 2M patients.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center px-4 py-14 sm:px-10 md:py-20 lg:px-14 xl:px-20">
                    <div className="flex flex-col items-start gap-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#3b2a24]/70">
                            Elena Rossi — Product Designer, Milan
                        </p>

                        <div ref={wrapRef} className="relative">
                            <button
                                ref={buttonRef}
                                type="button"
                                aria-expanded={open}
                                aria-controls={popoverId}
                                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#3b2a24]/20 bg-[#fdf5f1] pl-3 pr-2.5 text-xs font-semibold text-[#3b2a24] transition-colors hover:border-[#3b2a24]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]"
                                onClick={() => setOpen((v) => !v)}
                            >
                                <span className="relative flex size-2" aria-hidden="true">
                                    <span className="absolute inline-flex size-full rounded-full bg-[#6b8e5a] opacity-60 motion-safe:animate-ping" />
                                    <span className="relative inline-flex size-2 rounded-full bg-[#6b8e5a]" />
                                </span>
                                Available from 3 Nov · 2 slots
                                <HiChevronDown
                                    aria-hidden="true"
                                    className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')}
                                />
                            </button>

                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        id={popoverId}
                                        role="dialog"
                                        aria-label="Elena's availability"
                                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute left-0 top-full z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] origin-top-left rounded-2xl border border-[#3b2a24]/10 bg-[#fdf5f1] p-2 shadow-[0_24px_50px_-20px_rgba(59,42,36,0.5)]"
                                    >
                                        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3b2a24]/55">
                                            Booking calendar
                                        </p>
                                        <ul>
                                            {slots.map((slot) => (
                                                <li
                                                    key={slot.month}
                                                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                                                >
                                                    <span>
                                                        <span className="block font-serif text-base text-[#3b2a24]">
                                                            {slot.month}
                                                        </span>
                                                        <span className="block text-xs text-[#3b2a24]/60">{slot.detail}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3b2a24]">
                                                        <span aria-hidden="true" className={cn('size-2 rounded-full', toneDot[slot.tone])} />
                                                        {slot.status}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href="#book-intro"
                                            className="mt-1 flex min-h-10 items-center justify-between rounded-xl bg-[#3b2a24] px-3 text-sm font-semibold text-[#f7e8e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b2a24]"
                                        >
                                            Reserve November
                                            <HiArrowRight aria-hidden="true" className="size-4" />
                                        </a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <h2 className="mt-8 max-w-xl font-serif text-[2.6rem] font-normal leading-[0.98] tracking-[-0.02em] text-[#3b2a24] sm:text-6xl xl:text-[5.5rem]">
                        Designing <em className="italic text-[#8a5a48]">calm</em> software for complicated days.
                    </h2>

                    <p className="mt-7 max-w-lg text-base leading-relaxed text-[#3b2a24]/75 md:text-lg">
                        I&apos;m Elena, a product designer in Milan. For eleven years I have helped health,
                        travel and finance teams turn tangled flows into quiet, confident products — from the
                        first research call to the last pixel in production.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a
                            href="#case-studies"
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#3b2a24] px-7 text-sm font-semibold text-[#f7e8e1] shadow-[0_14px_30px_-14px_rgba(59,42,36,0.7)] transition-colors duration-300 hover:bg-[#2a1d18] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]"
                        >
                            See case studies
                            <HiArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                        <a
                            href="#book-intro"
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3b2a24] px-7 text-sm font-semibold text-[#3b2a24] transition-colors duration-300 hover:bg-[#3b2a24] hover:text-[#f7e8e1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3b2a24]"
                        >
                            Book a 20-min intro
                        </a>
                    </div>

                    <div className="mt-12 border-t border-[#3b2a24]/15 pt-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#3b2a24]/55">
                            Previously at
                        </p>
                        <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[#3b2a24]/80">
                            {previously.map((brand) => (
                                <li key={brand.name} className={brand.className}>
                                    {brand.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PortraitSplitIntroBio

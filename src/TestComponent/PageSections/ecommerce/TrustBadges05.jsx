// PlayfulBentoTrustBadges

// TrustBadges05 · E-commerce & Marketplaces › Trust Badges & Policies

// Description:
// A cheerful bento of store promises for Pip & Pop, a kids’ toy and playroom shop. Six
// candy-coloured boxes of different sizes carry big duotone icons and punchy copy: "Free
// shipping over $40", "60-day no-fuss returns", "Safety-tested", "Free gift wrap",
// "4.9 from 18k happy families" and "Plastic-free packaging", under the heading "The grown-up
// stuff, made fun." Use it on a playful shop’s home page, cart or about page.

// Design:
// - Bento grid: grid-cols-2 on mobile (hero and returns span 2) → md:grid-cols-4 with a
//   2×2 lemon hero, a 2×1 coral box, two 1×1 boxes, a 1×1 rating box and a 3×1 banner
// - White section; lemon #fff275, coral #ff8c61, sky #9ad1ff, lilac #cdb4ff fills and a
//   sky→lilac gradient banner; ink #1b1530 text; rounded-[28px] boxes, no borders except
//   the white rating box (2px ink/10)
// - Heavy sans type (font-black, tracking-tight), text-4xl → md:text-6xl heading with a
//   hand-drawn SVG squiggle that draws under "made fun"; icons 48px → hero 96px+
// - Each box lifts (y −8) and tilts ±1.5° on hover/focus with a spring and a deeper
//   shadow; the hero sticker wobbles gently; only the lift remains for reduced motion
// - md:auto-rows-[minmax(190px,auto)]; padding p-5 → sm:p-7; boxes fade in on scroll

// What it does:
// - No state. Every box is a #hash link (#shipping, #returns, #safety, #gift-wrap,
//   #reviews, #packaging) animated with motion.a whileHover / whileFocus.
// - useReducedMotion drops the tilt, sticker wobble and squiggle draw.
// - Decorative dots and the sticker are aria-hidden; each link’s text is its label.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PlayfulBentoTrustBadges from '@/TestComponent/PageSections/ecommerce/TrustBadges05';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <PlayfulBentoTrustBadges />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import {
    PiArrowCounterClockwiseDuotone,
    PiArrowUpRightBold,
    PiGiftDuotone,
    PiPlantDuotone,
    PiShieldCheckDuotone,
    PiStarDuotone,
    PiTruckDuotone,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const boxes = [
    {
        id: 'shipping',
        href: '#shipping',
        icon: PiTruckDuotone,
        kicker: 'Always',
        title: 'Free shipping over $40',
        text: 'Tracked, carbon-neutral and usually at your door in two days — with a surprise sticker sheet in every box.',
        tilt: -1.5,
        span: 'col-span-2 md:row-span-2',
        fill: 'bg-[#fff275]',
        hero: true,
    },
    {
        id: 'returns',
        href: '#returns',
        icon: PiArrowCounterClockwiseDuotone,
        kicker: '60 days',
        title: 'No-fuss returns',
        text: 'Even if it’s been gently played with. Free label, instant refund.',
        tilt: 1.5,
        span: 'col-span-2',
        fill: 'bg-[#ff8c61]',
    },
    {
        id: 'safety',
        href: '#safety',
        icon: PiShieldCheckDuotone,
        kicker: 'Ages 0–10',
        title: 'Safety-tested',
        text: 'Non-toxic paints, lab-checked.',
        tilt: -1.5,
        span: '',
        fill: 'bg-[#9ad1ff]',
    },
    {
        id: 'gift-wrap',
        href: '#gift-wrap',
        icon: PiGiftDuotone,
        kicker: '$0',
        title: 'Free gift wrap',
        text: 'Paper, ribbon & a handwritten note.',
        tilt: 1.5,
        span: '',
        fill: 'bg-[#cdb4ff]',
    },
    {
        id: 'reviews',
        href: '#reviews',
        icon: PiStarDuotone,
        kicker: '4.9 / 5',
        title: '18k happy families',
        text: 'Rated by grown-ups, approved by tiny critics.',
        tilt: -1.5,
        span: '',
        fill: 'border-2 border-[#1b1530]/10 bg-white',
    },
    {
        id: 'packaging',
        href: '#packaging',
        icon: PiPlantDuotone,
        kicker: 'Planet-friendly',
        title: 'Plastic-free packaging',
        text: '100% recyclable boxes, paper tape and soy inks. Zero bubble wrap.',
        tilt: 1.5,
        span: 'md:col-span-3',
        fill: 'bg-[linear-gradient(120deg,#9ad1ff,#cdb4ff)]',
        wide: true,
    },
]

export function PlayfulBentoTrustBadges({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 text-[#1b1530] antialiased sm:px-6 md:py-24 lg:px-10 text-base font-normal',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#1b1530] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#fff275]">
                            <span aria-hidden="true" className="flex gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff8c61]" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#9ad1ff]" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#cdb4ff]" />
                            </span>
                            Pip &amp; Pop promises
                        </p>
                        <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-6xl text-[#1b1530]">
                            The grown-up stuff,{' '}
                            <span className="relative inline-block whitespace-nowrap">
                                made fun.
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 220 20"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-3 left-0 h-4 w-full text-[#ff8c61]"
                                >
                                    <motion.path
                                        d="M3 14 C 30 2, 50 2, 72 12 S 116 22, 140 10 S 190 2, 217 11"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        initial={{ pathLength: reduce ? 1 : 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: reduce ? 0 : 0.9, delay: 0.3, ease: 'easeOut' }}
                                    />
                                </svg>
                            </span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-base font-medium leading-relaxed text-[#1b1530]/70">
                        Shipping, returns and safety shouldn’t be a chore. So we made
                        them the easiest part of your toy haul.
                    </p>
                </div>

                <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 md:auto-rows-[minmax(190px,auto)] md:grid-cols-4">
                    {boxes.map((item, i) => {
                        const Icon = item.icon
                        const hover = reduce
                            ? { y: -6 }
                            : { y: -8, rotate: item.tilt, scale: 1.015 }

                        return (
                            <motion.li
                                key={item.id}
                                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                className={cn('flex', item.span)}
                            >
                                <motion.a
                                    href={item.href}
                                    whileHover={hover}
                                    whileFocus={hover}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                                    className={cn(
                                        'group relative flex w-full flex-col overflow-hidden rounded-[28px] p-5 transition-shadow duration-300 hover:shadow-[0_24px_50px_-20px_rgba(27,21,48,0.45)] focus-visible:shadow-[0_24px_50px_-20px_rgba(27,21,48,0.45)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1b1530] sm:p-7',
                                        item.fill,
                                        item.wide && 'md:flex-row md:items-center md:gap-8',
                                    )}
                                >
                                    {item.wide && (
                                        <Icon
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -right-6 -bottom-14 hidden h-56 w-56 rotate-12 text-white/45 transition-transform duration-500 group-hover:rotate-0 md:block"
                                        />
                                    )}
                                    {item.hero && (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="absolute -right-10 -bottom-12 h-56 w-56 rounded-full bg-white/40 md:h-72 md:w-72"
                                            />
                                            <motion.span
                                                aria-hidden="true"
                                                animate={reduce ? { rotate: 12 } : { rotate: [8, 16, 8] }}
                                                transition={
                                                    reduce
                                                        ? { duration: 0 }
                                                        : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                                                }
                                                className="absolute top-5 right-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff8c61] text-center text-[11px] leading-tight font-black uppercase text-white shadow-[0_8px_0_-2px_rgba(27,21,48,0.15)] sm:h-24 sm:w-24 sm:text-xs"
                                            >
                                                No code
                                                <br />
                                                needed!
                                            </motion.span>
                                        </>
                                    )}

                                    <span
                                        className={cn(
                                            'relative flex shrink-0 items-center justify-center rounded-2xl bg-white/60',
                                            item.hero ? 'h-20 w-20 sm:h-28 sm:w-28 sm:rounded-3xl' : 'h-14 w-14',
                                        )}
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            className={cn(
                                                'transition-transform duration-300 group-hover:scale-110',
                                                item.hero ? 'h-12 w-12 sm:h-20 sm:w-20' : 'h-8 w-8',
                                            )}
                                        />
                                    </span>

                                    <span className={cn('relative mt-auto block pt-6', item.wide && 'md:mt-0 md:pt-0')}>
                                        <span
                                            className={cn(
                                                'block font-black uppercase tracking-[0.12em] text-[#1b1530]/60',
                                                item.hero ? 'text-xs sm:text-sm' : 'text-[11px]',
                                            )}
                                        >
                                            {item.kicker}
                                        </span>
                                        <span
                                            className={cn(
                                                'mt-1 block font-black leading-[1.02] tracking-tight',
                                                item.hero
                                                    ? 'max-w-sm text-3xl sm:text-4xl md:text-5xl'
                                                    : 'text-lg sm:text-2xl',
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                        <span
                                            className={cn(
                                                'mt-2 block font-medium leading-snug text-[#1b1530]/70',
                                                item.hero ? 'max-w-xs text-sm sm:text-base' : 'text-xs sm:text-sm',
                                            )}
                                        >
                                            {item.text}
                                        </span>
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'absolute flex h-9 w-9 items-center justify-center rounded-full bg-[#1b1530] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100',
                                            item.hero ? 'bottom-5 right-5 sm:bottom-7 sm:right-7' : 'top-4 right-4',
                                        )}
                                    >
                                        <PiArrowUpRightBold className="h-4 w-4" />
                                    </span>
                                </motion.a>
                            </motion.li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default PlayfulBentoTrustBadges

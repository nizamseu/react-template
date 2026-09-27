// HeritageVenueSolidarityFundCTA

// CTA05 · Directories & Search Aggregators › Banner CTAs

// Description:
// Dark fundraising banner for a "Heritage Craft & Venue Solidarity Fund":
// "Protect Historic Brick-and-Mortar Spaces Against Commercial Displacement".
// It explains zero-interest micro-grants for 50+ year-old bookstores, print
// shops and tailors facing rent hikes, with a "Donate to Heritage Fund" button.

// Design:
// - Flex column → md:flex-row (md:items-center, justify-between): copy
//   (max-w-xl) left, button right
// - Dark #1b2b27 background, #e3ece9 / white text (white/70 body), #527354/40
//   border, lime #d9f064 eyebrow and outline button, rose-400 heart icon
// - Eyebrow font-mono 10px uppercase tracking-widest; heading font-serif
//   text-3xl font-light; rounded-2xl section; rounded-full outline button that
//   fills lime (text #1b2b27) on hover
// - The button sits under the copy until md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Donate to Heritage Fund" links to #solidarity-fund

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HeritageVenueSolidarityFundCTA from '@/TestComponent/SectionDesigns/Sections/directory/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <HeritageVenueSolidarityFundCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineHeart } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function HeritageVenueSolidarityFundCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-2xl border border-[#527354]/40 bg-[#1b2b27] p-8 text-[#e3ece9] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#d9f064]">
                        <HiOutlineHeart className="text-sm text-rose-400" /> HERITAGE CRAFT & VENUE SOLIDARITY FUND
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Protect Historic Brick-and-Mortar Spaces Against Commercial Displacement
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Our solidarity fund awards emergency zero-interest micro-grants to 50+ year-old bookstores, print shops, and heritage tailors facing commercial rent hikes.
                    </p>
                </div>

                <a
                    href="#solidarity-fund"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9f064] px-6 py-3.5 font-mono text-xs font-bold text-[#d9f064] hover:bg-[#d9f064] hover:text-[#1b2b27] transition-colors shrink-0"
                >
                    <span>Donate to Heritage Fund</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default HeritageVenueSolidarityFundCTA

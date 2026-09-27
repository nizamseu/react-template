// CircularEditLimeSplitHero

// Hero03 · E-commerce & Marketplaces › Hero sections

// Description:
// Bold, sustainability-led fashion hero for "The Circular Edit". The left column shows the
// eyebrow "A smaller footprint / a longer life", the heavy uppercase headline "Wear it on
// repeat.", copy about pieces made to be repaired, reworn and handed down, and a pill
// "Shop circular" button; the right column is a styled clothing photo.

// Design:
// - Grid md:grid-cols-[1.2fr_.8fr]; the text column is flex-col justify-between with the
//   eyebrow on top, the headline block (py-12) in the middle and "01 / 05 THE CIRCULAR
//   EDIT" at the bottom.
// - Lime #d6f36a background with inherited text colour (none set); CTA pill #1c1b19 with
//   white text; no dark-mode variants.
// - Sans headline font-black uppercase text-5xl → sm:text-7xl (leading-[.9]); eyebrow
//   text-xs bold uppercase tracking-[.16em]; rounded-full CTA; rounded-lg shell.
// - Stacks on mobile with the image at h-72 below the text; from md the image fills the
//   column height (md:h-full).

// What it does:
// - Purely presentational: no content props, no state.
// - One anchor CTA "Shop circular" → #circular (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CircularEditLimeSplitHero from '@/TestComponent/SectionDesigns/Sections/ecommerce/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CircularEditLimeSplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CircularEditLimeSplitHero({
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
                'grid overflow-hidden rounded-lg bg-[#d6f36a] md:grid-cols-[1.2fr_.8fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.16em]">
                    A smaller footprint / a longer life
                </p>
                <div className="py-12">
                    <h2 className="max-w-xl text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                        Wear it
                        <br />
                        on repeat.
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6">
                        Every piece in the circular edit is made to be repaired,
                        reworn, and handed down.
                    </p>
                    <a
                        href="#circular"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1c1b19] px-5 py-3 text-sm font-semibold text-white"
                    >
                        Shop circular <HiArrowRight />
                    </a>
                </div>
                <p className="text-xs">01 / 05 &nbsp; THE CIRCULAR EDIT</p>
            </div>
            <img
                className="h-72 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
                alt="Thoughtfully styled everyday clothing"
            />
        </section>
    )
}

export default CircularEditLimeSplitHero

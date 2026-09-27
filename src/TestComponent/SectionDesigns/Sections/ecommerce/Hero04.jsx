// IndependentMakersStaggeredCollageHero

// Hero04 · E-commerce & Marketplaces › Hero sections

// Description:
// Maker-focused marketplace hero with the eyebrow "Made by the many" and the serif
// headline "One good thing at a time.". Short copy introduces independent makers building
// useful objects, followed by a "Meet the makers" link, next to a two-photo collage of
// handmade ceramics and an independent fashion collection.

// Design:
// - Padded card (p-5 → sm:p-8) with grid gap-6 and lg:grid-cols-[.72fr_1.28fr]; the image
//   area is a 2-column grid where the second photo is pushed down (mt-8 → sm:mt-12) for a
//   staggered look.
// - Light palette: #f7f5f0 background, #27231e headline, #6a5039 eyebrow, gray-600 copy and
//   a blue #2a85ff link accent. Dark mode: gray-800 background, white headline, gray-300 copy.
// - Serif headline text-5xl → sm:text-6xl (leading-[.98]); eyebrow text-xs bold uppercase
//   tracking-[.14em]; photos rounded-lg object-cover at h-52 → sm:h-72; rounded-lg shell.
// - Text stacks above the collage below lg; the collage always stays two columns.

// What it does:
// - Purely presentational: no content props, no state.
// - One anchor CTA "Meet the makers" → #makers (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IndependentMakersStaggeredCollageHero from '@/TestComponent/SectionDesigns/Sections/ecommerce/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <IndependentMakersStaggeredCollageHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function IndependentMakersStaggeredCollageHero({
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
                'grid gap-6 rounded-lg bg-[#f7f5f0] p-5 dark:bg-gray-800 sm:p-8 lg:grid-cols-[.72fr_1.28fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#6a5039]">
                        Made by the many
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.98] text-[#27231e] dark:text-white sm:text-6xl">
                        One good thing at a time.
                    </h2>
                </div>
                <p className="my-6 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Meet independent makers building useful objects with a
                    lighter touch.
                </p>
                <a
                    href="#makers"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2a85ff]"
                >
                    Meet the makers <HiArrowRight />
                </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <img
                    className="h-52 w-full rounded-lg object-cover sm:h-72"
                    src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=85"
                    alt="Handmade ceramic homewares"
                />
                <img
                    className="mt-8 h-52 w-full rounded-lg object-cover sm:mt-12 sm:h-72"
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85"
                    alt="Independent fashion collection"
                />
            </div>
        </section>
    )
}

export default IndependentMakersStaggeredCollageHero

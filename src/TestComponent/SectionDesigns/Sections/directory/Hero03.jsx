// LocalCategoryChipsHero

// Hero03 · Directories & Search Aggregators › Hero sections

// Description:
// Lime split hero headed "A local index for everyday needs" with the headline
// "Find your kind of local." Visitors jump into a category via pill chips
// (Home, Food, Care, Creative) or follow "Browse all categories"; a photo of a
// lively neighborhood street fills the other half.

// Design:
// - Grid md:grid-cols-[1fr_.85fr]: text column (flex justify-between) + image
// - Lime #d9f064 background, deep green #1a2826 text, olive #9bae4b chip
//   borders; bright, light feel
// - Eyebrow text-xs bold uppercase tracking-[.15em]; headline text-5xl →
//   sm:text-6xl font-black leading-[.92]; outlined rounded-full chips;
//   rounded-lg section with overflow-hidden
// - Below md the image stacks under the text at h-64; from md it fills the full
//   column height (md:h-full); padding p-7 → sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - Maps ['Home', 'Food', 'Care', 'Creative'] to chip links (all
//   href="#category"); "Browse all categories" links to #browse

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LocalCategoryChipsHero from '@/TestComponent/SectionDesigns/Sections/directory/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <LocalCategoryChipsHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LocalCategoryChipsHero({
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
                'grid overflow-hidden rounded-lg bg-[#d9f064] text-[#1a2826] md:grid-cols-[1fr_.85fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em]">
                    A LOCAL INDEX FOR EVERYDAY NEEDS
                </p>
                <h2 className="my-9 text-5xl font-black leading-[.92] sm:text-6xl">
                    Find your kind of local.
                </h2>
                <div className="flex flex-wrap gap-2">
                    {['Home', 'Food', 'Care', 'Creative'].map((tag) => (
                        <a
                            key={tag}
                            href="#category"
                            className="rounded-full border border-[#9bae4b] px-4 py-2 text-xs"
                        >
                            {tag}
                        </a>
                    ))}
                </div>
                <a
                    href="#browse"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold"
                >
                    Browse all categories <HiArrowRight />
                </a>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85"
                alt="A lively neighborhood with independent shops"
            />
        </section>
    )
}

export default LocalCategoryChipsHero

// NeighborhoodIndexDarkSearchHero

// Hero02 · Directories & Search Aggregators › Hero sections

// Description:
// Single-column dark hero for "The Neighborhood Index". The headline "Good
// people for the work ahead." and a "find, compare, choose with confidence"
// pitch sit above a wide white search form ("Try 'bike repair' or 'tax
// advisor'") and a muted "Independent · Verified · Nearby" trust line.

// Design:
// - Stacked, left-aligned column; headline max-w-3xl, search form max-w-2xl
// - Dark #1a2826 background with white text (white/60 and white/40 secondary),
//   lime #d9f064 eyebrow and Search button, #527354 search icon; dark feel
// - Eyebrow text-xs bold uppercase tracking-[.15em]; headline text-5xl →
//   sm:text-7xl font-black leading-[.94]; rounded-lg section and form,
//   rounded-md bold button
// - Padding p-7 → sm:p-11 and the headline size step up at sm; the search form
//   stays on a single row at every width

// What it does:
// - No content props or state; the form's onSubmit calls e.preventDefault(), so
//   pressing Enter does nothing and the uncontrolled input value is unused
// - "Search" is an anchor to #search (not a submit button)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeighborhoodIndexDarkSearchHero from '@/TestComponent/SectionDesigns/Sections/directory/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NeighborhoodIndexDarkSearchHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NeighborhoodIndexDarkSearchHero({
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
                'rounded-lg bg-[#1a2826] p-7 text-white sm:p-11',
                className,
            )}
            {...props}
        >
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#d9f064]">
                THE NEIGHBORHOOD INDEX
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[.94] sm:text-7xl">
                Good people for the work ahead.
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/60">
                Find a local expert. Compare the useful details. Choose with
                confidence.
            </p>
            <form
                className="mt-7 flex max-w-2xl items-center gap-3 rounded-lg bg-white p-2 text-[#1a2826]"
                onSubmit={(e) => e.preventDefault()}
            >
                <HiOutlineSearch className="ml-2 shrink-0 text-[#527354]" />
                <input
                    aria-label="Search the directory"
                    placeholder="Try 'bike repair' or 'tax advisor'"
                    className="min-w-0 flex-1 py-2 text-sm outline-none"
                />
                <a
                    href="#search"
                    className="flex items-center gap-2 rounded-md bg-[#d9f064] px-4 py-3 text-xs font-bold"
                >
                    Search <HiArrowRight />
                </a>
            </form>
            <p className="mt-5 text-xs text-white/40">
                Independent · Verified · Nearby
            </p>
        </section>
    )
}

export default NeighborhoodIndexDarkSearchHero

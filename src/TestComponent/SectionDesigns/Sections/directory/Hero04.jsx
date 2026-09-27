// CityGuideTwoToneStatementHero

// Hero04 · Directories & Search Aggregators › Hero sections

// Description:
// Typographic statement hero for the "Good Neighbor / City Guide". A very large
// headline "A shortcut to people who care about their work." is followed by a
// line about trusted neighborhood recommendations and a "See who's nearby"
// pill button. No search field and no image.

// Design:
// - Single block (min-h-[390px]) with an absolutely positioned dark panel
//   covering the right 42% behind the content (isolate + -z-10); the bottom row
//   uses flex-wrap justify-between for the copy and the button
// - Lime #d9f064 background with a deep green #1a2826 panel; #1a2826 text and a
//   #1a2826 pill with white text
// - Eyebrow text-xs bold uppercase tracking-[.15em]; headline max-w-2xl
//   text-5xl → sm:text-7xl font-black leading-[.92]; rounded-lg section,
//   rounded-full button
// - Padding p-7 → sm:p-11 and headline size step up at sm; the dark panel keeps
//   its 42% width at every breakpoint; the button wraps under the copy when
//   space runs out

// What it does:
// - Purely presentational: no content props, no state
// - "See who's nearby" links to #nearby

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CityGuideTwoToneStatementHero from '@/TestComponent/SectionDesigns/Sections/directory/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CityGuideTwoToneStatementHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CityGuideTwoToneStatementHero({
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
                'relative isolate min-h-[390px] overflow-hidden rounded-lg bg-[#d9f064] p-7 text-[#1a2826] sm:p-11',
                className,
            )}
            {...props}
        >
            <div className="absolute right-0 top-0 -z-10 h-full w-[42%] bg-[#1a2826]" />
            <p className="text-xs font-bold uppercase tracking-[.15em]">
                GOOD NEIGHBOR / CITY GUIDE
            </p>
            <h2 className="mt-5 max-w-2xl text-5xl font-black leading-[.92] sm:text-7xl">
                A shortcut to people who care about their work.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-sm text-sm">
                    Trusted recommendations from the neighborhoods you call
                    home.
                </p>
                <a
                    href="#nearby"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    See who&apos;s nearby <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default CityGuideTwoToneStatementHero

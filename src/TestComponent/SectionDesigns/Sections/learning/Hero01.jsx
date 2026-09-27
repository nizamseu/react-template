// LearningStudioSplitHeroWithStreakBadge

// Hero01 · Learning Management & EdTech › Hero sections

// Description:
// Two-column landing hero for the "Fieldnote / Learning Studio" brand. The left
// column pairs the serif headline "Learn the thing you came here for." with a
// pitch about short lessons and real projects plus a "Find your path" CTA; the
// right column is a learners photo with a white "Your learning streak: 4 days" badge.

// Design:
// - CSS grid, one column on mobile and `md:grid-cols-[1fr_1.05fr]`; left column
//   is flex-col justify-between (eyebrow top, headline/CTA middle, tagline bottom)
// - Dark palette: #102d36 background, white text (white/65, white/45), lime
//   #c8ef70 eyebrow and CTA, #d9d7c9 image placeholder, #3c7e5d trend arrow
// - xs bold uppercase eyebrow (.15em tracking), serif headline text-5xl ->
//   sm:text-6xl (leading .98), rounded-full CTA pill, square white stat badge;
//   outer wrapper rounded-lg with overflow-hidden
// - Below md the image stacks under the text (min-h-72, object-cover);
//   padding grows from p-7 to sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Find your path" -> #courses (HiArrowRight icon); the
//   streak badge is static text over an Unsplash image

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LearningStudioSplitHeroWithStreakBadge from '@/TestComponent/SectionDesigns/Sections/learning/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <LearningStudioSplitHeroWithStreakBadge />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LearningStudioSplitHeroWithStreakBadge({
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
                'grid overflow-hidden rounded-lg bg-[#102d36] text-white md:grid-cols-[1fr_1.05fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#c8ef70]">
                    FIELDNOTE / LEARNING STUDIO
                </p>
                <div className="my-10">
                    <h2 className="max-w-lg font-serif text-5xl leading-[.98] sm:text-6xl">
                        Learn the thing you came here for.
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                        Short lessons, real projects, and a clear next step
                        every time you log in.
                    </p>
                    <a
                        href="#courses"
                        className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#c8ef70] px-5 py-3 text-sm font-bold text-[#102d36]"
                    >
                        Find your path <HiArrowRight />
                    </a>
                </div>
                <p className="text-xs text-white/45">
                    A good skill changes your next chapter.
                </p>
            </div>
            <div className="relative min-h-72 bg-[#d9d7c9]">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
                    alt="Learners collaborating around a table"
                />
                <div className="absolute bottom-5 left-5 bg-white p-4 text-[#102d36]">
                    <p className="text-[10px] font-bold uppercase">
                        Your learning streak
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                        4 days <span className="text-[#3c7e5d]">↗</span>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default LearningStudioSplitHeroWithStreakBadge

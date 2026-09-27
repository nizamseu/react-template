// UsefulThingsSerifSplitHero

// Hero03 · Portfolios & Personal Websites › Hero sections

// Description:
// Half-and-half hero for "Jamie Park / Designer". The coral text half carries a
// serif headline "Useful things with feeling.", a sentence about product,
// identity and experiments "for teams with good questions", and an
// "A little about me" link; the other half is a photo of a creative workspace.

// Design:
// - Two equal grid columns (md:grid-cols-[1fr_1fr]); the text column is
//   flex-col justify-between.
// - Warm, bold palette: coral #ef6a4b background with espresso text #241d1a;
//   the photo supplies the remaining colour.
// - Headline font-serif text-5xl → sm:text-6xl at regular weight with
//   leading-[.94]; xs bold uppercase byline (tracking-[.15em]); text-sm
//   semibold link; rounded-lg with overflow-hidden.
// - Single column below md with the image at h-64 under the text; from md the
//   image fills the column height (md:h-full); padding p-7 → sm:p-11.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "A little about me" → #about (HiArrowRight icon); the
//   image is a remote Unsplash URL.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import UsefulThingsSerifSplitHero from '@/TestComponent/SectionDesigns/Sections/portfolio/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <UsefulThingsSerifSplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function UsefulThingsSerifSplitHero({
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
                'grid overflow-hidden rounded-lg bg-[#ef6a4b] text-[#241d1a] md:grid-cols-[1fr_1fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em]">
                    JAMIE PARK / DESIGNER
                </p>
                <h2 className="my-10 font-serif text-5xl leading-[.94] sm:text-6xl">
                    Useful things
                    <br />
                    with feeling.
                </h2>
                <p className="max-w-sm text-sm">
                    Product, identity, and experiments for teams with good
                    questions.
                </p>
                <a
                    href="#about"
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold"
                >
                    A little about me <HiArrowRight />
                </a>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85"
                alt="Independent creative studio workspace"
            />
        </section>
    )
}

export default UsefulThingsSerifSplitHero

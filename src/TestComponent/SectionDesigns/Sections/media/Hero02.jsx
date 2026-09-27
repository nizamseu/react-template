// DarkCreativeLifeEssaySplitHero

// Hero02 · Blogs & Digital Media › Hero sections

// Description:
// A moody split hero promoting a single long-form essay from issue 018,
// "The Creative Life". The large serif headline "What we make / when no one
// asks." is paired with a writer-at-work photo, and a byline row credits
// "Essay by Nina Cole / 9 min read" with an arrow link to read it.

// Design:
// - Grid with text panel and full-height image `md:grid-cols-[1fr_.8fr]`;
//   the text panel is a vertical flex (kicker top, headline middle, byline
//   row bottom)
// - Dark espresso palette: background #28221e, cream text #f3eee5, peach
//   accent #e7a37c on the kicker, divider in white/20
// - Serif headline text-5xl → sm:text-7xl, leading-[.94], forced line break;
//   xs uppercase kicker with wide tracking; rounded-lg outer corners with
//   overflow-hidden so the photo is clipped
// - Stacks below md: the image moves under the text at a fixed h-64 and
//   stretches to full height (md:h-full) from md up; padding p-7 → sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - Icon-only arrow link to `#read` (aria-label "Read this essay");
//   image is a remote Unsplash photo

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DarkCreativeLifeEssaySplitHero from '@/TestComponent/SectionDesigns/Sections/media/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DarkCreativeLifeEssaySplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DarkCreativeLifeEssaySplitHero({
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
                'grid overflow-hidden rounded-lg bg-[#28221e] text-[#f3eee5] md:grid-cols-[1fr_.8fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs uppercase tracking-[.18em] text-[#e7a37c]">
                    ISSUE 018 / THE CREATIVE LIFE
                </p>
                <h2 className="my-10 font-serif text-5xl leading-[.94] sm:text-7xl">
                    What we make
                    <br />
                    when no one asks.
                </h2>
                <div className="flex items-center justify-between border-t border-white/20 pt-4 text-xs">
                    <span>Essay by Nina Cole / 9 min read</span>
                    <a href="#read" aria-label="Read this essay">
                        <HiArrowRight className="text-xl" />
                    </a>
                </div>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85"
                alt="Writer working in a notebook"
            />
        </section>
    )
}

export default DarkCreativeLifeEssaySplitHero

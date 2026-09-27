// SundayEditionMagazineCoverHero

// Hero01 · Blogs & Digital Media › Hero sections

// Description:
// A print-magazine style cover for the "Sunday edition" of a slow-reading
// publication. A volume strip ("Volume 08 · The attention issue · Autumn
// 2026") sits above the big serif headline "The art of paying attention.",
// a short standfirst, a round arrow button and a photo tagged "Long read · 12 min".

// Design:
// - Rounded card with a centred top strip (bottom rule), then a two-column
//   grid `lg:grid-cols-[1.15fr_.85fr]`: text column (kicker + headline on top,
//   standfirst + button pinned to the bottom) and an image column
// - Warm light paper palette: background #f1eee6, ink #1f201c, terracotta
//   accent #a8472b (kicker, button), muted copy #626159, strip rule #c8c2b5
// - Serif display headline text-5xl → sm:text-7xl with tight leading-[.94];
//   tiny 10px bold uppercase tracked strip; 48px round filled arrow button;
//   image fills its box (object-cover) with a paper-coloured caption tag
//   pinned bottom-left
// - Single column below lg (image drops under the text, min height 16rem);
//   padding grows from p-6 to sm:p-9

// What it does:
// - Purely presentational: no content props, no state
// - One round icon link to `#story` (aria-label "Read the feature");
//   image is a remote Unsplash photo

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SundayEditionMagazineCoverHero from '@/TestComponent/SectionDesigns/Sections/media/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SundayEditionMagazineCoverHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SundayEditionMagazineCoverHero({
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
                'overflow-hidden rounded-lg bg-[#f1eee6] text-[#1f201c]',
                className,
            )}
            {...props}
        >
            <div className="border-b border-[#c8c2b5] px-6 py-3 text-center text-[10px] font-bold uppercase tracking-[.2em]">
                Volume 08 · The attention issue · Autumn 2026
            </div>
            <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.15fr_.85fr]">
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#a8472b]">
                            The Sunday edition
                        </p>
                        <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.94] sm:text-7xl">
                            The art of paying attention.
                        </h2>
                    </div>
                    <div className="mt-8 flex items-end justify-between gap-4">
                        <p className="max-w-xs text-sm leading-6 text-[#626159]">
                            A field guide to noticing more, scrolling less, and
                            making room for wonder.
                        </p>
                        <a
                            href="#story"
                            aria-label="Read the feature"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#a8472b] text-white"
                        >
                            <HiArrowRight />
                        </a>
                    </div>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85"
                        alt="Warm morning light across a quiet landscape"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#f1eee6] px-3 py-2 text-[10px] uppercase">
                        Long read · 12 min
                    </span>
                </div>
            </div>
        </section>
    )
}

export default SundayEditionMagazineCoverHero

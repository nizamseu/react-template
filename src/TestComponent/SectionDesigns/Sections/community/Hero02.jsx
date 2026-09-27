// InterestRoomsTileGridHero

// Hero02 · Social Networks & Communities › Hero sections

// Description:
// A cream split hero for the COMMONROOM brand built around the idea that shared interests are
// the best place to meet ("Interest is a good place to meet."). The left column carries the
// pitch and an "Explore the rooms" link; the right column shows four colourful interest-room
// tiles (Book club, Gardeners, Indie games, Sunday cooks).

// Design:
// - Grid md:grid-cols-[.8fr_1.2fr]: text column (flex-col, justify-between) plus a 2×2 tile grid (gap-3)
// - Palette: cream #f7ede6 background, dark brown #27201d text, rust #a34c38 eyebrow, gray-500
//   footnote; tiles in #ffccad, #d5e6bb, #c6d9f0 and #efbb90 (light, pastel feel)
// - Typography & shapes: uppercase bold eyebrow (tracking .15em), font-black headline text-5xl →
//   sm:text-6xl with .93 leading; tiles are rounded-lg, min-h-32, bold text-sm labels at bottom-left
// - Responsive: columns stack below md (tiles under the text); tiles stay two per row at all
//   widths; padding p-7 / p-4 → sm:p-11 / sm:p-6

// What it does:
// - Purely presentational: no content props, no state
// - Tiles are rendered by mapping an inline [name, color] array (colour applied via inline style);
//   the tiles are not links
// - Text link "Explore the rooms" → #groups (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InterestRoomsTileGridHero from '@/TestComponent/SectionDesigns/Sections/community/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <InterestRoomsTileGridHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function InterestRoomsTileGridHero({
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
                'grid overflow-hidden rounded-lg bg-[#f7ede6] text-[#27201d] md:grid-cols-[.8fr_1.2fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a34c38]">
                    COMMONROOM / FIND YOUR PEOPLE
                </p>
                <h2 className="my-10 text-5xl font-black leading-[.93] sm:text-6xl">
                    Interest is a good place to meet.
                </h2>
                <a
                    href="#groups"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Explore the rooms <HiArrowRight />
                </a>
                <p className="mt-6 text-xs text-gray-500">
                    Good conversations start with a shared thing.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
                {[
                    ['Book club', '#ffccad'],
                    ['Gardeners', '#d5e6bb'],
                    ['Indie games', '#c6d9f0'],
                    ['Sunday cooks', '#efbb90'],
                ].map(([name, color]) => (
                    <div
                        key={name}
                        className="flex min-h-32 items-end rounded-lg p-4 text-sm font-bold"
                        style={{ backgroundColor: color }}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default InterestRoomsTileGridHero

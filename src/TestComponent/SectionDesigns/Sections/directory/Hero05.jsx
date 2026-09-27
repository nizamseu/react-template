// UseMyLocationCategoryTilesHero

// Hero05 · Directories & Search Aggregators › Hero sections

// Description:
// Soft sage hero themed "Start with your street". The left column carries the
// headline "The right place is closer than you think.", a line about searching
// independent shops and services, and a "Use my location" button; the right
// column is a 2×2 grid of large category tiles.

// Design:
// - Grid md:grid-cols-[.8fr_1.2fr]: text column + tile grid (grid-cols-2 gap-3)
// - Pale sage #edf1e6 background, #1a2826 text, #527354 eyebrow, gray-600 body;
//   tiles alternate sage #c9d6c1 and lime #d9f064; dark #1a2826 button with
//   white text
// - Eyebrow text-xs bold uppercase tracking-[.14em]; headline text-5xl
//   font-black leading-[.92]; tiles min-h-28 rounded-lg with bold labels
//   aligned to the bottom; rounded-md button
// - Below md the tile grid stacks under the text (still 2 tiles per row);
//   padding p-7 → sm:p-11 (text) and p-4 → sm:p-6 (tiles)

// What it does:
// - Purely presentational: no content props, no state; "Use my location" is a plain
//   anchor to #location (no geolocation logic)
// - Maps ['Repair', 'Eat well', 'Get outside', 'Make things'] to tile links
//   (href="#category"), colouring them by index % 2

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import UseMyLocationCategoryTilesHero from '@/TestComponent/SectionDesigns/Sections/directory/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <UseMyLocationCategoryTilesHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function UseMyLocationCategoryTilesHero({
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
                'grid overflow-hidden rounded-lg bg-[#edf1e6] text-[#1a2826] md:grid-cols-[.8fr_1.2fr]',
                className,
            )}
            {...props}
        >
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                    START WITH YOUR STREET
                </p>
                <h2 className="mt-4 text-5xl font-black leading-[.92]">
                    The right place is closer than you think.
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    Search independent shops and services, filtered by what
                    matters to you.
                </p>
                <a
                    href="#location"
                    className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    <HiOutlineLocationMarker /> Use my location <HiArrowRight />
                </a>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
                {['Repair', 'Eat well', 'Get outside', 'Make things'].map(
                    (name, index) => (
                        <a
                            key={name}
                            href="#category"
                            className={`flex min-h-28 items-end rounded-lg p-4 text-sm font-bold ${index % 2 ? 'bg-[#d9f064]' : 'bg-[#c9d6c1]'}`}
                        >
                            {name}
                        </a>
                    ),
                )}
            </div>
        </section>
    )
}

export default UseMyLocationCategoryTilesHero

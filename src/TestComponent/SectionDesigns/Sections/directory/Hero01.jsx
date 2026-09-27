// GoodNeighborSplitSearchHero

// Hero01 · Directories & Search Aggregators › Hero sections

// Description:
// Lime split-screen hero for the "Good Neighbor / Local Index" directory. The
// left column pairs the headline "Find good work nearby." and a short pitch
// with a white search bar (service input, "Your area" button, Search link);
// the right column shows a full-bleed photo of an independent neighborhood shop.

// Design:
// - Two-column grid md:grid-cols-[1fr_.8fr], min-h-[390px]; the text column uses
//   flex justify-between to pin the eyebrow top and the trust line bottom
// - Lime #d9f064 background with deep green #1a2826 text, a white search bar and
//   a #1a2826 Search button with white text: bright, light feel
// - Eyebrow text-xs bold uppercase tracking-[.16em]; headline text-5xl →
//   sm:text-7xl font-black leading-[.92]; rounded-lg section, rounded-md button
// - Below md the photo column is hidden (hidden md:block); below sm the search
//   bar stacks vertically (flex-col → sm:flex-row); padding p-7 → sm:p-11

// What it does:
// - Purely presentational: no content props, no state; the search input is uncontrolled
//   and the "Your area" button has no handler
// - "Search" is an anchor to #search; icons from react-icons/hi (search,
//   location marker, arrow); photo loaded from Unsplash

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GoodNeighborSplitSearchHero from '@/TestComponent/SectionDesigns/Sections/directory/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <GoodNeighborSplitSearchHero />
//     </main>
// )
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineLocationMarker,
    HiOutlineSearch,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GoodNeighborSplitSearchHero({
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
                'overflow-hidden rounded-lg bg-[#d9f064] text-[#1a2826]',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[390px] md:grid-cols-[1fr_.8fr]">
                <div className="flex flex-col justify-between p-7 sm:p-11">
                    <p className="text-xs font-bold uppercase tracking-[.16em]">
                        GOOD NEIGHBOR / LOCAL INDEX
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-xl text-5xl font-black leading-[.92] sm:text-7xl">
                            Find good work nearby.
                        </h2>
                        <p className="mt-4 max-w-sm text-sm">
                            A useful directory of independent businesses and
                            people worth knowing.
                        </p>
                        <div className="mt-6 flex flex-col gap-2 rounded-lg bg-white p-2 sm:flex-row">
                            <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
                                <HiOutlineSearch />
                                <input
                                    aria-label="Search services"
                                    placeholder="What do you need?"
                                    className="min-w-0 flex-1 py-2 text-sm outline-none"
                                />
                            </label>
                            <button className="flex items-center gap-2 border-l px-3 text-xs">
                                <HiOutlineLocationMarker /> Your area
                            </button>
                            <a
                                href="#search"
                                className="flex items-center justify-center gap-2 rounded-md bg-[#1a2826] px-4 py-3 text-sm text-white"
                            >
                                Search <HiArrowRight />
                            </a>
                        </div>
                    </div>
                    <p className="text-xs">
                        Verified listings · Local recommendations
                    </p>
                </div>
                <div className="relative hidden min-h-64 md:block">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85"
                        alt="Independent neighborhood shop"
                    />
                </div>
            </div>
        </section>
    )
}

export default GoodNeighborSplitSearchHero

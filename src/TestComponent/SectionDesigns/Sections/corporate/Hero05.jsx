// PhotoOverlayAdvisoryHeadlineHero

// Hero05 · Corporate & Business › Hero sections

// Description:
// Single-column dark hero for "NORTHSTAR / BUSINESS ADVISORY" with the large headline
// "Make the complicated make sense." set over a faint office photograph. Beneath it, a
// line about guiding leaders through high-stakes change sits opposite an underlined
// "Meet your partners" link.

// Design:
// - relative isolate section; background image absolute inset-0 -z-10, object-cover at
//   opacity-20; content flows top-down with a bottom row using flex-wrap justify-between
// - Dark navy #121c2c base with white text; sky-blue #84b9ff for the eyebrow and the
//   link underline; supporting copy in white/65
// - Headline text-5xl -> sm:text-7xl, font-semibold, leading-[.95], max-w-3xl; eyebrow
//   text-xs bold uppercase tracking-[.15em]; link underlined via border-b; rounded-lg
// - Padding p-7 -> sm:p-12; on narrow widths the bottom row wraps so the link drops
//   below the copy

// What it does:
// - Purely presentational: no content props, no state
// - Single text link "Meet your partners" -> #team with an HiArrowRight icon; the
//   Unsplash background image is decorative (alt="")

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PhotoOverlayAdvisoryHeadlineHero from '@/TestComponent/SectionDesigns/Sections/corporate/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PhotoOverlayAdvisoryHeadlineHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PhotoOverlayAdvisoryHeadlineHero({
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
                'relative isolate overflow-hidden rounded-lg bg-[#121c2c] p-7 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
                alt=""
            />
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#84b9ff]">
                NORTHSTAR / BUSINESS ADVISORY
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[.95] sm:text-7xl">
                Make the complicated make sense.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <p className="max-w-sm text-sm text-white/65">
                    We help leaders find a practical way through high-stakes
                    change.
                </p>
                <a
                    href="#team"
                    className="inline-flex items-center gap-2 border-b border-[#84b9ff] pb-2 text-sm"
                >
                    Meet your partners <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default PhotoOverlayAdvisoryHeadlineHero

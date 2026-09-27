// CopenhagenDepartmentStoreImageHero

// Hero02 · E-commerce & Marketplaces › Hero sections

// Description:
// Full-bleed photographic hero for a curated "different kind of department store". A
// dimmed clothing-collection photo fills the background while a bottom-left text stack
// shows the lime eyebrow "Good finds, no rush", the two-line serif headline "A different
// kind of department store." and a "Browse the edit" link; a "Curated in Copenhagen /
// 2026" tag sits in the top-right corner.

// Design:
// - Single relative, isolated section (min-h-[440px]); the background img is absolutely
//   positioned with -z-10 and opacity-55; the content column is flex-col justify-end so
//   the copy anchors to the bottom edge.
// - Always-dark palette: espresso #211d18 base, white text, lime accent #d6f36a on the
//   eyebrow; no separate dark-mode classes.
// - Serif headline text-5xl → sm:text-7xl (leading-[.95], max-w-3xl) with a forced line
//   break; eyebrow text-xs bold uppercase tracking-[0.18em]; underline-style CTA
//   (border-b border-white); rounded-lg corners.
// - Padding p-7 → sm:p-12; the top-right location tag is hidden below sm.

// What it does:
// - Purely presentational: no content props, no state.
// - One anchor CTA "Browse the edit" → #departments (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CopenhagenDepartmentStoreImageHero from '@/TestComponent/SectionDesigns/Sections/ecommerce/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CopenhagenDepartmentStoreImageHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CopenhagenDepartmentStoreImageHero({
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
                'relative isolate min-h-[440px] overflow-hidden rounded-lg bg-[#211d18] text-white',
                className,
            )}
            {...props}
        >
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=85"
                alt="Friends exploring a clothing collection"
            />
            <div className="flex min-h-[440px] flex-col justify-end p-7 sm:p-12">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6f36a]">
                    Good finds, no rush
                </span>
                <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.95] sm:text-7xl">
                    A different kind
                    <br />
                    of department store.
                </h2>
                <a
                    href="#departments"
                    className="mt-7 inline-flex items-center gap-3 self-start border-b border-white pb-2 text-sm"
                >
                    Browse the edit <HiArrowRight />
                </a>
            </div>
            <span className="absolute right-8 top-8 hidden text-xs sm:block">
                Curated in Copenhagen / 2026
            </span>
        </section>
    )
}

export default CopenhagenDepartmentStoreImageHero

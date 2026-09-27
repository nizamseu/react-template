// KinderInternetTwoToneHero

// Hero03 · Social Networks & Communities › Hero sections

// Description:
// A dark, purely typographic hero with the eyebrow "A SMALLER, KINDER INTERNET" and the headline
// "Find a corner that feels like yours." It invites visitors to join groups of curious, generous
// people and offers a single "Come on in" button. No imagery, just a bold two-tone backdrop.

// Design:
// - Single padded block; an absolutely positioned rust panel fills the right half behind the
//   content (isolate + -z-10), creating a split two-tone background
// - Palette: dark brown #27201d base, rust #a34c38 half panel, peach #ffccad eyebrow and pill
//   button, white headline with white/65 body text; dark, high-contrast feel
// - Typography & shapes: font-black headline text-5xl → sm:text-7xl, leading .92, forced line
//   break; uppercase tracked eyebrow (.15em); rounded-lg section, rounded-full CTA
// - Responsive: the bottom row (body copy + CTA) uses flex-wrap so the button drops below the
//   text on narrow screens; padding p-7 → sm:p-12; the rust panel stays at half width on all sizes

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Come on in" → #join (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import KinderInternetTwoToneHero from '@/TestComponent/SectionDesigns/Sections/community/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <KinderInternetTwoToneHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function KinderInternetTwoToneHero({
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
                'relative isolate overflow-hidden rounded-lg bg-[#27201d] p-7 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-[#a34c38]" />
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ffccad]">
                A SMALLER, KINDER INTERNET
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[.92] sm:text-7xl">
                Find a corner
                <br />
                that feels like yours.
            </h2>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                <p className="max-w-sm text-sm leading-6 text-white/65">
                    Join groups where people show up curious, generous, and
                    ready to listen.
                </p>
                <a
                    href="#join"
                    className="inline-flex items-center gap-2 rounded-full bg-[#ffccad] px-5 py-3 text-sm font-semibold text-[#27201d]"
                >
                    Come on in <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default KinderInternetTwoToneHero

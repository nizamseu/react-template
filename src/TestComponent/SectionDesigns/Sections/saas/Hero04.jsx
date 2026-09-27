// SignalToShippedOrbitRingsHero

// Hero04 · SaaS Platforms › Hero sections

// Description:
// A dark, type-led hero with the eyebrow "Built for the whole journey" and the
// large headline "From first signal to shipped work." A mint "Explore the
// platform" button sits beside the muted tagline "One workspace / Every team".
// Two faint concentric circle outlines decorate the top-right corner.

// Design:
// - `relative isolate` <section> with two absolutely positioned decorative rings
//   (h-80 w-80 and h-56 w-56, -z-10) bleeding off the top-right. The content flows
//   normally, and the CTA row uses flex-wrap.
// - Dark base #111a22 with a mint #65e6b4 accent (eyebrow, CTA background, ring
//   borders at /30 and /20 opacity). The CTA text is #111a22 and the tagline
//   white/50.
// - Typography: xs bold uppercase eyebrow, tracking-[.16em]; headline max-w-3xl,
//   text-5xl -> sm:text-7xl semibold, leading-[.95]. The section is rounded-lg
//   (overflow-hidden clips the rings), the button rounded-md and the rings
//   rounded-full.
// - Responsive: a single column at every size. The headline and padding scale up
//   at sm (p-8 -> sm:p-12), and the CTA row wraps on narrow screens.

// What it does:
// - Purely presentational: no content props, no state.
// - One CTA anchor to `#platform` ("Explore the platform") with a HiArrowRight
//   icon.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SignalToShippedOrbitRingsHero from '@/TestComponent/SectionDesigns/Sections/saas/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SignalToShippedOrbitRingsHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SignalToShippedOrbitRingsHero({
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
                'relative isolate overflow-hidden rounded-lg bg-[#111a22] p-8 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="absolute -right-16 -top-20 -z-10 h-80 w-80 rounded-full border border-[#65e6b4]/30" />
            <div className="absolute -right-4 -top-8 -z-10 h-56 w-56 rounded-full border border-[#65e6b4]/20" />
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#65e6b4]">
                BUILT FOR THE WHOLE JOURNEY
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[.95] sm:text-7xl">
                From first signal
                <br />
                to shipped work.
            </h2>
            <div className="mt-7 flex flex-wrap items-center gap-5">
                <a
                    href="#platform"
                    className="inline-flex items-center gap-2 rounded-md bg-[#65e6b4] px-5 py-3 text-sm font-bold text-[#111a22]"
                >
                    Explore the platform <HiArrowRight />
                </a>
                <span className="text-xs text-white/50">
                    One workspace / Every team
                </span>
            </div>
        </section>
    )
}

export default SignalToShippedOrbitRingsHero

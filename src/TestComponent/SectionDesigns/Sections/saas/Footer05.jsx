// BuildWithConfidenceClosingFooter

// Footer05 · SaaS Platforms › Footers

// Description:
// A dark closing footer with a big sign-off: the eyebrow "Build with confidence",
// the headline "Your next chapter starts here." and a "Talk to a specialist" link.
// Below is a slim meta row: "© 2026 Northstar Software", "Built for teams around
// the world" and "LinkedIn ↗ · GitHub ↗".

// Design:
// - <footer> with a flex-col -> md:flex-row (md:items-end, justify-between)
//   sign-off block above a white/15 border-b, then a flex-wrap meta row.
// - Dark base #111a22 with a mint #65e6b4 eyebrow and white/45 meta text.
// - Typography: xs bold uppercase eyebrow with tracking-[.15em]; text-5xl semibold
//   leading-none headline (max-w-2xl). The footer is rounded-lg with
//   overflow-hidden and padding px-7 pt-8 -> sm:px-10 (no bottom padding beyond
//   the meta row).
// - Responsive: the headline and link stack below md and align to the bottom edge
//   from md. The meta items wrap on narrow screens.

// What it does:
// - Purely presentational: no content props, no state.
// - One link to `#talk` with a HiArrowRight icon. "LinkedIn ↗ · GitHub ↗" is plain
//   text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BuildWithConfidenceClosingFooter from '@/TestComponent/SectionDesigns/Sections/saas/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <BuildWithConfidenceClosingFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BuildWithConfidenceClosingFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-lg bg-[#111a22] px-7 pt-8 text-white sm:px-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-7 border-b border-white/15 pb-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#65e6b4]">
                        Build with confidence
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-semibold leading-none">
                        Your next chapter starts here.
                    </h2>
                </div>
                <a href="#talk" className="flex items-center gap-2 text-sm">
                    Talk to a specialist <HiArrowRight />
                </a>
            </div>
            <div className="flex flex-wrap justify-between gap-4 py-4 text-xs text-white/45">
                <span>© 2026 Northstar Software</span>
                <span>Built for teams around the world</span>
                <span>LinkedIn ↗ · GitHub ↗</span>
            </div>
        </footer>
    )
}

export default BuildWithConfidenceClosingFooter

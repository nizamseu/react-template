// WeekendPrintSubscriptionCTA

// CTA01 · Blogs & Digital Media › Banner CTAs

// Description:
// A banner selling home delivery of the weekend print edition. Under
// "WEEKEND PRINT EDITION · HOME DELIVERY" the headline "Hold the Sunday
// Broadsheet in Your Hands." and a note on the paper and 14-city delivery
// lead to a "Subscribe for $12 / Month" button with a small line about the
// included digital vault and audio feeds.

// Design:
// - Two-column grid `lg:grid-cols-[1.2fr_0.8fr]`, vertically centred: copy
//   on the left, button and note on the right
// - Warm paper palette: background #f2efe9, ink #1c1d1a, terracotta accent
//   #a8472b (kicker, button hover), body copy #59554d; button is ink
//   #1c1d1a with white text
// - Serif text-3xl → sm:text-4xl normal-weight headline; monospace 10-11px
//   kicker and note; rounded-full button; square banner with 2px black top
//   and bottom rules
// - Stacks below lg; between sm and lg the button and note sit side by side
//   (sm:flex-row), then stack again from lg; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Subscribe button links to `#subscribe-print`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WeekendPrintSubscriptionCTA from '@/TestComponent/SectionDesigns/Sections/media/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <WeekendPrintSubscriptionCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function WeekendPrintSubscriptionCTA({
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
                'rounded-none border-y-2 border-black bg-[#f2efe9] p-8 text-[#1c1d1a] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#a8472b]">
                        WEEKEND PRINT EDITION &bull; HOME DELIVERY
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Hold the Sunday Broadsheet in Your Hands.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#59554d]">
                        Printed every Friday evening on 90gsm uncoated Swedish broadsheet paper. Hand-delivered to subscribers across 14 cities in North America, Europe, and Japan.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                    <a
                        href="#subscribe-print"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1d1a] px-6 py-3.5 font-serif text-xs font-bold text-white hover:bg-[#a8472b] transition-colors"
                    >
                        <span>Subscribe for $12 / Month</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-black/50 text-center">
                        Includes unmetered digital vault access & audio feeds
                    </span>
                </div>
            </div>
        </section>
    )
}

export default WeekendPrintSubscriptionCTA

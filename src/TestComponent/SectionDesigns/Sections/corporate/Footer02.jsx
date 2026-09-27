// LeadershipBriefingNewsletterFooter

// Footer02 · Corporate & Business › Footers

// Description:
// Light footer promoting the "Northstar / Briefing" newsletter. The headline "Ideas for
// leaders shaping what's next." sits beside an underlined work-email field with an arrow
// submit button, and a bottom row links to Insights, Leadership, Events and Contact.

// Design:
// - Grid md:grid-cols-[1fr_1fr] gap-8 (headline | signup form); link row below as a grid
//   grid-cols-2 -> sm:grid-cols-4 with a top border
// - Pale blue #dce9f6 background, ink #121c2c text, blue #3476c5 eyebrow, #9fb5c9 form
//   underline and #b9cee1 divider - light feel
// - Headline text-4xl font-semibold; eyebrow text-xs bold uppercase tracking-[.14em];
//   transparent borderless input with only a bottom rule; rounded-lg footer
// - Below md the form stacks under the headline; link row is 2 columns on mobile and 4
//   from sm; padding p-7 -> sm:p-10

// What it does:
// - No content props, no state; the form's onSubmit only calls e.preventDefault(), so nothing is
//   sent or stored and no confirmation is shown
// - Email input (id "northstar-brief", type="email") with a sr-only "Work email" label;
//   icon-only submit button (HiArrowRight) with aria-label="Subscribe"
// - Anchors: #insights, #leadership, #events, #contact; no copyright line

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LeadershipBriefingNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/corporate/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <LeadershipBriefingNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LeadershipBriefingNewsletterFooter({
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
                'rounded-lg bg-[#dce9f6] p-7 text-[#121c2c] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                        Northstar / Briefing
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-semibold">
                        Ideas for leaders shaping what&apos;s next.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#9fb5c9]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="northstar-brief">
                        Work email
                    </label>
                    <input
                        id="northstar-brief"
                        type="email"
                        placeholder="Work email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#b9cee1] pt-4 text-xs sm:grid-cols-4">
                <a href="#insights">Insights</a>
                <a href="#leadership">Leadership</a>
                <a href="#events">Events</a>
                <a href="#contact">Contact</a>
            </div>
        </footer>
    )
}

export default LeadershipBriefingNewsletterFooter

// ClaimYourListingLimeFooter

// Footer02 · Directories & Search Aggregators › Footers

// Description:
// Bright lime footer aimed at business owners: "Good businesses deserve to be
// found" / "Put your work on the local map." with a "Claim your listing" text
// link, followed by a row of four directory links. It has no brand name or
// copyright line.

// Design:
// - Grid md:grid-cols-[1fr_.8fr] (heading left, CTA link self-end right), then
//   a border-t link row
// - Lime #d9f064 background, #1a2826 text, olive #aabd4d divider; light feel
// - Eyebrow text-xs bold uppercase tracking-[.14em]; heading text-4xl
//   font-black; bold text CTA with arrow; links text-xs; rounded-lg footer
// - Link row is 2 columns, 4 from sm; the top grid stacks below md; padding
//   p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Links: "Claim your listing" → #claim, Browse the index → #browse,
//   How we verify → #verification, Recommend a place → #recommend, Help → #help

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClaimYourListingLimeFooter from '@/TestComponent/SectionDesigns/Sections/directory/Footer02';

// const AppShell = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <ClaimYourListingLimeFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ClaimYourListingLimeFooter({
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
                'rounded-lg bg-[#d9f064] p-7 text-[#1a2826] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-7 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        Good businesses deserve to be found
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black">
                        Put your work on the local map.
                    </h2>
                </div>
                <a
                    href="#claim"
                    className="inline-flex items-center gap-2 self-end text-sm font-bold"
                >
                    Claim your listing <HiArrowRight />
                </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#aabd4d] pt-4 text-xs sm:grid-cols-4">
                <a href="#browse">Browse the index</a>
                <a href="#verification">How we verify</a>
                <a href="#recommend">Recommend a place</a>
                <a href="#help">Help</a>
            </div>
        </footer>
    )
}

export default ClaimYourListingLimeFooter

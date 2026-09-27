// AddAListingDarkFooter

// Footer01 · Directories & Search Aggregators › Footers

// Description:
// Dark closing footer for the Good Neighbor Index that doubles as a listing
// pitch: "Put your business on the neighborhood map." with an "Add a listing"
// button, a 2×2 block of utility links and a copyright line ("Local, by
// design.").

// Design:
// - Grid md:grid-cols-[1fr_1fr] (gap-8): pitch + CTA left, links right
//   (self-end), then a border-t copyright row
// - Deep green #1a2826 background, white text (white/65 links, white/40 legal),
//   lime #d9f064 eyebrow and pill button with #1a2826 text, white/15 divider
// - Eyebrow text-xs bold uppercase tracking-[.16em]; heading text-4xl
//   font-black; rounded-lg footer, rounded-full button
// - Stacks to one column below md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Links: "Add a listing" → #listing, Browse categories → #categories,
//   Verification → #verification, Recommend a place → #recommend,
//   Help center → #help

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AddAListingDarkFooter from '@/TestComponent/SectionDesigns/Sections/directory/Footer01';

// const AppShell = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <AddAListingDarkFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AddAListingDarkFooter({
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
                'rounded-lg bg-[#1a2826] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d9f064]">
                        Good work should be easy to find
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black">
                        Put your business on the neighborhood map.
                    </h2>
                    <a
                        href="#listing"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d9f064] px-5 py-3 text-sm font-semibold text-[#1a2826]"
                    >
                        Add a listing <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-4 self-end text-sm text-white/65">
                    <a href="#categories">Browse categories</a>
                    <a href="#verification">Verification</a>
                    <a href="#recommend">Recommend a place</a>
                    <a href="#help">Help center</a>
                </div>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/40">
                © Good Neighbor Index · Local, by design.
            </p>
        </footer>
    )
}

export default AddAListingDarkFooter

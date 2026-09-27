// YourIdeaHasACommunityHero

// Hero05 · Social Networks & Communities › Hero sections

// Description:
// A compact, text-only hero on a peach background for a maker/creator community: eyebrow
// "MAKE SOMETHING TOGETHER" and headline "Your idea has a community." The supporting copy
// encourages sharing what you are making, getting thoughtful feedback and celebrating small
// wins, with a "Share your first post" button.

// Design:
// - Two-column grid (md:grid-cols-[.8fr_1.2fr], gap-8): eyebrow + headline left, body copy + CTA
//   right, bottom-aligned (flex-col justify-end)
// - Palette: peach #ffccad background, dark brown #27201d text and pill button with white label;
//   light and warm
// - Typography & shapes: font-black headline text-5xl, leading .94; uppercase tracked eyebrow
//   (.14em); text-sm body; rounded-lg section, rounded-full CTA
// - Responsive: columns stack below md; padding p-7 → sm:p-10; no image, so the height stays compact

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Share your first post" → #share (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import YourIdeaHasACommunityHero from '@/TestComponent/SectionDesigns/Sections/community/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <YourIdeaHasACommunityHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function YourIdeaHasACommunityHero({
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
                'rounded-lg bg-[#ffccad] p-7 text-[#27201d] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        MAKE SOMETHING TOGETHER
                    </p>
                    <h2 className="mt-4 text-5xl font-black leading-[.94]">
                        Your idea has a community.
                    </h2>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="max-w-md text-sm leading-6">
                        Share what you&apos;re making, get thoughtful feedback,
                        and celebrate each small win along the way.
                    </p>
                    <a
                        href="#share"
                        className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-[#27201d] px-5 py-3 text-sm text-white"
                    >
                        Share your first post <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default YourIdeaHasACommunityHero

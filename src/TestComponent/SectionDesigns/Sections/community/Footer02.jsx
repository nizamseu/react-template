// GoodThingsNearbyPeachNewsletterFooter

// Footer02 · Social Networks & Communities › Footers

// Description:
// A light peach newsletter footer for Commonroom with the eyebrow "A note from your neighbors" and
// the headline "Good things are happening nearby." Visitors can enter an email in an
// underline-style field and submit with an arrow button; a bottom bar shows the copyright and
// policy labels.

// Design:
// - Grid md:grid-cols-[1fr_.8fr]: headline left, email form right (bottom-aligned), then a bottom
//   bar separated by a border-t
// - Palette: peach #ffccad background, dark brown #27201d text, terracotta #d99477 input underline
//   and divider; light and warm
// - Typography & shapes: uppercase bold eyebrow (tracking .14em), font-black text-4xl headline,
//   text-sm input, text-xs bottom bar; rounded-lg footer, borderless input with only a bottom rule
// - Responsive: columns stack below md; the bottom bar wraps (flex-wrap); padding p-7 → sm:p-10

// What it does:
// - The form's onSubmit only calls e.preventDefault(): nothing is sent or stored (no content props, no state)
// - Accessible form: sr-only label bound to #room-email, aria-label "Subscribe" on the arrow button
// - "Community guidelines · Safety · Contact" is plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GoodThingsNearbyPeachNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/community/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <GoodThingsNearbyPeachNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GoodThingsNearbyPeachNewsletterFooter({
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
                'rounded-lg bg-[#ffccad] p-7 text-[#27201d] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-7 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        A note from your neighbors
                    </p>
                    <h2 className="mt-3 text-4xl font-black">
                        Good things are happening nearby.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#d99477]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="room-email">
                        Email
                    </label>
                    <input
                        id="room-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[#d99477] pt-4 text-xs">
                <span>© Commonroom</span>
                <span>Community guidelines · Safety · Contact</span>
            </div>
        </footer>
    )
}

export default GoodThingsNearbyPeachNewsletterFooter

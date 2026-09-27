// NeighborhoodNoteNewsletterFooter

// Footer01 · Social Networks & Communities › Footers

// Description:
// A dark newsletter footer for Commonroom Community: under the eyebrow "Keep the good conversation
// going", the headline "The neighborhood note." promotes a monthly roundup of meetups, new groups
// and generous ideas. Visitors can type an email into an underline-style field and submit with an
// arrow button; a bottom bar carries the copyright and policy labels.

// Design:
// - Grid md:grid-cols-[1.1fr_.9fr]: headline copy left, email form right (bottom-aligned), then a
//   bottom bar separated by a border-t
// - Palette: dark brown #27201d background, off-white #fff4ec text, peach #ffccad eyebrow and arrow
//   button, white/60 body, white/40 input underline, white/45 legal text; dark theme
// - Typography & shapes: uppercase eyebrow (tracking .16em), font-black text-4xl headline with
//   leading-none, text-sm body, text-xs bottom bar; rounded-lg footer, borderless input with only a
//   bottom rule
// - Responsive: columns stack below md; the bottom bar wraps (flex-wrap); padding p-7 → sm:p-10

// What it does:
// - The form's onSubmit only calls e.preventDefault(): nothing is sent or stored (no content props, no state)
// - Accessible form: sr-only label bound to #community-email, aria-label "Join the newsletter" on
//   the arrow button
// - "Guidelines · Safety · Accessibility · Contact" is plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeighborhoodNoteNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/community/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NeighborhoodNoteNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NeighborhoodNoteNewsletterFooter({
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
                'rounded-lg bg-[#27201d] p-7 text-[#fff4ec] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffccad]">
                        Keep the good conversation going
                    </p>
                    <h2 className="mt-3 max-w-md text-4xl font-black leading-none">
                        The neighborhood note.
                    </h2>
                    <p className="mt-3 max-w-sm text-sm text-white/60">
                        A monthly roundup of meetups, new groups, and generous
                        ideas.
                    </p>
                </div>
                <form
                    className="flex items-end border-b border-white/40"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="community-email">
                        Email address
                    </label>
                    <input
                        id="community-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Join the newsletter"
                        className="px-3 py-3 text-[#ffccad]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/45">
                <span>© Commonroom Community</span>
                <span>Guidelines · Safety · Accessibility · Contact</span>
            </div>
        </footer>
    )
}

export default NeighborhoodNoteNewsletterFooter

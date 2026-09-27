// FieldNotesNewsletterFooter

// Footer01 · Booking & Reservations › Footers

// Description:
// A dark travel footer for "Elsewhere Travel". It pairs the eyebrow "A little
// farther, a little slower" and headline "Find a stay that feels like
// somewhere." with an email sign-up ("Get the field notes"), then four site
// links and the line "© Elsewhere Travel · Places, not checklists."

// Design:
// - Top row md:grid-cols-[1fr_1fr] (headline | underline-style form), then a
//   bordered link grid and a copyright line
// - Deep teal #132d3a background, white text, peach #f0aa8d eyebrow and
//   submit arrow, white/60 links, white/40 copyright, white/40 and white/15 rules
// - Serif text-4xl headline, bold uppercase text-xs eyebrow with
//   tracking-[.16em]; transparent input with a bottom rule; rounded-lg shell
// - Top row stacks below md; links go from 2 columns to sm:grid-cols-4;
//   padding p-7 → sm:p-10

// What it does:
// - No content props, no state; the form's onSubmit only calls e.preventDefault()
//   (email input id "travel-email" with an sr-only label, arrow button
//   aria-label "Subscribe")
// - Anchors: #stays, #experiences, #hosting, #help

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldNotesNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/booking/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FieldNotesNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FieldNotesNewsletterFooter({
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
                'rounded-lg bg-[#132d3a] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#f0aa8d]">
                        A little farther, a little slower
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Find a stay that feels like somewhere.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-white/40"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="travel-email">
                        Email
                    </label>
                    <input
                        id="travel-email"
                        type="email"
                        placeholder="Get the field notes"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Subscribe"
                        className="px-3 text-[#f0aa8d]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 text-xs text-white/60 sm:grid-cols-4">
                <a href="#stays">Stays</a>
                <a href="#experiences">Experiences</a>
                <a href="#hosting">Hosting</a>
                <a href="#help">Help & safety</a>
            </div>
            <p className="mt-7 text-xs text-white/40">
                © Elsewhere Travel · Places, not checklists.
            </p>
        </footer>
    )
}

export default FieldNotesNewsletterFooter

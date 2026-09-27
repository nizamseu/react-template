// ElsewhereLetterSignUpFooter

// Footer02 · Booking & Reservations › Footers

// Description:
// A light, newsletter-first footer for "Elsewhere Travel". Under "The
// Elsewhere letter" eyebrow it shows the headline "A good place to start
// dreaming." and "Local favorites and quiet places, once a month." beside an
// email field, closing with "© Elsewhere Travel · Go gently, go well."

// Design:
// - md:grid-cols-[1fr_.8fr]: text block left, underline-style email form
//   right; copyright below a top rule
// - Sage #e5ede8 background, deep teal #132d3a text, forest #346a62 eyebrow,
//   gray-600/500 secondary text, #9cb2a8 form rule, #c3d1c8 divider
// - Serif text-4xl headline, bold uppercase text-xs eyebrow with
//   tracking-[.14em]; transparent input; rounded-lg shell, no shadow
// - Columns stack below md; padding p-7 → sm:p-10

// What it does:
// - No content props, no state; the form's onSubmit only calls e.preventDefault()
//   (input id "elsewhere-email" with an sr-only label, arrow button
//   aria-label "Subscribe")
// - No navigation links are rendered

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ElsewhereLetterSignUpFooter from '@/TestComponent/SectionDesigns/Sections/booking/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ElsewhereLetterSignUpFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ElsewhereLetterSignUpFooter({
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
                'rounded-lg bg-[#e5ede8] p-7 text-[#132d3a] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#346a62]">
                        The Elsewhere letter
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        A good place to start dreaming.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Local favorites and quiet places, once a month.
                    </p>
                </div>
                <form
                    className="flex items-end border-b border-[#9cb2a8]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="elsewhere-email">
                        Email
                    </label>
                    <input
                        id="elsewhere-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <p className="mt-8 border-t border-[#c3d1c8] pt-4 text-xs text-gray-500">
                © Elsewhere Travel · Go gently, go well.
            </p>
        </footer>
    )
}

export default ElsewhereLetterSignUpFooter

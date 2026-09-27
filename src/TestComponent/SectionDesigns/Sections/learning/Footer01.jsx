// FieldnoteThreeColumnNewsletterFooter

// Footer01 · Learning Management & EdTech › Footers

// Description:
// Dark footer for Fieldnote Learning with three columns: the "fieldnote."
// wordmark and the tagline "A learning studio for curious people building what
// comes next.", a 2x2 grid of site links, and a "One good lesson in your inbox."
// email signup, above a small legal line.

// Design:
// - Grid `md:grid-cols-[1fr_1fr_1fr]` (gap-9) plus a border-t legal row
// - Dark palette: #102d36 background, white text with white/70, /60 and /45
//   tints, lime #c8ef70 submit arrow, white/35 input underline, white/15 divider
// - Serif text-3xl wordmark, sm links and label; underline-only transparent
//   email input; rounded-lg footer
// - Columns stack below md; padding p-7 -> sm:p-10

// What it does:
// - No content props, no state; the form's onSubmit only calls preventDefault (nothing
//   is sent, the input is uncontrolled); label linked via htmlFor="learn-email",
//   icon-only submit button with aria-label="Subscribe"
// - Anchors: #home, #courses, #teachers, #paths, #access; "Terms · Privacy" in
//   the legal line is plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldnoteThreeColumnNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/learning/Footer01';

// const SiteLayout = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <FieldnoteThreeColumnNewsletterFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FieldnoteThreeColumnNewsletterFooter({
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
                'rounded-lg bg-[#102d36] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-9 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="font-serif text-3xl">
                        fieldnote.
                    </a>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                        A learning studio for curious people building what comes
                        next.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                    <a href="#courses">Browse courses</a>
                    <a href="#teachers">Teach with us</a>
                    <a href="#paths">Career paths</a>
                    <a href="#access">Accessibility</a>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label
                        htmlFor="learn-email"
                        className="text-sm font-semibold"
                    >
                        One good lesson in your inbox.
                    </label>
                    <div className="mt-3 flex border-b border-white/35">
                        <input
                            id="learn-email"
                            type="email"
                            placeholder="Email address"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                        />
                        <button
                            aria-label="Subscribe"
                            className="px-3 text-[#c8ef70]"
                        >
                            <HiArrowRight />
                        </button>
                    </div>
                </form>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/45">
                © Fieldnote Learning · Terms · Privacy
            </p>
        </footer>
    )
}

export default FieldnoteThreeColumnNewsletterFooter

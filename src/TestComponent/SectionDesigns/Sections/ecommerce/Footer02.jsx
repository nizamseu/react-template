// CircularEditNewsletterFooter

// Footer02 · E-commerce & Marketplaces › Footers

// Description:
// Lime newsletter footer for "Good Circular" ("The circular edit"). The heavy headline
// "Better things move around." and the line "Wear, repair, return, repeat." sit beside an
// email signup for "the monthly material note"; a bottom bar shows "© 2026 Good Circular"
// and Instagram · Materials · Shipping · Privacy text.

// Design:
// - Two-column grid (md:grid-cols-[1fr_1fr]); the form column is flex-col justify-end so
//   the signup aligns with the bottom of the headline.
// - Lime #d6f36a background, #202315 text, #69752d input underline, #58602f placeholder and
//   helper text, #899344 divider; no dark-mode variants.
// - Sans headline text-4xl font-black uppercase (leading-[.92]); eyebrow text-xs bold
//   uppercase tracking-[.16em]; underline-only email field with an arrow button; rounded-lg
//   shell.
// - Stacks on mobile, two columns from md; bottom bar flex-wrap; padding p-7 → sm:p-10.

// What it does:
// - Email form with a labelled input (id "circular-email"); onSubmit only calls
//   e.preventDefault(), so nothing is sent or stored; the arrow button (aria-label
//   "Subscribe") submits it. No content props, no state.
// - No links: the bottom-bar items are plain text.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CircularEditNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/ecommerce/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CircularEditNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CircularEditNewsletterFooter({
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
                'rounded-lg bg-[#d6f36a] p-7 text-[#202315] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em]">
                        The circular edit
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black uppercase leading-[.92]">
                        Better things
                        <br />
                        move around.
                    </h2>
                    <p className="mt-4 text-sm">
                        Wear, repair, return, repeat.
                    </p>
                </div>
                <form
                    className="flex flex-col justify-end gap-3"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label
                        htmlFor="circular-email"
                        className="text-sm font-semibold"
                    >
                        Get the monthly material note.
                    </label>
                    <div className="flex border-b border-[#69752d]">
                        <input
                            id="circular-email"
                            type="email"
                            placeholder="Your email address"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#58602f]"
                        />
                        <button aria-label="Subscribe" className="px-3">
                            <HiArrowRight />
                        </button>
                    </div>
                    <span className="text-xs text-[#58602f]">
                        No noise. Unsubscribe whenever.
                    </span>
                </form>
            </div>
            <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#899344] pt-4 text-xs">
                <span>© 2026 Good Circular</span>
                <span>Instagram · Materials · Shipping · Privacy</span>
            </div>
        </footer>
    )
}

export default CircularEditNewsletterFooter
